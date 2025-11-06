const { Proposal, User, RAB } = require("../models");
const {
  createProposalSchema,
  updateProposalSchema,
} = require("../validations/proposalValidation");

// ✅ GET semua proposal
const getProposal = async (req, res) => {
  try {
    const { status, projectManagerId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (projectManagerId) query.projectManagerId = projectManagerId;

    const proposals = await Proposal.find(query)
      .populate("projectManagerId", "name email role")
      .populate("customerId", "name email role")
      .populate({
        path: "rabId",
        populate: { path: "projectId", select: "name location" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET proposal by ID
const getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate("projectManagerId", "name email role")
      .populate("customerId", "name email role")
      .populate({
        path: "rabId",
        populate: { path: "projectId", select: "name location" },
      });

    if (!proposal) {
      return res
        .status(404)
        .json({ success: false, message: "Proposal not found" });
    }

    res.status(200).json({ success: true, data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ CREATE proposal
const createProposal = async (req, res) => {
  try {
    const { error } = createProposalSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const { rabId, projectManagerId, customerId, items, status } = req.body;

    // Validasi RAB, PM, dan Customer
    const rab = await RAB.findById(rabId);
    if (!rab)
      return res.status(404).json({ success: false, message: "RAB not found" });

    const projectManager = await User.findById(projectManagerId);
    if (!projectManager)
      return res
        .status(404)
        .json({ success: false, message: "Project Manager not found" });

    const customer = await User.findById(customerId);
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });

    // Hitung total otomatis
    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

    const proposal = new Proposal({
      rabId,
      projectManagerId,
      customerId,
      items,
      total,
      status: status || "draft",
    });

    await proposal.save();

    res.status(201).json({
      success: true,
      message: "Proposal created successfully",
      data: proposal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE proposal
const updateProposal = async (req, res) => {
  try {
    const { error } = updateProposalSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const proposal = await Proposal.findById(req.params.id);
    if (!proposal)
      return res
        .status(404)
        .json({ success: false, message: "Proposal not found" });

    const { items, status, sentAt } = req.body;

    if (items && items.length > 0) {
      proposal.items = items;
      proposal.total = items.reduce(
        (sum, item) => sum + item.qty * item.price,
        0
      );
    }

    if (status) proposal.status = status;
    if (sentAt) proposal.sentAt = sentAt;

    await proposal.save();

    res.status(200).json({
      success: true,
      message: "Proposal updated successfully",
      data: proposal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE proposal
const deleteProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findByIdAndDelete(req.params.id);
    if (!proposal)
      return res
        .status(404)
        .json({ success: false, message: "Proposal not found" });

    res
      .status(200)
      .json({ success: true, message: "Proposal deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProposal,
  getProposalById,
  createProposal,
  updateProposal,
  deleteProposal,
};
