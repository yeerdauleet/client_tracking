import posthog from 'posthog-js';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const authService = {
    async register(userData) {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.access_token);
            
            // Идентифицируем пользователя в PostHog
            posthog.identify(userData.email, {
                email: userData.email,
                username: userData.username,
                signupDate: new Date().toISOString()
            });
            
            // Отправляем событие регистрации
            posthog.capture('user_registered', {
                email: userData.email,
                timestamp: new Date().toISOString()
            });
            
            return data;
        }
        throw new Error(data.detail);
    },

    async login(credentials) {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.access_token);
            
            // Получаем данные пользователя
            const user = await this.getCurrentUser();
            
            // Обновляем идентификацию в PostHog
            posthog.identify(user.email, {
                email: user.email,
                username: user.username,
                lastLogin: new Date().toISOString()
            });
            
            // Отправляем событие входа
            posthog.capture('user_logged_in', {
                email: user.email,
                timestamp: new Date().toISOString()
            });
            
            return data;
        }
        throw new Error(data.detail);
    },

    async getCurrentUser() {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await fetch(`${API_URL}/user/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const user = await response.json();
            return user;
        }
        
        localStorage.removeItem('token');
        return null;
    },

    logout() {
        localStorage.removeItem('token');
        posthog.reset(); // Сбрасываем идентификацию в PostHog
        posthog.capture('user_logged_out');
    },

    getToken() {
        return localStorage.getItem('token');
    }
}; 