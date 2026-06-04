import { body, validationResult } from 'express-validator';
import { 
    getAllCategories, 
    getCategoryDetails, 
    getProjectsByCategoryId, 
    updateCategoryAssignments,
    getCategoriesByProjectId,
    createCategory,
    updateCategory
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

// 1. REGLAS DE VALIDACIÓN Y SANITIZACIÓN PARA CATEGORÍAS
const categoryValidation = [
    body('categoryName')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

// 2. Controller to show all categories
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

// 3. Controller to show specific category details
const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryResult = await getCategoryDetails(categoryId);

        if (!categoryResult) {
            return res.status(404).render('errors/404', { title: 'Category Not Found' });
        }

        const category = Array.isArray(categoryResult) ? categoryResult[0] : categoryResult;
        const projects = await getProjectsByCategoryId(categoryId);
        const title = 'Category Details';

        res.render('category', { title, category, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading category details");
    }
};

// 4. Controller to render the new category form (GET)
const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';
    res.render('new-category', { title });
};

// 5. Controller to process new category submission (POST)
const handleCreateCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach(error => req.flash('error', error.msg));
            return res.redirect('/new-category');
        }

        const { categoryName } = req.body;
        await createCategory(categoryName);

        req.flash('success', 'Category created successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating category");
    }
};

// 6. Controller to render the edit category form (GET)
const showEditCategoryForm = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryResult = await getCategoryDetails(categoryId);

        if (!categoryResult) {
            return res.status(404).render('errors/404', { title: 'Category Not Found' });
        }

        const category = Array.isArray(categoryResult) ? categoryResult[0] : categoryResult;
        const title = 'Edit Category';

        res.render('edit-category', { title, category });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading edit category form");
    }
};

// 7. Controller to process category updates (POST)
const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach(error => req.flash('error', error.msg));
            return res.redirect(`/edit-category/${categoryId}`);
        }

        const { categoryName } = req.body;
        await updateCategory(categoryId, categoryName);

        req.flash('success', 'Category updated successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating category");
    }
};

// 8. Controller to show the checkboxes assignment form (GET - ACTIVIDAD COMPLEMENTARIA)
const showAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            return res.status(404).render('errors/404', { title: 'Project Not Found' });
        }

        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);
        const assignedIds = assignedCategories.map(cat => cat.category_id);

        const title = 'Assign Categories to Project';
        res.render('assign-categories', { title, projectId, projectDetails, categories, assignedIds });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading assignment form");
    }
};

// 9. Controller to process the checkboxes selections (POST - ACTIVIDAD COMPLEMENTARIA)
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

// EXPORTACIONES ABSOLUTAS UNIFICADAS
export { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    showNewCategoryForm, 
    handleCreateCategory, 
    showEditCategoryForm, 
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    categoryValidation 
};

