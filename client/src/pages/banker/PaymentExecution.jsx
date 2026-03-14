import React from "react";
import WorkflowPaymentDetail from "../operations/WorkflowPaymentDetail";
import { isBankerAssigned } from "../operations/paymentSelectors";

const PaymentExecution = () => (
  <WorkflowPaymentDetail role="banker" isAssigned={isBankerAssigned} />
);

export default PaymentExecution;
