import { getAllCategories, getCategoryDetails, getProjectsByCategoryId } from '../models/categories.js';

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

export { showCategoriesPage, showCategoryDetailsPage };
