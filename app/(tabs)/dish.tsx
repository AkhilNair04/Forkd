import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    id: '4',
    name: 'Tteokbokki',
    cuisine: 'Korean Cuisine',
    rating: 4.2,
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg',
  },{
    id: '4',
    name: 'Tteokbokki',
    cuisine: 'Korean Cuisine',
    rating: 4.2,
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg',
  },
  {
    id: '4',
    name: 'Tteokbokki',
    cuisine: 'Korean Cuisine',
    rating: 4.2,
    image: 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg',
  },
];

export default function DishScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.addressText}>DELIVER TO
            <Text style={{ fontWeight: 'bold' }}> Home address....</Text>
          </Text>
          <View style={styles.icons}>
            <View style={styles.badgeWrapper}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
              <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
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
          keyExtractor={item => item.id}
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
                <TouchableOpacity style={styles.arrowButton}>
                  <Ionicons name="arrow-forward" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
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
    marginTop: 40,
  },
  addressText: {
    color: '#fff',
    fontSize: 14,
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