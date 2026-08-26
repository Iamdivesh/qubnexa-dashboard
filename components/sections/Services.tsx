"use client";

import { useEffect, useRef, useState } from "react";
import { LinkArrow } from "@/components/ui/Buttons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { services } from "@/content/site";
import { gsap, ScrollTrigger } from "@/lib/motion-tokens";
import { threeStore } from "@/lib/three-store";

function ServiceRow({
  row,
  index,
  open,
  onToggle,
}: {
  row: (typeof services.rows)[number];
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <li className="border-t border-border last:border-b" data-service-row>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`service-panel-${row.id}`}
          id={`service-button-${row.id}`}
          onClick={onToggle}
          className="group flex w-full items-baseline gap-6 py-6 text-left"
        >
          <span
            className={`metadata-mono transition-colors duration-200 ${
              open ? "text-azure" : "text-text-low group-hover:text-text-mid"
            }`}
          >
            {num}
          </span>
          <span className="flex-1 text-[1.0625rem] font-medium tracking-[-0.01em] text-text-hi md:text-[1.25rem]">
            {row.name}
          </span>
          <span className="metadata-mono hidden max-w-[40%] text-text-low lg:block">
            {row.tech.join(" · ")}
          </span>
          <span
            aria-hidden
            className={`label-mono text-text-low transition-transform duration-300 ${
              open ? "rotate-45 text-azure" : ""
            }`}
          >
            +
          </span>
        </button>
      </h3>
      <div
        id={`service-panel-${row.id}`}
        role="region"
        aria-labelledby={`service-button-${row.id}`}
        hidden={!open}
        className="pb-8 pl-[calc(1.5rem+2.75rem)] md:pl-[calc(1.5rem+3rem)]"
      >
        <p className="max-w-[62ch] text-sm leading-[1.65] text-text-hi">{row.what}</p>
        <dl className="mt-5 grid gap-x-12 gap-y-4 md:grid-cols-2">
          <div>
            <dt className="label-mono text-text-low">The problem</dt>
            <dd className="mt-1.5 max-w-[48ch] text-sm leading-[1.65] text-text-mid">
              {row.problem}
            </dd>
          </div>
          <div>
            <dt className="label-mono text-text-low">What we do</dt>
            <dd className="mt-1.5 max-w-[48ch] text-sm leading-[1.65] text-text-mid">
              {row.does}
            </dd>
          </div>
          <div className="md:col-span-2">
            <dt className="label-mono text-text-low">What you get</dt>
            <dd className="mt-1.5 max-w-[56ch] text-sm leading-[1.65] text-sky">
              {row.get}
            </dd>
          </div>
        </dl>
        <LinkArrow href={`#cta?service=${row.id}`} className="mt-6">
          {services.rowLinkLabel}
        </LinkArrow>
      </div>
    </li>
  );
}

export function Services() {
  const [openId, setOpenId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || threeStore.reduced) return;
    // Quiet reveal on entry; no pin — this chapter flows natively.
    const rows = Array.from(list.querySelectorAll("[data-service-row]"));
    const triggers = rows.map((row) =>
      ScrollTrigger.create({
        trigger: row,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            row,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, ease: "out-expo" }
          );
        },
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section id="services" aria-labelledby="services-title" className="relative py-32 md:py-40">
      <p className="sr-only">{services.summary}</p>
      <div className="container-x">
        <SectionHeader
          index={services.index}
          eyebrow={services.eyebrow}
          title={services.title}
          titleId="services-title"
        />
        <p className="mt-6 max-w-[58ch] leading-[1.65] text-text-mid">{services.intro}</p>
        <ul ref={listRef} className="mt-14">
          {services.rows.map((row, i) => (
            <ServiceRow
              key={row.id}
              row={row}
              index={i}
              open={openId === row.id}
              onToggle={() => setOpenId(openId === row.id ? null : row.id)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
