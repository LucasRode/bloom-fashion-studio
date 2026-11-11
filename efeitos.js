/* Site Cinematográfico · © 2026 Labrego IA · LBG-SC-2026-v1
   Bloom Fashion Studio: links de WhatsApp, arara de serviços e mergulho no tecido. */
(() => {
  const S = window.SITE || {};
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const limitar = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const suave = (t) => t * t * (3 - 2 * t);

  /* ── Botões com mensagem pronta do WhatsApp ─────────────────────────── */
  const num = String((S.whatsapp && S.whatsapp.numero) || "").replace(/\D/g, "");
  const msgs = (S.whatsapp && S.whatsapp.mensagens) || {};
  document.querySelectorAll("[data-wa]").forEach((a) => {
    const txt = msgs[a.dataset.wa] || (S.whatsapp && S.whatsapp.mensagem) || "";
    a.href = `https://wa.me/${num}?text=${encodeURIComponent(txt)}`;
  });

  if (reduzir) return;

  // progresso de 0 a 1 de uma seção com palco "sticky"
  const progresso = (el) => {
    const r = el.getBoundingClientRect();
    const curso = el.offsetHeight - innerHeight;
    return limitar(-r.top / (curso || 1));
  };

  /* ── Arara: a rolagem vertical passa os cabides para o lado ─────────── */
  const arara = document.querySelector(".arara");
  const trilho = arara && arara.querySelector(".arara-trilho");
  const cabides = trilho ? [...trilho.querySelectorAll(".cabide")] : [];
  let curso = 0;

  const medirArara = () => {
    if (!trilho) return;
    curso = Math.max(0, trilho.scrollWidth - innerWidth);
    arara.style.height = `${Math.round(curso * 1.1 + innerHeight * 1.4)}px`;
  };

  const moverArara = () => {
    const r = arara.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = progresso(arara);
    trilho.style.transform = `translate3d(${(-p * curso).toFixed(1)}px,0,0)`;
    const meio = innerWidth / 2;
    for (const c of cabides) {
      const b = c.getBoundingClientRect();
      const d = limitar(Math.abs(b.left + b.width / 2 - meio) / (innerWidth * 0.55));
      c.style.transform = `scale(${(1 - d * 0.14).toFixed(3)}) rotate(${((b.left + b.width / 2 - meio) / innerWidth * 2.2).toFixed(2)}deg)`;
      c.style.filter = d > 0.04 ? `blur(${(d * 5).toFixed(1)}px)` : "none";
      c.style.opacity = (1 - d * 0.45).toFixed(2);
    }
  };

  /* ── Mergulho: a arara aproxima até a trama do tricô tomar a tela ───── */
  const mergulho = document.querySelector(".mergulho");
  const mArara = mergulho && mergulho.querySelector(".mergulho-arara");
  const mTrama = mergulho && mergulho.querySelector(".mergulho-trama");
  const mTexto = mergulho && mergulho.querySelector(".mergulho-texto");
  const mVeu = mergulho && mergulho.querySelector(".mergulho-veu");

  const moverMergulho = () => {
    const r = mergulho.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = progresso(mergulho);
    const zoom = suave(limitar(p / 0.62));
    mArara.style.transform = `scale(${(1 + zoom * 2.4).toFixed(3)})`;
    mArara.style.filter = `blur(${(limitar((p - 0.3) / 0.3) * 6).toFixed(1)}px)`;
    const t = suave(limitar((p - 0.32) / 0.26));
    mTrama.style.opacity = t.toFixed(3);
    mTrama.style.transform = `scale(${(1.35 - t * 0.3 + limitar((p - 0.6) / 0.4) * 0.08).toFixed(3)})`;
    mTexto.classList.toggle("ativo", p > 0.52 && p < 0.88);
    const veu = Math.max(1 - limitar(p / 0.1), limitar((p - 0.88) / 0.12));
    mVeu.style.opacity = suave(veu).toFixed(3);
  };

  let pedido = false;
  const tique = () => {
    pedido = false;
    if (trilho) moverArara();
    if (mergulho) moverMergulho();
  };
  const agendar = () => { if (!pedido) { pedido = true; requestAnimationFrame(tique); } };

  addEventListener("scroll", agendar, { passive: true });
  addEventListener("resize", () => { medirArara(); agendar(); });
  addEventListener("load", () => { medirArara(); agendar(); });
  medirArara();
  tique();
})();
