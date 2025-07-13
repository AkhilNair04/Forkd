import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  chefselection: undefined;
  ordertracking: { orderId: string; chefId: string };
  // ...other routes
};

type ChefSelectionProps = NativeStackScreenProps<RootStackParamList, 'chefselection'>;

type Chef = {
  id: string;
  name: string;
  specialty?: string;
};

const ChefSelection = ({ navigation }: ChefSelectionProps) => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefs = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('chefs').select('*');
      if (!error && data) setChefs(data);
      setLoading(false);
    };
    fetchChefs();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#D89B6A" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose a Chef</Text>
      <FlatList
        data={chefs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chefCard}
            onPress={() => navigation.navigate('ordertracking', { chefId: item.id, orderId: '' /* Replace with actual orderId when available */ })}
          >
            <Text style={styles.chefName}>{item.name}</Text>
            {item.specialty && <Text style={styles.chefSpecialty}>{item.specialty}</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181818', padding: 20 },
  header: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  chefCard: { backgroundColor: '#222', padding: 16, borderRadius: 10, marginBottom: 12 },
  chefName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  chefSpecialty: { color: '#D89B6A', fontSize: 14, marginTop: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#181818' },
});

export default ChefSelection;