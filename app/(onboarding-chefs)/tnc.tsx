// app/(onboarding-chefs)/TermsAndConditions.tsx
import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

export default function TermsAndConditions() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>HOME COOKs and CHEFs</Text>
      <Text style={styles.paragraph}>
        • Must possess a valid FSSAI Registration.{'\n'}
        • Must maintain basic hygiene and safety standards as outlined by FSSAI and platform guidelines.{'\n'}
        • Should list accurate menu items, ingredients, prices, preparation times, and portion sizes.{'\n'}
        • Must be available and responsive during committed working hours and order windows.{'\n'}
        • Responsible for timely preparation and handover of food to delivery partners or users.{'\n'}
        • Food must be prepared in a dedicated and hygienic kitchen space.{'\n'}
        • Must not use expired, unlabelled, or unsafe ingredients.{'\n'}
        • Must ensure allergy or dietary disclaimers are clearly mentioned if applicable.{'\n'}
        • Liable for any food safety violations; legal consequences may follow for negligence.
      </Text>

      <Text style={styles.heading}>ORDER FULFILLMENT</Text>
      <Text style={styles.paragraph}>
        • Once an order is accepted, it must be fulfilled unless:{'\n'}
        {'\u2022'} Medical or unavoidable emergency (inform ASAP).{'\n'}
        {'\u2022'} Stock/ingredients unavailable (rare).{'\n'}
        • Cancellations without valid reason may incur penalties or deactivation.{'\n'}
        • Full refunds and penalties apply if a cook cancels after acceptance.
      </Text>

      <Text style={styles.heading}>COMPLAINTS & PENALTIES</Text>
      <Text style={styles.paragraph}>
        • On food quality or mismatch complaints, Fork’d may investigate and issue refunds or deductions.{'\n'}
        • Repeated issues may lead to temporary or permanent delisting.{'\n'}
        • Must cooperate with Fork’d in resolving customer complaints.{'\n'}
        • Violations (hygiene, misrepresentation, poor service) → suspension, retraining, or ban.
      </Text>

      <Text style={styles.heading}>MINIMUM ACTIVITY & LICENSES</Text>
      <Text style={styles.paragraph}>
        • Minimum 40 orders/month; inability for 3 consecutive months → removal.{'\n'}
        • Renew FSSAI license, water analysis report, health card periodically; failure → immediate halt.{'\n'}
        • Chefs must provide these details on request.
      </Text>

      <Text style={styles.heading}>PAYOUT & COMMISSION</Text>
      <Text style={styles.paragraph}>
        • Fork’d operates commission-based; payouts weekly if:{'\n'}
        {'\u2022'} Orders completed without disputes.{'\n'}
        {'\u2022'} Valid FSSAI status; no pending complaints.{'\n'}
        • Fork’d may withhold/adjust payouts for:{'\n'}
        {'\u2022'} Verified complaints.{'\n'}
        {'\u2022'} Unjustified cancellations.{'\n'}
        {'\u2022'} Non-compliance with platform policies.
      </Text>

      <Text style={styles.heading}>FoSTaC & VERIFICATION</Text>
      <Text style={styles.paragraph}>
        • FoSTaC attendance & periodic verification required.{'\n'}
        • Non-cooperation or misconduct → removal.
      </Text>

      <Text style={styles.heading}>HOME VISITS & PROFESSIONALISM</Text>
      <Text style={styles.paragraph}>
        • Arrive on time, bring required tools, maintain hygiene & professionalism.{'\n'}
        • Adhere strictly to agreed menu, timing, service scope.{'\n'}
        • Respect the user’s home and leave it clean.
      </Text>

      <Text style={styles.heading}>EXTRA SERVICES</Text>
      <Text style={styles.paragraph}>
        • On-site tasks beyond meal prep (dishes, serving) must be pre-agreed or negotiated.{'\n'}
        • Special requests outside booking → cook’s discretion; may incur extra charges (inform support).
      </Text>

      <Text style={styles.heading}>SAFETY & EMERGENCIES</Text>
      <Text style={styles.paragraph}>
        • Engage only in professional, safe, non-intrusive behavior.{'\n'}
        • In equipment failures, inform user and adjust within reason.{'\n'}
        • Right to refuse unsafe/unsanitary locations or inappropriate user behavior.
      </Text>

      <Text style={styles.heading}>LEGAL & MISCELLANEOUS</Text>
      <Text style={styles.paragraph}>
        • Legal matters between cooks and clients; platform immune.{'\n'}
        • Cook protection mechanisms (security devices) optional; report misconduct within 2 hours.{'\n'}
        • Emergencies: inform platform & user ≥6 hours ahead. Late cancellations/no-shows → fee deductions or suspension.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#111',
  },
  heading: {
    color: '#FF9100',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22,
  },
});
