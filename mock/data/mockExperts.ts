import { ExpertData } from '@/shared-components/cards/expert-card/ExpertCard';

// Mock-Daten für Experten
const mockExperts: ExpertData[] = [
  {
    id: 'exp1',
    name: 'Dr. Eva Schmidt',
    role: 'premium',
    headline: 'Steuerberaterin & Wirtschaftsprüferin | Spezialistin für Unternehmenssteuern',
    specialties: ['Steuerberatung', 'Wirtschaftsprüfung', 'Unternehmensberatung'],
    rating: 4.9,
    verified: true,
    company: 'Schmidt & Partner Steuerberatung',
    profileImage: { initials: 'ES' }
  },
  {
    id: 'exp2',
    name: 'Thomas Müller',
    role: 'pro',
    headline: 'Rechtsanwalt für Unternehmensrecht | 15 Jahre Erfahrung',
    specialties: ['Unternehmensrecht', 'Vertragsrecht', 'Arbeitsrecht'],
    rating: 4.7,
    verified: true,
    company: 'Müller Rechtsanwälte GmbH',
    profileImage: { initials: 'TM' }
  },
  {
    id: 'exp3',
    name: 'Lisa Wagner',
    role: 'free',
    headline: 'Finanzberaterin für Selbstständige & Freelancer',
    specialties: ['Finanzplanung', 'Altersvorsorge', 'Investitionen'],
    rating: 4.8,
    verified: false,
    company: 'Freelance Finance Solutions',
    profileImage: { initials: 'LW' }
  },
  {
    id: 'exp4',
    name: 'Markus Bauer',
    role: 'premium',
    headline: 'Digitalexperte & Unternehmensberater | Ex-Google',
    specialties: ['Digitalisierung', 'Prozessoptimierung', 'Change Management'],
    rating: 5.0,
    verified: true,
    company: 'Digital Growth Consulting',
    profileImage: { initials: 'MB' }
  },
  {
    id: 'exp5',
    name: 'Sabine Klein',
    role: 'pro',
    headline: 'Fördermittelberaterin für KMU & Startups',
    specialties: ['Fördermittel', 'Innovationsförderung', 'EU-Programme'],
    rating: 4.6,
    verified: true,
    company: 'FörderConsult GmbH',
    profileImage: { initials: 'SK' }
  }
];

export default mockExperts; 