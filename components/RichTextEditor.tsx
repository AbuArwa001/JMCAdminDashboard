"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useMemo } from "react";
import { Type } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="jamia-quill">
      <div className="h-12 bg-[#1a1512] rounded-t-xl animate-pulse" />
      <div className="min-h-[280px] bg-white rounded-b-xl flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400">
          <Type className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-medium">Loading editor...</span>
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
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "link",
  ];

  return (
    <div className="jamia-quill">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ "--ql-min-height": `${minHeight}px` } as React.CSSProperties}
      />
      <style jsx global>{`
        .jamia-quill .ql-editor {
          min-height: ${minHeight}px !important;
        }
      `}</style>
    </div>
  );
}
