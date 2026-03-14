import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../utils/api";
import { formatRoleLabel } from "../../utils/formatters";
import {
  AdminHeaderRow,
  AdminHeaderText,
  AdminPageSubtitle,
  AdminPageTitle,
  ButtonRow,
  DangerTextButton,
  DataCell,
  DataRow,
  DataTable,
  DataTableHead,
  EmptyStateCard,
  EmptyStateText,
  EmptyStateTitle,
  FieldGroup,
  FieldInput,
  FieldLabel,
  FormActions,
  FormCard,
  FormCardTitle,
  getRoleTone,
  HeaderCell,
  HelperText,
  PrimaryActionButton,
  RolePill,
  SecondaryActionButton,
  SelectElement,
  SelectField,
  StrongText,
  TableCard,
  TableScroll,
  TextButton,
} from "../admin/Admin.styles";

const CREATABLE_ROLES = {
  admin: ["admin", "finance_head", "finance_manager", "banker", "requester"],
  finance_head: ["finance_manager", "banker", "requester"],
  finance_manager: ["banker", "requester"],
};

const SUBTITLES = {
  admin: "Create, edit, and remove every application role from one place.",
  finance_head: "Create and manage finance managers, bankers and requesters.",
  finance_manager: "Create and manage bankers and requesters for your team.",
};

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  department: "",
  role: "",
};

const UserAccessPage = () => {
  const { currentUser, token, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editingUserId, setEditingUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const roleTone = getRoleTone();

  const allowedRoles = useMemo(
    () => CREATABLE_ROLES[currentUser?.role] || [],
    [currentUser?.role]
  );

  const resetForm = () => {
    setEditingUserId("");
    setFormData({
      ...INITIAL_FORM,
      role: allowedRoles[0] || "",
    });
  };

  useEffect(() => {
    if (!allowedRoles.length || !token) {
      setLoading(false);
      return undefined;
    }

    let mounted = true;

    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/users?active=true", { token });

        if (mounted) {
          setUsers(response.data);
          setFormData((current) => ({
            ...current,
            role: current.role || allowedRoles[0] || "",
          }));
        }
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

    loadUsers();

    return () => {
      mounted = false;
    };
  }, [allowedRoles, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const startEdit = (user) => {
    setEditingUserId(user._id);
    setError("");
    setSuccessMessage("");
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      department: user.department || "",
      role: user.role || allowedRoles[0] || "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      if (editingUserId) {
        const payload = {
          name: formData.name,
          email: formData.email,
          department: formData.department,
          role: formData.role,
        };

        if (formData.password.trim()) {
          payload.password = formData.password;
        }

        const response = await apiRequest(`/users/${editingUserId}`, {
          method: "PUT",
          token,
          body: payload,
        });

        setUsers((current) =>
          current.map((user) => (user._id === editingUserId ? response.data : user))
        );
        setSuccessMessage(`${response.data.name} updated successfully.`);
      } else {
        const response = await apiRequest("/users", {
          method: "POST",
          token,
          body: formData,
        });

        setUsers((current) => [response.data, ...current]);
        setSuccessMessage(`${formatRoleLabel(response.data.role)} account created.`);
      }

      resetForm();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Delete ${user.name}?`);

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      await apiRequest(`/users/${user._id}`, {
        method: "DELETE",
        token,
      });

      const deletedCurrentUser = editingUserId === user._id || currentUser?._id === user._id;

      setUsers((current) => current.filter((item) => item._id !== user._id));
      if (editingUserId === user._id) {
        resetForm();
      }
      setSuccessMessage(`${user.name} removed successfully.`);

      if (deletedCurrentUser) {
        logout();
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (!allowedRoles.length) {
    return null;
  }

  return (
    <>
      <AdminHeaderRow>
        <AdminHeaderText>
          <AdminPageTitle>User Access</AdminPageTitle>
          <AdminPageSubtitle>
            {SUBTITLES[currentUser.role]} Requesters can also create their own
            account from sign-up.
          </AdminPageSubtitle>
        </AdminHeaderText>
      </AdminHeaderRow>

      <FormCard as="form" onSubmit={handleSubmit}>
        <FormCardTitle>{editingUserId ? "Edit user" : "Create user"}</FormCardTitle>

        {error && <AdminPageSubtitle style={{ color: "#e43e35" }}>{error}</AdminPageSubtitle>}
        {successMessage && (
          <AdminPageSubtitle style={{ color: "#178b57" }}>
            {successMessage}
          </AdminPageSubtitle>
        )}

        <FieldGroup>
          <FieldLabel>Name</FieldLabel>
          <FieldInput
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />
        </FieldGroup>

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

        <FieldGroup>
          <FieldLabel>Password</FieldLabel>
          <FieldInput
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={
              editingUserId ? "Leave blank to keep the current password" : "Set a temporary password"
            }
            required={!editingUserId}
          />
          {editingUserId && (
            <HelperText>
              Leave password empty if you do not want to change it.
            </HelperText>
          )}
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Department</FieldLabel>
          <FieldInput
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Finance, Operations, Procurement..."
          />
        </FieldGroup>

        <FieldGroup as="div">
          <FieldLabel>Role</FieldLabel>
          <SelectField>
            <SelectElement name="role" value={formData.role} onChange={handleChange}>
              {allowedRoles.map((role) => (
                <option key={role} value={role}>
                  {formatRoleLabel(role)}
                </option>
              ))}
            </SelectElement>
          </SelectField>
        </FieldGroup>

        <FormActions>
          <ButtonRow>
            <PrimaryActionButton type="submit" disabled={submitting}>
              <FontAwesomeIcon icon={editingUserId ? faPencil : faPlus} />
              <span>
                {submitting
                  ? editingUserId
                    ? "Saving..."
                    : "Creating..."
                  : editingUserId
                    ? "Save Changes"
                    : "Create User"}
              </span>
            </PrimaryActionButton>
            {editingUserId && (
              <SecondaryActionButton type="button" onClick={resetForm}>
                <FontAwesomeIcon icon={faXmark} />
                <span>Cancel</span>
              </SecondaryActionButton>
            )}
          </ButtonRow>
        </FormActions>
      </FormCard>

      {loading ? (
        <EmptyStateCard>
          <EmptyStateTitle>Loading users</EmptyStateTitle>
          <EmptyStateText>The current role scope is being fetched from the API.</EmptyStateText>
        </EmptyStateCard>
      ) : users.length === 0 ? (
        <EmptyStateCard>
          <EmptyStateTitle>No users available</EmptyStateTitle>
          <EmptyStateText>
            Create the first account for this workspace using the form above.
          </EmptyStateText>
        </EmptyStateCard>
      ) : (
        <TableCard>
          <TableScroll>
            <DataTable>
              <DataTableHead>
                <tr>
                  <HeaderCell>Name</HeaderCell>
                  <HeaderCell>Email</HeaderCell>
                  <HeaderCell>Role</HeaderCell>
                  <HeaderCell>Department</HeaderCell>
                  <HeaderCell>Status</HeaderCell>
                  <HeaderCell>Actions</HeaderCell>
                </tr>
              </DataTableHead>
              <tbody>
                {users.map((user) => (
                  <DataRow key={user._id}>
                    <DataCell data-label="Name">
                      <StrongText>{user.name}</StrongText>
                    </DataCell>
                    <DataCell data-label="Email">{user.email}</DataCell>
                    <DataCell data-label="Role">
                      <RolePill $tone={roleTone}>{formatRoleLabel(user.role)}</RolePill>
                    </DataCell>
                    <DataCell data-label="Department">{user.department || "-"}</DataCell>
                    <DataCell data-label="Status">
                      <StrongText>{user.isActive ? "Active" : "Inactive"}</StrongText>
                    </DataCell>
                    <DataCell data-label="Actions">
                      <ButtonRow>
                        <TextButton type="button" onClick={() => startEdit(user)}>
                          Edit
                        </TextButton>
                        <DangerTextButton type="button" onClick={() => handleDelete(user)}>
                          Delete
                        </DangerTextButton>
                      </ButtonRow>
                    </DataCell>
                  </DataRow>
                ))}
              </tbody>
            </DataTable>
          </TableScroll>
        </TableCard>
      )}
    </>
  );
};

export default UserAccessPage;
