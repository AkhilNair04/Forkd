// app/(onboarding-chefs)/TermsAndConditions.tsx
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function TermsAndConditions() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>HOME COOKS AND CHEFS</Text>
      <Text style={styles.paragraph}>
        • Must possess a valid FSSAI Registration.{'\n'}
        • Must maintain basic hygiene and safety standards as outlined by FSSAI and platform guidelines.{'\n'}
        • Should list accurate menu items, ingredients, prices, preparation times, and portion sizes.{'\n'}
        • Must be available and responsive during working hours and order windows they’ve committed to.{'\n'}
        • Responsible for timely preparation and handover of food to delivery partners or users.{'\n'}
        • Food must be prepared in a dedicated and hygienic kitchen space.{'\n'}
        • Must not use expired, unlabelled, or unsafe ingredients.{'\n'}
        • Must ensure allergy or dietary disclaimers are clearly mentioned if applicable.{'\n'}
        • Liable for any food safety violations; legal consequences may follow for negligence.
      </Text>

      <Text style={styles.heading}>ORDER FULFILLMENT</Text>
      <Text style={styles.paragraph}>
        • Once an order is accepted, it must be fulfilled unless:{'\n'}
        {'\u2022'} Medical or unavoidable emergency (must be informed ASAP).{'\n'}
        {'\u2022'} Stock or ingredients are unavailable (rare and discouraged).{'\n'}
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
        • Minimum 40 orders/month; failure for 3 consecutive months → removal from platform.{'\n'}
        • Renew FSSAI license, water analysis report, and health card periodically; failure → immediate halt.{'\n'}
        • Chefs must provide these documents whenever requested.
      </Text>

      <Text style={styles.heading}>PAYOUT & COMMISSION</Text>
      <Text style={styles.paragraph}>
        • Fork’d operates on a commission-based model. Payouts processed weekly upon:{'\n'}
        {'\u2022'} Completed orders without disputes.{'\n'}
        {'\u2022'} Valid FSSAI registration.{'\n'}
        {'\u2022'} No pending complaints.{'\n'}
        • Fork’d may withhold or adjust payouts for:{'\n'}
        {'\u2022'} Verified complaints.{'\n'}
        {'\u2022'} Unjustified cancellations.{'\n'}
        {'\u2022'} Non-compliance with platform policies.{'\n'}
        • Fork’d retains a service commission from the chef’s fee.
      </Text>

      <Text style={styles.heading}>FoSTaC & VERIFICATION</Text>
      <Text style={styles.paragraph}>
        • FoSTaC attendance and periodic verification is required.{'\n'}
        • Non-cooperation or misconduct may lead to removal from the platform.
      </Text>

      <Text style={styles.heading}>HOME VISITS & PROFESSIONALISM</Text>
      <Text style={styles.paragraph}>
        • Arrive on time, bring personal tools, maintain hygiene and professionalism.{'\n'}
        • Stick to agreed menu, timing, and service scope.{'\n'}
        • Respect user’s home and leave the space clean.
      </Text>

      <Text style={styles.heading}>EXTRA SERVICES</Text>
      <Text style={styles.paragraph}>
        • Extra services (dishes, serving, etc.) must be pre-agreed or negotiated on-site.{'\n'}
        • Special requests outside the booking are at the cook’s discretion and may incur additional charges (inform Fork’d support).
      </Text>

      <Text style={styles.heading}>SAFETY & EMERGENCIES</Text>
      <Text style={styles.paragraph}>
        • Cooks must behave professionally, safely, and respectfully.{'\n'}
        • Equipment failure (e.g., gas, water) must be informed to the user and adjusted for reasonably.{'\n'}
        • Right to refuse service in unsafe or inappropriate situations.{'\n'}
        • Cooks may use security devices for protection. Misconduct must be reported within 2 hours.
      </Text>

      <Text style={styles.heading}>LEGAL & MISCELLANEOUS</Text>
      <Text style={styles.paragraph}>
        • Legal disputes are between cooks and clients; Fork’d holds no liability.{'\n'}
        • If unable to visit due to emergency, inform user and platform ≥6 hours in advance.{'\n'}
        • Late cancellations or no-shows → partial/full fee deductions or account suspension.
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
