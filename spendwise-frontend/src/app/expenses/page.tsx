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
  const [date,setDate] = useState("");
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
      setDate("");
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

    const formattedDate = new Date(expense.date).toISOString().split("T")[0];
    setDate(formattedDate);
  };

  return (
    <main className="flex justify-center items-start h-screen bg-gray-50 p-6 gap-8">
      {/* Expenses List Section */}
      <div className="w-2/3">
        <h2 className="text-xl font-bold mb-4">Expenses List</h2>
        <div className="bg-white shadow rounded-2xl p-6">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id} className="text-center">
                  <td className="border px-4 py-2">{expense.title}</td>
                  <td className="border px-4 py-2">{expense.amount}</td>
                  <td className="border px-4 py-2">{expense.category}</td>
                  <td className="border px-4 py-2">{new Date(expense.date).toISOString().split("T")[0]}</td>
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
          className="bg-white shadow rounded-2xl p-6"
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
            {editingId ? "Update" : "Submit"}
          </button>
        </form>
      </div>
    </main>
  );
}



// "use client";
// import { useState, useEffect } from "react";
// import { api } from "@/lib/api";

// interface Expense {
//   _id: string;
//   title: string;
//   amount: number;
//   category: string;
//   date: string;
// }

// export default function ExpenseForm() {
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");
//   const [category, setCategory] = useState("");
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [expenses, setExpenses] = useState<Expense[]>([]);

//   // Fetch all expenses
//   const fetchExpenses = async () => {
//     try {
//       const res = await api.get("/expenses/get");
//       setExpenses(res.data);
//     } catch (err) {
//       console.error("Error fetching expenses:", err);
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   // Add or Update expense
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!title || !amount || !category) {
//       alert("Please fill all fields");
//       return;
//     }

//     try {
//       if (editingId) {
//         await api.put(`/expenses/put/${editingId}`, {
//           title,
//           amount: Number(amount),
//           category,
//         });
//         alert("Expense updated successfully!");
//       } else {
//         await api.post("/expenses/post", {
//           title,
//           amount: Number(amount),
//           category,
//         });
//         alert("Expense saved successfully!");
//       }

//       // Reset form
//       setTitle("");
//       setAmount("");
//       setCategory("");
//       setEditingId(null);

//       // Refresh list
//       fetchExpenses();
//     } catch (error) {
//       console.error("Error saving/updating expense:", error);
//       alert("Failed to save/update expense");
//     }
//   };

//   // Delete expense
//   const handleDelete = async (id: string) => {
//     try {
//       await api.delete(`/expenses/delete/${id}`);
//       fetchExpenses();
//     } catch (err) {
//       console.error("Error deleting expense:", err);
//     }
//   };

//   // Edit expense
//   const handleEdit = (expense: Expense) => {
//     setTitle(expense.title);
//     setAmount(String(expense.amount));
//     setCategory(expense.category);
//     setEditingId(expense._id);
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* ===== Expenses List ===== */}
//         <section className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
//           <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center justify-between">
//             Expenses
//             <span className="text-sm text-gray-500 font-normal">
//               {expenses.length} items
//             </span>
//           </h2>

//           <div className="overflow-hidden rounded-xl border border-gray-200">
//             <table className="min-w-full text-sm text-gray-700">
//               <thead className="bg-gray-100 text-gray-600">
//                 <tr>
//                   <th className="px-4 py-3 text-left font-medium">Title</th>
//                   <th className="px-4 py-3 text-left font-medium">Amount</th>
//                   <th className="px-4 py-3 text-left font-medium">Category</th>
//                   <th className="px-4 py-3 text-center font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {expenses.map((expense) => (
//                   <tr
//                     key={expense._id}
//                     className="hover:bg-gray-50 transition"
//                   >
//                     <td className="px-4 py-3">{expense.title}</td>
//                     <td className="px-4 py-3">Rs. {expense.amount}</td>
//                     <td className="px-4 py-3 capitalize">{expense.category}</td>
//                     <td className="px-4 py-3 flex justify-center gap-2">
//                       <button
//                         onClick={() => handleEdit(expense)}
//                         className="px-3 py-1 text-sm rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(expense._id)}
//                         className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {expenses.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={4}
//                       className="px-4 py-6 text-center text-gray-500"
//                     >
//                       No expenses added yet.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         {/* ===== Expense Form ===== */}
//         <section className="bg-white rounded-2xl shadow-md p-6">
//           <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
//             {editingId ? "Edit Expense" : "Add Expense"}
//           </h1>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
//             />

//             <input
//               type="number"
//               placeholder="Amount"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
//             />

//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
//             >
//               <option value="">Select Category</option>
//               <option value="food">Food</option>
//               <option value="transport">Transport</option>
//               <option value="shopping">Shopping</option>
//               <option value="bills">Bills</option>
//               <option value="entertainment">Entertainment</option>
//               <option value="other">Other</option>
//             </select>

//             <button
//               type="submit"
//               className={`w-full text-white py-2.5 rounded-lg font-medium transition ${
//                 editingId
//                   ? "bg-emerald-600 hover:bg-emerald-700"
//                   : "bg-indigo-600 hover:bg-indigo-700"
//               }`}
//             >
//               {editingId ? "Update Expense" : "Add Expense"}
//             </button>
//           </form>
//         </section>
//       </div>
//     </main>
//   );
// }
