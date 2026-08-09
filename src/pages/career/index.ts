export function renderPage() {
  const html = `
<h1>Career.</h1>

<header id="info">
    <h2>최도경</h2>
    <div>
        <p>010-6423-7852</p>
        <a href="https://github.com/yopyzzang">Github</a>
    </div>
    
</header>

<article>
    <h2>소개의 말</h2>
    <p>
          안녕하세요. 5년차 프론트엔드 개발자입니다.
          
          O2O 플랫폼과 암호화폐 거래소 웹 서비스를 개발하며 복잡한 비즈니스 요구사항을 안정적인 시스템으로 구현한 경험을 쌓았습니다.
          
          하나의 코드 베이스로 관리되는 구조를 설계하는 것과 다양한 환경, 기기에서도 안정적으로 서비스를 개발하는 것을 지향합니다.
    </p>
</article>

<article>
    <h2>이력</h2>
    <hr />
    <article class="career">
        <header>
            <h2>커넥트파이클라우드</h2>
            <p><time datetime="2024-03">2024.03</time> - <time datetime="2025.10">2025.10</time> (1년 8개월)</p>
        </header>
        <article>
            <header>
                <h3>기업 홈페이지 마이그레이션</h3>
                <div>
                  <p><strong>기간:</strong> <time datetime="2024-03">2024.03</time> - <time datetime="2024-05">2024.05</time></p>
                  <p><strong>팀 규모 및 역할:</strong> FE 2명 | FE 리드, 기여도 50%</p>
                  <p><strong>사용 기술:</strong> Next.js, TypeScript, PHP (Legacy)</p>
                  <p><strong>설계 배경:</strong> UI와 비즈니스 로직이 강결합된 PHP 레거시 구조로 인해 발생한 기술 부채 청산 및 SEO 최적화를 위함.</p>
                </div>
            </header>
            <div>
                <h4>작업 내용</h4>
                <ul>
                    <li><strong>프론트엔드-백엔드 분리:</strong> 뷰와 데이터의 의존성을 분리하고, 파편화되었던 코드베이스를 모듈화된 UI 컴포넌트로 규격화하여 재설계</li>
                    <li><strong>SSR 렌더링 도입:</strong> SEO가 중요한 기업 홈페이지의 도메인 특성을 분석하여 SSR 도입</li>
                </ul>
            </div>
            
            <div>
                <h4>성과</h4>
                <p>프론트엔드-벡엔드를 분리하여 독립적인 개발 환경 구성</p>
            </div>
        </article>

        <article>
            <header>
                <h3>모바일 앱 임베딩 웹 애플리케이션 개발</h3>
                <div>
                  <p><strong>기간:</strong> <time datetime="2024-06">2024.06</time> - <time datetime="2025-10">2025.10</time></p>
                  <p><strong>팀 규모 및 역할:</strong> FE 2명, BE 2명 | FE 기여도 100%</p>
                  <p><strong>사용 기술:</strong> Turborepo, pnpm workspace, Next.js, TypeScript, tailwind</p>
                  <p><strong>설계 배경:</strong> 4개 파트너사 앱에 탑재되어 최종적으로 일반 고객이 사용하는 O2O 서비스 구축을 위함.</p>
                </div>
            </header>
            <div>
                <h4>작업 내용</h4>
                <ul>
                    <li><strong>모노레포 기반 설계 및 빌드 파이프라인 구축:</strong> 4개의 웹 애플리케이션을 단일 레포지토리로 통합하여 코드 중복을 줄이고, 빌드 파이프라인을 단일화함.</li>
                    <li><strong>테마 시스템 구축:</strong> 파트너사 별 브랜드 컬러 및 디자인을 단일 코드베이스로 관리하기 위한 테마 시스템 구축</li>
                    <li><strong>JSON 스키마 기반 폼 빌더 구현:</strong> 코드 배포 없이 서버에서 전달받은 추상화된 스키마(폼 타입, 제약조건) 데이터만으로 화면 테마와 폼(Form)이 동적으로 렌더링되도록 구현</li>
                    <li><strong>미들웨어 인증 처리:</strong> 쿠키 내 로그인 토큰을 활용해 서버사이드에서 API 요청을 선행 처리하는 렌더러 구현. 클라이언트 단의 API 대기 시간을 단축하여 초기 진입 속도 800ms 단축</li>
                    <li><strong>외부 결제 통합 파이프라인:</strong> 파트너사 앱과 외부 결제 프로바이더 간의 주문/결제 전체 프로세스 연동 통합</li>
                </ul>
            </div>
             <div>
                <h4>성과</h4>
                <p>단일 코드베이스로 4개 파트너사 맞춤형 통합 관리, 코드 중복 50% 감소</p>
            </div>
        </article>

        <article>
            <header>
                <h3>Flutter Android WebView 성능(프레임 드랍) 최적화</h3>
                <div>
                  <p><strong>기간:</strong> <time datetime="2025-03">2025.03</time> - <time datetime="2024-04">2025.04</time></p>
                  <p><strong>팀 규모 및 역할:</strong> FE 2명 | FE 기여도 100%</p>
                  <p><strong>사용 기술:</strong> Android Profiler, Flutter Inappwebview</p>
                  <p><strong>설계 배경:</strong> 파트너사의 Flutter 기반으로 구현된 안드로이드 모바일 앱 웹뷰 환경에서 API 호출 시 UI 프레임레이트가 떨어지는 이슈를 해결하기 위함.</p>
                </div>
            </header>
            <div>
                <h4>작업 내용</h4>
                <ul>
                    <li><strong>Android Profiler 기반 병목 지점 분석:</strong> 하드웨어 가속 활성화 시 GPU 렌더링 파이프라인과 메인 스레드 간 동기화 오버헤드로 인해 네트워크 요청이 메인 스레드를 블로킹하며 프레임 드랍이 발생하는 근본 원인 식별</li>
                    <li><strong>네이티브 뷰 렌더링 전환:</strong> Android Activity 레벨 하드웨어 가속을 비활성화하고, Flutter의 displayWithHybridComposition 옵션을 활성화하여 네이티브 뷰 렌더링으로 전환</li>
                </ul>
            </div>
            <div>
                <h4>성과</h4>
                <p>메인 스레드 블로킹 시간을 180ms에서 12ms로 단축하여 프레임 드랍 현상을 해소, 해당 이슈를 문서화하고 파트너사에 전달하여 동일 문제의 사전 예방</p>
            </div>
        </article>
    </article>
    
    <hr />
    
    <article class="career">
        <header>
            <h2>롯데몰 랜딩페이지 외주 개발</h2>
            <p><time datetime="2023-07">2023.07</time> - <time datetime="2023.09">2023.09</time> (2개월)</p>
        </header>
        <article>
            <header>
                <h3>다국어 지원</h3>
                <div>
                  <p><strong>기간:</strong> <time datetime="2023-07">2023.07</time> - <time datetime="2023.09">2023.09</time></p>
                  <p><strong>팀 규모 및 역할:</strong> FE 1명, 기여도 100%</p>
                  <p><strong>사용 기술:</strong> Nuxt I18n</p>
                  <p><strong>설계 배경:</strong> 글로벌 유저 타겟팅을 위한 다국어 지원 필요</p>
                </div>
            </header>
            <div>
                <h4>작업 내용</h4>
                <ul>
                    <li><strong>번역 파일 지연 로딩:</strong> 유저가 선택한 언어에 따라 번역 파일을 동적으로 가져오게 구현</li>
                </ul>
            </div>
            
            <div>
                <h4>성과</h4>
                <p>유저가 선택한 번역 파일만 로딩하여 불필요한 리소스를 줄이고, 다국어를 지원하도록 설계함.</p>
            </div>
        </article>

        <article>
            <header>
                <h3>SSR 기반 서비스 설계 및 SEO 최적화</h3>
                <div>
                  <p><strong>기간:</strong> <time datetime="2023-07">2023.07</time> - <time datetime="2023.09">2023.09</time></p>
                  <p><strong>팀 규모 및 역할:</strong> FE 1명, 기여도 100%</p>
                  <p><strong>사용 기술:</strong> Nuxt.js</p>
                  <p><strong>설계 배경:</strong> 언어별로 독립적인 URL 주소를 가지도록 설계하여 검색 엔진 로봇이 국가별 페이지를 정상적으로 색인하도록 함.</p>
                </div>
            </header>
            <div>
                <h4>작업 내용</h4>
                <ul>
                    <li><strong>라우팅 전략(Prefix / Sub-domain) 활용:</strong> 언어별 동적 URL 구조 설계 (예: /en/products, /vn/products).</li>
                    <li><strong>메타 태그 동적 주입:</strong> 유저가 선택한 로케일에 알맞게 메타 데이터를 주입하는 로직 구현</li>
                </ul>
            </div>
             <div>
                <h4>성과</h4>
                <p>언어별 독립 URL 구조 및 동적 메타 태그 적용으로 타겟 국가별 검색 색인</p>
            </div>
        </article>
    </article>
    
    <hr />
    
    <article class="career">
        <header>
            <h2>디앤에스에버(DNSEver)</h2>
            <p><time datetime="2020-11">2020.11</time> - <time datetime="2023-07">2023.07</time> (2년 9개월)</p>
        </header>

        <article>
            <header>
                <h3>다국어 번역 라이브러리 개선</h3>
                <div>
                  <p><strong>기간:</strong> <time datetime="2021-07">2021.07</time> - <time datetime="2022.01">2022.01</time></p>
                  <p><strong>팀 규모 및 역할:</strong> FE 4명 | FE 기여도 100%</p>
                  <p><strong>설계 배경:</strong> 사내 번역팀이 번역한 파일과 기존 번역 파일 병합 시, 특수문자 이스케이프 처리가 누락되었을 때에 오류 발생</p>
                </div>
            </header>
            <div>
                <h4>작업 내용</h4>
                <ul>
                    <li><strong>Escape Parser 구현:</strong> 번역팀이 번역한 파일의 특수문자 이스케이프가 누락되더라도, 자동으로 이스케이프 처리되어 병합되도록 자체 Escape Parser 로직을 구현</li>
                    <li><strong>안정성 검증:</strong> 병합 시 발생할 수 있는 엣지 케이스에 대한 테스트 코드를 작성하여 무결성 검증</li>
                </ul>
            </div>
            <div>
                <h4>성과</h4>
                <p>이스케이프로 인한 병합 문제 해소 및 휴먼 에러 제거, 번역 QA시간을 평균 2시간에서 30분으로 단축</p>
                <a target="_blank" href="https://github.com/yopyzzang/ng-extract-i18n-merge/blob/escape_parser/src/parser.ts">https://github.com/yopyzzang/ng-extract-i18n-merge/blob/escape_parser/src/parser.ts</a>
            </div>
        </article>

        <article>
            <header>
                <h3>다국어 지원 서비스 검색 엔진 최적화</h3>
                <div>
                  <p><strong>기간:</strong> <time datetime="2022-03">2022.03</time> - <time datetime="2022-04">2022.04</time></p>
                  <p><strong>팀 규모 및 역할:</strong> FE 4명 | FE 기여도 100%</p>
                  <p><strong>설계 배경:</strong> 다국어 지원 서비스임에도 불구하고, 메타 태그와 사이트맵이 언어별로 동적으로 처리되지 않아 다른 언어로 검색 시 결과가 노출되지 않고, 소셜 공유 시 항상 동일한 언어/이미지로 고정 노출되며, 동적 콘텐츠(이벤트 게시물 등)의 URL이 사이트맵에 포함되지 않는 문제가 있었음.</p>
                </div>
            </header>
            <div>
                <h4>작업 내용</h4>
                <ul>
                    <li><strong>동적 메타 태그 주입:</strong> 페이지 렌더링 전 유저의 언어 데이터를 주입받아 언어별 맞춤형 메타 태그를 설정</li>
                    <li><strong>동적 사이트맵 미들웨어 구현:</strong> 검색 엔진 로봇의 색인 요청 시 주소의 언어에 따라 맞춤형 사이트맵 리스트를 생성하는 미들웨어 구현</li>
                </ul>
            </div>
            <div>
                <h4>성과</h4>
                <p>구글 서치 콘솔 기준 검색 유입 유저 수 90% 증가. Lighthouse 기준 SEO 점수 16점 ➔ 92점으로 상승. 언어별 맞춤형 소셜 공유(OG tag) 노출 정상화.</p>
            </div>
        </article>
        <article>
            <header>
                <h3>테마 시스템 라이브러리 구축</h3>
                <div>
                  <p><strong>기간:</strong> <time datetime="2022-04">2022.04</time> - <time datetime="2022-08">2022.08</time></p>
                  <p><strong>팀 규모 및 역할:</strong> FE 4명 | FE 기여도 100%</p>
                  <p><strong>사용 기술:</strong> Angular Workspace, Gitlab NPM Package Registry</p>
                  <p><strong>설계 배경:</strong> 동일한 UI 코드의 중복 및 디자인 파편화 방지.</p>
                </div>
            </header>
            <div>
                <h4>작업 내용</h4>
                <ul>
                    <li><strong>공통 테마 시스템 개발:</strong> 레이아웃, 컬러, 버튼, 인풋 등 재사용성이 높은 UI 컴포넌트 라이브러리 구현</li>
                    <li><strong>모노레포 설계 및 배포 자동화:</strong> 테마 라이브러리와 테스트 환경을 단일 레포지토리(모노레포)로 설계하고, Gitlab NPM Package Registry를 연동하여 사내 패키지 배포 전략 수립</li>
                </ul>
            </div>
            <div>
                <h4>성과</h4>
                <p>일관된 UI/UX 스타일 적용 및 UI 관련 코드 중복을 80% 제거.</p>
            </div>
        </article>

        <article>
            <header>
                <h3>Service Worker를 활용한 무중단 배포 알림 시스템 구현</h3>
                <div>
                  <p><strong>기간:</strong> <time datetime="2023-02">2023.02</time> - <time datetime="2023-04">2023.04</time></p>
                  <p><strong>팀 규모 및 역할:</strong> FE 4명 | FE 기여도 100%</p>
                  <p><strong>사용 기술:</strong> Service Worker</p>
                  <p><strong>설계 배경:</strong> 사내 직원들이 사용하는 백오피스 서비스의 잦은 배포로 인해, 브라우저를 새로고침하기 전까지 업데이트가 반영되지 않아 발생하는 오작동 및 대면/메신저 커뮤니케이션 비용 절감을 위함.</p>
                </div>
            </header>
            <div>
                <h4>작업 내용</h4>
                <ul>
                    <li><strong>생명주기 기반 업데이트 감지:</strong> Service Worker의 상태(Lifecycle)를 관리하여, 신규 버전 배포 시 waiting 상태로 전환되는 이벤트를 감지하는 리스너 구현</li>
                    <li><strong>UI 업데이트 트리거 구현:</strong> 업데이트 감지 시 화면에 팝업을 노출하고, 유저 클릭 시 skipWaiting 메소드를 호출하여 강제로 최신 버전을 적용하도록 구현</li>
                </ul>
            </div>
            <div>
                <h4>성과</h4>
                <p>배포 안내를 위한 불필요한 사내 커뮤니케이션 비용 제거, 신규 버전 배포 시 사내 직원들의 즉각적인 인지 및 최신 버전 동기화.</p>
            </div>
        </article>
    </article>
</article>
`
  return { html }
}
