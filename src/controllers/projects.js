import { getUpcomingProjects, getProjectDetails, createProject } from '../models/projects.js';
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


export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm };
