import { Link } from "react-router-dom";

const ProjectCard = ({ project, size = "md" }) => {
  const tall = size === "lg";

  return (
    <Link to={`/projects/${project.slug}`} className="group block">
      <div className={`relative overflow-hidden bg-navy ${tall ? "aspect-[4/3]" : "aspect-[4/3]"}`}>
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between font-mono text-[11px] tracking-wide uppercase text-stone/85">
          <span>{project.location}</span>
          <span>{project.status}</span>
        </div>
      </div>
      <div className="pt-4">
        <p className="eyebrow">{project.category}</p>
        <h3 className={`font-display text-navy mt-1 link-underline inline ${tall ? "text-2xl" : "text-xl"}`}>
          {project.title}
        </h3>
      </div>
    </Link>
  );
};

export default ProjectCard;
