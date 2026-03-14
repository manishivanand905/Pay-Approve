import styled, { keyframes } from "styled-components";

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1);   opacity: 0.06; }
  50%       { transform: scale(1.1); opacity: 0.1;  }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

// ─── Color Resolver ───────────────────────────────────────────────────────────
// Maps color key → theme token
const resolveColor = (key, theme) => {
  const map = {
    accent: theme.colors.accent,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger: theme.colors.danger,
    info: theme.colors.info,
    purple: theme.colors.purple,
  };
  return map[key] || theme.colors.accent;
};

const resolveSoftColor = (key, theme) => {
  const map = {
    accent: theme.colors.accentSoft,
    success: theme.colors.successSoft,
    warning: theme.colors.warningSoft,
    danger: theme.colors.dangerSoft,
    info: theme.colors.infoSoft,
    purple: theme.colors.purpleSoft,
  };
  return map[key] || theme.colors.accentSoft;
};

// ─── Page Wrapper ─────────────────────────────────────────────────────────────
export const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.bgPrimary};
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing[6]};
`;

// ─── Ambient Glow Orbs ────────────────────────────────────────────────────────
export const GlowOrb = styled.div`
  position: absolute;
  top: ${({ $top }) => $top || "20%"};
  left: ${({ $left }) => $left || "20%"};
  width: ${({ $size }) => $size || "400px"};
  height: ${({ $size }) => $size || "400px"};
  border-radius: 50%;
  background: ${({ $color, theme }) => resolveColor($color, theme)};
  opacity: ${({ $opacity }) => $opacity || "0.06"};
  filter: blur(80px);
  pointer-events: none;
  animation: ${pulse} 6s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || "0s"};
`;

// ─── Center Container ─────────────────────────────────────────────────────────
export const Container = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.above};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]};
  width: 100%;
  max-width: 480px;
  animation: ${fadeUp} 0.5s ease both;
`;

// ─── Logo Block ───────────────────────────────────────────────────────────────
export const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  animation: ${fadeUp} 0.5s ease 0.05s both;
`;

export const LogoIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  box-shadow:
    0 0 0 1px ${({ theme }) => theme.colors.accent}44,
    0 8px 24px ${({ theme }) => theme.colors.accent}33;
`;

export const AppName = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.5px;

  /* subtle shimmer on name */
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.textPrimary} 0%,
    ${({ theme }) => theme.colors.accent}cc 50%,
    ${({ theme }) => theme.colors.textPrimary} 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite;
`;

export const AppTagline = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
`;

// ─── Role Card ────────────────────────────────────────────────────────────────
export const Card = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  animation: ${fadeUp} 0.5s ease 0.1s both;
`;

export const CardLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

// ─── Role List ────────────────────────────────────────────────────────────────
export const RoleList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

// ─── Role Item ────────────────────────────────────────────────────────────────
export const RoleItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgPrimary};
  cursor: pointer;
  position: relative;
  overflow: hidden;

  /* staggered entry animation */
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $index }) => `${0.15 + $index * 0.06}s`};

  /* left accent line */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: ${({ $color, theme }) => resolveColor($color, theme)};
    border-radius: ${({ theme }) => theme.radii.lg} 0 0
      ${({ theme }) => theme.radii.lg};
    transition: width ${({ theme }) => theme.transitions.normal};
  }

  &:hover {
    border-color: ${({ $color, theme }) => resolveColor($color, theme)}55;
    background: ${({ $color, theme }) => resolveSoftColor($color, theme)};
    transform: translateX(3px);
    transition:
      transform ${({ theme }) => theme.transitions.normal},
      background ${({ theme }) => theme.transitions.normal},
      border-color ${({ theme }) => theme.transitions.normal};

    &::before {
      width: 3px;
    }
  }

  &:active {
    transform: translateX(1px) scale(0.99);
  }
`;

// ─── Role Icon Box ────────────────────────────────────────────────────────────
export const RoleIconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $color, theme }) => resolveSoftColor($color, theme)};
  color: ${({ $color, theme }) => resolveColor($color, theme)};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid ${({ $color, theme }) => resolveColor($color, theme)}22;
  transition: background ${({ theme }) => theme.transitions.normal};

  ${RoleItem}:hover & {
    background: ${({ $color, theme }) => resolveColor($color, theme)}25;
  }
`;

// ─── Role Info ────────────────────────────────────────────────────────────────
export const RoleInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const RoleName = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 2px;
`;

export const RoleDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
`;

// ─── Arrow ────────────────────────────────────────────────────────────────────
export const RoleArrow = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-4px);
  transition:
    opacity ${({ theme }) => theme.transitions.normal},
    transform ${({ theme }) => theme.transitions.normal},
    color ${({ theme }) => theme.transitions.normal};

  ${RoleItem}:hover & {
    opacity: 1;
    transform: translateX(0);
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;
