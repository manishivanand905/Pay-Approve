import React from "react";
import RoleHistoryPage from "../operations/RoleHistoryPage";
import { filterManagerPayments } from "../operations/paymentSelectors";

const ManagerHistory = () => (
  <RoleHistoryPage
    title="History & Audit Trail"
    subtitle="Complete log of all payment requests"
    detailBasePath="/manager/payment"
    paymentFilter={filterManagerPayments}
    emptyTitle="No matching requests"
    emptyText="No payment requests were found for your assigned projects with the current filters."
  />
);

export default ManagerHistory;
