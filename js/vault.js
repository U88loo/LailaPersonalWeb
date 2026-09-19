/* =========================================================
   vault.js — password gate + private deployment tracker.

   The password is NEVER stored in this file or anywhere in the
   site's source. The first time this page is unlocked on a given
   browser, it asks you to set a password, hashes it (SHA-256, via
   the browser's built-in Web Crypto — no library), and keeps only
   that hash in this browser's localStorage. Every unlock after
   that just re-hashes what you type and compares.

   Honest limits: this is a client-side deterrent, not real
   security — there's no backend here to be the source of truth.
   Since anyone's *first* visit to this page on a fresh browser
   gets the "set up a password" flow, real protection comes from
   the doorway itself being hidden (nobody stumbles onto this URL).
   For genuine access control, this page would need to sit behind
   real server-side auth once deployed.
   ========================================================= */

(function () {
  const HASH_KEY = "vault-hash";
  const UNLOCK_KEY = "vault-unlocked";
  const DATA_KEY = "vault-deployments";

  const lockScreen = document.getElementById("vault-lock");
  const dashboard = document.getElementById("vault-dashboard");
  const form = document.getElementById("vault-form");
  const passwordInput = document.getElementById("vault-password");
  const errorEl = document.getElementById("vault-error");
  const titleEl = document.getElementById("vault-lock-title");
  const descEl = document.getElementById("vault-lock-desc");
  const submitBtn = document.getElementById("vault-submit");

  async function sha256(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  const hasPassword = () => !!localStorage.getItem(HASH_KEY);
  const isUnlocked = () => localStorage.getItem(UNLOCK_KEY) === "1";

  function showDashboard() {
    lockScreen.hidden = true;
    dashboard.hidden = false;
    renderDeployments();
  }

  function showLock(setupMode) {
    dashboard.hidden = true;
    lockScreen.hidden = false;
    passwordInput.value = "";
    errorEl.textContent = "";
    if (setupMode) {
      titleEl.textContent = "Set up your vault";
      descEl.textContent = "First time here — choose a password. It's hashed and kept only in this browser; it's never written into the site's code.";
      submitBtn.textContent = "set password";
    } else {
      titleEl.textContent = "Private Vault";
      descEl.textContent = "This area is just for Laila. Enter the password to continue.";
      submitBtn.textContent = "unlock";
    }
    setTimeout(() => passwordInput.focus(), 50);
  }

  function init() {
    if (isUnlocked() && hasPassword()) showDashboard();
    else showLock(!hasPassword());
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const value = passwordInput.value;
    if (!value) return;

    if (!hasPassword()) {
      if (value.length < 4) {
        errorEl.textContent = "Use at least 4 characters.";
        return;
      }
      localStorage.setItem(HASH_KEY, await sha256(value));
      localStorage.setItem(UNLOCK_KEY, "1");
      showDashboard();
      return;
    }

    const hash = await sha256(value);
    if (hash === localStorage.getItem(HASH_KEY)) {
      localStorage.setItem(UNLOCK_KEY, "1");
      showDashboard();
    } else {
      errorEl.textContent = "Wrong password.";
      passwordInput.value = "";
      passwordInput.focus();
    }
  });

  document.getElementById("vault-lock-btn").addEventListener("click", () => {
    localStorage.removeItem(UNLOCK_KEY);
    showLock(false);
  });

  // ---- deployment tracker ----
  function getDeployments() {
    try { return JSON.parse(localStorage.getItem(DATA_KEY) || "[]"); } catch (e) { return []; }
  }
  function saveDeployments(list) {
    localStorage.setItem(DATA_KEY, JSON.stringify(list));
  }
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderDeployments() {
    const list = getDeployments();
    const wrap = document.getElementById("deploy-list");
    if (!list.length) {
      wrap.innerHTML = `<p class="deploy-empty">Nothing logged yet — add your first deployed project above.</p>`;
      return;
    }
    wrap.innerHTML = list.map((d, i) => `
      <div class="deploy-card">
        <div class="deploy-card-top">
          <span class="deploy-status status-${d.status.toLowerCase()}">${escapeHtml(d.status)}</span>
          <button data-i="${i}" class="deploy-delete" aria-label="Delete">✕</button>
        </div>
        <h3><a href="${escapeHtml(d.url)}" target="_blank" rel="noopener">${escapeHtml(d.name)}</a></h3>
        <p class="deploy-url">${escapeHtml(d.url)}</p>
        ${d.notes ? `<p class="deploy-notes">${escapeHtml(d.notes)}</p>` : ""}
      </div>
    `).join("");

    wrap.querySelectorAll(".deploy-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        const current = getDeployments();
        current.splice(Number(btn.dataset.i), 1);
        saveDeployments(current);
        renderDeployments();
      });
    });
  }

  document.getElementById("deploy-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("deploy-name").value.trim();
    const url = document.getElementById("deploy-url").value.trim();
    const status = document.getElementById("deploy-status").value;
    const notes = document.getElementById("deploy-notes").value.trim();
    if (!name || !url) return;
    const list = getDeployments();
    list.unshift({ name, url, status, notes });
    saveDeployments(list);
    e.target.reset();
    renderDeployments();
  });

  init();
})();
