import { eq, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, projects, galleryImages, projectVideos, InsertProject, InsertGalleryImage, InsertProjectVideo } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Project helpers ─────────────────────────────────────────────────────────

export async function getAllProjects() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).orderBy(asc(projects.name));
}

export async function getProjectBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return result[0] ?? undefined;
}

export async function upsertProject(data: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(projects).values(data).onDuplicateKeyUpdate({
    set: { name: data.name, heroImageUrl: data.heroImageUrl, heroImageKey: data.heroImageKey },
  });
  const result = await db.select().from(projects).where(eq(projects.slug, data.slug)).limit(1);
  return result[0];
}

export async function updateProjectHero(slug: string, heroImageUrl: string, heroImageKey: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(projects).set({ heroImageUrl, heroImageKey }).where(eq(projects.slug, slug));
}

// ─── Gallery image helpers ───────────────────────────────────────────────────

export async function getGalleryImages(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(galleryImages).where(eq(galleryImages.projectId, projectId)).orderBy(asc(galleryImages.sortOrder));
}

export async function addGalleryImage(data: InsertGalleryImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(galleryImages).values(data);
}

export async function deleteGalleryImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(galleryImages).where(eq(galleryImages.id, id));
}

export async function reorderGalleryImages(updates: { id: number; sortOrder: number }[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (const u of updates) {
    await db.update(galleryImages).set({ sortOrder: u.sortOrder }).where(eq(galleryImages.id, u.id));
  }
}

// ─── Video helpers ────────────────────────────────────────────────────────────

export async function getProjectVideos(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projectVideos).where(eq(projectVideos.projectId, projectId)).orderBy(asc(projectVideos.sortOrder));
}

export async function addProjectVideo(data: InsertProjectVideo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(projectVideos).values(data);
}

export async function updateProjectVideo(id: number, label: string, embedUrl: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(projectVideos).set({ label, embedUrl }).where(eq(projectVideos.id, id));
}

export async function deleteProjectVideo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(projectVideos).where(eq(projectVideos.id, id));
}
