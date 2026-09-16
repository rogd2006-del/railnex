# RAILNEX - AI-Powered Dynamic Block Planner for Indian Railways

> **Smart India Hackathon 2026** | **Problem Statement ID: SIH26027**  
> **Theme:** Transportation & Logistics  
> **Organization:** Ministry of Railways  

RAILNEX is an AI-powered dynamic block planning and operations decision-support platform designed to maximize railway fixed-asset availability and optimize multi-department maintenance scheduling across Indian Railways.

---

## 🚀 Key Features

1. **Multi-Department Synergistic Co-Allocation (Shadow Windows)**:
   - Fuses independent maintenance requests across:
     - **TMS** (Track Management System - Civil/Engineering)
     - **SMMS** (Signalling Maintenance & Management System - S&T)
     - **TDMS** (Traction Distribution Management System - Electrical/25kV OHE)
   - Automatically bundles overlapping spatial requirements into single shutdown windows, slashing aggregate track possession downtime by over 50%.

2. **Live Quad-Track Corridor Visualizer**:
   - Interactive line schematic of the Northern & North Central Railway Golden Corridor (New Delhi to Kanpur Central via Ghaziabad, Khurja, Aligarh, and Tundla - 435 KM).
   - Real-time animated trains with priority indicators (Vande Bharat, Rajdhani, Shatabdi, Freight, MEMU).
   - Dynamic track maintenance overlays with departmental color coding.

3. **Google Gemini AI Operations Copilot**:
   - Integrated with Google Gemini 1.5 Flash to provide real-time operational advice, caution order directives, and rolling block compliance checks.

4. **Controller "What-If" Simulation Sandbox**:
   - Test operational contingencies before dispatch (train delays, block duration expansions, adverse winter fog / monsoon weather).
   - Computes downstream ripple delays and recommends mitigation strategies (such as freight loop regulation).

5. **Human-in-the-Loop Sanction Workflow**:
   - Role-based controls for Section Controllers and Divisional Railway Managers (DRMs).
   - Sanction, modify, or reject AI-recommended warrants with official audit trail logging.

6. **26-Week Rolling Block Plan Integration**:
   - Macro seasonal schedule visualization and departmental quota fulfillment tracking per Railway Board norms.

---

## 🛠️ Tech Stack

- **Frontend**: Semantic HTML5, Vanilla CSS3 (Modern Glassmorphism & Railway UI Design System), Vanilla JavaScript (ES6+).
- **Backend**: Native Lightweight Multi-MIME HTTP & REST API Server.
- **AI Integration**: Google Gemini API via `.env.local`.

---

## 🏁 Quick Start

### 1. Run the Web Application Locally
Double-click:
```bash
start_server.bat
```
Or run in PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```

Open your browser and navigate to:
```
http://localhost:3000/
```

### 2. Configure Gemini AI API Key
Copy `.env.example` to `.env.local` and add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
```
