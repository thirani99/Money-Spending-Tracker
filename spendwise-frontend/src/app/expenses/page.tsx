"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api"; 

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export default function ExpenseForm() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  //Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses/get");
      setExpenses(res.data);
      console.log("Fetched expenses:", res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
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
        const response = await api.put(`/expenses/put/${editingId}`, {
          title,
          amount: Number(amount),
          category,
        });
        console.log("Expense updated:", response.data);
        alert("Expense updated successfully!");
      } else {
        // Add new 
        const response = await api.post("/expenses/post", {
          title,
          amount: Number(amount),
          category,
        });
        console.log("Expense added:", response.data);
        alert("Expense saved successfully!");
      }

      // Reset form
      setTitle("");
      setAmount("");
      setCategory("");
      setEditingId(null);

      // Refresh list
      fetchExpenses();
    } catch (error) {
      console.error("Error saving/updating expense:", error);
      alert("Failed to save/update expense");
    }
  };

  

  // Delete 
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/expenses/delete/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  //Edit expense — fill form only
  const handleEdit = (expense: Expense) => {
    setTitle(expense.title);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setEditingId(expense._id);
  };

  return (
    <main className="flex justify-center items-start h-screen bg-gray-50 p-6 gap-8">
      {/* Expenses List Section */}
      <div className="w-2/3">
        <h2 className="text-xl font-bold mb-4">Expenses List</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id} className="text-center">
                  <td className="border px-4 py-2">{expense.title}</td>
                  <td className="border px-4 py-2">{expense.amount}</td>
                  <td className="border px-4 py-2">{expense.category}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={4} className="border px-4 py-2">
                    No expenses added yet.
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
          className="p-6 border rounded shadow-md bg-white"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">
            {editingId ? "Edit Expense" : "Add Expense"}
          </h1>

          <input
            type="text"
            placeholder="Title"
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
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="shopping">Shopping</option>
            <option value="bills">Bills</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>

          <button
            type="submit"
            className={`w-full text-white p-2 rounded transition ${
              editingId
                ? "bg-green-600 hover:bg-green-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {editingId ? "Update" : "Submit"}
          </button>
        </form>
      </div>
    </main>
  );
}
