import { getAllProjects } from '../models/projects.js';

const showProjectsPage = async (req, res) => {
    try {
        const projects = await getAllProjects();
        const title = 'Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading projects");
    }
};  

export { showProjectsPage };