import React from "react";
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
} from "lucide-react";

export function EditorToolbar({
  editor,
  handleSaveContent,
  exportContent,
  importContent,
  isDark,
  hasChanges,
  colorPresets,
  setTextColor,
}) {
  if (!editor) return null;

  // Helper for rendering dividers
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
          className={hasChanges ? 
            `animate-pulse bg-green-800/70 border border-green-500 shadow-md` : 
            ""
          }
        />
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
        {/* Text Style */}
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

        {/* Headings Dropdown */}
        <div className="group relative">
          <FormatButton
            icon={Heading1}
            tooltip="Headings"
            isActive={editor.isActive("heading")}
          />
          <div
            className={`absolute z-10 left-0 mt-1 w-48 p-2 rounded-md shadow-lg hidden group-hover:block ${
              isDark
                ? "bg-[#001F10] border border-amber-900/50"
                : "bg-white border border-gray-200"
            }`}
          >
            <button
              className="rounded text-left w-full dark:hover:bg-amber-900/50 hover:bg-gray-100 px-2 py-1"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              Heading 1
            </button>
            <button
              className="rounded text-left w-full dark:hover:bg-amber-900/50 hover:bg-gray-100 px-2 py-1"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              Heading 2
            </button>
            <button
              className="rounded text-left w-full dark:hover:bg-amber-900/50 hover:bg-gray-100 px-2 py-1"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              Heading 3
            </button>
          </div>
        </div>

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

        {/* Color Dropdown */}
        <div className="group relative">
          <FormatButton
            icon={Palette}
            tooltip="Text Color"
            isActive={editor.isActive("textStyle")}
          />
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
                className="flex h-8 justify-center rounded-full w-8 cursor-pointer hover:scale-110 items-center transition-transform"
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
            <div className="col-span-4 mt-2">
              <input
                type="color"
                className="h-8 rounded w-full cursor-pointer"
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
    </>
  );
} 