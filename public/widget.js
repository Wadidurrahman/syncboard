(function() {
  const scriptTag = document.currentScript || document.querySelector('script[src*="widget.js"]');
  const systemId = scriptTag?.getAttribute('data-system-id') || 'unknown';
  
  const baseUrl = 'https://syncboard-topaz.vercel.app';
  const apiUrl = `${baseUrl}/api/tickets`;

  function getSystemName(id) {
    if (id === '22dd4848-57d6-4ae4-8369-ab8f55315039') return 'INOVAZI BPS';
    if (id === 'a7eba848-0529-4bc2-8bf1-9112df1c13e5') return 'ANTREAN BPS';
    return 'Sistem BPS';
  }

  // Tombol Trigger (?)
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'sb-toggle';
  toggleBtn.innerHTML = '?';
  Object.assign(toggleBtn.style, {
    position: 'fixed', bottom: '20px', right: '20px', width: '48px', height: '48px',
    borderRadius: '50%', backgroundColor: '#2563eb', color: 'white',
    border: 'none', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(37,99,235,0.3)', zIndex: '999999', transition: 'all 0.2s ease'
  });

  // Kontainer Modal Utama
  const modalContainer = document.createElement('div');
  Object.assign(modalContainer.style, {
    position: 'fixed', bottom: '80px', right: '20px', width: '380px',
    backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
    zIndex: '999999', display: 'none', flexDirection: 'column', overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif', border: '1px solid #e2e8f0'
  });

  modalContainer.innerHTML = `
    <!-- Marquee Bar -->
    <div style="background-color: #0f172a; color: #f8fafc; padding: 8px 12px; font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #1e293b;">
      <span style="color: #60a5fa; flex-shrink: 0; font-weight: 800;">⚡ LIVE:</span>
      <marquee id="sb-marquee-text" scrollamount="4" style="flex: 1;">Memuat aktivitas developer...</marquee>
    </div>

    <!-- Header Modal & Tabs -->
    <div style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; padding: 0 16px;">
      <div style="display: flex; gap: 4px; flex: 1;">
        <button id="sb-tab-form" style="padding: 12px 16px; border: none; background: transparent; color: #2563eb; font-weight: 700; font-size: 13px; border-bottom: 2px solid #2563eb; cursor: pointer;">Layanan Developer</button>
        <button id="sb-tab-history" style="padding: 12px 16px; border: none; background: transparent; color: #64748b; font-weight: 700; font-size: 13px; border-bottom: 2px solid transparent; cursor: pointer;">Riwayat</button>
      </div>
      <button id="sb-close" style="background: none; border: none; font-size: 18px; color: #94a3b8; cursor: pointer; padding: 4px;">&times;</button>
    </div>

    <!-- Konten Area -->
    <div style="position: relative; height: 440px; overflow: hidden; background: #ffffff;">
      
      <!-- TAB 1: FORM LAPORAN LENGKAP -->
      <div id="sb-content-form" style="position: absolute; inset: 0; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px;">
        <div>
          <label style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 6px;">Judul Kendala/Fitur</label>
          <input type="text" id="sb-title" placeholder="Contoh: Error saat cetak laporan" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; outline: none; box-sizing: border-box;">
        </div>

        <div>
          <label style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 6px;">Deskripsi Detail</label>
          <textarea id="sb-desc" placeholder="Jelaskan detail kendala atau permintaan Anda di sini..." style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; height: 90px; resize: none; font-size: 13px; outline: none; box-sizing: border-box;"></textarea>
        </div>

        <div>
          <label style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 6px;">Prioritas</label>
          <select id="sb-priority" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: white; outline: none; box-sizing: border-box;">
            <option value="standard">Standard (Biasa)</option>
            <option value="urgent">Urgent (Darurat)</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 6px;">Screenshot (Opsional)</label>
          <input type="file" id="sb-file" accept="image/*" style="width: 100%; font-size: 11px; color: #64748b; padding: 6px; border: 1px dashed #cbd5e1; border-radius: 8px; background: #f8fafc; box-sizing: border-box;">
        </div>

        <button id="sb-submit" style="width: 100%; padding: 12px; background-color: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; transition: background 0.2s; margin-top: 4px;">Kirim Laporan</button>
        <p id="sb-status" style="font-size: 12px; text-align: center; font-weight: 600; display: none; margin: 0;"></p>
      </div>

      <!-- TAB 2: RIWAYAT -->
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
  const closeBtn = document.getElementById('sb-close');

  function switchTab(toForm) {
    if (toForm) {
      tabForm.style.color = '#2563eb'; tabForm.style.borderBottomColor = '#2563eb';
      tabHistory.style.color = '#64748b'; tabHistory.style.borderBottomColor = 'transparent';
      contentForm.style.display = 'flex'; contentHistory.style.display = 'none';
    } else {
      tabHistory.style.color = '#2563eb'; tabHistory.style.borderBottomColor = '#2563eb';
      tabForm.style.color = '#64748b'; tabForm.style.borderBottomColor = 'transparent';
      contentForm.style.display = 'none'; contentHistory.style.display = 'flex';
    }
  }

  tabForm.onclick = () => switchTab(true);
  tabHistory.onclick = () => switchTab(false);
  closeBtn.onclick = () => { modalContainer.style.display = 'none'; };

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
        else if (item.status === 'in_progress') statusBadge = '<span style="background: #eff6ff; color: #2563eb; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid #dbeafe;">Dikerjakan</span>';
        else statusBadge = '<span style="background: #f0fdf4; color: #16a34a; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid #dcfce7;">Selesai</span>';

        const date = new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

        return `
          <div style="background: white; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
            <div style="font-weight: 700; font-size: 12px; color: #1e293b; margin-bottom: 4px;">${item.title}</div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 8px; line-height: 1.3;">${item.description || ''}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; pt-2;">
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
      fetchMarquee();
      fetchHistory();
    } else {
      modalContainer.style.display = 'none';
    }
  };

  document.getElementById('sb-submit').onclick = async () => {
    const title = document.getElementById('sb-title').value;
    const desc = document.getElementById('sb-desc').value;
    const priority = document.getElementById('sb-priority').value;
    const statusEl = document.getElementById('sb-status');
    const fileInput = document.getElementById('sb-file');

    if (!title || !desc) {
      statusEl.style.display = 'block';
      statusEl.style.color = '#ef4444';
      statusEl.innerText = 'Judul dan Deskripsi wajib diisi!';
      return;
    }

    const btn = document.getElementById('sb-submit');
    btn.innerText = 'Mengirim...';
    btn.disabled = true;

    let screenshot_url = null;

    // Jika user mengunggah file gambar
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      
      screenshot_url = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: desc, priority, system_id: systemId, screenshot_url })
      });

      if (response.ok) {
        statusEl.style.display = 'block';
        statusEl.style.color = '#10b981';
        statusEl.innerText = 'Laporan berhasil dikirim!';
        document.getElementById('sb-title').value = '';
        document.getElementById('sb-desc').value = '';
        fileInput.value = '';
        
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