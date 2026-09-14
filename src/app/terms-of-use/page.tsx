import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { termsOfUse } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of Use | The Visibility Codes",
  description: "The terms that apply to your use of this site and its services.",
};

export default function TermsOfUsePage() {
  return <LegalPage doc={termsOfUse} />;
}
