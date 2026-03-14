import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faBuildingColumns,
  faClock,
  faSquareCheck,
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
  filterBankerPayments,
  getBankerQueuePayments,
  sumPaymentAmounts,
} from "../operations/paymentSelectors";

const metricIcons = {
  ready: faBuildingColumns,
  completed: faSquareCheck,
  hold: faClock,
  value: faArrowTrendUp,
};

const PaymentsQueue = () => {
  const navigate = useNavigate();
  const { currentUser, token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadQueue = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/payment-requests", { token });

        if (mounted) {
          setPayments(filterBankerPayments(response.data, currentUser?._id));
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
      loadQueue();
    }

    return () => {
      mounted = false;
    };
  }, [currentUser?._id, token]);

  const queuePayments = useMemo(() => getBankerQueuePayments(payments), [payments]);

  const metrics = useMemo(
    () => [
      {
        key: "ready",
        label: "Ready to Pay",
        value: queuePayments.filter((payment) => payment.status === "head_approved").length,
      },
      {
        key: "completed",
        label: "Completed",
        value: payments.filter((payment) => payment.status === "paid").length,
      },
      {
        key: "hold",
        label: "On Hold",
        value: queuePayments.filter((payment) => payment.status === "on_hold").length,
      },
      {
        key: "value",
        label: "Queue Value",
        value: formatCurrency(sumPaymentAmounts(queuePayments)),
      },
    ],
    [payments, queuePayments]
  );

  return (
    <>
      <AdminHeaderRow>
        <AdminHeaderText>
          <AdminPageTitle>Payments Queue</AdminPageTitle>
          <AdminPageSubtitle>Execute approved payments</AdminPageSubtitle>
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

      {loading ? (
        <EmptyStateCard>
          <EmptyStateTitle>Loading payment queue</EmptyStateTitle>
          <EmptyStateText>The latest payment-ready requests are being fetched.</EmptyStateText>
        </EmptyStateCard>
      ) : error ? (
        <EmptyStateCard>
          <EmptyStateTitle>Unable to load payment queue</EmptyStateTitle>
          <EmptyStateText>{error}</EmptyStateText>
        </EmptyStateCard>
      ) : queuePayments.length === 0 ? (
        <EmptyStateCard>
          <EmptyStateTitle>No payments in queue</EmptyStateTitle>
          <EmptyStateText>There are no assigned requests ready for payment right now.</EmptyStateText>
        </EmptyStateCard>
      ) : (
        <PaymentsTable
          payments={queuePayments}
          onSelect={(payment) => navigate(`/banker/payment/${payment._id}`)}
        />
      )}
    </>
  );
};

export default PaymentsQueue;
