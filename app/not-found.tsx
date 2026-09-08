import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell shell-narrow">
      <div className="wip">
        <b>페이지를 찾을 수 없습니다</b>
        <Link href="/" style={{ color: "var(--accent)" }}>커리큘럼으로 돌아가기</Link>
      </div>
    </main>
  );
}
