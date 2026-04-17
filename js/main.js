"use strict";

/* ============================================================
   Shortly — main.js
   ============================================================ */

// ------------------------------------------------------------------
// 1. DOM References
// ------------------------------------------------------------------
const form = document.getElementById("url-form");
const input = document.getElementById("url-input");
const errorMsg = document.getElementById("error-msg");
const resultsList = document.getElementById("results-list");
const shortenBtn = document.getElementById("shorten-btn");

// ------------------------------------------------------------------
// 2. Constants
// ------------------------------------------------------------------
// is.gd — primary
const ISGD_ENDPOINT = "https://is.gd/create.php";
// CleanURI — fallback
const CLEANURI_ENDPOINT = "https://cleanuri.com/api/v1/shorten";
const STORAGE_KEY = "shortly_links";

// ------------------------------------------------------------------
// 3. localStorage Helpers
// ------------------------------------------------------------------

function getSavedLinks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLinks(links) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

function persistLink(original, short) {
  const links = getSavedLinks();
  links.unshift({ original, short });
  if (links.length > 10) links.pop();
  saveLinks(links);
}

// ------------------------------------------------------------------
// 4. Validation
// ------------------------------------------------------------------

function isValidUrl(value) {
  if (!value.trim()) return false;

  if (!value.startsWith("http://") && !value.startsWith("https://")) {
    const fixed = "https://" + value;
    try {
      new URL(fixed);
      input.value = fixed;
      return true;
    } catch {
      return false;
    }
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function showError(message = "Please add a link") {
  form.classList.add("is-error");
  errorMsg.textContent = message;
}

function clearError() {
  form.classList.remove("is-error");
}

// ------------------------------------------------------------------
// 5. Loading State
// ------------------------------------------------------------------

function setLoading(isLoading) {
  shortenBtn.disabled = isLoading;
  shortenBtn.textContent = isLoading ? "Shortening…" : "Shorten It!";
}

// ------------------------------------------------------------------
// 6. XSS-safe string helper
// ------------------------------------------------------------------

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ------------------------------------------------------------------
// 7. Build a single result row
// ------------------------------------------------------------------

function createResultItem(original, short) {
  const li = document.createElement("li");
  li.className = "shortener__result-item";

  li.innerHTML = `
    <span
      class="shortener__url-original"
      title="${escapeHtml(original)}"
    >${escapeHtml(original)}</span>

    <div class="shortener__result-right">
      <a
        href="${escapeHtml(short)}"
        class="shortener__url-short"
        target="_blank"
        rel="noopener noreferrer"
      >${escapeHtml(short)}</a>

      <button
        type="button"
        class="shortener__copy-btn btn-cyan"
        data-url="${escapeHtml(short)}"
        aria-label="Copy ${escapeHtml(short)} to clipboard"
      >Copy</button>
    </div>
  `;

  li.querySelector(".shortener__copy-btn").addEventListener(
    "click",
    handleCopy,
  );

  return li;
}

// ------------------------------------------------------------------
// 8. Render helpers
// ------------------------------------------------------------------

function prependResult(original, short) {
  resultsList.prepend(createResultItem(original, short));
}

function renderSavedLinks() {
  const links = getSavedLinks();
  links.forEach(({ original, short }) => {
    resultsList.appendChild(createResultItem(original, short));
  });
}

// ------------------------------------------------------------------
// 9. Copy to Clipboard
// ------------------------------------------------------------------

async function handleCopy(event) {
  const btn = event.currentTarget;
  const url = btn.dataset.url;
  document
    .querySelectorAll(".shortener__copy-btn.copied")
    .forEach(resetCopyBtn);

  try {
    await navigator.clipboard.writeText(url);
  } catch {
    fallbackCopy(url);
  }

  btn.textContent = "Copied!";
  btn.classList.add("copied");

  setTimeout(() => resetCopyBtn(btn), 2000);
}

function resetCopyBtn(btn) {
  btn.textContent = "Copy";
  btn.classList.remove("copied");
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.cssText = "position:fixed;opacity:0;pointer-events:none;";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
  } catch {}
  document.body.removeChild(ta);
}

// ------------------------------------------------------------------
// 10. API Call
// ------------------------------------------------------------------

async function shortenUrl(url) {
  try {
    const params = new URLSearchParams({
      format: "json",
      url,
      logstats: "0",
    });
    const res = await fetch(`${ISGD_ENDPOINT}?${params}`);
    const data = await res.json();
    if (data.shorturl) return data.shorturl;
    if (data.errormessage) throw new Error(data.errormessage);
  } catch (err) {
    console.warn("[ Shortly] is.gd failed, trying CleanURI…", err);
  }

  const body = new URLSearchParams({ url });
  const response = await fetch(CLEANURI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Both APIs unavailable (${response.status})`);
  }

  const data = await response.json();
  if (!data.result_url) {
    throw new Error(data.error || "Could not shorten this URL.");
  }

  return data.result_url;
}

// ------------------------------------------------------------------
// 11. Form Submit Handler
// ------------------------------------------------------------------

async function handleSubmit(event) {
  event.preventDefault();
  clearError();

  const rawValue = input.value.trim();

  if (!rawValue) {
    showError("Please add a link");
    input.focus();
    return;
  }

  if (!isValidUrl(rawValue)) {
    showError("Please enter a valid URL (e.g. https://example.com)");
    input.focus();
    return;
  }

  setLoading(true);

  try {
    const shortUrl = await shortenUrl(rawValue);
    prependResult(rawValue, shortUrl);
    persistLink(rawValue, shortUrl);
    input.value = "";
    resultsList.firstElementChild
      ?.querySelector(".shortener__copy-btn")
      ?.focus();
  } catch (err) {
    showError(
      "Could not reach the shortening service. Make sure you are running the page from a local server (not file://), and check your internet connection.",
    );
    console.error("[Shortly]", err);
  } finally {
    setLoading(false);
  }
}

// ------------------------------------------------------------------
// 12. Live validation clear — remove red border as user types
// ------------------------------------------------------------------
input.addEventListener("input", () => {
  if (form.classList.contains("is-error")) clearError();
});

// ------------------------------------------------------------------
// 13. Initialise
// ------------------------------------------------------------------
form.addEventListener("submit", handleSubmit);
renderSavedLinks();
