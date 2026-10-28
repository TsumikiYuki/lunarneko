/* ==========================================================
   Lunar Neko · scripts
   ========================================================== */

/* ----------------------------------------------------------
   PROJETOS
   Para adicionar um projeto, copie um bloco abaixo e edite.
   tipo:   "jogo" ou "software"
   status: "dev" (em desenvolvimento), "breve" (em breve) ou "lancado"
   imagem: caminho da capa, ex. "assets/projetos/meu-jogo.png"
           (deixe vazio para usar a capa padrão com o logo)
   foco:   parte da imagem que aparece no card, ex. "center 70%" (opcional)
   reserva: imagem usada se a principal não carregar (opcional)
   pagina: página exclusiva do projeto, ex. "projetos/meu-jogo.html"
   ---------------------------------------------------------- */
const GJ = "https://m.gjcdn.net/game-screenshot/";
const PROJETOS = [
  {
    nome: "As coisas que não dizemos",
    tipo: "jogo",
    status: "dev",
    descricao: "Nosso maior projeto: uma visual novel psicológica em Governador Valadares, MG, sobre pessoas, escolhas e as coisas que escondemos.",
    tags: ["Visual Novel", "Drama", "Psicológico"],
    imagem: "assets/projetos/as-coisas-que-nao-dizemos/rio_doce.jpg",
    pagina: "projetos/as-coisas-que-nao-dizemos.html"
  },
  {
    nome: "Quando as cortinas se fecham",
    tipo: "jogo",
    status: "lancado",
    descricao: "Mistério e investigação paranormal: uma atriz é assassinada no meio da peça e cabe a você descobrir quem é o assassino.",
    tags: ["Mistério", "Puzzle", "Aventura"],
    imagem: GJ + "1000/30245063-czazzymb-v4.webp",
    reserva: GJ + "200/30245063-czazzymb-v4.webp",
    pagina: "projetos/quando-as-cortinas-se-fecham.html"
  },
  {
    nome: "A cavaleira da távola redonda",
    tipo: "jogo",
    status: "lancado",
    descricao: "Nosso primeiro jogo! Um RPG medieval em que Saber parte em uma jornada perigosa para provar que é digna do trono.",
    tags: ["RPG", "Ação", "Aventura"],
    imagem: GJ + "1000/5142220-ettbiv2k-v4.webp",
    reserva: GJ + "200/5142220-ettbiv2k-v4.webp",
    pagina: "projetos/a-cavaleira-da-tavola-redonda.html"
  },
  {
    nome: "Tsumiki Bot",
    tipo: "software",
    status: "lancado",
    descricao: "Um bot de Discord diferente de tudo: duelos PvP, minijogos, ship, busca de animes do Mal Traduzido e muito mais para animar o seu servidor.",
    tags: ["Bot de Discord", "Minijogos", "Anime"],
    imagem: "assets/projetos/tsumiki-bot.jpg",
    foco: "center 65%",
    pagina: "projetos/tsumiki-bot.html"
  }
];

const STATUS_LABEL = { dev: "Em desenvolvimento", breve: "Em breve", lancado: "Lançado" };
const TIPO_LABEL = { jogo: "Jogo", software: "Software" };

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;
  const cards = PROJETOS.map(p => {
    const cover = p.imagem
      ? `<img src="${escapeHtml(p.imagem)}" alt="Capa de ${escapeHtml(p.nome)}" loading="lazy"${p.reserva ? ` data-fallback="${escapeHtml(p.reserva)}"` : ""}${p.foco ? ` style="object-position:${escapeHtml(p.foco)}"` : ""}>`
      : `<img class="placeholder" src="assets/logo-simbolo.png" alt="">`;
    const tag = p.pagina ? "a" : "article";
    const href = p.pagina ? ` href="${escapeHtml(p.pagina)}"` : "";
    return `
      <${tag} class="project reveal" data-tipo="${escapeHtml(p.tipo)}"${href}>
        <div class="project-cover">
          ${cover}
          <span class="badge">${TIPO_LABEL[p.tipo] || escapeHtml(p.tipo)}</span>
          <span class="status ${escapeHtml(p.status)}">${STATUS_LABEL[p.status] || ""}</span>
        </div>
        <div class="project-body">
          <h3>${escapeHtml(p.nome)}</h3>
          <p>${escapeHtml(p.descricao)}</p>
          <div class="tags">${(p.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join("")}</div>
          ${p.pagina ? `<span class="project-link">Conhecer o projeto →</span>` : `<span class="project-link" aria-disabled="true">Em breve ✦</span>`}
        </div>
      </${tag}>`;
  });

  // card "em breve" no final da lista
  cards.push(`
      <article class="project project-teaser reveal">
        <div class="project-cover">
          <img class="placeholder" src="assets/logo-simbolo.png" alt="">
        </div>
        <div class="project-body">
          <h3>Próxima estrela</h3>
          <p>Novos jogos e softwares estão a caminho. Fique de olho no nosso Discord!</p>
          <span class="project-link" aria-disabled="true">Em breve ✦</span>
        </div>
      </article>`);
  grid.innerHTML = cards.join("");

  // contadores da seção "Sobre"
  const [lancados, emDev] = document.querySelectorAll(".stats strong[data-count]");
  lancados.dataset.count = PROJETOS.filter(p => p.status === "lancado").length;
  emDev.dataset.count = PROJETOS.filter(p => p.status !== "lancado").length;
}

function setupFilters() {
  const chips = document.querySelectorAll(".chip");
  chips.forEach(chip => chip.addEventListener("click", () => {
    chips.forEach(c => { c.classList.remove("is-active"); c.setAttribute("aria-selected", "false"); });
    chip.classList.add("is-active");
    chip.setAttribute("aria-selected", "true");
    const f = chip.dataset.filter;
    document.querySelectorAll(".project:not(.project-teaser)").forEach(card => {
      card.classList.toggle("is-hidden", f !== "todos" && card.dataset.tipo !== f);
    });
  }));
}

/* ---------- céu estrelado animado ---------- */
function startSky() {
  const canvas = document.getElementById("sky");
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const colors = ["#ffffff", "#ffd6f0", "#ff8fd0", "#d9a0ff", "#b57cff"];
  let stars = [], sparkles = [], shooting = null, w, h, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    const n = Math.round((innerWidth * innerHeight) / 4500);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: (Math.random() * 1.2 + 0.2) * dpr,
      c: colors[Math.random() < 0.6 ? 0 : 1 + Math.floor(Math.random() * 4)],
      t: Math.random() * Math.PI * 2, s: 0.005 + Math.random() * 0.02
    }));
    sparkles = Array.from({ length: Math.round(n / 14) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: (Math.random() * 4 + 3) * dpr,
      c: colors[2 + Math.floor(Math.random() * 3)],
      t: Math.random() * Math.PI * 2, s: 0.01 + Math.random() * 0.02
    }));
  }

  function sparkle(x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.quadraticCurveTo(x, y, x, y + r);
    ctx.quadraticCurveTo(x, y, x - r, y);
    ctx.quadraticCurveTo(x, y, x, y - r);
    ctx.fill();
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.t += s.s;
      ctx.globalAlpha = 0.35 + Math.sin(s.t) * 0.35 + 0.3;
      ctx.fillStyle = s.c;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
    for (const s of sparkles) {
      s.t += s.s;
      ctx.globalAlpha = 0.45 + Math.sin(s.t) * 0.45;
      ctx.fillStyle = s.c;
      ctx.shadowColor = s.c; ctx.shadowBlur = 10 * dpr;
      sparkle(s.x, s.y, s.r * (0.8 + Math.sin(s.t) * 0.2));
      ctx.shadowBlur = 0;
    }
    // estrela cadente ocasional
    if (!shooting && Math.random() < 0.003) {
      shooting = { x: Math.random() * w * 0.7 + w * 0.2, y: Math.random() * h * 0.3, life: 1 };
    }
    if (shooting) {
      const len = 120 * dpr;
      const g = ctx.createLinearGradient(shooting.x, shooting.y, shooting.x + len, shooting.y - len * 0.4);
      g.addColorStop(0, "rgba(255,200,240,0.9)");
      g.addColorStop(1, "rgba(255,200,240,0)");
      ctx.globalAlpha = shooting.life;
      ctx.strokeStyle = g; ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath(); ctx.moveTo(shooting.x, shooting.y); ctx.lineTo(shooting.x + len, shooting.y - len * 0.4); ctx.stroke();
      shooting.x -= 9 * dpr; shooting.y += 3.6 * dpr; shooting.life -= 0.02;
      if (shooting.life <= 0) shooting = null;
    }
    ctx.globalAlpha = 1;
    if (!reduce) requestAnimationFrame(frame);
  }

  resize();
  addEventListener("resize", resize);
  frame();
  if (reduce) addEventListener("resize", frame);
}

/* ---------- navegação ---------- */
function setupNav() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

/* ---------- animação ao rolar + contadores ---------- */
function setupReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      e.target.querySelectorAll("[data-count]").forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}

function countUp(el) {
  const target = +el.dataset.count;
  let n = 0;
  const step = () => { el.textContent = n; if (n++ < target) setTimeout(step, 120); };
  step();
}

/* ---------- galeria com zoom (páginas de projeto) ---------- */
function setupGallery() {
  const links = [...document.querySelectorAll(".gallery a")];
  if (!links.length) return;
  const box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML = `<button class="lb-close" aria-label="Fechar">×</button>
    <button class="lb-prev" aria-label="Anterior">‹</button>
    <img alt="">
    <button class="lb-next" aria-label="Próxima">›</button>`;
  document.body.appendChild(box);
  const img = box.querySelector("img");
  let i = 0;
  const show = n => {
    i = (n + links.length) % links.length;
    const thumb = links[i].querySelector("img");
    img.src = links[i].href;
    img.dataset.fallback = thumb.dataset.fallback || thumb.src;
    img.alt = thumb.alt;
  };
  const close = () => box.classList.remove("open");
  links.forEach((a, n) => a.addEventListener("click", e => { e.preventDefault(); show(n); box.classList.add("open"); }));
  box.querySelector(".lb-close").onclick = close;
  box.querySelector(".lb-prev").onclick = e => { e.stopPropagation(); show(i - 1); };
  box.querySelector(".lb-next").onclick = e => { e.stopPropagation(); show(i + 1); };
  box.addEventListener("click", e => { if (e.target === box) close(); });
  addEventListener("keydown", e => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(i - 1);
    if (e.key === "ArrowRight") show(i + 1);
  });
}

// se uma imagem externa não carregar, usa a versão reserva (data-fallback)
document.addEventListener("error", e => {
  const el = e.target;
  if (el.tagName === "IMG" && el.dataset.fallback && el.src !== el.dataset.fallback) el.src = el.dataset.fallback;
}, true);

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
renderProjects();
setupFilters();
setupNav();
setupReveal();
setupGallery();
startSky();
