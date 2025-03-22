import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

export const getEditorConfig = ({ lowlight, onReady, editorInitTimeout }) => ({
  extensions: [
    StarterKit.configure({
      codeBlock: false,
      listItem: false,
      heading: false,
      paragraph: {
        HTMLAttributes: {
          class: "my-2 whitespace-pre-wrap",
        },
      },

      bulletList: {
        keepMarks: true,
        keepAttributes: true,
        HTMLAttributes: {
          class: "bullet-list",
        },
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: true,
        HTMLAttributes: {
          class: "ordered-list",
        },
      },
      code: {
        HTMLAttributes: {
          class: "editor-code",
        },
      },
    }),
    CodeBlockLowlight.configure({
      lowlight,
      HTMLAttributes: {
        class: "editor-code-block",
      },
    }),
    Heading.configure({
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: ({ level }) => ({
        class: `heading-${level} font-bold whitespace-pre-wrap`,
      }),
    }),
    TextStyle.configure({ types: [ListItem.name] }),
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    ListItem.configure({
      HTMLAttributes: {
        class: "list-item",
      },
    }),
    Placeholder.configure({
      placeholder: "Start writing here...",
      emptyEditorClass: "is-editor-empty",
    }),
    Link.configure({
      openOnClick: true,
    }),
  ],
  content: "",
  editorProps: {
    attributes: {
      class:
        "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none p-4 min-h-[300px] whitespace-pre-wrap",
      spellcheck: "true",
    },
  },
  onReady: () => {
    editorInitTimeout.current = setTimeout(() => {
      onReady();
    }, 100);
  },
});
