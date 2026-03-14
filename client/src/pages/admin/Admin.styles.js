import styled, { css } from "styled-components";

const adminPalette = {
  canvas: "#f3f6fb",
  surface: "#ffffff",
  surfaceAlt: "#f8fafc",
  sidebarTop: "#09111f",
  sidebarBottom: "#08101d",
  sidebarActive: "#1d2740",
  border: "#d8e0ea",
  borderStrong: "#c7d2df",
  textStrong: "#0b1730",
  textBody: "#60789a",
  textSoft: "#7f90aa",
  action: "#1a2f63",
  actionHover: "#13254f",
  pill: "#edf2f7",
  success: "#178b57",
  successBg: "#dff5e9",
  warning: "#e59600",
  warningBg: "#ffefcf",
  danger: "#e43e35",
  dangerBg: "#fde4e2",
  paid: "#3668db",
  paidBg: "#e1eaff",
  hold: "#ff7a1a",
  holdBg: "#ffe5cf",
  shadow: "0 12px 32px rgba(8, 16, 29, 0.06)",
};

const pillStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

export const getStatusTone = (status) => {
  switch (status) {
    case "pending":
      return {
        color: adminPalette.warning,
        background: adminPalette.warningBg,
      };
    case "manager_approved":
    case "head_approved":
      return {
        color: adminPalette.success,
        background: adminPalette.successBg,
      };
    case "paid":
      return {
        color: adminPalette.paid,
        background: adminPalette.paidBg,
      };
    case "rejected":
      return {
        color: adminPalette.danger,
        background: adminPalette.dangerBg,
      };
    case "on_hold":
      return {
        color: adminPalette.hold,
        background: adminPalette.holdBg,
      };
    default:
      return {
        color: adminPalette.textStrong,
        background: adminPalette.pill,
      };
  }
};

export const getRoleTone = () => ({
  color: adminPalette.textStrong,
  background: adminPalette.pill,
});

export const AdminShell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  background: ${adminPalette.canvas};

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const AdminSidebarBackdrop = styled.button`
  display: none;

  @media (max-width: 960px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
    position: fixed;
    inset: 0;
    z-index: 20;
    border: none;
    background: rgba(8, 16, 29, 0.5);
  }
`;

export const AdminSidebar = styled.aside`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    180deg,
    ${adminPalette.sidebarTop},
    ${adminPalette.sidebarBottom}
  );
  color: #f4f7fb;
  border-right: 1px solid rgba(126, 150, 182, 0.18);

  @media (max-width: 960px) {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 30;
    width: min(320px, 86vw);
    transform: translateX(${({ $open }) => ($open ? "0" : "-100%")});
    transition: transform 0.24s ease;
  }
`;

export const AdminBrandWrap = styled.div`
  padding: 28px 24px 26px;
  border-bottom: 1px solid rgba(126, 150, 182, 0.12);
`;

export const AdminBrandTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
`;

export const AdminBrandSubtitle = styled.p`
  margin-top: 8px;
  font-size: 15px;
  color: #8090ad;
`;

export const AdminNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 14px 0;
`;

export const AdminNavItem = styled.a`
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 56px;
  padding: 0 16px;
  border-radius: 14px;
  color: #d7e0ef;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.18s ease, color 0.18s ease;

  svg {
    font-size: 16px;
  }

  &.active {
    background: ${adminPalette.sidebarActive};
    color: #ffffff;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #ffffff;
  }
`;

export const AdminSidebarFooter = styled.div`
  margin-top: auto;
  padding: 18px 18px 22px;
  border-top: 1px solid rgba(126, 150, 182, 0.12);
`;

export const AdminProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
`;

export const AdminAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${adminPalette.action};
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
`;

export const AdminProfileMeta = styled.div`
  min-width: 0;
`;

export const AdminProfileName = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
`;

export const AdminProfileRole = styled.p`
  margin-top: 4px;
  font-size: 15px;
  color: #90a0bc;
`;

export const AdminSignOutButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  border: none;
  background: transparent;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;

  &:hover {
    color: #dbe6ff;
  }
`;

export const AdminMain = styled.div`
  min-width: 0;
  background: ${adminPalette.canvas};
`;

export const AdminMobileBar = styled.div`
  display: none;

  @media (max-width: 960px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    position: sticky;
    top: 0;
    z-index: 10;
    padding: 18px 20px;
    background: rgba(243, 246, 251, 0.95);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid ${adminPalette.border};
  }
`;

export const AdminMobileBrand = styled.div`
  h2 {
    font-size: 20px;
    color: ${adminPalette.textStrong};
  }

  p {
    margin-top: 4px;
    font-size: 13px;
    color: ${adminPalette.textBody};
  }
`;

export const AdminMobileMenuButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${adminPalette.surface};
  border: 1px solid ${adminPalette.border};
  color: ${adminPalette.textStrong};
  box-shadow: ${adminPalette.shadow};
`;

export const AdminContent = styled.main`
  padding: 42px 40px 48px;

  @media (max-width: 1280px) {
    padding: 34px 28px 40px;
  }

  @media (max-width: 960px) {
    padding: 24px 20px 32px;
  }
`;

export const AdminPage = styled.div`
  max-width: 1520px;
  margin: 0 auto;
`;

export const AdminHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const AdminHeaderText = styled.div``;

export const AdminPageTitle = styled.h1`
  font-size: clamp(34px, 3vw, 46px);
  line-height: 1.1;
  letter-spacing: -0.04em;
  color: ${adminPalette.textStrong};
`;

export const AdminPageSubtitle = styled.p`
  margin-top: 10px;
  font-size: 16px;
  color: ${adminPalette.textBody};
`;

export const PrimaryActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-width: 154px;
  min-height: 50px;
  padding: 0 20px;
  border-radius: 12px;
  background: ${adminPalette.action};
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 10px 24px rgba(26, 47, 99, 0.2);

  &:hover {
    background: ${adminPalette.actionHover};
  }

  @media (max-width: 700px) {
    width: 100%;
  }
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 42px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 118px;
  padding: 24px;
  border: 1px solid ${adminPalette.border};
  border-radius: 18px;
  background: ${adminPalette.surface};
  box-shadow: ${adminPalette.shadow};
`;

export const MetricIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef2f7;
  color: #7786a0;
  font-size: 20px;
  flex-shrink: 0;
`;

export const MetricInfo = styled.div`
  min-width: 0;
`;

export const MetricLabel = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${adminPalette.textBody};
`;

export const MetricValue = styled.p`
  margin-top: 8px;
  font-size: 26px;
  font-weight: 800;
  color: ${adminPalette.textStrong};
`;

export const SectionTitle = styled.h2`
  margin-bottom: 18px;
  font-size: 24px;
  color: ${adminPalette.textStrong};
`;

export const TableCard = styled.section`
  border: 1px solid ${adminPalette.border};
  border-radius: 18px;
  background: ${adminPalette.surface};
  overflow: hidden;
  box-shadow: ${adminPalette.shadow};
`;

export const TableScroll = styled.div`
  overflow-x: auto;
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  @media (max-width: 900px) {
    min-width: 100%;
  }
`;

export const DataTableHead = styled.thead`
  background: ${adminPalette.surfaceAlt};

  @media (max-width: 900px) {
    display: none;
  }
`;

export const HeaderCell = styled.th`
  padding: 18px 20px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: ${adminPalette.textBody};
  border-bottom: 1px solid ${adminPalette.border};
  white-space: nowrap;
`;

export const DataRow = styled.tr`
  ${({ $interactive }) =>
    $interactive &&
    css`
      cursor: pointer;

      &:hover td {
        background: #f8fafc;
      }

      &:focus-visible {
        outline: 3px solid rgba(26, 47, 99, 0.18);
        outline-offset: -3px;
      }
    `}

  &:not(:last-child) td {
    border-bottom: 1px solid ${adminPalette.border};
  }

  @media (max-width: 900px) {
    display: block;
    padding: 18px 18px 10px;
    border-bottom: 1px solid ${adminPalette.border};

    &:last-child {
      border-bottom: none;
    }

    &:not(:last-child) td {
      border-bottom: none;
    }
  }
`;

export const DataCell = styled.td`
  padding: 18px 20px;
  font-size: 16px;
  color: ${adminPalette.textBody};
  vertical-align: middle;

  @media (max-width: 900px) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
    padding: 8px 0;
    text-align: right;

    &::before {
      content: attr(data-label);
      flex: 0 0 42%;
      color: ${adminPalette.textSoft};
      font-size: 13px;
      font-weight: 600;
      text-align: left;
    }
  }
`;

export const StrongText = styled.span`
  color: ${adminPalette.textStrong};
  font-weight: 700;
`;

export const EllipsisText = styled.span`
  display: inline-block;
  max-width: 290px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 900px) {
    max-width: 56vw;
    white-space: normal;
  }
`;

export const StatusPill = styled.span`
  ${pillStyles};
  color: ${({ $tone }) => $tone.color};
  background: ${({ $tone }) => $tone.background};
`;

export const RolePill = styled.span`
  ${pillStyles};
  color: ${({ $tone }) => $tone.color};
  background: ${({ $tone }) => $tone.background};
`;

export const TextButton = styled.button`
  padding: 0;
  border: none;
  background: transparent;
  color: ${adminPalette.textStrong};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    color: ${adminPalette.action};
  }
`;

export const DangerTextButton = styled(TextButton)`
  color: ${adminPalette.danger};

  &:hover {
    color: #c12d25;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`;

export const SecondaryActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-width: 132px;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid ${adminPalette.borderStrong};
  background: ${adminPalette.surface};
  color: ${adminPalette.textStrong};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: ${adminPalette.surfaceAlt};
  }
`;

export const ProjectList = styled.div`
  display: grid;
  gap: 20px;
`;

export const ProjectCard = styled.section`
  padding: 28px 26px;
  border: 1px solid ${adminPalette.border};
  border-radius: 18px;
  background: ${adminPalette.surface};
  box-shadow: ${adminPalette.shadow};
`;

export const ProjectHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

export const ProjectTitle = styled.h2`
  font-size: 22px;
  color: ${adminPalette.textStrong};
`;

export const ProjectCode = styled.p`
  margin-top: 8px;
  font-size: 14px;
  color: ${adminPalette.textBody};
`;

export const ProjectMetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  margin-top: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const ProjectMetaItem = styled.div``;

export const ProjectMetaLabel = styled.p`
  font-size: 14px;
  color: ${adminPalette.textBody};
`;

export const ProjectMetaValue = styled.p`
  margin-top: 6px;
  font-size: 16px;
  font-weight: 700;
  color: ${adminPalette.textStrong};
`;

export const FormCard = styled.section`
  max-width: 840px;
  padding: 30px;
  border: 1px solid ${adminPalette.border};
  border-radius: 18px;
  background: ${adminPalette.surface};
  box-shadow: ${adminPalette.shadow};

  & + & {
    margin-top: 30px;
  }

  @media (max-width: 700px) {
    padding: 22px 18px;
  }
`;

export const FormCardTitle = styled.h2`
  margin-bottom: 28px;
  font-size: 22px;
  color: ${adminPalette.textStrong};
`;

export const InlineMessage = styled.p`
  margin-bottom: 18px;
  font-size: 15px;
  color: ${({ $tone }) => {
    switch ($tone) {
      case "error":
        return adminPalette.danger;
      case "success":
        return adminPalette.success;
      default:
        return adminPalette.textBody;
    }
  }};
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

export const ToggleList = styled.div`
  display: grid;
  gap: 24px;
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const ToggleTextGroup = styled.div`
  min-width: 0;
`;

export const ToggleTitle = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: ${adminPalette.textStrong};
`;

export const ToggleHint = styled.p`
  margin-top: 6px;
  font-size: 15px;
  color: ${adminPalette.textBody};
`;

export const ToggleTrack = styled.button`
  position: relative;
  width: 56px;
  height: 30px;
  border: none;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? adminPalette.action : "#d1d8e0"};
  transition: background-color 0.2s ease;
  flex-shrink: 0;
`;

export const ToggleThumb = styled.span`
  position: absolute;
  top: 3px;
  left: ${({ $active }) => ($active ? "29px" : "3px")};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(8, 16, 29, 0.12);
  transition: left 0.2s ease;
`;

export const FieldGroup = styled.label`
  display: block;

  & + & {
    margin-top: 24px;
  }
`;

export const FieldLabel = styled.span`
  display: inline-block;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 700;
  color: ${adminPalette.textStrong};
`;

export const FieldInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid ${adminPalette.borderStrong};
  border-radius: 12px;
  background: ${adminPalette.surfaceAlt};
  color: ${adminPalette.textStrong};
  font-size: 16px;

  &::placeholder {
    color: ${adminPalette.textBody};
  }

  &:focus {
    border-color: ${adminPalette.action};
    box-shadow: 0 0 0 4px rgba(26, 47, 99, 0.12);
  }
`;

export const FieldTextarea = styled.textarea`
  width: 100%;
  min-height: 108px;
  padding: 14px 16px;
  border: 1px solid ${adminPalette.borderStrong};
  border-radius: 12px;
  background: ${adminPalette.surfaceAlt};
  color: ${adminPalette.textStrong};
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;

  &::placeholder {
    color: ${adminPalette.textBody};
  }

  &:focus {
    border-color: ${adminPalette.action};
    box-shadow: 0 0 0 4px rgba(26, 47, 99, 0.12);
  }
`;

export const FormActions = styled.div`
  margin-top: 20px;
`;

export const HelperText = styled.p`
  margin-top: 10px;
  font-size: 14px;
  color: ${adminPalette.textBody};
`;

export const EmptyStateCard = styled.section`
  padding: 28px 26px;
  border: 1px dashed ${adminPalette.borderStrong};
  border-radius: 18px;
  background: ${adminPalette.surfaceAlt};
`;

export const EmptyStateTitle = styled.h2`
  font-size: 22px;
  color: ${adminPalette.textStrong};
`;

export const EmptyStateText = styled.p`
  margin-top: 10px;
  max-width: 62ch;
  font-size: 16px;
  color: ${adminPalette.textBody};
  line-height: 1.7;
`;

export const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchField = styled.label`
  position: relative;
  flex: 1;
  max-width: 480px;

  @media (max-width: 800px) {
    max-width: none;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px 0 46px;
  border: 1px solid ${adminPalette.borderStrong};
  border-radius: 12px;
  background: ${adminPalette.surface};
  color: ${adminPalette.textStrong};
  font-size: 16px;

  &::placeholder {
    color: ${adminPalette.textBody};
  }
`;

export const SearchIconBox = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${adminPalette.textBody};
  pointer-events: none;
`;

export const SelectField = styled.label`
  position: relative;
  width: 240px;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

export const SelectElement = styled.select`
  width: 100%;
  height: 48px;
  padding: 0 42px 0 16px;
  border: 1px solid ${adminPalette.borderStrong};
  border-radius: 12px;
  appearance: none;
  background: ${adminPalette.surface};
  color: ${adminPalette.textStrong};
  font-size: 16px;
`;

export const SelectIconBox = styled.span`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${adminPalette.textBody};
  pointer-events: none;
`;
