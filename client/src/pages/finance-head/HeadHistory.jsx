import React from "react";
import RoleHistoryPage from "../operations/RoleHistoryPage";
import { filterHeadPayments } from "../operations/paymentSelectors";

const HeadHistory = () => (
  <RoleHistoryPage
    title="History & Audit Trail"
    subtitle="Complete log of all payment requests"
    detailBasePath="/head/payment"
    paymentFilter={filterHeadPayments}
    emptyTitle="No matching requests"
    emptyText="No finance-head requests were found for the current filters."
  />
);

export default HeadHistory;
