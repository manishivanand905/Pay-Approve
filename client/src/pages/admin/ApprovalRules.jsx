import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { apiRequest } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/formatters";
import {
  AdminHeaderRow,
  AdminHeaderText,
  AdminPageSubtitle,
  AdminPageTitle,
  ButtonRow,
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
  HeaderCell,
  HelperText,
  InlineMessage,
  PrimaryActionButton,
  SecondaryActionButton,
  StrongText,
  TableCard,
  TableScroll,
  TextButton,
} from "./Admin.styles";

const ApprovalRules = () => {
  const { token } = useAuth();
  const [rules, setRules] = useState([]);
  const [editingRuleId, setEditingRuleId] = useState("");
  const [threshold, setThreshold] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadRules = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/approval-rules?active=true", { token });

        if (mounted) {
          setRules(response.data);
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

    loadRules();

    return () => {
      mounted = false;
    };
  }, [token]);

  const editingRule = useMemo(
    () => rules.find((rule) => rule._id === editingRuleId) || null,
    [editingRuleId, rules]
  );

  const resetEditor = () => {
    setEditingRuleId("");
    setThreshold("");
  };

  const startEdit = (rule) => {
    setEditingRuleId(rule._id);
    setThreshold(String(rule.threshold ?? ""));
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editingRule) {
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await apiRequest(`/approval-rules/${editingRule._id}`, {
        method: "PUT",
        token,
        body: {
          threshold: Number(threshold),
        },
      });

      setRules((current) =>
        current.map((rule) => (rule._id === response.data._id ? response.data : rule))
      );
      setSuccessMessage(`Threshold updated for ${response.data.project?.name || "project"}.`);
      resetEditor();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AdminHeaderRow>
        <AdminHeaderText>
          <AdminPageTitle>Approval Rules</AdminPageTitle>
          <AdminPageSubtitle>
            Rules are created automatically when you add a project. Edit only the
            threshold here.
          </AdminPageSubtitle>
        </AdminHeaderText>
      </AdminHeaderRow>

      {error && !editingRule && <InlineMessage $tone="error">{error}</InlineMessage>}
      {successMessage && <InlineMessage $tone="success">{successMessage}</InlineMessage>}

      {editingRule ? (
        <FormCard as="form" onSubmit={handleSubmit}>
          <FormCardTitle>Edit Rule</FormCardTitle>

          {error && <InlineMessage $tone="error">{error}</InlineMessage>}

          <FieldGroup>
            <FieldLabel>Project</FieldLabel>
            <FieldInput value={editingRule.project?.name || ""} disabled />
            <HelperText>{editingRule.project?.code || "-"}</HelperText>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Threshold</FieldLabel>
            <FieldInput
              type="number"
              min="0"
              value={threshold}
              onChange={(event) => setThreshold(event.target.value)}
              placeholder="50000"
              required
            />
            <HelperText>Only save to apply the new threshold.</HelperText>
          </FieldGroup>

          <FormActions>
            <ButtonRow>
              <PrimaryActionButton type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Rule"}
              </PrimaryActionButton>
              <SecondaryActionButton type="button" onClick={resetEditor}>
                Cancel
              </SecondaryActionButton>
            </ButtonRow>
          </FormActions>
        </FormCard>
      ) : (
        <EmptyStateCard>
          <EmptyStateTitle>Edit existing project rules</EmptyStateTitle>
          <EmptyStateText>
            Select <strong>Edit</strong> on any project rule below. This screen no
            longer creates new rules manually.
          </EmptyStateText>
        </EmptyStateCard>
      )}

      {loading ? (
        <EmptyStateCard>
          <EmptyStateTitle>Loading rules</EmptyStateTitle>
          <EmptyStateText>
            The system is reading approval rules from the backend.
          </EmptyStateText>
        </EmptyStateCard>
      ) : rules.length === 0 ? (
        <EmptyStateCard>
          <EmptyStateTitle>No approval rules available</EmptyStateTitle>
          <EmptyStateText>
            Add a project first. Its approval rule will be created automatically.
          </EmptyStateText>
        </EmptyStateCard>
      ) : (
        <TableCard>
          <TableScroll>
            <DataTable>
              <DataTableHead>
                <tr>
                  <HeaderCell>Project</HeaderCell>
                  <HeaderCell>Threshold</HeaderCell>
                  <HeaderCell>Finance Head Required</HeaderCell>
                  <HeaderCell>Actions</HeaderCell>
                </tr>
              </DataTableHead>
              <tbody>
                {rules.map((rule) => (
                  <DataRow key={rule._id}>
                    <DataCell data-label="Project">
                      <StrongText>{rule.project?.name || "-"}</StrongText>
                    </DataCell>
                    <DataCell data-label="Threshold">
                      {formatCurrency(rule.threshold || 0)}
                    </DataCell>
                    <DataCell data-label="Finance Head Required">
                      {rule.financeHeadRequired ? (
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          style={{ color: "#178b57", fontSize: "20px" }}
                        />
                      ) : (
                        "-"
                      )}
                    </DataCell>
                    <DataCell data-label="Actions">
                      <TextButton type="button" onClick={() => startEdit(rule)}>
                        Edit
                      </TextButton>
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

export default ApprovalRules;
