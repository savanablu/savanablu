"use client";

import { useEffect } from "react";

type TripAdvisorRatedProps = {
  showText?: boolean;
};

export default function TripAdvisorRated({ showText = true }: TripAdvisorRatedProps) {
  useEffect(() => {
    // Load TripAdvisor rated widget script
    if (typeof window !== "undefined") {
      const scriptId = "tripadvisor-rated919";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.async = true;
        script.src =
          "https://www.jscache.com/wejs?wtype=rated&uniq=919&locationId=7187090&lang=en_US&display_version=2";
        script.setAttribute("data-loadtrk", "");
        script.onload = function () {
          (this as HTMLScriptElement).setAttribute("loadtrk", "true");
        };
        document.body.appendChild(script);
      }

      // Disable all TripAdvisor links after they're injected
      const disableTripAdvisorLinks = () => {
        const tripAdvisorContainer = document.getElementById("TA_rated919");
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

      const container = document.getElementById("TA_rated919");
      if (container) {
        observer.observe(container, { childList: true, subtree: true });
      }

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div className="flex flex-col items-center space-y-2">
      {showText && (
        <p className="text-[0.75rem] font-medium text-sb-ink/70">
          ⭐⭐⭐⭐⭐ Reviews on TripAdvisor
        </p>
      )}
      <div id="TA_rated919" className="TA_rated">
        <ul id="1BBeeVgb" className="TA_links vVc36h7sF">
          <li id="XJfbccDW2b" className="W25qkZJZG1Gi">
            <span style={{ cursor: "default", pointerEvents: "none" }}>
              <img
                src="https://www.tripadvisor.com/img/cdsi/img2/badges/ollie-11424-2.gif"
                alt="TripAdvisor"
                className="h-auto"
                style={{ maxWidth: "150px", height: "auto" }}
              />
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

