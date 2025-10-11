#!/usr/bin/env python3
"""
care_on 핵심 도메인 모듈 구현 명세서 포맷팅 스크립트
- 헤딩 계층 구조화
- 코드 블록 정리
- 리스트 포맷팅
- 불필요한 공백 제거
"""
import re
import sys

def format_markdown(content: str) -> str:
    """마크다운 문서 포맷팅"""
    lines = content.split('\n')
    formatted_lines = []
    in_code_block = False
    prev_line_type = None

    for i, line in enumerate(lines):
        stripped = line.strip()

        # 코드 블록 감지
        if stripped.startswith('```'):
            in_code_block = not in_code_block
            formatted_lines.append(line)
            prev_line_type = 'code_fence'
            continue

        # 코드 블록 내부는 그대로 유지
        if in_code_block:
            formatted_lines.append(line)
            continue

        # 빈 줄 처리 (최대 2개 연속 빈 줄로 제한)
        if not stripped:
            if prev_line_type != 'empty':
                formatted_lines.append('')
                prev_line_type = 'empty'
            continue

        # 헤딩 처리
        if stripped.startswith('#'):
            # 헤딩 앞에 빈 줄 추가 (문서 시작 제외)
            if formatted_lines and formatted_lines[-1] != '':
                formatted_lines.append('')

            # 헤딩 레벨 정규화
            heading_match = re.match(r'^(#{1,6})\s*(.+)$', stripped)
            if heading_match:
                level, title = heading_match.groups()
                # 숫자로 시작하는 헤딩 (1. 2. 3.) 처리
                title_cleaned = title.strip()
                formatted_lines.append(f"{level} {title_cleaned}")
                prev_line_type = 'heading'
                # 헤딩 뒤에 빈 줄 추가
                formatted_lines.append('')
            continue

        # 리스트 항목 처리
        if re.match(r'^[-*+]\s+', stripped) or re.match(r'^\d+\.\s+', stripped):
            # 리스트 시작 전 빈 줄 확인
            if prev_line_type not in ['list', 'empty', 'heading']:
                if formatted_lines and formatted_lines[-1] != '':
                    formatted_lines.append('')

            formatted_lines.append(stripped)
            prev_line_type = 'list'
            continue

        # 일반 텍스트
        # 긴 줄 처리 (한글 문장은 적절한 위치에서 개행)
        if len(stripped) > 120:
            # 문장 단위로 분리 (한글 마침표 기준)
            sentences = re.split(r'([.!?。]\s+)', stripped)
            current_line = ''
            for j, sentence in enumerate(sentences):
                if len(current_line) + len(sentence) <= 120:
                    current_line += sentence
                else:
                    if current_line:
                        formatted_lines.append(current_line.strip())
                    current_line = sentence
            if current_line:
                formatted_lines.append(current_line.strip())
        else:
            formatted_lines.append(stripped)

        prev_line_type = 'text'

    # 최종 결과 조합
    result = '\n'.join(formatted_lines)

    # 추가 정리
    # 1. 3개 이상 연속 빈 줄을 2개로 축소
    result = re.sub(r'\n{3,}', '\n\n', result)

    # 2. 코드 블록 전후 빈 줄 보장
    result = re.sub(r'([^\n])\n```', r'\1\n\n```', result)
    result = re.sub(r'```\n([^\n])', r'```\n\n\1', result)

    # 3. 헤딩 전 빈 줄 보장 (문서 시작 제외)
    result = re.sub(r'([^\n])\n(#{1,6}\s)', r'\1\n\n\2', result)

    # 4. 파일 끝 정리
    result = result.rstrip() + '\n'

    return result


def fix_headings(content: str) -> str:
    """헤딩 구조 개선 - 숫자 헤딩을 명확히"""
    lines = content.split('\n')
    formatted = []

    for line in lines:
        # "1. Title" 형태를 "## 1. Title"로 변환
        match = re.match(r'^(\d+)\.\s+(.+)$', line.strip())
        if match and not line.startswith('#'):
            num, title = match.groups()
            # 최상위 도메인 (숫자만)은 h2
            formatted.append(f"## {num}. {title}")
        else:
            formatted.append(line)

    return '\n'.join(formatted)


def main():
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'docs/care_on 핵심 도메인 모듈 구현 명세서.md'
    output_file = sys.argv[2] if len(sys.argv) > 2 else input_file

    print(f"📖 Reading: {input_file}")

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"🔧 Formatting markdown...")

    # 1단계: 헤딩 구조 수정
    content = fix_headings(content)

    # 2단계: 전체 포맷팅
    formatted_content = format_markdown(content)

    print(f"💾 Writing: {output_file}")

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(formatted_content)

    # 통계
    orig_lines = content.count('\n')
    new_lines = formatted_content.count('\n')

    print(f"\n✅ Complete!")
    print(f"   Original lines: {orig_lines}")
    print(f"   Formatted lines: {new_lines}")
    print(f"   Difference: {new_lines - orig_lines:+d}")


if __name__ == '__main__':
    main()
