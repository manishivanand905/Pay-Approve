import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDefaultRoute } from "../../utils/routes";
import { ROLE_META } from "./roleOptions";
import {
  AuthForm,
  AuthHeader,
  AuthPanel,
  AuthShell,
  AuthText,
  AuthTitle,
  BackLink,
  FieldGroup,
  FieldInput,
  FieldLabel,
  HeroCard,
  HeroCardGrid,
  HeroCardLabel,
  HeroCardValue,
  HeroEyebrow,
  HeroPanel,
  HeroText,
  HeroTitle,
  InlineText,
  Message,
  ModeTab,
  ModeTabs,
  RoleBadge,
  SubmitButton,
} from "./AuthPage.styles";

const LoginPage = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const { currentUser, login, signupRequester } = useAuth();
  const roleMeta = ROLE_META[role];
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!roleMeta) {
    return <Navigate to="/" replace />;
  }

  if (currentUser) {
    return <Navigate to={getDefaultRoute(currentUser.role)} replace />;
  }

  const isRequesterSignup = role === "requester" && mode === "signup";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const user = isRequesterSignup
        ? await signupRequester(formData)
        : await login(role, {
            email: formData.email,
            password: formData.password,
          });

      navigate(getDefaultRoute(user.role), { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <HeroPanel>
        <div>
          <HeroEyebrow>Role Access</HeroEyebrow>
          <HeroTitle>{roleMeta.label} workspace</HeroTitle>
          <HeroText>{roleMeta.desc}</HeroText>
        </div>

        <HeroCardGrid>
          <HeroCard>
            <HeroCardLabel>After login</HeroCardLabel>
            <HeroCardValue>Open the dashboard for {roleMeta.label}</HeroCardValue>
          </HeroCard>
          <HeroCard>
            <HeroCardLabel>Permissions</HeroCardLabel>
            <HeroCardValue>
              {role === "admin"
                ? "Can create every role in the system."
                : role === "finance_head"
                  ? "Can create finance manager, banker and requester accounts."
                  : role === "finance_manager"
                    ? "Can create banker and requester accounts."
                    : role === "requester"
                      ? "Can sign up directly and raise payment requests."
                      : "Uses assigned account to execute approved payments."}
            </HeroCardValue>
          </HeroCard>
          {role === "admin" && (
            <HeroCard>
              <HeroCardLabel>Local default admin</HeroCardLabel>
              <HeroCardValue>admin@paybuild.local / Admin@123</HeroCardValue>
            </HeroCard>
          )}
        </HeroCardGrid>
      </HeroPanel>

      <AuthPanel>
        <AuthHeader>
          <BackLink type="button" onClick={() => navigate("/")}>
            Back to role selection
          </BackLink>
          <AuthTitle>{isRequesterSignup ? "Create requester account" : "Sign in"}</AuthTitle>
          <AuthText>
            Continue as <RoleBadge>{roleMeta.label}</RoleBadge>
          </AuthText>
        </AuthHeader>

        {role === "requester" && (
          <ModeTabs>
            <ModeTab
              type="button"
              $active={mode === "login"}
              onClick={() => setMode("login")}
            >
              Login
            </ModeTab>
            <ModeTab
              type="button"
              $active={mode === "signup"}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </ModeTab>
          </ModeTabs>
        )}

        {error && <Message $tone="error">{error}</Message>}

        <AuthForm onSubmit={handleSubmit}>
          {isRequesterSignup && (
            <FieldGroup>
              <FieldLabel>Full name</FieldLabel>
              <FieldInput
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </FieldGroup>
          )}

          <FieldGroup>
            <FieldLabel>Email</FieldLabel>
            <FieldInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              required
            />
          </FieldGroup>

          {isRequesterSignup && (
            <FieldGroup>
              <FieldLabel>Department</FieldLabel>
              <FieldInput
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Operations, Procurement, Marketing..."
              />
            </FieldGroup>
          )}

          <FieldGroup>
            <FieldLabel>Password</FieldLabel>
            <FieldInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
            />
          </FieldGroup>

          <SubmitButton type="submit" disabled={submitting}>
            {submitting
              ? "Please wait..."
              : isRequesterSignup
                ? "Create requester account"
                : `Continue to ${roleMeta.label}`}
          </SubmitButton>
        </AuthForm>

        {role !== "requester" && (
          <InlineText>
            These roles are assigned by authorized users. Use an existing account for{" "}
            <strong>{roleMeta.label}</strong>.
          </InlineText>
        )}
      </AuthPanel>
    </AuthShell>
  );
};

export default LoginPage;
