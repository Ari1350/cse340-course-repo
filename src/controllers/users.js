import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsersWithRoles } from '../models/users.js';
import { getProjectsByUserVolunteer } from '../models/projects.js';


// 1. Middleware de Seguridad: Protege rutas contra usuarios no autenticados 
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next(); // Permite continuar si el usuario sí inició sesión
};

// 2. Render user registration form (GET)
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

// 3. Process user registration form (POST)
const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Email might be already taken.');
        res.redirect('/register');
    }
};

// 4. Render login form (GET)
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

// 5. Process login form submission 
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authenticateUser(email, password);
        if (user) {
            req.session.user = user;
            req.flash('success', 'Login successful!');

            if (process.env.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            
            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

// 6. Process logout request (GET)
const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }
    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

// Display secure user dashboard with volunteer listings (GET - W06)
const showDashboard = async (req, res) => {
    try {
        const userId = req.session.user.user_id;
        const volunteeredProjects = await getProjectsByUserVolunteer(userId);
        
        const title = 'My Dashboard';
        res.render('dashboard', { 
            title, 
            user: req.session.user,
            volunteeredProjects 
        });
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        res.status(500).send("Secure directory loading error");
    }
};


// Middleware factory to require a specific role for route access (W05 Team Activity)
const requireRole = (role) => {
    return (req, res, next) => {
        // 1. Validar que haya iniciado sesión primero
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // 2. Validar si el rol de la sesión coincide con el requerido
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // Si cumple con los requisitos, se le permite continuar en la tubería
        next();
    };
};

// Controller to render the users management page for admins (GET - W05 Project)
const showUsersPage = async (req, res) => {
    try {
        const users = await getAllUsersWithRoles();
        const title = 'User Management';
        res.render('users', { title, users });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading user management directory");
    }
};

export { 
    showUserRegistrationForm, 
    processUserRegistrationForm, 
    showLoginForm, 
    processLoginForm, 
    processLogout,
    requireLogin,   
    showDashboard,
    requireRole,
    showUsersPage
    
};
