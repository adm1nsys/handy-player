// Loads the tracks, starts the 2023 phone (src/phone.js) and adds rotation controls.
// Every track plays a 30-second Apple Music preview and links back to Apple Music.

// The same songs the 2023 version played, now as official previews (iTunes track IDs)
const TRACK_IDS = [1559739399, 505469711, 1440841512, 1030116018];
const LOOKUP = `https://itunes.apple.com/lookup?id=${TRACK_IDS.join(",")}&entity=song&country=de`;

// phone.js read this global from another file of the 2023 site
var MusicQuality = "Preview";

// The lookup endpoint does not send CORS headers to every origin, but it supports JSONP
function jsonp(url, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const cb = `handyCb${Date.now()}`;
    const s = document.createElement("script");
    const timer = setTimeout(() => { cleanup(); reject(new Error("timeout")); }, timeout);
    function cleanup() { clearTimeout(timer); delete window[cb]; s.remove(); }
    window[cb] = (data) => { cleanup(); resolve(data); };
    s.onerror = () => { cleanup(); reject(new Error("network")); };
    s.src = `${url}&callback=${cb}`;
    document.head.appendChild(s);
  });
}

// phone.js asks for its images by their old file names
const IMAGES = {
  "asl.png": "assets/img/hr-mark.svg",  // logo on the back
  "asl0.png": "assets/img/hr-mark.svg", // logo on the screen
  "Bitmap.png": "assets/img/bg-dark.jpg", // wallpaper
};

function loadImage(name, el) {
  const src = IMAGES[name];
  if (src) el.style.backgroundImage = `url("${src}")`;
}

function tracks0Image() {
  return window.HANDY_TRACKS[0] ? window.HANDY_TRACKS[0].image : "";
}

async function loadTracks() {
  try {
    const { results } = await jsonp(LOOKUP);
    const byId = new Map(results.filter((r) => r.previewUrl).map((r) => [r.trackId, r]));
    return TRACK_IDS.filter((id) => byId.has(id)).map((id) => {
      const r = byId.get(id);
      const art = r.artworkUrl100.replace("100x100bb", "600x600bb");
      return {
        title: r.trackName, artist: r.artistName,
        image: art, image2: art, audio: r.previewUrl, link: r.trackViewUrl,
        duration1: "-0:30", duration2: "30", playing: false,
      };
    });
  } catch (e) {
    return [];
  }
}

function renderTracklist(tracks) {
  const list = document.querySelector("[data-tracklist]");
  if (!tracks.length) {
    list.innerHTML = '<li class="empty" data-en="Apple Music previews could not be loaded right now.">Die Apple-Music-Vorschauen konnten gerade nicht geladen werden.</li>';
    return;
  }
  list.innerHTML = tracks.map((t) => `
    <li><img src="${t.image.replace("600x600bb", "120x120bb")}" alt="" loading="lazy">
      <span><b>${t.title}</b><small>${t.artist}</small></span>
      <a href="${t.link}" target="_blank" rel="noopener" aria-label="${t.title} on Apple Music">Apple Music ↗</a></li>`).join("");
}

function startPhone() {
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "src/phone.js";
    s.onload = resolve;
    document.body.appendChild(s);
  });
}

function mountControls() {
  const stage = document.querySelector("[data-stage]");
  // phone.js places the phone fixed at the bottom of the page; move it onto the stage
  Object.assign(phone.style, { position: "relative", left: "auto", bottom: "auto", zIndex: "1", transition: "transform 0.6s cubic-bezier(.2,.7,.2,1)" });
  stage.appendChild(phone);

  const rx = document.querySelector("[data-rx]");
  const ry = document.querySelector("[data-ry]");
  const out = { x: document.querySelector("[data-rx-out]"), y: document.querySelector("[data-ry-out]") };
  const apply = (animate) => {
    phone.style.transition = animate ? "transform 0.6s cubic-bezier(.2,.7,.2,1)" : "none";
    phone.style.transform = `perspective(1000px) rotateY(${ry.value}deg) rotateX(${rx.value}deg)`;
    out.x.textContent = `${rx.value}°`;
    out.y.textContent = `${ry.value}°`;
  };
  const set = (x, y) => { rx.value = x; ry.value = y; apply(true); };

  rx.addEventListener("input", () => apply(false));
  ry.addEventListener("input", () => apply(false));
  document.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", () => {
    const [x, y] = b.dataset.view.split(",").map(Number);
    set(x, y);
  }));

  // drag the phone itself (mouse or touch); clicks on its buttons still work
  let drag = null;
  stage.addEventListener("pointerdown", (e) => {
    drag = { x: e.clientX, y: e.clientY, rx: +rx.value, ry: +ry.value, moved: false };
  });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;
    drag.moved = true;
    stage.classList.add("is-dragging");
    ry.value = Math.max(-180, Math.min(180, Math.round(drag.ry + dx * 0.5)));
    rx.value = Math.max(-60, Math.min(60, Math.round(drag.rx - dy * 0.3)));
    apply(false);
  });
  window.addEventListener("pointerup", () => { drag = null; stage.classList.remove("is-dragging"); });

  // entrance like on the 2023 site: a full turn, then the screen lights up
  phone.style.transition = "none";
  phone.style.transform = "perspective(1000px) rotateY(-384deg) rotateX(8deg)";
  void phone.offsetWidth;
  rx.value = 8; ry.value = -24;
  phone.style.transition = "transform 1.4s cubic-bezier(.2,.7,.2,1)";
  phone.style.transform = "perspective(1000px) rotateY(-24deg) rotateX(8deg)";
  out.x.textContent = "8°"; out.y.textContent = "-24°";
  setTimeout(() => { frame01.style.opacity = "1"; }, 900);
}

(async () => {
  const tracks = await loadTracks();
  window.HANDY_TRACKS = tracks.length ? tracks : [{
    title: "Handy Player", artist: "Offline", image: "", image2: "", audio: "",
    duration1: "-0:00", duration2: "00", playing: false,
  }];
  renderTracklist(tracks);
  await startPhone();
  mountControls();
  document.documentElement.classList.add("is-ready");
})();
