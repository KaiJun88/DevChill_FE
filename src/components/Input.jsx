export default function Input({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600">
        {label}
      </label>

      <input
        className="
          w-full
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
          
          placeholder:text-gray-400
        "
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}