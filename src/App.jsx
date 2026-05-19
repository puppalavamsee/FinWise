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
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";

export default function App() {

  const [expenses, setExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

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

    setActiveTab("home");
  };

  const total = expenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const categoryData = [];

const grouped = {};

expenses.forEach(item => {

  if (grouped[item.category]) {
    grouped[item.category] += item.amount;
  } else {
    grouped[item.category] = item.amount;
  }

});

for (const key in grouped) {

  categoryData.push({
    name: key,
    value: grouped[key]
  });

}

const COLORS = [
  "#7CFFB2",
  "#60A5FA",
  "#F472B6",
  "#FBBF24",
  "#A78BFA"
];

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
          marginBottom: "5px"
        }}>
          FinWise
        </h1>

        <p style={{
          color: "#9ca3af"
        }}>
          AI Powered Family Finance
        </p>

        {/* HOME SCREEN */}

        {activeTab === "home" && (

          <>

            <div style={mainCard}>

              <p style={{
                color: "#9ca3af"
              }}>
                Total Expenses
              </p>

              <h1 style={{
                color: "#7CFFB2",
                fontSize: "48px"
              }}>
                ₹ {total}
              </h1>

            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginTop: "20px"
            }}>

              <div style={smallCard}>
                <h3>Expenses</h3>
                <h2>₹ {total}</h2>
              </div>

              <div style={smallCard}>
                <h3>Members</h3>
                <h2>2</h2>
              </div>

            </div>

            <div style={{
              marginTop: "30px"
            }}>

              <h2>Recent Expenses</h2>

              {expenses.map(item => (

                <div
                  key={item.id}
                  style={expenseCard}
                >

                  <div>

                    <h3>{item.title}</h3>

                    <p style={{
                      color: "#9ca3af"
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

          </>

        )}

        {/* ANALYTICS SCREEN */}

        {activeTab === "analytics" && (

  <div style={{
    marginTop: "30px"
  }}>

    <div style={mainCard}>

      <h2>Analytics</h2>

      <p style={{
        color: "#9ca3af",
        marginTop: "15px"
      }}>
        Total Spending
      </p>

      <h1 style={{
        color: "#7CFFB2"
      }}>
        ₹ {total}
      </h1>

    </div>

    <div style={{
      background: "#111827",
      borderRadius: "30px",
      padding: "25px",
      marginTop: "25px",
      height: "350px"
    }}>

      <h3 style={{
        marginBottom: "20px"
      }}>
        Category Breakdown
      </h3>

      <ResponsiveContainer width="100%" height="85%">

        <PieChart>

          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >

            {categoryData.map((entry, index) => (

              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />

            ))}

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>

    <div style={smallCard}>

      <h3>Top Spending Category</h3>

      <h2 style={{
        color: "#7CFFB2"
      }}>
        {categoryData[0]?.name || "No Data"}
      </h2>

    </div>

  </div>

)}

      </div>

      {/* BOTTOM NAVIGATION */}

      <div style={bottomNav}>

        <FaHome
          size={24}
          color={activeTab === "home" ? "#7CFFB2" : "white"}
          onClick={() => setActiveTab("home")}
          style={{ cursor: "pointer" }}
        />

        <FaChartPie
          size={24}
          color={activeTab === "analytics" ? "#7CFFB2" : "white"}
          onClick={() => setActiveTab("analytics")}
          style={{ cursor: "pointer" }}
        />

        <FaPlusCircle
          size={42}
          color={activeTab === "add" ? "#7CFFB2" : "white"}
          onClick={() => setActiveTab("add")}
          style={{ cursor: "pointer" }}
        />

        <FaWallet
          size={24}
          color={activeTab === "wallet" ? "#7CFFB2" : "white"}
          onClick={() => setActiveTab("wallet")}
          style={{ cursor: "pointer" }}
        />

      </div>

    </div>

  );
}

const mainCard = {
  background: "linear-gradient(135deg,#111827,#1f2937)",
  borderRadius: "30px",
  padding: "30px",
  marginTop: "25px",
  boxShadow: "0 0 30px rgba(124,255,178,0.15)"
};

const smallCard = {
  background: "#111827",
  borderRadius: "25px",
  padding: "20px",
  marginTop: "20px"
};

const expenseCard = {
  background: "#111827",
  padding: "20px",
  borderRadius: "25px",
  marginTop: "15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

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

const buttonStyle = {
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
};

const bottomNav = {
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
};