const jwt = require('jsonwebtoken');

// Verifica que el usuario esté logueado
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], 'clave_secreta'); // ⚠️ usa tu propia clave secreta
    req.user = decoded; // guardamos los datos del usuario en req.user
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

// Verifica que el usuario sea administrador
function verifyAdmin(req, res, next) {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
  }
  next();
}

module.exports = { verifyToken, verifyAdmin };
