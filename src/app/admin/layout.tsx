export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* TOP HEADER SEDERHANA */}
      <header className="bg-white border-b h-16 flex items-center px-6 lg:px-10 sticky top-0 z-10 shadow-sm">
        {/* Logo & Judul */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg font-black text-xs">
            SB
          </div>
          <h1 className="font-black text-xl text-gray-800 tracking-tight">SYNCBOARD Only Developer</h1>
        </div>
      </header>

      {/* KONTEN UTAMA */}
      <div className="flex-1 overflow-auto w-full">
        {children}
      </div>
    </div>
  )
}