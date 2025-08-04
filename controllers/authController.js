const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  const { username, password, question, answer } = req.body;
  try {
    const user = new User({ username, password, question, answer });
    await user.save();
    res.json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(400).json({ error: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({ token, refreshToken });
  } catch (err) {
    res.status(500).json({ error: 'Error en login' });
  }
};

exports.getQuestion = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ question: user.question });
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar la pregunta' });
  }
};

exports.resetPassword = async (req, res) => {
  const { username, answer, newPassword } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.compareAnswer(answer))) {
      return res.status(401).json({ error: 'Respuesta incorrecta' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar contraseña' });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = verifyToken(refreshToken, process.env.REFRESH_SECRET);
    const newToken = generateAccessToken(decoded.userId);
    res.json({ token: newToken });
  } catch {
    res.status(401).json({ error: 'Refresh token inválido' });
  }
};
