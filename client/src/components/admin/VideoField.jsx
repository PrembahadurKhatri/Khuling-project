import ImageSourceField from "./ImageSourceField.jsx";

// One video entry in DesignManage.jsx's repeatable video list — the video
// itself (a pasted YouTube/Vimeo link, or an uploaded file) plus its own
// optional poster thumbnail (a pasted image URL, or an uploaded file).
// `value` / `onChange` carry { existingUrl, urlFile, existingThumbnail, thumbFile }.
const VideoField = ({ theme, value, onChange, onRemove }) => {
  const mutedClass = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const cardClass = theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-line bg-stone/40";

  return (
    <div className={`space-y-3 rounded-xl border p-4 ${cardClass}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold ${mutedClass}`}>Video</span>
        <button
          type="button"
          onClick={onRemove}
          className={`text-xs ${theme === "dark" ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"}`}
        >
          Remove video
        </button>
      </div>

      <ImageSourceField
        theme={theme}
        label="Video (link or upload)"
        accept="video/*"
        previewType="video"
        urlValue={value.existingUrl}
        fileValue={value.urlFile}
        onUrlChange={(v) => onChange({ ...value, existingUrl: v })}
        onFileChange={(f) => onChange({ ...value, urlFile: f })}
      />

      <ImageSourceField
        theme={theme}
        label="Thumbnail for this video (optional)"
        urlValue={value.existingThumbnail}
        fileValue={value.thumbFile}
        onUrlChange={(v) => onChange({ ...value, existingThumbnail: v })}
        onFileChange={(f) => onChange({ ...value, thumbFile: f })}
      />
    </div>
  );
};

export default VideoField;
