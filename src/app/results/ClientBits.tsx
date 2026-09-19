"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useSyncExternalStore } from "react";
import { clearProgress, readNameFor } from "@/lib/storage";
import styles from "./results.module.css";

const noopSubscribe = () => () => {};

export function Greeting({ reportCode }: { reportCode: string }) {
  const getName = useCallback(() => readNameFor(reportCode), [reportCode]);
  const name = useSyncExternalStore(noopSubscribe, getName, () => null);
  return <>{name ? `${name}, here are your results.` : "Here are your results."}</>;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

function useCopied() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    if (await copyText(text)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };
  return { copied, copy };
}

export function ReportLinkButton({ label }: { label: string }) {
  const { copied, copy } = useCopied();
  return (
    <button type="button" className={styles.darkButton} onClick={() => copy(window.location.href)}>
      {copied ? "Link copied" : label}
    </button>
  );
}

export function RetakeButton({ label }: { label: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={styles.retakeButton}
      onClick={() => {
        clearProgress();
        router.push("/quiz");
      }}
    >
      {label}
    </button>
  );
}
