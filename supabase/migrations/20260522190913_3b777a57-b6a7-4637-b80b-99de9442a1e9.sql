
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Media type enum
CREATE TYPE public.media_type AS ENUM ('gif', 'mp4', 'image');

-- Projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  media_url text,
  media_type public.media_type NOT NULL DEFAULT 'image',
  poster_url text,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone" ON public.projects
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update projects" ON public.projects
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete projects" ON public.projects
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER projects_touch_updated BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Project links
CREATE TYPE public.link_kind AS ENUM ('demo', 'writeup', 'repo', 'other');

CREATE TABLE public.project_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  label text NOT NULL,
  url text NOT NULL,
  kind public.link_kind NOT NULL DEFAULT 'other',
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.project_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project links viewable by everyone" ON public.project_links
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert project links" ON public.project_links
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update project links" ON public.project_links
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete project links" ON public.project_links
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX project_links_project_id_idx ON public.project_links(project_id);
CREATE INDEX projects_order_idx ON public.projects(order_index);

-- Storage bucket for project media
INSERT INTO storage.buckets (id, name, public) VALUES ('project-media', 'project-media', true);

CREATE POLICY "Public read project media" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-media');
CREATE POLICY "Admins upload project media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update project media" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'project-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete project media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'project-media' AND public.has_role(auth.uid(), 'admin'));
