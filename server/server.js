import express from 'express';
import cors from 'cors';
import http from 'http';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Mock Patients Database
const patients = [
  {
    id: '101',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    condition: 'Acute Myocardial Infarction',
    room: 'ICU-3A',
    status: 'Critical',
    baseline: { hr: 82, spo2: 96, bp_sys: 135, bp_dia: 85, rr: 18, temp: 37.2 }
  },
  {
    id: '102',
    name: 'Jane Smith',
    age: 29,
    gender: 'Female',
    condition: 'Severe Asthma Exacerbation',
    room: 'ER-B2',
    status: 'Guarded',
    baseline: { hr: 104, spo2: 91, bp_sys: 118, bp_dia: 75, rr: 24, temp: 36.8 }
  },
  {
    id: '103',
    name: 'Robert Chen',
    age: 67,
    gender: 'Male',
    condition: 'Post-Op Coronary Artery Bypass',
    room: 'ICU-1B',
    status: 'Stable',
    baseline: { hr: 68, spo2: 98, bp_sys: 110, bp_dia: 68, rr: 14, temp: 36.6 }
  },
  {
    id: '104',
    name: 'Sarah Patel',
    age: 34,
    gender: 'Female',
    condition: 'Diabetic Ketoacidosis',
    room: 'MedSurg-204',
    status: 'Stable',
    baseline: { hr: 95, spo2: 99, bp_sys: 125, bp_dia: 80, rr: 20, temp: 38.1 }
  },
  {
    id: '105',
    name: 'Marcus Vance',
    age: 78,
    gender: 'Male',
    condition: 'COPD Exacerbation & Pneumonia',
    room: 'ICU-2C',
    status: 'Critical',
    baseline: { hr: 76, spo2: 89, bp_sys: 142, bp_dia: 91, rr: 22, temp: 38.9 }
  }
];

// Mock Clinical Trials (FDA Pipeline) Database
const clinicalTrials = [
  {
    id: 'NCT05923184',
    drug: 'Memorall (Mem104)',
    sponsor: 'Aegis BioLabs Inc.',
    phase: 'Phase III',
    therapeuticClass: 'Neurology (Alzheimer\'s)',
    status: 'Active, recruiting',
    efficacy: '78% reduction in amyloid-beta plaques',
    estimatedCompletion: 'Dec 2026'
  },
  {
    id: 'NCT04889102',
    drug: 'CardioShield (CS-9)',
    sponsor: 'NovaTherapeutics LLC',
    phase: 'Phase II',
    therapeuticClass: 'Cardiology (Heart Failure)',
    status: 'Completed',
    efficacy: '18% increase in Left Ventricular Ejection Fraction',
    estimatedCompletion: 'May 2026'
  },
  {
    id: 'NCT06110293',
    drug: 'OncoVax-M',
    sponsor: 'BioGenix Oncology',
    phase: 'Phase I',
    therapeuticClass: 'Oncology (Melanoma Vaccine)',
    status: 'Active, recruiting',
    efficacy: 'High immunogenicity, T-cell response detected in 92% of subjects',
    estimatedCompletion: 'Jul 2027'
  },
  {
    id: 'NCT05012389',
    drug: 'InsuloGel',
    sponsor: 'Glucotech Pharma',
    phase: 'Phase III',
    therapeuticClass: 'Endocrinology (Type 1 Diabetes)',
    status: 'FDA Review Pending',
    efficacy: 'HbA1c lowered by average 1.4% over 24 weeks; once-weekly injection',
    estimatedCompletion: 'Completed'
  },
  {
    id: 'NCT05778811',
    drug: 'PulmoClear',
    sponsor: 'RespiCorp Therapeutics',
    phase: 'Phase II',
    therapeuticClass: 'Pulmonology (Cystic Fibrosis)',
    status: 'Active, recruiting',
    efficacy: 'Improved FEV1 scores by 22% over baseline',
    estimatedCompletion: 'Mar 2027'
  }
];

// Mock Medical News Data
const news = [
  {
    id: 1,
    time: '13:02',
    category: 'FDA APPROVAL',
    headline: 'FDA grants breakthrough designation to Aegis BioLabs Alzheimer therapy Memorall',
    source: 'AEGIS NEWS',
    content: 'The FDA has fast-tracked the approval process for Memorall after clinical data demonstrated significant clearance of amyloid-beta plaques in Phase III trials. Aegis BioLabs shares surged 14% on the news.'
  },
  {
    id: 2,
    time: '12:45',
    category: 'EPIDEMIOLOGY',
    headline: 'CDC reports H5N1 avian flu transmission index (R0) rises to 1.45 in regional clusters',
    source: 'CDC WIRE',
    content: 'Local health agencies are monitoring transmission chains in agricultural districts. While human-to-human spread remains limited, genetic sequencing indicates mutations facilitating mammal adaptation.'
  },
  {
    id: 3,
    time: '11:15',
    category: 'PHARMA',
    headline: 'NovaTherapeutics reports solid Phase II efficacy for CardioShield heart failure trials',
    source: 'AEGIS NEWS',
    content: 'CardioShield met its primary endpoints of improving exercise capacity and reducing BNP biomarkers. Partner stock is up, with Phase III initiation slated for late third quarter.'
  },
  {
    id: 4,
    time: '10:04',
    category: 'CLINICAL TRIALS',
    headline: 'Glucotech submits InsuloGel once-weekly insulin application for priority FDA review',
    source: 'REUTERS HEALTH',
    content: 'The Biologics License Application (BLA) includes data from the global Glyco-Safe trials. If approved, InsuloGel will be the first weekly basal insulin gel formulation in the US market.'
  },
  {
    id: 5,
    time: '08:30',
    category: 'INFRASTRUCTURE',
    headline: 'Trauma triage wait times rise 12% nationwide amid staffing and volume challenges',
    source: 'HEALTH DISPATCH',
    content: 'An annual study of 400 hospital emergency departments reveals average ER wait times have increased to 2.4 hours, driven by specialized staffing shortages in diagnostic radiology and nursing.'
  }
];

// Interactive Doctor Chat Simulator database
const doctorChats = {
  'dr-carter': {
    name: 'Dr. John Carter (ER Chief)',
    title: 'MD, Trauma Specialist',
    history: [
      { sender: 'dr-carter', text: 'Dr. Aegis, do you have the latest panel results on patient Jane Smith? Her vitals seem unstable.' }
    ],
    personality: (msg) => {
      const lower = msg.toLowerCase();
      if (lower.includes('smith') || lower.includes('102') || lower.includes('asthma')) {
        return 'Her respiratory rate is 24 and SpO2 is hovering around 91%. I have initiated nebulized albuterol and 2mg IV dexamethasone. We need to monitor closely. If she drops below 90%, we might need to intubate.';
      }
      if (lower.includes('doe') || lower.includes('101') || lower.includes('heart') || lower.includes('mi')) {
        return 'Doe is in ICU-3A. Cardiology did the angiogram; stented the LAD. Vitals are stabilized but keep an eye on his EKG. Any ventricular arrhythmia and we need lidocaine ready.';
      }
      return "I'm currently running triage in trauma bay 1. Let me know if you see any significant trend drops on the Aegis Terminal. We are short-staffed today.";
    }
  },
  'dr-house': {
    name: 'Dr. Gregory House (Diagnostics)',
    title: 'MD, Chief of Nephrology & Infectious Disease',
    history: [
      { sender: 'dr-house', text: 'Unless it\'s lupus (which it never is), don\'t waste my time. What are the symptoms?' }
    ],
    personality: (msg) => {
      const lower = msg.toLowerCase();
      if (lower.includes('lupus')) {
        return 'Still not lupus. Try again. Maybe actually look at the patient instead of staring at that glowing screen.';
      }
      if (lower.includes('cough') || lower.includes('copd') || lower.includes('vance') || lower.includes('105')) {
        return 'Marcus Vance is 78. He spent forty years inhaling coal dust or cigarettes, probably both. It is a severe pneumonia overlay. Run a sputum culture before throwing random carbapenems at him.';
      }
      return 'Everybody lies. Including the monitors. Run a toxicology screen, check for heavy metals, or just cure them. Whichever takes less effort.';
    }
  },
  'nurse-jackie': {
    name: 'Jackie Peyton (ICU Charge Nurse)',
    title: 'RN, ICU Lead Coordinator',
    history: [
      { sender: 'nurse-jackie', text: 'Hey there. I just finished shift handoff. ICU beds are completely full. Let me know how the patient telemetry looks.' }
    ],
    personality: (msg) => {
      const lower = msg.toLowerCase();
      if (lower.includes('help') || lower.includes('admin') || lower.includes('transfer')) {
        return 'I can try to squeeze a bed in step-down if we discharge Robert Chen (103). He is post-op day 3, stable, walking. Let me coordinate with the case worker.';
      }
      return 'If you need any lab work rushed, let me know. I have the pathology lab on speed dial. Sometimes you just have to bypass the system to get things done.';
    }
  },
  'aegis-ai': {
    name: 'Aegis Medical AI (Clinical Intelligence Bot)',
    title: 'Autonomous Diagnostics & Analytics Engine',
    history: [
      { sender: 'aegis-ai', text: 'System Online. Ready to process diagnostic queries, epidemiologic data, or FDA pipelines. Type help for command structures.' }
    ],
    personality: (msg) => {
      const lower = msg.toLowerCase();
      if (lower.includes('diagnose') || lower.includes('symptom') || lower.includes('predict')) {
        return 'ANALYSIS REPORT: Multi-modal clinical networks predict higher readmission risk (84.2%) for patient 105 (Vance) due to persistent hypercapnia. Suggest optimizing BIPAP settings.';
      }
      if (lower.includes('corona') || lower.includes('epidemic') || lower.includes('h5n1') || lower.includes('flu')) {
        return 'EPIDEMIOLOGY LOG: H5N1 strain shows standard hemagglutinin mutations. R0 of 1.45 indicates high local contagiousness in avian settings. Vector control and antiviral stockpiling (Oseltamivir) recommended.';
      }
      return 'Aegis AI clinical node operating at 99.8% capacity. I have queried global medical archives. If you need patient evaluation algorithms, please specify the patient ID.';
    }
  }
};

// GET all patients
app.get('/api/patients', (req, res) => {
  res.json(patients.map(p => ({
    id: p.id,
    name: p.name,
    age: p.age,
    gender: p.gender,
    condition: p.condition,
    room: p.room,
    status: p.status
  })));
});

// GET patient details
app.get('/api/patients/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  res.json(patient);
});

// Real-Time Telemetry Stream via Server-Sent Events (SSE)
app.get('/api/patients/:id/stream', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  // Set necessary SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial vital state
  let currentVitals = { ...patient.baseline };
  
  const sendVitals = () => {
    // Simulate natural vital sign fluctuations
    currentVitals.hr += (Math.random() - 0.5) * 2.5;
    currentVitals.spo2 += (Math.random() - 0.5) * 0.4;
    currentVitals.rr += (Math.random() - 0.5) * 0.8;
    currentVitals.temp += (Math.random() - 0.5) * 0.05;
    
    // Bounds check to keep values realistic
    currentVitals.hr = Math.max(Math.min(currentVitals.hr, patient.baseline.hr + 15), patient.baseline.hr - 15);
    currentVitals.spo2 = Math.max(Math.min(currentVitals.spo2, 100), patient.baseline.spo2 - 10);
    currentVitals.rr = Math.max(Math.min(currentVitals.rr, patient.baseline.rr + 6), patient.baseline.rr - 5);
    currentVitals.temp = Math.max(Math.min(currentVitals.temp, patient.baseline.temp + 1.5), patient.baseline.temp - 1.0);
    
    // Blood pressure updates occasionally
    if (Math.random() > 0.8) {
      currentVitals.bp_sys += Math.round((Math.random() - 0.5) * 4);
      currentVitals.bp_dia += Math.round((Math.random() - 0.5) * 2);
      
      currentVitals.bp_sys = Math.max(Math.min(currentVitals.bp_sys, patient.baseline.bp_sys + 12), patient.baseline.bp_sys - 12);
      currentVitals.bp_dia = Math.max(Math.min(currentVitals.bp_dia, patient.baseline.bp_dia + 8), patient.baseline.bp_dia - 8);
    }

    const telemetryData = {
      timestamp: new Date().toLocaleTimeString(),
      hr: Math.round(currentVitals.hr),
      spo2: parseFloat(currentVitals.spo2.toFixed(1)),
      rr: Math.round(currentVitals.rr),
      temp: parseFloat(currentVitals.temp.toFixed(1)),
      bp_sys: currentVitals.bp_sys,
      bp_dia: currentVitals.bp_dia
    };

    res.write(`data: ${JSON.stringify(telemetryData)}\n\n`);
  };

  sendVitals(); // Send immediately

  // Stream vitals every 1000ms
  const intervalId = setInterval(sendVitals, 1000);

  // Clean up on connection close
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});

// GET medical news
app.get('/api/news', (req, res) => {
  res.json(news);
});

// GET FDA clinical trial pipeline
app.get('/api/fda', (req, res) => {
  res.json(clinicalTrials);
});

// GET Healthcare Index Tickers
app.get('/api/indices', (req, res) => {
  res.json({
    indices: [
      { name: 'AEGIS BIOTECH INDEX', value: '3,842.10', change: '+42.50', pct: '+1.12%', trend: 'up' },
      { name: 'CDC EPIDEMIC LEVEL', value: '4.8', change: '+0.15', pct: '+3.23%', trend: 'up' },
      { name: 'FDA DRUG APPR RATE', value: '88%', change: '0.00', pct: '0.00%', trend: 'flat' },
      { name: 'US HOSP TRIAGE TIME (MIN)', value: '144', change: '+12.00', pct: '+9.09%', trend: 'up' },
      { name: 'MEDTECH SYNDICATE', value: '1,902.35', change: '-14.80', pct: '-0.77%', trend: 'down' },
      { name: 'FDA PH III SUCCESS RATE', value: '58.2%', change: '+0.40', pct: '+0.69%', trend: 'up' }
    ]
  });
});

// GET Doctor chat history
app.get('/api/chat/:doctorId', (req, res) => {
  const doc = doctorChats[req.params.doctorId];
  if (!doc) return res.status(404).json({ error: 'Doctor chat not found' });
  res.json({ name: doc.name, title: doc.title, history: doc.history });
});

// POST send message and get simulated response
app.post('/api/chat/:doctorId', (req, res) => {
  const { message } = req.body;
  const docId = req.params.doctorId;
  const doc = doctorChats[docId];
  if (!doc) return res.status(404).json({ error: 'Doctor chat not found' });

  // Add user message to history
  doc.history.push({ sender: 'user', text: message });

  // Generate bot reply
  const replyText = doc.personality(message);
  
  // Add bot reply to history after a simulated short delay (e.g. 500ms)
  setTimeout(() => {
    doc.history.push({ sender: docId, text: replyText });
  }, 300);

  res.json({
    history: doc.history,
    replyPending: true
  });
});

// Serve server test status
app.get('/health', (req, res) => {
  res.send('Aegis Server Active and Operational.');
});

// Start the server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`[Aegis Server] Backend running on port ${PORT}`);
});
