// src/dao/UsuarioManager.js
import Usuario from '../models/Usuarios.js';

class UsuarioManager {
  /**
   * Obtiene todos los usuarios
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getUsers() {
    try {
      return await Usuario.find().select('-password').lean(); // Excluye el password por seguridad
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async createUser(userData) {
    try {
      const newUser = new Usuario(userData);
      return await newUser.save();
    } catch (error) {
      // Manejo especial para errores de duplicado de email
      if (error.code === 11000) {
        throw new Error('El email ya está registrado');
      }
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  /**
   * Obtiene un usuario por email
   * @param {String} email - Email del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async getUserByEmail(email) {
    try {
      return await Usuario.findOne({ email });
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  /**
   * Actualiza un usuario
   * @param {String} id - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object|null>} Usuario actualizado
   */
  async updateUser(id, updateData) {
    try {
      // Excluye campos sensibles que no deberían actualizarse aquí
      const { password, _id, ...safeUpdateData } = updateData;
      const updatedUser = await Usuario.findByIdAndUpdate(
        id,
        safeUpdateData,
        { new: true }
      ).select('-password');
      return updatedUser;
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  /**
   * Elimina un usuario
   * @param {String} id - ID del usuario
   * @returns {Promise<Object|null>} Usuario eliminado
   */
  async deleteUser(id) {
    try {
      return await Usuario.findByIdAndDelete(id).select('-password');
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  /**
   * Cambia el rol de un usuario
   * @param {String} id - ID del usuario
   * @param {String} newRole - Nuevo rol ('admin' o 'user')
   * @returns {Promise<Object|null>} Usuario actualizado
   */
  async changeUserRole(id, newRole) {
    try {
      if (!['admin', 'user'].includes(newRole)) {
        throw new Error('Rol no válido');
      }
      return await Usuario.findByIdAndUpdate(
        id,
        { rol: newRole },
        { new: true }
      ).select('-password');
    } catch (error) {
      throw new Error(`Error al cambiar rol: ${error.message}`);
    }
  }
}

export default UsuarioManager;