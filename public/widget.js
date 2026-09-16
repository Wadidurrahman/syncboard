(function() {
  const scriptTag = document.currentScript;
  const systemId = scriptTag.getAttribute('data-system-id') || '';
  
  const apiUrl = 'http://localhost:3000/api/tickets';
  const statusUrl = 'http://localhost:3000/api/tickets/status';

  const container = document.createElement('div');
  container.innerHTML = `
    <style>
      @keyframes sbPulse {
        0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
        70% { box-shadow: 0 0 0 8px rgba(37, 99, 235, 0); }
        100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
      }
      @keyframes sbFloat {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-4px); }
        100% { transform: translateY(0px); }
      }

      .sb-btn { position: fixed; bottom: 24px; right: 24px; background: #2563eb; color: white; border: none; border-radius: 50%; width: 48px; height: 48px; cursor: pointer; font-size: 22px; font-weight: 600; z-index: 9999; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; animation: sbPulse 2.5s infinite; font-family: system-ui, -apple-system, sans-serif; box-shadow: 0 4px 10px rgba(37,99,235,0.3); }
      .sb-btn:hover { background: #1d4ed8; transform: scale(1.05); }
      
      .sb-tooltip { position: fixed; bottom: 84px; right: 24px; background: white; padding: 10px 14px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); font-family: system-ui, -apple-system, sans-serif; font-size: 12px; color: #475569; font-weight: 500; z-index: 9998; animation: sbFloat 3.5s ease-in-out infinite; border: 1px solid #e2e8f0; pointer-events: none; width: 190px; line-height: 1.4; text-align: center; }
      .sb-tooltip::after { content: ''; position: absolute; bottom: -5px; right: 19px; width: 10px; height: 10px; background: white; transform: rotate(45deg); border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
      
      .sb-modal { display: none; position: fixed; bottom: 84px; right: 24px; width: 300px; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); z-index: 10000; border: 1px solid #e2e8f0; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; }
      .sb-header { background: #f8fafc; padding: 14px 16px; font-weight: 600; font-size: 14px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; color: #0f172a; }
      .sb-close { cursor: pointer; color: #94a3b8; font-size: 18px; line-height: 1; border: none; background: none; transition: color 0.2s; }
      .sb-close:hover { color: #475569; }
      
      .sb-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; max-height: 75vh; overflow-y: auto; }
      
      .sb-input { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; box-sizing: border-box; outline: none; transition: all 0.2s; color: #334155; }
      .sb-input:focus { border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.1); }
      
      .sb-label { font-size: 12px; color: #64748b; font-weight: 500; margin-bottom: -8px; }
      
      .sb-submit { background: #2563eb; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; width: 100%; margin-top: 4px; transition: background 0.2s; }
      .sb-submit:hover { background: #1d4ed8; }
      .sb-submit:disabled { background: #94a3b8; cursor: not-allowed; }
      
      .sb-recorder-area { background: #f8fafc; border: 1px dashed #cbd5e1; padding: 12px; border-radius: 6px; display: flex; flex-direction: column; gap: 8px; align-items: center; }
      .sb-record-btn { background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; width: 100%; justify-content: center; }
      .sb-record-btn.recording { background: #ef4444; animation: sbPulse 1.5s infinite; }
      .sb-record-btn:hover:not(.recording) { background: #2563eb; }
      .sb-audio-preview { width: 100%; height: 32px; display: none; }
      .sb-discard-btn { font-size: 11px; color: #ef4444; background: none; border: none; cursor: pointer; display: none; font-weight: 500; }
      .sb-discard-btn:hover { text-decoration: underline; }
      
      .sb-status-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; }
      .sb-badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin: 12px 0; letter-spacing: 0.5px; }
      .sb-badge.pending { background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; }
      .sb-badge.in_progress { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
      .sb-badge.done { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
      
      .sb-new-btn { background: white; color: #475569; border: 1px solid #cbd5e1; padding: 10px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; width: 100%; margin-top: 12px; transition: background 0.2s; }
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
        <input type="text" name="title" placeholder="Judul Kendala/Fitur" class="sb-input" required />
        <textarea name="description" placeholder="Jelaskan detailnya di sini..." class="sb-input" rows="3"></textarea>
        
        <label class="sb-label">Prioritas</label>
        <select name="priority" class="sb-input">
          <option value="standard">Standard (Biasa)</option>
          <option value="urgent">Urgent (Darurat! Segera)</option>
          <option value="slow">Slow (Fitur Baru/Nanti)</option>
        </select>
        
        <label class="sb-label">Screenshot (Opsional)</label>
        <input type="file" name="screenshot" accept="image/*" class="sb-input" />

        <label class="sb-label">Voice Note (Opsional)</label>
        <div class="sb-recorder-area">
          <button type="button" id="sb-record-btn" class="sb-record-btn">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/><path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/></svg>
            <span id="sb-record-text">Mulai Rekam Suara</span>
          </button>
          <audio id="sb-audio-preview" class="sb-audio-preview" controls></audio>
          <button type="button" id="sb-discard-btn" class="sb-discard-btn">Hapus Rekaman</button>
        </div>
        
        <button type="submit" id="sb-submit" class="sb-submit">Kirim Laporan</button>
      </form>

      <div id="sb-tracker" class="sb-body" style="display: none;">
        <div class="sb-status-card">
          <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">Status Laporan Saat Ini</div>
          <strong id="sb-track-title" style="font-size: 14px; color: #0f172a; display: block;">Memuat...</strong>
          <span id="sb-track-badge" class="sb-badge pending">PENDING</span>
          <div id="sb-track-desc" style="font-size: 12px; color: #475569; margin-top: 5px; line-height: 1.4;"></div>
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
  
  const recordBtn = document.getElementById('sb-record-btn');
  const recordText = document.getElementById('sb-record-text');
  const audioPreview = document.getElementById('sb-audio-preview');
  const discardBtn = document.getElementById('sb-discard-btn');

  let mediaRecorder;
  let audioChunks = [];
  let audioBlob = null;
  let isRecording = false;
  let recordInterval;
  let recordSeconds = 0;

  recordBtn.onclick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = e => {
          if (e.data.size > 0) audioChunks.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
          audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          audioPreview.src = audioUrl;
          
          recordBtn.style.display = 'none';
          audioPreview.style.display = 'block';
          discardBtn.style.display = 'block';
          
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        isRecording = true;
        recordBtn.classList.add('recording');
        
        recordSeconds = 0;
        recordText.innerText = 'Merekam... 0s';
        recordInterval = setInterval(() => {
          recordSeconds++;
          recordText.innerText = `Merekam... ${recordSeconds}s (Klik untuk Stop)`;
        }, 1000);
        
      } catch (err) {
        alert('Izin mikrofon ditolak atau perangkat tidak mendukung.');
      }
    } else {
      mediaRecorder.stop();
      isRecording = false;
      recordBtn.classList.remove('recording');
      clearInterval(recordInterval);
    }
  };

  const resetAudioUI = () => {
    audioBlob = null;
    audioPreview.src = '';
    audioPreview.style.display = 'none';
    discardBtn.style.display = 'none';
    recordBtn.style.display = 'flex';
    recordText.innerText = 'Mulai Rekam Suara';
    recordBtn.classList.remove('recording');
    isRecording = false;
    clearInterval(recordInterval);
  };

  discardBtn.onclick = resetAudioUI;

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
          desc.innerText = 'Laporan Anda sudah masuk dan menunggu respon dari Developer.';
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
    resetAudioUI();
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
    
    if (audioBlob) {
      const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
      formData.append('voice', audioFile);
    }

    try {
      const res = await fetch(apiUrl, { 
        method: 'POST', 
        body: formData 
      });
      const data = await res.json();
      
      if (data.success && data.ticket_id) {
        localStorage.setItem('sb_ticket_id', data.ticket_id);
        form.reset();
        resetAudioUI();
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