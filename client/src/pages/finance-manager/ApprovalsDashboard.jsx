import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faClock,
  faSquareCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../utils/api";
import { formatCurrency } from "../../utils/formatters";
import {
  AdminHeaderRow,
  AdminHeaderText,
  AdminPageSubtitle,
  AdminPageTitle,
  EmptyStateCard,
  EmptyStateText,
  EmptyStateTitle,
  MetricCard,
  MetricIcon,
  MetricInfo,
  MetricLabel,
  MetricsGrid,
  MetricValue,
  SectionTitle,
} from "../admin/Admin.styles";
import PaymentsTable from "../operations/PaymentsTable";
import {
  filterManagerPayments,
  getManagerActionablePayments,
  sumPaymentAmounts,
} from "../operations/paymentSelectors";

const metricIcons = {
  pending: faClock,
  approved: faSquareCheck,
  value: faArrowTrendUp,
  escalated: faTriangleExclamation,
};

const ApprovalsDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, token } = useAuth();
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
          setPayments(filterManagerPayments(response.data, currentUser?._id));
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
  }, [currentUser?._id, token]);

  const actionablePayments = useMemo(
    () => getManagerActionablePayments(payments),
    [payments]
  );

  const metrics = useMemo(
    () => [
      {
        key: "pending",
        label: "Pending Approvals",
        value: actionablePayments.length,
      },
      {
        key: "approved",
        label: "Approved",
        value: payments.filter((payment) =>
          ["manager_approved", "head_approved", "paid"].includes(payment.status)
        ).length,
      },
      {
        key: "value",
        label: "Pending Value",
        value: formatCurrency(sumPaymentAmounts(actionablePayments)),
      },
      {
        key: "escalated",
        label: "Escalated",
        value: payments.filter((payment) => payment.status === "manager_approved").length,
      },
    ],
    [actionablePayments, payments]
  );

  return (
    <>
      <AdminHeaderRow>
        <AdminHeaderText>
          <AdminPageTitle>Approvals Dashboard</AdminPageTitle>
          <AdminPageSubtitle>Review and manage pending payment requests</AdminPageSubtitle>
        </AdminHeaderText>
      </AdminHeaderRow>

      <MetricsGrid>
        {metrics.map((metric) => (
          <MetricCard key={metric.key}>
            <MetricIcon>
              <FontAwesomeIcon icon={metricIcons[metric.key]} />
            </MetricIcon>
            <MetricInfo>
              <MetricLabel>{metric.label}</MetricLabel>
              <MetricValue>{metric.value}</MetricValue>
            </MetricInfo>
          </MetricCard>
        ))}
      </MetricsGrid>

      <SectionTitle>Pending Requests</SectionTitle>

      {loading ? (
        <EmptyStateCard>
          <EmptyStateTitle>Loading approvals</EmptyStateTitle>
          <EmptyStateText>The latest payment requests are being fetched for your projects.</EmptyStateText>
        </EmptyStateCard>
      ) : error ? (
        <EmptyStateCard>
          <EmptyStateTitle>Unable to load approvals</EmptyStateTitle>
          <EmptyStateText>{error}</EmptyStateText>
        </EmptyStateCard>
      ) : actionablePayments.length === 0 ? (
        <EmptyStateCard>
          <EmptyStateTitle>No pending requests</EmptyStateTitle>
          <EmptyStateText>There are no payment requests waiting for your action right now.</EmptyStateText>
        </EmptyStateCard>
      ) : (
        <PaymentsTable
          payments={actionablePayments}
          onSelect={(payment) => navigate(`/manager/payment/${payment._id}`)}
        />
      )}
    </>
  );
};

export default ApprovalsDashboard;
