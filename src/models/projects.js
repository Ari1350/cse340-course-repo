import pool from './db.js';

export const getAllProjects = async () => {
    try {
        const sql = `
            SELECT p.project_id, p.title, p.description, p.location, p.date, o.organization_name 
            FROM public.projects p
            JOIN public.organizations o ON p.organization_id = o.organization_id
            ORDER BY p.date ASC
        `;
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllProjects model:", error);
        throw error;
    }
};
