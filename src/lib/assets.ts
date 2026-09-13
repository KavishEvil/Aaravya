/** Maps a legacy static-site path (e.g. "/assets/img/team/dr-deep.png") to its
 * copied location under public/legacy-assets/. */
export function legacyAsset(path: string | null | undefined): string | null {
  if (!path) return null;
  return `/legacy-assets/${path.replace(/^\/?assets\//, "")}`;
}
