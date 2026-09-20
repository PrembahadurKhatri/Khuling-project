// A pasted URL and a manually uploaded file are mutually exclusive — picking
// one clears the other, and each input disables while the other has a
// value, so it's unambiguous which source will actually be saved.
// Used by ProjectsManage.jsx (thumbnail), ServicesManage.jsx (heroImage),
// and DesignManage.jsx (card thumbnail, DPR document, and per-video
// file/thumbnail — via `accept`/`previewType`).
const ImageSourceField = ({
  theme,
  label,
  required,
  urlValue,
  fileValue,
  onUrlChange,
  onFileChange,
  accept = "image/*",
  previewType = "image", // "image" | "video" | "document"
}) => {
  const inputClass = theme === "dark"
    ? "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
    : "w-full rounded-lg border border-line bg-paper px-3 py-2 text-ink";
  const helpClass = theme === "dark" ? "text-gray-500" : "text-gray-500";
  const disabledClass = "opacity-50 cursor-not-allowed";

  const hasUrl = Boolean(urlValue);
  const hasFile = Boolean(fileValue);

  const handleUrlChange = (value) => {
    onUrlChange(value);
    if (value) onFileChange(null);
  };

  const handleFileChange = (file) => {
    onFileChange(file);
    if (file) onUrlChange("");
  };

  const preview = fileValue ? URL.createObjectURL(fileValue) : urlValue;

  return (
    <div>
      <label className={`mb-1 block text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        {label}{required ? " *" : ""}
      </label>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          placeholder={previewType === "document" ? "Paste a document URL" : previewType === "video" ? "Paste a video URL (YouTube/Vimeo)" : "Paste an image URL"}
          value={urlValue || ""}
          disabled={hasFile}
          onChange={(e) => handleUrlChange(e.target.value)}
          className={`${inputClass} ${hasFile ? disabledClass : ""}`}
        />
        <input
          type="file"
          accept={accept}
          disabled={hasUrl}
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className={`${inputClass} ${hasUrl ? disabledClass : ""}`}
        />
      </div>
      <p className={`text-xs mt-1 ${helpClass}`}>
        Use a URL or upload a file from your device — not both. Choosing one clears the other.
      </p>
      {preview && previewType === "document" && (
        <a href={preview} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold text-primary hover:underline">
          📄 {fileValue?.name || "View current document"}
        </a>
      )}
      {preview && previewType === "video" && (
        fileValue ? (
          <video src={preview} controls className="mt-2 h-40 w-full rounded-lg bg-black" />
        ) : (
          <a href={preview} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold text-primary hover:underline">
            🎬 {preview}
          </a>
        )
      )}
      {preview && previewType === "image" && (
        <img src={preview} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg" onError={(e) => { e.target.style.display = "none"; }} />
      )}
    </div>
  );
};

export default ImageSourceField;
