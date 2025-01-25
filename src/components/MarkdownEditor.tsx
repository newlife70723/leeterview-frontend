"use client";

import React, { useRef, useEffect } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

interface MarkdownEditorProps {
    content: string;
    onChange: (content: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ content, onChange }) => {
    const editorRef = useRef<Editor | null>(null);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleEditorChange = () => {
        if (editorRef.current) {
            const markdownContent = editorRef.current.getInstance().getMarkdown();
            onChange(markdownContent);
        }
    };

    const handleImageUpload = async (blob: File, callback: (url: string, altText: string) => void) => {
      try {          
          const response = await fetch(
              `${baseUrl}/s3/generateUrl?fileName=${blob.name}&contentType=${blob.type}`
          );
  
          if (!response.ok) {
              throw new Error("Failed to get signed URL");
          }
  
          const { url: signedUrl } = await response.json();
          if (!signedUrl) {
              throw new Error("Signed URL is not available in response");
          }
  
          const uploadResponse = await fetch(signedUrl, {
              method: "PUT",
              headers: {
                  "Content-Type": blob.type,
              },
              body: blob,
          });
  
          if (!uploadResponse.ok) {
              throw new Error("Failed to upload image to S3");
          }
  
          const publicUrl = signedUrl.split("?")[0];
          callback(publicUrl, blob.name);
      } catch (error) {
          console.error("Image upload failed:", error);
      }
  };
  
  useEffect(() => {
    const adjustPopup = () => {
        const popups = document.querySelectorAll(".toastui-editor-popup");
          popups.forEach((popup) => {
              (popup as HTMLElement).style.maxWidth = "90%";
              (popup as HTMLElement).style.left = "5%";
          });
    };

      adjustPopup();
      window.addEventListener("resize", adjustPopup);
        return () => {
          window.removeEventListener("resize", adjustPopup);
        };
    }, []);

  return (
      <div className="editor-container">
          <Editor
              initialValue={content}
              previewStyle={window.innerWidth < 768 ? "tab" : "vertical"}
              height="400px"
              initialEditType="markdown"
              useCommandShortcut={true}
              ref={editorRef}
              onChange={handleEditorChange}
              hooks={{
                  addImageBlobHook: handleImageUpload,
              }}
              toolbarItems={[
                  ["heading", "bold", "italic", "strike"],
                  ["hr", "quote"],
                  ["ul", "ol", "task"],
                  ["link", "image", "code", "codeblock"],
              ]}
          />
      </div>
    );
};

export default MarkdownEditor;
