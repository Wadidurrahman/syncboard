'use client'

import { useState, useEffect } from 'react'
import { useTickets } from '@/hooks/useTickets'
import QueueTable from '@/components/QueueTable'

const getSystemName = (id: string) => {
  if (id === '22dd4848-57d6-4ae4-8369-ab8f55315039') return 'INOVAZI BPS';
  if (id === 'a7eba848-0529-4bc2-8bf1-9112df1c13e5') return 'ANTREAN BPS';
  return id ? String(id).substring(0, 8) : 'UMUM';
}

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [pin, setPin] = useState('')
  const [loginError, setLoginError] = useState('')

  const { data, loading, updateStatus } = useTickets()
  const [selectedTicket, setSelectedTicket] = useState<any>(null)

  useEffect(() => {
    if (sessionStorage.getItem('syncboard_admin_auth') === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === '123456') { 
      setIsLoggedIn(true)
      sessionStorage.setItem('syncboard_admin_auth', 'true')
      setLoginError('')
    } else {
      setLoginError('PIN Salah!')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    sessionStorage.removeItem('syncboard_admin_auth')
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-sm w-full text-center">
          <div className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl mx-auto mb-4">SB</div>
          <h1 className="text-xl font-black text-slate-800 mb-1">Developer Login</h1>
          <p className="text-xs text-slate-500 mb-6">Masukkan PIN untuk mengakses SyncBoard</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Masukkan PIN" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center tracking-[0.5em] font-bold p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
            {loginError && <p className="text-xs text-red-500 font-bold">{loginError}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
              Masuk
            </button>
          </form>
        </div>
      </div>
    )
  }

  const totalTickets = data?.length || 0
  const pendingTickets = data?.filter(t => t.status === 'pending').length || 0
  const doneTickets = data?.filter(t => t.status === 'done').length || 0

  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 relative">
      <div className="flex justify-between items-center">
        <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-700">Logout</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-black text-slate-400 tracking-wider mb-1">TOTAL MASUK</p>
          <p className="text-4xl md:text-5xl font-black text-blue-600">{totalTickets}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-black text-slate-400 tracking-wider mb-1">MENUNGGU</p>
          <p className="text-4xl md:text-5xl font-black text-orange-500">{pendingTickets}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-black text-slate-400 tracking-wider mb-1">SELESAI</p>
          <p className="text-4xl md:text-5xl font-black text-green-500">{doneTickets}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <QueueTable 
          data={data} 
          loading={loading} 
          onUpdateStatus={updateStatus}
          onViewDetail={(ticket) => setSelectedTicket(ticket)} 
        />
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center z-10">
              <h3 className="font-black text-lg text-slate-800">Detail Laporan</h3>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-700 font-bold bg-slate-100 px-3 py-1 rounded">Tutup</button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex gap-2 items-center mb-4">
                 <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-black rounded-md uppercase tracking-wider">
                   {getSystemName(selectedTicket.system_id)}
                 </span>
                 <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">
                   {new Date(selectedTicket.created_at).toLocaleString('id-ID')}
                 </span>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Judul Laporan</p>
                <p className="text-base font-bold text-slate-800">{selectedTicket.title}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deskripsi Lengkap</p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap">
                  {selectedTicket.description || 'Tidak ada deskripsi.'}
                </div>
              </div>

              {selectedTicket.voice_url && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Voice Note</p>
                  <audio controls src={selectedTicket.voice_url} className="w-full h-10" />
                </div>
              )}

              {selectedTicket.screenshot_url && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Screenshot</p>
                  <a href={selectedTicket.screenshot_url} target="_blank" rel="noreferrer">
                    <img src={selectedTicket.screenshot_url} alt="Screenshot Bug" className="w-full rounded-lg border border-slate-200 cursor-zoom-in hover:opacity-90 transition" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}