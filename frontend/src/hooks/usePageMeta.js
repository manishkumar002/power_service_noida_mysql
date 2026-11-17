import { useEffect } from "react";
import { COMPANY } from "../config/company";

const SITE = COMPANY.name;

/** Pass `null` as pageTitle to skip (child page sets its own meta). */
export const usePageMeta = (pageTitle, description) => {
  useEffect(() => {
    if (pageTitle === null) return;

    const fullTitle = pageTitle
      ? `${pageTitle} | ${SITE}`
      : `${SITE} — Online UPS & Power Backup`;
    document.title = fullTitle;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      description ||
        `${COMPANY.name} — Online UPS, Industrial UPS, Rental, AMC & power backup solutions across India.`,
    );
  }, [pageTitle, description]);
};
