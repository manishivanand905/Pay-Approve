import React from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import RoleSelector from "./pages/auth/RoleSelector";
import LoginPage from "./pages/auth/LoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminHistory from "./pages/admin/AdminHistory";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminPaymentDetail from "./pages/admin/AdminPaymentDetail";
import ApprovalRules from "./pages/admin/ApprovalRules";
import ProjectManagement from "./pages/admin/ProjectManagement";
import Settings from "./pages/admin/Settings";
import UserManagement from "./pages/admin/UserManagement";
import UserAccessPage from "./pages/shared/UserAccessPage";
import ApprovalsDashboard from "./pages/finance-manager/ApprovalsDashboard";
import PendingList from "./pages/finance-manager/PendingList";
import PaymentDetail from "./pages/finance-manager/PaymentDetail";
import ManagerHistory from "./pages/finance-manager/ManagerHistory";
import EscalatedQueue from "./pages/finance-head/EscalatedQueue";
import EscalatedDetail from "./pages/finance-head/EscalatedDetail";
import HeadHistory from "./pages/finance-head/HeadHistory";
import PaymentsQueue from "./pages/banker/PaymentsQueue";
import PaymentExecution from "./pages/banker/PaymentExecution";
import BankerHistory from "./pages/banker/BankerHistory";
import OperationsLayout from "./pages/operations/OperationsLayout";
import RequesterDashboard from "./pages/requester/RequesterDashboard";
import NewRequest from "./pages/requester/NewRequest";
import RequestDetail from "./pages/requester/RequestDetail";
import History from "./pages/shared/History";
import GlobalStyles from "./styles/GlobalStyles";
import theme from "./styles/theme";
import { getDefaultRoute } from "./utils/routes";

const ROUTE_GROUPS = [
  {
    role: "requester",
    label: "Requester",
    routes: [
      {
        path: "/requester/dashboard",
        label: "Dashboard",
        title: "Requester Dashboard",
        description: "Submit, monitor, and manage payment requests from one place.",
        component: RequesterDashboard,
      },
      {
        path: "/requester/new",
        label: "New Request",
        title: "Create Payment Request",
        description: "Build and submit a new payment request with supporting details.",
        component: NewRequest,
      },
      {
        path: "/requester/history",
        label: "History",
        title: "Requester History",
        description: "Review the full lifecycle of previously submitted requests.",
        component: History,
      },
      {
        path: "/requester/request/:id",
        label: "Request Detail",
        title: "Request Detail",
        description: "Inspect a single request with attachments, activity, and comments.",
        component: RequestDetail,
        nav: false,
      },
    ],
  },
  {
    role: "finance_manager",
    label: "Finance Manager",
    routes: [
      {
        path: "/manager/approvals",
        label: "Approvals",
        title: "Approvals Dashboard",
        description: "Review pending requests and move valid payments forward.",
        component: ApprovalsDashboard,
      },
      {
        path: "/manager/team",
        label: "User Access",
        title: "User Access",
        description: "Create banker and requester accounts from the finance manager workspace.",
        component: UserAccessPage,
        nav: false,
      },
      {
        path: "/manager/pending",
        label: "Pending List",
        title: "Pending Requests",
        description: "Inspect requests awaiting manager-level review and action.",
        component: PendingList,
      },
      {
        path: "/manager/history",
        label: "History",
        title: "Manager History",
        description: "Track previously approved, rejected, or escalated requests.",
        component: ManagerHistory,
      },
      {
        path: "/manager/payment/:id",
        label: "Payment Detail",
        title: "Payment Detail",
        description: "Review one request and capture your approval decision.",
        component: PaymentDetail,
        nav: false,
      },
    ],
  },
  {
    role: "finance_head",
    label: "Finance Head",
    routes: [
      {
        path: "/head/escalated",
        label: "Escalated",
        title: "Escalated Queue",
        description: "Handle high-value or exceptional payment approvals.",
        component: EscalatedQueue,
      },
      {
        path: "/head/team",
        label: "User Access",
        title: "User Access",
        description: "Create finance managers, bankers and requesters from the finance head workspace.",
        component: UserAccessPage,
        nav: false,
      },
      {
        path: "/head/payment/:id",
        label: "Payment Detail",
        title: "Escalated Payment Detail",
        description: "Inspect a single escalated payment and make a final decision.",
        component: EscalatedDetail,
        nav: false,
      },
      {
        path: "/head/history",
        label: "History",
        title: "Head History",
        description: "Audit previous escalations and finance-head decisions.",
        component: HeadHistory,
      },
    ],
  },
  {
    role: "banker",
    label: "Banker",
    routes: [
      {
        path: "/banker/queue",
        label: "Payments Queue",
        title: "Payments Queue",
        description: "Process approved requests that are ready for execution.",
        component: PaymentsQueue,
      },
      {
        path: "/banker/payment/:id",
        label: "Payment Detail",
        title: "Payment Execution",
        description: "Execute an approved payment and record the transaction state.",
        component: PaymentExecution,
        nav: false,
      },
      {
        path: "/banker/history",
        label: "History",
        title: "Banker History",
        description: "Review completed, partial, and failed payment executions.",
        component: BankerHistory,
      },
    ],
  },
  {
    role: "admin",
    label: "Admin",
    routes: [
      {
        path: "/admin/overview",
        label: "Overview",
        title: "Admin Overview",
        description: "Monitor users, projects, and workflow configuration from a single entry point.",
        component: AdminOverview,
      },
      {
        path: "/admin/users",
        label: "Users",
        title: "User Management",
        description: "Create, update, and deactivate user access across workflow roles.",
        component: UserManagement,
      },
      {
        path: "/admin/projects",
        label: "Projects",
        title: "Project Management",
        description: "Maintain project metadata used during request creation and approval.",
        component: ProjectManagement,
      },
      {
        path: "/admin/rules",
        label: "Approval Rules",
        title: "Approval Rules",
        description: "Configure approval thresholds and escalation logic for payments.",
        component: ApprovalRules,
      },
      {
        path: "/admin/settings",
        label: "Settings",
        title: "Settings",
        description: "Configure channels and notification delivery settings.",
        component: Settings,
      },
      {
        path: "/admin/history",
        label: "History",
        title: "Admin History",
        description: "Audit configuration changes and administrative activity.",
        component: AdminHistory,
      },
      {
        path: "/admin/payment/:id",
        label: "Payment Detail",
        title: "Admin Payment Detail",
        description: "Inspect a single payment request with full audit history.",
        component: AdminPaymentDetail,
        nav: false,
      },
    ],
  },
];

const getRouteGroup = (role) =>
  ROUTE_GROUPS.find((group) => group.role === role) || null;

const AuthLoadingScreen = () => <LoadingScreen>Loading session...</LoadingScreen>;

const HomeRoute = () => {
  const { authReady, currentUser } = useAuth();

  if (!authReady) {
    return <AuthLoadingScreen />;
  }

  if (currentUser) {
    return <Navigate to={getDefaultRoute(currentUser.role)} replace />;
  }

  return <RoleSelector />;
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { authReady, currentUser, logout } = useAuth();

  if (!authReady) {
    return <AuthLoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={getDefaultRoute(currentUser.role)} replace />;
  }

  const routeGroup = getRouteGroup(currentUser.role);

  if (!routeGroup) {
    return <Navigate to="/" replace />;
  }

  if (currentUser.role === "admin") {
    return (
      <AdminLayout
        navigationItems={routeGroup.routes.filter((route) => route.nav !== false)}
        onSignOut={logout}
      />
    );
  }

  if (["finance_manager", "finance_head", "banker"].includes(currentUser.role)) {
    return (
      <OperationsLayout
        navigationItems={routeGroup.routes.filter((route) => route.nav !== false)}
        onSignOut={logout}
        workspaceLabel={routeGroup.label}
      />
    );
  }

  return <AppShell routeGroup={routeGroup} onSignOut={logout} />;
};

const RouteScreen = ({ route }) => {
  const { currentUser } = useAuth();
  const params = useParams();
  const paramEntries = Object.entries(params);

  return (
    <ScreenCard>
      <ScreenEyebrow>{getRouteGroup(currentUser?.role)?.label}</ScreenEyebrow>
      <ScreenTitle>{route.title}</ScreenTitle>
      <ScreenDescription>{route.description}</ScreenDescription>
      <MetaGrid>
        <MetaItem>
          <MetaLabel>Path</MetaLabel>
          <MetaValue>{route.path}</MetaValue>
        </MetaItem>
        <MetaItem>
          <MetaLabel>Status</MetaLabel>
          <MetaValue>Route wired in App.jsx</MetaValue>
        </MetaItem>
      </MetaGrid>
      {paramEntries.length > 0 && (
        <ParamsBox>
          {paramEntries.map(([key, value]) => (
            <ParamRow key={key}>
              <span>{key}</span>
              <strong>{value}</strong>
            </ParamRow>
          ))}
        </ParamsBox>
      )}
    </ScreenCard>
  );
};

const RouteElement = ({ route }) => {
  if (route.component) {
    const Component = route.component;
    return <Component />;
  }

  return <RouteScreen route={route} />;
};

const AppRoutes = () => {
  const { authReady, currentUser } = useAuth();

  if (!authReady) {
    return <AuthLoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/auth/login/:role" element={<LoginPage />} />
      {ROUTE_GROUPS.map((group) => (
        <Route
          key={group.role}
          element={<ProtectedRoute allowedRoles={[group.role]} />}
        >
          {group.routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<RouteElement route={route} />}
            />
          ))}
        </Route>
      ))}
      <Route
        path="*"
        element={
          <Navigate
            to={currentUser ? getDefaultRoute(currentUser.role) : "/"}
            replace
          />
        }
      />
    </Routes>
  );
};

const AppShell = ({ routeGroup, onSignOut }) => (
  <Shell>
    <Sidebar>
      <BrandBlock>
        <BrandTitle>PayApprove</BrandTitle>
        <BrandSubtitle>Payment workflow</BrandSubtitle>
      </BrandBlock>
      <RoleChip>{routeGroup.label}</RoleChip>
      <NavList>
        {routeGroup.routes
          .filter((route) => route.nav !== false)
          .map((route) => (
            <NavItem key={route.path} to={route.path} end>
              {route.label}
            </NavItem>
          ))}
      </NavList>
      <SidebarButton type="button" onClick={onSignOut}>
        Sign out
      </SidebarButton>
    </Sidebar>
    <MainPanel>
      <TopBar>
        <TopBarTitle>{routeGroup.label} Workspace</TopBarTitle>
        <TopBarText>Role-based access is enforced through the backend API.</TopBarText>
      </TopBar>
      <ContentArea>
        <Outlet />
      </ContentArea>
    </MainPanel>
  </Shell>
);

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);

const LoadingScreen = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const Shell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  background:
    radial-gradient(circle at top left, ${({ theme }) => theme.colors.accentSoft}, transparent 28%),
    ${({ theme }) => theme.colors.bgPrimary};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[8]};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(22, 27, 39, 0.92);
  backdrop-filter: blur(18px);

  @media (max-width: 900px) {
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const BrandTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const BrandSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RoleChip = styled.div`
  display: inline-flex;
  width: fit-content;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accent};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.bgCard};

  &.active {
    color: ${({ theme }) => theme.colors.textPrimary};
    border-color: ${({ theme }) => theme.colors.accent}66;
    background: ${({ theme }) => theme.colors.accentSoft};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    border-color: ${({ theme }) => theme.colors.borderLight};
  }
`;

const SidebarButton = styled.button`
  margin-top: auto;
  min-height: 44px;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.danger}55;
    color: ${({ theme }) => theme.colors.danger};
  }
`;

const MainPanel = styled.main`
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[8]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(15, 17, 23, 0.78);
  backdrop-filter: blur(18px);

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

const TopBarTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TopBarText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ContentArea = styled.section`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[8]};

  @media (max-width: 900px) {
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

const ScreenCard = styled.div`
  max-width: 760px;
  padding: ${({ theme }) => theme.spacing[8]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background:
    linear-gradient(180deg, rgba(28, 35, 51, 0.96), rgba(22, 27, 39, 0.96));
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ScreenEyebrow = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.accent};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const ScreenTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
`;

const ScreenDescription = styled.p`
  max-width: 60ch;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const MetaItem = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.bgPrimary};
`;

const MetaLabel = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const MetaValue = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const ParamsBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing[6]};
  display: grid;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.bgPrimary};
`;

const ParamRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textSecondary};

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: ${({ theme }) => theme.fonts.mono};
  }
`;

export default App;
