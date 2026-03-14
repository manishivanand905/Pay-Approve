import styled, { keyframes } from "styled-components";

const float = keyframes`
  from { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  to { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const AuthShell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(280px, 440px) minmax(0, 560px);
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[8]};
  padding: ${({ theme }) => theme.spacing[8]};
  background:
    radial-gradient(circle at top left, ${({ theme }) => theme.colors.accentSoft}, transparent 28%),
    radial-gradient(circle at bottom right, ${({ theme }) => theme.colors.purpleSoft}, transparent 32%),
    ${({ theme }) => theme.colors.bgPrimary};

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

export const AuthPanel = styled.section`
  padding: ${({ theme }) => theme.spacing[8]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: linear-gradient(180deg, rgba(28, 35, 51, 0.96), rgba(15, 17, 23, 0.98));
  box-shadow: ${({ theme }) => theme.shadows.lg};
  animation: ${fadeIn} 0.4s ease both;

  @media (max-width: 920px) {
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

export const HeroPanel = styled(AuthPanel)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[8]};
`;

export const HeroEyebrow = styled.p`
  color: ${({ theme }) => theme.colors.accent};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const HeroTitle = styled.h1`
  margin-top: ${({ theme }) => theme.spacing[3]};
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const HeroText = styled.p`
  margin-top: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`;

export const HeroCardGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const HeroCard = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: rgba(12, 16, 25, 0.72);
  animation: ${float} 6s ease-in-out infinite;
`;

export const HeroCardLabel = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

export const HeroCardValue = styled.p`
  margin-top: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  line-height: 1.5;
`;

export const AuthHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const BackLink = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const AuthTitle = styled.h2`
  margin-top: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
`;

export const AuthText = styled.p`
  margin-top: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`;

export const ModeTabs = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ModeTab = styled.button`
  min-height: 40px;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  border: none;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.accent : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const AuthForm = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const FieldGroup = styled.label`
  display: grid;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const FieldLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const FieldInput = styled.input`
  min-height: 50px;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  background: ${({ theme }) => theme.colors.bgInput};
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadows.accent};
  }
`;

export const SubmitButton = styled.button`
  min-height: 50px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.accentHover});
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
`;

export const Message = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid
    ${({ $tone, theme }) =>
      $tone === "error" ? `${theme.colors.danger}55` : `${theme.colors.success}55`};
  background:
    ${({ $tone, theme }) =>
      $tone === "error" ? theme.colors.dangerSoft : theme.colors.successSoft};
  color: ${({ $tone, theme }) =>
    $tone === "error" ? theme.colors.danger : theme.colors.success};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const RoleBadge = styled.span`
  display: inline-flex;
  width: fit-content;
  min-height: 28px;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accent};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

export const InlineText = styled.p`
  margin-top: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.6;

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;
