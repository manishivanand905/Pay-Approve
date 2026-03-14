import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../utils/api";
import {
  canOpenAttachment,
  isImageAttachment,
  isPdfAttachment,
  openAttachment,
} from "../../utils/attachments";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatRoleLabel,
  formatStatusLabel,
} from "../../utils/formatters";
import {
  AdminHeaderRow,
  AdminHeaderText,
  AdminPageSubtitle,
  AdminPageTitle,
  EmptyStateCard,
  EmptyStateText,
  EmptyStateTitle,
  SectionTitle,
  StatusPill,
  StrongText,
  getStatusTone,
} from "./Admin.styles";

const getDisplayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
};

const HISTORY_ACTION_LABELS = {
  created: "Created",
  approved: "Approved",
  rejected: "Rejected",
  on_hold: "Put On Hold",
  paid: "Marked Paid",
  updated: "Updated",
  commented: "Commented",
};

const formatHistoryAction = (action) => HISTORY_ACTION_LABELS[action] || action;

const formatFileSize = (size) => {
  if (!size) {
    return "-";
  }

  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (size >= 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${size} B`;
};

const AdminPaymentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadPayment = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(`/payment-requests/${id}`, { token });

        if (mounted) {
          setPayment(response.data);
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

    if (id) {
      loadPayment();
    }

    return () => {
      mounted = false;
    };
  }, [id, token]);

  const historyItems = useMemo(() => {
    if (!payment?.history) {
      return [];
    }

    return [...payment.history].reverse();
  }, [payment?.history]);

  if (loading) {
    return (
      <EmptyStateCard>
        <EmptyStateTitle>Loading payment request</EmptyStateTitle>
        <EmptyStateText>The full request record is being fetched from the database.</EmptyStateText>
      </EmptyStateCard>
    );
  }

  if (error || !payment) {
    return (
      <EmptyStateCard>
        <EmptyStateTitle>Unable to open payment request</EmptyStateTitle>
        <EmptyStateText>{error || "Payment request not found."}</EmptyStateText>
      </EmptyStateCard>
    );
  }

  const requestDetails = [
    { label: "Request #", value: payment.requestNo },
    { label: "Status", value: formatStatusLabel(payment.status), tone: getStatusTone(payment.status) },
    { label: "Requester", value: payment.requester?.name || "-" },
    { label: "Requester Email", value: payment.requester?.email || "-" },
    { label: "Project", value: payment.project?.name || "-" },
    { label: "Project Code", value: payment.project?.code || "-" },
    { label: "Amount", value: formatCurrency(payment.amount) },
    { label: "Currency", value: payment.currency || "INR" },
    { label: "Payee", value: payment.payeeName || "-" },
    { label: "Vendor", value: payment.vendorName || "-" },
    { label: "Invoice Number", value: payment.invoiceNumber || "-" },
    { label: "Material Item", value: payment.materialItem || "-" },
    { label: "Requested Payment Mode", value: payment.requestedPaymentMode || "-" },
    { label: "Request Channel", value: payment.requestChannel || "-" },
    { label: "Due Date", value: payment.dueDate ? formatDate(payment.dueDate) : "-" },
    { label: "Created", value: formatDateTime(payment.createdAt) },
    { label: "Last Updated", value: formatDateTime(payment.updatedAt) },
  ];

  const approverDetails = [
    { label: "Manager", value: payment.project?.manager?.name || "-" },
    { label: "Manager Email", value: payment.project?.manager?.email || "-" },
    { label: "Finance Head", value: payment.project?.financeHead?.name || "-" },
    { label: "Finance Head Email", value: payment.project?.financeHead?.email || "-" },
    { label: "Banker", value: payment.project?.banker?.name || "-" },
    { label: "Banker Email", value: payment.project?.banker?.email || "-" },
    {
      label: "Escalation Threshold",
      value:
        payment.project?.escalationThreshold !== undefined
          ? formatCurrency(payment.project.escalationThreshold)
          : "-",
    },
  ];

  const paymentExecutionDetails = [
    {
      label: "Transaction Reference",
      value: payment.paymentDetails?.transactionReference || "-",
    },
    {
      label: "Processed Payment Mode",
      value: payment.paymentDetails?.paymentMode || "-",
    },
    {
      label: "Processed By",
      value: payment.paymentDetails?.processedBy?.name || "-",
    },
    {
      label: "Processed By Role",
      value: payment.paymentDetails?.processedBy?.role
        ? formatRoleLabel(payment.paymentDetails.processedBy.role)
        : "-",
    },
    {
      label: "Processed At",
      value: payment.paymentDetails?.processedAt
        ? formatDateTime(payment.paymentDetails.processedAt)
        : "-",
    },
  ];

  return (
    <PageStack>
      <AdminHeaderRow>
        <AdminHeaderText>
          <BackButton type="button" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </BackButton>
          <AdminPageTitle>Payment Request Detail</AdminPageTitle>
          <AdminPageSubtitle>Full request, audit, comments, and payment processing data.</AdminPageSubtitle>
        </AdminHeaderText>
      </AdminHeaderRow>

      <SummaryCard>
        <SummaryTopRow>
          <div>
            <SummaryEyebrow>{payment.requestNo}</SummaryEyebrow>
            <SummaryTitle>{payment.description}</SummaryTitle>
          </div>
          <StatusPill $tone={getStatusTone(payment.status)}>
            {formatStatusLabel(payment.status)}
          </StatusPill>
        </SummaryTopRow>
        <SummaryAmount>{formatCurrency(payment.amount)}</SummaryAmount>
        <SummarySubtext>
          {payment.project?.name || "No project"} - Requested by {payment.requester?.name || "-"}
        </SummarySubtext>
      </SummaryCard>

      <CardGrid>
        <DetailCard>
          <SectionTitle>Request Details</SectionTitle>
          <MetaGrid>
            {requestDetails.map((item) => (
              <MetaItem key={item.label}>
                <MetaLabel>{item.label}</MetaLabel>
                {item.tone ? (
                  <StatusPill $tone={item.tone}>{item.value}</StatusPill>
                ) : (
                  <MetaValue>{item.value}</MetaValue>
                )}
              </MetaItem>
            ))}
          </MetaGrid>
          <Divider />
          <MetaBlock>
            <MetaLabel>Description</MetaLabel>
            <LongText>{getDisplayValue(payment.description)}</LongText>
          </MetaBlock>
          <MetaBlock>
            <MetaLabel>Account Details</MetaLabel>
            <LongText>{getDisplayValue(payment.accountDetails)}</LongText>
          </MetaBlock>
        </DetailCard>

        <DetailCard>
          <SectionTitle>Approval Routing</SectionTitle>
          <MetaGrid>
            {approverDetails.map((item) => (
              <MetaItem key={item.label}>
                <MetaLabel>{item.label}</MetaLabel>
                <MetaValue>{item.value}</MetaValue>
              </MetaItem>
            ))}
          </MetaGrid>
        </DetailCard>

        <DetailCard>
          <SectionTitle>Payment Execution</SectionTitle>
          <MetaGrid>
            {paymentExecutionDetails.map((item) => (
              <MetaItem key={item.label}>
                <MetaLabel>{item.label}</MetaLabel>
                <MetaValue>{item.value}</MetaValue>
              </MetaItem>
            ))}
          </MetaGrid>
        </DetailCard>
      </CardGrid>

      <DetailCard>
        <SectionTitle>Attachments</SectionTitle>
        {payment.attachments?.length ? (
          <ListGrid>
            {payment.attachments.map((attachment, index) => (
              <ListCard
                key={`${attachment.name}-${index}`}
                type="button"
                onClick={() => canOpenAttachment(attachment) && openAttachment(attachment)}
                disabled={!canOpenAttachment(attachment)}
                $interactive={canOpenAttachment(attachment)}
              >
                {isImageAttachment(attachment) && canOpenAttachment(attachment) ? (
                  <AttachmentPreview
                    src={attachment.dataUrl}
                    alt={attachment.name || `Attachment ${index + 1}`}
                  />
                ) : isPdfAttachment(attachment) && canOpenAttachment(attachment) ? (
                  <AttachmentPdfPreview
                    data={attachment.dataUrl}
                    type="application/pdf"
                    aria-label={attachment.name || `Attachment ${index + 1}`}
                  >
                    <AttachmentFallback>PDF Preview</AttachmentFallback>
                  </AttachmentPdfPreview>
                ) : (
                  <AttachmentFallback>{attachment.type || "file"}</AttachmentFallback>
                )}
                <AttachmentMeta>
                  <StrongText>{attachment.name || `Attachment ${index + 1}`}</StrongText>
                  <ListMeta>{formatFileSize(attachment.size)}</ListMeta>
                  <ListMeta>
                    {canOpenAttachment(attachment) ? "Click to open" : "Preview unavailable"}
                  </ListMeta>
                </AttachmentMeta>
              </ListCard>
            ))}
          </ListGrid>
        ) : (
          <MutedText>No attachments were uploaded for this request.</MutedText>
        )}
      </DetailCard>

      <CardGrid>
        <DetailCard>
          <SectionTitle>Comments</SectionTitle>
          {payment.comments?.length ? (
            <TimelineList>
              {payment.comments.map((comment, index) => (
                <TimelineItem key={`${comment.author?._id || "comment"}-${index}`}>
                  <TimelineHeader>
                    <StrongText>{comment.author?.name || "Unknown user"}</StrongText>
                    <TimelineMeta>
                      {formatRoleLabel(comment.role)} - {formatDateTime(comment.createdAt)}
                    </TimelineMeta>
                  </TimelineHeader>
                  <TimelineBody>{comment.message}</TimelineBody>
                </TimelineItem>
              ))}
            </TimelineList>
          ) : (
            <MutedText>No comments recorded.</MutedText>
          )}
        </DetailCard>

        <DetailCard>
          <SectionTitle>History</SectionTitle>
          {historyItems.length ? (
            <TimelineList>
              {historyItems.map((item, index) => (
                <TimelineItem key={`${item.action}-${item.actedAt}-${index}`}>
                  <TimelineHeader>
                    <StrongText>{formatHistoryAction(item.action)}</StrongText>
                    <TimelineMeta>{formatDateTime(item.actedAt)}</TimelineMeta>
                  </TimelineHeader>
                  <TimelineMeta>
                    By {item.actionBy?.name || "Unknown user"} ({formatRoleLabel(item.role)})
                  </TimelineMeta>
                  <TimelineMeta>
                    {item.statusFrom ? formatStatusLabel(item.statusFrom) : "-"} to{" "}
                    {formatStatusLabel(item.statusTo)}
                  </TimelineMeta>
                  <TimelineBody>{getDisplayValue(item.comment)}</TimelineBody>
                </TimelineItem>
              ))}
            </TimelineList>
          ) : (
            <MutedText>No audit history recorded.</MutedText>
          )}
        </DetailCard>
      </CardGrid>
    </PageStack>
  );
};

const PageStack = styled.div`
  display: grid;
  gap: 24px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  padding: 0;
  border: none;
  background: transparent;
  color: #1a2f63;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
`;

const SummaryCard = styled.section`
  padding: 28px;
  border: 1px solid #d8e0ea;
  border-radius: 20px;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  box-shadow: 0 12px 32px rgba(8, 16, 29, 0.06);
`;

const SummaryTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

const SummaryEyebrow = styled.p`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #60789a;
`;

const SummaryTitle = styled.h2`
  margin-top: 10px;
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.2;
  color: #0b1730;
`;

const SummaryAmount = styled.p`
  margin-top: 22px;
  font-size: clamp(26px, 3vw, 40px);
  font-weight: 800;
  color: #0b1730;
`;

const SummarySubtext = styled.p`
  margin-top: 8px;
  color: #60789a;
  font-size: 15px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const DetailCard = styled.section`
  padding: 26px;
  border: 1px solid #d8e0ea;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 12px 32px rgba(8, 16, 29, 0.06);
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const MetaItem = styled.div`
  padding: 16px;
  border: 1px solid #d8e0ea;
  border-radius: 14px;
  background: #f8fafc;
`;

const MetaBlock = styled.div`
  & + & {
    margin-top: 18px;
  }
`;

const MetaLabel = styled.p`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7f90aa;
`;

const MetaValue = styled.p`
  margin-top: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #0b1730;
  line-height: 1.5;
  word-break: break-word;
`;

const LongText = styled.p`
  margin-top: 8px;
  color: #0b1730;
  font-size: 16px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
`;

const Divider = styled.hr`
  margin: 22px 0;
  border: none;
  border-top: 1px solid #d8e0ea;
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const ListCard = styled.button`
  padding: 0;
  border: 1px solid #d8e0ea;
  border-radius: 14px;
  background: #f8fafc;
  overflow: hidden;
  text-align: left;
  cursor: ${({ $interactive }) => ($interactive ? "pointer" : "default")};
  opacity: ${({ disabled }) => (disabled ? 0.72 : 1)};
`;

const AttachmentPreview = styled.img`
  width: 100%;
  height: 180px;
  display: block;
  object-fit: cover;
  background: #edf2f7;
`;

const AttachmentPdfPreview = styled.object`
  width: 100%;
  height: 180px;
  display: block;
  background: #edf2f7;
`;

const AttachmentFallback = styled.div`
  min-height: 180px;
  display: grid;
  place-items: center;
  padding: 18px;
  background: #edf2f7;
  color: #60789a;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const AttachmentMeta = styled.div`
  padding: 18px;
`;

const ListMeta = styled.p`
  margin-top: 8px;
  color: #60789a;
  font-size: 14px;
`;

const TimelineList = styled.div`
  display: grid;
  gap: 16px;
`;

const TimelineItem = styled.div`
  padding: 18px;
  border: 1px solid #d8e0ea;
  border-radius: 14px;
  background: #f8fafc;
`;

const TimelineHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const TimelineMeta = styled.p`
  margin-top: 6px;
  color: #60789a;
  font-size: 14px;
  line-height: 1.6;
`;

const TimelineBody = styled.p`
  margin-top: 10px;
  color: #0b1730;
  font-size: 15px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
`;

const MutedText = styled.p`
  color: #60789a;
  font-size: 16px;
  line-height: 1.7;
`;

export default AdminPaymentDetail;
