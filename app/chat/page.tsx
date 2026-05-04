import type { Metadata } from "next";
import ChatClient from "./ChatClient";

export const metadata: Metadata = {
  title: "X9 Chat · X9Elysium",
  description: "PIN-gated assistant grounded on the X9Elysium documentation corpus.",
  robots: { index: false, follow: false },
};

export default function ChatPage() {
  return <ChatClient />;
}
