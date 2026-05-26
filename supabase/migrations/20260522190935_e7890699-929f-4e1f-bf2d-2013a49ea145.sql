
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

-- Replace bucket-wide list policy with object-only read (no listing)
DROP POLICY "Public read project media" ON storage.objects;
CREATE POLICY "Public read project media objects" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-media');
-- Mark bucket as non-listable at the bucket level
UPDATE storage.buckets SET public = true WHERE id = 'project-media';
