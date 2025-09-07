export function getYouTubeId(input?: string | null): string | null {
  if (!input) return null;
  try {
    const u = new URL(input);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    return null;
  } catch {
    return null;
  }
}

export function buildYouTubeEmbedSrc(id: string, muted = true, start = 0) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: muted ? "1" : "0",
    controls: "0",
    loop: "1",
    playlist: id,
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
    start: String(start),
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}
