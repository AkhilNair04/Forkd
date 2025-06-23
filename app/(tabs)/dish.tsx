import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const addresses = [
  "1234 Culinary Street, Flavor Town, Near Food Plaza, Opp. Tasty Tower, Apt 56, Delight City, Gourmet State",
  "Home Adress"
];

const selectedAddress = addresses[0].split(' ').slice(0, 4).join(' ') + '...';


const dishes = [
  {
    id: '1',
    name: 'Crab Rangoon',
    cuisine: 'American Cuisine',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
  },
  {
    id: '2',
    name: 'Rigatoni Pasta',
    cuisine: 'Italian Cuisine',
    rating: 4.5,
    image: 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg',
  },
  {
    id: '3',
    name: 'Chicken Biriyani',
    cuisine: 'Indian Cuisine',
    rating: 4.3,
    image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg',
  },
  {
    id: '4',
    name: 'Tteokbokki',
    cuisine: 'Korean Cuisine',
    rating: 4.2,
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg',
  },
  {
    id: '5',
    name: 'Tteokbokki',
    cuisine: 'Korean Cuisine',
    rating: 4.2,
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg',
  },
  {
    id: '6',
    name: 'Tteokbokki',
    cuisine: 'Korean Cuisine',
    rating: 4.2,
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg',
  },
  {
    id: '7',
    name: 'Tteokbokki',
    cuisine: 'Korean Cuisine',
    rating: 4.2,
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg',
  },
  {
    id: '8',
    name: 'Tteokbokki',
    cuisine: 'Korean Cuisine',
    rating: 4.2,
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg',
  },
  {
    id: '9',
    name: 'Rigatoni Pasta',
    cuisine: 'Italian Cuisine',
    rating: 4.5,
    image: 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg',
  },
  {
    id: '10',
    name: 'Rigatoni Pasta',
    cuisine: 'Italian Cuisine',
    rating: 4.5,
    image: 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg',
  },
];

export default function DishScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#111111' }} edges={['top', 'bottom']}>
          <StatusBar barStyle="light-content" backgroundColor="#000000" />
          <View style={styles.container}>
        <View style={styles.topBar}>
          <View>
            <View style={styles.row}>
              <Text style={styles.deliverText}>DELIVER TO</Text>
              <IconSymbol name="caretdown" size={12} color="#C67C4E" style={{marginLeft:4}} />

            </View>
            <View style={styles.row}>
              <Text style={styles.address}>{selectedAddress}</Text>
              <Ionicons name="chevron-down" size={14} color="#1a1a1a" style={{ marginLeft: 6 }} />
            </View>
          </View>

          <View style={styles.icons}>
            <View style={styles.badgeWrapper}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </View>
            <Ionicons name="cart-outline" size={24} color="white" style={{ marginLeft: 16 }} />
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              placeholder="Search cuisines, dishes..."
              placeholderTextColor="#999"
              style={styles.input}
            />
            <Ionicons name="mic" size={20} color="#999" />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>All Dishes</Text>
        <FlatList
          data={dishes}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.cuisine}>#{item.cuisine}</Text>
              <View style={styles.ratingRow}>
                <View style={styles.ratingLeft}>
                  <Ionicons name="star" size={16} color="#FDC913" />
                  <Text style={styles.rating}>{item.rating}</Text>
                </View>
                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={() =>
                    router.push({
                      pathname: '/dish-details/[dishId]',
                      params: { dishId: item.id },
                    })
                  }
                >
                  <Ionicons name="arrow-forward" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
        </SafeAreaView>
      
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  deliverText: {
    color: '#C67C4E',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  address: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#C67C4E',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    color: '#fff',
  },
  filterButton: {
    backgroundColor: '#C67C4E',
    padding: 10,
    borderRadius: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 6,
    width: '48%',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
  },
  dishName: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  cuisine: {
    color: '#32343E',
    fontSize: 12,
    marginVertical: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  ratingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#000',
    fontSize: 14,
    marginLeft: 4,
  },
  arrowButton: {
    backgroundColor: '#C67C4E',
    padding: 6,
    borderRadius: 20,
  },
});
