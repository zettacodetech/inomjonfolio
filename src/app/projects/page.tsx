import { getProjectViews } from "@/lib/data";
import { ProjectsClient } from "@/components/projects/ProjectsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects | Inomjon Toshmirzayev",
  description: "Selected backend projects by Inomjon Toshmirzayev.",
};

async function getGithubStats() {
  try {
    const response = await fetch("https://api.github.com/users/Toshmirzayev-Inomjon", {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return {
      followers: data.followers ?? 0,
      public_repos: data.public_repos ?? 0,
      avatar: data.avatar_url ?? "",
    };
  } catch {
    return null;
  }
}

export default async function ProjectsPage() {
  const [projects, github] = await Promise.all([getProjectViews(), getGithubStats()]);

  return <ProjectsClient projects={projects} github={github} />;
}
