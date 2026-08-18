import { Link } from "react-router-dom";

const ProjectCard = ({ project, size = "md" }) => {
  const tall = size === "lg";

  return (
    <Link to={`/projects/${project.slug}`} className="group block h-full">
      <div
        className="h-full flex flex-col rounded-xl border border-navy/10 group-hover:border-gold/40 
        bg-white shadow-soft group-hover:shadow-2xl transition-all duration-500 overflow-hidden"
      >
        <div className="relative overflow-hidden bg-navy aspect-[4/3] shrink-0">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover scale-[1.02] group-hover:scale-[1.08] transition-transform duration-[1200ms] ease-out"
          />

          {/* Gradient overlay — deepens on hover for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/20 to-navy/10
            group-hover:from-navy/95 group-hover:via-navy/40 transition-colors duration-500" />

          {/* Fine gold corner accent, appears on hover */}
          <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-gold/70" />
          </div>

        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <span className="w-4 h-px bg-gold/60 group-hover:w-6 transition-all duration-300 shrink-0" />
            <h3
              className={`font-body font-semibold text-navy inline-flex items-center gap-2
              group-hover:text-gold transition-colors duration-300 line-clamp-2 ${tall ? "text-2xl" : "text-xl"}`}
            >
              {project.title}
              
            </h3>
          </div>

          {project.description && (
            <p
              className={`font-body text-navy/55 mt-2 mb-2 pl-6 leading-relaxed ${
                tall ? "text-[15px] line-clamp-2" : "text-sm line-clamp-1"
              }`}
            >
              {project.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;