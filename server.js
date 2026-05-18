import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';


const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));


app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();    
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
});

app.get('/projects', async (req, res) => {
    try {
        const projectsData = await getAllProjects();
        res.render('projects', { 
            title: 'Service Projects', 
            projects: projectsData 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading projects");
    }
});

app.get('/categories', async (req, res) => {
    try {
        const categoriesData = await getAllCategories();
        res.render('categories', { 
            title: 'Service Project Categories', 
            categories: categoriesData 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading categories");
    }
});

app.listen(PORT, async() => {
 try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); 
  }
});

