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
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-300 max-w-sm w-full text-center">
          <div className="bg-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center font-black text-xl mx-auto mb-4">SB</div>
          <h1 className="text-xl font-bold text-slate-800 mb-1">Developer Login</h1>
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
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-300 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white px-2 py-1 rounded font-black text-sm">SB</div>
          <h1 className="text-lg font-bold text-slate-800">SYNCBOARD Only Developer</h1>
        </div>
        <button onClick={handleLogout} className="text-sm font-semibold text-red-500 hover:text-red-700">Logout</button>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-400 rounded-lg p-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">TOTAL MASUK</p>
            <p className="text-4xl md:text-5xl font-black text-blue-600">{totalTickets}</p>
          </div>
          <div className="bg-white border border-slate-400 rounded-lg p-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">MENUNGGU (PENDING)</p>
            <p className="text-4xl md:text-5xl font-black text-orange-500">{pendingTickets}</p>
          </div>
          <div className="bg-white border border-slate-400 rounded-lg p-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">SELESAI DIKERJAKAN</p>
            <p className="text-4xl md:text-5xl font-black text-green-500">{doneTickets}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Daftar Antrean Utama</h3>
          <div className="bg-white rounded-lg border border-slate-400 overflow-hidden">
            <QueueTable 
              data={data} 
              loading={loading} 
              onUpdateStatus={updateStatus}
              onViewDetail={(ticket) => setSelectedTicket(ticket)} 
            />
          </div>
        </div>

        {selectedTicket && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-300 shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-slate-300 p-4 flex justify-between items-center z-10">
                <h3 className="font-bold text-lg text-slate-800">Detail Laporan</h3>
                <button onClick={() => setSelectedTicket(null)} className="text-slate-500 hover:text-slate-800 font-semibold bg-slate-100 border border-slate-300 px-3 py-1 rounded">Tutup</button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex gap-2 items-center mb-4">
                   <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded uppercase tracking-wider">
                     {getSystemName(selectedTicket.system_id)}
                   </span>
                   <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold rounded">
                     {new Date(selectedTicket.created_at).toLocaleString('id-ID')}
                   </span>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Judul Laporan</p>
                  <p className="text-base font-semibold text-slate-800">{selectedTicket.title}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deskripsi Lengkap</p>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedTicket.description || 'Tidak ada deskripsi.'}
                  </div>
                </div>

                {selectedTicket.voice_url && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Voice Note</p>
                    <audio controls src={selectedTicket.voice_url} className="w-full h-10 rounded border border-slate-200" />
                  </div>
                )}

                {selectedTicket.screenshot_url && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Screenshot</p>
                    <a href={selectedTicket.screenshot_url} target="_blank" rel="noreferrer">
                      <img src={selectedTicket.screenshot_url} alt="Screenshot Bug" className="w-full rounded-lg border border-slate-300 cursor-zoom-in hover:opacity-90 transition" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}