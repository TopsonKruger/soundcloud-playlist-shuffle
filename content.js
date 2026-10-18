(() => {
  const API = "https://api-v2.soundcloud.com";
  let clientId = null;
  let auth = null;

  const origFetch = window.fetch.bind(window);

  function readHeader(headers, name) {
    if (!headers) return null;
    name = name.toLowerCase();
    if (headers instanceof Headers) return headers.get(name);
    if (Array.isArray(headers)) {
      const h = headers.find((x) => String(x[0]).toLowerCase() === name);
      return h ? h[1] : null;
    }
    for (const k in headers) if (k.toLowerCase() === name) return headers[k];
    return null;
  }

  function capture(url, headers) {
    if (!url || !String(url).includes("api-v2.soundcloud.com")) return;
    const m = String(url).match(/[?&]client_id=([^&]+)/);
    if (m) clientId = m[1];
    const a = readHeader(headers, "authorization");
    if (a) auth = a;
  }

  // Перехват fetch, чтобы подсмотреть client_id и токен, которые использует сама страница
  window.fetch = function (input, init) {
    try {
      const url = typeof input === "string" ? input : input.url;
      capture(url, (init && init.headers) || (input && input.headers));
      if (init && init.method === "PUT" && /\/playlists\//.test(url)) {
        const hs = {};
        const h = init.headers;
        if (h instanceof Headers) h.forEach((v, k) => (hs[k] = v));
        else Object.assign(hs, h || {});
        console.log("[SC shuffle] site PUT:", url, hs, String(init.body).slice(0, 500));
      }
    } catch (e) {}
    return origFetch(input, init);
  };

  // То же для XMLHttpRequest
  const origOpen = XMLHttpRequest.prototype.open;
  const origSetHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__scUrl = url;
    return origOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.setRequestHeader = function (k, v) {
    try {
      capture(this.__scUrl, { [k]: v });
    } catch (e) {}
    return origSetHeader.apply(this, arguments);
  };

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function cookieToken() {
    const m = document.cookie.match(/(?:^|;\s*)oauth_token=([^;]+)/);
    return m ? "OAuth " + decodeURIComponent(m[1]) : null;
  }

  async function shufflePlaylist(btn) {
    if (!/^\/[^/]+\/sets\/[^/]+/.test(location.pathname)) {
      alert("Открой страницу своего плейлиста (…/sets/…).");
      return;
    }
    const token = auth || cookieToken();
    if (!clientId || !token) {
      alert("Не поймал ключи. Обнови страницу, покликай по сайту секунду и попробуй снова.");
      return;
    }
    const headers = { Authorization: token };
    const old = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Мешаю…";
    try {
      const url = location.origin + location.pathname;
      const r = await origFetch(
        `${API}/resolve?url=${encodeURIComponent(url)}&client_id=${clientId}`,
        { headers }
      );
      if (!r.ok) throw new Error("resolve: " + r.status);
      const pl = await r.json();
      if (pl.kind !== "playlist" || !pl.tracks || !pl.tracks.length) {
        throw new Error("Это не плейлист или он пустой");
      }

      const ids = shuffle(pl.tracks.map((t) => t.id));

      const put = await origFetch(`${API}/playlists/${pl.id}?client_id=${clientId}`, {
        method: "PUT",
        credentials: "include",
        headers: { ...headers, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ playlist: { tracks: ids } }),
      });
      if (!put.ok) {
        const txt = await put.text();
        console.error("[SC shuffle] PUT failed", put.status, txt, "playlist user:", pl.user_id, "auth:", token.slice(0, 12) + "…");
        throw new Error("PUT: " + put.status + " " + txt.slice(0, 200));
      }

      btn.textContent = "Готово!";
      setTimeout(() => location.reload(), 600);
    } catch (e) {
      console.error("[SC shuffle]", e);
      alert("Не получилось: " + e.message + "\n(это может быть чужой плейлист или SoundCloud поменял API)");
      btn.textContent = old;
      btn.disabled = false;
    }
  }

  function addButton() {
    if (document.getElementById("sc-shuffle-btn")) return;
    const btn = document.createElement("button");
    btn.id = "sc-shuffle-btn";
    btn.textContent = "🔀 Перемешать плейлист";
    Object.assign(btn.style, {
      position: "fixed",
      right: "16px",
      bottom: "70px",
      zIndex: 99999,
      padding: "10px 14px",
      background: "#f50",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      font: "600 13px sans-serif",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,.3)",
    });
    btn.onclick = () => shufflePlaylist(btn);
    document.body.appendChild(btn);
  }

  if (document.body) addButton();
  else document.addEventListener("DOMContentLoaded", addButton);
})();
