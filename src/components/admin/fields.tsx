import { useRef, useState, type ReactNode } from "react";
import type { L } from "../../lib/types";

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

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = (file: File) => {
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
      image.src = String(reader.result);
    };
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
  return <>{card}{editing && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-charcoal/50 p-4" role="dialog" aria-modal="true" aria-label={`Edit ${title}`}><div className="admin-editor-modal max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between border-b border-sand pb-4"><div><p className="text-[10px] uppercase tracking-[.2em] text-rust">Editor</p><h2 className="mt-1 font-serif text-3xl text-charcoal">{title}</h2></div><button type="button" onClick={() => setEditing(false)} className="h-10 w-10 border border-sand text-xl">×</button></div>{content}<div className="sticky bottom-0 mt-6 flex justify-end border-t border-sand bg-white pt-4"><button type="button" onClick={() => setEditing(false)} className="bg-rust px-6 py-3 text-xs uppercase tracking-[.16em] text-white">Done</button></div></div></div>}{confirming && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/45 p-5"><div className="w-full max-w-sm border border-sand bg-white p-6 shadow-xl"><h3 className="font-serif text-2xl text-charcoal">Delete this item?</h3><p className="mt-2 text-sm text-cocoa/70">This change will be included when you press Save changes.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setConfirming(false)} className="border border-sand px-4 py-2 text-xs">Cancel</button><button type="button" onClick={() => { onDelete?.(); setConfirming(false); setEditing(false); }} className="bg-rust px-4 py-2 text-xs text-white">Delete</button></div></div></div>}</>;
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
