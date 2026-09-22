'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTickets } from '@/hooks/useTickets'
import QueueTable from '@/components/QueueTable'

const getSystemName = (id: string) => {
  if (id === '22dd4848-57d6-4ae4-8369-ab8f55315039') return 'INOVAZI BPS';
  if (id === 'a7eba848-0529-4bc2-8bf1-9112df1c13e5') return 'ANTREAN BPS';
  if (!id || id === 'umum') return 'UMUM (INTERNAL)'; 
  return String(id).substring(0, 8);
}

export default function Dashboard() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [pin, setPin] = useState('')
  const [loginError, setLoginError] = useState('')

  const { data, loading, updateStatus } = useTickets()
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'active' | 'done'>('active')

  const [manualTitle, setManualTitle] = useState('')
  const [manualSystem, setManualSystem] = useState('umum') 
  const [isSubmittingManual, setIsSubmittingManual] = useState(false)

  useEffect(() => {
    setIsMounted(true)
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

  const handleAddManualTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualTitle) return
    setIsSubmittingManual(true)
    
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: manualTitle,
          description: 'Pekerjaan internal/manual yang ditambahkan oleh Developer.',
          priority: 'standard',
          system_id: manualSystem, // Teks "umum" ini akan diubah jadi null oleh API
          status: 'in_progress' 
        })
      })
      
      if (!res.ok) throw new Error('Data gagal disimpan ke server')
      
      setManualTitle('')
      window.location.reload() 
      
    } catch (error: any) {
      console.error('Fetch error:', error)
      alert('Terjadi kesalahan saat menyimpan data.')
    } finally {
      setIsSubmittingManual(false)
    }
  }

  if (!isMounted) return null

  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full text-center">
          <div className="bg-blue-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-5 shadow-lg shadow-blue-600/30">SB</div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Developer Login</h1>
          <p className="text-sm text-slate-500 mb-8">Masukkan PIN untuk mengakses SyncBoard</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <input 
              type="password" 
              placeholder="Masukkan PIN" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center tracking-[0.5em] font-bold p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors bg-slate-50 focus:bg-white"
            />
            {loginError && <p className="text-xs text-rose-500 font-bold">{loginError}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
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

  const displayedData = data?.filter(t => activeTab === 'active' ? t.status !== 'done' : t.status === 'done') || []

  return (
    <div className="h-screen bg-slate-50 font-sans flex flex-col overflow-hidden text-slate-800">
      <header className="shrink-0 bg-white border-b border-slate-200 px-6 sm:px-8 py-3.5 flex justify-between items-center shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg font-black text-xs shadow-md">SB</div>
          <h1 className="text-base font-extrabold text-slate-800 tracking-tight">SYNCBOARD <span className="font-semibold text-slate-400 hidden sm:inline">Only Developer</span></h1>
        </div>
        <button onClick={handleLogout} className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors bg-slate-100 hover:bg-rose-50 px-4 py-2 rounded-lg">Logout</button>
      </header>

      <main className="flex-1 w-full px-6 py-6 flex flex-col gap-6 overflow-hidden relative z-10">
        <div className="shrink-0 flex flex-col xl:flex-row gap-6">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Masuk</p>
              <p className="text-3xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">{totalTickets}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Menunggu</p>
              <p className="text-3xl font-black text-slate-800 group-hover:text-orange-500 transition-colors">{pendingTickets}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Selesai</p>
              <p className="text-3xl font-black text-slate-800 group-hover:text-emerald-500 transition-colors">{doneTickets}</p>
            </div>
          </div>

          <div className="w-full xl:w-[480px] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-800 px-5 py-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <span className="text-yellow-400">⚡</span> Live Activity
              </h3>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-center">
              <form onSubmit={handleAddManualTask} className="flex flex-col gap-3">
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Ketik task manual..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white"
                  required
                />
                <div className="flex gap-2">
                  <select
                    value={manualSystem}
                    onChange={(e) => setManualSystem(e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    <option value="umum">Sistem Umum</option>
                    <option value="22dd4848-57d6-4ae4-8369-ab8f55315039">INOVAZI BPS</option>
                    <option value="a7eba848-0529-4bc2-8bf1-9112df1c13e5">ANTREAN BPS</option>
                  </select>
                  <button
                    type="submit"
                    disabled={isSubmittingManual}
                    className="bg-slate-900 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-sm disabled:opacity-70 whitespace-nowrap"
                  >
                    {isSubmittingManual ? '...' : 'Kerjakan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="shrink-0 flex gap-2 border-b border-slate-200 p-2 bg-slate-50">
            <button 
              onClick={() => setActiveTab('active')} 
              className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'active' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
              Antrean Aktif
            </button>
            <button 
              onClick={() => setActiveTab('done')} 
              className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'done' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
              Riwayat Selesai
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <QueueTable 
              data={displayedData}
              loading={loading} 
              onUpdateStatus={updateStatus}
              onViewDetail={(ticket) => setSelectedTicket(ticket)} 
            />
          </div>
        </div>

        {selectedTicket && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
              <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 p-5 flex justify-between items-center z-10">
                <h3 className="font-extrabold text-lg text-slate-800">Detail Laporan</h3>
                <button onClick={() => setSelectedTicket(null)} className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-bold bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-lg transition-colors">Tutup</button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-2 items-center mb-2">
                   <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black rounded-md uppercase tracking-wider">
                     {getSystemName(selectedTicket.system_id)}
                   </span>
                   <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold rounded-md">
                     {new Date(selectedTicket.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                   </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Judul Laporan</p>
                  <p className="text-lg font-bold text-slate-800 leading-tight">{selectedTicket.title}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Deskripsi Lengkap</p>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {selectedTicket.description || 'Tidak ada deskripsi.'}
                  </div>
                </div>
                {selectedTicket.voice_url && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Voice Note</p>
                    <audio controls src={selectedTicket.voice_url} className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200" />
                  </div>
                )}
                {selectedTicket.screenshot_url && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Screenshot</p>
                    <a href={selectedTicket.screenshot_url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-slate-200 hover:border-blue-400 transition-colors">
                      <img src={selectedTicket.screenshot_url} alt="Screenshot Bug" className="w-full object-cover cursor-zoom-in hover:scale-[1.02] transition-transform duration-300" />
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