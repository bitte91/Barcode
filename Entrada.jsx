import { useState } from "react";
import BarcodeScanner from "../components/BarcodeScanner";
import db from "../hooks/useIndexedDb";

export default function Entrada() {
  const [produto, setProduto] = useState(null);
  const [qtd, setQtd] = useState(1);

  const handleScan = async (code) => {
    let prod = await db.products.get({ barcode: code });
    if (!prod) {
      const nome = prompt("Novo produto. Nome:");
      prod = { id: crypto.randomUUID(), name: nome, barcode: code, unit: "un" };
      await db.products.add(prod);
    }
    setProduto(prod);
  };

  const salvar = async () => {
    await db.movements.add({
      productId: produto.id,
      qty: Number(qtd),
      ts: new Date(),
      synced: false
    });
    alert("Movimentação salva offline ✔");
    setProduto(null);
    setQtd(1);
  };

  return (
    <div className="p-4 space-y-4">
      {!produto && <BarcodeScanner onDetected={handleScan} />}

      {produto && (
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">{produto.name}</h2>
          <input
            type="number"
            min="1"
            value={qtd}
            onChange={(e) => setQtd(e.target.value)}
            className="border p-2 rounded w-24"
          />
          <button
            onClick={salvar}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Registrar entrada
          </button>
        </div>
      )}
    </div>
  );
}
