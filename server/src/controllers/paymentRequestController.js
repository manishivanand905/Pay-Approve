const PaymentRequest = require("../models/PaymentRequest");
const Project = require("../models/Project");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const PAYMENT_POPULATE = [
  { path: "requester", select: "name email role" },
  {
    path: "project",
    select: "name code escalationThreshold manager financeHead banker",
    populate: [
      { path: "manager", select: "name email role" },
      { path: "financeHead", select: "name email role" },
      { path: "banker", select: "name email role" },
    ],
  },
  { path: "paymentDetails.processedBy", select: "name email role" },
  { path: "history.actionBy", select: "name email role" },
  { path: "comments.author", select: "name email role" },
];

const getNextRequestNumber = async () => {
  const year = new Date().getFullYear();
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);
  const count = await PaymentRequest.countDocuments({
    createdAt: { $gte: start, $lt: end },
  });

  return `PAY-${year}-${String(count + 1).padStart(4, "0")}`;
};

const validateActor = async (actorId) => {
  const actor = await User.findById(actorId);

  if (!actor) {
    throw new Error("Actor user not found");
  }

  return actor;
};

const getPayments = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.status) {
    filters.status = req.query.status;
  }

  if (req.query.requester) {
    filters.requester = req.query.requester;
  }

  if (req.query.project) {
    filters.project = req.query.project;
  }

  const payments = await PaymentRequest.find(filters)
    .populate(PAYMENT_POPULATE)
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: payments.length,
    data: payments,
  });
});

const getPaymentMetrics = asyncHandler(async (req, res) => {
  const [statusBreakdown, totals] = await Promise.all([
    PaymentRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          amount: { $sum: "$amount" },
        },
      },
    ]),
    PaymentRequest.aggregate([
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      totalRequests: totals[0]?.totalRequests || 0,
      totalAmount: totals[0]?.totalAmount || 0,
      statusBreakdown,
    },
  });
});

const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await PaymentRequest.findById(req.params.id).populate(PAYMENT_POPULATE);

  if (!payment) {
    res.status(404);
    throw new Error("Payment request not found");
  }

  res.json({
    success: true,
    data: payment,
  });
});

const createPayment = asyncHandler(async (req, res) => {
  const {
    requester,
    project,
    payeeName,
    description,
    invoiceNumber,
    vendorName,
    materialItem,
    amount,
    currency,
    dueDate,
    requestedPaymentMode,
    requestChannel,
    accountDetails,
    attachments,
    initialComment,
  } = req.body;

  if (!requester || !project || !payeeName || !description || amount === undefined) {
    res.status(400);
    throw new Error(
      "requester, project, payeeName, description and amount are required"
    );
  }

  const [requesterUser, projectRecord] = await Promise.all([
    User.findById(requester),
    Project.findById(project),
  ]);

  if (!requesterUser) {
    res.status(404);
    throw new Error("Requester not found");
  }

  if (requesterUser.role !== "requester") {
    res.status(400);
    throw new Error("requester must have requester role");
  }

  if (!projectRecord || !projectRecord.isActive) {
    res.status(404);
    throw new Error("Project not found or inactive");
  }

  const payment = await PaymentRequest.create({
    requestNo: await getNextRequestNumber(),
    requester,
    project,
    payeeName,
    description,
    invoiceNumber,
    vendorName,
    materialItem,
    amount,
    currency,
    dueDate,
    requestedPaymentMode,
    requestChannel,
    accountDetails,
    attachments: Array.isArray(attachments) ? attachments : [],
    history: [
      {
        actionBy: requester,
        role: requesterUser.role,
        action: "created",
        statusFrom: null,
        statusTo: "pending",
        comment: "Payment request created",
      },
    ],
    comments:
      initialComment && initialComment.trim()
        ? [
            {
              author: requester,
              role: requesterUser.role,
              message: initialComment.trim(),
            },
          ]
        : [],
  });

  const populatedPayment = await PaymentRequest.findById(payment._id).populate(PAYMENT_POPULATE);

  res.status(201).json({
    success: true,
    data: populatedPayment,
  });
});

const updatePayment = asyncHandler(async (req, res) => {
  const payment = await PaymentRequest.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error("Payment request not found");
  }

  if (!["pending", "on_hold"].includes(payment.status)) {
    res.status(400);
    throw new Error("Only pending or on-hold requests can be edited");
  }

  const {
    payeeName,
    description,
    invoiceNumber,
    vendorName,
    materialItem,
    amount,
    currency,
    dueDate,
    project,
    requestedPaymentMode,
    requestChannel,
    accountDetails,
    attachments,
    actorId,
  } = req.body;

  if (project) {
    const projectRecord = await Project.findById(project);

    if (!projectRecord || !projectRecord.isActive) {
      res.status(404);
      throw new Error("Project not found or inactive");
    }

    payment.project = project;
  }

  payment.payeeName = payeeName ?? payment.payeeName;
  payment.description = description ?? payment.description;
  payment.invoiceNumber = invoiceNumber ?? payment.invoiceNumber;
  payment.vendorName = vendorName ?? payment.vendorName;
  payment.materialItem = materialItem ?? payment.materialItem;
  payment.amount = amount ?? payment.amount;
  payment.currency = currency ?? payment.currency;
  payment.dueDate = dueDate ?? payment.dueDate;
  payment.requestedPaymentMode = requestedPaymentMode ?? payment.requestedPaymentMode;
  payment.requestChannel = requestChannel ?? payment.requestChannel;
  payment.accountDetails = accountDetails ?? payment.accountDetails;
  payment.attachments = Array.isArray(attachments) ? attachments : payment.attachments;

  if (actorId) {
    const actor = await validateActor(actorId);

    payment.history.push({
      actionBy: actor._id,
      role: actor.role,
      action: "updated",
      statusFrom: payment.status,
      statusTo: payment.status,
      comment: "Payment request updated",
    });
  }

  await payment.save();

  const populatedPayment = await PaymentRequest.findById(payment._id).populate(PAYMENT_POPULATE);

  res.json({
    success: true,
    data: populatedPayment,
  });
});

const transitionPayment = asyncHandler(async (req, res) => {
  const { action, actorId, comment, transactionReference, paymentMode } = req.body;

  if (!action || !actorId) {
    res.status(400);
    throw new Error("action and actorId are required");
  }

  const payment = await PaymentRequest.findById(req.params.id).populate("project");

  if (!payment) {
    res.status(404);
    throw new Error("Payment request not found");
  }

  const actor = await validateActor(actorId);
  const currentStatus = payment.status;
  let nextStatus = currentStatus;
  let historyAction = action;

  if (action === "approve") {
    if (currentStatus === "pending" && actor.role === "finance_manager") {
      nextStatus =
        payment.amount >= payment.project.escalationThreshold
          ? "manager_approved"
          : "head_approved";
      historyAction = "approved";
    } else if (currentStatus === "manager_approved" && actor.role === "finance_head") {
      nextStatus = "head_approved";
      historyAction = "approved";
    } else {
      res.status(400);
      throw new Error("Approve action is not valid for the current status or actor role");
    }
  } else if (action === "reject") {
    if (!["finance_manager", "finance_head"].includes(actor.role)) {
      res.status(400);
      throw new Error("Only finance manager or finance head can reject a request");
    }

    if (!comment?.trim()) {
      res.status(400);
      throw new Error("A rejection reason is required");
    }

    nextStatus = "rejected";
    historyAction = "rejected";
  } else if (action === "hold") {
    if (!["finance_manager", "finance_head", "banker"].includes(actor.role)) {
      res.status(400);
      throw new Error("Only approvers or banker can place a request on hold");
    }

    nextStatus = "on_hold";
    historyAction = "on_hold";
  } else if (action === "pay") {
    if (currentStatus !== "head_approved" || actor.role !== "banker") {
      res.status(400);
      throw new Error("Only banker can complete payment for head-approved requests");
    }

    nextStatus = "paid";
    historyAction = "paid";
    payment.paymentDetails = {
      transactionReference: transactionReference || payment.paymentDetails.transactionReference,
      paymentMode: paymentMode || payment.paymentDetails.paymentMode,
      processedBy: actor._id,
      processedAt: new Date(),
    };
  } else {
    res.status(400);
    throw new Error("Unsupported action. Use approve, reject, hold or pay");
  }

  payment.status = nextStatus;
  payment.history.push({
    actionBy: actor._id,
    role: actor.role,
    action: historyAction,
    statusFrom: currentStatus,
    statusTo: nextStatus,
    comment: comment || "",
  });

  if (comment?.trim()) {
    payment.comments.push({
      author: actor._id,
      role: actor.role,
      message: comment.trim(),
    });
  }

  await payment.save();

  const populatedPayment = await PaymentRequest.findById(payment._id).populate(PAYMENT_POPULATE);

  res.json({
    success: true,
    data: populatedPayment,
  });
});

const addPaymentComment = asyncHandler(async (req, res) => {
  const { actorId, message } = req.body;

  if (!actorId || !message?.trim()) {
    res.status(400);
    throw new Error("actorId and message are required");
  }

  const payment = await PaymentRequest.findById(req.params.id);

  if (!payment) {
    res.status(404);
    throw new Error("Payment request not found");
  }

  const actor = await validateActor(actorId);

  payment.comments.push({
    author: actor._id,
    role: actor.role,
    message: message.trim(),
  });

  payment.history.push({
    actionBy: actor._id,
    role: actor.role,
    action: "commented",
    statusFrom: payment.status,
    statusTo: payment.status,
    comment: message.trim(),
  });

  await payment.save();

  const populatedPayment = await PaymentRequest.findById(payment._id).populate(PAYMENT_POPULATE);

  res.status(201).json({
    success: true,
    data: populatedPayment,
  });
});

module.exports = {
  getPayments,
  getPaymentMetrics,
  getPaymentById,
  createPayment,
  updatePayment,
  transitionPayment,
  addPaymentComment,
};
