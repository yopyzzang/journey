import {
  ACTION,
  APPSPEC,
  AUDIO,
  BASIC_SHADER,
  BEGINNING_ACTION,
  BEGINNING_CLIENT,
  BEGINNING_INFRA_STRUCT,
  BEGINNING_SIGNALING_SERVER,
  CLIENT,
  DELAYED_CAMERA,
  DOCKER_COMPOSE,
  EVENT_EMITTER,
  FLY_ANIMATION,
  INFRA_ACTION,
  INFRA_STRUCT,
  INIT_WEBGPU,
  INTERACTION,
  NGINX_CONFIG,
  OFFER_COLLISION,
  PROXY,
  REGISTER_SOCKET_EVENT,
  RESIZE_OBSERVER,
  SCENE_GRAPH,
  SUN_SHADER,
  TRS,
  TURN_CREDENTIAL,
  USEMESSAGE,
} from './client.js'

export function renderPage() {
  const html = /* language=html */ `
    <div id="app">
      <article id="moachat">
        <header><h2>모아챗</h2></header>
        <hr />
        <section aria-labelledby="implementation">
          <h3 id="implementation">시그널링 서버 구현</h3>
          <p class="description">
            초기 시그널링 서버 구현에서는 소켓의 ID를 기준으로 유저를 식별하도록 로직을 구현했습니다.
          </p>
          <figure>
            <figcaption><code>server.ts</code></figcaption>
            <pre><code>${BEGINNING_SIGNALING_SERVER}</code></pre>
          </figure>
          <p class="description">
            그러나 소켓 ID를 통해 유저를 식별하면 유저가 새로고침할 때마다 서버에서는 동일한 유저를 새로운 유저로 인식하게 되어 동일한 유저가 반복적으로 매칭되는 문제가 있었습니다.
          </p>
          <p class="description">
            해당 문제를 개선하기 위해 우선 브라우저 별로 고유한 식별자를 가져야한다고 생각해서, 클라이언트 접속 초기에 유저 별로 식별자를 proxy를 통해 응답 쿠키에 유저의 식별자를 담아 전송했습니다.
          </p>
          <figure>
            <figcaption><code>proxy.ts</code></figcaption>
            <pre><code>${PROXY}</code></pre>
          </figure>
          <p class="description">
            설정한 쿠키를 시그널링 서버와 통신할 때 auth 객체에 담아 전달하여 유저를 식별하도록 했습니다. <br />
            서버에서는 해당 쿠키의 값을 기준으로 동일한 유저가 매칭되지 않도록 필터링하여, 동일 유저의 반복적인 매칭 문제를 해결했습니다.
          </p>
        </section>

        <div style="height: 24px;"></div>

        <section aria-labelledby="implementation">
          <h3 id="implementation">인프라 환경 구축</h3>
          <p class="description">
            초기에는 AWS 서비스를 이용하면 배포와 인프라 관리를 빠르게 구성할 수 있다는 장점이 있어 클라우드 환경의 인프라를 구축했습니다.
          </p>
          <div style="height: 16px;"></div>
          
          <h4>클라우드 인프라 환경</h4>
          <p class="description">
            이미지 버전을 간편하게 롤백하고 관리할 수 있는 ECR을 선택했습니다.<br/>
            빌드된 도커 이미지를 ECR에 저장하고, CodeDeploy 에이전트를 통해 EC2에서 이미지를 가져와 컨테이너로 실행하도록 구성했습니다.
          </p>
          <figure>
            <figcaption><code>구조</code></figcaption>
            <pre><code>${BEGINNING_INFRA_STRUCT}</code></pre>
          </figure>
          <figure>
            <figcaption><code>build.yml</code></figcaption>
            <pre><code>${BEGINNING_ACTION}</code></pre>
          </figure>
          <figure>
            <figcaption><code>appspec.yml</code></figcaption>
            <pre><code>${APPSPEC}</code></pre>
          </figure>
          <p class="description">
            하지만 서비스를 운영하면서 클라우드 환경의 편의성만으로는 해결하기 어려운 문제들이 생겼습니다.
          </p>
          <p>데이터센터 노드에 문제가 발생하거나 외부 공격으로 인스턴스가 영향을 받는 상황을 경험했고, 배포 에이전트가 정상적으로 동작하지 않는 경우에는 제공되는 로그만으로 원인을 빠르게 파악하기 어려웠습니다. 또한 서비스를 지속적으로 운영하면서 발생하는 비용도 함께 고려하게 되었습니다.</p>
          <p class="description">
            이러한 경험을 통해 문제가 발생했을 때 직접 원인을 확인하고 인프라를 제어할 수 있는 범위를 확보할 필요가 있다고 판단했고, 운영 비용까지 고려하여 온프레미스 환경으로 전환했습니다.
          </p>
          <div style="height: 16px;"></div>

          <h4>온프레미스 인프라 환경</h4>
          <p class="description">
            별도의 이미지 레지스트리를 직접 운영하지 않고 Docker 이미지를 관리하기 위해 GHCR을 사용했습니다.<br /> 
            이미지가 GHCR에 push 되면, 별도로 생성한 인프라 레포지토리를 트리거하고,
            해당 레포지토리에서 SSH를 통해서 로컬 PC에 접속하여<br />
            GHCR에 저장된 최신 도커 이미지를 받아와 docker compose를 통해 묶어서 실행하도록 구현했습니다.
          </p>
          <p class="description">
            또한 Nginx를 리버스 프록시로 구성하여 외부 요청을 Docker 네트워크 내부의 서비스로 전달했습니다.
          </p>
          <figure>
            <figcaption><code>구조</code></figcaption>
            <pre><code>${INFRA_STRUCT}</code></pre>
          </figure>
          <figure>
            <figcaption><code>build.yml</code></figcaption>
            <pre><code>${ACTION}</code></pre>
          </figure>
          <figure>
            <figcaption><code>deploy.yml</code></figcaption>
            <pre><code>${INFRA_ACTION}</code></pre>
          </figure>
          <figure>
            <figcaption><code>default.conf</code></figcaption>
            <pre><code>${NGINX_CONFIG}</code></pre>
          </figure>

          <p class="description">
            종속적인 클라우드 환경에서 독립적인 온프레미스 환경으로 전환하면서 통제가 어려운 변수들을 줄일 수 있었고, 운영 비용을 연간 약 $288 절약할 수 있었습니다.
          </p>
        </section>

        <div style="height: 24px;"></div>

        <section aria-labelledby="implementation">
          <h3 id="implementation">Coturn 기반 TURN 서버 구축</h3>
          <p class="description">
            기존에는 STUN 공개 서버로만 유저의 공인IP와 포트를 가져와 상대 피어와 P2P 연결을 지원했습니다. <br />
            그러나, 대칭형 NAT환경(Symmetric NAT)에서는 목적지가 달라질 때마다 공인 포트도 새로 발급하기 때문에
            STUN 서버가 알아낸 주소의 포트와 실제 상대 피어와 통신할 때의 포트가 다르게 매핑되어 피어 연결이 되지 않는 문제가 있었습니다.
          </p>
          <p class="description">
            그래서 Coturn 기반 STUN/TURN 릴레이 서버를 구축하여, STUN으로 연결 가능한 세션에 대해서는 P2P로 연결하고,
            실패할 경우에만 TURN 서버가 할당한 중계 주소를 거쳐 트래픽을 릴레이하도록 했습니다.
          </p>
          <p class="description">
            또한 무단 TURN Relay 사용을 방지하기 위해
            TURN REST API 표준 방식(timestamp 기반 만료 + HMAC-SHA1 서명)에 따라 유효기간이 있는 임시 credential을 발급하도록 했고,
            Docker 가상 네트워크 주소를 공인 IP와 매핑하여 컨테이너 환경에서 발생하는 IP 불일치 이슈를 해결했습니다.
          </p>
          <figure>
            <figcaption><code>server.ts</code></figcaption>
            <pre><code>${TURN_CREDENTIAL}</code></pre>
          </figure>
          <figure>
            <figcaption><code>docker-compose.yml</code></figcaption>
            <pre><code>${DOCKER_COMPOSE}</code></pre>
          </figure>
          <p class="description">
            위 작업들 이후, P2P 연결이 어려운 네트워크 환경에서도 TURN Relay를 통한 연결이 정상적으로 이루어지는 것을 확인했습니다.
          </p>
        </section>
        
        <div style="height: 24px;"></div>

        <section aria-labelledby="implementation">
          <h3 id="implementation">WebRTC 라이브러리 구현</h3>
          <p class="description">
            WebRTC의 연결 상태와 생명주기, 시그널링 이벤트를 React 컴포넌트에서 함께 관리하면서 UI 코드의 복잡도가 증가했습니다.<br />
            이를 해결하기 위해 WebRTC 관련 상태와 로직을 별도의 클래스로 추상화하고 라이브러리로 분리했습니다.
          </p>
          <figure>
            <figcaption><code>chat.tsx</code></figcaption>
            <pre><code>${BEGINNING_CLIENT}</code></pre>
          </figure>
          <p class="description">
            기존 리액트 클라이언트 코드에서는 socket, peerConnection 등을 관리하기 위해,
            instance 변수를 선언하고 WebRTC 로직을 해당 컴포넌트에서 관리했습니다.
          </p>
          <p class="description">
            그러다보니 자연스럽게 기능의 추가, 핸들링 과정에서 복잡도가 증가하여,
            라이브러리를 통해 소켓 이벤트들을 클래스 초기화 과정에서 등록하도록 구현했습니다. 
          </p>
          <figure>
            <figcaption><code>WebRTCClient Library</code></figcaption>
            <pre><code>${REGISTER_SOCKET_EVENT}</code></pre>
          </figure>
          <p class="description">
            Socket 이벤트 등록과 WebRTC 연결 상태는 클래스 내부에서 관리하고,
            리액트에는 필요한 기능과 이벤트만 노출하도록 경계를 만들었습니다.
          </p>
          <figure>
            <figcaption><code>useConnection.ts</code></figcaption>
            <pre><code>${CLIENT}</code></pre>
          </figure>
          <p class="description">
            이 구조로 변경하면서 리액트에서는 WebRTC 내부 상태에 따른 이벤트 처리에서 벗어나고, WebRTC의 연결과 생명주기는 WebRTCClient가 독립적으로 관리하도록 했습니다.
          </p>
          <div style="height: 16px;"></div>
          
          <h4>Event Emitter 패턴 도입</h4>
          <p class="description">
            라이브러리 내부에서 발생하는 WebRTC 이벤트를 React가 필요한 형태로 구독할 수 있도록<br />
            on() / off() 기반의 Event Emitter 인터페이스를 구현했습니다. 
          </p>
          <figure>
            <figcaption><code>WebRTCClient Library</code></figcaption>
            <pre><code>${EVENT_EMITTER}</code></pre>
          </figure>
          <figure>
            <figcaption><code>useMessage.ts</code></figcaption>
            <pre><code>${USEMESSAGE}</code></pre>
          </figure>
          
          <div style="height: 16px;"></div>
          
          <h4>Offer Collision 처리</h4>
          <p class="description">
            동시에 Offer가 생성되는 충돌 상황을 처리하기 위해 라이브러리에서 Polite / Impolite 역할을 적용했습니다. <br />
            이 구현에선 연결을 시작하는 Caller를 Impolite, Offer를 수신하는 Callee를 Polite로 지정했습니다.
          </p>
          <figure>
            <figcaption><code>WebRTCClient Library</code></figcaption>
            <pre><code>${OFFER_COLLISION}</code></pre>
          </figure>
        </section>
        <p class="description">
          WebRTC 라이브러리를 구현하면서 UI를 담당하는 리액트 클라이언트와 경계를 분리하여, 각 역할에 맞춰 보다 더 충실한 개발을 할 수 있게 되었습니다. 
        </p>
      </article>
      
      <div style="height: 24px;"></div>

      <article class="detail-container" id="carrot">
        <header><h2>당근의 여정</h2></header>
        <hr />
        <p class="description">
          브라우저에서 더 다양한 표현과 몰입감을 주기 위해 WebGPU를 통해 개발한 게임입니다.
        </p>
        
        <div style="height: 24px;"></div>
        
        <section aria-labelledby="implementation">
          <h3 id="implementation">WebGPU 환경 초기화</h3>
          <p class="description">
            WebAPI를 사용하여 GPU Device와 Canvas Context를 초기화하고,
            브라우저가 권장하는 Canvas 포맷을 사용하도록 구성했습니다.
          </p>
          <figure>
            <figcaption><code>init.ts</code></figcaption>
            <pre><code>${INIT_WEBGPU}</code></pre>
          </figure>
          <p class="description">
            브라우저 환경에 따라 WebGPU를 사용할 수 없는 경우도 있기 때문에 Adapter와 Device 생성 단계에서 예외를 처리했습니다.<br />
            또한 devicePixelRatio를 렌더링에 반영하고 ResizeObserver를 사용해 Canvas의 실제 렌더링 영역을 브라우저 크기에 맞춰 갱신하도록 구성했습니다.
          </p>
          <figure>
            <figcaption><code>resizeObserver.ts</code></figcaption>
            <pre><code>${RESIZE_OBSERVER}</code></pre>
          </figure>
          <p class="description">
            이를 통해 디바이스의 픽셀 비율과 Canvas 크기를 함께 고려하면서 화면 크기가 변경되어도 렌더링 영역을 다시 구성할 수 있도록 했습니다.
          </p>
        </section>
        
        <div style="height: 24px;"></div>
        
        <section aria-labelledby="implementation">
          <h3 id="implementation">Scene Graph와 TRS를 통한 객체 관리</h3>
          <p class="description">
            캐릭터가 몸통, 이파리의 Mesh로 구성되다 보니, 각 파츠를 개별 좌표로 관리하면 몸통과 이파리의 파츠를 함께 관리하기 어려웠습니다. <br />
            부모의 변환이 자식에게 자동으로 전파되는 계층 구조가 필요했고, 이를 위해 부모와 자식 관계를 갖는 Scene Graph를 활용했습니다.
          </p>
          <p class="description">
            각 노드는 자신의 로컬 좌표를 가지고 있고, 부모 노드의 World Matrix를 기준으로 자신의 World Matrix를 계산합니다.
          </p>
          <figure>
            <figcaption><code>scene-graph.ts</code></figcaption>
            <pre><code>${SCENE_GRAPH}</code></pre>
          </figure>
          <p class="description">
            이 구조를 사용하면서 하나의 모델을 여러 노드로 나누어 관리할 수 있게 되었고, 부모의 이동이나 회전이 자식 Mesh의 위치에 자연스럽게 반영되도록 구성했습니다.
          </p>
          <p class="description">
            노드의 이동, 회전, 스케일은 별도의 TRS 클래스로 관리했습니다.
          </p>
          <figure>
            <figcaption><code>TRS.ts</code></figcaption>
            <pre><code>${TRS}</code></pre>
          </figure>
          <p class="description">
            Scene Graph는 객체의 관계를 관리하고, TRS는 개별 노드의 변환을 담당하도록 역할을 분리했습니다.<br />
            이를 통해 렌더러에서는 객체의 구체적인 변환 구현을 알지 않고도 각 노드의 World Matrix를 이용해 렌더링할 수 있도록 구성했습니다.
          </p>
        </section>
        
        <div style="height: 24px;"></div>
        
        <section aria-labelledby="implementation">
          <h3 id="implementation">WGSL 셰이더 구성</h3>
          <p class="description">
            기본 셰이더에서는 정점 위치와 색상 정보를 하나의 인터리브된 버퍼에 함께 저장해 Vertex 입력을 단일 버퍼에서 처리하도록 구성했습니다.
          </p>
          <figure>
            <figcaption><code>basic.wgsl</code></figcaption>
            <pre><code>${BASIC_SHADER}</code></pre>
          </figure>
          <p class="description">
            태양처럼 빛나는 효과를 표현하고 싶었지만, 텍스처를 직접 제작할 아트 리소스가 없었습니다. 
            그래서 이미지 리소스(텍스처) 대신 셰이더 내부의 수학적 계산만으로 형태와 밝기를 만드는 절차적(procedural) 접근을 택했습니다.
          </p>
          <p class="description">
            태양은 중심부와 주변으로 확산되는 빛을 거리 기반 계산(smoothstep, exp)으로 표현하고, 시간값을 이용해 밝기가 미세하게 점멸하도록 구현했습니다.
          </p>
          <figure>
            <figcaption><code>sun.wgsl</code></figcaption>
            <pre><code>${SUN_SHADER}</code></pre>
          </figure>
          <p class="description">
            텍스처 없이 수식으로 몰입감 있는 빛 표현이 가능하다는 것을 확인했고,
            리소스의 제약이 오히려 그래픽스 계산을 더 깊이 이해하게 된 계기가 되었습니다.
          </p>
        </section>
        
        <div style="height: 24px;"></div>
        
        <section aria-labelledby="implementation">
          <h3 id="implementation">카메라 지연 추적</h3>
          <p class="description">
            초기에는 카메라를 캐릭터의 자식 노드로 두는 방법도 고려했지만, 해당 방법으로 구현할 경우에는 부모의 좌표가 매 프레임 자식에게 즉시 그대로 전파되기 때문에, 물체의 급작스러운 이동에 카메라도 그대로 반응해 멀미를 유발하는 문제가 있었습니다.
          </p>
          <p class="description">
            그래서 카메라를 독립적인 노드로 분리하고, lerp를 이용해 현재 위치와 목표 위치 사이를 매 프레임 선형 보간하면서,
            타겟에 가까워질수록 이동량이 줄어드는 형태로 카메라 움직임을 구현했습니다.
          </p>
          <figure>
            <figcaption><code>renderer.ts</code></figcaption>
            <pre><code>${DELAYED_CAMERA}</code></pre>
          </figure>
          <p class="description">
            이를 통해 물체의 움직임을 즉각적으로 따라가는 대신, 일정한 지연을 가진 카메라 움직임을 만들었습니다.
          </p>
        </section>
        
        <div style="height: 24px;"></div>
        
        <section aria-labelledby="implementation">
          <h3 id="implementation">애니메이션 구현</h3>
          <p class="description">
            인터렉션을 통해 회전 값이 150을 초과하면, 정의한 애니메이션 시간 별로 구간을 나누어 특정 애니메이션이 실행되도록 구현했습니다.
          </p>
          <figure>
            <figcaption><code>fly.ts</code></figcaption>
            <pre><code>${FLY_ANIMATION}</code></pre>
          </figure>
          <p class="description">
            해당 애니메이션은 회전 값이 정의한 값을 초과하면 플레이어에 조작권을 가져가는 일회성 연출이라서,<br />
            페이즈마다 별도의 함수를 호출하는 switch 분기가 잘 맞아떨어졌습니다.
          </p>
          <p class="description">
            그러나, 이동 애니메이션 같은 경우에는 플레이어가 매 프레임 입력을 통해 이동하는 연속 루프 안에서 실행되기 때문에,<br />
            같은 패턴을 적용하지 않고 상태를 하나의 연속된 파라미터로 다루는 방식으로 구현했습니다.
          </p>
        </section>
        
        <div style="height: 24px;"></div>
        
        <section aria-labelledby="implementation">
          <h3 id="implementation">특정 구간에서의 오디오 재생</h3>
          <p class="description">
            브라우저의 자동 재생 정책으로 인해 사용자 제스처 없이 음성이 포함된 오디오를 바로 재생할 수 없기 때문에,
            초기 사용자 입력을 오디오 재생의 시작점으로 사용했습니다.
          </p>
          <p class="description">
            단, 특정 시점에 오디어를 재생했어야 했기 때문에 초기 볼륨을 0으로 설정하고, 애니메이션 함수에서 delta time를 인자로 넘겨주어 음량을 서서히 키우도록 구현했습니다.
            그리고 초기 사용자 입력을 통해 오디오가 재생되기 때문에, 특정 구간에서 updateBgm 함수를 실행한다면 이미 사용자의 제스처에 의해 재생되었던 음악의 시간을 0으로 초기화하여 항상 음악의 시작부터 재생되게끔 했습니다.
          </p>
          <figure>
            <figcaption><code>interaction.ts</code></figcaption>
            <pre><code>${INTERACTION}</code></pre>
          </figure>
          <figure>
            <figcaption><code>audio.ts</code></figcaption>
            <pre><code>${AUDIO}</code></pre>
          </figure>
        </section>
        <section aria-labelledby="result">
          <p class="description">
            이번 프로젝트에서는 WebGPU를 단순히 사용하는 데 그치지 않고, 3D 객체 관리와 렌더링에 필요한 구조를 직접 구성했습니다.

            Scene Graph와 TRS를 분리해 객체의 관계와 변환을 관리하고, WGSL로 렌더링 효과를 직접 구현했으며, 카메라와 오디오처럼 게임 동작에 필요한 런타임 로직까지 연결했습니다.

            그 과정에서 브라우저의 Canvas, Web API, GPU 리소스가 서로 연결되는 구조를 직접 다뤄보면서 프론트엔드 UI를 구현하는 것과 GPU 기반 렌더링 시스템을 구성하는 것의 차이를 경험할 수 있었습니다.          </p>
        </section>
      </article>
    </div>
  `
  const clientScript = 'src/pages/projects/client.ts'

  return { html, clientScript }
}
