import React from "react";
import "../styles/ProjectCard.css"; // Import your styling

import { ReactComponent as GithubIcon } from "../images/svg/github-mark.svg";
import { ReactComponent as FigmaIcon } from "../images/svg/figma.svg";
import { ReactComponent as ReactIcon } from "../images/svg/react.svg";
import { ReactComponent as IllustratorIcon } from "../images/svg/illustrator.svg";

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
    github: <GithubIcon className="tag-icon" />,
    figma: <FigmaIcon className="tag-icon" />,
    react: <ReactIcon className="tag-icon" />,
    illustrator: <IllustratorIcon className="tag-icon" />,
  };

  // Function to transform text with clickable links
  const renderTextWithLinks = (text) => {
    const markdownLinkRegex = /\((.*?)\)\[(https?:\/\/[^\s]+)\]/g; // Correctly terminated regex

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = markdownLinkRegex.exec(text)) !== null) {
      // Add text before the match, preserving trailing spaces
      parts.push(text.substring(lastIndex, match.index));

      // Add the link as an <a> element
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[1]}
        </a>
      );

      // Update lastIndex to move past this match
      lastIndex = markdownLinkRegex.lastIndex;
    }

    // Add remaining text after the last match
    parts.push(text.substring(lastIndex));

    return parts;
  };

  return (
    <div className="project-container">
      <div className="project">
        <div>
          <img src={image} alt={title} className="project-image" />
        </div>
        <div className="project-content">
          <h2 className="project-title">{title}</h2>
          <p className="primary-text">{renderTextWithLinks(primaryText)}</p>
          <p className="secondary-text">{renderTextWithLinks(secondaryText)}</p>
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
            {tagIcons[tag] || <span className="tag-placeholder">{tag}</span>}{" "}
            {/* Fallback if tag isn't mapped */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectCard;
