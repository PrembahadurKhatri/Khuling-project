import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectBySlug } from "../services/projectService.js";
import ProjectCard from "../components/ProjectCard.jsx";
import { HiLocationMarker, HiCalendar, HiUserGroup, HiCurrencyDollar } from "react-icons/hi";

const ProjectDetail = () => {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => fetchProjectBySlug(slug),
  });

  if (isLoading) return <p className="section text-center text-gray-500">Loading...</p>;
  if (!data?.data) return <p className="section text-center text-gray-500">Project not found.</p>;

  const project = data.data;

  return (
    <div>
      <div className="relative h-[50vh] min-h-[400px]">
        <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-end">
          <div className="section !py-8 text-white">
            <p className="text-primary font-semibold uppercase text-sm">{project.category}</p>
            <h1 className="text-3xl md:text-5xl font-heading font-bold">{project.title}</h1>
          </div>
        </div>
      </div>

      <section className="section grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-heading font-bold text-secondary mb-4">Project Overview</h2>
          <p className="text-gray-600 leading-relaxed">{project.description}</p>

          {project.gallery?.length > 0 && (
            <>
              <h3 className="text-xl font-heading font-semibold text-secondary mt-10 mb-4">Gallery</h3>
              <div className="grid grid-cols-2 gap-4">
                {project.gallery.map((img, i) => (
                  <img key={i} src={img} alt={`Gallery ${i + 1}`} className="rounded-lg object-cover h-48 w-full" />
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="card p-6 h-fit space-y-4">
          <h3 className="font-heading font-semibold text-secondary">Project Details</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600"><HiLocationMarker className="text-primary" /> {project.location}</div>
          {project.client && <div className="flex items-center gap-2 text-sm text-gray-600"><HiUserGroup className="text-primary" /> {project.client}</div>}
          {project.budget && <div className="flex items-center gap-2 text-sm text-gray-600"><HiCurrencyDollar className="text-primary" /> {project.budget}</div>}
          {project.startDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiCalendar className="text-primary" />
              {new Date(project.startDate).toLocaleDateString()} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Ongoing"}
            </div>
          )}
          <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
            {project.status}
          </span>
        </aside>
      </section>

      {data.related?.length > 0 && (
        <section className="section bg-gray-50">
          <h2 className="text-2xl font-heading font-bold text-secondary mb-8">Related Projects</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.related.map((p) => <ProjectCard key={p._id} project={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProjectDetail;
