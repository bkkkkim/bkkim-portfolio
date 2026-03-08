-- Enable RLS (Optional, but good practice)
-- ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;

-- Create tables
CREATE TABLE IF NOT EXISTS public.site_config (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS public.works (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT,
  "imageUrl" TEXT,
  link TEXT,
  "displayOrder" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.messages (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  message TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.about (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  content TEXT,
  skills TEXT,
  experience TEXT
);

-- Storage Setup (Images bucket)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Allow public access for demo purposes)
-- Note: In production, you might want to restrict uploads to authenticated users.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow public uploads'
  ) THEN
    CREATE POLICY "Allow public uploads"
    ON storage.objects
    FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'images');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow public select'
  ) THEN
    CREATE POLICY "Allow public select"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'images');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow public update'
  ) THEN
    CREATE POLICY "Allow public update"
    ON storage.objects
    FOR UPDATE
    TO public
    USING (bucket_id = 'images');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow public delete'
  ) THEN
    CREATE POLICY "Allow public delete"
    ON storage.objects
    FOR DELETE
    TO public
    USING (bucket_id = 'images');
  END IF;
END
$$;
