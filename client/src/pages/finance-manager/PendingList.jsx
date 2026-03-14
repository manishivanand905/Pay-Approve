import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "../admin/Admin.styles";
import PaymentsTable from "../operations/PaymentsTable";
import {
  filterManagerPayments,
  getManagerActionablePayments,
} from "../operations/paymentSelectors";

const PendingList = () => {
  const navigate = useNavigate();
  const { currentUser, token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadPendingPayments = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/payment-requests", { token });

        if (mounted) {
          const assignedPayments = filterManagerPayments(response.data, currentUser?._id);
          setPayments(getManagerActionablePayments(assignedPayments));
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
      loadPendingPayments();
    }

    return () => {
      mounted = false;
    };
  }, [currentUser?._id, token]);

  return (
    <>
      <AdminHeaderRow>
        <AdminHeaderText>
          <AdminPageTitle>Pending Approvals</AdminPageTitle>
          <AdminPageSubtitle>Requests awaiting your review</AdminPageSubtitle>
        </AdminHeaderText>
      </AdminHeaderRow>

      {loading ? (
        <EmptyStateCard>
          <EmptyStateTitle>Loading pending approvals</EmptyStateTitle>
          <EmptyStateText>The latest pending requests are being fetched for your projects.</EmptyStateText>
        </EmptyStateCard>
      ) : error ? (
        <EmptyStateCard>
          <EmptyStateTitle>Unable to load pending approvals</EmptyStateTitle>
          <EmptyStateText>{error}</EmptyStateText>
        </EmptyStateCard>
      ) : payments.length === 0 ? (
        <EmptyStateCard>
          <EmptyStateTitle>No pending approvals</EmptyStateTitle>
          <EmptyStateText>There are no requests waiting for your review right now.</EmptyStateText>
        </EmptyStateCard>
      ) : (
        <PaymentsTable
          payments={payments}
          onSelect={(payment) => navigate(`/manager/payment/${payment._id}`)}
        />
      )}
    </>
  );
};

export default PendingList;
