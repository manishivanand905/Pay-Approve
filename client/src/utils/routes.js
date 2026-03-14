export const ROUTE_BY_ROLE = {
  admin: "/admin/overview",
  finance_head: "/head/escalated",
  finance_manager: "/manager/approvals",
  banker: "/banker/queue",
  requester: "/requester/dashboard",
};

export const getDefaultRoute = (role) => ROUTE_BY_ROLE[role] || "/";
