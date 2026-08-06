// A pasted image URL and a manually uploaded file are mutually exclusive —
// picking one clears the other, and each input disables while the other has
// a value, so it's unambiguous which source will actually be saved.
// Used by ProjectsManage.jsx (thumbnail) and ServicesManage.jsx (heroImage).
const ImageSourceField = ({
  theme,
  label,
  required,
  urlValue,
  fileValue,
  onUrlChange,
  onFileChange,
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
          placeholder="Paste an image URL"
          value={urlValue || ""}
          disabled={hasFile}
          onChange={(e) => handleUrlChange(e.target.value)}
          className={`${inputClass} ${hasFile ? disabledClass : ""}`}
        />
        <input
          type="file"
          accept="image/*"
          disabled={hasUrl}
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className={`${inputClass} ${hasUrl ? disabledClass : ""}`}
        />
      </div>
      <p className={`text-xs mt-1 ${helpClass}`}>
        Use a URL or upload a file from your device — not both. Choosing one clears the other.
      </p>
      {preview && (
        <img src={preview} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg" onError={(e) => { e.target.style.display = "none"; }} />
      )}
    </div>
  );
};

export default ImageSourceField;
