import React from "react";
import "../styles/ProjectCard.css"; // Import your styling
import { ReactComponent as GithubIcon } from "../images/svg/github-mark.svg"; // Capitalized and corrected naming



function ProjectCard({
  title,
  image,
  primaryText,
  secondaryText,
  buttonText,
  buttonLink,
  tags,
}) {
  // Define tag-to-SVG mapping
  const tagIcons = {
    github: <GithubIcon className="tag-icon" />, // Corrected SVG usage
  };

  return (
    <div className="project-container">
      <div className="project">
        <div>
          <img src={image} alt={title} className="project-image" />
        </div>
        <div className="project-content">
          <h2 className="project-title">{title}</h2>
          <p className="primary-text">{primaryText}</p>
          <p className="secondary-text">{secondaryText}</p>
          {buttonText && buttonLink && (
            <div className="buttonContainer">
              <a
                href={buttonLink}
                className="project-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                {buttonText}
              </a>
            </div>
          )}
        </div>
      </div>
      {/* Dynamic Tag Section */}
      <div className="project-tags">
        {tags.map((tag, index) => (
          <div key={index} className="tag">
            {tagIcons[tag] || <span className="tag-placeholder">{tag}</span>} {/* Fallback if tag isn't mapped */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectCard;