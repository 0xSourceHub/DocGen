"use client";
import { useRef } from "react";
import DocEditor from "~/editor";
import type { Editor as TinyMCEEditor } from "tinymce";
import FieldsSidebar from "~/components/fields-sidebar";

export default function Page() {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  return (
    <div className="flex overflow-hidden">
      <FieldsSidebar editorRef={editorRef} />
      <div className="flex-1 overflow-auto px-4">
        <DocEditor editorRef={editorRef} />
      </div>
    </div>
  );
}