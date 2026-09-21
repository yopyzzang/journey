export async function renderPage() {
  const html = `
<canvas></canvas>
<div id="ui-layer" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
  <div id="subtitle" style="position: absolute; top: 60%; width: 100%; text-align: center; color: white; font-size: clamp(16px, 4vw, 24px); font-weight: bold; line-height: 1.4; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); white-space: pre-wrap; transition: opacity 0.3s;">
  </div>
</div>
<div id="fade-out" style="position: fixed; inset: 0; background: white; opacity: 0; pointer-events: none; transition: opacity 2s ease-in;">
    <div id="credits" style="height: 100%; display: flex; flex-direction: column; row-gap: 16px; align-items: center; justify-content: center; color: black; opacity: 0; transition: opacity 3s ease-in-out 6s;">
        <h2 style="color: black">당근의 여정</h2>
        <div>
            <p>플레이해주셔서 감사합니다.</p>
            <p>아래 링크에서 자세한 여정을 확인하실 수 있습니다.</p>
            <a href="/projects#carrot">자세히 보기</a>
        </div>
    </div>
</div>
`
  const clientScript = 'src/pages/carrot/client.ts'

  return { html, clientScript }
}
