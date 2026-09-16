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

  const bubbleStyle = document.createElement('style');
  bubbleStyle.innerHTML = `
    @keyframes sbBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    .sb-cloud-bubble {
      position: fixed; bottom: 28px; right: 78px; background: #ffffff;
      color: #1e293b; padding: 10px 14px; border-radius: 12px; font-size: 11px;
      font-weight: 700; z-index: 999998; box-shadow: 0 4px 20px rgba(0,0,0,0.12);
      border: 1px solid #cbd5e1; white-space: nowrap; pointer-events: none;
      animation: sbBounce 3s ease-in-out infinite; font-family: system-ui, sans-serif;
      transition: opacity 0.5s ease;
    }
    .sb-cloud-bubble::after {
      content: ''; position: absolute; right: -6px; top: 12px; width: 0; height: 0;
      border-top: 6px solid transparent; border-bottom: 6px solid transparent;
      border-left: 6px solid #ffffff; filter: drop-shadow(1px 0 0 #cbd5e1);
    }
  `;
  document.head.appendChild(bubbleStyle);

  const tooltipEl = document.createElement('div');
  tooltipEl.className = 'sb-cloud-bubble';
  tooltipEl.innerText = 'Silahkan buat laporan jika ada bug atau update fitur baru';

  setTimeout(() => {
    tooltipEl.style.opacity = '0';
    setTimeout(() => tooltipEl.remove(), 500);
  }, 7000);

  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'sb-toggle';
  toggleBtn.innerHTML = '?';
  Object.assign(toggleBtn.style, {
    position: 'fixed', bottom: '20px', right: '20px', width: '48px', height: '48px',
    borderRadius: '50%', backgroundColor: '#2563eb', color: 'white',
    border: 'none', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(37,99,235,0.3)', zIndex: '999999', transition: 'all 0.2s ease'
  });

  toggleBtn.onmouseenter = () => { tooltipEl.style.opacity = '1'; };

  const modalContainer = document.createElement('div');
  Object.assign(modalContainer.style, {
    position: 'fixed', bottom: '80px', right: '20px', width: '360px',
    backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    zIndex: '999999', display: 'none', flexDirection: 'column', overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif', border: '1px solid #cbd5e1'
  });

  modalContainer.innerHTML = `
    <div style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; padding: 0 12px;">
      <div style="display: flex;">
        <button id="sb-tab-form" style="padding: 12px 14px; border: none; background: transparent; color: #2563eb; font-weight: 700; font-size: 13px; border-bottom: 2px solid #2563eb; cursor: pointer;">Kirim Laporan</button>
        <button id="sb-tab-status" style="padding: 12px 14px; border: none; background: transparent; color: #64748b; font-weight: 700; font-size: 13px; border-bottom: 2px solid transparent; cursor: pointer;">Status & Antrean</button>
      </div>
      <button id="sb-close" style="background: none; border: none; font-size: 18px; color: #64748b; cursor: pointer; padding: 0; line-height: 1;">&times;</button>
    </div>

    <div style="position: relative; height: 460px; overflow: hidden; background: #ffffff;">
      <div id="sb-content-form" style="position: absolute; inset: 0; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;">
        <div>
          <label style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 4px;">Judul Kendala/Fitur</label>
          <input type="text" id="sb-title" placeholder="Contoh: Error saat cetak laporan" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px; outline: none; box-sizing: border-box;">
        </div>

        <div>
          <label style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 4px;">Jelaskan detailnya di sini...</label>
          <textarea id="sb-desc" placeholder="Jelaskan detailnya..." style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; height: 60px; resize: none; font-size: 12px; outline: none; box-sizing: border-box;"></textarea>
        </div>

        <div>
          <label style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 4px;">Prioritas</label>
          <select id="sb-priority" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px; background: white; outline: none; box-sizing: border-box;">
            <option value="low">Low</option>
            <option value="standard" selected>Standard</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 4px;">Screenshot (Opsional)</label>
          <input type="file" id="sb-file" accept="image/*" style="width: 100%; font-size: 11px; color: #64748b; padding: 5px; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; box-sizing: border-box;">
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
          <button id="sb-record-btn" style="width: 100%; padding: 9px; background-color: #475569; color: white; border: none; border-radius: 6px; font-weight: 600; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <span>🎙️</span> <span id="sb-record-text">Mulai Rekam Suara</span>
          </button>
          <audio id="sb-audio-preview" controls style="width: 100%; display: none; height: 30px;"></audio>

          <button id="sb-submit" style="width: 100%; padding: 11px; background-color: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 700; font-size: 13px; cursor: pointer;">Kirim Laporan</button>
        </div>

        <p id="sb-status" style="font-size: 11px; text-align: center; font-weight: 600; display: none; margin: 0;"></p>
      </div>

      <div id="sb-content-status" style="position: absolute; inset: 0; padding: 14px; overflow-y: auto; display: none; background: #f8fafc; flex-direction: column; gap: 12px;">
        <div style="background: #1e293b; color: white; padding: 12px; border-radius: 8px; font-size: 11px; flex-shrink: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="font-weight: 800; color: #60a5fa; margin-bottom: 4px; display: flex; align-items: center; gap: 4px; font-size: 12px; letter-spacing: 0.5px;">
            <span>⚡</span> LIVE DEVELOPER ACTIVITY
          </div>
          <div id="sb-live-activity" style="color: #cbd5e1; line-height: 1.4;">Memeriksa aktivitas...</div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px; flex: 1;">
          <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Antrean & Progress Sistem Ini</div>
          <div id="sb-queue-list" style="display: flex; flex-direction: column; gap: 8px;">
            <p style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 20px;">Memuat data...</p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(tooltipEl);
  document.body.appendChild(toggleBtn);
  document.body.appendChild(modalContainer);

  const tabForm = document.getElementById('sb-tab-form');
  const tabStatus = document.getElementById('sb-tab-status');
  const contentForm = document.getElementById('sb-content-form');
  const contentStatus = document.getElementById('sb-content-status');
  const closeBtn = document.getElementById('sb-close');

  function switchTab(toForm) {
    if (toForm) {
      tabForm.style.color = '#2563eb'; tabForm.style.borderBottomColor = '#2563eb';
      tabStatus.style.color = '#64748b'; tabStatus.style.borderBottomColor = 'transparent';
      contentForm.style.display = 'flex'; contentStatus.style.display = 'none';
    } else {
      tabStatus.style.color = '#2563eb'; tabStatus.style.borderBottomColor = '#2563eb';
      tabForm.style.color = '#64748b'; tabForm.style.borderBottomColor = 'transparent';
      contentForm.style.display = 'none'; contentStatus.style.display = 'flex';
    }
  }

  tabForm.onclick = () => switchTab(true);
  tabStatus.onclick = () => switchTab(false);
  closeBtn.onclick = () => { modalContainer.style.display = 'none'; };

  let cachedLive = null;
  let cachedHistory = null;

  async function backgroundPreFetch() {
    try {
      const resLive = await fetch(`${apiUrl}?marquee=true`);
      const resDataLive = await resLive.json();
      cachedLive = resDataLive.data;

      const resHistory = await fetch(`${apiUrl}?system_id=${systemId}`);
      const resDataHistory = await resHistory.json();
      cachedHistory = resDataHistory.data;
    } catch (e) {}
  }
  backgroundPreFetch();

  toggleBtn.onclick = () => {
    if (modalContainer.style.display === 'none') {
      modalContainer.style.display = 'flex';
      renderDashboardData(cachedLive, cachedHistory);
      backgroundPreFetch().then(() => {
        if (modalContainer.style.display === 'flex') {
          renderDashboardData(cachedLive, cachedHistory);
        }
      });
    } else {
      modalContainer.style.display = 'none';
    }
  };

  function renderDashboardData(liveData, historyData) {
    const liveBox = document.getElementById('sb-live-activity');
    if (liveData && liveData.length > 0) {
      const currentTask = liveData[0];
      liveBox.innerHTML = `Sedang memperbaiki <b>"${currentTask.title}"</b> pada <b>[${getSystemName(currentTask.system_id)}]</b>`;
    } else {
      liveBox.innerHTML = `Developer sedang standby / tidak ada perbaikan aktif.`;
    }

    const listEl = document.getElementById('sb-queue-list');
    if (!historyData || historyData.length === 0) {
      listEl.innerHTML = '<p style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 15px;">Belum ada laporan dari sistem ini.</p>';
      return;
    }

    listEl.innerHTML = historyData.map((item, index) => {
      let statusBadge = '';
      let queueText = '';

      if (item.status === 'pending') {
        queueText = `<span style="background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">Antrean #${index + 1} (Menunggu)</span>`;
        statusBadge = '<span style="background: #fff7ed; color: #ea580c; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">Pending</span>';
      } else if (item.status === 'in_progress') {
        queueText = `<span style="background: #eff6ff; color: #2563eb; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">Sedang Dikerjakan</span>`;
        statusBadge = '<span style="background: #dbeafe; color: #1d4ed8; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">Proses</span>';
      } else {
        queueText = `<span style="background: #f0fdf4; color: #16a34a; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">Selesai</span>`;
        statusBadge = '<span style="background: #dcfce7; color: #15803d; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">Tuntas</span>';
      }

      return `
        <div style="background: white; border: 1px solid #cbd5e1; padding: 10px; border-radius: 6px; display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <span style="font-weight: 700; font-size: 12px; color: #1e293b; line-height: 1.3;">${item.title}</span>
            ${statusBadge}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 4px;">
            ${queueText}
            <span>${new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  let mediaRecorder;
  let audioChunks = [];
  let recordedAudioUrl = null;
  const recordBtn = document.getElementById('sb-record-btn');
  const recordText = document.getElementById('sb-record-text');
  const audioPreview = document.getElementById('sb-audio-preview');
  let isRecording = false;

  recordBtn.onclick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            recordedAudioUrl = reader.result;
            audioPreview.src = recordedAudioUrl;
            audioPreview.style.display = 'block';
          };
          reader.readAsDataURL(audioBlob);
        };

        mediaRecorder.start();
        isRecording = true;
        recordBtn.style.backgroundColor = '#dc2626';
        recordText.innerText = 'Berhenti Merekam...';
      } catch (err) {
        alert('Gagal mengakses mikrofon browser.');
      }
    } else {
      mediaRecorder.stop();
      isRecording = false;
      recordBtn.style.backgroundColor = '#475569';
      recordText.innerText = 'Rekam Ulang Suara';
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
        body: JSON.stringify({ 
          title, 
          description: desc, 
          priority, 
          system_id: systemId, 
          screenshot_url,
          voice_url: recordedAudioUrl 
        })
      });

      if (response.ok) {
        statusEl.style.display = 'block';
        statusEl.style.color = '#10b981';
        statusEl.innerText = 'Laporan berhasil dikirim!';
        document.getElementById('sb-title').value = '';
        document.getElementById('sb-desc').value = '';
        fileInput.value = '';
        audioPreview.style.display = 'none';
        recordedAudioUrl = null;
        
        setTimeout(() => {
          statusEl.style.display = 'none';
          btn.innerText = 'Kirim Laporan';
          btn.disabled = false;
          switchTab(false); 
          backgroundPreFetch().then(() => renderDashboardData(cachedLive, cachedHistory));
        }, 1500);
      }
    } catch (error) {
      statusEl.style.display = 'block';
      statusEl.style.color = '#ef4444';
      statusEl.innerText = 'Gagal mengirim.';
      btn.innerText = 'Kirim Laporan';
      btn.disabled = false;
    }
  };
})();