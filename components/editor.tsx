"use client";
import React, { forwardRef, ForwardedRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const TextEditor = forwardRef(
  ({ ...field }: TextEditorProps, ref: ForwardedRef<Editor>) => {
    return (
      <Editor
        id="content"
        apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
        value={field.value}
        onEditorChange={(content, editor) => {
          field.onChange(content);
        }}
        init={{
          plugins:
            "  anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          tinycomments_mode: "embedded",
          tinycomments_author: "Author name",
          language: "ru",
          height: 800,
        }}
        ref={ref}
      />
    );
  }
);
TextEditor.displayName = "TextEditor";
export default TextEditor;
