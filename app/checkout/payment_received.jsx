import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentReceivedScreen() {
  return (
    <SafeAreaView style={rstyles.container}>
      <View style={rstyles.circle}>
        <Feather name="check" size={110} color="#C48359" />
      </View>
      <Text style={rstyles.title}>Received!</Text>
      <Text style={rstyles.subtitle}>Your payment has been received, and the chef has been notified!</Text>
      <TouchableOpacity style={rstyles.btn} onPress={() => router.push('/orders/track')}>
        <Text style={rstyles.btnText}>TRACK ORDER</Text>
      </TouchableOpacity>
      <TouchableOpacity style={rstyles.pager} onPress={() => router.back()}>
        <Feather name="chevron-left" size={16} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const rstyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  circle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 4,
    borderColor: '#C48359',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginTop: 48 },
  subtitle: { color: '#bbb', textAlign: 'center', marginTop: 12, lineHeight: 20 },
  btn: {
    backgroundColor: '#C48359',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 40,
  },
  btnText: { color: '#fff', fontWeight: '600' },
  pager: { flexDirection: 'row', marginTop: 32, backgroundColor: '#2A2A2A', borderRadius: 24, padding: 8 },
});
