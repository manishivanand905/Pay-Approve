import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faDiagramProject,
  faFileInvoiceDollar,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../utils/api";
import { formatCurrency, formatDate, formatStatusLabel } from "../../utils/formatters";
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
  MetricCard,
  MetricIcon,
  MetricInfo,
  MetricLabel,
  MetricsGrid,
  MetricValue,
  SectionTitle,
  StatusPill,
  StrongText,
  TableCard,
  TableScroll,
} from "./Admin.styles";

const METRIC_ICONS = {
  requests: faFileInvoiceDollar,
  users: faUsers,
  projects: faDiagramProject,
  value: faArrowTrendUp,
};

const INITIAL_METRICS = [
  { key: "requests", label: "Total Requests", value: "0" },
  { key: "users", label: "Users", value: "0" },
  { key: "projects", label: "Projects", value: "0" },
  { key: "value", label: "Total Value", value: formatCurrency(0) },
];

const AdminOverview = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadOverview = async () => {
      try {
        setLoading(true);
        const [metricResponse, usersResponse, projectsResponse, paymentsResponse] =
          await Promise.all([
            apiRequest("/payment-requests/summary/metrics", { token }),
            apiRequest("/users", { token }),
            apiRequest("/projects", { token }),
            apiRequest("/payment-requests", { token }),
          ]);

        if (!mounted) {
          return;
        }

        setMetrics([
          {
            key: "requests",
            label: "Total Requests",
            value: String(metricResponse.data.totalRequests || 0),
          },
          {
            key: "users",
            label: "Users",
            value: String(usersResponse.count || usersResponse.data.length || 0),
          },
          {
            key: "projects",
            label: "Projects",
            value: String(projectsResponse.count || projectsResponse.data.length || 0),
          },
          {
            key: "value",
            label: "Total Value",
            value: formatCurrency(metricResponse.data.totalAmount || 0),
          },
        ]);
        setRequests(paymentsResponse.data);
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

    loadOverview();

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <>
      <AdminHeaderRow>
        <AdminHeaderText>
          <AdminPageTitle>Admin Overview</AdminPageTitle>
          <AdminPageSubtitle>System-wide payment management</AdminPageSubtitle>
        </AdminHeaderText>
      </AdminHeaderRow>

      <MetricsGrid>
        {metrics.map((metric) => (
          <MetricCard key={metric.key}>
            <MetricIcon>
              <FontAwesomeIcon icon={METRIC_ICONS[metric.key]} />
            </MetricIcon>
            <MetricInfo>
              <MetricLabel>{metric.label}</MetricLabel>
              <MetricValue>{metric.value}</MetricValue>
            </MetricInfo>
          </MetricCard>
        ))}
      </MetricsGrid>

      <SectionTitle>All Payment Requests</SectionTitle>

      {loading ? (
        <EmptyStateCard>
          <EmptyStateTitle>Loading overview</EmptyStateTitle>
          <EmptyStateText>The dashboard is fetching real payment and configuration data.</EmptyStateText>
        </EmptyStateCard>
      ) : error ? (
        <EmptyStateCard>
          <EmptyStateTitle>Unable to load overview</EmptyStateTitle>
          <EmptyStateText>{error}</EmptyStateText>
        </EmptyStateCard>
      ) : requests.length === 0 ? (
        <EmptyStateCard>
          <EmptyStateTitle>No payment requests yet</EmptyStateTitle>
          <EmptyStateText>
            This screen now uses the database. Create or submit requests to see them here.
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
                {requests.map((request) => (
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
                    <DataCell data-label="Requester">
                      {request.requester?.name || "-"}
                    </DataCell>
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

export default AdminOverview;
