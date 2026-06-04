import db from './db.js'

const getAllOrganizations = async() => {
    const query = `
        SELECT 
            organization_id, 
            organization_name AS name, 
            organization_description AS description, 
            organization_email AS contact_email,
            logo_filename
        FROM public.organizations;
    `;

    const result = await db.query(query);
    return result.rows;
}

const getOrganizationDetails = async (organizationId) => {
    try {
        const query = `
            SELECT
                organization_id,
                organization_name AS name,
                organization_description AS description,
                organization_email AS contact_email
            FROM public.organizations
            WHERE organization_id = $1;
        `;
        const queryParams = [organizationId];
        const result = await db.query(query, queryParams);

        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("Error in getOrganizationDetails:", error);
        throw error;
    }
};

const createOrganization = async (name, description, contactEmail, logoFilename) => {
    try {
        const query = `
            INSERT INTO public.organizations (organization_name, organization_description, organization_email, logo_filename)
            VALUES ($1, $2, $3, $4)
            RETURNING organization_id;
        `;
        const queryParams = [name, description, contactEmail, logoFilename];
        const result = await db.query(query, queryParams);

        if (result.rows.length === 0) {
            throw new Error('Failed to create organization');
        }

        return result.rows[0].organization_id;
    } catch (error) {
        console.error("Error in createOrganization model:", error);
        throw error;
    }
};

const updateOrganization = async (organizationId, name, description, contactEmail, logoFilename) => {
    try {
        const query = `
            UPDATE public.organizations
            SET organization_name = $1, 
                organization_description = $2, 
                organization_email = $3, 
                logo_filename = $4
            WHERE organization_id = $5
            RETURNING organization_id;
        `;
        const queryParams = [name, description, contactEmail, logoFilename, organizationId];
        const result = await db.query(query, queryParams);

        if (result.rows.length === 0) {
            throw new Error('Organization not found');
        }
        return result.rows[0].organization_id;
    } catch (error) {
        console.error("Error in updateOrganization model:", error);
        throw error;
    }
};

export { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization };