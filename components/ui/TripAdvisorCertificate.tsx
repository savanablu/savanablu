"use client";

import { useEffect } from "react";

export default function TripAdvisorCertificate() {
  useEffect(() => {
    // Load TripAdvisor widget script
    if (typeof window !== "undefined") {
      const scriptId = "tripadvisor-cdsratingsonlynarrow22";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.async = true;
        script.src =
          "https://www.jscache.com/wejs?wtype=cdsratingsonlynarrow&uniq=22&locationId=7187090&lang=en_US&border=true&display_version=2";
        script.setAttribute("data-loadtrk", "");
        script.onload = function () {
          (this as HTMLScriptElement).setAttribute("loadtrk", "true");
        };
        document.body.appendChild(script);
      }

      // Disable all TripAdvisor links after they're injected
      const disableTripAdvisorLinks = () => {
        const tripAdvisorContainer = document.getElementById("TA_cdsratingsonlynarrow22");
        if (tripAdvisorContainer) {
          const links = tripAdvisorContainer.querySelectorAll("a");
          links.forEach((link) => {
            link.style.pointerEvents = "none";
            link.style.cursor = "default";
            link.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              return false;
            };
          });
        }
      };

      // Try to disable links immediately and after a delay (when script loads)
      disableTripAdvisorLinks();
      setTimeout(disableTripAdvisorLinks, 1000);
      setTimeout(disableTripAdvisorLinks, 3000);

      // Also use MutationObserver to catch dynamically added links
      const observer = new MutationObserver(() => {
        disableTripAdvisorLinks();
      });

      const container = document.getElementById("TA_cdsratingsonlynarrow22");
      if (container) {
        observer.observe(container, { childList: true, subtree: true });
      }

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sb-ink/60">
        Recognized for excellence
      </p>
      <div className="flex justify-center">
        <div
          id="TA_cdsratingsonlynarrow22"
          className="TA_cdsratingsonlynarrow"
        >
          <ul id="3NR13aQk6" className="TA_links hDQP68B0oMiF">
            <li id="NEjZhXsto" className="u0SfO8ZZ">
              <span style={{ cursor: "default", pointerEvents: "none" }}>
                <img
                  src="https://www.tripadvisor.com/img/cdsi/img2/branding/v2/Tripadvisor_lockup_horizontal_secondary_registered-18034-2.svg"
                  alt="TripAdvisor"
                  className="h-auto"
                  style={{ maxWidth: "200px", height: "auto" }}
                />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

