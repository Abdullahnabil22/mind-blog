import { useState, useCallback } from "react";
import { useTheme } from "../../../hooks/useTheme";
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Palette,
  Image,
  Save,
  FileDown,
  FileUp,
  Undo,
  Redo,
} from "lucide-react";
import { FormatButton } from "./FormatButton";

export function TextEditor() {
  const { theme } = useTheme();
  const isDark = theme !== "light";
  const [content, setContent] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        validate: (href) => /^https?:\/\//.test(href),
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "Start writing here...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none p-4 min-h-[300px]",
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Define all callback functions before any conditional returns
  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const saveContent = useCallback(() => {
    localStorage.setItem("editor-content", content);
    alert("Content saved!");
  }, [content]);

  const exportContent = useCallback(() => {
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
  }, [content]);

  const importContent = useCallback(() => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".html,.txt";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          editor.commands.setContent(e.target.result);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [editor]);

  const setTextColor = useCallback(
    (color) => {
      if (!editor) return;
      editor.chain().focus().setColor(color).run();
    },
    [editor]
  );

  if (!editor) {
    return <div className="p-4 text-center">Loading editor...</div>;
  }

  // Text color presets with better colors that work in both light/dark modes
  const colorPresets = [
    { color: "#E03131", name: "Red" },
    { color: "#2F9E44", name: "Green" },
    { color: "#1971C2", name: "Blue" },
    { color: "#F08C00", name: "Orange" },
    { color: "#6741D9", name: "Purple" },
    { color: "#0CA678", name: "Teal" },
    { color: "#E64980", name: "Pink" },
    { color: "#3BC9DB", name: "Cyan" },
  ];

  // Group buttons by function
  const renderDivider = () => (
    <div className="w-px h-6 mx-1 self-center bg-gray-300" />
  );

  const wordCount = editor
    .getText()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const characterCount = editor.getText().length;

  return (
    <>
      <div className=" bg-transparent ">
        <div className="container mx-auto relative">
          {/* File operations toolbar */}
          <div
            className={`mb-2 p-2 rounded-lg border flex flex-wrap gap-1 ${
              isDark
                ? "border-amber-900/50 bg-[#001F10] text-amber-100"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <FormatButton onClick={saveContent} tooltip="Save" icon={Save} />
            <FormatButton
              onClick={exportContent}
              tooltip="Export"
              icon={FileDown}
            />
            <FormatButton
              onClick={importContent}
              tooltip="Import"
              icon={FileUp}
            />
            {renderDivider()}
            <FormatButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              tooltip="Undo"
              icon={Undo}
            />
            <FormatButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              tooltip="Redo"
              icon={Redo}
            />
          </div>

          {/* Formatting Toolbar */}
          <div
            className={`mb-2 p-2 rounded-t-lg border border-b-0 flex flex-wrap gap-1 ${
              isDark
                ? "border-amber-900/50 bg-[#001F10] text-amber-100"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <FormatButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              icon={Bold}
              tooltip="Bold"
            />

            <FormatButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              icon={Italic}
              tooltip="Italic"
            />

            {renderDivider()}

            <FormatButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              isActive={editor.isActive("heading", { level: 1 })}
              icon={Heading1}
              tooltip="Heading 1"
            />

            <FormatButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              isActive={editor.isActive("heading", { level: 2 })}
              icon={Heading2}
              tooltip="Heading 2"
            />

            <FormatButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              isActive={editor.isActive("heading", { level: 3 })}
              icon={Heading3}
              tooltip="Heading 3"
            />

            {renderDivider()}

            <FormatButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              icon={List}
              tooltip="Bullet List"
            />

            <FormatButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              icon={ListOrdered}
              tooltip="Numbered List"
            />

            {renderDivider()}

            <FormatButton
              onClick={addLink}
              isActive={editor.isActive("link")}
              icon={LinkIcon}
              tooltip="Add Link"
            />

            {renderDivider()}

            {/* Color Dropdown with improved interaction */}
            <div className="relative group">
              <FormatButton
                icon={Palette}
                tooltip="Text Color"
                isActive={editor.isActive("textStyle")}
              />

              {/* Color Palette Dropdown */}
              <div
                className={`absolute z-10 left-0 mt-1 w-48 p-2 rounded-md shadow-lg hidden group-hover:grid grid-cols-4 gap-2 ${
                  isDark
                    ? "bg-[#001F10] border border-amber-900/50"
                    : "bg-white border border-gray-200"
                }`}
              >
                {colorPresets.map((preset) => (
                  <button
                    key={preset.color}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                    style={{
                      backgroundColor: preset.color,
                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    }}
                    title={preset.name}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setTextColor(preset.color);
                    }}
                  />
                ))}

                {/* Custom color picker */}
                <div className="col-span-4 mt-2">
                  <input
                    type="color"
                    className="w-full h-8 cursor-pointer rounded"
                    onChange={(e) => setTextColor(e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>

            {/* Clear formatting button */}
            <FormatButton
              onClick={() =>
                editor.chain().focus().unsetAllMarks().clearNodes().run()
              }
              tooltip="Clear Formatting"
            >
              Clear
            </FormatButton>
          </div>

          {/* Editor Content Area */}
          <div
            className={`flex flex-col overflow-auto  min-h-[68vh] ${
              isDark ? " text-amber-100" : ""
            }`}
          >
            <EditorContent editor={editor} />
          </div>

          <div
            className={`m-2 text-sm self-end align-bottom absolute bottom-0 right-0  ${
              isDark ? "text-amber-200" : "text-gray-500"
            }`}
          >
            {wordCount} words {characterCount} characters
          </div>
        </div>

        {/* Bubble Menu - appears when selecting text */}
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className={`p-1 rounded-lg shadow-lg flex gap-1 ${
            isDark
              ? "bg-[#001F10] border border-amber-900/50"
              : "bg-white border border-gray-200"
          }`}
        >
          <FormatButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={Bold}
            tooltip="Bold"
            size={16}
          />
          <FormatButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={Italic}
            tooltip="Italic"
            size={16}
          />
          <FormatButton
            onClick={addLink}
            isActive={editor.isActive("link")}
            icon={LinkIcon}
            tooltip="Add Link"
            size={16}
          />
        </BubbleMenu>
      </div>
    </>
  );
}
