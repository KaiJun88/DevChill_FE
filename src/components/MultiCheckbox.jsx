import { useState, useMemo } from "react";
import { FaCheck, FaPlus } from "react-icons/fa";

export default function MultiCheckbox({
  label,
  options = [],
  value = [],
  onChange,
}) {
  const [custom, setCustom] = useState("");

  const getName = (item) => (typeof item === "string" ? item : item.name);

  const allOptions = useMemo(() => {
    const merged = [...options, ...value];

    const map = new Map();
    merged.forEach((item) => {
      map.set(getName(item), item);
    });

    return Array.from(map.values());
  }, [options, value]);

  const toggle = (item) => {
    const exists = value.some((v) => getName(v) === getName(item));

    if (exists) {
      onChange(value.filter((v) => getName(v) !== getName(item)));
    } else {
      onChange([...value, item]);
    }
  };

  const addCustom = () => {
    const v = custom.trim();
    if (!v) return;

    const exists = value.some((item) => getName(item) === v);

    if (!exists) {
      onChange([...value, { name: v }]);
    }

    setCustom("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustom();
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {label && (
        <h4 className="text-sm font-semibold text-gray-700">{label}</h4>
      )}

      {/* options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {allOptions.map((opt, idx) => {
          const name = getName(opt);
          const checked = value.some((v) => getName(v) === name);

          return (
            <label
              key={idx}
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
              {/* hidden checkbox */}
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(opt)}
                className="hidden"
              />

              {/* custom checkbox */}
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

              <span className="truncate text-gray-700">{name}</span>
            </label>
          );
        })}
      </div>

      {/* add custom */}
      <div className="flex gap-2">
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
          placeholder="Add more..."
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          onClick={addCustom}
          disabled={!custom.trim()}
          className="
            flex items-center justify-center
            px-3
            rounded-lg
            bg-blue-500 text-white
            transition-all duration-200

            hover:bg-blue-600
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <FaPlus className="text-xs" />
        </button>
      </div>
    </div>
  );
}
