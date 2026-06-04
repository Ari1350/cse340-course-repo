import { getAllCategories, getCategoryDetails, getProjectsByCategoryId, updateCategoryAssignments, getCategoriesByProjectId } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js'; 


const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';
        res.render('categories', { title, categories });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading categories");
    }
};  

const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryDetails(categoryId);

        if (!category) {
            return res.status(404).render('errors/404', { title: 'Category Not Found' });
        }

        const projects = await getProjectsByCategoryId(categoryId);
        const title = 'Category Details';

        res.render('category', { title, category, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading category details");
    }
};

const showAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const projectDetails = await getProjectDetails(projectId);
        if (!projectDetails) {
            return res.status(404).render('errors/404', { title: 'Project Not Found' });
        }

        const categories = await getAllCategories();
        // Usamos la función existente de tu modelo para traer las asignadas actualmente
        const assignedCategories = await getCategoriesByProjectId(projectId);
        
        // Creamos una lista limpia de IDs numéricos para facilitar la pre-selección en la vista
        const assignedIds = assignedCategories.map(cat => cat.category_id);

        const title = 'Assign Categories to Project';
        res.render('assign-categories', { title, projectId, projectDetails, categories, assignedIds });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading assignment form");
    }
};

// Controller to process the checkboxes selections (POST)
const processAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const selectedCategoryIds = req.body.categoryIds || [];

        const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
        
        await updateCategoryAssignments(projectId, categoryIdsArray);
        
        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error saving category assignments");
    }
};

export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm };
