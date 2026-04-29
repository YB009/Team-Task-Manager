import { useEffect } from "react";
import { bugsense } from "../utils/bugsense.js";

export function BugSenseBootstrap() {
  useEffect(() => {
    if (!bugsense) return undefined;

    const onError = (event) => {
      void bugsense.captureException(event.error ?? new Error(event.message), {
        tags: { source: "window.onerror" },
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          page: window.location.pathname,
        },
      });
    };

    const onUnhandledRejection = (event) => {
      void bugsense.captureException(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        {
          tags: { source: "unhandledrejection" },
          metadata: { page: window.location.pathname },
        }
      );
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      void bugsense.flush();
    };
  }, []);

  return null;
}
