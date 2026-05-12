export default function Textarea({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-gray-600">{label}</label>
      )}
      <textarea
        className="
          w-full
          min-h-25
          px-3 py-2
          text-sm
          border border-gray-300
          rounded-lg
          bg-white
          outline-none
          resize-y
          transition-all duration-200

          focus:border-blue-500
          focus:ring-2 focus:ring-blue-100

          hover:border-gray-400

          placeholder:text-gray-400
        "
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter content..."
      />
    </div>
  );
}
