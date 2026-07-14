import path from 'path';

/** Runtime storage for Editions photographs — outside the repo tree, gitignored. */
export const PHOTO_DIR = path.join(process.cwd(), '.editions-photos');
