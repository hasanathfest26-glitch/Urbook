"use client";

import { useEffect } from "react";

export function TasteBoot() {
  useEffect(() => {
    const importRuntime = new Function("u", "return import(u)") as (
      u: string
    ) => Promise<{
      mount?: (el: Element) => Promise<unknown>;
      mountAll?: (root: Document) => Promise<unknown>;
    }>;

    importRuntime("/assets/moments/moments.js")
      .then(async (mod) => {
        const els = Array.from(document.querySelectorAll("[data-moment]"));
        if (typeof mod?.mount === "function") {
          await Promise.all(
            els.map((el) =>
              (el as HTMLElement).dataset.momentMounted === "1"
                ? Promise.resolve(null)
                : mod.mount!(el)
            )
          );
          document.documentElement.dataset.momentsReady = String(els.length);
        } else if (typeof mod?.mountAll === "function") {
          await mod.mountAll(document);
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
