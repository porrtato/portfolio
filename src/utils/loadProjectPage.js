export async function loadProjectPage(id) {
  // Fetch and parse info.txt
  const infoResponse = await fetch(`/projects/Project${id}/info.txt`);
  let info = {};
  if (infoResponse.ok) {
    const infoContent = await infoResponse.text();
    infoContent.split("\n").forEach((line) => {
      const [key, value] = line.split(":");
      if (key && value) info[key.trim()] = value.trim();
    });
  }

  // Fetch content.txt
  const contentResponse = await fetch(`/projects/Project${id}/projectpage/content.txt`);
  const contentText = contentResponse.ok ? await contentResponse.text() : "";

  // Normalize basic fields
  const title = info.title || `Project ${id}`;
  const date = info.date || "";
  // Prefer the image inside projectpage/images so authors can place images there
  const image = `/projects/Project${id}/projectpage/images/image1.webp`;
  const tags = info.tags ? info.tags.split(",").map(t => t.trim()) : [];

  // Parse tagLinks if present
  const tagLinks = {};
  if (info.tagLinks) {
    info.tagLinks.split(",").forEach(pair => {
      const [tag, link] = pair.split("=");
      if (tag && link) tagLinks[tag.trim()] = link.trim();
    });
  }

  return {
    id,
    title,
    date,
    image,
    tags,
    tagLinks,
    content: contentText.trim(),
    rawInfo: info,
  };
}
