export const filterManagerPayments = (payments, managerId) =>
  payments.filter((payment) => payment.project?.manager?._id === managerId);

export const getActionablePayments = (payments) =>
  payments.filter((payment) => ["pending", "on_hold"].includes(payment.status));
