import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../utils/api";
import { formatCurrency, formatDateTime, formatStatusLabel } from "../../utils/formatters";
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
} from "../requester/Requester.styles";

const History = () => {
  const navigate = useNavigate();
  const { currentUser, token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadHistory = async () => {
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
      loadHistory();
    }

    return () => {
      mounted = false;
    };
  }, [currentUser?._id, token]);

  return (
    <RequesterPage>
      <RequesterHeader>
        <RequesterTitle>Requester History</RequesterTitle>
        <RequesterSubtitle>
          Review the full lifecycle of all your payment requests
        </RequesterSubtitle>
      </RequesterHeader>

      {loading ? (
        <EmptyCard>Loading history...</EmptyCard>
      ) : error ? (
        <EmptyCard>{error}</EmptyCard>
      ) : requests.length === 0 ? (
        <EmptyCard>No requests available in history yet.</EmptyCard>
      ) : (
        <RequestTableCard>
          <RequestTable>
            <RequestTableHead>
              <tr>
                <RequestTableHeader>Request #</RequestTableHeader>
                <RequestTableHeader>Project</RequestTableHeader>
                <RequestTableHeader>Vendor</RequestTableHeader>
                <RequestTableHeader>Amount</RequestTableHeader>
                <RequestTableHeader>Status</RequestTableHeader>
                <RequestTableHeader>Last Updated</RequestTableHeader>
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
                  <RequestCell data-label="Vendor">{request.vendorName || request.payeeName}</RequestCell>
                  <RequestCell data-label="Amount">
                    <RequestStrong>{formatCurrency(request.amount)}</RequestStrong>
                  </RequestCell>
                  <RequestCell data-label="Status">
                    <StatusPill $status={request.status}>
                      {formatStatusLabel(request.status)}
                    </StatusPill>
                  </RequestCell>
                  <RequestCell data-label="Last Updated">
                    {formatDateTime(request.updatedAt)}
                  </RequestCell>
                </RequestRow>
              ))}
            </tbody>
          </RequestTable>
        </RequestTableCard>
      )}
    </RequesterPage>
  );
};

export default History;
