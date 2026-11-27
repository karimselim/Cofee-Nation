import { useEffect, useId, useRef, useState } from "react";

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownProps<T extends string> {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

/** Custom select: a button that opens a styled list. Keyboard and screen reader friendly. */
function Dropdown<T extends string>({ label, value, options, onChange, className = "" }: DropdownProps<T>) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const listId = `${uid}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const openList = () => {
    setActive(selectedIndex);
    setOpen(true);
  };
  const choose = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return openList();
      setActive((a) => (e.key === "ArrowDown" ? Math.min(a + 1, options.length - 1) : Math.max(a - 1, 0)));
    } else if (e.key === "Home" && open) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End" && open) {
      e.preventDefault();
      setActive(options.length - 1);
    } else if ((e.key === "Enter" || e.key === " ") && open) {
      e.preventDefault();
      choose(active);
    }
  };

  return (
    <div ref={root} className={`relative flex flex-col text-left ${className}`}>
      <span id={labelId} className="text-sm mb-1 text-gray-600">
        {label}
      </span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${uid}-value`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className="flex items-center justify-between gap-3 bg-white rounded-lg border border-gray-200 px-3 py-2 h-11 text-left hover:border-buttonColor focus:border-buttonColor outline-none"
      >
        <span id={`${uid}-value`} className="truncate">
          {options[selectedIndex].label}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`w-4 h-4 shrink-0 text-buttonColor transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 7l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className="absolute left-0 right-0 top-full mt-1 z-20 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl py-1"
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={`flex items-center justify-between cursor-pointer px-3 py-2 ${
                i === active ? "bg-firstColor/30" : ""
              } ${o.value === value ? "font-bold text-buttonColor" : ""}`}
            >
              {o.label}
              {o.value === value && <span aria-hidden="true">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
