import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faClockRotateLeft,
  faFolderOpen,
  faGear,
  faPlus,
  faRightFromBracket,
  faShieldHalved,
  faTableCellsLarge,
  faUsers,
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
} from "./Admin.styles";

const ICONS_BY_PATH = {
  "/admin/overview": faTableCellsLarge,
  "/admin/users": faUsers,
  "/admin/projects": faFolderOpen,
  "/admin/rules": faShieldHalved,
  "/admin/settings": faGear,
  "/admin/history": faClockRotateLeft,
};

const AdminLayout = ({ navigationItems, onSignOut }) => {
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
              <FontAwesomeIcon icon={ICONS_BY_PATH[item.path] || faPlus} />
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
                {currentUser ? formatRoleLabel(currentUser.role) : "Admin"}
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
            <p>Admin workspace</p>
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

export default AdminLayout;
