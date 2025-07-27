import { useState } from "react";
import { Upload } from "lucide-react";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ date: "", item: "", person: "", payer: "", amount: "" });
  const [files, setFiles] = useState([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addExpense = () => {
    if (!form.date || !form.item || !form.person || !form.payer || !form.amount) return;
    setExpenses([...expenses, { ...form, amount: parseFloat(form.amount) }]);
    setForm({ date: "", item: "", person: "", payer: "", amount: "" });
  };

  const handleFileChange = (e) => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPerson = total / 2;
  const totalsByPayer = expenses.reduce((acc, e) => {
    acc[e.payer] = (acc[e.payer] || 0) + e.amount;
    return acc;
  }, {});

  const balances = Object.entries(totalsByPayer).map(([payer, paid]) => ({
    payer,
    paid,
    balance: perPerson - paid
  }));

  const payerNames = Object.keys(totalsByPayer);
  const difference = Math.abs((totalsByPayer[payerNames[0]] || 0) - (totalsByPayer[payerNames[1]] || 0));
  const lowerPayer = payerNames[0] && (totalsByPayer[payerNames[0]] < totalsByPayer[payerNames[1]] ? payerNames[0] : payerNames[1]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">הוספת הוצאה חדשה</h2>
        <input name="date" value={form.date} onChange={handleChange} placeholder="תאריך" type="date" className="border rounded p-2 w-full mb-2" />
        <input name="item" value={form.item} onChange={handleChange} placeholder="עבור מה התשלום?" className="border rounded p-2 w-full mb-2" />
        <input name="person" value={form.person} onChange={handleChange} placeholder="עבור עידו/בן" className="border rounded p-2 w-full mb-2" />
        <input name="payer" value={form.payer} onChange={handleChange} placeholder="מי שילם? (ליאור / טל)" className="border rounded p-2 w-full mb-2" />
        <input name="amount" value={form.amount} onChange={handleChange} placeholder="סכום" type="number" className="border rounded p-2 w-full mb-4" />
        <button onClick={addExpense} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">הוסף הוצאה</button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">רשימת הוצאות</h2>
        {expenses.map((e, i) => (
          <div key={i} className="grid grid-cols-5 gap-2 border-b py-2 text-right">
            <div>{e.date}</div>
            <div>{e.item}</div>
            <div>{e.person}</div>
            <div>{e.payer}</div>
            <div>{e.amount.toFixed(2)} ש"ח</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-2">סיכום תשלומים</h2>
        {balances.map((b, i) => (
          <div key={i} className="flex justify-between border-b py-2 text-right">
            <span>{b.payer}</span>
            <span>שילם: {b.paid.toFixed(2)} ש"ח | צריך לשלם: {perPerson.toFixed(2)} ש"ח | {b.balance > 0 ? `חייב להשלים ${b.balance.toFixed(2)} ש"ח` : `מגיע לו החזר ${Math.abs(b.balance).toFixed(2)} ש"ח`}</span>
          </div>
        ))}
        {payerNames.length === 2 && (
          <div className="mt-4 text-green-600 font-bold text-right">
            {lowerPayer && `${lowerPayer} צריך להשלים תשלום של ${difference.toFixed(2)} ש"ח כדי לאזן`}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-2">צילומי חשבוניות</h2>
        <input type="file" multiple onChange={handleFileChange} className="mb-4" />
        <div className="space-y-2 text-right">
          {files.map((file, idx) => (
            <div key={idx} className="text-sm text-gray-700">
              📎 {file.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}