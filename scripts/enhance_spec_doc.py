#!/usr/bin/env python3
"""
care_on 핵심 도메인 모듈 구현 명세서 고급 포맷팅 스크립트
- 목차 자동 생성
- 섹션 구분자 추가
- 코드 블록 언어 명시
- 테이블 포맷팅
- 강조 표현 개선
"""
import re
import sys
from typing import List, Tuple


def extract_headings(content: str) -> List[Tuple[int, str]]:
    """헤딩 추출 (레벨, 제목)"""
    headings = []
    lines = content.split('\n')
    in_code = False

    for line in lines:
        if line.strip().startswith('```'):
            in_code = not in_code
            continue

        if in_code:
            continue

        match = re.match(r'^(#{1,6})\s+(.+)$', line)
        if match:
            level = len(match.group(1))
            title = match.group(2).strip()
            headings.append((level, title))

    return headings


def generate_toc(headings: List[Tuple[int, str]]) -> str:
    """목차 생성"""
    toc_lines = ["# 📑 목차\n"]

    for level, title in headings:
        if level == 1:  # h1은 제외
            continue

        indent = "  " * (level - 2)
        # 링크 생성 (GitHub 스타일)
        link = title.lower()
        link = re.sub(r'[^\w\s가-힣-]', '', link)
        link = re.sub(r'\s+', '-', link)

        toc_lines.append(f"{indent}- [{title}](#{link})")

    toc_lines.append("")
    return '\n'.join(toc_lines)


def enhance_code_blocks(content: str) -> str:
    """코드 블록에 언어 명시 추가"""
    lines = content.split('\n')
    result = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # 언어 명시 없는 코드 블록 찾기
        if line.strip() == '```' and i + 1 < len(lines):
            next_line = lines[i + 1].strip()

            # 다음 줄로 언어 추론
            lang = ''
            if next_line.startswith('model ') or 'String' in next_line or '@id' in next_line:
                lang = 'prisma'
            elif next_line.startswith('{') or next_line.startswith('['):
                lang = 'json'
            elif next_line.startswith('import ') or next_line.startswith('export ') or 'const ' in next_line:
                lang = 'typescript'
            elif next_line.startswith('/app/') or next_line.startswith('/components/'):
                lang = 'plaintext'
            elif next_line.startswith('GET ') or next_line.startswith('POST '):
                lang = 'http'
            elif 'npm ' in next_line or 'npx ' in next_line:
                lang = 'bash'

            if lang:
                result.append(f'```{lang}')
            else:
                result.append(line)
        else:
            result.append(line)

        i += 1

    return '\n'.join(result)


def add_section_dividers(content: str) -> str:
    """주요 섹션 사이에 구분선 추가"""
    lines = content.split('\n')
    result = []

    for i, line in enumerate(lines):
        # h2 헤딩 앞에 구분선 (첫 번째 제외)
        if re.match(r'^##\s+\d+\.', line):
            if result and result[-1] != '':
                result.append('')
            result.append('---')
            result.append('')

        result.append(line)

    return '\n'.join(result)


def improve_emphasis(content: str) -> str:
    """강조 표현 개선"""
    # 중요 키워드 볼드 처리
    keywords = [
        'IMPORTANT', '중요', '주의', 'NOTE', '참고',
        'tRPC', 'Prisma', 'Supabase', 'Next.js',
        'Clean Architecture', '클린 아키텍처'
    ]

    for keyword in keywords:
        # 이미 볼드가 아닌 경우만
        pattern = r'(?<!\*)\b' + re.escape(keyword) + r'\b(?!\*)'
        content = re.sub(pattern, f'**{keyword}**', content, flags=re.IGNORECASE)

    # 파일 경로 코드 강조
    content = re.sub(r'(/[\w/-]+\.[\w]+)', r'`\1`', content)

    return content


def format_lists(content: str) -> str:
    """리스트 포맷팅 개선"""
    lines = content.split('\n')
    result = []
    in_list = False

    for line in lines:
        stripped = line.strip()

        # 리스트 항목
        if re.match(r'^[-*+]\s+', stripped) or re.match(r'^\d+\.\s+', stripped):
            if not in_list and result and result[-1] != '':
                result.append('')
            in_list = True
            result.append(stripped)
        else:
            if in_list and stripped and not stripped.startswith('#'):
                # 리스트 끝
                in_list = False
                if result[-1] != '':
                    result.append('')
            result.append(line)

    return '\n'.join(result)


def main():
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'docs/care_on 핵심 도메인 모듈 구현 명세서_formatted.md'
    output_file = sys.argv[2] if len(sys.argv) > 2 else input_file.replace('_formatted', '_enhanced')

    print(f"📖 Reading: {input_file}")

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"🔧 Enhancing document...")

    # 1. 헤딩 추출
    headings = extract_headings(content)
    print(f"   Found {len(headings)} headings")

    # 2. 목차 생성 및 삽입
    toc = generate_toc(headings)
    # 첫 번째 h1 뒤에 목차 삽입
    parts = content.split('\n', 3)
    if len(parts) >= 3:
        content = parts[0] + '\n\n' + parts[1] + '\n\n' + toc + '\n\n' + '\n'.join(parts[2:])

    # 3. 코드 블록 개선
    content = enhance_code_blocks(content)

    # 4. 섹션 구분선
    content = add_section_dividers(content)

    # 5. 강조 표현
    content = improve_emphasis(content)

    # 6. 리스트 포맷팅
    content = format_lists(content)

    # 7. 최종 정리
    content = re.sub(r'\n{4,}', '\n\n\n', content)
    content = content.rstrip() + '\n'

    print(f"💾 Writing: {output_file}")

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"\n✅ Enhancement complete!")
    print(f"   Output: {output_file}")


if __name__ == '__main__':
    main()
