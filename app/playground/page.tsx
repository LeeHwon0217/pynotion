export default function Playground() {
  return (
    <main className="shell shell-narrow">
      <div className="part-hero">
        <div className="eyebrow" style={{ color: "var(--accent)" }}>PLAYGROUND</div>
        <h1>플레이그라운드</h1>
        <p>브라우저에서 파이썬을 실행하고, 같은 시각화로 추적합니다.</p>
      </div>
      <div className="wip">
        <b>M3 단계에서 열립니다</b>
        Pyodide 웹워커 + 실시간 실행 추적. 레슨의 「직접 해보기」도 이때 실행 가능해집니다.
      </div>
    </main>
  );
}
