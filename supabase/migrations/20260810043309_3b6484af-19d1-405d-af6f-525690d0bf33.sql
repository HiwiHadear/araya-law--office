CREATE TYPE public.app_role AS ENUM ('super_admin','managing_partner','lawyer','paralegal','secretary','client');
CREATE TYPE public.case_status AS ENUM ('intake','active','on_hold','closed');
CREATE TYPE public.appointment_status AS ENUM ('pending','confirmed','completed','cancelled');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  preferred_language text DEFAULT 'English',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin','managing_partner','lawyer','paralegal','secretary')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_manager(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('super_admin','managing_partner')
  );
$$;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_manager(auth.uid()))
  WITH CHECK (id = auth.uid() OR public.is_manager(auth.uid()));

CREATE POLICY "user_roles_select" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "user_roles_manage_insert" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.is_manager(auth.uid()));
CREATE POLICY "user_roles_manage_delete" ON public.user_roles FOR DELETE TO authenticated
  USING (public.is_manager(auth.uid()));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  role_count int;
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.email,
    NEW.raw_user_meta_data ->> 'phone'
  )
  ON CONFLICT (id) DO NOTHING;

  SELECT count(*) INTO role_count FROM public.user_roles;
  IF role_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  practice_area text,
  status public.case_status NOT NULL DEFAULT 'intake',
  court text,
  client_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  lead_lawyer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  opened_at date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cases TO authenticated;
GRANT ALL ON public.cases TO service_role;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_view_case(_case_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_staff(_user_id)
     OR EXISTS (SELECT 1 FROM public.cases WHERE id = _case_id AND client_id = _user_id);
$$;

CREATE POLICY "cases_select" ON public.cases FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR client_id = auth.uid());
CREATE POLICY "cases_insert" ON public.cases FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "cases_update" ON public.cases FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "cases_delete" ON public.cases FOR DELETE TO authenticated
  USING (public.is_manager(auth.uid()));

CREATE TRIGGER cases_updated_at BEFORE UPDATE ON public.cases
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.case_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  note text NOT NULL,
  visible_to_client boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_updates TO authenticated;
GRANT ALL ON public.case_updates TO service_role;
ALTER TABLE public.case_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "case_updates_select" ON public.case_updates FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR (visible_to_client AND public.can_view_case(case_id, auth.uid())));
CREATE POLICY "case_updates_insert" ON public.case_updates FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "case_updates_update" ON public.case_updates FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "case_updates_delete" ON public.case_updates FOR DELETE TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE TABLE public.hearings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE,
  title text NOT NULL,
  court text,
  location text,
  scheduled_at timestamptz NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hearings TO authenticated;
GRANT ALL ON public.hearings TO service_role;
ALTER TABLE public.hearings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hearings_select" ON public.hearings FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR public.can_view_case(case_id, auth.uid()));
CREATE POLICY "hearings_insert" ON public.hearings FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "hearings_update" ON public.hearings FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "hearings_delete" ON public.hearings FOR DELETE TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  size_bytes bigint,
  visible_to_client boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents_select" ON public.documents FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR (visible_to_client AND public.can_view_case(case_id, auth.uid())));
CREATE POLICY "documents_insert" ON public.documents FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "documents_update" ON public.documents FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "documents_delete" ON public.documents FOR DELETE TO authenticated
  USING (public.is_staff(auth.uid()));

CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  consultation_type text,
  practice_area text,
  preferred_lawyer text,
  preferred_date date,
  preferred_time text,
  language text,
  message text,
  status public.appointment_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT INSERT ON public.appointments TO anon;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "appointments_insert_anyone" ON public.appointments FOR INSERT TO anon, authenticated
  WITH CHECK (client_id IS NULL OR client_id = auth.uid());
CREATE POLICY "appointments_select" ON public.appointments FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR client_id = auth.uid());
CREATE POLICY "appointments_update" ON public.appointments FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "appointments_delete" ON public.appointments FOR DELETE TO authenticated
  USING (public.is_manager(auth.uid()));

CREATE POLICY "case_docs_read" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'case-documents' AND (
      public.is_staff(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.documents d
        WHERE d.storage_path = storage.objects.name
          AND d.visible_to_client
          AND public.can_view_case(d.case_id, auth.uid())
      )
    )
  );

CREATE POLICY "case_docs_write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'case-documents' AND public.is_staff(auth.uid()));

CREATE POLICY "case_docs_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'case-documents' AND public.is_staff(auth.uid()));