// PROPOSED PREVIEW, injected into the live page by agent-browser; not wired into the site.
// Replaces "Investor Centre | Client Login" in the bar with one Login dropdown.
(() => {
  if (document.querySelector(".om-login-menu")) return "already";
  const bar = document.querySelector(".om-visible-links");
  [...bar.querySelectorAll("a")].find((a) => a.textContent === "Investor Centre")?.remove();
  const old = [...bar.querySelectorAll("a")].find((a) => a.textContent === "Client Login");

  const style = document.createElement("style");
  style.textContent = `
    .om-root .om-login-menu { position: relative; padding-left: 28px; border-left: 1px solid rgba(0,0,0,.2); line-height: 1.6; }
    .om-root .om-login-trigger { display: inline-flex; align-items: center; gap: 6px; padding: 0; border: 0; background: none; font: inherit; font-size: 13px; color: #000; cursor: pointer; }
    .om-root .om-login-trigger svg { transition: transform 160ms cubic-bezier(.23,1,.32,1); }
    .om-root .om-login-menu[data-open] .om-login-trigger svg { transform: rotate(180deg); }
    .om-root .om-login-panel { position: absolute; top: calc(100% + 14px); left: 12px; min-width: 210px; padding: 6px; background: #fff; border: 1px solid rgba(0,0,0,.08); border-radius: 14px; box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 16px 40px -16px rgba(0,0,0,.18); opacity: 0; transform: translateY(-4px) scale(.98); transform-origin: top left; pointer-events: none; transition: opacity 160ms cubic-bezier(.23,1,.32,1), transform 160ms cubic-bezier(.23,1,.32,1); }
    .om-root .om-login-menu[data-open] .om-login-panel { opacity: 1; transform: none; pointer-events: auto; }
    .om-root .om-visible-links .om-login-panel a { display: block; padding: 9px 12px; border-radius: 9px; font-size: 14px; color: #000; text-decoration: none; }
    .om-root .om-visible-links .om-login-panel a:hover, .om-root .om-visible-links .om-login-panel a.is-hover { background: #F6F6F6; text-decoration: none; }
  `;
  document.head.appendChild(style);

  const menu = document.createElement("div");
  menu.className = "om-login-menu om-hide-480";
  menu.innerHTML = `
    <button type="button" class="om-login-trigger" aria-expanded="false" aria-haspopup="true">Login
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5"/></svg>
    </button>
    <div class="om-login-panel" role="menu">
      <a role="menuitem" href="/portal/login">Client Login</a>
      <a role="menuitem" href="/investor-centre#logins">Distributor Login</a>
    </div>`;
  old.replaceWith(menu);
  const trigger = menu.querySelector("button");
  const set = (open) => (open ? menu.setAttribute("data-open", "") : menu.removeAttribute("data-open"), trigger.setAttribute("aria-expanded", String(open)));
  trigger.addEventListener("click", () => set(!menu.hasAttribute("data-open")));
  window.__loginMenu = { set, menu };
  return "ok";
})();
