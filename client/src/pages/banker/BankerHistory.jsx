import React from "react";
import RoleHistoryPage from "../operations/RoleHistoryPage";
import { filterBankerPayments } from "../operations/paymentSelectors";

const BankerHistory = () => (
  <RoleHistoryPage
    title="History & Audit Trail"
    subtitle="Complete log of all payment requests"
    detailBasePath="/banker/payment"
    paymentFilter={filterBankerPayments}
    emptyTitle="No matching requests"
    emptyText="No banker-assigned requests were found for the current filters."
  />
);

export default BankerHistory;
