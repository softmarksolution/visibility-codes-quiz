"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTIONS, type AnswerValue } from "@/lib/quiz/questions";
import { isAnswered } from "@/lib/quiz/validate";
import { loadProgress, saveProgress, type Progress } from "@/lib/storage";
import UnlockModal from "./UnlockModal";
import styles from "./quiz.module.css";

const TOTAL = QUESTIONS.length;

export default function Quiz() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const question = QUESTIONS[progress.index]!;
  const value = progress.answers[question.id];
  const answered = isAnswered(question, value);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    // Move focus to the new question for keyboard and screen reader users.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [progress.index]);

  function setAnswer(next: AnswerValue) {
    setProgress((p) => ({ ...p, answers: { ...p.answers, [question.id]: next } }));
  }

  function toggleMulti(optionId: string) {
    const current = Array.isArray(value) ? value : [];
    setAnswer(current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId]);
  }

  function goNext(event: React.FormEvent) {
    event.preventDefault();
    if (!answered) return;
    if (progress.index === TOTAL - 1) setUnlockOpen(true);
    else setProgress((p) => ({ ...p, index: p.index + 1 }));
  }

  function goBack() {
    setProgress((p) => ({ ...p, index: Math.max(0, p.index - 1) }));
  }

  const textValue = typeof value === "string" ? value : "";

  return (
    <>
      <form className={styles.card} onSubmit={goNext} key={question.id} noValidate>
        <p className={styles.counter}>
          Question {progress.index + 1} of {TOTAL}
        </p>
        <div
          className={styles.track}
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuemin={0}
          aria-valuemax={TOTAL}
          aria-valuenow={progress.index}
        >
          <div className={styles.fill} style={{ transform: `scaleX(${progress.index / TOTAL})` }} />
        </div>

        <h1 className={styles.question} ref={headingRef} tabIndex={-1} id="question-text">
          {question.text}
        </h1>
        {question.helper && <p className={styles.helper}>{question.helper}</p>}

        {question.type === "text" ? (
          <div className={styles.textWrap}>
            <label htmlFor="answer-text" className="sr-only">
              Your answer
            </label>
            <textarea
              id="answer-text"
              className={styles.textarea}
              rows={4}
              maxLength={question.maxLength}
              value={textValue}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here"
            />
            <p className={styles.charCount} aria-live="polite">
              {textValue.length}/{question.maxLength}
            </p>
          </div>
        ) : (
          <fieldset className={styles.options} aria-labelledby="question-text">
            {question.options.map((option) => {
              const multi = question.type === "multi";
              const checked = multi ? Array.isArray(value) && value.includes(option.id) : value === option.id;
              return (
                <label key={option.id} className={`${styles.option} ${checked ? styles.selected : ""}`}>
                  <input
                    className={styles.nativeInput}
                    type={multi ? "checkbox" : "radio"}
                    name={`q${question.id}`}
                    value={option.id}
                    checked={checked}
                    onChange={() => (multi ? toggleMulti(option.id) : setAnswer(option.id))}
                  />
                  {multi && <span className={styles.checkbox} aria-hidden="true" />}
                  <span>{option.label}</span>
                </label>
              );
            })}
          </fieldset>
        )}

        <div className={styles.actions}>
          {progress.index > 0 ? (
            <button type="button" className={styles.back} onClick={goBack}>
              Back
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className={styles.next} disabled={!answered}>
            Next
          </button>
        </div>
      </form>

      {unlockOpen && <UnlockModal answers={progress.answers} onClose={() => setUnlockOpen(false)} />}
    </>
  );
}
