import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">הוספת הוצאה חדשה</h2>
          <Input name="date" value={form.date} onChange={handleChange} placeholder="תאריך" type="date" />
          <Input name="item" value={form.item} onChange={handleChange} placeholder="עבור מה התשלום?" />
          <Input name="person" value={form.person} onChange={handleChange} placeholder="עבור עידו/בן" />
          <Input name="payer" value={form.payer} onChange={handleChange} placeholder="מי שילם? (ליאור / טל)" />
          <Input name="amount" value={form.amount} onChange={handleChange} placeholder="סכום" type="number" />
          <Button onClick={addExpense}>הוסף הוצאה</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">רשימת הוצאות</h2>
          {expenses.map((e, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 border-b py-2">
              <div>{e.date}</div>
              <div>{e.item}</div>
              <div>{e.person}</div>
              <div>{e.payer}</div>
              <div>{e.amount.toFixed(2)} ש"ח</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-2">סיכום תשלומים</h2>
          {balances.map((b, i) => (
            <div key={i} className="flex justify-between border-b py-2">
              <span>{b.payer}</span>
              <span>שילם: {b.paid.toFixed(2)} ש"ח | צריך לשלם: {perPerson.toFixed(2)} ש"ח | {b.balance > 0 ? `חייב להשלים ${b.balance.toFixed(2)} ש"ח` : `מגיע לו החזר ${Math.abs(b.balance).toFixed(2)} ש"ח`}</span>
            </div>
          ))}
          {payerNames.length === 2 && (
            <div className="mt-4 text-green-600 font-bold">
              {lowerPayer && `${lowerPayer} צריך להשלים תשלום של ${difference.toFixed(2)} ש"ח כדי לאזן`}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-2">צילומי חשבוניות</h2>
          <Input type="file" multiple onChange={handleFileChange} className="mb-4" />
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div key={idx} className="text-sm text-gray-700">
                📎 {file.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}