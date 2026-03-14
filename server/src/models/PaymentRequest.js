const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "requester", "finance_manager", "finance_head", "banker"],
    },
    action: {
      type: String,
      required: true,
      enum: ["created", "approved", "rejected", "on_hold", "paid", "updated", "commented"],
    },
    statusFrom: {
      type: String,
      default: null,
    },
    statusTo: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    actedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const attachmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
      default: "",
    },
    size: {
      type: Number,
      default: 0,
    },
    dataUrl: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "requester", "finance_manager", "finance_head", "banker"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const paymentRequestSchema = new mongoose.Schema(
  {
    requestNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    payeeName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    invoiceNumber: {
      type: String,
      trim: true,
      default: "",
    },
    vendorName: {
      type: String,
      trim: true,
      default: "",
    },
    materialItem: {
      type: String,
      trim: true,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
      trim: true,
      uppercase: true,
    },
    dueDate: {
      type: Date,
    },
    requestedPaymentMode: {
      type: String,
      trim: true,
      default: "",
    },
    requestChannel: {
      type: String,
      trim: true,
      default: "Manual",
    },
    accountDetails: {
      type: String,
      trim: true,
      default: "",
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: [
        "pending",
        "manager_approved",
        "head_approved",
        "on_hold",
        "rejected",
        "paid",
      ],
    },
    paymentDetails: {
      transactionReference: {
        type: String,
        trim: true,
        default: "",
      },
      paymentMode: {
        type: String,
        trim: true,
        default: "",
      },
      processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      processedAt: {
        type: Date,
        default: null,
      },
    },
    history: {
      type: [activitySchema],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PaymentRequest", paymentRequestSchema);
