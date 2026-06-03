import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
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

export { showProjectsPage, showProjectDetailsPage };
