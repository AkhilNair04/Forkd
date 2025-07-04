// app/(onboarding-customers)/kyc_cus_dietary.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/constants/supabase';

const OPTIONS = [
  'Keto',
  'Vegetarian',
  'Pescatarian',
  'Vegan',
  'Gluten-free',
  'High-fiber',
  'Non-veg',
  'Lactose-intolerant',
  'Halal',
];

export default function KycCusDietary() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggle = (opt: string) => {
    setSelected((curr) =>
      curr.includes(opt) ? curr.filter((o) => o !== opt) : [...curr, opt]
    );
  };

  const handleConfirm = async () => {
    setLoading(true);
    // get current user
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      console.error(userErr);
      Alert.alert('Error', 'Could not identify user.');
      setLoading(false);
      return;
    }

    // update dietary_restrictions
    const { error: updateErr } = await supabase
      .from('user_profiles')
      .update({ dietary_restrictions: selected })
      .eq('user_id', user.id);

    setLoading(false);
    if (updateErr) {
      console.error(updateErr);
      Alert.alert('Error', 'Failed to save selections.');
      return;
    }

    // navigate next
    router.replace('/cus_location');
  };

  const handleSkip = () => {
    router.replace('/cus_location');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.inner}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>
          Select all of your dietary restrictions:
        </Text>

        <View style={styles.grid}>
          {OPTIONS.map((opt) => {
            const isSel = selected.includes(opt);
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.pill, isSel && styles.pillSelected]}
                onPress={() => toggle(opt)}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.pillText, isSel && styles.pillTextSelected]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, (!selected.length || loading) && styles.btnDisabled]}
            disabled={!selected.length || loading}
            onPress={handleConfirm}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>CONFIRM</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip} style={styles.skipWrap}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const PILL_HEIGHT = 40;
const PILL_PADDING = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  inner: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  pill: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: PILL_HEIGHT / 2,
    paddingHorizontal: PILL_PADDING,
    height: PILL_HEIGHT,
    justifyContent: 'center',
    margin: 6,
  },
  pillSelected: {
    backgroundColor: '#C67C4E',
    borderColor: '#C67C4E',
  },
  pillText: {
    color: '#fff',
    fontSize: 14,
  },
  pillTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  actions: {
    marginTop: 40,
    alignItems: 'center',
  },
  btn: {
    width: '100%',
    backgroundColor: '#C67C4E',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  skipWrap: {
    marginTop: 16,
  },
  skipText: {
    color: '#FF9900',
    fontSize: 16,
  },
});
