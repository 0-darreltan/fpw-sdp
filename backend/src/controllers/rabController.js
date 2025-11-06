const { RAB, User, Project } = require("../models");
const {
  createRABSchema,
  updateRABSchema,
} = require("../validations/rabValidation");

// ✅ GET semua RAB
const getRAB = async (req, res) => {
  try {
    const { status, projectId, customerId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (projectId) query.projectId = projectId;
    if (customerId) query.customerId = customerId;

    const rabs = await RAB.find(query)
      .populate("customerId", "name email role")
      .populate("projectId", "name location")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: rabs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET RAB berdasarkan ID
const getRABById = async (req, res) => {
  try {
    const rab = await RAB.findById(req.params.id)
      .populate("customerId", "name email role")
      .populate("projectId", "name location");

    if (!rab) {
      return res.status(404).json({ success: false, message: "RAB not found" });
    }

    res.status(200).json({ success: true, data: rab });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ CREATE RAB baru
const createRAB = async (req, res) => {
  try {
    const { error } = createRABSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const { customerId, projectId, title, items, status } = req.body;

    // Validasi customer dan project
    const customer = await User.findById(customerId);
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });

    const project = await Project.findById(projectId);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    // Hitung totalEstimated otomatis
    const totalEstimated = items.reduce(
      (sum, item) => sum + item.qty * item.unitPrice,
      0
    );

    const rab = new RAB({
      customerId,
      projectId,
      title,
      items,
      totalEstimated,
      status: status || "submitted",
    });

    await rab.save();

    res.status(201).json({
      success: true,
      message: "RAB created successfully",
      data: rab,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE RAB
const updateRAB = async (req, res) => {
  try {
    const { error } = updateRABSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const rab = await RAB.findById(req.params.id);
    if (!rab)
      return res.status(404).json({ success: false, message: "RAB not found" });

    const { items, title, status } = req.body;

    if (items && items.length > 0) {
      rab.items = items;
      rab.totalEstimated = items.reduce(
        (sum, item) => sum + item.qty * item.unitPrice,
        0
      );
    }

    if (title) rab.title = title;
    if (status) rab.status = status;

    await rab.save();

    res.status(200).json({
      success: true,
      message: "RAB updated successfully",
      data: rab,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE RAB
const deleteRAB = async (req, res) => {
  try {
    const rab = await RAB.findByIdAndDelete(req.params.id);

    if (!rab)
      return res.status(404).json({ success: false, message: "RAB not found" });

    res.status(200).json({
      success: true,
      message: "RAB deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRAB,
  getRABById,
  createRAB,
  updateRAB,
  deleteRAB,
};
