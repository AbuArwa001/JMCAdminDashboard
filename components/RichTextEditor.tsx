"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Type, Edit3, Eye, Columns } from "lucide-react";
import { htmlToMarkdown } from "@/lib/markdown";
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
  placeholder = "Write your campaign details in Markdown (e.g. ### Header, **bold**, - list items)...",
  minHeight = 320,
}: RichTextEditorProps) {
  const [mode, setMode] = useState<"edit" | "live" | "preview">("live");

  // Automatically convert any legacy HTML input into clean Markdown
  useEffect(() => {
    if (value && value.includes("<") && value.includes(">")) {
      const sanitized = htmlToMarkdown(value);
      if (sanitized !== value) {
        onChange(sanitized);
      }
    }
  }, [value, onChange]);

  return (
    <div className="space-y-2">
      {/* Top Editor Bar with View Mode Selector */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50/80 rounded-t-lg border border-gray-200 border-b-0 text-xs text-gray-500">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Markdown Mode
          </span>
          <span className="hidden sm:inline text-gray-400">Supports headers, bold, lists & quotes</span>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center bg-white rounded-md p-0.5 border border-gray-200 shadow-xs">
          <button
            type="button"
            onClick={() => setMode("edit")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              mode === "edit"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            title="Write mode only"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("live")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              mode === "live"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            title="Side-by-side split view"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              mode === "preview"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            title="Full rendered preview"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Markdown Editor Container */}
      <div
        data-color-mode="light"
        className="rounded-b-lg overflow-hidden border border-gray-200 shadow-sm transition-all focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20"
      >
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || "")}
          height={minHeight}
          preview={mode}
          textareaProps={{
            placeholder: placeholder,
          }}
          className="!border-0 !rounded-none"
        />
      </div>

      {/* Helpful syntax cheatsheet */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-400 px-1">
        <span><code>### Heading</code></span>
        <span><code>**Bold Text**</code></span>
        <span><code>*Italic*</code></span>
        <span><code>- Bullet Point</code></span>
        <span><code>&gt; Quote</code></span>
        <span><code>[Link](https://...)</code></span>
      </div>
    </div>
  );
}
