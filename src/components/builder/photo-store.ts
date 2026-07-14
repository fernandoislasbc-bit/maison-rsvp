/* Client-side photo handling for the design studio.
   Photographs are compressed in the browser before anything leaves
   the device; blobs are kept here keyed by their object URL so the
   builder can upload the exact image being previewed. */

const blobs = new Map<string, Blob>();

export function rememberPhoto(url: string, blob: Blob) {
  blobs.set(url, blob);
}

export function getPhoto(url: string): Blob | undefined {
  return blobs.get(url);
}

export function forgetPhoto(url: string) {
  blobs.delete(url);
  URL.revokeObjectURL(url);
}

/** Resize + re-encode to JPEG, aiming under ~900 KB. */
export async function compressPhoto(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const MAX = 1400;
  const ratio = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
  canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let out: Blob = file;
  for (const q of [0.82, 0.7, 0.58, 0.45]) {
    const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', q));
    if (!blob) break;
    out = blob;
    if (blob.size <= 900 * 1024) break;
  }
  return out;
}
