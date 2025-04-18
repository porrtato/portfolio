import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Card from "./components/Card.js";
import ProjectCard from "./components/ProjectCard.js";
import { loadProjects } from "./utils/loadProjects";

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  
  const containerRef = useRef(null); // Ref for the scroll container
  const cardRefs = useRef([]); // Array of refs for each card
  const lastScrollTop = useRef(0); // Track the last scroll position
  const refreshScrollRun = useRef(false); // Flag to run refresh scroll only once

  // Fetch projects on mount
  useEffect(() => {
    async function fetchData() {
      const fetchedProjects = await loadProjects();
      setProjects(fetchedProjects);
      if (fetchedProjects && fetchedProjects.length > 0) {
        const randomIndex = Math.floor(Math.random() * fetchedProjects.length);
        const randomProject = fetchedProjects[randomIndex];
        setSelectedProject(randomProject);
        setBackgroundImage(randomProject.image);
        setActiveCardIndex(randomIndex);
      }
    }
    fetchData();
  }, []);

  // When a card is clicked, update selectedProject, background and activeCardIndex, then scroll it to center
  const handleCardClick = (projectId, index) => {
    const project = projects.find((proj) => proj.id === projectId);
    setSelectedProject(project);
    setBackgroundImage(project.image);
    setActiveCardIndex(index);
    if (containerRef.current && cardRefs.current[index]) {
      const containerHeight = containerRef.current.clientHeight;
      const cardElem = cardRefs.current[index];
      const cardOffsetTop = cardElem.offsetTop;
      const cardHeight = cardElem.clientHeight;

      const newScrollTop = cardOffsetTop - containerHeight / 2 + cardHeight / 2;

      containerRef.current.scrollTo({
        top: newScrollTop,
        behavior: "smooth",
      });
    }
  };

  // On scroll, update only the activeCardIndex (keeping selectedProject/background unchanged)
  const handleScroll = () => {
    if (!containerRef.current || cardRefs.current.length === 0) return;

    const container = containerRef.current;
    const containerHeight = container.clientHeight;
    const containerScrollTop = container.scrollTop;
    lastScrollTop.current = containerScrollTop;

    let closestCardIndex = null;
    let closestDistance = Infinity;
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const cardTop = card.offsetTop;
      const cardHeight = card.clientHeight;
      const cardCenter = cardTop + cardHeight / 2;
      const containerCenter = containerScrollTop + containerHeight / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < closestDistance) {
        closestCardIndex = index;
        closestDistance = distance;
      }
    });
    if (closestCardIndex !== null) {
      setActiveCardIndex(closestCardIndex);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [projects, selectedProject]);

  // On refresh, scroll the selected card into view (run only once)
  useEffect(() => {
    if (
      !refreshScrollRun.current &&
      selectedProject &&
      containerRef.current &&
      cardRefs.current.length > 0
    ) {
      const selectedIndex = projects.findIndex((p) => p.id === selectedProject.id);
      if (selectedIndex !== -1 && cardRefs.current[selectedIndex]) {
        const containerHeight = containerRef.current.clientHeight;
        const cardElem = cardRefs.current[selectedIndex];
        const cardOffsetTop = cardElem.offsetTop;
        const cardHeight = cardElem.clientHeight;
        
        let newScrollTop = cardOffsetTop - containerHeight / 2 + cardHeight / 2;
        const maxScrollTop = containerRef.current.scrollHeight - containerHeight;
        newScrollTop = Math.min(newScrollTop, maxScrollTop);
        
        containerRef.current.scrollTo({
          top: newScrollTop,
          behavior: "smooth",
        });
        
        refreshScrollRun.current = true; // Run this effect only once on refresh
      }
    }
  }, [selectedProject, projects]);

  // Helper function to compute horizontal offset based on distance from the active card.
  const getTransformValue = (index, activeIndex) => {
    const distance = Math.abs(index - activeIndex);
    if (distance > 3) return "none"; // Only offset cards within 3 spots
    const shift = 100 - distance * 25; // 0: -100px, 1: -75px, 2: -50px, 3: -25px
    return `translateX(-${shift}px)`;
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.5s ease-in-out",
      }}
    >
      <div className="left-section">
        {selectedProject ? (
          <ProjectCard
            title={selectedProject.title}
            image={selectedProject.image}
            primaryText={selectedProject.primaryText}
            secondaryText={selectedProject.secondaryText}
            buttonLink={selectedProject.buttonLink}
            buttonText={selectedProject.buttonText}
          />
        ) : (
          <p>Please click on a card to view project details.</p>
        )}
      </div>
      <div className="right-section" ref={containerRef}>
        {projects.map((project, index) => {
          let transformValue = "none";
          if (activeCardIndex !== null) {
            transformValue = getTransformValue(index, activeCardIndex);
          }
          return (
            <div
              key={project.id}
              ref={(el) => (cardRefs.current[index] = el)}
              onClick={() => handleCardClick(project.id, index)}
              style={{
                cursor: "pointer",
                transform: transformValue,
                transition: "transform 0.3s ease",
              }}
            >
              <Card
                title={project.title}
                image={project.image}
                text1={project.cardText1}
                text2={project.cardText2}
                index={index}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
