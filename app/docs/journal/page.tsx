import type { Metadata } from "next";
import { getEncryptedJournal } from "./lib";
import JournalApp from "./components/JournalApp";

export const metadata: Metadata = {
  title: "Journal · X9Elysium Docs",
  description: "PIN-protected journal entries.",
  robots: { index: false, follow: false },
};

export default async function JournalPage() {
  const blob = await getEncryptedJournal();
  return <JournalApp blob={blob} />;
}
