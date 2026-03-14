import React from "react";
import { useNavigate } from "react-router-dom";
import { ROLE_OPTIONS } from "./roleOptions";
import {
  PageWrapper,
  GlowOrb,
  Container,
  LogoWrapper,
  LogoIcon,
  AppName,
  AppTagline,
  Card,
  CardLabel,
  RoleList,
  RoleItem,
  RoleIconBox,
  RoleInfo,
  RoleName,
  RoleDesc,
  RoleArrow,
} from "./RoleSelectorStyles";

const ROLE_ICONS = {
  admin: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  finance_head: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  finance_manager: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  banker: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  requester: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
};

const ROLES = ROLE_OPTIONS.map((role) => ({
  ...role,
  icon: ROLE_ICONS[role.key],
}));

const RoleSelector = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (roleKey) => {
    navigate(`/auth/login/${roleKey}`);
  };

  return (
    <PageWrapper>
      <GlowOrb $top="10%" $left="15%" $color="accent" />
      <GlowOrb $top="70%" $left="75%" $color="purple" $size="300px" />
      <GlowOrb
        $top="50%"
        $left="45%"
        $color="info"
        $size="200px"
        $opacity="0.03"
      />

      <Container>
        <LogoWrapper>
          <LogoIcon>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 5h12" />
              <path d="M6 9h12" />
              <path d="M10 5c3 0 5 1.8 5 4.5S13 14 10 14H6" />
              <path d="M6 14l8 6" />
            </svg>
          </LogoIcon>
          <AppName>PayApprove</AppName>
          <AppTagline>Payment approval workflow management</AppTagline>
        </LogoWrapper>

        <Card>
          <CardLabel>Select your role to continue</CardLabel>

          <RoleList>
            {ROLES.map((role, index) => (
              <RoleItem
                key={role.key}
                onClick={() => handleRoleSelect(role.key)}
                $color={role.color}
                $index={index}
              >
                <RoleIconBox $color={role.color}>{role.icon}</RoleIconBox>

                <RoleInfo>
                  <RoleName>{role.label}</RoleName>
                  <RoleDesc>{role.desc}</RoleDesc>
                </RoleInfo>

                <RoleArrow>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </RoleArrow>
              </RoleItem>
            ))}
          </RoleList>
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default RoleSelector;
