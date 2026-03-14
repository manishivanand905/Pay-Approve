import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../utils/api";
import {
  ActionRow,
  AttachmentItem,
  AttachmentList,
  EmptyCard,
  FieldGroup,
  FieldInput,
  FieldLabel,
  FieldSelect,
  FieldTextArea,
  FormCard,
  FormGrid,
  HiddenInput,
  InlineMessage,
  PrimaryButton,
  RequesterHeader,
  RequesterPage,
  RequesterSubtitle,
  RequesterTitle,
  SecondaryButton,
  UploadArea,
} from "./Requester.styles";

const INITIAL_FORM = {
  project: "",
  amount: "",
  description: "",
  materialItem: "",
  vendorName: "",
  requestedPaymentMode: "",
  accountDetails: "",
  invoiceNumber: "",
  initialComment: "",
};

const PAYMENT_MODES = ["Bank Transfer", "UPI", "Cheque", "Cash", "NEFT", "RTGS"];
const MAX_ATTACHMENT_SIZE_BYTES = 2 * 1024 * 1024;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: typeof reader.result === "string" ? reader.result : "",
      });
    };

    reader.onerror = () => {
      reject(new Error(`Unable to read ${file.name}`));
    };

    reader.readAsDataURL(file);
  });

const NewRequest = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { currentUser, token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/projects?active=true", { token });

        if (mounted) {
          setProjects(response.data);
          setFormData((current) => ({
            ...current,
            project: current.project || response.data[0]?._id || "",
          }));
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

    loadProjects();

    return () => {
      mounted = false;
    };
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    const oversizedFile = selectedFiles.find((file) => file.size > MAX_ATTACHMENT_SIZE_BYTES);

    if (oversizedFile) {
      setError(`"${oversizedFile.name}" is larger than 2 MB. Please choose a smaller file.`);
      event.target.value = "";
      return;
    }

    try {
      const serializedFiles = await Promise.all(selectedFiles.map(readFileAsDataUrl));
      setAttachments(serializedFiles);
      setError("");
    } catch (fileError) {
      setError(fileError.message);
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await apiRequest("/payment-requests", {
        method: "POST",
        token,
        body: {
          requester: currentUser._id,
          project: formData.project,
          payeeName: formData.vendorName,
          vendorName: formData.vendorName,
          materialItem: formData.materialItem,
          description: formData.description,
          invoiceNumber: formData.invoiceNumber,
          amount: Number(formData.amount),
          requestedPaymentMode: formData.requestedPaymentMode,
          accountDetails: formData.accountDetails,
          attachments,
          initialComment: formData.initialComment,
        },
      });

      navigate(`/requester/request/${response.data._id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RequesterPage>
      <RequesterHeader>
        <RequesterTitle>New Payment Request</RequesterTitle>
        <RequesterSubtitle>Fill in the details for your payment request</RequesterSubtitle>
      </RequesterHeader>

      {loading ? (
        <EmptyCard>Loading active projects...</EmptyCard>
      ) : projects.length === 0 ? (
        <EmptyCard>No active projects are available. Ask the admin to create a project first.</EmptyCard>
      ) : (
        <FormCard onSubmit={handleSubmit}>
          {error && <InlineMessage $tone="error">{error}</InlineMessage>}

          <FormGrid>
            <FieldGroup>
              <FieldLabel>Project</FieldLabel>
              <FieldSelect name="project" value={formData.project} onChange={handleChange} required>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </FieldSelect>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Amount (Rs)</FieldLabel>
              <FieldInput
                type="number"
                min="0"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
              />
            </FieldGroup>
          </FormGrid>

          <FieldGroup>
            <FieldLabel>Description</FieldLabel>
            <FieldTextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What is this payment for?"
              required
            />
          </FieldGroup>

          <FormGrid>
            <FieldGroup>
              <FieldLabel>Material / Item</FieldLabel>
              <FieldInput
                name="materialItem"
                value={formData.materialItem}
                onChange={handleChange}
                placeholder="e.g. Office furniture"
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Vendor</FieldLabel>
              <FieldInput
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                placeholder="Vendor name"
                required
              />
            </FieldGroup>
          </FormGrid>

          <FormGrid>
            <FieldGroup>
              <FieldLabel>Payment Mode</FieldLabel>
              <FieldSelect
                name="requestedPaymentMode"
                value={formData.requestedPaymentMode}
                onChange={handleChange}
                required
              >
                <option value="">Select mode</option>
                {PAYMENT_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </FieldSelect>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Invoice Number</FieldLabel>
              <FieldInput
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                placeholder="INV-001"
              />
            </FieldGroup>
          </FormGrid>

          <FieldGroup>
            <FieldLabel>Account Details</FieldLabel>
            <FieldInput
              name="accountDetails"
              value={formData.accountDetails}
              onChange={handleChange}
              placeholder="e.g. SBI XXXX1234"
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Attachments</FieldLabel>
            <UploadArea onClick={() => fileInputRef.current?.click()}>
              Drag & drop files here or click to upload
              <br />
              Invoices, bills, quotations (PDF, JPG, PNG, max 2 MB each)
            </UploadArea>
            <HiddenInput
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />
            {attachments.length > 0 && (
              <AttachmentList>
                {attachments.map((attachment) => (
                  <AttachmentItem key={attachment.name}>
                    <span>{attachment.name}</span>
                    <span>{attachment.type || "file"}</span>
                  </AttachmentItem>
                ))}
              </AttachmentList>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Initial Comment</FieldLabel>
            <FieldTextArea
              name="initialComment"
              value={formData.initialComment}
              onChange={handleChange}
              placeholder="Add a note for approvers"
            />
          </FieldGroup>

          <ActionRow>
            <PrimaryButton type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Request"}
            </PrimaryButton>
            <SecondaryButton type="button" onClick={() => navigate("/requester/dashboard")}>
              Cancel
            </SecondaryButton>
          </ActionRow>
        </FormCard>
      )}
    </RequesterPage>
  );
};

export default NewRequest;
