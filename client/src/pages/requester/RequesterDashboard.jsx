import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faClock,
  faFileInvoiceDollar,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../utils/api";
import { formatCurrency, formatDate, formatStatusLabel } from "../../utils/formatters";
import {
  EmptyCard,
  RequestCell,
  RequesterHeader,
  RequesterPage,
  RequesterSubtitle,
  RequesterTitle,
  RequestRow,
  RequestStrong,
  RequestTable,
  RequestTableCard,
  RequestTableHead,
  RequestTableHeader,
  StatusPill,
  SummaryCard,
  SummaryGrid,
  SummaryIcon,
  SummaryLabel,
  SummaryMeta,
  SummaryValue,
} from "./Requester.styles";

const RequesterDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadRequests = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(
          `/payment-requests?requester=${currentUser?._id || ""}`,
          { token }
        );

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

    if (currentUser?._id) {
      loadRequests();
    }

    return () => {
      mounted = false;
    };
  }, [currentUser?._id, token]);

  const metrics = useMemo(() => {
    const approvedStatuses = ["manager_approved", "head_approved", "paid"];

    return [
      {
        label: "Total Requests",
        value: requests.length,
        icon: faFileInvoiceDollar,
      },
      {
        label: "Pending",
        value: requests.filter((request) => request.status === "pending").length,
        icon: faClock,
        tone: "warning",
      },
      {
        label: "Approved",
        value: requests.filter((request) => approvedStatuses.includes(request.status)).length,
        icon: faCircleCheck,
        tone: "success",
      },
      {
        label: "Rejected",
        value: requests.filter((request) => request.status === "rejected").length,
        icon: faXmarkCircle,
        tone: "danger",
      },
    ];
  }, [requests]);

  return (
    <RequesterPage>
      <RequesterHeader>
        <RequesterTitle>My Payment Requests</RequesterTitle>
        <RequesterSubtitle>Track your submitted payment requests</RequesterSubtitle>
      </RequesterHeader>

      <SummaryGrid>
        {metrics.map((metric) => (
          <SummaryCard key={metric.label}>
            <SummaryIcon $tone={metric.tone}>
              <FontAwesomeIcon icon={metric.icon} />
            </SummaryIcon>
            <SummaryMeta>
              <SummaryLabel>{metric.label}</SummaryLabel>
              <SummaryValue>{metric.value}</SummaryValue>
            </SummaryMeta>
          </SummaryCard>
        ))}
      </SummaryGrid>

      {loading ? (
        <EmptyCard>Loading your requests...</EmptyCard>
      ) : error ? (
        <EmptyCard>{error}</EmptyCard>
      ) : requests.length === 0 ? (
        <EmptyCard>No payment requests yet. Use New Request to create the first one.</EmptyCard>
      ) : (
        <RequestTableCard>
          <RequestTable>
            <RequestTableHead>
              <tr>
                <RequestTableHeader>Request #</RequestTableHeader>
                <RequestTableHeader>Project</RequestTableHeader>
                <RequestTableHeader>Description</RequestTableHeader>
                <RequestTableHeader>Amount</RequestTableHeader>
                <RequestTableHeader>Status</RequestTableHeader>
                <RequestTableHeader>Date</RequestTableHeader>
              </tr>
            </RequestTableHead>
            <tbody>
              {requests.map((request) => (
                <RequestRow
                  key={request._id}
                  onClick={() => navigate(`/requester/request/${request._id}`)}
                >
                  <RequestCell data-label="Request #">
                    <RequestStrong>{request.requestNo}</RequestStrong>
                  </RequestCell>
                  <RequestCell data-label="Project">{request.project?.name || "-"}</RequestCell>
                  <RequestCell data-label="Description">{request.description}</RequestCell>
                  <RequestCell data-label="Amount">
                    <RequestStrong>{formatCurrency(request.amount)}</RequestStrong>
                  </RequestCell>
                  <RequestCell data-label="Status">
                    <StatusPill $status={request.status}>
                      {formatStatusLabel(request.status)}
                    </StatusPill>
                  </RequestCell>
                  <RequestCell data-label="Date">{formatDate(request.createdAt)}</RequestCell>
                </RequestRow>
              ))}
            </tbody>
          </RequestTable>
        </RequestTableCard>
      )}
    </RequesterPage>
  );
};

export default RequesterDashboard;
