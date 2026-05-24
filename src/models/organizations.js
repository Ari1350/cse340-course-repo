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

export { getAllOrganizations, getOrganizationDetails };