// gta6-meme-x-01 entry v4 (Node 22, standard library only).
//
// The entry is the X post itself: a phone lock screen showing eleven
// years of Rockstar delay notifications, then the one that ends the wait:
//
//   09:41 — Monday, 23 November 2026 (Vice City sunset wallpaper)
//   ROCKSTAR GAMES · 2015 — GTA VI delayed again.
//   ROCKSTAR GAMES · 2018 — GTA VI delayed again.
//   ROCKSTAR GAMES · 2022 — GTA VI delayed again.
//   ROCKSTAR GAMES · 2026 — GTA VI IS OUT NOW. Welcome to Vice City.
//   make.fun · now — Your AI agent just won real money in a GTA 6 bounty.
//   4,811 DAYS. FINALLY.
//
// Why a lock screen: the leaderboard's winners are all "official
// document" memes (Steam receipt, library overdue notice, hurricane
// warning, parking citation, boarding pass, bank statement, store
// receipt, certificate, DMV vision test) — and lock screens already won
// twice (#5 and #9 in the 20 Nov screening), so the format is proven.
// But this one is a different lock screen: not a single notification,
// a whole history of them. The joke is the stack itself — the same
// "delayed again" line three times across eleven years, then the green
// card that breaks the pattern — and the make.fun notification is the
// punchline underneath it: while everyone waited, an AI agent was
// already getting paid on make.fun. make.fun's name is in the picture
// (the notification card), so criterion 1 is met in the image itself.
//
// v2 (Rx prescription, Leonida Clinic) is live at rank 500, judge
// 831,281 — outside the top 50 (cutoff ~891,163), so v4 is a fresh
// format with fresh gags, not a tweak. v3 (Rockstar support ticket
// #4811) was drafted and shelved by the user; v4 replaces that plan.
//
// This program is all the grader needs from the repository: it reads
// POST.json (the post's address on X, filled in after the post goes out),
// checks it really names one X post, copies it to /output/POST.json where
// the gate reads it, and writes a deterministic manifest of the meme
// (meme.json) beside it. No network, no wall clock, no files outside the
// repository; two runs write the same bytes.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// One X post address, exactly as X shows it: https://x.com/<handle>/status/<id>
const POST_URL = /^https:\/\/(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/[0-9]+$/;

// The meme this entry hands in, as data: the lock screen in meme.png.
const MEME = {
  format: 'phone lock screen, notification stack, Vice City sunset',
  image: 'meme.png',
  size: [1008, 2128],
  headline: '4,811 DAYS. FINALLY.',
  notifications: [
    'ROCKSTAR GAMES · 2015 — GTA VI delayed again.',
    'ROCKSTAR GAMES · 2018 — GTA VI delayed again.',
    'ROCKSTAR GAMES · 2022 — GTA VI delayed again.',
    'ROCKSTAR GAMES · 2026 — GTA VI IS OUT NOW. Welcome to Vice City.',
    'make.fun · now — Your AI agent just won real money in a GTA 6 bounty.',
  ],
  makefun_in_picture: 'make.fun notification card (name + ghost), below the release card',
  joke: 'Eleven years of the same "delayed again" notification, three times over, then the green card that breaks the pattern — and while everyone waited, an AI agent was already getting paid on make.fun.',
};

function main(): void {
  const raw = readFileSync(join(BOT_DIR, 'POST.json'), 'utf8');
  const post: unknown = JSON.parse(raw);
  if (
    typeof post !== 'object' ||
    post === null ||
    typeof (post as { url?: unknown }).url !== 'string' ||
    !POST_URL.test((post as { url: string }).url)
  ) {
    console.error(
      'POST.json must name one X post: {"url": "https://x.com/<handle>/status/<id>"}',
    );
    process.exit(1);
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
  const manifest = { post, meme: MEME };
  writeFileSync(
    join(OUTPUT_DIR, 'meme.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf8',
  );
}

main();
