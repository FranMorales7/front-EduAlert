// src/components/LoginForm.js
import { useState } from 'react';
import { login } from '../api/auth';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      alert('Login correcto 🚀');
      // Aquí puedes redirigir o cambiar estado de autenticado
    } catch (err) {
      setError('Credenciales incorrectas o error en el servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">Iniciar sesión</button>
    </form>
  );
}

export default LoginForm;
