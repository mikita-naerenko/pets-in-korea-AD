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
            "  anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks code",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat code",
          tinycomments_mode: "embedded",
          tinycomments_author: "Author name",
          // valid_elements:
          //   "p[itemtype|itemscope|itemprop|id|class|style|title|dir<ltr?rtl|lang|xml::lang|onclick|ondblclick|onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|onkeydown|onkeyup]",
          extended_valid_elements:
            "p[itemtype|itemscope|itemprop|id|dir<ltr?rtl|lang|xml::lang]," +
            "h2[itemtype|itemscope|itemprop]," +
            "div[itemtype|itemscope|itemprop]," +
            "ul[itemtype|itemscope|itemprop]," +
            "ol[itemtype|itemscope|itemprop]," +
            "li[itemtype|itemscope|itemprop]," +
            "h1[itemtype|itemscope|itemprop]," +
            "h3[itemtype|itemscope|itemprop]," +
            "h4[itemtype|itemscope|itemprop]," +
            "h5[itemtype|itemscope|itemprop]," +
            "h6[itemtype|itemscope|itemprop]," +
            "strong[itemtype|itemscope|itemprop]",

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
