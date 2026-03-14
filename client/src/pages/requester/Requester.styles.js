import styled, { css } from "styled-components";

const surface = css`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: rgba(28, 35, 51, 0.94);
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

export const RequesterPage = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[6]};
`;

export const RequesterHeader = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const RequesterTitle = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const RequesterSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

export const SummaryGrid = styled.div`
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

export const SummaryCard = styled.div`
  ${surface};
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
  padding: ${({ theme }) => theme.spacing[5]};
`;

export const SummaryIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: ${({ theme }) => theme.radii.lg};
  display: grid;
  place-items: center;
  background: ${({ $tone, theme }) =>
    $tone === "warning"
      ? theme.colors.warningSoft
      : $tone === "danger"
        ? theme.colors.dangerSoft
        : $tone === "success"
          ? theme.colors.successSoft
          : theme.colors.accentSoft};
  color: ${({ $tone, theme }) =>
    $tone === "warning"
      ? theme.colors.warning
      : $tone === "danger"
        ? theme.colors.danger
        : $tone === "success"
          ? theme.colors.success
          : theme.colors.accent};
  font-size: 1.25rem;
`;

export const SummaryMeta = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const SummaryLabel = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const SummaryValue = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const RequestTableCard = styled.div`
  ${surface};
  overflow: hidden;
`;

export const RequestTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  @media (max-width: 960px) {
    display: block;
  }
`;

export const RequestTableHead = styled.thead`
  background: rgba(15, 17, 23, 0.52);

  @media (max-width: 960px) {
    display: none;
  }
`;

export const RequestTableHeader = styled.th`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[5]}`};
  text-align: left;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const RequestRow = styled.tr`
  cursor: pointer;

  &:not(:last-child) td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  &:hover {
    background: rgba(15, 17, 23, 0.34);
  }

  @media (max-width: 960px) {
    display: block;
    padding: ${({ theme }) => theme.spacing[4]};

    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    }
  }
`;

export const RequestCell = styled.td`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[5]}`};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};

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

export const RequestStrong = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $status, theme }) => {
    switch ($status) {
      case "pending":
        return theme.colors.warningSoft;
      case "rejected":
        return theme.colors.dangerSoft;
      case "manager_approved":
      case "head_approved":
      case "paid":
        return theme.colors.successSoft;
      default:
        return theme.colors.accentSoft;
    }
  }};
  color: ${({ $status, theme }) => {
    switch ($status) {
      case "pending":
        return theme.colors.warning;
      case "rejected":
        return theme.colors.danger;
      case "manager_approved":
      case "head_approved":
      case "paid":
        return theme.colors.success;
      default:
        return theme.colors.accent;
    }
  }};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const EmptyCard = styled.div`
  ${surface};
  padding: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const FormCard = styled.form`
  ${surface};
  max-width: 920px;
  padding: ${({ theme }) => theme.spacing[6]};
  display: grid;
  gap: ${({ theme }) => theme.spacing[5]};
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.label`
  display: grid;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const FieldLabel = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const FieldInput = styled.input`
  min-height: 52px;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  background: rgba(15, 17, 23, 0.42);
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const FieldSelect = styled.select`
  min-height: 52px;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  background: rgba(15, 17, 23, 0.42);
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const FieldTextArea = styled.textarea`
  min-height: 132px;
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  background: rgba(15, 17, 23, 0.42);
  color: ${({ theme }) => theme.colors.textPrimary};
  resize: vertical;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const UploadArea = styled.label`
  border: 1px dashed ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: rgba(15, 17, 23, 0.24);
  cursor: pointer;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const AttachmentList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const AttachmentItem = styled.div`
  ${surface};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const ActionRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  flex-wrap: wrap;
`;

export const PrimaryButton = styled.button`
  min-height: 50px;
  padding: 0 ${({ theme }) => theme.spacing[5]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: none;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const SecondaryButton = styled.button`
  min-height: 50px;
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

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: ${({ theme }) => theme.spacing[5]};
  align-items: start;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailCard = styled.section`
  ${surface};
  padding: ${({ theme }) => theme.spacing[6]};
  display: grid;
  gap: ${({ theme }) => theme.spacing[5]};
`;

export const BackButton = styled.button`
  width: fit-content;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: start;
`;

export const DetailTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
`;

export const DetailDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const DetailMetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing[5]};

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailMetaItem = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const DetailMetaLabel = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const DetailMetaValue = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

export const TimelineList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const TimelineItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: start;
`;

export const TimelineDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 8px;
  background: ${({ $tone, theme }) =>
    $tone === "danger"
      ? theme.colors.danger
      : $tone === "warning"
        ? theme.colors.warning
        : theme.colors.success};
`;

export const TimelineMeta = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const TimelineTitle = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const TimelineText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const CommentBlock = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const CommentItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: start;
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accent};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  flex-shrink: 0;
`;

export const CommentMeta = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const CommentHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-wrap: wrap;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const CommentAuthor = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const CommentBody = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.7;
`;
