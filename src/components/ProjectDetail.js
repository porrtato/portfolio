import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProjectDetail() {
  // Example project data (replace with props or fetch logic as needed)
  const project = {
    title: "Project Title",
    image: "/projects/Project1/images/image1.webp",
    date: "2025-04-18",
    description:
      "This is a detailed description of the project, including goals, technologies used, and interesting challenges.",
    tags: ["github", "react", "figma"],
    links: {
      github: "https://github.com/patataardappel/aardappel",
      live: "https://example.com",
    },
    highlights: [
      "Built with React and Figma integration",
      "Features a custom design system",
      "Deployed on Netlify",
    ],
  };

  return (
    <div
      className="project-detail-container"
      style={{
        padding: "2rem",
        maxWidth: 700,
        margin: "auto",
      }}
    >
      <h1>{project.title}</h1>
      <img
        src={project.image}
        alt={project.title}
        style={{
          width: "100%",
          borderRadius: 8,
          marginBottom: 24,
        }}
      />
      <p>
        <strong>Date:</strong> {project.date}
      </p>
      <p>{project.description}</p>
      <h3>Highlights</h3>
      <ul>
        {project.highlights.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <h3>Links</h3>
      <ul>
        {Object.entries(project.links).map(([key, url]) => (
          <li key={key}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {key}
            </a>
          </li>
        ))}
      </ul>
      <h3>Tags</h3>
      <div
        style={{
          display: "flex",
          gap: 8,
        }}
      >
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              background: "#eee",
              padding: "4px 12px",
              borderRadius: 12,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}


export default ProjectDetail;
