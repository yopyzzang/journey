export function renderPage() {
  return `
<h1>Career</h1>

<article>
    <p>최도경</p>
    <a href="https://github.com/yopyzzang">Github</a>
    <p>Tel: 010-6423-7852</p>
</article>

<article>
    <h2>소개의 말</h2>
    <p>
        안녕하세요. 5년차 프론트엔드 개발자 입니다.

        B2B 기반 O2O 플랫폼과 가상자산 거래소 웹 서비스를 개발하며, 복잡한 비즈니스 요구사항을 안정적인 시스템으로 구현하는 경험을 쌓았습니다.
        특정 프레임워크나 도구에 얽매이기보다는, 코드가 실행되고 화면이 그려지는 근본적인 원리를 이해하여 문제를 해결하는 것을 지향합니다.

        주로 하나의 코드로 여러 파트너사의 환경을 지원하는 유연한 화면 구조 설계, 모바일 앱 내 웹뷰 환경에서의 렌더링 성능 개선, 여러 프로젝트의 배포 과정을 하나로 통합하는 환경 구축 등을 주도해 왔습니다.

        앞으로도 변하지 않는 기술의 본질에 집중하며, 주어진 제약 속에서 가장 합리적인 결과물을 만들어내는 엔지니어가 되고 싶습니다.
    </p>
</article>

<article>
    <h2>이력</h2>
    <article>
        <header>
            <h3>커넥트파이클라우드</h3>
            <p><time datetime="2024-03">2024.03</time> - <time datetime="2025.10">2025.10</time> (1년 8개월)</p>
        </header>

        <article>
            <header>
                <h3>기업 홈페이지 마이그레이션</h3>
                <p>기간: <time datetime="2024-03">2024.03</time> - <time datetime="2024-05">2024.05</time></p>
                <p>팀 규모 및 역할: FE 2명 | FE 리드, 기여도 50%</p>
                <p>사용 기술: Next.js, TypeScript, PHP (Legacy)</p>
                <p>설계 배경: UI와 비즈니스 로직이 강결합된 PHP 레거시 구조로 인해 발생한 기술 부채 청산 및 SEO 최적화를 위함.</p>
            </header>
            <div>
                <p>작업 내용</p>
                <ul>
                    <li>프론트엔드-백엔드 분리: 뷰와 데이터의 의존성을 분리하고, 파편화되었던 코드베이스를 모듈화된 UI 컴포넌트로 규격화하여 재설계</li>
                    <li>하이브리드 렌더링(SSR/SSG) 설계: SEO가 중요한 기업 홈페이지의 도메인 특성을 분석하여 콘텐츠 성격에 따라 SSR과 SSG를 교차 적용</li>
                </ul>
            </div>
            <p>성과: 신규 기능 배포 시 발생하던 사이드 이펙트 제거로 배포 안전성을 확보하고, 컴포넌트 기반 개발을 통한 기능 개발 속도 향상</p>
        </article>

        <article>
            <header>
                <h3>모바일 앱 임베딩 웹 애플리케이션 개발 (B2B2C)</h3>
                <p>기간: <time datetime="2024-06">2024.06</time> - <time datetime="2025-10">2025.10</time></p>
                <p>팀 규모 및 역할: FE 2명, BE 2명 | FE 기여도 100%</p>
                <p>사용 기술: Turborepo, pnpm workspace, Next.js, TypeScript, tailwind</p>
                <p>설계 배경: 4개 파트너사 앱에 탑재되어 최종적으로 일반 고객이 사용하는 O2O 서비스 구축을 위함.</p>
            </header>
            <div>
                <p>작업 내용</p>
                <ul>
                    <li>모노레포 기반 아키텍처 통합 및 빌드 파이프라인 구축: 4개의 웹 애플리케이션을 단일 레포지토리로 통합하여 코드 중복을 줄이고, 빌드 파이프라인을 단일화함.</li>
                    <li>Schema-driven UI 아키텍처 도입: 코드 배포 없이 서버에서 전달받은 추상화된 스키마(레이아웃, 컬러, 제약조건) 데이터만으로 화면 테마와 폼(Form)이 동적으로 렌더링되도록 구현</li>
                    <li>SSR 기반 미들웨어 인증 처리: 쿠키 내 로그인 토큰을 활용해 서버사이드에서 API 요청을 선행 처리하는 렌더러 구현. 클라이언트 단의 API 대기 시간(White Screen)을 제거하여 UX 선행 개선</li>
                    <li>외부 결제 통합 파이프라인: 파트너사 앱과 외부 결제 프로바이더 간의 주문/결제 전체 프로세스 연동 통합</li>
                </ul>
            </div>
            <p>성과: 단일 코드베이스로 4개 파트너사 맞춤형 통합 관리 환경 구축</p>
        </article>

        <article>
            <header>
                <h3>Flutter Android WebView 성능(프레임 드랍) 최적화</h3>
                <p>기간: <time datetime="2025-03">2025.03</time> - <time datetime="2024-04">2025.04</time></p>
                <p>팀 규모 및 역할: FE 2명 | FE 기여도 100%</p>
                <p>사용 기술: Turborepo, pnpm workspace, Next.js, TypeScript, tailwind</p>
            </header>
            <div>
                <p>작업 내용</p>
                <ul>
                    <li>Android Profiler 기반 병목 지점 분석: 하드웨어 가속 활성화 시 GPU 렌더링 파이프라인과 메인 스레드 간 동기화 오버헤드로 인해 네트워크 요청이 메인 스레드를 블로킹하며 프레임 드랍이 발생하는 근본 원인 식별</li>
                    <li>네이티브 뷰 렌더링 전환: Android Activity 레벨 하드웨어 가속을 비활성화하고, Flutter의 displayWithHybridComposition 옵션을 활성화하여 네이티브 뷰 렌더링으로 전환</li>
                </ul>
            </div>
            <p>성과: 메인 스레드 블로킹 시간을 180ms에서 12ms로 단축하여 프레임 드랍 현상을 해소, 해당 이슈를 문서화하고 파트너사에 전달하여 동일 문제의 사전 예방</p>
        </article>
    </article>

    <article>
        <header>
            <h3>디앤에스에버(DNSEver)</h3>
            <p><time datetime="2020-11">2020.11</time> - <time datetime="2023-07">2023.07</time> (2년 9개월)</p>
        </header>

        <article>
            <header>
                <h3>다국어 번역 라이브러리 개선</h3>
                <p>기간: <time datetime="2021-07">2021.07</time> - <time datetime="2022.01">2022.01</time></p>
                <p>팀 규모 및 역할: FE 4명 | FE 기여도 100%</p>
                <p>설계 배경: 사내 번역팀이 번역한 파일과 기존 번역 파일 병합 시, 특수문자 이스케이프 처리가 누락되었을 때에 오류 발생</p>
            </header>
            <div>
                <p>작업 내용</p>
                <ul>
                    <li>Escape Parser 구현: 번역팀이 번역한 파일의 특수문자 이스케이프가 누락되더라도, 자동으로 이스케이프 처리되어 병합되도록 자체 Escape Parser 로직을 구현</li>
                    <li>안정성 검증: 병합 시 발생할 수 있는 엣지 케이스에 대한 테스트 코드를 작성하여 무결성 검증</li>
                </ul>
            </div>
            <p>성과: 이스케이프로 인한 병합 문제 해소 및 휴먼 에러 제거, 번역 QA시간을 평균 2시간에서 30분으로 단축</p>
            <p>구현한 내용<p>
            <a href="https://github.com/yopyzzang/ng-extract-i18n-merge/commit/ff56e01c6354e3c8bd47910c457c7a0fb9111b7c">https://github.com/yopyzzang/ng-extract-i18n-merge/commit/ff56e01c6354e3c8bd47910c457c7a0fb9111b7c</a>
        </article>

        <article>
            <header>
                <h3>다국어 지원 서비스 검색 엔진 최적화</h3>
                <p>기간: <time datetime="2022-03">2022.03</time> - <time datetime="2022-04">2022.04</time></p>
                <p>팀 규모 및 역할: FE 4명 | FE 기여도 100%</p>
                <p>설계 배경: 다국어 지원 서비스임에도 불구하고, 메타 태그와 사이트맵이 언어별로 동적으로 처리되지 않아 다른 언어로 검색 시 결과가 노출되지 않고, 소셜 공유 시 항상 동일한 언어/이미지로 고정 노출되며, 동적 콘텐츠(이벤트 게시물 등)의 URL이 사이트맵에 포함되지 않는 문제가 있었음.</p>
            </header>
            <div>
                <p>작업 내용</p>
                <ul>
                    <li>동적 메타 태그 주입: 페이지 렌더링 전 유저의 언어 데이터를 주입받아 언어별 맞춤형 메타 태그를 설정</li>
                    <li>동적 사이트맵 미들웨어 구현: 검색 엔진 로봇의 색인 요청 시 주소의 언어에 따라 맞춤형 사이트맵 리스트를 생성하는 미들웨어 구현</li>
                </ul>
            </div>
            <p>성과: 구글 서치 콘솔 기준 검색 유입 유저 수 90% 증가. Lighthouse 기준 SEO 점수 16점 ➔ 92점으로 상승. 언어별 맞춤형 소셜 공유(OG tag) 노출 정상화.</p>
        </article>
        <article>
            <header>
                <h3>테마 시스템 라이브러리 구축</h3>
                <p>기간: <time datetime="2022-04">2022.04</time> - <time datetime="2022-08">2022.08</time></p>
                <p>팀 규모 및 역할: FE 4명 | FE 기여도 100%</p>
                <p>사용 기술: Angular Workspace, Gitlab NPM Package Registry</p>
                <p>설계 배경: 동일한 UI 코드의 중복 및 디자인 파편화 방지.</p>
            </header>
            <div>
                <p>작업 내용</p>
                <ul>
                    <li>공통 테마 시스템 개발: 레이아웃, 컬러, 버튼, 인풋 등 재사용성이 높은 UI 컴포넌트 라이브러리 구현</li>
                    <li>모노레포 설계 및 배포 자동화: 테마 라이브러리와 테스트 환경을 단일 레포지토리(모노레포)로 설계하고, Gitlab NPM Package Registry를 연동하여 사내 패키지 배포 전략 수립</li>
                </ul>
            </div>
            <p>성과: 일관된 UI/UX 스타일 적용 및 UI 관련 코드 중복을 80% 제거.</p>
        </article>

        <article>
            <header>
                <h3>Service Worker를 활용한 무중단 배포 알림 시스템 구현</h3>
                <p>기간: <time datetime="2023-02">2023.02</time> - <time datetime="2023-04">2023.04</time></p>
                <p>팀 규모 및 역할: FE 4명 | FE 기여도 100%</p>
                <p>사용 기술: Service Worker</p>
                <p>설계 배경: 사내 직원들이 사용하는 백오피스 서비스의 잦은 배포로 인해, 브라우저를 새로고침하기 전까지 업데이트가 반영되지 않아 발생하는 오작동 및 대면/메신저 커뮤니케이션 비용 절감을 위함.</p>
            </header>
            <div>
                <p>작업 내용</p>
                <ul>
                    <li>생명주기 기반 업데이트 감지: Service Worker의 상태(Lifecycle)를 관리하여, 신규 버전 배포 시 waiting 상태로 전환되는 이벤트를 감지하는 리스너 구현</li>
                    <li>UI 업데이트 트리거 구현: 업데이트 감지 시 화면에 팝업을 노출하고, 유저 클릭 시 skipWaiting 메소드를 호출하여 강제로 최신 버전을 적용하도록 구현</li>
                </ul>
            </div>
            <p>성과: 배포 안내를 위한 불필요한 사내 커뮤니케이션 비용 제거, 신규 버전 배포 시 사내 직원들의 즉각적인 인지 및 최신 버전 동기화.</p>
        </article>
    </article>
</article>
`
}
