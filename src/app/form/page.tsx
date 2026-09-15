'use client'

import { useState } from 'react'
import { supabase } from '@/app/lib/supabase'

export default function FormLaporanPage() {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('standard')
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatusMsg({ type: '', text: '' })

    try {
      // Masukkan data ke tabel 'tickets' di Supabase
      // Secara default status kita set 'pending' untuk antrean baru
      const { error } = await supabase
        .from('tickets')
        .insert([
          { 
            title, 
            priority,
            status: 'pending' 
          }
        ])

      if (error) throw error

      setStatusMsg({ type: 'success', text: 'Laporan berhasil dikirim! Silakan tunggu panggilan.' })
      setTitle('') // Reset form
      setPriority('standard')

      // Hilangkan pesan sukses setelah 5 detik
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000)

    } catch (error: any) {
      console.error('Error submitting form:', error)
      setStatusMsg({ type: 'error', text: 'Gagal mengirim laporan. Silakan coba lagi.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-blue-900">Kirim Laporan</h1>
          <p className="text-slate-500 text-sm mt-2">Silakan isi detail kendala Anda di bawah ini.</p>
        </div>
        
        {statusMsg.text && (
          <div className={`p-4 rounded-lg mb-6 text-sm font-semibold text-center ${statusMsg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-2">
              Deskripsi Kendala / Laporan
            </label>
            <textarea
              id="title"
              rows={3}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Printer di ruang rapat lantai 2 tidak bisa mencetak..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-bold text-slate-700 mb-2">
              Tingkat Prioritas
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            >
             <option value="slow">slow</option>
              <option value="standard">standard</option>
              <option value="urgent">urgent</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </>
            ) : (
              'Kirim Antrean Laporan'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}