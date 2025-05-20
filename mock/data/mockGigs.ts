import { GigData } from '@/shared-components/cards/gig-card/GigCard';

const mockGigs: GigData[] = [
  {
    id: 'g1',
    title: 'Steuerberatung für Startups',
    description: 'Professionelle Steuerberatung speziell für junge Unternehmen. Von der Gründung bis zur ersten Bilanz - ich begleite dich durch alle steuerlichen Herausforderungen.',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    price: 299,
    rating: 5.0,
    currency: '€'
  },
  {
    id: 'g2',
    title: 'Steueroptimierung für Freiberufler',
    description: 'Maximiere deine Steuervorteile als Freiberufler. Ich zeige dir, wie du deine Abgaben legal minimierst und mehr vom verdienten Geld behältst.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    price: 0,
    rating: 5.0,
    currency: 'Kostenlos'
  },
  {
    id: 'g3',
    title: 'Bilanzanalyse & Optimierung',
    description: 'Detaillierte Analyse deiner aktuellen Bilanz mit konkreten Optimierungsvorschlägen. Identifiziere versteckte Potenziale und spare bares Geld.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    price: 399,
    rating: 5.0,
    currency: '€'
  },
  {
    id: 'g4',
    title: 'Erstgespräch für Gründer',
    description: 'Unverbindliches Kennenlernen und erste steuerliche Einschätzung für Gründer. Stelle deine Fragen und erhalte eine erste Orientierung.',
    imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: 0,
    rating: 5.0,
    currency: 'Kostenlos'
  },
  {
    id: 'g5',
    title: 'Jahresabschluss-Check',
    description: 'Lass deinen Jahresabschluss von einem Profi prüfen. Ich gebe dir Feedback und Hinweise auf Optimierungsmöglichkeiten.',
    imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: 0,
    rating: 5.0,
    currency: 'Auf Anfrage'
  },
  {
    id: 'g6',
    title: 'Steuerliche Kurzberatung',
    description: 'Du hast eine konkrete Frage? In der Kurzberatung bekommst du schnell und unkompliziert eine professionelle Antwort.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    price: 0,
    rating: 5.0,
    currency: 'Kostenlos'
  }
];

export default mockGigs;
