import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useCart } from '../../context/CartContext';
import { getCurrentUserProfile } from '../../lib/supabase';

const { width, height } = Dimensions.get('window');

interface Reel {
  id: string;
  videoUrl: string;
  thumbnail: string;
  title: string;
  description: string;
  chef: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  dish?: {
    id: string;
    name: string;
    price: number;
  };
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isFollowing: boolean;
  tags: string[];
  duration: number;
}

// Mock data for reels
const mockReels: Reel[] = [
  {
    id: '1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    title: 'Perfect Crab Rangoon',
    description: 'Learn how to make the perfect crispy crab rangoon with this secret technique! 🦀✨',
    chef: {
      id: 'chef1',
      name: 'Chef Anna P',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      verified: true,
    },
    dish: {
      id: '1',
      name: 'Crab Rangoon',
      price: 499,
    },
    likes: 12400,
    comments: 342,
    shares: 89,
    isLiked: false,
    isFollowing: false,
    tags: ['#crabrangoon', '#cooking', '#crispy', '#appetizer'],
    duration: 45,
  },
  {
    id: '2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    title: 'Italian Pasta Magic',
    description: 'Making fresh pasta from scratch - it\'s easier than you think! 🍝',
    chef: {
      id: 'chef2',
      name: 'Chef Marco',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      verified: true,
    },
    dish: {
      id: '2',
      name: 'Fresh Pasta',
      price: 799,
    },
    likes: 8900,
    comments: 156,
    shares: 234,
    isLiked: true,
    isFollowing: true,
    tags: ['#pasta', '#italian', '#fresh', '#homemade'],
    duration: 60,
  },
  {
    id: '3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg',
    title: 'Sushi Rolling Masterclass',
    description: 'Watch me roll the perfect sushi in under 30 seconds! 🍣',
    chef: {
      id: 'chef3',
      name: 'Chef Yuki',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      verified: true,
    },
    dish: {
      id: '3',
      name: 'Dragon Roll',
      price: 1299,
    },
    likes: 15600,
    comments: 423,
    shares: 567,
    isLiked: false,
    isFollowing: false,
    tags: ['#sushi', '#japanese', '#rolling', '#fresh'],
    duration: 30,
  },
];

export default function ReelScreen() {
  const [reels, setReels] = useState<Reel[]>(mockReels);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const profile = await getCurrentUserProfile();
    setUserProfile(profile);
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }, []);

  const viewabilityConfig = useCallback(() => ({
    itemVisiblePercentThreshold: 80,
    waitForInteraction: false
  }), []);

  const handleLike = (reelId: string) => {
    setReels(prevReels => 
      prevReels.map(reel => 
        reel.id === reelId 
          ? { 
              ...reel, 
              isLiked: !reel.isLiked, 
              likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1 
            }
          : reel
      )
    );
  };

  const handleFollow = (chefId: string) => {
    setReels(prevReels => 
      prevReels.map(reel => 
        reel.chef.id === chefId 
          ? { ...reel, isFollowing: !reel.isFollowing }
          : reel
      )
    );
  };

  const handleComment = (reelId: string) => {
    Alert.alert('Comments', 'Comment feature coming soon!');
  };

  const handleShare = (reelId: string) => {
    Alert.alert('Share', 'Share feature coming soon!');
  };

  const handleAddToCart = (dish: any) => {
    if (dish) {
      addToCart({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image: reels.find(r => r.dish?.id === dish.id)?.thumbnail || '',
        quantity: 1,
        meal_type: 'dish',
      });
      Alert.alert('Added to Cart', `${dish.name} has been added to your cart!`);
    }
  };

  const navigateToChefProfile = (chefId: string) => {
    router.push(`/chef-details/${chefId}`);
  };

  const navigateToDishDetails = (dishId: string) => {
    router.push(`/dish-details/${dishId}`);
  };

  const renderReelItem = ({ item, index }: { item: Reel; index: number }) => (
    <View style={styles.reelContainer}>
      {/* Background Image */}
      <Image 
        source={{ uri: item.thumbnail }} 
        style={styles.backgroundImage} 
        resizeMode="cover"
      />
      
      {/* Dark Overlay */}
      <View style={styles.overlay} />

      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reels</Text>
        <TouchableOpacity style={styles.cameraButton}>
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Left Content */}
        <View style={styles.leftContent}>
          {/* Chef Info */}
          <TouchableOpacity 
            style={styles.chefContainer}
            onPress={() => navigateToChefProfile(item.chef.id)}
          >
            <Image source={{ uri: item.chef.avatar }} style={styles.chefAvatar} />
            <View style={styles.chefInfo}>
              <View style={styles.chefNameRow}>
                <Text style={styles.chefName}>{item.chef.name}</Text>
                {item.chef.verified && (
                  <Ionicons name="checkmark-circle" size={16} color="#D4A373" />
                )}
              </View>
              <TouchableOpacity 
                style={[styles.followBtn, item.isFollowing && styles.followingBtn]}
                onPress={() => handleFollow(item.chef.id)}
              >
                <Text style={[styles.followText, item.isFollowing && styles.followingText]}>
                  {item.isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Video Info */}
          <Text style={styles.videoTitle}>{item.title}</Text>
          <Text style={styles.videoDescription} numberOfLines={2}>
            {item.description}
          </Text>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {item.tags.slice(0, 3).map((tag, idx) => (
              <Text key={idx} style={styles.tag}>{tag}</Text>
            ))}
          </View>

          {/* Dish Container */}
          {item.dish && (
            <TouchableOpacity 
              style={styles.dishContainer}
              onPress={() => navigateToDishDetails(item.dish!.id)}
            >
              <View style={styles.dishInfo}>
                <Text style={styles.dishName}>{item.dish.name}</Text>
                <Text style={styles.dishPrice}>${(item.dish.price / 100).toFixed(2)}</Text>
              </View>
              <TouchableOpacity 
                style={styles.orderBtn}
                onPress={() => handleAddToCart(item.dish)}
              >
                <Text style={styles.orderText}>Order</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </View>

        {/* Right Actions */}
        <View style={styles.rightActions}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => handleLike(item.id)}
          >
            <Ionicons 
              name={item.isLiked ? "heart" : "heart-outline"} 
              size={32} 
              color={item.isLiked ? "#FF6B6B" : "white"} 
            />
            <Text style={styles.actionCount}>
              {item.likes > 1000 ? `${(item.likes / 1000).toFixed(1)}k` : item.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => handleComment(item.id)}
          >
            <Ionicons name="chatbubble-outline" size={32} color="white" />
            <Text style={styles.actionCount}>{item.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => handleShare(item.id)}
          >
            <Ionicons name="share-outline" size={32} color="white" />
            <Text style={styles.actionCount}>{item.shares}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="ellipsis-horizontal" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Duration Badge */}
      <View style={styles.durationBadge}>
        <Text style={styles.durationText}>{item.duration}s</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <FlatList
          data={reels}
          renderItem={renderReelItem}
          keyExtractor={(item) => item.id}
          pagingEnabled={true}
          showsVerticalScrollIndicator={false}
          snapToInterval={height}
          snapToAlignment="start"
          decelerationRate="fast"
          scrollEventThrottle={16}
          removeClippedSubviews={true}
          maxToRenderPerBatch={3}
          initialNumToRender={1}
          windowSize={5}
          getItemLayout={(data, index) => ({
            length: height,
            offset: height * index,
            index,
          })}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.y / height);
            setCurrentIndex(index);
          }}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig()}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  reelContainer: {
    width: width,
    height: height,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  cameraButton: {
    padding: 5,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  leftContent: {
    flex: 1,
    paddingRight: 80,
  },
  chefContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 10,
    alignSelf: 'flex-start',
  },
  chefAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#D4A373',
  },
  chefInfo: {
    flex: 1,
  },
  chefNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  chefName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
    flex: 1,
  },
  followBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#D4A373',
    borderRadius: 20,
    alignItems: 'center',
  },
  followingBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
  },
  followText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
  },
  followingText: {
    color: 'white',
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    lineHeight: 24,
  },
  videoDescription: {
    fontSize: 15,
    color: '#e0e0e0',
    marginBottom: 12,
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    fontSize: 13,
    color: '#D4A373',
    marginRight: 10,
    marginBottom: 4,
  },
  dishContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
  },
  dishInfo: {
    flex: 1,
    marginRight: 12,
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  dishPrice: {
    fontSize: 14,
    color: '#D4A373',
    fontWeight: 'bold',
  },
  orderBtn: {
    backgroundColor: '#D4A373',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  orderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  rightActions: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    alignItems: 'center',
  },
  actionBtn: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 8,
  },
  actionCount: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'center',
  },
  durationBadge: {
    position: 'absolute',
    top: 100,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  durationText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
});
