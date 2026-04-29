import { BugSense } from "@bugsense/bugsense-js";

const endpoint = import.meta.env.VITE_BUGSENSE_ENDPOINT;
const projectId = import.meta.env.VITE_BUGSENSE_PROJECT_ID;
const apiKey = import.meta.env.VITE_BUGSENSE_API_KEY;

const isConfigured = Boolean(endpoint && projectId && apiKey);
let userContext = null;
let globalTags = {
  workspace: "workvite",
};

const sdk = isConfigured
  ? new BugSense({
      endpoint,
      projectId,
      apiKey,
      environment: import.meta.env.VITE_BUGSENSE_ENVIRONMENT || "development",
      release: import.meta.env.VITE_BUGSENSE_RELEASE || "workvite-local",
      autoCapture: false,
      maxBatchSize: Number(import.meta.env.VITE_BUGSENSE_MAX_BATCH_SIZE || 10),
      flushIntervalMs: Number(import.meta.env.VITE_BUGSENSE_FLUSH_INTERVAL_MS || 5000),
    })
  : null;

const stringifyTags = (tags = {}) =>
  Object.fromEntries(
    Object.entries(tags)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => [key, String(value)])
  );

const withContext = (context = {}) => {
  const metadata = {
    ...(userContext ? { user: userContext } : {}),
    ...context.metadata,
    ...context.extra,
  };

  return {
    ...context,
    tags: stringifyTags({
      ...globalTags,
      ...context.tags,
    }),
    metadata,
  };
};

export const bugsense = sdk
  ? {
      captureException(error, context) {
        return sdk.captureException(error, withContext(context));
      },
      captureMessage(message, context) {
        return sdk.captureMessage(message, withContext(context));
      },
      flush() {
        return sdk.flush();
      },
      getOptions() {
        return sdk.getOptions();
      },
      setUser(user) {
        userContext = user
          ? {
              id: user.id || user.uid || user.firebaseUid,
              email: user.email,
              name: user.name || user.displayName,
            }
          : null;
      },
      setTags(tags = {}) {
        globalTags = stringifyTags({
          workspace: "workvite",
          ...tags,
        });
      },
    }
  : null;

export const isBugSenseConfigured = isConfigured;

if (typeof window !== "undefined") {
  window.bugsense = bugsense;
  window.triggerBugSenseTestError = () => {
    setTimeout(() => {
      throw new Error("Workvite BugSense test error");
    }, 0);
  };
  window.sendBugSenseSmokeTest = () => {
    if (!bugsense) {
      console.warn("[BugSense] SDK not configured; smoke test was not sent.");
      return Promise.resolve(null);
    }

    return bugsense.captureMessage("Workvite BugSense integration test", {
      tags: { source: "manual-smoke-test" },
      metadata: { page: window.location.pathname },
    });
  };

  if (!isConfigured && import.meta.env.DEV) {
    console.warn(
      "[BugSense] Missing VITE_BUGSENSE_ENDPOINT, VITE_BUGSENSE_PROJECT_ID, or VITE_BUGSENSE_API_KEY. SDK not started.",
    );
  }
}
