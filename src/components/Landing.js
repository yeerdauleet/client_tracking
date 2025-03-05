import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import posthog from 'posthog-js';
import { authService } from '../services/auth';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Section = styled.section`
  margin: 40px 0;
  padding: 30px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;

  &:hover {
    background: #0056b3;
  }
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const StatusMessage = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  border-radius: 4px;
  background: ${props => props.error ? '#ff4444' : '#00C851'};
  color: white;
  opacity: ${props => props.show ? '1' : '0'};
  transition: opacity 0.3s;
`;

const UserInfo = styled.div`
  margin-bottom: 20px;
  color: #333;
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;

  &:hover {
    background: #cc3333;
  }
`;

const AuthButtons = styled.div`
  margin-bottom: 20px;
`;

const Landing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Проверяем аутентификацию при загрузке
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        posthog.identify(currentUser.email, {
          email: currentUser.email,
          username: currentUser.username
        });
      }
    };
    
    checkAuth();
  }, []);

  // Отслеживаем время на странице
  useEffect(() => {
    const startTime = new Date();
    
    return () => {
      const endTime = new Date();
      const timeSpent = endTime - startTime;
      
      posthog.capture('page_time_spent', {
        page: 'landing',
        duration_ms: timeSpent,
        duration_seconds: Math.floor(timeSpent / 1000),
        user_id: user?.email || 'anonymous'
      });
    };
  }, [user]);

  // Отслеживаем скроллинг
  useEffect(() => {
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        if (maxScroll >= 90) {
          posthog.capture('deep_scroll', {
            page: 'landing',
            scroll_percentage: Math.round(maxScroll),
            user_id: user?.email || 'anonymous'
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user]);

  const handleNavigation = (path, action) => {
    // Отправляем событие в PostHog
    posthog.capture(action, {
      path: path,
      timestamp: new Date().toISOString(),
      location: window.location.href,
      referrer: document.referrer,
      user_id: user?.email || 'anonymous',
      viewport_size: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      user_agent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      is_authenticated: !!user
    });

    navigate(path);
  };

  // Отслеживаем начало сессии
  useEffect(() => {
    if (!sessionStorage.getItem('session_start')) {
      sessionStorage.setItem('session_start', new Date().toISOString());
      posthog.capture('session_start', {
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        user_id: user?.email || 'anonymous'
      });
    }
  }, [user]);

  return (
    <Container>
      {user ? (
        <UserInfo>
          Привет, {user.username}! <LogoutButton onClick={() => authService.logout()}>Выйти</LogoutButton>
        </UserInfo>
      ) : (
        <AuthButtons>
          <Button onClick={() => navigate('/login')}>Войти</Button>
          <Button onClick={() => navigate('/register')}>Регистрация</Button>
        </AuthButtons>
      )}

      <Section>
        <Title>Цены и тарифы</Title>
        <Description>
          Ознакомьтесь с нашими конкурентными ценами и гибкими тарифными планами
        </Description>
        <Button 
          onClick={() => handleNavigation('/prices', 'price_page_view')}
          onMouseEnter={() => posthog.capture('price_button_hover', { user_id: user?.email || 'anonymous' })}
        >
          Посмотреть цены
        </Button>
      </Section>

      <Section>
        <Title>Для инвесторов</Title>
        <Description>
          Узнайте о возможностях инвестирования в наш проект
        </Description>
        <Button 
          onClick={() => handleNavigation('/investors', 'investor_page_view')}
          onMouseEnter={() => posthog.capture('investor_button_hover', { user_id: user?.email || 'anonymous' })}
        >
          Стать инвестором
        </Button>
      </Section>

      <Section>
        <Title>Презентация проекта</Title>
        <Description>
          Скачайте подробную презентацию о нашем проекте
        </Description>
        <Button 
          onClick={() => handleNavigation('/presentation', 'presentation_page_view')}
          onMouseEnter={() => posthog.capture('presentation_button_hover', { user_id: user?.email || 'anonymous' })}
        >
          Скачать презентацию
        </Button>
      </Section>

      <Section>
        <Title>Получить консультацию</Title>
        <Description>
          Наши специалисты готовы ответить на все ваши вопросы
        </Description>
        <Button 
          onClick={() => handleNavigation('/consultation', 'consultation_page_view')}
          onMouseEnter={() => posthog.capture('consultation_button_hover', { user_id: user?.email || 'anonymous' })}
        >
          Заказать консультацию
        </Button>
      </Section>
    </Container>
  );
};

export default Landing; 