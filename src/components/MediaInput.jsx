export default function MediaInput({
  label,
  value,
  mode,
  onChange,
  onFile,
  onMode,
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-gray-600">{label}</label>
      )}

      <div className="flex gap-2">
        {/* mode select */}
        <select
          value={mode || "url"}
          onChange={(e) => onMode(e.target.value)}
          className="
            px-3 py-2
            text-sm
            border border-gray-300
            rounded-lg
            bg-white
            outline-none
            transition-all duration-200

            focus:border-blue-500
            focus:ring-2 focus:ring-blue-100

            hover:border-gray-400
          "
        >
          <option value="url">URL</option>
          <option value="folder">Folder</option>
        </select>

        {/* input */}
        {mode === "folder" ? (
          <label
            className="
              flex-1
              flex items-center
              px-3 py-2
              text-sm
              border border-dashed border-gray-300
              rounded-lg
              bg-white
              cursor-pointer
              text-gray-500
              transition-all duration-200

              hover:border-blue-400 hover:bg-blue-50
            "
          >
            <span className="truncate">Choose file...</span>

            <input
              type="file"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>
        ) : (
          <input
            className="
              flex-1
              px-3 py-2
              text-sm
              border border-gray-300
              rounded-lg
              outline-none
              transition-all duration-200

              focus:border-blue-500
              focus:ring-2 focus:ring-blue-100

              placeholder:text-gray-400
            "
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter media URL..."
          />
        )}
      </div>
    </div>
  );
}
