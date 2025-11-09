import UserManagement from "../../components/admin/UserManagement";
import ProductManagement from "../../components/admin/ProductManagement";
import MaterialManagement from "../../components/admin/MaterialManagement";
import OrderManagement from "../../components/admin/OrderManagement";

const AdminDashboard = ({ user, data }) => {
  //   const [activeTab, setActiveTab] = useState("orders");

  //   const tabs = [
  //     {
  //       id: "orders",
  //       label: "Kelola Pesanan",
  //       icon: "📋",
  //       count: data.orders.length,
  //     },
  //     {
  //       id: "projects",
  //       label: "Monitor Proyek",
  //       icon: "🏗️",
  //       count: data.projects.length,
  //     },
  //     { id: "users", label: "Kelola User", icon: "👥", count: data.users.length },
  //     {
  //       id: "products",
  //       label: "Kelola Produk",
  //       icon: "📦",
  //       count: data.products.length,
  //     },
  //     {
  //       id: "materials",
  //       label: "Kelola Material",
  //       icon: "🧱",
  //       count: (data.materials || []).length,
  //     },
  //     {
  //       id: "material_requests",
  //       label: "Permintaan Material",
  //       icon: "📨",
  //       count: (materialRequests || []).length,
  //     },
  //     {
  //       id: "stock_report",
  //       label: "Laporan Stok",
  //       icon: "📊",
  //       count: (materialTransactions || []).length,
  //     },
  //   ];

  //   const renderActiveTab = () => {
  //     switch (activeTab) {
  //       case "orders":
  //         return (
  //           <OrderManagement orders={data.orders} onUpdateOrder={onUpdateOrder} />
  //         );
  //       case "projects":
  //         return (
  //           <ProjectMonitoring
  //             projects={data.projects}
  //             orders={data.orders}
  //             users={data.users}
  //             onAddProject={onAddProject}
  //             onUpdateProject={onUpdateProject}
  //           />
  //         );
  //       case "users":
  //         return (
  //           <UserManagement
  //             users={data.users}
  //             onAddUser={onAddUser}
  //             onUpdateUser={onUpdateUser}
  //             onDeleteUser={onDeleteUser}
  //           />
  //         );
  //       case "products":
  //         return (
  //           <ProductManagement
  //             products={data.products}
  //             onAddProduct={onAddProduct}
  //             onUpdateProduct={onUpdateProduct}
  //             onDeleteProduct={onDeleteProduct}
  //           />
  //         );
  //       case "materials":
  //         return (
  //           <MaterialManagement
  //             materials={data.materials || []}
  //             onAddMaterial={onAddMaterial}
  //             onUpdateMaterial={onUpdateMaterial}
  //             onDeleteMaterial={onDeleteMaterial}
  //           />
  //         );
  //       case "material_requests":
  //         return (
  //           <div>
  //             <h3 className="text-lg font-medium mb-4">
  //               Permintaan Material Masuk
  //             </h3>
  //             {materialRequests.length === 0 ? (
  //               <div className="text-gray-500">
  //                 Belum ada permintaan material.
  //               </div>
  //             ) : (
  //               <div className="space-y-3">
  //                 {materialRequests.map((req) => (
  //                   <div key={req.id} className="border rounded p-3 bg-white">
  //                     <div className="flex justify-between">
  //                       <div>
  //                         <div className="font-medium">
  //                           {req.projectName} • {req.requesterName}
  //                         </div>
  //                         <div className="text-sm text-gray-600">
  //                           Diajukan: {new Date(req.createdAt).toLocaleString()}
  //                         </div>
  //                         <div className="text-sm text-gray-700 mt-2">
  //                           Alasan: {req.requestReason}
  //                         </div>
  //                         <div className="text-sm text-gray-700 mt-2">
  //                           Urgensi: {req.urgencyLevel}
  //                         </div>
  //                       </div>
  //                       <div className="text-right">
  //                         <div className="text-sm">
  //                           Status:{" "}
  //                           <span className="font-medium">{req.status}</span>
  //                         </div>
  //                         <div className="text-sm text-gray-600">
  //                           Total estimasi: Rp{" "}
  //                           {Number(req.total || 0).toLocaleString()}
  //                         </div>
  //                       </div>
  //                     </div>
  //                     <div className="mt-3">
  //                       {(req.items || []).map((it) => (
  //                         <div
  //                           key={it.id}
  //                           className="flex justify-between text-sm border-b py-2"
  //                         >
  //                           <div>
  //                             <div className="font-medium">
  //                               {it.product?.name || it.name}
  //                             </div>
  //                             <div className="text-gray-500">{it.notes}</div>
  //                           </div>
  //                           <div className="text-right">
  //                             {it.quantity || it.qty}{" "}
  //                             {it.product?.unit || it.unit || ""}
  //                           </div>
  //                         </div>
  //                       ))}
  //                     </div>
  //                     <div className="mt-3 flex gap-2 justify-end">
  //                       <button
  //                         className="px-3 py-1 bg-green-600 text-white rounded"
  //                         onClick={() =>
  //                           onUpdateMaterialRequest &&
  //                           onUpdateMaterialRequest({
  //                             ...req,
  //                             status: "approved",
  //                             approvedAt: new Date().toISOString(),
  //                           })
  //                         }
  //                       >
  //                         Setujui & Penuhi
  //                       </button>
  //                       <button
  //                         className="px-3 py-1 bg-red-600 text-white rounded"
  //                         onClick={() =>
  //                           onUpdateMaterialRequest &&
  //                           onUpdateMaterialRequest({
  //                             ...req,
  //                             status: "rejected",
  //                             rejectedAt: new Date().toISOString(),
  //                           })
  //                         }
  //                       >
  //                         Tolak
  //                       </button>
  //                     </div>
  //                   </div>
  //                 ))}
  //               </div>
  //             )}
  //           </div>
  //         );
  //       case "stock_report":
  //         return (
  //           <div>
  //             <h3 className="text-lg font-medium mb-4">
  //               Laporan Keluar-Masuk Material
  //             </h3>
  //             {!materialTransactions || materialTransactions.length === 0 ? (
  //               <div className="text-gray-500">Belum ada transaksi material.</div>
  //             ) : (
  //               <div className="overflow-x-auto bg-white rounded border">
  //                 <table className="w-full text-sm">
  //                   <thead className="bg-gray-100">
  //                     <tr>
  //                       <th className="px-4 py-2 text-left">Waktu</th>
  //                       <th className="px-4 py-2 text-left">Material</th>
  //                       <th className="px-4 py-2 text-left">Tipe</th>
  //                       <th className="px-4 py-2 text-right">Jumlah</th>
  //                       <th className="px-4 py-2 text-right">Sebelum</th>
  //                       <th className="px-4 py-2 text-right">Sesudah</th>
  //                       <th className="px-4 py-2 text-left">Terkait</th>
  //                       <th className="px-4 py-2 text-left">Oleh</th>
  //                     </tr>
  //                   </thead>
  //                   <tbody>
  //                     {materialTransactions.map((tx) => {
  //                       const mat =
  //                         data.materials.find((m) => m.id === tx.materialId) ||
  //                         {};
  //                       const userName =
  //                         data.users.find((u) => u.id === tx.userId)?.name || "-";
  //                       return (
  //                         <tr key={tx.id} className="border-t">
  //                           <td className="px-4 py-2">
  //                             {new Date(tx.timestamp).toLocaleString()}
  //                           </td>
  //                           <td className="px-4 py-2">
  //                             {mat.name || tx.materialId}
  //                           </td>
  //                           <td className="px-4 py-2">
  //                             {tx.type === "in" ? "Masuk" : "Keluar"}
  //                           </td>
  //                           <td className="px-4 py-2 text-right">{tx.qty}</td>
  //                           <td className="px-4 py-2 text-right">
  //                             {tx.prevStock}
  //                           </td>
  //                           <td className="px-4 py-2 text-right">
  //                             {tx.newStock}
  //                           </td>
  //                           <td className="px-4 py-2">
  //                             {tx.relatedRequestId
  //                               ? `Req #${tx.relatedRequestId}`
  //                               : "-"}
  //                           </td>
  //                           <td className="px-4 py-2">{userName}</td>
  //                         </tr>
  //                       );
  //                     })}
  //                   </tbody>
  //                 </table>
  //               </div>
  //             )}
  //           </div>
  //         );
  //       default:
  //         return (
  //           <OrderManagement orders={data.orders} onUpdateOrder={onUpdateOrder} />
  //         );
  //     }
  //   };

  // const getTabLabel = (tab) => {
  //   return (
  //     <div className="flex items-center gap-2">
  //       <span className="text-lg">{tab.icon}</span>
  //       <span className="hidden sm:inline">{tab.label}</span>
  //       {tab.count > 0 && (
  //         <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
  //           {tab.count}
  //         </span>
  //       )}
  //     </div>
  //   );
  // };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Dashboard Administrator
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Selamat datang, ! Panel kontrol sistem manajemen proyek
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📋</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {/* {data.orders.length} */}
                </h3>
                <p className="text-gray-600 text-sm">Total Pesanan</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className="text-3xl mr-4">👥</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {/* {data.users.length} */}
                </h3>
                <p className="text-gray-600 text-sm">Total User</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📦</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {/* {data.products.length} */}
                </h3>
                <p className="text-gray-600 text-sm">Total Produk</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🏗️</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {/* {data.projects.length} */}
                </h3>
                <p className="text-gray-600 text-sm">Proyek Aktif</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex">
              {/* {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 min-w-0 px-4 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {getTabLabel(tab)}
                </button>
              ))} */}
            </nav>
          </div>

          {/* <div className="p-6">{renderActiveTab()}</div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
