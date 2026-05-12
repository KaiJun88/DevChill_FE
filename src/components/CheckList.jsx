import { FaCheck } from "react-icons/fa";

export default function CheckList({
  label,
  options = [],
  value = [],
  onChange,
}) {
  const toggle = (item) => {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item));
    } else {
      onChange([...value, item]);
    }
  };
  return (
    <div className="flex flex-col gap-2.5">
      {label && (
        <h4 className="text-sm font-semibold text-gray-700">{label}</h4>
      )}

      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const checked = value.includes(opt);
          return (
            <label
              key={opt}
              className={`
                flex items-center gap-2.5
                px-3 py-2
                rounded-lg
                border
                text-sm
                cursor-pointer
                transition-all duration-200
                select-none

                ${
                  checked
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }
              `}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(opt)}
                className="peer hidden"
              />
              <div
                className={`
                  w-4 h-4
                  flex items-center justify-center
                  rounded-md
                  border
                  transition-all duration-200

                  ${
                    checked
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300 bg-white"
                  }
                `}
              >
                <FaCheck
                  className={`
                    text-white text-[10px]
                    transition-all duration-200
                    ${checked ? "opacity-100 scale-100" : "opacity-0 scale-75"}
                  `}
                />
              </div>
              <span className="leading-none text-gray-700">{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
