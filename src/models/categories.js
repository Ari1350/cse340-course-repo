import pool from './db.js';

export const getAllCategories = async () => {
    try {
        const sql = `
            SELECT category_id, category_name 
            FROM public.categories 
            ORDER BY category_name ASC
        `;
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllCategories model:", error);
        throw error;
    }
};
