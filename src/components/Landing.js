import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    // Просто переходим на соответствующую страницу
    // Трекинг будет происходить автоматически по URL на бэкенде
    navigate(path);
  };

  return (
    <Container>
      <Section>
        <Title>Цены и тарифы</Title>
        <Description>
          Ознакомьтесь с нашими конкурентными ценами и гибкими тарифными планами
        </Description>
        <Button onClick={() => handleNavigation('/prices')}>
          Посмотреть цены
        </Button>
      </Section>

      <Section>
        <Title>Для инвесторов</Title>
        <Description>
          Узнайте о возможностях инвестирования в наш проект
        </Description>
        <Button onClick={() => handleNavigation('/investors')}>
          Стать инвестором
        </Button>
      </Section>

      <Section>
        <Title>Презентация проекта</Title>
        <Description>
          Скачайте подробную презентацию о нашем проекте
        </Description>
        <Button onClick={() => handleNavigation('/presentation')}>
          Скачать презентацию
        </Button>
      </Section>

      <Section>
        <Title>Получить консультацию</Title>
        <Description>
          Наши специалисты готовы ответить на все ваши вопросы
        </Description>
        <Button onClick={() => handleNavigation('/consultation')}>
          Заказать консультацию
        </Button>
      </Section>
    </Container>
  );
};

export default Landing; 