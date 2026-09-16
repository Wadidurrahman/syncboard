(function() {
  const scriptTag = document.currentScript;
  const systemId = scriptTag.getAttribute('data-system-id') || '';
  
  const apiUrl = 'http://localhost:3000/api/tickets';
  const statusUrl = 'http://localhost:3000/api/tickets/status';

  const container = document.createElement('div');
  container.innerHTML = `
    <style>
      @keyframes sbPulse {
        0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
        70% { box-shadow: 0 0 0 12px rgba(37, 99, 235, 0); }
        100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
      }
      
      @keyframes sbFloat {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
        100% { transform: translateY(0px); }
      }

      .sb-btn { position: fixed; bottom: 25px; right: 25px; background: #2563eb; color: white; border: none; border-radius: 50%; width: 55px; height: 55px; cursor: pointer; font-size: 26px; font-weight: bold; z-index: 9999; display: flex; align-items: center; justify-content: center; transition: all 0.2s; animation: sbPulse 2s infinite; font-family: sans-serif; }
      .sb-btn:hover { background: #1d4ed8; transform: scale(1.05); }
      
      .sb-tooltip { position: fixed; bottom: 95px; right: 25px; background: white; padding: 12px 16px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: system-ui, sans-serif; font-size: 13px; color: #334155; font-weight: 500; z-index: 9998; animation: sbFloat 3s ease-in-out infinite; border: 1px solid #e2e8f0; pointer-events: none; width: 220px; line-height: 1.4; }
      .sb-tooltip::after { content: ''; position: absolute; bottom: -6px; right: 22px; width: 12px; height: 12px; background: white; transform: rotate(45deg); border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
      
      .sb-modal { display: none; position: fixed; bottom: 95px; right: 25px; width: 320px; background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 10000; border: 1px solid #e5e7eb; font-family: system-ui, sans-serif; overflow: hidden; }
      .sb-header { background: #f8fafc; padding: 15px; font-weight: 600; font-size: 15px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; color: #0f172a; }
      .sb-close { cursor: pointer; color: #64748b; font-size: 18px; line-height: 1; border: none; background: none; }
      .sb-body { padding: 15px; display: flex; flex-direction: column; gap: 12px; max-height: 70vh; overflow-y: auto; }
      
      .sb-input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; box-sizing: border-box; outline: none; transition: border 0.2s; }
      .sb-input:focus { border-color: #2563eb; }
      .sb-label { font-size: 12px; color: #475569; font-weight: 500; margin-bottom: -8px; }
      
      .sb-submit { background: #2563eb; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px; width: 100%; margin-top: 5px; transition: background 0.2s; }
      .sb-submit:disabled { background: #94a3b8; cursor: not-allowed; }
      
      .sb-status-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; text-align: center; }
      .sb-badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin: 10px 0; letter-spacing: 0.5px; }
      .sb-badge.pending { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
      .sb-badge.in_progress { background: #dbeafe; color: #1d4ed8; border: 1px solid #bfdbfe; }
      .sb-badge.done { background: #dcfce3; color: #166534; border: 1px solid #bbf7d0; }
      
      .sb-new-btn { background: white; color: #475569; border: 1px solid #cbd5e1; padding: 10px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; width: 100%; margin-top: 10px; }
      .sb-new-btn:hover { background: #f8fafc; }
    </style>
    
    <div id="sb-tooltip" class="sb-tooltip">Silahkan buat laporan jika ada bug atau update fitur</div>
    <button id="sb-toggle" class="sb-btn">?</button>
    
    <div id="sb-modal" class="sb-modal">
      <div class="sb-header">
        <span>Layanan Developer</span>
        <button id="sb-close" class="sb-close">✖</button>
      </div>
      
      <form id="sb-form" class="sb-body">
        <input type="text" name="title" placeholder="Judul (Misal: Tombol Cetak Error)" class="sb-input" required />
        <textarea name="description" placeholder="Jelaskan detail kendalanya..." class="sb-input" rows="3"></textarea>
        
        <label class="sb-label">Tingkat Prioritas</label>
        <select name="priority" class="sb-input">
          <option value="standard">Standard (Biasa)</option>
          <option value="urgent">Urgent (Darurat! Segera)</option>
          <option value="slow">Slow (Fitur Baru/Nanti)</option>
        </select>
        
        <label class="sb-label">Lampirkan Screenshot (Opsional)</label>
        <input type="file" name="screenshot" accept="image/*" class="sb-input" />

        <label class="sb-label">Lampirkan Voice Note (Opsional)</label>
        <input type="file" name="voice" accept="audio/*" class="sb-input" />
        
        <button type="submit" id="sb-submit" class="sb-submit">Kirim Laporan</button>
      </form>

      <div id="sb-tracker" class="sb-body" style="display: none;">
        <div class="sb-status-card">
          <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">Status Laporan Saat Ini</div>
          <strong id="sb-track-title" style="font-size: 14px; color: #0f172a; display: block;">Memuat...</strong>
          <span id="sb-track-badge" class="sb-badge pending">PENDING</span>
          <div id="sb-track-desc" style="font-size: 13px; color: #475569; margin-top: 5px; line-height: 1.4;"></div>
        </div>
        <button id="sb-btn-new" class="sb-new-btn">Buat Laporan Baru</button>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  const modal = document.getElementById('sb-modal');
  const toggle = document.getElementById('sb-toggle');
  const tooltip = document.getElementById('sb-tooltip');
  const form = document.getElementById('sb-form');
  const tracker = document.getElementById('sb-tracker');

  async function checkStatus(ticketId) {
    try {
      const res = await fetch(`${statusUrl}?id=${ticketId}`);
      const data = await res.json();
      
      if (data.success) {
        document.getElementById('sb-track-title').innerText = data.data.title;
        const badge = document.getElementById('sb-track-badge');
        badge.className = `sb-badge ${data.data.status}`;
        badge.innerText = data.data.status.replace('_', ' ');
        
        const desc = document.getElementById('sb-track-desc');
        if (data.data.status === 'pending') {
          desc.innerText = 'Laporan masuk antrean dan menunggu respon Developer.';
        } else if (data.data.status === 'in_progress') {
          desc.innerText = 'Developer sedang mengerjakan laporan/fitur ini.';
        } else if (data.data.status === 'done') {
          desc.innerText = 'Pembaruan telah diselesaikan oleh Developer!';
        }

        form.style.display = 'none';
        tracker.style.display = 'flex';
      } else {
        localStorage.removeItem('sb_ticket_id');
        form.style.display = 'flex';
        tracker.style.display = 'none';
      }
    } catch (err) {
      console.error(err);
    }
  }

  toggle.onclick = () => {
    const isHidden = modal.style.display === 'none' || modal.style.display === '';
    modal.style.display = isHidden ? 'block' : 'none';
    
    if (isHidden) {
      tooltip.style.display = 'none';
      toggle.style.animation = 'none';
      
      const activeTicket = localStorage.getItem('sb_ticket_id');
      if (activeTicket) {
        form.style.display = 'none';
        tracker.style.display = 'flex';
        checkStatus(activeTicket);
      } else {
        form.style.display = 'flex';
        tracker.style.display = 'none';
      }
    }
  };

  document.getElementById('sb-close').onclick = () => {
    modal.style.display = 'none';
  };

  document.getElementById('sb-btn-new').onclick = () => {
    localStorage.removeItem('sb_ticket_id');
    form.reset();
    tracker.style.display = 'none';
    form.style.display = 'flex';
  };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('sb-submit');
    btn.innerText = 'Mengirim...';
    btn.disabled = true;

    const formData = new FormData(e.target);
    formData.append('system_id', systemId);

    try {
      const res = await fetch(apiUrl, { 
        method: 'POST', 
        body: formData 
      });
      const data = await res.json();
      
      if (data.success && data.ticket_id) {
        localStorage.setItem('sb_ticket_id', data.ticket_id);
        form.reset();
        checkStatus(data.ticket_id);
      } else {
        alert('Gagal mengirim laporan: ' + data.error);
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      btn.innerText = 'Kirim Laporan';
      btn.disabled = false;
    }
  };
})();