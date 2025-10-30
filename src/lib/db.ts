
'use server'

import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { subMonths, startOfToday } from 'date-fns';

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

    CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        avatar TEXT,
        status TEXT CHECK(status IN ('active', 'archived', 'new')) NOT NULL DEFAULT 'new',
        company TEXT,
        phone TEXT,
        address TEXT,
        notes TEXT
    );

    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT CHECK(status IN ('todo', 'in-progress', 'done')) NOT NULL DEFAULT 'todo',
        priority TEXT CHECK(priority IN ('low', 'medium', 'high')) NOT NULL DEFAULT 'medium',
        dueDate TEXT,
        clientId INTEGER,
        tags TEXT,
        FOREIGN KEY (clientId) REFERENCES clients (id) ON DELETE SET NULL
    );
    
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT CHECK(status IN ('planning', 'in-progress', 'completed')) NOT NULL DEFAULT 'planning',
      clientId INTEGER,
      budget REAL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      FOREIGN KEY (clientId) REFERENCES clients (id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS portfolio_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    );
`);

// Seed initial categories if table is empty
const categoryCount = db.prepare('SELECT COUNT(*) as count FROM portfolio_categories').get() as { count: number };
if (categoryCount.count === 0) {
    const insert = db.prepare('INSERT INTO portfolio_categories (name) VALUES (?)');
    const insertMany = db.transaction((categories) => {
        for (const category of categories) insert.run(category);
    });
    insertMany(['Web', 'Mobile', 'Design']);
}


// --- Portfolio Categories ---
export async function getPortfolioCategories() {
    try {
        const stmt = db.prepare('SELECT * FROM portfolio_categories ORDER BY name');
        return stmt.all() as { id: number; name: string }[];
    } catch (error) {
        console.error("Failed to get portfolio categories:", error);
        return [];
    }
}

export async function addPortfolioCategory(name: string) {
    try {
        const stmt = db.prepare('INSERT INTO portfolio_categories (name) VALUES (?)');
        const result = stmt.run(name);
        return { success: true, id: result.lastInsertRowid };
    } catch (error) {
        console.error('Failed to add portfolio category:', error);
        return { success: false, error: 'Category already exists or another database error occurred.' };
    }
}

export async function deletePortfolioCategory(id: number) {
    try {
        const stmt = db.prepare('DELETE FROM portfolio_categories WHERE id = ?');
        stmt.run(id);
        return { success: true };
    } catch (error) {
        console.error(`Failed to delete portfolio category ${id}:`, error);
        return { success: false, error: 'Database operation failed' };
    }
}


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
        const errorMessage = (error as Error).message;
        if (errorMessage.includes('UNIQUE constraint failed: portfolio_items.slug')) {
            return { success: false, error: 'This slug is already in use. Please choose a unique one.' };
        }
        return { success: false, error: 'Database operation failed' };
    }
}

export async function updatePortfolioItem(id: number, values: any) {
    try {
        const stmtSelect = db.prepare('SELECT image, screenshots FROM portfolio_items WHERE id = ?');
        const currentData = stmtSelect.get(id) as any;
        
        let imageUrl = currentData?.image;
        if (values.imageFile && values.imageFile.size > 0) {
            const imageResult = await uploadFile(values.imageFile as File);
            if (imageResult.error) throw new Error('Main image upload failed.');
            imageUrl = imageResult.path;
        }

        let existingScreenshots = currentData?.screenshots ? JSON.parse(currentData.screenshots) : [];
        if (values.removedScreenshots && values.removedScreenshots.length > 0) {
            existingScreenshots = existingScreenshots.filter((s: string) => !values.removedScreenshots.includes(s));
        }

        if (values.screenshotFiles && (values.screenshotFiles as FileList).length > 0) {
            const newScreenshotUrls = await Promise.all(
                Array.from(values.screenshotFiles as FileList).map(async (file) => {
                    const result = await uploadFile(file);
                    if (result.error) throw new Error('Screenshot upload failed.');
                    return result.path;
                })
            );
            existingScreenshots = [...existingScreenshots, ...newScreenshotUrls];
        }
        
        const tagsJson = JSON.stringify(values.tags.split(',').map((t: string) => t.trim()));
        const screenshotsJson = JSON.stringify(existingScreenshots);

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
        const errorMessage = (error as Error).message;
        if (errorMessage.includes('UNIQUE constraint failed: portfolio_items.slug')) {
            return { success: false, error: 'This slug is already in use. Please choose a unique one.' };
        }
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

// --- Clients ---
export async function getClients() {
    try {
        const stmt = db.prepare('SELECT * FROM clients ORDER BY name');
        return stmt.all();
    } catch (e) {
        console.error("Failed to get clients", e);
        return [];
    }
}

export async function addClient(formData: FormData) {
    const client = Object.fromEntries(formData.entries());
    try {
        const stmt = db.prepare('INSERT INTO clients (name, email, avatar, status, company, phone, address, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        const info = stmt.run(client.name, client.email, `https://picsum.photos/seed/${client.name}/100/100`, client.status, client.company, client.phone, client.address, client.notes);
        return { success: true, id: info.lastInsertRowid };
    } catch (e) {
        console.error("Failed to add client", e);
        return { success: false, error: 'Database operation failed.' };
    }
}

export async function updateClient(id: string, formData: FormData) {
    const client = Object.fromEntries(formData.entries());
    try {
        const stmt = db.prepare('UPDATE clients SET name = ?, email = ?, status = ?, company = ?, phone = ?, address = ?, notes = ? WHERE id = ?');
        stmt.run(client.name, client.email, client.status, client.company, client.phone, client.address, client.notes, id);
        return { success: true };
    } catch (e) {
        console.error("Failed to update client", e);
        return { success: false, error: 'Database operation failed.' };
    }
}

export async function deleteClient(id: string) {
    try {
        const stmt = db.prepare('DELETE FROM clients WHERE id = ?');
        stmt.run(id);
        return { success: true };
    } catch (e) {
        console.error("Failed to delete client", e);
        return { success: false, error: 'Database operation failed.' };
    }
}

// --- Tasks ---
export async function getTasks() {
    try {
        const stmt = db.prepare('SELECT * FROM tasks');
        const tasks = stmt.all() as any[];
        return tasks.map(task => ({
            ...task,
            tags: task.tags ? JSON.parse(task.tags) : [],
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }));
    } catch (e) {
        console.error("Failed to get tasks", e);
        return [];
    }
}

export async function addTask(formData: FormData) {
    const task = Object.fromEntries(formData.entries());
    try {
        const tags = task.tags ? JSON.stringify((task.tags as string).split(',').map((t: string) => t.trim())) : '[]';
        const stmt = db.prepare('INSERT INTO tasks (title, description, status, priority, dueDate, clientId, tags) VALUES (?, ?, ?, ?, ?, ?, ?)');
        const info = stmt.run(task.title, task.description, 'todo', task.priority, task.dueDate || null, task.clientId || null, tags);
        return { success: true, id: info.lastInsertRowid };
    } catch (e) {
        console.error("Failed to add task", e);
        return { success: false, error: 'Database operation failed.' };
    }
}

export async function updateTask(id: string, formData: FormData | { [key: string]: any }) {
    const values = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;
    try {
        const fieldsToUpdate: {[key: string]: any} = { ...values };
        if (fieldsToUpdate.tags && typeof fieldsToUpdate.tags === 'string') {
            fieldsToUpdate.tags = JSON.stringify(fieldsToUpdate.tags.split(',').map((t: string) => t.trim()));
        }

        const columns = Object.keys(fieldsToUpdate).filter(k => fieldsToUpdate[k] !== undefined);
        const setClause = columns.map(col => `${col} = ?`).join(', ');
        
        if (columns.length === 0) return { success: true };

        const dbValues = columns.map(col => fieldsToUpdate[col]);

        const stmt = db.prepare(`UPDATE tasks SET ${setClause} WHERE id = ?`);
        stmt.run(...dbValues, id);
        
        return { success: true };
    } catch (e) {
        console.error("Failed to update task", e);
        return { success: false, error: 'Database operation failed.' };
    }
}


export async function deleteTask(id: string) {
    try {
        const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
        stmt.run(id);
        return { success: true };
    } catch (e) {
        console.error("Failed to delete task", e);
        return { success: false, error: 'Database operation failed.' };
    }
}


// Dashboard and Reports

export async function getDashboardData() {
    try {
        const today = startOfToday().toISOString();
        const oneMonthAgo = subMonths(startOfToday(), 1).toISOString();

        const activeProjectsCount = db.prepare(`SELECT COUNT(*) as count FROM projects WHERE status != 'completed'`).get() as { count: number };
        const pendingTasksCount = db.prepare(`SELECT COUNT(*) as count FROM tasks WHERE status != 'done'`).get() as { count: number };
        const newClientsCount = db.prepare(`SELECT COUNT(*) as count FROM clients WHERE status = 'new'`).get() as { count: number };
        const overdueTasksCount = db.prepare(`SELECT COUNT(*) as count FROM tasks WHERE dueDate < ? AND status != 'done'`).get(today) as { count: number };

        const upcomingDeadlines = db.prepare(`
            SELECT t.id, t.title, t.dueDate, p.title as projectTitle
            FROM tasks t
            LEFT JOIN projects p ON t.clientId = p.clientId 
            WHERE t.dueDate >= ? AND t.status != 'done' 
            ORDER BY t.dueDate ASC LIMIT 5
        `).all(today);

        const activeProjects = db.prepare(`
            SELECT p.id, p.title, p.startDate, p.endDate, c.name as clientName, c.company as clientCompany, c.avatar as clientAvatar
            FROM projects p 
            LEFT JOIN clients c ON p.clientId = c.id
            WHERE p.status = 'in-progress' 
            ORDER BY p.endDate ASC LIMIT 5
        `).all().map((p: any) => ({
             ...p, 
             client: { name: p.clientName, company: p.clientCompany, avatar: p.clientAvatar }
        }));
        
        const recentClients = db.prepare(`SELECT * FROM clients ORDER BY id DESC LIMIT 5`).all();

        return {
            activeProjectsCount: activeProjectsCount?.count || 0,
            pendingTasksCount: pendingTasksCount?.count || 0,
            newClientsCount: newClientsCount?.count || 0,
            overdueTasksCount: overdueTasksCount?.count || 0,
            upcomingDeadlines,
            activeProjects,
            recentClients,
        };
    } catch (error) {
        console.error("Failed to get dashboard data:", error);
        return {
            activeProjectsCount: 0,
            pendingTasksCount: 0,
            newClientsCount: 0,
            overdueTasksCount: 0,
            upcomingDeadlines: [],
            activeProjects: [],
            recentClients: [],
        };
    }
}


export async function getReportsData() {
    try {
        const totalBilled = db.prepare(`SELECT SUM(budget) as total FROM projects WHERE status = 'completed'`).get() as { total: number };
        const completedProjectsCount = db.prepare(`SELECT COUNT(*) as count FROM projects WHERE status = 'completed'`).get() as { count: number };
        const totalClientsCount = db.prepare(`SELECT COUNT(*) as count FROM clients`).get() as { count: number };
        const activeProjectsCount = db.prepare(`SELECT COUNT(*) as count FROM projects WHERE status = 'in-progress'`).get() as { count: number };

        const sixMonthsAgo = subMonths(new Date(), 5);
        const incomeDataRaw = db.prepare(`
            SELECT strftime('%Y-%m', endDate) as month, SUM(budget) as income
            FROM projects
            WHERE status = 'completed' AND endDate >= ?
            GROUP BY month
            ORDER BY month ASC
        `).all(sixMonthsAgo.toISOString().slice(0, 7) + '-01');

        // Ensure all last 6 months are present
        const incomeData = [];
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const monthStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            const monthName = date.toLocaleString('default', { month: 'short' });
            const existingData = incomeDataRaw.find((d: any) => d.month === monthStr);
            incomeData.push({ name: monthName, income: existingData ? existingData.income : 0 });
        }
        
        const workloadData = [
            { name: 'Web', value: db.prepare(`SELECT count(*) as count FROM portfolio_items WHERE category = 'web'`).get<{count: number}>()?.count || 0, fill: 'var(--chart-1)' },
            { name: 'Mobile', value: db.prepare(`SELECT count(*) as count FROM portfolio_items WHERE category = 'mobile'`).get<{count: number}>()?.count || 0, fill: 'var(--chart-2)' },
            { name: 'Design', value: db.prepare(`SELECT count(*) as count FROM portfolio_items WHERE category = 'design'`).get<{count: number}>()?.count || 0, fill: 'var(--chart-3)' },
        ];
        
        const clientLeaderboard = db.prepare(`
            SELECT c.id, c.name, c.company, SUM(p.budget) as totalValue
            FROM clients c
            JOIN projects p ON c.id = p.clientId
            WHERE p.status = 'completed'
            GROUP BY c.id
            ORDER BY totalValue DESC
            LIMIT 5
        `).all();

        return {
            totalBilled: totalBilled.total || 0,
            completedProjectsCount: completedProjectsCount.count,
            totalClientsCount: totalClientsCount.count,
            activeProjectsCount: activeProjectsCount.count,
            incomeData,
            workloadData,
            clientLeaderboard,
        };
    } catch (error) {
        console.error("Failed to get reports data:", error);
        return {
            totalBilled: 0,
            completedProjectsCount: 0,
            totalClientsCount: 0,
            activeProjectsCount: 0,
            incomeData: [],
            workloadData: [],
            clientLeaderboard: [],
        };
    }
}

    