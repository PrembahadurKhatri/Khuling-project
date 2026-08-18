import { FaUserShield, FaBalanceScale, FaHardHat, FaLeaf, FaCertificate } from "react-icons/fa";
import PageHeader from "../components/PageHeader.jsx";

const policies = [
  {
    id: "5.1",
    icon: FaUserShield,
    title: "Trafficking in Persons (TIP)",
    status: "Framework in development",
    body: "Trafficking in Persons (TIP) refers to the recruitment, transportation, transfer, harboring, or receipt of individuals through threats, force, coercion, abduction, fraud, or deception for the purpose of exploitation. This may include forced labor, servitude, or sexual exploitation. It is a grave violation of human rights and dignity. The company recognizes the seriousness of this issue and is committed to prevent any form of TIP within its operations, supply chain, or among contractors. The company is in the process of developing a clear policy framework that will define preventive measures, awareness programs, and reporting mechanisms to ensure that all employees and partners uphold ethical and lawful practices.",
  },
  {
    id: "5.2",
    icon: FaBalanceScale,
    title: "Anti Sexual Harassment (ASH)",
    status: "Policy underway",
    body: "Anti-Sexual Harassment (ASH) involves preventing and responding to any unwelcome sexual advances, requests for sexual favors, or other verbal, non-verbal, or physical conduct of a sexual nature that creates an intimidating or hostile work environment. The company is fully committed to fostering a workplace that promotes mutual respect, gender equality, and safety for all employees. A formal ASH policy is currently underway, which will include preventive training, confidential reporting channels, and strict disciplinary procedures to ensure zero tolerance toward sexual harassment at all levels of the organization.",
  },
  {
    id: "5.3",
    icon: FaHardHat,
    title: "Occupational Health and Safety Management System (OHSMS)",
    status: "Aligning with ISO 45001",
    body: "The Occupational Health and Safety Management System (OHSMS) is a structured framework designed to ensure the health, safety, and well-being of all employees and stakeholders involved in company operations. It aims to identify hazards, assess risks, and implement effective control measures to prevent workplace injuries, illnesses, and incidents. The company is committed to establish, implement and continually improve its OHSMS in line with ISO 45001 standards. A formal policy is underway to promote a culture of safety, ensure legal compliance, and enhance employee participation in maintaining a safe and healthy work environment.",
  },
  {
    id: "5.4",
    icon: FaLeaf,
    title: "Environmental Management System (EMS)",
    status: "Aligning with ISO 14001",
    body: "An Environmental Management System (EMS) is a designed framework to set guidelines and responsibilities for the stakeholders for developing and maintaining healthy environment that is directly / indirectly connected to their workplace. ISO 14001 is an internationally recognized standard for Environmental Management Systems (EMS) that guides organizations in managing their environmental responsibilities systematically. It helps reduce environmental impacts, ensure legal compliance, and promote sustainability in operations. The company is committed to adopt ISO 14001 principles by identifying significant environmental aspects, controlling pollution sources, and promoting efficient use of resources. A comprehensive EMS policy is under development, focusing on continuous improvement, environmental protection, and fostering environmental awareness among all employees and stakeholders.",
  },
  {
    id: "5.5",
    icon: FaCertificate,
    title: "Quality Management System (QMS)",
    status: "Aligning with ISO 9001",
    body: "A Quality Management System (QMS) provides a structured approach to ensure that products, services, and processes consistently meet customer and regulatory requirements. It focuses on continuous improvement, customer satisfaction, and operational excellence. The company is dedicated to implement a QMS based on ISO 9001 standards to enhance efficiency, accountability, and quality performance across all departments. The QMS policy, currently underway, will define quality objectives, monitoring mechanisms, and improvement strategies to ensure the highest standards of service delivery and stakeholder confidence.",
  },
];

const Policy = () => {
  return (
    <div>
      <PageHeader eyebrow="Governance" title="Company Policies" crumb="Home / Policy">
        The Company has adopted the following important policies to develop, maintain, and protect a healthy work
        culture, ecological environment, human rights, and the welfare of its employees and society.
      </PageHeader>

      <section className="container-wide py-20 md:py-24">
        <div className="grid gap-6 lg:gap-8">
          {policies.map(({ id, icon: Icon, title, status, body }, i) => (
            <div
              key={id}
              className="card group relative overflow-hidden rounded-2xl border border-line p-7 md:p-9
                         transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* large ghost index number */}
              <span
                className="pointer-events-none absolute -right-2 -top-6 font-body text-[6rem] md:text-[8rem]
                           font-bold leading-none text-navy/[0.04] select-none"
              >
                {id}
              </span>

              <div className="relative flex flex-col md:flex-row md:items-start gap-6">
                {/* icon badge */}
                <div className="shrink-0 flex md:flex-col items-center md:items-start gap-3">
                  <div
                    className="w-14 h-14 rounded-xl bg-navy/5 ring-1 ring-navy/10 flex items-center justify-center
                               group-hover:ring-gold/40 group-hover:bg-gold/10 transition-all duration-300"
                  >
                    <Icon className="text-navy text-xl group-hover:text-gold transition-colors duration-300" />
                  </div>
                  <span className="font-body text-xs font-semibold tracking-widest2 uppercase text-gold">{id}</span>
                </div>

                {/* content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h2 className="font-body text-xl md:text-2xl text-navy leading-tight">{title}</h2>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border border-teal/25 bg-teal/10
                                 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                      {status}
                    </span>
                  </div>
                  <p className="text-navy/70 leading-relaxed text-sm md:text-[15px] font-body">{body}</p>
                </div>
              </div>

              {/* bottom accent on hover */}
              <span
                className="absolute left-0 bottom-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r
                           from-gold via-teal to-gold transition-transform duration-500 group-hover:scale-x-100"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Policy;
