-- 1. 테이블 구조 생성 (Tables Setup)

-- inquiries (문의하기): 문의 내용, 작성자, 작성일
CREATE TABLE IF NOT EXISTS public.inquiries (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL, -- 문의 내용
  author TEXT NOT NULL,  -- 작성자 (이름/이메일)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- work (프로젝트): 프로젝트 제목, 기타 정보
CREATE TABLE IF NOT EXISTS public.work (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL, -- 프로젝트 제목
  description TEXT,    -- 프로젝트 설명
  content TEXT,        -- 프로젝트 상세 내용 (Rich Text)
  category TEXT,       -- 카테고리
  image_url TEXT,      -- 썸네일/커버 이미지 URL
  link TEXT,           -- 프로젝트 링크
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- contents (컨텐츠): 로고, 홈페이지 구성 이미지, 프로젝트 정보 등
-- key-value 형태로 관리하여 유연하게 확장 가능
CREATE TABLE IF NOT EXISTS public.contents (
  key TEXT PRIMARY KEY, -- 예: 'logo_url', 'hero_title', 'hero_image'
  value TEXT,           -- 값 (URL 또는 텍스트)
  category TEXT,        -- 예: 'common', 'home', 'about'
  description TEXT      -- 설명 (관리자용)
);

-- 2. 스토리지 버킷 설정 (Storage Bucket Setup)
-- 'images' 버킷 생성 (이미 존재하면 무시)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. 스토리지 정책 (Storage Policies)
-- 오류(42501) 방지를 위해 기존 정책 삭제 구문은 제거하고, 
-- 필요한 정책이 없을 때만 생성하도록 합니다.
-- 만약 이 부분에서도 오류가 발생하면 Supabase 대시보드 -> Storage -> Policies 에서 직접 설정해주세요.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Public Access Policy'
  ) THEN
    CREATE POLICY "Public Access Policy"
    ON storage.objects
    FOR ALL
    TO public
    USING (bucket_id = 'images')
    WITH CHECK (bucket_id = 'images');
  END IF;
END
$$;

-- 4. 초기 데이터 (Initial Data)
-- contents 초기값 설정
INSERT INTO public.contents (key, value, category, description) VALUES 
('logo_url', '', 'common', '사이트 로고 이미지 URL'),
('logo_text', 'Basics.', 'common', '로고 텍스트 (이미지 없을 시)'),
('hero_title', 'Forward from the Basics', 'home', '메인 히어로 타이틀'),
('hero_subtitle', 'Good design is as little as possible.', 'home', '메인 히어로 서브타이틀'),
('contact_email', 'qhrud4611@gmail.com', 'common', '문의 수신 이메일')
ON CONFLICT (key) DO NOTHING;
