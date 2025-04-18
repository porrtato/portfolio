export async function loadProjects() {
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

      return {
        id: info.id,
        title: info.title,
        buttonLink: info.link, // Use link from info.txt
        buttonState: info.buttonstate === "y", // Convert 'y'/'n' to a boolean
        buttonText: info.buttontext, // Get button text
        date: info.date,
        image: imagePath,
        primaryText: primaryText.trim(),
        secondaryText: secondaryText.trim(),
        cardText1: info.cardText1,
        cardText2: info.cardText2,
      };
    })
  );
  return projects;
}
