export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Overview Hari Ini</h1>
        <p className="text-slate-500 text-sm mt-1">Ringkasan status tiket dan antrean.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Masuk</h3>
          <p className="text-4xl font-black text-blue-600 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Menunggu</h3>
          <p className="text-4xl font-black text-orange-500 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Selesai</h3>
          <p className="text-4xl font-black text-green-600 mt-2">0</p>
        </div>
      </div>
    </div>
  )
}