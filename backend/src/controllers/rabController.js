const { RAB, User, Project, ActivityLog } = require("../models");
const {
  createRABSchema,
  updateRABSchema,
} = require("../validations/rabValidation");

// ✅ GET semua RAB (dengan filter berdasarkan role)
const getRAB = async (req, res) => {
  try {
    const { status, projectId, customerId } = req.query;
    const query = {};

    // Filter berdasarkan role user
    if (req.user.role === "customer") {
      // Customer hanya bisa lihat RAB miliknya
      query.customerId = req.user._id;
    } else if (req.user.role === "project_manager") {
      // PM bisa lihat:
      // 1. RAB yang belum ditangani siapapun (pending/reviewed tanpa projectManagerId)
      // 2. RAB yang sudah dia tangani sendiri
      query.$or = [
        { projectManagerId: { $exists: false } }, // Belum ada PM yang tangani
        { projectManagerId: null }, // Belum ada PM yang tangani
        { projectManagerId: req.user._id }, // RAB yang dia tangani
      ];
    }
    // Admin bisa lihat semua

    if (status) query.status = status;
    if (projectId) query.projectId = projectId;
    if (customerId && req.user.role === "admin") query.customerId = customerId;

    console.log("🔍 RAB Query:", {
      role: req.user.role,
      userId: req.user._id,
      query: JSON.stringify(query, null, 2),
    });

    const rabs = await RAB.find(query)
      .populate("customerId", "name email role")
      .populate("projectManagerId", "name email role")
      .populate("projectId", "name location")
      .sort({ createdAt: -1 });

    console.log("📋 RAB Results:", {
      count: rabs.length,
      data: rabs.map((r) => ({
        id: r._id,
        title: r.title,
        status: r.status,
        customerId: r.customerId?._id,
        projectManagerId: r.projectManagerId?._id,
      })),
    });

    return res.status(200).json({ success: true, data: rabs });
  } catch (error) {
    console.error("RAB Query Error:", error);
    return res.status(500).json({ success: false, message: error.message });
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

    return res.status(200).json({ success: true, data: rab });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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

    return res.status(201).json({
      success: true,
      message: "RAB created successfully",
      data: rab,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
      // Normalize items to support both quantity and qty fields
      rab.items = items.map((item) => ({
        productId: item.productId || "",
        materialName: item.materialName || item.description || "",
        description: item.description || "",
        quantity: item.quantity || item.qty || 0,
        unit: item.unit || "pcs",
        unitPrice: item.unitPrice || 0,
      }));

      // Calculate total from normalized items
      rab.totalEstimated = rab.items.reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0),
        0
      );

      console.log("📝 RAB Items Updated:", {
        rabId: rab._id,
        itemsCount: rab.items.length,
        totalEstimated: rab.totalEstimated,
        items: rab.items.map((i) => ({
          material: i.materialName,
          qty: i.quantity,
          price: i.unitPrice,
          total: i.quantity * i.unitPrice,
        })),
      });
    }

    if (title) rab.title = title;
    if (status) rab.status = status;

    await rab.save();

    return res.status(200).json({
      success: true,
      message: "RAB updated successfully",
      data: rab,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE RAB
const deleteRAB = async (req, res) => {
  try {
    const rab = await RAB.findByIdAndDelete(req.params.id);

    if (!rab)
      return res.status(404).json({ success: false, message: "RAB not found" });

    return res.status(200).json({
      success: true,
      message: "RAB deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ CUSTOMER: Create RAB Request
const createRABRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      estimatedBudget,
      expectedStartDate,
      customerNotes,
      items,
    } = req.body;

    console.log("📥 Received RAB Request:", {
      title,
      description,
      location,
      estimatedBudget,
      expectedStartDate,
      customerNotes,
      items,
      itemsType: typeof items,
      itemsIsArray: Array.isArray(items),
      itemsLength: items?.length,
    });

    // Validasi required fields
    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and location are required",
      });
    }

    const rab = new RAB({
      customerId: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      title,
      description,
      location,
      estimatedBudget,
      expectedStartDate,
      customerNotes,
      items: items || [],
      status: "pending",
      submittedAt: new Date(),
    });

    await rab.save();

    console.log("✅ RAB Saved:", {
      id: rab._id,
      items: rab.items,
    });

    // Create activity log
    await ActivityLog.create({
      type: "rab_request_created",
      title: "Permintaan RAB Baru",
      description: `Customer ${
        req.user.name
      } mengajukan permintaan RAB untuk "${title}" di ${location}${
        estimatedBudget
          ? ` dengan estimasi budget Rp ${estimatedBudget.toLocaleString(
              "id-ID"
            )}`
          : ""
      }`,
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      icon: "📋",
      metadata: {
        rabId: rab._id,
        title,
        location,
        estimatedBudget,
      },
    });

    return res.status(201).json({
      success: true,
      message: "RAB request submitted successfully",
      data: rab,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ PM: Assign RAB to self and update status to 'reviewed'
const assignRABToMe = async (req, res) => {
  try {
    const rab = await RAB.findById(req.params.id);
    if (!rab) {
      return res.status(404).json({ success: false, message: "RAB not found" });
    }

    if (rab.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "RAB can only be assigned when status is pending",
      });
    }

    rab.projectManagerId = req.user._id;
    rab.projectManagerName = req.user.name;
    rab.status = "reviewed";
    rab.reviewedAt = new Date();

    await rab.save();

    // Create activity log
    await ActivityLog.create({
      type: "rab_assigned",
      title: "RAB Ditangani PM",
      description: `Project Manager ${req.user.name} mulai menangani permintaan RAB "${rab.title}" dari ${rab.customerName}`,
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      icon: "👷",
      metadata: {
        rabId: rab._id,
        customerName: rab.customerName,
        title: rab.title,
      },
    });

    res.status(200).json({
      success: true,
      message: "RAB assigned successfully",
      data: rab,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ PM: Create and send RAB quotation
const sendRABQuotation = async (req, res) => {
  try {
    const { items, pmNotes, projectId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "RAB items are required",
      });
    }

    const rab = await RAB.findById(req.params.id);
    if (!rab) {
      return res.status(404).json({ success: false, message: "RAB not found" });
    }

    // Hanya PM yang assigned yang bisa kirim quotation
    if (
      rab.projectManagerId &&
      rab.projectManagerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Only assigned PM can send quotation",
      });
    }

    // Hitung total - support both quantity and qty fields
    const totalEstimated = items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity || item.qty) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return sum + quantity * unitPrice;
    }, 0);

    rab.items = items;
    rab.totalEstimated = totalEstimated;
    rab.pmNotes = pmNotes;
    rab.status = "quoted";
    rab.quotedAt = new Date();

    console.log("💰 RAB Quotation:", {
      rabId: rab._id,
      itemsCount: items.length,
      totalEstimated,
      items: items.map((i) => ({
        material: i.materialName,
        qty: i.quantity || i.qty,
        price: i.unitPrice,
        total: (i.quantity || i.qty) * i.unitPrice,
      })),
    });

    // Assign PM jika belum
    if (!rab.projectManagerId) {
      rab.projectManagerId = req.user._id;
      rab.projectManagerName = req.user.name;
    }

    // Auto-create project ketika PM approve RAB
    let createdProject = null;
    if (!rab.projectId && !projectId) {
      const newProject = new Project({
        name: rab.title,
        location: rab.location,
        description: rab.description || `Proyek untuk ${rab.customerName}`,
        projectManagerId: req.user._id,
        status: "planning", // Status awal proyek
        startDate: rab.expectedStartDate || new Date(),
        budget: totalEstimated,
      });

      await newProject.save();
      rab.projectId = newProject._id;
      createdProject = newProject;

      console.log(
        `✅ Auto-created project: ${newProject.name} (ID: ${newProject._id})`
      );
    } else if (projectId) {
      rab.projectId = projectId;
    }

    await rab.save();

    // Create activity log
    await ActivityLog.create({
      type: "rab_quoted",
      title: "Penawaran RAB Dikirim & Proyek Dibuat",
      description: `Project Manager ${
        req.user.name
      } mengirim penawaran RAB untuk "${rab.title}" kepada ${
        rab.customerName
      } dengan total estimasi Rp ${totalEstimated.toLocaleString("id-ID")}${
        createdProject
          ? ` dan membuat proyek baru "${createdProject.name}"`
          : ""
      }`,
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      icon: "💰",
      metadata: {
        rabId: rab._id,
        customerName: rab.customerName,
        title: rab.title,
        totalEstimated,
        itemsCount: items.length,
        projectId: rab.projectId,
        projectCreated: !!createdProject,
      },
    });

    const populatedRAB = await RAB.findById(rab._id)
      .populate("customerId", "name email role")
      .populate("projectManagerId", "name email role")
      .populate("projectId", "name location");

    return res.status(200).json({
      success: true,
      message: createdProject
        ? "RAB quotation sent and project created successfully"
        : "RAB quotation sent successfully",
      data: populatedRAB,
      project: createdProject,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ CUSTOMER: Accept RAB quotation
const acceptRABQuotation = async (req, res) => {
  try {
    const rab = await RAB.findById(req.params.id);
    if (!rab) {
      return res.status(404).json({ success: false, message: "RAB not found" });
    }

    // Hanya customer yang buat request yang bisa accept
    if (rab.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the requester can accept this quotation",
      });
    }

    if (rab.status !== "quoted") {
      return res.status(400).json({
        success: false,
        message: "Can only accept quotation with 'quoted' status",
      });
    }

    rab.status = "accepted";
    rab.respondedAt = new Date();
    await rab.save();

    // Get project info if exists
    let projectInfo = null;
    if (rab.projectId) {
      projectInfo = await Project.findById(rab.projectId).select(
        "name location status budget"
      );

      // Update project status to active when customer accepts
      if (projectInfo && projectInfo.status === "planning") {
        projectInfo.status = "in-progress";
        await projectInfo.save();
        console.log(
          `✅ Project "${projectInfo.name}" activated after RAB acceptance`
        );
      }
    }

    // Create activity log
    await ActivityLog.create({
      type: "rab_accepted",
      title: "Penawaran RAB Diterima",
      description: `Customer ${req.user.name} menerima penawaran RAB "${
        rab.title
      }" dengan total Rp ${rab.totalEstimated.toLocaleString("id-ID")}${
        projectInfo ? ` - Proyek "${projectInfo.name}" dimulai` : ""
      }`,
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      icon: "✅",
      metadata: {
        rabId: rab._id,
        title: rab.title,
        totalEstimated: rab.totalEstimated,
        projectId: rab.projectId,
        projectName: projectInfo?.name,
      },
    });

    return res.status(200).json({
      success: true,
      message: projectInfo
        ? `RAB accepted and project "${projectInfo.name}" is now active`
        : "RAB quotation accepted",
      data: rab,
      project: projectInfo,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ PM: Reject RAB request
const rejectRABByPM = async (req, res) => {
  try {
    const { reason } = req.body;

    const rab = await RAB.findById(req.params.id);
    if (!rab) {
      return res.status(404).json({ success: false, message: "RAB not found" });
    }

    // Hanya PM yang sudah di-assign atau admin yang bisa reject
    if (
      req.user.role !== "admin" &&
      (!rab.projectManagerId ||
        rab.projectManagerId.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: "Only assigned PM or admin can reject this RAB",
      });
    }

    rab.status = "rejected_by_pm";
    rab.respondedAt = new Date();
    if (reason) {
      rab.pmNotes = (rab.pmNotes || "") + "\n\nRejection reason: " + reason;
    }
    await rab.save();

    // Create activity log
    await ActivityLog.create({
      type: "rab_rejected_by_pm",
      title: "Permintaan RAB Ditolak PM",
      description: `Project Manager ${req.user.name} menolak permintaan RAB "${
        rab.title
      }" dari ${rab.customerName}. Alasan: ${reason || "Tidak disebutkan"}`,
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      icon: "🚫",
      metadata: {
        rabId: rab._id,
        customerName: rab.customerName,
        title: rab.title,
        reason,
      },
    });

    return res.status(200).json({
      success: true,
      message: "RAB rejected by PM",
      data: rab,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ CUSTOMER: Reject RAB quotation
const rejectRABQuotation = async (req, res) => {
  try {
    const { reason } = req.body;

    const rab = await RAB.findById(req.params.id);
    if (!rab) {
      return res.status(404).json({ success: false, message: "RAB not found" });
    }

    // Hanya customer yang buat request yang bisa reject
    if (rab.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the requester can reject this quotation",
      });
    }

    if (rab.status !== "quoted") {
      return res.status(400).json({
        success: false,
        message: "Can only reject quotation with 'quoted' status",
      });
    }

    rab.status = "rejected";
    rab.respondedAt = new Date();
    if (reason) {
      rab.customerNotes =
        (rab.customerNotes || "") + "\n\nRejection reason: " + reason;
    }
    await rab.save();

    // Create activity log
    await ActivityLog.create({
      type: "rab_rejected",
      title: "Penawaran RAB Ditolak",
      description: `Customer ${req.user.name} menolak penawaran RAB "${
        rab.title
      }". Alasan: ${reason || "Tidak disebutkan"}`,
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      icon: "❌",
      metadata: {
        rabId: rab._id,
        title: rab.title,
        reason,
      },
    });

    return res.status(200).json({
      success: true,
      message: "RAB quotation rejected",
      data: rab,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Admin: Assign RAB to specific PM and update status
const assignRABToPM = async (req, res) => {
  try {
    const { projectManagerId } = req.body;

    if (!projectManagerId) {
      return res.status(400).json({
        success: false,
        message: "Project Manager ID is required",
      });
    }

    const rab = await RAB.findById(req.params.id);
    if (!rab) {
      return res.status(404).json({ success: false, message: "RAB not found" });
    }

    // Get PM details
    const User = require("../models/User");
    const pm = await User.findById(projectManagerId);
    if (!pm || pm.role !== "project_manager") {
      return res.status(400).json({
        success: false,
        message: "Invalid Project Manager",
      });
    }

    rab.projectManagerId = projectManagerId;
    rab.projectManagerName = pm.name;

    // Update status to reviewed if still pending
    if (rab.status === "pending") {
      rab.status = "reviewed";
      rab.reviewedAt = new Date();
    }

    await rab.save();

    // Create activity log
    await ActivityLog.create({
      type: "rab_assigned",
      title: "RAB Ditugaskan ke PM",
      description: `Admin menugaskan permintaan RAB "${rab.title}" ke Project Manager ${pm.name}`,
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      icon: "👨‍💼",
      metadata: {
        rabId: rab._id,
        pmId: pm._id,
        pmName: pm.name,
        title: rab.title,
      },
    });

    return res.status(200).json({
      success: true,
      message: "RAB assigned to Project Manager successfully",
      data: rab,
    });
  } catch (error) {
    console.error("❌ assignRABToPM error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Admin: Update RAB status
const updateRABStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = [
      "pending",
      "reviewed",
      "quoted",
      "accepted",
      "rejected",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const rab = await RAB.findById(req.params.id);
    if (!rab) {
      return res.status(404).json({ success: false, message: "RAB not found" });
    }

    const oldStatus = rab.status;
    rab.status = status;

    if (status === "reviewed" && !rab.reviewedAt) {
      rab.reviewedAt = new Date();
    }

    await rab.save();

    // Create activity log
    const statusLabels = {
      pending: "Menunggu Review",
      reviewed: "Dalam Review",
      quoted: "Quotation Dikirim",
      accepted: "Diterima",
      rejected: "Ditolak",
    };

    await ActivityLog.create({
      type: "rab_status_updated",
      title: "Status RAB Diubah",
      description: `Status RAB "${rab.title}" diubah dari "${statusLabels[oldStatus]}" menjadi "${statusLabels[status]}"`,
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      icon: "🔄",
      metadata: {
        rabId: rab._id,
        title: rab.title,
        oldStatus,
        newStatus: status,
      },
    });

    return res.status(200).json({
      success: true,
      message: "RAB status updated successfully",
      data: rab,
    });
  } catch (error) {
    console.error("❌ updateRABStatus error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRAB,
  getRABById,
  createRAB,
  updateRAB,
  updateRABStatus,
  deleteRAB,
  createRABRequest,
  assignRABToMe,
  assignRABToPM,
  sendRABQuotation,
  acceptRABQuotation,
  rejectRABQuotation,
  rejectRABByPM,
};
