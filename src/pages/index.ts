export function renderPage() {
  const html = /* language=html */ `
    <div id="app">
      <h1>Journey.</h1>
      <p class="description">
        프론트엔드 개발자로 걸어온 여정을 설명한 문서입니다.
      </p>

      <div style="height: 24px"></div>
      <h1>2020</h1>
      <hr />
      <article class="article-container">
        <header>
          <h3>시작</h3>
          <div style="height: 8px"></div>
          <p>주어진 요구사항대로 기능을 빠르게 구현하는 것에 중점을 두고 개발을 시작했습니다.</p>
        </header>
      </article>
      <div style="height: 24px"></div>

      <h1>2021</h1>
      <hr />
      <article class="article-container">
        <header>
          <p>여러 팀과의 협업 과정에서 발생했던 문제를 개발을 통해 해결했습니다.</p>
        </header>
        <article>
          <header>
            <h4>번역 라이브러리 개선</h4>
            <p class="description">
              번역팀이 기존 특수문자 이스케이프 처리를 지우고 번역할 경우에 원본과 번역본의 형식이 달라져 병합 과정에서 오류가 발생했고,
              이를 수작업으로 수정하고 검증하는 시간이 소요되었습니다.
            </p>
            <p class="description">
              신규 번역팀 인원에게 온보딩을 통해 특수문자 처리 규칙을 안내하고 있었음에도 동일한 문제가 반복되었고, 사람의 숙지에만 의존하는 방식으로는 근본적인 해결이 어렵다고 판단했습니다.
              </p>
            <p class="description">
              그래서 사람의 실수로 인해 이스케이프 처리가 누락되어도 파싱 과정에서 특수문자를 이스케이프하도록 추가 기능을 구현했습니다.
              또한 다양한 엣지 케이스에 대한 테스트 코드를 작성하여 변경된 파싱 로직의 무결성을 검증했습니다.
            </p>
            <p class="description">
              그 결과 번역 파일들의 형식 불일치로 발생했던 오류를 방지하고, 번역 QA 시간을 평균 2시간에서 30분으로 단축할 수 있었습니다.
            </p>
          </header>
          <a target="_blank" href="/career#escape-parser">자세히 보기</a>
        </article>
      </article>

      <h1>2022</h1>
      <hr />
      <article class="article-container">
        <header>
          <p>내부와 외부의 환경적인 문제를 구조적으로 접근했습니다.</p>
        </header>
        <article>
          <header>
            <h4>다국어 서비스 검색 엔진 최적화</h4>
            <p class="description">
              다국어를 지원하는 서비스지만, 언어별로 사이트맵과 메타태그를 설정하지 않아 특정 언어로 검색 시 검색엔진에 색인되지 않는 문제가 있었습니다.
            </p>
            <p class="description">
              그래서 언어가 계속 늘어날 상황을 고려해, 언어가 추가될 때마다 사이트맵을 수동으로 관리하는 대신 지원 언어에 맞춰 사이트맵을 자동 생성하는 스크립트를 개발하고, 유저의 언어 데이터를
              주입받아 메타태그를 설정했습니다.
            </p>
            <p class="description">
              위 작업들 이후, 검색엔진에 올바르게 색인되었고 국가별 자연어를 통한 검색 인입을 기존 대비 90% 증가시켰습니다.
            </p>
          </header>
        </article>

        <article>
          <header>
            <h4>테마 시스템 라이브러리 구현</h4>
            <p class="description">
              프로젝트가 커지면서 연관된 프로젝트들이 여러 코드베이스로 나뉘게 되어, UI 관련 코드가 중복해서 개발되고 있었습니다.
              컨벤션 문서나 가이드만으로는 시간이 지나며 프로젝트마다 다시 갈라질 수 있다고 판단해, 공통 UI 요소를 패키지 형태로 배포되는 라이브러리로 묶어 코드 자체를 공유하도록 구현했습니다.
            </p>
            <p class="description">
              그 결과 연관 프로젝트 전반에서 UI 관련 코드를 중복해서 개발하는 것을 제거하고, 일관된 UI를 유지할 수 있었습니다.
            </p>
          </header>
        </article>

        <article>
          <header>
            <h4>배포 알림 구현</h4>
            <p class="description">
              사내에서 사용하는 백오피스 서비스는 잦은 배포로 인해, 배포가 이루어질 때마다 사내 직원들에게 구두 혹은 메신저로 전달했어야 했습니다.<br />
              메신저를 확인하지 못한 직원들은 기능이 새롭게 배포되었음에도 페이지 새로고침 전까지는 확인할 수 없어 불필요한 커뮤니케이션이 발생했습니다.
            </p>
            <p class="description">
              서비스워커의 상태를 감지하고 그에 따라서 업데이트 팝업을 노출하는 기능을 구현하여, 배포 관련 커뮤니케이션에 소요되던 시간을 평균 10분에서 2~3분으로 단축하고 버전 간 불일치 현상을
              해소했습니다.
            </p>
          </header>
        </article>
      </article>

      <h1>2023</h1>
      <hr />
      <article class="article-container">
        <header>
          <p>외부 프로젝트를 진행하면서 변화하는 요구사항들을 대응했고, 브라우저에서 실시간 통신을 다뤘습니다.</p>
        </header>
        <article>
          <header>
            <h4>롯데몰 랜딩 페이지 제작</h4>
            <p class="description">
              다국어 지원 요구사항에 맞춰 Nuxt I18n 기반으로 Locale 구조를 설계하고, 언어별 Prefix URL을 적용했습니다. 번역 리소스는 필요한 시점에 지연 로딩하도록 구성하여
              랜딩 페이지를 구현했습니다. </p>
            <p class="description">
              외주 프로젝트 특성 상 정해진 예산과 일정 내에서 기술 선택의 근거를 명확히 제시해야했고, 클라이언트의 요구사항을 구체적인 기술로 풀어나가고 소통하는 능력을 길렀습니다. </p>
          </header>
          <a target="_blank" href="https://lottemallwestlakehanoi.vn/">서비스 링크</a>
        </article>
        <article>
          <header>
            <h4>모아챗</h4>
            <p class="description">
              브라우저에서 실시간 통신을 다뤄보고 싶어, 시그널링부터 화상·음성 통화, 데이터채널 기반 텍스트·이미지 전송까지 WebRTC 서비스를 설계하고 구축했습니다.
              양측이 동시에 연결을 시도하는 offer 충돌 상황까지 직접 처리했고, WebRTC 로직을 클래스 단위로 추상화해 재사용 가능한 라이브러리로 배포했습니다.
            </p>
            <p class="description">
              coturn 서버 구축부터 SSH 기반 온프레미스 배포까지 인프라 전 과정을 직접 운영하며 클라우드와 온프레미스 사이의 비용과 편의성 트레이드오프를 체감했고,
              제한된 리소스 안에서도 안정적으로 동작하는 시스템을 설계하는 능력을 키웠습니다.
            </p>
          </header>
          <a target="_blank" href="/projects#moachat">자세히 보기</a> | <a target="_blank" href="https://moachat.app/">서비스 링크</a>
        </article>
      </article>

      <h1>2024-2025</h1>
      <hr />
      <article class="article-container">
        <header>
          <p>여러 프로젝트를 구조적으로 묶어 효율적으로 관리했고, 다양한 플랫폼과의 연동으로 인해 발생하는 문제를 해결했습니다.</p>
        </header>
        <article>
          <header>
            <h4>모바일 앱 임베딩 웹 애플리케이션 개발</h4>
            <p class="description">
              여러 파트너사 앱에 임베딩되는 웹 애플리케이션을 개발하며,
              파트너사가 늘어날수록 개별 코드베이스로 대응하기 어려워질 것을 고려해 모노레포 구조로 설계했습니다.
              공통 로직은 하나의 코드베이스에서 관리하되, 파트너사별 테마 요구사항은 Context API 기반 테마 시스템으로 분리해 구현했습니다.</p>
            <p class="description">
              그 결과 단일 코드베이스로 여러 파트너사를 동시에 지원할 수 있었고,
              신규 파트너사의 테마 확장 및 오버라이딩도 유연하게 지원할 수 있었으며,
              신규 파트너 온보딩에 소요되는 시간을 평균 3~4일에서 1~2일로 단축했습니다.
            </p>
            <p class="description">
              또한 모바일 앱에서 특정 진입점을 통해 이동하는 서비스 특성을 고려하여, 첫 진입에서 깜빡이는 현상을 제거하기 위해 SSR 단계에서 쿠키에 담겨진 인증 정보를 가져와 API를 먼저 조회하여
              응답값에 따라 알맞은 페이지를 렌더링하도록 별도의 렌더러를 구현했습니다.
            </p>
          </header>
        </article>
        
        <article>
          <header>
            <h4>Flutter Android WebView 프레임 드랍 최적화</h4>
            <p class="description">
              특정 파트너사 앱에서 API 요청 시 UI 프레임레이트가 떨어지는 현상이 발생했습니다. 문제가 발생한 환경을 동일하게 재현하여 원인을 추적한 결과, Flutter의
              Virtual Display 방식에서 WebView가 GPU로 그린 결과를 SurfaceTexture로 받아 Flutter 렌더링 파이프라인에 합성하는 과정에서 병목이 발생되는 것을
              파악했습니다.
            </p>
            <p class="description">
              Webview가 실행되는 액티비티 레벨에서 하드웨어 가속을 비활성화하여 Flutter에서 GPU 리소스를
              공유하지 않도록 하는 방향과
              Flutter Hybrid Composition 옵션을 활성화하여 Webview를 안드로이드 뷰 계층에 삽입하여 Flutter 동기화 과정을 거치지 않고 자체적인 파이프라인을 거쳐 동기화
              오버헤드를 제거하는 방향이 있었습니다.
            </p>
            <p class="description">
              렌더링 품질 저하 없이 근본 원인을 제거할 수 있는 Hybrid Composition을 파트너사에 제안했고, 반영 결과 프레임 처리 시간을 120ms에서 5ms로 단축해 프레임드랍을
              해소했습니다. </p>
          </header>
          <a target="_blank" href="/career#flutter">자세히 보기</a>
        </article>
      </article>

      <h1>2026</h1>
      <hr />
      <article class="article-container">
        <header>
          <p>브라우저에서 더 많은 것을 표현하고 몰입감을 주기 위해 WebGPU를 학습하여 게임을 만들어보았습니다.</p>
        </header>
        <article>
          <header>
            <h4>당근의 여정</h4>
            <p class="description">
              여러 메쉬를 오브젝트를 계층적으로 관리하기 위해서 Scene graph를 활용하여 관리하고,
              그것을 통해 생성된 노드의 변환을 손쉽게 하기 위해 TRS 구조체로 각 노드의 변환을 관리하도록 했습니다.
            </p>
            <p class="description">
              물체를 렌더링하기 위해 WGSL 언어를 통해 기본적인 셰이더를 구성했고,
              빛과 같은 효과를 별개의 리소스 없이 구현하기 위해 시간에 따른 절차적 셰이더를 별개로 구성하여 파이프라인을 나눠 물체들을 렌더링했습니다.
            </p>
          </header>
          <a target="_blank" href="/projects#carrot">자세히 보기</a> |
          <a target="_blank" href="/carrot">플레이 링크</a>
        </article>

    </div>

  `
  return { html }
}
