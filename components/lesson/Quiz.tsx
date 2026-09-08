"use client";
import { useState } from "react";
import type { QuizChoice } from "@/lib/types";
import { CodeBlock } from "@/components/code/CodeBlock";
import { Md } from "./Md";

export function Quiz({ no, question, code, choices, explain, storeKey }: {
  no: number; question: string; code?: string; choices: QuizChoice[]; explain?: string; storeKey: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correctIdx = choices.findIndex((c) => c.correct);

  const pick = (i: number) => {
    if (answered) return;
    setPicked(i);
    try {
      const raw = localStorage.getItem("pymotion.quiz.v1");
      const all = raw ? JSON.parse(raw) : {};
      all[storeKey] = { picked: i, correct: i === correctIdx, at: Date.now() };
      localStorage.setItem("pymotion.quiz.v1", JSON.stringify(all));
    } catch { /* noop */ }
  };

  return (
    <div className="quiz">
      <div className="qh">퀴즈 {no}</div>
      <p className="q">{question}</p>
      {code && <CodeBlock code={code} />}
      <div className="choices">
        {choices.map((c, i) => {
          const state = !answered ? undefined : i === picked ? (c.correct ? "correct" : "wrong") : c.correct ? "reveal" : undefined;
          return (
            <button key={i} className="choice" data-state={state} onClick={() => pick(i)} disabled={answered}>
              <i>{state === "correct" ? "✓" : state === "wrong" ? "✗" : String.fromCharCode(65 + i)}</i>
              <span><Md md={c.text} inline /></span>
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="explain">
          <b>{picked === correctIdx ? "정답!" : "아쉽다."}</b>{" "}
          {choices[picked!].why && <Md md={choices[picked!].why!} inline />}
          {explain && <div style={{ marginTop: 8 }}><Md md={explain} /></div>}
        </div>
      )}
    </div>
  );
}
