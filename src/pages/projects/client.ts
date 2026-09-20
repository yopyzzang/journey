import { highlightCode } from '../../utils/highlight.js'

const BEGINNING_SIGNALING_SERVER = highlightCode(
  `socket.on('join chat', () => {
  for (const room of rooms) {
    if (room.users.length === 1) {
        userRoom = room;
        break;
    }
  }
    
  if (!userRoom) {
      const newRoomId = crypto.randomBytes(10).toString('hex');
      userRoom = { id: newRoomId, users: [] };
      rooms.push(userRoom);
  }
  userRoom.users.push(socket.id); // userRoom 객체에 socket.id를 유저의 식별자로 설정
  
  const otherUser = userRoom.users.find((id) => id !== socket.id);
  if (otherUser) {
      socket.emit('other user', otherUser);
      socket.to(otherUser).emit('user joined', socket.id);
  }
});
`,
  'typescript',
)

const PROXY = highlightCode(
  `const COOKIE_OPTION = {
  httpOnly: true,
  path: '/',
  maxAge: 60 * 60 * 24,
};

export function proxy(request: NextRequest) {
  const id = request.cookies.has('id');
  const response = NextResponse.next();

  if (!id) {
    const randomUUID = crypto.randomUUID();
    response.cookies.set('id', randomUUID, COOKIE_OPTION);
  }

  return response;
}`,
  'typescript',
)

const BEGINNING_INFRA_STRUCT = highlightCode(
  `Github actions -> Docker build -> AWS ECR -> AWS CodeDeploy -> EC2`,
  'plaintext',
)
const BEGINNING_ACTION = highlightCode(
  `- name: Build Docker image
  run: docker build -t IMAGE_NAME:latest .

- name: Push Docker image to ECR
- run: docker push ECR.amazonaws.com/moachat:IMAGE_NAME

- name: Create CodeDeploy Deployment
  run: aws deploy create-deployment...
`,
  'yaml',
)
const APPSPEC = highlightCode(
  `version: 0.0
os: linux
hooks:
  ApplicationStart:
    - location: scripts/application-start.sh
      timeout: 300`,
  'yaml',
)

const INFRA_STRUCT = highlightCode(
  `Github actions -> Docker build -> GHCR -> SSH -> On-premise server`,
  'plaintext',
)

const ACTION = highlightCode(
  `- name: Build Docker Image
  run: |
    docker build --secret id=npm_token,env=NPM_TOKEN -t ghcr.io/...

- name: Login to GHCR
  run: |
    echo \${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io...

- name: Push Docker Image
  run: |
    docker push ghcr.io/...

- name: Trigger Infra Deploy
  uses: peter-evans/repository-dispatch@v3
  with:
    token: \${{ secrets.PERSONAL_ACCESS_TOKEN }}
    repository: \${{ github.repository_owner }}/infra
    event-type: deploy-trigger
`,
  'yaml',
)
const INFRA_ACTION = highlightCode(
  `on:
  workflow_dispatch:
  repository_dispatch:
    types: [deploy-trigger]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Copy Files to On-Prem Server
        uses: appleboy/scp-action@v1
        with:
          source: "docker-compose.yml,nginx/**,coturn/**"
          target: /Users/\${{ secrets.SERVER_USER }}/...

      - name: Pull Latest Images and Restart Containers
        uses: appleboy/ssh-action@v1
        with:
          script: |
            ...
            $DOCKER_PATH compose pull
            $DOCKER_PATH compose up -d --remove-orphans
`,
  'yaml',
)

const NGINX_CONFIG = highlightCode(
  `server {
    listen 443 ssl;
    server_name ...;

    ssl_certificate /etc/letsencrypt/live/...;
    ssl_certificate_key /etc/letsencrypt/live/...;

    # 비정상적인 Server Action 요청을 차단
    if ($http_next_action ~ "^.{1,10}$") {
        return 444;
    }

    location /socket.io/ {
        proxy_pass http://server:4000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://client:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`,
  'nginx',
).replace(/&quot;/g, '"')

const TURN_CREDENTIAL = highlightCode(
  `function generateTurnCredentials(userId: string): RTCIceServer[] {
  const ttl = 600;
  const timestamp = Math.floor(Date.now() / 1000) + ttl;
  const username = \`\${timestamp}:\${userId}\`;

  const secret = process.env.TURN_SECRET;
  const host = process.env.TURN_HOST;

  if (!secret || !host) {
      throw new Error(
          'TURN_SECRET or TURN_HOST is missing in environment variables'
      );
  }

  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(username);
  const credential = hmac.digest('base64');

  // 구글 STUN을 fallback으로 사용
  return [
      {
          urls: \`stun:stun.l.google.com:19302\`
      },
      {
          urls: \`stun:\${host}:3479\`,
      },
      {
          urls: [
              \`turn:\${host}:3479?transport=udp\`,
              \`turn:\${host}:3479?transport=tcp\`,
          ],
          username: username,
          credential: credential,
      },
  ];
}

// 매칭 시작 시 상대방과 본인의 ICE 서버를 발급 후 emit
const currentIceServers = generateTurnCredentials(clientID);
const partnerIceServers = generateTurnCredentials(partnerID);

currentSession.socket.emit('caller', {
    id: partnerSession.socket.id,
    iceServers: currentIceServers
});

partnerSession.socket.emit('callee', {
    id: currentSession.socket.id,
    iceServers: partnerIceServers
});`,
  'typescript',
)

const DOCKER_COMPOSE = highlightCode(
  `networks:
  app-network:
    ipam:
      config:
        - subnet: 172.20.0.0/16
        
  coturn:
    image: coturn/coturn:latest
    container_name: moachat_coturn
    restart: unless-stopped
    env_file:
      - .env
    command: >
      -c /etc/coturn/turnserver.conf
      --static-auth-secret=\${TURN_SECRET}
      --external-ip=\${TURN_HOST}/172.20.0.10
    ports:
      - "3479:3479/udp"
      - "3479:3479/tcp"
      - "49152-49200:49152-49200/udp"
    volumes:
      - ./coturn/turnserver.conf:/etc/coturn/turnserver.conf:ro
    networks:
      app-network:
        ipv4_address: 172.20.0.10`,
  'yaml',
)

const BEGINNING_CLIENT = highlightCode(
  `// Before
const peerConnection = useRef<RTCPeerConnection>();
const socket = useRef<Socket>();
const sendChannel = useRef<RTCDataChannel>();
const userID = useRef<string>();

const [connectionState, setConnectionState] = useState<boolean>();
const [concurrentUsers, setConcurrentUsers] = useState<number>(1);

function initiateChat(id: string, isInitializer: boolean) {
  const pc = new RTCPeerConnection({
    iceServers: process.env.SERVER_LIST,
  });
  userID.current = id;
  peerConnection.current = pc;

  if (isInitializer) {
    sendChannel.current = pc.createDataChannel('sendChannel');
    sendChannel.current.onmessage = handleReceiveMessage;
    pc.onnegotiationneeded = handleNegotiationNeededEvent;
  }

  pc.onicecandidate = handleICECandidateEvent;
  pc.onconnectionstatechange = handleConnectionStateChange;
}

// handleOffer, handleICECandidateEvent, handleNegotiationNeededEvent...
// 위와 같은 WebRTC의 이벤트 핸들러들이 UI로직과 결합되어 있었습니다.

useEffect(() => {
  socket.current = io(process.env.API_URL);

  socket.current.emit('join chat');
  socket.current.on('other user', (id: string) => initiateChat(id, true));
  socket.current.on('user joined', (id: string) => initiateChat(id, false));

  socket.current.on('offer', handleOffer);
  socket.current.on('answer', handleAnswer);
  socket.current.on('ice-candidate', handleNewICECandidateMsg);
  socket.current.on('users', (users: number) => setConcurrentUsers(users));
  socket.current.on('user exit', handleUserExit);
}, []);`,
  'typescript',
)

const REGISTER_SOCKET_EVENT = highlightCode(
  `export class WebRTCClient {
  
  constructor(private readonly socket: Socket) {
    this.registerSocketEvents();
  }
  
  private registerSocketEvents() {
    this.socket.on('caller', ...)
    this.socket.on('callee', ...)
    this.socket.on('offer', ...)
    this.socket.on('answer', ...)
    this.socket.on('ice-candidate', ...)
    this.socket.on('user exit', ...)
  }
  
  connect() {
    this.socket.emit('find match');
  }

  disconnect() {
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }
  
    if (this.peerConnection) {
      this.removeTracks();
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.partnerID = null;
  }
}`,

  'typescript',
)

const CLIENT = highlightCode(
  `// After
const [socket] = useState(() =>
  io(process.env.NEXT_PUBLIC_API_URL!, {
    auth: { id: clientID },
    autoConnect: false,
  })
);
const [client] = useState(() => new WebRTCClient(socket));

useEffect(() => {
  socket.connect();
  client.connect();
  
  return () => {
    socket.disconnect();
    client.disconnect();
  }
}, [])
`,
  'typescript',
)

const EVENT_EMITTER = highlightCode(
  `private emit<K extends keyof WebRTCEvents>(
  event: K,
  ...args: Parameters<NonNullable<WebRTCEvents[K]>>
) {
  this.listeners[event]?.forEach((cb) => {
    (cb as any)(...args);
  });
}

on<K extends keyof WebRTCEvents>(event: K, callback: WebRTCEvents[K]) {
  if (!this.listeners[event]) {
    this.listeners[event] = [];
  }
  this.listeners[event].push(callback);
}

off<K extends keyof WebRTCEvents>(event: K, callback: WebRTCEvents[K]) {
  const callbacks = this.listeners[event];
  if (!callbacks) return;

  const index = callbacks.indexOf(callback);
  if (index !== -1) callbacks.splice(index, 1);
}

// 예를 들어, onmessage 이벤트 발생 시,
// 해당 이벤트를 리스너에 등록하고 리액트 클라이언트에서 on 메소드를 통해 구독할 수 있도록 했습니다.
this.dataChannel.onmessage = (event) => {
  this.emit('message', event);
};`,
  'typescript',
)

const USEMESSAGE = highlightCode(
  `export function useMessage(client: WebRTCClient) {
    const [messages, setMessages] = useState<Message[]>([]);
    
    useEffect(() => {
      if (!client) return;
      client.on('message', handleMessage);
      
      return () => {
        client.off('message', handleMessage);
      };
    }, []);
}`,
  'typescript',
)

const OFFER_COLLISION = highlightCode(
  `// caller (initiator)
this.socket.on(
  'caller',
  ({ id, iceServers }: { id: string; iceServers: RTCIceServer[] }) => {
    this.partnerID = id;
    this.isPolite = false;
    
    //...
});

// callee (receiver)
this.socket.on(
  'callee',
  ({ id, iceServers }: { id: string; iceServers: RTCIceServer[] }) => {
    this.partnerID = id;
    this.isPolite = true;
  
    //...
});

this.socket.on('offer', async (payload: Payload) => {
  // offer가 발생했을 때 또는 현재 시그널링 상태가 stable가 아닐 경우를 충돌이 난 경우로 판단
  const offerCollision =
    this.isMakingOffer || this.peerConnection?.signalingState !== 'stable';
  
  // Impolite peer는 협상 충돌이 발생하면 상대 Offer를 무시
  const ignoreOffer = !this.isPolite && offerCollision;
  if (ignoreOffer) return;

  try {
    const desc = new RTCSessionDescription(payload.sdp);

    await this.peerConnection!.setRemoteDescription(desc);
    const answer = await this.peerConnection!.createAnswer();
    await this.peerConnection!.setLocalDescription(answer);

    this.socket.emit('answer', {
      target: payload.caller,
      caller: this.socket.id,
      sdp: this.peerConnection!.localDescription,
    });
  } catch (err) {
    console.error('Error handle offer', err);
  }
});
`,
  'typescript',
)

const INIT_WEBGPU = highlightCode(
  `export async function initWebGPU() {
  if (!navigator.gpu) {
    throw new Error('WebGPU를 지원하지 않는 브라우저입니다.')
  }
  const adapter = await navigator.gpu.requestAdapter()
  if (!adapter) {
    throw new Error('적합한 GPU 어댑터를 찾을 수 없습니다.')
  }

  const device = await adapter.requestDevice()
  const dpr = window.devicePixelRatio || 1
  const canvas = document.querySelector('canvas') as HTMLCanvasElement
  const context = canvas.getContext('webgpu') as GPUCanvasContext
  const format = navigator.gpu.getPreferredCanvasFormat()

  if (!context) {
    throw new Error('GPUCanvasContext를 찾을 수 없습니다.')
  }
  context.configure({ device, format })

  return { canvas, context, device, dpr, format }
}`,
  'typescript',
)

const RESIZE_OBSERVER = highlightCode(
  `export function resizeObserver(
  canvasElement: HTMLCanvasElement,
  device: GPUDevice,
  dpr: number,
) {
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const canvas = entry.target as HTMLCanvasElement
      const width = entry.contentBoxSize[0].inlineSize * dpr
      const height = entry.contentBoxSize[0].blockSize * dpr
      canvas.width = Math.max(
        1,
        Math.min(width, device.limits.maxTextureDimension2D),
      )
      canvas.height = Math.max(
        1,
        Math.min(height, device.limits.maxTextureDimension2D),
      )
    }
  })
  observer.observe(canvasElement)
}
`,
  'typescript',
)

const SCENE_GRAPH = highlightCode(
  `updateWorldMatrix() {
  this.source?.getMatrix(this.localMatrix)

  if (this.parent) {
    mat4.multiply(this.parent.worldMatrix, this.localMatrix, this.worldMatrix)
  } else {
    mat4.copy(this.localMatrix, this.worldMatrix)
  }

  this.children.forEach((child) => {
    child.updateWorldMatrix()
  })
}
`,
  'typescript',
)
const TRS = highlightCode(
  `getMatrix(dst: Float32Array<ArrayBuffer>) {
  mat4.translation(this.translation, dst)
  mat4.rotateX(dst, this.rotation[0], dst)
  mat4.rotateY(dst, this.rotation[1], dst)
  mat4.rotateZ(dst, this.rotation[2], dst)
  mat4.scale(dst, this.scale, dst)

  return dst
}`,
  'typescript',
)

const BASIC_SHADER = highlightCode(
  `struct Uniforms {
  matrix4: mat4x4f,
  color: vec4f,
}

struct Vertex {
  @location(0) position: vec4f,
  @location(1) color: vec4f,
}

struct VSOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f,
}

@group(0) @binding(0) var<uniform> uni: Uniforms;

@vertex
fn vs(vert: Vertex) -> VSOutput {
  var vsOut: VSOutput;
  vsOut.position = uni.matrix4 * vert.position;
  vsOut.color = vert.color;

  return vsOut;
}

@fragment
fn fs(vsOut: VSOutput) -> @location(0) vec4f {
  return vsOut.color * uni.color;
}`,
  'plaintext',
)

const SUN_SHADER = highlightCode(
  `struct Uniforms {
  matrix4: mat4x4f,
  time: f32,
  intensity: f32,
}

struct VertexInput {
  @location(0) position: vec4f,
  @location(1) color: vec4f,
}

struct VSOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@group(0) @binding(0) var<uniform> uni: Uniforms;

@vertex
fn vs(vert: VertexInput) -> VSOutput {
  var vsOut: VSOutput;
  vsOut.position = uni.matrix4 * vert.position;

  vsOut.uv = vert.position.xy / 48.0;

  return vsOut;
}

@fragment
fn fs(vsOut: VSOutput) -> @location(0) vec4f {
  let dist = length(vsOut.uv);
  let core = smoothstep(0.15, 0.0, dist) * 2.5;
  let corona = exp(-dist * 6.0) * 1.5;

  let totalLight = core + corona;
  let flicker = sin(uni.time * 3.0) * 0.05 + 0.95;

  let sunColor = vec3f(1.0, 0.85, 0.6);

  let finalColor = sunColor * totalLight * uni.intensity * flicker;

  return vec4f(finalColor, totalLight * uni.intensity);
}`,
  'plaintext',
)

const DELAYED_CAMERA = highlightCode(
  `// renderer.ts
if (targetSource.translation[2] < FOLLOW_THRESHOLD_Z) {
  cameraOffsetZ = lerp(
    cameraOffsetZ,
    targetSource.translation[2] + CHASE_DISTANCE_Z,
    0.005,
  )
}
`,
  'typescript',
)

const AUDIO = highlightCode(
  `let bgm: HTMLAudioElement | null = null
let hasStartedAudible = false

const BGM_SRC = '/music/The_Earnest_Star.mp3'
const BGM_TARGET_VOLUME = 0.4
const BGM_FADE_RATE = 0.15

export function unlockBgm() {
  if (bgm) return

  bgm = new Audio(BGM_SRC)
  bgm.loop = true
  bgm.volume = 0
  bgm.play().catch((err) => {
    console.error(err.name, err.message)

    if (err.name === 'NotAllowedError') {
      bgm = null
    }
  })
}

export function updateBgm(dt: number) {
  if (!bgm) return

  if (!hasStartedAudible) {
    hasStartedAudible = true
    bgm.currentTime = 0
  }

  bgm.volume = Math.min(BGM_TARGET_VOLUME, bgm.volume + BGM_FADE_RATE * dt)  
}

// move.ts (animation)에서 특정 구간에 deltaTime를 인자 값으로 주어 음악을 재생했습니다.
if (worldZ < WEATHER_ZONE.SNOW_START) updateBgm(dt)
`,
  'typescript',
)

const INTERACTION = highlightCode(
  `const handleDown = (clientX: number) => {
    unlockBgm()
    state.isDragging = true
    state.isPressing = true
    state.lastX = clientX
  }
  
  canvas.addEventListener('mousedown', (e) => handleDown(e.clientX))
  canvas.addEventListener('mousemove', (e) => handleMove(e.clientX))

`,
  'typescript',
)

const FLY_ANIMATION = highlightCode(
  `
const TIMING = {
  CHARGE: 2.0,
  FLY: 2.5,
  HOVER: 1.5,
  FALL: 1.5,
  BOUNCE: 2.0,
}
const MILESTONE = {
  HOVER_START: TIMING.CHARGE + TIMING.FLY,
  SEPARATE_START: TIMING.CHARGE + TIMING.FLY + TIMING.HOVER,
  BOUNCE_START: TIMING.CHARGE + TIMING.FLY + TIMING.HOVER + TIMING.FALL,
  DONE: TIMING.CHARGE + TIMING.FLY + TIMING.HOVER + TIMING.FALL + TIMING.BOUNCE,
}
type FlightPhase =
  'idle' | 'charge' | 'fly' | 'hover' | 'separate' | 'bounce' | 'done'

function getFlightPhase(elapsed: number): FlightPhase {
  if (flyStartTime === -1) return 'idle'
  if (elapsed < TIMING.CHARGE) return 'charge'
  if (elapsed < MILESTONE.HOVER_START) return 'fly'
  if (elapsed < MILESTONE.SEPARATE_START) return 'hover'
  if (elapsed < MILESTONE.BOUNCE_START) return 'separate'
  if (elapsed < MILESTONE.DONE) return 'bounce'
  return 'done'
}

let currentPhase: FlightPhase | '' = ''

export function fly(
  animationNode: SceneGraphNode[],
  time: number,
  interaction: ReturnType<typeof createInteractionState>,
) {
  const absRotation = Math.abs(interaction.rotationY)

  if (absRotation > 150 && flyStartTime === -1) {
    flyStartTime = time
    startRotation = interaction.rotationY
    rotationDirection = Math.sign(interaction.rotationY)
  }

  const elapsed = time - flyStartTime
  const phase = getFlightPhase(elapsed)

  if (currentPhase !== phase) {
    currentPhase = phase
    
    // 노출되는 자막
    const subtitleDiv = document.getElementById('subtitle')
    if (subtitleDiv) {
      subtitleDiv.innerHTML = SUBTITLE[currentPhase] || ''
    }
  }
  animationNode.forEach((node) => {
    switch (phase) {
      case 'idle':
        idle(node, interaction.rotationY)
        break
      case 'charge':
        charge(elapsed, node)
        break
      case 'fly':
        flight(elapsed, node)
        break
      case 'hover':
        hover(elapsed, node)
        break
      case 'separate':
        separate(elapsed, node)
        break
      case 'bounce':
        bounce(elapsed, node)
        break
      default:
        done(elapsed, node, interaction)
        return
    }
  })
}`,
  'typescript',
)
export {
  BEGINNING_SIGNALING_SERVER,
  BEGINNING_CLIENT,
  BEGINNING_ACTION,
  PROXY,
  ACTION,
  CLIENT,
  BEGINNING_INFRA_STRUCT,
  INFRA_ACTION,
  INFRA_STRUCT,
  APPSPEC,
  NGINX_CONFIG,
  REGISTER_SOCKET_EVENT,
  OFFER_COLLISION,
  EVENT_EMITTER,
  USEMESSAGE,
  DOCKER_COMPOSE,
  TURN_CREDENTIAL,
  INIT_WEBGPU,
  RESIZE_OBSERVER,
  SCENE_GRAPH,
  TRS,
  BASIC_SHADER,
  SUN_SHADER,
  DELAYED_CAMERA,
  FLY_ANIMATION,
  INTERACTION,
  AUDIO,
}
