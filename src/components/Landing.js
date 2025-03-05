import React, { useEffect } from 'react';
import styled from 'styled-components';

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

const Landing = () => {
  // Базовый URL вашего API (замените на ваш домен после деплоя)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const trackUserAction = async (action) => {
    const endpoints = {
      'price_button_click': '/track/price',
      'investor_button_click': '/track/investor',
      'download_presentation': '/track/presentation',
      'consultation_request': '/track/consultation'
    };

    // Получаем или создаем sessionId
    const sessionId = localStorage.getItem('sessionId') || Math.random().toString(36).substring(7);
    localStorage.setItem('sessionId', sessionId);

    try {
      // Создаем URL с минимальными необходимыми параметрами
      const url = `${API_BASE_URL}${endpoints[action]}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log(`Действие ${action} успешно отслежено`);
    } catch (error) {
      console.error('Ошибка при отслеживании:', error);
      // Сохраняем неотправленные события локально
      const failedEvents = JSON.parse(localStorage.getItem('failedEvents') || '[]');
      failedEvents.push({
        action,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('failedEvents', JSON.stringify(failedEvents));
    }
  };

  // Пытаемся отправить неотправленные события при загрузке
  useEffect(() => {
    const failedEvents = JSON.parse(localStorage.getItem('failedEvents') || '[]');
    if (failedEvents.length > 0) {
      failedEvents.forEach(event => {
        trackUserAction(event.action);
      });
      localStorage.removeItem('failedEvents');
    }
  }, []);

  return (
    <Container>
      <Section>
        <Title>Цены и тарифы</Title>
        <Description>
          Ознакомьтесь с нашими конкурентными ценами и гибкими тарифными планами
        </Description>
        <Button onClick={() => trackUserAction('price_button_click')}>
          Посмотреть цены
        </Button>
      </Section>

      <Section>
        <Title>Для инвесторов</Title>
        <Description>
          Узнайте о возможностях инвестирования в наш проект
        </Description>
        <Button onClick={() => trackUserAction('investor_button_click')}>
          Стать инвестором
        </Button>
      </Section>

      <Section>
        <Title>Презентация проекта</Title>
        <Description>
          Скачайте подробную презентацию о нашем проекте
        </Description>
        <Button onClick={() => trackUserAction('download_presentation')}>
          Скачать презентацию
        </Button>
      </Section>

      <Section>
        <Title>Получить консультацию</Title>
        <Description>
          Наши специалисты готовы ответить на все ваши вопросы
        </Description>
        <Button onClick={() => trackUserAction('consultation_request')}>
          Заказать консультацию
        </Button>
      </Section>
    </Container>
  );
};

export default Landing; 