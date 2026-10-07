"use client";

import { useRef, useState } from "react";
import { BUTTON, COLUMN, SUBHEAD } from "@/components/hero/tokens";
import { RESUME_EMAIL, TEAM_NAMES } from "@/lib/careers";
import { CAREER_ROLES, type CareerRole } from "@/lib/career-roles";

const PAGE_SIZE = 5;
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";
const CONTROL = `min-h-11 rounded-md border border-black/20 bg-white px-3 text-[14px] ${FOCUS}`;

/** Search and filters reset pagination; only five roles render at once, regardless of dataset size. */
export function CareersJobBoard({ roles = CAREER_ROLES }: { roles?: readonly CareerRole[] }) {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const [page, setPage] = useState(0);
  const [selectedRole, setSelectedRole] = useState<CareerRole | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const resultsHeading = useRef<HTMLParagraphElement>(null);
  const search = query.trim().toLocaleLowerCase();
  const filtered = roles.filter((role) =>
    (team === "all" || role.team === team) &&
    `${role.title} ${TEAM_NAMES[role.team]} ${role.location} ${role.employment}`.toLocaleLowerCase().includes(search),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleRoles = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  function changePage(next: number) {
    setPage(next);
    resultsHeading.current?.focus({ preventScroll: true });
  }

  function openRole(role: CareerRole) {
    setSelectedRole(role);
    dialog.current?.showModal();
  }

  function resetFilters() {
    setQuery("");
    setTeam("all");
    setPage(0);
  }

  return (
    <section id="openings" aria-labelledby="opportunities-heading" className="scroll-mt-[110px] pb-16 md:pb-20">
      <div className={COLUMN}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="opportunities-heading" className={SUBHEAD}>Find your role</h2>
          <p className="text-[12px] text-black/60">Sample roles for presentation. Not live vacancies.</p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_240px]">
          <label className="grid gap-2 text-[13px] font-medium">
            Search roles
            <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="Job title or keyword" className={CONTROL} />
          </label>
          <label className="grid gap-2 text-[13px] font-medium">
            Team
            <select value={team} onChange={(event) => { setTeam(event.target.value); setPage(0); }} className={CONTROL}>
              <option value="all">All teams</option>
              {Object.entries(TEAM_NAMES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
        <div className="flex min-h-14 items-center justify-between gap-4 text-[13px]">
          <p ref={resultsHeading} tabIndex={-1} role="status" className="rounded-sm text-black/65 focus-visible:outline-2 focus-visible:outline-offset-2">
            {filtered.length === 0 ? "No matching roles" : `${currentPage * PAGE_SIZE + 1}–${Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} of ${filtered.length} roles`}
          </p>
          {(query || team !== "all") && <button type="button" onClick={resetFilters} className={`min-h-11 cursor-pointer underline underline-offset-4 ${FOCUS}`}>Clear filters</button>}
        </div>
        <div className="overflow-hidden rounded-lg border border-black/15">
          <div aria-hidden="true" className="hidden grid-cols-[minmax(0,1fr)_130px_110px_90px] gap-5 bg-[#F6F6F6] px-5 py-3 text-[12px] text-black/60 lg:grid">
            <span>Role / Team</span><span>Location</span><span>Type</span><span />
          </div>
          <ul aria-label="Roles" className="m-0 list-none divide-y divide-black/10 p-0">
            {visibleRoles.map((role) => (
              <li key={role.id}>
                <button type="button" onClick={() => openRole(role)} aria-haspopup="dialog" className="grid min-h-[84px] w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-4 text-left transition-colors duration-150 hover:bg-[#F6F6F6] focus-visible:bg-[#FFF3DF] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black motion-reduce:transition-none lg:grid-cols-[minmax(0,1fr)_130px_110px_90px] lg:gap-5 lg:px-5">
                  <span className="min-w-0">
                    <span className="block text-[16px] leading-[1.35] font-medium">{role.title}</span>
                    <span className="mt-1 block text-[12px] leading-[1.4] text-black/60">{TEAM_NAMES[role.team]}</span>
                  </span>
                  <span className="hidden text-[13px] text-black/70 lg:block">{role.location}</span>
                  <span className="hidden text-[13px] text-black/70 lg:block">{role.employment}</span>
                  <span className="text-[12px] font-medium underline decoration-black/25 underline-offset-4">View role</span>
                  <span className="col-span-2 flex flex-wrap gap-x-4 text-[12px] text-black/60 lg:hidden"><span>{role.location}</span><span>{role.employment}</span></span>
                </button>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
              <p className="text-[18px] font-medium">No roles match your search.</p>
              <p className="mt-2 text-[14px] text-black/65">Try another keyword or choose a different team.</p>
              <button type="button" onClick={resetFilters} className={`mt-5 min-h-11 cursor-pointer underline underline-offset-4 ${FOCUS}`}>Clear search and filters</button>
            </div>
          )}
        </div>
        <nav aria-label="Job results pages" className="mt-4 flex items-center justify-between gap-3 text-[13px]">
          <span className="text-black/60">Page {currentPage + 1} of {pageCount}</span>
          <div className="flex gap-2">
            <button type="button" disabled={currentPage === 0} onClick={() => changePage(currentPage - 1)} className={`${CONTROL} cursor-pointer px-4 enabled:hover:bg-[#F6F6F6] disabled:cursor-not-allowed disabled:opacity-40`}>Previous</button>
            <button type="button" disabled={currentPage >= pageCount - 1} onClick={() => changePage(currentPage + 1)} className={`${CONTROL} cursor-pointer px-4 enabled:hover:bg-[#F6F6F6] disabled:cursor-not-allowed disabled:opacity-40`}>Next</button>
          </div>
        </nav>
      </div>
      <dialog ref={dialog} onClose={() => setSelectedRole(null)} aria-labelledby="career-role-title" className="fixed inset-0 m-auto max-h-[85svh] w-[calc(100%-32px)] max-w-[640px] overflow-y-auto overscroll-contain rounded-xl border border-black/15 bg-white p-0 text-black shadow-xl backdrop:bg-black/45">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-black/10 bg-white px-6 py-3">
          <span className="text-[12px] text-black/60">Sample role · Not a live vacancy</span>
          <button type="button" onClick={() => dialog.current?.close()} autoFocus className={`min-h-11 cursor-pointer px-2 text-[14px] ${FOCUS}`}>Close</button>
        </div>
        {selectedRole && (
          <div className="p-6 md:p-8">
            <p className="text-[13px] text-black/65">{TEAM_NAMES[selectedRole.team]}</p>
            <h2 id="career-role-title" className="mt-3 font-serif text-[36px] leading-[1.1]">{selectedRole.title}</h2>
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 text-[14px]">
              <div><dt className="text-[12px] text-black/60">Location</dt><dd className="mt-1">{selectedRole.location}</dd></div>
              <div><dt className="text-[12px] text-black/60">Employment type</dt><dd className="mt-1">{selectedRole.employment}</dd></div>
            </dl>
            <p className="mt-6 text-[16px] leading-[1.6] text-black/75">{selectedRole.summary}</p>
            <h3 className="mt-7 text-[15px] font-semibold">About the work</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-[1.6] text-black/75">{selectedRole.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
            <div className="mt-8 border-t border-black/15 pt-6">
              <p className="mb-5 text-[13px] leading-[1.5] text-black/60">This listing demonstrates the careers page. Contact Moneybee to ask about actual openings.</p>
              <a href={`mailto:${RESUME_EMAIL}?subject=${encodeURIComponent(`Career enquiry: ${selectedRole.title}`)}`} className={`${BUTTON} bg-[#F6A11A] text-black hover:bg-black hover:text-white`}>Enquire about opportunities</a>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
