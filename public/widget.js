(function() {
  const scriptTag = document.currentScript || document.querySelector('script[src*="widget.js"]');
  const systemId = scriptTag?.getAttribute('data-system-id') || 'unknown';
  
  const baseUrl = 'https://syncboard-topaz.vercel.app';
  const apiUrl = `${baseUrl}/api/tickets`;

  function getSystemName(id) {
    if (id === '22dd4848-57d6-4ae4-8369-ab8f55315039') return 'INOVAZI BPS';
    if (id === 'a7eba848-0529-4bc2-8bf1-9112df1c13e5') return 'ANTREAN BPS';
    return 'Sistem Umum';
  }

  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'sb-toggle';
  toggleBtn.innerHTML = '?';
  Object.assign(toggleBtn.style, {
    position: 'fixed', bottom: '20px', right: '20px', width: '50px', height: '50px',
    borderRadius: '50%', backgroundColor: '#2563eb', color: 'white',
    border: 'none', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(37,99,235,0.4)', zIndex: '999999', transition: 'all 0.3s ease'
  });

  const modalContainer = document.createElement('div');
  Object.assign(modalContainer.style, {
    position: 'fixed', bottom: '80px', right: '20px', width: '340px',
    backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    zIndex: '999999', display: 'none', flexDirection: 'column', overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif', border: '1px solid #e2e8f0'
  });

  modalContainer.innerHTML = `
    <div style="background-color: #1e293b; color: #f8fafc; padding: 6px 10px; font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
      <span style="color: #60a5fa; flex-shrink: 0;">⚡ LIVE:</span>
      <marquee id="sb-marquee-text" scrollamount="4" style="flex-1;">Memuat aktivitas developer...</marquee>
    </div>
    <div style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex;">
      <button id="sb-tab-form" style="flex: 1; padding: 12px 0; border: none; background: white; color: #2563eb; font-weight: bold; font-size: 13px; border-bottom: 2px solid #2563eb; cursor: pointer;">Kirim Laporan</button>
      <button id="sb-tab-history" style="flex: 1; padding: 12px 0; border: none; background: transparent; color: #64748b; font-weight: bold; font-size: 13px; border-bottom: 2px solid transparent; cursor: pointer;">Riwayat (${getSystemName(systemId)})</button>
    </div>
    <div style="position: relative; height: 380px; overflow: hidden;">
      <div id="sb-content-form" style="position: absolute; inset: 0; padding: 16px; overflow-y: auto; display: block;">
        <input type="text" id="sb-title" placeholder="Judul Kendala (Misal: Tombol cetak error)" style="width: 100%; padding: 10px; margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; font-size: 13px;">
        <textarea id="sb-desc" placeholder="Jelaskan detail kendala..." style="width: 100%; padding: 10px; margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 6px; height: 80px; resize: none; box-sizing: border-box; font-size: 13px;"></textarea>
        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
          <select id="sb-priority" style="flex: 1; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px;">
            <option value="standard">Standard</option>
            <option value="urgent">Urgent (Darurat)</option>
          </select>
        </div>
        <button id="sb-submit" style="width: 100%; padding: 12px; background-color: #2563eb; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s;">Kirim Laporan</button>
        <p id="sb-status" style="font-size: 12px; text-align: center; margin-top: 10px; font-weight: bold; display: none;"></p>
      </div>
      <div id="sb-content-history" style="position: absolute; inset: 0; padding: 16px; overflow-y: auto; display: none; background: #f8fafc;">
        <div id="sb-history-list" style="display: flex; flex-direction: column; gap: 10px;">
          <p style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 20px;">Memuat riwayat...</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(toggleBtn);
  document.body.appendChild(modalContainer);

  const tabForm = document.getElementById('sb-tab-form');
  const tabHistory = document.getElementById('sb-tab-history');
  const contentForm = document.getElementById('sb-content-form');
  const contentHistory = document.getElementById('sb-content-history');

  function switchTab(toForm) {
    if (toForm) {
      tabForm.style.color = '#2563eb'; tabForm.style.borderBottomColor = '#2563eb'; tabForm.style.background = 'white';
      tabHistory.style.color = '#64748b'; tabHistory.style.borderBottomColor = 'transparent'; tabHistory.style.background = 'transparent';
      contentForm.style.display = 'block'; contentHistory.style.display = 'none';
    } else {
      tabHistory.style.color = '#2563eb'; tabHistory.style.borderBottomColor = '#2563eb'; tabHistory.style.background = 'white';
      tabForm.style.color = '#64748b'; tabForm.style.borderBottomColor = 'transparent'; tabForm.style.background = 'transparent';
      contentForm.style.display = 'none'; contentHistory.style.display = 'block';
    }
  }

  tabForm.onclick = () => switchTab(true);
  tabHistory.onclick = () => switchTab(false);

  async function fetchMarquee() {
    try {
      const res = await fetch(`${apiUrl}?marquee=true`);
      const { data } = await res.json();
      const marqueeEl = document.getElementById('sb-marquee-text');
      
      if (data && data.length > 0) {
        const textArr = data.map(t => `Sedang memperbaiki [${t.title}] di [${getSystemName(t.system_id)}]`);
        marqueeEl.innerText = textArr.join('  •  ');
      } else {
        marqueeEl.innerText = 'Semua sistem aman. Tidak ada perbaikan aktif.';
      }
    } catch (e) {}
  }

  async function fetchHistory() {
    try {
      const listEl = document.getElementById('sb-history-list');
      listEl.innerHTML = '<p style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 20px;">Memuat riwayat...</p>';
      
      const res = await fetch(`${apiUrl}?system_id=${systemId}`);
      const { data } = await res.json();
      
      if (!data || data.length === 0) {
        listEl.innerHTML = '<p style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 20px;">Belum ada laporan dari sistem ini.</p>';
        return;
      }

      listEl.innerHTML = data.map(item => {
        let statusBadge = '';
        if (item.status === 'pending') statusBadge = '<span style="background: #fff7ed; color: #ea580c; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid #ffedd5;">Menunggu</span>';
        else if (item.status === 'in_progress') statusBadge = '<span style="background: #eff6ff; color: #2563eb; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid #dbeafe;">Dikerjakan Developer</span>';
        else statusBadge = '<span style="background: #f0fdf4; color: #16a34a; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid #dcfce7;">Selesai Tuntas</span>';

        const date = new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

        return `
          <div style="background: white; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
              <h4 style="margin: 0; font-size: 12px; color: #1e293b; line-height: 1.4;">${item.title}</h4>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 10px; color: #94a3b8;">${date}</span>
              ${statusBadge}
            </div>
          </div>
        `;
      }).join('');
    } catch (e) {}
  }

  toggleBtn.onclick = () => {
    if (modalContainer.style.display === 'none') {
      modalContainer.style.display = 'flex';
      toggleBtn.innerHTML = '×';
      toggleBtn.style.backgroundColor = '#ef4444';
      fetchMarquee();
      fetchHistory();
    } else {
      modalContainer.style.display = 'none';
      toggleBtn.innerHTML = '?';
      toggleBtn.style.backgroundColor = '#2563eb';
    }
  };

  document.getElementById('sb-submit').onclick = async () => {
    const title = document.getElementById('sb-title').value;
    const desc = document.getElementById('sb-desc').value;
    const priority = document.getElementById('sb-priority').value;
    const statusEl = document.getElementById('sb-status');

    if (!title || !desc) {
      statusEl.style.display = 'block';
      statusEl.style.color = '#ef4444';
      statusEl.innerText = 'Judul dan Deskripsi wajib diisi!';
      return;
    }

    const btn = document.getElementById('sb-submit');
    btn.innerText = 'Mengirim...';
    btn.disabled = true;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: desc, priority, system_id: systemId })
      });

      if (response.ok) {
        statusEl.style.display = 'block';
        statusEl.style.color = '#10b981';
        statusEl.innerText = 'Laporan berhasil dikirim!';
        document.getElementById('sb-title').value = '';
        document.getElementById('sb-desc').value = '';
        
        setTimeout(() => {
          statusEl.style.display = 'none';
          btn.innerText = 'Kirim Laporan';
          btn.disabled = false;
          switchTab(false); 
          fetchHistory();
        }, 1500);
      }
    } catch (error) {
      statusEl.style.display = 'block';
      statusEl.style.color = '#ef4444';
      statusEl.innerText = 'Gagal mengirim. Coba lagi.';
      btn.innerText = 'Kirim Laporan';
      btn.disabled = false;
    }
  };
})();