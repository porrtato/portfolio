import React from "react";
import "../styles/ProjectCard.css";
import "../styles/About.css";

function About() {
	return (
		<div className="project-detail-container about-container">
			<h1>About Me</h1>

			<div className="project about-project">
				<div>
					<img
						src="/images/profile.webp"
						alt="Profile"
						className="project-image about-image"
						onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/profile.jpg'; }}
					/>
				</div>
				<div className="project-content about-content">
					<p className="primary-text about-primary-text">
						Hi — I'm a developer and designer building small, focused projects that solve problems and
						explore creative interfaces. I like working with React, simple tooling, and clean visual
						design.
					</p>

					<p className="secondary-text about-secondary-text">
						This site showcases a selection of projects with notes, images and links. If you'd like to
						get in touch about a project or collaboration, reach out via email or check the links
						in the footer.
					</p>

					<div className="buttonContainer about-button-container">
						<a className="project-button about-button" href="/">
							View projects
						</a>
					</div>
				</div>
			</div>

			<h3>Skills</h3>
			<div className="about-skills">
				<span className="about-skill">React</span>
				<span className="about-skill">Figma</span>
				<span className="about-skill">Illustrator</span>
				<span className="about-skill">Unity</span>
			</div>

			<h3 className="about-contact-heading">Contact</h3>
			<p className="about-contact">
				Email: <a href="mailto:you@example.com">you@example.com</a>
			</p>
		</div>
	);
}

export default About;
