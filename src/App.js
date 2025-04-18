import React, { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card.js";
import ProjectCard from "./components/ProjectCard.js";
import { loadProjects } from "./utils/loadProjects";

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      const fetchedProjects = await loadProjects();
      setProjects(fetchedProjects);
    }
    fetchData();
  }, []);

  const handleCardClick = (projectId) => {
    const project = projects.find((proj) => proj.id === projectId);
    setSelectedProject(project);
  };

  const normalizeLink = (link) => {
    // Ensure the link starts with http:// or https://
    return link.startsWith("http://") || link.startsWith("https://") ? link : `https://${link}`;
  };

  return (
    <div className="app-container">
      <div className="left-section">
        {selectedProject ? (
          <ProjectCard
            title={selectedProject.title}
            image={selectedProject.image}
            primaryText={selectedProject.primaryText}
            secondaryText={selectedProject.secondaryText}
            button={selectedProject.button}
            buttonText={selectedProject.buttonText}
            buttonLink={normalizeLink(selectedProject.buttonLink)} // Normalize link here
          />
        ) : (
          <p>Please click on a card to view project details.</p>
        )}
      </div>
      <div className="right-section">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => handleCardClick(project.id)}
            style={{ cursor: "pointer" }}
          >
            <Card
              title={project.title}
              image={project.image}
              text1={project.cardText1}
              text2={project.cardText2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
