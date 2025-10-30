'use server'

import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const db = new Database('local.db');

// Create tables if they don't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS portfolio_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        fullDescription TEXT NOT NULL,
        image TEXT,
        hint TEXT,
        tags TEXT,
        category TEXT NOT NULL,
        link TEXT,
        screenshots TEXT
    );

    CREATE TABLE IF NOT EXISTS page_content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        company TEXT NOT NULL,
        feedback TEXT NOT NULL,
        avatar TEXT
    );
`);

// --- Generic Page Content ---
export async function getPageContent(section: string) {
    try {
        const stmt = db.prepare('SELECT content FROM page_content WHERE section = ?');
        const result = stmt.get(section) as { content: string };
        return result ? JSON.parse(result.content) : null;
    } catch (error) {
        console.error(`Failed to get page content for section "${section}":`, error);
        return null;
    }
}

export async function updatePageContent(section: string, content: any) {
    try {
        const contentJson = JSON.stringify(content);
        const stmt = db.prepare(`
            INSERT INTO page_content (section, content) VALUES (?, ?)
            ON CONFLICT(section) DO UPDATE SET content = excluded.content
        `);
        stmt.run(section, contentJson);
        return { success: true };
    } catch (error) {
        console.error(`Failed to update page content for section "${section}":`, error);
        return { success: false, error: 'Database operation failed' };
    }
}

// --- Testimonials ---
export async function getTestimonials() {
    try {
        const stmt = db.prepare('SELECT * FROM testimonials');
        return stmt.all();
    } catch (error) {
        console.error("Failed to get testimonials:", error);
        return [];
    }
}

export async function updateTestimonial(id: number, data: any) {
    try {
        const stmt = db.prepare('UPDATE testimonials SET name = ?, company = ?, feedback = ? WHERE id = ?');
        stmt.run(data.name, data.company, data.feedback, id);
        return { success: true };
    } catch (error) {
        console.error(`Failed to update testimonial ${id}:`, error);
        return { success: false, error: 'Database operation failed' };
    }
}

export async function addTestimonial(data: any) {
     try {
        const stmt = db.prepare('INSERT INTO testimonials (name, company, feedback, avatar) VALUES (?, ?, ?, ?)');
        const result = stmt.run(data.name, data.company, data.feedback, data.avatar);
        return { success: true, id: result.lastInsertRowid };
    } catch (error) {
        console.error('Failed to add testimonial:', error);
        return { success: false, error: 'Database operation failed' };
    }
}

export async function removeTestimonial(id: number) {
    try {
        const stmt = db.prepare('DELETE FROM testimonials WHERE id = ?');
        stmt.run(id);
        return { success: true };
    } catch (error) {
        console.error(`Failed to remove testimonial ${id}:`, error);
        return { success: false, error: 'Database operation failed' };
    }
}


// --- File Upload ---
export async function uploadFile(file: File) {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const filepath = path.join(uploadDir, filename);
    const publicPath = `/uploads/${filename}`;

    try {
        fs.writeFileSync(filepath, fileBuffer);
        return { path: publicPath };
    } catch (error) {
        console.error("File upload failed:", error);
        return { error: 'File upload failed' };
    }
}

// --- Portfolio Items ---
export async function getPortfolioItems() {
    try {
        const stmt = db.prepare('SELECT * FROM portfolio_items');
        const items = stmt.all() as any[];
        // Parse JSON strings back into arrays
        return items.map(item => ({
            ...item,
            tags: item.tags ? JSON.parse(item.tags) : [],
            screenshots: item.screenshots ? JSON.parse(item.screenshots) : [],
        }));
    } catch (error) {
        console.error("Failed to get portfolio items:", error);
        return [];
    }
}

export async function getPortfolioItemBySlug(slug: string) {
    try {
        const stmt = db.prepare('SELECT * FROM portfolio_items WHERE slug = ?');
        const item = stmt.get(slug) as any;
        if (item) {
            return {
                ...item,
                tags: item.tags ? JSON.parse(item.tags) : [],
                screenshots: item.screenshots ? JSON.parse(item.screenshots) : [],
            };
        }
        return null;
    } catch (error) {
        console.error(`Failed to get portfolio item with slug ${slug}:`, error);
        return null;
    }
}

export async function addPortfolioItem(values: any) {
    try {
        const imageFile = values.imageFile as File;
        const screenshotFiles = values.screenshotFiles ? Array.from(values.screenshotFiles as FileList) : [];

        // Upload main image
        const imageResult = await uploadFile(imageFile);
        if (imageResult.error) throw new Error('Main image upload failed.');
        const imageUrl = imageResult.path;

        // Upload screenshots
        const screenshotUrls = await Promise.all(
            screenshotFiles.map(async (file) => {
                const result = await uploadFile(file);
                if (result.error) throw new Error('Screenshot upload failed.');
                return result.path;
            })
        );
        
        const tagsJson = JSON.stringify(values.tags.split(',').map((t:string) => t.trim()));
        const screenshotsJson = JSON.stringify(screenshotUrls);

        const stmt = db.prepare(`
            INSERT INTO portfolio_items (title, slug, description, fullDescription, image, link, category, tags, screenshots, hint)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
            values.title,
            values.slug,
            values.description,
            values.fullDescription,
            imageUrl,
            values.link,
            values.category,
            tagsJson,
            screenshotsJson,
            '' // hint is not in the form
        );

        return { success: true, id: result.lastInsertRowid };
    } catch (error) {
        console.error('Failed to add portfolio item:', error);
        return { success: false, error: 'Database operation failed' };
    }
}

export async function updatePortfolioItem(id: number, values: any) {
    try {
        const stmtSelect = db.prepare('SELECT image, screenshots FROM portfolio_items WHERE id = ?');
        const currentData = stmtSelect.get(id) as any;
        
        let imageUrl = currentData?.image;
        if (values.imageFile) {
            const imageResult = await uploadFile(values.imageFile as File);
            if (imageResult.error) throw new Error('Main image upload failed.');
            imageUrl = imageResult.path;
        }

        let screenshotUrls = currentData?.screenshots ? JSON.parse(currentData.screenshots) : [];
        if (values.screenshotFiles && (values.screenshotFiles as FileList).length > 0) {
            const newScreenshotUrls = await Promise.all(
                Array.from(values.screenshotFiles as FileList).map(async (file) => {
                    const result = await uploadFile(file);
                    if (result.error) throw new Error('Screenshot upload failed.');
                    return result.path;
                })
            );
            screenshotUrls = [...screenshotUrls, ...newScreenshotUrls];
        }
        
        const tagsJson = JSON.stringify(values.tags.split(',').map((t: string) => t.trim()));
        const screenshotsJson = JSON.stringify(screenshotUrls);

        const stmt = db.prepare(`
            UPDATE portfolio_items
            SET title = ?, slug = ?, description = ?, fullDescription = ?, image = ?, link = ?, category = ?, tags = ?, screenshots = ?
            WHERE id = ?
        `);
        stmt.run(
            values.title,
            values.slug,
            values.description,
            values.fullDescription,
            imageUrl,
            values.link,
            values.category,
            tagsJson,
            screenshotsJson,
            id
        );
        return { success: true };
    } catch (error) {
        console.error(`Failed to update portfolio item ${id}:`, error);
        return { success: false, error: 'Database operation failed' };
    }
}

export async function deletePortfolioItem(id: number) {
    try {
        const stmt = db.prepare('DELETE FROM portfolio_items WHERE id = ?');
        stmt.run(id);
        return { success: true };
    } catch (error) {
        console.error(`Failed to delete portfolio item ${id}:`, error);
        return { success: false, error: 'Database operation failed' };
    }
}
