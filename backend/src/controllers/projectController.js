const { Project, User, ActivityLog } = require("../models");
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

    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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

    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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

    // Create activity log for new project
    await ActivityLog.create({
      type: "project_created",
      title: "Project Baru Dibuat",
      description: `Project Manager ${
        manager.name
      } membuat project baru "${name}" di lokasi ${location}. Budget: Rp ${
        budget?.toLocaleString("id-ID") || 0
      }`,
      userId: projectManagerId,
      userName: manager.name,
      userRole: manager.role,
      projectId: project._id,
      icon: "🏗️",
      metadata: {
        projectName: name,
        location,
        budget,
        startDate,
        endDate,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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

    return res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update project progress & material usage
const updateProjectProgress = async (req, res) => {
  try {
    const { progress, materialUsed, notes } = req.body;

    console.log("📊 Update Progress Request:", {
      projectId: req.params.id,
      progress,
      materialUsed,
      notes,
    });

    const project = await Project.findById(req.params.id);
    if (!project) {
      console.error("❌ Project not found:", req.params.id);
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    console.log("✅ Found project:", project.name);

    // Update progress
    if (progress !== undefined && progress !== null) {
      project.progress = progress;
    }

    // Initialize progressHistory array if it doesn't exist
    if (!Array.isArray(project.progressHistory)) {
      project.progressHistory = [];
    }

    // Add new history entry
    const historyEntry = {
      progress: progress !== undefined ? progress : project.progress || 0,
      materialUsed: materialUsed || "",
      notes: notes || "",
      updatedBy: req.user?._id,
      updatedByName: req.user?.name,
      updatedAt: new Date(),
    };

    console.log("📝 Adding history entry:", historyEntry);
    project.progressHistory.push(historyEntry);

    await project.save();
    console.log("✅ Project saved successfully");

    // Create activity log
    if (req.user) {
      try {
        await ActivityLog.create({
          type: "project_progress_updated",
          title: "Progress Proyek Diupdate",
          description: `${req.user.name} mengupdate progress proyek "${
            project.name
          }" menjadi ${progress}%${
            materialUsed ? ` dan mencatat penggunaan material` : ""
          }`,
          userId: req.user._id,
          userName: req.user.name,
          userRole: req.user.role,
          projectId: project._id,
          icon: "📊",
          metadata: {
            projectName: project.name,
            progress,
            materialUsed,
            notes,
          },
        });
        console.log("✅ Activity log created");
      } catch (logError) {
        console.error("⚠️ Failed to create activity log:", logError.message);
        // Don't fail the request if activity log fails
      }
    }

    return res.status(200).json({
      success: true,
      message: "Project progress updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("❌ Error updating project progress:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProject,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectProgress,
};
