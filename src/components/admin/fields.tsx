import { useEffect, useRef, useState, type DragEvent, type MouseEvent, type ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import type { L } from "../../lib/types";
import { plainTextToHtml, sanitizeRichHtml } from "../RichText";

const EditorialImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...(this.parent?.() ?? {}),
      "data-align": {
        default: "center",
        parseHTML: (element: HTMLElement) => element.getAttribute("data-align") ?? "center",
        renderHTML: (attributes: Record<string, string>) => ({ "data-align": attributes["data-align"] ?? "center" }),
      },
      "data-width": {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("data-width"),
        renderHTML: (attributes: Record<string, string | null>) => attributes["data-width"] ? { "data-width": attributes["data-width"] } : {},
      },
    };
  },
}).configure({
  inline: true,
  allowBase64: true,
  resize: {
    enabled: true,
    directions: ["top-left", "top-right", "bottom-left", "bottom-right"],
    minWidth: 60,
    minHeight: 60,
    alwaysPreserveAspectRatio: true,
  },
});

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-cocoa/60">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full border border-sand bg-white px-3 py-2 text-[14px] text-charcoal outline-none transition-colors focus:border-clay";

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className={inputCls}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 5,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      className={`${inputCls} leading-relaxed`}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/** Bilingual field: English + Vietnamese side by side */
export function LangField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 4,
}: {
  label: string;
  value: L;
  onChange: (v: L) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-cocoa/60">
        {label}
      </span>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <span className="mb-1 block text-[10px] font-medium tracking-wide text-clay">EN</span>
          {multiline ? (
            <TextArea rows={rows} value={value.en} onChange={(v) => onChange({ ...value, en: v })} />
          ) : (
            <TextInput value={value.en} onChange={(v) => onChange({ ...value, en: v })} />
          )}
        </div>
        <div>
          <span className="mb-1 block text-[10px] font-medium tracking-wide text-clay">VN</span>
          {multiline ? (
            <TextArea rows={rows} value={value.vi} onChange={(v) => onChange({ ...value, vi: v })} />
          ) : (
            <TextInput value={value.vi} onChange={(v) => onChange({ ...value, vi: v })} />
          )}
        </div>
      </div>
      {multiline && (
        <p className="mt-1 text-[11px] text-cocoa/45">
          Separate paragraphs with a blank line.
        </p>
      )}
    </div>
  );
}

function RichEditor({ value, onChange, language }: { value: string; onChange: (v: string) => void; language: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const [selectionVersion, setSelectionVersion] = useState(0);
  onChangeRef.current = onChange;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      EditorialImage,
    ],
    content: sanitizeRichHtml(plainTextToHtml(value)),
    onUpdate: ({ editor: current }) => onChangeRef.current(sanitizeRichHtml(current.getHTML())),
  });

  useEffect(() => {
    if (!editor) return;
    const update = () => setSelectionVersion(version => version + 1);
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || editor.isFocused) return;
    const next = sanitizeRichHtml(plainTextToHtml(value));
    if (editor.getHTML() !== next) editor.commands.setContent(next, { emitUpdate: false });
  }, [editor, value]);

  const imageAttrs = editor?.isActive("image") ? editor.getAttributes("image") : null;
  void selectionVersion;
  const imageWidth = Number(imageAttrs?.width) || 0;
  const imageHeight = Number(imageAttrs?.height) || 0;
  const canvasWidth = Math.max(240, editor?.view.dom.clientWidth || 240);
  const selectedImagePercent = imageWidth
    ? Math.max(20, Math.min(100, Math.round(imageWidth / canvasWidth * 100 / 5) * 5))
    : Number(imageAttrs?.["data-width"]) || 100;

  const run = (event: MouseEvent<HTMLButtonElement>, action: () => void) => {
    event.preventDefault();
    action();
  };
  const insertImage = (src: string) => {
    if (!editor || !src) return;
    let imageCount = 0;
    editor.state.doc.descendants((node) => {
      if (node.type.name === "image") imageCount += 1;
    });
    const align = imageCount % 2 === 0 ? "right" : "left";
    editor.chain().focus().setImage({ src, alt: "" }).updateAttributes("image", { "data-align": align, "data-width": "25" }).run();
  };
  const upload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new window.Image();
      image.onload = () => {
        const max = 1800;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
        insertImage(canvas.toDataURL("image/webp", .82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const alignImage = (align: "left" | "center" | "right") => {
    editor?.chain().focus().updateAttributes("image", { "data-align": align }).run();
  };
  const setImageWidth = (percent: number) => {
    if (!editor || !imageAttrs) return;
    const width = Math.max(60, Math.round(canvasWidth * percent / 100));
    const ratio = imageWidth && imageHeight ? imageHeight / imageWidth : 0.75;
    editor.chain().focus().updateAttributes("image", { width, height: Math.round(width * ratio), "data-width": String(percent) }).run();
  };
  const removeImage = () => editor?.chain().focus().deleteSelection().run();
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    const file = Array.from(event.dataTransfer.files).find(item => item.type.startsWith("image/"));
    if (!file) return;
    event.preventDefault();
    upload(file);
  };

  return <div className="rich-editor">
    <div className="rich-editor-toolbar" role="toolbar" aria-label={`${language} text formatting`}>
      <button type="button" title="Bold" onMouseDown={event => run(event, () => editor?.chain().focus().toggleBold().run())}><strong>B</strong></button>
      <button type="button" title="Italic" onMouseDown={event => run(event, () => editor?.chain().focus().toggleItalic().run())}><em>I</em></button>
      <button type="button" title="Underline" onMouseDown={event => run(event, () => editor?.chain().focus().toggleUnderline().run())}><u>U</u></button>
      <button type="button" title="Heading" onMouseDown={event => run(event, () => editor?.chain().focus().toggleHeading({ level: 3 }).run())}>H3</button>
      <button type="button" title="Paragraph" onMouseDown={event => run(event, () => editor?.chain().focus().setParagraph().run())}>P</button>
      <button type="button" title="Quote" onMouseDown={event => run(event, () => editor?.chain().focus().toggleBlockquote().run())}>“ ”</button>
      <button type="button" title="Bulleted list" onMouseDown={event => run(event, () => editor?.chain().focus().toggleBulletList().run())}>• List</button>
      <button type="button" title="Numbered list" onMouseDown={event => run(event, () => editor?.chain().focus().toggleOrderedList().run())}>1. List</button>
      <button type="button" title="Add link" onMouseDown={event => run(event, () => { const url = window.prompt("Link URL"); if (url) editor?.chain().focus().setLink({ href: url }).run(); })}>Link</button>
      <button type="button" title="Upload image" onMouseDown={event => { event.preventDefault(); fileRef.current?.click(); }}>Image</button>
      <button type="button" title="Insert image URL" onMouseDown={event => run(event, () => { const url = window.prompt("Image URL"); if (url) insertImage(url); })}>Image URL</button>
      <button type="button" title="Undo" onMouseDown={event => run(event, () => editor?.chain().focus().undo().run())}>↶</button>
      <button type="button" title="Redo" onMouseDown={event => run(event, () => editor?.chain().focus().redo().run())}>↷</button>
    </div>
    {imageAttrs && <div className="rich-editor-image-tools">
      <span>Image size</span>
      <input aria-label="Image width" type="range" min="20" max="100" step="5" value={selectedImagePercent} onChange={event => setImageWidth(Number(event.target.value))} />
      <strong>{`${selectedImagePercent}%`}</strong>
      {([25, 50, 75, 100] as const).map(width => <button type="button" key={width} onClick={() => setImageWidth(width)}>{width}%</button>)}
      <span>Position</span>
      {(["left", "center", "right"] as const).map(align => <button type="button" key={align} onClick={() => alignImage(align)} className={(imageAttrs["data-align"] || "center") === align ? "is-active" : ""}>{align}</button>)}
      <button type="button" onClick={removeImage}>Remove image</button>
    </div>}
    <div
      className="rich-editor-canvas tiptap-editor-canvas"
      onDragOver={event => { if (Array.from(event.dataTransfer.types).includes("Files")) event.preventDefault(); }}
      onDrop={handleDrop}
    >
      <EditorContent editor={editor} />
    </div>
    <p className="rich-editor-help">Chọn ảnh rồi kéo các góc để phóng to/thu nhỏ. Kéo ảnh để đổi vị trí trong luồng nội dung.</p>
    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={event => { const file = event.target.files?.[0]; if (file) upload(file); event.target.value = ""; }} />
  </div>;
}

export function RichLangField({ label, value, onChange }: { label: string; value: L; onChange: (v: L) => void }) {
  return <div>
    <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-cocoa/60">{label}</span>
    <div className="space-y-5">
      <div><span className="mb-1 block text-[10px] font-medium tracking-wide text-clay">EN</span><RichEditor language="English" value={value.en} onChange={en => onChange({ ...value, en })} /></div>
      <div><span className="mb-1 block text-[10px] font-medium tracking-wide text-clay">VN</span><RichEditor language="Vietnamese" value={value.vi} onChange={vi => onChange({ ...value, vi })} /></div>
    </div>
    <p className="mt-2 text-[11px] text-cocoa/45">Formatting and inline images are saved as HTML.</p>
  </div>;
}

export function ImageField({
  label,
  value,
  onChange,
  maxFileSizeMb = 5,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxFileSizeMb?: number;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const upload = (file: File) => {
    if (file.size > maxFileSizeMb * 1024 * 1024) {
      setError(`Please choose an image up to ${maxFileSizeMb} MB.`);
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const max = 1800;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
        onChange(canvas.toDataURL('image/webp', .82));
      };
      image.onerror = () => setError("This image could not be processed. Please try another file.");
      image.src = String(reader.result);
    };
    reader.onerror = () => setError("This image could not be read. Please try another file.");
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-cocoa/60">
        {label}
      </span>
      <div className="flex gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden border border-sand bg-cream">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] text-cocoa/40">
              no image
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <TextInput value={value} onChange={onChange} placeholder="/images/example.jpg or https://…" />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="border border-charcoal px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-charcoal hover:bg-charcoal hover:text-ivory"
            >
              Upload image
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-[10px] uppercase tracking-[0.18em] text-cocoa/50 hover:text-rust"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-[11px] text-cocoa/45">Maximum upload size: {maxFileSizeMb} MB. Images are optimized before saving.</p>
          {error && <p className="text-[11px] text-rust" role="alert">{error}</p>}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-charcoal"
      />
      <span className="text-[11px] uppercase tracking-[0.18em] text-cocoa/80">{label}</span>
      <span className={`text-[10px] ${value ? "text-moss" : "text-rust"}`}>
        {value ? "visible" : "hidden"}
      </span>
    </label>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-2 border-sand pl-4 text-[12px] leading-relaxed text-cocoa/60">
      {children}
    </p>
  );
}

export function AdminCard({
  title,
  children,
  onDelete,
  onMoveUp,
  onMoveDown,
  collapsible = false,
}: {
  title: string;
  children: ReactNode;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  collapsible?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [editing, setEditing] = useState(false);
  const content = <>
      <header className="mb-5 flex items-center justify-between gap-4 border-b border-sand pb-3">
        <h3 className="font-serif text-[22px] text-charcoal">{title}</h3>
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em]">
          {onMoveUp && (
            <button onClick={onMoveUp} className="text-cocoa/60 hover:text-charcoal">
              ↑
            </button>
          )}
          {onMoveDown && (
            <button onClick={onMoveDown} className="text-cocoa/60 hover:text-charcoal">
              ↓
            </button>
          )}
          {onDelete && (
            <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setConfirming(true); }} className="text-rust hover:underline">
              Delete
            </button>
          )}
        </div>
      </header>
      <div className="space-y-5">{children}</div>
    </>;
  const card = collapsible ? <section className="admin-card-collapsible flex items-center justify-between border border-sand bg-white p-5"><h3 className="font-serif text-[22px] text-charcoal">{title}</h3><div className="flex items-center gap-4"><button type="button" onClick={() => setEditing(true)} className="text-[10px] uppercase tracking-[.18em] text-rust">Open editor</button>{onDelete && <button type="button" onClick={() => setConfirming(true)} className="text-[10px] uppercase tracking-[.18em] text-rust">Delete</button>}</div></section> : <section className="border border-sand bg-ivory/60 p-5">{content}</section>;
  return <>{card}{editing && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-charcoal/50 p-4" role="dialog" aria-modal="true" aria-label={`Edit ${title}`}><div className="admin-editor-modal max-h-[90vh] w-full max-w-6xl overflow-y-auto bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between border-b border-sand pb-4"><div><p className="text-[10px] uppercase tracking-[.2em] text-rust">Editor</p><h2 className="mt-1 font-serif text-3xl text-charcoal">{title}</h2></div><button type="button" onClick={() => setEditing(false)} className="h-10 w-10 border border-sand text-xl">×</button></div>{content}<div className="sticky bottom-0 mt-6 flex justify-end border-t border-sand bg-white pt-4"><button type="button" onClick={() => setEditing(false)} className="bg-rust px-6 py-3 text-xs uppercase tracking-[.16em] text-white">Done</button></div></div></div>}{confirming && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/45 p-5"><div className="w-full max-w-sm border border-sand bg-white p-6 shadow-xl"><h3 className="font-serif text-2xl text-charcoal">Delete this item?</h3><p className="mt-2 text-sm text-cocoa/70">This change will be included when you press Save changes.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setConfirming(false)} className="border border-sand px-4 py-2 text-xs">Cancel</button><button type="button" onClick={() => { onDelete?.(); setConfirming(false); setEditing(false); }} className="bg-rust px-4 py-2 text-xs text-white">Delete</button></div></div></div>}</>;
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [creating, setCreating] = useState(false);
  return (
    <><button
      type="button"
      onClick={() => setCreating(true)}
      className="w-full border border-dashed border-clay/70 py-4 text-[11px] uppercase tracking-[0.22em] text-clay hover:bg-cream"
    >
      + {label}
    </button>{creating && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/45 p-5" role="dialog" aria-modal="true"><div className="w-full max-w-md bg-white p-6 shadow-xl"><p className="text-[10px] uppercase tracking-[.2em] text-rust">Create new</p><h3 className="mt-2 font-serif text-3xl text-charcoal">{label}</h3><p className="mt-3 text-sm leading-6 text-cocoa/70">A new draft will be created. Open it from the list to add content, then press Save changes.</p><div className="mt-7 flex justify-end gap-3"><button type="button" onClick={() => setCreating(false)} className="border border-sand px-4 py-2 text-xs">Cancel</button><button type="button" onClick={() => { onClick(); setCreating(false); }} className="bg-rust px-5 py-2 text-xs text-white">Create</button></div></div></div>}</>
  );
}

export const emptyL: L = { en: "", vi: "" };

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
