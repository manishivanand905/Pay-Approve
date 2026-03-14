import React, { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import {
  AdminHeaderRow,
  AdminHeaderText,
  AdminPageSubtitle,
  AdminPageTitle,
  EmptyStateCard,
  EmptyStateText,
  EmptyStateTitle,
  FieldGroup,
  FieldInput,
  FieldLabel,
  FormActions,
  FormCard,
  FormCardTitle,
  PrimaryActionButton,
  ToggleHint,
  ToggleList,
  ToggleRow,
  ToggleTextGroup,
  ToggleThumb,
  ToggleTitle,
  ToggleTrack,
} from "./Admin.styles";

const DEFAULT_SETTINGS = {
  notifications: {
    whatsapp: false,
    sms: false,
    email: true,
  },
  whatsappBusinessNumber: "",
  apiKey: "",
};

const Settings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/settings");

        if (mounted) {
          setSettings(response.data);
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

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleChannel = (channel) => {
    setSettings((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [channel]: !current.notifications[channel],
      },
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await apiRequest("/settings", {
        method: "PUT",
        body: {
          notifications: settings.notifications,
          whatsappBusinessNumber: settings.whatsappBusinessNumber,
          apiKey: settings.apiKey,
        },
      });

      setSettings(response.data);
      setMessage("Settings saved successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminHeaderRow>
        <AdminHeaderText>
          <AdminPageTitle>Settings</AdminPageTitle>
          <AdminPageSubtitle>Configure channels and notifications</AdminPageSubtitle>
        </AdminHeaderText>
      </AdminHeaderRow>

      {loading ? (
        <EmptyStateCard>
          <EmptyStateTitle>Loading settings</EmptyStateTitle>
          <EmptyStateText>The system is reading your saved notification configuration.</EmptyStateText>
        </EmptyStateCard>
      ) : (
        <>
          {error && <AdminPageSubtitle style={{ color: "#e43e35" }}>{error}</AdminPageSubtitle>}
          {message && <AdminPageSubtitle style={{ color: "#178b57" }}>{message}</AdminPageSubtitle>}

          <FormCard>
            <FormCardTitle>Notification Channels</FormCardTitle>
            <ToggleList>
              <ToggleRow>
                <ToggleTextGroup>
                  <ToggleTitle>WhatsApp Notifications</ToggleTitle>
                  <ToggleHint>Send alerts via WhatsApp at every stage</ToggleHint>
                </ToggleTextGroup>
                <ToggleTrack
                  type="button"
                  $active={settings.notifications?.whatsapp}
                  onClick={() => toggleChannel("whatsapp")}
                >
                  <ToggleThumb $active={settings.notifications?.whatsapp} />
                </ToggleTrack>
              </ToggleRow>

              <ToggleRow>
                <ToggleTextGroup>
                  <ToggleTitle>SMS Notifications</ToggleTitle>
                  <ToggleHint>Send SMS alerts for critical updates</ToggleHint>
                </ToggleTextGroup>
                <ToggleTrack
                  type="button"
                  $active={settings.notifications?.sms}
                  onClick={() => toggleChannel("sms")}
                >
                  <ToggleThumb $active={settings.notifications?.sms} />
                </ToggleTrack>
              </ToggleRow>

              <ToggleRow>
                <ToggleTextGroup>
                  <ToggleTitle>Email Notifications</ToggleTitle>
                  <ToggleHint>Send email summaries and alerts</ToggleHint>
                </ToggleTextGroup>
                <ToggleTrack
                  type="button"
                  $active={settings.notifications?.email}
                  onClick={() => toggleChannel("email")}
                >
                  <ToggleThumb $active={settings.notifications?.email} />
                </ToggleTrack>
              </ToggleRow>
            </ToggleList>
          </FormCard>

          <FormCard>
            <FormCardTitle>WhatsApp Configuration</FormCardTitle>

            <FieldGroup>
              <FieldLabel>WhatsApp Business API Number</FieldLabel>
              <FieldInput
                value={settings.whatsappBusinessNumber || ""}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    whatsappBusinessNumber: event.target.value,
                  }))
                }
                placeholder="+91 XXXXX XXXXX"
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>API Key</FieldLabel>
              <FieldInput
                value={settings.apiKey || ""}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    apiKey: event.target.value,
                  }))
                }
                placeholder="Enter API key"
              />
            </FieldGroup>

            <FormActions>
              <PrimaryActionButton type="button" onClick={saveSettings} disabled={saving}>
                {saving ? "Saving..." : "Save Configuration"}
              </PrimaryActionButton>
            </FormActions>
          </FormCard>
        </>
      )}
    </>
  );
};

export default Settings;
