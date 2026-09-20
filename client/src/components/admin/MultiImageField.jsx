import { useRef } from "react";

// Like ImageSourceField, but for up to `max` images at once instead of one —
// used by DesignManage.jsx. Existing/pasted URLs and newly chosen files are
// tracked as two separate lists (kept separate until submit, where they're
// merged server-side — see designController.js) so a kept image doesn't need
// to be re-uploaded just because new ones were added alongside it.
const MultiImageField = ({ theme, label, urls, files, onUrlsChange, onFilesChange, max = 10 }) => {
  const fileInputRef = useRef(null);
  const total = urls.length + files.length;
  const remaining = max - total;

  const inputClass = theme === "dark"
    ? "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
    : "w-full rounded-lg border border-line bg-paper px-3 py-2 text-ink";
  const helpClass = theme === "dark" ? "text-gray-500" : "text-gray-500";
  const disabledClass = "opacity-50 cursor-not-allowed";

  const removeUrl = (index) => onUrlsChange(urls.filter((_, i) => i !== index));
  const removeFile = (index) => onFilesChange(files.filter((_, i) => i !== index));

  const handleFilesPicked = (picked) => {
    const room = Math.max(max - total, 0);
    onFilesChange([...files, ...Array.from(picked).slice(0, room)]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUrlAdd = (value) => {
    if (!value.trim() || total >= max) return;
    onUrlsChange([...urls, value.trim()]);
  };

  return (
    <div>
      <label className={`mb-1 block text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        {label} <span className={helpClass}>({total}/{max})</span>
      </label>

      {total > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {urls.map((url, i) => (
            <div key={`url-${i}`} className="group relative aspect-square overflow-hidden rounded-lg border border-line">
              <img src={url} alt="" className="h-full w-full object-cover" onError={(e) => { e.target.style.opacity = 0.2; }} />
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
          {files.map((file, i) => (
            <div key={`file-${i}`} className="group relative aspect-square overflow-hidden rounded-lg border border-line">
              <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Paste an image URL, press Enter"
          disabled={remaining <= 0}
          className={`${inputClass} ${remaining <= 0 ? disabledClass : ""}`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleUrlAdd(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={remaining <= 0}
          onChange={(e) => e.target.files?.length && handleFilesPicked(e.target.files)}
          className={`${inputClass} ${remaining <= 0 ? disabledClass : ""}`}
        />
      </div>
      <p className={`mt-1 text-xs ${helpClass}`}>
        {remaining <= 0 ? "Maximum reached — remove one to add another." : `Add up to ${remaining} more, by URL or file upload.`}
      </p>
    </div>
  );
};

export default MultiImageField;
