"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import { CONTACT_INFO } from "@/constants";

export default function HomeLocation() {
  return (
    <section className="relative overflow-hidden bg-[#f4ecd8] py-28 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.36 }}
            className="lg:col-span-5"
          >
            <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.32em] text-[#1a3d2e]/70">
              <span className="h-px w-10 bg-[#1a3d2e]/40" />
              Як нас знайти
            </p>
            <h2
              className="font-display text-[#1a3d2e]"
              style={{
                fontSize: "clamp(2.25rem, 4.5vw, 4.25rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.02em",
                fontWeight: 300,
              }}
            >
              На краю села, <span className="italic">над ставом</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#1a3d2e]/75">
              Полтавська область, с. Нижні Млини. Близько 15 хвилин від
              Полтави&nbsp;— і ви вже чуєте шум лісу й крик диких качок над
              водою.
            </p>

            <ul className="mt-10 space-y-6 border-t border-[#1a3d2e]/15 pt-8">
              <li className="flex items-start gap-4">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#1a3d2e]" />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/60">
                    Адреса
                  </div>
                  <div className="mt-1 text-[#1a3d2e]">{CONTACT_INFO.address}</div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-[#1a3d2e]" />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/60">
                    Телефони
                  </div>
                  <div className="mt-1 flex flex-col gap-0.5 text-[#1a3d2e]">
                    {CONTACT_INFO.phone.slice(0, 2).map((p) => (
                      <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="hover:underline">
                        {p}
                      </a>
                    ))}
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Clock className="mt-1 h-4 w-4 shrink-0 text-[#1a3d2e]" />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/60">
                    Години роботи
                  </div>
                  <div className="mt-1 text-[#1a3d2e]">{CONTACT_INFO.workingHours}</div>
                </div>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.41, delay: 0.05 }}
            className="lg:col-span-7"
          >
            <figure className="relative">
              {/* Decorative outer frame — editorial cartographic style */}
              <div className="relative border border-[#1a3d2e]/25 bg-[#faf6ec] p-4 md:p-6 shadow-[0_30px_60px_-30px_rgba(26,61,46,0.25)]">
                {/* Top meta strip */}
                <div className="mb-3 flex items-center justify-between gap-4 border-b border-dashed border-[#1a3d2e]/20 pb-3">
                  <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/60">
                    49°33′18″ N · 34°35′12″ E
                  </span>
                  <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9a95c]">
                    Полтавщина
                  </span>
                </div>

                {/* Corner decorations */}
                <div aria-hidden className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-[#c9a95c]" />
                <div aria-hidden className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-[#c9a95c]" />
                <div aria-hidden className="pointer-events-none absolute left-2 bottom-2 h-3 w-3 border-l border-b border-[#c9a95c]" />
                <div aria-hidden className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r border-b border-[#c9a95c]" />

                {/* Inner map well */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-[#1a3d2e]/15 bg-[#1a3d2e]/5 md:aspect-[16/11] shadow-inner">
                  <iframe
                    src="https://maps.google.com/maps?q=49.554961,34.5867374&z=16&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Карта Глухомань"
                  />
                  {/* Subtle vignette to blend into paper */}
                  <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_rgba(26,61,46,0.15)]" />
                </div>

                {/* Bottom meta strip */}
                <div className="mt-3 flex flex-col gap-2 border-t border-dashed border-[#1a3d2e]/20 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-display italic text-base text-[#1a3d2e]/80">
                      с. Нижні Млини
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#1a3d2e]/45">
                      · 10 хв від Полтави
                    </span>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/dVGkQZU4KVFgk5hq9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9a95c] hover:text-[#1a3d2e] transition-colors"
                  >
                    <span>Відкрити в Google Maps</span>
                    <span className="inline-block transition-transform group-hover:translate-x-0.5">↗</span>
                  </a>
                </div>
              </div>

              {/* Figure caption — editorial */}
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-[#1a3d2e]/20" />
                <span className="text-[9px] uppercase tracking-[0.28em] text-[#1a3d2e]/50">
                  Карта · Мапа території
                </span>
                <span className="h-px flex-1 bg-[#1a3d2e]/20" />
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
