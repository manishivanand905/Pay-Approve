const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const STATUS_LABELS = {
  pending: "Pending",
  manager_approved: "Manager Approved",
  head_approved: "Head Approved",
  paid: "Paid",
  rejected: "Rejected",
  on_hold: "On Hold",
  escalated: "Escalated",
  partially_paid: "Partially Paid",
};

const ROLE_LABELS = {
  admin: "Admin",
  requester: "Requester",
  finance_manager: "Finance Manager",
  finance_head: "Finance Head",
  banker: "Banker",
};

export const formatCurrency = (value) => CURRENCY_FORMATTER.format(value);

export const formatStatusLabel = (status) => STATUS_LABELS[status] || status;

export const formatRoleLabel = (role) => ROLE_LABELS[role] || role;

export const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};
