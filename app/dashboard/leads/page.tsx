import { notFound } from "next/navigation";
import Link from "next/link";
import { getLead } from "@/lib/db/queries";
import { LeadActions } from "@/components/dashboard/LeadActions";

export const dynamic = "force-dynamic";

function FieldRow({ label, value, mono = false }: { label: string; value: string | number | null | undefined; mono?: boolean }) {
  if (!value) {
    return (
      <div className="flex justify-between gap-4 py-2.5">
        <span className="text-sm font-medium text-[var(--ink-50)]">{label}</span>
        <span className="text-sm text-[var(--ink-30)]">—</span>
      </div>
    );
  }
  return (
    <div className="flex justify-between gap-4 py-2.5">
      <span className="text-sm font-medium text-[var(--ink-50)]">{label}</span>
      <span className={`text-sm text-[var(--ink)] break-all ${mono ? "font-mono" : ""}`}>
        {typeof value === "number" ? value.toFixed(1) : value}
      </span>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

const STAGE_COLORS: Record<string, string> = {
  new: "bg-[var(--ink-10)] text-[var(--ink-70)]",
  enriched: "bg-[var(--sand-tint)] text-[var(--sand-deep)]",
  contacted: "bg-[var(--accent-tint)] text-[var(--accent-strong)]",
  replied: "bg-[var(--accent-tint)] text-[var(--accent-strong)]",
  booked: "bg-[var(--sand-deep)] text-white",
  won: "bg-[var(--accent)] text-white",
  lost: "bg-[var(--ink-10)] text-[var(--ink-50)]",
  nurture: "bg-[var(--sand-tint)] text-[var(--sand-deep)]",
};

export default async function LeadDetailPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  if (!id) notFound();

  const lead = getLead(id);
  if (!lead) notFound();

  const score = lead.score ?? lead.overall_score ?? 0;
  const stage = lead.stage ?? lead.outreach_status ?? "new";
  const website = lead.website || lead.website_url || null;
  const phone = lead.phone || lead.gbp_phone || null;
  const email = lead.email || lead.email_guess || lead.email_found || null;
  const domain = lead.domain || null;
  const domainStatus = lead.domain_status || null;

  const enrichmentFields = [
    { key: "domain", label: "Domain", value: domain },
    { key: "email", label: "Email", value: email },
    { key: "email_found", label: "Email Found", value: lead.email_found ?? null },
    { key: "social_facebook", label: "Facebook", value: lead.social_facebook ?? null },
    { key: "social_instagram", label: "Instagram", value: lead.social_instagram ?? null },
    { key: "social_twitter", label: "Twitter / X", value: lead.social_twitter ?? null },
    { key: "social_linkedin", label: "LinkedIn", value: lead.social_linkedin ?? null },
  ];

  const gbpFields = [
    { key: "gbp_phone", label: "GBP Phone", value: lead.gbp_phone ?? null },
    { key: "gbp_address", label: "GBP Address", value: lead.gbp_address ?? null },
    { key: "gbp_hours", label: "GBP Hours", value: lead.gbp_hours ?? null },
    { key: "gbp_reviews", label: "GBP Reviews", value: lead.gbp_reviews ?? null },
    { key: "gbp_photos", label: "GBP Photos", value: lead.gbp_photos ?? null },
    { key: "gbp_services", label: "GBP Services", value: lead.gbp_services ?? null },
    { key: "gbp_attributes", label: "GBP Attributes", value: lead.gbp_attributes ?? null },
    { key: "gbp_about", label: "GBP About", value: lead.gbp_about ?? null },
  ];

  const hasEmail = Boolean(email);
  const websiteStatus = lead.website_status || null;

  return (
    <div className="fade-in-up flex min-h-screen flex-col bg-[var(--bg)] text-[var(--ink)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--ink-10)] bg-[var(--bg)]/80 backdrop-blur-md">
        <div className="container-x flex h-14 items-center justify-between px-3 py-2 md:px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="label-mono text-xs text-[var(--accent-strong)] hover:text-[var(--ink)]"
            >
              ← Dashboard
            </Link>
            <span className="hidden sm:inline text-sm text-[var(--ink-30)]">/</span>
            <span className="hidden sm:inline text-sm text-[var(--ink-70)]">Lead detail</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="label-mono text-[10px] text-[var(--ink-50)]">
              {new Date(lead.scraped_at || lead.created_at || "").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </header>

      <main className="container-x flex-1 px-1.5 pb-12 pt-8 md:px-2.5 md:pt-10">
        {/* Business name + score + stage */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-display-lg text-[var(--ink)]">{lead.business_name}</h1>
              {lead.category && (
                <p className="mt-1 text-sm text-[var(--ink-50)]">{lead.category}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                label={stage}
                color={STAGE_COLORS[stage] || "bg-[var(--ink-10)] text-[var(--ink-70)]"}
              />
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                  score >= 80
                    ? "bg-[var(--accent)] text-white"
                    : score >= 60
                    ? "bg-[var(--sand-deep)] text-white"
                    : "bg-[var(--ink-10)] text-[var(--ink-70)]"
                }`}
              >
                Score: {score}
              </span>
            </div>
          </div>
        </div>

        {/* Email banner */}
        <div
          className={`mb-8 rounded-2xl border p-5 ${
            hasEmail
              ? "bg-[var(--accent-tint)] border-[var(--accent-tint)]"
              : "bg-[var(--sand-tint)] border-[var(--sand-tint)]"
          }`}
        >
          {hasEmail ? (
            <div className="flex flex-col items-start gap-1">
              <p className="label-mono text-[10px] text-[var(--accent-strong)]">EMAIL FOUND</p>
              <a
                href={`mailto:${email}`}
                className="text-lg font-semibold text-[var(--accent-strong)] hover:underline"
              >
                {email}
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-1">
              <p className="label-mono text-[10px] text-[var(--sand-deep)]">EMAIL NOT YET AVAILABLE</p>
              <p className="text-sm text-[var(--ink-70)]">
                No email has been enriched for this lead yet.
              </p>
              <p className="text-xs text-[var(--ink-50)]">
                Alternatives: call {phone ? phone : "no phone listed"} or use the GBP messaging
                feature if available.
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main info */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5">
              <h2 className="label-mono text-[10px] text-[var(--ink-50)] mb-4">BUSINESS INFO</h2>

              <FieldRow label="Business name" value={lead.business_name} />
              <FieldRow label="Category" value={lead.category || lead.industry} />
              <FieldRow label="Address" value={lead.address} />
              <FieldRow label="Phone" value={phone} mono />
              <FieldRow label="Rating" value={lead.rating ?? null} />
              <FieldRow label="Review count" value={lead.review_count ? String(lead.review_count) : null} />
              <FieldRow label="Website" value={website} mono />
              <FieldRow label="Website status" value={websiteStatus} />
              <FieldRow label="Google Maps URL" value={lead.google_maps_url} mono />

              {/* Source */}
              <div className="flex justify-between gap-4 py-2.5 border-t border-[var(--ink-10)] mt-4">
                <span className="text-sm font-medium text-[var(--ink-50)]">Source</span>
                <span className="text-sm text-[var(--ink)]">{lead.source || lead.sources || "—"}</span>
              </div>

              {/* Scraped at */}
              <div className="flex justify-between gap-4 py-2.5 border-t border-[var(--ink-10)]">
                <span className="text-sm font-medium text-[var(--ink-50)]">Scraped at</span>
                <span className="text-sm text-[var(--ink)]">
                  {lead.scraped_at
                    ? new Date(lead.scraped_at).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "—"}
                </span>
              </div>

              {/* Notes */}
              {lead.notes && (
                <>
                  <div className="flex justify-between gap-4 py-2.5 border-t border-[var(--ink-10)]">
                    <span className="text-sm font-medium text-[var(--ink-50)]">Notes</span>
                  </div>
                  <p className="px-4 py-3 text-sm text-[var(--ink-70)] leading-relaxed bg-[var(--bg)]/50 rounded-lg border border-[var(--ink-10)]">
                    {lead.notes}
                  </p>
                </>
              )}
            </div>

            {/* Enrichment fields */}
            <div className="mt-6 rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5">
              <h2 className="label-mono text-[10px] text-[var(--ink-50)] mb-4">ENRICHMENT</h2>
              {enrichmentFields.some((f) => f.value) ? (
                <div className="space-y-0">
                  {enrichmentFields.map((f) => (
                    <FieldRow key={f.key} label={f.label} value={f.value} mono={f.key === "domain" || f.key === "email"} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--ink-30)]">No enrichment data available yet.</p>
              )}
            </div>

            {/* GBP fields */}
            <div className="mt-6 rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5">
              <h2 className="label-mono text-[10px] text-[var(--ink-50)] mb-4">GOOGLE BUSINESS PROFILE</h2>
              {gbpFields.some((f) => f.value) ? (
                <div className="space-y-0">
                  {gbpFields.map((f) => (
                    <FieldRow key={f.key} label={f.label} value={f.value} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--ink-30)]">No GBP data available yet.</p>
              )}
            </div>

            {/* Score breakdown */}
            <div className="mt-6 rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5">
              <h2 className="label-mono text-[10px] text-[var(--ink-50)] mb-4">SCORE BREAKDOWN</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4 text-center">
                  <p className="label-mono text-[10px] text-[var(--ink-50)]">OVERALL</p>
                  <p className={`text-3xl font-semibold ${score >= 80 ? "text-[var(--accent)]" : score >= 60 ? "text-[var(--sand-deep)]" : "text-[var(--ink)]"}`}>
                    {score}
                  </p>
                </div>
                <div className="rounded-lg border border-[var(--ink-10)] bg-[var(--bg)]/50 p-4 text-center">
                  <p className="label-mono text-[10px] text-[var(--ink-50)]">REVIEW SCORE</p>
                  <p className="text-3xl font-semibold text-[var(--ink)]">
                    {lead.rating ? lead.rating.toFixed(1) : "—"}
                  </p>
                  <p className="text-xs text-[var(--ink-50)] mt-1">
                    {lead.review_count ? `${lead.review_count} reviews` : "No reviews"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - actions */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-[var(--ink-10)] bg-[var(--bg-raised)] p-5 sticky lg:top-8">
              <h2 className="label-mono text-[10px] text-[var(--ink-50)] mb-4">ACTIONS</h2>

              <LeadActions leadId={lead.id} leadName={lead.business_name} />

              <div className="mt-6 pt-4 border-t border-[var(--ink-10)]">
                <Link
                  href="/dashboard"
                  className="block w-full rounded-xl border border-[var(--ink-10)] bg-[var(--bg)]/50 px-4 py-3 text-sm font-medium text-[var(--ink-70)] text-center transition-colors hover:bg-[var(--ink-10)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                >
                  ← Back to dashboard
                </Link>
              </div>

              {/* Lead meta */}
              <div className="mt-4 pt-4 border-t border-[var(--ink-10)] space-y-1.5">
                <p className="label-mono text-[10px] text-[var(--ink-30)]">LEAD ID</p>
                <p className="text-xs font-mono text-[var(--ink-50)] break-all">{lead.id}</p>
                <p className="label-mono text-[10px] text-[var(--ink-30)] mt-2">CREATED</p>
                <p className="text-xs text-[var(--ink-50)]">
                  {lead.created_at
                    ? new Date(lead.created_at).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
