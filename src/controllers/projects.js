import { getAllProjects, getUpcomingProjects, getProjectDetails, createProject, updateProject, isUserVolunteered, addVolunteer, removeVolunteer } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js'; 
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading upcoming projects");
    }
};

// Controller to display a specific project detailed directory (W06 Category Fix Integrated)
const showProjectDetailsPage = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const project = await getProjectDetails(id); 

        if (!project) {
            req.flash('error', 'The requested service project does not exist.');
            return res.redirect('/projects');
        }

        // 1. Verificar el estado de voluntariado del usuario activo
        let isVolunteered = false;
        if (req.session && req.session.user) {
            isVolunteered = await isUserVolunteered(req.session.user.user_id, id);
        }

        // 2. Resolver de forma segura las categorías del proyecto de las semanas anteriores
        let categories = [];
        try {
            categories = await getCategoriesByProjectId(id);
        } catch (catError) {
            console.warn("Could not load categories for this project, falling back to empty array", catError);
        }

        const title = project.title; 
        
        // 3. Pasamos de forma relacional el título, proyecto, voluntariado y categorías juntas
        res.render('project', { title, project, isVolunteered, categories });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server directory rendering error");
    }
};

// Controller to render the new project form (GET)
const showNewProjectForm = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Add New Service Project';
        res.render('new-project', { title, organizations });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading new project form");
    }
};

const processNewProjectForm = async (req, res) => {
    const { title, description, location, date, organizationId } = req.body;
    try {
        const newProjectId = await createProject(title, description, location, date, organizationId);
        
        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

// Controller to show the edit project form with pre-filled data (GET)
const showEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).render('errors/404', { title: 'Project Not Found' });
        }

        // Recuperamos todas las organizaciones para la lista desplegable
        const organizations = await getAllOrganizations();
        const title = 'Edit Service Project';

        res.render('edit-project', { title, project, organizations });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading edit project form");
    }
};

// Controller to process the project update submission (POST)
const processEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { title, description, location, date, organizationId } = req.body;

        await updateProject(projectId, title, description, location, date, organizationId);

        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'There was an error updating the service project.');
        res.redirect(`/edit-project/${req.params.id}`);
    }
};

// Action to handle adding a user as a volunteer (POST - W06)
const handleAddVolunteer = async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        const userId = req.session.user.user_id;

        await addVolunteer(userId, projectId);
        req.flash('success', 'Thank you! You have successfully volunteered for this project.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error handling add volunteer:', error);
        res.status(500).send("Internal server registration error");
    }
};

// Action to handle removing a user from a volunteer project (POST - W06)
const handleRemoveVolunteer = async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        const userId = req.session.user.user_id;

        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have successfully withdrawn from this service project.');
        
        // Redirigir dinámicamente según el flujo de origen
        if (req.query.source === 'dashboard') {
            return res.redirect('/dashboard');
        }
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error handling remove volunteer:', error);
        res.status(500).send("Internal server withdrawal error");
    }
};

export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, showEditProjectForm, processEditProjectForm, handleAddVolunteer, handleRemoveVolunteer };
