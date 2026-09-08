"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function TopBar() {
  const path = usePathname();
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    try {
      const t = localStorage.getItem("pymotion.theme");
      if (t === "dark" || t === "light") setTheme(t);
    } catch { /* noop */ }
  }, []);

  const cycle = () => {
    const next: Theme = theme === "system" ? "dark" : theme === "dark" ? "light" : "system";
    setTheme(next);
    try {
      if (next === "system") { localStorage.removeItem("pymotion.theme"); document.documentElement.removeAttribute("data-theme"); }
      else { localStorage.setItem("pymotion.theme", next); document.documentElement.setAttribute("data-theme", next); }
    } catch { /* noop */ }
  };

  const on = (p: string) => (p === "/" ? path === "/" : path.startsWith(p));

  return (
    <header className="topbar">
      <div className="topbar-in">
        <Link href="/" className="brand">
          <span className="brand-mark">Py</span>
          PyMotion <small>눈으로 배우는 파이썬</small>
        </Link>
        <nav className="topnav">
          <Link href="/" data-on={on("/")}>커리큘럼</Link>
          <Link href="/learn/data/variables" data-on={on("/learn")}>학습</Link>
          <Link href="/playground" data-on={on("/playground")}>플레이그라운드</Link>
        </nav>
        <div className="topbar-right">
          <button className="ghost-btn" onClick={cycle} title="테마 전환" aria-label="테마 전환">
            {theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "🖥️"}
            <span style={{ fontSize: 12 }}>{theme === "system" ? "자동" : theme === "dark" ? "다크" : "라이트"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
