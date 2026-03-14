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
  formatDateTime,
  formatRoleLabel,
  formatStatusLabel,
} from "../../utils/formatters";
import {
  ActionRow,
  Avatar,
  BackButton,
  CommentAuthor,
  CommentBlock,
  CommentBody,
  CommentHeader,
  CommentItem,
  CommentMeta,
  DetailCard,
  DetailDescription,
  DetailGrid,
  DetailHeader,
  DetailMetaGrid,
  DetailMetaItem,
  DetailMetaLabel,
  DetailMetaValue,
  DetailTitle,
  Divider,
  EmptyCard,
  FieldTextArea,
  InlineMessage,
  PrimaryButton,
  RequesterHeader,
  RequesterPage,
  RequesterSubtitle,
  RequesterTitle,
  SecondaryButton,
  StatusPill,
  TimelineDot,
  TimelineItem,
  TimelineList,
  TimelineMeta,
  TimelineText,
  TimelineTitle,
} from "./Requester.styles";

const RequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, token } = useAuth();
  const [request, setRequest] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadRequest = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(`/payment-requests/${id}`, { token });

        if (mounted) {
          setRequest(response.data);
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

    loadRequest();

    return () => {
      mounted = false;
    };
  }, [id, token]);

  const timelineItems = useMemo(() => {
    if (!request?.history) {
      return [];
    }

    return [...request.history].reverse();
  }, [request?.history]);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await apiRequest(`/payment-requests/${id}/comments`, {
        method: "POST",
        token,
        body: {
          actorId: currentUser._id,
          message: comment,
        },
      });

      setRequest(response.data);
      setComment("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <EmptyCard>Loading request details...</EmptyCard>;
  }

  if (error || !request) {
    return <EmptyCard>{error || "Request not found"}</EmptyCard>;
  }

  return (
    <RequesterPage>
      <RequesterHeader>
        <BackButton type="button" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </BackButton>
        <RequesterTitle>Payment Request Detail</RequesterTitle>
        <RequesterSubtitle>View attachments, comments, and activity</RequesterSubtitle>
      </RequesterHeader>

      <DetailGrid>
        <DetailCard>
          <DetailHeader>
            <div>
              <DetailTitle>{request.requestNo}</DetailTitle>
              <DetailDescription>{request.description}</DetailDescription>
            </div>
            <StatusPill $status={request.status}>{formatStatusLabel(request.status)}</StatusPill>
          </DetailHeader>

          <DetailMetaGrid>
            <DetailMetaItem>
              <DetailMetaLabel>Amount</DetailMetaLabel>
              <DetailMetaValue>{formatCurrency(request.amount)}</DetailMetaValue>
            </DetailMetaItem>
            <DetailMetaItem>
              <DetailMetaLabel>Project</DetailMetaLabel>
              <DetailMetaValue>{request.project?.name || "-"}</DetailMetaValue>
            </DetailMetaItem>
            <DetailMetaItem>
              <DetailMetaLabel>Vendor</DetailMetaLabel>
              <DetailMetaValue>{request.vendorName || request.payeeName || "-"}</DetailMetaValue>
            </DetailMetaItem>
            <DetailMetaItem>
              <DetailMetaLabel>Material</DetailMetaLabel>
              <DetailMetaValue>{request.materialItem || "-"}</DetailMetaValue>
            </DetailMetaItem>
            <DetailMetaItem>
              <DetailMetaLabel>Payment Mode</DetailMetaLabel>
              <DetailMetaValue>{request.requestedPaymentMode || "-"}</DetailMetaValue>
            </DetailMetaItem>
            <DetailMetaItem>
              <DetailMetaLabel>Channel</DetailMetaLabel>
              <DetailMetaValue>{request.requestChannel || "Manual"}</DetailMetaValue>
            </DetailMetaItem>
            <DetailMetaItem>
              <DetailMetaLabel>Requester</DetailMetaLabel>
              <DetailMetaValue>{request.requester?.name || "-"}</DetailMetaValue>
            </DetailMetaItem>
            <DetailMetaItem>
              <DetailMetaLabel>Created</DetailMetaLabel>
              <DetailMetaValue>{formatDateTime(request.createdAt)}</DetailMetaValue>
            </DetailMetaItem>
          </DetailMetaGrid>

          <Divider />

          <DetailMetaItem>
            <DetailMetaLabel>Account Details</DetailMetaLabel>
            <DetailMetaValue>{request.accountDetails || "-"}</DetailMetaValue>
          </DetailMetaItem>
        </DetailCard>

        <DetailCard>
          <DetailTitle as="h3">Timeline</DetailTitle>
          <TimelineList>
            {timelineItems.map((item, index) => (
              <TimelineItem key={`${item.action}-${index}`}>
                <TimelineDot
                  $tone={
                    item.action === "rejected"
                      ? "danger"
                      : item.action === "on_hold"
                        ? "warning"
                        : "success"
                  }
                />
                <TimelineMeta>
                  <TimelineTitle>{item.action}</TimelineTitle>
                  <TimelineText>{formatDateTime(item.actedAt)}</TimelineText>
                  <TimelineText>{item.comment || formatRoleLabel(item.role)}</TimelineText>
                </TimelineMeta>
              </TimelineItem>
            ))}
          </TimelineList>
        </DetailCard>
      </DetailGrid>

      <DetailCard>
        <DetailTitle as="h3">Attachments</DetailTitle>
        {request.attachments?.length ? (
          <AttachmentGrid>
            {request.attachments.map((attachment, index) => (
              <AttachmentCard
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
                  <span>{attachment.name}</span>
                  <span>
                    {canOpenAttachment(attachment) ? "Click to open" : "Preview unavailable"}
                  </span>
                </AttachmentMeta>
              </AttachmentCard>
            ))}
          </AttachmentGrid>
        ) : (
          <RequesterSubtitle>No attachments uploaded for this request.</RequesterSubtitle>
        )}
      </DetailCard>

      <DetailCard>
        <DetailTitle as="h3">Comments & Activity</DetailTitle>
        {request.comments?.length ? (
          <CommentBlock>
            {request.comments.map((item, index) => (
              <CommentItem key={`${item.author?._id || "author"}-${index}`}>
                <Avatar>{item.author?.name?.slice(0, 2).toUpperCase() || "NA"}</Avatar>
                <CommentMeta>
                  <CommentHeader>
                    <CommentAuthor>{item.author?.name || "Unknown"}</CommentAuthor>
                    <span>{formatRoleLabel(item.role)}</span>
                    <span>{formatDateTime(item.createdAt)}</span>
                  </CommentHeader>
                  <CommentBody>{item.message}</CommentBody>
                </CommentMeta>
              </CommentItem>
            ))}
          </CommentBlock>
        ) : (
          <RequesterSubtitle>No comments yet.</RequesterSubtitle>
        )}

        {error && <InlineMessage $tone="error">{error}</InlineMessage>}

        <FieldTextArea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Add a comment..."
        />
        <ActionRow>
          <PrimaryButton type="button" onClick={handleCommentSubmit} disabled={submitting}>
            {submitting ? "Sending..." : "Send"}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={() => setComment("")}>
            Clear
          </SecondaryButton>
        </ActionRow>
      </DetailCard>
    </RequesterPage>
  );
};

const AttachmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
`;

const AttachmentCard = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background: rgba(28, 35, 51, 0.94);
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
  text-align: left;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: ${({ $interactive }) => ($interactive ? "pointer" : "default")};
  opacity: ${({ disabled }) => (disabled ? 0.72 : 1)};

  &:hover {
    transform: ${({ $interactive }) => ($interactive ? "translateY(-2px)" : "none")};
  }
`;

const AttachmentPreview = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
  background: rgba(15, 17, 23, 0.42);
`;

const AttachmentPdfPreview = styled.object`
  width: 100%;
  height: 180px;
  display: block;
  background: rgba(15, 17, 23, 0.42);
`;

const AttachmentFallback = styled.div`
  min-height: 180px;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  background: rgba(15, 17, 23, 0.42);
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const AttachmentMeta = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[4]};

  span:first-child {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    word-break: break-word;
  }

  span:last-child {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

export default RequestDetail;
