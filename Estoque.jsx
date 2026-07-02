import { useEffect, useState } from "react";
import db from "../hooks/useIndexedDb";

export default function Estoque() {
  const [movs, setMovs] = useState([]);

  useEffect(() => {
    const sub = db.movements.toCollection().reverse().each(m => {
      setMovs(prev => [...prev, m]);
    });
    return () => sub; // unsubscribe Dexie
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Movimentações</h1>
      <ul className="space-y-2">
        {movs.map(m => (
          <li key={m.id} className="border p-2 rounded">
            ID Prod: {m.productId} — Qtd: {m.qty} — {new Date(m.ts).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
