"use client";

import { usePathname } from "next/navigation";
import ChatbotWidget from "@/components/chat/ChatbotWidget";

export default function ConditionalChatbot() {
  const pathname = usePathname();
  
  // Hide chatbot on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  
  return <ChatbotWidget />;
}

