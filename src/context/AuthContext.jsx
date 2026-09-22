import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar utilizador na montagem
  useEffect(() => {
    const savedUser = localStorage.getItem('sorai-auth-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulação de delay de rede
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('sorai-users')) || [];
        const foundUser = users.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          const authUser = { id: foundUser.id, username: foundUser.username, email: foundUser.email };
          setUser(authUser);
          localStorage.setItem('sorai-auth-user', JSON.stringify(authUser));
          toast.success('Login efetuado com sucesso!');
          resolve(authUser);
        } else {
          toast.error('Email ou password incorretos.');
          reject(new Error('Credenciais inválidas'));
        }
      }, 500);
    });
  };

  const register = (username, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('sorai-users')) || [];
        if (users.some(u => u.email === email)) {
          toast.error('Este email já está registado.');
          reject(new Error('Email já existe'));
          return;
        }

        const newUser = { id: Date.now().toString(), username, email, password };
        users.push(newUser);
        localStorage.setItem('sorai-users', JSON.stringify(users));
        
        const authUser = { id: newUser.id, username: newUser.username, email: newUser.email };
        setUser(authUser);
        localStorage.setItem('sorai-auth-user', JSON.stringify(authUser));
        toast.success('Conta criada com sucesso!');
        resolve(authUser);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sorai-auth-user');
    toast.success('Sessão terminada.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
