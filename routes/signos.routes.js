const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ruta de login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log(`Intentando login para usuario: ${username}`);

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const userFilePath = path.join(__dirname, '../db/user.json');
    const adminFilePath = path.join(__dirname, '../db/admin.json');

    try {
        const users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
        const admins = JSON.parse(fs.readFileSync(adminFilePath, 'utf-8'));

        console.log('Archivos JSON leídos correctamente.');

        const user = users.find(u => u.username === username && u.password === password);
        const admin = admins.find(a => a.username === username && a.password === password);

        if (user) {
            console.log('Login exitoso para usuario.');
            res.status(200).json({ role: 'user' });
        } else if (admin) {
            console.log('Login exitoso para admin.');
            res.status(200).json({ role: 'admin' });
        } else {
            console.log('Credenciales inválidas.');
            res.status(401).json({ message: 'Usuario o contraseña inválidos.' });
        }
    } catch (err) {
        console.error('Error al leer los archivos JSON:', err);
        return res.status(500).json({ message: 'Error reading user or admin file' });
    }
});

// Ruta para cambiar la contraseña
router.put('/change-password', (req, res) => {
    const { username, newPassword } = req.body;

    console.log(`Solicitud para cambiar contraseña para usuario: ${username}`);

    if (!username || !newPassword) {
        return res.status(400).json({ message: 'Username and new password are required' });
    }

    const userFilePath = path.join(__dirname, '../db/user.json');
    const adminFilePath = path.join(__dirname, '../db/admin.json');

    try {
        const users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
        const admins = JSON.parse(fs.readFileSync(adminFilePath, 'utf-8'));

        console.log('Archivos JSON leídos correctamente para cambiar contraseña.');

        let user = users.find(u => u.username === username);
        let admin = admins.find(a => a.username === username);

        if (user) {
            user.password = newPassword; // Actualizar contraseña del usuario
            fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
            console.log('Contraseña modificada exitosamente para el usuario.');
            res.status(200).json({ message: 'Contraseña modificada exitosamente para el usuario!' });
        } else if (admin) {
            admin.password = newPassword; // Actualizar contraseña del admin
            fs.writeFileSync(adminFilePath, JSON.stringify(admins, null, 2));
            console.log('Contraseña modificada exitosamente para el admin.');
            res.status(200).json({ message: 'Contraseña modificada exitosamente para el admin!' });
        } else {
            console.log('Usuario no encontrado.');
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error('Error al cambiar la contraseña:', err);
        return res.status(500).json({ message: 'Error reading or saving password file' });
    }
});

module.exports = router;
