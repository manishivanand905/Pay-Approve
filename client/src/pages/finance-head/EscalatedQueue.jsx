import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
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
} from "../admin/Admin.styles";
import PaymentsTable from "../operations/PaymentsTable";
import {
  filterHeadPayments,
  getHeadActionablePayments,
  sumPaymentAmounts,
} from "../operations/paymentSelectors";

const metricIcons = {
  awaiting: faTriangleExclamation,
  approved: faSquareCheck,
  value: faArrowTrendUp,
};

const EscalatedQueue = () => {
  const navigate = useNavigate();
  const { currentUser, token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadEscalations = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/payment-requests", { token });

        if (mounted) {
          setPayments(filterHeadPayments(response.data, currentUser?._id));
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
      loadEscalations();
    }

    return () => {
      mounted = false;
    };
  }, [currentUser?._id, token]);

  const actionablePayments = useMemo(() => getHeadActionablePayments(payments), [payments]);

  const metrics = useMemo(
    () => [
      {
        key: "awaiting",
        label: "Awaiting Approval",
        value: actionablePayments.length,
      },
      {
        key: "approved",
        label: "Approved",
        value: payments.filter((payment) => ["head_approved", "paid"].includes(payment.status)).length,
      },
      {
        key: "value",
        label: "Pending Value",
        value: formatCurrency(sumPaymentAmounts(actionablePayments)),
      },
    ],
    [actionablePayments, payments]
  );

  return (
    <>
      <AdminHeaderRow>
        <AdminHeaderText>
          <AdminPageTitle>Escalated Approvals</AdminPageTitle>
          <AdminPageSubtitle>High-value requests requiring your approval</AdminPageSubtitle>
        </AdminHeaderText>
      </AdminHeaderRow>

      <ThreeMetricGrid>
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
      </ThreeMetricGrid>

      {loading ? (
        <EmptyStateCard>
          <EmptyStateTitle>Loading escalated approvals</EmptyStateTitle>
          <EmptyStateText>The latest high-value requests are being fetched.</EmptyStateText>
        </EmptyStateCard>
      ) : error ? (
        <EmptyStateCard>
          <EmptyStateTitle>Unable to load escalations</EmptyStateTitle>
          <EmptyStateText>{error}</EmptyStateText>
        </EmptyStateCard>
      ) : actionablePayments.length === 0 ? (
        <EmptyStateCard>
          <EmptyStateTitle>No escalated approvals</EmptyStateTitle>
          <EmptyStateText>There are no high-value requests waiting for your decision right now.</EmptyStateText>
        </EmptyStateCard>
      ) : (
        <PaymentsTable
          payments={actionablePayments}
          onSelect={(payment) => navigate(`/head/payment/${payment._id}`)}
        />
      )}
    </>
  );
};

const ThreeMetricGrid = styled(MetricsGrid)`
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export default EscalatedQueue;
