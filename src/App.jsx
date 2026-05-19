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

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function App() {

  const [expenses, setExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [member, setMember] = useState("Vamsee");
  const [category, setCategory] = useState("Food");

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringExpenses, setRecurringExpenses] = useState([]);

  const [budgets, setBudgets] = useState([]);
  const [budgetCategory, setBudgetCategory] = useState("Food");
  const [budgetAmount, setBudgetAmount] = useState("");

  const [emis, setEmis] = useState([]);
  const [emiName, setEmiName] = useState("");
  const [emiAmount, setEmiAmount] = useState("");
  const [emiDate, setEmiDate] = useState("");

  const [investments, setInvestments] = useState([]);
  const [investmentName, setInvestmentName] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [investmentType, setInvestmentType] = useState("Mutual Fund");

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

    const emiUnsub = onSnapshot(
      collection(db, "emis"),
      (snapshot) => {

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setEmis(data);

      }
    );

    const investmentUnsub = onSnapshot(
      collection(db, "investments"),
      (snapshot) => {

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setInvestments(data);

      }
    );

    return () => {
      unsub();
      emiUnsub();
      investmentUnsub();
    };

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

    if (isRecurring) {

      const recurringItem = {
        title,
        amount: Number(amount),
        member,
        category,
        recurring: true
      };

      setRecurringExpenses([
        ...recurringExpenses,
        recurringItem
      ]);

    }

    setTitle("");
    setAmount("");

    setActiveTab("home");

  };

  const addBudget = () => {

    if (!budgetAmount) return;

    const newBudget = {
      id: Date.now(),
      category: budgetCategory,
      amount: Number(budgetAmount)
    };

    setBudgets([
      ...budgets,
      newBudget
    ]);

    setBudgetAmount("");

  };

  const addEmi = async () => {

    if (!emiName || !emiAmount || !emiDate) return;

    await addDoc(
      collection(db, "emis"),
      {
        name: emiName,
        amount: Number(emiAmount),
        date: emiDate,
        createdAt: new Date()
      }
    );

    setEmiName("");
    setEmiAmount("");
    setEmiDate("");

  };

  const addInvestment = async () => {

    if (!investmentName || !investmentAmount) return;

    await addDoc(
      collection(db, "investments"),
      {
        name: investmentName,
        amount: Number(investmentAmount),
        type: investmentType,
        createdAt: new Date()
      }
    );

    setInvestmentName("");
    setInvestmentAmount("");

  };

  const total = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const grouped = {};

  expenses.forEach(item => {

    if (grouped[item.category]) {
      grouped[item.category] += Number(item.amount);
    } else {
      grouped[item.category] = Number(item.amount);
    }

  });

  const categoryData = Object.keys(grouped).map(key => ({
    name: key,
    value: grouped[key]
  }));

  const highestCategory = categoryData.reduce(
    (max, item) =>
      item.value > (max?.value || 0)
        ? item
        : max,
    null
  );

  const savingsSuggestion =
    total > 50000
      ? "Your spending is high this month. Reduce shopping and fuel expenses."
      : "Excellent financial discipline this month.";

  const financialHealth =
    total < 30000
      ? "Excellent"
      : total < 70000
      ? "Good"
      : "Needs Attention";

  const today = new Date();

  const upcomingEmis = emis.filter(item => {

    const emiDateObj = new Date(item.date);

    const diffTime =
      emiDateObj - today;

    const diffDays =
      Math.ceil(
        diffTime /
        (1000 * 60 * 60 * 24)
      );

    return diffDays <= 7;

  });

  const exportExcel = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(expenses);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Expenses"
    );

    XLSX.writeFile(
      workbook,
      "FinWise_Expenses.xlsx"
    );

  };

  const exportPDF = () => {

    const doc = new jsPDF();

    doc.text(
      "FinWise Expense Report",
      14,
      15
    );

    autoTable(doc, {

      head: [[
        "Title",
        "Amount",
        "Member",
        "Category"
      ]],

      body: expenses.map(item => ([
        item.title,
        item.amount,
        item.member,
        item.category
      ]))

    });

    doc.save(
      "FinWise_Report.pdf"
    );

  };

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
          fontSize: "42px"
        }}>
          FinWise
        </h1>

        <p style={{
          color: "#9ca3af"
        }}>
          AI Powered Family Finance
        </p>

        {/* HOME */}

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

        {/* ANALYTICS */}

        {activeTab === "analytics" && (

          <div style={{
            marginTop: "30px"
          }}>

            <div style={mainCard}>

              <h2>Analytics</h2>

              <div style={{
                display: "flex",
                gap: "15px",
                marginTop: "20px"
              }}>

                <button
                  onClick={exportExcel}
                  style={exportBtnGreen}
                >
                  Export Excel
                </button>

                <button
                  onClick={exportPDF}
                  style={exportBtnBlue}
                >
                  Export PDF
                </button>

              </div>

            </div>

            <div style={{
              background: "#111827",
              borderRadius: "30px",
              padding: "25px",
              marginTop: "25px",
              height: "350px"
            }}>

              <ResponsiveContainer width="100%" height="100%">

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

            <div style={{
              background: "#111827",
              borderRadius: "30px",
              padding: "25px",
              marginTop: "25px"
            }}>

              <h2 style={{
                color: "#7CFFB2"
              }}>
                AI Insights
              </h2>

              <p style={{
                marginTop: "15px"
              }}>
                Financial Health: {financialHealth}
              </p>

              <p style={{
                marginTop: "10px"
              }}>
                Highest Spending: {highestCategory?.name || "No Data"}
              </p>

              <p style={{
                marginTop: "10px",
                color: "#7CFFB2"
              }}>
                {savingsSuggestion}
              </p>

            </div>

            <div style={{
              background: "#111827",
              borderRadius: "30px",
              padding: "25px",
              marginTop: "25px"
            }}>

              <h2 style={{
                color: "#7CFFB2"
              }}>
                Budget Planner
              </h2>

              <select
                value={budgetCategory}
                onChange={(e) =>
                  setBudgetCategory(e.target.value)
                }
                style={inputStyle}
              >
                <option>Food</option>
                <option>Fuel</option>
                <option>Shopping</option>
                <option>Investment</option>
                <option>EMI</option>
              </select>

              <input
                placeholder="Monthly Budget"
                type="number"
                value={budgetAmount}
                onChange={(e) =>
                  setBudgetAmount(e.target.value)
                }
                style={inputStyle}
              />

              <button
                onClick={addBudget}
                style={buttonStyle}
              >
                Add Budget
              </button>

            </div>

          </div>

        )}

        {/* ADD */}

        {activeTab === "add" && (

          <div style={{
            background: "#111827",
            borderRadius: "30px",
            padding: "25px",
            marginTop: "25px"
          }}>

            <h2>Add Expense</h2>

            <input
              placeholder="Expense title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              style={inputStyle}
            />

            <input
              placeholder="Amount"
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              style={inputStyle}
            />

            <select
              value={member}
              onChange={(e) =>
                setMember(e.target.value)
              }
              style={inputStyle}
            >
              <option>Vamsee</option>
              <option>Padmaja</option>
            </select>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              style={inputStyle}
            >
              <option>Food</option>
              <option>Fuel</option>
              <option>EMI</option>
              <option>Shopping</option>
              <option>Investment</option>
            </select>

            <div style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>

              <input
                type="checkbox"
                checked={isRecurring}
                onChange={() =>
                  setIsRecurring(!isRecurring)
                }
              />

              <label>
                Monthly Recurring Expense
              </label>

            </div>

            <button
              onClick={addExpense}
              style={buttonStyle}
            >
              Add Expense
            </button>

          </div>

        )}

        {/* WALLET */}

        {activeTab === "wallet" && (

          <div style={{
            marginTop: "30px"
          }}>

            <div style={mainCard}>

              <h2>EMI Tracker</h2>

              <h1 style={{
                color: "#7CFFB2"
              }}>
                ₹ {
                  emis.reduce(
                    (sum, item) =>
                      sum + Number(item.amount),
                    0
                  )
                }
              </h1>

            </div>

            <div style={{
              background: "#111827",
              borderRadius: "30px",
              padding: "25px",
              marginTop: "25px"
            }}>

              <h2>Add EMI</h2>

              <input
                placeholder="EMI Name"
                value={emiName}
                onChange={(e) =>
                  setEmiName(e.target.value)
                }
                style={inputStyle}
              />

              <input
                placeholder="EMI Amount"
                type="number"
                value={emiAmount}
                onChange={(e) =>
                  setEmiAmount(e.target.value)
                }
                style={inputStyle}
              />

              <input
                type="date"
                value={emiDate}
                onChange={(e) =>
                  setEmiDate(e.target.value)
                }
                style={inputStyle}
              />

              <button
                onClick={addEmi}
                style={buttonStyle}
              >
                Add EMI
              </button>

            </div>

            <div style={{
              background: "#111827",
              borderRadius: "30px",
              padding: "25px",
              marginTop: "25px"
            }}>

              <h2>Add Investment</h2>

              <input
                placeholder="Investment Name"
                value={investmentName}
                onChange={(e) =>
                  setInvestmentName(e.target.value)
                }
                style={inputStyle}
              />

              <input
                placeholder="Investment Amount"
                type="number"
                value={investmentAmount}
                onChange={(e) =>
                  setInvestmentAmount(e.target.value)
                }
                style={inputStyle}
              />

              <select
                value={investmentType}
                onChange={(e) =>
                  setInvestmentType(e.target.value)
                }
                style={inputStyle}
              >
                <option>Mutual Fund</option>
                <option>Stocks</option>
                <option>Gold</option>
                <option>Crypto</option>
              </select>

              <button
                onClick={addInvestment}
                style={buttonStyle}
              >
                Add Investment
              </button>

            </div>

          </div>

        )}

      </div>

      {/* BOTTOM NAV */}

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

const exportBtnGreen = {
  flex: 1,
  background: "#7CFFB2",
  color: "black",
  border: "none",
  padding: "14px",
  borderRadius: "15px",
  fontWeight: "bold",
  cursor: "pointer"
};

const exportBtnBlue = {
  flex: 1,
  background: "#60A5FA",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "15px",
  fontWeight: "bold",
  cursor: "pointer"
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
