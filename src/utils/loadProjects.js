export async function loadProjects() {
  // Helper to normalize links
  function normalizeLink(link) {
    if (!link) return '';
    let url = link.trim();
    // Remove trailing slash if it comes after a query string or at the end
    url = url.replace(/(\?.*?)\/$/, '$1').replace(/\/$/, '');
    // Add www. for youtube.com if missing
    if (url.startsWith('youtube.com')) {
      url = 'www.' + url;
    }
    // Prepend https:// if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url;
  }

  const projectIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // List of project IDs
  const projects = await Promise.all(
    projectIds.map(async (id) => {
      const infoResponse = await fetch(`/projects/Project${id}/info.txt`);
      const infoContent = await infoResponse.text();

      const info = {};
      infoContent.split("\n").forEach((line) => {
        const [key, value] = line.split(":");
        if (key && value) info[key.trim()] = value.trim();
      });

      const primaryResponse = await fetch(`/projects/Project${id}/primary.txt`);
      const primaryText = await primaryResponse.text();

      const secondaryResponse = await fetch(`/projects/Project${id}/secondary.txt`);
      const secondaryText = await secondaryResponse.text();

      const imagePath = `/projects/Project${id}/images/image1.webp`;

      // Use normalizeLink for buttonLink
      const normalizedLink = normalizeLink(info.link);

      // Parse tagLinks into an object: { tag: link, ... } and normalize each link
      let tagLinks = {};
      if (info.tagLinks) {
        info.tagLinks.split(",").forEach(pair => {
          const [tag, link] = pair.split("=");
          if (tag && link) tagLinks[tag.trim()] = normalizeLink(link.trim());
        });
      }

      return {
        id: info.id,
        title: info.title,
        buttonLink: normalizedLink, // Normalize link value
        buttonState: info.buttonstate === "y", // Convert 'y'/'n' to a boolean
        buttonText: info.buttontext, // Get button text
        date: info.date,
        image: imagePath,
        primaryText: primaryText.trim(),
        secondaryText: secondaryText.trim(),
        cardText1: info.cardText1,
        cardText2: info.cardText2,
        tags: info.tags ? info.tags.split(",") : [],
        tagLinks, // Add tagLinks object to each project
      };
    })
  );
  return projects;
}
