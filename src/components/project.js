import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { loadProjectPage } from "../utils/loadProjectPage";
import "../styles/ProjectDetail.css"; // added import for subtitle class and other styles


function Project() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await loadProjectPage(id);
        setProject(data);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="pd-loading">Loading...</div>;
  if (error) return <div className="pd-error">Error: {error}</div>;
  if (!project) return <div className="pd-empty">No project found.</div>;

  // Helper: resolve image token to filename (default image1.webp)
  const resolveImageFilename = (tokenNumber, tokenFilename) => {
    if (tokenFilename) return tokenFilename; // provided exact filename
    if (tokenNumber) return `image${tokenNumber}.webp`;
    return `image1.webp`;
  };

  // Helper to get projectpage image src and fallback to project images folder
  const projectpageSrc = (filename) => `/projects/Project${project.id}/projectpage/images/${filename}`;
  const projectImagesSrc = (filename) => `/projects/Project${project.id}/images/${filename}`;

  // Parse content into nodes handling [image], [image1], [image:filename.ext], and [subtitle]...[/subtitle]
  const renderContent = () => {
    const content = project.content || "";
    // Split into paragraphs by blank lines
    const paragraphs = content.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

    // Combined token regex: image tokens or subtitle blocks
    const tokenRegex = /\[image(?:(\d+)|:([^\]]+))?\]|\[subtitle\]([\s\S]*?)\[\/subtitle\]/ig;

    return paragraphs.map((para, pIndex) => {
      let lastIndex = 0;
      const parts = [];
      let match;
      tokenRegex.lastIndex = 0;

      while ((match = tokenRegex.exec(para)) !== null) {
        const matchStart = match.index;
        const matchEnd = tokenRegex.lastIndex;

        // text before match
        if (matchStart > lastIndex) {
          parts.push({ type: 'text', content: para.substring(lastIndex, matchStart) });
        }

        // image match: match[1] = number, match[2] = filename
        if (match[0].toLowerCase().startsWith('[image')) {
          const number = match[1];
          const filename = match[2];
          const imageFile = resolveImageFilename(number, filename);
          parts.push({ type: 'image', filename: imageFile });
        } else {
          // subtitle match: match[3] contains subtitle content
          const subtitleText = match[3] != null ? match[3].trim() : "";
          parts.push({ type: 'subtitle', content: subtitleText });
        }

        lastIndex = matchEnd;
      }

      // remaining text
      if (lastIndex < para.length) {
        parts.push({ type: 'text', content: para.substring(lastIndex) });
      }

      // If paragraph consists of a single image token, render image as a block
      if (parts.length === 1 && parts[0].type === 'image') {
        const filename = parts[0].filename;
        const srcPage = projectpageSrc(filename);
        const fallback = projectImagesSrc(filename);
        return (
          <div key={pIndex} className="pd-image-block">
            <img
              src={srcPage}
              alt={project.title + ' image'}
              className="pd-block-image"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallback; }}
            />
          </div>
        );
      }

      // If paragraph consists of a single subtitle token, render as a block with subtitle class
      if (parts.length === 1 && parts[0].type === 'subtitle') {
        return (
          <div key={pIndex} className="subtitle">
            {parts[0].content}
          </div>
        );
      }

      // Otherwise render paragraph with inline images and inline subtitles
      return (
        <p key={pIndex} className="pd-paragraph">
          {parts.map((part, i) => {
            if (part.type === 'text') return <span key={i}>{part.content}</span>;
            if (part.type === 'subtitle') {
              // Render inline subtitle followed by a single line break
              return (
                <React.Fragment key={i}>
                  <span className="subtitle">{part.content}</span>
                  <br />
                </React.Fragment>
              );
            }
            // image
            const filename = part.filename;
            const srcPage = projectpageSrc(filename);
            const fallback = projectImagesSrc(filename);
            return (
              <img
                key={i}
                src={srcPage}
                alt={`${project.title} image`}
                className="pd-inline-image"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallback; }}
              />
            );
          })}
        </p>
      );
    });
  };

  // Main hero image: try projectpage images first, then fallback to project images folder
  const mainImagePage = `/projects/Project${project.id}/images/image1.webp`;
  const mainImageFallback = `/projects/Project${project.id}/images/image1.webp`;

  return (
    <div className="project-detail-container pd-root">


      			<a className="project-button" href="/">
							Terug naar projecten
						</a>
      <h1 className="pd-title">{project.title}</h1>
      <img
        src={mainImagePage}
        alt={project.title}
        className="pd-main-image"
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = mainImageFallback; }}
      />
      {project.date && <p className="pd-date"><strong>Date:</strong> {project.date}</p>}

      {renderContent()}

      {project.tags && project.tags.length > 0 && (
        <>
          <h3 className="pd-tags-heading">Tags</h3>
          <div className="pd-tags">
            {project.tags.map(tag => (
              <span key={tag} className="pd-tag">{tag}</span>
            ))}
          </div>
        </>
      )}

      {project.tagLinks && Object.keys(project.tagLinks).length > 0 && (
        <>
          <h3 className="pd-links-heading">Links</h3>
          <ul className="pd-links-list">
            {Object.entries(project.tagLinks).map(([key, url]) => (
              <li key={key}>
                <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer">
                  {key}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Project;
