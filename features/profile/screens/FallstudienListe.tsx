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
import { CasestudyListCard } from '@/shared-components/cards';

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
    compactSummary: 'Holding structure for digital agency group slashed annual tax burden by €84,000. Complete restructuring implemented in 3 months with improved liquidity for growth financing.',
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
    compactSummary: 'Fully digital accounting system cut administrative costs by 40% for e-commerce company. €37,500 annual savings with monthly closings reduced from 15 to 3 days.',
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
    compactSummary: 'Multi-stage succession strategy for family business saved €325,000 in transfer taxes. 4-year implementation preserved 5 jobs and avoided family conflicts.',
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
    compactSummary: 'One-Stop-Shop VAT procedure for EU retailer generated €68,000 annual savings. Avoided €120,000 fine risk and reduced administrative effort by 75%.',
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
    compactSummary: 'Virtual participation program (VSOP) saved startup team €145,000 in taxes. Reduced employee fluctuation by 65% and boosted recruiting attractiveness.',
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
  {
    id: '6',
    titel: 'Real estate portfolio optimization generates 23% ROI',
    kurzbeschreibung: 'Strategic restructuring of commercial real estate investments',
    compactSummary: 'Portfolio restructuring for real estate investor achieved 23% ROI boost. Tax-optimized holding structure reduced annual burden by €156,000 through depreciation strategies.',
    ergebnis: '23% ROI increase and €156,000 tax savings',
    context: 'A real estate investor with 12 commercial properties faced declining returns and high tax liabilities. The portfolio lacked strategic structure and missed depreciation opportunities.',
    action: 'Complete portfolio analysis and restructuring through optimized holding companies. Implementation of accelerated depreciation schedules and strategic property exchanges under Section 1031.',
    result: {
      text: 'The restructuring delivered significant financial improvements:',
      bulletpoints: [
        'ROI increase from 8.2% to 23.1%',
        'Annual tax savings: €156,000',
        'Improved cash flow by 45%'
      ]
    },
    datum: '08.11.2023'
  },
  {
    id: '7',
    titel: 'International expansion with 67% cost reduction',
    kurzbeschreibung: 'Tax-efficient setup for European market entry',
    compactSummary: 'European expansion strategy for SaaS company cut operational costs by 67%. Strategic entity placement saved €280,000 annually while ensuring IP protection.',
    ergebnis: '67% cost reduction and €280,000 annual savings',
    context: 'A growing SaaS company wanted to expand into European markets but faced complex tax implications and high operational costs for international setup.',
    action: 'Design of multi-jurisdictional structure with Netherlands holding, Irish IP company, and operational entities. Implementation of transfer pricing policies and EU regulatory compliance.',
    result: {
      text: 'The international structure achieved remarkable efficiency:',
      bulletpoints: [
        'Operational cost reduction: 67%',
        'Annual tax optimization: €280,000',
        'Streamlined compliance across 8 EU countries'
      ]
    },
    datum: '22.09.2023'
  },
  {
    id: '8',
    titel: 'Business sale preparation increases valuation by 40%',
    kurzbeschreibung: 'Strategic optimization for maximum exit value',
    compactSummary: 'Pre-sale optimization strategy boosted company valuation by 40% in 18 months. Clean financial structure and IP protection added €1.2M to final sale price.',
    ergebnis: '40% valuation increase, €1.2M additional value',
    context: 'A manufacturing company owner planned to sell within 2 years but the business had organizational and financial inefficiencies that would reduce the sale price.',
    action: 'Comprehensive business optimization including clean financial reporting, IP protection, operational improvements, and strategic positioning for maximum buyer appeal.',
    result: {
      text: 'The preparation strategy significantly enhanced sale value:',
      bulletpoints: [
        'Valuation increase: 40% (€1.2M additional)',
        'Sale process accelerated by 8 months',
        'Multiple qualified buyers in bidding war'
      ]
    },
    datum: '14.07.2023'
  },
  {
    id: '9',
    titel: 'Asset protection shields €3.8M from litigation risk',
    kurzbeschreibung: 'Comprehensive wealth protection strategy implementation',
    compactSummary: 'Multi-layered asset protection structure safeguarded €3.8M family wealth. Domestic and offshore strategies reduced litigation exposure by 89% while maintaining liquidity.',
    ergebnis: '€3.8M protected, 89% risk reduction',
    context: 'A successful entrepreneur faced increasing litigation risks due to business activities and needed to protect family wealth while maintaining operational flexibility.',
    action: 'Implementation of domestic asset protection trusts, international structures, and insurance strategies. Creation of multiple legal barriers while preserving access to assets.',
    result: {
      text: 'The protection strategy delivered comprehensive security:',
      bulletpoints: [
        'Assets protected: €3.8M',
        'Litigation risk reduction: 89%',
        'Maintained 95% liquidity access'
      ]
    },
    datum: '30.05.2023'
  }
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

  // Rendert eine einzelne Fallstudie in der Liste mit CasestudyListCard
  const renderFallstudieItem = ({ item }: { item: any }) => (
    <CasestudyListCard
      variant="compact"
      title={item.titel}
      description={item.kurzbeschreibung}
      result={item.result.text}
      compactSummary={item.compactSummary}
      onInfoPress={() => handleSelectFallstudie(item)}
      style={{ marginBottom: spacing.m }}
    />
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
                ? `Max Weber's Verified ${t('casestudy.list.title')}`
                : `Max Weber's ${t('casestudy.list.title')}`
              }
            </Text>
            <View style={styles.headerRight} />
          </View>

          {/* Liste der Fallstudien */}
          <FlatList
            data={displayedFallstudien}
            renderItem={renderFallstudieItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
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
  listContainer: {
    padding: spacing.m,
    paddingTop: spacing.l,
  },
});

export default FallstudienListe; 