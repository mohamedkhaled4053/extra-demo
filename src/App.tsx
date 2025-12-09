import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

interface StatusMessage {
  type: "success" | "error" | "info";
  message: string;
}

// Authorization token for API requests
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXIiOnsiX2lkIjoiNjhmNzk5ZjBjMjVmZDFlMzAxZjU1ZGQ1IiwidXNlcl9uYW1lIjoia2hhbGVkYXdmYXIifSwiaWF0IjoxNzY0NzYyMTA4LCJleHAiOjE3NjUyODA1MDh9LCJpYXQiOjE3NjUxOTU0NzMsImV4cCI6MTc2NTM2ODI3M30.e7-gdHZay4ClhphbKdiAlEPMwzXUroruXkCYNUsZwY0";

function App() {
  const [contactId, setContactId] = useState<string>("");
  const [instanceId, setInstanceId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(
    null
  );

  // Extract contactID and instanceId from URL query parameters
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const contactID = urlParams.get("contactID");
      const instanceID = urlParams.get("instanceId");

      if (contactID && instanceID) {
        setContactId(contactID);
        setInstanceId(instanceID);
        console.log("✅ Extracted from URL:", { contactID, instanceID });
      } else {
        console.warn("⚠️ Missing required URL parameters: contactID or instanceId");
      }
    } catch (error) {
      console.error("❌ Error parsing URL parameters:", error);
    }
  }, []);

  // API call - Mark as Delivered
  const handleMarkAsDelivered = async () => {
    // Validate required parameters
    if (!contactId || !instanceId) {
      setStatusMessage({
        type: "error",
        message:
          "Missing required parameters. Please ensure the URL contains contactID and instanceId.",
      });
      console.error("❌ Missing required parameters");
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const payload = {
        contactId: contactId,
        instanceId: instanceId,
      };

      console.log("⚡ Mark as Delivered - Sending event to API");
      console.log("📤 Request payload:", payload);

      const response = await axios.post(
        "http://ai-prod.awfar.com/api/test/invoice/delivered/event",
        payload,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      console.log("✅ API Response Success:", data);
      setStatusMessage({
        type: "success",
        message: "Invoice marked as delivered! Event sent successfully.",
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // API responded with error
        console.error("❌ API Response Error:", error.response.data);
        setStatusMessage({
          type: "error",
          message: `API Error: ${
            error.response.data.message || "Failed to mark invoice as delivered"
          }`,
        });
      } else {
        // Network error
        console.error("❌ Network Error:", error);
        setStatusMessage({
          type: "error",
          message: "Network error: Failed to connect to the API endpoint.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="hero-section">
        <div className="logo-container">
          <div className="extra-logo">EXTRA</div>
        </div>
        <h1 className="hero-title">Invoice Delivery System</h1>
        <p className="hero-subtitle">Mark invoices as delivered</p>
      </header>

      <main className="main-content">
        <div className="info-card">
          <div className="info-icon">ℹ️</div>
          <h2>Invoice Delivery Confirmation</h2>
          <p>
            This page allows you to mark an invoice as delivered. Click the button below
            to send a delivery confirmation event to the system.
          </p>
        </div>

        {statusMessage && (
          <div className={`status-message status-${statusMessage.type}`}>
            <span className="status-icon">
              {statusMessage.type === "success" && "✅"}
              {statusMessage.type === "error" && "❌"}
              {statusMessage.type === "info" && "ℹ️"}
            </span>
            <span className="status-text">{statusMessage.message}</span>
          </div>
        )}

        <div className="actions-section">
          <div className="buttons-container single-button">
            <button
              className={`event-button event-button-primary ${
                isLoading ? "loading" : ""
              }`}
              onClick={handleMarkAsDelivered}
              disabled={isLoading}
            >
              <span className="button-icon">{isLoading ? "⏳" : "✅"}</span>
              <span className="button-text">
                {isLoading ? "Processing..." : "Mark as Delivered"}
              </span>
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Extra.com Demo Meeting • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
