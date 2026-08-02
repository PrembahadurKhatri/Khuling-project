import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const ToolbarButton = ({ active, onClick, children, theme }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-2.5 py-1 rounded text-sm font-medium ${
      active
        ? "bg-primary text-secondary"
        : theme === "dark"
        ? "text-gray-300 hover:bg-gray-800"
        : "text-gray-600 hover:bg-stone"
    }`}
  >
    {children}
  </button>
);

const RichTextEditor = ({ value, onChange, theme }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const borderClass = theme === "dark" ? "border-gray-700" : "border-line";

  return (
    <div className={`rounded-lg border ${borderClass}`}>
      <div className={`flex flex-wrap gap-1 p-2 border-b ${borderClass}`}>
        <ToolbarButton theme={theme} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>B</ToolbarButton>
        <ToolbarButton theme={theme} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>I</ToolbarButton>
        <ToolbarButton theme={theme} active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
        <ToolbarButton theme={theme} active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarButton>
        <ToolbarButton theme={theme} active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</ToolbarButton>
        <ToolbarButton theme={theme} active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</ToolbarButton>
        <ToolbarButton theme={theme} active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>" Quote</ToolbarButton>
      </div>
      <EditorContent
        editor={editor}
        className={`editor-content px-3 py-2 min-h-[200px] focus:outline-none ${theme === "dark" ? "text-gray-100" : "text-ink"}`}
      />
    </div>
  );
};

export default RichTextEditor;
