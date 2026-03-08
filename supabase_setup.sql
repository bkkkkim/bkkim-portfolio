-- 1. 테이블 생성 (Tables Setup)
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

-- 2. 스토리지 버킷 설정 (Storage Bucket Setup)
-- 'images' 버킷을 생성하고 public으로 설정합니다.
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. 스토리지 보안 정책 (Storage RLS Policies)
-- storage.objects 테이블에 대한 RLS를 활성화합니다.
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 기존 정책이 있다면 삭제하여 충돌을 방지합니다.
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public select" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;

-- 'images' 버킷에 대해 누구나(public) 조회, 업로드, 수정, 삭제가 가능하도록 설정합니다.
CREATE POLICY "Public Access"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- 4. 초기 데이터 (Optional Seed Data)
-- site_config 초기값
INSERT INTO public.site_config (key, value) VALUES 
('hero_title', 'Forward from the Basics'),
('hero_subtitle', 'Good design is as little as possible.'),
('hero_description', 'Building experiences by stacking layers of expertise on a solid foundation of basics.'),
('logo_text', 'Basics.'),
('contact_email', 'qhrud4611@gmail.com')
ON CONFLICT (key) DO NOTHING;

-- about 초기값
INSERT INTO public.about (id, content, skills, experience) VALUES 
(1, 'I am a UX Service Planner focused on fundamental values.', '["UX Planning", "Service Design", "Data Analysis", "Prototyping"]', '[{"role": "UX Planner", "company": "Company A", "period": "2022 - Present", "description": "Led service planning for..."}]')
ON CONFLICT (id) DO NOTHING;
