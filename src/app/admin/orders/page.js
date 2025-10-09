// app/admin/orders/page.js
'use client'
import { useState } from 'react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'PT. Bangun Jaya',
      email: 'admin@bangunjaya.com',
      phone: '081234567890',
      service: 'Beton Readymix',
      quantity: '50 m³',
      status: 'Dalam Proses',
      date: '2024-01-15',
      deliveryDate: '2024-01-20',
      address: 'Jl. Kendari Raya No. 123, Kendari',
      amount: 25000000,
      notes: 'Pengiriman pagi hari'
    },
    {
      id: 'ORD-002',
      customer: 'CV. Konstruksi Prima',
      email: 'order@konstruksiprima.com',
      phone: '081298765432',
      service: 'Precast',
      quantity: '100 pcs',
      status: 'Selesai',
      date: '2024-01-14',
      deliveryDate: '2024-01-18',
      address: 'Jl. Industri No. 45, Kendari',
      amount: 45000000,
      notes: 'Sudah terkirim semua'
    },
    {
      id: 'ORD-003',
      customer: 'Toko Bangunan Sejahtera',
      email: 'sejahtera@gmail.com',
      phone: '081387654321',
      service: 'Split',
      quantity: '20 ton',
      status: 'Pending',
      date: '2024-01-13',
      deliveryDate: '2024-01-22',
      address: 'Jl. Pasar Baru No. 67, Kendari',
      amount: 8000000,
      notes: 'Menunggu konfirmasi alamat'
    },
    {
      id: 'ORD-004',
      customer: 'PT. Pembangunan Sultra',
      email: 'sultra@company.com',
      phone: '081456789123',
      service: 'Aspal',
      quantity: '30 ton',
      status: 'Dalam Proses',
      date: '2024-01-12',
      deliveryDate: '2024-01-25',
      address: 'Jl. Trans Sulawesi Km 15, Kendari',
      amount: 35000000,
      notes: 'Proyek jalan raya'
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = ['Semua', 'Pending', 'Dalam Proses', 'Selesai', 'Dibatalkan'];

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'Semua' || order.status === filterStatus;
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selesai':
        return 'bg-green-100 text-green-800';
      case 'Dalam Proses':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Dibatalkan':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setSelectedOrder(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kelola Pesanan</h1>
        <p className="mt-2 text-gray-600">Kelola semua pesanan pelanggan</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari pesanan atau pelanggan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Pesanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Layanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Pesan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-red-600 hover:text-red-900 mr-3"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Detail Pesanan {selectedOrder.id}</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Informasi Pelanggan</h4>
                  <p className="text-sm text-gray-600">Nama: {selectedOrder.customer}</p>
                  <p className="text-sm text-gray-600">Email: {selectedOrder.email}</p>
                  <p className="text-sm text-gray-600">Telepon: {selectedOrder.phone}</p>
                  <p className="text-sm text-gray-600">Alamat: {selectedOrder.address}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Detail Pesanan</h4>
                  <p className="text-sm text-gray-600">Layanan: {selectedOrder.service}</p>
                  <p className="text-sm text-gray-600">Jumlah: {selectedOrder.quantity}</p>
                  <p className="text-sm text-gray-600">Tanggal Pesan: {selectedOrder.date}</p>
                  <p className="text-sm text-gray-600">Tanggal Kirim: {selectedOrder.deliveryDate}</p>
                  <p className="text-sm text-gray-600">Total: {formatCurrency(selectedOrder.amount)}</p>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Catatan</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Update Status</h4>
                <div className="flex gap-2">
                  {['Pending', 'Dalam Proses', 'Selesai', 'Dibatalkan'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        selectedOrder.status === status 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    alert('Fitur print akan diimplementasikan');
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}