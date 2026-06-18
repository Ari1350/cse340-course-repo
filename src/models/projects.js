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

// Creates a new project in the database (W04)
const createProject = async (title, description, location, date, organizationId) => {
    try {
        const query = `
            INSERT INTO public.projects (title, description, location, date, organization_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING project_id;
        `;
        const queryParams = [title, description, location, date, organizationId];
        const result = await db.query(query, queryParams);

        if (result.rows.length === 0) {
            throw new Error('Failed to create project');
        }
        return result.rows[0].project_id;
    } catch (error) {
        console.error('Error in createProject model:', error);
        throw error;
    }
};

// Updates an existing project in the database (W04 Team Activity)
const updateProject = async (projectId, title, description, location, date, organizationId) => {
    try {
        const query = `
            UPDATE public.projects
            SET title = $1, 
                description = $2, 
                location = $3, 
                date = $4, 
                organization_id = $5
            WHERE project_id = $6
            RETURNING project_id;
        `;
        const queryParams = [title, description, location, date, organizationId, projectId];
        const result = await db.query(query, queryParams);

        if (result.rows.length === 0) {
            throw new Error('Project not found or failed to update');
        }
        return result.rows[0].project_id;
    } catch (error) {
        console.error("Error in updateProject model:", error);
        throw error;
    }
};

// Check if a specific user is already volunteered for a project (W06)
const isUserVolunteered = async (userId, projectId) => {
    try {
        const query = 'SELECT 1 FROM public.project_volunteers WHERE user_id = $1 AND project_id = $2;';
        const result = await db.query(query, [userId, projectId]);
        return result.rows.length > 0;
    } catch (error) {
        console.error('Error in isUserVolunteered model:', error);
        throw error;
    }
};

// Add a user registration to a service project (W06)
const addVolunteer = async (userId, projectId) => {
    try {
        const query = 'INSERT INTO public.project_volunteers (user_id, project_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;';
        return await db.query(query, [userId, projectId]);
    } catch (error) {
        console.error('Error in addVolunteer model:', error);
        throw error;
    }
};

// Remove a user registration from a service project (W06)
const removeVolunteer = async (userId, projectId) => {
    try {
        const query = 'DELETE FROM public.project_volunteers WHERE user_id = $1 AND project_id = $2;';
        return await db.query(query, [userId, projectId]);
    } catch (error) {
        console.error('Error in removeVolunteer model:', error);
        throw error;
    }
};

// Retrieve all projects a specific user has volunteered for 
const getProjectsByUserVolunteer = async (userId) => {
    try {
        const query = `
            SELECT p.project_id, p.title, p.description 
            FROM public.projects p
            JOIN public.project_volunteers pv ON p.project_id = pv.project_id
            WHERE pv.user_id = $1
            ORDER BY p.title ASC;
        `;
        const result = await db.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error('Error in getProjectsByUserVolunteer model:', error);
        throw error;
    }
};

export { 
    getAllProjects, 
    getUpcomingProjects,
    getProjectDetails, 
    getProjectsByOrganizationId,
    createProject, 
    updateProject,
    isUserVolunteered,
    addVolunteer,
    removeVolunteer,
    getProjectsByUserVolunteer
};
