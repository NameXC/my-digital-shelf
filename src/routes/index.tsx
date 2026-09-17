import { createFileRoute } from "@tanstack/react-router";

import neonDrift from "@/assets/neon-drift.jpg";
import gust from "@/assets/gust.jpg";
import paperOrbit from "@/assets/paper-orbit.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thing Stash — games, apps & links I made" },
      {
        name: "description",
        content:
          "My personal shelf of small games, tiny apps, and links I actually made. Uploaded bit by bit — no sign-up, just look around.",
      },
      { property: "og:title", content: "Thing Stash — games, apps & links I made" },
      {
        property: "og:description",
        content:
          "My personal shelf of small games, tiny apps, and links I actually made. Uploaded bit by bit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type ItemType = "game" | "app" | "link";

interface ShelfItem {
  title: string;
  description: string;
  type: ItemType;
  year: string;
  action: string;
  image: string;
  imageAlt: string;
}

const ITEMS: ShelfItem[] = [
  {
    title: "Neon Drift",
    description: "A one-button arcade racer through a foggy grid city.",
    type: "game",
    year: "2024",
    action: "Play",
    image: neonDrift,
    imageAlt: "Neon-lit isometric arcade racer scene in blue and teal",
  },
  {
    title: "Gust",
    description: "Wind-forecast widget that reads like a weather poem.",
    type: "app",
    year: "2024",
    action: "Open",
    image: gust,
    imageAlt: "Minimal wind forecast app on a dark frosted phone screen",
  },
  {
    title: "Paper Orbit",
    description: "A slow generative sketch I keep returning to.",
    type: "link",
    year: "2023",
    action: "Visit",
    image: paperOrbit,
    imageAlt: "Abstract generative art of blue and cyan gradient rings",
  },
];

const TYPE_STYLES: Record<ItemType, string> = {
  game: "bg-accent/15 text-accent",
  app: "bg-cool/20 text-cool",
  link: "bg-white/10 text-foreground/70",
};

function Index() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background font-sans text-foreground antialiased">
      {/* Diagonal frosted kinetic panels */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-24 -right-16 h-72 w-72 animate-drift rounded-[40%] bg-cool/40 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-64 w-64 animate-drift rounded-[45%] bg-accent/25 blur-3xl [animation-delay:1200ms]" />
        <div className="absolute inset-x-0 top-24 h-56 scale-150 bg-white/[0.04] backdrop-blur-2xl [transform:rotate(-7deg)]" />
        <div className="absolute inset-x-0 bottom-24 h-40 scale-150 bg-white/[0.03] backdrop-blur-xl [transform:rotate(6deg)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[400px] px-5 pb-14">
        {/* Nav */}
        <header className="flex items-center justify-between pt-6 animate-rise">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-md bg-accent font-display text-sm text-background">
              J
            </span>
            <span className="font-display text-lg tracking-wide">thing stash</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            v0.1 · open
          </span>
        </header>

        {/* Hero */}
        <section className="mt-12">
          <p className="animate-rise font-mono text-[10px] uppercase tracking-[0.25em] text-accent [animation-delay:60ms]">
            a personal shelf, not a store
          </p>
          <h1 className="mt-4 animate-rise font-display text-[64px] leading-[0.9] tracking-tight text-balance [animation-delay:120ms]">
            THING
            <br />
            STASH
          </h1>
          <p className="mt-4 max-w-[30ch] animate-rise text-[15px] leading-relaxed text-muted-foreground text-pretty [animation-delay:180ms]">
            Small games, tiny apps, and links I actually made. Uploaded bit by bit — no
            sign-up, just look around.
          </p>
          <div className="mt-6 flex gap-2 animate-rise [animation-delay:240ms]">
            <span className="rounded-full bg-white/5 px-3 py-1 font-mono text-[10px] text-foreground/80 ring-1 ring-white/10">
              1 game
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1 font-mono text-[10px] text-foreground/80 ring-1 ring-white/10">
              1 app
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1 font-mono text-[10px] text-foreground/80 ring-1 ring-white/10">
              1 link
            </span>
          </div>
        </section>

        {/* Section marker */}
        <div className="mt-12 flex items-center gap-3 animate-rise [animation-delay:300ms]">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            (a) the shelf
          </span>
          <span className="h-px flex-1 bg-line" />
          <button className="rounded-md bg-accent px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-wider text-background active:translate-y-px">
            Upload
          </button>
        </div>

        {/* Cards */}
        <div className="mt-4 space-y-4">
          {ITEMS.map((item, i) => (
            <article
              key={item.title}
              className="group relative animate-rise overflow-hidden rounded-2xl bg-panel/70 p-3 ring-1 ring-white/10 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${360 + i * 60}ms` }}
            >
              <div className="sheen" />
              <div className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="size-20 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider ${TYPE_STYLES[item.type]}`}
                    >
                      {item.type}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {item.year}
                    </span>
                  </div>
                  <h3 className="mt-1.5 truncate text-[15px] font-semibold">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              <button className="mt-3 flex w-full items-center justify-center rounded-lg bg-white/5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-foreground/90 ring-1 ring-white/10 active:bg-white/10">
                {item.action}
              </button>
            </article>
          ))}
        </div>

        {/* Coming soon */}
        <div className="relative mt-4 animate-rise overflow-hidden rounded-2xl border border-dashed border-white/15 p-4 text-center [animation-delay:540ms]">
          <p className="font-display text-xl tracking-wide">MORE COMING SOON</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            new uploads drop quietly
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-12 flex items-center justify-between border-t border-line pt-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            © thing stash · made by hand
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">no login</span>
        </footer>
      </div>
    </div>
  );
}
