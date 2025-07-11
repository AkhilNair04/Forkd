import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReferralService, ReferralReward } from '@/services/ReferralService';

/**
 * Test script to generate sample referral data for testing the referral system
 * This can be called from the app during development to populate test data
 */

export class ReferralTestHelper {
  
  /**
   * Generate sample referral rewards for testing
   */
  static async generateSampleRewards() {
    const sampleRewards: ReferralReward[] = [
      {
        id: 'reward_1',
        type: 'referee',
        amount: 100,
        description: 'Welcome Bonus - First Order Discount',
        referralCode: 'FORKD123456',
        timestamp: new Date().toISOString(),
        used: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      },
      {
        id: 'reward_2',
        type: 'referrer',
        amount: 200,
        description: 'Referral Bonus - Friend Joined',
        referralCode: 'FORKD123456',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        used: true,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
      },
      {
        id: 'reward_3',
        type: 'referee',
        amount: 150,
        description: 'Special Promotion - Free Delivery',
        referralCode: 'FORKD789012',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        used: false,
        expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Expired 1 day ago
      },
      {
        id: 'reward_4',
        type: 'referrer',
        amount: 300,
        description: 'Premium Referral Bonus',
        referralCode: 'FORKD345678',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        used: false,
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
      },
    ];

    try {
      await AsyncStorage.setItem('userRewards', JSON.stringify(sampleRewards));
      console.log('Sample rewards generated successfully!');
      return true;
    } catch (error) {
      console.error('Error generating sample rewards:', error);
      return false;
    }
  }

  /**
   * Generate sample referral stats
   */
  static async generateSampleStats() {
    const sampleStats = {
      count: 3, // 3 friends referred
      totalRewards: 650, // Total rewards earned
      pendingRewards: 400, // Pending rewards
    };

    try {
      await AsyncStorage.setItem('referralStats', JSON.stringify(sampleStats));
      console.log('Sample stats generated successfully!');
      return true;
    } catch (error) {
      console.error('Error generating sample stats:', error);
      return false;
    }
  }

  /**
   * Generate a user referral code
   */
  static async generateTestReferralCode() {
    try {
      const code = await ReferralService.generateUserReferralCode();
      await AsyncStorage.setItem('userReferralCode', code);
      console.log(`Test referral code generated: ${code}`);
      return code;
    } catch (error) {
      console.error('Error generating test referral code:', error);
      return null;
    }
  }

  /**
   * Clear all referral data for fresh testing
   */
  static async clearAllReferralData() {
    try {
      await AsyncStorage.multiRemove([
        'userRewards',
        'referralStats', 
        'userReferralCode',
        'pendingReferrals',
        'usedReferralCode'
      ]);
      console.log('All referral data cleared successfully!');
      return true;
    } catch (error) {
      console.error('Error clearing referral data:', error);
      return false;
    }
  }

  /**
   * Set up complete test environment
   */
  static async setupTestEnvironment() {
    try {
      // Clear existing data
      await this.clearAllReferralData();
      
      // Generate fresh test data
      await this.generateTestReferralCode();
      await this.generateSampleRewards();
      await this.generateSampleStats();
      
      console.log('✅ Test environment setup complete!');
      console.log('📱 You can now test the referral system:');
      console.log('   - Check referral stats in Settings > Referrals');
      console.log('   - View rewards in Settings > My Rewards');
      console.log('   - Test referral code input during signup');
      
      return true;
    } catch (error) {
      console.error('Error setting up test environment:', error);
      return false;
    }
  }

  /**
   * Simulate a successful referral process
   */
  static async simulateReferralProcess(referralCode: string = 'TESTREF123') {
    try {
      console.log('🔄 Simulating referral process...');
      
      // Simulate new user signup with referral code
      const success = await ReferralService.processNewUserReferral(referralCode, 'test_user_123');
      
      if (success) {
        console.log('✅ Referral process simulation successful!');
        
        // Update stats
        const currentStats = await ReferralService.getReferralStats();
        console.log('📊 Updated stats:', currentStats);
        
        return true;
      } else {
        console.log('❌ Referral process simulation failed');
        return false;
      }
    } catch (error) {
      console.error('Error simulating referral process:', error);
      return false;
    }
  }

  /**
   * Get current referral system status
   */
  static async getSystemStatus() {
    try {
      const userCode = await AsyncStorage.getItem('userReferralCode');
      const rewards = await AsyncStorage.getItem('userRewards');
      const stats = await AsyncStorage.getItem('referralStats');
      
      console.log('📋 Referral System Status:');
      console.log(`   User Code: ${userCode || 'Not generated'}`);
      console.log(`   Rewards: ${rewards ? JSON.parse(rewards).length : 0} items`);
      console.log(`   Stats: ${stats ? 'Available' : 'Not available'}`);
      
      return {
        userCode,
        rewardsCount: rewards ? JSON.parse(rewards).length : 0,
        statsAvailable: !!stats
      };
    } catch (error) {
      console.error('Error getting system status:', error);
      return null;
    }
  }
}

// Usage examples:
// await ReferralTestHelper.setupTestEnvironment();
// await ReferralTestHelper.simulateReferralProcess();
// await ReferralTestHelper.getSystemStatus();
