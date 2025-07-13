import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ReferralStats {
  count: number;
  totalRewards: number;
  pendingRewards: number;
}

export interface ReferralReward {
  id: string;
  type: 'referrer' | 'referee';
  amount: number;
  description: string;
  referralCode: string;
  timestamp: string;
  used: boolean;
  expiresAt: string;
}

export interface PendingReferral {
  code: string;
  newUserId: string;
  timestamp: string;
  processed: boolean;
}

export class ReferralService {
  private static REFERRAL_STATS_KEY = 'referralStats';
  private static REFERRAL_REWARDS_KEY = 'referralRewards';
  private static PENDING_REFERRALS_KEY = 'pendingReferrals';

  static async processNewUserReferral(referralCode: string, newUserId: string): Promise<boolean> {
    try {
      // In a real app, you would validate the referral code against your database
      // For demo purposes, we'll simulate this
      
      const pendingReferral: PendingReferral = {
        code: referralCode,
        newUserId,
        timestamp: new Date().toISOString(),
        processed: false
      };

      // Store pending referral
      const existingPending = await AsyncStorage.getItem(this.PENDING_REFERRALS_KEY);
      const pendingReferrals = existingPending ? JSON.parse(existingPending) : [];
      pendingReferrals.push(pendingReferral);
      await AsyncStorage.setItem(this.PENDING_REFERRALS_KEY, JSON.stringify(pendingReferrals));

      // Create immediate reward for new user (referee)
      await this.createReferralReward({
        id: `referee_${Date.now()}`,
        type: 'referee',
        amount: 100,
        description: 'Welcome bonus for using referral code',
        referralCode,
        timestamp: new Date().toISOString(),
        used: false,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
      });

      // Simulate finding referrer and giving them reward
      // In real app, you'd lookup who owns this referral code
      await this.simulateReferrerReward(referralCode);

      return true;
    } catch (error) {
      console.error('Error processing referral:', error);
      return false;
    }
  }

  private static async simulateReferrerReward(referralCode: string) {
    // In a real app, you'd find the user who owns this referral code
    // For demo, we'll just create a reward for the current user
    
    try {
      // Create reward for referrer
      await this.createReferralReward({
        id: `referrer_${Date.now()}`,
        type: 'referrer',
        amount: 200,
        description: 'Reward for successful referral',
        referralCode,
        timestamp: new Date().toISOString(),
        used: false,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
      });

      // Update referrer's stats
      await this.updateReferralStats(1, 200);
      
    } catch (error) {
      console.error('Error creating referrer reward:', error);
    }
  }

  static async createReferralReward(reward: ReferralReward): Promise<void> {
    try {
      const existingRewards = await AsyncStorage.getItem(this.REFERRAL_REWARDS_KEY);
      const rewards = existingRewards ? JSON.parse(existingRewards) : [];
      rewards.push(reward);
      await AsyncStorage.setItem(this.REFERRAL_REWARDS_KEY, JSON.stringify(rewards));
    } catch (error) {
      console.error('Error creating referral reward:', error);
    }
  }

  static async updateReferralStats(newReferrals: number, rewardAmount: number): Promise<void> {
    try {
      const existingStats = await AsyncStorage.getItem(this.REFERRAL_STATS_KEY);
      const stats: ReferralStats = existingStats ? JSON.parse(existingStats) : {
        count: 0,
        totalRewards: 0,
        pendingRewards: 0
      };

      stats.count += newReferrals;
      stats.totalRewards += rewardAmount;
      stats.pendingRewards += rewardAmount;

      await AsyncStorage.setItem(this.REFERRAL_STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error updating referral stats:', error);
    }
  }

  static async getReferralStats(): Promise<ReferralStats> {
    try {
      const stats = await AsyncStorage.getItem(this.REFERRAL_STATS_KEY);
      return stats ? JSON.parse(stats) : { count: 0, totalRewards: 0, pendingRewards: 0 };
    } catch (error) {
      console.error('Error getting referral stats:', error);
      return { count: 0, totalRewards: 0, pendingRewards: 0 };
    }
  }

  static async getReferralRewards(): Promise<ReferralReward[]> {
    try {
      const rewards = await AsyncStorage.getItem(this.REFERRAL_REWARDS_KEY);
      return rewards ? JSON.parse(rewards) : [];
    } catch (error) {
      console.error('Error getting referral rewards:', error);
      return [];
    }
  }

  static async useReferralReward(rewardId: string): Promise<boolean> {
    try {
      const rewards = await this.getReferralRewards();
      const rewardIndex = rewards.findIndex(r => r.id === rewardId);
      
      if (rewardIndex === -1) return false;
      
      const reward = rewards[rewardIndex];
      if (reward.used || new Date(reward.expiresAt) < new Date()) {
        return false;
      }

      // Mark as used
      rewards[rewardIndex].used = true;
      await AsyncStorage.setItem(this.REFERRAL_REWARDS_KEY, JSON.stringify(rewards));

      // Update stats
      const stats = await this.getReferralStats();
      stats.pendingRewards -= reward.amount;
      await AsyncStorage.setItem(this.REFERRAL_STATS_KEY, JSON.stringify(stats));

      return true;
    } catch (error) {
      console.error('Error using referral reward:', error);
      return false;
    }
  }

  static async validateReferralCode(code: string): Promise<boolean> {
    // In a real app, you'd check against your database
    // For demo purposes, we'll accept any code that follows the pattern
    const pattern = /^FORKD\d{6}\d{1,3}$/;
    return pattern.test(code) && code.length >= 10;
  }

  static async generateUserReferralCode(): Promise<string> {
    // Generate a unique referral code
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000);
    return `FORKD${timestamp}${random}`;
  }
}

export default ReferralService;
