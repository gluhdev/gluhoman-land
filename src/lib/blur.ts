// Shared low-quality placeholder for next/image `placeholder="blur"`.
//
// Our gallery images are dynamic `src` strings (not static imports), so Next
// can't auto-generate a blurDataURL. Instead of the default white box that
// flashes while a photo streams in on slow mobile connections, we show a soft
// brand-cream fill (#efe7d4). It's a tiny inlined SVG (no extra request), so
// every <Image> gets an instant on-brand placeholder until the real photo
// decodes — no jarring white flash when paging through a gallery.
export const BLUR_CREAM =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScxMCc+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsbD0nI2VmZTdkNCcvPjwvc3ZnPg==";
