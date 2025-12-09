import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

interface StatusMessage {
  type: "success" | "error" | "info";
  message: string;
}

interface InvoiceData {
  contact: {
    _id: string;
    phone: string;
  };
  instanceId: string;
  products?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

// Authorization token for API requests
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXIiOnsiX2lkIjoiNjhmNzk5ZjBjMjVmZDFlMzAxZjU1ZGQ1IiwidXNlcl9uYW1lIjoia2hhbGVkYXdmYXIifSwiaWF0IjoxNzY0NzYyMTA4LCJleHAiOjE3NjUyODA1MDh9LCJpYXQiOjE3NjUxOTU0NzMsImV4cCI6MTc2NTM2ODI3M30.e7-gdHZay4ClhphbKdiAlEPMwzXUroruXkCYNUsZwY0";

function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(
    null
  );

  // Extract and parse invoice data from URL
  useEffect(() => {
    try {
      // Get the pathname (everything after the domain)
      const pathname = window.location.pathname;

      // Remove leading slash if present
      const jsonString = pathname.startsWith("/")
        ? pathname.slice(1)
        : pathname;

      if (jsonString) {
        // Decode URL-encoded characters
        let decodedString = decodeURIComponent(jsonString);

        decodedString = decodedString.replace(/\//g, "");

        // Parse the JSON string
        const parsedData = JSON.parse(decodedString);

        // Store in state
        setInvoiceData(parsedData);
      }
    } catch (error) {
      console.error("❌ Error parsing invoice data from URL:", error);
      console.log("URL pathname:", window.location.pathname);
    }
  }, []);

  // API call for Button 1 - Submit Invoice
  const handleEvent1 = async () => {
    // Check if invoice data is available
    if (!invoiceData) {
      setStatusMessage({
        type: "error",
        message:
          "No invoice data available. Please ensure the URL contains valid invoice data.",
      });
      console.error("❌ No invoice data available");
      return;
    }

    setIsLoading1(true);
    setStatusMessage(null);

    try {
      console.log("🚀 Submit Invoice - Sending invoice data to API");
      console.log("📤 Request payload:", invoiceData);

      const response = await axios.post(
        "http://localhost:9098/api/test/invoice",
        invoiceData,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );

      const data = response.data;
      console.log("✅ API Response Success:", data);
      setStatusMessage({
        type: "success",
        message: "Invoice successfully submitted! API responded with success.",
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // API responded with error
        console.error("❌ API Response Error:", error.response.data);
        setStatusMessage({
          type: "error",
          message: `API Error: ${
            error.response.data.message || "Failed to process invoice"
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
      setIsLoading1(false);
    }
  };

  // API call for Button 2 - Mark as Delivered
  const handleEvent2 = async () => {
    // Check if invoice data is available
    if (!invoiceData) {
      setStatusMessage({
        type: "error",
        message:
          "No invoice data available. Please ensure the URL contains valid invoice data.",
      });
      console.error("❌ No invoice data available");
      return;
    }

    // Validate required fields
    if (!invoiceData.contact?._id || !invoiceData.instanceId) {
      setStatusMessage({
        type: "error",
        message:
          "Invalid invoice data. Missing contact ID or instance ID.",
      });
      console.error("❌ Missing required fields in invoice data");
      return;
    }

    setIsLoading2(true);
    setStatusMessage(null);

    try {
      // Transform the data for delivered event endpoint
      const payload = {
        contactId: invoiceData.contact._id,
        instanceId: invoiceData.instanceId,
      };

      console.log("⚡ Mark as Delivered - Sending event to API");
      console.log("📤 Request payload:", payload);

      const response = await axios.post(
        "http://localhost:9098/api/test/invoice/delivered/event",
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
      setIsLoading2(false);
    }
  };

  return (
    <div className="app-container">
      <header className="hero-section">
        <div className="logo-container">
          <div className="extra-logo">EXTRA</div>
        </div>
        <h1 className="hero-title">Demo Event Triggers</h1>
        <p className="hero-subtitle">Integration Testing Platform</p>
      </header>

      <main className="main-content">
        <div className="info-card">
          <div className="info-icon">ℹ️</div>
          <h2>Demo Page Information</h2>
          <p>
            This is a demonstration page designed to trigger two different
            events for testing and integration purposes. Each button below will
            call a separate API endpoint to demonstrate event handling
            capabilities.
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
          <h3>Event Triggers</h3>
          <div className="buttons-container">
            <button
              className={`event-button event-button-1 ${
                isLoading1 ? "loading" : ""
              }`}
              onClick={handleEvent1}
              disabled={isLoading1 || isLoading2}
            >
              <span className="button-icon">{isLoading1 ? "⏳" : "📝"}</span>
              <span className="button-text">
                {isLoading1 ? "Submitting..." : "Submit Invoice"}
              </span>
            </button>

            <button
              className={`event-button event-button-2 ${
                isLoading2 ? "loading" : ""
              }`}
              onClick={handleEvent2}
              disabled={isLoading1 || isLoading2}
            >
              <span className="button-icon">{isLoading2 ? "⏳" : "✅"}</span>
              <span className="button-text">
                {isLoading2 ? "Processing..." : "Mark as Delivered"}
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
