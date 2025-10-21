"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api"; 

interface Income {
  _id: string;
  income_source: string;
  amount: number;
  category: string;
  date: Date;
}

export default function IncomeForm() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [income, setIncome] = useState<Income[]>([]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value); // already "2025-10-25"
  };

  //Fetch all expenses
  const fetchIncome = async () => {
    try {
      const res = await api.get("/income/get");
      setIncome(res.data);
      console.log("Fetched expenses:", res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  //Add or Update expense
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !amount || !category) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        const response = await api.put(`/income/put/${editingId}`, {
          income_source:title,
          amount: Number(amount),
          category,
          date,
        });
        console.log("Expense updated:", response.data);
        alert("Expense updated successfully!");
      } else {
        // Add new 
        const response = await api.post("/income/post", {
          income_source:title,
          amount: Number(amount),
          category,
          date,
        });
        console.log("Expense added:", response.data);
        alert("Expense saved successfully!");
      }

      // Reset form
      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
      setEditingId(null);

      // Refresh list
      fetchIncome();
    } catch (error) {
      console.error("Error saving/updating expense:", error);
      alert("Failed to save/update expense");
    }
  };

  

  // Delete 
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/income/delete/${id}`);
      fetchIncome();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  //Edit expense — fill form only
  const handleEdit = (income: Income) => {
    setTitle(income.income_source);
    setAmount(String(income.amount));
    setCategory(income.category);
    setEditingId(income._id);
    
    const formattedDate = new Date(income.date).toISOString().split("T")[0];
    setDate(formattedDate);
  };

  return (
    <main className="flex justify-center items-start h-screen bg-gray-50 p-6 gap-8">
      {/* Expenses List Section */}
      <div className="w-2/3">
        <h2 className="text-xl font-bold mb-4">Income List</h2>
        <div className="bg-white shadow rounded-2xl p-6">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Income Source</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {income.map((income) => (
                <tr key={income._id} className="text-center">
                  <td className="border px-4 py-2">{income.income_source}</td>
                  <td className="border px-4 py-2">{income.amount}</td>
                  <td className="border px-4 py-2">{income.category}</td>
                  <td className="border px-4 py-2">{new Date(income.date).toISOString().split("T")[0]}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(income)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(income._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {income.length === 0 && (
                <tr>
                  <td colSpan={4} className="border px-4 py-2">
                    No Incomes added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Form */}
      <div className="w-1/3">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-2xl p-6"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">
            {editingId ? "Edit Income" : "Add Income"}
          </h1>

          <input
            type="text"
            placeholder="Income Source"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          >
            <option value="">Select Category</option>
            <option value="salary">Salary</option>
            <option value="invesment">Invesment</option>
            <option value="freelance project">Freelance Projects</option>
          </select>

          <input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />

          <button
            type="submit"
            className={`w-full text-white p-2 rounded transition ${
              editingId
                ? "bg-green-600 hover:bg-green-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {editingId ? "Update Income" : "Add Income"}
          </button>
        </form>
      </div>
    </main>
  );
}