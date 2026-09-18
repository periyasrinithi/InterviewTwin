/**
 * InterviewTwin Authentication & Multi-User Candidate Profile Service
 */

export class AuthService {
  constructor() {
    this.sessionKey = 'interview_twin_current_user';
    this.usersDbKey = 'interview_twin_users_db';
    this.currentUser = this.loadCurrentSession();
  }

  loadCurrentSession() {
    try {
      const stored = localStorage.getItem(this.sessionKey);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  getDemoUser() {
    return {
      id: 'usr_demo_1',
      name: 'Rohan Sharma',
      email: 'rohan.sharma@sih.edu',
      targetCompany: 'TCS',
      targetRole: 'Software Engineer (SDE)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };
  }

  login(email, password, customName = null) {
    if (!email) return { success: false, error: 'Please enter a valid email address.' };

    const derivedName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const finalName = customName && customName.trim() ? customName.trim() : (derivedName || 'Candidate');

    const user = {
      id: `usr_${Date.now()}`,
      name: finalName,
      email: email.trim().toLowerCase(),
      targetCompany: 'TCS / Infosys',
      targetRole: 'SDE Candidate',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(this.sessionKey, JSON.stringify(user));
      this.currentUser = user;
      return { success: true, user };
    } catch (e) {
      return { success: false, error: 'Failed to save session.' };
    }
  }

  logout() {
    localStorage.removeItem(this.sessionKey);
    this.currentUser = null;
  }

  getUserStorageKey(suffix) {
    const userEmail = this.currentUser?.email || 'demo';
    return `interview_twin_user_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}_${suffix}`;
  }
}

export const authServiceInstance = new AuthService();
