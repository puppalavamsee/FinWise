import { useEffect, useState } from "react";

import {
  db,
  collection,
  addDoc,
  onSnapshot
} from "./db";

import {
  FaHome,
  FaChartPie,
  FaWallet,
  FaPlusCircle
} from "react-icons/fa";

export default function App() {

  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [member, setMember] = useState("Vamsee");
  const [category, setCategory] = useState("Food");

  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "expenses"),
      (snapshot) => {

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setExpenses(data);
      }
    );

    return () => unsub();

  }, []);

  const addExpense = async () => {

    if (!title || !amount) return;

    await addDoc(
      collection(db, "expenses"),
      {
        title,
        amount: Number(amount),
        member,
        category,
        createdAt: new Date()
      }
    );

    setTitle("");
    setAmount("");
  };

  const total = expenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (

    <div style={{
      background: "#030712",
      minHeight: "100vh",
      color: "white",
      paddingBottom: "120px",
      fontFamily: "Arial",
      display: "flex",
      justifyContent: "center"
    }}>

      <div style={{
        padding: "25px",
        width: "100%",
        maxWidth: "430px"
      }}>

        <h1 style={{
          color: "#7CFFB2",
          fontSize: "42px",
          marginBottom: "5px",
          fontWeight: "bold"
        }}>
          FinWise
        </h1>

        <p style={{
          color: "#9ca3af"
        }}>
          AI Powered Family Finance
        </p>

        {/* TOTAL CARD */}

        <div style={{
          background: "linear-gradient(135deg,#111827,#1f2937)",
          borderRadius: "30px",
          padding: "30px",
          marginTop: "25px",
          boxShadow: "0 0 30px rgba(124,255,178,0.15)"
        }}>

          <p style={{
            color: "#9ca3af",
            marginBottom: "10px"
          }}>
            Total Expenses
          </p>

          <h1 style={{
            color: "#7CFFB2",
            fontSize: "48px",
            margin: 0
          }}>
            ₹ {total}
          </h1>

        </div>

        {/* STATS */}

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          marginTop: "20px"
        }}>

          <div style={smallCard}>
            <h3 style={smallTitle}>Expenses</h3>
            <h2 style={smallValue}>₹ {total}</h2>
          </div>

          <div style={smallCard}>
            <h3 style={smallTitle}>Members</h3>
            <h2 style={smallValue}>2</h2>
          </div>

        </div>

        {/* ADD EXPENSE */}

        <div style={{
          background: "#111827",
          borderRadius: "30px",
          padding: "25px",
          marginTop: "25px"
        }}>

          <h2 style={{
            marginBottom: "20px"
          }}>
            Add Expense
          </h2>

          <input
            placeholder="Expense title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={inputStyle}
          />

          <select
            value={member}
            onChange={(e) => setMember(e.target.value)}
            style={inputStyle}
          >
            <option>Vamsee</option>
            <option>Padmaja</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          >
            <option>Food</option>
            <option>Fuel</option>
            <option>EMI</option>
            <option>Shopping</option>
            <option>Investment</option>
          </select>

          <button
            onClick={addExpense}
            style={{
              background: "#7CFFB2",
              color: "black",
              border: "none",
              padding: "16px",
              borderRadius: "18px",
              width: "100%",
              fontSize: "18px",
              marginTop: "20px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Add Expense
          </button>

        </div>

        {/* RECENT EXPENSES */}

        <div style={{
          marginTop: "30px"
        }}>

          <h2 style={{
            marginBottom: "20px"
          }}>
            Recent Expenses
          </h2>

          {expenses.map(item => (

            <div
              key={item.id}
              style={{
                background: "#111827",
                padding: "20px",
                borderRadius: "25px",
                marginBottom: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >

              <div>

                <h3 style={{
                  marginBottom: "8px"
                }}>
                  {item.title}
                </h3>

                <p style={{
                  color: "#9ca3af",
                  fontSize: "14px"
                }}>
                  {item.member} • {item.category}
                </p>

              </div>

              <h2 style={{
                color: "#7CFFB2"
              }}>
                ₹ {item.amount}
              </h2>

            </div>

          ))}

        </div>

      </div>

      {/* BOTTOM NAVBAR */}

      <div style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "430px",
        background: "#111827",
        borderRadius: "30px",
        padding: "18px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        boxShadow: "0 0 20px rgba(0,0,0,0.5)"
      }}>

        <FaHome size={24} color="#7CFFB2" />

        <FaChartPie size={24} color="white" />

        <FaPlusCircle size={42} color="#7CFFB2" />

        <FaWallet size={24} color="white" />

      </div>

    </div>

  );
}

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginTop: "15px",
  borderRadius: "18px",
  border: "none",
  background: "#1f2937",
  color: "white",
  fontSize: "16px",
  boxSizing: "border-box"
};

const smallCard = {
  background: "#111827",
  borderRadius: "25px",
  padding: "20px"
};

const smallTitle = {
  color: "#9ca3af",
  marginBottom: "10px"
};

const smallValue = {
  color: "#7CFFB2",
  margin: 0
};