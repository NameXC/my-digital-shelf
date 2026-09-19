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

type Tab = "apps" | "games" | "links";

const TABS: { id: Tab; label: string }[] = [
  { id: "apps", label: "Apps" },
  { id: "games", label: "Games" },
  { id: "links", label: "Links" },
];

interface Game {
  title: string;
  description: string;
  url: string;
}

const GAMES: Game[] = [
  {
    title: "Slope",
    description: "Roll a ball down a neon slope. Don't fall off.",
    url: "/games/slope/index.html",
  },
];

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
                      className="block rounded-xl bg-panel/70 p-4 ring-1 ring-white/10 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-semibold">{game.title}</h3>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
                          Play →
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        {game.description}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-10 text-center font-mono text-xs text-muted-foreground">
                nothing here yet
              </p>
            ))}

          {tab === "apps" && (
            <p className="py-10 text-center font-mono text-xs text-muted-foreground">
              no apps yet — coming soon
            </p>
          )}

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
