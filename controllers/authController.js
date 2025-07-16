const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password, securityQuestion, securityAnswer } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      securityQuestion,
      securityAnswer
    });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { username, securityAnswer, newPassword } = req.body;
 console.log('ForgotPassword request:', { username, securityAnswer, newPassword });
    // Busca al usuario por username primero
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Verifica la respuesta de seguridad
    if (user.securityAnswer !== securityAnswer)
      return res.status(400).json({ error: 'Respuesta incorrecta' });

    // Actualiza la contraseña con hash
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Contraseña actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ✅ NUEVA: Obtener la pregunta de seguridad
exports.getSecurityQuestion = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ securityQuestion: user.securityQuestion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};