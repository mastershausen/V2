import { NuggetData } from '@/shared-components/cards/nugget-card/types';

const mockNuggets: NuggetData[] = [
  {
    id: 'n1',
    user: {
      id: 'u2',
      name: 'Alexander Becker',
      profileImage: { initials: 'AB' }
    },
    timestamp: new Date(2023, 5, 15),
    content: 'Mit diesen 3 Steuertipps können Selbstständige jährlich bis zu 5.000€ sparen. Besonders Tipp #2 wird oft übersehen!',
    helpfulCount: 42,
    commentCount: 7,
    isHelpful: true,
    isSaved: false,
    tags: ['Steuern', 'Selbstständige', 'Tipps']
  },
  {
    id: 'n2',
    user: {
      id: 'u2',
      name: 'Alexander Becker',
      profileImage: { initials: 'AB' }
    },
    timestamp: new Date(2023, 6, 20),
    content: 'Wusstet ihr, dass ihr als Freiberufler bis zu 50% eurer Büromiete als Betriebsausgabe absetzen könnt? Hier sind die wichtigsten Voraussetzungen...',
    helpfulCount: 28,
    commentCount: 5,
    isHelpful: false,
    isSaved: true,
    tags: ['Freiberufler', 'Büromiete', 'Betriebsausgaben']
  },
  {
    id: 'n3',
    user: {
      id: 'u2',
      name: 'Alexander Becker',
      profileImage: { initials: 'AB' }
    },
    timestamp: new Date(2023, 7, 5),
    content: 'Die neue Regelung zur Umsatzsteuer für digitale Dienstleistungen ab 2024: Was ihr jetzt schon wissen und vorbereiten solltet.',
    helpfulCount: 35,
    commentCount: 12,
    isHelpful: true,
    isSaved: false,
    tags: ['Umsatzsteuer', 'Digitale Dienstleistungen', '2024']
  },
  {
    id: 'n4',
    user: {
      id: 'u2',
      name: 'Alexander Becker',
      profileImage: { initials: 'AB' }
    },
    timestamp: new Date(2023, 8, 10),
    content: 'Meine Top 5 Steuerspar-Tipps für Gründer im ersten Jahr. Besonders wichtig: Die richtige Rechtsform wählen und Investitionsabzugsbetrag nutzen!',
    helpfulCount: 56,
    commentCount: 8,
    isHelpful: true,
    isSaved: true,
    tags: ['Gründer', 'Steuersparen', 'Rechtsform']
  }
];

export default mockNuggets;
