import React from "react";
import WorkflowPaymentDetail from "../operations/WorkflowPaymentDetail";
import { isManagerAssigned } from "../operations/paymentSelectors";

const PaymentDetail = () => (
  <WorkflowPaymentDetail role="finance_manager" isAssigned={isManagerAssigned} />
);

export default PaymentDetail;
