// RAILNEX - Indian Railways Seed Data & State Model
// SIH 2026 Problem Statement SIH26027 | Team CODELIKE_67

const RAILWAY_CORRIDOR = {
  name: "Northern & North Central Railway Golden Corridor",
  section: "New Delhi (NDLS) - Ghaziabad (GZB) - Kanpur Central (CNB)",
  totalLengthKm: 435,
  stations: [
    { id: "NDLS", name: "New Delhi", code: "NDLS", km: 0, tracks: 16, type: "terminal" },
    { id: "ANVT", name: "Anand Vihar T.", code: "ANVT", km: 12, tracks: 7, type: "junction" },
    { id: "GZB", name: "Ghaziabad Jn", code: "GZB", km: 25, tracks: 6, type: "junction" },
    { id: "KRJ", name: "Khurja Jn", code: "KRJ", km: 83, tracks: 4, type: "junction" },
    { id: "ALJN", name: "Aligarh Jn", code: "ALJN", km: 126, tracks: 5, type: "junction" },
    { id: "TDL", name: "Tundla Jn", code: "TDL", km: 204, tracks: 6, type: "junction" },
    { id: "ETW", name: "Etawah Jn", code: "ETW", km: 296, tracks: 4, type: "station" },
    { id: "CNB", name: "Kanpur Central", code: "CNB", km: 435, tracks: 10, type: "terminal" }
  ],
  blockSections: [
    { id: "SEC-NDLS-ANVT", from: "NDLS", to: "ANVT", startKm: 0, endKm: 12, maxSpeed: 110, tracks: ["UP_MAIN", "DN_MAIN", "UP_SLOW", "DN_SLOW"] },
    { id: "SEC-ANVT-GZB", from: "ANVT", to: "GZB", startKm: 12, endKm: 25, maxSpeed: 110, tracks: ["UP_MAIN", "DN_MAIN"] },
    { id: "SEC-GZB-KRJ", from: "GZB", to: "KRJ", startKm: 25, endKm: 83, maxSpeed: 130, tracks: ["UP_MAIN", "DN_MAIN"] },
    { id: "SEC-KRJ-ALJN", from: "KRJ", to: "ALJN", startKm: 83, endKm: 126, maxSpeed: 130, tracks: ["UP_MAIN", "DN_MAIN"] },
    { id: "SEC-ALJN-TDL", from: "ALJN", to: "TDL", startKm: 126, endKm: 204, maxSpeed: 130, tracks: ["UP_MAIN", "DN_MAIN"] },
    { id: "SEC-TDL-ETW", from: "TDL", to: "ETW", startKm: 204, endKm: 296, maxSpeed: 130, tracks: ["UP_MAIN", "DN_MAIN"] },
    { id: "SEC-ETW-CNB", from: "ETW", to: "CNB", startKm: 296, endKm: 435, maxSpeed: 130, tracks: ["UP_MAIN", "DN_MAIN"] }
  ]
};

const INITIAL_TRAINS = [
  {
    id: "TRN-22436",
    number: "22436",
    name: "Vande Bharat Express",
    type: "VANDE_BHARAT",
    priority: 1,
    direction: "DN",
    currentKm: 98,
    speed: 128,
    origin: "NDLS",
    destination: "BSB (Varanasi)",
    scheduledDeparture: "06:00",
    delayMinutes: 0,
    status: "ON_TIME",
    assignedTrack: "DN_MAIN",
    nextStation: "ALJN",
    etaMinutes: 14
  },
  {
    id: "TRN-12424",
    number: "12424",
    name: "Dibrugarh Rajdhani Express",
    type: "RAJDHANI",
    priority: 1,
    direction: "DN",
    currentKm: 48,
    speed: 122,
    origin: "NDLS",
    destination: "DBRG",
    scheduledDeparture: "16:20",
    delayMinutes: 4,
    status: "SLIGHT_DELAY",
    assignedTrack: "DN_MAIN",
    nextStation: "KRJ",
    etaMinutes: 18
  },
  {
    id: "TRN-12004",
    number: "12004",
    name: "Lucknow Swarna Shatabdi",
    type: "SHATABDI",
    priority: 2,
    direction: "UP",
    currentKm: 240,
    speed: 115,
    origin: "LKO",
    destination: "NDLS",
    scheduledDeparture: "15:30",
    delayMinutes: 0,
    status: "ON_TIME",
    assignedTrack: "UP_MAIN",
    nextStation: "TDL",
    etaMinutes: 22
  },
  {
    id: "TRN-12566",
    number: "12566",
    name: "Bihar Sampark Kranti Exp",
    type: "SUPERFAST",
    priority: 3,
    direction: "DN",
    currentKm: 165,
    speed: 105,
    origin: "NDLS",
    destination: "DBG",
    scheduledDeparture: "13:00",
    delayMinutes: 12,
    status: "DELAYED",
    assignedTrack: "DN_MAIN",
    nextStation: "TDL",
    etaMinutes: 26
  },
  {
    id: "TRN-BCN402",
    number: "BCN/4021A",
    name: "Container Freight (DFCCIL Feeder)",
    type: "FREIGHT",
    priority: 4,
    direction: "UP",
    currentKm: 110,
    speed: 68,
    origin: "CNB (Juhi)",
    destination: "TKD (Tughlakabad)",
    scheduledDeparture: "08:15",
    delayMinutes: 15,
    status: "LOOP_REGULATED",
    assignedTrack: "UP_LOOP",
    nextStation: "KRJ",
    etaMinutes: 35
  },
  {
    id: "TRN-64582",
    number: "64582",
    name: "Ghaziabad - Aligarh MEMU",
    type: "MEMU",
    priority: 4,
    direction: "DN",
    currentKm: 60,
    speed: 72,
    origin: "GZB",
    destination: "ALJN",
    scheduledDeparture: "17:10",
    delayMinutes: 2,
    status: "ON_TIME",
    assignedTrack: "DN_MAIN",
    nextStation: "KRJ",
    etaMinutes: 19
  }
];

// Multi-Department Maintenance Demands (TMS, SMMS, TDMS)
const INITIAL_MAINTENANCE_REQUESTS = [
  {
    id: "REQ-TMS-801",
    department: "TMS",
    deptName: "Engineering / Civil Track",
    deptBadge: "TMS Track",
    workType: "Ultrasonic Flaw Defect (USFD) Rail Replacement",
    location: "Khurja - Aligarh Section",
    startKm: 94.2,
    endKm: 95.8,
    trackAffected: "DN_MAIN",
    urgency: "CRITICAL",
    requestedDurationMinutes: 180,
    equipment: ["USFD Inspection Car", "Flash Butt Welding Gang", "Portal Crane"],
    gangStrength: 24,
    submissionDate: "2026-09-15 14:30",
    status: "PENDING_AI_FUSION",
    reason: "Severe internal rail head fatigue detected at weld joint WJ-410; potential IMR (Immediate Removal) defect."
  },
  {
    id: "REQ-TDMS-402",
    department: "TDMS",
    deptName: "Traction Distribution (TRD / Electrical)",
    deptBadge: "TDMS OHE",
    workType: "Overhead Catenary Wire Re-tensioning & Cantilever Inspection",
    location: "Khurja - Aligarh Section",
    startKm: 93.8,
    endKm: 96.5,
    trackAffected: "DN_MAIN",
    urgency: "HIGH",
    requestedDurationMinutes: 150,
    equipment: ["OHE Tower Wagon (TW-09)", "Ladder Trolley", "Earthing Rods Gang"],
    gangStrength: 14,
    submissionDate: "2026-09-15 16:10",
    status: "PENDING_AI_FUSION",
    reason: "Stagger deviation & contact wire wear exceeds 20% limit near KM 95. Requires 25kV traction power shutdown."
  },
  {
    id: "REQ-SMMS-619",
    department: "SMMS",
    deptName: "Signal & Telecommunication (S&T)",
    deptBadge: "SMMS Signal",
    workType: "Digital Axle Counter (DAC) Sensor Recalibration & Point Test",
    location: "Somna (between KRJ & ALJN)",
    startKm: 95.0,
    endKm: 95.6,
    trackAffected: "DN_MAIN",
    urgency: "MEDIUM",
    requestedDurationMinutes: 90,
    equipment: ["Signal Test Kit", "Multi-meter", "Electronic Interlocking Diagnostic Console"],
    gangStrength: 8,
    submissionDate: "2026-09-15 18:05",
    status: "PENDING_AI_FUSION",
    reason: "Intermittent wheel sensor pulse glitch reported during heavy rain; periodic safety calibration required."
  },
  {
    id: "REQ-TMS-802",
    department: "TMS",
    deptName: "Engineering / Civil Track",
    deptBadge: "TMS Track",
    workType: "Heavy Track Tamping & Ballast Regulating (09-3X Machine)",
    location: "Tundla - Etawah Section",
    startKm: 232.0,
    endKm: 236.4,
    trackAffected: "UP_MAIN",
    urgency: "MEDIUM",
    requestedDurationMinutes: 210,
    equipment: ["Plasser CSM Tamping Machine", "Ballast Regulating Machine BRM-12"],
    gangStrength: 18,
    submissionDate: "2026-09-15 11:20",
    status: "PENDING_AI_FUSION",
    reason: "Track Quality Index (TQI) dropped to 38. High-speed running comfort restoration."
  },
  {
    id: "REQ-TDMS-405",
    department: "TDMS",
    deptName: "Traction Distribution (TRD / Electrical)",
    deptBadge: "TDMS OHE",
    workType: "Neutral Section Ceramic Insulator Replacement",
    location: "Tundla - Etawah Section",
    startKm: 233.5,
    endKm: 235.0,
    trackAffected: "UP_MAIN",
    urgency: "MEDIUM",
    requestedDurationMinutes: 120,
    equipment: ["OHE Inspection Car", "Dielectric Test Rig"],
    gangStrength: 10,
    submissionDate: "2026-09-15 13:45",
    status: "PENDING_AI_FUSION",
    reason: "Micro-crack detected during infrared thermovision scanning. Power block essential."
  }
];

// Initial Approved / Active Blocks
const INITIAL_ACTIVE_BLOCKS = [
  {
    id: "BLK-2026-0916-01",
    bundleTitle: "GZB - Yard Turnout Renewal & Signalling Overhaul",
    departments: ["TMS", "SMMS"],
    location: "Ghaziabad Yard (KM 24.5 - 26.0)",
    track: "UP_LOOP",
    startTime: "01:30",
    endTime: "05:00",
    duration: 210,
    status: "ACTIVE",
    progressPercent: 62,
    corridorImpact: "LOW",
    trainsRegulated: ["Freight BCN/8812"],
    speedRestrictionKm: "20 km/h TSR on Turnout 102",
    approvedBy: "DRM / Prayagraj Div.",
    approvalTimestamp: "2026-09-15 22:15"
  }
];

// Rolling 26-Week Plan Quota and Historical Metrics
const ROLLING_PLAN_METRICS = {
  currentWeek: 18,
  totalTargetBlocks: 520,
  executedBlocks: 384,
  adHocBlocksAvoided: 142,
  punctualityRetention: "97.4%",
  cumulativeHoursSaved: 840,
  shadowWindowEfficiency: "+36.8%",
  departmentAllocation: {
    TMS: { quota: 220, fulfilled: 168, color: "#f59e0b" },
    SMMS: { quota: 140, fulfilled: 102, color: "#06b6d4" },
    TDMS: { quota: 160, fulfilled: 114, color: "#a855f7" }
  }
};
