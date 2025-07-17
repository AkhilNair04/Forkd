import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SuccessScreen() {
  return (
    <SafeAreaView style={sstyles.container}>
      <View style={sstyles.circle}>
        <Feather name="check" size={110} color="#C48359" />
      </View>
      <Text style={sstyles.title}>Congratulations!</Text>
      <Text style={sstyles.subtitle}>You have successfully booked your chef!{"\n"}Click below for more details.</Text>
      <TouchableOpacity style={sstyles.btn} onPress={() => router.push('/orders')}>
        <Text style={sstyles.btnText}>CHECK DETAILS</Text>
      </TouchableOpacity>
      <TouchableOpacity style={sstyles.pager} onPress={() => router.back()}>
        <Feather name="chevron-left" size={16} color="#fff" />
        <Feather name="chevron-right" size={16} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const sstyles = StyleSheet.create({
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