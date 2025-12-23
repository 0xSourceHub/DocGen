"use client";
import { useId, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { useTheme } from "next-themes";
import { convertToHtml } from "mammoth";

interface DocEditorProps {
  editorRef: React.RefObject<TinyMCEEditor | null>;
}

export default function DocEditor({ editorRef }: DocEditorProps) {
  const editorId = `doc-editor-${useId().replace(/:/g, "_")}`;
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportDocx = async (file: File) => {
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await convertToHtml({ arrayBuffer });

      if (editorRef.current) {
        // Insert the converted HTML into the editor
        editorRef.current.setContent(result.value);
      }

      // Show any warnings from the conversion
      if (result.messages.length > 0) {
        console.log("Conversion messages:", result.messages);
      }
    } catch (error) {
      console.error("Error importing DOCX:", error);
      alert("Failed to import document. Please try again.");
    }
  };

  return (
    <div className="doc-editor h-full w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            await handleImportDocx(file);
          }
          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
        className="hidden"
      />
      <Editor
        key={isDarkMode ? "dark" : "light"}
        id={editorId}
        tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_evt, editor) => {
          if (editorRef) {
            (
              editorRef as React.MutableRefObject<TinyMCEEditor | null>
            ).current = editor;
          }

          // Register custom button for importing DOCX
          editor.ui.registry.addButton("importdocx", {
            text: "Import DOCX (beta)",
            icon: "new-document",
            tooltip: "Import Content From Word Document",
            onAction: () => {
              fileInputRef.current?.click();
            },
          });
        }}
        initialValue="<p>Start typing your document here. Click on fields in the left panel to insert dynamic content.</p>"
        init={{
          plugins: [
            "accordion",
            "advlist",
            "anchor",
            "autolink",
            "autoresize",
            "autosave",
            "charmap",
            "code",
            "codesample",
            "directionality",
            "emoticons",
            "fullscreen",
            "help",
            "image",
            "importcss",
            "insertdatetime",
            "link",
            "lists",
            "media",
            "nonbreaking",
            "pagebreak",
            "preview",
            "quickbars",
            "save",
            "searchreplace",
            "table",
            "visualblocks",
            "visualchars",
            "wordcount",
          ],
          resize: true,
          editimage_cors_hosts: ["picsum.photos"],
          menubar: "file edit view insert format tools table help",
          toolbar:
            "importdocx | undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
          autosave_ask_before_unload: true,
          autosave_interval: "30s",
          autosave_prefix: "{path}{query}-{id}-",
          autosave_restore_when_empty: true,
          autosave_retention: "2m",
          image_advtab: true,
          link_list: [
            { title: "My page 1", value: "https://www.tiny.cloud" },
            { title: "My page 2", value: "http://www.moxiecode.com" },
          ],
          image_list: [
            { title: "My page 1", value: "https://www.tiny.cloud" },
            { title: "My page 2", value: "http://www.moxiecode.com" },
          ],
          image_class_list: [
            { title: "None", value: "" },
            { title: "Some class", value: "class-name" },
          ],
          importcss_append: true,
          file_picker_callback: (callback, value, meta) => {
            /* Provide file and text for the link dialog */
            if (meta.filetype === "file") {
              callback("https://www.google.com/logos/google.jpg", {
                text: "My text",
              });
            }

            /* Provide image and alt text for the image dialog */
            if (meta.filetype === "image") {
              callback("https://www.google.com/logos/google.jpg", {
                alt: "My alt text",
              });
            }

            /* Provide alternative source and posted for the media dialog */
            if (meta.filetype === "media") {
              callback("movie.mp4", {
                source2: "alt.ogg",
                poster: "https://www.google.com/logos/google.jpg",
              });
            }
          },
          min_height: 800,
          image_caption: true,
          quickbars_selection_toolbar:
            "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
          noneditable_class: "mceNonEditable",
          toolbar_mode: "sliding",
          contextmenu: "link image table",
          skin: isDarkMode ? "oxide-dark" : "oxide",
          content_css: isDarkMode ? "dark" : "default",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
          promotion: false,
        }}
      />
    </div>
  );
}
