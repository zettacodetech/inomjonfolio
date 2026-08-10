import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  ProfileRecord,
  ProjectRecord,
  SkillRecord,
  TagRecord,
  PostRecord,
  ExperienceRecord,
  TestimonialRecord,
} from "@/lib/portfolio-serializers";

type ProjectRow = Omit<ProjectRecord, "tags">;
type ProjectTagRow = TagRecord & { projectId: string };
type VisitAnalyticsRow = {
  totalVisits: bigint | number | null;
  uniqueVisitors: bigint | number | null;
  todayVisits: bigint | number | null;
};
type RecentVisitRow = {
  id: string;
  visitorKey: string;
  path: string;
  referrer: string | null;
  createdAt: string;
};
type DailyVisitsRow = {
  day: string;
  count: bigint | number | null;
};
type PageVisitsRow = {
  path: string;
  count: bigint | number | null;
};

export async function findProfile() {
  const rows = await prisma.$queryRaw<ProfileRecord[]>`
    SELECT id, name, headline, bio, heroImage, headlineUz, headlineEn, headlineRu, bioUz, bioEn, bioRu,
           phoneNumber, contactEmail, location, telegramUrl, githubUrl, linkedinUrl,
           instagramUrl, cvUrl, CAST(careerStartDate AS TEXT) AS careerStartDate,
           happyClientsCount, experienceYearsOverride, updatedAt
    FROM Profile
    WHERE id = 'main'
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function ensureProfile() {
  await prisma.$executeRaw`
    INSERT OR IGNORE INTO Profile (
      id, name, headline, bio, heroImage, happyClientsCount, updatedAt
    )
    VALUES (
      'main',
      'Inomjon Toshmirzayev',
      'Backend Developer',
      'Zamonaviy web ilovalar va biznes platformalar yarataman.',
      '/uploads/profile-inomjon.webp',
      20,
      datetime('now')
    )
  `;
  return findProfile();
}

export async function updateProfile(input: {
  name: string;
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
  careerStartDate: string | null;
  happyClientsCount: number;
  experienceYearsOverride: number | null;
  fallbackHeadline: string;
  fallbackBio: string;
}) {
  await prisma.$executeRaw`
    UPDATE Profile
    SET name = ${input.name},
        headline = ${input.headlineUz ?? input.fallbackHeadline},
        bio = ${input.bioUz ?? input.fallbackBio},
        headlineUz = ${input.headlineUz},
        headlineEn = ${input.headlineEn},
        headlineRu = ${input.headlineRu},
        bioUz = ${input.bioUz},
        bioEn = ${input.bioEn},
        bioRu = ${input.bioRu},
        phoneNumber = ${input.phoneNumber},
        contactEmail = ${input.contactEmail},
        location = ${input.location},
        telegramUrl = ${input.telegramUrl},
        githubUrl = ${input.githubUrl},
        linkedinUrl = ${input.linkedinUrl},
        instagramUrl = ${input.instagramUrl},
        cvUrl = ${input.cvUrl},
        careerStartDate = ${input.careerStartDate},
        happyClientsCount = ${input.happyClientsCount},
        experienceYearsOverride = ${input.experienceYearsOverride},
        updatedAt = datetime('now')
    WHERE id = 'main'
  `;
  return findProfile();
}

export async function listTags() {
  return prisma.$queryRaw<TagRecord[]>`
    SELECT id, name, slug FROM Tag ORDER BY name ASC
  `;
}

export async function createTag(name: string, slug: string) {
  const id = randomUUID();
  await prisma.$executeRaw`
    INSERT INTO Tag (id, name, slug) VALUES (${id}, ${name}, ${slug})
  `;
  return { id, name, slug } satisfies TagRecord;
}

export async function deleteTag(id: string) {
  await prisma.$transaction([
    prisma.$executeRaw`DELETE FROM "_ProjectToTag" WHERE B = ${id}`,
    prisma.$executeRaw`DELETE FROM Tag WHERE id = ${id}`,
  ]);
}

export async function listSkills() {
  return prisma.$queryRaw<SkillRecord[]>`
    SELECT id, name, "group", sortOrder FROM Skill ORDER BY sortOrder ASC, name ASC
  `;
}

export async function listProjects(limit = 100) {
  const safeLimit = Math.min(100, Math.max(1, Math.trunc(limit)));
  const projects = await prisma.$queryRaw<ProjectRow[]>`
    SELECT id, title, description, techStack, githubUrl, visitUrl, featured, createdAt
    FROM Project
    ORDER BY featured DESC, createdAt DESC
    LIMIT ${safeLimit}
  `;
  if (projects.length === 0) return [];

  const ids = projects.map((project) => project.id);
  const tagRows = await prisma.$queryRaw<ProjectTagRow[]>(Prisma.sql`
    SELECT junction.A AS projectId, tag.id, tag.name, tag.slug
    FROM "_ProjectToTag" AS junction
    JOIN Tag AS tag ON tag.id = junction.B
    WHERE junction.A IN (${Prisma.join(ids)})
    ORDER BY tag.name ASC
  `);
  const tagsByProject = new Map<string, TagRecord[]>();
  for (const tag of tagRows) {
    const tags = tagsByProject.get(tag.projectId) ?? [];
    tags.push({ id: tag.id, name: tag.name, slug: tag.slug });
    tagsByProject.set(tag.projectId, tags);
  }

  return projects.map<ProjectRecord>((project) => ({
    ...project,
    tags: tagsByProject.get(project.id) ?? [],
  }));
}

export async function findProject(id: string) {
  const projects = await prisma.$queryRaw<ProjectRow[]>`
    SELECT id, title, description, techStack, githubUrl, visitUrl, featured, createdAt
    FROM Project
    WHERE id = ${id}
    LIMIT 1
  `;
  const project = projects[0];
  if (!project) return null;

  const tags = await prisma.$queryRaw<TagRecord[]>`
    SELECT tag.id, tag.name, tag.slug
    FROM "_ProjectToTag" AS junction
    JOIN Tag AS tag ON tag.id = junction.B
    WHERE junction.A = ${id}
    ORDER BY tag.name ASC
  `;
  return { ...project, tags } satisfies ProjectRecord;
}

type ProjectWriteInput = {
  title: string;
  description: string;
  techStack: string;
  githubUrl: string | null;
  visitUrl: string | null;
  featured: boolean;
  tagIds: string[];
};

async function replaceProjectTags(
  transaction: Prisma.TransactionClient,
  projectId: string,
  tagIds: string[],
) {
  await transaction.$executeRaw`DELETE FROM "_ProjectToTag" WHERE A = ${projectId}`;
  for (const tagId of tagIds) {
    await transaction.$executeRaw`
      INSERT OR IGNORE INTO "_ProjectToTag" (A, B) VALUES (${projectId}, ${tagId})
    `;
  }
}

export async function createProject(input: ProjectWriteInput) {
  const id = randomUUID();
  await prisma.$transaction(async (transaction) => {
    await transaction.$executeRaw`
      INSERT INTO Project (
        id, title, description, imageUrl, techStack, visitUrl, githubUrl,
        featured, createdAt, updatedAt
      )
      VALUES (
        ${id}, ${input.title}, ${input.description}, '', ${input.techStack},
        ${input.visitUrl}, ${input.githubUrl}, ${input.featured},
        datetime('now'), datetime('now')
      )
    `;
    await replaceProjectTags(transaction, id, input.tagIds);
  });
  return findProject(id);
}

export async function updateProject(id: string, input: ProjectWriteInput) {
  await prisma.$transaction(async (transaction) => {
    await transaction.$executeRaw`
      UPDATE Project
      SET title = ${input.title},
          description = ${input.description},
          techStack = ${input.techStack},
          visitUrl = ${input.visitUrl},
          githubUrl = ${input.githubUrl},
          featured = ${input.featured},
          updatedAt = datetime('now')
      WHERE id = ${id}
    `;
    await replaceProjectTags(transaction, id, input.tagIds);
  });
  return findProject(id);
}

export async function deleteProject(id: string) {
  await prisma.$transaction([
    prisma.$executeRaw`DELETE FROM "_ProjectToTag" WHERE A = ${id}`,
    prisma.$executeRaw`DELETE FROM Project WHERE id = ${id}`,
  ]);
}

export async function recordSiteVisit(input: {
  visitorKey: string;
  path: string;
  referrer: string | null;
  userAgent: string | null;
  ipHash: string | null;
}) {
  const id = randomUUID();
  await prisma.$executeRaw`
    INSERT INTO SiteVisit (id, visitorKey, path, referrer, userAgent, ipHash, createdAt)
    VALUES (
      ${id},
      ${input.visitorKey},
      ${input.path},
      ${input.referrer},
      ${input.userAgent},
      ${input.ipHash},
      datetime('now')
    )
  `;
  return id;
}

export async function getVisitAnalytics() {
  const [statsRows, recentVisits, dailyRows, pageRows] = await Promise.all([
    prisma.$queryRaw<VisitAnalyticsRow[]>`
      SELECT
        COUNT(*) AS totalVisits,
        COUNT(DISTINCT visitorKey) AS uniqueVisitors,
        SUM(CASE WHEN createdAt >= datetime('now', 'start of day') THEN 1 ELSE 0 END) AS todayVisits
      FROM SiteVisit
    `,
    prisma.$queryRaw<RecentVisitRow[]>`
      SELECT id, visitorKey, path, referrer, CAST(createdAt AS TEXT) AS createdAt
      FROM SiteVisit
      ORDER BY createdAt DESC
      LIMIT 8
    `,
    prisma.$queryRaw<DailyVisitsRow[]>`
      SELECT date(createdAt) AS day, COUNT(*) AS count
      FROM SiteVisit
      WHERE createdAt >= datetime('now', '-6 days')
      GROUP BY date(createdAt)
      ORDER BY day ASC
    `,
    prisma.$queryRaw<PageVisitsRow[]>`
      SELECT path, COUNT(*) AS count
      FROM SiteVisit
      WHERE createdAt >= datetime('now', '-30 days')
      GROUP BY path
      ORDER BY count DESC
      LIMIT 6
    `,
  ]);
  const stats = statsRows[0];

  return {
    total_visits: Number(stats?.totalVisits ?? 0),
    unique_visitors: Number(stats?.uniqueVisitors ?? 0),
    today_visits: Number(stats?.todayVisits ?? 0),
    daily_visits: dailyRows.map((row) => ({ day: row.day, count: Number(row.count ?? 0) })),
    page_visits: pageRows.map((row) => ({ path: row.path, count: Number(row.count ?? 0) })),
    recent_visits: recentVisits.map((visit) => ({
      id: visit.id,
      visitor_label: `visitor-${visit.visitorKey.slice(0, 8)}`,
      path: visit.path,
      referrer: visit.referrer,
      created_at: visit.createdAt,
    })),
  };
}

// ─── Blog posts ───────────────────────────────────────────────────────────────

export async function listPosts(includeUnpublished = false) {
  return prisma.$queryRaw<PostRecord[]>`
    SELECT id, slug, title, excerpt, content, coverUrl, published,
           CAST(createdAt AS TEXT) AS createdAt, CAST(updatedAt AS TEXT) AS updatedAt
    FROM Post
    ${includeUnpublished ? Prisma.empty : Prisma.sql`WHERE published = 1`}
    ORDER BY createdAt DESC
  `;
}

export async function findPost(slug: string, includeUnpublished = false) {
  const rows = await prisma.$queryRaw<PostRecord[]>`
    SELECT id, slug, title, excerpt, content, coverUrl, published,
           CAST(createdAt AS TEXT) AS createdAt, CAST(updatedAt AS TEXT) AS updatedAt
    FROM Post
    WHERE slug = ${slug}
    ${includeUnpublished ? Prisma.empty : Prisma.sql`AND published = 1`}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function createPost(input: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverUrl: string | null;
  published: boolean;
}) {
  const id = randomUUID();
  await prisma.$executeRaw`
    INSERT INTO Post (id, slug, title, excerpt, content, coverUrl, published, createdAt, updatedAt)
    VALUES (${id}, ${input.slug}, ${input.title}, ${input.excerpt}, ${input.content},
            ${input.coverUrl}, ${input.published ? 1 : 0}, datetime('now'), datetime('now'))
  `;
  return findPost(input.slug, true);
}

export async function updatePost(id: string, input: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverUrl: string | null;
  published: boolean;
}) {
  await prisma.$executeRaw`
    UPDATE Post
    SET slug = ${input.slug}, title = ${input.title}, excerpt = ${input.excerpt},
        content = ${input.content}, coverUrl = ${input.coverUrl},
        published = ${input.published ? 1 : 0}, updatedAt = datetime('now')
    WHERE id = ${id}
  `;
  return findPost(input.slug, true);
}

export async function deletePost(id: string) {
  await prisma.$executeRaw`DELETE FROM Post WHERE id = ${id}`;
}

// ─── Experience ───────────────────────────────────────────────────────────────

export async function listExperience() {
  return prisma.$queryRaw<ExperienceRecord[]>`
    SELECT id, role, company, period, description, sortOrder, CAST(createdAt AS TEXT) AS createdAt
    FROM Experience
    ORDER BY sortOrder ASC, createdAt ASC
  `;
}

export async function createExperience(input: {
  role: string;
  company: string;
  period: string;
  description: string;
  sortOrder: number;
}) {
  const id = randomUUID();
  await prisma.$executeRaw`
    INSERT INTO Experience (id, role, company, period, description, sortOrder, createdAt, updatedAt)
    VALUES (${id}, ${input.role}, ${input.company}, ${input.period}, ${input.description},
            ${input.sortOrder}, datetime('now'), datetime('now'))
  `;
  return id;
}

export async function updateExperience(id: string, input: {
  role: string;
  company: string;
  period: string;
  description: string;
  sortOrder: number;
}) {
  await prisma.$executeRaw`
    UPDATE Experience
    SET role = ${input.role}, company = ${input.company}, period = ${input.period},
        description = ${input.description}, sortOrder = ${input.sortOrder}, updatedAt = datetime('now')
    WHERE id = ${id}
  `;
}

export async function deleteExperience(id: string) {
  await prisma.$executeRaw`DELETE FROM Experience WHERE id = ${id}`;
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function listTestimonials() {
  return prisma.$queryRaw<TestimonialRecord[]>`
    SELECT id, author, role, text, rating, sortOrder, CAST(createdAt AS TEXT) AS createdAt
    FROM Testimonial
    ORDER BY sortOrder ASC, createdAt ASC
  `;
}

export async function createTestimonial(input: {
  author: string;
  role: string | null;
  text: string;
  rating: number;
  sortOrder: number;
}) {
  const id = randomUUID();
  await prisma.$executeRaw`
    INSERT INTO Testimonial (id, author, role, text, rating, sortOrder, createdAt)
    VALUES (${id}, ${input.author}, ${input.role}, ${input.text}, ${input.rating},
            ${input.sortOrder}, datetime('now'))
  `;
  return id;
}

export async function updateTestimonial(id: string, input: {
  author: string;
  role: string | null;
  text: string;
  rating: number;
  sortOrder: number;
}) {
  await prisma.$executeRaw`
    UPDATE Testimonial
    SET author = ${input.author}, role = ${input.role}, text = ${input.text},
        rating = ${input.rating}, sortOrder = ${input.sortOrder}
    WHERE id = ${id}
  `;
}

export async function deleteTestimonial(id: string) {
  await prisma.$executeRaw`DELETE FROM Testimonial WHERE id = ${id}`;
}

// ─── Skills (admin CRUD) ──────────────────────────────────────────────────────

export async function createSkill(input: { name: string; group: string | null; sortOrder: number }) {
  const id = randomUUID();
  await prisma.$executeRaw`
    INSERT INTO Skill (id, name, "group", imageUrl, sortOrder, createdAt, updatedAt)
    VALUES (${id}, ${input.name}, ${input.group}, '', ${input.sortOrder}, datetime('now'), datetime('now'))
  `;
  return id;
}

export async function updateSkill(id: string, input: { name: string; group: string | null; sortOrder: number }) {
  await prisma.$executeRaw`
    UPDATE Skill
    SET name = ${input.name}, "group" = ${input.group}, sortOrder = ${input.sortOrder}, updatedAt = datetime('now')
    WHERE id = ${id}
  `;
}

export async function deleteSkill(id: string) {
  await prisma.$executeRaw`DELETE FROM Skill WHERE id = ${id}`;
}
