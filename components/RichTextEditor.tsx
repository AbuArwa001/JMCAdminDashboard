"use client";

import dynamic from "next/dynamic";
import { Type } from "lucide-react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="h-12 bg-gray-50 border-b border-gray-200 animate-pulse" />
      <div className="min-h-[280px] bg-white flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400">
          <Type className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-medium">Loading Markdown editor...</span>
        </div>
      </div>
    </div>
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing here...",
  minHeight = 280,
}: RichTextEditorProps) {
  return (
    <div data-color-mode="light" className="rounded-lg overflow-hidden border border-gray-200 shadow-sm transition-all focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        height={minHeight}
        preview="edit"
        textareaProps={{
          placeholder: placeholder
        }}
        className="!border-0 !rounded-none"
      />
    </div>
  );
}
