export const ROLE_OPTIONS = [
  {
    key: "admin",
    label: "Admin",
    desc: "Manage users, projects and workflow controls",
    color: "info",
  },
  {
    key: "finance_head",
    label: "Finance Head",
    desc: "Approve escalations and create finance managers, bankers and requesters",
    color: "warning",
  },
  {
    key: "finance_manager",
    label: "Finance Manager",
    desc: "Approve payments and create bankers and requesters",
    color: "success",
  },
  {
    key: "banker",
    label: "Banker",
    desc: "Execute approved payments",
    color: "purple",
  },
  {
    key: "requester",
    label: "Requester",
    desc: "Submit requests and sign up for access",
    color: "accent",
  },
];

export const ROLE_META = Object.fromEntries(
  ROLE_OPTIONS.map((role) => [role.key, role])
);
