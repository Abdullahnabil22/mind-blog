import React, { useState, useRef, useEffect } from "react";
import { FormatButton } from "./FormatButton";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Palette,
  Save,
  FileDown,
  FileUp,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Strikethrough,
  Code,
  Quote,
  Minus,
  Type,
  X,
  Terminal,
  PenTool,
  ListRestart,
} from "lucide-react";

export function EditorToolbar({
  editor,
  handleSaveContent,
  isDark,
  hasChanges,
  colorPresets,
  setTextColor,
}) {
  const [isTextMenuOpen, setIsTextMenuOpen] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const colorMenuRef = useRef(null);
  const colorButtonRef = useRef(null);

  // Handle clicks outside menus to close them
  useEffect(() => {
    function handleClickOutside(event) {
      // For color menu
      if (
        isColorMenuOpen &&
        colorMenuRef.current &&
        !colorMenuRef.current.contains(event.target) &&
        colorButtonRef.current &&
        !colorButtonRef.current.contains(event.target)
      ) {
        setIsColorMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTextMenuOpen, isColorMenuOpen]);

  if (!editor) return null;

  // Helper function to render a divider
  const renderDivider = () => (
    <div className="bg-gray-300 h-6 w-px mx-1 self-center" />
  );

  return (
    <>
      {/* File operations toolbar */}
      <div
        className={`mb-2 p-2 rounded-lg border flex flex-wrap gap-1 ${
          isDark
            ? "border-amber-900/50 bg-[#001F10] text-amber-100"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <FormatButton
          onClick={() => handleSaveContent(true)}
          tooltip="Save"
          icon={Save}
          className={
            hasChanges
              ? `animate-pulse bg-green-800/70 border border-green-500 shadow-md`
              : ""
          }
        />
        {renderDivider()}
        <FormatButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          tooltip="Undo"
          icon={Undo}
        />
        <FormatButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
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
        {/* Text Style */}
        <FormatButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          icon={Bold}
          tooltip="Bold"
        />
        <FormatButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          icon={Italic}
          tooltip="Italic"
        />
        <FormatButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          icon={Strikethrough}
          tooltip="Strikethrough"
        />
        <FormatButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          icon={Code}
          tooltip="Inline Code"
        />

        {renderDivider()}

        {/* Lists */}
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

        {/* Alignment */}
        <FormatButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          icon={AlignLeft}
          tooltip="Align Left"
        />
        <FormatButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          icon={AlignCenter}
          tooltip="Align Center"
        />
        <FormatButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          icon={AlignRight}
          tooltip="Align Right"
        />

        {renderDivider()}

        {/* Special Blocks */}
        <FormatButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          icon={Terminal}
          tooltip="Code Block"
        />
        <FormatButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          icon={Quote}
          tooltip="Blockquote"
        />
        <FormatButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={Minus}
          tooltip="Horizontal Rule"
        />
        <FormatButton
          onClick={() => editor.chain().focus().setHardBreak().run()}
          icon={PenTool}
          tooltip="Hard Break"
        />

        {renderDivider()}

        {/* Color Dropdown */}
        <div className="relative">
          <div ref={colorButtonRef}>
            <FormatButton
              onClick={() => {
                setIsColorMenuOpen(!isColorMenuOpen);
                setIsTextMenuOpen(false);
              }}
              icon={Palette}
              tooltip="Text Color"
              isActive={editor.isActive("textStyle")}
            />
          </div>
          {isColorMenuOpen && (
            <div
              ref={colorMenuRef}
              className={`absolute z-50 left-0 mt-1 w-48 p-2 rounded-md shadow-lg grid grid-cols-4 gap-2 ${
                isDark
                  ? "bg-[#001F10] border border-amber-900/50"
                  : "bg-white border border-gray-200"
              }`}
            >
              {colorPresets.map((preset) => (
                <button
                  key={preset.color}
                  className="flex h-8 justify-center rounded-full w-8 cursor-pointer hover:scale-110 items-center transition-transform"
                  style={{
                    backgroundColor: preset.color,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  }}
                  title={preset.name}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setTextColor(preset.color);
                    setIsColorMenuOpen(false);
                  }}
                />
              ))}
              <div className="col-span-4 mt-2">
                <input
                  type="color"
                  className="h-8 rounded w-full cursor-pointer"
                  value={editor.getAttributes("textStyle").color || "#000000"}
                  onInput={(e) => {
                    e.preventDefault();
                    setTextColor(e.target.value);
                    setIsColorMenuOpen(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {renderDivider()}

        {/* Clear formatting buttons */}
        <FormatButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          tooltip="Clear Marks"
          icon={X}
        ></FormatButton>
        <FormatButton
          onClick={() => editor.chain().focus().clearNodes().run()}
          tooltip="Clear Nodes"
          icon={ListRestart}
        ></FormatButton>
      </div>
    </>
  );
}
