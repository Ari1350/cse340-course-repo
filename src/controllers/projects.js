import { getUpcomingProjects, getProjectDetails, createProject, updateProject } from '../models/projects.js';
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

const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).render('errors/404', { title: 'Page Not Found' });
        }

        const categories = await getCategoriesByProjectId(projectId);
        const title = 'Project Details';

        res.render('project', { title, project, categories }); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading project details");
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


export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, showEditProjectForm, processEditProjectForm };
