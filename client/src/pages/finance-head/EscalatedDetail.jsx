import React from "react";
import WorkflowPaymentDetail from "../operations/WorkflowPaymentDetail";
import { isHeadAssigned } from "../operations/paymentSelectors";

const EscalatedDetail = () => (
  <WorkflowPaymentDetail role="finance_head" isAssigned={isHeadAssigned} />
);

export default EscalatedDetail;
