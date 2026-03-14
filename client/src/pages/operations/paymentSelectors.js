export const filterManagerPayments = (payments, managerId) =>
  payments.filter((payment) => payment.project?.manager?._id === managerId);

export const filterHeadPayments = (payments, headId) =>
  payments.filter((payment) => payment.project?.financeHead?._id === headId);

export const filterBankerPayments = (payments, bankerId) =>
  payments.filter((payment) => payment.project?.banker?._id === bankerId);

export const getManagerActionablePayments = (payments) =>
  payments.filter((payment) => ["pending", "on_hold"].includes(payment.status));

export const getHeadActionablePayments = (payments) =>
  payments.filter((payment) => payment.status === "manager_approved");

export const getBankerQueuePayments = (payments) =>
  payments.filter((payment) => ["head_approved", "on_hold"].includes(payment.status));

export const getSearchablePaymentText = (payment) =>
  [
    payment.requestNo,
    payment.requester?.name,
    payment.requester?.email,
    payment.project?.name,
    payment.project?.code,
    payment.description,
    payment.vendorName,
    payment.payeeName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const filterPaymentsByQueryAndStatus = (payments, query, statusFilter) =>
  payments.filter((payment) => {
    const matchesQuery = getSearchablePaymentText(payment).includes(query.trim().toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

export const sumPaymentAmounts = (payments) =>
  payments.reduce((total, payment) => total + (payment.amount || 0), 0);

export const isManagerAssigned = (payment, userId) => payment.project?.manager?._id === userId;

export const isHeadAssigned = (payment, userId) => payment.project?.financeHead?._id === userId;

export const isBankerAssigned = (payment, userId) => payment.project?.banker?._id === userId;
