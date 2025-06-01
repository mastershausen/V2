import 'package:flutter/material.dart';

/// Case Study Modal Style Guide
/// 
/// Exact recreation of the React Native design for Flutter
/// No logic - only styling reference for developers
/// 
class CasestudyModalStyleGuide extends StatelessWidget {
  const CasestudyModalStyleGuide({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Dark neutral background overlay
      backgroundColor: const Color.fromRGBO(45, 45, 45, 0.85),
      body: Center(
        child: Container(
          // Modal size (92% of screen width, 85% of height)
          width: MediaQuery.of(context).size.width * 0.92,
          height: MediaQuery.of(context).size.height * 0.85,
          decoration: BoxDecoration(
            // White accent lines around the modal
            border: Border.all(
              color: Colors.white.withOpacity(0.3),
              width: 1.5,
            ),
            borderRadius: BorderRadius.circular(24),
            color: Colors.white,
            // Shadow effect
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.15),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // === GREEN HEADER ===
              Container(
                padding: const EdgeInsets.fromLTRB(24, 20, 24, 16),
                decoration: const BoxDecoration(
                  color: Color(0xFF1E6B55), // Petrol green
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(24),
                    topRight: Radius.circular(24),
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Title container
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.only(right: 16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // "Case Study" label
                            Text(
                              'Case Study',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.white.withOpacity(0.7),
                              ),
                            ),
                            const SizedBox(height: 4),
                            // Main title
                            const Text(
                              'Statik-Expertise for Multi-Family Homes',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                                height: 1.3,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    // X-Close button
                    Container(
                      width: 36,
                      height: 36,
                      margin: const EdgeInsets.only(top: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: const Icon(
                        Icons.close,
                        color: Colors.white,
                        size: 22,
                      ),
                    ),
                  ],
                ),
              ),

              // === WHITE CONTENT AREA ===
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Brief description with green accent line
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          border: Border(
                            bottom: BorderSide(
                              color: Colors.black.withOpacity(0.05),
                              width: 1,
                            ),
                          ),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Green accent line on the left
                            Container(
                              width: 3,
                              height: 80, // Adjustable based on text length
                              decoration: BoxDecoration(
                                color: const Color(0xFF1E6B55),
                                borderRadius: BorderRadius.circular(2),
                              ),
                            ),
                            const SizedBox(width: 12),
                            // Brief description text
                            const Expanded(
                              child: Text(
                                'Successful renovation of complex residential buildings with static challenges',
                                style: TextStyle(
                                  fontSize: 16,
                                  height: 1.5,
                                  color: Color(0xFF333333),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Content sections
                      Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          children: [
                            // === CONTEXT SECTION ===
                            _buildContentSection(
                              icon: Icons.description_outlined,
                              title: 'Context',
                              content: 'A listed multi-family house in Munich-Schwabing should be comprehensively renovated. The building structure had significant static defects, and the owner community was under time pressure and had to keep costs within the budget.',
                              subtitle: 'Initial situation / Customer / Challenge',
                            ),

                            const SizedBox(height: 28),

                            // === ACTION SECTION ===
                            _buildContentSection(
                              icon: Icons.settings_outlined,
                              title: 'Action',
                              content: 'Our team conducted a comprehensive analysis of the building structure, created a detailed renovation concept with BIM technology, and coordinated the work with local craftsmen. Through innovative solutions, we were able to resolve the static problems without affecting the historical substance.',
                              subtitle: 'Approach / Implementation / Methods',
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // === FOOTER WITH BUTTON ===
              Container(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.95),
                  border: Border(
                    top: BorderSide(
                      color: Colors.black.withOpacity(0.05),
                      width: 1,
                    ),
                  ),
                ),
                child: Row(
                  children: [
                    // Bookmark icon
                    Container(
                      padding: const EdgeInsets.all(12),
                      child: Icon(
                        Icons.bookmark_outline,
                        color: const Color(0xFF1E6B55),
                        size: 24,
                      ),
                    ),
                    
                    const SizedBox(width: 8),
                    
                    // Save Case Study button
                    Expanded(
                      child: Container(
                        height: 48,
                        decoration: BoxDecoration(
                          color: const Color(0xFF1E6B55),
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF1E6B55).withOpacity(0.3),
                              blurRadius: 8,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.check_circle_outline,
                              color: Colors.white,
                              size: 17,
                            ),
                            SizedBox(width: 8),
                            Text(
                              'Save Case Study',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Helper widget for content sections (Context, Action, etc.)
  Widget _buildContentSection({
    required IconData icon,
    required String title,
    required String content,
    required String subtitle,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section header with icon
        Row(
          children: [
            Icon(
              icon,
              size: 20,
              color: const Color(0xFF1E6B55),
            ),
            const SizedBox(width: 10),
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Color(0xFF1E4B5B),
              ),
            ),
          ],
        ),
        
        const SizedBox(height: 12),
        
        // Section content
        Text(
          content,
          style: const TextStyle(
            fontSize: 15,
            height: 1.47,
            color: Color(0xFF333333),
          ),
        ),
        
        const SizedBox(height: 16),
        
        // Section subtitle/hint
        Text(
          subtitle,
          style: TextStyle(
            fontSize: 12,
            color: const Color(0xFF888888),
            fontStyle: FontStyle.italic,
          ),
        ),
      ],
    );
  }
}

/// ============================================
/// STYLE GUIDE DOCUMENTATION
/// ============================================

class CasestudyModalStyleConstants {
  // === COLORS ===
  static const Color backgroundOverlay = Color.fromRGBO(45, 45, 45, 0.85);
  static const Color primaryGreen = Color(0xFF1E6B55);
  static const Color darkGreen = Color(0xFF1E4B5B);
  static const Color textPrimary = Color(0xFF333333);
  static const Color textSecondary = Color(0xFF888888);
  static const Color accentLine = Color(0xFF1E6B55);
  static const Color modalBackground = Colors.white;
  
  // === DIMENSIONS ===
  static const double modalWidth = 0.92; // 92% of screen width
  static const double modalHeight = 0.85; // 85% of screen height
  static const double borderRadius = 24.0;
  static const double accentLineWidth = 3.0;
  static const double borderWidth = 1.5;
  
  // === SPACING ===
  static const EdgeInsets headerPadding = EdgeInsets.fromLTRB(24, 20, 24, 16);
  static const EdgeInsets contentPadding = EdgeInsets.all(24);
  static const EdgeInsets footerPadding = EdgeInsets.fromLTRB(16, 16, 16, 24);
  static const double sectionSpacing = 28.0;
  static const double iconSpacing = 10.0;
  
  // === TYPOGRAPHY ===
  static const TextStyle headerLabel = TextStyle(
    fontSize: 14,
    color: Color.fromRGBO(255, 255, 255, 0.7),
  );
  
  static const TextStyle headerTitle = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: Colors.white,
    height: 1.3,
  );
  
  static const TextStyle sectionTitle = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: Color(0xFF1E4B5B),
  );
  
  static const TextStyle sectionContent = TextStyle(
    fontSize: 15,
    height: 1.47,
    color: Color(0xFF333333),
  );
  
  static const TextStyle sectionSubtitle = TextStyle(
    fontSize: 12,
    color: Color(0xFF888888),
    fontStyle: FontStyle.italic,
  );
  
  static const TextStyle buttonText = TextStyle(
    color: Colors.white,
    fontSize: 16,
    fontWeight: FontWeight.w600,
  );
}

/// ============================================
/// IMPLEMENTATION GUIDE FOR DEVELOPERS
/// ============================================
/// 
/// 1. Display modal as dialog/overlay using showDialog()
/// 2. Background with backgroundColor: Color.fromRGBO(45, 45, 45, 0.85)
/// 3. White accent lines: border: Border.all(color: Colors.white.withOpacity(0.3), width: 1.5)
/// 4. Green accent line left: Container with width: 3, color: Color(0xFF1E6B55)
/// 5. Shadow: boxShadow with color: Colors.black.withOpacity(0.15)
/// 6. Icons: Material Icons (description_outlined, settings_outlined, etc.)
/// 7. Button: Container with gradient-like shadow effect
/// 8. Responsive: MediaQuery.of(context).size for size calculations
/// 
/// All values are defined as constants for consistent implementation. 