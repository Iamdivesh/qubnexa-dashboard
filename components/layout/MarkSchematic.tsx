/**
 * No-WebGL fallback: the official mark rendered as a flat CSS schematic —
 * ring, blade, pixel constellation. Decorative only (parent is aria-hidden).
 */
export function MarkSchematic() {
  const pixels: Array<{ left: string; top: string; size: number; azure: boolean }> = [
    { left: "58%", top: "18%", size: 18, azure: true },
    { left: "66%", top: "12%", size: 10, azure: false },
    { left: "72%", top: "22%", size: 14, azure: true },
    { left: "63%", top: "28%", size: 8, azure: false },
    { left: "70%", top: "9%", size: 7, azure: true },
    { left: "55%", top: "10%", size: 11, azure: false },
  ];

  return (
    <div className="absolute inset-0">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-[62%]">
        <div className="relative h-64 w-64">
          <div className="absolute inset-0 rounded-full border-[6px] border-azure [clip-path:polygon(0_0,100%_0,100%_38%,0_38%,0_100%,58%_100%,58%_62%,0_62%)] opacity-90" />
          <div className="absolute inset-0 rounded-full border-[6px] border-navy [clip-path:polygon(58%_38%,100%_38%,100%_62%,58%_62%)] opacity-90" />
          <div className="absolute left-[74%] top-[74%] h-[6px] w-[38%] origin-left rotate-45 rounded-[2px] bg-azure" />
          {pixels.map((p, i) => (
            <div
              key={i}
              className={`absolute rounded-[2px] ${p.azure ? "bg-azure" : "bg-navy"}`}
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
