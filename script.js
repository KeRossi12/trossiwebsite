// Literary-style portfolio script:
// - mobile menu
// - bibliographic "Selected work" list with search + filter
// - contact form opens a mailto draft
// - placeholder download links show a message in the form note area

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/**
 * Categories used here must match:
 * - data-cat values on rows
 * - <select id="filter"> option values in index.html (recommended)
 */
const WORK = [
  {
    title: "“Our Father”",
    category: "nonfiction",
    publication: "BULL",
    year: "2025",
    note: "",
    href: "https://mrbullbull.com/newbull/writer/tessa-rossi/"
  },
  {
    title: "“Maketh the Man”",
    category: "nonfiction",
    publication: "Invisible City Literary Journal",
    year: "2023",
    note: "",
    href: "https://www.invisiblecitylit.com/fiction/maketh-the-man/"
  },
  {
    title: "“The Undoing”",
    category: "nonfiction",
    publication: "Ogre Red",
    year: "2022",
    note: "",
    href: "https://ogre.red/issues/2022-07/2022-07-rossi-tessa-ellison/"
  }
];

const LABELS = {
  fiction: "Fiction",
  nonfiction: "Flash Nonfiction",
  essay: "Essay",
  review: "Review",
  editing: "Editing",
  reading: "Reading"
};

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isExternalUrl(url) {
  try {
    const u = new URL(url, window.location.href);
    return u.origin !== window.location.origin;
  } catch {
    return false;
  }
}

function label(cat) {
  return LABELS[cat] || "Work";
}

function itemToRow(item) {
  const searchBlob = `${item.title} ${item.publication} ${item.note} ${item.year}`.toLowerCase();

  const safeTitle = escapeHtml(item.title);
  const safePub = escapeHtml(item.publication);
  const safeNote = escapeHtml(item.note);
  const safeYear = escapeHtml(item.year);
  const safeHref = escapeHtml(item.href);

  const external = isExternalUrl(item.href);
  const targetAttrs = external ? ` target="_blank" rel="noopener"` : "";

  return `
    <li class="work-row" data-cat="${escapeHtml(item.category)}" data-search="${escapeHtml(searchBlob)}">
      <div>
        <p class="work-title">
          <a href="${safeHref}"${targetAttrs}>${safeTitle}</a>
        </p>
        <span class="work-tag">${label(item.category)}</span>
      </div>

      <div class="work-meta">
        <em>${safePub}</em><br/>
        <span>${safeNote}</span>
      </div>

      <div class="work-year">${safeYear}</div>
    </li>
  `;
}

function renderWork() {
  const list = $("#workList");
  if (!list) return;
  list.innerHTML = WORK.map(itemToRow).join("");
}

function applyFilters() {
  const searchEl = $("#search");
  const filterEl = $("#filter");
  const list = $("#workList");
  if (!searchEl || !filterEl || !list) return;

  const q = (searchEl.value || "").trim().toLowerCase();
  const cat = filterEl.value;

  const rows = $$("#workList .work-row");
  let visible = 0;

  for (const r of rows) {
    const matchesCat = (cat === "all") || (r.dataset.cat === cat);
    const matchesQ = !q || (r.dataset.search || "").includes(q);
    const show = matchesCat && matchesQ;

    // Preserve your grid layout when visible
    r.style.display = show ? "grid" : "none";
    if (show) visible++;
  }

  list.setAttribute(
    "aria-label",
    visible ? `${visible} item${visible === 1 ? "" : "s"} shown` : "No items match."
  );
}

function setupMenu() {
  const btn = $("#menuBtn");
  const menu = $("#mobileMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });

  $$("#mobileMenu a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    })
  );
}

function setupForm() {
  const form = $("#contactForm");
  const note = $("#formNote");
  if (!form || !note) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    note.textContent = "";

    if (!name || !email || !message) {
      note.textContent = "Please fill out name, email, and message.";
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      note.textContent = "Please enter a valid email address.";
      return;
    }

    const subject = encodeURIComponent(`Inquiry for Tessa Rossi — from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`);

    window.location.href = `mailto:hello@tessarossi.com?subject=${subject}&body=${body}`;

    note.textContent = "Opening your email client…";
    form.reset();
  });
}

function setupDownloads() {
  const note = $("#formNote");
  if (!note) return;

  const cv = $("#cvLink");
  const press = $("#pressLink");

  cv?.addEventListener("click", (e) => {
    e.preventDefault();
    note.textContent = "Add a real CV PDF and link this to it (e.g., /assets/Tessa-Rossi-CV.pdf).";
  });

  press?.addEventListener("click", (e) => {
    e.preventDefault();
    note.textContent = "Add a press kit PDF and link this to it.";
  });
}

(function init() {
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  renderWork();
  applyFilters();
  setupMenu();
  setupForm();
  setupDownloads();

  $("#search")?.addEventListener("input", applyFilters);
  $("#filter")?.addEventListener("change", applyFilters);
})();
