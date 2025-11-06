const { Project, User } = require("../models");
const {
  createProjectSchema,
  updateProjectSchema,
} = require("../validations/projectValidation");

// ✅ Get semua project
const getProject = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: "i" };

    const projects = await Project.find(query)
      .populate("projectManagerId", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get project berdasarkan ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "projectManagerId",
      "name email role"
    );

    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Create project baru
const createProject = async (req, res) => {
  try {
    const { error } = createProjectSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const {
      name,
      location,
      description,
      projectManagerId,
      status,
      startDate,
      endDate,
      budget,
    } = req.body;

    // Validasi jika project manager ID tidak valid
    const manager = await User.findById(projectManagerId);
    if (!manager)
      return res
        .status(404)
        .json({ success: false, message: "Project Manager not found" });

    const project = new Project({
      name,
      location,
      description,
      projectManagerId,
      status,
      startDate,
      endDate,
      budget,
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update project
const updateProject = async (req, res) => {
  try {
    const { error } = updateProjectSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const project = await Project.findById(req.params.id);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    Object.assign(project, req.body);
    await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProject,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
