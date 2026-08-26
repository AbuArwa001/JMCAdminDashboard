"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useMemo } from "react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false, loading: () => <div className="p-4 border rounded min-h-[200px] flex items-center justify-center text-gray-500">Loading Editor...</div> });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'clean']
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
  ];

  return (
    <div className="bg-white border rounded [&>.quill>.ql-container]:min-h-[200px] [&>.quill>.ql-container]:text-base [&>.quill>.ql-toolbar]:border-t-0 [&>.quill>.ql-toolbar]:border-x-0 [&>.quill>.ql-toolbar]:border-b [&>.quill>.ql-toolbar]:border-gray-200 [&>.quill>.ql-container]:border-none">
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
