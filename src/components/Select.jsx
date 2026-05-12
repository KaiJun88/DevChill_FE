import { FaChevronDown } from "react-icons/fa";
export default function Select({
  label,
  value,
  options = [],
  onChange,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-gray-600">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full
            appearance-none
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
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-sm">
          <FaChevronDown
          className="
            pointer-events-none
            absolute right-3 top-1/2 -translate-y-1/2
            text-gray-400 text-xs
          "
        />
        </div>
      </div>
    </div>
  );
}