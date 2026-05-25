import db from './db.js';

const getAllProjects = async () => {
    try {
        const sql = `
            SELECT p.project_id, p.title, p.description, p.location, p.date, o.organization_name 
            FROM public.projects p
            JOIN public.organizations o ON p.organization_id = o.organization_id
            ORDER BY p.date ASC
        `;
        const result = await db.query(sql);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllProjects model:", error);
        throw error;
    }
};

const getUpcomingProjects = async (numberOfProjects) => {
    try {
        const sql = `
            SELECT 
                p.project_id, 
                p.title, 
                p.description, 
                p.date, 
                p.location, 
                p.organization_id, 
                o.organization_name
            FROM public.projects p
            JOIN public.organizations o ON p.organization_id = o.organization_id
            WHERE p.date >= CURRENT_DATE
            ORDER BY p.date ASC
            LIMIT $1;
        `;
        const result = await db.query(sql, [numberOfProjects]);
        return result.rows;
    } catch (error) {
        console.error("Error in getUpcomingProjects model:", error);
        throw error;
    }
};

const getProjectDetails = async (id) => {
    try {
        const sql = `
            SELECT 
                p.project_id, 
                p.title, 
                p.description, 
                p.date, 
                p.location, 
                p.organization_id, 
                o.organization_name
            FROM public.projects p
            JOIN public.organizations o ON p.organization_id = o.organization_id
            WHERE p.project_id = $1;
        `;
        const result = await db.query(sql, [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error in getProjectDetails model:", error);
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
        const result = await db.query(query, [organizationId]);
        return result.rows;
    } catch (error) {
        console.error("Error in getProjectsByOrganizationId:", error);
        throw error;
    }
};


export { getAllProjects, getUpcomingProjects, getProjectDetails, getProjectsByOrganizationId };
