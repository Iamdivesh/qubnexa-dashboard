"use client";

import { useEffect, useRef } from "react";
import { rail } from "@/content/site";
import { ScrollTrigger } from "@/lib/motion-tokens";

export function ChapterRail() {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll("[data-rail-item]"));

    const triggers = rail.items.map((item, i) => {
      const section = document.getElementById(item.href);
      if (!section) return null;
      return ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          const el = items[i];
          if (!el) return;
          el.classList.toggle("rail-active", self.isActive);
          if (self.isActive) {
            items.forEach((other) => {
              if (other !== el) other.classList.remove("rail-active");
            });
          }
        },
      });
    });

    return () => triggers.forEach((t) => t?.kill());
  }, []);

  return (
    <ul
      ref={listRef}
      aria-hidden="true"
      className="fixed left-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-4 lg:flex"
    >
      {rail.items.map((item) => (
        <li key={item.href} data-rail-item className="flex items-center gap-3">
          <span className="rail-tick h-px w-6 bg-text-low transition-all duration-300" />
          <span className="metadata-mono text-text-low opacity-0 transition-opacity duration-300">
            {item.index} {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
