import React, { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/formatters";
import {
  AdminHeaderRow,
  AdminHeaderText,
  AdminPageSubtitle,
  AdminPageTitle,
  ButtonRow,
  EmptyStateCard,
  EmptyStateText,
  EmptyStateTitle,
  FieldGroup,
  FieldInput,
  FieldLabel,
  FieldTextarea,
  FormActions,
  FormCard,
  FormCardTitle,
  FormGrid,
  HelperText,
  InlineMessage,
  PrimaryActionButton,
  ProjectCard,
  ProjectCode,
  ProjectHeaderRow,
  ProjectList,
  ProjectMetaGrid,
  ProjectMetaItem,
  ProjectMetaLabel,
  ProjectMetaValue,
  ProjectTitle,
  SecondaryActionButton,
  SelectElement,
  SelectField,
  TextButton,
} from "./Admin.styles";

const INITIAL_FORM = {
  name: "",
  code: "",
  description: "",
  manager: "",
  financeHead: "",
  banker: "",
  escalationThreshold: "",
};

const ProjectManagement = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [userOptions, setUserOptions] = useState({
    managers: [],
    financeHeads: [],
    bankers: [],
  });
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editingProjectId, setEditingProjectId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const setDefaultRoleSelections = (nextOptions) => {
    setFormData((current) => ({
      ...current,
      manager: current.manager || nextOptions.managers[0]?._id || "",
      financeHead: current.financeHead || nextOptions.financeHeads[0]?._id || "",
      banker: current.banker || nextOptions.bankers[0]?._id || "",
    }));
  };

  const resetForm = (nextOptions = userOptions) => {
    setEditingProjectId("");
    setFormData({
      ...INITIAL_FORM,
      manager: nextOptions.managers[0]?._id || "",
      financeHead: nextOptions.financeHeads[0]?._id || "",
      banker: nextOptions.bankers[0]?._id || "",
    });
  };

  useEffect(() => {
    let mounted = true;

    const loadManagementData = async () => {
      try {
        setLoading(true);
        const [projectsResponse, managersResponse, headsResponse, bankersResponse] =
          await Promise.all([
            apiRequest("/projects?active=true", { token }),
            apiRequest("/users?role=finance_manager&active=true", { token }),
            apiRequest("/users?role=finance_head&active=true", { token }),
            apiRequest("/users?role=banker&active=true", { token }),
          ]);

        if (!mounted) {
          return;
        }

        const nextOptions = {
          managers: managersResponse.data,
          financeHeads: headsResponse.data,
          bankers: bankersResponse.data,
        };

        setProjects(projectsResponse.data);
        setUserOptions(nextOptions);
        setDefaultRoleSelections(nextOptions);
      } catch (requestError) {
        if (mounted) {
          setError(requestError.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadManagementData();

    return () => {
      mounted = false;
    };
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = {
        ...formData,
        escalationThreshold: Number(formData.escalationThreshold),
      };

      const response = editingProjectId
        ? await apiRequest(`/projects/${editingProjectId}`, {
            method: "PUT",
            token,
            body: payload,
          })
        : await apiRequest("/projects", {
            method: "POST",
            token,
            body: payload,
          });

      setProjects((current) => {
        if (editingProjectId) {
          return current.map((project) =>
            project._id === editingProjectId ? response.data : project
          );
        }

        return [response.data, ...current];
      });

      setSuccessMessage(
        editingProjectId
          ? `${response.data.name} updated successfully.`
          : `${response.data.name} created successfully.`
      );
      resetForm();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (project) => {
    setEditingProjectId(project._id);
    setError("");
    setSuccessMessage("");
    setFormData({
      name: project.name || "",
      code: project.code || "",
      description: project.description || "",
      manager: project.manager?._id || "",
      financeHead: project.financeHead?._id || "",
      banker: project.banker?._id || "",
      escalationThreshold: String(project.escalationThreshold ?? ""),
    });
  };

  const missingAssignments =
    !userOptions.managers.length ||
    !userOptions.financeHeads.length ||
    !userOptions.bankers.length;

  return (
    <>
      <AdminHeaderRow>
        <AdminHeaderText>
          <AdminPageTitle>Project Management</AdminPageTitle>
          <AdminPageSubtitle>
            Add any number of projects once you have at least one manager, finance
            head, banker, and admin account in the system.
          </AdminPageSubtitle>
        </AdminHeaderText>
      </AdminHeaderRow>

      <FormCard as="form" onSubmit={handleSubmit}>
        <FormCardTitle>{editingProjectId ? "Edit project" : "Add New Project"}</FormCardTitle>

        {error && <InlineMessage $tone="error">{error}</InlineMessage>}
        {successMessage && <InlineMessage $tone="success">{successMessage}</InlineMessage>}

        {missingAssignments ? (
          <EmptyStateCard>
            <EmptyStateTitle>Required user roles are missing</EmptyStateTitle>
            <EmptyStateText>
              Create at least one finance manager, finance head, and banker before
              adding a project.
            </EmptyStateText>
          </EmptyStateCard>
        ) : (
          <>
            <FormGrid>
              <FieldGroup>
                <FieldLabel>Project Name</FieldLabel>
                <FieldInput
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Office Renovation"
                  required
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Project Code</FieldLabel>
                <FieldInput
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="OFF-REN"
                  required
                />
              </FieldGroup>
            </FormGrid>

            <FieldGroup>
              <FieldLabel>Description</FieldLabel>
              <FieldTextarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Optional project summary"
              />
            </FieldGroup>

            <FormGrid>
              <FieldGroup as="div">
                <FieldLabel>Manager</FieldLabel>
                <SelectField>
                  <SelectElement
                    name="manager"
                    value={formData.manager}
                    onChange={handleChange}
                    required
                  >
                    {userOptions.managers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </SelectElement>
                </SelectField>
              </FieldGroup>

              <FieldGroup as="div">
                <FieldLabel>Finance Head</FieldLabel>
                <SelectField>
                  <SelectElement
                    name="financeHead"
                    value={formData.financeHead}
                    onChange={handleChange}
                    required
                  >
                    {userOptions.financeHeads.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </SelectElement>
                </SelectField>
              </FieldGroup>
            </FormGrid>

            <FormGrid>
              <FieldGroup as="div">
                <FieldLabel>Banker</FieldLabel>
                <SelectField>
                  <SelectElement
                    name="banker"
                    value={formData.banker}
                    onChange={handleChange}
                    required
                  >
                    {userOptions.bankers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </SelectElement>
                </SelectField>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Escalation Threshold</FieldLabel>
                <FieldInput
                  type="number"
                  min="0"
                  name="escalationThreshold"
                  value={formData.escalationThreshold}
                  onChange={handleChange}
                  placeholder="50000"
                  required
                />
                <HelperText>Enter the amount in rupees without commas.</HelperText>
              </FieldGroup>
            </FormGrid>

            <FormActions>
              <ButtonRow>
                <PrimaryActionButton type="submit" disabled={submitting}>
                  {submitting
                    ? editingProjectId
                      ? "Saving..."
                      : "Creating..."
                    : editingProjectId
                      ? "Save Project"
                      : "Add New Project"}
                </PrimaryActionButton>
                {editingProjectId && (
                  <SecondaryActionButton type="button" onClick={() => resetForm()}>
                    Cancel
                  </SecondaryActionButton>
                )}
              </ButtonRow>
            </FormActions>
          </>
        )}
      </FormCard>

      {loading ? (
        <EmptyStateCard>
          <EmptyStateTitle>Loading projects</EmptyStateTitle>
          <EmptyStateText>
            The application is fetching project records and eligible role assignments.
          </EmptyStateText>
        </EmptyStateCard>
      ) : error && projects.length === 0 ? (
        <EmptyStateCard>
          <EmptyStateTitle>Unable to load projects</EmptyStateTitle>
          <EmptyStateText>{error}</EmptyStateText>
        </EmptyStateCard>
      ) : projects.length === 0 ? (
        <EmptyStateCard>
          <EmptyStateTitle>No projects created</EmptyStateTitle>
          <EmptyStateText>
            Add your first project above using values like Office Renovation,
            IT Infrastructure, or Marketing Campaign.
          </EmptyStateText>
        </EmptyStateCard>
      ) : (
        <ProjectList>
          {projects.map((project) => (
            <ProjectCard key={project._id}>
              <ProjectHeaderRow>
                <div>
                  <ProjectTitle>{project.name}</ProjectTitle>
                  <ProjectCode>Code: {project.code}</ProjectCode>
                </div>
                <TextButton type="button" onClick={() => startEdit(project)}>
                  Edit
                </TextButton>
              </ProjectHeaderRow>

              {project.description && <HelperText>{project.description}</HelperText>}

              <ProjectMetaGrid>
                <ProjectMetaItem>
                  <ProjectMetaLabel>Manager</ProjectMetaLabel>
                  <ProjectMetaValue>{project.manager?.name || "-"}</ProjectMetaValue>
                </ProjectMetaItem>
                <ProjectMetaItem>
                  <ProjectMetaLabel>Finance Head</ProjectMetaLabel>
                  <ProjectMetaValue>{project.financeHead?.name || "-"}</ProjectMetaValue>
                </ProjectMetaItem>
                <ProjectMetaItem>
                  <ProjectMetaLabel>Banker</ProjectMetaLabel>
                  <ProjectMetaValue>{project.banker?.name || "-"}</ProjectMetaValue>
                </ProjectMetaItem>
                <ProjectMetaItem>
                  <ProjectMetaLabel>Escalation Threshold</ProjectMetaLabel>
                  <ProjectMetaValue>
                    {formatCurrency(project.escalationThreshold || 0)}
                  </ProjectMetaValue>
                </ProjectMetaItem>
              </ProjectMetaGrid>
            </ProjectCard>
          ))}
        </ProjectList>
      )}
    </>
  );
};

export default ProjectManagement;
