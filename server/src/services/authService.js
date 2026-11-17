const bcrypt = require('bcryptjs');
const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const Company = require('../models/Company');
const { generateToken } = require('../utils/jwtToken');

class AuthService {
  async register({ email, password, role, name, companyName }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('An account with this email address already exists');
    }

    if (role === 'admin') {
      throw new Error('Admin registration is not publicly accessible');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      passwordHash,
      role
    });

    // Create corresponding profile
    if (role === 'candidate') {
      await CandidateProfile.create({
        userId: user._id,
        name: name || email.split('@')[0],
        profileComplete: false
      });
    } else if (role === 'recruiter') {
      await Company.create({
        ownerUserId: user._id,
        name: companyName || `${email.split('@')[0]}'s Organization`,
        verificationStatus: 'pending'
      });
    }

    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    let extraData = {};
    if (user.role === 'candidate') {
      const profile = await CandidateProfile.findOne({ userId: user._id });
      extraData.profile = profile;
    } else if (user.role === 'recruiter') {
      const company = await Company.findOne({ ownerUserId: user._id });
      extraData.company = company;
    }

    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        ...extraData
      },
      token
    };
  }

  async getCurrentUser(userId) {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      throw new Error('User not found');
    }

    let profileData = null;
    let companyData = null;

    if (user.role === 'candidate') {
      profileData = await CandidateProfile.findOne({ userId });
    } else if (user.role === 'recruiter') {
      companyData = await Company.findOne({ ownerUserId: userId });
    }

    return {
      ...user.toObject(),
      profile: profileData,
      company: companyData
    };
  }
}

module.exports = new AuthService();
