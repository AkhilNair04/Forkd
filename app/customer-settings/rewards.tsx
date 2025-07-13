import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, View, Text, ScrollView, TouchableOpacity,
  Alert, StyleSheet, RefreshControl
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReferralService, ReferralReward } from '@/services/ReferralService';

export default function RewardsScreen() {
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      setLoading(true);
      const userRewards = await AsyncStorage.getItem('userRewards');
      if (userRewards) {
        const parsedRewards: ReferralReward[] = JSON.parse(userRewards);
        setRewards(parsedRewards);
      }
    } catch (error) {
      console.error('Error loading rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRewards();
    setRefreshing(false);
  };

  const useReward = async (rewardId: string) => {
    try {
      const success = await ReferralService.useReferralReward(rewardId);
      if (success) {
        Alert.alert(
          'Reward Applied!',
          'Your reward has been applied to your next order.',
          [{ text: 'Great!', style: 'default' }]
        );
        await loadRewards(); // Refresh rewards list
      } else {
        Alert.alert('Error', 'Failed to apply reward. Please try again.');
      }
    } catch (error) {
      console.error('Error using reward:', error);
      Alert.alert('Error', 'Failed to apply reward. Please try again.');
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount':
        return '💰';
      case 'free_delivery':
        return '🚚';
      case 'cashback':
        return '💸';
      default:
        return '🎁';
    }
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const activeRewards = rewards.filter(reward => !reward.used && new Date(reward.expiresAt) > new Date());
  const expiredRewards = rewards.filter(reward => !reward.used && new Date(reward.expiresAt) <= new Date());
  const usedRewards = rewards.filter(reward => reward.used);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Rewards</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Active Rewards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Rewards ({activeRewards.length})</Text>
          {activeRewards.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>🎁</Text>
              <Text style={styles.emptyTitle}>No active rewards</Text>
              <Text style={styles.emptySubtitle}>
                Refer friends to earn rewards!
              </Text>
              <TouchableOpacity 
                style={styles.referButton}
                onPress={() => router.push('/customer-settings/referrals')}
              >
                <Text style={styles.referButtonText}>Start Referring</Text>
              </TouchableOpacity>
            </View>
          ) : (
            activeRewards.map((reward) => (
              <View key={reward.id} style={styles.rewardCard}>
                <View style={styles.rewardHeader}>
                  <Text style={styles.rewardIcon}>{getRewardIcon(reward.type)}</Text>
                  <View style={styles.rewardInfo}>
                    <Text style={styles.rewardTitle}>{reward.description}</Text>
                    <Text style={styles.rewardValue}>₹{reward.amount} off</Text>
                    <Text style={styles.rewardExpiry}>
                      Expires: {formatExpiryDate(reward.expiresAt)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.useButton}
                  onPress={() => useReward(reward.id)}
                >
                  <Text style={styles.useButtonText}>Use Now</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Used Rewards Section */}
        {usedRewards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Used Rewards ({usedRewards.length})</Text>
            {usedRewards.map((reward) => (
              <View key={reward.id} style={[styles.rewardCard, styles.usedCard]}>
                <View style={styles.rewardHeader}>
                  <Text style={styles.rewardIcon}>{getRewardIcon(reward.type)}</Text>
                  <View style={styles.rewardInfo}>
                    <Text style={[styles.rewardTitle, styles.usedText]}>{reward.description}</Text>
                    <Text style={[styles.rewardValue, styles.usedText]}>₹{reward.amount} off</Text>
                    <Text style={[styles.rewardExpiry, styles.usedText]}>
                      Used: {formatExpiryDate(reward.timestamp)}
                    </Text>
                  </View>
                </View>
                <View style={styles.usedBadge}>
                  <Text style={styles.usedBadgeText}>USED</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Expired Rewards Section */}
        {expiredRewards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expired Rewards ({expiredRewards.length})</Text>
            {expiredRewards.map((reward) => (
              <View key={reward.id} style={[styles.rewardCard, styles.expiredCard]}>
                <View style={styles.rewardHeader}>
                  <Text style={styles.rewardIcon}>{getRewardIcon(reward.type)}</Text>
                  <View style={styles.rewardInfo}>
                    <Text style={[styles.rewardTitle, styles.expiredText]}>{reward.description}</Text>
                    <Text style={[styles.rewardValue, styles.expiredText]}>₹{reward.amount} off</Text>
                    <Text style={[styles.rewardExpiry, styles.expiredText]}>
                      Expired: {formatExpiryDate(reward.expiresAt)}
                    </Text>
                  </View>
                </View>
                <View style={styles.expiredBadge}>
                  <Text style={styles.expiredBadgeText}>EXPIRED</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  rewardCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  usedCard: {
    backgroundColor: '#f8f8f8',
    borderColor: '#e0e0e0',
  },
  expiredCard: {
    backgroundColor: '#f8f8f8',
    borderColor: '#e0e0e0',
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  rewardValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B35',
    marginBottom: 2,
  },
  rewardExpiry: {
    fontSize: 12,
    color: '#666',
  },
  useButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  useButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  usedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  usedBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  expiredBadge: {
    backgroundColor: '#999',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  expiredBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  usedText: {
    color: '#999',
  },
  expiredText: {
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  referButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  referButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
