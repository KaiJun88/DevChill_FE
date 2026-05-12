import { FaCheck } from "react-icons/fa";

export default function Checkbox({
  label,
  checked = false,
  onChange,
  id,
  disabled = false,
}) {
  const checkboxId = id || `checkbox-${label?.replace(/\s+/g, "-")}`;

  return (
    <label
      htmlFor={checkboxId}
      className={`
        flex items-center gap-2.5
        text-sm text-gray-700
        select-none
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <input
        id={checkboxId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer hidden"
      />
      <div
        className="
          w-4 h-4
          flex items-center justify-center
          rounded-md
          border border-gray-300
          bg-white
          transition-all duration-200

          peer-checked:bg-blue-500
          peer-checked:border-blue-500

          peer-focus:ring-2 peer-focus:ring-blue-100

          hover:border-gray-400
        "
      >
        <FaCheck
          className="
            text-white text-[10px]
            opacity-0 scale-75
            transition-all duration-200
            peer-checked:opacity-100
            peer-checked:scale-100
          "
        />
      </div>
      <span className="leading-none">{label}</span>
    </label>
  );
}