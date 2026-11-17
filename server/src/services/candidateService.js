const CandidateProfile = require('../models/CandidateProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');

class CandidateService {
  async getProfile(userId) {
    let profile = await CandidateProfile.findOne({ userId });
    if (!profile) {
      profile = await CandidateProfile.create({
        userId,
        name: 'New Candidate',
        profileComplete: false
      });
    }

    const completeness = profile.calculateCompleteness();
    return {
      profile,
      completeness
    };
  }

  async updateProfile(userId, profileData) {
    let profile = await CandidateProfile.findOne({ userId });
    if (!profile) {
      profile = new CandidateProfile({ userId, ...profileData });
    } else {
      Object.assign(profile, profileData);
    }

    const completeness = profile.calculateCompleteness();
    profile.profileComplete = completeness >= 70;
    await profile.save();

    return {
      profile,
      completeness
    };
  }

  async updateResume(userId, file, fileUrl) {
    const profile = await CandidateProfile.findOne({ userId });
    if (!profile) {
      throw new Error('Candidate profile not found');
    }

    profile.resumeUrl = fileUrl;
    profile.resumeOriginalName = file.originalname;

    const completeness = profile.calculateCompleteness();
    profile.profileComplete = completeness >= 70;
    await profile.save();

    return {
      profile,
      completeness,
      resumeUrl: fileUrl
    };
  }

  async getDashboardData(userId) {
    const { profile, completeness } = await this.getProfile(userId);

    // Get candidate applications
    const applications = await Application.find({ candidateId: userId })
      .populate({
        path: 'jobId',
        select: 'title type duration workMode salary location status'
      })
      .populate({
        path: 'companyId',
        select: 'name website verificationStatus location'
      })
      .sort({ appliedAt: -1 });

    // Fetch verified companies
    const verifiedCompanies = await Company.find({ verificationStatus: 'valid' }).select('_id');
    const verifiedCompanyIds = verifiedCompanies.map((c) => c._id);

    // Recommended jobs matching skills or general verified active jobs
    const userSkills = profile.skills || [];
    let recommendedQuery = {
      companyId: { $in: verifiedCompanyIds },
      status: 'published'
    };

    if (userSkills.length > 0) {
      recommendedQuery.skills = { $in: userSkills };
    }

    let recommendedJobs = await Job.find(recommendedQuery)
      .populate('companyId', 'name website verificationStatus location')
      .limit(6)
      .sort({ createdAt: -1 });

    // If matching by skills returned fewer than 3, fallback to top published verified jobs
    if (recommendedJobs.length < 3) {
      recommendedJobs = await Job.find({
        companyId: { $in: verifiedCompanyIds },
        status: 'published'
      })
        .populate('companyId', 'name website verificationStatus location')
        .limit(6)
        .sort({ createdAt: -1 });
    }

    return {
      profile,
      completeness,
      resumeStatus: profile.resumeUrl ? 'Uploaded' : 'Missing',
      applicationsCount: applications.length,
      applications,
      recommendedJobs
    };
  }

  async applyToJob(userId, jobId, notes = '') {
    const job = await Job.findById(jobId).populate('companyId');
    if (!job) {
      throw new Error('Job listing not found');
    }

    if (job.status !== 'published') {
      throw new Error('This position is no longer accepting applications');
    }

    if (job.companyId.verificationStatus !== 'valid') {
      throw new Error('Applications can only be submitted to verified companies');
    }

    // Check if already applied
    const existing = await Application.findOne({ candidateId: userId, jobId });
    if (existing) {
      throw new Error('You have already applied for this position');
    }

    const application = await Application.create({
      jobId,
      candidateId: userId,
      companyId: job.companyId._id,
      notes,
      status: 'applied'
    });

    return application;
  }

  async getApplications(userId) {
    return await Application.find({ candidateId: userId })
      .populate('jobId')
      .populate('companyId')
      .sort({ appliedAt: -1 });
  }
}

module.exports = new CandidateService();
