import pool from './db.js';

const getAllProjects = async () => {
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

const getProjectsByOrganizationId = async (organizationId) => {
    try {
        const query = `
            SELECT
                project_id,
                organization_id,
                title,
                description,
                location,
                date
            FROM public.projects
            WHERE organization_id = $1
            ORDER BY date;
        `;
        const queryParams = [organizationId];
        const result = await db.query(query, queryParams);

        return result.rows;
    } catch (error) {
        console.error("Error in getProjectsByOrganizationId:", error);
        throw error;
    }
};

export { getAllProjects, getProjectsByOrganizationId };

