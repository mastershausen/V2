import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Dimensions,
  StatusBar,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';

import FallstudieDetail from '@/features/chats/components/FallstudieDetail';

// Fensterbreite für Berechnungen
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Mockdaten für Fallstudien
const FALLSTUDIEN_MOCKDATA = [
  {
    id: '1',
    titel: 'Holdingstruktur spart 84.000 € jährlich',
    kurzbeschreibung: 'Digitales Holding-Setup für Agenturgruppe, umgesetzt in 3 Monaten',
    ergebnis: '84.000 € Ersparnis jährlich',
    context: 'Eine expandierende Digitalagentur mit 4 Standorten und 45 Mitarbeitern hatte aufgrund von Wachstum und organischer Entwicklung eine ineffiziente Unternehmensstruktur. Die bisherige Besteuerung führte zu hohen Steuerzahlungen und Liquiditätsproblemen bei Investitionen.',
    action: 'Konzeption und Umsetzung einer Holding-Struktur mit einer Management-GmbH als Dach und operativen Tochtergesellschaften. Etablierung konzerninterner Verrechnungsmodelle und Implementierung eines digitalen Reporting-Systems für Transparenz und Steuerung.',
    result: {
      text: 'Die optimierte Struktur führte zu erheblichen Steuervorteilen und besserer Risikostreuung:',
      bulletpoints: [
        'Steuerersparnis: 84.000 € pro Jahr',
        'Verbesserte Liquidität für Wachstumsfinanzierung',
        'Risikominimierung durch separate Gesellschaften'
      ]
    },
    datum: '03.05.2025'
  },
  {
    id: '2',
    titel: 'Digitalisierte Buchhaltung reduziert Verwaltungskosten um 40%',
    kurzbeschreibung: 'Implementierung einer vollständig digitalen Buchhaltungslösung für ein E-Commerce-Unternehmen',
    ergebnis: '37.500 € Kostenreduktion pro Jahr',
    context: 'Ein E-Commerce-Unternehmen mit 12 Mitarbeitern und 3,2 Mio. € Jahresumsatz arbeitete mit manuellen Buchhaltungsprozessen. Die papierbasierte Verarbeitung verursachte hohe Verwaltungskosten und regelmäßige Verzögerungen bei Monatsabschlüssen.',
    action: 'Implementierung eines vollständig digitalen Buchhaltungssystems mit automatischer Belegerfassung, KI-gestützter Vorkontierung und Schnittstellen zum Onlineshop. Schulung des Teams und Entwicklung digitaler Workflows für alle Finanzprozesse.',
    result: {
      text: 'Die Digitalisierung führte zu erheblichen Effizienzsteigerungen:',
      bulletpoints: [
        'Reduktion der Buchhaltungskosten um 40% (37.500 € p.a.)',
        'Monatsabschlüsse in 3 statt bisher 15 Tagen',
        'Echtzeit-Finanzübersichten für bessere Geschäftsentscheidungen'
      ]
    },
    datum: '12.02.2025'
  },
  {
    id: '3',
    titel: 'Nachfolgeplanung mit Steuervorteil von 325.000 €',
    kurzbeschreibung: 'Strukturierte Unternehmensübergabe an die nächste Generation mit optimierter Steuerplanung',
    ergebnis: '325.000 € Steuerersparnis bei Übergabe',
    context: 'Ein Familienunternehmen im Maschinenbau mit 28 Mitarbeitern und 6,8 Mio. € Jahresumsatz stand vor der Übergabe an die nächste Generation. Der Unternehmenswert wurde auf ca. 4,5 Mio. € geschätzt. Eine direkte Übertragung hätte erhebliche Erbschaft- und Schenkungssteuern verursacht.',
    action: 'Entwicklung einer mehrstufigen Nachfolgestrategie mit Gründung einer Familienholding, schrittweiser Anteilsübertragung und vorbereitenden Maßnahmen zur Nutzung von Freibeträgen und Bewertungsabschlägen. Implementierung über einen Zeitraum von 4 Jahren.',
    result: {
      text: 'Die strukturierte Nachfolgeplanung führte zu signifikanten Vorteilen:',
      bulletpoints: [
        'Steuerersparnis bei Übertragung: 325.000 €',
        'Erhalt von 5 Arbeitsplätzen durch bessere Liquidität',
        'Konfliktvermeidung in der Familie durch klare Strukturen'
      ]
    },
    datum: '24.10.2024'
  },
  {
    id: '4',
    titel: 'Umsatzsteueroptimierung für internationalen Online-Händler',
    kurzbeschreibung: 'Neustrukturierung der Umsatzsteuerabwicklung im europäischen E-Commerce',
    ergebnis: '68.000 € Ersparnis und Compliance-Sicherheit',
    context: 'Ein Online-Händler mit Lieferungen in 14 EU-Länder hatte Probleme mit der korrekten Umsatzsteuerabwicklung. Unsicherheiten bei Registrierungspflichten und Steuersätzen führten zu einem hohen Risiko von Steuernachzahlungen und Bußgeldern.',
    action: 'Umfassende Analyse der Warenströme und Implementierung des One-Stop-Shop-Verfahrens. Einrichtung eines automatisierten Systems zur Erfassung der korrekten Steuersätze je nach Lieferland und Produktkategorie. Bereinigung von Altfällen durch freiwillige Offenlegung.',
    result: {
      text: 'Die Optimierung führte zu erheblichen finanziellen und operativen Vorteilen:',
      bulletpoints: [
        'Jährliche Kostenersparnis: 68.000 €',
        'Vermeidung von Bußgeldern (geschätztes Risiko: 120.000 €)',
        'Reduzierung des Verwaltungsaufwands um 75%'
      ]
    },
    datum: '05.06.2024'
  },
  {
    id: '5',
    titel: 'Steuergünstige Mitarbeiterbeteiligung für Startup',
    kurzbeschreibung: 'Implementierung eines ESOP-Modells mit optimalem Steuerzeitpunkt',
    ergebnis: 'Steuerersparnis von 145.000 € für das Team',
    context: 'Ein Technologie-Startup mit 18 Mitarbeitern wollte Schlüsselpersonal durch Unternehmensbeteiligung langfristig binden. Herkömmliche Beteiligungsmodelle hätten zu hohen Sofortsteuern für die Mitarbeiter geführt, was die Attraktivität deutlich reduziert hätte.',
    action: 'Entwicklung eines maßgeschneiderten virtuellen Beteiligungsprogramms (VSOP) mit steueroptimiertem Ausübungszeitpunkt. Rechtssichere Vertragsgestaltung und Integration in bestehende Vergütungsstrukturen. Implementierung einer digitalen Plattform zur transparenten Verwaltung der Anteile.',
    result: {
      text: 'Das optimierte Beteiligungsprogramm erzielte mehrere Vorteile:',
      bulletpoints: [
        'Steuerersparnis für die Mitarbeiter: 145.000 €',
        'Reduktion der Fluktuation um 65% innerhalb eines Jahres',
        'Attraktivitätssteigerung bei der Rekrutierung neuer Talente'
      ]
    },
    datum: '17.03.2024'
  },
];

interface FallstudienListeProps {
  visible: boolean;
  onClose: () => void;
  profileId?: string;
}

/**
 * FallstudienListe-Komponente
 * 
 * Zeigt eine Liste aller verfügbaren Fallstudien eines Beraters an.
 */
export function FallstudienListe({ visible, onClose, profileId }: FallstudienListeProps) {
  const colors = useThemeColor();
  const [selectedFallstudie, setSelectedFallstudie] = useState<any>(null);
  const [showFallstudieDetail, setShowFallstudieDetail] = useState(false);

  // Fallstudie zur detaillierten Ansicht auswählen
  const handleSelectFallstudie = (fallstudie: any) => {
    setSelectedFallstudie(fallstudie);
    setShowFallstudieDetail(true);
  };

  // Fallstudie-Detail schließen
  const handleCloseFallstudieDetail = () => {
    setShowFallstudieDetail(false);
  };

  // Rendert eine einzelne Fallstudie in der Liste
  const renderFallstudieItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.fallstudieItem, { backgroundColor: colors.backgroundSecondary }]}
      onPress={() => handleSelectFallstudie(item)}
    >
      <View style={styles.fallstudieContent}>
        <Text style={[styles.fallstudieTitel, { color: colors.textPrimary }]}>
          {item.titel}
        </Text>
        <Text 
          style={[styles.fallstudieKurzbeschreibung, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.kurzbeschreibung}
        </Text>
        <View style={styles.fallstudieErgebnisContainer}>
          <Text style={[styles.fallstudieErgebnis, { color: colors.primary }]}>
            Ergebnis: {item.ergebnis}
          </Text>
        </View>
        <Text style={[styles.fallstudieDatum, { color: colors.textTertiary }]}>
          {item.datum}
        </Text>
      </View>
      <View style={styles.fallstudieArrow}>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
          {/* Header mit Titel und Schließen-Button */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              Fallstudien
            </Text>
            <View style={styles.headerRight} />
          </View>

          {/* Einleitung */}
          <View style={styles.introContainer}>
            <Text style={[styles.introText, { color: colors.textSecondary }]}>
              Nachfolgend finden Sie alle Fallstudien mit Details zu erzielten Ergebnissen und Vorgehensweisen.
            </Text>
          </View>

          {/* Liste der Fallstudien */}
          <FlatList
            data={FALLSTUDIEN_MOCKDATA}
            renderItem={renderFallstudieItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </SafeAreaView>
      </Modal>

      {/* Detail-Ansicht einer Fallstudie */}
      {selectedFallstudie && (
        <FallstudieDetail
          visible={showFallstudieDetail}
          onClose={handleCloseFallstudieDetail}
          fallstudie={selectedFallstudie}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold as any,
  },
  headerRight: {
    width: 40, // Gleiche Breite wie der Zurück-Button für eine ausgeglichene Anordnung
  },
  introContainer: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.m,
  },
  introText: {
    fontSize: typography.fontSize.s,
    lineHeight: 20,
  },
  listContainer: {
    padding: spacing.m,
  },
  separator: {
    height: spacing.m,
  },
  fallstudieItem: {
    borderRadius: ui.borderRadius.m,
    padding: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fallstudieContent: {
    flex: 1,
  },
  fallstudieTitel: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.xs,
  },
  fallstudieKurzbeschreibung: {
    fontSize: typography.fontSize.s,
    lineHeight: 20,
    marginBottom: spacing.s,
  },
  fallstudieErgebnisContainer: {
    marginBottom: spacing.xs,
  },
  fallstudieErgebnis: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.semiBold as any,
  },
  fallstudieDatum: {
    fontSize: typography.fontSize.xs,
  },
  fallstudieArrow: {
    marginLeft: spacing.s,
  },
});

export default FallstudienListe; 