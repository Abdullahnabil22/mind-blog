import React from "react";
import { FormatButton } from "./FormatButton";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  List,
  ListOrdered,
  Palette,
  Save,
  FileDown,
  FileUp,
  Undo,
  Redo,
} from "lucide-react";

export function EditorToolbar({
  editor,
  handleSaveContent,
  exportContent,
  importContent,
  addLink,
  isDark,
  hasChanges,
  colorPresets,
  setTextColor,
}) {
  if (!editor) return null;

  // Helper for rendering dividers
  const renderDivider = () => (
    <div className="w-px h-6 mx-1 self-center bg-gray-300" />
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
    </>
  );
} 