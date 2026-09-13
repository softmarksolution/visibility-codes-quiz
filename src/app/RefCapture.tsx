"use client";

import { useEffect } from "react";
import { saveRef } from "@/lib/storage";

/** Remembers an incoming ?ref= code so it can be sent with the submission. */
export default function RefCapture() {
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref && /^[a-zA-Z0-9-]{3,40}$/.test(ref)) saveRef(ref);
  }, []);
  return null;
}
