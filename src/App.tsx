import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [invoiceData, setInvoiceData] = useState<object | null>(null)

  // Extract and parse invoice data from URL
  useEffect(() => {
    try {
      // Get the pathname (everything after the domain)
      const pathname = window.location.pathname
      
      // Remove leading slash if present
      const jsonString = pathname.startsWith('/') ? pathname.slice(1) : pathname
      
      if (jsonString) {
        // Decode URL-encoded characters
        let decodedString = decodeURIComponent(jsonString)

        decodedString = decodedString.replace(/\//g, '');
        
        // Parse the JSON string
        const parsedData = JSON.parse(decodedString)        
        
        // Store in state
        setInvoiceData(parsedData)
        
      }
    } catch (error) {
      console.error('❌ Error parsing invoice data from URL:', error)
      console.log('URL pathname:', window.location.pathname)
    }
  }, [])

  // Placeholder functions for API calls - to be implemented later
  const handleEvent1 = () => {
    console.log('Event 1 triggered - API endpoint to be connected')
    console.log('Invoice data available:', invoiceData)
    // TODO: Implement API call to endpoint 1
  }

  const handleEvent2 = () => {
    console.log('Event 2 triggered - API endpoint to be connected')
    console.log('Invoice data available:', invoiceData)
    // TODO: Implement API call to endpoint 2
  }

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
            This is a demonstration page designed to trigger two different events
            for testing and integration purposes. Each button below will call a
            separate API endpoint to demonstrate event handling capabilities.
          </p>
        </div>

        <div className="actions-section">
          <h3>Event Triggers</h3>
          <div className="buttons-container">
            <button 
              className="event-button event-button-1"
              onClick={handleEvent1}
            >
              <span className="button-icon">🚀</span>
              <span className="button-text">Trigger Event 1</span>
            </button>
            
            <button 
              className="event-button event-button-2"
              onClick={handleEvent2}
            >
              <span className="button-icon">⚡</span>
              <span className="button-text">Trigger Event 2</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Extra.com Demo Meeting • {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
