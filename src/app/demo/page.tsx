"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";

type POI = {
  id: string;
  title: string;
  seconds: number;
  blurb: string;
  lat: number;
  lng: number;
};

type ChatMsg = { role: "user" | "bot"; text: string };

const pois: POI[] = [
  {
    id: "ratslaukums",
    title: "Rātslaukums",
    seconds: 55,
    blurb: "Vecrīgas sirds — vēsturisks laukums, kur pilsēta vienmēr ir kustībā.",
    lat: 56.9476,
    lng: 24.1066,
  },
  {
    id: "melngalvju-nams",
    title: "Melngalvju nams",
    seconds: 70,
    blurb: "Leģenda un atjaunots simbols — gotiska fasāde un tirgotāju stāsti.",
    lat: 56.9474,
    lng: 24.1074,
  },
  {
    id: "doma-laukums",
    title: "Doma laukums",
    seconds: 75,
    blurb: "Plašums, katedrāle, mūzika — vieta, kur Rīga elpo lēnāk.",
    lat: 56.9491,
    lng: 24.1056,
  },
  {
    id: "trisu-bridzi",
    title: "Trīs brāļi",
    seconds: 60,
    blurb: "Trīs mājas, trīs gadsimti — arhitektūra vienā skatienā.",
    lat: 56.9497,
    lng: 24.1042,
  },
  {
    id: "brivibas-piemineklis",
    title: "Brīvības piemineklis",
    seconds: 80,
    blurb: "Rīgas ikona un Latvijas brīvības stāsts — obligāts pieturas punkts.",
    lat: 56.9519,
    lng: 24.1132,
  },
];

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function mapsLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default function DemoPage() {
  const centerLat = 56.9496;
  const centerLng = 24.1052;

  // Leaflet readiness
  const [leafletReady, setLeafletReady] = useState(false);

  // Map refs
  const mapWrapRef = useRef<HTMLDivElement | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const leafletLineRef = useRef<any>(null);
  const leafletMarkersRef = useRef<any[]>([]);
  const [mapFlash, setMapFlash] = useState(false);

  // UI state
  const [selectedPoi, setSelectedPoi] = useState<POI>(pois[0]);
  const [chatOpen, setChatOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  // Photos: real Riga images (Wikimedia)
 const photos = useMemo(
  () => [
    { src: "/riga/blackheads.jpg", title: "Melngalvju nams", tag: "Vecrīga" },
    { src: "/riga/freedom.jpg", title: "Brīvības piemineklis", tag: "Centrs" },
    { src: "/riga/oldtown.jpg", title: "Vecrīga", tag: "Skats" },
  ],
  []
);


  const [activePhoto, setActivePhoto] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActivePhoto((p) => (p + 1) % photos.length), 4500);
    return () => clearInterval(t);
  }, [photos.length]);

  // Demo AI chat
  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState<ChatMsg[]>([
    {
      role: "bot",
      text: "Sveiks! Es esmu StoryPath AI gids. Pajautā par Vecrīgu, maršrutu vai ko apskatīt tuvumā 👋",
    },
  ]);

  function openMapAndFlash() {
    mapWrapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMapFlash(true);
    window.setTimeout(() => setMapFlash(false), 900);
    // fit bounds if map exists
    const map = leafletMapRef.current;
    const line = leafletLineRef.current;
    if (map && line) {
      try {
        map.fitBounds(line.getBounds().pad(0.2));
      } catch {}
    }
  }

  function focusPoiOnMap(p: POI) {
    setSelectedPoi(p);
    const map = leafletMapRef.current;
    if (!map) return;
    try {
      map.setView([p.lat, p.lng], 16, { animate: true });
      openMapAndFlash();
    } catch {}
  }

  function sendChat() {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput("");
    setChat((prev) => [...prev, { role: "user", text }]);

    const lower = text.toLowerCase();
    let reply =
      "Forši! Demo režīms — drīzumā būs pilns audio + personalizēti ieteikumi.";

    if (lower.includes("kafe") || lower.includes("cafe") || lower.includes("kafija")) {
      reply =
        "Kafijai vari iemēģināt *Rocket Bean Roastery* (cozy vibes). Gribi, lai ielieku to maršrutā kā pieturu?";
    } else if (lower.includes("ēst") || lower.includes("restor") || lower.includes("food")) {
      reply =
        "Ēšanai: *Folkklubs ALA Pagrabs* (latviešu virtuve + atmosfēra). Gribi vairāk budžeta vai “fancy”?";
    } else if (lower.includes("maršrut") || lower.includes("route") || lower.includes("karte")) {
      reply =
        "Šis maršruts ir ~35–55 min pastaiga. Nospied **Route on map**, un redzēsi līniju + pieturas.";
    } else if (lower.includes("veikal") || lower.includes("store") || lower.includes("suven")) {
      reply =
        "Cozy vietas: mazie dizaina veikali / concept stores centrā un Vecrīgā. Gribi “local craft” vai “minimal design”?";
    }

    window.setTimeout(() => {
      setChat((prev) => [...prev, { role: "bot", text: reply }]);
    }, 450);
  }

  // Leaflet map init (route line + numbered points)
  const routeLatLngs = useMemo(() => pois.map((p) => [p.lat, p.lng] as [number, number]), []);

  useEffect(() => {
    if (!leafletReady) return;
    if (!mapDivRef.current) return;
    if (leafletMapRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    const map = L.map(mapDivRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
    });

    leafletMapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    const line = L.polyline(routeLatLngs, { weight: 5, opacity: 0.9 }).addTo(map);
    leafletLineRef.current = line;

    try {
      map.fitBounds(line.getBounds().pad(0.2));
    } catch {
      map.setView([centerLat, centerLng], 14);
    }

    // markers
    leafletMarkersRef.current = [];
    pois.forEach((p, i) => {
      const icon = L.divIcon({
        className: "sp-marker",
        html: `<div style="
          width:28px;height:28px;border-radius:10px;
          background:rgba(255,255,255,0.12);
          border:1px solid rgba(255,255,255,0.20);
          color:#fff;display:grid;place-items:center;
          font-size:12px;font-weight:800;
          backdrop-filter: blur(8px);
        ">${i + 1}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
      m.on("click", () => setSelectedPoi(p));
      leafletMarkersRef.current.push(m);
    });

    // cleanup on unmount
    return () => {
      try {
        map.remove();
      } catch {}
      leafletMapRef.current = null;
      leafletLineRef.current = null;
      leafletMarkersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafletReady]);

  return (
    <main className="min-h-dvh bg-zinc-950 text-zinc-50">
      {/* Leaflet CSS in-page (so you don't need layout.tsx edits) */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      {/* Leaflet JS */}
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        strategy="afterInteractive"
        onLoad={() => setLeafletReady(true)}
      />

      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <button
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  className="flex items-center gap-3 text-left hover:opacity-90"
  title="Atpakaļ uz augšu"
>
  <img
    src="/logo.png"
    alt="StoryPath logo"
    className="h-9 w-9 rounded-full border border-white/10 bg-white/5 object-cover"
  />
  <div className="leading-tight">
    <div className="text-sm font-semibold">StoryPath</div>
    <div className="text-xs text-zinc-300">Vecrīga</div>
  </div>
</button>


          <div className="flex items-center gap-2">
            <button
              className="rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:bg-white/5"
              onClick={() => setQrOpen(true)}
              title="QR kodi"
            >
              <span className="inline-flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3h8v8H3V3Zm2 2v4h4V5H5Zm8-2h8v8h-8V3Zm2 2v4h4V5h-4ZM3 13h8v8H3v-8Zm2 2v4h4v-4H5Zm10 0h2v2h-2v-2Zm-2 2h2v2h-2v-2Zm4 0h2v2h-2v-2Zm-2 2h2v2h-2v-2Zm4 0h2v4h-2v-4Zm-6 2h2v2h-2v-2Z"
                    fill="currentColor"
                  />
                </svg>
                QR kodi
              </span>
            </button>

            <button
              className="rounded-xl bg-emerald-500/15 px-3 py-2 text-xs text-emerald-200 hover:bg-emerald-500/20"
              onClick={() => setChatOpen(true)}
            >
              AI gids ✨
            </button>

            <Link
              href="/"
              className="rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:bg-white/5"
            >
              Atpakaļ
            </Link>
          </div>
        </div>
      </div>

      {/* Hero photos */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-4">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="relative aspect-[16/9] w-full">
            <img
              src={photos[activePhoto].src}
              alt={photos[activePhoto].title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="text-xs text-zinc-300">{photos[activePhoto].tag}</div>
                  <div className="text-lg font-semibold">{photos[activePhoto].title}</div>
                  <div className="mt-1 text-sm text-zinc-200/80">
                    Demo: reāla karte + maršruts + pieturas + AI gids (coming soon: īsts audio)
                  </div>
                </div>
                <button
                  onClick={openMapAndFlash}
                  className="shrink-0 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-200"
                >
                  Route on map
                </button>
              </div>

              <div className="mt-3 flex gap-2">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`h-1.5 w-10 rounded-full ${
                      i === activePhoto ? "bg-white" : "bg-white/25 hover:bg-white/40"
                    }`}
                    aria-label={`Photo ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
        {/* Left */}
        <section className="space-y-4">
          {/* Map */}
          <div
            ref={mapWrapRef}
            className={`overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition ${
              mapFlash ? "ring-2 ring-emerald-400/60" : "ring-0"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm font-semibold">Karte</div>
                <div className="text-xs text-zinc-300">Reāls maršruts (līnija) + pieturas</div>
              </div>
              <a
                href={mapsLink("Vecrīga Rīga")}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/10 px-2 py-1 text-xs text-zinc-300 hover:bg-white/5"
              >
                Atvērt Maps
              </a>
            </div>

            <div className="aspect-[16/11] w-full bg-black">
              <div ref={mapDivRef} className="h-full w-full" />
              {!leafletReady && (
                <div className="grid h-full w-full place-items-center text-sm text-zinc-300">
                  Loading map…
                </div>
              )}
            </div>
          </div>

          {/* Now playing */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-zinc-300">Tagad skan</div>
                <div className="text-lg font-semibold">{selectedPoi.title}</div>
                <div className="mt-1 text-sm text-zinc-300">{selectedPoi.blurb}</div>
                <div className="mt-2 text-xs text-zinc-400">
                  Coming soon: īsts audio + progress bar + offline
                </div>
              </div>
              <div className="grid place-items-center rounded-2xl bg-white/10 px-4 py-3">
                <div className="text-xs text-zinc-300">Ilgums</div>
                <div className="text-base font-semibold">{formatTime(selectedPoi.seconds)}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15"
                onClick={() => alert("Coming soon: audio playback + progress bar")}
              >
                ▶️ Atskaņot
              </button>
              <button
                className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/5"
                onClick={() => setChatOpen(true)}
              >
                💬 Pajautā AI
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={openMapAndFlash}
                className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/5"
              >
                Route on map
              </button>
              <button
                onClick={() => setQrOpen(true)}
                className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/5"
              >
                QR kodi
              </button>
            </div>
          </div>

          {/* Recommendations */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">☕ Cozy café</div>
              <div className="mt-1 text-sm text-zinc-300">Rocket Bean Roastery (demo)</div>
              <div className="mt-3 flex gap-2">
                <a
                  href={mapsLink("Rocket Bean Roastery Riga")}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-200"
                >
                  Open in Maps
                </a>
                <button
                  onClick={() => alert("Coming soon: add to route + ETA + booking links")}
                  className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/5"
                >
                  Add to route
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">🍽️ Restaurant</div>
              <div className="mt-1 text-sm text-zinc-300">Folkklubs ALA Pagrabs (demo)</div>
              <div className="mt-3 flex gap-2">
                <a
                  href={mapsLink("Folkklubs ALA Pagrabs Riga")}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-200"
                >
                  Open in Maps
                </a>
                <button
                  onClick={() => alert("Coming soon: add to route + dietary filters")}
                  className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/5"
                >
                  Add to route
                </button>
              </div>
            </div>
          </div>

          {/* Cozy spots */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">🛍️ Cozy spots (ideas)</div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                { name: "Kalnciema kvartāls (markets)", q: "Kalnciema kvartāls Riga" },
                { name: "Local design / concept stores", q: "concept store Riga center" },
                { name: "Bookstores in Old Town", q: "bookstore Vecriga" },
                { name: "Art galleries nearby", q: "art gallery Riga Old Town" },
              ].map((x) => (
                <a
                  key={x.name}
                  href={mapsLink(x.q)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-zinc-200 hover:bg-white/5"
                >
                  {x.name}
                  <div className="mt-1 text-xs text-zinc-400">Open in Maps</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Right: Route list */}
        <aside className="rounded-2xl border border-white/10 bg-white/5">
          <div className="border-b border-white/10 px-4 py-3">
            <div className="text-sm font-semibold">Maršruts</div>
            <div className="text-xs text-zinc-300">Vecrīga — 5 punkti (demo)</div>
          </div>

          <div className="divide-y divide-white/10">
            {pois.map((p, idx) => (
              <button
                key={p.id}
                className="w-full px-4 py-4 text-left hover:bg-white/5"
                onClick={() => focusPoiOnMap(p)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-white/10 text-xs font-semibold">
                        {idx + 1}
                      </span>
                      <div className="truncate text-sm font-semibold">{p.title}</div>
                    </div>
                    <div className="mt-1 text-sm text-zinc-300">{p.blurb}</div>
                    <div className="mt-2 text-xs text-zinc-400">
                      {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                    </div>
                  </div>
                  <div className="shrink-0 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-zinc-200">
                    {formatTime(p.seconds)}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="px-4 py-4">
            <div className="rounded-2xl bg-emerald-500/10 p-4">
              <div className="text-sm font-semibold text-emerald-100">Coming soon</div>
              <ul className="mt-2 space-y-1 text-sm text-emerald-100/80">
                <li>• Pilni audio ieraksti (LV/EN)</li>
                <li>• Partneru maršruti + QR unlock</li>
                <li>• Offline režīms + lejupielādes</li>
                <li>• AI “Ask about this place” ar kontekstu</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile bottom bar */}
      <div className="sticky bottom-0 z-30 border-t border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="text-xs text-zinc-300">Demo: Riga guide • StoryPath</div>
          <div className="flex gap-2">
            <button
              onClick={openMapAndFlash}
              className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/5"
            >
              Route on map
            </button>
            <button
              onClick={() => setQrOpen(true)}
              className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/5"
            >
              QR
            </button>
            <button
              onClick={() => setChatOpen(true)}
              className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-200"
            >
              AI ✨
            </button>
          </div>
        </div>
      </div>

      {/* AI Chatbot sheet */}
      {chatOpen && (
        <div className="sp-modal">
          <button
            className="sp-overlay bg-black/60"
            onClick={() => setChatOpen(false)}
            aria-label="Close"
          />
          <div className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-5xl">
            <div className="rounded-t-3xl border border-white/10 bg-zinc-950">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold">StoryPath AI gids</div>
                  <div className="text-xs text-zinc-300">Demo chat (coming soon: real AI + context)</div>
                </div>
                <button
                  className="rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:bg-white/5"
                  onClick={() => setChatOpen(false)}
                >
                  Aizvērt
                </button>
              </div>

              <div className="max-h-[55vh] overflow-auto px-4 py-4">
                <div className="space-y-3">
                  {chat.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                          m.role === "user"
                            ? "bg-white text-zinc-950"
                            : "bg-white/10 text-zinc-100"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 px-4 py-3">
                <div className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendChat();
                    }}
                    placeholder='Piem.: "Kur paēst tuvumā?"'
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
                  />
                  <button
                    onClick={sendChat}
                    className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/25"
                  >
                    Sūtīt
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    "Kur ir laba kafija?",
                    "Iesaki restorānu Vecrīgā",
                    "Cik ilgs ir maršruts?",
                    "Ko apskatīt tuvumā?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setChatInput(q)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200 hover:bg-white/10"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR sheet */}
      {qrOpen && (
        <div className="sp-modal">
          <button
            className="sp-overlay bg-black/60"
            onClick={() => setQrOpen(false)}
            aria-label="Close QR"
          />
          <div className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-5xl">
            <div className="rounded-t-3xl border border-white/10 bg-zinc-950">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold">QR kodi</div>
                  <div className="text-xs text-zinc-300">Demo (coming soon: scan + unlock)</div>
                </div>
                <button
                  className="rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:bg-white/5"
                  onClick={() => setQrOpen(false)}
                >
                  Aizvērt
                </button>
              </div>

              <div className="px-4 py-6">
                <div className="mx-auto grid max-w-sm place-items-center rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="text-xs text-zinc-300">Šeit būs īstais QR skeneris</div>
                  <div className="mt-4 grid h-44 w-44 place-items-center rounded-2xl bg-black/30">
                    <div className="text-sm text-zinc-300">QR preview</div>
                  </div>
                  <div className="mt-4 text-sm text-zinc-300 text-center">
                    Coming soon: noskenē QR pie partnera un atbloķē maršrutu.
                  </div>

                  <div className="mt-4 w-full">
                    <button
                      onClick={() => alert("Coming soon: camera permission + scanner")}
                      className="w-full rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
                    >
                      Atvērt kameru (soon)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global small tweaks (Leaflet controls etc.) */}
      <style jsx global>{`
  /* Base Leaflet */
  .leaflet-container {
    background: #000;
    font: inherit;
  }

  .leaflet-control-attribution {
    background: rgba(0, 0, 0, 0.35) !important;
    color: rgba(255, 255, 255, 0.75) !important;
    border-radius: 12px !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    margin: 10px !important;
    padding: 6px 10px !important;
    backdrop-filter: blur(8px) !important;
  }

  /* Leaflet stays UNDER popups */
  .leaflet-container,
  .leaflet-pane,
  .leaflet-map-pane,
  .leaflet-top,
  .leaflet-bottom,
  .leaflet-control,
  .leaflet-control-container {
    z-index: 0 !important;
  }

  /* Popups stay OVER everything */
  .sp-modal {
    position: fixed;
    inset: 0;
    z-index: 9999;
  }

  .sp-overlay {
    position: absolute;
    inset: 0;
  }
`}</style>
    </main>
  );
}
