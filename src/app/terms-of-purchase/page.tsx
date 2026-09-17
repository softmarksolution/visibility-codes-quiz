import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { termsOfPurchase } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of Purchase | The Visibility Codes",
  description: "The terms that apply to your purchase of The Visibility Codes Personalised Action Plan.",
};

export default function TermsOfPurchasePage() {
  return <LegalPage doc={termsOfPurchase} />;
}
