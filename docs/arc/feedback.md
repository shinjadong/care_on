Heading 1 <Alt+Ctrl+1>Heading 2 <Alt+Ctrl+2>Heading 3 <Alt+Ctrl+3>Heading 4 <Alt+Ctrl+4>Heading 5 <Alt+Ctrl+5>Heading 6 <Alt+Ctrl+6>

# Puck 페이지 에디터 기능 개선 지시서

## 1. 사이드바 컴포넌트 커스터마이징 기능 추가

**요구사항:** Puck 에디터 좌측 사이드바에서 블록 이름을 사용자가 이해하기 쉽게 변경하고, 표시 순서를 조정할 수 있어야 합니다. 현재는 컴포넌트 키(key) 이름이 그대로 표시되고 기본 정렬로 나열되는데, 이를 개선합니다.

**구현 방법:**

* Puck Editor의 컴포넌트 설정에서 각 컴포넌트에 표시 이름(label)을 지정하는 필드를 추가합니다. Puck 컴포넌트 config에는 `label` 속성을 지원하므로 이를 활용하면 사이드바에 원하는 이름을 보여줄 수 있습니다 (설정하지 않으면 기본적으로 컴포넌트의 key가 사용됨)[puckeditor.com](https://puckeditor.com/docs/api-reference/configuration/component-config#:~:text=). 예를 들어 “Hero” 컴포넌트에 `label: '히어로 영역'`으로 설정하면 사이드바에 **히어로 영역**으로 표시됩니다.
* 사이드바에 나타나는 컴포넌트 목록의 순서는 Puck config에 등록된 순서대로가 되도록 조정합니다. Puck의 `categories` API를 사용하면 컴포넌트를 그룹화하며 순서를 제어할 수 있습니다[puckeditor.com](https://puckeditor.com/docs/integrating-puck/categories#:~:text=const%20config%20%3D%20,%2F%2F%20...). 모든 컴포넌트를 하나의 카테고리에 넣고 원하는 순서대로 나열하거나, 별도의 카테고리를 사용하지 않을 경우 config 객체에 정의된 **순서**를 유지하여 출력하도록 합니다. (현행 JS 객체도 정의 순서를 유지하므로, config 작성 시 순서를 의도대로 정리하면 반영될 수 있습니다.)
* 구현 시 컴포넌트 config 구조를 다음과 같이 변경/확인합니다:

  <pre class="overflow-visible!" data-start="829" data-end="1041"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-ts"><span><span>components</span><span>: {
    </span><span>Hero</span><span>: { </span><span>label</span><span>: </span><span>'히어로 영역'</span><span>, </span><span>/* ... 나머지 설정 */</span><span> },
    </span><span>Heading</span><span>: { </span><span>label</span><span>: </span><span>'타이틀 텍스트'</span><span>, </span><span>/* ... */</span><span> },
    </span><span>Text</span><span>: { </span><span>label</span><span>: </span><span>'단락 텍스트'</span><span>, </span><span>/* ... */</span><span> },
    </span><span>// ...</span><span>
  },
  </span><span>// (필요에 따라 categories 설정 추가)</span><span>
  </span></span></code></div></div></pre>

  위처럼 `components` 객체에 각 컴포넌트의 label을 지정하고, 해당 객체의 선언 순서대로 사이드바 목록을 렌더링하도록 Puck 설정을 조정합니다.

## 2. 텍스트 스타일 편집 UI 개선

**요구사항:** 텍스트 블록 편집 시 \*\*폰트 크기(px)\*\*를 현재는 수동으로 입력하고 있으나, 이를 슬라이더 또는 드롭다운으로 직관적으로 조절할 수 있어야 합니다. 또한 **텍스트 색상** 선택은 컬러 피커(UI 팔레트)를 통해 시각적으로 고를 수 있도록 개선해야 합니다.

**구현 방법:**

* **폰트 크기 조절:** `@radix-ui/react-slider` 또는 shadcn/ui의 Slider 컴포넌트를 활용하여 폰트 크기를 조절하는 UI를 제공합니다. 슬라이더의 범위는 예를 들어 12px부터 60px까지로 설정하고, step은 1px로 하여 세밀하게 조절할 수 있게 합니다. shadcn/ui Slider 사용 예시:

  <pre class="overflow-visible!" data-start="1520" data-end="1608"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-tsx"><span><span><</span><span>Slider</span><span> defaultValue={[</span><span>16</span><span>]} max={</span><span>60</span><span>} min={</span><span>12</span><span>} step={</span><span>1</span><span>} </span><span>/* ...props */</span><span> />
  </span></span></code></div></div></pre>

  (위 예시는 기본값 16, 최소 12, 최대 60인 슬라이더를 생성하는 코드로, 슬라이더를 이용해 해당 범위의 값을 선택합니다[ui.shadcn.com](https://ui.shadcn.com/docs/components/slider#:~:text=return%20%28%20,60%25%5D%22%2C%20className%29%7D%20%7B...props%7D%20%2F%3E).) 슬라이더를 움직이면 폰트 크기 값이 실시간으로 변경되어 `block.settings.fontSize`에 반영되고, 에디터 미리보기에도 즉각 적용됩니다.
* **텍스트 색상 선택:** 컬러 피커 라이브러리를 도입하여 사용자가 팔레트에서 텍스트 색상을 선택할 수 있게 합니다. 예를 들어 `react-color` 라이브러리의 SketchPicker 등을 사용할 수 있습니다. SketchPicker를 사용할 경우, 현재 색상을 state로 관리하고 `onChangeComplete` 이벤트에서 선택된 색상 값을 `block.settings.color`에 업데이트하도록 구현합니다. 사용 예시:

  <pre class="overflow-visible!" data-start="2056" data-end="2307"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-jsx"><span><span>import</span><span> { </span><span>SketchPicker</span><span> } </span><span>from</span><span> </span><span>'react-color'</span><span>;
  </span><span>// ...</span><span>
  </span><span>const</span><span> [color, setColor] = </span><span>useState</span><span>(</span><span>'#000000'</span><span>);
  </span><span>return</span><span> (
    </span><span><span class="language-xml"><SketchPicker</span></span><span> 
      </span><span>color</span><span>=</span><span>{color}</span><span> 
      </span><span>onChangeComplete</span><span>=</span><span>{(updatedColor)</span><span> => setColor(updatedColor.hex)} 
    />
  );
  </span></span></code></div></div></pre>

  (예시는 SketchPicker 컴포넌트를 통해 색상을 고르고 state에 hex 값을 저장하는 코드입니다[github.com](https://github.com/uiwjs/react-color#:~:text=function%20Demo%28%29%20,%7B%20setHex%28color.hex%29%3B).) shadcn/ui에는 기본 컬러 피커 컴포넌트가 없으므로, react-color와 같은 경량 라이브러리를 활용하거나 Color Picker를 자체 구현할 수 있습니다. 선택한 색상(hex 코드)은 `block.settings.color`에 저장하고, 해당 블록의 스타일에 즉시 적용되도록 합니다 (예: 인라인 스타일 `color: <선택색>` 혹은 Tailwind의 text-color 유틸리티 클래스 적용).
* **실시간 적용:** 폰트 크기 슬라이더와 색상 피커 모두 onChange 시점에 즉시 해당 스타일이 미리보기 텍스트에 적용되도록 하여, 사용자가 변화를 바로 확인할 수 있게 합니다. (Puck 에디터의 필드 값 변경은 자동으로 미리보기 컴포넌트에 전파되므로, 특별한 추가 저장 없이도 `block.settings` 바뀌면 반영될 것입니다.)

## 3. HTML 코드 블록 삽입 기능 복원

**요구사항:** 기존 클래식 에디터에서 제공되던 **HTML 블록** 기능을 Puck 기반 페이지 에디터에서도 사용할 수 있도록 복원해야 합니다. 사용자는 임의의 HTML 코드를 삽입하여 렌더링할 수 있어야 합니다.

**구현 방법:**

* **새 HTML 블록 타입 추가:** Puck의 `config.components`에 새로운 HTML 전용 블록을 추가합니다. 예를 들어 `RawHTMLBlock` 또는 `HtmlBlock` 등의 key로 컴포넌트를 등록합니다. 이 컴포넌트는 사용자가 임의의 HTML 코드를 입력할 수 있는 필드를 가져야 합니다. 구현 단계:
  * `fields` 설정에 HTML 코드를 입력받는 폼 필드를 추가합니다. 타입은 멀티라인 텍스트 입력이 가능하도록 `"textarea"`로 지정하고 라벨은 "HTML"로 표기합니다[stackoverflow.com](https://stackoverflow.com/questions/79691072/how-to-overrides-the-components-present-in-puck-editor-and-insert-a-new-one-from#:~:text=RawHTMLBlock%3A%20,HTML). 이렇게 하면 해당 블록을 사이드바에서 선택 시 HTML 코드를 편집할 수 있는 입력창이 제공됩니다.
  * 컴포넌트의 `render` 함수에서는 입력된 HTML 문자열을 실제 DOM에 주입하여 렌더링합니다. React에서는 보안상 일반적으로 JSX로 파싱되지 않은 HTML을 넣을 수 없으므로, `dangerouslySetInnerHTML` 속성을 사용해야 합니다[stackoverflow.com](https://stackoverflow.com/questions/79691072/how-to-overrides-the-components-present-in-puck-editor-and-insert-a-new-one-from#:~:text=export%20default%20function%20HTMLrender%28,). 예를 들어:

    <pre class="overflow-visible!" data-start="3577" data-end="3669"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-jsx"><span><span>render</span><span>: </span><span>({ html }</span><span>) => </span><span><span class="language-xml"><div</span></span><span> </span><span>dangerouslySetInnerHTML</span><span>=</span><span>{{</span><span> </span><span>__html:</span><span> </span><span>html</span><span> }} />
    </span></span></code></div></div></pre>

    로 구현하면 사용자가 입력한 HTML이 해당 div 내부에 실제 요소로 렌더됩니다.
* **에디터 UI 처리:** 새 HTML 블록을 추가한 후, 사용자가 에디터 사이드바에서 해당 블록을 선택하면 내용 입력을 위한 `<textarea>` 영역이 나타나도록 합니다. 사용자가 여기에 임베드 코드, iframe, 버튼 등의 HTML을 작성한 뒤 블록을 추가하면, 미리보기 영역에 해당 HTML이 그대로 표시됩니다. 이때 블록을 선택하지 않은 상태에서는 미리보기 화면에 일반 컴포넌트처럼 보이고, 편집 상태에서만 코드 편집기가 보이도록 UI를 구성합니다.
* **보안 고려:** `dangerouslySetInnerHTML`을 사용하는 경우 잠재적인 XSS 이슈가 있으므로, 삽입 전에 신뢰할 수 없는 스크립트나 태그를 제거하는 처리가 필요합니다. 서버 사이드에서 처리하거나, 빠른 구현을 위해 클라이언트 사이드에서 `sanitize-html` 같은 라이브러리를 사용할 수 있습니다. 예를 들어 `sanitizeHtml(dirtyHtmlString, options)` 형태로 허용된 태그만 남기도록 필터링할 수 있습니다[npmjs.com](https://www.npmjs.com/package/sanitize-html#:~:text=Use%20it%20in%20your%20JavaScript,app). 프로토타입 단계에서는 우선 동작에 초점을 맞추되, 추후 배포 전에는 반드시 안전한 리스트(allow-list) 기반으로 허용할 태그를 제한하고 스크립트 제거 등의 조치를 진행하세요.

## 4. 버튼 블록 정렬 및 여백 설정 기능 추가

**요구사항:** **버튼 블록**에 대해 내용 정렬(왼쪽/가운데/오른쪽)과 **padding/margin 여백 조절** 기능을 제공하여, 사용자가 버튼의 위치 정렬과 주변 공간을 자유롭게 조정할 수 있어야 합니다.

**구현 방법:**

* **정렬 옵션:** 버튼 블록 컴포넌트에 `alignment` 속성을 추가하고, 해당 값을 "left", "center", "right" 중 선택할 수 있도록 합니다. UI 상에서는 RadioGroup 혹은 SegmentedControl을 사용하여 **좌**, **중앙**, **우** 정렬을 선택하게 합니다. Puck의 필드 설정으로 보면 `type: 'radio'` 또는 `'select'`로 필드를 정의하고 옵션에 `{ label: 'Left', value: 'left' }` 등으로 세 가지 값을 제공하면 됩니다[GitHub](https://github.com/michiel/torque/blob/3707effdfe4b31d96d3c0c462a43d7cdf4597a9e/frontend/model-editor/src/components/VisualLayoutEditor/TorqueComponents/TorqueButton.tsx#L137-L143). 개발 예시:

  <pre class="overflow-visible!" data-start="4889" data-end="5116"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-ts"><span><span>alignment</span><span>: {
    </span><span>type</span><span>: </span><span>'radio'</span><span>,
    </span><span>label</span><span>: </span><span>'Button Alignment'</span><span>,
    </span><span>options</span><span>: [
      { </span><span>label</span><span>: </span><span>'Left'</span><span>, </span><span>value</span><span>: </span><span>'left'</span><span> },
      { </span><span>label</span><span>: </span><span>'Center'</span><span>, </span><span>value</span><span>: </span><span>'center'</span><span> },
      { </span><span>label</span><span>: </span><span>'Right'</span><span>, </span><span>value</span><span>: </span><span>'right'</span><span> }
    ]
  }
  </span></span></code></div></div></pre>

  선택된 alignment 값에 따라 버튼을 감싸는 컨테이너 요소에 Tailwind 정렬 클래스를 적용합니다. 만약 버튼이 단독으로 하나의 블록 요소라면 `text-left / text-center / text-right`를 적용하여 해당 요소 자체의 텍스트 정렬을 변경할 수 있고, 버튼이 flex 컨테이너 내에 있을 경우 부모에 `justify-start / justify-center / justify-end` 클래스를 적용해 버튼의 위치를 조정할 수 있습니다. Tailwind의 이러한 justify 유틸리티들은 flex 컨테이너에서 자식 아이템들을 좌측, 중앙, 우측 정렬해줍니다[geeksforgeeks.org](https://www.geeksforgeeks.org/css/tailwind-css-justify-content/#:~:text=justify,the%20end%20of%20the%20container)[geeksforgeeks.org](https://www.geeksforgeeks.org/css/tailwind-css-justify-content/#:~:text=justify,the%20center%20of%20the%20container). (구현 시 현재 버튼 블록의 DOM 구조에 맞게 적절한 방법을 선택하세요.)
* **여백(padding/margin) 설정:** 버튼 주위의 내부 여백(padding)과 바깥 여백(margin)을 조절하는 기능을 추가합니다. 이를 위해 버튼 블록에 `padding` 및 `margin` 속성을 숫자 또는 슬라이더로 입력받을 수 있게 합니다. 예를 들어 **Padding**과 **Margin**에 대해 0에서 50 사이의 값을 px 단위로 지정할 수 있는 슬라이더를 제공하고, 사용자가 값을 변경하면 해당 값을 Tailwind 클래스나 인라인 스타일로 적용합니다. Tailwind CSS를 활용하는 경우, 예를 들어 padding 값 16을 선택하면 `p-4`(기본 1단위=4px 가정) 클래스를, margin 값 8을 선택하면 `m-2` 등의 클래스를 적용하는 방식으로 매핑할 수 있습니다. 다만 Tailwind 클래스는 미리 정의된 값만 사용할 수 있으므로, 0–50px의 임의 값에 대응하려면 Tailwind 설정에 해당 픽셀 값들을 spacing 스케일에 추가하거나 safelist에 포함해야 합니다.
  빠른 구현을 위해서는 인라인 스타일로 `style={{ padding: value+'px' }}`를 적용하는 것도 가능합니다. 하지만 일관성을 위해 Tailwind 유틸리티를 선호한다면, 일반적인 범위의 px 값을 Tailwind 클래스 (예: `p-1`\~`p-12` 등)로 한정짓거나, 아니면 5px 단위 등으로 간격을 조절하는 식으로 타협할 수 있습니다.
* **적용 및 미리보기:** 사용자가 정렬이나 여백을 변경하면 즉시 미리보기 영역의 버튼 스타일이 업데이트되어야 합니다. 예를 들어 alignment를 Center로 바꾸면 미리보기에서 버튼이 즉시 가운데 정렬되고, margin/padding 값을 늘리면 버튼 주위 공간이 바로 늘어나야 합니다. 이를 위해 onChange 이벤트마다 `block.settings` 값을 업데이트하고, Puck이 rerender하도록 하면 실시간 반영됩니다. (Tailwind 클래스를 동적으로 적용하려면 Next.js의 컴파일 타임에 해당 클래스를 포함하거나 safelist를 설정해야 함을 유의하세요.)

## 5. 이미지 블록 편집 기능 추가

**요구사항:** 이미지 업로드 후 사용자가 **이미지 크기 조절**, **정렬**, **대체 텍스트(alt)** 입력, **배경으로 설정** 등의 기본 편집 기능을 사용할 수 있어야 합니다. 현재는 이미지 업로드만 되고 세부 편집이 어려울 수 있으므로, 이를 개선합니다.

**구현 방법:**

* **크기 조절:** 이미지 블록에 가로(width) 및 세로(height) 크기를 조절하는 UI를 추가합니다. 슬라이더 컴포넌트를 사용하여 % 또는 px 단위로 크기를 변경할 수 있게 하며, 최소 10% \~ 최대 100% 또는 원본 크기 범위 내에서 설정하도록 합니다. 예를 들어 `width: 50%`로 줄이면 `<img>` 요소에 인라인 스타일 `width:50%`를 적용하거나 Tailwind 클래스 `w-1/2`를 적용하는 식입니다. 정밀한 px 단위 조절을 원하면 슬라이더를 px 기준으로 하고, 선택 값을 style 속성에 반영합니다 (예: `style={{ width: value + 'px' }}`). 높이(height)도 유사하게 처리하되, 일반적으로 비율 유지를 위해 width만 조절하고 height는 auto로 두는 방식을 고려할 수 있습니다. 사용성 측면에서 **잠금 비율 유지**(aspect ratio lock) 옵션도 추가하여 원본 비율을 유지한 채 크기를 변경할지 선택할 수 있게 하면 더욱 좋습니다.
* **정렬:** 이미지의 정렬 옵션을 제공하여 이미지 블록을 좌/중앙/우 정렬할 수 있게 합니다. 구현은 버튼 블록의 정렬과 유사합니다. 이미지가 자체적으로 블록을 차지하고 있다면 부모 컨테이너에 `text-left/center/right` 클래스를 적용하거나, 이미지가 flex 컨테이너 안에 있다면 `justify-start/center/end`를 적용합니다. 사이드바 UI에서 “정렬” 항목을 추가하고, Left/Center/Right 중 하나를 선택하도록 합니다. 이렇게 하면 예를 들어 Center 선택 시 `<div class="text-center">` 안에 이미지가 렌더링되어 가운데 정렬되고, Right 선택 시 `text-right`로 우측 정렬됩니다.
* **대체 텍스트(Alt) 입력:** 업로드한 이미지에 대한 대체 텍스트를 입력할 수 있는 필드를 제공합니다. 사이드바에 “Alt 텍스트” 입력란을 추가하고, 여기에 작성된 내용은 `<img>` 태그의 `alt` 속성으로 넣습니다. 이는 접근성을 위해 필수이므로, alt 값이 없을 경우 빈 문자열이라도 들어가도록 처리합니다. Puck 필드 정의 예:

  <pre class="overflow-visible!" data-start="7921" data-end="8006"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-ts"><span><span>alt</span><span>: { </span><span>type</span><span>: </span><span>'text'</span><span>, </span><span>label</span><span>: </span><span>'Alt Text'</span><span>, </span><span>placeholder</span><span>: </span><span>'이미지 설명을 입력하세요'</span><span> }
  </span></span></code></div></div></pre>

  사용자가 입력한 alt 텍스트는 곧바로 이미지의 속성에 반영되어 미리보기에서도 개발자 도구 등을 통해 확인 가능하게 됩니다.
* **배경 이미지로 설정:** 이미지를 단독 요소로 삽입하는 것 외에, 해당 이미지를 섹션 배경으로 사용할 수 있는 기능을 추가합니다. 예를 들어 “배경으로 사용” 이라는 토글 스위치를 이미지 블록 설정에 넣습니다. 사용자가 이를 활성화하면, 이미지 블록의 렌더 방식을 `<img>` 태그가 아닌 배경을 가진 `<div>`로 변경하거나 별도의 스타일을 적용합니다. 구현 방법:

  * 배경모드가 활성화되면, `<div style={{ backgroundImage: 'url(<이미지 URL>)', backgroundSize: 'cover', backgroundPosition: 'center' }}>` 형태로 렌더링하도록 합니다. 이미지 자체는 CSS 배경으로 적용되고, 만약 그 위에 텍스트 등의 자식 콘텐츠를 추가로 배치할 수 있게 할 계획이라면 해당 블록을 컨테이너로 활용하면 됩니다.
  * 배경으로 설정된 경우 높이 조절이 중요합니다. 고정 높이 값을 필드로 받거나 (예: “배경 높이: 300px”), 아니면 부모 컨테이너의 높이에 100% 맞추도록 하는 등 레이아웃을 결정해야 합니다. 우선은 사용자 지정 높이 필드를 추가하여 px 단위로 높이를 설정할 수 있게 하는 방법이 직관적입니다.
  * 배경 이미지 특성상 alt 텍스트 개념은 적용되지 않으므로, alt 필드는 비활성화하거나 표시하지 않을 수 있습니다.
* **Next.js Image 컴포넌트 연계:** Next.js 15 환경이라 `next/image`를 사용할 수 있습니다. 가능하다면 이미지 블록에서 `<Image>` 컴포넌트를 사용하여 최적화된 이미지를 제공하고, 위에서 언급한 속성들 (width, height, alt 등)과 `style` 또는 `className`을 통해 정렬/여백을 적용합니다. Next/Image를 사용하면 레이지 로드나 자동 최적화 이점이 있으므로, 추후 이 방향으로 개선할 수 있습니다. 초기 구현에서는 일반 `<img>`로 시작해도 무방하며, 나중에 `<Image>`로 대체하면서 props 매핑만 맞추면 비교적 간단히 전환 가능합니다.

---

**비고:**
시스템 스택이 *Next.js 15*, *React 19*, *Tailwind CSS*, *TypeScript*이며 Puck 에디터와 shadcn/ui 컴포넌트를 사용하고 있으므로, 위 기능들은 해당 생태계에서 제공하는 컴포넌트와 API를 활용하여 구현할 수 있습니다. 예를 들어 Radix UI 기반의 슬라이더와 컬러 피커, Tailwind 유틸리티 클래스, Puck의 config 확장 기능 등을 적극 활용하세요. 보안 측면은 프로토타이핑 단계에서는 엄격히 다루지 않아도 되지만 (특히 HTML 블록 관련 기능은 내부 사용자용이라 가정), *XSS 방지 등 최소한의 조치*는 적용하는 것이 좋습니다. 각 기능 구현 후에는 에디터에서의 사용성(UX)을 충분히 테스트하여, 실시간 미리보기 반영이나 UI 동작에 문제가 없는지 확인하도록 합니다. 기능 구현이 완료되면 자동님께서 해당 개선사항을 확인하실 수 있도록 배포 일정을 공유하고, 추가 피드백을 반영해 나가시기 바랍니다.

인용

[![](https://www.google.com/s2/favicons?domain=https://puckeditor.com&sz=32)ComponentConfig | Puckhttps://puckeditor.com/docs/api-reference/configuration/component-config](https://puckeditor.com/docs/api-reference/configuration/component-config#:~:text=)[![](https://www.google.com/s2/favicons?domain=https://puckeditor.com&sz=32)Categories | Puckhttps://puckeditor.com/docs/integrating-puck/categories](https://puckeditor.com/docs/integrating-puck/categories#:~:text=const%20config%20%3D%20,%2F%2F%20...)[![](https://www.google.com/s2/favicons?domain=https://ui.shadcn.com&sz=32)Slider - shadcn/uihttps://ui.shadcn.com/docs/components/slider](https://ui.shadcn.com/docs/components/slider#:~:text=return%20%28%20,60%25%5D%22%2C%20className%29%7D%20%7B...props%7D%20%2F%3E)[![](https://www.google.com/s2/favicons?domain=https://github.com&sz=32)GitHub - uiwjs/react-color: Is a tiny color picker widget component for React apps.https://github.com/uiwjs/react-color](https://github.com/uiwjs/react-color#:~:text=function%20Demo%28%29%20,%7B%20setHex%28color.hex%29%3B)[![](https://www.google.com/s2/favicons?domain=https://stackoverflow.com&sz=32)javascript - how to overrides the components present in Puck editor and insert a new one from context - Stack Overflowhttps://stackoverflow.com/questions/79691072/how-to-overrides-the-components-present-in-puck-editor-and-insert-a-new-one-from](https://stackoverflow.com/questions/79691072/how-to-overrides-the-components-present-in-puck-editor-and-insert-a-new-one-from#:~:text=RawHTMLBlock%3A%20,HTML)[![](https://www.google.com/s2/favicons?domain=https://stackoverflow.com&sz=32)javascript - how to overrides the components present in Puck editor and insert a new one from context - Stack Overflowhttps://stackoverflow.com/questions/79691072/how-to-overrides-the-components-present-in-puck-editor-and-insert-a-new-one-from](https://stackoverflow.com/questions/79691072/how-to-overrides-the-components-present-in-puck-editor-and-insert-a-new-one-from#:~:text=export%20default%20function%20HTMLrender%28,)[![](https://www.google.com/s2/favicons?domain=https://www.npmjs.com&sz=32)sanitize-html - npmhttps://www.npmjs.com/package/sanitize-html](https://www.npmjs.com/package/sanitize-html#:~:text=Use%20it%20in%20your%20JavaScript,app)[![GitHub]()TorqueButton.tsxhttps://github.com/michiel/torque/blob/3707effdfe4b31d96d3c0c462a43d7cdf4597a9e/frontend/model-editor/src/components/VisualLayoutEditor/TorqueComponents/TorqueButton.tsx#L137-L143](https://github.com/michiel/torque/blob/3707effdfe4b31d96d3c0c462a43d7cdf4597a9e/frontend/model-editor/src/components/VisualLayoutEditor/TorqueComponents/TorqueButton.tsx#L137-L143)[![](https://www.google.com/s2/favicons?domain=https://www.geeksforgeeks.org&sz=32)Tailwind CSS Justify Content - GeeksforGeekshttps://www.geeksforgeeks.org/css/tailwind-css-justify-content/](https://www.geeksforgeeks.org/css/tailwind-css-justify-content/#:~:text=justify,the%20end%20of%20the%20container)[![](https://www.google.com/s2/favicons?domain=https://www.geeksforgeeks.org&sz=32)Tailwind CSS Justify Content - GeeksforGeekshttps://www.geeksforgeeks.org/css/tailwind-css-justify-content/](https://www.geeksforgeeks.org/css/tailwind-css-justify-content/#:~:text=justify,the%20center%20of%20the%20container)

모든 출처

[![](https://www.google.com/s2/favicons?domain=https://puckeditor.com&sz=32)puckeditor](https://puckeditor.com/docs/api-reference/configuration/component-config#:~:text=)[![](https://www.google.com/s2/favicons?domain=https://ui.shadcn.com&sz=32)ui.shadcn](https://ui.shadcn.com/docs/components/slider#:~:text=return%20%28%20,60%25%5D%22%2C%20className%29%7D%20%7B...props%7D%20%2F%3E)[![](https://www.google.com/s2/favicons?domain=https://github.com&sz=32)github](https://github.com/uiwjs/react-color#:~:text=function%20Demo%28%29%20,%7B%20setHex%28color.hex%29%3B)[![](https://www.google.com/s2/favicons?domain=https://stackoverflow.com&sz=32)stackoverflow](https://stackoverflow.com/questions/79691072/how-to-overrides-the-components-present-in-puck-editor-and-insert-a-new-one-from#:~:text=RawHTMLBlock%3A%20,HTML)[![](https://www.google.com/s2/favicons?domain=https://www.npmjs.com&sz=32)npmjs](https://www.npmjs.com/package/sanitize-html#:~:text=Use%20it%20in%20your%20JavaScript,app)[![](https://www.google.com/s2/favicons?domain=https://www.geeksforgeeks.org&sz=32)geeksforgeeks](https://www.geeksforgeeks.org/css/tailwind-css-justify-content/#:~:text=justify,the%20end%20of%20the%20container)

확인 감사합니다 자동님! 현재 다음 항목들이 미구현된 상태임을 반영하여, 클로드코드에게 전달할 명확한 지시서를 작성하겠습니다:

* 블록 사이드바 이름/순서 변경 기능 없음
* 텍스트 스타일 설정 UI 개선 미구현 (슬라이더/컬러피커 없음)
* HTML 삽입 및 버튼/이미지 편집 관련 클래식 기능 미반영

이 항목들을 중심으로 즉시 구현이 필요한 개선 지시서를 준비하겠습니다.

[ ]

WYSIWYG <Alt+Ctrl+7>Instant Rendering <Alt+Ctrl+8>Split View <Alt+Ctrl+9>

Outline

DesktopTabletMobile/Wechat
