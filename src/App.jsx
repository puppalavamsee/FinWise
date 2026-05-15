import { useEffect, useState } from "react";

import {
  db,
  collection,
  addDoc,
  onSnapshot
} from "./db";

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
      background: "#050816",
      minHeight: "100vh",
      color: "white",
      padding: "25px",
      fontFamily: "Arial"
    }}>

      <h1 style={{
        color: "#7CFFB2",
        fontSize: "48px"
      }}>
        FinWise
      </h1>

      <p style={{
        color: "#9ca3af",
        marginBottom: "25px"
      }}>
        AI Powered Family Finance
      </p>

      <div style={{
        background: "#111827",
        padding: "25px",
        borderRadius: "25px",
        marginBottom: "25px"
      }}>

        <h3>Total Expenses</h3>

        <h1 style={{
          color: "#7CFFB2",
          fontSize: "42px"
        }}>
          ₹ {total}
        </h1>

      </div>

      <div style={{
        background: "#111827",
        padding: "25px",
        borderRadius: "25px",
        marginBottom: "25px"
      }}>

        <h2>Add Expense</h2>

        <input
          placeholder="Expense title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Amount"
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
            padding: "15px",
            borderRadius: "15px",
            width: "100%",
            fontSize: "18px",
            marginTop: "15px",
            cursor: "pointer"
          }}
        >
          Add Expense
        </button>

      </div>

      <div>

        <h2>Expenses</h2>

        {expenses.map(item => (

          <div
            key={item.id}
            style={{
              background: "#111827",
              padding: "20px",
              borderRadius: "20px",
              marginBottom: "15px"
            }}
          >

            <h3>{item.title}</h3>

            <p>₹ {item.amount}</p>

            <p>{item.member}</p>

            <p>{item.category}</p>

          </div>

        ))}

      </div>

    </div>

  );
}

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "15px",
  borderRadius: "15px",
  border: "none",
  background: "#1f2937",
  color: "white",
  fontSize: "16px"
};