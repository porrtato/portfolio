import React from "react";
import "../styles/ProjectCard.css"; // Import your styling

function ProjectCard({ image, title, primaryText, secondaryText, buttonLink, buttonText }) {
  // Function to transform text into clickable links using regex
  const renderTextWithLinks = (text) => {
    // Regex to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split text into parts using the regex and replace matches with anchor tags
    return text.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
      return part; // Return plain text for non-matching parts
    });
  };

  return (
    <div className="project">
      <div>
        <img src={image} alt={title} className="project-image" />
      </div>
      <div className="project-content">
        <h2 className="project-title">{title}</h2>
        <p className="primary-text">{renderTextWithLinks(primaryText)}</p>
        <p className="secondary-text">{renderTextWithLinks(secondaryText)}</p>
        {buttonText && buttonLink && (
          <a
            href={buttonLink}
            className="project-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
