import {
  BUILDER,
  BUILDER_TEST,
  EXAMPLE,
  PARSER,
  SOLUTION1,
  SOLUTION2,
  VIRTUAL_DISPLAY,
} from './client.js'

export function renderPage() {
  const html = /* language=html */ `
    <div id="app">
      <article class="detail-container" id="escape-parser">
        <header><h2>번역 라이브러리 개선</h2></header>
        <hr />
        <section aria-labelledby="problem">
          <p class="description">
            아래 예시와 같이, 번역파일의 특수문자 이스케이프 처리를 누락한 경우에 원본과 번역본의 형식 차이로 인해 병합 과정에서 에러가 발생했습니다.
          </p>
          <figure>
            <figcaption><code>messages.xlf</code></figcaption>
            <pre><code class="language-xml">${EXAMPLE}</code></pre>
          </figure>
        </section>
        <div style="height: 16px"></div>
        
        <section aria-labelledby="implementation">
          <h3 id="implementation">구현</h3>
          <p class="description">
            처음에는 문자열을 정규식으로 치환하여 누락된 이스케이프를 보정하는 방법을 고려했습니다.
          </p>
          <p class="description">
            하지만 XML은 태그와 속성, 텍스트가 하나의 문자열 안에 함께 존재하기 때문에 문자열 단위의 치환으로 처리할 경우 XML 구조를 훼손할 가능성이 있었습니다.
          </p>
          <p class="description">
            따라서 파일 전체를 문자열로 처리하는 대신, DOMParser를 통해 XML을 DOM 트리로 변환한 뒤 보정이 필요한 텍스트 및 속성 노드만 순회하는 방식으로 구현했습니다.
          </p>
          <figure>
            <figcaption><code>builder.ts</code></figcaption>
            <pre><code>${BUILDER}</code></pre>
          </figure>
          <figure>
            <figcaption><code>parser.ts</code></figcaption>
            <pre><code>${PARSER}</code></pre>
          </figure>
        </section>
        <div style="height: 16px"></div>
        
        <section aria-labelledby="verification">
          <h3 id="verification">검증</h3>
          <p class="description">원본과 번역본 모두 이스케이프 처리가 정상적으로 적용되는지 테스트 코드를 통해 검증했습니다. </p>
          <figure>
            <figcaption><code>builder.spec.ts</code></figcaption>
            <pre><code>${BUILDER_TEST}</code></pre>
          </figure>
        </section>

        <div style="height: 16px"></div>
        
        <section aria-labelledby="result">
          <h3 id="result">결과</h3>
          <p class="description">
            번역 과정에서 발생할 수 있는 특수문자 이스케이프 누락을 빌드 단계에서 보정하도록 변경하여,
            해당 문제로 발생하던 병합 오류를 방지했습니다.
          </p>
        </section>
      </article>

      <div style="height: 28px"></div>
      
      <article class="detail-container" id="flutter">
        <header><h2>Flutter Android Webview 프레임드랍 최적화</h2></header>
        <hr />
        <section aria-labelledby="problem">
          <p class="description">
            Flutter의 Android 렌더링 구조에 의해 발생한 문제였습니다. <br />
            Flutter는 자체 렌더링 엔진(Skia/Impeller)을 사용하는데,
            Webview 같은 네이티브 Android 뷰를 Flutter 위에 올릴 때 발생합니다.
          </p>
          <figure>
            <figcaption><code>기본 방식: Virtual Display (하드웨어 가속 활성화)</code></figcaption>
            <pre><code>${VIRTUAL_DISPLAY}</code></pre>
          </figure>
          <p class="description">
            WebView가 GPU로 그린 결과를 Flutter가 텍스처(SurfaceTexture)로 받아서 다시 합성하는 구조라, WebView가 업데이트될 때마다 두 렌더링 파이프라인이 동기화 포인트를 만듭니다. <br />
          </p>
          <p class="description">
            네트워크 응답 이후 DOM이 업데이트되면 위 동기화 과정에서 메인 스레드를 블로킹하면서 프레임 드랍이 발생했습니다.
          </p>
        </section>
        <div style="height: 24px"></div>
        <section aria-labelledby="implementation">
          <h3 id="implementation">해결 방식</h3>
          <figure>
            <figcaption><code>해결 방식1: 하드웨어 가속 비활성화</code></figcaption>
            <pre><code>${SOLUTION1}</code></pre>
          </figure>
          <p class="description">
            GPU 파이프라인에서 분리되니 충돌이 없어집니다.
            다만 소프트웨어 렌더링(CPU)이라 복잡한 UI는 느릴 수 있었습니다.
          </p>
          <figure>
            <figcaption><code>해결 방식2: Hybrid Composition 활성화</code></figcaption>
            <pre><code>${SOLUTION2}</code></pre>
          </figure>
          <p class="description">
            WebView가 Flutter 렌더링 파이프라인 밖에서 독립적으로 그려지기 때문에 서로 간섭하지 않습니다.
          </p>
        </section>
        <div style="height: 24px"></div>
        <section aria-labelledby="result">
          <h3 id="result">결과</h3>
          <p class="description">
            해결 방식2를 파트너사에 제안하여 채택 이후, 웹뷰에서 발생했던 프레임드랍 현상을 해소했습니다. 
          </p>
        </section>
      </article>
    </div>
  `
  const clientScript = 'src/pages/career/client.ts'

  return { html, clientScript }
}
