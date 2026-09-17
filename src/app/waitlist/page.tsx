import type { Metadata } from "next";
import { HeaderBanner, SiteFooter } from "@/components/SiteChrome";
import { checkoutCopy } from "@/content/site";
import JoinForm from "./JoinForm";
import styles from "./waitlist.module.css";

export const metadata: Metadata = {
  title: "The Visibility Codes Masterclass — Priority Waitlist",
  description: checkoutCopy.addOnJoin,
};

export default function WaitlistPage() {
  return (
    <>
      <HeaderBanner variant="compact" />
      <main className={styles.page}>
        <p className={styles.eyebrow}>{checkoutCopy.addOnSubtitle}</p>
        <h1 className={styles.title}>{checkoutCopy.addOnTitle}</h1>
        <p className={styles.body}>{checkoutCopy.addOnBody}</p>
        <p className={styles.body}>{checkoutCopy.addOnJoin}</p>
        <JoinForm />
      </main>
      <SiteFooter />
    </>
  );
}
