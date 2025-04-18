import React from "react";
import "../styles/ProjectCard.css"; // Import your styling

function ProjectCard({
  image,
  title,
  primaryText,
  secondaryText,
  buttonLink,
  buttonText,
}) {
  return (
    <div className="project">
      {/* Image Section */}
      <div>
        <img src={image} alt={title} className="project-image" />
      </div>

      {/* Content Section */}
      <div className="project-content">
        <h2 className="project-title">{title}</h2>
        <p className="primary-text">{primaryText}</p>
        <p className="secondary-text">{secondaryText}</p>
        {buttonText && ( // Check if buttonText is non-empty
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
