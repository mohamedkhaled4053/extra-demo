import { useEffect, useState } from 'react'
import './App.css'

interface StatusMessage {
  type: 'success' | 'error' | 'info'
  message: string
}

function App() {
  const [invoiceData, setInvoiceData] = useState<object | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)

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

  // API call for Event 1
  const handleEvent1 = async () => {
    // Check if invoice data is available
    if (!invoiceData) {
      setStatusMessage({
        type: 'error',
        message: 'No invoice data available. Please ensure the URL contains valid invoice data.'
      })
      console.error('❌ No invoice data available')
      return
    }

    setIsLoading(true)
    setStatusMessage(null)

    try {
      console.log('🚀 Event 1 triggered - Sending invoice data to API')
      console.log('📤 Request payload:', invoiceData)

      const response = await fetch('http://localhost:9098/api/test/invoice', {
        method: 'POST',
        body: JSON.stringify(invoiceData),
        headers: {
          'authorization': '"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXIiOnsiX2lkIjoiNjhmNzk5ZjBjMjVmZDFlMzAxZjU1ZGQ1IiwidXNlcl9uYW1lIjoia2hhbGVkYXdmYXIifSwiaWF0IjoxNzY0NzYyMTA4LCJleHAiOjE3NjUyODA1MDh9LCJpYXQiOjE3NjUxOTU0NzMsImV4cCI6MTc2NTM2ODI3M30.e7-gdHZay4ClhphbKdiAlEPMwzXUroruXkCYNUsZwY0"'
        }
      })

      const data = await response.json()

      if (response.ok) {
        console.log('✅ API Response Success:', data)
        setStatusMessage({
          type: 'success',
          message: 'Invoice successfully sent! API responded with success.'
        })
      } else {
        console.error('❌ API Response Error:', data)
        setStatusMessage({
          type: 'error',
          message: `API Error: ${data.message || 'Failed to process invoice'}`
        })
      }
    } catch (error) {
      console.error('❌ Network Error:', error)
      setStatusMessage({
        type: 'error',
        message: 'Network error: Failed to connect to the API endpoint.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEvent2 = () => {
    console.log('Event 2 triggered - API endpoint to be connected')
    console.log('Invoice data available:', invoiceData)
    setStatusMessage({
      type: 'info',
      message: 'Event 2 is not yet implemented. This is a placeholder for future functionality.'
    })
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

        {statusMessage && (
          <div className={`status-message status-${statusMessage.type}`}>
            <span className="status-icon">
              {statusMessage.type === 'success' && '✅'}
              {statusMessage.type === 'error' && '❌'}
              {statusMessage.type === 'info' && 'ℹ️'}
            </span>
            <span className="status-text">{statusMessage.message}</span>
          </div>
        )}

        <div className="actions-section">
          <h3>Event Triggers</h3>
          <div className="buttons-container">
            <button 
              className={`event-button event-button-1 ${isLoading ? 'loading' : ''}`}
              onClick={handleEvent1}
              disabled={isLoading}
            >
              <span className="button-icon">{isLoading ? '⏳' : '🚀'}</span>
              <span className="button-text">
                {isLoading ? 'Sending...' : 'Trigger Event 1'}
              </span>
            </button>
            
            <button 
              className="event-button event-button-2"
              onClick={handleEvent2}
              disabled={isLoading}
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
