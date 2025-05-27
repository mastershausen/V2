import React, { useState, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';

import { useThemeColor } from '@/hooks/useThemeColor';
import { spacing } from '@/config/theme/spacing';
import { typography } from '@/config/theme/typography';
import { ui } from '@/config/theme/ui';
import { changeLanguage } from '@/i18n/config';

import FallstudieDetail from '@/features/chats/components/FallstudieDetail';

// Fensterbreite für Berechnungen
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Mockdaten für Fallstudien
const FALLSTUDIEN_MOCKDATA = [
  {
    id: '1',
    titel: 'Holding structure saves €84,000 annually',
    kurzbeschreibung: 'Digital holding setup for agency group, implemented in 3 months',
    ergebnis: '€84,000 savings annually',
    context: 'An expanding digital agency with 4 locations and 45 employees had an inefficient corporate structure due to growth and organic development. The previous taxation led to high tax payments and liquidity problems for investments.',
    action: 'Design and implementation of a holding structure with a management GmbH as umbrella and operational subsidiaries. Establishment of internal group accounting models and implementation of a digital reporting system for transparency and control.',
    result: {
      text: 'The optimized structure led to significant tax advantages and better risk distribution:',
      bulletpoints: [
        'Tax savings: €84,000 per year',
        'Improved liquidity for growth financing',
        'Risk minimization through separate companies'
      ]
    },
    datum: '03.05.2025'
  },
  {
    id: '2',
    titel: 'Digitalized accounting reduces administrative costs by 40%',
    kurzbeschreibung: 'Implementation of a fully digital accounting solution for an e-commerce company',
    ergebnis: '€37,500 cost reduction per year',
    context: 'An e-commerce company with 12 employees and €3.2 million annual revenue was working with manual accounting processes. The paper-based processing caused high administrative costs and regular delays in monthly closings.',
    action: 'Implementation of a fully digital accounting system with automatic document capture, AI-supported pre-accounting, and interfaces to the online shop. Training of the team and development of digital workflows for all financial processes.',
    result: {
      text: 'The digitization led to significant efficiency improvements:',
      bulletpoints: [
        'Reduction of accounting costs by 40% (€37,500 p.a.)',
        'Monthly closings in 3 instead of 15 days',
        'Real-time financial overviews for better business decisions'
      ]
    },
    datum: '12.02.2025'
  },
  {
    id: '3',
    titel: 'Succession planning with tax advantage of €325,000',
    kurzbeschreibung: 'Structured company transfer to the next generation with optimized tax planning',
    ergebnis: '€325,000 tax savings on transfer',
    context: 'A family business in mechanical engineering with 28 employees and €6.8 million annual revenue was facing transfer to the next generation. The company value was estimated at approximately €4.5 million. A direct transfer would have caused significant inheritance and gift taxes.',
    action: 'Development of a multi-stage succession strategy with establishment of a family holding, gradual transfer of shares, and preparatory measures for the use of allowances and valuation discounts. Implementation over a period of 4 years.',
    result: {
      text: 'The structured succession planning led to significant advantages:',
      bulletpoints: [
        'Tax savings on transfer: €325,000',
        'Preservation of 5 jobs through better liquidity',
        'Conflict avoidance in the family through clear structures'
      ]
    },
    datum: '24.10.2024'
  },
  {
    id: '4',
    titel: 'VAT optimization for international online retailer',
    kurzbeschreibung: 'Restructuring of VAT processing in European e-commerce',
    ergebnis: '€68,000 savings and compliance security',
    context: 'An online retailer with deliveries to 14 EU countries had problems with correct VAT processing. Uncertainties regarding registration obligations and tax rates led to a high risk of tax arrears and fines.',
    action: 'Comprehensive analysis of goods flows and implementation of the One-Stop-Shop procedure. Setup of an automated system for recording the correct tax rates depending on the country of delivery and product category. Resolution of old cases through voluntary disclosure.',
    result: {
      text: 'The optimization led to significant financial and operational advantages:',
      bulletpoints: [
        'Annual cost savings: €68,000',
        'Avoidance of fines (estimated risk: €120,000)',
        'Reduction of administrative effort by 75%'
      ]
    },
    datum: '05.06.2024'
  },
  {
    id: '5',
    titel: 'Tax-efficient employee participation for startup',
    kurzbeschreibung: 'Implementation of an ESOP model with optimal tax timing',
    ergebnis: 'Tax savings of €145,000 for the team',
    context: 'A technology startup with 18 employees wanted to retain key personnel through company participation. Conventional participation models would have led to high immediate taxes for employees, significantly reducing attractiveness.',
    action: 'Development of a customized virtual participation program (VSOP) with tax-optimized exercise timing. Legally secure contract design and integration into existing compensation structures. Implementation of a digital platform for transparent management of shares.',
    result: {
      text: 'The optimized participation program achieved several advantages:',
      bulletpoints: [
        'Tax savings for employees: €145,000',
        'Reduction of fluctuation by 65% within one year',
        'Increased attractiveness in recruiting new talent'
      ]
    },
    datum: '17.03.2024'
  },
];

interface FallstudienListeProps {
  visible: boolean;
  onClose: () => void;
  profileId?: string;
  filterVerified?: boolean;
}

/**
 * FallstudienListe-Komponente
 * 
 * Zeigt eine Liste aller verfügbaren Fallstudien eines Beraters an.
 */
export function FallstudienListe({ visible, onClose, profileId, filterVerified = false }: FallstudienListeProps) {
  const colors = useThemeColor();
  const [selectedFallstudie, setSelectedFallstudie] = useState<any>(null);
  const [showFallstudieDetail, setShowFallstudieDetail] = useState(false);
  const { t } = useTranslation();

  // Set language to English
  useEffect(() => {
    changeLanguage('en');
  }, []);

  // Daten filtern basierend auf dem filterVerified-Parameter
  const displayedFallstudien = filterVerified 
    ? FALLSTUDIEN_MOCKDATA.filter((studie, index) => index % 2 === 0) // Simuliert verifizierte Fallstudien (für Demozwecke)
    : FALLSTUDIEN_MOCKDATA;

  // Bestimme, ob eine Fallstudie verifiziert ist (für dieses Beispiel: jede zweite)
  const isVerified = (id: string) => {
    const index = parseInt(id, 10) - 1;
    return index >= 0 && index % 2 === 0;
  };

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
        <View style={styles.fallstudieTitelContainer}>
          <Text style={[styles.fallstudieTitel, { color: colors.textPrimary }]}>
            {item.titel}
          </Text>
          {isVerified(item.id) && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#00A041" />
              <Text style={styles.verifiedText}>{t('verification.badge.verified')}</Text>
            </View>
          )}
        </View>
        <Text 
          style={[styles.fallstudieKurzbeschreibung, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.kurzbeschreibung}
        </Text>
        <View style={styles.fallstudieErgebnisContainer}>
          <Text style={[styles.fallstudieErgebnis, { color: colors.primary }]}>
            {t('casestudy.list.result')}: {item.ergebnis}
          </Text>
        </View>
        <Text style={[styles.fallstudieDatum, { color: colors.textTertiary }]}>
          {item.datum}
        </Text>
      </View>
      <View style={styles.fallstudieArrow}>
        <Ionicons name="chevron-forward" size={24} color={colors.primary + '80'} />
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
              {filterVerified 
                ? t('profile.stats.verified') + ' ' + t('casestudy.list.title')
                : t('casestudy.list.title')
              }
            </Text>
            <View style={styles.headerRight} />
          </View>

          {/* Einleitung */}
          <View style={styles.introContainer}>
            <Text style={[styles.introText, { color: colors.textSecondary }]}>
              {filterVerified 
                ? t('casestudy.list.verifiedIntro')
                : t('casestudy.list.intro')
              }
            </Text>
          </View>

          {/* Liste der Fallstudien */}
          <FlatList
            data={displayedFallstudien}
            renderItem={renderFallstudieItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={[styles.separator, { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider }]} />
            )}
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.fontSize.l,
    fontWeight: typography.fontWeight.bold as any,
    letterSpacing: -0.5,
  },
  headerRight: {
    width: 40, // Gleiche Breite wie der Zurück-Button für eine ausgeglichene Anordnung
  },
  introContainer: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.m,
    paddingTop: spacing.s,
    backgroundColor: 'rgba(245,247,250,0.5)',
  },
  introText: {
    fontSize: typography.fontSize.s,
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  listContainer: {
    padding: spacing.m,
    paddingTop: spacing.l,
  },
  separator: {
    height: spacing.m,
    marginHorizontal: spacing.m,
  },
  fallstudieItem: {
    borderRadius: ui.borderRadius.m,
    padding: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  fallstudieContent: {
    flex: 1,
  },
  fallstudieTitelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fallstudieTitel: {
    fontSize: typography.fontSize.m,
    fontWeight: typography.fontWeight.bold as any,
    marginBottom: spacing.xs,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(0, 160, 65, 0.1)',
    borderRadius: ui.borderRadius.s,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    marginLeft: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold as any,
    color: '#00A041',
    marginLeft: 2,
  },
  fallstudieKurzbeschreibung: {
    fontSize: typography.fontSize.s,
    lineHeight: 20,
    marginBottom: spacing.s,
  },
  fallstudieErgebnisContainer: {
    marginBottom: spacing.xs,
    backgroundColor: 'rgba(30, 107, 85, 0.1)',
    borderRadius: ui.borderRadius.s,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  fallstudieErgebnis: {
    fontSize: typography.fontSize.s,
    fontWeight: typography.fontWeight.semiBold as any,
  },
  fallstudieDatum: {
    fontSize: typography.fontSize.xs,
    fontStyle: 'italic',
  },
  fallstudieArrow: {
    marginLeft: spacing.s,
  },
});

export default FallstudienListe; 