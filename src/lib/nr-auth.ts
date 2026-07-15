/* ─────────────────────────────────────────────────────────────
   Neil & Riley — roles and signatures. Server-only.

   Three roles, three doors:
   - guest  → their unique access code (cookie set on entry)
   - couple → dashboard password           (env NR_ADMIN_PASSWORD)
   - staff  → entrance code for check-in   (env NR_STAFF_CODE)

   QR passes carry `NRPASS:guestId:v<version>:<hmac>` so a scan can
   be verified against the exact guest + pass version; bumping the
   version on a guest silently voids every previously issued code.
   ───────────────────────────────────────────────────────────── */

import { createHmac, timingSafeEqual } from 'crypto';

const SECRET =
  process.env.NR_SECRET ||
  process.env.EDITIONS_SECRET ||
  process.env.MAISON_EMAIL_KEY ||
  'nr-demo-secret';

/* Demo credentials — this is a demonstration wedding; a real
   commission sets these in the environment. */
export const NR_ADMIN_PASSWORD = process.env.NR_ADMIN_PASSWORD || 'rosewood2026';
export const NR_STAFF_CODE = process.env.NR_STAFF_CODE || 'ENTRANCE26';

export type NrRole = 'couple' | 'staff';

function hmac(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('base64url');
}

function safeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a), bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/* ── Role session tokens (stored in HttpOnly cookies) ── */

export function signSession(role: NrRole, days = 30): string {
  const exp = Date.now() + days * 24 * 60 * 60 * 1000;
  const body = `${role}.${exp}`;
  return `${body}.${hmac(`session:${body}`)}`;
}

export function verifySession(token: string | undefined, role: NrRole): boolean {
  if (!token) return false;
  const [r, expStr, sig] = token.split('.');
  if (r !== role || !expStr || !sig) return false;
  if (Number(expStr) < Date.now()) return false;
  return safeEq(sig, hmac(`session:${r}.${expStr}`));
}

export const NR_COOKIE: Record<NrRole, string> = {
  couple: 'nr_couple',
  staff: 'nr_staff',
};

/* ── QR entrance passes ── */

export function passToken(guestId: string, passVersion: number): string {
  return `NRPASS:${guestId}:v${passVersion}:${hmac(`pass:${guestId}:${passVersion}`)}`;
}

export function parsePass(raw: string): { guestId: string; passVersion: number } | null {
  const m = /^NRPASS:([A-Za-z0-9_-]+):v(\d+):([A-Za-z0-9_-]+)$/.exec(raw.trim());
  if (!m) return null;
  const [, guestId, v, sig] = m;
  if (!safeEq(sig, hmac(`pass:${guestId}:${v}`))) return null;
  return { guestId, passVersion: Number(v) };
}
