import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Card from "./components/Card.js";
import ProjectCard from "./components/ProjectCard.js";
import { loadProjects } from "./utils/loadProjects";

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const containerRef = useRef(null); // Ref for the scroll container
  const cardRefs = useRef([]); // Array of refs for each card
  const lastScrollTop = useRef(0); // Track the last scroll position

  useEffect(() => {
    async function fetchData() {
      const fetchedProjects = await loadProjects();
      setProjects(fetchedProjects);
      if (fetchedProjects && fetchedProjects.length > 0) {
        const randomIndex = Math.floor(Math.random() * fetchedProjects.length);
        const randomProject = fetchedProjects[randomIndex];
        setSelectedProject(randomProject);
        setBackgroundImage(randomProject.image);
      }
    }
    fetchData();
  }, []);

  const handleCardClick = (projectId, index) => {
    const project = projects.find((proj) => proj.id === projectId);
    setSelectedProject(project);
    setBackgroundImage(project.image);
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

  // Scroll event logic to select the next or previous card
  const handleScroll = () => {
    if (!containerRef.current || cardRefs.current.length === 0) return;

    const container = containerRef.current;
    const containerHeight = container.clientHeight;
    const containerScrollTop = container.scrollTop;
    const scrollDirection =
      containerScrollTop > lastScrollTop.current ? "down" : "up";
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
      const closestProject = projects[closestCardIndex];

      if (
        scrollDirection === "down" &&
        closestCardIndex >
          projects.findIndex((p) => p.id === selectedProject.id)
      ) {
        setSelectedProject(closestProject);
        setBackgroundImage(closestProject.image);
      } else if (
        scrollDirection === "up" &&
        closestCardIndex <
          projects.findIndex((p) => p.id === selectedProject.id)
      ) {
        setSelectedProject(closestProject);
        setBackgroundImage(closestProject.image);
      }
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

// Add this at the top of your App component:
const refreshScrollRun = useRef(false);

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
        behavior: "smooth"
      });
      
      refreshScrollRun.current = true; // Ensure this runs only once on refresh
    }
  }
}, [selectedProject, projects]);

  
  // Helper function to compute horizontal offset based on distance from the selected card.
  const getTransformValue = (index, selectedIndex) => {
    const distance = Math.abs(index - selectedIndex);
    if (distance > 3) return "none"; // Only offset cards within 3 spots
    const shift = 100 - distance * 25; // 0: -100px, 1: -75px, 2: -50px, 3: -25px
    return `translateX(-${shift}px)`;
  };

  // Determine the index of the currently selected project—if any.
  const selectedIndex =
    selectedProject !== null
      ? projects.findIndex((p) => p.id === selectedProject.id)
      : null;

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
          if (selectedIndex !== null) {
            transformValue = getTransformValue(index, selectedIndex);
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
