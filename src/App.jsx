export default function App() {
  return (
    <div style={{
      background: "#050816",
      minHeight: "100vh",
      color: "white",
      padding: "40px",
      fontFamily: "Arial"
    }}>
      
      <h1 style={{
        fontSize: "48px",
        marginBottom: "10px",
        color: "#7CFFB2"
      }}>
        FinWise
      </h1>

      <p style={{
        color: "#a1a1aa",
        marginBottom: "30px"
      }}>
        AI Powered Family Finance App
      </p>

      <div style={{
        background: "#111827",
        padding: "30px",
        borderRadius: "20px",
        marginBottom: "20px"
      }}>
        <h2>Total Balance</h2>

        <h1 style={{
          color: "#7CFFB2",
          fontSize: "42px"
        }}>
          ₹ 5,40,000
        </h1>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px"
      }}>
        
        <div style={{
          background: "#111827",
          padding: "20px",
          borderRadius: "20px"
        }}>
          <h3>Expenses</h3>
          <p>₹ 85,000</p>
        </div>

        <div style={{
          background: "#111827",
          padding: "20px",
          borderRadius: "20px"
        }}>
          <h3>Investments</h3>
          <p>₹ 2,40,000</p>
        </div>

      </div>
    </div>
  )
}