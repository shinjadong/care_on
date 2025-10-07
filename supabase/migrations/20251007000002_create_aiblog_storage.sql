-- AI 블로그 이미지 저장을 위한 Storage Bucket 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'aiblog',
  'aiblog',
  true,  -- 공개 접근 가능
  31457280,  -- 30MB 제한
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage 정책: 인증된 사용자는 업로드 가능
CREATE POLICY "Authenticated users can upload aiblog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'aiblog');

-- Storage 정책: 모든 사용자는 이미지 읽기 가능 (공개 버킷)
CREATE POLICY "Anyone can view aiblog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'aiblog');

-- Storage 정책: 업로드한 사용자는 자신의 이미지 삭제 가능
CREATE POLICY "Users can delete their own aiblog images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'aiblog' AND auth.uid()::text = (storage.foldername(name))[1]);
