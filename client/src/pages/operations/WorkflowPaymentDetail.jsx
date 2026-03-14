import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChevronDown,
  faLink,
  faMessage,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import {
  canOpenAttachment,
  isImageAttachment,
  isPdfAttachment,
  openAttachment,
} from "../../utils/attachments";
import { apiRequest } from "../../utils/api";
import {
  formatCurrency,
  formatDateTime,
  formatRoleLabel,
  formatStatusLabel,
} from "../../utils/formatters";
import {
  EmptyStateCard,
  EmptyStateText,
  EmptyStateTitle,
  StatusPill,
  StrongText,
  getStatusTone,
} from "../admin/Admin.styles";

const DETAIL_COPY = {
  finance_manager: {
    title: "Payment Detail",
    subtitle: "Review the request, capture your decision, and record activity.",
    actionTitle: "Approval Action",
    selectLabel: "Action",
    selectPlaceholder: "Select action",
    noteLabel: "Remarks",
    notePlaceholder: "Add approval notes or a rejection reason...",
    submitLabel: "Submit",
    unauthorizedMessage: "This payment request is not assigned to your projects.",
  },
  finance_head: {
    title: "Escalated Payment Detail",
    subtitle: "Review high-value approvals and record the finance-head decision.",
    actionTitle: "Approval Action",
    selectLabel: "Action",
    selectPlaceholder: "Select action",
    noteLabel: "Remarks",
    notePlaceholder: "Add approval notes or a rejection reason...",
    submitLabel: "Submit",
    unauthorizedMessage: "This escalated request is not assigned to your finance-head queue.",
  },
  banker: {
    title: "Payment Execution",
    subtitle: "Execute approved payments and record transaction details.",
    actionTitle: "Payment Execution",
    selectLabel: "Action",
    selectPlaceholder: "Select action",
    noteLabel: "Remarks",
    notePlaceholder: "Add remarks...",
    referenceLabel: "Bank Reference",
    referencePlaceholder: "Transaction reference",
    submitLabel: "Submit",
    unauthorizedMessage: "This payment request is not assigned to your payment queue.",
  },
};

const ACTION_OPTIONS = {
  finance_manager: {
    pending: [
      { value: "approve", label: "Approve" },
      { value: "reject", label: "Reject" },
      { value: "hold", label: "Put On Hold" },
    ],
    on_hold: [{ value: "reject", label: "Reject" }],
  },
  finance_head: {
    manager_approved: [
      { value: "approve", label: "Approve" },
      { value: "reject", label: "Reject" },
      { value: "hold", label: "Put On Hold" },
    ],
    on_hold: [{ value: "reject", label: "Reject" }],
  },
  banker: {
    head_approved: [
      { value: "pay", label: "Mark as Paid" },
      { value: "hold", label: "Put On Hold" },
    ],
    on_hold: [],
  },
};

const TIMELINE_TONES = {
  rejected: "danger",
  on_hold: "warning",
  paid: "success",
};

const ACTION_LABELS = {
  created: "Created",
  approved: "Approved",
  rejected: "Rejected",
  on_hold: "Put On Hold",
  paid: "Marked Paid",
  updated: "Updated",
  commented: "Commented",
};

const WorkflowPaymentDetail = ({ role, isAssigned }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, token } = useAuth();
  const copy = DETAIL_COPY[role];
  const [payment, setPayment] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [comment, setComment] = useState("");
  const [commentDraft, setCommentDraft] = useState("");
  const [transactionReference, setTransactionReference] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingAction, setSubmittingAction] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadPayment = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(`/payment-requests/${id}`, { token });

        if (!mounted) {
          return;
        }

        if (!isAssigned(response.data, currentUser?._id)) {
          setPayment(null);
          setError(copy.unauthorizedMessage);
          return;
        }

        setPayment(response.data);
        setSelectedAction("");
        setComment("");
        setTransactionReference(response.data.paymentDetails?.transactionReference || "");
        setError("");
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
      loadPayment();
    }

    return () => {
      mounted = false;
    };
  }, [copy.unauthorizedMessage, currentUser?._id, id, isAssigned, token]);

  const actionOptions = useMemo(() => {
    if (!payment) {
      return [];
    }

    return ACTION_OPTIONS[role]?.[payment.status] || [];
  }, [payment, role]);

  const timelineItems = useMemo(() => {
    if (!payment?.history) {
      return [];
    }

    return [...payment.history].reverse();
  }, [payment?.history]);

  const handleActionSubmit = async () => {
    if (!payment || !selectedAction) {
      return;
    }

    if (selectedAction === "reject" && !comment.trim()) {
      setError("A rejection reason is required.");
      return;
    }

    if (selectedAction === "pay" && !transactionReference.trim()) {
      setError("A bank reference is required before marking the request as paid.");
      return;
    }

    setSubmittingAction(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await apiRequest(`/payment-requests/${payment._id}/status`, {
        method: "PATCH",
        token,
        body: {
          action: selectedAction,
          actorId: currentUser._id,
          comment: comment.trim(),
          transactionReference: transactionReference.trim(),
          paymentMode:
            selectedAction === "pay"
              ? payment.requestedPaymentMode || payment.paymentDetails?.paymentMode || "Bank Transfer"
              : undefined,
        },
      });

      setPayment(response.data);
      setSelectedAction("");
      setComment("");
      setSuccessMessage(`Request ${formatStatusLabel(response.data.status).toLowerCase()}.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentDraft.trim() || !payment) {
      return;
    }

    setSubmittingComment(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await apiRequest(`/payment-requests/${payment._id}/comments`, {
        method: "POST",
        token,
        body: {
          actorId: currentUser._id,
          message: commentDraft.trim(),
        },
      });

      setPayment(response.data);
      setCommentDraft("");
      setSuccessMessage("Comment added.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <EmptyStateCard>
        <EmptyStateTitle>Loading request</EmptyStateTitle>
        <EmptyStateText>The payment request detail is being fetched.</EmptyStateText>
      </EmptyStateCard>
    );
  }

  if (error && !payment) {
    return (
      <EmptyStateCard>
        <EmptyStateTitle>Unable to load request</EmptyStateTitle>
        <EmptyStateText>{error}</EmptyStateText>
      </EmptyStateCard>
    );
  }

  if (!payment) {
    return (
      <EmptyStateCard>
        <EmptyStateTitle>Request not found</EmptyStateTitle>
        <EmptyStateText>The payment request could not be found.</EmptyStateText>
      </EmptyStateCard>
    );
  }

  return (
    <PageStack>
      <BackButton type="button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
        Back
      </BackButton>

      <PageHeader>
        <HeaderText>
          <PageTitle>{copy.title}</PageTitle>
          <PageSubtitle>{copy.subtitle}</PageSubtitle>
        </HeaderText>
      </PageHeader>

      <TopGrid>
        <MainCard>
          <HeroRow>
            <div>
              <RequestNumber>{payment.requestNo}</RequestNumber>
              <RequestDescription>{payment.description}</RequestDescription>
            </div>
            <StatusPill $tone={getStatusTone(payment.status)}>
              {formatStatusLabel(payment.status)}
            </StatusPill>
          </HeroRow>

          <MetaGrid>
            <MetaItem>
              <MetaLabel>Amount</MetaLabel>
              <MetaValue>{formatCurrency(payment.amount || 0)}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Project</MetaLabel>
              <MetaValue>{payment.project?.name || "-"}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Vendor</MetaLabel>
              <MetaValue>{payment.vendorName || payment.payeeName || "-"}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Material</MetaLabel>
              <MetaValue>{payment.materialItem || "-"}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Payment Mode</MetaLabel>
              <MetaValue>{payment.requestedPaymentMode || "-"}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Channel</MetaLabel>
              <MetaValue>{payment.requestChannel || "Manual"}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Requester</MetaLabel>
              <MetaValue>{payment.requester?.name || "-"}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Created</MetaLabel>
              <MetaValue>{formatDateTime(payment.createdAt)}</MetaValue>
            </MetaItem>
          </MetaGrid>

          <Divider />

          <MetaBlock>
            <MetaLabel>Account Details</MetaLabel>
            <MetaValue>{payment.accountDetails || "-"}</MetaValue>
          </MetaBlock>
        </MainCard>

        <SideCard>
          <SideTitle>{copy.actionTitle}</SideTitle>

          <FieldGroup>
            <FieldLabel>{copy.selectLabel}</FieldLabel>
            <FieldSelect
              value={selectedAction}
              onChange={(event) => setSelectedAction(event.target.value)}
              disabled={!actionOptions.length || submittingAction}
            >
              <option value="">{actionOptions.length ? copy.selectPlaceholder : "No actions available"}</option>
              {actionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FieldSelect>
            <SelectChevron>
              <FontAwesomeIcon icon={faChevronDown} />
            </SelectChevron>
          </FieldGroup>

          {role === "banker" && (
            <FieldGroup>
              <FieldLabel>{copy.referenceLabel}</FieldLabel>
              <FieldInput
                value={transactionReference}
                onChange={(event) => setTransactionReference(event.target.value)}
                placeholder={copy.referencePlaceholder}
                disabled={selectedAction !== "pay" || submittingAction}
              />
            </FieldGroup>
          )}

          <FieldGroup>
            <FieldLabel>{copy.noteLabel}</FieldLabel>
            <FieldTextArea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder={copy.notePlaceholder}
              disabled={submittingAction}
            />
          </FieldGroup>

          {error && <InlineMessage $tone="error">{error}</InlineMessage>}
          {successMessage && <InlineMessage $tone="success">{successMessage}</InlineMessage>}

          <PrimaryButton
            type="button"
            onClick={handleActionSubmit}
            disabled={!selectedAction || submittingAction}
          >
            {submittingAction ? "Saving..." : copy.submitLabel}
          </PrimaryButton>
        </SideCard>
      </TopGrid>

      <BottomGrid>
        <MainColumn>
          <SectionCard>
            <SectionHeader>
              <SectionTitle>
                <FontAwesomeIcon icon={faPaperclip} />
                Attachments
              </SectionTitle>
            </SectionHeader>
            {payment.attachments?.length ? (
              <AttachmentGrid>
                {payment.attachments.map((attachment, index) => (
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
                        <AttachmentFallback>
                          <FontAwesomeIcon icon={faLink} />
                          <span>PDF Preview</span>
                        </AttachmentFallback>
                      </AttachmentPdfPreview>
                    ) : (
                      <AttachmentFallback>
                        <FontAwesomeIcon icon={faLink} />
                        <span>{attachment.type || "file"}</span>
                      </AttachmentFallback>
                    )}
                    <AttachmentMeta>
                      <StrongText>{attachment.name || `Attachment ${index + 1}`}</StrongText>
                      <AttachmentHint>
                        {canOpenAttachment(attachment) ? "Click to open" : "Preview unavailable"}
                      </AttachmentHint>
                    </AttachmentMeta>
                  </AttachmentCard>
                ))}
              </AttachmentGrid>
            ) : (
              <EmptyCopy>No attachments were uploaded for this request.</EmptyCopy>
            )}
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitle>
                <FontAwesomeIcon icon={faMessage} />
                Comments &amp; Activity
              </SectionTitle>
            </SectionHeader>
            {payment.comments?.length ? (
              <CommentThread>
                {payment.comments.map((item, index) => (
                  <CommentItem key={`${item.author?._id || "author"}-${index}`}>
                    <CommentAvatar>{item.author?.name?.slice(0, 2).toUpperCase() || "NA"}</CommentAvatar>
                    <CommentContent>
                      <CommentMeta>
                        <StrongText>{item.author?.name || "Unknown"}</StrongText>
                        <span>{formatRoleLabel(item.role)}</span>
                        <span>{formatDateTime(item.createdAt)}</span>
                      </CommentMeta>
                      <CommentBody>{item.message}</CommentBody>
                    </CommentContent>
                  </CommentItem>
                ))}
              </CommentThread>
            ) : (
              <EmptyCopy>No comments have been added yet.</EmptyCopy>
            )}

            <CommentComposer>
              <FieldTextArea
                value={commentDraft}
                onChange={(event) => setCommentDraft(event.target.value)}
                placeholder="Add a comment..."
                disabled={submittingComment}
              />
              <CommentActions>
                <SecondaryButton
                  type="button"
                  onClick={() => setCommentDraft("")}
                  disabled={submittingComment || !commentDraft}
                >
                  Clear
                </SecondaryButton>
                <PrimaryButton
                  type="button"
                  onClick={handleCommentSubmit}
                  disabled={submittingComment || !commentDraft.trim()}
                >
                  {submittingComment ? "Sending..." : "Send"}
                </PrimaryButton>
              </CommentActions>
            </CommentComposer>
          </SectionCard>
        </MainColumn>

        <SideColumn>
          <SectionCard>
            <SectionHeader>
              <SectionTitle>Timeline</SectionTitle>
            </SectionHeader>
            {timelineItems.length ? (
              <TimelineList>
                {timelineItems.map((item, index) => (
                  <TimelineItem key={`${item.action}-${item.actedAt}-${index}`}>
                    <TimelineDot $tone={TIMELINE_TONES[item.action] || "neutral"} />
                    <TimelineMetaBlock>
                      <TimelineTitle>{ACTION_LABELS[item.action] || item.action}</TimelineTitle>
                      <TimelineText>{formatDateTime(item.actedAt)}</TimelineText>
                      <TimelineText>
                        {item.actionBy?.name || formatRoleLabel(item.role)}
                      </TimelineText>
                      <TimelineText>{item.comment || formatStatusLabel(item.statusTo)}</TimelineText>
                    </TimelineMetaBlock>
                  </TimelineItem>
                ))}
              </TimelineList>
            ) : (
              <EmptyCopy>No timeline events recorded.</EmptyCopy>
            )}
          </SectionCard>
        </SideColumn>
      </BottomGrid>
    </PageStack>
  );
};

const PageStack = styled.div`
  display: grid;
  gap: 18px;
`;

const BackButton = styled.button`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #60789a;
  font-size: 15px;
  font-weight: 600;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const HeaderText = styled.div``;

const PageTitle = styled.h1`
  font-size: clamp(34px, 3vw, 46px);
  line-height: 1.1;
  letter-spacing: -0.04em;
  color: #0b1730;
`;

const PageSubtitle = styled.p`
  margin-top: 10px;
  color: #60789a;
  font-size: 16px;
`;

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(320px, 0.9fr);
  gap: 24px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(300px, 0.9fr);
  gap: 24px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: grid;
  gap: 24px;
`;

const SideColumn = styled.div`
  display: grid;
  gap: 24px;
  align-content: start;
`;

const baseCard = `
  border: 1px solid #d8e0ea;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 12px 32px rgba(8, 16, 29, 0.06);
`;

const MainCard = styled.section`
  ${baseCard};
  padding: 28px;
`;

const SideCard = styled.section`
  ${baseCard};
  padding: 22px;
  display: grid;
  gap: 18px;
  align-content: start;
`;

const SectionCard = styled.section`
  ${baseCard};
  padding: 26px;
  display: grid;
  gap: 18px;
`;

const HeroRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const RequestNumber = styled.h2`
  font-size: clamp(28px, 3vw, 40px);
  color: #0b1730;
`;

const RequestDescription = styled.p`
  margin-top: 8px;
  color: #60789a;
  font-size: 16px;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px 32px;
  margin-top: 24px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const MetaItem = styled.div`
  display: grid;
  gap: 4px;
`;

const MetaBlock = styled.div`
  display: grid;
  gap: 4px;
`;

const MetaLabel = styled.p`
  color: #60789a;
  font-size: 15px;
`;

const MetaValue = styled.p`
  color: #0b1730;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  word-break: break-word;
`;

const Divider = styled.hr`
  margin: 22px 0;
  border: none;
  border-top: 1px solid #d8e0ea;
`;

const SideTitle = styled.h3`
  color: #0b1730;
  font-size: 18px;
`;

const FieldGroup = styled.label`
  position: relative;
  display: grid;
  gap: 10px;
`;

const FieldLabel = styled.span`
  color: #0b1730;
  font-size: 15px;
  font-weight: 700;
`;

const fieldStyles = `
  width: 100%;
  min-height: 50px;
  padding: 0 16px;
  border: 1px solid #c7d2df;
  border-radius: 12px;
  background: #f8fafc;
  color: #0b1730;
  font-size: 16px;
`;

const FieldInput = styled.input`
  ${fieldStyles};

  &::placeholder {
    color: #7f90aa;
  }
`;

const FieldSelect = styled.select`
  ${fieldStyles};
  appearance: none;
  padding-right: 42px;
`;

const FieldTextArea = styled.textarea`
  min-height: 120px;
  padding: 14px 16px;
  border: 1px solid #c7d2df;
  border-radius: 12px;
  background: #f8fafc;
  color: #0b1730;
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;

  &::placeholder {
    color: #7f90aa;
  }
`;

const SelectChevron = styled.span`
  position: absolute;
  right: 16px;
  bottom: 16px;
  color: #60789a;
  pointer-events: none;
`;

const PrimaryButton = styled.button`
  min-height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  background: #1a2f63;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  min-height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid #c7d2df;
  background: #ffffff;
  color: #0b1730;
  font-size: 15px;
  font-weight: 700;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const InlineMessage = styled.p`
  color: ${({ $tone }) => ($tone === "error" ? "#e43e35" : "#178b57")};
  font-size: 14px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #0b1730;
  font-size: 18px;
`;

const AttachmentGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const AttachmentCard = styled.button`
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  align-items: stretch;
  border: 1px solid #d8e0ea;
  border-radius: 14px;
  background: #f8fafc;
  overflow: hidden;
  text-align: left;
  cursor: ${({ $interactive }) => ($interactive ? "pointer" : "default")};
  opacity: ${({ disabled }) => (disabled ? 0.72 : 1)};

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const AttachmentPreview = styled.img`
  width: 100%;
  height: 88px;
  object-fit: cover;
  background: #edf2f7;
`;

const AttachmentPdfPreview = styled.object`
  width: 100%;
  height: 88px;
  display: block;
  background: #edf2f7;
`;

const AttachmentFallback = styled.div`
  display: grid;
  place-items: center;
  gap: 6px;
  min-height: 88px;
  background: #edf2f7;
  color: #60789a;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const AttachmentMeta = styled.div`
  display: grid;
  gap: 6px;
  padding: 16px;
  align-content: center;
`;

const AttachmentHint = styled.p`
  color: #60789a;
  font-size: 14px;
`;

const CommentThread = styled.div`
  display: grid;
  gap: 18px;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-start;
`;

const CommentAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #edf2f7;
  color: #1a2f63;
  font-size: 15px;
  font-weight: 700;
  flex-shrink: 0;
`;

const CommentContent = styled.div`
  min-width: 0;
`;

const CommentMeta = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  color: #60789a;
  font-size: 14px;
`;

const CommentBody = styled.p`
  margin-top: 6px;
  color: #0b1730;
  font-size: 15px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
`;

const CommentComposer = styled.div`
  display: grid;
  gap: 12px;
`;

const CommentActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
`;

const TimelineList = styled.div`
  display: grid;
  gap: 16px;
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const TimelineDot = styled.span`
  width: 10px;
  height: 10px;
  margin-top: 8px;
  border-radius: 50%;
  background: ${({ $tone }) => {
    switch ($tone) {
      case "danger":
        return "#e43e35";
      case "warning":
        return "#e59600";
      case "success":
        return "#178b57";
      default:
        return "#60789a";
    }
  }};
  flex-shrink: 0;
`;

const TimelineMetaBlock = styled.div`
  display: grid;
  gap: 4px;
`;

const TimelineTitle = styled.p`
  color: #0b1730;
  font-size: 15px;
  font-weight: 700;
`;

const TimelineText = styled.p`
  color: #60789a;
  font-size: 14px;
  line-height: 1.6;
`;

const EmptyCopy = styled.p`
  color: #60789a;
  font-size: 15px;
  line-height: 1.7;
`;

export default WorkflowPaymentDetail;
