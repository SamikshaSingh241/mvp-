const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');

class JobService {
  /**
   * Recruiter creates a job
   */
  async createJob(userId, jobData) {
    const company = await Company.findOne({ ownerUserId: userId });
    if (!company) {
      throw new Error('Please set up your company profile before posting a job');
    }

    const job = await Job.create({
      ...jobData,
      companyId: company._id,
      createdBy: userId
    });

    return await job.populate('companyId');
  }

  /**
   * Recruiter gets their own jobs
   */
  async getRecruiterJobs(userId) {
    const company = await Company.findOne({ ownerUserId: userId });
    if (!company) {
      return { jobs: [], company: null };
    }

    const jobs = await Job.find({ companyId: company._id })
      .populate('companyId')
      .sort({ createdAt: -1 });

    // Count applications for each job
    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({ jobId: { $in: jobIds } });

    const jobsWithCounts = jobs.map((job) => {
      const appCount = applications.filter((a) => a.jobId.toString() === job._id.toString()).length;
      return {
        ...job.toObject(),
        applicationCount: appCount
      };
    });

    return {
      company,
      jobs: jobsWithCounts
    };
  }

  /**
   * Recruiter updates/edits a job
   */
  async updateJob(userId, jobId, updateData) {
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error('Job listing not found');
    }

    if (job.createdBy.toString() !== userId.toString()) {
      throw new Error('Unauthorized to modify this job');
    }

    Object.assign(job, updateData);
    await job.save();

    return await job.populate('companyId');
  }

  /**
   * Recruiter dashboard metrics
   */
  async getRecruiterDashboardData(userId) {
    let company = await Company.findOne({ ownerUserId: userId });
    if (!company) {
      company = await Company.create({
        ownerUserId: userId,
        name: 'My Company',
        verificationStatus: 'pending'
      });
    }

    const jobs = await Job.find({ companyId: company._id }).sort({ createdAt: -1 });
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === 'published').length;
    const draftJobs = jobs.filter((j) => j.status === 'draft').length;
    const closedJobs = jobs.filter((j) => j.status === 'closed').length;

    const jobIds = jobs.map((j) => j._id);
    const recentApplications = await Application.find({ jobId: { $in: jobIds } })
      .populate({
        path: 'candidateId',
        select: 'email'
      })
      .populate('jobId', 'title type')
      .sort({ appliedAt: -1 })
      .limit(10);

    return {
      company,
      stats: {
        totalJobs,
        activeJobs,
        draftJobs,
        closedJobs,
        totalApplications: recentApplications.length
      },
      jobs,
      recentApplications,
      canBePublic: company.verificationStatus === 'valid'
    };
  }

  /**
   * PUBLIC JOB BOARD
   * STRICT ENFORCEMENT: ONLY jobs from companies with verificationStatus === 'valid'
   * and status === 'published'.
   */
  async getPublicJobs({ search, location, skills, workMode, type, limit = 20, page = 1 }) {
    // 1. Find all verified companies
    const validCompanies = await Company.find({ verificationStatus: 'valid' }).select('_id');
    const validCompanyIds = validCompanies.map((c) => c._id);

    // Build job query
    const query = {
      companyId: { $in: validCompanyIds },
      status: 'published'
    };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (workMode && workMode !== 'all') {
      query.workMode = workMode;
    }

    if (location && location.trim() !== '') {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { skills: { $in: [new RegExp(search.trim(), 'i')] } }
      ];
    }

    if (skills) {
      const skillsArray = Array.isArray(skills)
        ? skills
        : skills.split(',').map((s) => s.trim()).filter(Boolean);

      if (skillsArray.length > 0) {
        query.skills = { $in: skillsArray.map((s) => new RegExp(s, 'i')) };
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('companyId', 'name website industry size location logoUrl verificationStatus')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Job.countDocuments(query)
    ]);

    return {
      jobs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    };
  }

  /**
   * Get single job details (public only if company is valid)
   */
  async getJobById(jobId, currentUser = null) {
    const job = await Job.findById(jobId).populate('companyId');
    if (!job) {
      throw new Error('Job listing not found');
    }

    const isCompanyValid = job.companyId && job.companyId.verificationStatus === 'valid';
    const isOwner =
      currentUser &&
      (job.createdBy.toString() === currentUser._id.toString() || currentUser.role === 'admin');

    if (!isCompanyValid && !isOwner) {
      throw new Error('This job listing is currently under administrative company verification and is not publicly visible');
    }

    return job;
  }
}

module.exports = new JobService();
