import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../utils/api";
import {
  AdminHeaderRow,
  AdminHeaderText,
  AdminPageSubtitle,
  AdminPageTitle,
  EmptyStateCard,
  EmptyStateText,
  EmptyStateTitle,
  SearchField,
  SearchIconBox,
  SearchInput,
  SelectElement,
  SelectField,
  SelectIconBox,
  ToolbarRow,
} from "../admin/Admin.styles";
import PaymentsTable from "./PaymentsTable";
import { filterPaymentsByQueryAndStatus } from "./paymentSelectors";

const RoleHistoryPage = ({
  title,
  subtitle,
  detailBasePath,
  paymentFilter,
  emptyTitle,
  emptyText,
}) => {
  const navigate = useNavigate();
  const { currentUser, token } = useAuth();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadPayments = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/payment-requests", { token });

        if (mounted) {
          setPayments(paymentFilter(response.data, currentUser?._id));
          setError("");
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

    if (currentUser?._id) {
      loadPayments();
    }

    return () => {
      mounted = false;
    };
  }, [currentUser?._id, paymentFilter, token]);

  const filteredPayments = useMemo(
    () => filterPaymentsByQueryAndStatus(payments, query, statusFilter),
    [payments, query, statusFilter]
  );

  return (
    <>
      <AdminHeaderRow>
        <AdminHeaderText>
          <AdminPageTitle>{title}</AdminPageTitle>
          <AdminPageSubtitle>{subtitle}</AdminPageSubtitle>
        </AdminHeaderText>
      </AdminHeaderRow>

      <ToolbarRow>
        <SearchField>
          <SearchIconBox>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </SearchIconBox>
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search requests..."
          />
        </SearchField>

        <SelectField>
          <SelectElement
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="manager_approved">Manager Approved</option>
            <option value="head_approved">Head Approved</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
            <option value="on_hold">On Hold</option>
          </SelectElement>
          <SelectIconBox>
            <FontAwesomeIcon icon={faChevronDown} />
          </SelectIconBox>
        </SelectField>
      </ToolbarRow>

      {loading ? (
        <EmptyStateCard>
          <EmptyStateTitle>Loading history</EmptyStateTitle>
          <EmptyStateText>The latest payment request history is being fetched.</EmptyStateText>
        </EmptyStateCard>
      ) : error ? (
        <EmptyStateCard>
          <EmptyStateTitle>Unable to load history</EmptyStateTitle>
          <EmptyStateText>{error}</EmptyStateText>
        </EmptyStateCard>
      ) : filteredPayments.length === 0 ? (
        <EmptyStateCard>
          <EmptyStateTitle>{emptyTitle}</EmptyStateTitle>
          <EmptyStateText>{emptyText}</EmptyStateText>
        </EmptyStateCard>
      ) : (
        <PaymentsTable
          payments={filteredPayments}
          dateLabel="Date"
          dateKey="createdAt"
          onSelect={(payment) => navigate(`${detailBasePath}/${payment._id}`)}
        />
      )}
    </>
  );
};

export default RoleHistoryPage;
