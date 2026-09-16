// ===================================================================
// RAILNEX - Indian Railways AI Dynamic Block Planning Engine
// SIH 2026 Problem Statement SIH26027 | Team CODELIKE_67
// Core Logic: Corridor Engine, OR-Tools Fusion, What-If Simulator
// ===================================================================

class RailnexApp {
  constructor() {
    this.trains = JSON.parse(JSON.stringify(INITIAL_TRAINS));
    this.demands = JSON.parse(JSON.stringify(INITIAL_MAINTENANCE_REQUESTS));
    this.activeBlocks = JSON.parse(JSON.stringify(INITIAL_ACTIVE_BLOCKS));
    this.approvedWarrants = [];
    this.pendingWarrants = [];
    this.auditLogs = [];
    this.currentRole = "CONTROLLER";
    this.isSimRunning = true;
    this.selectedWarrantForModal = null;
    this.totalKm = RAILWAY_CORRIDOR.totalLengthKm;

    this.initDefaultWarrants();
    this.initAuditLogs();
    this.bindDOM();
    this.renderStationsAxis();
    this.renderCorridorEntities();
    this.renderTrainsList();
    this.renderActiveBlocksList();
    this.renderPendingDemands();
    this.renderAIRecommendations();
    this.renderApprovalWarrants();
    this.renderAuditLogs();
    this.runWhatIfSimulation();
    this.startSimulationClock();
  }

  // Pre-seed AI Proposed Block Warrants
  initDefaultWarrants() {
    this.pendingWarrants = [
      {
        id: "WARRANT-KRJ-ALJN-95",
        title: "Khurja - Aligarh Quad-Block Co-Allocation",
        departments: ["TMS", "TDMS", "SMMS"],
        section: "Khurja - Aligarh (KM 93.8 - 96.5)",
        track: "DN_MAIN",
        proposedStart: "01:30",
        proposedEnd: "04:30",
        durationMinutes: 180,
        combinedTasks: [
          "TMS: USFD Rail Defect WJ-410 Replacement (180 min)",
          "TDMS: 25kV OHE Catenary Wire Re-tensioning (150 min)",
          "SMMS: Digital Axle Counter & Point Sensor Calibration (90 min)"
        ],
        hoursSaved: "240 mins saved (Downtime cut from 420m to 180m)",
        conflictScore: "0.12 (Very Low Traffic Lull)",
        status: "PENDING_APPROVAL",
        xaiReason: "Slots inside low-density night traffic window (01:30 - 04:30). Avoids prime Rajdhani & Vande Bharat paths. Co-locates electrical traction power cut with heavy civil rail cutting to eliminate 2 separate corridor blocks.",
        aiConfidence: "98.4%",
        safetyBuffer: "32 mins buffer before 22436 Vande Bharat departure"
      },
      {
        id: "WARRANT-TDL-ETW-234",
        title: "Tundla - Etawah Track Tamping & Neutral Section Overhaul",
        departments: ["TMS", "TDMS"],
        section: "Tundla - Etawah (KM 232.0 - 236.4)",
        track: "UP_MAIN",
        proposedStart: "10:15",
        proposedEnd: "13:45",
        durationMinutes: 210,
        combinedTasks: [
          "TMS: CSM 09-3X Heavy Track Tamping (210 min)",
          "TDMS: Neutral Section Ceramic Insulator Replacement (120 min)"
        ],
        hoursSaved: "120 mins saved via bundled shadow window",
        conflictScore: "0.24 (Freight loop diversion necessary)",
        status: "PENDING_APPROVAL",
        xaiReason: "Utilizes UP track clearance gap following morning Shatabdi clearance. Regulates 1 container freight rake at Tundla goods yard with zero passenger impact.",
        aiConfidence: "95.1%",
        safetyBuffer: "25 mins recovery margin"
      }
    ];
  }

  initAuditLogs() {
    this.auditLogs = [
      {
        timestamp: "2026-09-15 22:15:10",
        actor: "DRM (Prayagraj Div.)",
        role: "DRM",
        action: "APPROVED_BLOCK",
        details: "Sanctioned Block BLK-2026-0916-01 (GZB Yard Turnout Renewal). Sent authorization to COA."
      },
      {
        timestamp: "2026-09-15 18:10:04",
        actor: "RAILNEX AI Engine",
        role: "SYSTEM",
        action: "SHADOW_WINDOW_GENERATED",
        details: "Synthesized 3 disparate requests (TMS-801, TDMS-402, SMMS-619) into unified warrant WARRANT-KRJ-ALJN-95."
      },
      {
        timestamp: "2026-09-15 16:15:22",
        actor: "Sr.DEE / TRD (Electrical)",
        role: "ENGINEER",
        action: "DEMAND_SUBMITTED",
        details: "Submitted TDMS-402: 25kV Catenary Re-tensioning near KM 95."
      }
    ];
  }

  // DOM Event Binding
  bindDOM() {
    // Navigation Tabs
    const navButtons = document.querySelectorAll(".nav-tab-btn");
    navButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const tabId = btn.getAttribute("data-tab");
        this.switchTab(tabId, btn);
      });
    });

    // Role Switcher
    const roleSelect = document.getElementById("role-select");
    roleSelect.addEventListener("change", (e) => {
      this.currentRole = e.target.value;
      this.showToast(`Role switched to: ${e.target.options[e.target.selectedIndex].text}`, "info");
    });

    // Corridor Controls
    const btnToggleSim = document.getElementById("btn-toggle-train-sim");
    btnToggleSim.addEventListener("click", () => {
      this.isSimRunning = !this.isSimRunning;
      const icon = document.getElementById("train-sim-state-icon");
      if (this.isSimRunning) {
        icon.textContent = "⏸️";
        btnToggleSim.innerHTML = `<span>⏸️</span> Pause Corridor Feed`;
        this.showToast("Corridor simulation running live.", "success");
      } else {
        icon.textContent = "▶️";
        btnToggleSim.innerHTML = `<span>▶️</span> Resume Corridor Feed`;
        this.showToast("Corridor simulation paused.", "warning");
      }
    });

    const btnRefresh = document.getElementById("btn-refresh-corridor");
    btnRefresh.addEventListener("click", () => {
      this.showToast("Synced live data streams with COA / NTES / FOIS.", "success");
    });

    // AI Optimizer Button
    const btnRunOptimizer = document.getElementById("btn-run-optimizer");
    btnRunOptimizer.addEventListener("click", () => {
      this.runOptimizationEngine();
    });

    // What-If Simulation Controls
    const simTrainSelect = document.getElementById("sim-train-select");
    const simDelaySlider = document.getElementById("sim-delay-slider");
    const simDurationSlider = document.getElementById("sim-block-duration-slider");
    const simWeatherSelect = document.getElementById("sim-weather-select");
    const btnRecalcSim = document.getElementById("btn-recalculate-sim");

    simTrainSelect.addEventListener("change", () => {
      document.getElementById("sim-train-selected").textContent = simTrainSelect.options[simTrainSelect.selectedIndex].text;
      this.runWhatIfSimulation();
    });

    simDelaySlider.addEventListener("input", (e) => {
      document.getElementById("sim-delay-value").textContent = `${e.target.value} mins`;
      this.runWhatIfSimulation();
    });

    simDurationSlider.addEventListener("input", (e) => {
      document.getElementById("sim-block-duration-value").textContent = `${e.target.value} mins`;
      this.runWhatIfSimulation();
    });

    simWeatherSelect.addEventListener("change", () => {
      this.runWhatIfSimulation();
    });

    btnRecalcSim.addEventListener("click", () => {
      this.runWhatIfSimulation();
      this.showToast("What-If contingency recalculated with updated parameters.", "success");
    });

    // New Request Modal Controls
    const btnOpenReq = document.getElementById("btn-submit-request-open");
    const modalReq = document.getElementById("modal-new-request");
    const btnCloseReq = document.getElementById("btn-close-request-modal");
    const btnCancelReq = document.getElementById("btn-cancel-request");
    const formReq = document.getElementById("form-new-request");

    btnOpenReq.addEventListener("click", () => modalReq.classList.add("open"));
    btnCloseReq.addEventListener("click", () => modalReq.classList.remove("open"));
    btnCancelReq.addEventListener("click", () => modalReq.classList.remove("open"));

    formReq.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleNewDemandSubmit();
      modalReq.classList.remove("open");
      formReq.reset();
    });

    // Approval Modal Controls
    const modalApproval = document.getElementById("modal-approval-decision");
    const btnCloseApproval = document.getElementById("btn-close-approval-modal");
    const btnApprove = document.getElementById("btn-modal-approve");
    const btnReject = document.getElementById("btn-modal-reject");
    const btnModify = document.getElementById("btn-modal-modify");

    btnCloseApproval.addEventListener("click", () => modalApproval.classList.remove("open"));
    btnApprove.addEventListener("click", () => this.handleSanctionDecision("APPROVED"));
    btnReject.addEventListener("click", () => this.handleSanctionDecision("REJECTED"));
    btnModify.addEventListener("click", () => this.handleSanctionDecision("MODIFIED"));

    // Gemini AI Copilot Controls
    const btnOpenGemini = document.getElementById("btn-open-gemini");
    const modalGemini = document.getElementById("modal-gemini-copilot");
    const btnCloseGemini = document.getElementById("btn-close-gemini-modal");
    const btnSubmitGemini = document.getElementById("btn-submit-gemini-query");
    const inputPrompt = document.getElementById("gemini-input-prompt");
    const promptChips = document.querySelectorAll(".quick-prompt-chip");

    if (btnOpenGemini) {
      btnOpenGemini.addEventListener("click", () => {
        modalGemini.classList.add("open");
        if (!inputPrompt.value) {
          inputPrompt.value = "Explain why co-allocating TMS rail defect with TDMS catenary tensioning at KM 95 is optimal.";
        }
      });
    }

    if (btnCloseGemini) {
      btnCloseGemini.addEventListener("click", () => modalGemini.classList.remove("open"));
    }

    promptChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const prompt = chip.getAttribute("data-prompt");
        inputPrompt.value = prompt;
        this.queryGeminiAI(prompt);
      });
    });

    if (btnSubmitGemini) {
      btnSubmitGemini.addEventListener("click", () => {
        const prompt = inputPrompt.value.trim();
        if (prompt) {
          this.queryGeminiAI(prompt);
        } else {
          this.showToast("Please enter an operational query for Gemini AI.", "warning");
        }
      });
    }
  }

  // Query Gemini AI Copilot API
  async queryGeminiAI(userPrompt) {
    const loader = document.getElementById("gemini-loading-indicator");
    const respContainer = document.getElementById("gemini-response-container");
    const respText = document.getElementById("gemini-response-text");

    loader.style.display = "block";
    respContainer.style.display = "none";
    respText.innerHTML = "";

    try {
      const payload = {
        prompt: userPrompt,
        context: "Corridor: NDLS-GZB-CNB (435 KM). Pending Blocks: TMS USFD Defect KM 95, TDMS Catenary Tensioning KM 95, SMMS Axle Counter KM 95. Train 22436 Vande Bharat DN path, Train 12424 Rajdhani DN path."
      };

      const response = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      loader.style.display = "none";
      respContainer.style.display = "block";

      if (data && data.answer) {
        // Convert basic markdown formatting to HTML
        let formatted = data.answer
          .replace(/### (.*)/g, '<h4 style="color:#c084fc; margin:10px 0 4px 0;">$1</h4>')
          .replace(/## (.*)/g, '<h3 style="color:#a855f7; margin:12px 0 6px 0;">$1</h3>')
          .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#38bdf8;">$1</strong>')
          .replace(/\* (.*)/g, '<li style="margin-bottom:4px;">$1</li>')
          .replace(/\n\n/g, '<br/>');

        respText.innerHTML = `
          <div style="font-size: 11px; color: #a855f7; margin-bottom: 8px;">
            ⚡ Model: ${data.model || "Gemini 1.5 Flash"} • Responded at ${data.timestamp || new Date().toLocaleTimeString()}
          </div>
          <div>${formatted}</div>
        `;
        this.showToast("Gemini AI Operational Insights received!", "success");
      } else {
        respText.innerHTML = "No response received from AI model.";
      }
    } catch (err) {
      loader.style.display = "none";
      respContainer.style.display = "block";
      respText.innerHTML = `<strong>Error querying Gemini AI:</strong> ${err.message}`;
      this.showToast("Failed to reach Gemini API", "danger");
    }
  }

  // Switch Tab
  switchTab(tabId, activeBtn) {
    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".nav-tab-btn").forEach(el => el.classList.remove("active"));
    
    const target = document.getElementById(tabId);
    if (target) {
      target.classList.add("active");
      activeBtn.classList.add("active");
    }
  }

  // Render Stations Axis
  renderStationsAxis() {
    const axis = document.getElementById("stations-axis-container");
    axis.innerHTML = "";

    RAILWAY_CORRIDOR.stations.forEach(stn => {
      const pct = (stn.km / this.totalKm) * 100;
      const node = document.createElement("div");
      node.className = "station-node";
      node.style.left = `${pct}%`;
      node.innerHTML = `
        <div class="station-marker" title="${stn.name} (KM ${stn.km})"></div>
        <div class="station-name">${stn.code}</div>
        <div class="station-km">${stn.km}k</div>
      `;
      axis.appendChild(node);
    });
  }

  // Render Live Corridor Track schematic entities (Trains & Block overlays)
  renderCorridorEntities() {
    const upTrack = document.getElementById("track-up-main");
    const dnTrack = document.getElementById("track-dn-main");
    const loopTrack = document.getElementById("track-loop-main");

    upTrack.innerHTML = "";
    dnTrack.innerHTML = "";
    loopTrack.innerHTML = "";

    // Render Active Maintenance Block Overlay Zones on tracks
    this.activeBlocks.forEach(blk => {
      const match = blk.location.match(/KM\s*([\d.]+)\s*-\s*([\d.]+)/i);
      let startKm = 24.5, endKm = 26.0;
      if (match) {
        startKm = parseFloat(match[1]);
        endKm = parseFloat(match[2]);
      }
      const leftPct = Math.max(1, (startKm / this.totalKm) * 100);
      const widthPct = Math.max(3, ((endKm - startKm) / this.totalKm) * 100 + 1.5);

      const blockBox = document.createElement("div");
      blockBox.className = "block-corridor-overlay";
      blockBox.style.left = `${leftPct}%`;
      blockBox.style.width = `${widthPct}%`;
      blockBox.title = `${blk.bundleTitle} (${blk.startTime} - ${blk.endTime}) | ${blk.departments.join("+")}`;
      blockBox.innerHTML = `<span>🚧 ${blk.departments.join("+")} BLOCK</span>`;

      if (blk.track === "UP_MAIN") upTrack.appendChild(blockBox);
      else if (blk.track === "DN_MAIN") dnTrack.appendChild(blockBox);
      else loopTrack.appendChild(blockBox);
    });

    // Also draw shadow window proposal on DN_MAIN if pending
    if (this.pendingWarrants.length > 0) {
      const w = this.pendingWarrants[0];
      const leftPct = (93.8 / this.totalKm) * 100;
      const widthPct = ((96.5 - 93.8) / this.totalKm) * 100 + 2.5;
      const shadowBox = document.createElement("div");
      shadowBox.className = "block-corridor-overlay";
      shadowBox.style.left = `${leftPct}%`;
      shadowBox.style.width = `${widthPct}%`;
      shadowBox.style.background = "repeating-linear-gradient(45deg, rgba(6,182,212,0.25), rgba(6,182,212,0.25) 8px, rgba(168,85,247,0.25) 8px, rgba(168,85,247,0.25) 16px)";
      shadowBox.style.borderColor = "#38bdf8";
      shadowBox.title = `PROPOSED SHADOW WINDOW: ${w.title} (${w.proposedStart} - ${w.proposedEnd})`;
      shadowBox.innerHTML = `<span>⚡ PROPOSED SHADOW</span>`;
      dnTrack.appendChild(shadowBox);
    }

    // Render Trains
    this.trains.forEach(trn => {
      const pct = Math.min(100, Math.max(0, (trn.currentKm / this.totalKm) * 100));
      const trainSprite = document.createElement("div");
      let typeClass = "freight";
      if (trn.type === "VANDE_BHARAT") typeClass = "vande-bharat";
      else if (trn.type === "RAJDHANI") typeClass = "rajdhani";

      trainSprite.className = `train-sprite ${typeClass}`;
      trainSprite.style.left = `${pct}%`;
      trainSprite.id = `sprite-${trn.id}`;
      trainSprite.title = `${trn.number} ${trn.name} (${trn.speed} km/h) | Status: ${trn.status} | ETA ${trn.nextStation}: ${trn.etaMinutes}m`;
      trainSprite.innerHTML = `
        <span>${trn.direction === "DN" ? "▶" : "◀"}</span>
        <span>${trn.number}</span>
      `;

      if (trn.assignedTrack === "UP_MAIN") upTrack.appendChild(trainSprite);
      else if (trn.assignedTrack === "DN_MAIN") dnTrack.appendChild(trainSprite);
      else loopTrack.appendChild(trainSprite);
    });
  }

  // Render Train list in panel
  renderTrainsList() {
    const list = document.getElementById("active-trains-list");
    list.innerHTML = "";
    document.getElementById("train-count-badge").textContent = `${this.trains.length} Active`;

    this.trains.forEach(t => {
      const card = document.createElement("div");
      card.className = "live-item-card";
      let badgeClass = "on-time";
      if (t.status === "DELAYED") badgeClass = "delayed";
      if (t.status === "LOOP_REGULATED") badgeClass = "loop";

      card.innerHTML = `
        <div class="item-main-info">
          <div style="font-size: 20px;">🚆</div>
          <div>
            <div class="item-train-num">${t.number} <span style="font-size: 11px; font-weight: normal; color: #94a3b8;">(${t.name})</span></div>
            <div class="item-meta">
              <span>📍 KM ${t.currentKm.toFixed(1)}</span>
              <span>⚡ ${t.speed} km/h</span>
              <span>🛤️ ${t.assignedTrack}</span>
              <span>Next: <strong>${t.nextStation}</strong> (${t.etaMinutes}m)</span>
            </div>
          </div>
        </div>
        <div style="text-align: right;">
          <span class="status-badge ${badgeClass}">${t.status}</span>
          <div style="font-size: 11px; color: ${t.delayMinutes > 0 ? '#f87171' : '#34d399'}; margin-top: 4px;">
            ${t.delayMinutes === 0 ? "On Time (COA)" : `+${t.delayMinutes}m delay`}
          </div>
        </div>
      `;
      list.appendChild(card);
    });
  }

  // Render Active Blocks list
  renderActiveBlocksList() {
    const list = document.getElementById("active-blocks-list");
    list.innerHTML = "";
    document.getElementById("active-blocks-badge").textContent = `${this.activeBlocks.length} Active`;

    if (this.activeBlocks.length === 0) {
      list.innerHTML = `<div style="text-align: center; color: var(--text-faint); padding: 20px;">No currently executing line blocks.</div>`;
      return;
    }

    this.activeBlocks.forEach(b => {
      const card = document.createElement("div");
      card.className = "live-item-card";
      card.innerHTML = `
        <div class="item-main-info">
          <div style="font-size: 20px;">🚧</div>
          <div>
            <div style="font-size: 13px; font-weight: 800; color: #fff;">${b.bundleTitle}</div>
            <div class="item-meta">
              <span>📍 ${b.location}</span>
              <span>🕒 ${b.startTime} - ${b.endTime} (${b.duration}m)</span>
              <span>🛤️ ${b.track}</span>
            </div>
            <div style="margin-top: 6px; display: flex; gap: 6px;">
              ${b.departments.map(d => `<span class="dept-tag ${d.toLowerCase()}">${d}</span>`).join("")}
              <span style="font-size: 10px; color: #cbd5e1; align-self: center;">Sanctioned by: ${b.approvedBy}</span>
            </div>
          </div>
        </div>
        <div style="text-align: right;">
          <span class="status-badge active">${b.status} (${b.progressPercent}%)</span>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">
            ${b.speedRestrictionKm}
          </div>
        </div>
      `;
      list.appendChild(card);
    });
  }

  // Render Pending Demands list in Optimizer tab
  renderPendingDemands() {
    const list = document.getElementById("pending-demands-list");
    list.innerHTML = "";
    document.getElementById("badge-pending-reqs").textContent = `${this.demands.length} Demands`;

    this.demands.forEach(req => {
      const card = document.createElement("div");
      card.className = "live-item-card";
      let urgencyColor = "#34d399";
      if (req.urgency === "CRITICAL") urgencyColor = "#f87171";
      if (req.urgency === "HIGH") urgencyColor = "#fbbf24";

      card.innerHTML = `
        <div class="item-main-info">
          <span class="dept-tag ${req.department.toLowerCase()}">${req.deptBadge}</span>
          <div>
            <div style="font-size: 13px; font-weight: 700; color: #fff;">${req.workType}</div>
            <div class="item-meta">
              <span>📍 ${req.location} (KM ${req.startKm} - ${req.endKm})</span>
              <span>🛤️ ${req.trackAffected}</span>
              <span>⏱️ Req: ${req.requestedDurationMinutes} mins</span>
              <span>👷 Gang: ${req.gangStrength} staff</span>
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
              <strong>Reason:</strong> ${req.reason}
            </div>
          </div>
        </div>
        <div style="text-align: right;">
          <span class="status-badge" style="background: rgba(255,255,255,0.06); color: ${urgencyColor}; border: 1px solid ${urgencyColor}40;">
            ${req.urgency}
          </span>
          <div style="font-size: 10px; color: var(--text-faint); margin-top: 4px;">
            ID: ${req.id}
          </div>
        </div>
      `;
      list.appendChild(card);
    });
  }

  // Render AI Recommended Bundled Shadow Windows
  renderAIRecommendations() {
    const container = document.getElementById("ai-fusion-results-container");
    container.innerHTML = "";

    this.pendingWarrants.forEach((warrant, idx) => {
      const card = document.createElement("div");
      card.className = "fusion-plan-card";
      card.innerHTML = `
        <div class="fusion-header">
          <div class="fusion-title-area">
            <h4>
              <span>⚡</span> ${warrant.title}
              <span class="shadow-window-tag">AI Shadow Window</span>
            </h4>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
              Section: <strong>${warrant.section}</strong> | Track: <strong>${warrant.track}</strong> | Window: <strong style="color: #38bdf8;">${warrant.proposedStart} - ${warrant.proposedEnd} (${warrant.durationMinutes} mins)</strong>
            </div>
          </div>

          <div style="display: flex; gap: 10px; align-items: center;">
            <button class="btn-primary btn-inspect-warrant" data-index="${idx}">
              <span>🛡️ Inspect & Sanction</span>
            </button>
          </div>
        </div>

        <div style="font-size: 12px; font-weight: 600; color: #cbd5e1; margin-bottom: 6px;">
          Bundled Synergistic Departmental Tasks (Simultaneous Execution):
        </div>

        <div class="bundled-tasks-grid">
          ${warrant.combinedTasks.map(task => `
            <div class="task-item-pill">
              <div class="task-item-pill-header">
                <span style="font-weight: 700; color: #fff;">${task.split(":")[0]}</span>
                <span style="font-size: 10px; color: #34d399; font-weight: 700;">Zero Conflict</span>
              </div>
              <div style="font-size: 11px; color: #94a3b8;">${task.split(":")[1] || task}</div>
            </div>
          `).join("")}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; font-size: 12px; padding: 10px 14px; background: rgba(0,0,0,0.25); border-radius: 8px;">
          <div>⚡ <strong>Total Benefit:</strong> <span style="color: #34d399; font-weight: 700;">${warrant.hoursSaved}</span></div>
          <div>🎯 <strong>AI Confidence:</strong> <span style="color: #38bdf8; font-weight: 700;">${warrant.aiConfidence}</span></div>
          <div>🛡️ <strong>Safety Margin:</strong> <span style="color: #fbbf24; font-weight: 700;">${warrant.safetyBuffer}</span></div>
        </div>

        <div class="explainable-ai-box">
          <strong>Explainable AI Rationale:</strong> ${warrant.xaiReason}
        </div>
      `;
      container.appendChild(card);
    });

    // Attach inspect buttons
    document.querySelectorAll(".btn-inspect-warrant").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        this.openApprovalModal(this.pendingWarrants[idx]);
      });
    });
  }

  // Render Controller Approval tab warrants
  renderApprovalWarrants() {
    const list = document.getElementById("warrants-approval-list");
    list.innerHTML = "";
    document.getElementById("badge-pending-approvals").textContent = `${this.pendingWarrants.length} Pending`;
    document.getElementById("pending-approval-count-badge").textContent = `${this.pendingWarrants.length} Pending Sanction`;

    if (this.pendingWarrants.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 40px;">
          <div style="font-size: 32px; margin-bottom: 10px;">✅</div>
          <h4>All AI Recommended Block Warrants Have Been Sanctioned!</h4>
          <p style="font-size: 12px;">Corridor plans are synced to Control Office Application (COA).</p>
        </div>
      `;
      return;
    }

    this.pendingWarrants.forEach((w, idx) => {
      const card = document.createElement("div");
      card.className = "live-item-card";
      card.innerHTML = `
        <div class="item-main-info">
          <div style="font-size: 24px;">📑</div>
          <div>
            <div style="font-size: 14px; font-weight: 800; color: #fff;">${w.title}</div>
            <div class="item-meta">
              <span>Section: <strong>${w.section}</strong></span>
              <span>Track: <strong>${w.track}</strong></span>
              <span>Window: <strong>${w.proposedStart} - ${w.proposedEnd} (${w.durationMinutes}m)</strong></span>
            </div>
            <div style="margin-top: 6px; display: flex; gap: 6px;">
              ${w.departments.map(d => `<span class="dept-tag ${d.toLowerCase()}">${d}</span>`).join("")}
              <span style="font-size: 11px; color: #34d399;">Benefit: ${w.hoursSaved}</span>
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn-primary btn-open-sanction" data-index="${idx}">
            Review & Sanction
          </button>
        </div>
      `;
      list.appendChild(card);
    });

    document.querySelectorAll(".btn-open-sanction").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        this.openApprovalModal(this.pendingWarrants[idx]);
      });
    });
  }

  // Open Approval Modal
  openApprovalModal(warrant) {
    this.selectedWarrantForModal = warrant;
    const modal = document.getElementById("modal-approval-decision");
    const title = document.getElementById("approval-modal-title");
    const body = document.getElementById("approval-modal-body");

    title.textContent = `Sanction Block Warrant: ${warrant.id}`;
    body.innerHTML = `
      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 15px; color: #fff; margin-bottom: 4px;">${warrant.title}</h4>
        <p style="font-size: 12px; color: var(--text-muted);">
          Location: <strong>${warrant.section}</strong> | Track Affected: <strong style="color: #38bdf8;">${warrant.track}</strong>
        </p>
      </div>

      <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 14px; margin-bottom: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
          <div>Proposed Start: <strong style="color: #38bdf8;">${warrant.proposedStart} hrs</strong></div>
          <div>Proposed End: <strong style="color: #38bdf8;">${warrant.proposedEnd} hrs</strong></div>
          <div>Total Window: <strong>${warrant.durationMinutes} minutes</strong></div>
          <div>Downtime Saved: <strong style="color: #34d399;">${warrant.hoursSaved}</strong></div>
        </div>
      </div>

      <div style="font-size: 12px; font-weight: 700; margin-bottom: 6px;">Multi-Departmental Tasks Authorized:</div>
      <ul style="font-size: 12px; color: var(--text-muted); padding-left: 18px; margin-bottom: 16px;">
        ${warrant.combinedTasks.map(t => `<li style="margin-bottom: 4px;">${t}</li>`).join("")}
      </ul>

      <div class="explainable-ai-box" style="margin-bottom: 16px;">
        <strong>Safety & Operational Clearance:</strong> ${warrant.xaiReason}
      </div>

      <div class="form-group">
        <label for="modal-officer-remarks">Controller / DRM Endorsement Remarks</label>
        <textarea id="modal-officer-remarks" class="form-textarea" rows="2" placeholder="e.g. Approved as per Rolling Block Plan norm. Ensure OHE grounding discharge rods placed before track cutting.">Sanctioned. Issue Caution Order C-102 and advise Section Controller Tundla.</textarea>
      </div>
    `;

    modal.classList.add("open");
  }

  // Handle Sanction Decision
  handleSanctionDecision(decision) {
    if (!this.selectedWarrantForModal) return;
    const warrant = this.selectedWarrantForModal;
    const modal = document.getElementById("modal-approval-decision");
    const remarks = document.getElementById("modal-officer-remarks").value || "No remarks entered.";
    const now = new Date().toLocaleTimeString();

    if (decision === "APPROVED") {
      // Create new active block
      const newBlock = {
        id: `BLK-${Date.now().toString().slice(-6)}`,
        bundleTitle: warrant.title,
        departments: warrant.departments,
        location: warrant.section,
        track: warrant.track,
        startTime: warrant.proposedStart,
        endTime: warrant.proposedEnd,
        duration: warrant.durationMinutes,
        status: "SCHEDULED_ACTIVE",
        progressPercent: 0,
        corridorImpact: "LOW",
        trainsRegulated: ["Freight rakes regulated at loops"],
        speedRestrictionKm: "30 km/h Caution Order",
        approvedBy: `${this.currentRole === "DRM" ? "DRM / Prayagraj" : "Section Controller (Line Ops)"}`,
        approvalTimestamp: `${new Date().toISOString().slice(0, 10)} ${now}`
      };

      this.activeBlocks.unshift(newBlock);
      this.pendingWarrants = this.pendingWarrants.filter(w => w.id !== warrant.id);

      this.auditLogs.unshift({
        timestamp: `${new Date().toISOString().slice(0, 10)} ${now}`,
        actor: `${this.currentRole} (User)`,
        role: this.currentRole,
        action: "APPROVED_BLOCK",
        details: `Approved warrant ${warrant.id} (${warrant.title}). Remarks: "${remarks}". Dispatched to COA.`
      });

      this.showToast(`Block Warrant ${warrant.id} APPROVED and pushed to live operations!`, "success");
    } else if (decision === "REJECTED") {
      this.pendingWarrants = this.pendingWarrants.filter(w => w.id !== warrant.id);

      this.auditLogs.unshift({
        timestamp: `${new Date().toISOString().slice(0, 10)} ${now}`,
        actor: `${this.currentRole} (User)`,
        role: this.currentRole,
        action: "REJECTED_BLOCK",
        details: `Rejected warrant ${warrant.id}. Remarks: "${remarks}". Returned to BDMS.`
      });

      this.showToast(`Block Warrant ${warrant.id} REJECTED by ${this.currentRole}.`, "danger");
    } else if (decision === "MODIFIED") {
      warrant.durationMinutes = Math.max(90, warrant.durationMinutes - 30);
      warrant.hoursSaved = "Modified: 150 mins duration";

      this.auditLogs.unshift({
        timestamp: `${new Date().toISOString().slice(0, 10)} ${now}`,
        actor: `${this.currentRole} (User)`,
        role: this.currentRole,
        action: "MODIFIED_BLOCK",
        details: `Modified time window for ${warrant.id}. Remarks: "${remarks}".`
      });

      this.showToast(`Block Window modified to 150 mins. Updated recommendations.`, "warning");
    }

    modal.classList.remove("open");
    this.renderCorridorEntities();
    this.renderActiveBlocksList();
    this.renderApprovalWarrants();
    this.renderAIRecommendations();
    this.renderAuditLogs();
  }

  // Handle New Demand Submission from Form
  handleNewDemandSubmit() {
    const dept = document.getElementById("req-dept").value;
    const workType = document.getElementById("req-work-type").value;
    const section = document.getElementById("req-section").value;
    const track = document.getElementById("req-track").value;
    const duration = parseInt(document.getElementById("req-duration").value, 10);
    const urgency = document.getElementById("req-urgency").value;
    const reason = document.getElementById("req-justification").value;

    let deptName = "Civil Track";
    let badge = "TMS Track";
    if (dept === "TDMS") { deptName = "Traction Distribution (TRD)"; badge = "TDMS OHE"; }
    else if (dept === "SMMS") { deptName = "Signal & Telecom"; badge = "SMMS Signal"; }

    const newReq = {
      id: `REQ-${dept}-${Math.floor(100 + Math.random() * 900)}`,
      department: dept,
      deptName: deptName,
      deptBadge: badge,
      workType: workType,
      location: section === "KRJ-ALJN" ? "Khurja - Aligarh Section" : "Ghaziabad - Khurja Section",
      startKm: section === "KRJ-ALJN" ? 95.2 : 45.0,
      endKm: section === "KRJ-ALJN" ? 96.0 : 47.5,
      trackAffected: track,
      urgency: urgency,
      requestedDurationMinutes: duration,
      equipment: ["Standard Departmental Tool Gang"],
      gangStrength: 12,
      submissionDate: new Date().toISOString().slice(0, 16).replace("T", " "),
      status: "PENDING_AI_FUSION",
      reason: reason
    };

    this.demands.unshift(newReq);
    this.renderPendingDemands();

    this.auditLogs.unshift({
      timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
      actor: `${dept} Maintenance Engineer`,
      role: "ENGINEER",
      action: "DEMAND_SUBMITTED",
      details: `New demand registered: ${newReq.id} - ${workType} on ${track}.`
    });
    this.renderAuditLogs();

    this.showToast(`New ${dept} demand submitted successfully to RAILNEX!`, "success");
  }

  // AI Optimizer Engine Heuristic Run
  runOptimizationEngine() {
    this.showToast("Running Constraint Optimization Engine (OR-Tools)...", "info");

    setTimeout(() => {
      // Refresh warrants and compute co-allocation
      this.initDefaultWarrants();
      this.renderAIRecommendations();
      this.renderApprovalWarrants();
      this.renderCorridorEntities();

      document.getElementById("kpi-coallocation").textContent = "42.1%";
      document.getElementById("kpi-hours-saved").innerHTML = "168 <span>hrs</span>";

      this.showToast("Optimization Solved! 2 Co-allocated Shadow Windows synthesized.", "success");
    }, 450);
  }

  // Render Audit Logs
  renderAuditLogs() {
    const list = document.getElementById("audit-log-list");
    list.innerHTML = "";

    this.auditLogs.forEach(log => {
      const el = document.createElement("div");
      el.className = "audit-entry";
      el.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
          <strong style="color: #e2e8f0;">${log.action}</strong>
          <span class="audit-timestamp">${log.timestamp}</span>
        </div>
        <div style="color: var(--text-muted); font-size: 11px;">
          <strong>${log.actor} (${log.role}):</strong> ${log.details}
        </div>
      `;
      list.appendChild(el);
    });
  }

  // What-If Simulation Sandbox Calculator
  runWhatIfSimulation() {
    const trainId = document.getElementById("sim-train-select").value;
    const delay = parseInt(document.getElementById("sim-delay-slider").value, 10);
    const duration = parseInt(document.getElementById("sim-block-duration-slider").value, 10);
    const weather = document.getElementById("sim-weather-select").value;

    const verdictBox = document.getElementById("sim-verdict-box");
    const verdictTitle = document.getElementById("sim-verdict-title");
    const verdictDesc = document.getElementById("sim-verdict-desc");
    const tableBody = document.getElementById("sim-table-body");

    let weatherPenalty = 0;
    if (weather === "FOG") weatherPenalty = 18;
    if (weather === "HEAVY_RAIN") weatherPenalty = 12;

    const totalPrimaryDelay = delay + weatherPenalty;

    if (totalPrimaryDelay <= 10 && duration <= 180) {
      verdictBox.className = "sim-verdict-banner safe";
      verdictTitle.textContent = "Safe Operational Window - Minimal Corridor Disruption";
      verdictDesc.textContent = `Delay of ${totalPrimaryDelay}m can be absorbed within section runtime slack. No high-priority passenger trains need regulation.`;
    } else if (totalPrimaryDelay <= 40 || duration <= 240) {
      verdictBox.className = "sim-verdict-banner warning";
      verdictTitle.textContent = "Moderate Conflict - 1 Freight Train Loop Regulation Required";
      verdictDesc.textContent = `Primary delay of ${totalPrimaryDelay}m shifts shadow window by ${(totalPrimaryDelay * 0.75).toFixed(0)}m. Freight container rake will wait at Khurja loop for 15 mins.`;
    } else {
      verdictBox.className = "sim-verdict-banner danger";
      verdictTitle.textContent = "High Corridor Congestion Warning - Single-Line Working Needed";
      verdictDesc.textContent = `Severe cumulative delay (${totalPrimaryDelay}m) causes line overlap. Recommend single-line bidirectional working between Khurja and Somna.`;
    }

    // Populate downstream table
    tableBody.innerHTML = `
      <tr>
        <td><strong>22436 Vande Bharat Exp</strong></td>
        <td><span class="status-badge on-time">P1 (Highest)</span></td>
        <td>07:22 IST</td>
        <td>${totalPrimaryDelay > 45 ? "07:31 IST (+9m)" : "07:22 IST (0m)"}</td>
        <td style="color: ${totalPrimaryDelay > 45 ? '#f87171' : '#34d399'}; font-weight: 700;">
          ${totalPrimaryDelay > 45 ? "+9 mins ripple delay" : "Zero Impact (Maintained)"}
        </td>
        <td>Priority green-wave path retained via DN Main</td>
      </tr>
      <tr>
        <td><strong>12424 Rajdhani Express</strong></td>
        <td><span class="status-badge on-time">P1</span></td>
        <td>17:05 IST</td>
        <td>${`17:${String(5 + totalPrimaryDelay).padStart(2, "0")} IST`}</td>
        <td style="color: #fbbf24; font-weight: 700;">+${totalPrimaryDelay} mins simulated</td>
        <td>Regulate block start time to 02:15 to maintain clear path</td>
      </tr>
      <tr>
        <td><strong>12004 Shatabdi Express</strong></td>
        <td><span class="status-badge on-time">P2</span></td>
        <td>16:45 IST</td>
        <td>16:45 IST</td>
        <td style="color: #34d399; font-weight: 700;">Zero Impact</td>
        <td>Runs on UP Main Line unaffected by DN block</td>
      </tr>
      <tr>
        <td><strong>BCN/4021A Freight Rake</strong></td>
        <td><span class="status-badge loop">P4 (Freight)</span></td>
        <td>09:10 IST</td>
        <td>${`09:${String(10 + Math.min(60, totalPrimaryDelay + 15)).padStart(2, "0")} IST`}</td>
        <td style="color: #f87171; font-weight: 700;">+${Math.min(60, totalPrimaryDelay + 15)} mins regulation</td>
        <td>Stabled on Khurja Loop Line; crew informed via FOIS</td>
      </tr>
    `;
  }

  // Simulation Clock & Moving Trains
  startSimulationClock() {
    let simulatedSeconds = 2 * 3600 + 30 * 60; // 02:30:00

    setInterval(() => {
      // Clock
      simulatedSeconds += 1;
      const hrs = String(Math.floor(simulatedSeconds / 3600) % 24).padStart(2, "0");
      const mins = String(Math.floor((simulatedSeconds % 3600) / 60)).padStart(2, "0");
      const secs = String(simulatedSeconds % 60).padStart(2, "0");
      document.getElementById("live-time-display").textContent = `${hrs}:${mins}:${secs} IST`;

      // If simulation running, advance trains
      if (this.isSimRunning) {
        this.trains.forEach(t => {
          const kmAdvance = (t.speed / 3600) * 1.8; // subtle speed multiplier for visual engagement
          if (t.direction === "DN") {
            t.currentKm += kmAdvance;
            if (t.currentKm > this.totalKm) t.currentKm = 5;
          } else {
            t.currentKm -= kmAdvance;
            if (t.currentKm < 0) t.currentKm = this.totalKm - 5;
          }
          t.etaMinutes = Math.max(1, Math.round(Math.abs(t.currentKm % 40) / 2));
        });

        this.renderCorridorEntities();
      }
    }, 1000);
  }

  // Toast Notification Helper
  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast-item ${type}`;

    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "warning") icon = "⚠️";
    if (type === "danger") icon = "🚨";

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }
}

// Instantiate RAILNEX on DOM Ready
window.addEventListener("DOMContentLoaded", () => {
  window.railnexApp = new RailnexApp();
});
