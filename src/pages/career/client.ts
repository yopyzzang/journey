import { highlightCode } from '../../utils/highlight.js'

const EXAMPLE = highlightCode(
  `<!-- 원본 번역파일 (messages.xlf) -->
<source>Dog &amp; Cat</source>

<!-- 번역 파일 (messages.fr.xlf) -->
<source>Dog &amp; Cat</source>
<!-- 특수문자 이스케이프 처리 누락-->
<target>Chien & Chat</target>`,
  'xml',
)

const BUILDER = highlightCode(
  `// Before
const translationSourceFile = await fs.readFile(sourcePath, 'utf8');              
const translationTargetFile = await fs.readFile(targetPath, 'utf8');

// After
const translationSourceXml = await fs.readFile(sourcePath, 'utf8');
const translationSourceDoc = new DOMParser().parseFromString(translationSourceXml, "text/html");
const translationSourceFile = escapeParser(translationSourceDoc);

const translationTargetXml = await fs.readFile(targetPath, 'utf8');
const translationTargetDoc = new DOMParser().parseFromString(translationTargetXml, "text/html");
const translationTargetFile = escapeParser(translationTargetDoc);`,
  'typescript',
)
const PARSER = highlightCode(
  `// TEXT_NODE, ATTRIBUTE_NODE에서 xmlEncoder 함수 호출
case node.ATTRIBUTE_NODE:
    const attrNode = node as Attr;
    return buf.push(' ', attrNode.name, '="', attrNode.value.replace(/[<&"]/g, _xmlEncoder), '"');
case node.TEXT_NODE:
    const textNode = node as Text;
    if (!options.beautify || partOfMixedContent || !containsOnlyWhiteSpace(textNode.data)) {
        return buf.push(textNode.data.replace(/[<&]/g, _xmlEncoder));
    }
    return;

// xmlEncoder
function _xmlEncoder(c: string): string {
  return c === '<' && '&lt;' ||
    c === '>' && '&gt;' ||
    c === '&' && '&amp;' ||
    c === '"' && '&quot;' ||
    '&#' + c.charCodeAt(0) + ';';
}`,
  'typescript',
)
const BUILDER_TEST = highlightCode(
  `test('extract-and-merge xlf 2.0', async () => {
  // 원본 번역 파일
  await fs.writeFile(
    'builder-test/messages.xlf',
    \`<xliff version="2.0">
        <file original="ng.template" id="ngi18n">
          <unit id="ID1">
            <segment>
              <source>source &amp; val</source>
            </segment>
          </unit>
        </file>
      </xliff>\`,
    'utf8',
  );

  // 번역 파일
  await fs.writeFile(
    'builder-test/messages.fr.xlf',
    \`<xliff version="2.0">
        <file original="ng.template" id="ngi18n">
          <unit id="ID1">
            <segment>
              <source>source &amp; val</source>
              <target>target & val</target> // 의도적으로 이스케이프 처리 누락
            </segment>
          </unit>
        </file>
      </xliff>\`,
    'utf8',
  );

  const run = await architect.scheduleTarget(
    {
      project: 'builder-test',
      target: 'extract-i18n-merge',
    },
    {
      format: 'xlf2',
      targetFiles: ['messages.fr.xlf'],
      outputPath: 'builder-test',
    },
  );

  const result = await run.result;
  expect(result.success).toBeTruthy();
  await run.stop();

  // 이스케이프가 보정된 최종 결과 검증
  const targetContent = await fs.readFile(
    'builder-test/messages.fr.xlf',
    'utf8',
  );

  expect(targetContent).toContain(
    '<target>target &amp; val</target>',
  );
});`,
  'xml',
)

const VIRTUAL_DISPLAY = highlightCode(
  `네트워크 요청 발생
→ Android WebView가 응답 처리
→ WebView 콘텐츠를 SurfaceTexture에 렌더링 (GPU)
→ Flutter 엔진이 SurfaceTexture를 자신의 렌더링 파이프라인에 합성
→ 이 합성 과정에서 GPU 렌더링 스레드와 메인 스레드가 동기화 필요
→ 네트워크 응답으로 WebView가 리페인트되면
→ SurfaceTexture 업데이트 → Flutter 합성 동기화 → 블로킹`,
  'plaintext',
)

const SOLUTION1 = highlightCode(
  `하드웨어 가속 비활성화
→ WebView가 SurfaceTexture(GPU) 대신 소프트웨어 렌더링(CPU)
→ Flutter와 GPU 리소스를 공유하지 않음
→ 동기화 오버헤드 제거
→ 프레임 드랍 없음`,
  'plaintext',
)

const SOLUTION2 = highlightCode(
  `Hybrid Composition 활성화
→ WebView를 SurfaceTexture가 아닌 Android View 계층에 직접 삽입
→ Flutter가 WebView 위/아래에 별도 레이어를 합성
→ WebView는 Android 자체 렌더링 파이프라인으로 독립 실행
→ 네트워크 응답 → WebView 업데이트가 Flutter 스레드와 무관
→ 동기화 블로킹 없음`,
  'plaintext',
)

export {
  EXAMPLE,
  PARSER,
  BUILDER,
  BUILDER_TEST,
  VIRTUAL_DISPLAY,
  SOLUTION1,
  SOLUTION2,
}
