export type TagRecord = {
  id: string;
  name: string;
  slug: string;
};

export type ProjectRecord = {
  id: string;
  title: string;
  description: string;
  techStack: string;
  githubUrl: string | null;
  visitUrl: string | null;
  featured: boolean | number;
  createdAt: Date | string;
  tags: TagRecord[];
};

export type ProfileRecord = {
  id: string;
  name: string;
  headline: string;
  bio: string;
  heroImage: string;
  headlineUz: string | null;
  headlineEn: string | null;
  headlineRu: string | null;
  bioUz: string | null;
  bioEn: string | null;
  bioRu: string | null;
  phoneNumber: string | null;
  contactEmail: string | null;
  location: string | null;
  telegramUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  cvUrl: string | null;
  careerStartDate: Date | string | null;
  happyClientsCount: number;
  experienceYearsOverride: number | null;
  updatedAt: Date | string;
};

export type SkillRecord = {
  id: string;
  name: string;
  group: string | null;
  sortOrder: number;
};

export type PostRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverUrl: string | null;
  published: boolean | number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type ExperienceRecord = {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  sortOrder: number;
  createdAt: Date | string;
};

export type TestimonialRecord = {
  id: string;
  author: string;
  role: string | null;
  text: string;
  rating: number;
  sortOrder: number;
  createdAt: Date | string;
};

function iso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export function serializeTag(tag: TagRecord) {
  return { id: tag.id, name: tag.name, slug: tag.slug };
}

export function serializeProject(project: ProjectRecord) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    tech_stack: project.techStack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    github_link: project.githubUrl || null,
    live_link: project.visitUrl || null,
    featured: Boolean(project.featured),
    created_at: iso(project.createdAt),
    tags: project.tags.map(serializeTag),
  };
}

export function serializeProfile(profile: ProfileRecord) {
  return {
    id: profile.id,
    name: profile.name,
    headline_uz: profile.headlineUz,
    headline_en: profile.headlineEn,
    headline_ru: profile.headlineRu,
    bio_uz: profile.bioUz,
    bio_en: profile.bioEn,
    bio_ru: profile.bioRu,
    phone_number: profile.phoneNumber,
    contact_email: profile.contactEmail,
    location: profile.location,
    telegram_url: profile.telegramUrl,
    github_url: profile.githubUrl,
    linkedin_url: profile.linkedinUrl,
    instagram_url: profile.instagramUrl,
    cv_url: profile.cvUrl,
    career_start_date: profile.careerStartDate
      ? iso(profile.careerStartDate).slice(0, 10)
      : null,
    happy_clients_count: profile.happyClientsCount,
    experience_years_override: profile.experienceYearsOverride,
    updated_at: iso(profile.updatedAt),
  };
}

export function serializeSkill(skill: SkillRecord) {
  return {
    id: skill.id,
    name: skill.name,
    group: skill.group,
    sort_order: skill.sortOrder,
  };
}

export function serializePost(post: PostRecord) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    cover_url: post.coverUrl,
    published: Boolean(post.published),
    created_at: iso(post.createdAt),
    updated_at: iso(post.updatedAt),
  };
}

export function serializeExperience(experience: ExperienceRecord) {
  return {
    id: experience.id,
    role: experience.role,
    company: experience.company,
    period: experience.period,
    description: experience.description,
    sort_order: experience.sortOrder,
  };
}

export function serializeTestimonial(testimonial: TestimonialRecord) {
  return {
    id: testimonial.id,
    author: testimonial.author,
    role: testimonial.role,
    text: testimonial.text,
    rating: testimonial.rating,
    sort_order: testimonial.sortOrder,
    created_at: iso(testimonial.createdAt),
  };
}

export function calculateExperienceYears(startDate: Date | string | null) {
  if (!startDate) return 0;

  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const now = new Date();
  let years = now.getUTCFullYear() - start.getUTCFullYear();
  const anniversaryPassed =
    now.getUTCMonth() > start.getUTCMonth() ||
    (now.getUTCMonth() === start.getUTCMonth() && now.getUTCDate() >= start.getUTCDate());

  if (!anniversaryPassed) years -= 1;
  return Math.max(0, years);
}

export function resolveExperienceYears(
  startDate: Date | string | null,
  override: number | null,
) {
  if (override !== null && override >= 0) return override;
  return calculateExperienceYears(startDate);
}
