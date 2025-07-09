import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
  const videoRefs = useRef<any[]>([]);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const profile = await getCurrentUserProfile();
    setUserProfile(profile);
  };

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
        meal_type: 'dish', // Add required meal_type field
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
      {/* Video Background */}
      <Image 
        source={{ uri: item.thumbnail }} 
        style={styles.videoBackground} 
        resizeMode="cover"
      />
      
      {/* Overlay for better text visibility */}
      <View style={styles.overlay} />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Reels</Text>
        <TouchableOpacity>
          <Ionicons name="camera" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Content */}
      <View style={styles.bottomContent}>
        {/* Left Side - Content Info */}
        <View style={styles.leftContent}>
          {/* Chef Info */}
          <TouchableOpacity 
            style={styles.chefInfo}
            onPress={() => navigateToChefProfile(item.chef.id)}
          >
            <Image source={{ uri: item.chef.avatar }} style={styles.chefAvatar} />
            <View style={styles.chefDetails}>
              <View style={styles.chefNameContainer}>
                <Text style={styles.chefName}>{item.chef.name}</Text>
                {item.chef.verified && (
                  <Ionicons name="checkmark-circle" size={14} color="#C67C4E" />
                )}
              </View>
              <TouchableOpacity 
                style={[
                  styles.followButton, 
                  item.isFollowing && styles.followingButton
                ]}
                onPress={() => handleFollow(item.chef.id)}
              >
                <Text style={[
                  styles.followText, 
                  item.isFollowing && styles.followingText
                ]}>
                  {item.isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Video Title & Description */}
          <Text style={styles.videoTitle}>{item.title}</Text>
          <Text style={styles.videoDescription} numberOfLines={2}>
            {item.description}
          </Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, idx) => (
              <Text key={idx} style={styles.tag}>{tag}</Text>
            ))}
          </View>

          {/* Dish Info & Order Button */}
          {item.dish && (
            <TouchableOpacity 
              style={styles.dishContainer}
              onPress={() => navigateToDishDetails(item.dish!.id)}
            >
              <View style={styles.dishInfo}>
                <Text style={styles.dishName}>{item.dish.name}</Text>
                <Text style={styles.dishPrice}>${item.dish.price / 100}</Text>
              </View>
              <TouchableOpacity 
                style={styles.orderButton}
                onPress={() => handleAddToCart(item.dish)}
              >
                <Text style={styles.orderText}>Order</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </View>

        {/* Right Side - Action Buttons */}
        <View style={styles.rightActions}>
          {/* Like Button */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Ionicons 
              name={item.isLiked ? "heart" : "heart-outline"} 
              size={28} 
              color={item.isLiked ? "#FF6B6B" : "#fff"} 
            />
            <Text style={styles.actionText}>{item.likes > 1000 ? `${(item.likes / 1000).toFixed(1)}k` : item.likes}</Text>
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleComment(item.id)}
          >
            <Ionicons name="chatbubble-outline" size={28} color="#fff" />
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleShare(item.id)}
          >
            <Ionicons name="share-outline" size={28} color="#fff" />
            <Text style={styles.actionText}>{item.shares}</Text>
          </TouchableOpacity>

          {/* More Options */}
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="ellipsis-horizontal" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Video Duration Indicator */}
      <View style={styles.durationIndicator}>
        <Text style={styles.durationText}>{item.duration}s</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <FlatList
          data={reels}
          renderItem={renderReelItem}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={height}
          snapToAlignment="start"
          decelerationRate="fast"
          scrollEventThrottle={16}
          getItemLayout={(data, index) => ({
            length: height,
            offset: height * index,
            index,
          })}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.y / height);
            setCurrentIndex(index);
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
  },
  reelContainer: {
    width: width,
    height: height,
    position: 'relative',
  },
  videoBackground: {
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
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 20,
    zIndex: 10,
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
    maxWidth: width * 0.7,
  },
  chefInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chefAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  chefDetails: {
    flex: 1,
    minWidth: 0,
  },
  chefNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  chefName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 6,
    flexShrink: 1,
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#C67C4E',
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
  },
  followText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  followingText: {
    color: '#fff',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    lineHeight: 20,
  },
  videoDescription: {
    fontSize: 13,
    color: '#ddd',
    marginBottom: 10,
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    fontSize: 12,
    color: '#C67C4E',
    marginRight: 8,
    marginBottom: 2,
  },
  dishContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  dishInfo: {
    flex: 1,
    marginRight: 12,
    minWidth: 0,
  },
  dishName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  dishPrice: {
    fontSize: 13,
    color: '#C67C4E',
    fontWeight: 'bold',
  },
  orderButton: {
    backgroundColor: '#C67C4E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    flexShrink: 0,
  },
  orderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  rightActions: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 60,
    paddingBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
    width: 50,
  },
  actionText: {
    fontSize: 11,
    color: '#fff',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  durationIndicator: {
    position: 'absolute',
    top: 90,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
  },
});
