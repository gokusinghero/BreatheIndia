import React from "react";
import { MessageSquare } from "lucide-react";

/**
 * Shared WhatsApp broadcast/share anchor with consistent accessible styling.
 */
export default function WhatsAppLink({ text, label = "Share on WhatsApp", className = "" }) {
  return (
    <a
      href={`https://wa.me/?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex-1 py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${className}`.trim()}
    >
      <MessageSquare size={13} aria-hidden="true" />
      <span>{label}</span>
    </a>
  );
}
