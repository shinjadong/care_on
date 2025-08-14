-- 현재 미승인 상태인 모든 후기를 승인 상태로 변경
UPDATE reviews 
SET is_approved = true, updated_at = NOW()
WHERE is_approved = false;

-- 승인된 후기 수 확인
SELECT 
  category,
  COUNT(*) as approved_count
FROM reviews 
WHERE is_approved = true 
GROUP BY category
ORDER BY category;
