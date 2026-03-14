import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBuildingColumns,
  faClipboardList,
  faClockRotateLeft,
  faRightFromBracket,
  faSquareCheck,
  faTableCellsLarge,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { formatRoleLabel } from "../../utils/formatters";
import {
  AdminAvatar,
  AdminBrandSubtitle,
  AdminBrandTitle,
  AdminBrandWrap,
  AdminContent,
  AdminMain,
  AdminMobileBar,
  AdminMobileBrand,
  AdminMobileMenuButton,
  AdminNav,
  AdminNavItem,
  AdminPage,
  AdminProfileMeta,
  AdminProfileName,
  AdminProfileRole,
  AdminProfileRow,
  AdminShell,
  AdminSidebar,
  AdminSidebarBackdrop,
  AdminSidebarFooter,
  AdminSignOutButton,
} from "../admin/Admin.styles";

const ICONS_BY_PATH = {
  "/manager/approvals": faTableCellsLarge,
  "/manager/pending": faSquareCheck,
  "/manager/history": faClipboardList,
  "/head/escalated": faTriangleExclamation,
  "/head/history": faClipboardList,
  "/banker/queue": faBuildingColumns,
  "/banker/history": faClipboardList,
};

const OperationsLayout = ({ navigationItems, onSignOut, workspaceLabel }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser } = useAuth();

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleSignOut = () => {
    closeSidebar();
    onSignOut();
  };

  return (
    <AdminShell>
      <AdminSidebarBackdrop
        type="button"
        aria-label="Close navigation"
        $open={isSidebarOpen}
        onClick={closeSidebar}
      />
      <AdminSidebar $open={isSidebarOpen}>
        <AdminBrandWrap>
          <AdminBrandTitle>PayApprove</AdminBrandTitle>
          <AdminBrandSubtitle>Payment Management</AdminBrandSubtitle>
        </AdminBrandWrap>

        <AdminNav>
          {navigationItems.map((item) => (
            <AdminNavItem
              key={item.path}
              as={NavLink}
              to={item.path}
              end
              onClick={closeSidebar}
            >
              <FontAwesomeIcon icon={ICONS_BY_PATH[item.path] || faClockRotateLeft} />
              <span>{item.label}</span>
            </AdminNavItem>
          ))}
        </AdminNav>

        <AdminSidebarFooter>
          <AdminProfileRow>
            <AdminAvatar>{currentUser?.name?.slice(0, 2).toUpperCase() || "PA"}</AdminAvatar>
            <AdminProfileMeta>
              <AdminProfileName>{currentUser?.name || "PayApprove"}</AdminProfileName>
              <AdminProfileRole>
                {currentUser ? formatRoleLabel(currentUser.role) : workspaceLabel}
              </AdminProfileRole>
            </AdminProfileMeta>
          </AdminProfileRow>

          <AdminSignOutButton type="button" onClick={handleSignOut}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Sign Out</span>
          </AdminSignOutButton>
        </AdminSidebarFooter>
      </AdminSidebar>

      <AdminMain>
        <AdminMobileBar>
          <AdminMobileBrand>
            <h2>PayApprove</h2>
            <p>{workspaceLabel} workspace</p>
          </AdminMobileBrand>
          <AdminMobileMenuButton
            type="button"
            aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setIsSidebarOpen((open) => !open)}
          >
            <FontAwesomeIcon icon={isSidebarOpen ? faXmark : faBars} />
          </AdminMobileMenuButton>
        </AdminMobileBar>

        <AdminContent>
          <AdminPage>
            <Outlet />
          </AdminPage>
        </AdminContent>
      </AdminMain>
    </AdminShell>
  );
};

export default OperationsLayout;
