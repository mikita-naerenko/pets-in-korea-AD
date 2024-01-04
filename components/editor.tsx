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
        apiKey="17lxthf1h75z6755oysf1x7ikb62t562pk66f5s16ykuzs03"
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
        }}
        ref={ref}
      />
    );
  }
);
TextEditor.displayName = "TextEditor";
export default TextEditor;
