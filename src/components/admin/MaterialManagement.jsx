import React, { useState } from "react";

const MaterialManagement = ({ materials = [], onAddMaterial, onUpdateMaterial, onDeleteMaterial }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", unit: "unit", price: "", stock: "", description: "" });

  const reset = () => {
    setEditing(null);
    setForm({ name: "", category: "", unit: "unit", price: "", stock: "", description: "" });
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, price: parseFloat(form.price) || 0, stock: parseInt(form.stock) || 0 };
    if (editing) {
      onUpdateMaterial && onUpdateMaterial({ ...editing, ...payload });
    } else {
      onAddMaterial && onAddMaterial(payload);
    }
    reset();
  };

  const adjustStock = (m, delta) => {
    if (!onUpdateMaterial) return;
    const newStock = Math.max(0, (Number(m.stock) || 0) + Number(delta || 0));
    onUpdateMaterial({ ...m, stock: newStock });
  };

  const formatPrice = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl sm:text-2xl font-bold">Kelola Material</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setShowModal(true)}>+ Tambah Material</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Nama</th>
              <th className="px-3 py-2 text-left">Kategori</th>
              <th className="px-3 py-2 text-left">Satuan</th>
              <th className="px-3 py-2 text-left">Harga</th>
              <th className="px-3 py-2 text-left">Stok</th>
              <th className="px-3 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {materials.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">{m.name}<div className="text-xs text-gray-500">{m.description}</div></td>
                <td className="px-3 py-2">{m.category}</td>
                <td className="px-3 py-2">{m.unit}</td>
                <td className="px-3 py-2">{formatPrice(m.price || 0)}</td>
                <td className="px-3 py-2">{m.stock || 0}</td>
                <td className="px-3 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs" onClick={() => { const v = prompt('Kurangi stok (qty):', '1'); const n = Number(v); if (!isNaN(n) && n>0) adjustStock(m, -n); }}>-</button>
                    <button className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs" onClick={() => { const v = prompt('Tambah stok (qty):', '1'); const n = Number(v); if (!isNaN(n) && n>0) adjustStock(m, n); }}>+</button>
                    <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs" onClick={() => { setEditing(m); setForm({ name: m.name, category: m.category, unit: m.unit, price: String(m.price || 0), stock: String(m.stock || 0), description: m.description || '' }); setShowModal(true); }}>Edit</button>
                    <button className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs" onClick={() => { if(window.confirm('Hapus material ini?')) onDeleteMaterial && onDeleteMaterial(m.id); }}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">{editing ? 'Edit Material' : 'Tambah Material'}</h4>
              <button className="text-gray-500" onClick={reset}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input required placeholder="Nama material" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full px-3 py-2 border rounded" />
                <input placeholder="Kategori" value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})} className="w-full px-3 py-2 border rounded" />
                <input placeholder="Satuan (unit)" value={form.unit} onChange={(e)=>setForm({...form, unit:e.target.value})} className="w-full px-3 py-2 border rounded" />
                <input type="number" placeholder="Harga" value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})} className="w-full px-3 py-2 border rounded" />
                <input type="number" placeholder="Stok" value={form.stock} onChange={(e)=>setForm({...form, stock:e.target.value})} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <textarea placeholder="Deskripsi" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} className="w-full px-3 py-2 border rounded" rows={3} />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 border rounded" onClick={reset}>Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editing ? 'Simpan' : 'Tambah'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialManagement;
