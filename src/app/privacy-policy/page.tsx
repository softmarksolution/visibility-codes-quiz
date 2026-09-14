import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { privacyPolicy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy | The Visibility Codes",
  description: "How Katrina Kavvalos International collects, uses and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return <LegalPage doc={privacyPolicy} />;
}
