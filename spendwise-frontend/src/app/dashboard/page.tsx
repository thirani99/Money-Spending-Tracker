"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { api } from "@/lib/api";

type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  note?: string;
};

const COLORS = [
  "#4F46E5", "#06B6D4", "#F59E0B", "#EF4444", "#10B981", "#8B5CF6", "#EC4899",
];

function formatCurrency(n: number, currency = "LKR", locale = "en-LK") {
  return n.toLocaleString(locale, { style: "currency", currency });
}

export default function Dashboard() {
     const [transactions, setTransactions] = useState<Transaction[]>([]);


     const [loading, setLoading] = useState(true);
     const [selectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          api.get("/income/get"),
          api.get("/expenses/get"),
        ]);

        const incomeData = incomeRes.data.map((i: any) => ({
          id: i._id,
          date: new Date(i.date).toISOString(),
          amount: i.amount,
          type: "income" as const,
          category: i.category,
          note: i.income_source,
        }));

        const expenseData = expenseRes.data.map((e: any) => ({
          id: e._id,
          date: new Date(e.date).toISOString(),
          amount: e.amount,
          type: "expense" as const,
          category: e.category,
          note: e.note,
        }));

        setTransactions([...incomeData, ...expenseData]);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


console.log(transactions);
  



  const transactionsForMonth = useMemo(() => {
    return transactions.filter((t) => t.date.slice(0, 7) === selectedMonth);
  }, [transactions, selectedMonth]);

  const incomeData = useMemo(() => {
    const map = new Map<string, number>();
    transactionsForMonth
      .filter((t) => t.type === "income")
      .forEach((t) => map.set(t.category, (map.get(t.category) || 0) + t.amount));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [transactionsForMonth]);

  const expenseData = useMemo(() => {
    const map = new Map<string, number>();
    transactionsForMonth
      .filter((t) => t.type === "expense")
      .forEach((t) => map.set(t.category, (map.get(t.category) || 0) + t.amount));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [transactionsForMonth]);

  const incomeTotal = incomeData.reduce((sum, i) => sum + i.value, 0);
  const expenseTotal = expenseData.reduce((sum, i) => sum + i.value, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Financial Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <ul className="space-y-3">
            {transactionsForMonth.slice(0, 10).map((t) => (
              <li
                key={t.id}
                className="flex justify-between items-center last:border-0 pb-2"
              >
                <div>
                  <div className="font-medium">{t.category}</div>
                  <div className="text-sm text-gray-500">
                    {t.date} — {t.note || ""}
                  </div>
                </div>
                <div
                  className={`font-semibold ${
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {t.amount}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side - Charts */}
        <div className="grid grid-rows-2 gap-6">
          {/* Income Chart */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">Total Income</h3>
            <p className="text-2xl font-bold text-green-600 mb-4">
              {formatCurrency(incomeTotal)}
            </p>
            {incomeData.length === 0 ? (
              <p className="text-gray-500 text-sm">No income data for this month.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={incomeData}
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    label={(entry) =>
                      `${entry.name}: ${Math.round(((entry.value as number)  / incomeTotal) * 100)}%`
                    }
                  >
                    {incomeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => formatCurrency(val)} />
                  <Legend layout="horizontal" verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

           {/* Expense Chart  */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600 mb-4">
              {formatCurrency(expenseTotal)}
            </p>
            {expenseData.length === 0 ? (
              <p className="text-gray-500 text-sm">No expense data for this month.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={expenseData}
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    label={(entry) =>
                      `${entry.name}: ${Math.round(((entry.value as number)  / expenseTotal) * 100)}%`
                    }
                  >
                    {expenseData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => formatCurrency(val)} />
                  <Legend layout="horizontal" verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
