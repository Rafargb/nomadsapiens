-- Inserir Cursos de Exemplo
INSERT INTO courses (title, description, image_url, category, is_locked, price, instructor, match_score, rating, reviews_count)
VALUES
(
    'O Nômade Digital: Guia Completo', 
    'Aprenda o passo a passo para se libertar do escritório e trabalhar viajando o mundo. Desde o planejamento financeiro até a escolha dos melhores destinos.',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop',
    'highlight',
    false, -- Curso "Isca" Gratuito ou Barato
    0.00,
    'Rafael Barbosa',
    '98%',
    4.9,
    1240
),
(
    'Mestres do Freelancing', 
    'Domine as plataformas de trabalho remoto, aprenda a negociar em dólar e construa uma carreira sólida como freelancer internacional.',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
    'next_evolution',
    true, -- Bloqueado (Pago)
    297.00,
    'Equipe Nomad',
    '95%',
    4.8,
    850
),
(
    'Inglês para Nômades', 
    'O inglês prático e focado que você precisa para passar na imigração, alugar apartamentos e fechar contratos internacionais.',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000&auto=format&fit=crop',
    'popular',
    true,
    147.00,
    'Sarah Teacher',
    '88%',
    4.7,
    300
),
(
    'Investimentos Globais', 
    'Como proteger seu patrimônio ganhando em moedas fortes e investindo em mercados internacionais de forma legal e segura.',
    'https://images.unsplash.com/photo-1611974765215-e28ed4827628?q=80&w=1000&auto=format&fit=crop',
    'next_evolution',
    true,
    497.00,
    'Paulo Finance',
    '99%',
    5.0,
    150
);
