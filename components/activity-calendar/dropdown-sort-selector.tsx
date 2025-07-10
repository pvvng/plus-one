"use client";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

interface Option {
  label: string;
  value: string;
}

interface DropdownSelectorProps {
  options: Option[];
  selected: Option;
  onSelect: (option: Option) => void;
}

export default function DropdownSelector({
  options,
  selected,
  onSelect,
}: DropdownSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleSelect = (option: Option) => {
    onSelect(option);
    setOpen(false);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // GSAP 애니메이션
  useLayoutEffect(() => {
    if (!dropdownRef.current) return;

    const el = dropdownRef.current;

    if (open) {
      gsap.fromTo(
        el,
        { opacity: 0, y: -5, display: "none" },
        {
          opacity: 1,
          y: 0,
          display: "block",
          duration: 0.2,
          ease: "power2.out",
        }
      );
    } else {
      gsap.to(el, {
        opacity: 0,
        y: -5,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          if (el) el.style.display = "none";
        },
      });
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative text-sm">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-3 py-1 rounded border bg-white text-neutral-800 border-neutral-300 flex gap-1 items-center
        dark:bg-neutral-800 dark:text-white dark:border-neutral-700 cursor-pointer"
      >
        <AdjustmentsHorizontalIcon className="size-3" /> {selected.label}
      </button>

      {/* 드롭다운 */}
      <ul
        ref={dropdownRef}
        className="absolute right-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded shadow z-10 min-w-[100px]"
        style={{ display: "none", opacity: 0 }}
      >
        {options.map((option) => (
          <li
            key={option.value}
            onClick={() => handleSelect(option)}
            className={`px-3 py-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 ${
              selected.value === option.value && "font-semibold text-blue-500"
            }`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
