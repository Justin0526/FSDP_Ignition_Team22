export function getYoutubeId(url) {
    try {
        const u = new URL(url);

        // https://www.youtube.com/watch?v=VIDEOID
        if (u.hostname.includes("youtube.com")) {
        return u.searchParams.get("v");
        }

        // https://youtu.be/VIDEOID
        if (u.hostname.includes("youtu.be")) {
        return u.pathname.slice(1);
        }

        return null;
    } catch {
        return null;
    }
}

export function getYoutubeThumbnail(url) {
    const id = getYoutubeId(url);
    if (!id) return null;

    // High quality thumbnail
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
