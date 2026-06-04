import { body, validationResult } from 'express-validator';
import { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization } from '../models/organizations.js';

// 1. Definición de reglas de validación y sanitización (W04)
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

// 2. Controlador para mostrar todas las organizaciones
const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading organizations");
    }
};

// 3. Controlador para mostrar el perfil individual
const showOrganizationDetailsPage = async (req, res) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);
        
        if (!organizationDetails) {
            return res.status(404).render('errors/404', { title: 'Page Not Found' });
        }

        const title = 'Organization Details';
        res.render('organization', { title, organizationDetails, projects: [] });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading organization details");
    }
};

// 4. Controlador para mostrar el formulario vacío
const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';
    res.render('new-organization', { title });
};

// 5. Controlador para PROCESAR el formulario con validaciones (POST)
const handleCreateOrganization = async (req, res) => {
    try {
        // Verificar si express-validator detectó errores en el formulario
        const results = validationResult(req);
        if (!results.isEmpty()) {
            // Recorremos los errores y los guardamos en mensajes flash de tipo 'error'
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            // Si hay errores, detenemos el flujo y lo regresamos al formulario
            return res.redirect('/new-organization');
        }

        // Si los datos son válidos, procedemos a guardar
        const { name, description, contactEmail } = req.body;
        const logoFilename = 'placeholder-logo.png';

        await createOrganization(name, description, contactEmail, logoFilename);
        req.flash('success', 'Organization added successfully!');
        
        res.redirect('/organizations');
    } catch (error) {
        console.error("Error processing new organization form:", error);
        res.status(500).send("An error occurred while creating the organization");
    }
};

// Controller to show the edit form with pre-filled data (GET)
const showEditOrganizationForm = async (req, res) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);

        if (!organizationDetails) {
            return res.status(404).render('errors/404', { title: 'Organization Not Found' });
        }

        const title = 'Edit Organization';
        res.render('edit-organization', { title, organizationDetails });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading edit form");
    }
};

// Controller to process the edit form updates (POST)
const processEditOrganizationForm = async (req, res) => {
    try {
        const organizationId = req.params.id;
        const { name, description, contactEmail, logoFilename } = req.body;

        await updateOrganization(organizationId, name, description, contactEmail, logoFilename);

        req.flash('success', 'Organization updated successfully!');
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating organization");
    }
};

// EXPORTACIÓN COMPLETA UNIFICADA
export { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm, 
    handleCreateOrganization, 
    organizationValidation,
    showEditOrganizationForm,   
    processEditOrganizationForm
};
