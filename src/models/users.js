import db from './db.js';
import bcrypt from 'bcrypt';

// 1. Crear un nuevo usuario 
const createUser = async (name, email, passwordHash) => {
    try {
        const defaultRole = 'user';
        const query = `
            INSERT INTO public.users (name, email, password_hash, role_id) 
            VALUES ($1, $2, $3, (SELECT role_id FROM public.roles WHERE role_name = $4)) 
            RETURNING user_id;
        `;
        const queryParams = [name, email, passwordHash, defaultRole];
        const result = await db.query(query, queryParams);

        if (result.rows.length === 0) {
            throw new Error('Failed to create user');
        }

        return result.rows.user_id;
    } catch (error) {
        console.error('Error in createUser model:', error);
        throw error;
    }
};

// 2. Buscar usuario por Email 
const findUserByEmail = async (email) => {
    try {
        const query = `
            SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
            FROM public.users u
            JOIN public.roles r ON u.role_id = r.role_id
            WHERE u.email = $1;
        `;
        const result = await db.query(query, [email]);

        if (result.rows.length === 0) {
            return null;
        }
        
        return result.rows[0]; // Retorna el objeto directo de la primera fila
    } catch (error) {
        console.error('Error in findUserByEmail model:', error);
        throw error;
    }
};

// 3. Verificar contraseña cifrada 
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

// 4. Función principal de Autenticación 
const authenticateUser = async (email, password) => {
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return null; // Email incorrecto
        }

        const isPasswordCorrect = await verifyPassword(password, user.password_hash);
        if (isPasswordCorrect) {
            // Removemos el hash por seguridad antes de enviarlo al servidor
            delete user.password_hash;
            return user;
        }

        return null; // Contraseña incorrecta
    } catch (error) {
        console.error('Error in authenticateUser model:', error);
        throw error;
    }
};

// Retrieves all registered users with their associated role name (W05 Project)
const getAllUsersWithRoles = async () => {
    try {
        const query = `
            SELECT u.user_id, u.name, u.email, r.role_name 
            FROM public.users u
            JOIN public.roles r ON u.role_id = r.role_id
            ORDER BY u.name ASC;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error in getAllUsersWithRoles model:', error);
        throw error;
    }
};

export { createUser, authenticateUser, getAllUsersWithRoles };
