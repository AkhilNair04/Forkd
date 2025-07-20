import { useRouter } from 'expo-router';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

export default function TermsAndConditions() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Terms and Conditions</Text>
        <Text style={styles.body}>
          • Users must provide accurate delivery information including address,
          contact number, kitchen setup (appliances, cookware, gas/electric,
          water access), number of people to be served, date and time slot, any
          dietary preferences or restrictions, and any other special
          instructions.
          {'\n\n'}
          • Users agree to pay the listed price along with applicable taxes and
          delivery charges.
          {'\n\n'}
          • Users are responsible for reviewing food ingredients (allergens,
          dietary restrictions) before confirming the order. Fork’d does not
          take responsibility for personal allergies, reactions, or medical
          conditions resulting from food consumption.
          {'\n\n'}
          • Users must accept the food within the delivery window and inspect it
          upon receipt.
          {'\n\n'}
          • All listed home cooks are FSSAI registered or licensed. Users can
          view the cook’s profile, rating, and FSSAI number prior to placing an
          order. While Fork’d performs due diligence, it cannot physically
          inspect kitchens or guarantee compliance beyond documentation.
          {'\n\n'}
          • Cancellations are allowed only within 30 seconds of placing the
          order. No refunds will be issued thereafter.
          {'\n\n'}
          • Refunds may be issued if: (a) the delivery was significantly delayed
          (45+ mins beyond promised window), or (b) the item was incorrect or
          severely compromised.
          {'\n\n'}
          • Users must raise issues via the in-app support system within 2 hours
          of delivery. Any legal affairs must be discussed between participating
          parties. Fork’d is not responsible for any such actions.
          {'\n\n'}
          • It is prohibited to misuse the platform to harass or scam cooks or
          delivery personnel, place false or prank orders, upload offensive
          reviews, submit false complaints, or violate review guidelines.
          {'\n\n'}
          • Users must ensure a safe and clean environment for the chef to work
          in.
          {'\n\n'}
          • Users must be present or have a responsible adult present during the
          chef’s visit.
          {'\n\n'}
          • Users must treat the chef with respect and dignity. Harassment or
          inappropriate behavior will result in account suspension and possible
          legal action.
          {'\n\n'}
          • The user agrees that no recording (video/audio) of the chef will be
          made without consent.
          {'\n\n'}
          • Chefs will provide only the agreed cooking service (preparation and
          serving). Dishwashing, cleaning, or personal errands are not included
          unless explicitly mentioned. Additional services requested on the spot
          may incur extra charges at the chef’s discretion.
          {'\n\n'}
          • Cancellations for chef scheduling are allowed:
          {'\n'}– Up to 24 hours before: full refund.
          {'\n'}– 12–24 hours before: 50% refund.
          {'\n'}– Less than 12 hours: no refund unless for verified emergencies.
          Refunds are not applicable once the chef begins travel or preparation.
          {'\n\n'}
          • Any disputes related to service quality, behavior, or hygiene must
          be reported within 12 hours of service completion.
          {'\n\n'}
          • Fork’d will not be responsible for legal disputes between
          participating clients.
          {'\n\n'}
          • Cooks are allowed to undertake precautionary measures. Users may not
          interfere directly but can contact Fork’d’s support team if needed.
          {'\n\n'}
          • Fork’d verifies chefs for FSSAI compliance and basic credentials but
          does not guarantee service outcomes or personal compatibility.
          {'\n\n'}
          • Users must understand that this is a person-to-person service, and
          minor variations in taste, timing, or methods may occur.
        </Text>

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: {
    padding: 24,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 22,
  },
  backButton: {
    marginTop: 24,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#C67C4E',
    borderRadius: 16,
  },
  backText: {
    color: '#fff',
    fontWeight: '600',
  },
});
