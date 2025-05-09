export default function validarUsuario(req, res, next) {
  const { nombre, email, password, rol } = req.body;

  // Validar nombre
  if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
    return next(new Error('Nombre inválido (mínimo 2 caracteres)'));
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return next(new Error('Email inválido'));
  }

  // Validar password (mínimo 6 caracteres, al menos una letra y un número)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!password || typeof password !== 'string' || !passwordRegex.test(password)) {
    return next(new Error('Contraseña inválida (mínimo 6 caracteres, incluir letras y números)'));
  }

  // Validar rol (opcional: solo permitir ciertos roles)
  const rolesPermitidos = ['admin', 'user'];
  if (!rol || typeof rol !== 'string' || !rolesPermitidos.includes(rol.toLowerCase())) {
    return next(new Error('Rol inválido (debe ser admin o user)'));
  }

  // Si todo está bien, sigue el flujo
  next();
}