import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Clipboard,
  Alert,
  ScrollView,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReferralService, { ReferralStats } from '@/services/ReferralService';

const ReferralsPage: React.FC = () => {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const [pendingRewards, setPendingRewards] = useState(0);

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      // Generate or load user's referral code
      let code = await AsyncStorage.getItem('userReferralCode');
      if (!code) {
        code = await ReferralService.generateUserReferralCode();
        await AsyncStorage.setItem('userReferralCode', code);
      }
      setReferralCode(code);

      // Load referral stats using service
      const stats = await ReferralService.getReferralStats();
      setReferralCount(stats.count);
      setTotalRewards(stats.totalRewards);
      setPendingRewards(stats.pendingRewards);
    } catch (error) {
      console.error('Error loading referral data:', error);
    }
  };

  const copyReferralCode = async () => {
    try {
      await Clipboard.setString(referralCode);
      Alert.alert('Copied!', 'Referral code copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy referral code');
    }
  };

  const shareReferralCode = async () => {
    try {
      const shareUrl = `https://forkd.app/signup?ref=${referralCode}`;
      const message = `🍳 Join me on Forkd and get amazing home-cooked meals!\n\nUse my referral code: ${referralCode}\nOr click this link: ${shareUrl}\n\nYou'll get ₹100 off your first order and I'll get rewards too! 🎉`;
      
      await Share.share({
        message,
        title: 'Join Forkd with my referral code!',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share referral code');
    }
  };

  const copyReferralLink = async () => {
    try {
      const shareUrl = `https://forkd.app/signup?ref=${referralCode}`;
      await Clipboard.setString(shareUrl);
      Alert.alert('Copied!', 'Referral link copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy referral link');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Referrals & Rewards</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Referral Code Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Referral Code</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.referralCode}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyReferralCode}>
              <Feather name="copy" size={20} color="#C67C4E" />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionDescription}>
            Share this code with friends and family to earn rewards!
          </Text>
        </View>

        {/* Share Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share & Earn</Text>
          
          <TouchableOpacity style={styles.shareOption} onPress={shareReferralCode}>
            <View style={styles.shareIconContainer}>
              <Feather name="share-2" size={24} color="#C67C4E" />
            </View>
            <View style={styles.shareContent}>
              <Text style={styles.shareTitle}>Share Referral Code</Text>
              <Text style={styles.shareDescription}>Send via messages, social media, or email</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareOption} onPress={copyReferralLink}>
            <View style={styles.shareIconContainer}>
              <Feather name="link" size={24} color="#C67C4E" />
            </View>
            <View style={styles.shareContent}>
              <Text style={styles.shareTitle}>Copy Referral Link</Text>
              <Text style={styles.shareDescription}>Get direct signup link with your code</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Referral Stats</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{referralCount}</Text>
              <Text style={styles.statLabel}>Friends Joined</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹{totalRewards}</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹{pendingRewards}</Text>
              <Text style={styles.statLabel}>Pending Rewards</Text>
            </View>
          </View>

          {/* View Rewards Button */}
          <TouchableOpacity 
            style={styles.viewRewardsButton}
            onPress={() => router.push('/customer-settings/rewards')}
          >
            <Feather name="gift" size={16} color="#fff" />
            <Text style={styles.viewRewardsText}>View My Rewards</Text>
          </TouchableOpacity>
        </View>

        {/* How it Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.stepContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Share Your Code</Text>
                <Text style={styles.stepDescription}>Send your referral code to friends and family</Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>They Sign Up</Text>
                <Text style={styles.stepDescription}>Your friend uses your code during signup</Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Both Get Rewards</Text>
                <Text style={styles.stepDescription}>You get ₹200 coupon, they get ₹100 off first order</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.section}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.termsText}>
            • Referral rewards are credited after your friend's first successful order{'\n'}
            • Each person can only be referred once{'\n'}
            • Rewards expire after 90 days if unused{'\n'}
            • Forkd reserves the right to modify the referral program at any time
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 38,
    marginLeft: 14,
    marginBottom: 25,
  },
  backButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 30,
    padding: 7,
    marginRight: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  headerText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionDescription: {
    color: '#999',
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  referralCode: {
    flex: 1,
    color: '#C67C4E',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  copyButton: {
    padding: 8,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  shareIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  shareContent: {
    flex: 1,
  },
  shareTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  shareDescription: {
    color: '#999',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  statNumber: {
    color: '#C67C4E',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
  stepContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#C67C4E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
  },
  termsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  termsText: {
    color: '#999',
    fontSize: 14,
    lineHeight: 22,
  },
  viewRewardsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    justifyContent: 'center',
  },
  viewRewardsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ReferralsPage;
