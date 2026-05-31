import db from './db.js';

const getAllCategories = async () => {
    try {
        const sql = `
            SELECT category_id, category_name 
            FROM public.categories 
            ORDER BY category_name ASC
        `;
        const result = await db.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllCategories model:", error);
        throw error;
    }
};

const getCategoryDetails = async (id) => {
    try {
        const sql = `
            SELECT category_id, category_name 
            FROM public.categories 
            WHERE category_id = $1;
        `;
        const result = await db.query(sql, [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error in getCategoryDetails model:", error);
        throw error;
    }
};

const getCategoriesByProjectId = async (projectId) => {
    try {
        const sql = `
            SELECT c.category_id, c.category_name 
            FROM public.categories c
            JOIN public.project_categories pc ON c.category_id = pc.category_id
            WHERE pc.project_id = $1
            ORDER BY c.category_name ASC;
        `;
        const result = await db.query(sql, [projectId]);
        return result.rows;
    } catch (error) {
        console.error("Error in getCategoriesByProjectId model:", error);
        throw error;
    }
};

const getProjectsByCategoryId = async (categoryId) => {
    try {
        const sql = `
            SELECT p.project_id, p.title, p.description, p.date, p.location
            FROM public.projects p
            JOIN public.project_categories pc ON p.project_id = pc.project_id
            WHERE pc.category_id = $1
            ORDER BY p.date ASC;
        `;
        const result = await db.query(sql, [categoryId]);
        return result.rows;
    } catch (error) {
        console.error("Error in getProjectsByCategoryId model:", error);
        throw error;
    }
};

export { getAllCategories, getCategoryDetails, getCategoriesByProjectId, getProjectsByCategoryId };
