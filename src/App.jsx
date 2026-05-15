export default function App() {

  return (

    <div style={{
      background: "#050816",
      minHeight: "100vh",
      color: "white",
      padding: "30px",
      fontFamily: "Arial"
    }}>

      <h1 style={{
        color: "#7CFFB2",
        fontSize: "48px",
        marginBottom: "10px"
      }}>
        FinWise
      </h1>

      <p style={{
        color: "#9ca3af",
        marginBottom: "30px"
      }}>
        AI Powered Family Finance Dashboard
      </p>

      <div style={{
        background: "#111827",
        borderRadius: "25px",
        padding: "30px",
        marginBottom: "25px"
      }}>

        <h3>Total Balance</h3>

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
          borderRadius: "20px",
          padding: "20px"
        }}>

          <h3>Expenses</h3>

          <h2>₹ 85,000</h2>

        </div>

        <div style={{
          background: "#111827",
          borderRadius: "20px",
          padding: "20px"
        }}>

          <h3>Investments</h3>

          <h2>₹ 2,40,000</h2>

        </div>

      </div>

    </div>

  );
}