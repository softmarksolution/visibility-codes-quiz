"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isMissingLead } from "@/lib/storage";

/**
 * The cover page sits behind the opt-in, matching the local page: arriving here
 * without having filled the pop-up sends you back to the landing page rather
 * than letting you skip the step.
 *
 * Renders nothing. If storage is unavailable the check passes rather than
 * bouncing someone who could never satisfy it.
 */
export default function RequireLead() {
  const router = useRouter();
  useEffect(() => {
    if (isMissingLead()) router.replace("/");
  }, [router]);
  return null;
}
