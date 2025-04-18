import React from "react";
import "../styles/ProjectCard.css"; // Import your styling

function ProjectCard({ image, title, primaryText, secondaryText, buttonLink, buttonText }) {
  // Function to transform text with clickable links
  const renderTextWithLinks = (text) => {
    const markdownLinkRegex = /\((.*?)\)\[(https?:\/\/[^\s]+)\]/g; // Correctly terminated regex
  
    const parts = [];
    let lastIndex = 0;
    let match;
  
    while ((match = markdownLinkRegex.exec(text)) !== null) {
      parts.push(text.substring(lastIndex, match.index)); // Add text before the match
      parts.push(
        <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer">
          {match[1]} {/* Use the custom link text */}
        </a>
      );
      lastIndex = markdownLinkRegex.lastIndex; // Move to the end of the match
    }
  
    parts.push(text.substring(lastIndex)); // Add remaining text
    return parts;
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

