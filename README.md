# My Digital Shelf

Build a landing page for my personal project. It is a website where I can upload stuff, like games or apps. I’ll add apps, links and more later.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6da5b161-57b9-4fca-952b-f8534fa7d0ae).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Games

Playable games live in `public/games/<game>/` as self-contained player builds, so they are
served as static files and work on any host (no external asset store required).

### Speed Slope (Unity WebGL)

`public/games/speed-slope/index.html` loads three pre-compressed Unity files:

| File | On disk | Serves as |
| --- | --- | --- |
| `speed-slope-v26060301.wasm.unityweb` | 8.9 MB gzip | `Content-Encoding: gzip`, `Content-Type: application/wasm` |
| `speed-slope-v26060301.data.unityweb` | 15.2 MB gzip | `Content-Encoding: gzip`, `Content-Type: application/octet-stream` |
| `speed-slope-v26060301.framework.js.unityweb` | 147 KB gzip | `Content-Encoding: gzip`, `Content-Type: application/javascript` |

Those headers are **required**, not cosmetic. If a host serves the raw bytes without
`Content-Encoding: gzip`, Unity inflates ~24 MB in JavaScript on the main thread before the
game can start and logs `You can reduce startup time if you configure your web server to add
"Content-Encoding: gzip"` in the browser console. The `Cache-Control` values matter too:
without them the ~9 MB WebAssembly module is re-downloaded on every visit.

They are declared in two places:

- `public/_headers` — used by hosts that support the `_headers` convention (Cloudflare, Netlify).
- the `unityWebglHeaders` plugin in `vite.config.ts` — used by `npm run dev` and `vite preview`
  so local runs match production.

If you move the build, keep the URL of `dataUrl` in `public/games/speed-slope/index.html` in
step with the filename. The raw (uncompressed) data used to produce
`speed-slope-v26060301.data.unityweb` is kept locally in `New folder/` and is not needed at
runtime — it is only useful for regenerating the compressed file:
`node -e "require('zlib').gzipSync(...)"` or `gzip -9 -n -k -f speed-slope-v26060301.data/webgl.data`.

### Speed Slope licence (why START shows "Game is locked")

Speed Slope is wrapped in the gmsoft/Yoplay distribution SDK. A script that SDK loads from
its own servers performs the licence check: it asks `api.cdnwave.com` to mint a fresh,
time-limited signature for the host the game is running on and refuses to start otherwise
(`check sign: False` → `Game is locked: Domain signature not veryfied`). On the original
host (`games.ofree.io/speed-slope/play.html`) that passes; on any other domain — including
this one — it fails **by design**. That logic is not in the local build files, so it cannot
be fixed client-side, and defeating a remote licence check is out of scope for this repo.

Two earlier workarounds were removed from `public/games/speed-slope/index.html` on purpose:

- a replayed `keysigned` signature plus a spoofed `window.location` (a replay can never
  pass — signatures are server-minted, host-bound and short-lived, which is why runs kept
  ending in `check sign: False` and `time span response diff`), and
- local stand-in SDK responses (`gmsdk-config.json`, `gmsdk-signed.txt`, `*.b64.txt`),
  whose wrong format (raw JSON instead of base64) was the **original cause of the
  START-button freeze**: the SDK threw while processing them, never finished booting, and
  the game's `start-game` call came back across the WebAssembly boundary as a
  `ReferenceError` that wedged the main thread.

What remains is only the freeze fix: the page supplies the globals the wrapper expects
(`config` with an empty `eventAPI`, plus no-op analytics/event/start functions), so a
missing or absent SDK can never wedge the game again. Online, the SDK still loads and its
verdict governs — expect the proper "Game is locked" screen when self-hosted. If the SDK
cannot load at all (e.g. offline), the no-op stubs keep the game responsive instead of
freezing.

If you want a playable Speed Slope on the shelf, the clean options are:

1. **Embed the official page in an iframe** (`https://games.ofree.io/speed-slope/play.html`)
   so the licence check runs on its licensed host. This needs no Unity assets in this repo
   at all and is the least-effort path to a working game card.
2. **License the domain**: ask the operator (gmsoft/Yoplay / IDnet) to whitelist this host;
   the self-hosted build then works as-is with all the performance fixes above.
3. **Swap in a game whose licence permits self-hosting** (e.g. an open-source slope clone)
   and keep the self-hosted pipeline for it.

### Slope (Unity WebGL, works)

`public/games/slope/` — the classic slope build (14.5 MB, `data/slope_data.unityweb` is stored
**uncompressed**, the other four `.unityweb` files are gzip). Its `index.html` and `css/style.css`
were patched to use relative paths so it works under `/games/slope/`. Verified working
self-hosted: menu, **Play → gameplay**, credits and leaderboard screens all render. The old
Unity loader logs one harmless `ReferenceError: e is not defined` on some loads — the game is
unaffected.

## Apps

Vendored web apps live in `public/apps/<app>/` as plain static files — they are served from
this site itself, so they keep working even when the network blocks everything else.

### Talkcrate (formerly Ember)

`public/apps/talkcrate/` — the built React app from
`Documents/Website/EmberTalkcrateArchive/Talkcrate (beta)/blank-slate-main` (`Ember (Old)` is
the previous version of the same project). Built with `vite build --base=/apps/talkcrate/`.
It runs in **standalone mode**: data saves in the browser, no Supabase account needed.
On first load it may show a "right site?" notice pointing at `ember-cr.github.io` (the
published copy) — dismiss with "Got it"; the local copy is the same app.

### Blank Page

`public/apps/blank-page/` — a 3-file, zero-dependency notepad (`index.html`, `app.js`,
`styles.css`) from `Documents/Website/Blank Page`. Saves to `localStorage` as you type,
`Ctrl+K` switches notes, `Ctrl+S` downloads as .txt. Works fully offline.

## Pages

Standalone `.html` pages I wrote live in `public/pages/<page>/` and get their own tab,
because they are documents to look at rather than apps to use. Both are self-contained
(no build step, no external files).

- `public/pages/my-first-html/` — the first web page I ever wrote, plus the dev diary
  typed into it, from `Documents/Coding/HTML/My first HTML.html`. Its `test.gif`
  background image is vendored next to it.
- `public/pages/essentials-plus/` — the homepage for my Minecraft plugin, from
  `Documents/Coding/Mod&Plugin/EssentialsPlus/Homepage.html`. Only external reference is
  an optional Font Awesome stylesheet from a CDN, so it degrades gracefully offline.

Not vendored: `Documents/Coding/HTML/Blank PAge.html` is a saved snapshot of the
third-party blank.page site, but it is an incomplete Next.js capture — it references ~37
root-absolute files (`/assets/*.js`, `/fonts/GT-America-*.woff2`) that were never saved,
so it would render unstyled. The real notepad lives in `public/apps/blank-page/` instead.
The `Coding` folder's other `*.html` files are Gradle `problems-report.html` build output,
not pages.

### Card links must point at `index.html` explicitly

Every card URL in `src/routes/index.tsx` ends in `/index.html` (e.g.
`/pages/my-first-html/index.html`, not `/pages/my-first-html/`). TanStack Router
normalises in-app links and strips the trailing slash, so a directory URL like
`/apps/talkcrate/` becomes `/apps/talkcrate`, which no longer matches a file on disk and
renders the 404 page. Keeping the explicit `index.html` form avoids that entirely.

## Broken entries

The shelf can show an item that does not work yet: add a `broken` string to the entry in
`src/routes/index.tsx` and the card is rendered without the hover lift and with the reason
shown, instead of pretending it works. `Speed Slope` is currently the only broken card —
see the licence explanation above.

