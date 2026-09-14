import { Briefcase, GraduationCap, FolderGit2, Code } from "lucide-react";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export function SkillsCard({ data }: Props) {
  if (!data) return null;
  const skills = typeof data === "string" ? JSON.parse(data) : data;
  if (Object.keys(skills).length === 0) return null;

  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          <Code className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold">Technical Skills</h3>
      </div>
      <div className="space-y-4">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 capitalize">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(items) && items.map((skill: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExperienceCard({ data }: Props) {
  if (!data) return null;
  const experiences = typeof data === "string" ? JSON.parse(data) : data;
  if (!Array.isArray(experiences) || experiences.length === 0) return null;

  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          <Briefcase className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold">Experience</h3>
      </div>
      <div className="space-y-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {experiences.map((exp: any, i: number) => (
          <div key={i} className="relative pl-4 border-l-2 border-muted">
            <h4 className="font-semibold">{exp.title}</h4>
            <p className="text-sm text-primary font-medium">{exp.company} <span className="text-muted-foreground ml-2">{exp.dates}</span></p>
            <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EducationCard({ data }: Props) {
  if (!data) return null;
  const education = typeof data === "string" ? JSON.parse(data) : data;
  if (!Array.isArray(education) || education.length === 0) return null;

  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          <GraduationCap className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold">Education</h3>
      </div>
      <div className="space-y-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {education.map((edu: any, i: number) => (
          <div key={i}>
            <h4 className="font-semibold">{edu.degree}</h4>
            <p className="text-sm text-muted-foreground">{edu.institution} • {edu.dates}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectsCard({ data }: Props) {
  if (!data) return null;
  const projects = typeof data === "string" ? JSON.parse(data) : data;
  if (!Array.isArray(projects) || projects.length === 0) return null;

  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          <FolderGit2 className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold">Projects</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {projects.map((proj: any, i: number) => (
          <div key={i} className="p-4 border rounded-md">
            <h4 className="font-semibold">{proj.name}</h4>
            <p className="text-sm text-muted-foreground mt-1 mb-3">{proj.description}</p>
            {proj.techStack && (
              <div className="flex flex-wrap gap-1">
                {Array.isArray(proj.techStack) ? proj.techStack.map((tech: string, j: number) => (
                  <span key={j} className="text-xs bg-muted px-1.5 py-0.5 rounded">{tech}</span>
                )) : null}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
