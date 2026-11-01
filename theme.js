(() => {
  const storageKey = "advay-portfolio-theme";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  let preference = null;

  try {
    const storedTheme = localStorage.getItem(storageKey);
    if (storedTheme === "light" || storedTheme === "dark") preference = storedTheme;
  } catch {
    // The switch still works when browser storage is unavailable.
  }

  function syncControl() {
    const button = document.getElementById("theme-toggle");
    if (!button) return;
    const dark = document.documentElement.dataset.theme === "dark";
    const action = dark ? "Switch to light theme" : "Switch to dark theme";
    button.setAttribute("aria-checked", String(dark));
    button.title = action;
    document.getElementById("theme-tooltip").textContent = action;
  }

  function applyTheme() {
    document.documentElement.dataset.theme = preference || (systemTheme.matches ? "dark" : "light");
    syncControl();
  }

  applyTheme();

  document.addEventListener("DOMContentLoaded", () => {
    syncControl();
    document.getElementById("theme-toggle").addEventListener("click", () => {
      preference = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme();
      try {
        localStorage.setItem(storageKey, preference);
      } catch {
        // Keep the current page usable in private or storage-restricted browsers.
      }
    });
  });

  systemTheme.addEventListener("change", () => {
    if (!preference) applyTheme();
  });

  window.addEventListener("storage", event => {
    if (event.key !== storageKey && event.key !== null) return;
    preference = event.newValue === "dark" || event.newValue === "light" ? event.newValue : null;
    applyTheme();
  });
})();
