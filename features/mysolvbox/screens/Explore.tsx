import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, FlatList, Animated, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { FilterTabItem } from '@/shared-components/navigation/FilterTabs';
import { TileGrid } from '@/shared-components/container/TileGrid';
import { FooterActionButton } from '@/shared-components/navigation/FooterActionButton';
import { spacing } from '@/config/theme/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Tile-Datentyp
interface ExploreTile {
  id: number;
  title: string;
  category: string;
}

// Alle Explore-Tiles aus der Markdown-Datei
const EXPLORE_TILES: ExploreTile[] = [
  // 1. Steuern
  { id: 1, title: "Ich will mehr Netto vom Brutto", category: "steuern" },
  { id: 2, title: "Ich will meine Steuerlast halbieren", category: "steuern" },
  { id: 3, title: "Ich will steuerfrei Rücklagen bilden", category: "steuern" },
  { id: 4, title: "Ich will meine Gewinne steuerfrei ausschütten", category: "steuern" },
  { id: 5, title: "Ich will meine Firma steuerfrei verkaufen", category: "steuern" },
  { id: 6, title: "Ich will eine Holding gründen", category: "steuern" },
  { id: 7, title: "Ich will Gewerbesteuer vermeiden", category: "steuern" },
  { id: 8, title: "Ich will Umsatzsteuer korrekt abführen", category: "steuern" },
  { id: 9, title: "Ich will Rückzahlungen vom Finanzamt bekommen", category: "steuern" },
  { id: 10, title: "Ich will verdeckte Gewinnausschüttungen vermeiden", category: "steuern" },
  { id: 11, title: "Ich will meine Entnahmen korrekt verbuchen", category: "steuern" },
  { id: 12, title: "Ich will private Ausgaben sauber absetzen", category: "steuern" },
  { id: 13, title: "Ich will steuerfreie Gehaltsextras nutzen", category: "steuern" },
  { id: 14, title: "Ich will meine Steuerbescheide verstehen", category: "steuern" },
  { id: 15, title: "Ich will meine Bilanz steuerlich optimieren", category: "steuern" },
  { id: 16, title: "Ich will Investitionsabzugsbetrag clever nutzen", category: "steuern" },
  { id: 17, title: "Ich will Abschreibungen vollständig ausreizen", category: "steuern" },
  { id: 18, title: "Ich will steuerlich begünstigt spenden", category: "steuern" },
  { id: 19, title: "Ich will Steuern über Immobilien senken", category: "steuern" },
  { id: 20, title: "Ich will meine Steuern international optimieren", category: "steuern" },

  // 2. Immobilien
  { id: 21, title: "Ich will steuerfrei Immobilien verkaufen", category: "immobilien" },
  { id: 22, title: "Ich will Immobilien über die GmbH kaufen", category: "immobilien" },
  { id: 23, title: "Ich will Immobilien im Betriebsvermögen halten", category: "immobilien" },
  { id: 24, title: "Ich will Off-Market Immobilien finden", category: "immobilien" },
  { id: 25, title: "Ich will Immobilien mit Gewinn vermieten", category: "immobilien" },
  { id: 26, title: "Ich will einen Mieter rechtssicher kündigen", category: "immobilien" },
  { id: 27, title: "Ich will Immobilien an meine Kinder übertragen", category: "immobilien" },
  { id: 28, title: "Ich will Immobilien steuerlich optimal abschreiben", category: "immobilien" },
  { id: 29, title: "Ich will mein Immobilien-Portfolio digitalisieren", category: "immobilien" },
  { id: 30, title: "Ich will Immobilien mit Holding kombinieren", category: "immobilien" },
  { id: 31, title: "Ich will Immobilien günstig finanzieren", category: "immobilien" },
  { id: 32, title: "Ich will Eigentümerstrukturen vereinfachen", category: "immobilien" },
  { id: 33, title: "Ich will Immobiliengesellschaften gründen", category: "immobilien" },
  { id: 34, title: "Ich will Immobilien international handeln", category: "immobilien" },
  { id: 35, title: "Ich will Zwangsversteigerungen profitabel nutzen", category: "immobilien" },
  { id: 36, title: "Ich will mein Immobiliengeschäft skalieren", category: "immobilien" },
  { id: 37, title: "Ich will Immobilien gewerblich entwickeln", category: "immobilien" },
  { id: 38, title: "Ich will Immobilien steuerfrei verschenken", category: "immobilien" },
  { id: 39, title: "Ich will mein Immobilienvermögen absichern", category: "immobilien" },
  { id: 40, title: "Ich will aus Immobilien flüssig werden", category: "immobilien" },

  // 3. Mitarbeiter
  { id: 41, title: "Ich will bessere Mitarbeiter einstellen", category: "mitarbeiter" },
  { id: 42, title: "Ich will Mitarbeiter langfristig binden", category: "mitarbeiter" },
  { id: 43, title: "Ich will meine Kündigungsquote senken", category: "mitarbeiter" },
  { id: 44, title: "Ich will Gehälter steuerlich optimieren", category: "mitarbeiter" },
  { id: 45, title: "Ich will ein starkes Team aufbauen", category: "mitarbeiter" },
  { id: 46, title: "Ich will eine Führungskultur etablieren", category: "mitarbeiter" },
  { id: 47, title: "Ich will Arbeitsrecht-Fallen vermeiden", category: "mitarbeiter" },
  { id: 48, title: "Ich will meine Mitarbeiter effizient onboarden", category: "mitarbeiter" },
  { id: 49, title: "Ich will leistungsorientierte Boni fair regeln", category: "mitarbeiter" },
  { id: 50, title: "Ich will krankheitsbedingte Ausfälle reduzieren", category: "mitarbeiter" },
  { id: 51, title: "Ich will meine Teams selbstorganisiert aufstellen", category: "mitarbeiter" },
  { id: 52, title: "Ich will A-Mitarbeiter systematisch halten", category: "mitarbeiter" },
  { id: 53, title: "Ich will gute Mitarbeiter schneller finden", category: "mitarbeiter" },
  { id: 54, title: "Ich will Fluktuation kostenneutral auffangen", category: "mitarbeiter" },
  { id: 55, title: "Ich will mein Team entlasten ohne Kündigungen", category: "mitarbeiter" },
  { id: 56, title: "Ich will Lohnkosten gezielt steuern", category: "mitarbeiter" },
  { id: 57, title: "Ich will Mitarbeiter steuerfrei belohnen", category: "mitarbeiter" },
  { id: 58, title: "Ich will Remote-Teams richtig führen", category: "mitarbeiter" },
  { id: 59, title: "Ich will Personalgespräche professionell führen", category: "mitarbeiter" },
  { id: 60, title: "Ich will Wachstum ohne Überforderung", category: "mitarbeiter" },

  // 4. Kundengewinnung
  { id: 61, title: "Ich will regelmäßig neue Kunden", category: "kundengewinnung" },
  { id: 62, title: "Ich will planbare Leads pro Monat", category: "kundengewinnung" },
  { id: 63, title: "Ich will unabhängig von Empfehlungen verkaufen", category: "kundengewinnung" },
  { id: 64, title: "Ich will einen Funnel, der verkauft", category: "kundengewinnung" },
  { id: 65, title: "Ich will meinen Vertrieb digitalisieren", category: "kundengewinnung" },
  { id: 66, title: "Ich will einen Vertrieb, der abschließt", category: "kundengewinnung" },
  { id: 67, title: "Ich will Kundenbindung automatisieren", category: "kundengewinnung" },
  { id: 68, title: "Ich will Kaltakquise ersetzen", category: "kundengewinnung" },
  { id: 69, title: "Ich will Bestandskunden reaktivieren", category: "kundengewinnung" },
  { id: 70, title: "Ich will Referenzen strategisch nutzen", category: "kundengewinnung" },
  { id: 71, title: "Ich will Preisverhandlungen souverän führen", category: "kundengewinnung" },
  { id: 72, title: "Ich will nie wieder Rabatt geben müssen", category: "kundengewinnung" },
  { id: 73, title: "Ich will Neukunden zu Stammkunden machen", category: "kundengewinnung" },
  { id: 74, title: "Ich will Einwandbehandlung perfektionieren", category: "kundengewinnung" },
  { id: 75, title: "Ich will Online-Termine füllen", category: "kundengewinnung" },
  { id: 76, title: "Ich will aus Leads echte Kunden machen", category: "kundengewinnung" },
  { id: 77, title: "Ich will weniger Aufwand pro Abschluss", category: "kundengewinnung" },
  { id: 78, title: "Ich will Cross-Selling gezielt einsetzen", category: "kundengewinnung" },
  { id: 79, title: "Ich will keine Dead Leads mehr", category: "kundengewinnung" },
  { id: 80, title: "Ich will bessere Margen bei gleichem Umsatz", category: "kundengewinnung" },

  // 5. Künstliche Intelligenz
  { id: 81, title: "Ich will Aufgaben mit KI automatisieren", category: "ki" },
  { id: 82, title: "Ich will mit GPT richtig Zeit sparen", category: "ki" },
  { id: 83, title: "Ich will KI im Kundenservice einsetzen", category: "ki" },
  { id: 84, title: "Ich will Angebote automatisch schreiben lassen", category: "ki" },
  { id: 85, title: "Ich will Inhalte mit KI erstellen", category: "ki" },
  { id: 86, title: "Ich will repetitive Aufgaben eliminieren", category: "ki" },
  { id: 87, title: "Ich will meinen Vertriebsprozess KI-gestützt machen", category: "ki" },
  { id: 88, title: "Ich will ein eigenes GPT-Agentensystem", category: "ki" },
  { id: 89, title: "Ich will mit KI Meetings zusammenfassen", category: "ki" },
  { id: 90, title: "Ich will Marketingtexte automatisch generieren", category: "ki" },
  { id: 91, title: "Ich will KI in meine Tools integrieren", category: "ki" },
  { id: 92, title: "Ich will Chatbots effizient einsetzen", category: "ki" },
  { id: 93, title: "Ich will keine manuellen Follow-ups mehr", category: "ki" },
  { id: 94, title: "Ich will Rechnungsstellung automatisieren", category: "ki" },
  { id: 95, title: "Ich will KI für PR & Social Media nutzen", category: "ki" },
  { id: 96, title: "Ich will Bewerber automatisch vorsortieren", category: "ki" },
  { id: 97, title: "Ich will KI im Support rund um die Uhr", category: "ki" },
  { id: 98, title: "Ich will Contentplanung mit KI abbilden", category: "ki" },
  { id: 99, title: "Ich will Produktdaten automatisch pflegen", category: "ki" },
  { id: 100, title: "Ich will KI-Tools strategisch kombinieren", category: "ki" },

  // 6. Investments (war "Finanzen" in der MD, aber im Dropdown "Investments")
  { id: 101, title: "Ich will in Startups investieren", category: "investments" },
  { id: 102, title: "Ich will Immobilien als Investment nutzen", category: "investments" },
  { id: 103, title: "Ich will mein Geld steueroptimiert anlegen", category: "investments" },
  { id: 104, title: "Ich will Beteiligungen aufbauen", category: "investments" },
  { id: 105, title: "Ich will alternative Investments verstehen", category: "investments" },
  { id: 106, title: "Ich will sichere Investments mit hoher Rendite", category: "investments" },
  { id: 107, title: "Ich will investieren ohne Tagesgeschäft", category: "investments" },
  { id: 108, title: "Ich will Investmentrisiken minimieren", category: "investments" },
  { id: 109, title: "Ich will passives Einkommen mit Substanz", category: "investments" },
  { id: 110, title: "Ich will Beteiligungen steuerlich korrekt strukturieren", category: "investments" },
  { id: 111, title: "Ich will mein Portfolio diversifizieren", category: "investments" },
  { id: 112, title: "Ich will Kapital strategisch allokieren", category: "investments" },
  { id: 113, title: "Ich will in Firmen investieren, die zu mir passen", category: "investments" },
  { id: 114, title: "Ich will Investment mit Einfluss", category: "investments" },
  { id: 115, title: "Ich will Sachwerte intelligent aufbauen", category: "investments" },
  { id: 116, title: "Ich will meine Investments rechtssicher dokumentieren", category: "investments" },
  { id: 117, title: "Ich will Business Angel werden", category: "investments" },
  { id: 118, title: "Ich will mein Vermögen unabhängig machen", category: "investments" },
  { id: 119, title: "Ich will investieren ohne Bankverbindung", category: "investments" },
  { id: 120, title: "Ich will Investmentprojekte professionell prüfen", category: "investments" },

  // 7. Finanzierung (neue Kategorie aus "Finanzen" in der MD)
  { id: 121, title: "Ich will kurzfristig meine Liquidität verbessern", category: "finanzierung" },
  { id: 122, title: "Ich will Förderung erhalten, die mir zusteht", category: "finanzierung" },
  { id: 123, title: "Ich will meine Kosten nachhaltig senken", category: "finanzierung" },
  { id: 124, title: "Ich will meine Buchhaltung auslagern", category: "finanzierung" },
  { id: 125, title: "Ich will bankfähig für einen Kredit werden", category: "finanzierung" },
  { id: 126, title: "Ich will meine Einnahmen optimieren", category: "finanzierung" },
  { id: 127, title: "Ich will meine Fixkosten radikal kürzen", category: "finanzierung" },
  { id: 128, title: "Ich will mein Pricing strategisch anheben", category: "finanzierung" },
  { id: 129, title: "Ich will Rechnungen schneller bezahlt bekommen", category: "finanzierung" },
  { id: 130, title: "Ich will meine Mahnungen automatisieren", category: "finanzierung" },
  { id: 131, title: "Ich will meine Bilanz verständlich machen", category: "finanzierung" },
  { id: 132, title: "Ich will mein Cashflow-Management vereinfachen", category: "finanzierung" },
  { id: 133, title: "Ich will meine Liquidität mit Tools steuern", category: "finanzierung" },
  { id: 134, title: "Ich will Verbindlichkeiten clever managen", category: "finanzierung" },
  { id: 135, title: "Ich will kein Zahlendrehen mehr", category: "finanzierung" },
  { id: 136, title: "Ich will Skontostrategien aktiv nutzen", category: "finanzierung" },
  { id: 137, title: "Ich will weniger Bürokratie in der Buchhaltung", category: "finanzierung" },
  { id: 138, title: "Ich will mein Unternehmen auf Investoren vorbereiten", category: "finanzierung" },
  { id: 139, title: "Ich will Finanzierung strategisch aufbauen", category: "finanzierung" },
  { id: 140, title: "Ich will meinen Steuerberater kontrollieren können", category: "finanzierung" },

  // 8. Unternehmensstruktur
  { id: 141, title: "Ich will eine Holding gründen", category: "unternehmensstruktur" },
  { id: 142, title: "Ich will mein Unternehmen verkaufen", category: "unternehmensstruktur" },
  { id: 143, title: "Ich will mein Unternehmen ohne mich führen", category: "unternehmensstruktur" },
  { id: 144, title: "Ich will meine Nachfolge regeln", category: "unternehmensstruktur" },
  { id: 145, title: "Ich will Anteile sauber übertragen", category: "unternehmensstruktur" },
  { id: 146, title: "Ich will stille Beteiligungen clever einsetzen", category: "unternehmensstruktur" },
  { id: 147, title: "Ich will mit Partnern klare Verhältnisse schaffen", category: "unternehmensstruktur" },
  { id: 148, title: "Ich will eine Exit-Strategie aufbauen", category: "unternehmensstruktur" },
  { id: 149, title: "Ich will mein Unternehmen teilverkaufen", category: "unternehmensstruktur" },
  { id: 150, title: "Ich will meine Gesellschaftsstruktur verschlanken", category: "unternehmensstruktur" },
  { id: 151, title: "Ich will Tochtergesellschaften gründen", category: "unternehmensstruktur" },
  { id: 152, title: "Ich will Co-Founder fair einbinden", category: "unternehmensstruktur" },
  { id: 153, title: "Ich will meine Struktur internationalisieren", category: "unternehmensstruktur" },
  { id: 154, title: "Ich will stille Reserven steuerfrei heben", category: "unternehmensstruktur" },
  { id: 155, title: "Ich will mein Unternehmen für Investoren attraktiv machen", category: "unternehmensstruktur" },
  { id: 156, title: "Ich will Umfirmierung ohne Chaos", category: "unternehmensstruktur" },
  { id: 157, title: "Ich will die beste Rechtsform für mein Modell", category: "unternehmensstruktur" },
  { id: 158, title: "Ich will mein Unternehmen systematisieren", category: "unternehmensstruktur" },
  { id: 159, title: "Ich will Struktur ohne Overhead", category: "unternehmensstruktur" },
  { id: 160, title: "Ich will meine Unternehmensanteile vertraglich absichern", category: "unternehmensstruktur" },

  // 9. Recht & Sicherheit
  { id: 161, title: "Ich will rechtssichere Verträge aufsetzen", category: "recht-sicherheit" },
  { id: 162, title: "Ich will arbeitsrechtlich sauber kündigen", category: "recht-sicherheit" },
  { id: 163, title: "Ich will nicht haften, wenn etwas schiefläuft", category: "recht-sicherheit" },
  { id: 164, title: "Ich will meine Daten vor Angriffen schützen", category: "recht-sicherheit" },
  { id: 165, title: "Ich will IT-Sicherheit mit wenig Aufwand", category: "recht-sicherheit" },
  { id: 166, title: "Ich will keine Abmahnungen mehr riskieren", category: "recht-sicherheit" },
  { id: 167, title: "Ich will meinen Online-Auftritt rechtssicher machen", category: "recht-sicherheit" },
  { id: 168, title: "Ich will DSGVO-konform agieren", category: "recht-sicherheit" },
  { id: 169, title: "Ich will Vertragslücken schließen", category: "recht-sicherheit" },
  { id: 170, title: "Ich will mein Unternehmen vor Klagen schützen", category: "recht-sicherheit" },
  { id: 171, title: "Ich will rechtlich vorbereitet in die Expansion gehen", category: "recht-sicherheit" },
  { id: 172, title: "Ich will bei Streit mit Kunden abgesichert sein", category: "recht-sicherheit" },
  { id: 173, title: "Ich will meine AGB wasserdicht gestalten", category: "recht-sicherheit" },
  { id: 174, title: "Ich will meine Geschäftsführung rechtlich absichern", category: "recht-sicherheit" },
  { id: 175, title: "Ich will als GmbH sicher auftreten", category: "recht-sicherheit" },
  { id: 176, title: "Ich will mein Markenrecht durchsetzen", category: "recht-sicherheit" },
  { id: 177, title: "Ich will nie wieder Ärger mit Datenschutz haben", category: "recht-sicherheit" },
  { id: 178, title: "Ich will keine Probleme bei der Rechnungsstellung", category: "recht-sicherheit" },
  { id: 179, title: "Ich will faire, aber sichere Arbeitsverträge", category: "recht-sicherheit" },
  { id: 180, title: "Ich will mein Unternehmen rechtlich überprüfen lassen", category: "recht-sicherheit" },

  // 10. Auswandern
  { id: 181, title: "Ich will mein Unternehmen ins Ausland verlagern", category: "auswandern" },
  { id: 182, title: "Ich will als Unternehmer auswandern", category: "auswandern" },
  { id: 183, title: "Ich will steuerfrei leben im Ausland", category: "auswandern" },
  { id: 184, title: "Ich will mit Familie auswandern", category: "auswandern" },
  { id: 185, title: "Ich will ohne Wohnsitz leben", category: "auswandern" },
  { id: 186, title: "Ich will weltweit frei arbeiten", category: "auswandern" },
  { id: 187, title: "Ich will mich abmelden in Deutschland", category: "auswandern" },
  { id: 188, title: "Ich will ein Business aus Dubai führen", category: "auswandern" },
  { id: 189, title: "Ich will zwischen mehreren Ländern pendeln", category: "auswandern" },
  { id: 190, title: "Ich will mein Unternehmen ortsunabhängig aufbauen", category: "auswandern" },
  { id: 191, title: "Ich will ein steuerfreies Zweitmodell nutzen", category: "auswandern" },
  { id: 192, title: "Ich will auswandern ohne Ärger mit dem Finanzamt", category: "auswandern" },
  { id: 193, title: "Ich will ein Leben ohne Bürokratie", category: "auswandern" },
  { id: 194, title: "Ich will mein Business auf Inseln führen", category: "auswandern" },
  { id: 195, title: "Ich will auswandern mit Remote-Team", category: "auswandern" },
  { id: 196, title: "Ich will meine Buchhaltung von überall steuern", category: "auswandern" },
  { id: 197, title: "Ich will keinen deutschen Pass mehr brauchen", category: "auswandern" },
  { id: 198, title: "Ich will meine Kinder im Ausland betreuen lassen", category: "auswandern" },
  { id: 199, title: "Ich will meine Firma global betreiben", category: "auswandern" },
  { id: 200, title: "Ich will in mehreren Ländern steuerlich optimieren", category: "auswandern" },

  // 11. Verkauf & Exit (war "Strategie & Vision" in der MD)
  { id: 201, title: "Ich will mein Geschäftsmodell weiterentwickeln", category: "verkauf-exit" },
  { id: 202, title: "Ich will mein Unternehmen neu positionieren", category: "verkauf-exit" },
  { id: 203, title: "Ich will meine Vision schärfen", category: "verkauf-exit" },
  { id: 204, title: "Ich will meinen Markt neu definieren", category: "verkauf-exit" },
  { id: 205, title: "Ich will klarer entscheiden", category: "verkauf-exit" },
  { id: 206, title: "Ich will strategisch statt operativ denken", category: "verkauf-exit" },
  { id: 207, title: "Ich will mich vom Wettbewerb abheben", category: "verkauf-exit" },
  { id: 208, title: "Ich will mein Unternehmen krisenfest machen", category: "verkauf-exit" },
  { id: 209, title: "Ich will als Unternehmer radikal fokussieren", category: "verkauf-exit" },
  { id: 210, title: "Ich will meinen Tagesablauf strategisch planen", category: "verkauf-exit" },
  { id: 211, title: "Ich will bessere Entscheidungen treffen", category: "verkauf-exit" },
  { id: 212, title: "Ich will von 12 auf 24 Monate planen", category: "verkauf-exit" },
  { id: 213, title: "Ich will strategische Partnerschaften aufbauen", category: "verkauf-exit" },
  { id: 214, title: "Ich will meine Marke strategisch führen", category: "verkauf-exit" },
  { id: 215, title: "Ich will komplexe Probleme schneller lösen", category: "verkauf-exit" },
  { id: 216, title: "Ich will eine neue Zielgruppe erschließen", category: "verkauf-exit" },
  { id: 217, title: "Ich will mein Angebot smarter bündeln", category: "verkauf-exit" },
  { id: 218, title: "Ich will meinen Markt antizipieren", category: "verkauf-exit" },
  { id: 219, title: "Ich will Chancen erkennen, bevor andere es tun", category: "verkauf-exit" },
  { id: 220, title: "Ich will als Unternehmer strategisch wachsen", category: "verkauf-exit" },

  // 12. Persönliches Wachstum
  { id: 221, title: "Ich will besser kommunizieren", category: "persoenliches-wachstum" },
  { id: 222, title: "Ich will klarer denken", category: "persoenliches-wachstum" },
  { id: 223, title: "Ich will glücklicher leben als Unternehmer", category: "persoenliches-wachstum" },
  { id: 224, title: "Ich will mehr Energie im Alltag", category: "persoenliches-wachstum" },
  { id: 225, title: "Ich will Entscheidungen mit Ruhe treffen", category: "persoenliches-wachstum" },
  { id: 226, title: "Ich will keine Angst vor Wachstum", category: "persoenliches-wachstum" },
  { id: 227, title: "Ich will persönlich stabiler werden", category: "persoenliches-wachstum" },
  { id: 228, title: "Ich will Klarheit in meiner Rolle", category: "persoenliches-wachstum" },
  { id: 229, title: "Ich will mit Stress besser umgehen", category: "persoenliches-wachstum" },
  { id: 230, title: "Ich will konsequenter handeln", category: "persoenliches-wachstum" },
  { id: 231, title: "Ich will meine Kommunikation professionalisieren", category: "persoenliches-wachstum" },
  { id: 232, title: "Ich will Verhandlungen souverän führen", category: "persoenliches-wachstum" },
  { id: 233, title: "Ich will mich von Meinungen lösen", category: "persoenliches-wachstum" },
  { id: 234, title: "Ich will entspannter führen", category: "persoenliches-wachstum" },
  { id: 235, title: "Ich will meinen Selbstwert als Unternehmer festigen", category: "persoenliches-wachstum" },
  { id: 236, title: "Ich will weniger innere Konflikte", category: "persoenliches-wachstum" },
  { id: 237, title: "Ich will mein Denken auf Erfolg ausrichten", category: "persoenliches-wachstum" },
  { id: 238, title: "Ich will emotional unabhängiger werden", category: "persoenliches-wachstum" },
  { id: 239, title: "Ich will Verantwortung leichter tragen", category: "persoenliches-wachstum" },
  { id: 240, title: "Ich will besser abschalten können", category: "persoenliches-wachstum" },
];

/**
 * FilterDropdown - Elegantes Dropdown für FilterTabs
 */
interface FilterDropdownProps {
  tabs: FilterTabItem[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
}

function FilterDropdown({ tabs, activeTabId, onTabChange }: FilterDropdownProps) {
  const colors = useThemeColor();
  const [isOpen, setIsOpen] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // Finde das aktive Tab
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  
  const openDropdown = () => {
    setIsOpen(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  
  const closeDropdown = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setIsOpen(false);
    });
  };
  
  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId);
    closeDropdown();
  };
  
  const renderDropdownItem = ({ item }: { item: FilterTabItem }) => {
    const isActive = item.id === activeTabId;
    
    return (
      <TouchableOpacity
        style={[
          dropdownStyles.item,
          { 
            backgroundColor: isActive ? colors.pastel.primary : 'transparent',
            borderColor: colors.divider,
          }
        ]}
        onPress={() => handleTabSelect(item.id)}
        activeOpacity={0.7}
      >
        <Text style={[
          dropdownStyles.itemText,
          { 
            color: isActive ? colors.primary : colors.textPrimary,
            fontWeight: isActive ? '600' : 'normal',
          }
        ]}>
          {item.label}
        </Text>
        {isActive && (
          <Ionicons 
            name="checkmark" 
            size={20} 
            color={colors.primary} 
            style={dropdownStyles.checkmark}
          />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <>
      {/* Dropdown Button */}
      <TouchableOpacity
        style={[
          dropdownStyles.button,
          { 
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 4,
          }
        ]}
        onPress={openDropdown}
        activeOpacity={0.8}
      >
        <Text style={[
          dropdownStyles.buttonText,
          { color: colors.textPrimary }
        ]}>
          {activeTab?.label || 'Kategorie wählen'}
        </Text>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={colors.textSecondary}
          style={dropdownStyles.chevron}
        />
      </TouchableOpacity>
      
      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={closeDropdown}
      >
        <TouchableOpacity
          style={dropdownStyles.overlay}
          activeOpacity={1}
          onPress={closeDropdown}
        >
          <Animated.View 
            style={[
              dropdownStyles.dropdown,
              { 
                backgroundColor: colors.backgroundPrimary,
                borderColor: '#10B981',
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  })
                }]
              }
            ]}
          >
            <View style={[
              dropdownStyles.header,
              { borderBottomColor: colors.divider }
            ]}>
              <Text style={[
                dropdownStyles.headerText,
                { color: colors.textPrimary }
              ]}>
                Kategorie auswählen
              </Text>
              <TouchableOpacity
                onPress={closeDropdown}
                style={dropdownStyles.closeButton}
              >
                <Ionicons 
                  name="close" 
                  size={24} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={tabs}
              renderItem={renderDropdownItem}
              keyExtractor={(item) => item.id}
              style={dropdownStyles.list}
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const dropdownStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.m,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  chevron: {
    marginLeft: spacing.s,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
  },
  dropdown: {
    width: '100%',
    maxHeight: '70%',
    borderRadius: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: spacing.xs,
  },
  list: {
    maxHeight: 400,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  checkmark: {
    marginLeft: spacing.s,
  },
});

/**
 * Explore-Screen - Mit echten Tile-Daten aus ExploreTiles.md
 *
 * Zeigt FilterDropdown und entsprechende Tiles für jede Kategorie an.
 * @returns {React.ReactElement} Die gerenderte Explore-Komponente
 */
export default function ExploreScreen(): React.ReactElement {
  const { t } = useTranslation();
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // FilterTabs State
  const [activeFilter, setActiveFilter] = React.useState('alle');

  // Handler für FilterTabs
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  // Handler für Tile-Klicks
  const handleTilePress = (id: number) => {
    const tile = EXPLORE_TILES.find(t => t.id === id);
    console.log('Tile geklickt:', tile?.title);
    // TODO: Navigation zu Detail-Screen
  };

  // Handler für Olivia Chat
  const handleOliviaChat = () => {
    console.log('Navigation zu Olivia Chat');
    router.navigate('/chats/olivia');
  };

  // FilterTabs-Konfiguration
  const FILTER_TABS: FilterTabItem[] = [
    { id: 'alle', label: 'Alle' },
    { id: 'steuern', label: 'Steuern' },
    { id: 'immobilien', label: 'Immobilien' },
    { id: 'mitarbeiter', label: 'Mitarbeiter' },
    { id: 'kundengewinnung', label: 'Kundengewinnung' },
    { id: 'ki', label: 'Künstliche Intelligenz' },
    { id: 'investments', label: 'Investments' },
    { id: 'finanzierung', label: 'Finanzierung' },
    { id: 'unternehmensstruktur', label: 'Unternehmensstruktur' },
    { id: 'recht-sicherheit', label: 'Recht & Sicherheit' },
    { id: 'auswandern', label: 'Auswandern' },
    { id: 'verkauf-exit', label: 'Verkauf & Exit' },
    { id: 'persoenliches-wachstum', label: 'Persönliches Wachstum' }
  ];

  // Filtere Tiles basierend auf ausgewählter Kategorie
  const filteredTiles = activeFilter === 'alle' 
    ? EXPLORE_TILES 
    : EXPLORE_TILES.filter(tile => tile.category === activeFilter);
  
  return (
    <View style={[styles.container, { 
      backgroundColor: colors.backgroundPrimary,
      paddingTop: insets.top 
    }]}>
      {/* Einfacher Header Text - keine komplexe Komponente */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>
      
      {/* Filter Dropdown */}
      <View style={styles.filterSection}>
        <FilterDropdown 
          tabs={FILTER_TABS}
          activeTabId={activeFilter}
          onTabChange={handleFilterChange}
        />
      </View>
      
      {/* Tiles Grid */}
      <View style={styles.tilesSection}>
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TileGrid 
            tiles={filteredTiles}
            onTilePress={handleTilePress}
            tilesPerRow={3}
          />
        </ScrollView>
      </View>
      
      {/* Text über Button */}
      <View style={styles.preButtonTextSection}>
        <Text style={[styles.preButtonText, { color: colors.textSecondary }]}>
          Noch nicht das richtige dabei?
        </Text>
      </View>
      
      {/* Footer Action Button */}
      <FooterActionButton
        label="Sag Olivia was du willst!"
        onPress={handleOliviaChat}
        icon="semantic-web"
        iconLibrary="material-community"
        iconPosition="left"
        backgroundColor={colors.primary}
        textColor="#FFFFFF"
        style={{ borderTopWidth: 0 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
  },
  filterSection: {
    paddingVertical: spacing.m,
  },
  tilesSection: {
    flex: 1,
    paddingTop: spacing.s,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.m,
  },
  preButtonTextSection: {
    paddingHorizontal: spacing.m,
    paddingTop: spacing.m,
    paddingBottom: 0,
    marginBottom: -spacing.xs,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  preButtonText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
}); 