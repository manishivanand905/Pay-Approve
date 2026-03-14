import styled from "styled-components";

const card = `
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: rgba(28, 35, 51, 0.94);
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

export const ManagerPage = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[6]};
`;

export const ManagerHeader = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const ManagerTitle = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ManagerSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div`
  ${card};
  padding: ${({ theme }) => theme.spacing[5]};
  display: grid;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const MetricLabel = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const MetricValue = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const TableCard = styled.div`
  ${card};
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  @media (max-width: 960px) {
    display: block;
  }
`;

export const TableHead = styled.thead`
  background: rgba(15, 17, 23, 0.5);

  @media (max-width: 960px) {
    display: none;
  }
`;

export const Th = styled.th`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[5]}`};
  text-align: left;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const Tr = styled.tr`
  cursor: ${({ $interactive }) => ($interactive ? "pointer" : "default")};

  &:not(:last-child) td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  &:hover {
    background: ${({ $interactive }) => ($interactive ? "rgba(15, 17, 23, 0.32)" : "transparent")};
  }

  @media (max-width: 960px) {
    display: block;
    padding: ${({ theme }) => theme.spacing[4]};

    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    }
  }
`;

export const Td = styled.td`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[5]}`};
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (max-width: 960px) {
    display: flex;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing[4]};
    padding: ${({ theme }) => `${theme.spacing[2]} 0`};

    &::before {
      content: attr(data-label);
      color: ${({ theme }) => theme.colors.textMuted};
      font-size: ${({ theme }) => theme.fontSizes.xs};
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
  }
`;

export const Strong = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $status, theme }) =>
    $status === "pending"
      ? theme.colors.warningSoft
      : $status === "rejected"
        ? theme.colors.dangerSoft
        : $status === "on_hold"
          ? theme.colors.warningSoft
          : theme.colors.successSoft};
  color: ${({ $status, theme }) =>
    $status === "pending"
      ? theme.colors.warning
      : $status === "rejected"
        ? theme.colors.danger
        : $status === "on_hold"
          ? theme.colors.warning
          : theme.colors.success};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const EmptyCard = styled.div`
  ${card};
  padding: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const BackButton = styled.button`
  width: fit-content;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const DetailGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[5]};
`;

export const DetailCard = styled.section`
  ${card};
  padding: ${({ theme }) => theme.spacing[6]};
  display: grid;
  gap: ${({ theme }) => theme.spacing[5]};
`;

export const DetailMetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const MetaItem = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const MetaLabel = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const MetaValue = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

export const FieldGroup = styled.label`
  display: grid;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const FieldLabel = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const FieldTextArea = styled.textarea`
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  background: rgba(15, 17, 23, 0.38);
  color: ${({ theme }) => theme.colors.textPrimary};
  resize: vertical;
`;

export const ActionRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  flex-wrap: wrap;
`;

export const PrimaryButton = styled.button`
  min-height: 48px;
  padding: 0 ${({ theme }) => theme.spacing[5]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: none;
  background: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const DangerButton = styled.button`
  min-height: 48px;
  padding: 0 ${({ theme }) => theme.spacing[5]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: none;
  background: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const SecondaryButton = styled.button`
  min-height: 48px;
  padding: 0 ${({ theme }) => theme.spacing[5]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(15, 17, 23, 0.22);
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const InlineMessage = styled.p`
  color: ${({ $tone, theme }) =>
    $tone === "error" ? theme.colors.danger : theme.colors.success};
`;

export const ActivityList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const ActivityItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  background: rgba(15, 17, 23, 0.26);
`;

export const ActivityTitle = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const ActivityMeta = styled.p`
  margin-top: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
