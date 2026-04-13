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
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
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
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-[#1a3d2e]/15 bg-[#1a3d2e]/5 md:aspect-[16/11]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2637.389!2d34.513!3d49.583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z0J3QuNC20L3RltC80LvQuNC90Lg!5e0!3m2!1suk!2sua!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Карта Глухомань"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
