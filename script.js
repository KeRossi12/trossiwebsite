// ---------- Data (replace these with real publications/links) ----------
const projects = [
  {
    title: "Short Story — “Placeholder Title”",
    type: "fiction",
    date: "2025",
    blurb: "A voice-forward story about memory, miscommunication, and the quiet stuff we carry.",
    links: [{ label: "Read", href: "#" }],
    tags: ["Fiction", "Short story"]
  },
  {
    title: "Personal Essay — “On Keeping Notes”",
    type: "essay",
    date: "2025",
    blurb: "An essay on attention, obsession, and the tiny rituals that become a life.",
    links: [{ label: "Read", href: "#" }],
    tags: ["Essay", "Nonfiction"]
  },
  {
    title: "Book Review — “A Novel Worth Arguing With”",
    type: "review",
    date: "2024",
    blurb: "A review that follows the book’s questions instead of summarizing its plot.",
    links: [{ label: "Read", href: "#" }],
    tags: ["Review", "Criticism"]
  },
  {
    title: "Editing — Manuscript feedback (sample)",
    type: "editing",
    date: "2024",
    blurb: "Developmental notes + line edits focused on voice, structure, and clarity.",
    links: [{ label: "Request rates", href: "#contact" }],
    tags: ["Editing", "Feedback"]
  }
];

// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function showToast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("show"), 2600);
}

function typeLabel(t) {
  return ({
    fiction: "Fiction",
    essay: "Essay",
    review: "Review",
    editing: "Editing"
  })[t] || "Work";
}

function projectCard(p) {
  const links = (p.links || [])
    .map(l => `<a class="link" href="${l.href}">${l.label}</a>`)
    .join("");

  const tags = (p.tags || []).slice(0, 2).join(" • ");

  const searchBlob = (p.title + " " + p.blurb + " " + (p.tags || []).join(" ")).toLowerCase();

  return `
    <article class="work" data-type="${p.type}" data-search="${searchBlob}">
      <div class="top">
        <div>
          <h3>${p.title}</h3>
          <p>${p.blurb}</p>
        </div>
        <span class="tag">${typeLabel(p.type)}</span>
      </div>
      <div class="bottom">
        <div class="links">${links}</div>
        <div class="date">${p.date}${tags ? " • " + tags : ""}</div>
      </div>
    </article>
  `;
}

function renderProjects() {
  const grid = $("#workGrid");
  grid.innerHTML = projects.map(projectCard).join("");
}

function applyFilters() {
  const q = ($("#search").value || "").trim().toLowerCase();
  const type = $("#filter").value;

  const cards = $$("#workGrid .work");
  let visible = 0;

  for (const c of cards) {
    const matchesType = (type === "all") || (c.dataset.type === type);
    const matchesQuery = !q || (c.dataset.search || "").includes(q);
    const show = matchesType && matchesQuery;
    c.style.display = show ? "flex" : "none";
    if (show) visible++;
  }

  const msg = visible ? `${visible} item${visible === 1 ? "" : "s"} shown` : "No items match your filters.";
  $("#workGrid").setAttribute("aria-label", msg);
}

// ---------- Theme toggle ----------
const THEME_KEY = "tessa_theme";

function setTheme(mode) {
  // mode: "dark" | "light"
  if (mode === "light") {
    document.documentElement.style.setProperty("--bg", "#f6f7fb");
    document.documentElement.style.setProperty("--panel", "#ffffff");
    document.documentElement.style.setProperty("--text", "#0b0f14");
    document.documentElement.style.setProperty("--muted", "#526074");
    document.documentElement.style.setProperty("--border", "rgba(11,15,20,.12)");
    document.body.style.background =
      "radial-gradient(1200px 700px at 10% 0%, rgba(125,211,252,.18), transparent 55%)," +
      "radial-gradient(1200px 700px at 90% 10%, rgba(167,139,250,.18), transparent 55%)," +
      "#f6f7fb";
  } else {
    document.documentElement.style.setProperty("--bg", "#0b0f14");
    document.documentElement.style.setProperty("--panel", "#0f1622");
    document.documentElement.style.setProperty("--text", "#e9eef6");
    document.documentElement.style.setProperty("--muted", "#a9b4c2");
    document.documentElement.style.setProperty("--border", "rgba(233,238,246,.12)");
    document.body.style.background =
      "radial-gradient(1200px 700px at 10% 0%, rgba(125,211,252,.16), transparent 55%)," +
      "radial-gradient(1200px 700px at 90% 10%, rgba(167,139,250,.16), transparent 55%)," +
      "#0b0f14";
  }

  localStorage.setItem(THEME_KEY, mode);
  $("#themeBtn").setAttribute("aria-pressed", String(mode === "light"));
  showToast(`Theme: ${mode}`);
}

// ---------- Mobile menu ----------
function setupMenu() {
  const btn = $("#menuBtn");
  const menu = $("#mobileMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });

  $$("#mobileMenu a").forEach(a =>
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    })
  );
}

// ---------- Contact form (mailto demo) ----------
function setupForm() {
  const form = $("#contactForm");
  const note = $("#formNote");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    note.textContent = "";
    if (!name || !email || !message) {
      note.textContent = "Please fill out all fields.";
      showToast("Missing fields");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      note.textContent = "Please enter a valid email address.";
      showToast("Invalid email");
      return;
    }

    const subject = encodeURIComponent(`Inquiry for Tessa Rossi — from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`);

    // Replace with your real email address:
    window.location.href = `mailto:hello@tessarossi.com?subject=${subject}&body=${body}`;
    showToast("Opening email draft…");
    form.reset();
  });
}

// ---------- Demo download links ----------
function setupDemoLinks() {
  $("#downloadBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Demo: link this button to your real CV PDF.");
  });

  $("#pressKit")?.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Demo: link to a press kit PDF.");
  });

  $("#cvPdf")?.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("Demo: link to a CV PDF.");
  });
}

// ---------- Init ----------
(function init() {
  $("#year").textContent = new Date().getFullYear();

  renderProjects();
  applyFilters();
  setupMenu();
  setupForm();
  setupDemoLinks();

  $("#search").addEventListener("input", applyFilters);
  $("#filter").addEventListener("change", applyFilters);

  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light") setTheme("light");

  $("#themeBtn").addEventListener("click", () => {
    const current = localStorage.getItem(THEME_KEY) || "dark";
    setTheme(current === "dark" ? "light" : "dark");
  });
})();
