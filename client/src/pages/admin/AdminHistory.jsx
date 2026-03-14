import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../utils/api";
import {
  formatCurrency,
  formatDate,
  formatStatusLabel,
} from "../../utils/formatters";
import {
  AdminHeaderRow,
  AdminHeaderText,
  AdminPageSubtitle,
  AdminPageTitle,
  DataCell,
  DataRow,
  DataTable,
  DataTableHead,
  EllipsisText,
  EmptyStateCard,
  EmptyStateText,
  EmptyStateTitle,
  getStatusTone,
  HeaderCell,
  SearchField,
  SearchIconBox,
  SearchInput,
  SelectElement,
  SelectField,
  SelectIconBox,
  StatusPill,
  StrongText,
  TableCard,
  TableScroll,
  ToolbarRow,
} from "./Admin.styles";

const AdminHistory = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { token } = useAuth();

  useEffect(() => {
    let mounted = true;

    const loadRequests = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/payment-requests", { token });

        if (mounted) {
          setRequests(response.data);
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

    loadRequests();

    return () => {
      mounted = false;
    };
  }, [token]);

  const filteredRequests = useMemo(
    () =>
      requests.filter((request) => {
        const haystack = [
          request.requestNo,
          request.requester?.name,
          request.project?.name,
          request.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesQuery = haystack.includes(query.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || request.status === statusFilter;

        return matchesQuery && matchesStatus;
      }),
    [query, requests, statusFilter]
  );

  return (
    <>
      <AdminHeaderRow>
        <AdminHeaderText>
          <AdminPageTitle>History &amp; Audit Trail</AdminPageTitle>
          <AdminPageSubtitle>Complete log of real payment requests</AdminPageSubtitle>
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
          <EmptyStateText>The audit trail is being fetched from the database.</EmptyStateText>
        </EmptyStateCard>
      ) : error ? (
        <EmptyStateCard>
          <EmptyStateTitle>Unable to load history</EmptyStateTitle>
          <EmptyStateText>{error}</EmptyStateText>
        </EmptyStateCard>
      ) : filteredRequests.length === 0 ? (
        <EmptyStateCard>
          <EmptyStateTitle>No matching requests</EmptyStateTitle>
          <EmptyStateText>
            There is no dummy history anymore. Adjust the filter or create requests to see results here.
          </EmptyStateText>
        </EmptyStateCard>
      ) : (
        <TableCard>
          <TableScroll>
            <DataTable>
              <DataTableHead>
                <tr>
                  <HeaderCell>Request #</HeaderCell>
                  <HeaderCell>Requester</HeaderCell>
                  <HeaderCell>Project</HeaderCell>
                  <HeaderCell>Description</HeaderCell>
                  <HeaderCell>Amount</HeaderCell>
                  <HeaderCell>Status</HeaderCell>
                  <HeaderCell>Date</HeaderCell>
                </tr>
              </DataTableHead>
              <tbody>
                {filteredRequests.map((request) => (
                  <DataRow
                    key={request._id}
                    $interactive
                    onClick={() => navigate(`/admin/payment/${request._id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(`/admin/payment/${request._id}`);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <DataCell data-label="Request #">
                      <StrongText>{request.requestNo}</StrongText>
                    </DataCell>
                    <DataCell data-label="Requester">{request.requester?.name || "-"}</DataCell>
                    <DataCell data-label="Project">{request.project?.name || "-"}</DataCell>
                    <DataCell data-label="Description">
                      <EllipsisText>{request.description}</EllipsisText>
                    </DataCell>
                    <DataCell data-label="Amount">
                      <StrongText>{formatCurrency(request.amount)}</StrongText>
                    </DataCell>
                    <DataCell data-label="Status">
                      <StatusPill $tone={getStatusTone(request.status)}>
                        {formatStatusLabel(request.status)}
                      </StatusPill>
                    </DataCell>
                    <DataCell data-label="Date">{formatDate(request.createdAt)}</DataCell>
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

export default AdminHistory;
