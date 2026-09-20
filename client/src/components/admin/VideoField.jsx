import ImageSourceField from "./ImageSourceField.jsx";

// One video entry in DesignManage.jsx's repeatable video list — the video
// itself (a pasted YouTube/Vimeo link, or an uploaded file) plus its own
// optional poster thumbnail (a pasted image URL, or an uploaded file).
// `value` / `onChange` carry { existingUrl, urlFile, existingThumbnail, thumbFile }.
const VideoField = ({ theme, value, onChange, onRemove }) => {
  const mutedClass = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const cardClass = theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-line bg-stone/40";

  // ImageSourceField fires two onXChange calls back-to-back for a single
  // pick (e.g. onUrlChange then onFileChange(null), to clear the other
  // side) — both built from this render's `value` prop. Passing plain
  // patch objects to `onChange` meant the second call always clobbered the
  // first with stale data, so nothing typed/picked here ever actually
  // stuck. Passing an *updater function* instead lets DesignManage.jsx
  // apply each patch on top of whatever the previous one just set,
  // the same way React's setState(prev => ...) avoids this exact problem.
  const patch = (fields) => onChange((prev) => ({ ...prev, ...fields }));

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
        onUrlChange={(v) => patch({ existingUrl: v })}
        onFileChange={(f) => patch({ urlFile: f })}
      />

      <ImageSourceField
        theme={theme}
        label="Thumbnail for this video (optional)"
        urlValue={value.existingThumbnail}
        fileValue={value.thumbFile}
        onUrlChange={(v) => patch({ existingThumbnail: v })}
        onFileChange={(f) => patch({ thumbFile: f })}
      />
    </div>
  );
};

export default VideoField;
