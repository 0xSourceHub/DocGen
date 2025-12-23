"use client";
import { useEffect, useRef } from "react";
import DocEditor from "~/editor";
import type { Editor as TinyMCEEditor } from "tinymce";
import FieldsSidebar from "~/components/fields-sidebar";
import { useSidebar } from "~/components/ui/sidebar";

export default function Page() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const { setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex overflow-hidden">
      <FieldsSidebar editorRef={editorRef} />
      <div className="flex-1 overflow-auto px-4">
        <DocEditor editorRef={editorRef} />
      </div>
    </div>
  );
}
