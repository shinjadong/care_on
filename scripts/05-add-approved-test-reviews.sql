-- 승인된 테스트 후기 데이터 추가
INSERT INTO reviews (
  category, 
  business, 
  content, 
  author_name, 
  author_email, 
  rating, 
  period, 
  highlight, 
  is_approved,
  created_at
) VALUES 
(
  '인터넷',
  'KT 기가인터넷',
  '설치 기사님이 정말 친절하시고 전문적이셨어요. 인터넷 속도도 약속한 대로 나오고 있고, 가격도 합리적입니다. 특히 고객센터 응대가 빨라서 만족스럽습니다.',
  '김민수',
  'minsu.kim@example.com',
  5,
  '6개월',
  '친절한 설치 서비스',
  true,
  NOW() - INTERVAL '2 days'
),
(
  'CCTV',
  '하이크비전 CCTV',
  '집 보안을 위해 설치했는데 화질이 정말 선명하고 야간에도 잘 보입니다. 스마트폰으로 실시간 확인도 가능해서 외출할 때 안심이 됩니다. 설치비용도 생각보다 저렴했어요.',
  '박영희',
  'younghee.park@example.com',
  4,
  '3개월',
  '선명한 화질과 야간 촬영',
  true,
  NOW() - INTERVAL '1 day'
),
(
  '인터넷',
  'LG U+ 광인터넷',
  '이전에 사용하던 인터넷보다 훨씬 빠르고 안정적입니다. 온라인 게임할 때 렉도 없고, 영상 스트리밍도 끊김 없이 잘 됩니다. 가성비 최고!',
  '이준호',
  'junho.lee@example.com',
  5,
  '1년',
  '안정적인 속도',
  true,
  NOW() - INTERVAL '3 hours'
),
(
  'CCTV',
  '다화 CCTV 시스템',
  '사무실에 설치했는데 직원들도 만족하고 있습니다. 녹화 기능도 좋고 원격 모니터링이 편리해요. A/S도 빠르게 받을 수 있어서 좋습니다.',
  '최수진',
  'sujin.choi@example.com',
  4,
  '8개월',
  '편리한 원격 모니터링',
  true,
  NOW() - INTERVAL '5 hours'
),
(
  '인터넷',
  'SK 브로드밴드',
  '설치 과정이 매우 간단했고, 인터넷 속도도 만족스럽습니다. 고객 서비스팀이 문의사항에 대해 신속하게 답변해주셔서 좋았어요.',
  '정민아',
  'mina.jung@example.com',
  4,
  '4개월',
  '신속한 고객 서비스',
  true,
  NOW() - INTERVAL '12 hours'
);

-- 미승인 후기들을 승인 상태로 변경 (선택적으로 실행)
-- UPDATE reviews SET is_approved = true WHERE is_approved = false;
