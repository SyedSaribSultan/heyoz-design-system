// Section ids: "Build it in Figma" → "build-it-in-figma". Shared by server and client code.
export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
