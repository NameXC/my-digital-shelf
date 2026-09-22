import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thing Stash — games, apps & links" },
      {
        name: "description",
        content: "My personal stash of games, apps, and links I made.",
      },
      { property: "og:title", content: "Thing Stash — games, apps & links" },
      {
        property: "og:description",
        content: "My personal stash of games, apps, and links I made.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Tab = "apps" | "games" | "pages" | "links";

const TABS: { id: Tab; label: string }[] = [
  { id: "apps", label: "Apps" },
  { id: "games", label: "Games" },
  { id: "pages", label: "Pages" },
  { id: "links", label: "Links" },
];

interface Game {
  title: string;
  description: string;
  url: string;
  /** When set, the card is shown as broken: no hover lift, no prefetch, reason shown. */
  broken?: string;
  /** Heavy assets to warm as soon as the visitor shows intent (hover/keyboard focus). */
  prefetch?: readonly string[];
}

const GAMES: Game[] = [
  {
    title: "Slope",
    description: "Roll a ball down an endless neon slope. Don't fall off.",
    url: "/games/slope/index.html",
    // Classic Unity WebGL build (~14.5 MB). Prefetch the big files on hover so the
    // download overlaps with the click, the same way the Speed Slope card worked.
    prefetch: [
      "/games/slope/data/slope_data.unityweb",
      "/games/slope/data/slope_wasmcode.unityweb",
      "/games/slope/data/slope_wasmframework.unityweb",
      "/games/slope/data/slope_framework.unityweb",
      "/games/slope/data/slope_memory.unityweb",
    ],
  },
  {
    title: "Speed Slope",
    description: "Roll a ball down a neon slope at full speed. Don't fall off.",
    url: "/games/speed-slope/index.html",
    broken:
      "The publisher's licence check (gmsoft/IDnet) only allows play on the original site, so START stays locked on self-hosted copies. The menu and leaderboard still load. Kept for reference — see README.",
  },
];

interface App {
  title: string;
  description: string;
  url: string;
  badge?: string;
}

const APPS: App[] = [
  {
    title: "Talkcrate",
    badge: "beta",
    description:
      "Chat rooms with your friends (formerly Ember). Runs in standalone mode: everything saves in your browser, no account needed.",
    url: "/apps/talkcrate/index.html",
  },
  {
    title: "Blank Page",
    description:
      "A distraction-free notepad. Saves to your browser as you type, Ctrl+K switches notes. Works fully offline.",
    url: "/apps/blank-page/index.html",
  },
];

const PAGES: App[] = [
  {
    title: "My first HTML",
    description:
      "The first web page I ever wrote, kept exactly as it was. Complete with the dev diary I typed into it.",
    url: "/pages/my-first-html/index.html",
  },
  {
    title: "EssentialsPlus",
    description:
      "Homepage I made for my Minecraft plugin — features, commands and download links.",
    url: "/pages/essentials-plus/index.html",
  },
];

const prefetchedAssets = new Set<string>();

function prefetchGameAssets(urls: readonly string[] | undefined) {
  if (!urls || typeof document === "undefined") return;
  // Touch devices fire pointerenter on the tap that navigates anyway, and pulling
  // many MB over a phone connection for a game that may never be opened is a waste.
  if (!window.matchMedia("(hover: hover)").matches) return;

  for (const href of urls) {
    if (prefetchedAssets.has(href)) continue;
    prefetchedAssets.add(href);

    const link = document.createElement("link");
    link.rel = "prefetch";
    // Match how the Unity loader fetches these files (same-origin CORS request
    // with credentials) so the browser is willing to reuse the prefetched body.
    link.as = "fetch";
    link.crossOrigin = "anonymous";
    link.href = href;
    document.head.append(link);
  }
}

function Index() {
  const [tab, setTab] = useState<Tab>("games");

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <div className="mx-auto max-w-[420px] px-5 py-10">
        <h1 className="font-display text-4xl tracking-tight">THING STASH</h1>

        {/* Tab buttons */}
        <div className="mt-8 flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-lg py-2.5 font-mono text-xs uppercase tracking-wider ring-1 transition-colors ${
                tab === t.id
                  ? "bg-accent text-background ring-accent"
                  : "bg-white/5 text-foreground/80 ring-white/10 hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {tab === "games" &&
            (GAMES.length > 0 ? (
              <ul className="space-y-3">
                {GAMES.map((game) => (
                  <li key={game.title}>
                    <a
                      href={game.url}
                      onPointerEnter={() => prefetchGameAssets(game.prefetch)}
                      onFocus={() => prefetchGameAssets(game.prefetch)}
                      title={game.broken}
                      className={`block rounded-xl bg-panel/70 p-4 ring-1 ring-white/10 transition-transform duration-200 ${
                        game.broken ? "" : "hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3
                          className={`text-[15px] font-semibold ${
                            game.broken ? "text-muted-foreground" : ""
                          }`}
                        >
                          {game.title}
                        </h3>
                        {game.broken ? (
                          <span className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-red-400 ring-1 ring-red-400/30">
                            Broken
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
                            Play →
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        {game.description}
                      </p>
                      {game.broken && (
                        <p className="mt-2 text-[12px] leading-snug text-muted-foreground/80">
                          {game.broken}
                        </p>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-10 text-center font-mono text-xs text-muted-foreground">
                nothing here yet
              </p>
            ))}

          {tab === "apps" &&
            (APPS.length > 0 ? (
              <ul className="space-y-3">
                {APPS.map((app) => (
                  <li key={app.title}>
                    <a
                      href={app.url}
                      className="block rounded-xl bg-panel/70 p-4 ring-1 ring-white/10 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-semibold">{app.title}</h3>
                        {app.badge ? (
                          <span className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent ring-1 ring-accent/40">
                            {app.badge}
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
                            Open →
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        {app.description}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-10 text-center font-mono text-xs text-muted-foreground">
                no apps yet — coming soon
              </p>
            ))}

          {tab === "pages" &&
            (PAGES.length > 0 ? (
              <ul className="space-y-3">
                {PAGES.map((page) => (
                  <li key={page.title}>
                    <a
                      href={page.url}
                      className="block rounded-xl bg-panel/70 p-4 ring-1 ring-white/10 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-semibold">{page.title}</h3>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
                          View →
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] text-muted-foreground">{page.description}</p>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-10 text-center font-mono text-xs text-muted-foreground">
                no pages yet
              </p>
            ))}

          {tab === "links" && (
            <p className="py-10 text-center font-mono text-xs text-muted-foreground">
              no links yet — coming soon
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
