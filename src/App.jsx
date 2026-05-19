
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

    setTitle("");
    setAmount("");

    setActiveTab("home");

  };

  const addBudget = () => {

    if (!budgetAmount) return;

    setBudgets([
      ...budgets,
      {
        id: Date.now(),
        category: budgetCategory,
        amount: Number(budgetAmount)
      }
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

  const total =
    expenses.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  const currentMonth =
    new Date().getMonth();

  const currentYear =
    new Date().getFullYear();

  const monthlyTotal =
    expenses
      .filter(item => {

        if (!item.createdAt) return false;

        const date =
          item.createdAt?.seconds
            ? new Date(
                item.createdAt.seconds * 1000
              )
            : new Date();

        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );

      })
      .reduce(
        (sum, item) =>
          sum + Number(item.amount),
        0
      );

  const yearlyTotal =
    expenses
      .filter(item => {

        if (!item.createdAt) return false;

        const date =
          item.createdAt?.seconds
            ? new Date(
                item.createdAt.seconds * 1000
              )
            : new Date();

        return (
          date.getFullYear() === currentYear
        );

      })
      .reduce(
        (sum, item) =>
          sum + Number(item.amount),
        0
      );

  const monthlyInvestment =
    investments.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  const monthlyEmi =
    emis.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  const financialScore =
    total < 30000
      ? 88
      : total < 70000
      ? 72
      : 55;

  const grouped = {};

  expenses.forEach(item => {

    if (grouped[item.category]) {
      grouped[item.category] += Number(item.amount);
    } else {
      grouped[item.category] = Number(item.amount);
    }

  });

  const categoryData =
    Object.keys(grouped).map(key => ({
      name: key,
      value: grouped[key]
    }));

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
    "#FBBF24",
    "#F472B6",
    "#A78BFA"
  ];

  return (

    <div style={{
      background:
        "linear-gradient(180deg,#020617,#07111f)",
      minHeight: "100vh",
      color: "#ffffff",
      paddingBottom: "120px",
      display: "flex",
      justifyContent: "center",
      fontFamily: "Arial"
    }}>

      <div style={{
        width: "100%",
        maxWidth: "430px",
        padding: "24px"
      }}>

        <h1 style={{
          color: "#7CFFB2",
          fontSize: "42px"
        }}>
          FinWise
        </h1>

        <p style={{
          color: "#94A3B8"
        }}>
          Premium Family Finance
        </p>

        {/* HOME */}

        {activeTab === "home" && (

          <>

            <div style={heroCard}>

              <p>Total Financial Overview</p>

              <h1 style={{
                fontSize: "52px",
                marginTop: "10px"
              }}>
                ₹ {total}
              </h1>

              <p style={{
                marginTop: "12px"
              }}>
                Financial Score: {financialScore}/100
              </p>

            </div>

            <div style={grid2}>

              <div style={statCard}>
                <p style={secondaryText}>
                  Monthly Spend
                </p>
                <h2 style={greenText}>
                  ₹ {monthlyTotal}
                </h2>
              </div>

              <div style={statCard}>
                <p style={secondaryText}>
                  Annual Spend
                </p>
                <h2 style={blueText}>
                  ₹ {yearlyTotal}
                </h2>
              </div>

              <div style={statCard}>
                <p style={secondaryText}>
                  Investments
                </p>
                <h2 style={goldText}>
                  ₹ {monthlyInvestment}
                </h2>
              </div>

              <div style={statCard}>
                <p style={secondaryText}>
                  EMI Load
                </p>
                <h2 style={redText}>
                  ₹ {monthlyEmi}
                </h2>
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

                    <h3>
                      {item.title}
                    </h3>

                    <p style={secondaryText}>
                      {item.member} • {item.category}
                    </p>

                  </div>

                  <h2 style={greenText}>
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

            <div style={grid2}>

              <div style={statCard}>
                <p style={secondaryText}>
                  Monthly Spend
                </p>
                <h2 style={greenText}>
                  ₹ {monthlyTotal}
                </h2>
              </div>

              <div style={statCard}>
                <p style={secondaryText}>
                  Annual Spend
                </p>
                <h2 style={blueText}>
                  ₹ {yearlyTotal}
                </h2>
              </div>

            </div>

            <div style={chartCard}>

              <h2>
                Expense Breakdown
              </h2>

              <ResponsiveContainer
                width="100%"
                height="90%"
              >

                <PieChart>

                  <Pie
                    data={categoryData}
                    dataKey="value"
                    outerRadius={100}
                    innerRadius={60}
                    label
                  >

                    {categoryData.map(
                      (entry, index) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                              COLORS.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

            <div style={card}>

              <h2>
                Budget Planner
              </h2>

              <select
                value={budgetCategory}
                onChange={(e) =>
                  setBudgetCategory(
                    e.target.value
                  )
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
                  setBudgetAmount(
                    e.target.value
                  )
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

          <div style={card}>

            <h2>
              Add Expense
            </h2>

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

            <div style={card}>

              <h2>
                EMI Tracker
              </h2>

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

            <div style={card}>

              <h2>
                Investment Tracker
              </h2>

              <input
                placeholder="Investment Name"
                value={investmentName}
                onChange={(e) =>
                  setInvestmentName(
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <input
                placeholder="Investment Amount"
                type="number"
                value={investmentAmount}
                onChange={(e) =>
                  setInvestmentAmount(
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <select
                value={investmentType}
                onChange={(e) =>
                  setInvestmentType(
                    e.target.value
                  )
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
          color={
            activeTab === "home"
              ? "#7CFFB2"
              : "white"
          }
          onClick={() =>
            setActiveTab("home")
          }
          style={{ cursor: "pointer" }}
        />

        <FaChartPie
          size={24}
          color={
            activeTab === "analytics"
              ? "#7CFFB2"
              : "white"
          }
          onClick={() =>
            setActiveTab("analytics")
          }
          style={{ cursor: "pointer" }}
        />

        <FaPlusCircle
          size={42}
          color={
            activeTab === "add"
              ? "#7CFFB2"
              : "white"
          }
          onClick={() =>
            setActiveTab("add")
          }
          style={{ cursor: "pointer" }}
        />

        <FaWallet
          size={24}
          color={
            activeTab === "wallet"
              ? "#7CFFB2"
              : "white"
          }
          onClick={() =>
            setActiveTab("wallet")
          }
          style={{ cursor: "pointer" }}
        />

      </div>

    </div>

  );

}

const heroCard = {
  background:
    "linear-gradient(135deg,#7CFFB2,#60A5FA)",
  borderRadius: "35px",
  padding: "30px",
  marginTop: "25px",
  color: "#020617"
};

const card = {
  background:
    "rgba(17,24,39,0.75)",
  backdropFilter: "blur(18px)",
  border:
    "1px solid rgba(255,255,255,0.06)",
  borderRadius: "30px",
  padding: "28px",
  marginTop: "25px"
};

const statCard = {
  background:
    "rgba(17,24,39,0.75)",
  backdropFilter: "blur(18px)",
  border:
    "1px solid rgba(255,255,255,0.06)",
  borderRadius: "28px",
  padding: "22px"
};

const expenseCard = {
  background:
    "rgba(17,24,39,0.78)",
  border:
    "1px solid rgba(255,255,255,0.04)",
  padding: "22px",
  borderRadius: "28px",
  marginTop: "18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const chartCard = {
  background:
    "rgba(17,24,39,0.75)",
  border:
    "1px solid rgba(255,255,255,0.06)",
  borderRadius: "30px",
  padding: "28px",
  marginTop: "25px",
  height: "420px"
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  marginTop: "25px"
};

const inputStyle = {
  width: "100%",
  padding: "18px",
  marginTop: "16px",
  borderRadius: "18px",
  border:
    "1px solid rgba(255,255,255,0.08)",
  background:
    "rgba(31,41,55,0.85)",
  color: "#ffffff",
  fontSize: "16px",
  boxSizing: "border-box"
};

const buttonStyle = {
  background:
    "linear-gradient(135deg,#7CFFB2,#60A5FA)",
  color: "#020617",
  border: "none",
  padding: "18px",
  borderRadius: "20px",
  width: "100%",
  fontSize: "17px",
  marginTop: "22px",
  cursor: "pointer",
  fontWeight: "700"
};

const secondaryText = {
  color: "#94A3B8"
};

const greenText = {
  color: "#7CFFB2"
};

const blueText = {
  color: "#60A5FA"
};

const goldText = {
  color: "#FBBF24"
};

const redText = {
  color: "#F87171"
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
  boxShadow:
    "0 0 20px rgba(0,0,0,0.5)"
};
const exportBtnGreen = {
  flex: 1,
  background: "#7CFFB2",
  color: "#020617",
  border: "none",
  padding: "14px",
  borderRadius: "15px",
  fontWeight: "bold",
  cursor: "pointer"
};

const exportBtnBlue = {
  flex: 1,
  background: "#60A5FA",
  color: "#ffffff",
  border: "none",
  padding: "14px",
  borderRadius: "15px",
  fontWeight: "bold",
  cursor: "pointer"
};
