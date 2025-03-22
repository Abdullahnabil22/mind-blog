import {
  Bold,
  Italic,
  Link as LinkIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Quote,
  Terminal,
  X,
} from "lucide-react";
import { FormatButton } from "./FormatButton";
import { BubbleMenu } from "@tiptap/react";
export function BubbleMenuComponent({ editor, isDark, addLink }) {
  return (
    <>
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className={`p-1 rounded-lg shadow-lg flex flex-col gap-1 ${
          isDark
            ? "bg-[#001F10] border border-amber-900/50"
            : "bg-white border border-gray-200"
        }`}
      >
        <div className="flex gap-1 mb-1">
          <FormatButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            icon={Bold}
            tooltip="Bold"
            size={16}
          />
          <FormatButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            icon={Italic}
            tooltip="Italic"
            size={16}
          />
          <FormatButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            icon={Strikethrough}
            tooltip="Strikethrough"
            size={16}
          />
          <FormatButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            icon={Code}
            tooltip="Code"
            size={16}
          />
          <FormatButton
            onClick={addLink}
            isActive={editor.isActive("link")}
            icon={LinkIcon}
            tooltip="Add Link"
            size={16}
          />
        </div>
        <div className="flex border-gray-200 border-t dark:border-amber-900/30 gap-1 mb-1 pt-1">
          <FormatButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            icon={Heading1}
            tooltip="Heading 1"
            size={16}
          />
          <FormatButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            icon={Heading2}
            tooltip="Heading 2"
            size={16}
          />
          <FormatButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            icon={Heading3}
            tooltip="Heading 3"
            size={16}
          />
          <FormatButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            isActive={editor.isActive("heading", { level: 4 })}
            icon={Heading4}
            tooltip="Heading 4"
            size={16}
          />
          <FormatButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            isActive={editor.isActive("heading", { level: 5 })}
            icon={Heading5}
            tooltip="Heading 5"
            size={16}
          />
          <FormatButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            isActive={editor.isActive("heading", { level: 6 })}
            icon={Heading6}
            tooltip="Heading 6"
            size={16}
          />
        </div>
        <div className="flex border-gray-200 border-t dark:border-amber-900/30 gap-1 pt-1">
          <FormatButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={Quote}
            tooltip="Blockquote"
            size={16}
          />
          <FormatButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            icon={Terminal}
            tooltip="Code Block"
            size={16}
          />
          <FormatButton
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            tooltip="Clear Formatting"
            icon={X}
            size={16}
          />
        </div>
      </BubbleMenu>
    </>
  );
}
