const { useState } = React;

// ============================================
// EXTRACTED CHAT PANEL COMPONENT
// ============================================
const ChatPanel = ({
  setChatOpen,
  chatMessages, setChatMessages,
  chatInput, setChatInput,
  chatLoading, setChatLoading,
  activeTab, setActiveTab,
  selectedVertical, setSelectedVertical,
  selectedLayer, setSelectedLayer,
  selectedPlayer, setSelectedPlayer
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const sendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: {
            activeTab,
            selectedVertical,
            selectedLayer,
            selectedPlayer
          }
        })
      });

      const data = await response.json();
      if (data.error) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect to AI. Please try again.' }]);
    }
    setChatLoading(false);
  };

  const handleChatClick = (e) => {
    if (e.target.tagName === 'A') {
      const href = e.target.getAttribute('href');
      if (href) {
        // Support both nav: and #nav: formats
        const target = href.startsWith('#') ? href.substring(1) : href;
        if (target.startsWith('nav:')) {
          e.preventDefault();
          const [scheme, path] = target.split(':');
          if (path) {
            const [tab, item] = path.split('/');
            if (tab) setActiveTab(tab);
            if (item) {
              if (tab === 'players') setSelectedPlayer(item);
              if (tab === 'industries') setSelectedVertical(item);
              if (tab === 'layers') setSelectedLayer(item);
            }
          }
        }
      }
    }
  };

  const suggestedQuestions = [
    "Explain the overall framework",
    "Build me a 60-min learning plan",
    "Structure a 2-hour founder session to identify opportunities"
  ];

  return (
    <div className={`fixed bottom-20 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-200 flex flex-col z-50 transition-all duration-300 ${isExpanded ? 'w-[50vw] h-[80vh]' : 'w-96 h-[500px]'}`}>
      <div className="bg-slate-800 text-white p-3 rounded-t-xl flex justify-between items-center cursor-pointer shadow-sm" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          <span className="font-bold">🤖 AI Assistant</span>
          <span className="text-xs bg-purple-600 px-2 py-0.5 rounded text-white hidden md:inline-block">Gemini 3.0 Pro</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="text-white hover:text-gray-300 text-lg"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? '↙️' : '↗️'}
          </button>
          <button onClick={(e) => { e.stopPropagation(); setChatOpen(false); }} className="text-white hover:text-gray-300 text-lg leading-none">&times;</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3" onClick={handleChatClick}>
        {chatMessages.length === 0 && (
          <div className="text-center text-gray-500 text-sm">
            <p className="mb-4">Ask me anything about the Physical AI framework!</p>
            <div className="space-y-2">
              {suggestedQuestions.map((q, i) => (
                <button key={i} onClick={() => setChatInput(q)} className="block w-full text-left px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-xs">{q}</button>
              ))}
            </div>
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} className={`p-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'}`}>
            <div className="prose prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0 [&_li_p]:my-0 [&_h1]:text-lg [&_h1]:my-2 [&_h2]:text-base [&_h2]:my-2 [&_h3]:text-sm [&_h3]:my-1 [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800" dangerouslySetInnerHTML={{ __html: msg.role === 'assistant' ? marked.parse(msg.content) : msg.content.replace(/\n/g, '<br/>') }} />
          </div>
        ))}
        {chatLoading && <div className="bg-gray-100 mr-8 p-2 rounded-lg text-sm text-gray-500">Thinking...</div>}
      </div>
      <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-xl">
        <div className="flex gap-2">
          <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask a question..." className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          <button onClick={sendMessage} disabled={chatLoading} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors shadow-sm">Send</button>
        </div>
      </div>
    </div>
  );
};

const PhysicalAIFramework = () => {
  const [activeTab, setActiveTab] = useState('start');
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedBattle, setSelectedBattle] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState('palantir');
  const [selectedVertical, setSelectedVertical] = useState('process');
  const [matrixView, setMatrixView] = useState('expanded');
  const [selectedLayer, setSelectedLayer] = useState('L6');
  const [selectedResource, setSelectedResource] = useState('playbooks');
  const [selectedModel, setSelectedModel] = useState('platform');
  const [useCaseView, setUseCaseView] = useState('byIndustry');
  const [useCaseIndustryFilter, setUseCaseIndustryFilter] = useState('all');
  const [useCaseLayerFilter, setUseCaseLayerFilter] = useState('all');
  const [useCaseImpactFilter, setUseCaseImpactFilter] = useState('all');

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // ============================================
  // CORE DATA STRUCTURES
  // ============================================

  const layers = [
    { id: 'L6', name: 'Intelligence', theme: 'The "Decision War"', description: 'Traditional methods vs AI: First-principles models and expert judgment vs learned intelligence.' },
    { id: 'L5', name: 'Supply Chain', theme: 'The "Network War"', description: 'Silos vs. Ecosystems. Single-enterprise vs. multi-tier network visibility.' },
    { id: 'L4', name: 'Enterprise', theme: 'The "Data Lake War"', description: 'Who owns the system of record? Legacy ERP vs. real-time cloud platforms.' },
    { id: 'L3', name: 'Operations', theme: 'The "Machine Brain War"', description: 'Who controls shop-floor decisions? Rigid MES vs. flexible AI agents.' },
    { id: 'L2', name: 'Control', theme: 'The "Edge War"', description: 'Who owns real-time control? Locked PLCs vs. open software-defined edge.' },
    { id: 'L1', name: 'Sensing', theme: 'The "Sensing War"', description: 'How is physical reality captured? Analog rules vs. digital sensor fusion.' },
    { id: 'L0', name: 'Physics', theme: 'The "Asset War"', description: 'What hardware runs operations? Brownfield modernization vs. greenfield.' },
    { id: 'L-1', name: 'Labor', theme: 'The "Skill War"', description: 'What happens to workers? Augment with AI copilots vs. replace with robots.' },
  ];

  const verticals = [
    { id: 'process', name: 'Process Manufacturing', subtitle: 'Food, Chem, Pharma' },
    { id: 'discrete', name: 'Discrete Manufacturing', subtitle: 'Autos, Electronics' },
    { id: 'energy', name: 'Energy', subtitle: 'Oil & Gas' },
    { id: 'utilities', name: 'Utilities', subtitle: 'Power, Water, Grid' },
    { id: 'mining', name: 'Mining', subtitle: 'Metals, Minerals' },
    { id: 'construction', name: 'Construction', subtitle: 'Critical Infrastructure' },
    { id: 'aerospace', name: 'Aerospace & Defense', subtitle: 'Gov, Space, Weapons' },
    { id: 'land', name: 'Land Transport', subtitle: 'Truck Fleets, Warehouses' },
    { id: 'maritime', name: 'Maritime Transport', subtitle: 'Shipping, Ports' },
    { id: 'datacenters', name: 'Data Centers', subtitle: '' },
  ];

  const layerColors = {
    'L6': 'bg-indigo-50 border-indigo-200',
    'L5': 'bg-violet-50 border-violet-200',
    'L4': 'bg-blue-50 border-blue-200',
    'L3': 'bg-cyan-50 border-cyan-200',
    'L2': 'bg-teal-50 border-teal-200',
    'L1': 'bg-green-50 border-green-200',
    'L0': 'bg-amber-50 border-amber-200',
    'L-1': 'bg-red-50 border-red-200',
  };

  const layerColorsDark = {
    'L6': 'bg-indigo-600',
    'L5': 'bg-violet-600',
    'L4': 'bg-blue-600',
    'L3': 'bg-cyan-600',
    'L2': 'bg-teal-600',
    'L1': 'bg-green-600',
    'L0': 'bg-amber-600',
    'L-1': 'bg-red-600',
  };

  // ============================================
  // MAIN MATRIX DATA (All 80 cells with Constraints)
  // ============================================

  const data = {
    // ==================== L6 - Intelligence ====================
    'L6-construction': {
      incumbents: ['Traditional structural/thermal CAE (ANSYS, Autodesk Simulation)', 'CPM/PERT scheduling engines and manual estimation heuristics', 'Rule-based generative design constrained by codes and loadings'],
      challengers: ['3D geometry foundation models (NVIDIA Get3D, Luma AI) generating buildable forms from prompts', 'Physics-informed AI validating structural and thermal performance without full FEA runs', 'AI scheduling engines (ALICE, nPlan) learning project dynamics end-to-end'],
      dynamics: 'Design and planning intelligence shifting from explicit engineering rules and CPM math to foundation models that learn structural behavior, construction sequencing and cost patterns from massive project datasets.',
      battle: 'Code-Based CAE & CPM Solvers vs. Generative 3D + Physics-Learned Scheduling',
      constraints: 'Project and equipment context changes every 6–36 months, so models must adapt without needing a rebuild each cycle. Data consolidation across contractors typically takes 4–12 weeks, and reliable learning loops usually require 3–12 months of consistent capture.'
    },
    'L6-datacenters': {
      incumbents: ['CFD thermal simulation (6SigmaET, Cadence, ANSYS Icepak)', 'Statistical capacity planning and PUE modeling', 'Workload forecasting based on historical trending'],
      challengers: ['Physics-informed neural networks for real-time thermal prediction without full CFD', 'Time-series foundation models (TimeGPT, Chronos) forecasting power and cooling loads', 'Digital twin reasoning engines that simulate rack placement, airflow and failover scenarios'],
      dynamics: 'Data center intelligence evolving from periodic CFD studies and statistical trending to always-on foundation models that predict thermal behavior, forecast demand and optimize placement in real time.',
      battle: 'Periodic CFD & Statistical Capacity Planning vs. Real-Time Physics + Forecasting FMs',
      constraints: 'Facilities run 10–20 years, but IT stacks refresh every 3–6 years, so telemetry and tooling churn is constant. Model updates can ship every 1–4 weeks, but operational acceptance and change reviews often take 4–12 weeks due to uptime risk.'
    },
    'L6-discrete': {
      incumbents: ['CAE suites for product simulation (ANSYS, Siemens NX, Dassault SIMULIA)', 'SPC/Six Sigma statistical quality models', 'Teach-pendant robot programming and explicit motion planning'],
      challengers: ['Vision-Language-Action (VLA) models learning manipulation end-to-end (Physical Intelligence π₀, Covariant RFM-1, Google RT-2)', 'Generative design engines that co-optimize form, material and manufacturability', 'Industrial sensor fusion models (Archetype AI Newton, Augury) detecting anomalies across vibration, thermal and acoustic streams'],
      dynamics: 'Factory intelligence shifting from explicit CAD/CAM programming and statistical process control to foundation models that learn to manipulate, design and diagnose from multimodal sensor data and demonstration.',
      battle: 'Explicit Robot Programming & Statistical QC vs. VLA Manipulation + Sensor Fusion FMs',
      constraints: 'Lines and automation often stay in place 10–25 years, but improvement programs run on quarterly (3-month) cycles. Getting enough labeled quality events often takes 3–9 months, and rollout to multiple lines typically takes 8–24 weeks.'
    },
    'L6-process': {
      incumbents: ['First-principles process simulators (AspenTech HYSYS, gPROMS, Honeywell UniSim)', 'Experiment-driven pharma R&D and scale-up', 'Statistical batch analytics and golden-batch comparisons'],
      challengers: ['Neural process surrogates that learn reaction kinetics and unit-op behavior from simulation + plant data (PhysicsX, NVIDIA Modulus)', 'Biological foundation models (EvolutionaryScale ESM3, Isomorphic Labs) designing molecules and predicting protein function', 'Time-series and sensor FMs detecting batch deviations and predicting yield in real time'],
      dynamics: 'Process intelligence evolving from first-principles simulation and wet-lab experimentation to foundation models that learn chemistry, biology and process dynamics–designing molecules in silico and predicting plant behavior without full mechanistic models.',
      battle: 'First-Principles Simulation & Wet-Lab R&D vs. Neural Surrogates + Bio/Chem FMs',
      constraints: 'Core assets last 20–40+ years, and major process changes often wait for shutdown windows every 2–5 years. Model iteration can be 2–8 weeks, but validation and governance for anything that influences operations commonly takes 4–12 weeks (or 3–12 months in heavily regulated sites).'
    },
    'L6-aerospace': {
      incumbents: ['High-fidelity CFD and FEA (ANSYS Fluent, Dassault SIMULIA, Siemens Star-CCM+)', 'Human-intensive mission planning and wargaming', 'Hand-coded autonomy stacks with explicit state machines'],
      challengers: ['Neural CFD surrogates accelerating aerodynamic and thermal design cycles 100-1000× (PhysicsX, NVIDIA Modulus)', 'VLA and world models powering autonomous drone swarms and attritable platforms (Skild AI, Physical Intelligence)', 'AI mission planners that learn operational art from simulation and historical campaigns (Palantir AIP, Anduril)'],
      dynamics: 'Aerospace intelligence shifting from compute-heavy CFD runs and doctrine-based planning to foundation models that learn fluid dynamics, vehicle control and mission sequencing–enabling rapid design iteration and autonomous operations.',
      battle: 'High-Fidelity CFD & Doctrine-Based Planning vs. Neural Surrogates + Autonomous World Models',
      constraints: 'Platforms and programs span 20–50 years, and tool/process changes can require 6–18 months of approvals. Data access and review cycles frequently take 8–24 weeks, and deployment certification/assurance can stretch 6–24 months depending on scope.'
    },
    'L6-energy': {
      incumbents: ['Reservoir simulators (SLB Eclipse/Intersect, CMG, Halliburton Nexus)', 'Decline curve analysis and type-curve forecasting', 'Physics-based flow assurance and facilities modeling'],
      challengers: ['Neural reservoir surrogates learning subsurface flow from simulation ensembles (NVIDIA Modulus, SLB AI)', 'Time-series foundation models forecasting production, ESP failures and emissions (TimeGPT, Nixtla)', 'Physics-informed digital twins that fuse seismic, production and maintenance data into unified predictive models'],
      dynamics: 'Upstream intelligence evolving from compute-intensive reservoir simulation and empirical decline curves to foundation models that learn subsurface physics–predicting flow, optimizing recovery and forecasting equipment health without re-running full simulations.',
      battle: 'Full-Physics Reservoir Simulation & Decline Curves vs. Neural Surrogates + Production FMs',
      constraints: 'Major assets live 20–40 years, and controls often remain 10–25 years, creating long-lived heterogeneity. Remote deployments can take 4–12 weeks per site, and model improvements usually need 3–9 months of stable operations data to generalize.'
    },
    'L6-utilities': {
      incumbents: ['Statistical load forecasting models tuned per utility', 'NWP-based renewable generation forecasting', 'Power-flow solvers and contingency analysis tools (PSS/E, PowerWorld, PSCAD)'],
      challengers: ['Time-series foundation models generalizing load and renewable forecasting across utilities (Google TimesFM, Salesforce Moirai, Nixtla TimeGPT)', 'Earth and atmosphere FMs improving solar/wind prediction (Google GraphCast, Jua, NVIDIA Earth-2)', 'Neural power-flow surrogates enabling real-time grid simulation and DER coordination'],
      dynamics: 'Grid intelligence shifting from utility-specific statistical models and batch power-flow studies to foundation models that generalize forecasting across regions and simulate grid behavior in real time–critical for managing millions of DERs.',
      battle: 'Utility-Specific Forecasting & Batch Power-Flow vs. Generalized Time-Series + Weather FMs',
      constraints: 'Infrastructure lifecycles are 30–60 years, with upgrade programs often planned 12–36 months ahead. Even if models update every 2–8 weeks, security and operations approvals commonly take 8–24 weeks (and procurement 12–36 months).'
    },
    'L6-maritime': {
      incumbents: ['Traditional weather routing services and manual voyage planning', 'CFD for hull and propeller design (ANSYS, Siemens, in-house naval architecture)', 'Statistical ETA models and bunker consumption curves'],
      challengers: ['Earth and atmosphere foundation models enabling hyper-local ocean/weather prediction (Sofar Ocean, Jua, Google GraphCast)', 'AI voyage optimization engines learning fuel-weather-schedule tradeoffs end-to-end (DeepSea, Bearing AI)', 'Physics-informed hull and propulsion twins that adapt to fouling and trim in real time'],
      dynamics: 'Maritime intelligence evolving from static weather routing and design-point CFD to foundation models that predict ocean conditions at high resolution and continuously optimize voyages for fuel, emissions and schedule.',
      battle: 'Static Weather Routing & Design-Point CFD vs. Ocean/Weather FMs + Continuous Voyage AI',
      constraints: 'Vessels last 20–30 years, and retrofit opportunities often align to dry-dock every 2.5–5 years. Connectivity can be intermittent for hours–days, and fleet-wide model rollout typically takes 8–24 weeks due to variability across ships.'
    },
    'L6-land': {
      incumbents: ['Operations research solvers for routing and scheduling (CPLEX, Gurobi, OR-Tools)', 'Statistical demand forecasting tuned per shipper/lane', 'Hand-engineered perception and planning stacks for AVs'],
      challengers: ['Vision-Language-Action and world models powering AV driving policies (Tesla FSD, Waymo, Physical Intelligence)', 'Time-series foundation models generalizing demand and ETA prediction across networks (Amazon Chronos, Nixtla)', 'End-to-end learned routing and dispatch that adapts to traffic, weather and constraints in real time'],
      dynamics: 'Transport intelligence shifting from OR solvers and hand-tuned forecasting to foundation models that learn driving behavior, predict demand patterns and optimize routing end-to-end–enabling autonomous trucks and AI-native logistics.',
      battle: 'OR Solvers & Hand-Tuned Forecasting vs. VLA Driving Models + Demand/Routing FMs',
      constraints: 'Fleet assets turn over in 5–12 years, but operational policies can change on monthly–quarterly (1–3 month) cycles. Data normalization across OEMs/devices often takes 4–12 weeks, and proven model lift usually needs 8–24 weeks of at-scale deployment.'
    },
    'L6-mining': {
      incumbents: ['Geostatistical block modeling (Leapfrog, Vulcan, Datamine, Surpac)', 'Geomechanical and blast simulation tools', 'Fleet simulation and discrete-event scheduling'],
      challengers: ['AI-enhanced orebody models that fuse drilling, assay and sensor data with learned geological priors', 'Physics-informed geomechanics surrogates predicting slope stability and ground support needs', 'Industrial sensor fusion models (Archetype AI, Augury) detecting haul-truck and crusher anomalies across vibration, thermal and acoustic streams'],
      dynamics: 'Mining intelligence evolving from kriging-based block models and periodic geotechnical studies to foundation models that learn geology, predict ground behavior and diagnose equipment health–enabling continuous orebody updates and predictive operations.',
      battle: 'Kriging & Periodic Geotechnical Studies vs. Learned Geology + Sensor Fusion FMs',
      constraints: 'Mobile fleets last 7–15 years while fixed plants last 20–40 years, creating mixed constraints. Connectivity can be limited for hours–days, and reliable model training typically requires 3–12 months of consistent shift-level data.'
    },

    // ==================== L5 - Supply Chain ====================
    'L5-construction': {
      incumbents: ['Point-to-point supplier relationships managed in spreadsheets', 'Distributor-held inventory with limited visibility', 'Separate rental, material, and subcontractor databases'],
      challengers: ['Construction-specific supply chain platforms (STACK, Kojo, Raiven) aggregating pricing and availability', 'Equipment fleet optimization across companies (e.g., United Rentals digital platform)', 'Palantir Foundry-style project supply twins linking site schedules with supplier lead times'],
      dynamics: 'Material and equipment visibility expanding from jobsite-only to multi-project and multi-company, with cloud platforms aggregating demand signals to negotiate pricing, pre-position inventory and reduce waste.',
      battle: 'Project-by-Project Procurement vs. Network-Wide Supply Sensing & Optimization',
      constraints: 'Projects run 6–36 months, and supplier commitments often change weekly over 4–24 weeks of critical phases. Cross-party integration usually takes 8–24 weeks, and procurement/contract cycles can run 3–12 months.'
    },
    'L5-datacenters': {
      incumbents: ['Hyperscaler internal siting and procurement systems', 'Regional power-market planning tools (PLEXOS, Aurora)', 'Server/switch lead-time tracking in ERPs'],
      challengers: ['AI-driven site selection balancing power, water, latency and incentives', 'Network-wide capacity marketplaces (Equinix Fabric-style) matching supply and demand', 'Chip and server supply-risk platforms integrating geopolitical and fab capacity signals'],
      dynamics: 'Data center capacity planning evolving from per-site decisions to networked optimization across power markets, connectivity exchanges and hardware supply chains.',
      battle: 'Siloed Site Planning vs. AI-Orchestrated Multi-Site Capacity Networks',
      constraints: 'Capacity plans follow quarterly–annual (3–12 month) horizons, while component lead times can be 3–18 months. Integrating procurement + demand signals typically takes 4–12 weeks, but process alignment across teams often takes 8–24 weeks.'
    },
    'L5-discrete': {
      incumbents: ['SAP APO/IBP, Oracle SCM, Blue Yonder', 'EDI-based supplier networks', 'Siloed PLM systems that don\'t talk to procurement'],
      challengers: ['Real-time visibility networks (project44, FourKites, Elementum)', 'AI control towers (o9, Kinaxis, E2open) sensing disruptions and triggering replans', 'Supplier collaboration platforms linking design changes to supply impact (Supplyframe)'],
      dynamics: 'Multi-tier supply chains becoming transparent and responsive, with control towers ingesting signals from ports, roads, factories and weather to recommend actions–minutes instead of weeks.',
      battle: 'Quarterly MRP Batches vs. Always-On AI Control Towers Sensing & Responding',
      constraints: 'Planning cycles operate weekly over 4–12 weeks, but supplier lead times are often 2–9 months for critical parts. EDI/integration stabilization commonly takes 8–20 weeks, and org-wide process change takes 3–9 months.'
    },
    'L5-process': {
      incumbents: ['SAP APO/IBP, Kinaxis, Blue Yonder', 'Procurement-heavy pharma supply chains with manual demand sensing', 'Commodity trading desks separate from production planning'],
      challengers: ['AI-driven demand sensing linking POS, weather, and consumption signals to production schedules', 'Serialization and track-and-trace platforms (TraceLink, SAP ATTP) enabling end-to-end visibility', 'Integrated S&OP platforms unifying commercial, production, and supply planning (o9, Anaplan)'],
      dynamics: 'Complex multi-stage formulation supply chains shifting from siloed S&OP cycles to continuous, AI-driven planning that links final demand, inventory, shelf life and production constraints.',
      battle: 'Monthly S&OP Cycles vs. Continuous AI-Driven Demand Sensing & Response',
      constraints: 'Inputs and logistics can lock decisions for 3–12 months, especially for regulated or specialized feedstocks. Cross-site planning standardization typically takes 3–9 months, and major supplier qualification can take 3–12 months.'
    },
    'L5-aerospace': {
      incumbents: ['Prime-centric supply chains with thousands of Tier-1/2/3 suppliers managed via EDI and portals', 'Long-cycle MRP (18-36 month lead times)', 'Separate logistics, MRO and production supply chains'],
      challengers: ['Digital thread platforms (Palantir, Exostar, SAP) linking design, production and service supply chains', 'AI supplier-risk sensing tying geopolitical, financial and quality signals (C3 AI, Resilinc)', 'Additive manufacturing enabling on-demand, distributed production of long-lead parts'],
      dynamics: 'Defense and commercial aero supply chains under pressure to shrink lead times and improve resilience–driving digital thread adoption and multi-tier visibility across tens of thousands of suppliers.',
      battle: '18-Month Lead Times & Single-Source Risk vs. Digital Thread + Distributed Manufacturing',
      constraints: 'Program supply chains run on 12–60 month schedules, and supplier qualification/certification can take 6–24 months. Data sharing agreements and systems integration frequently take 3–9 months, even before optimization starts.'
    },
    'L5-energy': {
      incumbents: ['Integrated majors with internal trading, logistics and procurement', 'Commodity trading platforms (ICE, CME) separate from physical scheduling', 'Oilfield service procurement via RFPs and frame contracts'],
      challengers: ['Network twins integrating physical, commercial and carbon flows (Palantir, Cognite)', 'AI-driven trading and scheduling platforms linking production to market signals', 'Carbon tracking and offset platforms integrated with supply chain'],
      dynamics: 'Upstream supply chains linking wells, pipelines, trading desks and offtakers into unified digital twins–optimizing not just cost but carbon intensity, offtake commitments and hedging.',
      battle: 'Siloed Trading & Logistics vs. Integrated Network Twins Balancing Molecules, Markets & Carbon',
      constraints: 'Spares and logistics decisions can be constrained by lead times of 3–18 months for critical equipment. Remote inventory visibility improvements often take 8–24 weeks, and contracting cycles can take 6–18 months.'
    },
    'L5-utilities': {
      incumbents: ['ISO/RTO wholesale markets (CAISO, PJM, ERCOT)', 'Bilateral PPAs managed in spreadsheets', 'T&D planning as separate long-cycle processes'],
      challengers: ['DER aggregation platforms creating virtual supply (Sunrun, Tesla, AutoGrid)', 'AI-native grid-edge coordination linking EVs, batteries, solar (WeaveGrid, ev.energy)', 'Real-time carbon-aware dispatch and settlement platforms'],
      dynamics: 'The grid supply chain fragmenting from centralized generation to millions of distributed resources–requiring new market mechanisms, visibility and orchestration.',
      battle: 'Centralized Generation & Long-Cycle T&D Planning vs. DER Aggregators & Real-Time Coordination',
      constraints: 'Storm readiness and maintenance planning operate on seasonal–annual (6–12 month) cycles, but procurement often takes 12–36 months. Standardizing suppliers/inventory processes across regions commonly takes 6–18 months.'
    },
    'L5-maritime': {
      incumbents: ['Container booking platforms (Maersk, CMA CGM, INTTRA)', 'Freight forwarder networks', 'Port-centric visibility tools'],
      challengers: ['Digital freight networks with end-to-end visibility (Flexport, Freightos, project44)', 'AI-driven container repositioning and booking optimization', 'Carbon-aware routing and modal-shift platforms'],
      dynamics: 'Shipping visibility extending from port-to-port to door-to-door, with AI optimizing bookings, repositioning empty containers and selecting routes based on cost, time and emissions.',
      battle: 'Port-to-Port Visibility vs. AI-Orchestrated, Carbon-Aware Door-to-Door Networks',
      constraints: 'Spares and port logistics are planned weeks ahead over 2–12 weeks, but procurement for critical spares can be 3–12 months. Fleet-wide adoption across ports and vendors typically takes 3–9 months.'
    },
    'L5-land': {
      incumbents: ['SAP TM/Oracle OTM (large-shipper TMS)', 'Blue Yonder/Manhattan (integrated transport + distribution)', 'Legacy carrier TMS platforms'],
      challengers: ['project44/FourKites visibility networks', 'Digital freight networks (Uber Freight, Convoy, Transfix)', 'Samsara/Motive telematics as de facto network datasets'],
      dynamics: 'Real-time load matching and lane balancing across fragmented carrier networks, under pressure from service-level, cost and carbon commitments.',
      battle: 'Load Boards & Static Routing Guides vs. Always-On AI-Optimized Transport Networks',
      constraints: 'Network planning updates weekly over 4–12 weeks, while equipment/parts lead times can be 2–9 months. Integrations with shippers/carriers usually take 6–20 weeks, and full operating-model change takes 3–9 months.'
    },
    'L5-mining': {
      incumbents: ['Integrated miners with internal logistics (BHP, Rio, Vale)', 'Commodity traders with separate physical and financial books', 'Port/rail operators as bottlenecks'],
      challengers: ['Integrated pit-to-port digital twins optimizing extraction, processing and logistics together (Palantir, Cognite)', 'AI-driven blending and stockpile optimization', 'Carbon and ESG tracking integrated with supply chain'],
      dynamics: 'Mining supply chains linking orebody models, processing, rail, port and shipping into continuous optimization–balancing grade, throughput, logistics and emissions.',
      battle: 'Fragmented Pit-to-Port Handoffs vs. Integrated Digital Twins Optimizing Mine-to-Market',
      constraints: 'Critical spares can have lead times of 6–18 months, making planning errors very expensive. Site-to-HQ process alignment typically takes 8–24 weeks, and vendor/contractor harmonization takes 6–18 months.'
    },

    // ==================== L4 - Enterprise ====================
    'L4-construction': {
      incumbents: ['Project-centric ERPs (Viewpoint Vista, Sage 300 CRE, CMiC)', 'Separate job-costing and accounting systems', 'Spreadsheet-heavy cash-flow and WIP management'],
      challengers: ['Cloud-native construction ERPs (Procore Financials, Autodesk Construction Cloud, Oracle Aconex)', 'AI-driven project cost forecasting and cash-flow prediction', 'Unified project-to-portfolio analytics platforms'],
      dynamics: 'Construction finance shifting from job-by-job Excel tracking to cloud platforms that unify cost, schedule, change orders and cash flow across portfolios.',
      battle: 'Spreadsheet-Heavy Job Costing vs. AI-Driven Project Portfolio Finance',
      constraints: 'Project systems change every 6–36 months, but asset records need to persist 10–30+ years into operations. Master data and identity alignment typically takes 8–24 weeks, and tool consolidation often takes 6–18 months.'
    },
    'L4-datacenters': {
      incumbents: ['Hyperscaler internal finance systems', 'Colo billing platforms (legacy data center ERP)', 'Separate CapEx tracking for builds and OpEx for operations'],
      challengers: ['Unified TCO platforms linking power, space, cooling and IT workloads to cost', 'AI-driven capacity-to-revenue optimization', 'Carbon accounting platforms integrated with finance'],
      dynamics: 'Data center finance evolving from siloed CapEx/OpEx tracking to integrated models linking capacity, utilization, power costs and sustainability metrics.',
      battle: 'Siloed CapEx/OpEx Tracking vs. Integrated Capacity-to-Revenue AI Platforms',
      constraints: 'Facilities persist 10–20 years, while software and telemetry stacks change every 6–24 months. IAM, policy, and integration approvals often take 4–12 weeks, and enterprise rollout typically takes 8–24 weeks.'
    },
    'L4-discrete': {
      incumbents: ['SAP S/4HANA, Oracle Cloud ERP, Epicor, Infor', 'Separate MES cost allocation and ERP reporting', 'Monthly close cycles with manual variance analysis'],
      challengers: ['AI-native enterprise platforms (Palantir Foundry, C3 AI) linking shop floor to P&L in real time', 'Process mining exposing cost leakage (Celonis)', 'Cloud ERP with embedded analytics (Workday, Oracle Fusion)'],
      dynamics: 'Manufacturing enterprises shifting from monthly batch closes and manual variance analysis to real-time shop-floor-to-P&L visibility, with AI identifying cost leakage and margin opportunities.',
      battle: 'Monthly Close & Manual Variance Analysis vs. Real-Time AI-Driven Enterprise Visibility',
      constraints: 'ERP/MES customizations can persist 5–15 years, making standardization slow. Master data cleanup commonly takes 8–20 weeks, and cross-plant standard rollout often takes 6–18 months.'
    },
    'L4-process': {
      incumbents: ['SAP S/4HANA, Oracle ERP Cloud, Infor CloudSuite', 'Separate batch costing and ERP financials', 'Compliance-driven reporting cycles'],
      challengers: ['AI-native enterprise platforms (Palantir Foundry, Databricks/Snowflake) unifying batch, quality, maintenance and cost data', 'Process mining exposing hidden costs (Celonis)', 'Integrated planning platforms (Anaplan, o9) linking commercial and operations'],
      dynamics: 'Process manufacturers shifting from compliance-first batch reporting to AI-driven cost and yield optimization across campaigns, with real-time visibility into deviations and root causes.',
      battle: 'Compliance-First Batch Reporting vs. AI-Driven Cost & Yield Optimization Platforms',
      constraints: 'Enterprise process standards may persist 10–25 years, and plant system diversity can take 6–18 months to normalize. Data model alignment often takes 8–24 weeks, while governance and change control can add 3–9 months.'
    },
    'L4-aerospace': {
      incumbents: ['SAP, Oracle ERP', 'IFS (strong in A&D MRO)', 'Program-centric cost accounting with EAC/ETC'],
      challengers: ['Palantir and similar platforms unifying program cost, schedule and technical performance', 'AI-driven EAC forecasting and risk identification', 'Digital thread linking design changes to cost impact'],
      dynamics: 'Aerospace enterprises shifting from periodic EAC updates and manual variance analysis to continuous AI-driven program performance visibility across cost, schedule and technical baselines.',
      battle: 'Periodic EAC Reviews & Program Silos vs. Continuous AI-Driven Program Performance',
      constraints: 'Program governance runs 12–60 months, and systems must remain auditable for 10–30+ years. Security reviews commonly take 8–24 weeks, and certified enterprise workflow changes can take 6–24 months.'
    },
    'L4-energy': {
      incumbents: ['SAP S/4HANA, Oracle ERP, Quorum (upstream)', 'Separate joint-venture accounting and production allocation', 'Land, royalty and revenue accounting systems'],
      challengers: ['Palantir/Cognite-based enterprise platforms unifying production, commercial and financial data', 'AI-driven capital allocation and portfolio optimization', 'Integrated carbon accounting with financial reporting'],
      dynamics: 'Energy enterprises shifting from siloed JIB, production and commercial accounting to unified platforms linking wells, contracts, partners and P&L with AI-driven capital allocation.',
      battle: 'Siloed JIB & Production Accounting vs. Unified AI-Driven Enterprise Platforms',
      constraints: 'Asset records last 20–40 years, but enterprise platform migrations often run 6–24 months. Integration across fields/refineries typically takes 8–24 weeks per domain, and security segmentation adds 4–12 weeks of approvals.'
    },
    'L4-utilities': {
      incumbents: ['SAP IS-U, Oracle Utilities, legacy CIS (Customer Information Systems)', 'Separate T&D asset accounting and customer billing', 'Regulatory reporting as batch processes'],
      challengers: ['AI-driven customer analytics and revenue optimization (Bidgely, Itron Analytics)', 'Unified asset-to-customer platforms', 'Real-time regulatory compliance and rate-case analytics'],
      dynamics: 'Utilities shifting from siloed asset and customer accounting to integrated platforms linking grid investment, customer value and regulatory outcomes.',
      battle: 'Siloed Asset & Customer Accounting vs. Integrated AI-Driven Utility Platforms',
      constraints: 'Infrastructure planning cycles are 12–36 months, and enterprise systems can remain 10–20 years. Cybersecurity and governance approvals often take 8–24 weeks, and procurement cycles can be 12–36 months.'
    },
    'L4-maritime': {
      incumbents: ['Maritime ERPs (Veson IMOS, Danaos, Masterbulk)', 'Separate voyage accounting and corporate finance', 'Terminal billing and port accounting systems'],
      challengers: ['AI-driven voyage P&L and fleet optimization (Windward, ZeroNorth)', 'Unified shipping-to-terminal-to-hinterland financial visibility', 'Carbon accounting integrated with voyage economics'],
      dynamics: 'Maritime enterprises shifting from voyage-by-voyage P&L to fleet-wide optimization linking charter rates, fuel costs, port fees and carbon prices.',
      battle: 'Voyage-by-Voyage P&L vs. AI-Optimized Fleet Economics with Carbon Integration',
      constraints: 'Fleet data must persist 20–30 years, but onboard systems vary across ships for 5–20 years. Data standardization commonly takes 8–24 weeks, and fleet-wide rollout usually takes 3–9 months due to vessel scheduling.'
    },
    'L4-land': {
      incumbents: ['Carrier ERPs and accounting (McLeod, TMW, Oracle)', 'Shipper ERPs with transportation modules', 'Freight forwarder finance and accounting systems'],
      challengers: ['AI-driven lane profitability and network optimization', 'Real-time cost-to-serve analytics', 'Unified shipper-carrier financial platforms'],
      dynamics: 'Transport enterprises shifting from load-by-load margin analysis to network-wide profitability optimization with AI identifying unprofitable lanes and customers.',
      battle: 'Load-by-Load Margin Analysis vs. AI-Driven Network Profitability Optimization',
      constraints: 'Fleet systems evolve over 2–6 years, while compliance records may need retention of 5–10+ years. Integrations typically take 6–20 weeks, and enterprise process changes take 3–9 months.'
    },
    'L4-mining': {
      incumbents: ['SAP, Oracle, Ellipse (ABB/Hitachi)', 'Separate mine-site and corporate accounting', 'Joint-venture and royalty accounting systems'],
      challengers: ['Palantir/Cognite-based platforms unifying orebody, production and cost data', 'AI-driven capital allocation across mines and projects', 'Integrated ESG and financial reporting'],
      dynamics: 'Mining enterprises shifting from mine-site-centric accounting to orebody-to-capital-allocation integration, with AI optimizing investment across deposits, equipment and infrastructure.',
      battle: 'Mine-Site-Centric Accounting vs. Orebody-to-Capital AI-Driven Optimization',
      constraints: 'Fixed plant assets persist 20–40 years, and enterprise standardization across remote sites can take 6–18 months. Connectivity/OT constraints can add 4–12 weeks per rollout, and master data work takes 8–24 weeks.'
    },

    // ==================== L3 - Operations ====================
    'L3-construction': {
      incumbents: ['Procore (project and field management)', 'Autodesk Construction Cloud/BIM 360 (coordination and issue tracking)', 'Oracle Aconex and Primavera for project controls'],
      challengers: ['AI-driven progress and variance engines (Buildots, OpenSpace, Disperse) tying reality capture to schedule and cost', 'Construction scheduling and optimization platforms (ALICE, nPlan) simulating alternatives', 'Jobsite control tower layers integrating RFIs, materials, equipment and safety into one live view'],
      dynamics: 'Day-to-day jobsite brain shifting from superintendent memory, RFIs and weekly coordination meetings to continuous, AI-generated views of what is built, what is blocked and what should happen next.',
      battle: 'Superintendent\'s Notebook & PDFs vs. AI-Driven Jobsite Control Planes',
      constraints: 'Daily execution changes week-to-week over 4–12 weeks, so tools must fit frontline routines fast. Training and adoption typically take 2–8 weeks per crew, and site-wide behavior change takes 3–6 months.'
    },
    'L3-datacenters': {
      incumbents: ['Schneider EcoStruxure IT', 'Vertiv DCIM/Trellis', 'Sunbird and Nlyte DCIM platforms tracking assets, capacity and alarms'],
      challengers: ['EkkoSense and similar AI thermal/capacity analytics layered on DCIM', 'EasyDCIM and other automation-first DC operations platforms', 'Custom Palantir/Databricks-based operations consoles at hyperscalers and large colocations'],
      dynamics: 'DCIM is evolving from an asset and alarm database into a real-time operations brain that coordinates IT, facilities, maintenance and SLAs across halls and sites.',
      battle: 'Static DCIM Dashboards vs. AI-Native Data Center Operations Control Planes',
      constraints: 'Operational changes must protect uptime 24/7, so rollout is staged over 2–8 weeks with strict runbooks. Incident and change-review cycles often take 1–4 weeks, and permissioning for automation can take 4–12 weeks.'
    },
    'L3-discrete': {
      incumbents: ['MES/MOM suites (Siemens Opcenter, Rockwell Plex, Dassault Apriso)', 'SCADA/HMI stacks tied to specific lines and cells', 'Hard-coded routing and scheduling rules embedded in MES'],
      challengers: ['Low-code/no-code MES and connected-worker platforms (Tulip, QAD Redzone) that let plants reconfigure flows quickly', 'Palantir Warp Speed and similar AI scheduling/dispatch layers coordinating work orders, materials and machines', 'Cloud manufacturing platforms that virtualize factories as software objects'],
      dynamics: 'Factory operations shifting from rigid MES that encode yesterday\'s assumptions to AI and agent-based systems that can dynamically re-route, re-balance and re-sequence work based on real-time conditions.',
      battle: 'Rigid, Vendor-Heavy MES vs. Software-Defined, AI-Orchestrated Factories',
      constraints: 'Line changes often happen in maintenance windows weekly–monthly (1–4 weeks), limiting experimentation. Shift adoption typically takes 4–12 weeks, and consistent performance lift usually requires 8–24 weeks.'
    },
    'L3-process': {
      incumbents: ['Batch and manufacturing execution systems for regulated industries (Emerson Syncade, Körber/Werum PAS-X, Honeywell PKS MES)', 'Historian-centric SCADA views (OSIsoft PI, Honeywell PHD) at the operations center', 'Paper- and Excel-heavy SOP and deviation management around the MES'],
      challengers: ['Modern MES/MX and electronic batch record platforms with native AR/connected-worker interfaces (Apprentice.io, Tulip)', 'Palantir- and Cognite-powered operations hubs combining historian, lab, maintenance and ERP data', 'AI co-pilots that propose schedule, setpoint and campaign adjustments constrained by GMP and safety'],
      dynamics: 'Operations moving from MES as a compliance/reporting system to MES + AI hubs as an operations brain that continuously optimizes campaigns, changeovers, yield and energy within regulatory limits.',
      battle: 'Compliance-First MES/SCADA vs. Optimization-First, AI-Augmented Operations Hubs',
      constraints: 'Operators optimize over long runs, but meaningful process adjustments often wait for windows monthly–quarterly (1–3 months). SOP changes typically take 4–12 weeks to train, and governance for operational changes can take 8–24 weeks.'
    },
    'L3-aerospace': {
      incumbents: ['Theater- and domain-specific C2/BM systems (Lockheed C2BMC, Northrop IBCS, Raytheon Solipsys)', 'Service-specific operations centers with limited cross-domain fusion', 'Playbooks encoded in doctrine and human staff processes'],
      challengers: ['Palantir Gotham/Foundry powering joint all-domain ops centers', 'Anduril Lattice and similar kill-web platforms that orchestrate sensors and shooters in real time', 'Shield AI and other autonomy providers integrating vehicle behavior with C2 logic'],
      dynamics: 'Operational decision-making moving from monolithic, service-specific C2 systems to modular mission systems that can plug in new sensors, shooters and autonomy while keeping humans on-the-loop.',
      battle: 'Monolithic, Service-Centric C2 vs. Modular, AI-Augmented Kill-Web Brains',
      constraints: 'Operations are documentation-heavy, and process changes often require 8–24 weeks of review. Training on new workflows typically takes 4–12 weeks, and full production adoption can take 6–18 months.'
    },
    'L3-energy': {
      incumbents: ['Integrated reservoir and production platforms (SLB Delfi, Halliburton Landmark, Baker Hughes JewelSuite)', 'SCADA-based control rooms focused on alarms and uptime', 'Point solutions for planning, scheduling and maintenance not tightly integrated'],
      challengers: ['Palantir AIP/Foundry and Cognite-based operational twins that unify subsurface, production, maintenance and commercial views', 'C3 AI and similar application suites optimizing production, reliability and emissions together', 'In-house "integrated operations" centers using data lakes to drive cross-discipline decisions'],
      dynamics: 'IOC/independent control rooms evolving from alarm and KPI dashboards into integrated operations centers where AI agents help decide which wells to choke, which maintenance to defer and how to balance production, OPEX and emissions.',
      battle: 'SCADA- and Dashboard-Centric Control Rooms vs. AI-Driven Integrated Operations Centers',
      constraints: 'Field ops are distributed, so rollout across sites often takes 4–12 weeks per site. Training cycles typically take 4–12 weeks, and sustained operational improvement often needs 3–9 months.'
    },
    'L3-utilities': {
      incumbents: ['ADMS and DMS suites (GE Vernova ADMS, Schneider EcoStruxure ADMS, Siemens Spectrum Power)', 'EMS systems in transmission operators', 'Outage management systems (OMS) and call-center tools'],
      challengers: ['Kraken (Octopus), AutoGrid and other DER- and customer-centric operations platforms', 'Palantir-based grid and customer operations twins', 'Utility operations "cockpits" that blend ADMS, OMS, customer and market data into one AI-assisted control room view'],
      dynamics: 'Grid and utility operations moving from one-way, asset-centric control rooms to customer- and DER-centric operations that treat millions of endpoints as controllable resources.',
      battle: 'Asset/Feeder-Centric ADMS vs. DER- and Customer-Centric Grid Operations Brains',
      constraints: 'Field workflows are governed by procedures and unions, so changes are phased over 8–24 weeks. Storm seasons and annual planning create cycles of 6–12 months, and tool adoption can take 3–9 months.'
    },
    'L3-maritime': {
      incumbents: ['Port terminal operating systems (Navis N4, CyberLogitec, TSB)', 'Legacy planning and yard modules attached to TOS', 'Standalone stowage and berth-planning tools'],
      challengers: ['PortChain and Awake.ai optimization layers for berthing, crane and yard operations', 'Digital twins of terminals and ports simulating what-if scenarios across vessels, yard and hinterland', 'Integrated port community operations platforms linking shipping lines, terminals, pilots and hinterland carriers'],
      dynamics: 'Port and terminal operations shifting from locally optimized, TOS-centric dispatch to network- and berth-aware control planes that continuously optimize quay, yard and gate flows.',
      battle: 'TOS-Centric, Queue-Based Ops vs. AI-Optimized Port and Terminal Control Centers',
      constraints: 'Crew rotation cycles can be 2–6 months, so training and adoption must fit handoffs. Connectivity gaps of hours–days require offline-first workflows, and fleet-wide rollout often takes 3–9 months.'
    },
    'L3-land': {
      incumbents: ['TMS/FMS platforms for dispatch and fleet operations (Oracle OTM, McLeod, Trimble TMW)', 'WMS and yard management systems (Manhattan WMS, Blue Yonder WMS, Körber/HighJump)', 'Legacy load-planning and dock-scheduling tools'],
      challengers: ['AI-native dynamic routing and dispatch (Wise Systems, Onfleet, Uber Freight-style optimizers)', 'Robotics-centric warehouse orchestration (Ocado Hive, AutoStore controllers, GreyOrange and Locus orchestration layers)', 'Integrated control towers that blend TMS/WMS/yard/robot data into a single operational brain'],
      dynamics: 'Operations shifting from daily/shift-based static plans to continuously optimized routing, slotting and dock-door assignments that respond to traffic, labor and capacity in real time.',
      battle: 'Static Routes & Wave Picking vs. Continuous AI Dispatch & Orchestration',
      constraints: 'Dispatcher/driver routines change weekly over 4–12 weeks, but adoption must be fast to stick. Training typically takes 1–6 weeks, while measurable safety/uptime improvements usually require 8–24 weeks.'
    },
    'L3-mining': {
      incumbents: ['Mine fleet-management and dispatch systems (Modular Mining, Cat MineStar, Hexagon/Jigsaw)', 'Local control rooms monitoring haulage, crushing, processing and rail separately', 'Spreadsheets and point tools stitching together mine plans and daily operations'],
      challengers: ['Palantir and similar platforms creating pit-to-port operational twins', 'Petra and other optimization tools tying mine planning, drilling, blasting and haulage together', 'Site-wide operations centers that coordinate fleets, plants and logistics using AI recommendations'],
      dynamics: 'Mining operations moving from siloed dispatch and process control to pit-to-port optimization where one operations brain balances ore quality, volume, energy and logistics constraints.',
      battle: 'Local Dispatch & Control Rooms vs. Integrated, AI-Optimized Pit-to-Port Operations Brains',
      constraints: 'Shift-based workflows make adoption incremental over 4–12 weeks. Remote conditions can delay rollout by 2–8 weeks, and sustained productivity/safety gains usually require 3–9 months.'
    },

    // ==================== L2 - Control ====================
    'L2-construction': {
      incumbents: ['Manually operated excavators, cranes and loaders (Caterpillar, Komatsu, Liebherr)', 'Traditional surveying stations and rovers (Trimble, Topcon, Leica)', 'Standalone safety systems (gas monitors, proximity sensors) with local alarms only'],
      challengers: ['Machine-control systems linking GPS/IMU, sensors and blade/bucket automation (Trimble Earthworks, Topcon, Leica, Built Robotics)', 'ROS/ROS-Industrial edge gateways enabling coordinated multi-machine and robot operations', 'Remote tele-op control centers enabling one operator to supervise multiple machines or robots'],
      dynamics: 'Control shifting from individual human operators per machine to edge autonomy layers–GPS-guided grading, semi-autonomous piling, robot-controlled layout–with centralized remote supervision.',
      battle: 'One Operator per Machine vs. Edge-Autonomous Equipment + Remote Tele-Op Centers',
      constraints: 'Equipment control systems often stay 7–20 years, and control changes must be proven over 2–8 weeks before broad rollout. Safety sign-off and liability review can take 4–12 weeks, and automation permissions may take 3–6 months.'
    },
    'L2-datacenters': {
      incumbents: ['BMS/BAS from Schneider, Honeywell, Johnson Controls', 'Standalone PLC/DDC loops for cooling, power and fire suppression', 'Manual changeover and configuration of IT loads'],
      challengers: ['AI-native cooling and power control (Phaidra, Google DeepMind-derived controls, Vigilent)', 'Software-defined power distribution (Eaton, ABB with smart switching)', 'Workload-aware control coupling IT load placement and facility response in real time'],
      dynamics: 'Data center control moving from siloed BMS loops to AI-driven holistic optimization–dynamically tuning airflows, chiller staging and power paths based on live IT workloads and weather.',
      battle: 'Siloed BMS Loops vs. AI-Driven, Workload-Aware Facility Control',
      constraints: 'Facility systems last 10–20 years, but control software may evolve every 3–12 months with tight uptime constraints. Testing and approval for control changes typically takes 2–8 weeks, and rollback plans must be validated within 1–2 weeks.'
    },
    'L2-discrete': {
      incumbents: ['Proprietary PLCs and motion controllers (Siemens, Rockwell, Mitsubishi, Beckhoff)', 'Hard-wired safety PLCs and interlocks', 'Rigid cell-level automation logic programmed per model year'],
      challengers: ['Software-defined PLC and containerized control environments (Beckhoff TwinCAT, PLCnext, CODESYS on Linux)', 'Edge platforms enabling ML inference alongside real-time control (Siemens Industrial Edge, Ignition Edge, AWS Outposts)', 'Open robotics middleware (ROS 2 Industrial) coordinating heterogeneous automation with CI/CD for automation logic'],
      dynamics: 'Factory control evolving from monolithic, vendor-locked PLC programs to software-defined, containerized logic that can be updated, tested and deployed like IT software–unlocking continuous improvement and AI write-back.',
      battle: 'Locked Proprietary PLCs vs. Software-Defined, Containerized Edge Control',
      constraints: 'PLC/line automation persists 10–25 years, and experimentation is constrained to maintenance windows weekly–monthly (1–4 weeks). Validation for setpoint/write-back changes often takes 4–12 weeks, and scaling to multiple lines takes 8–24 weeks.'
    },
    'L2-process': {
      incumbents: ['DCS platforms (Honeywell Experion, Emerson DeltaV, Yokogawa CENTUM, ABB 800xA) with proprietary control logic', 'Hardwired SIS (Safety Instrumented Systems) meeting SIL requirements', 'Manual setpoint changes and recipe management based on operator judgment'],
      challengers: ['Advanced Process Control (APC) and MPC layers (Aspen DMC, Honeywell Profit Controller, Yokogawa APC) writing optimized setpoints to DCS', 'ML/RL supervisory controllers writing back to DCS via OPC UA (DeepMind, Imubit, self-optimizing controls)', 'Edge virtualization platforms (Zededa, Litmus) hosting AI and analytics alongside control'],
      dynamics: 'Process control evolving from manual setpoint tuning and periodic APC campaigns to AI-driven supervisory control that continuously optimizes within safety and regulatory constraints, writing back in real time.',
      battle: 'Manual Setpoints & Periodic APC vs. Continuous AI Write-Back within Safety Envelopes',
      constraints: 'Control systems often last 20–40+ years, and major changes usually wait for shutdown windows every 2–5 years (with smaller windows monthly–quarterly). Control write-back may require 4–12 weeks of testing and approvals, or 3–12 months under heavy compliance/change control.'
    },
    'L2-aerospace': {
      incumbents: ['Flight control systems and mission computers (Lockheed, Northrop, BAE)', 'Platform-centric autopilots and weapon-release systems', 'Ground control stations for UAVs with direct operator control'],
      challengers: ['Open mission systems and autonomy frameworks (Shield AI Hivemind, Anduril autonomy cores)', 'AI-native flight control for attritable and swarming platforms', 'Edge compute enabling real-time sensor fusion and autonomous engagement decisions within ROE'],
      dynamics: 'Aerospace control shifting from platform-centric, deterministic flight computers to reusable autonomy cores that can be rapidly integrated across platforms–enabling contested-environment operations with minimal comms.',
      battle: 'Platform-Centric Flight Control vs. Reusable Autonomy Cores with On-Edge AI',
      constraints: 'Control logic may remain stable 10–25 years, and changes can require 6–24 months of assurance depending on certification scope. Testing and review cycles commonly take 8–24 weeks, and rollout is staged over 3–9 months.'
    },
    'L2-energy': {
      incumbents: ['SCADA/RTU networks for wells and pipelines (Emerson, Honeywell, ABB)', 'Local wellhead and pump controllers', 'Centralized control rooms with manual intervention'],
      challengers: ['Edge controllers with ML-based optimization (Ambyint, Kelvin, Rockwell edge)', 'Pad-level and field-level optimization coordinating multiple wells in real time', 'Autonomous drilling and completion systems that adjust parameters based on downhole conditions'],
      dynamics: 'Upstream control evolving from centralized SCADA with manual intervention to edge intelligence at the pad and well level–autonomously adjusting artificial lift, chokes and injection based on live reservoir and equipment data.',
      battle: 'Centralized SCADA with Manual Intervention vs. Edge AI Autonomously Optimizing Wells',
      constraints: 'Controls can persist 10–25 years across diverse sites, and remote rollout adds 4–12 weeks per site. Safety/HSE review and authorization for changes often takes 4–12 weeks, with broader governance taking 3–9 months.'
    },
    'L2-utilities': {
      incumbents: ['SCADA/EMS for transmission, SCADA/DMS for distribution (GE, Siemens, Schneider, ABB)', 'Relay protection and local automation (SEL, GE, ABB)', 'Manual switching and restoration procedures'],
      challengers: ['DERMS and VPP platforms enabling real-time dispatch of distributed resources (AutoGrid, Sunverge, Enbala)', 'Grid-edge intelligence enabling local optimization and islanding (Heila, Autogrid, Schneider)', 'FLISR (Fault Location, Isolation, Service Restoration) algorithms automating outage response'],
      dynamics: 'Grid control shifting from centralized dispatch of bulk generation to orchestration of millions of DERs–requiring edge intelligence that can act locally while coordinating globally.',
      battle: 'Centralized Bulk Dispatch vs. Distributed Edge Control Coordinating Millions of DERs',
      constraints: 'Control infrastructure lifecycles are 30–60 years, with upgrades planned on 12–36 month programs. Security and operations approvals often take 8–24 weeks, and write-back/automation permissioning can take 6–18 months.'
    },
    'L2-maritime': {
      incumbents: ['Bridge navigation and automation systems (Kongsberg, Wärtsilä, Raytheon Anschütz)', 'Engine automation and alarm systems', 'Separate cargo, ballast and stability control systems'],
      challengers: ['Integrated bridge systems with voyage optimization and semi-autonomous navigation', 'Remote engine-room monitoring and control enabling shore-based operations', 'Edge compute tying navigation, propulsion and cargo systems into unified optimization'],
      dynamics: 'Ship control evolving from bridge- and engine-room-centric manual operations to integrated automation layers–enabling remote monitoring, semi-autonomous voyages and real-time fuel and trim optimization.',
      battle: 'Siloed Bridge & Engine Room Automation vs. Integrated Ship-Wide Edge Control + Remote Ops',
      constraints: 'Ship control systems remain 10–25 years, and major retrofit work often aligns to dry-dock every 2.5–5 years. Testing and crew readiness typically take 4–12 weeks, and fleet-wide rollout often takes 3–9 months.'
    },
    'L2-land': {
      incumbents: ['OEM ECUs and human-driven control of trucks, forklifts and yard tractors', 'Conventional WCS orchestrating conveyors and sorters', 'Manual yard-switching operations and RF handheld-directed workflows'],
      challengers: ['AV truck stacks (Aurora Driver, Waymo Via, Kodiak, Gatik) directly controlling speed, steering and braking within defined ODDs', 'Yard automation and teleoperation platforms (Outrider, Phantom Auto) commanding yard tractors and gate systems', 'Warehouse robotics control platforms orchestrating AMR fleets and robotic picking cells (GreyOrange, Locus, Berkshire Grey)'],
      dynamics: 'Control shifting from human drivers and simple ECUs to autonomy stacks and robot fleet controllers that act within safety envelopes but continuously optimize speed, energy use and throughput at the edge.',
      battle: 'Human-in-Cab & Manual Forklifts vs. Autonomy Stacks & Robot Fleet Controllers',
      constraints: 'Vehicle control access may be constrained over fleet cycles of 5–12 years, and safe changes must prove out over 8–24 weeks. Legal and liability review can take 4–12 weeks, and scaled deployment often takes 3–9 months.'
    },
    'L2-mining': {
      incumbents: ['OEM equipment controllers (Cat, Komatsu, Hitachi, Liebherr)', 'Centralized dispatch issuing assignments to human operators', 'Separate crusher, conveyor and processing control systems'],
      challengers: ['Autonomous haulage systems (Caterpillar Command, Komatsu FrontRunner, Hitachi AHS)', 'Site-wide autonomy layers coordinating trucks, shovels, drills and support equipment', 'Centralized remote operations centers replacing on-site control rooms'],
      dynamics: 'Mining control evolving from dispatcher-to-driver radio and siloed plant control to site-wide autonomous fleets managed from remote centers–optimizing traffic, fuel and throughput across the entire pit.',
      battle: 'Dispatcher-to-Driver Radio vs. Autonomous Fleet Control from Remote Operations Centers',
      constraints: 'Control systems on fixed plant can last 20–40 years, while mobile controls evolve over 7–15 years. Harsh environments can stretch validation to 4–12 weeks, and multi-site rollout often takes 3–9 months.'
    },

    // ==================== L1 - Sensing ====================
    'L1-construction': {
      incumbents: ['Total stations and GPS rovers (Trimble, Topcon, Leica)', 'Manual progress photos and walk-throughs', 'Periodic drone flights for topography'],
      challengers: ['Continuous reality capture (OpenSpace, Buildots, Disperse, Evercam) comparing as-built to BIM daily', 'IoT sensors on equipment, materials and workers', 'LiDAR and photogrammetry generating digital twins of sites'],
      dynamics: 'Jobsites shifting from periodic manual measurement to continuous, automated sensing–enabling real-time variance detection against BIM and schedule.',
      battle: 'Weekly Drone Flights & Walk-Throughs vs. Continuous AI-Powered Reality Capture',
      constraints: 'Sites change over 6–36 months, so installs must be fast (typically 1–4 weeks per site) and removable. Sensor calibration and maintenance cycles run 3–12 months, and connectivity may vary daily over 1–7 days of disruption.'
    },
    'L1-datacenters': {
      incumbents: ['BMS sensors (temperature, humidity, power metering)', 'Manual rounds and visual inspections', 'Siloed fire, security and access control systems'],
      challengers: ['Dense environmental sensing grids (EkkoSense, RF Code, Nlyte Energy Optimizer, Sunbird DCIM analytics)', 'AI-based thermal and airflow analytics', 'Integrated security, power and environmental monitoring'],
      dynamics: 'Data center sensing evolving from sparse BMS points to dense, AI-analyzed grids–enabling rack-level thermal optimization and predictive maintenance.',
      battle: 'Sparse BMS Points vs. Dense AI-Analyzed Environmental Sensing',
      constraints: 'Facilities persist 10–20 years, but telemetry stacks can change every 6–24 months. Deploying new sensing or normalization typically takes 2–8 weeks, and security approvals commonly take 2–8 weeks.'
    },
    'L1-discrete': {
      incumbents: ['End-of-line quality inspection (CMM, manual visual)', 'Periodic vibration and thermal checks by maintenance techs', 'Point-to-point wiring from sensors to PLCs'],
      challengers: ['Inline 3D metrology, X-ray/CT and force/torque sensing for 100% inspection', 'Condition monitoring on motors, gearboxes and spindles (SKF, Augury, Tractian)', 'Wireless sensor networks and IO-Link enabling dense, flexible instrumentation'],
      dynamics: 'Factory sensing shifting from sparse, end-of-line inspection to dense, inline instrumentation–enabling 100% quality verification and continuous equipment health monitoring.',
      battle: 'End-of-Line Sampling & Periodic Maintenance Checks vs. 100% Inline Inspection + Continuous PdM',
      constraints: 'Instrumentation is expected to last 3–10 years, but install windows may be only 1–8 hours during weekly downtime. Getting stable signals and tagging right often takes 4–12 weeks, and scaling plant-wide typically takes 8–24 weeks.'
    },
    'L1-process': {
      incumbents: ['Traditional instruments (Emerson Rosemount, Endress+Hauser, Yokogawa) wired to DCS', 'Lab samples with hours/days lag', 'Manual operator rounds with clipboards'],
      challengers: ['AI-native PdM platforms (Augury, Tractian, Assetwatch) combining vibration, thermal, acoustic and process data', 'Inline spectroscopic analyzers (NIR, Raman) and multiphase flow meters', 'Wireless and edge-connected sensors (WirelessHART, ISA100) enabling rapid instrumentation expansion'],
      dynamics: 'Process sensing shifting from sparse DCS-centric instrumentation and lab-based quality to dense, inline and wireless sensors feeding AI models for real-time quality and equipment health.',
      battle: 'DCS-Centric Sparse Sensing & Lab Samples vs. Dense Inline + AI-Powered PdM',
      constraints: 'Sensors often last 5–15 years, but access and calibration can require cycles every 3–12 months. Tag/units normalization across historians commonly takes 4–12 weeks, and hazardous-area work can extend installs to 2–8 weeks.'
    },
    'L1-aerospace': {
      incumbents: ['Platform-centric radar, EO/IR, EW and SIGINT systems', 'Federated sensor suites with stovepiped data links', 'Manual analysis and fusion by operators'],
      challengers: ['Multi-domain sensor fusion layers creating unified battlespace picture', 'Edge AI enabling onboard target recognition and track fusion', 'Commercial GEOINT and RF sensing (Planet, Hawkeye 360, Capella)'],
      dynamics: 'Defense sensing shifting from platform-centric, stovepiped sensors to distributed, AI-fused sensing networks–enabling kill webs where any sensor can cue any shooter.',
      battle: 'Platform-Centric Stovepiped Sensors vs. Distributed AI-Fused Kill Webs',
      constraints: 'Instrumentation may be retained 5–15 years, with documentation retention 10+ years. Security and data governance reviews often take 8–24 weeks, and qualifying sensing for production can take 3–12 months.'
    },
    'L1-energy': {
      incumbents: ['Wellhead and pipeline SCADA (pressure, temperature, flow)', 'Periodic pigging and inspection campaigns', 'Seismic surveys for exploration'],
      challengers: ['Fiber-optic DTS/DAS along wells and pipelines for continuous monitoring', 'Permanent downhole gauges and intelligent completions', 'Satellite methane and leak detection (GHGSat, Kairos)'],
      dynamics: 'Upstream sensing evolving from sparse SCADA and periodic inspections to continuous fiber, downhole and satellite monitoring–enabling real-time reservoir, integrity and emissions management.',
      battle: 'Sparse SCADA & Periodic Inspections vs. Continuous Fiber, Downhole & Satellite Sensing',
      constraints: 'Field sensing hardware may need replacement every 3–10 years, and deployments can take 2–8 weeks per remote site. Connectivity gaps can last hours–days, and achieving consistent data quality typically takes 8–24 weeks.'
    },
    'L1-utilities': {
      incumbents: ['SCADA RTUs at substations and feeders', 'Manual meter reading (declining)', 'Periodic line patrols and inspections'],
      challengers: ['AMI smart meters enabling granular load visibility', 'PMUs and high-speed fault recorders', 'Drone and robot inspection for lines, poles and substations', 'Grid-edge sensing (Sense, Whisker Labs, Schneider Wiser) inside homes'],
      dynamics: 'Grid sensing shifting from sparse SCADA and periodic inspections to AMI-enabled load visibility, drone/robot patrols and grid-edge intelligence–critical for hosting DERs and managing wildfire risk.',
      battle: 'Sparse SCADA & Periodic Patrols vs. AMI + Drone + Grid-Edge Sensing Networks',
      constraints: 'Grid sensing assets can last 10–25 years, but rollout programs often span 12–36 months. Security approvals often take 8–24 weeks, and field installation pacing can be 2–8 weeks per region.'
    },
    'L1-maritime': {
      incumbents: ['Bridge navigation sensors (radar, AIS, GPS, echo sounder)', 'Engine-room instrumentation (local gauges and alarms)', 'Manual hull and cargo inspections'],
      challengers: ['Denser onboard sensing (fuel flow, emissions, hull fouling, cargo condition)', 'AI-based voyage and performance analytics (Nautilus Labs, Orca AI)', 'Shore-based fleet monitoring centers'],
      dynamics: 'Maritime sensing evolving from bridge- and engine-room-centric instrumentation to dense, connected sensing feeding AI performance models–enabling continuous hull, propulsion and cargo optimization.',
      battle: 'Bridge- & Engine-Room-Centric Gauges vs. Dense, AI-Connected Fleet Sensing',
      constraints: 'Onboard sensing can persist 5–15 years, but major upgrades often happen at dry-dock every 2.5–5 years. Connectivity can drop for hours–days, and fleet standardization typically takes 3–9 months.'
    },
    'L1-land': {
      incumbents: ['Driver logs and manual inspections', 'Basic telematics (GPS, fuel)', 'Warehouse barcode scanning'],
      challengers: ['AV truck perception stacks (cameras, lidar, radar) from Aurora, Kodiak, Waymo Via, Gatik', 'AI telematics with dashcams and driver monitoring (Samsara, Motive)', 'Warehouse vision systems for inventory and pick verification (Plus One Robotics, Vimaan)'],
      dynamics: 'Transport sensing shifting from basic telematics and manual verification to rich perception stacks and AI-analyzed camera feeds–enabling autonomy, safety and real-time inventory accuracy.',
      battle: 'Basic GPS Telematics & Barcode Scans vs. Rich Perception Stacks + AI Vision',
      constraints: 'Fleet telemetry devices turn over with vehicles in 5–12 years, but integrations must stabilize in 6–20 weeks to be useful. Data quality normalization across OEMs often takes 4–12 weeks, and measurable coverage improvements take 8–24 weeks.'
    },
    'L1-mining': {
      incumbents: ['Fleet telematics and dispatch sensors', 'Fixed plant instrumentation (crushers, mills, conveyors)', 'Periodic surveying and geotechnical monitoring'],
      challengers: ['Drone and LiDAR-based surveying (Emesent, Propeller, Skycatch)', 'Hyperspectral imaging for ore characterization', 'Dense PdM sensing on haul trucks, shovels and processing equipment (Augury, SKF, Epiroc)'],
      dynamics: 'Mining sensing shifting from periodic surveys and sparse instrumentation to continuous drone mapping, hyperspectral ore sensing and dense equipment health monitoring.',
      battle: 'Periodic Surveys & Sparse Instrumentation vs. Continuous Drone + Hyperspectral + PdM Sensing',
      constraints: 'Rugged sensing hardware may last 3–8 years due to harsh conditions, and installs can take 2–8 weeks per remote site. Calibration/maintenance cycles run 3–12 months, and connectivity gaps can last hours–days.'
    },

    // ==================== L0 - Physics ====================
    'L0-construction': {
      incumbents: ['Diesel excavators, cranes, loaders (Caterpillar, Komatsu, Deere)', 'Stick-built framing and formwork', 'Temporary diesel generators and grid connections'],
      challengers: ['Electrified equipment (battery excavators, hybrid cranes, e-loaders)', 'Modular and prefabricated construction (Katerra model, volumetric pods)', 'Mass timber (CLT, glulam) displacing steel and concrete', 'Temporary site microgrids with solar and battery storage'],
      dynamics: 'Jobsites shifting from all-diesel fleets and stick-built methods toward electrified equipment, factory-built modules and mass timber–driven by carbon mandates, labor shortages and productivity.',
      battle: 'Diesel Fleets & Stick-Built Methods vs. Electrified Equipment + Prefab + Mass Timber',
      constraints: 'Projects run 6–36 months, but equipment lifecycles are 7–20 years, so solutions must fit mixed fleets. Capex decisions can take 3–12 months, and site downtime tolerance is often measured in hours–days.'
    },
    'L0-datacenters': {
      incumbents: ['Traditional raised-floor data halls', 'N+1 chiller plants', 'Diesel backup generators'],
      challengers: ['Liquid cooling (direct-to-chip, immersion) for AI/HPC workloads', 'Modular prefab data centers (Schneider, Vertiv, Flexential)', 'Battery + fuel cell backup replacing diesel'],
      dynamics: 'Data center physics shifting from air-cooled raised floors to liquid-cooled high-density racks, with modular builds accelerating deployment and clean backup replacing diesel.',
      battle: 'Air-Cooled Raised Floors vs. Liquid-Cooled Modular Builds + Clean Backup',
      constraints: 'Facilities persist 10–20 years, with major expansions planned 12–36 months ahead. Any physical change must be validated within 2–8 weeks, and downtime budgets can be near-zero over 0–24 hours.'
    },
    'L0-discrete': {
      incumbents: ['Fixed automation lines designed for high-volume, single-product runs', 'Conveyor-centric material handling', 'Large-footprint factories optimized for specific products'],
      challengers: ['Modular, reconfigurable cells (Vention, RAMP) swapped for new products in days not months', 'AMR-based material movement replacing fixed conveyors (MiR, Locus, 6 River)', 'Additive manufacturing and microfactories for low-volume/custom parts'],
      dynamics: 'Factory physics shifting from rigid, conveyor-fed lines to Lego-like cells, AMR logistics and additive–enabling rapid product changeover and distributed manufacturing.',
      battle: 'Fixed High-Volume Lines vs. Reconfigurable Cells + AMR Logistics + Additive',
      constraints: 'Lines last 10–25 years, and retrofits must fit maintenance windows weekly–monthly (1–4 weeks). Capex approval often takes 3–12 months, and production disruption must be kept to hours–days.'
    },
    'L0-process': {
      incumbents: ['Large stainless-steel batch trains (reactors, heat exchangers, evaporators, spray dryers)', 'OEMs: GEA, Alfa Laval, SPX FLOW, Tetra Pak, Bühler', 'Fixed CIP/SIP utilities and hardwired interlocks'],
      challengers: ['Single-use modular skids eliminating cleaning validation (Sartorius, Cytiva for biopharma)', 'Continuous manufacturing platforms replacing batch (GEA ConsiGma, PCMM mini-factories)', 'Bio-based fermentation and cell-culture facilities (Ginkgo Bioworks, LanzaTech) reshaping asset footprints'],
      dynamics: 'Process plants shifting from large batch trains requiring extensive cleaning to modular single-use, continuous-flow and bio-based assets–cutting footprints 50%+ while boosting flexibility.',
      battle: 'Big Steel Batch Trains vs. Modular, Continuous & Bio-Based Lines',
      constraints: 'Core assets last 20–40+ years, with major rebuilds tied to turnarounds every 2–5 years. Capex and engineering cycles can take 6–24 months, and safety constraints are enforced continuously over 24/7 operations.'
    },
    'L0-aerospace': {
      incumbents: ['Manned fighters, bombers, tankers, transports (Lockheed, Boeing, Northrop)', 'Large, exquisite satellite constellations (Lockheed, Northrop, Boeing)', 'Vertical integration at prime contractors'],
      challengers: ['Attritable and autonomous drones (Anduril Roadrunner, Kratos, GA-ASI, AeroVironment Switchblade)', 'LEO mega-constellations (SpaceX Starlink, Amazon Kuiper) commoditizing space', 'In-space manufacturing and servicing (Varda, Axiom, Astroscale)'],
      dynamics: 'Aerospace assets shifting from small numbers of exquisite platforms to large numbers of attritable, autonomous systems and commercial space infrastructure–disrupting primes and reshaping force structure.',
      battle: 'Exquisite Manned Platforms vs. Attritable Drones + Commercial LEO Constellations',
      constraints: 'Platforms and plants can run 20–50 years, and program changes are planned 12–60 months out. Certification and supplier constraints can add 6–24 months to any physical change.'
    },
    'L0-energy': {
      incumbents: ['Drilling rigs, frac fleets, production facilities (SLB, Halliburton, Baker Hughes)', 'Pipeline networks (Kinder Morgan, Enterprise, TC Energy)', 'Diesel and gas-turbine power for operations'],
      challengers: ['All-electric production facilities (electric ESPs, e-compressors, full-electric subsea)', 'CCUS and blue hydrogen at scale', 'Deep geothermal (Fervo, Quaise) using oilfield techniques'],
      dynamics: 'Upstream assets evolving from diesel-intensive operations toward electrified, lower-emission production–while new technologies like enhanced geothermal open adjacent opportunities for oilfield skills.',
      battle: 'Diesel-Intensive Extraction vs. Electrified Production + Geothermal Diversification',
      constraints: 'Assets last 20–40 years, often distributed across remote sites. Access and permitting can take 4–24 weeks, and major upgrades can require 6–24 months of planning.'
    },
    'L0-utilities': {
      incumbents: ['Central thermal generation (coal, gas, nuclear)', 'Radial T&D networks designed for one-way power flow', 'Aging water treatment plants and pipe networks'],
      challengers: ['Utility-scale renewables + storage (NextEra, AES, Fluence, Tesla Megapack)', 'HVDC links and grid-forming inverters enabling bidirectional flow', 'Modular water treatment and reuse (desalination, direct potable reuse)'],
      dynamics: 'Utility assets shifting from central thermal plants and one-way grids to distributed renewables, storage and bidirectional power flows–requiring new interconnection, control and market structures.',
      battle: 'Central Thermal + One-Way T&D vs. Distributed Renewables + Storage + Bidirectional Grids',
      constraints: 'Grid infrastructure lifecycles are 30–60 years, with upgrades planned on 12–36 month programs. Regulatory and procurement timelines can extend changes to 12–36 months, and outages are tightly managed in hours–days.'
    },
    'L0-maritime': {
      incumbents: ['Conventional steel-hull cargo vessels (container, bulk, tanker)', 'Marine diesel and heavy fuel oil propulsion', 'Traditional port cranes and terminal infrastructure'],
      challengers: ['Alternative fuels (LNG, methanol, ammonia, hydrogen) requiring new propulsion and bunkering', 'Hull innovations (air lubrication, wind-assist like Flettner rotors, foils)', 'Autonomous and unmanned surface vessels (Kongsberg, Sea Machines)'],
      dynamics: 'Shipping assets shifting from conventional diesel vessels to diverse hull forms and propulsion types–driven by IMO decarbonization mandates and digital-native newbuilds enabling autonomy.',
      battle: 'Diesel-Powered Conventional Hulls vs. Alt-Fuel, Wind-Assist & Autonomous Vessels',
      constraints: 'Vessels last 20–30 years, and major work aligns to dry-dock every 2.5–5 years. Retrofit planning often takes 3–12 months, and installation windows are constrained to days–weeks in dock.'
    },
    'L0-land': {
      incumbents: ['Diesel Class 8 trucks', 'Manual forklifts and yard tractors', 'Conventional warehouse racking and conveyors'],
      challengers: ['AV-ready truck platforms (Aurora, Waymo Via, Kodiak)', 'Hydrogen fuel-cell trucks (Nikola, Hyundai, Hyzon)', 'Automated warehouses (Ocado, AutoStore, Symbotic)', 'Autonomous yard tractors (Outrider, Einride)'],
      dynamics: 'Land transport assets evolving from manual diesel fleets to AV-capable electric and hydrogen trucks, with warehouses shifting to robotic fulfillment and autonomous yards.',
      battle: 'Manual Diesel Fleets & Conventional DCs vs. AV-Ready Electric/H2 Trucks + Robotic Warehouses',
      constraints: 'Fleet turnover is 5–12 years, and operational economics are sensitive to downtime of hours–days per vehicle. Procurement cycles for fleet tech often take 3–9 months, and regulatory compliance timelines can take 3–12 months.'
    },
    'L0-mining': {
      incumbents: ['Diesel haul trucks, shovels, drills (Caterpillar, Komatsu, Hitachi, Liebherr)', 'Conventional truck-and-shovel pit design', 'Diesel generators and grid connections'],
      challengers: ['Battery-electric haul trucks and loaders (Caterpillar, Komatsu, Epiroc)', 'In-pit crushing and conveying (IPCC) reducing truck dependence', 'Trolley-assist systems and mine microgrids with renewables', 'On-site hydrogen production for remote sites'],
      dynamics: 'Mine designs slowly shifting from diesel-dominated truck fleets toward electrified haulage, conveyor-heavy layouts and hybrid power systems, re-optimizing pit geometry, ventilation and OPEX/ESG profiles.',
      battle: 'Diesel Truck-Dominated Pits vs. Electrified, Conveyor- & Renewables-Native Mines',
      constraints: 'Mobile fleets last 7–15 years while fixed plants last 20–40 years, and access constraints are constant. Major maintenance/rebuild cycles can take 1–3 years, and outages are scheduled around weekly–monthly windows.'
    },

    // ==================== L-1 - Labor ====================
    'L-1-construction': {
      incumbents: ['Skilled Trades (Carpenters, Ironworkers, Electricians, Equipment Operators)', 'Foremen & Superintendents', 'Laborers handling repetitive/ergonomic tasks'],
      challengers: ['Construction robotics (Built Robotics, Canvas, Dusty Robotics, Hilti Jaibot, SafeAI, Teleo, Bedrock)', 'Exoskeletons for lifting/fatigue reduction', 'AI planning/copilot tools for layout, sequencing, safety', 'Humanoids (Figure, Digit) for general site labor'],
      dynamics: 'Chronic labor shortages and aging workforce push robots into repetitive, ergonomically harsh tasks while experienced tradespeople move up into supervision and QA. Exoskeletons extending careers of aging workers.',
      battle: 'Journeyman-Led Manual Crews vs. Robot-Augmented Craft Crews',
      constraints: 'A competent operator/equipment lead typically takes 6–18 months to develop, and top foreman-level expertise takes 3–10 years. Workflow change adoption usually takes 4–12 weeks per crew, and company-wide behavior change takes 3–9 months.'
    },
    'L-1-datacenters': {
      incumbents: ['Facility engineers & M&E techs', 'IT hardware techs', 'NOC operators', 'Security guards (24/7 patrols)', 'Janitorial/cleaning staff'],
      challengers: ['Autonomous inspection robots (Spot)', 'AI security robots (Cobalt, Knightscope)', 'Cleaning AMRs (BrainOS-powered)', 'AI copilots embedded in DCIM/BMS suggesting work orders and priorities'],
      dynamics: 'Chronic shortage (2.5M workers needed by 2025, 33% nearing retirement). Rapid MW growth and tightening uptime requirements push toward smaller, highly skilled teams supervising robots handling routine rounds, cleaning, and security.',
      battle: '24/7 Human Patrols & Clipboards vs. AI+Robot-Augmented Micro-Teams',
      constraints: 'On-call readiness often takes 3–6 months, and senior reliability expertise takes 2–5+ years. New operational tools usually need 2–8 weeks of runbook integration and 4–12 weeks to build trust in incidents.'
    },
    'L-1-discrete': {
      incumbents: ['Assembly operators & line workers', 'Quality inspectors & rework techs', 'Material handlers', 'CNC/machine operators', 'Line leaders'],
      challengers: ['Humanoids (Figure, Tesla Optimus, Apptronik)', 'Cobots & mobile manipulators (Universal Robots, Amazon Robotics)', 'Connected-worker platforms (Augmentir, Tulip, Vuforia) guiding and tracking human work'],
      dynamics: '2.1M worker shortfall projected by 2030 (Deloitte); 75.7% of mfg leaders cite workforce as #1 challenge; 40% turnover in first year; avg worker age 46+. Near-term transition from fully manual to human operators augmented by cobots, AR work instructions, real-time quality feedback; humanoids backfilling hard-to-staff or ergonomically extreme stations.',
      battle: 'Human-Only Stations vs. Mixed Human-Robot Cells + Humanoid Generalists',
      constraints: 'Operator competence typically takes 6–18 months, with deep line expertise over 3–7 years. SOP changes require 4–12 weeks of training, and sustained adoption typically takes 3–6 months across shifts.'
    },
    'L-1-process': {
      incumbents: ['Control room operators', 'Field operators & roundsmen', 'Maintenance techs', 'Lab analysts', 'Packaging/filling operators', 'Tank farm & loading crews'],
      challengers: ['Connected-worker & AR platforms (Augmentir, Tulip, PTC Vuforia, Apprentice)', 'Inspection robots (Boston Dynamics Spot, ANYmal X, ExRobotics) patrolling hazardous areas', 'Remote operations centers', 'AI copilots suggesting setpoints and procedure changes'],
      dynamics: '82% report workforce shortages (2024); 40% of employees have outdated skills. Loss of experienced panel operators plus safety/ESG pressure shifting plants toward "fewer but more capable" onsite crews, supported by AI work instructions and robots taking over inspections, readings, and manual checks.',
      battle: 'Every Critical Task by Onsite Operators vs. Thin Expert Core + AI Copilots + Robots',
      constraints: 'Competent operator training takes 6–18 months, and "plant whisperer" expertise takes 3–10 years. Changing behavior safely often takes 8–24 weeks, and trust for automation can take 6–18 months to earn.'
    },
    'L-1-aerospace': {
      incumbents: ['A&P mechanics (aircraft maintenance technicians)', 'Avionics techs', 'Manufacturing engineers', 'NDT inspectors', 'Quality assurance'],
      challengers: ['AR-guided maintenance (Augmentir, PTC Vuforia)', 'Digital twins for training', 'Automated inspection systems', 'AI-assisted quality control'],
      dynamics: '9% AMT shortage today, reaching 20% (~25,000 mechanics) by 2028; Boeing projects 640,000 new technicians needed globally through 2041; 46% of A&D workforce is 46+; 29% over 55. Retiring boomers taking 5:2 ratio vs. new entrants; 49% of mechanics over 40, only 27% under 30.',
      battle: 'Scarce Licensed A&P Mechanics vs. AR-Augmented Techs + Automated Inspection',
      constraints: 'Skill development can take 12–36 months for specialized roles, and mastery often takes 5–10+ years. Process and documentation changes can take 8–24 weeks to train, with full adoption over 6–18 months.'
    },
    'L-1-energy': {
      incumbents: ['Drillers, roughnecks, derrickhands', 'Field operators & inspection roundsmen', 'Control room operators', 'Maintenance crews', 'Drilling engineers'],
      challengers: ['Remote monitoring & operations centers', 'Legged/wheeled inspection robots (ANYmal X, ExRobotics, Spot) for hazardous rounds', 'Autonomous drilling, completions & frac equipment', 'Digital field workers (AR/connected worker)'],
      dynamics: 'Workforce fell from 195K (2014) to 119K (2024); 62% of Gen Z find O&G careers unappealing. Safety, cost & decarbonization pressures systematically keeping workers out of red zones and off remote platforms–turning boots-on-ground roles into remote supervisors and robot operators.',
      battle: 'Full Crews Living On-Site vs. Skeletal Presence + Robots + Remote Ops Centers',
      constraints: 'Field competency often takes 6–18 months, and senior expertise takes 3–10 years. Training deployment across sites takes 4–12 weeks, and consistent behavior change typically needs 3–9 months.'
    },
    'L-1-utilities': {
      incumbents: ['Lineworkers', 'Substation technicians', 'Meter readers (declining)', 'Vegetation management crews', 'Control room dispatchers'],
      challengers: ['AMI & smart meters eliminating manual reads', 'Drone & ground-robot inspection for lines/substations', 'AR-guided procedures for field crews', 'AI copilots in grid control centers'],
      dynamics: '750K+ new workers needed by 2030; 45% of linemen retiring in next decade; apprenticeship pipeline at 45K vs. 65K needed. Aging infrastructure, extreme weather & wildfire risk require more inspection than utilities can staff; automation shifting labor mix toward remote monitoring and targeted high-skill interventions.',
      battle: 'Truck Roll for Every Read & Inspection vs. Remote Sensing + Robot-First Patrols',
      constraints: 'Apprenticeship-style readiness often takes 12–48 months, and senior craft expertise can take 5–10+ years. Procedure changes often require 8–24 weeks, and organization-wide adoption can take 6–18 months.'
    },
    'L-1-maritime': {
      incumbents: ['Seafarers (deck & engine crews)', 'Harbor pilots & tug crews', 'Longshoremen & lashers', 'Port crane operators', 'Terminal workers'],
      challengers: ['Remote crane operators in centralized control rooms', 'Semi- & fully automated terminals', 'Autonomous navigation (Kongsberg, Sea Machines, Orca AI)', 'Shore-based remote operations centers'],
      dynamics: '90,000 seafarer shortfall by 2026; 93% cite fatigue as top safety concern. Efficiency and safety benefits of automation collide with strong labor unions concerned about job loss; in practice shifting crews from ships/quay to remote control rooms and higher-skill tech roles rather than eliminating work outright.',
      battle: 'On-Vessel & Quay-Side Manual Roles vs. Shore-Based Operators Supervising Autonomous Systems',
      constraints: 'Crew readiness can take 6–18 months, and deep engineering mastery takes 3–10 years. Crew rotation cycles are 2–6 months, so training and adoption must be reinforced over 2–3 rotations (4–18 months).'
    },
    'L-1-land': {
      incumbents: ['Long-haul & regional truck drivers', 'Local delivery drivers', 'Warehouse pickers & packers', 'Forklift operators', 'Yard jockeys'],
      challengers: ['Autonomous trucking (Aurora, Kodiak, Waymo Via, Gatik)', 'AI telematics & driver coaching (Samsara, Motive)', 'Warehouse AMRs & humanoids (Locus, 6 River, Agility Digit, Figure)', 'Autonomous yard tractors (Outrider)'],
      dynamics: '60K driver shortage (ATA 2024), 90%+ turnover at large carriers, avg driver age 50+; warehouse labor volatile with 43% reporting lost revenue from staffing gaps. Fleets and DCs shifting from fully manual to autonomy on specific corridors and robot-heavy warehouses, with AI copilots coaching remaining human drivers.',
      battle: 'All-Human Fleets & Picking vs. Autonomy Corridors + Robot-Heavy DCs + AI-Coached Drivers',
      constraints: 'Driver onboarding and performance stabilization can take 4–12 weeks, while dispatcher excellence can take 6–18 months. Changing safety and operating habits typically takes 8–24 weeks, and fleet-wide adoption often takes 3–9 months.'
    },
    'L-1-mining': {
      incumbents: ['Haul truck drivers', 'Shovel & loader operators', 'Drill & blast crews', 'Dispatchers & surveyors', 'Maintenance mechanics'],
      challengers: ['Autonomous haulage systems (Caterpillar Command, Komatsu FrontRunner)', 'Tele-remote drilling & loading', 'Drone-based surveying & inspection', 'Remote operations centers'],
      dynamics: '50% of workforce retiring by 2029 (~221K workers); 71% of execs say talent shortage impacting production; 66% of youth aged 15-30 would not work in mining. Remote/hazardous locations make mining an early autonomy adopter–shifting roles from in-cab operators to control-room supervisors, fleet maintenance, and data analysts.',
      battle: 'In-Cab Operators in Every Truck & Shovel vs. Remote Supervisors Managing Autonomous Fleets',
      constraints: 'Operator competence typically takes 6–18 months, and senior pit/plant expertise takes 3–10 years. Shift-based change adoption usually takes 4–12 weeks, with sustained behavior change over 3–9 months.'
    },
  };

  const lifecycleData = {
    process: {
      design: { title: "Generative Formulations", text: "AI surrogates (e.g., ESM3) designing molecules/recipes in silico, reducing wet-lab iterations." },
      build: { title: "Capital Project Intelligence", text: "AI-driven scheduling (e.g., ALICE) and supply chain planning for plant construction/retrofits." },
      operate: { title: "Autonomous Control", text: "Real-time setpoint optimization (APC/RL) and 'self-driving' steady states." },
      maintain: { title: "Predictive Asset Health", text: "Vibration/thermal monitoring for critical pumps/valves; AI-guided remote experts." }
    },
    discrete: {
      design: { title: "Generative Product Design", text: "AI co-optimizing geometry, material, and manufacturability (e.g., Neural Concept)." },
      build: { title: "Virtual Commissioning", text: "Simulating lines/cells in digital twins before physical deployment to catch errors early." },
      operate: { title: "Adaptive Manufacturing", text: "Computer vision for inline QC; dynamic routing of work-in-progress based on bottlenecks." },
      maintain: { title: "Condition-Based MRO", text: "Sensor fusion on spindles/motors predicting failure; AR work instructions for techs." }
    },
    energy: {
      design: { title: "Subsurface Modeling", text: "AI-enhanced seismic interpretation and reservoir simulation for optimal well placement." },
      build: { title: "Capital Efficiency", text: "Optimizing drilling campaigns and facilities construction logistics." },
      operate: { title: "Production Optimization", text: "Real-time choke/lift adjustments to maximize flow while minimizing sand/water." },
      maintain: { title: "Remote Asset Integrity", text: "Drone/robot inspections of pipelines/platforms; predictive corrosion modeling." }
    },
    utilities: {
      design: { title: "Grid Planning", text: "Forecasting long-term load/DER growth to optimize T&D infrastructure investment." },
      build: { title: "Interconnection Queues", text: "AI accelerating permitting and study reviews for new renewables/storage projects." },
      operate: { title: "Grid Orchestration", text: "Real-time balancing of DERs (VPPs); ADMS optimization for stability." },
      maintain: { title: "Vegetation Management", text: "Satellite/LiDAR analysis predicting encroachment; drone inspection of lines." }
    },
    mining: {
      design: { title: "Orebody Modeling", text: "AI fusing drill/assay data to predict grade distribution and mine plan geometry." },
      build: { title: "Mine Construction", text: "Logistics and scheduling for remote infrastructure and fleet mobilization." },
      operate: { title: "Pit-to-Port Optimization", text: "Integrated scheduling of blast, haul, crush, and rail for max throughput." },
      maintain: { title: "Mobile Fleet PMM", text: "Telemetry analyzing engine/tire data to prevent haul truck breakdowns." }
    },
    construction: {
      design: { title: "Generative Building Design", text: "AI exploring thousands of layouts regarding code, cost, and energy constraints." },
      build: { title: "Jobsite Orchestration", text: "Reality capture (360°/LiDAR) comparison vs. BIM; AI scheduling (CPM replacement)." },
      operate: { title: "Smart Building Ops", text: "AI-driven HVAC/lighting control based on occupancy and weather." },
      maintain: { title: "Digital Twin FM", text: "BIM-to-FM handover; predictive maintenance for elevators/MEP systems." }
    },
    aerospace: {
      design: { title: "Neural Physics Surrogates", text: "Accelerating CFD/FEA 1000x for rapid airframe and propulsion iteration." },
      build: { title: "Supply Chain Resilience", text: "Multi-tier visibility into part shortages; advanced quality inspection (VLA)." },
      operate: { title: "Autonomy & Mission Planning", text: "AI pilots and swarm logic; strategic mission optimization." },
      maintain: { title: "Fleet Readiness", text: "Predictive engine health; optimization of spares inventory and technician routing." }
    },
    land: {
      design: { title: "Network Design", text: "Optimizing warehouse locations and fleet mix based on demand forecasts." },
      build: { title: "Fleet Procurement", text: "Data-driven decisions on vehicle specs and EV infrastructure rollout." },
      operate: { title: "Dynamic Routing", text: "Real-time dispatch and route optimization based on traffic, weather, patterns." },
      maintain: { title: "Fleet Uptime", text: "Predictive maintenance for trucks/trailers; automated service scheduling." }
    },
    maritime: {
      design: { title: "Vessel Optimization", text: "Hull form and propulsion design optimized for real-world operating profiles." },
      build: { title: "Shipyard Digitalization", text: "Digital twins for ship construction; smarter supply chain for parts." },
      operate: { title: "Voyage Optimization", text: "Weather routing; fuel consumption optimization; port call synchronization." },
      maintain: { title: "Hull & Engine Health", text: "Monitoring hull fouling impact; predictive maintenance on main engines." }
    },
    datacenters: {
      design: { title: "Capacity Planning", text: "AI forecasting compute demand; optimizing site selection and cooling design." },
      build: { title: "Supply Chain Orchestration", text: "Managing lead times for chips/servers/power gear; construction tracking." },
      operate: { title: "Workload Placement", text: "Real-time cooling/power optimization matching active compute loads." },
      maintain: { title: "Robot-Augmented Ops", text: "Automated inspection rounds; predictive failure analysis for drives/fans." }
    }
  };

  // ============================================
  // SQUEEZE TAB DATA
  // ============================================

  const squeezeData = {
    construction: {
      aiPressure: 65, autonomyPressure: 45, bottlenecks: [
        { name: 'Fragmented Trades', severity: 85, description: 'Multiple subcontractors, no unified data model' },
        { name: 'Legacy Assets', severity: 60, description: 'Diesel equipment without connectivity' },
        { name: 'Workforce Resistance', severity: 70, description: 'Union concerns, skills gaps' },
        { name: 'Permitting/Regulations', severity: 55, description: 'Local codes, inspections, safety requirements' },
      ]
    },
    datacenters: {
      aiPressure: 85, autonomyPressure: 40, bottlenecks: [
        { name: 'Power Constraints', severity: 90, description: 'Grid connections, renewable mandates' },
        { name: 'Cooling Limits', severity: 80, description: 'Air vs liquid, density constraints' },
        { name: 'Integration Debt', severity: 50, description: 'IT/facilities silos, DCIM limitations' },
      ]
    },
    discrete: {
      aiPressure: 75, autonomyPressure: 70, bottlenecks: [
        { name: 'Vendor Lock-in', severity: 75, description: 'Proprietary PLCs, closed ecosystems' },
        { name: 'Legacy Assets', severity: 70, description: '20+ year old equipment without APIs' },
        { name: 'IT/OT Divide', severity: 65, description: 'Separate networks, different teams' },
        { name: 'Change Management', severity: 55, description: 'Production pressure, risk aversion' },
      ]
    },
    process: {
      aiPressure: 70, autonomyPressure: 40, bottlenecks: [
        { name: 'GMP/Regulatory', severity: 95, description: 'Every change needs validation, audit trails' },
        { name: 'Legacy DCS', severity: 85, description: '20-year-old Honeywell/Emerson systems' },
        { name: 'IT/OT Divide', severity: 80, description: 'Air-gapped networks, Purdue model' },
        { name: 'Data Quality', severity: 65, description: 'Historian gaps, manual batch records' },
        { name: 'Change Management', severity: 60, description: 'Risk-averse culture, operator skepticism' },
      ]
    },
    aerospace: {
      aiPressure: 75, autonomyPressure: 65, bottlenecks: [
        { name: 'Security/Classification', severity: 90, description: 'ITAR, clearances, air-gapped systems' },
        { name: 'Certification', severity: 85, description: 'DO-178C, flight safety requirements' },
        { name: 'Supply Chain', severity: 70, description: '18-month lead times, single sources' },
        { name: 'Legacy Platforms', severity: 65, description: '40-year-old aircraft, long service lives' },
      ]
    },
    energy: {
      aiPressure: 70, autonomyPressure: 55, bottlenecks: [
        { name: 'Remote Locations', severity: 75, description: 'Offshore, arctic, desert–connectivity limited' },
        { name: 'Legacy SCADA', severity: 70, description: 'Proprietary protocols, security concerns' },
        { name: 'Reservoir Uncertainty', severity: 65, description: 'Subsurface complexity, model limitations' },
        { name: 'HSE Requirements', severity: 60, description: 'Safety-critical, zone classifications' },
      ]
    },
    utilities: {
      aiPressure: 65, autonomyPressure: 35, bottlenecks: [
        { name: 'Regulatory Recovery', severity: 90, description: 'Rate cases, prudency reviews for AI spend' },
        { name: 'Legacy Grid', severity: 85, description: '50-year-old infrastructure, one-way design' },
        { name: 'IT/OT Divide', severity: 75, description: 'NERC CIP, air gaps, separate orgs' },
        { name: 'Workforce', severity: 70, description: 'Aging lineworkers, skills gaps' },
      ]
    },
    maritime: {
      aiPressure: 55, autonomyPressure: 45, bottlenecks: [
        { name: 'Union Resistance', severity: 80, description: 'Longshoremen, seafarer unions' },
        { name: 'Connectivity', severity: 70, description: 'VSAT limitations, bandwidth costs' },
        { name: 'IMO Regulations', severity: 65, description: 'Safety, emissions, Manning requirements' },
        { name: 'Legacy Vessels', severity: 60, description: '25-year ship lives, retrofit challenges' },
      ]
    },
    land: {
      aiPressure: 70, autonomyPressure: 75, bottlenecks: [
        { name: 'Regulatory Approval', severity: 75, description: 'AV certification, state-by-state' },
        { name: 'Labor Relations', severity: 65, description: 'Teamsters, warehouse unions' },
        { name: 'Infrastructure', severity: 55, description: 'Charging, ODD limitations' },
        { name: 'Integration', severity: 50, description: 'TMS/WMS fragmentation' },
      ]
    },
    mining: {
      aiPressure: 65, autonomyPressure: 70, bottlenecks: [
        { name: 'Remote Operations', severity: 80, description: 'Connectivity, harsh environments' },
        { name: 'Legacy Equipment', severity: 70, description: 'Diverse OEM fleets, proprietary systems' },
        { name: 'Workforce', severity: 65, description: 'Remote locations, skills gaps' },
        { name: 'Permitting', severity: 60, description: 'Environmental reviews, community relations' },
      ]
    },
  };

  const bottleneckDefinitions = [
    { id: 'legacy-assets', name: 'Legacy Assets', icon: '🏭', color: 'bg-orange-100 border-orange-400', description: 'Equipment designed before connectivity era–no sensors, no APIs, proprietary protocols' },
    { id: 'bad-data', name: 'Bad/Missing Data', icon: '📊', color: 'bg-red-100 border-red-400', description: 'Historian gaps, inconsistent tagging, no unified data model across systems' },
    { id: 'it-ot-gap', name: 'IT/OT Divide', icon: '🔒', color: 'bg-purple-100 border-purple-400', description: 'Separate networks, different teams, security barriers, Purdue model constraints' },
    { id: 'change-mgmt', name: 'Change Management', icon: '👥', color: 'bg-blue-100 border-blue-400', description: 'Workforce resistance, union issues, skills gaps, fear of job loss' },
    { id: 'regulations', name: 'Regulatory/Compliance', icon: '📋', color: 'bg-green-100 border-green-400', description: 'GMP, safety systems, audit trails, certification requirements block rapid iteration' },
    { id: 'vendor-lock', name: 'Vendor Lock-in', icon: '🔐', color: 'bg-yellow-100 border-yellow-400', description: 'Proprietary protocols, closed ecosystems, DCS/PLC islands' },
    { id: 'integration', name: 'Integration Debt', icon: '🔗', color: 'bg-gray-100 border-gray-400', description: 'Point-to-point spaghetti, no middleware, custom connectors everywhere' },
  ];

  // ============================================
  // FOUNDATION MODELS DATA
  // ============================================

  const fmCategories = [
    {
      id: 'embodied',
      name: 'Embodied AI (VLA)',
      token: 'Action Tokens',
      predicts: 'How do I move my body to achieve this goal?',
      color: 'bg-red-100 border-red-400',
      companies: ['Physical Intelligence (π₀)', 'Covariant (RFM-1)', 'Google DeepMind (RT-2)', 'Skild AI', 'Tesla (FSD/Optimus)'],
      verticals: ['discrete', 'land', 'mining', 'construction', 'aerospace'],
    },
    {
      id: 'physics',
      name: 'Scientific Physics',
      token: 'State Tokens',
      predicts: 'How does this fluid/airflow/system evolve over time?',
      color: 'bg-blue-100 border-blue-400',
      companies: ['PhysicsX', 'NVIDIA Modulus', 'Polymathic AI (Walrus)'],
      verticals: ['process', 'aerospace', 'energy', 'maritime', 'datacenters'],
    },
    {
      id: 'bio',
      name: 'Biological & Materials',
      token: 'Chemical Tokens',
      predicts: 'What atom/amino acid comes next to make this stable?',
      color: 'bg-green-100 border-green-400',
      companies: ['EvolutionaryScale (ESM3)', 'Isomorphic Labs', 'Orbital Materials (LINUS)', 'Bioptimus'],
      verticals: ['process'],
    },
    {
      id: 'timeseries',
      name: 'Time Series',
      token: 'Temporal Tokens',
      predicts: 'What is the value at t+1?',
      color: 'bg-purple-100 border-purple-400',
      companies: ['Nixtla (TimeGPT)', 'Salesforce (Moirai)', 'Google (TimesFM)', 'Amazon (Chronos)'],
      verticals: ['utilities', 'energy', 'land', 'process', 'discrete', 'datacenters', 'mining', 'construction', 'aerospace', 'maritime'],
    },
    {
      id: 'earth',
      name: 'Earth & Atmosphere',
      token: 'Geospatial Tokens',
      predicts: 'How does this weather/ocean system evolve?',
      color: 'bg-cyan-100 border-cyan-400',
      companies: ['Jua', 'Clay', 'NVIDIA Earth-2', 'Google GraphCast', 'Sofar Ocean'],
      verticals: ['utilities', 'maritime', 'mining', 'energy', 'construction'],
    },
    {
      id: 'sensors',
      name: 'Industrial Sensors',
      token: 'Signal Tokens',
      predicts: 'Is this vibration/thermal pattern normal or anomalous?',
      color: 'bg-orange-100 border-orange-400',
      companies: ['Archetype AI (Newton)', 'Augury', 'SensiML', 'Tractian'],
      verticals: ['discrete', 'process', 'energy', 'mining', 'utilities'],
    },
    {
      id: '3d',
      name: '3D & Geometry',
      token: 'Spatial Tokens',
      predicts: 'How does this 2D shape look in 3D space?',
      color: 'bg-pink-100 border-pink-400',
      companies: ['NVIDIA Get3D', 'Luma AI', 'MeshGPT'],
      verticals: ['construction', 'discrete', 'aerospace'],
    },
  ];

  // ============================================
  // PALANTIR STRATEGY DATA
  // ============================================

  const palantirPresence = {
    'L6-aerospace': 'challenger',
    'L5-construction': 'challenger', 'L5-aerospace': 'challenger', 'L5-energy': 'challenger', 'L5-mining': 'challenger',
    'L4-discrete': 'challenger', 'L4-process': 'challenger', 'L4-energy': 'challenger', 'L4-maritime': 'challenger', 'L4-mining': 'challenger', 'L4-aerospace': 'incumbent',
    'L3-construction': 'challenger', 'L3-datacenters': 'challenger', 'L3-discrete': 'challenger', 'L3-process': 'challenger', 'L3-aerospace': 'incumbent', 'L3-energy': 'challenger', 'L3-utilities': 'challenger', 'L3-mining': 'challenger',
  };

  // ============================================
  // AUGURY STRATEGY DATA
  // ============================================

  const auguryPresence = {
    'L6-discrete': 'challenger', 'L6-process': 'challenger', 'L6-energy': 'challenger', 'L6-mining': 'challenger',
    'L3-discrete': 'challenger', 'L3-process': 'challenger', 'L3-energy': 'challenger', 'L3-mining': 'challenger',
    'L1-discrete': 'challenger', 'L1-process': 'challenger', 'L1-energy': 'challenger', 'L1-mining': 'challenger',
  };

  // C3 AI Presence - Enterprise AI across asset-intensive industries
  const c3aiPresence = {
    'L6-discrete': 'challenger', 'L6-process': 'challenger', 'L6-energy': 'challenger', 'L6-utilities': 'challenger',
    'L5-discrete': 'challenger', 'L5-process': 'challenger', 'L5-energy': 'challenger',
    'L4-discrete': 'challenger', 'L4-process': 'challenger', 'L4-energy': 'challenger', 'L4-utilities': 'challenger', 'L4-aerospace': 'challenger',
    'L3-discrete': 'challenger', 'L3-process': 'challenger', 'L3-energy': 'challenger', 'L3-utilities': 'challenger',
  };

  // Cognite Presence - Industrial DataOps focused on O&G, Process, Utilities
  const cognitePresence = {
    'L6-energy': 'challenger', 'L6-process': 'challenger', 'L6-utilities': 'challenger',
    'L4-energy': 'challenger', 'L4-process': 'challenger', 'L4-utilities': 'challenger', 'L4-mining': 'challenger',
    'L3-energy': 'challenger', 'L3-process': 'challenger', 'L3-utilities': 'challenger',
  };

  // Physical Intelligence Presence - Robot Foundation Models
  const physicalIntelligencePresence = {
    'L6-discrete': 'challenger', 'L6-land': 'challenger', 'L6-process': 'challenger',
    'L0-discrete': 'challenger', 'L0-land': 'challenger',
    'L-1-discrete': 'challenger', 'L-1-land': 'challenger',
  };

  // Covariant Presence - Warehouse Robotics AI
  const covariantPresence = {
    'L6-land': 'challenger',
    'L3-land': 'challenger',
    'L2-land': 'challenger',
    'L0-land': 'challenger',
    'L-1-land': 'challenger',
  };

  // Anduril Presence - Defense Autonomy
  const andurilPresence = {
    'L6-aerospace': 'challenger',
    'L5-aerospace': 'challenger',
    'L3-aerospace': 'challenger',
    'L2-aerospace': 'challenger',
    'L0-aerospace': 'challenger', 'L0-maritime': 'challenger',
  };

  // Wayve Presence - Embodied AI for autonomous vehicles
  const wayvePresence = {
    'L6-land': 'challenger',
    'L2-land': 'challenger',
    'L0-land': 'challenger',
    'L-1-land': 'challenger',
  };

  // Aurora Presence - Autonomous trucking
  const auroraPresence = {
    'L6-land': 'challenger',
    'L2-land': 'challenger',
    'L0-land': 'challenger',
    'L-1-land': 'challenger',
  };

  // Bright Machines Presence - Software-defined manufacturing
  const brightMachinesPresence = {
    'L3-discrete': 'challenger',
    'L2-discrete': 'challenger',
    'L0-discrete': 'challenger',
    'L-1-discrete': 'challenger',
  };

  // Bedrock Robotics Presence - Construction equipment autonomy
  const bedrockRoboticsPresence = {
    'L2-construction': 'challenger',
    'L0-construction': 'challenger',
    'L-1-construction': 'challenger',
  };

  // Third Wave Automation Presence - Autonomous forklifts
  const thirdWavePresence = {
    'L2-land': 'challenger',
    'L0-land': 'challenger',
    'L-1-land': 'challenger',
  };

  // Locus Robotics Presence - Warehouse AMRs
  const locusPresence = {
    'L0-land': 'challenger',
    'L3-land': 'challenger',
    'L-1-land': 'challenger',
  };

  // Symbio Robotics Presence - AI robot programming
  const symbioPresence = {
    'L0-discrete': 'challenger',
    'L2-discrete': 'challenger',
    'L6-discrete': 'challenger',
  };

  // Symbotic Presence - Warehouse automation
  const symboticPresence = {
    'L0-land': 'challenger',
    'L3-land': 'challenger',
    'L-1-land': 'challenger',
  };

  // VulcanForms Presence - Additive manufacturing
  const vulcanformsPresence = {
    'L0-discrete': 'challenger',
    'L3-discrete': 'challenger',
    'L0-aerospace': 'challenger',
  };

  // Tractian Presence - Predictive maintenance challenger
  const tractianPresence = {
    'L1-discrete': 'challenger',
    'L1-process': 'challenger',
    'L1-mining': 'challenger',
    'L3-discrete': 'challenger',
  };

  // New key player presence maps
  const archetypePresence = {
    'L6-discrete': 'challenger',
    'L6-construction': 'challenger',
    'L6-land': 'challenger',
    'L1-discrete': 'challenger',
    'L1-construction': 'challenger',
    'L1-land': 'challenger',
    'L3-discrete': 'challenger',
  };

  const landingAIPresence = {
    'L6-discrete': 'challenger',
    'L6-process': 'challenger',
    'L1-discrete': 'challenger',
    'L1-process': 'challenger',
  };

  const voxelPresence = {
    'L1-land': 'challenger',
    'L1-discrete': 'challenger',
    'L3-land': 'challenger',
    'L3-discrete': 'challenger',
  };

  const foxglovePresence = {
    'L2-land': 'challenger',
    'L2-discrete': 'challenger',
    'L2-aerospace': 'challenger',
    'L3-land': 'challenger',
    'L3-discrete': 'challenger',
  };

  const cerebrasPresence = {
    'L6-datacenters': 'challenger',
    'L6-discrete': 'challenger',
    'L6-process': 'challenger',
    'L6-energy': 'challenger',
    'L6-aerospace': 'challenger',
  };

  // ============================================
  // KEY PLAYERS COMPREHENSIVE DATA
  // ============================================

  const keyPlayersData = {
    palantir: {
      name: 'Palantir',
      logo: '🎯',
      tagline: 'The AI Operating System for Industrial Enterprises',
      color: 'blue',
      presence: palantirPresence,

      strategy: {
        thesis: 'Become the "AI Operating System" that sits between enterprise data and operational decisions. Own the ontology layer that maps all enterprise data into a unified model, then deploy AI applications on top.',
        play: 'Land with data integration pain (AIP/Foundry), expand by proving operational value through custom applications, then lock in with enterprise-wide ontology that becomes impossible to rip out.',
        wedge: 'Start with high-value, data-messy problems where executives are frustrated with lack of visibility. Deploy Forward Deployed Engineers (FDEs) to build trust and map the business.',
        moat: 'Ontology lock-in. Once Palantir maps your operations into their data model, switching costs are enormous. Plus deep government/defense relationships provide steady base revenue.'
      },

      offerings: [
        { name: 'Foundry', layer: 'L4', description: 'Enterprise data integration and analytics platform', value: 'Unified data model across siloed systems, operational analytics, decision support', industries: ['All verticals'] },
        { name: 'AIP (AI Platform)', layer: 'L6-L4', description: 'LLM integration layer on top of Foundry', value: 'Natural language queries on operational data, AI-assisted decision making, automated insights', industries: ['All verticals'] },
        { name: 'Gotham', layer: 'L4-L3', description: 'Defense/intelligence focused platform', value: 'Mission planning, threat analysis, logistics optimization', industries: ['Aerospace & Defense'] },
        { name: 'Apollo', layer: 'L3', description: 'Continuous deployment and operations', value: 'Software deployment across air-gapped and edge environments', industries: ['Defense', 'Energy', 'Utilities'] },
        { name: 'MetaConstellation', layer: 'L5-L3', description: 'Supply chain and logistics optimization', value: 'Multi-tier supply chain visibility, logistics optimization', industries: ['Discrete Mfg', 'Aerospace'] },
        { name: 'Foundry for Builders', layer: 'L4', description: 'Developer platform for custom apps', value: 'Build custom operational applications on Palantir infrastructure', industries: ['All verticals'] },
      ],

      buyers: {
        executive: ['CEO', 'COO', 'Chief Digital Officer', 'VP Operations'],
        champion: ['VP Digital Transformation', 'Head of Data & Analytics', 'Plant Director with P&L accountability'],
        user: ['Data analysts', 'Operations managers', 'Process engineers', 'Supply chain planners'],
        blocker: ['CIO (build vs buy)', 'IT Security (data governance)', 'Finance (cost justification)']
      },

      salesFlow: {
        phases: [
          { phase: 'Discovery', duration: '2-4 weeks', activities: 'Executive briefing, identify high-value pain points, scope initial use case', keyAction: 'FDEs conduct "data safari" to understand current state' },
          { phase: 'Pilot', duration: '8-16 weeks', activities: 'Deploy FDE team (2-5 engineers), build ontology for pilot scope, deliver first application', keyAction: 'Prove value with one transformative use case' },
          { phase: 'Land', duration: '3-6 months', activities: 'Expand ontology to adjacent areas, train internal team, sign initial contract', keyAction: 'Show ROI that justifies enterprise investment' },
          { phase: 'Expand', duration: 'Ongoing', activities: 'Roll out to additional sites/business units, add new use cases, deepen ontology', keyAction: 'Become the enterprise "AI operating system"' },
        ],
        model: 'High-touch, FDE-intensive land-and-expand. Initial deals $1-5M, expanding to $20-100M+ enterprise agreements.',
        expansion: 'Site-by-site rollout → Cross-functional use cases → Enterprise-wide platform deal'
      },

      competitivePosition: {
        strengths: ['Ontology/data model depth', 'FDE deployment capability', 'Government/defense credibility', 'Proven at scale in complex environments'],
        weaknesses: ['Expensive (requires FDE investment)', 'Perception as "consulting-heavy"', 'Less domain depth than vertical specialists'],
        vsIncumbents: 'vs SAP/Oracle: More AI-native, faster to deploy custom applications, but less transactional depth',
        vsChallengers: 'vs Databricks/Snowflake: More operational focus, ontology layer vs raw data platform',
      }
    },

    augury: {
      name: 'Augury',
      logo: '📡',
      tagline: 'Machine Health Intelligence Platform',
      color: 'orange',
      presence: auguryPresence,

      strategy: {
        thesis: 'Own the "machine health" category by building the largest proprietary dataset of industrial equipment sensor data, then evolve into a Sensor Fusion Model that predicts equipment behavior across all asset types.',
        play: 'Land with predictive maintenance (immediate ROI from avoiding downtime), expand to full machine health visibility, then leverage data moat to build AI models that competitors cannot replicate.',
        wedge: 'Start with critical rotating equipment (pumps, motors, fans) where unplanned downtime is expensive. Quick deployment with non-invasive sensors that don\'t require IT involvement.',
        moat: 'Proprietary sensor data from 100,000+ machines across industries. Each deployment adds to training data for AI models, creating a flywheel that improves predictions over time.'
      },

      offerings: [
        { name: 'Machine Health', layer: 'L1', description: 'Core PdM platform for rotating equipment', value: 'Predict failures 30-90 days ahead, reduce unplanned downtime 50%+, extend equipment life', industries: ['Discrete Mfg', 'Process Mfg', 'Energy', 'Mining'] },
        { name: 'Process Health', layer: 'L1-L3', description: 'Production process monitoring', value: 'Quality prediction, process optimization, yield improvement', industries: ['Process Mfg', 'Energy', 'Food & Beverage'] },
        { name: 'Augury AI', layer: 'L6', description: 'Sensor fusion model (emerging)', value: 'Cross-asset anomaly detection, transfer learning across equipment types', industries: ['Discrete Mfg', 'Process Mfg', 'Energy', 'Mining'] },
        { name: 'Integration Hub', layer: 'L3-L4', description: 'CMMS/ERP integration layer', value: 'Automatic work order creation, maintenance scheduling optimization', industries: ['All industrial'] },
      ],

      buyers: {
        executive: ['VP Operations', 'VP Reliability', 'Chief Manufacturing Officer'],
        champion: ['Reliability Manager', 'Maintenance Director', 'Plant Manager with downtime pain'],
        user: ['Reliability engineers', 'Maintenance technicians', 'Condition monitoring specialists'],
        blocker: ['IT (sensor connectivity)', 'Procurement (incumbent sensor vendors)', 'OEMs (warranty concerns)']
      },

      salesFlow: {
        phases: [
          { phase: 'Discovery', duration: '1-2 weeks', activities: 'Identify critical assets, review maintenance history, calculate downtime costs', keyAction: 'Build business case showing ROI from avoided failures' },
          { phase: 'Proof of Value', duration: '4-8 weeks', activities: 'Deploy sensors on 10-20 critical assets, baseline normal behavior, catch first predictions', keyAction: 'Demonstrate accurate prediction of real issue' },
          { phase: 'Site Rollout', duration: '2-4 months', activities: 'Expand to all critical rotating equipment at site, integrate with CMMS, train reliability team', keyAction: 'Prove site-wide value, calculate actual savings' },
          { phase: 'Enterprise Expand', duration: 'Ongoing', activities: 'Roll out to additional plants, standardize on Augury for all PdM, add Process Health', keyAction: 'Become enterprise standard for machine health' },
        ],
        model: 'Enterprise/mid-market sales and channel partnerships with quick POV. Initial pilots $50-150K, site deals $200-500K, enterprise $1-5M+',
        expansion: 'Critical assets → Full site → Multi-site → Enterprise standard → Process Health upsell'
      },

      competitivePosition: {
        strengths: ['Largest industrial sensor dataset', 'AI/ML-native from founding', 'Quick time-to-value', 'Non-invasive deployment'],
        weaknesses: ['Limited to rotating equipment (expanding)', 'Less integration depth than OEMs', 'Newer brand vs established players'],
        vsIncumbents: 'vs SKF/Emerson: AI-native vs sensor-first, faster deployment, but less hardware ecosystem',
        vsChallengers: 'vs Archetype AI: Domain depth vs horizontal play. Augury owns machine health; Archetype building broader sensor FM',
      }
    },

    c3ai: {
      name: 'C3 AI',
      logo: '🤖',
      tagline: 'Enterprise AI Application Platform',
      color: 'blue',
      presence: c3aiPresence,

      strategy: {
        thesis: 'Become the enterprise AI operating system by providing both the platform (C3 Agentic AI Platform) and pre-built applications (130+ turnkey apps) that accelerate AI deployment in asset-intensive industries.',
        play: 'Land with proven applications (Reliability, Supply Chain Optimization, Energy Management), expand to platform licensing for custom AI development, then become the enterprise AI standard.',
        wedge: 'Start with predictive maintenance and asset performance–immediate ROI from reduced downtime. Pre-built applications deploy in 1-2 quarters vs years for custom development.',
        moat: 'Model-driven architecture enables 25x faster development with 95% less code. Library of 130+ turnkey applications across industries. Deep partnerships with Microsoft, AWS, Google Cloud.'
      },

      offerings: [
        { name: 'C3 AI Reliability', layer: 'L3-L4', description: 'Predictive maintenance and asset performance', value: 'Improve uptime, reduce maintenance costs, extend equipment life. 31M daily predictions at ConEdison.', industries: ['Process Mfg', 'Utilities', 'Energy', 'Discrete Mfg'] },
        { name: 'C3 AI Supply Chain', layer: 'L5', description: 'Demand forecasting, inventory optimization, supply network visibility', value: 'Improved forecast accuracy, reduced inventory costs. Nucor achieved multimillion-dollar savings.', industries: ['Discrete Mfg', 'Process Mfg', 'Land Transport'] },
        { name: 'C3 AI Energy Management', layer: 'L3-L4', description: 'Energy consumption optimization and demand prediction', value: 'Reduce energy costs 10-30%, predict peak demand, optimize facility operations', industries: ['Discrete Mfg', 'Process Mfg', 'Data Centers', 'Utilities'] },
        { name: 'C3 Generative AI', layer: 'L6', description: 'Domain-specific GenAI for enterprise', value: 'Operator assistance, technician troubleshooting, document analysis. Agentic AI for complex workflows.', industries: ['All industrial'] },
        { name: 'C3 Agentic AI Platform', layer: 'L6', description: 'End-to-end platform for enterprise AI development', value: 'Build custom AI apps 25x faster. Unified data, model lifecycle management, deployment at scale.', industries: ['All industrial'] },
      ],

      buyers: {
        executive: ['CDO', 'CIO', 'VP Digital Transformation', 'COO'],
        champion: ['VP Operations', 'VP Reliability', 'Director Data Science', 'Head of Manufacturing'],
        user: ['Data scientists', 'Reliability engineers', 'Operations analysts', 'Plant managers'],
        blocker: ['IT (integration complexity)', 'Existing platform vendors', 'Budget holders (enterprise pricing)']
      },

      salesFlow: {
        phases: [
          { phase: 'Discovery', duration: '2-4 weeks', activities: 'Executive briefing, identify high-value use cases (reliability, supply chain), assess data readiness', keyAction: 'Build business case for 2-3 priority applications' },
          { phase: 'Proof of Value', duration: '8-12 weeks', activities: 'Deploy turnkey application on subset of assets, demonstrate predictions, validate ROI', keyAction: 'Show measurable business impact (avoided downtime, cost savings)' },
          { phase: 'Production Deployment', duration: '1-2 quarters', activities: 'Scale application across enterprise, integrate with existing systems (ERP, CMMS)', keyAction: 'Achieve production-grade deployment with measurable KPIs' },
          { phase: 'Platform Expansion', duration: 'Ongoing', activities: 'Add applications, license platform for custom development, expand to new business units', keyAction: 'Become enterprise AI standard' },
        ],
        model: 'Application SaaS licensing plus platform fees. Initial deployments $500K-2M, enterprise agreements $5-20M+',
        expansion: 'Single application → Multiple applications → Platform licensing → Enterprise AI standard'
      },

      competitivePosition: {
        strengths: ['130+ pre-built applications', 'Model-driven architecture (25x faster)', 'Major cloud partnerships', 'Proven at scale (Shell, US Air Force, Koch)'],
        weaknesses: ['Enterprise pricing perceived as expensive', 'Less domain depth than vertical specialists', 'Requires significant data preparation'],
        vsIncumbents: 'vs SAP/Oracle: AI-native vs bolted-on AI. Faster to deploy AI applications, but less transactional/ERP depth',
        vsChallengers: 'vs Palantir: More pre-built applications vs custom ontology. C3 is more "turnkey," Palantir more "bespoke"',
      }
    },

    cognite: {
      name: 'Cognite',
      logo: '🔗',
      tagline: 'Industrial DataOps Platform',
      color: 'teal',
      presence: cognitePresence,

      strategy: {
        thesis: 'Own the industrial data layer by solving the "data liberation" problem–contextualizing and connecting siloed OT/IT data so AI and analytics can actually work. Become the data foundation that all industrial AI applications build on.',
        play: 'Land by solving the #1 blocker to industrial AI: bad/missing/siloed data. Cognite Data Fusion contextualizes data from historians, ERP, sensors, and documents into a unified industrial data model. Then expand as the platform for all analytics and AI.',
        wedge: 'Start with asset-intensive industries drowning in data silos (Oil & Gas, Utilities, Process Mfg). Quick wins from finally connecting historian data to maintenance systems, enabling actual condition-based decisions.',
        moat: 'Proprietary industrial data model and contextualization engine. Network effects as more connectors and applications are built on the platform. Deep domain expertise in process industries.'
      },

      offerings: [
        { name: 'Cognite Data Fusion', layer: 'L4', description: 'Industrial DataOps platform for data liberation and contextualization', value: 'Connect 80% of industrial data that is currently siloed. Enable analytics and AI on unified data model.', industries: ['Energy', 'Process Mfg', 'Utilities', 'Mining'] },
        { name: 'Data Contextualization', layer: 'L4', description: 'AI-powered linking of time series, assets, documents, 3D models', value: 'Transform raw data into connected knowledge graph. 70% reduction in data preparation time.', industries: ['Energy', 'Process Mfg', 'Utilities'] },
        { name: 'Industrial Applications', layer: 'L3-L4', description: 'Pre-built apps for operations, maintenance, production', value: 'OEE monitoring, predictive insights, digital twin visualization. Built on Data Fusion foundation.', industries: ['Energy', 'Process Mfg', 'Utilities', 'Discrete Mfg'] },
        { name: 'Cognite AI/GenAI', layer: 'L6', description: 'Industrial AI and GenAI on contextualized data', value: 'Reliable AI responses grounded in actual operational data. Not hallucinating–data-backed insights.', industries: ['Energy', 'Process Mfg', 'Utilities'] },
      ],

      buyers: {
        executive: ['CDO', 'VP Digital', 'CIO', 'VP Operations'],
        champion: ['Head of Data', 'Digital Transformation Lead', 'Operations Technology Manager'],
        user: ['Data engineers', 'Process engineers', 'Reliability engineers', 'Data scientists'],
        blocker: ['IT (data governance concerns)', 'Historian vendors (OSIsoft/AVEVA)', 'Security (OT connectivity)']
      },

      salesFlow: {
        phases: [
          { phase: 'Data Assessment', duration: '2-4 weeks', activities: 'Inventory data sources (historians, ERP, docs), identify integration complexity, map to use cases', keyAction: 'Quantify "data debt" and value of liberation' },
          { phase: 'Data Foundation', duration: '2-3 months', activities: 'Deploy Data Fusion, connect priority data sources, build initial asset model', keyAction: 'Demonstrate unified data access across previously siloed systems' },
          { phase: 'Use Case Delivery', duration: '3-6 months', activities: 'Enable specific use cases (PdM, production optimization), deploy applications on data foundation', keyAction: 'Prove ROI: downtime reduction, efficiency gains' },
          { phase: 'Scale & Expand', duration: 'Ongoing', activities: 'Extend to additional sites, add data sources, enable partner applications', keyAction: 'Become enterprise data backbone for all industrial AI' },
        ],
        model: 'Platform subscription based on data volume and users. Initial projects $300K-1M, enterprise $2-10M+',
        expansion: 'Single site data foundation → Multi-site rollout → Enterprise data platform → Ecosystem enablement'
      },

      competitivePosition: {
        strengths: ['Purpose-built for industrial data', 'Strong in Oil & Gas and Process', 'Open architecture for partner apps', 'Deep OT data expertise'],
        weaknesses: ['Less known outside core verticals', 'Requires data engineering investment', 'Competes with established historian vendors'],
        vsIncumbents: 'vs OSIsoft/AVEVA: Data contextualization layer vs historian. Cognite sits on top and adds intelligence',
        vsChallengers: 'vs Palantir/C3: More focused on data foundation vs applications. "Data layer" vs "AI layer" positioning',
      }
    },

    physicalintelligence: {
      name: 'Physical Intelligence',
      logo: '🦾',
      tagline: 'General-Purpose Robot Foundation Models',
      color: 'purple',
      presence: physicalIntelligencePresence,

      strategy: {
        thesis: 'Build the "GPT for robots"–a general-purpose foundation model (π0) that enables any robot to perform dexterous manipulation tasks, trained on massive multi-robot datasets. Become the AI brain that powers billions of robots.',
        play: 'Develop Vision-Language-Action (VLA) models that combine internet-scale pretraining with real-world robot data. Open-source base models to drive adoption, then monetize through enterprise licensing and fine-tuning services.',
        wedge: 'Focus on dexterous manipulation–the hardest robotics problem. Demonstrate generalization across robots, tasks, and environments that no other approach can match.',
        moat: 'Proprietary training infrastructure and methodology. Data flywheel from deployments. Team includes top robotics AI researchers (Berkeley/Google). $1B+ raised from top investors.'
      },

      offerings: [
        { name: 'π0 Foundation Model', layer: 'L6', description: 'General-purpose VLA model for robot control', value: 'Pre-trained on 7 robot platforms, 68 tasks. Fine-tune to new tasks with 1-20 hours of data.', industries: ['Discrete Mfg', 'Land Transport', 'Process Mfg'] },
        { name: 'π0.5 (Open-World)', layer: 'L6', description: 'VLA with open-world generalization', value: 'Perform tasks in entirely new environments never seen in training. Kitchen/bedroom cleanup in new homes.', industries: ['Service Robotics', 'Logistics'] },
        { name: 'π0-FAST', layer: 'L6', description: 'Efficient VLA with action tokenization', value: '5x faster training, improved language following. Compress action sequences for efficient inference.', industries: ['All robotics'] },
        { name: 'Robot Labor Automation', layer: 'L-1/L0', description: 'Enable robots to perform human manipulation tasks', value: 'Folding laundry, bussing tables, packing items, cleaning–tasks previously requiring human dexterity. The "Labor + Physics Collapse."', industries: ['Discrete Mfg', 'Land Transport', 'Service'] },
        { name: 'openpi (Open Source)', layer: 'L6', description: 'Open-source π0 weights and code', value: 'Community adoption, ecosystem building. Fine-tune for custom tasks and platforms.', industries: ['Research', 'Startups'] },
      ],

      buyers: {
        executive: ['CTO', 'VP Robotics/Automation', 'Head of AI', 'Chief Robotics Officer'],
        champion: ['Robotics Lead', 'AI/ML Director', 'Automation Engineering Manager'],
        user: ['Robotics engineers', 'ML engineers', 'Manipulation researchers'],
        blocker: ['Existing robot OEMs (Fanuc, ABB)', 'In-house AI teams', 'Safety/validation concerns']
      },

      salesFlow: {
        phases: [
          { phase: 'Evaluation', duration: '2-4 weeks', activities: 'Test open-source π0 on target robot platform, assess task coverage, benchmark vs existing approach', keyAction: 'Demonstrate superior generalization on manipulation tasks' },
          { phase: 'Fine-Tuning Pilot', duration: '4-8 weeks', activities: 'Collect task-specific data (1-20 hours), fine-tune π0, deploy on pilot cell/application', keyAction: 'Prove faster development cycle and better performance' },
          { phase: 'Production Integration', duration: '2-4 months', activities: 'Scale to production, integrate with robot fleet, establish monitoring and improvement loop', keyAction: 'Achieve production reliability and throughput targets' },
          { phase: 'Fleet Expansion', duration: 'Ongoing', activities: 'Roll out across robot fleet, add new tasks, contribute data for model improvement', keyAction: 'Become standard AI backbone for manipulation' },
        ],
        model: 'Open-source base model + enterprise licensing for commercial use. Fine-tuning services and support.',
        expansion: 'Single robot/task → Multi-task deployment → Fleet-wide adoption → Platform partnership'
      },

      competitivePosition: {
        strengths: ['Leading VLA research team', 'Open-source community building', 'Massive funding ($1B+)', 'Generalization across robots/tasks'],
        weaknesses: ['Pre-revenue/early commercial stage', 'Requires robot integrator partners', 'Unproven at production scale'],
        vsIncumbents: 'vs Fanuc/ABB: Software-defined vs hardware-defined robotics. PI enables any hardware.',
        vsChallengers: 'vs Covariant: Horizontal platform vs vertical (warehouse). PI is robot-agnostic; Covariant was warehouse-focused.',
      }
    },

    covariant: {
      name: 'Covariant',
      logo: '📦',
      tagline: 'Robotics Foundation Model for Warehouses',
      color: 'green',
      presence: covariantPresence,

      strategy: {
        thesis: 'Build the largest real-world robot manipulation dataset through deployed warehouse robots, then train foundation models (RFM-1) that enable human-like reasoning for any warehouse task.',
        play: 'Deploy picking robots at scale to collect massive multimodal dataset (tens of millions of trajectories). Use this data moat to train 8B parameter RFM-1 that competitors cannot replicate.',
        wedge: 'Warehouse picking–high variability (millions of SKUs), immediate ROI (labor costs), and generates training data. Deployed in 15 countries with dozens of customers.',
        moat: 'Proprietary dataset: 1M trajectories every few weeks from deployed robots. Fleet learning across 4 continents. UC Berkeley AI pedigree (Pieter Abbeel, Peter Chen).'
      },

      offerings: [
        { name: 'RFM-1', layer: 'L6', description: '8B parameter Robotics Foundation Model', value: 'Human-like reasoning for robots. Physics world model, language-guided programming, in-context learning.', industries: ['Land Transport', 'Discrete Mfg', 'Retail'] },
        { name: 'Covariant Brain', layer: 'L2-L3', description: 'AI-powered picking system', value: 'Pick virtually any SKU on Day One. Human-level speed and reliability. Handles items never seen before.', industries: ['Land Transport', 'Retail', 'E-commerce'] },
        { name: 'Picking Applications', layer: 'L3', description: 'Order sortation, item induction, goods-to-person, depalletization', value: 'Multiple picking use cases from single AI platform. Fleet learning across network.', industries: ['Land Transport', 'Retail'] },
      ],

      buyers: {
        executive: ['VP Logistics', 'VP Fulfillment', 'Chief Supply Chain Officer', 'COO'],
        champion: ['Distribution Center Director', 'Automation Manager', 'Operations Director'],
        user: ['Warehouse managers', 'Operations supervisors', 'Maintenance technicians'],
        blocker: ['Incumbent automation vendors', 'Labor unions', 'CapEx approval']
      },

      salesFlow: {
        phases: [
          { phase: 'Assessment', duration: '2-4 weeks', activities: 'Analyze SKU variability, volume, current picking costs, integration requirements', keyAction: 'Build business case: labor savings, throughput improvement' },
          { phase: 'Pilot', duration: '2-3 months', activities: 'Deploy picking cell, integrate with WMS, validate pick rates and accuracy', keyAction: 'Prove reliability on live inventory' },
          { phase: 'Production Scale', duration: '3-6 months', activities: 'Expand to full deployment, multiple stations, 24/7 operation', keyAction: 'Achieve ROI targets, demonstrate fleet learning benefits' },
          { phase: 'Network Rollout', duration: 'Ongoing', activities: 'Deploy across distribution network, leverage cross-site learning', keyAction: 'Standardize on Covariant for warehouse automation' },
        ],
        model: 'RaaS (Robots-as-a-Service) or purchase. Priced per pick or monthly subscription.',
        expansion: 'Single use case → Multiple picking applications → Multi-site deployment → Network standard'
      },

      competitivePosition: {
        strengths: ['Largest real-world robot dataset', 'Proven at scale (15 countries)', 'UC Berkeley AI pedigree', 'RFM-1 foundation model'],
        weaknesses: ['Amazon deal created uncertainty (2024)', 'Warehouse-focused (less horizontal)', 'Key talent moved to Amazon'],
        vsIncumbents: 'vs Knapp/Dematic: AI-native vs traditional automation. Handles variability that rule-based systems cannot.',
        vsChallengers: 'vs Physical Intelligence: Vertical (warehouse) vs horizontal. Covariant has production data; PI has broader ambition.',
      }
    },

    anduril: {
      name: 'Anduril',
      logo: '🛡️',
      tagline: 'Defense Autonomy Platform',
      color: 'slate',
      presence: andurilPresence,

      strategy: {
        thesis: 'Transform defense with AI-powered autonomous systems by building both the software platform (Lattice) and the hardware (drones, submarines, missiles) that legacy primes cannot deliver at startup speed.',
        play: 'Lattice OS becomes the "operating system for war"–connecting sensors, shooters, and commanders across all domains. Hardware products generate revenue and prove the platform. Arsenal factories enable mass production.',
        wedge: 'Counter-UAS (drone defense)–urgent need, rapid iteration, proves the platform. Expand to surveillance (Sentry), autonomous vehicles (Ghost drones, submarines), and eventually offensive systems.',
        moat: 'Vertically integrated: hardware + software + manufacturing. Lattice ecosystem with 10+ partner integrations (Lattice Mesh). Arsenal flexible manufacturing. VC-backed speed vs legacy cost-plus.'
      },

      offerings: [
        { name: 'Lattice OS', layer: 'L6', description: 'AI-powered command and control platform', value: 'Fuse thousands of sensors into real-time 3D picture. One operator controls many autonomous assets.', industries: ['Aerospace Defense'] },
        { name: 'Lattice Mesh', layer: 'L4-L5', description: 'Open ecosystem for defense data sharing', value: 'Publish/subscribe data feeds. 10+ companies building on Lattice. SDK for rapid integration.', industries: ['Aerospace Defense'] },
        { name: 'Ghost Family (UAS)', layer: 'L0', description: 'Autonomous drones for ISR and strike', value: 'Ghost X selected by US Army. 75 min flight, 25km range. Swarm capable.', industries: ['Aerospace Defense'] },
        { name: 'Counter-UAS Systems', layer: 'L0-L2', description: 'Sentry towers, Anvil interceptors, layered defense', value: 'Detect, track, identify, intercept enemy drones. AI-powered threat classification.', industries: ['Aerospace Defense'] },
        { name: 'Ghost Shark (XL-AUV)', layer: 'L0', description: 'Extra-large autonomous undersea vehicle', value: '$100M Royal Australian Navy contract. Carry dozens of smaller UUVs. Undersea persistence.', industries: ['Aerospace Defense', 'Maritime'] },
        { name: 'Arsenal Manufacturing', layer: 'L0', description: 'Flexible defense manufacturing platform', value: 'Produce autonomous systems at scale. Months not years. Reduce unit costs through software-defined design.', industries: ['Aerospace Defense'] },
      ],

      buyers: {
        executive: ['Service Secretaries', 'Combatant Commanders', 'Program Executive Officers', 'Allied Defense Ministers'],
        champion: ['Innovation Units (DIU, AFWERX)', 'Operational Commands', 'Tech-forward Flag Officers'],
        user: ['Warfighters', 'UAV operators', 'Intelligence analysts', 'Base security'],
        blocker: ['Legacy primes (Lockheed, Northrop)', 'Acquisition bureaucracy', 'Budget cycle timing']
      },

      salesFlow: {
        phases: [
          { phase: 'Demonstration', duration: '1-3 months', activities: 'Field demonstration of capability (counter-UAS, ISR), show Lattice integration', keyAction: 'Prove performance in relevant operational environment' },
          { phase: 'Pilot Contract', duration: '6-12 months', activities: 'Limited deployment, operational evaluation, user feedback', keyAction: 'Validate military utility and operator acceptance' },
          { phase: 'Program of Record', duration: '1-2 years', activities: 'Transition from innovation funding to sustainment, production contract', keyAction: 'Win competitive selection or sole-source based on proven performance' },
          { phase: 'Platform Expansion', duration: 'Ongoing', activities: 'Add Lattice integrations, new hardware products, allied nation sales', keyAction: 'Become standard platform for autonomous operations' },
        ],
        model: 'Product sales + platform licensing. Mix of OTA, SBIR, and traditional contracts. $1B+ revenue in 2024.',
        expansion: 'Single capability → Multi-domain integration → Lattice platform standard → Allied nation expansion'
      },

      competitivePosition: {
        strengths: ['Startup speed with defense credibility', 'Vertically integrated (HW+SW+Mfg)', 'Lattice ecosystem growing', '$28B valuation, $1B revenue'],
        weaknesses: ['Limited production scale vs legacy primes', 'Export controls for allied sales', 'Dependent on US defense budget'],
        vsIncumbents: 'vs Lockheed/Northrop: Software-first vs hardware-first. Faster iteration, lower cost, AI-native.',
        vsChallengers: 'vs Shield AI: More vertically integrated. Anduril builds platforms; Shield AI focused on autonomy stacks.',
      }
    },

    wayve: {
      name: 'Wayve',
      logo: '🚗',
      tagline: 'Embodied AI for Autonomous Driving',
      color: 'purple',
      presence: wayvePresence,

      strategy: {
        thesis: 'Build the "GPT for driving"–end-to-end learned AI that adapts to any vehicle, any city, without HD maps or hand-coded rules. Embodied AI that learns from experience is the only scalable path to global autonomous driving.',
        play: 'License foundation model to OEMs as "AI Driver" software stack. Start with ADAS (L2+), upgrade to full autonomy (L4) via OTA as models improve. Hardware-agnostic, mapless approach enables rapid global scaling.',
        wedge: 'Delivery vehicles in UK (Asda, Ocado partnerships)–structured routes, commercial value from day one. Expand to personal vehicles via Nissan partnership. Robotaxi service with Uber in London by 2026.',
        moat: 'End-to-end learning from 3B+ miles of UK driving data. LINGO/GAIA foundation models for driving. Vision-only approach (no lidar dependency). OEM partnerships (Nissan, Uber). Eclipse/SoftBank/NVIDIA backing.'
      },

      offerings: [
        { name: 'AI Driver', layer: 'L6', description: 'End-to-end learned driving foundation model', value: 'Adapts to new cities in weeks, not years. Handles novel situations through learned intuition vs coded rules.', industries: ['Land Transport'] },
        { name: 'Wayve Gen 3 Platform', layer: 'L2', description: 'NVIDIA DRIVE Thor-powered autonomy stack', value: 'Hardware-agnostic integration. Production-ready for OEM deployment. Scalable from ADAS to full L4.', industries: ['Land Transport'] },
        { name: 'LINGO-2', layer: 'L6', description: 'Vision-language-action model for driving', value: 'Explain driving decisions in natural language. Link perception, reasoning, and action in closed loop.', industries: ['Land Transport'] },
        { name: 'GAIA-3', layer: 'L6', description: 'World model for synthetic data generation', value: 'Generate rare/dangerous scenarios for training. Accelerate validation without real-world risk.', industries: ['Land Transport'] },
        { name: 'Wayve Infinity Simulator', layer: 'L3', description: 'Cloud simulation platform', value: 'Petabyte-scale data processing on Azure. Test millions of scenarios. Continuous model improvement.', industries: ['Land Transport'] },
      ],

      buyers: {
        executive: ['OEM CEOs', 'Chief Technology Officers', 'VP Autonomous Driving', 'Fleet Operators'],
        champion: ['AV Program Directors', 'Software Engineering Leads', 'Innovation Teams'],
        user: ['Vehicle safety engineers', 'Fleet managers', 'Robotaxi operators', 'Delivery fleet managers'],
        blocker: ['OEM in-house AV teams', 'Waymo/Cruise ecosystem', 'Regulatory uncertainty']
      },

      salesFlow: {
        phases: [
          { phase: 'Technical Evaluation', duration: '3-6 months', activities: 'Demo rides, technical deep-dives, simulation benchmarks', keyAction: 'Prove capability in relevant operational design domain' },
          { phase: 'Integration Pilot', duration: '6-12 months', activities: 'Integrate AI Driver into OEM vehicle, validate safety case', keyAction: 'Achieve safety parity with human drivers in test fleet' },
          { phase: 'Commercial Launch', duration: '12-24 months', activities: 'Production deployment, OTA updates, scaling', keyAction: 'Launch ADAS product, roadmap to L4' },
          { phase: 'Platform Expansion', duration: 'Ongoing', activities: 'New vehicle lines, new geographies, robotaxi services', keyAction: 'Become OEM\'s standard autonomy platform' },
        ],
        model: 'Software licensing to OEMs (per-vehicle or subscription). Robotaxi revenue share with fleet partners. ~600 employees, $1.3B+ raised.',
        expansion: 'UK delivery → Nissan ADAS → Uber robotaxi London → Global OEM licensing'
      },

      competitivePosition: {
        strengths: ['End-to-end learning (no HD maps)', 'OEM partnerships (Nissan, Uber)', '$1.3B+ raised, $1B Series C (largest UK AI round)', 'NVIDIA strategic investment ($500M pending)'],
        weaknesses: ['Pre-revenue at scale', 'UK-centric data', 'No US presence yet', 'Execution risk in consumer vehicles'],
        vsIncumbents: 'vs Waymo/Cruise: Mapless approach scales globally. No expensive lidar. Software-only model enables OEM partnerships.',
        vsChallengers: 'vs Tesla FSD: OEM-agnostic, not locked to single manufacturer. vs Aurora: Consumer focus vs trucking. vs Mobileye: End-to-end learning vs rules-based.',
      }
    },

    aurora: {
      name: 'Aurora Innovation',
      logo: '🚛',
      tagline: 'Self-Driving Trucks at Scale',
      color: 'orange',
      presence: auroraPresence,

      strategy: {
        thesis: 'Solve the trucking labor crisis with autonomous trucks that operate 20 hours/day. Crawl-walk-run approach: prove safety on limited routes, then expand systematically. Build the platform, partner for hardware.',
        play: 'Aurora Driver becomes the "brain" for autonomous trucks. OEM partnerships (Volvo, PACCAR) for hardware. Carrier partnerships (FedEx, Schneider, Uber Freight) for demand. Operate as carrier first, then driver-as-a-service.',
        wedge: 'Texas freight corridors (Dallas-Houston, Fort Worth-El Paso)–favorable regulations, high freight volume. Prove commercial viability, then expand Sun Belt network.',
        moat: 'Founders from Waymo/Tesla/Uber. FirstLight lidar (2x camera range in dust). Continental partnership for Gen 3 hardware at scale (2027). Volvo/PACCAR OEM integration. 100K+ driverless miles, zero safety incidents.'
      },

      offerings: [
        { name: 'Aurora Driver', layer: 'L6', description: 'SAE Level 4 autonomous driving system', value: 'Feature-complete for highway trucking. Verifiable AI with provable safety claims. 97% safety case complete.', industries: ['Land Transport'] },
        { name: 'FirstLight Lidar', layer: 'L1', description: 'Proprietary long-range lidar', value: 'See through dust at 2x camera range. Purpose-built for trucking conditions. Gen 2 reduces cost 50%.', industries: ['Land Transport'] },
        { name: 'Aurora Horizon', layer: 'L3', description: 'Trucking-as-a-service platform', value: 'Carriers book autonomous loads. 20-hour daily operation. 160+ commercial loads/week.', industries: ['Land Transport'] },
        { name: 'Virtual Testing Suite', layer: 'L3', description: 'Simulation and safety validation', value: 'Test edge cases at scale. TÜV SÜD certified safety approach. Regulatory trust enabler.', industries: ['Land Transport'] },
      ],

      buyers: {
        executive: ['Carrier CEOs', 'VP Fleet Operations', 'Chief Logistics Officers', 'Shipper Supply Chain VPs'],
        champion: ['Innovation Directors', 'Fleet Technology Managers', 'Safety Directors'],
        user: ['Load planners', 'Fleet dispatchers', 'Maintenance teams', 'Terminal operators'],
        blocker: ['Driver unions', 'Insurance uncertainty', 'State-by-state regulations']
      },

      salesFlow: {
        phases: [
          { phase: 'Pilot Loads', duration: '3-6 months', activities: 'Test commercial freight on approved corridors with safety driver', keyAction: 'Prove on-time delivery and cargo safety' },
          { phase: 'Driverless Operations', duration: '6-12 months', activities: 'Remove safety driver, 24/7 autonomous hauling', keyAction: 'Demonstrate commercial viability without human backup' },
          { phase: 'Lane Expansion', duration: 'Ongoing', activities: 'New corridors, new terminals, more carriers', keyAction: 'Build Sun Belt network effect' },
          { phase: 'Driver-as-a-Service', duration: '2026+', activities: 'Carriers buy Aurora-equipped trucks, pay per mile', keyAction: 'Transition from carrier to platform model' },
        ],
        model: 'Carrier model (operate trucks, sell haul services) transitioning to DaaS (per-mile subscription). $2M TTM revenue, $8.7B market cap.',
        expansion: 'Dallas-Houston → Fort Worth-El Paso → Phoenix → Sun Belt network → National'
      },

      competitivePosition: {
        strengths: ['Proven commercial loads (20K+)', 'OEM partnerships (Volvo, PACCAR)', '$1.4B cash runway to 2026', 'Continental Gen 3 hardware (2027)'],
        weaknesses: ['Pre-revenue at scale', 'Limited to Texas corridors', 'High burn rate (~$600M/year)', 'Regulatory uncertainty beyond Texas'],
        vsIncumbents: 'vs Manual trucking: 20 hrs/day vs 11 hrs. Addresses 80K driver shortage. Reduces insurance costs via safer driving.',
        vsChallengers: 'vs Kodiak: More OEM integration. vs Waymo Via: Focused on trucking, not diversified. vs Tesla Semi: Dedicated L4, not ADAS approach.',
      }
    },

    brightMachines: {
      name: 'Bright Machines',
      logo: '🏭',
      tagline: 'Software-Defined Manufacturing',
      color: 'green',
      presence: brightMachinesPresence,

      strategy: {
        thesis: 'Manufacturing is the last frontier of software transformation. "Software-defined microfactories" enable 2x faster deployment, 75% more throughput, and AI-powered continuous improvement.',
        play: 'Full-stack solution: Brightware software + Bright Robotic Cells (BRCs) + services. Focus on AI hardware manufacturing (servers, GPUs) where demand is explosive and precision critical.',
        wedge: 'Electronics assembly–final assembly and inspection are still highly manual. Modular cells deploy in weeks vs months for traditional automation. Pivot to AI Factory model for AI infrastructure hardware.',
        moat: 'Brightware Platform connects design→assembly→disassembly lifecycle. 100+ microfactories in 13 countries. NVIDIA/Microsoft partnerships for AI integration. Eclipse-backed with $400M+ raised.'
      },

      offerings: [
        { name: 'Brightware Platform', layer: 'L3', description: 'Cloud software for factory orchestration', value: 'Design, simulate, deploy, monitor assembly lines. No-code configuration. Continuous optimization via ML.', industries: ['Discrete Manufacturing'] },
        { name: 'Bright Robotic Cells (BRCs)', layer: 'L0', description: 'Modular, reconfigurable assembly cells', value: 'Plug-and-play assembly units. Swap accessories for different products. 2x faster deployment than traditional lines.', industries: ['Discrete Manufacturing'] },
        { name: 'AI Factory Model', layer: 'L3', description: 'Technology-enabled digital manufacturing service', value: 'Bright Machines operates factories for AI hardware OEMs. Full lifecycle from design to disassembly/recycling.', industries: ['Discrete Manufacturing', 'Data Centers'] },
        { name: 'Adaptive Vision', layer: 'L1', description: 'AI-powered inspection and quality control', value: '65% fewer defects. Real-time quality prediction. Traceability throughout assembly.', industries: ['Discrete Manufacturing'] },
      ],

      buyers: {
        executive: ['VP Manufacturing', 'Chief Operations Officer', 'VP Supply Chain', 'Plant Directors'],
        champion: ['Manufacturing Engineering Directors', 'Automation Managers', 'Continuous Improvement Leads'],
        user: ['Production engineers', 'Line operators', 'Quality engineers', 'Maintenance technicians'],
        blocker: ['Existing automation vendors (Fanuc, ABB)', 'Capital budget cycles', 'Workforce concerns']
      },

      salesFlow: {
        phases: [
          { phase: 'Process Assessment', duration: '2-4 weeks', activities: 'Analyze current assembly, identify automation candidates, ROI modeling', keyAction: 'Prove 75%+ throughput improvement potential' },
          { phase: 'Pilot Deployment', duration: '4-8 weeks', activities: 'Deploy single BRC cell, validate performance, train operators', keyAction: 'Demonstrate 2x faster deployment vs traditional automation' },
          { phase: 'Line Expansion', duration: '2-6 months', activities: 'Scale to full production line, integrate Brightware analytics', keyAction: 'Achieve target OEE and defect reduction' },
          { phase: 'Multi-Site Rollout', duration: 'Ongoing', activities: 'Standardize across facilities, continuous improvement', keyAction: 'Become manufacturing platform standard' },
        ],
        model: 'Microfactory sales (HW+SW) + Brightware SaaS + AI Factory manufacturing services. $400M+ raised, NVIDIA/Microsoft/BlackRock backed.',
        expansion: 'Electronics → AI hardware → Medical devices → Automotive → Full AI Factory services'
      },

      competitivePosition: {
        strengths: ['Full-stack (SW+HW+Services)', '100+ deployments globally', 'NVIDIA/Microsoft strategic backing', 'AI Factory model for AI hardware boom'],
        weaknesses: ['High capex for customers', 'Competition from traditional automation', 'Scaling services model', 'Electronics-heavy vertical focus'],
        vsIncumbents: 'vs Fanuc/ABB: Software-first, modular vs fixed lines. 2x faster deployment. Continuous improvement via cloud.',
        vsChallengers: 'vs Symbotic: Different focus (assembly vs warehouse). vs VulcanForms: Assembly vs additive. vs Tulip: Full-stack vs software-only.',
      }
    },

    bedrockRobotics: {
      name: 'Bedrock Robotics',
      logo: '🚧',
      tagline: 'Retrofit Autonomy for Construction',
      color: 'amber',
      presence: bedrockRoboticsPresence,

      strategy: {
        thesis: 'Construction faces 500K worker shortage with 40% retiring in 10 years. Retrofit autonomy (not new equipment) is the fastest path to solving the labor crisis while preserving fleet investments.',
        play: 'Same-day, reversible hardware installs on existing excavators/dozers/loaders. AI trained on thousands of hours of earthmoving. Operator-less operation by 2026.',
        wedge: 'Large earthmoving projects (highway expansion, site prep)–repetitive tasks, 24/7 operation potential. Partner with top contractors (Sundt, Zachry) for real-world validation.',
        moat: 'Waymo leadership team (Boris Sofman led trucking program). Autonomous driving expertise applied to construction. $80M from Eclipse/8VC/Founders Fund. Active deployments in AZ/TX/AR.'
      },

      offerings: [
        { name: 'Bedrock Operator', layer: 'L2', description: 'Retrofit autonomy kit for heavy equipment', value: 'Same-day install. No permanent mods. Lidar/camera/GPS perception suite. Runs 24/7 with remote monitoring.', industries: ['Construction'] },
        { name: 'Remote Operations Center', layer: 'L3', description: 'Fleet monitoring and intervention', value: 'One supervisor manages multiple autonomous machines. Override capability for edge cases.', industries: ['Construction'] },
        { name: 'Continuous Learning', layer: 'L6', description: 'AI improvement from operational data', value: 'Fleet data feeds model improvement. Handles dust, rain, unpredictable terrain. Precision earthmoving.', industries: ['Construction'] },
      ],

      buyers: {
        executive: ['Construction Company CEOs', 'VP Operations', 'Chief Technology Officers', 'Project Directors'],
        champion: ['Equipment Directors', 'Innovation Managers', 'Site Superintendents'],
        user: ['Equipment operators', 'Site supervisors', 'Dispatchers', 'Safety managers'],
        blocker: ['Union concerns', 'Insurance uncertainty', 'Equipment OEMs protective of aftermarket']
      },

      salesFlow: {
        phases: [
          { phase: 'Site Assessment', duration: '1-2 weeks', activities: 'Evaluate equipment fleet, site conditions, use cases', keyAction: 'Identify high-value automation opportunities' },
          { phase: 'Pilot Deployment', duration: '1-3 months', activities: 'Retrofit 1-3 machines, supervised autonomous operation', keyAction: 'Prove productivity and safety in real conditions' },
          { phase: 'Fleet Expansion', duration: '3-6 months', activities: 'Add machines, extend operating hours, reduce supervision', keyAction: 'Demonstrate 24/7 operation capability' },
          { phase: 'Operator-Less Operations', duration: '2026', activities: 'Full autonomy without human backup on site', keyAction: 'Achieve regulatory approval for unsupervised operation' },
        ],
        model: 'Retrofit kit sales or subscription. Per-machine or fleet pricing. Services for integration/training. $80M raised (Seed + Series A).',
        expansion: 'Excavators → Dozers → Loaders → Full earthmoving fleet → Mining crossover'
      },

      competitivePosition: {
        strengths: ['Waymo DNA (proven autonomy expertise)', 'Retrofit model (no fleet replacement)', 'Active commercial deployments', 'Eclipse/$80M backing'],
        weaknesses: ['Early stage (founded 2024)', 'Construction site complexity', 'Equipment OEM relationships', 'Scaling services model'],
        vsIncumbents: 'vs Cat/Komatsu autonomous: Retrofit any brand. No new equipment purchase. Faster deployment.',
        vsChallengers: 'vs Built Robotics: Broader equipment focus. vs SafeAI: Waymo pedigree, more funding. vs Teleo: Direct autonomy vs teleop.',
      }
    },

    thirdWave: {
      name: 'Third Wave Automation',
      logo: '🏗️',
      tagline: 'Shared Autonomy for Forklifts',
      color: 'teal',
      presence: thirdWavePresence,

      strategy: {
        thesis: '"Shared Autonomy" is smarter than full autonomy for warehouses. AI handles 90%+ of tasks; human operators assist with edge cases remotely. Get ROI from day one, improve continuously.',
        play: 'Autonomous high-reach forklifts that operate in 4 modes: fully autonomous, remote assist, remote operation, manual. One operator manages multiple forklifts. Toyota Industries partnership for scale.',
        wedge: 'High-reach applications (366" vertical)–most complex forklift tasks, highest labor cost. 3PLs and large DCs with labor challenges.',
        moat: 'Google robotics + Toyota Research DNA. Toyota Industries strategic partnership (TICO builds 1/3 of world\'s forklifts). Automotive-grade 3D lidar. $97M raised from Woven Capital/Eclipse/Toyota/Qualcomm.'
      },

      offerings: [
        { name: 'TWA Reach', layer: 'L0', description: 'Autonomous high-reach forklift', value: '4 operating modes (autonomous, remote assist, remote op, manual). 366" reach. Infrastructure-free deployment.', industries: ['Land Transport'] },
        { name: 'TWA Extended Reach', layer: 'L0', description: 'Extended height autonomous forklift', value: '2x standard reach height. Handles more payloads and racking configurations.', industries: ['Land Transport'] },
        { name: 'Armada FMS', layer: 'L3', description: 'Intelligent fleet management system', value: 'Real-time monitoring. Dynamic zone configuration. WMS integration. One operator → multiple forklifts.', industries: ['Land Transport'] },
        { name: 'Collision Shield', layer: 'L1', description: 'Industry-leading obstacle detection', value: '360° warehouse perception. Better views than manual operators. Safety-first design.', industries: ['Land Transport'] },
        { name: 'Shared Autonomy Platform', layer: 'L6', description: 'AI + remote operation hybrid', value: 'AI runs autonomously, asks for help when needed. Continuous learning from human interventions.', industries: ['Land Transport'] },
      ],

      buyers: {
        executive: ['VP Distribution', 'Chief Supply Chain Officer', 'VP Warehouse Operations', '3PL General Managers'],
        champion: ['DC Directors', 'Automation Managers', 'Continuous Improvement Leads'],
        user: ['Warehouse supervisors', 'Forklift operators', 'Inventory managers', 'Safety coordinators'],
        blocker: ['Existing MHE relationships', 'Union concerns', 'Capital budget constraints', 'WMS integration complexity']
      },

      salesFlow: {
        phases: [
          { phase: 'Site Mapping', duration: '1-2 days', activities: 'Automotive-grade lidar maps facility floor-to-ceiling', keyAction: 'Prove fast deployment vs months for traditional AGVs' },
          { phase: 'Pilot Fleet', duration: '2-4 months', activities: 'Deploy 2-5 forklifts, validate throughput, train remote operators', keyAction: 'Demonstrate productivity gains with existing staff' },
          { phase: 'Scale Deployment', duration: '6-12 months', activities: 'Expand fleet, integrate with WMS, optimize workflows', keyAction: 'Achieve target picks/hour and labor efficiency' },
          { phase: 'Enterprise Rollout', duration: 'Ongoing', activities: 'Multi-site standardization, fleet optimization', keyAction: 'Become warehouse automation standard' },
        ],
        model: 'Forklift sales/lease + Armada SaaS subscription. Per-forklift or enterprise pricing. $97M raised, $200M valuation.',
        expansion: 'High-reach → Extended reach → Full forklift fleet → Multi-site enterprise'
      },

      competitivePosition: {
        strengths: ['Toyota Industries partnership', 'Shared Autonomy (human-AI hybrid)', 'Day-one ROI vs full autonomy', 'Infrastructure-free deployment'],
        weaknesses: ['Forklift-only focus', 'Competition from integrated MHE players', 'Scaling services model', 'Customer concentration risk'],
        vsIncumbents: 'vs Crown/Toyota manual: Addresses labor shortage. 1 operator → many forklifts. 24/7 operation.',
        vsChallengers: 'vs Locus/6 River: High-reach focus (harder problem). vs Symbotic: Brownfield vs greenfield. vs Vecna: Shared autonomy vs full autonomy.',
      }
    },

    locusRobotics: {
      name: 'Locus Robotics',
      logo: '🤖',
      tagline: 'Physical AI for Warehouse Productivity',
      color: 'blue',
      presence: locusPresence,

      strategy: {
        thesis: 'Warehouse AMRs that deliver 2-3x productivity gains by working collaboratively with human workers. RaaS model enables rapid scaling and PeakFLEX seasonal flexibility.',
        play: 'LocusONE platform orchestrates mixed fleet of Origin/Vector/Max AMRs for any warehouse size. Add bots during peak, return after–true elasticity in automation.',
        wedge: '3PLs and e-commerce fulfillment centers with labor challenges. Quick deployment (days not months). Brownfield friendly–no infrastructure changes required.',
        moat: '4B+ picks processed. 300+ sites globally. 120+ enterprise customers (DHL, CEVA, GEODIS, Ryder). Goldman Sachs/G2 backed. $422M raised, ~$2B valuation. RaaS recurring revenue model.'
      },

      offerings: [
        { name: 'LocusONE Platform', layer: 'L3', description: 'AI-driven warehouse execution platform', value: 'Multi-robot orchestration. WMS integration. Real-time analytics. Zone management. PeakFLEX elastic scaling.', industries: ['Land Transport'] },
        { name: 'LocusBot Origin', layer: 'L0', description: 'Flagship collaborative AMR', value: '80 lb payload. 14-hour runtime. Person-to-goods picking. 2-3x productivity improvement.', industries: ['Land Transport'] },
        { name: 'LocusBot Vector', layer: 'L0', description: 'Heavy-payload AMR', value: '600 lb capacity. Pallet and case handling. Goods-to-person workflows.', industries: ['Land Transport'] },
        { name: 'LocusBot Max', layer: 'L0', description: 'Highest capacity AMR', value: '3,000 lb payload. Heavy case and pallet movement. Full pallet transport.', industries: ['Land Transport'] },
        { name: 'PeakFLEX', layer: 'L3', description: 'Elastic scaling program', value: 'Add robots for peak season, return after. True automation elasticity. No capex commitment for seasonal capacity.', industries: ['Land Transport'] },
      ],

      buyers: {
        executive: ['VP Distribution', 'Chief Supply Chain Officer', 'VP Operations', '3PL General Managers'],
        champion: ['DC Directors', 'Fulfillment Managers', 'Continuous Improvement Leads'],
        user: ['Warehouse associates', 'Supervisors', 'Operations managers', 'IT administrators'],
        blocker: ['Existing WMS vendors', 'Union concerns', 'Capex budget constraints']
      },

      salesFlow: {
        phases: [
          { phase: 'Site Assessment', duration: '1-2 weeks', activities: 'Analyze workflows, calculate productivity opportunity, ROI modeling', keyAction: 'Prove 2-3x productivity potential' },
          { phase: 'Pilot Deployment', duration: '2-4 weeks', activities: 'Deploy 5-20 LocusBots, integrate with WMS, train associates', keyAction: 'Demonstrate immediate productivity gains' },
          { phase: 'Scale to Site', duration: '2-6 months', activities: 'Expand fleet, optimize zones, add workflows (putaway, replenish)', keyAction: 'Achieve site-wide ROI targets' },
          { phase: 'Multi-Site Rollout', duration: 'Ongoing', activities: 'Standardize across network, leverage PeakFLEX', keyAction: 'Become enterprise AMR standard' },
        ],
        model: 'Robots-as-a-Service (RaaS) per-bot/month subscription. No capex. PeakFLEX for seasonal. $422M raised, ~$2B valuation.',
        expansion: 'Single site pilot → Full site → Multi-site → Enterprise standard with PeakFLEX'
      },

      competitivePosition: {
        strengths: ['RaaS model (no capex)', 'PeakFLEX elasticity', '4B+ picks (proven scale)', 'Brownfield deployment', 'Multi-robot fleet types'],
        weaknesses: ['AMR-only (no fixed automation)', 'Competition intensifying', 'Labor union pushback', 'WMS integration complexity'],
        vsIncumbents: 'vs Dematic/Honeywell: Faster deployment, lower commitment. Brownfield vs greenfield. RaaS vs capex.',
        vsChallengers: 'vs 6 River/Amazon: Independent, multi-customer platform. vs Symbotic: Brownfield vs greenfield automation.',
      }
    },

    symbioRobotics: {
      name: 'Symbio Robotics',
      logo: '🔧',
      tagline: 'Windows for Industrial Robots',
      color: 'purple',
      presence: symbioPresence,

      strategy: {
        thesis: 'Industrial robots run proprietary, inflexible code. Symbio brings modern software practices (Python, ML, real-time control) to make robots faster, smarter, and more flexible.',
        play: 'SymbioDCS middleware enables existing robots to learn new tasks via AI. Retrofit intelligence onto installed base. "Windows for DOS" of manufacturing automation.',
        wedge: 'Automotive final assembly–<5% automated today. Highest complexity, highest value. Toyota and Nissan production deployments prove capability.',
        moat: 'Eclipse/a16z backed. $56M raised. Toyota/Nissan/Ford production deployments. Python-native robotics middleware. Real-time sensor fusion + ML control.'
      },

      offerings: [
        { name: 'SymbioDCS', layer: 'L2', description: 'Industrial robotics middleware', value: 'Python programming for robots. Real-time sensor integration. ML-based task learning. Robot-agnostic.', industries: ['Discrete Manufacturing'] },
        { name: 'AI Assembly Solutions', layer: 'L6', description: 'ML-powered assembly automation', value: 'Robots learn complex assembly tasks. Adapt to variations. Handle bin picking, precision placement.', industries: ['Discrete Manufacturing'] },
        { name: 'Integration Services', layer: 'L3', description: 'Production deployment support', value: 'Deploy AI-enabled assembly cells. Train and optimize models. Production support.', industries: ['Discrete Manufacturing'] },
      ],

      buyers: {
        executive: ['VP Manufacturing Engineering', 'Chief Technology Officer', 'VP Operations'],
        champion: ['Automation Managers', 'Controls Engineers', 'Production Engineering Leads'],
        user: ['Robot programmers', 'Line engineers', 'Production operators', 'Maintenance technicians'],
        blocker: ['OEM robot vendors (Fanuc, ABB)', 'Legacy controls teams', 'IT security concerns']
      },

      salesFlow: {
        phases: [
          { phase: 'Use Case Identification', duration: '2-4 weeks', activities: 'Identify automation gaps in final assembly, assess robot fleet', keyAction: 'Find high-value, currently manual assembly tasks' },
          { phase: 'Proof of Concept', duration: '4-8 weeks', activities: 'Deploy SymbioDCS on pilot cell, train task models', keyAction: 'Demonstrate ML-enabled assembly capability' },
          { phase: 'Production Deployment', duration: '3-6 months', activities: 'Scale to production line, optimize performance, validate quality', keyAction: 'Achieve production throughput and quality targets' },
          { phase: 'Platform Expansion', duration: 'Ongoing', activities: 'Add new lines, new tasks, standardize on SymbioDCS', keyAction: 'Become plant-wide robotics software platform' },
        ],
        model: 'Software licensing + deployment services. Per-cell or enterprise pricing. $56M raised from Eclipse/a16z.',
        expansion: 'Pilot cell → Production line → Plant-wide → Multi-plant standardization'
      },

      competitivePosition: {
        strengths: ['Modern software stack (Python/ML)', 'Robot-agnostic middleware', 'Toyota/Nissan production proof', 'Eclipse backing'],
        weaknesses: ['Small team (~40 people)', 'Limited to assembly', 'Competition from robot OEMs', 'Scaling services'],
        vsIncumbents: 'vs Fanuc/ABB: Open vs proprietary. Modern programming vs legacy code. Retrofit intelligence onto existing robots.',
        vsChallengers: 'vs Covariant: Assembly vs picking. vs Bright Machines: Software layer vs full-stack.',
      }
    },

    symbotic: {
      name: 'Symbotic',
      logo: '📦',
      tagline: 'AI-Enabled Supply Chain Revolution',
      color: 'green',
      presence: symboticPresence,

      strategy: {
        thesis: 'End-to-end, AI-powered robotics platform that reinvents distribution centers. Dense storage + autonomous bots + software intelligence = transformational warehouse economics.',
        play: 'Greenfield and brownfield DC automation for mega-retailers. Now expanding to micro-fulfillment (APD) via Walmart acquisition. Own the physical backbone of retail.',
        wedge: 'Walmart relationship since 2017. Now deploying across all 42 Walmart regional DCs. $520M Walmart deal for 400 store APDs opens new $300B market.',
        moat: 'Public company (NASDAQ: SYM, ~$8B market cap). $22.4B backlog. Walmart/Target/Albertsons customers. Vertically integrated (bots + software + storage). Exclusive Walmart micro-fulfillment partnership.'
      },

      offerings: [
        { name: 'Symbotic System', layer: 'L0', description: 'High-density robotic warehouse system', value: 'SymBots retrieve cases from dense 3D storage. 40% space reduction. Higher throughput than traditional DC.', industries: ['Land Transport'] },
        { name: 'SymBot AMRs', layer: 'L0', description: 'Autonomous case-handling robots', value: 'Navigate storage structure. Pick/place cases. Coordinate via AI. Fleet orchestration.', industries: ['Land Transport'] },
        { name: 'BreakPack System', layer: 'L0', description: 'Automated depalletizing/case handling', value: 'Automated inbound processing. Mixed case handling. Pallet to case breakdown.', industries: ['Land Transport'] },
        { name: 'Software Platform', layer: 'L3', description: 'AI-powered warehouse orchestration', value: 'Real-time optimization. Predictive algorithms. WMS integration. Analytics dashboard.', industries: ['Land Transport'] },
        { name: 'APD (Accelerated Pickup & Delivery)', layer: 'L0', description: 'Store micro-fulfillment system', value: 'Back-of-store automation for e-commerce pickup/delivery. Miniaturized Symbotic system.', industries: ['Land Transport'] },
      ],

      buyers: {
        executive: ['Chief Supply Chain Officer', 'CEO', 'CFO', 'VP Distribution'],
        champion: ['VP DC Operations', 'Director Supply Chain Innovation', 'Automation Directors'],
        user: ['DC managers', 'Operations teams', 'Maintenance technicians', 'IT administrators'],
        blocker: ['Incumbent automation vendors', 'Long sales cycles', 'Capital allocation competition']
      },

      salesFlow: {
        phases: [
          { phase: 'Strategic Engagement', duration: '3-6 months', activities: 'C-suite presentations, facility assessments, ROI modeling', keyAction: 'Prove transformational economics vs traditional DC' },
          { phase: 'Contract Negotiation', duration: '3-6 months', activities: 'Detailed design, commercial terms, implementation planning', keyAction: 'Sign multi-year deployment agreement' },
          { phase: 'System Deployment', duration: '12-24 months', activities: 'Install storage structure, deploy SymBots, integrate software', keyAction: 'Commission fully operational system' },
          { phase: 'Network Rollout', duration: 'Multi-year', activities: 'Deploy across DC network, optimize operations, expand capabilities', keyAction: 'Transform entire distribution network' },
        ],
        model: 'Large capital systems ($100M+) with software/services. Public company (NASDAQ: SYM). ~$1.8B TTM revenue. $22.4B backlog.',
        expansion: 'Pilot DC → Regional DCs → Full network → APD store rollout → Mexico expansion'
      },

      competitivePosition: {
        strengths: ['$22.4B backlog', 'Walmart strategic relationship', 'Vertically integrated', 'Public company scale', 'APD micro-fulfillment expansion'],
        weaknesses: ['87% revenue from Walmart (concentration)', 'Long implementation cycles', 'Greenfield-heavy (limited brownfield)', 'High capex for customers'],
        vsIncumbents: 'vs Dematic/Honeywell/Swisslog: More advanced AI/robotics. Higher density storage. Better throughput economics.',
        vsChallengers: 'vs Ocado/AutoStore: Larger scale, retail focus. vs Locus: Greenfield vs brownfield.',
      }
    },

    vulcanforms: {
      name: 'VulcanForms',
      logo: '🔥',
      tagline: 'Industrial-Scale Digital Manufacturing',
      color: 'red',
      presence: vulcanformsPresence,

      strategy: {
        thesis: 'Additive manufacturing at industrial scale through 100kW laser systems (250x more power than competitors). Full-stack digital production from design to final part.',
        play: 'Own the factories, not just sell machines. VulcanOne facility has 2MW+ laser capacity. Produce parts as a service for aerospace, defense, semiconductor.',
        wedge: 'Complex metal parts that only additive can make–cooling channels, lattice structures, consolidated assemblies. DoD and semiconductor customers.',
        moat: 'MIT-born technology. 100kW laser systems (vs 1kW industry standard). $355M raised at $1B+ valuation. Eclipse led investment. 400+ employees. Two production facilities.'
      },

      offerings: [
        { name: 'Digital Parts Manufacturing', layer: 'L0', description: 'Metal 3D printing as a service', value: 'Complex geometries impossible with traditional manufacturing. Faster iteration. On-demand production.', industries: ['Aerospace & Defense', 'Discrete Manufacturing'] },
        { name: 'VulcanOne Foundry', layer: 'L3', description: 'High-throughput AM facility', value: '2MW+ laser capacity. World\'s highest throughput metal AM facility. Fleet of 100kW systems.', industries: ['Aerospace & Defense', 'Discrete Manufacturing'] },
        { name: 'Digital Thread Platform', layer: 'L3', description: 'End-to-end production workflow', value: 'Design → Simulation → Print → Post-process → Inspection. Full traceability.', industries: ['Aerospace & Defense', 'Discrete Manufacturing'] },
        { name: 'Precision Machining', layer: 'L0', description: 'Integrated subtractive manufacturing', value: 'Automated machining and assembly at Newburyport facility. Complete part finishing.', industries: ['Aerospace & Defense', 'Discrete Manufacturing'] },
      ],

      buyers: {
        executive: ['VP Engineering', 'Chief Technology Officer', 'VP Supply Chain', 'VP Manufacturing'],
        champion: ['R&D Directors', 'Design Engineers', 'Manufacturing Engineering Leads'],
        user: ['Design engineers', 'Production planners', 'Quality engineers', 'Procurement teams'],
        blocker: ['Incumbent casting/machining suppliers', 'AM skeptics', 'Qualification cycles']
      },

      salesFlow: {
        phases: [
          { phase: 'Part Identification', duration: '2-4 weeks', activities: 'Identify candidate parts, DfAM consultation, feasibility assessment', keyAction: 'Prove additive enables better design' },
          { phase: 'Prototype Production', duration: '2-4 weeks', activities: 'Produce prototype parts, validate design, test performance', keyAction: 'Deliver parts in days vs months' },
          { phase: 'Production Qualification', duration: '2-6 months', activities: 'Material certification, process validation, quality documentation', keyAction: 'Qualify parts for production use' },
          { phase: 'Production Scale', duration: 'Ongoing', activities: 'Serial production, continuous improvement, new part families', keyAction: 'Become strategic manufacturing partner' },
        ],
        model: 'Parts-as-a-Service. Per-part pricing. $355M raised, $1B+ valuation. Eclipse led.',
        expansion: 'Prototype → Qualified parts → Serial production → Strategic supply partner'
      },

      competitivePosition: {
        strengths: ['100kW laser systems (250x power)', 'Full-stack (design to part)', '$1B+ valuation', 'DoD/semiconductor customers', 'Own production facilities'],
        weaknesses: ['Capital intensive model', 'Limited geographic footprint', 'Long qualification cycles', 'Competition from traditional manufacturing'],
        vsIncumbents: 'vs Precision Castparts/Alcoa: Complex geometries they cannot make. Faster iteration. Consolidated parts.',
        vsChallengers: 'vs Desktop Metal/Markforged: Industrial scale vs desktop. Production vs prototyping.',
      }
    },

    tractian: {
      name: 'Tractian',
      logo: '📡',
      tagline: 'Industrial AI Copilot for Maintenance',
      color: 'teal',
      presence: tractianPresence,

      strategy: {
        thesis: 'Predictive maintenance as the wedge to industrial AI copilot. Sensors + CMMS + AI = prescriptive maintenance that tells you what to fix before it breaks.',
        play: 'Land with vibration/temperature sensors on critical rotating equipment. Expand to full CMMS. Become the AI copilot for maintenance professionals.',
        wedge: 'SMB/mid-market manufacturers underserved by enterprise PdM vendors. Quick deployment. Portuguese/Spanish language advantage in Latin America.',
        moat: '$196M raised including $123M Series C (Nov 2024). Y Combinator/General Catalyst/Next47 backed. 5% of global industrial output in customer base. John Deere, P&G, Caterpillar, Goodyear customers.'
      },

      offerings: [
        { name: 'Smart Trac Sensor', layer: 'L1', description: 'IoT vibration/temperature sensor', value: 'Detect 70+ fault types on rotating equipment. AI auto-diagnosis. Real-time alerts.', industries: ['Discrete Manufacturing', 'Process Manufacturing', 'Mining'] },
        { name: 'Tractian CMMS', layer: 'L3', description: 'AI-powered maintenance management', value: 'Work order management. Asset tracking. Maintenance scheduling. Mobile-first interface.', industries: ['Discrete Manufacturing', 'Process Manufacturing', 'Mining'] },
        { name: 'TracOS Platform', layer: 'L3', description: 'Industrial operations platform', value: 'Unified view of machine health, work orders, analytics. OEE tracking. AI insights.', industries: ['Discrete Manufacturing', 'Process Manufacturing', 'Mining'] },
        { name: 'AI Copilot', layer: 'L6', description: 'Maintenance AI assistant', value: 'Prescriptive recommendations. Root cause analysis. Natural language queries. Tribal knowledge capture.', industries: ['Discrete Manufacturing', 'Process Manufacturing', 'Mining'] },
      ],

      buyers: {
        executive: ['VP Operations', 'Plant Director', 'VP Maintenance', 'Chief Operating Officer'],
        champion: ['Reliability Managers', 'Maintenance Directors', 'Continuous Improvement Leads'],
        user: ['Maintenance technicians', 'Reliability engineers', 'Plant operators', 'Supervisors'],
        blocker: ['Incumbent CMMS vendors', 'IT (integration concerns)', 'Procurement cycles']
      },

      salesFlow: {
        phases: [
          { phase: 'Sensor Deployment', duration: '1-2 weeks', activities: 'Install Smart Trac on 10-20 critical assets, baseline equipment', keyAction: 'Catch first predictive alert' },
          { phase: 'Platform Expansion', duration: '4-8 weeks', activities: 'Deploy CMMS, migrate work orders, expand sensor coverage', keyAction: 'Prove ROI from avoided downtime' },
          { phase: 'Site Rollout', duration: '2-4 months', activities: 'Cover all critical assets, full CMMS adoption, train teams', keyAction: 'Achieve site-wide adoption' },
          { phase: 'Enterprise Scale', duration: 'Ongoing', activities: 'Multi-site deployment, AI copilot rollout, continuous improvement', keyAction: 'Become maintenance platform standard' },
        ],
        model: 'Hardware (sensors) + SaaS (platform) subscription. $196M raised. $123M Series C at ~$800M+ valuation.',
        expansion: 'Pilot sensors → Site CMMS → Multi-site → Enterprise AI copilot'
      },

      competitivePosition: {
        strengths: ['Fast-growing challenger ($196M raised)', 'AI-native from founding', 'LatAm market strength', 'Blue-chip customers (John Deere, P&G, Caterpillar)'],
        weaknesses: ['Smaller than Augury', 'Less brand recognition', 'Competition intensifying', 'Geographic concentration'],
        vsIncumbents: 'vs SKF/Emerson: Modern, mobile-first UX. AI-native. Faster deployment. Better SMB fit.',
        vsChallengers: 'vs Augury: Younger but growing fast. CMMS integrated (Augury sensor-focused). LatAm strength.',
      }
    },

    archetypeAI: {
      name: 'Archetype AI',
      logo: '🔮',
      tagline: 'Physical AI Foundation Model for Real-World Intelligence',
      color: 'purple',
      presence: archetypePresence,

      strategy: {
        thesis: 'Foundation model for the physical world. Newton learns physics from raw sensor data without pre-programmed knowledge, enabling AI that understands and predicts real-world behavior.',
        play: 'Build the "GPT for sensors" - a foundation model that fuses multimodal sensor data with natural language. Enable enterprises to deploy Physical Agents that understand real-world environments.',
        wedge: 'Start with manufacturing monitoring and traffic/construction applications where existing solutions require custom models. Show zero-shot generalization across physical domains.',
        moat: '$48M raised ($35M Series A Nov 2025, led by IAG + Hitachi). Newton 2.0B parameter model. Google/ATAP DNA (Ivan Poupyrev founded). Bezos Expeditions, Amazon Industrial Innovation Fund, Samsung backing.'
      },

      offerings: [
        { name: 'Newton Foundation Model', layer: 'L6', description: 'Physical AI foundation model', value: 'Learns physics from raw sensor data. Zero-shot prediction across physical systems. 2.0B parameters. Signal-language fusion.', industries: ['Discrete Manufacturing', 'Construction', 'Land Transport'] },
        { name: 'Physical Agents', layer: 'L6-L1', description: 'Deployable AI applications', value: 'Machine monitoring, task verification, safety agents. Natural language prompts to build agents. Deploy cloud, on-prem, or edge.', industries: ['Discrete Manufacturing', 'Construction', 'Land Transport'] },
        { name: 'Agent Toolkit', layer: 'L3', description: 'No-code agent builder', value: 'Visual environment for prototyping and testing Physical Agents. REST and Python APIs. Rapid deployment.', industries: ['All verticals'] },
        { name: 'Lenses', layer: 'L6-L1', description: 'Domain-specific AI applications', value: 'Pre-built agents for equipment utilization, traffic analysis, safety monitoring. Built on Newton.', industries: ['Construction', 'Land Transport', 'Discrete Manufacturing'] },
      ],

      buyers: {
        executive: ['Chief Digital Officer', 'VP Operations', 'VP Engineering', 'Head of Innovation'],
        champion: ['Data Science Leads', 'Automation Engineers', 'IoT Architects', 'R&D Directors'],
        user: ['Process engineers', 'Operations analysts', 'Data scientists', 'Site managers'],
        blocker: ['IT (data security)', 'Custom model teams', 'Incumbent ML platform vendors']
      },

      salesFlow: {
        phases: [
          { phase: 'Discovery', duration: '2-4 weeks', activities: 'Identify high-value sensor data problems, demo Newton capabilities, assess data readiness', keyAction: 'Show zero-shot prediction on customer data' },
          { phase: 'Agent Deployment', duration: '4-8 weeks', activities: 'Deploy Physical Agents for specific use case (monitoring, safety, task verification)', keyAction: 'Prove insight quality vs custom models' },
          { phase: 'Platform Expansion', duration: '2-4 months', activities: 'Add agents for adjacent use cases, integrate with existing systems', keyAction: 'Demonstrate multi-domain value' },
          { phase: 'Enterprise Scale', duration: 'Ongoing', activities: 'Enterprise license, multi-site deployment, custom agent development', keyAction: 'Become physical intelligence layer' },
        ],
        model: 'Platform subscription + usage-based. $48M raised. Series A led by IAG Capital Partners and Hitachi Ventures.',
        expansion: 'Single use case agent → Multi-domain agents → Enterprise physical intelligence platform'
      },

      competitivePosition: {
        strengths: ['Foundation model approach (vs custom ML)', 'Google/ATAP pedigree', 'Zero-shot generalization', 'Signal-language fusion unique capability'],
        weaknesses: ['Early stage (Series A)', 'Unproven at enterprise scale', 'Competing with both custom ML and domain vendors', 'Limited customer base'],
        vsIncumbents: 'vs Custom ML teams: No training data needed. Zero-shot generalization. Faster deployment.',
        vsChallengers: 'vs C3/Palantir: Sensor-native (they focus on enterprise data). vs Uptake/Augury: General-purpose (they are domain-specific).',
      }
    },

    landingAI: {
      name: 'Landing AI',
      logo: '👁️',
      tagline: 'Visual AI for Manufacturing Quality',
      color: 'blue',
      presence: landingAIPresence,

      strategy: {
        thesis: 'Data-centric AI for visual inspection. Small datasets + domain expertise = production-ready vision models. Democratize computer vision for manufacturing.',
        play: 'Enable non-AI experts to build visual inspection solutions with minimal data. Low-code/no-code interface that puts ownership in users hands.',
        wedge: 'Manufacturing visual inspection where custom CV projects fail to reach production. Address the gap between POC and full-scale deployment.',
        moat: 'Andrew Ng brand and AI thought leadership. $57M raised. Data-centric AI methodology. LandingLens platform. Stanley Black & Decker, Foxconn, Denso customers.'
      },

      offerings: [
        { name: 'LandingLens', layer: 'L6-L1', description: 'Visual inspection platform', value: 'End-to-end visual AI: data labeling, model training, deployment. Low-code/no-code. Works with small datasets.', industries: ['Discrete Manufacturing', 'Process Manufacturing'] },
        { name: 'Data-Centric AI Tools', layer: 'L6', description: 'ML development methodology', value: 'Focus on data quality vs model architecture. Systematic labeling, data augmentation, edge case handling.', industries: ['All verticals'] },
        { name: 'LandingLens Edge', layer: 'L1', description: 'Edge deployment', value: 'Deploy trained models to edge devices. Real-time inference. Offline capability.', industries: ['Discrete Manufacturing', 'Process Manufacturing'] },
        { name: 'App Space', layer: 'L3', description: 'Vision system development', value: 'Rapid prototyping for vision applications. Pre-built templates. Integration tools.', industries: ['Discrete Manufacturing'] },
      ],

      buyers: {
        executive: ['VP Quality', 'VP Manufacturing', 'Plant Directors', 'Chief Digital Officer'],
        champion: ['Quality Engineers', 'Machine Vision Specialists', 'Continuous Improvement Leads'],
        user: ['Quality inspectors', 'Process engineers', 'Line operators', 'Automation engineers'],
        blocker: ['Existing machine vision vendors', 'IT (deployment)', 'Custom CV teams']
      },

      salesFlow: {
        phases: [
          { phase: 'Pilot Project', duration: '2-4 weeks', activities: 'Select high-value inspection use case, collect small dataset, train initial model', keyAction: 'Demonstrate defect detection accuracy' },
          { phase: 'Production Deployment', duration: '4-8 weeks', activities: 'Deploy to production line, integrate with existing systems, train operators', keyAction: 'Prove production-ready performance' },
          { phase: 'Line Expansion', duration: '2-4 months', activities: 'Add inspection points, expand to additional lines, build internal expertise', keyAction: 'Scale across production facility' },
          { phase: 'Enterprise Rollout', duration: 'Ongoing', activities: 'Multi-site deployment, standardize inspection processes, continuous improvement', keyAction: 'Become visual inspection standard' },
        ],
        model: 'SaaS subscription. $57M raised. Andrew Ng stepped back as CEO (Aug 2024), now Exec Chairman.',
        expansion: 'Single inspection use case → Multiple lines → Multi-site → Enterprise visual AI standard'
      },

      competitivePosition: {
        strengths: ['Andrew Ng brand/thought leadership', 'Data-centric methodology', 'Low-code accessibility', 'Manufacturing focus'],
        weaknesses: ['Smaller than Cognex/Keyence', 'Leadership transition', 'Narrow focus on visual inspection', 'Competition intensifying'],
        vsIncumbents: 'vs Cognex/Keyence: Software-defined (vs hardware-centric). AI-native. Works with existing cameras.',
        vsChallengers: 'vs Instrumental/Elementary: Broader platform. Andrew Ng credibility. Data-centric approach.',
      }
    },

    voxel: {
      name: 'Voxel',
      logo: '🛡️',
      tagline: 'AI-Powered Workplace Safety & Risk Prevention',
      color: 'green',
      presence: voxelPresence,

      strategy: {
        thesis: 'Transform existing security cameras into intelligent safety monitoring systems. Prevent workplace incidents before they happen through real-time computer vision.',
        play: 'Land with safety/EHS teams frustrated by reactive incident response. Integrate with existing camera infrastructure (no new hardware). Deliver real-time hazard detection and operational insights.',
        wedge: 'Manufacturing, logistics, and retail safety where traditional approaches fail. 2.78M workers die annually from work-related incidents globally.',
        moat: '$64M raised including $44M Series B (Jun 2025, led by NewRoad). Eclipse Ventures backed. Fortune 500 customers (Michaels, Dollar Tree, Clorox, PPG, Office Depot). 80% injury reduction reported.'
      },

      offerings: [
        { name: 'Voxel Safety Platform', layer: 'L1-L3', description: 'AI-powered safety monitoring', value: 'Real-time hazard detection using existing cameras. Near-miss identification. Unsafe behavior alerts. No new hardware required.', industries: ['Land Transport', 'Discrete Manufacturing', 'Retail'] },
        { name: 'Incident Prevention', layer: 'L1', description: 'Computer vision for safety', value: 'Detect blocked exits, improper ergonomics, spills, vehicle collision risks. Real-time alerts to on-site personnel.', industries: ['Land Transport', 'Discrete Manufacturing'] },
        { name: 'Operational Analytics', layer: 'L3', description: 'Safety intelligence dashboard', value: 'Site-wide safety visibility. Policy design from data. Risk reduction tracking. Executive reporting.', industries: ['Land Transport', 'Discrete Manufacturing', 'Retail'] },
        { name: 'Actions', layer: 'L3', description: 'Risk-to-resolution workflow', value: 'Bridge gap between risk identification and resolution. Workflow automation. Accountability tracking.', industries: ['All verticals'] },
      ],

      buyers: {
        executive: ['Chief Safety Officer', 'VP Operations', 'VP EHS', 'Risk Management Director'],
        champion: ['Safety Managers', 'Site Directors', 'Operations Managers', 'Facility Managers'],
        user: ['Safety coordinators', 'Shift supervisors', 'Security teams', 'HR/compliance'],
        blocker: ['Privacy concerns', 'Unions', 'Existing safety vendors', 'IT (integration)']
      },

      salesFlow: {
        phases: [
          { phase: 'Site Assessment', duration: '1-2 weeks', activities: 'Evaluate existing camera infrastructure, identify high-risk areas, baseline incident data', keyAction: 'Map camera coverage to safety hotspots' },
          { phase: 'Pilot Deployment', duration: '4-8 weeks', activities: 'Deploy AI on subset of cameras, configure alerts, train safety team', keyAction: 'Catch first prevented incident' },
          { phase: 'Site Rollout', duration: '2-4 months', activities: 'Expand to all cameras, integrate with safety systems, measure ROI', keyAction: 'Demonstrate injury reduction and cost savings' },
          { phase: 'Enterprise Scale', duration: 'Ongoing', activities: 'Multi-site deployment, executive dashboards, continuous improvement', keyAction: 'Become enterprise safety platform' },
        ],
        model: 'SaaS subscription. $64M raised. $44M Series B led by NewRoad Capital (Walmart logistics exec). Ericsson Ventures strategic investment.',
        expansion: 'Pilot site → Site-wide → Multi-site → Enterprise safety intelligence'
      },

      competitivePosition: {
        strengths: ['No new hardware required', 'Eclipse Ventures backed', 'Fortune 500 customers', '80% injury reduction results'],
        weaknesses: ['Privacy concerns at scale', 'Requires existing camera infrastructure', 'Competition from general vision platforms', 'Sector focus limits TAM'],
        vsIncumbents: 'vs Traditional EHS software: Proactive (vs reactive). Computer vision-native. Real-time alerts.',
        vsChallengers: 'vs Ambient.ai/Verkada: Safety-focused (vs security). Industrial expertise. Eclipse portfolio credibility.',
      }
    },

    foxglove: {
      name: 'Foxglove',
      logo: '📊',
      tagline: 'Data & Observability Platform for Physical AI',
      color: 'orange',
      presence: foxglovePresence,

      strategy: {
        thesis: 'Build the "AWS for robotics data" - the infrastructure layer every Physical AI company needs but shouldn\'t build themselves. Data collection, visualization, and observability for autonomous systems.',
        play: 'Become the standard data stack for robotics development. Start with visualization tools, expand to full data lifecycle: collection, storage, analysis, ML training.',
        wedge: 'Robotics teams drowning in multimodal sensor data with fragmented tooling. Only Tesla/Waymo can afford to build this infrastructure internally.',
        moat: '$58M+ raised including $40M Series B (Nov 2025, led by Bessemer). Eclipse Ventures backed. MCAP open-source format (adopted by ROS 2, NVIDIA Isaac). NVIDIA, Amazon, Anduril, Wayve, Shield AI customers.'
      },

      offerings: [
        { name: 'Foxglove Visualization', layer: 'L2-L3', description: 'Robotics data visualization', value: 'Interactive analysis: 3D, video, audio, GNSS, time-series in unified workspace. Debugging and development acceleration.', industries: ['Land Transport', 'Discrete Manufacturing', 'Aerospace & Defense'] },
        { name: 'Data Platform', layer: 'L3', description: 'Robotics data management', value: 'Petabyte-scale storage, search, and query. Cloud, on-premises, air-gapped deployment. Flexible data lifecycle.', industries: ['Land Transport', 'Discrete Manufacturing', 'Aerospace & Defense'] },
        { name: 'MCAP', layer: 'L2', description: 'Open-source logging format', value: 'Multimodal logging standard. Adopted by ROS 2 and NVIDIA Isaac. Time-synchronized sensor data.', industries: ['All robotics'] },
        { name: 'Observability Suite', layer: 'L3', description: 'Production monitoring', value: 'Real-time system monitoring. Performance analytics. Debugging tools for deployed robots.', industries: ['Land Transport', 'Discrete Manufacturing'] },
      ],

      buyers: {
        executive: ['VP Engineering', 'CTO', 'Head of Autonomy', 'Director of Robotics'],
        champion: ['Robotics Engineers', 'ML Infrastructure Leads', 'DevOps/Platform Engineers'],
        user: ['Robotics developers', 'ML engineers', 'Test engineers', 'Operations teams'],
        blocker: ['Build-vs-buy mentality', 'Existing internal tools', 'Data security concerns']
      },

      salesFlow: {
        phases: [
          { phase: 'Developer Adoption', duration: '2-4 weeks', activities: 'Free tier usage, visualization for debugging, team discovery', keyAction: 'Engineers adopt organically' },
          { phase: 'Team Expansion', duration: '1-3 months', activities: 'Paid tier for collaboration, data storage, team workflows', keyAction: 'Prove development time savings (20%+ reported)' },
          { phase: 'Platform Standardization', duration: '3-6 months', activities: 'Enterprise deployment, data governance, production monitoring', keyAction: 'Become official robotics data platform' },
          { phase: 'Ecosystem Integration', duration: 'Ongoing', activities: 'SDK integration (like Shield AI), partner ecosystem, advanced analytics', keyAction: 'Become infrastructure for customer products' },
        ],
        model: 'Freemium to enterprise SaaS. $58M+ raised. Series B led by Bessemer. Developer-led growth.',
        expansion: 'Individual developers → Team adoption → Enterprise platform → SDK/infrastructure integration'
      },

      competitivePosition: {
        strengths: ['Cruise pedigree (founders)', 'Eclipse Ventures backed', 'MCAP becoming standard', 'Elite customers (NVIDIA, Amazon, Anduril)'],
        weaknesses: ['Horizontal platform (vs domain-specific)', 'Competition from internal tools', 'AWS/cloud players could enter', 'Robotics market still emerging'],
        vsIncumbents: 'vs In-house tools: Purpose-built (vs cobbled together). Faster iteration. 20% dev time savings reported.',
        vsChallengers: 'vs Rerun/similar: First mover. Ecosystem adoption (MCAP standard). Broader customer base.',
      }
    },

    cerebras: {
      name: 'Cerebras',
      logo: '🧠',
      tagline: 'Wafer-Scale AI Chips: The Fastest AI Infrastructure',
      color: 'red',
      presence: cerebrasPresence,

      strategy: {
        thesis: 'Escape GPU limitations through wafer-scale integration. Build the largest AI chip possible (entire wafer = one chip) to eliminate memory bandwidth bottlenecks.',
        play: 'Provide 20x faster AI inference than NVIDIA GPUs for enterprises demanding real-time AI. Training and inference for frontier models without distributed computing complexity.',
        wedge: 'Enterprise AI inference where latency matters. Real-time use cases (code generation, reasoning, agents) where GPU speed is insufficient.',
        moat: '$1.1B+ raised at $8.1B valuation (Series G, Sep 2025). WSE-3: 4 trillion transistors, 900K cores, 125 petaflops. Meta partnership (Llama API). Mayo Clinic, Argonne National Lab customers.'
      },

      offerings: [
        { name: 'Wafer Scale Engine 3 (WSE-3)', layer: 'L6', description: 'World\'s largest AI chip', value: '4 trillion transistors. 46,255mm². 900K AI-optimized cores. 125 petaflops. Purpose-built for AI.', industries: ['Data Centers', 'All AI verticals'] },
        { name: 'CS-3 System', layer: 'L6', description: 'AI supercomputer', value: 'Train models up to 24T parameters. 2,048 system clusters possible. Simpler software than GPU clusters.', industries: ['Data Centers'] },
        { name: 'Cerebras Cloud', layer: 'L6', description: 'AI inference service', value: '20x faster inference than GPUs. Llama, DeepSeek, frontier models. SOC2/HIPAA certified.', industries: ['All verticals'] },
        { name: 'On-Premise Deployment', layer: 'L6', description: 'Enterprise AI infrastructure', value: 'CS-3 systems for enterprise/government. Air-gapped options. Sovereign AI capability.', industries: ['Aerospace & Defense', 'Energy', 'Data Centers'] },
      ],

      buyers: {
        executive: ['CTO', 'Chief AI Officer', 'VP Infrastructure', 'Head of ML Platform'],
        champion: ['ML Infrastructure Leads', 'AI Research Directors', 'Data Center Architects'],
        user: ['ML engineers', 'AI researchers', 'Platform engineers', 'Data scientists'],
        blocker: ['NVIDIA ecosystem lock-in', 'Procurement (new vendor)', 'IT (unfamiliar architecture)', 'Software compatibility']
      },

      salesFlow: {
        phases: [
          { phase: 'Cloud Evaluation', duration: '2-4 weeks', activities: 'Test inference speed on Cerebras Cloud, benchmark vs GPU baseline', keyAction: 'Demonstrate 20x speed advantage' },
          { phase: 'Production Cloud', duration: '1-3 months', activities: 'Production workloads on Cerebras Cloud, measure TCO, validate reliability', keyAction: 'Prove cost-performance at scale' },
          { phase: 'Strategic Partnership', duration: '3-6 months', activities: 'Custom model optimization, dedicated capacity, on-premise evaluation', keyAction: 'Establish Cerebras as strategic AI infrastructure' },
          { phase: 'On-Premise Deployment', duration: '6-12 months', activities: 'CS-3 system installation, integration, training partnership', keyAction: 'Long-term hardware relationship' },
        ],
        model: 'Cloud inference (usage-based) + hardware sales. $1.1B Series G at $8.1B valuation. Meta, AWS partnerships.',
        expansion: 'Cloud inference trial → Production cloud → Strategic partnership → On-premise systems'
      },

      competitivePosition: {
        strengths: ['20x faster than NVIDIA GPUs', 'Wafer-scale unique architecture', '$8.1B valuation', 'Meta/AWS partnerships'],
        weaknesses: ['Single vendor vs NVIDIA ecosystem', 'High capital requirements', 'G42 revenue concentration', 'IPO delayed'],
        vsIncumbents: 'vs NVIDIA: 20x faster inference. Purpose-built for AI (not graphics heritage). Simpler software stack.',
        vsChallengers: 'vs Groq/SambaNova: Larger scale (wafer vs chip). Broader model support. More funding and partnerships.',
      }
    }
  };


  // ============================================
  // INDUSTRY DATA (Overview + Buyers + Sales Motion)
  // ============================================

  const industryData = {
    process: {
      name: 'Process Manufacturing',
      subtitle: 'Food, Chemicals, Pharmaceuticals, CPG',
      overview: [
        'Process manufacturing transforms raw materials through chemical, thermal, or biological reactions into products that cannot be easily disassembled–think pharmaceuticals, specialty chemicals, food & beverage, and consumer packaged goods. These industries operate continuous or batch processes where consistency, yield optimization, and regulatory compliance are paramount. The AI transformation here centers on replacing first-principles models with learned surrogates, automating recipe optimization, and enabling real-time quality prediction.',
        'The sector faces unique challenges: 20-40 year asset lifecycles, stringent FDA/EPA regulations requiring extensive validation, and deeply embedded DCS/SCADA systems from vendors like Emerson, Honeywell, and Yokogawa. AI adoption is accelerating in predictive maintenance and quality control, but the path to autonomous operations remains gated by validation requirements and the physics of batch processes that cannot be easily interrupted for model updates.'
      ],
      disruptionUseCases: [
        { title: 'AI-Driven Recipe Optimization', description: 'Replace trial-and-error recipe development with ML models that predict optimal parameters for yield, quality, and energy consumption. Golden batch identification and automatic parameter adjustment.', layers: ['L6', 'L3', 'L2'], impact: 'High' },
        { title: 'Continuous Quality Prediction', description: 'Soft sensors and real-time inference replacing end-of-batch lab testing. Predict quality attributes during production, enabling closed-loop control and reducing waste.', layers: ['L6', 'L3', 'L1'], impact: 'High' },
        { title: 'Predictive Maintenance for Rotating Equipment', description: 'Vibration, acoustic, and thermal sensor fusion to predict pump, motor, and compressor failures 30-90 days ahead. Shift from time-based to condition-based maintenance.', layers: ['L1', 'L3'], impact: 'Medium' },
        { title: 'Supply Chain Control Tower', description: 'AI-powered demand sensing and multi-tier supplier visibility. Real-time optimization of raw material sourcing, production scheduling, and distribution.', layers: ['L5', 'L4'], impact: 'High' },
        { title: 'Autonomous Process Control', description: 'AI agents that adjust setpoints and sequences in real-time, moving beyond APC to truly adaptive control. Requires solving validation and regulatory approval challenges.', layers: ['L3', 'L2', 'L6'], impact: 'Transformational' },
        { title: 'Digital Twin for Process Development', description: 'Neural surrogates that learn plant behavior from simulation and operational data. Accelerate scale-up from lab to production by 50-80%.', layers: ['L6', 'L0'], impact: 'High' },
        { title: 'Operator Copilots', description: 'LLM-powered assistants that guide operators through procedures, troubleshoot deviations, and capture tribal knowledge. Address workforce skills gap and knowledge loss.', layers: ['L-1', 'L3'], impact: 'Medium' },
      ],
      buyers: [
        { layer: 'L6', buyer: 'Chief Digital Officer, VP R&D, Head of Data Science', user: 'Data scientists, process engineers, R&D chemists', painPoints: 'Justifying FM investment, finding industrial training data, production deployment' },
        { layer: 'L5', buyer: 'VP Supply Chain, Chief Procurement Officer', user: 'S&OP planners, procurement managers, logistics coordinators', painPoints: 'Demand volatility, supplier lead times, inventory carrying costs' },
        { layer: 'L4', buyer: 'CFO, CIO, VP Operations', user: 'Plant controllers, finance analysts, cost accountants', painPoints: 'Batch costing accuracy, manual reconciliation, compliance reporting' },
        { layer: 'L3', buyer: 'VP Manufacturing, Plant Directors, Site Managers', user: 'Production supervisors, batch operators, process engineers', painPoints: 'Yield variance, changeover time, OEE gaps, deviation management' },
        { layer: 'L2', buyer: 'VP Engineering, Automation Manager, Controls Lead', user: 'Control engineers, DCS programmers, instrument techs', painPoints: 'DCS obsolescence, integration complexity, APC maintenance' },
        { layer: 'L1', buyer: 'Reliability Manager, Maintenance Director, QA Manager', user: 'Reliability engineers, maintenance planners, lab techs', painPoints: 'Unplanned downtime, manual rounds, lab turnaround time' },
        { layer: 'L0', buyer: 'VP Capital Projects, Engineering Director, Site VP', user: 'Project engineers, construction managers, process engineers', painPoints: 'Long capital cycles, cleaning validation, capacity constraints' },
        { layer: 'L-1', buyer: 'VP HR, COO, Site Directors, EHS Manager', user: 'Shift supervisors, training coordinators, union reps', painPoints: 'Operator shortages, knowledge loss, safety incidents, skills gaps' },
      ],
      salesMotion: {
        topDown: {
          title: 'Top-Down Sales (L4-L6)',
          entry: 'CDO/CIO for digital transformation initiatives',
          champion: 'VP Operations or Plant Director with P&L pain',
          cycle: '6-18 months, enterprise-wide deals',
          proof: 'POC at one site, then rollout'
        },
        bottomUp: {
          title: 'Bottom-Up Sales (L1-L3)',
          entry: 'Reliability Manager or Automation Lead with specific problem',
          champion: 'Plant engineer who tried spreadsheets and failed',
          cycle: '1-6 months, site-by-site expansion',
          proof: 'Quick wins on one line/unit, expand'
        }
      }
    },
    discrete: {
      name: 'Discrete Manufacturing',
      subtitle: 'Automotive, Electronics, Machinery, Aerospace Components',
      overview: [
        'Discrete manufacturing assembles distinct, countable items–automobiles, electronics, industrial machinery, and aerospace components. Unlike process industries, products can be disassembled, and production involves complex sequences of machining, fabrication, and assembly operations. AI transformation focuses on vision-based quality inspection, robotic manipulation, predictive maintenance for CNC equipment, and supply chain orchestration across tiered supplier networks.',
        'The sector is characterized by high-mix/low-volume trends, increasing customization demands, and pressure from EV/electrification transitions. Legacy MES systems from Siemens, Rockwell, and Dassault face disruption from AI-native platforms. The automotive industry leads adoption due to competitive pressure, while aerospace lags due to certification requirements. Key battlegrounds include automated optical inspection, collaborative robotics, and digital twin-enabled production planning.'
      ],
      disruptionUseCases: [
        { title: 'AI-Powered Visual Inspection', description: 'Computer vision replacing human inspectors for defect detection. Zero-shot anomaly detection, automated root cause analysis, and real-time quality feedback to upstream processes.', layers: ['L1', 'L3', 'L6'], impact: 'High' },
        { title: 'Autonomous Mobile Robots (AMRs)', description: 'Self-navigating robots for material handling, kitting, and line-side delivery. Replace fixed conveyors with flexible, reconfigurable logistics.', layers: ['L0', 'L2', 'L3'], impact: 'High' },
        { title: 'Robot Learning & VLA Models', description: 'Vision-Language-Action models enabling robots to learn manipulation tasks from demonstration rather than explicit programming. Drastically reduce deployment time for new products.', layers: ['L6', 'L0', 'L2'], impact: 'Transformational' },
        { title: 'Digital Thread & Traceability', description: 'AI-powered tracking from design through production to field service. Automated genealogy, serialization, and compliance documentation.', layers: ['L4', 'L5', 'L3'], impact: 'Medium' },
        { title: 'Generative Design for DFM', description: 'AI-optimized part designs that balance performance, cost, and manufacturability. Topology optimization integrated with process constraints.', layers: ['L6', 'L0'], impact: 'High' },
        { title: 'Dynamic Production Scheduling', description: 'AI agents that continuously re-optimize schedules based on demand changes, equipment status, and material availability. Replace weekly MRP with real-time optimization.', layers: ['L3', 'L4', 'L5'], impact: 'High' },
        { title: 'CNC & Machine Tool Optimization', description: 'AI-optimized feeds, speeds, and toolpaths. Adaptive machining that responds to material variations and tool wear in real-time.', layers: ['L2', 'L1', 'L6'], impact: 'Medium' },
      ],
      buyers: [
        { layer: 'L6', buyer: 'Chief Digital Officer, VP Engineering, Head of AI/ML', user: 'Data scientists, quality engineers, manufacturing engineers', painPoints: 'Scaling AI beyond pilots, integrating with PLM/MES, real-time inference at edge' },
        { layer: 'L5', buyer: 'VP Supply Chain, Chief Procurement Officer', user: 'Supply chain planners, logistics managers, supplier quality engineers', painPoints: 'Multi-tier visibility, supplier disruptions, inventory optimization' },
        { layer: 'L4', buyer: 'CFO, CIO, VP Manufacturing', user: 'Production planners, cost analysts, IT operations', painPoints: 'ERP/MES integration, real-time costing, traceability requirements' },
        { layer: 'L3', buyer: 'VP Manufacturing, Plant Manager, Quality Director', user: 'Production supervisors, quality inspectors, manufacturing engineers', painPoints: 'Takt time pressure, defect rates, changeover optimization' },
        { layer: 'L2', buyer: 'VP Engineering, Automation Director, Controls Manager', user: 'PLC programmers, robotics engineers, automation techs', painPoints: 'Robot programming complexity, legacy PLC constraints, line balancing' },
        { layer: 'L1', buyer: 'Quality Director, Reliability Manager, Process Engineering Lead', user: 'Quality technicians, maintenance planners, metrology specialists', painPoints: 'Inspection bottlenecks, false reject rates, calibration management' },
        { layer: 'L0', buyer: 'VP Operations, Capital Planning Director, Facilities Manager', user: 'Industrial engineers, facilities planners, equipment engineers', painPoints: 'Capacity constraints, equipment obsolescence, flexibility for new products' },
        { layer: 'L-1', buyer: 'VP HR, Operations Director, Training Manager', user: 'Line supervisors, training coordinators, safety managers', painPoints: 'Skilled labor shortage, training time for new models, ergonomic injuries' },
      ],
      salesMotion: {
        topDown: {
          title: 'Top-Down Sales (L4-L6)',
          entry: 'CDO or VP Digital Transformation with Industry 4.0 mandate',
          champion: 'Plant Manager with quality or throughput KPIs',
          cycle: '6-12 months, often tied to new model launches',
          proof: 'Single line POC with measurable yield/quality improvement'
        },
        bottomUp: {
          title: 'Bottom-Up Sales (L1-L3)',
          entry: 'Quality Manager frustrated with inspection bottlenecks',
          champion: 'Manufacturing engineer seeking automation',
          cycle: '2-6 months, cell-by-cell deployment',
          proof: 'Defect escape reduction on high-value products'
        }
      }
    },
    energy: {
      name: 'Energy',
      subtitle: 'Oil & Gas, Upstream, Midstream, Downstream',
      overview: [
        'The energy sector encompasses exploration, production, transportation, and refining of hydrocarbons–from offshore platforms and shale fields to pipelines and refineries. AI transformation targets reservoir modeling, production optimization, predictive maintenance for critical rotating equipment, and emissions monitoring. The industry operates some of the most capital-intensive and safety-critical assets on earth, with 20-40 year field lifecycles.',
        'Digital adoption varies dramatically: majors like Shell and BP invest heavily in AI centers of excellence, while independents and national oil companies lag. Key challenges include remote/offshore connectivity, explosive atmosphere certifications, and workforce that values field experience over data science. The energy transition creates urgency around methane detection, carbon capture optimization, and operational efficiency to remain competitive as demand patterns shift.'
      ],
      disruptionUseCases: [
        { title: 'AI-Accelerated Reservoir Modeling', description: 'Neural surrogates that learn subsurface flow behavior, reducing simulation time from days to minutes. Enable rapid scenario analysis and uncertainty quantification.', layers: ['L6', 'L4'], impact: 'High' },
        { title: 'Autonomous Well Optimization', description: 'AI agents that continuously tune artificial lift systems, choke settings, and injection rates. Move from periodic engineering reviews to real-time optimization.', layers: ['L3', 'L2', 'L6'], impact: 'High' },
        { title: 'Methane Detection & Emissions AI', description: 'Satellite, drone, and ground sensor fusion for continuous methane monitoring. Automated leak detection and repair prioritization for ESG compliance.', layers: ['L1', 'L6', 'L4'], impact: 'High' },
        { title: 'Predictive Maintenance for Rotating Equipment', description: 'Compressors, pumps, and turbines are critical and expensive. Sensor fusion and ML models to predict failures weeks ahead, especially in remote/offshore locations.', layers: ['L1', 'L3'], impact: 'High' },
        { title: 'Drilling Optimization & Automation', description: 'AI-optimized drilling parameters, automated directional drilling, and real-time geosteering. Reduce well costs by 10-30%.', layers: ['L2', 'L3', 'L6'], impact: 'Medium' },
        { title: 'Supply Chain & Trading Intelligence', description: 'AI for crude quality optimization, vessel scheduling, and trading decisions. Integrated view from wellhead to refinery.', layers: ['L5', 'L4', 'L6'], impact: 'Medium' },
        { title: 'Remote Operations & Digital Twin', description: 'Centralized operations centers with AI-assisted monitoring. Reduce offshore manning while improving decision quality.', layers: ['L3', 'L-1', 'L1'], impact: 'Transformational' },
      ],
      buyers: [
        { layer: 'L6', buyer: 'Chief Digital Officer, VP Subsurface, Head of Data Science', user: 'Reservoir engineers, geoscientists, data scientists', painPoints: 'Simulation compute costs, model calibration time, uncertainty quantification' },
        { layer: 'L5', buyer: 'VP Supply Chain, Trading Director, Logistics Manager', user: 'Crude schedulers, marine coordinators, terminal operators', painPoints: 'Crude quality optimization, vessel scheduling, inventory management' },
        { layer: 'L4', buyer: 'CFO, VP Planning, Commercial Director', user: 'Production accountants, commercial analysts, JV coordinators', painPoints: 'Production allocation, partner reporting, hedging optimization' },
        { layer: 'L3', buyer: 'VP Production, Asset Manager, Operations Director', user: 'Production engineers, field operators, control room technicians', painPoints: 'Well optimization, artificial lift efficiency, production uptime' },
        { layer: 'L2', buyer: 'VP Engineering, Automation Manager, I&E Lead', user: 'Control systems engineers, instrument technicians, SCADA admins', painPoints: 'Legacy DCS/SCADA, cybersecurity requirements, remote connectivity' },
        { layer: 'L1', buyer: 'Reliability Director, Integrity Manager, HSE Lead', user: 'Reliability engineers, integrity engineers, inspection coordinators', painPoints: 'Corrosion monitoring, rotating equipment failures, emissions detection' },
        { layer: 'L0', buyer: 'VP Capital Projects, Facilities Engineering Director', user: 'Project engineers, construction managers, commissioning leads', painPoints: 'Megaproject execution, brownfield modifications, decommissioning costs' },
        { layer: 'L-1', buyer: 'VP HR, Operations VP, HSE Director', user: 'Field supervisors, training coordinators, safety specialists', painPoints: 'Crew competency, offshore rotation challenges, contractor management' },
      ],
      salesMotion: {
        topDown: {
          title: 'Top-Down Sales (L4-L6)',
          entry: 'CDO or VP Digital with enterprise transformation mandate',
          champion: 'Asset Manager with production optimization targets',
          cycle: '9-18 months, often tied to digital transformation programs',
          proof: 'Single asset POC showing production uplift or cost reduction'
        },
        bottomUp: {
          title: 'Bottom-Up Sales (L1-L3)',
          entry: 'Reliability Manager with rotating equipment failure pain',
          champion: 'Production engineer seeking well optimization',
          cycle: '3-9 months, asset-by-asset rollout',
          proof: 'Avoided failures on critical compressors/pumps'
        }
      }
    },
    utilities: {
      name: 'Utilities',
      subtitle: 'Power Generation, Transmission, Distribution, Water',
      overview: [
        'Utilities generate, transmit, and distribute electricity and water to residential, commercial, and industrial customers. The sector faces unprecedented transformation driven by renewable integration, grid decentralization, and electrification of transport and heating. AI applications span demand forecasting, renewable generation prediction, grid optimization, predictive maintenance for aging infrastructure, and customer engagement.',
        'Regulatory structures create unique dynamics: investor-owned utilities face rate case scrutiny while public power and cooperatives have different incentive structures. Grid modernization programs drive investment, but the pace of change is constrained by 30-60 year asset lifecycles, NERC CIP cybersecurity requirements, and the criticality of reliability. The rise of distributed energy resources (DERs) and virtual power plants is forcing utilities to evolve from asset operators to orchestrators.'
      ],
      disruptionUseCases: [
        { title: 'AI-Powered Load & Generation Forecasting', description: 'Foundation models that generalize demand and renewable forecasting across regions. Improve accuracy from 95% to 99%+ for grid balancing.', layers: ['L6', 'L5', 'L3'], impact: 'High' },
        { title: 'Virtual Power Plant Orchestration', description: 'AI coordination of millions of distributed energy resources–batteries, EVs, smart thermostats–as dispatchable capacity.', layers: ['L3', 'L2', 'L5'], impact: 'Transformational' },
        { title: 'Predictive Asset Management', description: 'ML models for transformer health, line sag, and vegetation encroachment. Prioritize maintenance and capital investment with risk-based optimization.', layers: ['L1', 'L4', 'L3'], impact: 'High' },
        { title: 'Outage Prediction & Restoration', description: 'AI that predicts outages from weather and asset condition, then optimizes crew dispatch and switching sequences for faster restoration.', layers: ['L3', 'L1', 'L6'], impact: 'High' },
        { title: 'Grid Edge Intelligence', description: 'Autonomous control at the distribution edge–smart inverters, reclosers, and capacitor banks that respond to local conditions in real-time.', layers: ['L2', 'L3', 'L1'], impact: 'High' },
        { title: 'Customer AI & Demand Response', description: 'Personalized energy insights, automated demand response enrollment, and dynamic rate optimization. AI chatbots for customer service.', layers: ['L4', 'L-1', 'L6'], impact: 'Medium' },
        { title: 'Vegetation Management AI', description: 'Satellite and LiDAR analysis for vegetation encroachment detection. Optimize trim cycles and reduce wildfire risk.', layers: ['L1', 'L6'], impact: 'Medium' },
      ],
      buyers: [
        { layer: 'L6', buyer: 'Chief Digital Officer, VP Grid Modernization, Director of Analytics', user: 'Data scientists, grid analysts, forecasting specialists', painPoints: 'Renewable intermittency, load forecasting accuracy, DER integration' },
        { layer: 'L5', buyer: 'VP Power Supply, Energy Trading Director', user: 'Power traders, resource planners, dispatch operators', painPoints: 'Market volatility, renewable curtailment, capacity planning' },
        { layer: 'L4', buyer: 'CFO, CIO, VP Customer Operations', user: 'Billing analysts, customer service reps, rate analysts', painPoints: 'AMI data management, rate design complexity, customer experience' },
        { layer: 'L3', buyer: 'VP T&D Operations, Grid Operations Director', user: 'Control room operators, dispatchers, outage coordinators', painPoints: 'Outage response time, switching optimization, crew dispatch' },
        { layer: 'L2', buyer: 'VP Engineering, SCADA Manager, Protection & Control Lead', user: 'Protection engineers, SCADA technicians, relay techs', painPoints: 'Legacy EMS/SCADA, NERC CIP compliance, DER visibility' },
        { layer: 'L1', buyer: 'VP Asset Management, Reliability Director, T&D Engineering Lead', user: 'Asset engineers, line inspectors, substation technicians', painPoints: 'Aging infrastructure, vegetation management, transformer health' },
        { layer: 'L0', buyer: 'VP Capital Delivery, Grid Modernization Director', user: 'Project managers, construction supervisors, standards engineers', painPoints: 'Capital backlog, interconnection queues, permitting delays' },
        { layer: 'L-1', buyer: 'VP HR, Safety Director, Workforce Development Lead', user: 'Line supervisors, apprenticeship coordinators, safety trainers', painPoints: 'Lineworker shortage, storm response capacity, contractor safety' },
      ],
      salesMotion: {
        topDown: {
          title: 'Top-Down Sales (L4-L6)',
          entry: 'CDO or VP Grid Modernization with regulatory approval',
          champion: 'Grid Operations Director with reliability mandates',
          cycle: '12-24 months, often tied to rate cases or grid mod programs',
          proof: 'Pilot on specific feeder or substation population'
        },
        bottomUp: {
          title: 'Bottom-Up Sales (L1-L3)',
          entry: 'Asset Manager with aging infrastructure concerns',
          champion: 'Distribution engineer seeking outage reduction',
          cycle: '6-12 months, territory or asset class expansion',
          proof: 'Reduced outage minutes or deferred capital on specific assets'
        }
      }
    },
    mining: {
      name: 'Mining',
      subtitle: 'Metals, Minerals, Aggregates',
      overview: [
        'Mining extracts valuable minerals and metals from the earth through open-pit, underground, and increasingly automated operations. AI transformation targets orebody modeling, autonomous haulage, predictive maintenance for massive mobile equipment, and process optimization in concentrators and refineries. The industry operates in remote, harsh environments with 20-40 year mine lives and extreme capital intensity.',
        'Major miners like Rio Tinto, BHP, and Vale lead autonomous operations adoption, with fleets of driverless haul trucks in Australia and South America. However, the industry faces structural challenges: declining ore grades requiring more material movement, ESG pressure around tailings management and emissions, and skilled labor shortages in remote locations. The path to fully autonomous mines is advancing but constrained by mixed fleet operations and regulatory approval processes.'
      ],
      disruptionUseCases: [
        { title: 'Autonomous Haulage Systems (AHS)', description: 'Self-driving haul trucks operating 24/7 without fatigue. Already deployed at scale by Rio Tinto and BHP. Path to fully autonomous mines.', layers: ['L0', 'L2', 'L3'], impact: 'Transformational' },
        { title: 'AI-Enhanced Orebody Modeling', description: 'ML models that fuse drilling, assay, and sensor data with geological priors. Improve grade control and reduce ore loss/dilution.', layers: ['L6', 'L4'], impact: 'High' },
        { title: 'Predictive Maintenance for Mobile Fleet', description: 'Sensor fusion on haul trucks, loaders, and dozers to predict component failures. Critical for remote operations where downtime is expensive.', layers: ['L1', 'L3'], impact: 'High' },
        { title: 'Process Plant Optimization', description: 'AI-optimized grinding, flotation, and leaching parameters. Improve recovery rates and reduce energy consumption in concentrators.', layers: ['L3', 'L2', 'L6'], impact: 'High' },
        { title: 'Drill & Blast Optimization', description: 'ML models for blast pattern design and fragmentation prediction. Reduce drilling costs and improve downstream crusher throughput.', layers: ['L3', 'L0', 'L6'], impact: 'Medium' },
        { title: 'Tailings & ESG Monitoring', description: 'AI-powered monitoring of tailings dam stability, water quality, and rehabilitation progress. Critical for license to operate.', layers: ['L1', 'L4', 'L6'], impact: 'High' },
        { title: 'Underground Autonomy', description: 'Autonomous LHDs and trucks in underground mines. Enables continuous mining and removes workers from hazardous areas.', layers: ['L0', 'L2', 'L-1'], impact: 'Transformational' },
      ],
      buyers: [
        { layer: 'L6', buyer: 'Chief Digital Officer, VP Technical Services, Head of Geoscience', user: 'Geologists, resource modelers, data scientists', painPoints: 'Orebody uncertainty, model update cycles, grade control accuracy' },
        { layer: 'L5', buyer: 'VP Supply Chain, Logistics Director', user: 'Supply planners, port coordinators, rail schedulers', painPoints: 'Pit-to-port optimization, stockpile management, shipping schedules' },
        { layer: 'L4', buyer: 'CFO, VP Planning, Commercial Director', user: 'Mine planners, cost accountants, commercial analysts', painPoints: 'Life-of-mine planning, metal accounting, contract optimization' },
        { layer: 'L3', buyer: 'VP Mining, Processing Manager, Mine Manager', user: 'Shift supervisors, dispatchers, process operators', painPoints: 'Truck productivity, plant throughput, recovery rates' },
        { layer: 'L2', buyer: 'VP Technology, Automation Director, OT Manager', user: 'Automation engineers, network technicians, AHS operators', painPoints: 'Autonomous system integration, network coverage, mixed fleet management' },
        { layer: 'L1', buyer: 'Reliability Director, Maintenance Manager, Process Control Lead', user: 'Reliability engineers, maintenance planners, instrumentation techs', painPoints: 'Haul truck availability, crusher/mill reliability, sensor coverage in harsh conditions' },
        { layer: 'L0', buyer: 'VP Projects, Engineering Director, Asset Management Lead', user: 'Project engineers, construction managers, sustaining capital planners', painPoints: 'Capital intensity, equipment lead times, brownfield expansion complexity' },
        { layer: 'L-1', buyer: 'VP HR, Safety Director, Training Manager', user: 'Mine supervisors, training coordinators, indigenous relations', painPoints: 'FIFO workforce challenges, operator certification, community relations' },
      ],
      salesMotion: {
        topDown: {
          title: 'Top-Down Sales (L4-L6)',
          entry: 'CDO or VP Technical Services with mine-of-the-future vision',
          champion: 'Mine Manager with productivity or cost targets',
          cycle: '9-18 months, often tied to mine expansion or technology refresh',
          proof: 'Single pit or processing circuit with measurable productivity gains'
        },
        bottomUp: {
          title: 'Bottom-Up Sales (L1-L3)',
          entry: 'Reliability Manager frustrated with haul truck downtime',
          champion: 'Process engineer seeking recovery optimization',
          cycle: '3-9 months, equipment class or circuit expansion',
          proof: 'Availability improvement on critical mobile or fixed assets'
        }
      }
    },
    construction: {
      name: 'Construction',
      subtitle: 'Infrastructure, Commercial, Residential, Industrial',
      overview: [
        'Construction creates the built environment–from highways and bridges to commercial buildings and residential developments. Unlike manufacturing, every project is essentially a prototype built in uncontrolled outdoor conditions with temporary workforces. AI transformation targets design optimization, schedule prediction, safety monitoring, quality inspection, and equipment fleet management across fragmented subcontractor ecosystems.',
        'The industry is notoriously slow to digitize, with productivity flat for decades while manufacturing improved dramatically. Key barriers include project-based accounting that disincentivizes technology investment, fragmented value chains, and a workforce skeptical of surveillance. However, labor shortages and cost pressures are driving adoption of reality capture, AI-powered scheduling, and autonomous equipment. The construction tech stack remains fragmented across estimating, project management, and field execution.'
      ],
      disruptionUseCases: [
        { title: 'AI-Powered Schedule & Risk Prediction', description: 'ML models that predict schedule delays and cost overruns from project data. Early warning systems for at-risk activities.', layers: ['L4', 'L3', 'L6'], impact: 'High' },
        { title: 'Reality Capture & Progress Tracking', description: 'Drones, 360Â° cameras, and LiDAR combined with AI to automatically track construction progress against BIM. Detect deviations early.', layers: ['L1', 'L3', 'L6'], impact: 'High' },
        { title: 'Computer Vision for Safety', description: 'AI monitoring of PPE compliance, exclusion zone violations, and unsafe behaviors. Real-time alerts and trend analysis.', layers: ['L1', 'L3', 'L-1'], impact: 'High' },
        { title: 'Generative Design & Optimization', description: 'AI-generated design options that optimize for cost, schedule, sustainability, and constructability simultaneously.', layers: ['L6', 'L0'], impact: 'Medium' },
        { title: 'Autonomous & Semi-Autonomous Equipment', description: 'GPS-guided grading, autonomous compaction, and semi-autonomous excavation. Increase precision and reduce operator skill requirements.', layers: ['L0', 'L2'], impact: 'Transformational' },
        { title: 'AI Estimating & Takeoff', description: 'Automated quantity takeoff from drawings and ML-based cost estimation. Faster, more accurate bids.', layers: ['L4', 'L6'], impact: 'Medium' },
        { title: 'Workforce Productivity Analytics', description: 'AI analysis of labor productivity patterns. Identify bottlenecks, optimize crew assignments, and reduce idle time.', layers: ['L3', 'L-1', 'L4'], impact: 'Medium' },
      ],
      buyers: [
        { layer: 'L6', buyer: 'Chief Digital Officer, VP Innovation, Head of VDC', user: 'BIM managers, computational designers, data analysts', painPoints: 'Design coordination, clash detection, generative design adoption' },
        { layer: 'L5', buyer: 'VP Procurement, Supply Chain Director', user: 'Procurement managers, logistics coordinators, material planners', painPoints: 'Material price volatility, delivery coordination, supplier fragmentation' },
        { layer: 'L4', buyer: 'CFO, VP Operations, Project Controls Director', user: 'Project controllers, cost engineers, schedulers', painPoints: 'Cost overruns, schedule delays, change order management' },
        { layer: 'L3', buyer: 'VP Construction, Project Director, Superintendent', user: 'Site superintendents, foremen, QA/QC inspectors', painPoints: 'Productivity tracking, quality issues, coordination failures' },
        { layer: 'L2', buyer: 'VP Equipment, Fleet Manager, Technology Director', user: 'Equipment operators, fleet coordinators, telematics analysts', painPoints: 'Equipment utilization, fuel costs, operator shortages' },
        { layer: 'L1', buyer: 'VP Safety, Quality Director, Field Technology Lead', user: 'Safety managers, quality inspectors, surveyors', painPoints: 'Safety incidents, rework rates, as-built documentation' },
        { layer: 'L0', buyer: 'VP Preconstruction, Chief Estimator, Engineering Lead', user: 'Estimators, design engineers, value engineers', painPoints: 'Bid accuracy, design buildability, scope creep' },
        { layer: 'L-1', buyer: 'VP HR, Labor Relations Director, Training Manager', user: 'Craft supervisors, apprenticeship coordinators, union reps', painPoints: 'Skilled trade shortages, apprentice pipeline, productivity variance' },
      ],
      salesMotion: {
        topDown: {
          title: 'Top-Down Sales (L4-L6)',
          entry: 'CDO or VP Operations seeking enterprise standardization',
          champion: 'Project Director with major project challenges',
          cycle: '6-12 months, often piloted on flagship projects',
          proof: 'Single large project showing schedule or cost improvement'
        },
        bottomUp: {
          title: 'Bottom-Up Sales (L1-L3)',
          entry: 'Superintendent or PM frustrated with specific pain point',
          champion: 'Field engineer seeking better coordination',
          cycle: '1-3 months, project-to-project expansion',
          proof: 'Productivity or safety improvement on active jobsite'
        }
      }
    },
    aerospace: {
      name: 'Aerospace & Defense',
      subtitle: 'Commercial Aviation, Defense, Space',
      overview: [
        'Aerospace & Defense designs, manufactures, and maintains aircraft, spacecraft, and defense systems under the most stringent quality and regulatory requirements of any industry. AI transformation targets design optimization, manufacturing quality, predictive maintenance for engines and airframes, and autonomous systems for defense applications. The sector operates under FAA/EASA certification requirements that slow technology adoption but ensure safety.',
        'Defense primes like Lockheed Martin, RTX, and Northrop Grumman are investing heavily in AI for autonomous systems, electronic warfare, and logistics. Commercial aerospace (Boeing, Airbus, tier-1 suppliers) focuses on manufacturing quality and MRO optimization. The sector faces unique challenges: multi-decade platform lifecycles, AS9100 quality requirements, ITAR export controls, and classified program constraints. Despite sophistication in engineering, many factories still rely on paper-based processes and tribal knowledge.'
      ],
      disruptionUseCases: [
        { title: 'AI-Accelerated CFD & Simulation', description: 'Neural surrogates that learn aerodynamics, reducing CFD run time from days to minutes. Faster design iteration and optimization.', layers: ['L6', 'L0'], impact: 'High' },
        { title: 'Autonomous & Attritable Systems', description: 'AI-powered drones, loyal wingmen, and autonomous vehicles. VLA models enabling new mission capabilities.', layers: ['L6', 'L0', 'L2'], impact: 'Transformational' },
        { title: 'AI-Powered NDT & Inspection', description: 'Computer vision for automated X-ray, ultrasonic, and visual inspection interpretation. Reduce inspector bottlenecks and improve consistency.', layers: ['L1', 'L3', 'L6'], impact: 'High' },
        { title: 'Predictive MRO & Engine Health', description: 'Digital twins and sensor fusion for engine and airframe health prediction. Optimize maintenance intervals and reduce AOG events.', layers: ['L1', 'L3', 'L4'], impact: 'High' },
        { title: 'Manufacturing Quality Prediction', description: 'ML models predicting defects from process parameters. In-line quality control to reduce scrap and rework.', layers: ['L3', 'L1', 'L6'], impact: 'High' },
        { title: 'AI Mission Planning', description: 'AI systems that learn operational art from simulation and historical campaigns. Faster, more adaptive planning.', layers: ['L6', 'L3', 'L4'], impact: 'High' },
        { title: 'Supply Chain Resilience', description: 'AI for multi-tier supplier risk monitoring, alternative sourcing, and demand/supply matching in long-lead-time environment.', layers: ['L5', 'L4', 'L6'], impact: 'Medium' },
      ],
      buyers: [
        { layer: 'L6', buyer: 'Chief Technology Officer, VP Engineering, AI/ML Director', user: 'Design engineers, stress analysts, data scientists', painPoints: 'Certification of AI systems, design cycle acceleration, simulation fidelity' },
        { layer: 'L5', buyer: 'VP Supply Chain, Director of Procurement', user: 'Supply chain planners, commodity managers, logistics specialists', painPoints: 'Supplier delivery performance, titanium/specialty material sourcing, inventory optimization' },
        { layer: 'L4', buyer: 'CFO, CIO, VP Program Management', user: 'Program managers, cost analysts, earned value specialists', painPoints: 'Program cost overruns, EAC accuracy, contract compliance' },
        { layer: 'L3', buyer: 'VP Manufacturing, Factory Director, Quality VP', user: 'Production supervisors, quality engineers, manufacturing engineers', painPoints: 'First-pass yield, traveled work, FOD prevention' },
        { layer: 'L2', buyer: 'VP Operations Technology, Automation Director', user: 'Automation engineers, robotics programmers, MES administrators', painPoints: 'Legacy MES integration, robotic drilling/fastening, digital thread continuity' },
        { layer: 'L1', buyer: 'VP Quality, Chief Inspector, NDT Director', user: 'NDT technicians, CMM operators, quality inspectors', painPoints: 'Inspection bottlenecks, NDT interpretation, measurement system capability' },
        { layer: 'L0', buyer: 'VP Capital Projects, Facilities Director, Industrial Engineering Lead', user: 'Industrial engineers, facilities planners, tooling engineers', painPoints: 'Rate ramp capacity, factory flow optimization, tooling investment' },
        { layer: 'L-1', buyer: 'VP HR, Training Director, EHS Manager', user: 'Production trainers, certification coordinators, safety specialists', painPoints: 'A&P mechanic shortage, security clearance backlogs, specialized skill development' },
      ],
      salesMotion: {
        topDown: {
          title: 'Top-Down Sales (L4-L6)',
          entry: 'CTO or VP Digital Transformation with enterprise mandate',
          champion: 'Program Manager with schedule or quality pressure',
          cycle: '12-24 months, extensive security and compliance review',
          proof: 'Single factory or program POC with quality/cycle time improvement'
        },
        bottomUp: {
          title: 'Bottom-Up Sales (L1-L3)',
          entry: 'Quality Director seeking inspection throughput',
          champion: 'Manufacturing engineer with specific process challenge',
          cycle: '6-12 months, cell or process area expansion',
          proof: 'Yield improvement or inspection cycle time reduction'
        }
      }
    },
    land: {
      name: 'Land Transport',
      subtitle: 'Trucking, Rail, Warehousing, Last-Mile',
      overview: [
        'Land transport moves goods across road and rail networks, from long-haul trucking to last-mile delivery and warehouse operations. AI transformation targets route optimization, predictive maintenance for fleets, warehouse automation, and increasingly autonomous vehicle operations. The sector is highly fragmented, with massive carriers competing alongside owner-operators and regional players.',
        'The trucking industry faces a structural driver shortage driving interest in autonomous trucks from companies like Aurora, Kodiak, and Waymo Via. Rail operators like UP and BNSF invest in precision scheduled railroading and predictive maintenance. Warehouse automation is accelerating rapidly, with Amazon setting benchmarks that 3PLs struggle to match. Key challenges include asset utilization optimization, fuel cost management, and the transition from diesel to electric/hydrogen powertrains.'
      ],
      disruptionUseCases: [
        { title: 'Autonomous Trucking', description: 'Self-driving trucks for hub-to-hub long-haul routes. Address driver shortage while improving asset utilization with 24/7 operation.', layers: ['L0', 'L2', 'L6'], impact: 'Transformational' },
        { title: 'AI-Powered Route Optimization', description: 'Real-time routing that considers traffic, weather, HOS, and delivery windows. Continuous re-optimization vs. static planning.', layers: ['L3', 'L5', 'L6'], impact: 'High' },
        { title: 'Warehouse Robotics & Automation', description: 'AMRs, robotic picking, and goods-to-person systems. AI orchestration of human-robot workflows.', layers: ['L0', 'L2', 'L3'], impact: 'High' },
        { title: 'Predictive Maintenance for Fleets', description: 'Telematics and sensor data predicting component failures. Reduce roadside breakdowns and optimize maintenance scheduling.', layers: ['L1', 'L3'], impact: 'Medium' },
        { title: 'Demand Forecasting & Capacity Planning', description: 'ML models predicting shipment volumes and optimizing capacity acquisition. Dynamic pricing and load matching.', layers: ['L5', 'L4', 'L6'], impact: 'High' },
        { title: 'Driver Safety & Coaching', description: 'AI analysis of driving behavior for real-time coaching and risk scoring. Reduce accidents and insurance costs.', layers: ['L1', 'L-1', 'L3'], impact: 'Medium' },
        { title: 'Last-Mile Delivery Optimization', description: 'AI for delivery route sequencing, time window prediction, and customer communication. Critical for e-commerce growth.', layers: ['L3', 'L5', 'L-1'], impact: 'High' },
      ],
      buyers: [
        { layer: 'L6', buyer: 'Chief Digital Officer, VP Technology, Head of Analytics', user: 'Data scientists, network analysts, operations researchers', painPoints: 'Network optimization complexity, demand forecasting, real-time replanning' },
        { layer: 'L5', buyer: 'VP Supply Chain, Network Planning Director', user: 'Network planners, capacity managers, intermodal coordinators', painPoints: 'Mode selection, dwell time, terminal congestion' },
        { layer: 'L4', buyer: 'CFO, CIO, VP Operations', user: 'Fleet controllers, finance analysts, TMS administrators', painPoints: 'Cost per mile, asset utilization, carrier settlement' },
        { layer: 'L3', buyer: 'VP Fleet Operations, Terminal Manager, DC Director', user: 'Dispatchers, terminal supervisors, warehouse managers', painPoints: 'Load planning, dock scheduling, labor productivity' },
        { layer: 'L2', buyer: 'VP Fleet Technology, Telematics Director', user: 'Fleet technicians, telematics analysts, ELD administrators', painPoints: 'ELD compliance, real-time visibility, systems integration' },
        { layer: 'L1', buyer: 'VP Maintenance, Fleet Engineering Director', user: 'Fleet maintenance techs, warranty analysts, parts managers', painPoints: 'Unplanned breakdowns, parts inventory, CSA scores' },
        { layer: 'L0', buyer: 'VP Fleet Procurement, Asset Management Director', user: 'Fleet buyers, spec engineers, remarketing managers', painPoints: 'Vehicle acquisition costs, lifecycle optimization, residual values' },
        { layer: 'L-1', buyer: 'VP HR, Safety Director, Driver Recruiting Lead', user: 'Driver managers, recruiters, safety trainers', painPoints: 'Driver shortage, turnover rates, Hours of Service management' },
      ],
      salesMotion: {
        topDown: {
          title: 'Top-Down Sales (L4-L6)',
          entry: 'CDO or VP Operations with network optimization mandate',
          champion: 'Regional VP with service or cost targets',
          cycle: '6-12 months, phased network rollout',
          proof: 'Single lane or terminal with measurable efficiency gains'
        },
        bottomUp: {
          title: 'Bottom-Up Sales (L1-L3)',
          entry: 'Fleet Maintenance Director with breakdown concerns',
          champion: 'Terminal manager seeking throughput improvement',
          cycle: '2-6 months, facility or fleet segment expansion',
          proof: 'Reduced roadside breakdowns or dock turnaround time'
        }
      }
    },
    maritime: {
      name: 'Maritime Transport',
      subtitle: 'Container Shipping, Bulk, Tankers, Ports',
      overview: [
        'Maritime transport moves 90% of global trade across oceans via container ships, bulk carriers, and tankers, supported by a global network of ports and terminals. AI transformation targets voyage optimization, predictive maintenance for main engines and critical equipment, port operations efficiency, and emissions reduction under IMO regulations. The industry is highly consolidated at the carrier level but fragmented across charterers, ports, and service providers.',
        'Decarbonization pressure is intense, with IMO 2030/2050 targets driving interest in voyage optimization, alternative fuels, and wind-assisted propulsion. Major carriers like Maersk and MSC invest in digital platforms, while ports race to automate terminal operations. Key challenges include data sharing across fragmented stakeholders, connectivity at sea, and the long asset lifecycles (25-30 years) that slow fleet renewal. Voyage optimization alone can deliver 5-15% fuel savings, making it an attractive entry point.'
      ],
      disruptionUseCases: [
        { title: 'AI Voyage Optimization', description: 'Continuous speed and route optimization considering weather, currents, port schedules, and fuel costs. 5-15% fuel savings potential.', layers: ['L3', 'L6', 'L5'], impact: 'High' },
        { title: 'Ocean & Weather Foundation Models', description: 'AI models predicting ocean conditions at higher resolution than traditional NWP. Enable more accurate routing decisions.', layers: ['L6', 'L3'], impact: 'High' },
        { title: 'Predictive Maintenance at Sea', description: 'Sensor fusion for main engine, auxiliary systems, and hull performance. Critical given limited repair options at sea.', layers: ['L1', 'L3'], impact: 'High' },
        { title: 'Autonomous Ship Operations', description: 'Remote monitoring centers with AI-assisted decision support. Path toward reduced manning and eventually autonomous vessels.', layers: ['L3', 'L2', 'L-1'], impact: 'Transformational' },
        { title: 'Port & Terminal Automation', description: 'AI-optimized container yard management, berth allocation, and crane operations. Automated stacking cranes and AGVs.', layers: ['L3', 'L0', 'L2'], impact: 'High' },
        { title: 'Emissions Monitoring & CII Optimization', description: 'Real-time tracking of Carbon Intensity Indicator (CII) and voyage-level emissions. Optimize for regulatory compliance.', layers: ['L4', 'L3', 'L6'], impact: 'Medium' },
        { title: 'Supply Chain Visibility', description: 'AI-powered container tracking, ETA prediction, and exception management across ocean, port, and inland legs.', layers: ['L5', 'L4', 'L3'], impact: 'Medium' },
      ],
      buyers: [
        { layer: 'L6', buyer: 'Chief Digital Officer, VP Fleet Performance, Head of Analytics', user: 'Performance analysts, weather routing specialists, data scientists', painPoints: 'Weather prediction accuracy, model interpretability, fleet-wide insights' },
        { layer: 'L5', buyer: 'VP Commercial, Chartering Director, Operations VP', user: 'Charterers, operations planners, bunker buyers', painPoints: 'Voyage profitability, bunker procurement, port congestion' },
        { layer: 'L4', buyer: 'CFO, CIO, Fleet Director', user: 'Fleet controllers, voyage accountants, IT managers', painPoints: 'Voyage costing, noon report accuracy, systems integration' },
        { layer: 'L3', buyer: 'VP Marine Operations, Fleet Manager, Port Captain', user: 'Ship masters, chief engineers, port coordinators', painPoints: 'ETA accuracy, port turnaround, cargo operations efficiency' },
        { layer: 'L2', buyer: 'VP Technical, Fleet Technology Director', user: 'Marine superintendents, VSAT coordinators, automation engineers', painPoints: 'Shipboard connectivity, alarm management, bridge system integration' },
        { layer: 'L1', buyer: 'VP Technical, Fleet Maintenance Director, Class Manager', user: 'Technical superintendents, planned maintenance coordinators, inspectors', painPoints: 'Main engine reliability, condition monitoring, dry dock planning' },
        { layer: 'L0', buyer: 'VP Newbuilding, Fleet Renewal Director, Naval Architect', user: 'Newbuilding managers, specification engineers, project managers', painPoints: 'Newbuilding costs, fuel flexibility, retrofit decisions' },
        { layer: 'L-1', buyer: 'VP Crewing, Marine HR Director, Training Manager', user: 'Crewing managers, training coordinators, manning agents', painPoints: 'Seafarer availability, competency management, fatigue monitoring' },
      ],
      salesMotion: {
        topDown: {
          title: 'Top-Down Sales (L4-L6)',
          entry: 'CDO or Fleet Director with decarbonization mandate',
          champion: 'VP Commercial with voyage profitability focus',
          cycle: '6-12 months, fleet segment rollout',
          proof: 'Single vessel type showing fuel savings and ETA improvement'
        },
        bottomUp: {
          title: 'Bottom-Up Sales (L1-L3)',
          entry: 'Technical Superintendent with engine reliability concerns',
          champion: 'Fleet Manager seeking voyage efficiency',
          cycle: '3-6 months, vessel class expansion',
          proof: 'Avoided off-hire or measurable fuel reduction on trial vessels'
        }
      }
    },
    datacenters: {
      name: 'Data Centers',
      subtitle: 'Hyperscale, Colocation, Enterprise',
      overview: [
        'Data centers house the computing infrastructure powering the digital economy, from hyperscale facilities operated by AWS, Google, and Microsoft to colocation providers and enterprise data centers. AI transformation targets power usage effectiveness (PUE) optimization, predictive maintenance for cooling and power systems, capacity planning, and increasingly AI workload optimization. The sector is experiencing explosive growth driven by AI/ML compute demands.',
        'Hyperscalers operate at a different level of sophistication than colocation or enterprise facilities, with custom cooling systems, AI-designed chip layouts, and autonomous operations as aspirational goals. Key challenges include power availability constraints, water usage for cooling, and the rapid obsolescence of hardware. The irony is not lost that AI infrastructure is the fastest-growing energy consumer while AI is simultaneously the best tool for optimizing data center efficiency.'
      ],
      disruptionUseCases: [
        { title: 'AI-Optimized Cooling & PUE', description: 'ML models controlling cooling systems in real-time. Google DeepMind achieved 40% reduction in cooling energy. Now table stakes for efficiency.', layers: ['L2', 'L3', 'L6'], impact: 'High' },
        { title: 'Predictive Maintenance for Critical Systems', description: 'AI monitoring of UPS, generators, CRAC units, and switchgear. Predict failures before they cause outages.', layers: ['L1', 'L3'], impact: 'High' },
        { title: 'AI Workload Placement & Scheduling', description: 'Intelligent placement of AI training and inference jobs to optimize GPU utilization, power consumption, and thermal balance.', layers: ['L3', 'L4', 'L6'], impact: 'High' },
        { title: 'Capacity Planning & Demand Forecasting', description: 'ML models predicting compute demand and optimizing capacity investments. Critical given long lead times for power and equipment.', layers: ['L4', 'L5', 'L6'], impact: 'Medium' },
        { title: 'Autonomous Operations', description: 'Self-healing infrastructure with automated incident response, change execution, and capacity rebalancing. Reduce NOC staffing.', layers: ['L3', 'L2', 'L-1'], impact: 'Transformational' },
        { title: 'Sustainable Design & Operations', description: 'AI for water usage optimization, renewable energy integration, and carbon footprint tracking. Address ESG requirements.', layers: ['L0', 'L4', 'L2'], impact: 'Medium' },
        { title: 'Digital Twin for Design & Operations', description: 'Physics-informed models of airflow, thermal behavior, and power distribution. Optimize designs and troubleshoot hot spots.', layers: ['L6', 'L0', 'L3'], impact: 'Medium' },
      ],
      buyers: [
        { layer: 'L6', buyer: 'Chief Technology Officer, VP Infrastructure, Head of AI/ML Platform', user: 'ML platform engineers, capacity planners, performance engineers', painPoints: 'GPU utilization, training job scheduling, inference cost optimization' },
        { layer: 'L5', buyer: 'VP Supply Chain, Procurement Director', user: 'Hardware procurement, vendor managers, logistics coordinators', painPoints: 'GPU/chip allocation, server lead times, supply constraints' },
        { layer: 'L4', buyer: 'CFO, VP Finance, Capacity Planning Director', user: 'Financial analysts, capacity planners, cost accountants', painPoints: 'TCO modeling, power cost allocation, stranded capacity' },
        { layer: 'L3', buyer: 'VP Data Center Operations, Site Director', user: 'NOC operators, DCO engineers, change managers', painPoints: 'Incident response, capacity hot spots, workload placement' },
        { layer: 'L2', buyer: 'VP Critical Infrastructure, Controls Engineering Lead', user: 'BMS/DCIM administrators, controls engineers, monitoring specialists', painPoints: 'PUE optimization, alarm fatigue, system integration' },
        { layer: 'L1', buyer: 'VP Facilities, Critical Systems Director', user: 'Facilities technicians, UPS/generator techs, HVAC specialists', painPoints: 'Equipment reliability, predictive vs reactive maintenance, spare parts' },
        { layer: 'L0', buyer: 'VP Construction, Development Director, Design Engineering Lead', user: 'Project managers, MEP engineers, commissioning agents', painPoints: 'Speed to deployment, power density evolution, cooling innovation' },
        { layer: 'L-1', buyer: 'VP HR, Operations Director', user: 'Shift supervisors, training coordinators, staffing managers', painPoints: 'Specialized skills shortage, shift coverage, remote site staffing' },
      ],
      salesMotion: {
        topDown: {
          title: 'Top-Down Sales (L4-L6)',
          entry: 'CTO or VP Infrastructure with efficiency or AI platform mandate',
          champion: 'Capacity Planning Director with utilization targets',
          cycle: '3-9 months, faster than traditional industrial',
          proof: 'Single facility or workload type with measurable PUE or utilization improvement'
        },
        bottomUp: {
          title: 'Bottom-Up Sales (L1-L3)',
          entry: 'Facilities Director with cooling or power concerns',
          champion: 'DCO engineer seeking operational efficiency',
          cycle: '1-4 months, rapid pilot to production',
          proof: 'PUE improvement or avoided thermal throttling incidents'
        }
      }
    }
  };

  // ============================================
  // LAYER TAXONOMY DATA
  // ============================================

  const layerTaxonomy = {
    'L6': {
      name: 'Intelligence',
      fullName: 'Intelligence Layer',
      theme: 'The Decision War',
      description: 'The cognitive layer where decisions are made: Traditional methods (physics models, statistical analysis, expert judgment) vs AI-powered intelligence (foundation models, machine learning, deep learning). This is where data becomes action.',
      overview: [
        'The Intelligence Layer represents the highest level of abstraction in industrial operations–where data is transformed into decisions. For decades, this layer was dominated by three pillars: first-principles physics models (CFD, thermodynamic simulators), statistical methods (SPC, regression, ARIMA), and human expert judgment built from years of experience. These approaches are interpretable, validated, and trusted–but brittle, slow to adapt, and unable to exploit the flood of operational data.',
        'The strategic battle is not primarily between different AI vendors (GPT vs Claude vs Gemini)–it\'s between the entire traditional decision-making paradigm and the AI paradigm. The key tensions are: explainability (physics models are interpretable; neural networks are black boxes), validation (how do you certify an AI for safety-critical decisions?), and trust (will engineers accept AI recommendations over their own judgment?). Industries that solve these tensions first will gain decisive competitive advantage.'
      ],
      taxonomy: {
        title: 'Traditional Intelligence vs AI Intelligence',
        categories: [
          {
            name: 'Physics & Simulation',
            traditional: 'First-principles CFD, FEA, thermodynamic models (ANSYS, COMSOL). Months to build, days to run. Highly interpretable but slow.',
            modern: 'Physics-informed neural networks, neural surrogates. Learn physics from simulation + operational data. 100-1000x faster inference.',
            examples: ['ANSYS → NVIDIA Modulus', 'COMSOL → PhysicsX', 'In-house models → Siemens HEEDS AI']
          },
          {
            name: 'Forecasting & Prediction',
            traditional: 'ARIMA, exponential smoothing, regression models. Hand-tuned per use case. Limited to univariate or simple multivariate.',
            modern: 'Time-series foundation models, deep learning forecasters. Pre-trained, transfer across domains. Handle complex multivariate patterns.',
            examples: ['Excel forecasts → Google TimesFM', 'SAS → Amazon Chronos', 'Custom ARIMA → Nixtla TimeGPT']
          },
          {
            name: 'Quality & Inspection',
            traditional: 'Statistical Process Control (SPC), rule-based machine vision, sampling plans, human inspectors.',
            modern: 'Deep learning vision, zero-shot anomaly detection, 100% automated inspection, predictive quality.',
            examples: ['Manual inspection → Cognex ViDi', 'Rule-based AOI → Landing AI', 'SPC → Instrumental']
          },
          {
            name: 'Anomaly Detection',
            traditional: 'Threshold-based alarms, control charts, expert pattern recognition. High false positive rates.',
            modern: 'Multi-modal sensor fusion, unsupervised learning, contextual anomaly detection. AI learns normal behavior.',
            examples: ['Alarm flooding → Augury', 'Manual analysis → Uptake', 'Thresholds → SparkCognition']
          },
          {
            name: 'Optimization & Scheduling',
            traditional: 'Linear programming, mixed-integer solvers, heuristics, rules-based scheduling. Optimal for defined constraints.',
            modern: 'Reinforcement learning, AI-enhanced optimization, continuous re-optimization. Adapts to changing conditions.',
            examples: ['Static MRP → o9 Solutions', 'Manual scheduling → Google OR-Tools + AI', 'Heuristics → Gurobi ML']
          },
          {
            name: 'Expert Knowledge',
            traditional: 'Tribal knowledge, expert systems, decision trees, SOPs. Resides in experienced workers\' heads.',
            modern: 'LLMs trained on domain knowledge, AI copilots, knowledge graphs. Captures and scales expertise.',
            examples: ['Tribal knowledge → Claude/GPT fine-tuned', 'Expert systems → Palantir AIP', 'SOPs → AI assistants']
          },
          {
            name: 'Scientific Discovery',
            traditional: 'Wet lab experimentation, QSAR models, molecular dynamics, trial-and-error. Years per discovery.',
            modern: 'Foundation models for molecules, proteins, materials. AI-guided experimentation. 10-100x acceleration.',
            examples: ['Lab experiments → AlphaFold', 'QSAR → EvolutionaryScale ESM3', 'Trial & error → Isomorphic Labs']
          }
        ]
      },
      transition: {
        from: 'First-principles models, statistical methods, and human expert judgment. Each model hand-built for specific use case. Interpretable and trusted but slow, brittle, and unable to learn from data.',
        to: 'AI-powered intelligence that learns from operational data. Foundation models provide transfer learning. Continuous improvement. But requires solving explainability, validation, and trust challenges.',
        keyShift: 'From "model the physics" to "learn from the data"'
      }
    },
    'L5': {
      name: 'Supply Chain',
      fullName: 'Supply Chain Layer',
      theme: 'The Network War',
      description: 'The coordination layer spanning multiple enterprises: procurement, logistics, inventory planning, and demand sensing across the extended value chain. This layer connects suppliers, manufacturers, distributors, and customers into networked ecosystems.',
      overview: [
        'The Supply Chain Layer orchestrates the flow of materials, information, and value across organizational boundaries. Traditionally, each company optimized its own operations in isolation, creating bullwhip effects and blind spots. AI enables multi-tier visibility, demand sensing from downstream signals, and network-wide optimization.',
        'The strategic battle pits legacy ERP-centric supply chain modules against cloud-native supply chain platforms and emerging AI-powered control towers. The prize is becoming the "network orchestrator" that sees demand signals before competitors and optimizes across the entire value chain.'
      ],
      taxonomy: {
        title: 'Types of Supply Chain Systems',
        categories: [
          {
            name: 'Demand Planning & Forecasting',
            traditional: 'Excel-based forecasts, ERP statistical forecasting modules',
            modern: 'AI demand sensing from POS, weather, social signals; ML forecasting',
            examples: ['Blue Yonder', 'o9 Solutions', 'Kinaxis', 'SAP IBP']
          },
          {
            name: 'Supply Chain Planning (SCP)',
            traditional: 'Batch MRP/DRP runs, monthly S&OP cycles',
            modern: 'Continuous planning, concurrent optimization, scenario simulation',
            examples: ['Kinaxis RapidResponse', 'Blue Yonder Luminate', 'o9 Digital Brain']
          },
          {
            name: 'Transportation Management (TMS)',
            traditional: 'Manual load planning, static routing, phone/fax dispatch',
            modern: 'AI route optimization, real-time replanning, dynamic pricing',
            examples: ['project44', 'FourKites', 'Transporeon', 'Blue Yonder TMS']
          },
          {
            name: 'Warehouse Management (WMS)',
            traditional: 'Paper pick lists, fixed slotting, basic RF scanning',
            modern: 'AI slotting optimization, robotic orchestration, vision-guided picking',
            examples: ['Manhattan Associates', 'Blue Yonder WMS', 'Körber', 'SAP EWM']
          },
          {
            name: 'Procurement & Sourcing',
            traditional: 'RFQ spreadsheets, annual supplier reviews, manual spend analysis',
            modern: 'AI spend analytics, supplier risk monitoring, autonomous sourcing',
            examples: ['Coupa', 'Jaggaer', 'SAP Ariba', 'GEP']
          },
          {
            name: 'Control Towers & Visibility',
            traditional: 'EDI-based tracking, carrier portals, manual exception handling',
            modern: 'Real-time multi-tier visibility, predictive ETAs, AI exception management',
            examples: ['project44', 'FourKites', 'Overhaul', 'Tive']
          }
        ]
      },
      transition: {
        from: 'Siloed planning within enterprise boundaries. Monthly batch planning cycles. Reactive exception management. Limited visibility beyond tier-1 suppliers.',
        to: 'Network-wide visibility and optimization. Continuous planning with real-time signals. Predictive disruption management. AI-powered demand sensing and autonomous response.',
        keyShift: 'From "plan and execute" to "sense and respond"'
      }
    },
    'L4': {
      name: 'Enterprise',
      fullName: 'Enterprise Systems Layer',
      theme: 'The Data Lake War',
      description: 'The business system layer where operational data becomes business information: ERP, financial systems, quality management, enterprise analytics, and the data platforms that integrate them all.',
      overview: [
        'The Enterprise Layer translates shop-floor operations into business metrics–cost per unit, inventory value, compliance status, and financial performance. Legacy ERP systems (SAP, Oracle) own transactional data but struggle with real-time analytics and AI integration.',
        'The strategic battle is between incumbent ERP vendors extending into analytics and AI versus cloud-native data platforms (Snowflake, Databricks) and operational platforms (Palantir, C3.ai) that promise to become the new system of record. Who owns the enterprise data model wins.'
      ],
      taxonomy: {
        title: 'Types of Enterprise Systems',
        categories: [
          {
            name: 'ERP Systems',
            traditional: 'On-premise ERP, batch processing, monolithic architecture',
            modern: 'Cloud ERP, real-time transactions, modular/composable architecture',
            examples: ['SAP S/4HANA', 'Oracle Cloud', 'Microsoft Dynamics', 'Infor CloudSuite']
          },
          {
            name: 'Manufacturing Execution (MES)',
            traditional: 'On-premise MES, paper-based tracking, batch data collection',
            modern: 'Cloud MES, real-time genealogy, integrated quality, AI-ready',
            examples: ['Rockwell Plex', 'Siemens Opcenter', 'DELMIA', 'Tulip']
          },
          {
            name: 'Quality Management (QMS)',
            traditional: 'Paper-based quality records, reactive CAPA, manual audits',
            modern: 'Digital QMS, predictive quality, AI-powered CAPA, real-time SPC',
            examples: ['Veeva Vault', 'MasterControl', 'ETQ Reliance', 'Sparta TrackWise']
          },
          {
            name: 'Enterprise Data Platforms',
            traditional: 'On-premise data warehouses, ETL batch jobs, BI reports',
            modern: 'Cloud data lakes, real-time streaming, ML feature stores',
            examples: ['Snowflake', 'Databricks', 'Google BigQuery', 'AWS Redshift']
          },
          {
            name: 'Operational Intelligence Platforms',
            traditional: 'Custom dashboards, Excel analysis, siloed reporting',
            modern: 'AI-powered operational platforms, ontology-based integration, decisioning',
            examples: ['Palantir Foundry', 'C3.ai', 'Seeq', 'Sight Machine']
          },
          {
            name: 'Asset Performance Management (APM)',
            traditional: 'CMMS for work orders, time-based maintenance schedules',
            modern: 'AI-powered APM, predictive maintenance, asset health scoring',
            examples: ['IBM Maximo', 'SAP APM', 'GE APM', 'Bentley AssetWise']
          }
        ]
      },
      transition: {
        from: 'ERP as system of record. Batch data processing. Siloed analytics. IT-controlled, slow to change. Weeks/months for new reports.',
        to: 'Data platform as analytical system of record. Real-time streaming. Unified operational analytics. Business-controlled, self-service. AI-generated insights.',
        keyShift: 'From "ERP owns data" to "data platform enables AI"'
      }
    },
    'L3': {
      name: 'Operations',
      fullName: 'Operations Layer',
      theme: 'The Machine Brain War',
      description: 'The execution layer where production happens: scheduling, batch management, quality control, recipe execution, and real-time operational decisions. This is where plans become products.',
      overview: [
        'The Operations Layer is the "machine brain" that coordinates production–sequencing jobs, managing recipes, controlling quality, and responding to real-time events. Traditional MES and SCADA systems provide rigid, rules-based control validated for compliance.',
        'The strategic battle is between established MES vendors defending their validated workflows versus AI-native platforms promising adaptive optimization. The challenge is proving AI can be trusted in compliance-critical environments where a wrong decision has physical consequences.'
      ],
      taxonomy: {
        title: 'Types of Operations Systems',
        categories: [
          {
            name: 'Production Scheduling',
            traditional: 'Weekly MRP explosion, static schedules, manual sequencing',
            modern: 'AI-optimized scheduling, real-time replanning, constraint-based',
            examples: ['Siemens Opcenter APS', 'DELMIA Ortems', 'Asprova', 'PlanetTogether']
          },
          {
            name: 'Batch/Recipe Management',
            traditional: 'Fixed recipes in DCS, manual parameter entry, paper batch records',
            modern: 'Adaptive recipes, AI-optimized parameters, electronic batch records',
            examples: ['Emerson DeltaV Batch', 'Rockwell FactoryTalk Batch', 'Siemens SIMATIC']
          },
          {
            name: 'Quality Execution',
            traditional: 'End-of-line inspection, lab sampling, reactive SPC',
            modern: 'In-line AI inspection, real-time SPC, predictive quality',
            examples: ['Hexagon Q-DAS', 'InfinityQS', 'Sight Machine', 'Instrumental']
          },
          {
            name: 'OEE & Performance Management',
            traditional: 'Manual OEE calculation, shift reports, Excel analysis',
            modern: 'Real-time OEE, AI-identified loss drivers, automated root cause',
            examples: ['Sight Machine', 'Rockwell Plex', 'Tulip', 'MachineMetrics']
          },
          {
            name: 'SCADA / HMI',
            traditional: 'Proprietary SCADA, static screens, alarm flooding',
            modern: 'Web-based HMI, situational awareness displays, AI-prioritized alarms',
            examples: ['Inductive Automation Ignition', 'AVEVA System Platform', 'GE iFIX']
          },
          {
            name: 'Digital Work Instructions',
            traditional: 'Paper SOPs, tribal knowledge, static training',
            modern: 'Interactive digital instructions, AR guidance, AI-assisted troubleshooting',
            examples: ['Tulip', 'Poka', 'Dozuki', 'PTC Vuforia']
          }
        ]
      },
      transition: {
        from: 'Rigid MES workflows validated once and rarely changed. Rules-based decisions. Human operators interpret exceptions. Batch optimization by experienced engineers.',
        to: 'Adaptive AI agents that optimize in real-time within validated guardrails. Automated exception handling. Continuous optimization. AI copilots augmenting operators.',
        keyShift: 'From "follow the recipe" to "optimize within constraints"'
      }
    },
    'L2': {
      name: 'Control',
      fullName: 'Control Layer',
      theme: 'The Edge War',
      description: 'The real-time control layer executing millisecond-level control loops: PLCs, DCS, motion controllers, robotics controllers, and edge computing platforms that bridge IT and OT.',
      overview: [
        'The Control Layer is where digital commands become physical actions–valves open, motors spin, robots move. Traditional PLCs and DCS systems from Siemens, Rockwell, ABB, and Honeywell execute deterministic control loops with guaranteed response times.',
        'The strategic battle is between proprietary, hardware-centric control vendors and software-defined approaches. Edge computing enables AI inference at the control layer, but safety certification and OT cybersecurity create barriers to disruption.'
      ],
      taxonomy: {
        title: 'Types of Control Hardware & Software',
        categories: [
          {
            name: 'Programmable Logic Controllers (PLC)',
            traditional: 'Proprietary PLCs, ladder logic, vendor-locked programming',
            modern: 'Soft PLCs, IEC 61131-3 standard, virtualized control',
            examples: ['Siemens S7', 'Rockwell ControlLogix', 'ABB AC500', 'Schneider Modicon']
          },
          {
            name: 'Distributed Control Systems (DCS)',
            traditional: 'Monolithic DCS, proprietary protocols, 15-20 year lifecycles',
            modern: 'Open DCS, Ethernet-based, cloud-connected, software-upgradable',
            examples: ['Emerson DeltaV', 'Honeywell Experion', 'ABB 800xA', 'Yokogawa CENTUM']
          },
          {
            name: 'Motion & Robotics Controllers',
            traditional: 'Proprietary robot controllers, teach pendant programming',
            modern: 'Universal robot platforms, AI-powered motion, cloud-connected',
            examples: ['Fanuc', 'KUKA', 'ABB Robotics', 'Universal Robots', 'Rockwell Kinetix']
          },
          {
            name: 'Edge Computing Platforms',
            traditional: 'No edge layer–direct PLC/DCS to enterprise',
            modern: 'Industrial edge devices running AI inference, data preprocessing',
            examples: ['AWS Outposts', 'Azure Stack Edge', 'Siemens Industrial Edge', 'NVIDIA Jetson']
          },
          {
            name: 'Industrial Networks',
            traditional: 'Proprietary fieldbus (Profibus, DeviceNet), isolated networks',
            modern: 'Industrial Ethernet (Profinet, EtherNet/IP), IT/OT convergence, TSN',
            examples: ['Cisco Industrial', 'Moxa', 'Hirschmann', 'Belden']
          },
          {
            name: 'Safety Systems',
            traditional: 'Hardwired safety relays, separate safety PLCs',
            modern: 'Integrated safety PLCs (SIL-rated), safety over Ethernet',
            examples: ['Rockwell GuardLogix', 'Siemens S7 F-Series', 'ABB Safety PLC']
          }
        ]
      },
      transition: {
        from: 'Proprietary, hardware-defined control. Isolated OT networks. 15-20 year upgrade cycles. Limited connectivity to enterprise systems. Safety and control tightly coupled.',
        to: 'Software-defined control with hardware abstraction. IT/OT convergence. Edge AI inference. Continuous software updates. Cloud-connected while maintaining safety isolation.',
        keyShift: 'From "buy hardware, get software" to "software-defined, hardware-agnostic"'
      }
    },
    'L1': {
      name: 'Sensing',
      fullName: 'Sensing Layer',
      theme: 'The Sensing War',
      description: 'The perception layer that converts physical reality into digital signals: sensors, instrumentation, machine vision, vibration analysis, and all systems that measure the physical world.',
      overview: [
        'The Sensing Layer is the nervous system of industrial operations–capturing temperature, pressure, flow, vibration, images, and countless other signals that represent physical reality. Traditional sensors provide single-point measurements; AI-enabled sensing fuses multiple modalities.',
        'The strategic battle is between established instrumentation vendors (Emerson, Endress+Hauser, Honeywell) defending their installed base versus AI-native sensing companies (Augury, Uptake) and computer vision specialists. The prize is owning the data that feeds all upstream intelligence.'
      ],
      taxonomy: {
        title: 'Types of Sensing Technologies',
        categories: [
          {
            name: 'Process Instrumentation',
            traditional: 'Analog 4-20mA sensors, periodic calibration, single-variable',
            modern: 'Smart sensors with diagnostics, digital protocols (HART, Foundation Fieldbus)',
            examples: ['Emerson Rosemount', 'Endress+Hauser', 'Siemens', 'Honeywell']
          },
          {
            name: 'Vibration & Condition Monitoring',
            traditional: 'Portable vibration analyzers, periodic routes, manual analysis',
            modern: 'Continuous wireless monitoring, AI-powered diagnostics, PdM platforms',
            examples: ['Augury', 'SKF', 'Emerson AMS', 'Pruftechnik', 'Bently Nevada']
          },
          {
            name: 'Machine Vision Systems',
            traditional: 'Rule-based AOI, template matching, lighting-sensitive',
            modern: 'Deep learning vision, zero-shot defect detection, multi-spectral',
            examples: ['Cognex', 'Keyence', 'Landing AI', 'Instrumental', 'Elementary']
          },
          {
            name: 'Thermal & Infrared',
            traditional: 'Handheld thermal cameras, periodic inspections',
            modern: 'Continuous thermal monitoring, AI hotspot detection, drone-mounted',
            examples: ['FLIR', 'InfraTec', 'Teledyne', 'DJI Thermal']
          },
          {
            name: 'Acoustic & Ultrasonic',
            traditional: 'Handheld leak detectors, periodic surveys',
            modern: 'Continuous acoustic monitoring, AI-powered leak detection, steam trap analysis',
            examples: ['Acoustic monitoring systems', 'FLIR acoustic imagers', 'SDT Ultrasound']
          },
          {
            name: 'Position & Metrology',
            traditional: 'CMM measurement (offline), manual gauging, sampling inspection',
            modern: 'In-line laser scanning, real-time CMM, 100% inspection',
            examples: ['Hexagon', 'Zeiss', 'Keyence', 'GOM (Zeiss)', 'FARO']
          },
          {
            name: 'Environmental & Emissions',
            traditional: 'CEMS point monitoring, periodic stack testing',
            modern: 'Continuous emissions monitoring, satellite methane detection, fence-line',
            examples: ['Honeywell Gas Detection', 'GHGSat', 'Permian MAP', 'Project Canary']
          }
        ]
      },
      transition: {
        from: 'Single-point sensors, periodic manual readings, reactive maintenance. Islands of sensing data not integrated. Human interpretation of measurements.',
        to: 'Dense sensor networks, continuous monitoring, AI-powered analytics. Multi-modal sensor fusion. Automated anomaly detection and diagnostics. Sensing as foundation for AI.',
        keyShift: 'From "measure and react" to "sense, fuse, and predict"'
      }
    },
    'L0': {
      name: 'Physics',
      fullName: 'Physical Assets Layer',
      theme: 'The Asset War',
      description: 'The physical layer of production equipment, robots, vehicles, and infrastructure–the actual machines that transform materials and move goods. This is where bits meet atoms.',
      overview: [
        'The Physical Assets Layer represents the tangible capital that makes industry work–reactors, conveyors, robots, trucks, pumps, and buildings. These assets have 20-50 year lifecycles, creating massive installed bases that constrain the pace of digital transformation.',
        'The strategic battle is between OEMs seeking software revenue from connected equipment versus operators wanting vendor-agnostic flexibility. The brownfield challenge–modernizing existing assets–vastly outweighs greenfield opportunities.'
      ],
      taxonomy: {
        title: 'Types of Physical Assets',
        categories: [
          {
            name: 'Production Equipment',
            traditional: 'Standalone machines, manual operation, limited connectivity',
            modern: 'Connected machines, OEM digital twins, remote diagnostics',
            examples: ['CNC machines', 'Injection molders', 'Packaging lines', 'Reactors', 'Furnaces']
          },
          {
            name: 'Industrial Robots',
            traditional: 'Fixed automation, caged robots, teach pendant programming',
            modern: 'Collaborative robots, AI-enabled manipulation, cloud-connected',
            examples: ['Fanuc', 'KUKA', 'ABB', 'Universal Robots', 'Boston Dynamics Stretch']
          },
          {
            name: 'Mobile Equipment',
            traditional: 'Manually operated forklifts, trucks, mobile equipment',
            modern: 'Autonomous mobile robots (AMRs), autonomous trucks, telematics-equipped',
            examples: ['Toyota forklifts', 'Cat mining trucks', 'Locus AMRs', 'Aurora trucks']
          },
          {
            name: 'Process Equipment',
            traditional: 'Reactors, columns, heat exchangers designed for 30+ year life',
            modern: 'Modular process equipment, skid-mounted systems, intensified processes',
            examples: ['Vessels', 'Distillation columns', 'Heat exchangers', 'Centrifuges']
          },
          {
            name: 'Rotating Equipment',
            traditional: 'Pumps, compressors, motors with periodic maintenance',
            modern: 'Smart pumps with embedded sensors, variable speed drives, PdM-ready',
            examples: ['Flowserve', 'Sulzer', 'Grundfos', 'Atlas Copco', 'Siemens motors']
          },
          {
            name: 'Infrastructure',
            traditional: 'Passive infrastructure–buildings, utilities, roads',
            modern: 'Smart buildings, connected infrastructure, digital twins',
            examples: ['HVAC systems', 'Electrical distribution', 'Piping networks', 'Storage']
          }
        ]
      },
      transition: {
        from: 'Standalone assets operated independently. OEM service relationships. Time-based maintenance. Limited visibility into asset performance. Long replacement cycles.',
        to: 'Connected assets with embedded intelligence. Continuous performance monitoring. Condition-based maintenance. OEM digital twins and remote support. Retrofit IoT for brownfield.',
        keyShift: 'From "run to failure" to "intelligent asset lifecycle management"'
      }
    },
    'L-1': {
      name: 'Labor',
      fullName: 'Labor & Workforce Layer',
      theme: 'The Skill War',
      description: 'The human layer encompassing operators, technicians, engineers, and all workers who design, run, and maintain industrial operations. AI transforms how work is done and what skills are needed.',
      overview: [
        'The Labor Layer represents the human capital that makes industry work–from shop-floor operators to control room technicians to maintenance crews. This workforce faces a demographic crisis as experienced workers retire faster than new talent enters, taking decades of tribal knowledge with them.',
        'The strategic battle is between augmentation (AI copilots that enhance human capabilities) and automation (robots and autonomous systems that replace human labor). Most realistic paths involve hybrid approaches where AI handles routine tasks while humans manage exceptions and oversight.'
      ],
      taxonomy: {
        title: 'Types of Industrial Roles',
        categories: [
          {
            name: 'Operators & Technicians',
            traditional: 'Manual machine operation, paper-based procedures, tribal knowledge',
            modern: 'AI-assisted operation, digital work instructions, AR guidance',
            examples: ['Machine operators', 'Process operators', 'Control room operators', 'Lab techs']
          },
          {
            name: 'Maintenance & Reliability',
            traditional: 'Time-based PM schedules, reactive repairs, paper work orders',
            modern: 'Condition-based maintenance, AI-prioritized work orders, AR-guided repair',
            examples: ['Maintenance techs', 'Reliability engineers', 'Instrument techs', 'Electricians']
          },
          {
            name: 'Quality & Inspection',
            traditional: 'Manual inspection, sampling plans, paper records',
            modern: 'AI-assisted inspection, automated measurement, digital quality records',
            examples: ['Quality inspectors', 'QC technicians', 'NDT specialists', 'CMM operators']
          },
          {
            name: 'Engineering & Technical',
            traditional: 'CAD/CAE tools, manual analysis, experience-based design',
            modern: 'AI-assisted design, generative engineering, simulation copilots',
            examples: ['Process engineers', 'Controls engineers', 'Manufacturing engineers', 'Designers']
          },
          {
            name: 'Supervision & Management',
            traditional: 'Manual scheduling, clipboard management, gut-feel decisions',
            modern: 'AI-optimized scheduling, real-time dashboards, data-driven decisions',
            examples: ['Shift supervisors', 'Production managers', 'Plant managers', 'Operations directors']
          },
          {
            name: 'Field Service & Support',
            traditional: 'On-site troubleshooting, manual diagnostics, experience-dependent',
            modern: 'Remote diagnostics, AI-guided troubleshooting, predictive dispatch',
            examples: ['Field service techs', 'Commissioning engineers', 'Service managers']
          }
        ]
      },
      transition: {
        from: 'Experience-dependent expertise. Paper procedures and tribal knowledge. High training costs and long learning curves. Skilled labor shortages in remote locations.',
        to: 'AI-augmented workers with digital assistants. Captured and codified expertise. Accelerated training through simulation and AR. Remote expert support. Human-robot collaboration.',
        keyShift: 'From "decades to develop expertise" to "AI-accelerated competency"'
      }
    }
  };

  // ============================================
  // STRATEGIES DATA
  // ============================================

  // ============================================
  // STRATEGIES - TWO-TIER FRAMEWORK
  // ============================================

  // TIER 1: Primary Business Models (pick one)
  const businessModels = {
    platform: {
      id: 'platform',
      name: 'Platform',
      tagline: 'Sell AI/software directly to industrial customers',
      icon: '🖥️',
      color: 'bg-blue-100 border-blue-400',
      colorDark: 'bg-blue-600',
      definition: 'Build and sell AI-powered software directly to industrial end customers. Revenue from subscriptions, licenses, or usage-based pricing.',
      thesis: [
        'Industrial customers will pay for software that solves real operational problems',
        'AI/ML creates differentiation that legacy software vendors struggle to match',
        'Land with one use case, expand to become system of record',
        'Data from deployments creates compounding advantage',
      ],
      whenToChoose: [
        'You can deliver measurable ROI to end customers',
        'Sales motion can scale (not infinitely customized)',
        'Domain expertise or AI capability creates defensible differentiation',
        'Market is large enough to support direct sales/CS investment',
      ],
      layerFit: ['L6', 'L5', 'L4', 'L3', 'L-1'],
      examples: [
        { company: 'Palantir', description: 'Enterprise data + AI platform', modifiers: 'Horizontal, Software-only, Top-down' },
        { company: 'C3 AI', description: 'Pre-built industrial AI applications', modifiers: 'Horizontal, Software-only, Top-down' },
        { company: 'Samsara', description: 'Connected operations platform', modifiers: 'Started Vertical → Horizontal, Hardware-inclusive, Bottom-up' },
        { company: 'Procore', description: 'Construction management OS', modifiers: 'Vertical (Construction), Software-only, Top-down' },
      ],
      successFactors: [
        'Clear ROI story that resonates with buyers',
        'Product that can be deployed without heavy customization',
        'Sales motion that matches deal size (PLG, inside sales, or enterprise)',
        'Customer success that drives expansion and retention',
      ],
      risks: [
        'Long enterprise sales cycles in industrial markets',
        'Integration complexity with legacy systems',
        'Incumbents (SAP, Oracle, Siemens) have existing relationships',
        'AI commoditization may erode differentiation',
      ],
      capitalReq: '$15-50M',
      timeToRevenue: '6-18 months',
      moatDepth: 'Medium-High',
      executionRisk: 'Medium',
      moatCharacteristics: 'Workflow lock-in, proprietary data, integration depth, brand trust',
    },
    integratedProduct: {
      id: 'integratedProduct',
      name: 'Integrated Product',
      tagline: 'Sell hardware + software as unified product',
      icon: '🤖',
      color: 'bg-red-100 border-red-400',
      colorDark: 'bg-red-600',
      definition: 'Design and manufacture physical products with tightly integrated AI/software. Revenue from product sales, subscriptions, or outcome-based pricing.',
      thesis: [
        'Some capabilities require purpose-built hardware + software integration',
        'Vertical integration creates defensibility incumbents cannot easily replicate',
        'Hardware creates physical moat; software creates recurring revenue',
        'AI-native design enables 10x performance vs. retrofitted alternatives',
      ],
      whenToChoose: [
        'Capability requires hardware that doesn\'t exist or is inadequate',
        'Integration between HW and SW is the key differentiator',
        'You have hardware + software team under one roof',
        'Patient capital available for longer development cycles',
      ],
      layerFit: ['L0', 'L2', 'L1'],
      examples: [
        { company: 'Anduril', description: 'Defense drones, submarines, C2', modifiers: 'Vertical (Defense), Greenfield, Top-down' },
        { company: 'Figure', description: 'Humanoid robots', modifiers: 'Horizontal, Greenfield, Top-down' },
        { company: 'Zipline', description: 'Delivery drones', modifiers: 'Vertical (Healthcare/Logistics), Greenfield, Top-down' },
        { company: 'Reliable Robotics', description: 'Autonomous aircraft systems', modifiers: 'Vertical (Aviation), Greenfield, OEM/Embedded' },
      ],
      successFactors: [
        'Exceptional hardware + software engineering integration',
        'Manufacturing strategy (in-house, contract, Arsenal-style)',
        'Regulatory/certification pathway understood early',
        'Service/support model that scales with deployments',
      ],
      risks: [
        'Capital intensity ($50-200M+ to production)',
        'Hardware development delays and cost overruns',
        'Manufacturing scale-up challenges',
        'Certification timelines unpredictable',
      ],
      capitalReq: '$50-200M+',
      timeToRevenue: '24-48 months',
      moatDepth: 'Very High',
      executionRisk: 'Very High',
      moatCharacteristics: 'System integration, manufacturing know-how, certification, brand, installed base',
    },
    infrastructure: {
      id: 'infrastructure',
      name: 'Infrastructure',
      tagline: 'Sell tools and platforms to other builders',
      icon: '⛏️',
      color: 'bg-gray-100 border-gray-400',
      colorDark: 'bg-gray-600',
      definition: 'Build the infrastructure, tools, data platforms, or developer tools that other Physical AI companies need. Revenue from platform fees, usage, or subscriptions.',
      thesis: [
        'Whoever wins the application layer, they\'ll need your infrastructure',
        'Less competitive than application layer – more partners, fewer enemies',
        'Platform economics and ecosystem effects compound over time',
        'Durable businesses less subject to application-layer disruption',
      ],
      whenToChoose: [
        'Clear infrastructure gap that multiple companies need filled',
        'You can build a defensible platform (not easily replicated)',
        'Comfortable being "invisible" to end customers',
        'Developer/data experience is a core competency',
      ],
      layerFit: ['L4', 'L6', 'All layers - underlying'],
      examples: [
        { company: 'Cognite', description: 'Industrial data platform', modifiers: 'Horizontal, Software-only, Top-down' },
        { company: 'Scale AI', description: 'Data labeling & curation', modifiers: 'Horizontal, Software-only, Bottom-up' },
        { company: 'Databricks', description: 'Data + AI platform', modifiers: 'Horizontal, Software-only, Bottom-up → Top-down' },
        { company: 'Weights & Biases', description: 'MLOps platform', modifiers: 'Horizontal, Software-only, Bottom-up' },
      ],
      successFactors: [
        'Developer/user experience excellence',
        'Land with one use case, expand to platform',
        'Ecosystem building (integrations, partnerships, marketplace)',
        'Usage-based pricing that scales with customer success',
      ],
      risks: [
        'Hyperscalers (AWS, Azure, GCP) may build your category',
        'Application-layer companies may vertically integrate',
        'Long sales cycles for enterprise infrastructure',
        'Chicken-and-egg with ecosystem development',
      ],
      capitalReq: '$20-60M',
      timeToRevenue: '12-24 months',
      moatDepth: 'Medium-High',
      executionRisk: 'Medium',
      moatCharacteristics: 'Integration depth, developer ecosystem, data network effects, switching costs',
    },
    marketplace: {
      id: 'marketplace',
      name: 'Marketplace',
      tagline: 'Connect buyers and sellers, take a cut',
      icon: '🔗',
      color: 'bg-green-100 border-green-400',
      colorDark: 'bg-green-600',
      definition: 'Build a multi-sided platform connecting buyers and sellers, assets and operators, or capacity and demand. Revenue from transaction fees, subscriptions, or take rates.',
      thesis: [
        'Physical industries have fragmented, inefficient markets',
        'Digital marketplaces create liquidity and transparency',
        'Network effects create winner-take-most dynamics',
        'Can layer SaaS tools on top of marketplace for stickiness',
      ],
      whenToChoose: [
        'Market is fragmented with many buyers and sellers',
        'Information asymmetry creates meaningful inefficiency',
        'Can bootstrap liquidity (start with one side or geography)',
        'Transaction frequency supports marketplace economics',
      ],
      layerFit: ['L5', 'L-1', 'L0'],
      examples: [
        { company: 'Flexport', description: 'Digital freight forwarding', modifiers: 'Vertical (Logistics), Software-only, Top-down' },
        { company: 'Equipment Share', description: 'Construction equipment rental', modifiers: 'Vertical (Construction), Hardware-inclusive, Bottom-up' },
        { company: 'Uber Freight', description: 'Trucking marketplace', modifiers: 'Vertical (Trucking), Software-only, Bottom-up' },
        { company: 'Fictiv', description: 'Manufacturing marketplace', modifiers: 'Horizontal, Software-only, Bottom-up' },
      ],
      successFactors: [
        'Solve chicken-and-egg (typically seed supply first)',
        'Deliver value to both sides (not just arbitrage)',
        'Build SaaS tools that keep users engaged between transactions',
        'Add AI for matching, pricing, quality prediction',
      ],
      risks: [
        'Liquidity chicken-and-egg is hard to solve',
        'Disintermediation risk (buyers and sellers go direct)',
        'Low margins until significant scale',
        'Incumbents may have existing network relationships',
      ],
      capitalReq: '$20-50M',
      timeToRevenue: '12-24 months',
      moatDepth: 'Very High (if liquidity achieved)',
      executionRisk: 'High',
      moatCharacteristics: 'Network effects, liquidity, transaction data, trust/reputation systems',
    },
    foundationModel: {
      id: 'foundationModel',
      name: 'Foundation Model',
      tagline: 'License the AI brain to others',
      icon: '🧠',
      color: 'bg-indigo-100 border-indigo-400',
      colorDark: 'bg-indigo-600',
      definition: 'Build foundational AI models for physical domains (robotics, physics, time-series) and license to others. Revenue from API access, model licensing, or enterprise deals.',
      thesis: [
        'Foundation models will do for physical AI what GPT did for language',
        'First-mover with best model + most training data wins',
        'Platform economics: every deployment improves the model',
        'License/API model scales without marginal delivery cost',
      ],
      whenToChoose: [
        'You have world-class AI research team',
        'Problem benefits from scale (more data = better model)',
        'Transfer learning works (model trained on X helps with Y)',
        'Ecosystem of builders will emerge around your model',
      ],
      layerFit: ['L6'],
      examples: [
        { company: 'Physical Intelligence', description: 'Robot manipulation VLA (π0)', modifiers: 'Horizontal, Open Source + Enterprise' },
        { company: 'Wayve', description: 'Embodied AI for driving', modifiers: 'Vertical (Automotive), OEM/Embedded licensing' },
        { company: 'PhysicsX', description: 'Physics simulation surrogates', modifiers: 'Horizontal, Enterprise licensing' },
        { company: 'Nixtla', description: 'Time-series foundation models', modifiers: 'Horizontal, Open Source + Enterprise' },
      ],
      successFactors: [
        'Top-tier AI research talent (publish or perish)',
        'Proprietary data or clever data acquisition strategy',
        'Open source for adoption, enterprise for monetization',
        'Clear path from research to production deployment',
      ],
      risks: [
        'Hyperscaler competition (Google, NVIDIA, Meta, OpenAI)',
        'Model commoditization over time',
        'Enterprise adoption requires more than just a good model',
        'Regulatory uncertainty for AI models',
      ],
      capitalReq: '$30-100M+',
      timeToRevenue: '18-36 months',
      moatDepth: 'High (if model leadership maintained)',
      executionRisk: 'High',
      moatCharacteristics: 'Model performance, proprietary training data, research team reputation, ecosystem',
    },
  };

  // TIER 2: Strategic Modifiers (combine as needed)
  const strategyModifiers = {
    scope: {
      id: 'scope',
      name: 'Scope',
      icon: '🎯',
      question: 'How many industries do you serve?',
      options: [
        {
          id: 'horizontal',
          name: 'Horizontal',
          description: 'Serve multiple industries with same core product',
          pros: ['Larger TAM', 'Data diversity improves models', 'Not tied to one industry cycle'],
          cons: ['Jack of all trades risk', 'Higher GTM complexity', 'Less domain depth'],
          examples: ['Palantir', 'C3 AI', 'Augury', 'Databricks']
        },
        {
          id: 'vertical',
          name: 'Vertical',
          description: 'Go deep in one industry',
          pros: ['Deep domain expertise', 'Trusted partner status', 'Word-of-mouth in community'],
          cons: ['TAM ceiling', 'Industry concentration risk', 'Horizontal players may add your vertical'],
          examples: ['Procore (Construction)', 'Veeva (Life Sciences)', 'Anduril (Defense)', 'Samsara (Fleet)']
        },
      ]
    },
    assetFocus: {
      id: 'assetFocus',
      name: 'Asset Focus',
      icon: '🏭',
      question: 'Do you target existing assets or new ones?',
      options: [
        {
          id: 'brownfield',
          name: 'Brownfield (Retrofit)',
          description: 'Add intelligence to existing installed base',
          pros: ['95%+ of assets already deployed', 'Faster sales cycle', 'Lower customer capex'],
          cons: ['Integration with legacy systems', 'OEMs may add capability to new equipment', 'Heterogeneous installed base'],
          examples: ['Augury', 'Samsara', 'Motive', 'Petasense', 'Bedrock Robotics']
        },
        {
          id: 'greenfield',
          name: 'Greenfield (New)',
          description: 'Build or enable new AI-native assets',
          pros: ['Clean-sheet design', 'No legacy constraints', 'Higher performance ceiling'],
          cons: ['Smaller immediate TAM', 'Tied to capex cycles', 'Longer sales cycles'],
          examples: ['Anduril', 'Figure', 'Zipline', 'Tesla']
        },
      ]
    },
    stack: {
      id: 'stack',
      name: 'Stack',
      icon: '📚',
      question: 'Do you include hardware in your offering?',
      options: [
        {
          id: 'softwareOnly',
          name: 'Software-Only',
          description: 'Pure software/AI, no hardware',
          pros: ['Higher margins', 'Faster iteration', 'Lower capital requirements'],
          cons: ['Dependent on hardware partners', 'Less control over full experience', 'Easier to replicate'],
          examples: ['Palantir', 'C3 AI', 'Cognite', 'Procore']
        },
        {
          id: 'hardwareInclusive',
          name: 'Hardware-Inclusive',
          description: 'Include hardware (sensors, devices, robots)',
          pros: ['Control full stack', 'Hardware creates physical moat', 'Better data capture'],
          cons: ['Capital intensive', 'Manufacturing complexity', 'Lower gross margins on hardware'],
          examples: ['Samsara', 'Augury', 'Anduril', 'Figure']
        },
      ]
    },
    gtm: {
      id: 'gtm',
      name: 'Go-to-Market',
      icon: '🚀',
      question: 'How do you reach customers?',
      options: [
        {
          id: 'bottomUp',
          name: 'Bottom-Up',
          description: 'Land with users/practitioners, expand to enterprise',
          pros: ['Faster initial traction', 'Product-market fit signal', 'Lower CAC initially'],
          cons: ['May plateau without enterprise motion', 'Procurement can block expansion', 'Harder in regulated industries'],
          examples: ['Samsara', 'Tulip', 'Databricks', 'Weights & Biases']
        },
        {
          id: 'topDown',
          name: 'Top-Down',
          description: 'Sell to executives, deploy across organization',
          pros: ['Larger initial deals', 'Executive sponsorship', 'Faster enterprise rollout'],
          cons: ['Long sales cycles', 'High CAC', 'Risk of shelfware'],
          examples: ['Palantir', 'C3 AI', 'Anduril', 'Procore']
        },
        {
          id: 'oemEmbedded',
          name: 'OEM / Embedded',
          description: 'Sell through equipment manufacturers or integrators',
          pros: ['Leverage existing distribution', 'Lower GTM cost', 'Built into purchase decision'],
          cons: ['Margin pressure from OEM', 'Less direct customer relationship', 'Dependent on partner success'],
          examples: ['Wayve (auto OEMs)', 'Reliable Robotics', 'Many sensor companies']
        },
      ]
    },
    aiPositioning: {
      id: 'aiPositioning',
      name: 'AI Positioning',
      icon: '🤖',
      question: 'What role does AI play in your offering?',
      options: [
        {
          id: 'aiEnhanced',
          name: 'AI-Enhanced',
          description: 'AI improves existing workflows/products',
          pros: ['Easier adoption', 'Clear ROI story', 'Less technical risk'],
          cons: ['Differentiation may erode', 'Incumbents can add AI too', 'Not transformational'],
          examples: ['Most industrial software adding AI features']
        },
        {
          id: 'aiNative',
          name: 'AI-Native',
          description: 'AI is the core product, not a feature',
          pros: ['Stronger differentiation', 'Data flywheel compounds', 'Harder to replicate'],
          cons: ['Requires AI talent', 'May need more data to start', 'Buyer education needed'],
          examples: ['Augury', 'C3 AI', 'Physical Intelligence']
        },
        {
          id: 'fmPowered',
          name: 'FM-Powered',
          description: 'Built on foundation models (yours or others)',
          pros: ['Leverage pre-trained capabilities', 'Faster development', 'Transfer learning benefits'],
          cons: ['Dependent on FM provider (if using others)', 'Differentiation at application layer', 'FM costs/availability'],
          examples: ['Apps built on π0', 'Industrial copilots on GPT/Claude']
        },
      ]
    },
  };

  // Example Company Classifications
  const companyClassifications = [
    {
      company: 'Augury',
      model: 'platform',
      modifiers: { scope: 'horizontal', assetFocus: 'brownfield', stack: 'hardwareInclusive', gtm: 'bottomUp', aiPositioning: 'aiNative' },
      summary: 'Platform + Horizontal + Brownfield + Hardware-Inclusive + Bottom-up + AI-Native'
    },
    {
      company: 'Anduril',
      model: 'integratedProduct',
      modifiers: { scope: 'vertical', assetFocus: 'greenfield', stack: 'hardwareInclusive', gtm: 'topDown', aiPositioning: 'aiNative' },
      summary: 'Integrated Product + Vertical (Defense) + Greenfield + Hardware + Top-down + AI-Native'
    },
    {
      company: 'Physical Intelligence',
      model: 'foundationModel',
      modifiers: { scope: 'horizontal', assetFocus: 'greenfield', stack: 'softwareOnly', gtm: 'oemEmbedded', aiPositioning: 'fmPowered' },
      summary: 'Foundation Model + Horizontal + Software-only + OEM/Embedded + FM-Powered'
    },
    {
      company: 'Procore',
      model: 'platform',
      modifiers: { scope: 'vertical', assetFocus: 'brownfield', stack: 'softwareOnly', gtm: 'topDown', aiPositioning: 'aiEnhanced' },
      summary: 'Platform + Vertical (Construction) + Brownfield + Software-only + Top-down'
    },
    {
      company: 'Samsara',
      model: 'platform',
      modifiers: { scope: 'horizontal', assetFocus: 'brownfield', stack: 'hardwareInclusive', gtm: 'bottomUp', aiPositioning: 'aiNative' },
      summary: 'Platform + Started Vertical → Horizontal + Brownfield + Hardware + Bottom-up'
    },
    {
      company: 'Cognite',
      model: 'infrastructure',
      modifiers: { scope: 'horizontal', assetFocus: 'brownfield', stack: 'softwareOnly', gtm: 'topDown', aiPositioning: 'aiNative' },
      summary: 'Infrastructure + Horizontal + Brownfield + Software-only + Top-down'
    },
    {
      company: 'Flexport',
      model: 'marketplace',
      modifiers: { scope: 'vertical', assetFocus: 'brownfield', stack: 'softwareOnly', gtm: 'topDown', aiPositioning: 'aiEnhanced' },
      summary: 'Marketplace + Vertical (Logistics) + Software-only + Top-down'
    },
    {
      company: 'Figure',
      model: 'integratedProduct',
      modifiers: { scope: 'horizontal', assetFocus: 'greenfield', stack: 'hardwareInclusive', gtm: 'topDown', aiPositioning: 'fmPowered' },
      summary: 'Integrated Product + Horizontal + Greenfield + Hardware + Top-down + FM-Powered'
    },
  ];

  // Model-Layer Fit Matrix
  const modelLayerFit = {
    'L6': { best: ['platform', 'foundationModel', 'infrastructure'], reason: 'AI differentiation matters most; FM licensing natural here' },
    'L5': { best: ['platform', 'marketplace', 'infrastructure'], reason: 'Network coordination; marketplace dynamics strong' },
    'L4': { best: ['platform', 'infrastructure'], reason: 'Enterprise data; platform lock-in potential' },
    'L3': { best: ['platform', 'integratedProduct'], reason: 'Operations execution; may need HW integration' },
    'L2': { best: ['integratedProduct', 'platform'], reason: 'Control layer often needs HW; certification barriers' },
    'L1': { best: ['integratedProduct', 'platform'], reason: 'Sensing often requires hardware; retrofit opportunity' },
    'L0': { best: ['integratedProduct', 'marketplace'], reason: 'Physical assets; equipment marketplaces' },
    'L-1': { best: ['platform', 'marketplace', 'integratedProduct'], reason: 'Labor platforms, training, robotics replacing labor' },
  };

  // Founder-Model Fit
  const founderModelFit = [
    { have: 'Deep industry expertise (10+ years in vertical)', models: ['platform', 'marketplace'], modifiers: ['vertical', 'brownfield'] },
    { have: 'World-class AI/ML research team', models: ['foundationModel', 'platform'], modifiers: ['horizontal', 'aiNative'] },
    { have: 'Hardware + software integration experience', models: ['integratedProduct'], modifiers: ['greenfield', 'hardwareInclusive'] },
    { have: 'Marketplace/network building experience', models: ['marketplace'], modifiers: ['horizontal', 'bottomUp'] },
    { have: 'Enterprise software / platform experience', models: ['platform', 'infrastructure'], modifiers: ['topDown', 'softwareOnly'] },
    { have: 'Developer tools / open source experience', models: ['infrastructure', 'foundationModel'], modifiers: ['bottomUp', 'horizontal'] },
    { have: 'Capital efficiency requirement', models: ['platform', 'infrastructure'], modifiers: ['softwareOnly', 'brownfield'] },
    { have: 'Patient capital + big vision', models: ['integratedProduct', 'foundationModel'], modifiers: ['greenfield', 'horizontal'] },
  ];

  const pressureTestQuestions = [
    { q: 'Why this business model?', detail: 'Can you articulate why Platform vs Integrated Product vs Infrastructure vs Marketplace vs FM is right for your opportunity?' },
    { q: 'What\'s your wedge?', detail: 'What\'s the single use case or customer segment you\'ll win first?' },
    { q: 'What\'s the expand path?', detail: 'How do you grow from wedge to category leadership?' },
    { q: 'Why can\'t incumbents do this?', detail: 'What structural barrier prevents Siemens, Honeywell, SAP from winning?' },
    { q: 'Why these modifiers?', detail: 'Why horizontal vs vertical? Why brownfield vs greenfield? Why this GTM?' },
    { q: 'What\'s your data moat?', detail: 'How does your strategy create proprietary data that improves over time?' },
    { q: 'What\'s the capital efficiency?', detail: 'Can you reach key milestones with available capital? Does your model match your funding?' },
    { q: 'What\'s the timeline to defensibility?', detail: 'How long until competitors can\'t catch up? What creates lock-in?' },
    { q: 'Who is your buyer and how do they buy?', detail: 'Does your GTM modifier match actual buyer behavior in your market?' },
    { q: 'What has to be true for this to work?', detail: 'What are the key assumptions? What would cause you to change strategy?' },
  ];

  // ============================================
  // TAB DEFINITIONS
  // ============================================

  const tabs = [
    { id: 'start', name: 'Start Here', icon: '🏁' },
    { id: 'matrix', name: 'The Matrix', icon: '🏗️' },
    { id: 'valuechain', name: 'Value Chain', icon: '🔗' },
    { id: 'framework', name: 'Framework', icon: '🧩' },
    { id: 'layers', name: 'Layers', icon: '📚' },
    { id: 'industries', name: 'Industries', icon: '🏭' },
    { id: 'usecases', name: 'Use Cases', icon: '💡' },
    { id: 'strategies', name: 'Strategies', icon: '🎯' },
    { id: 'players', name: 'Key Players', icon: '🏢' },
    { id: 'resources', name: 'Other Resources', icon: '🔎' },
  ];

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  // Full cell content - expanded
  const FullCellContent = ({ cellData, layerId }) => {
    if (!cellData) return <div className="text-gray-400 text-xs italic">[Empty]</div>;
    return (
      <div className="text-xs space-y-2">
        <div>
          <div className="font-semibold text-blue-700 mb-1">Incumbents:</div>
          <ul className="space-y-0.5 pl-1">
            {cellData.incumbents?.map((inc, i) => <li key={i} className="text-gray-700">• {inc}</li>)}
          </ul>
        </div>
        <div>
          <div className="font-semibold text-orange-600 mb-1">Challengers:</div>
          <ul className="space-y-0.5 pl-1">
            {cellData.challengers?.map((ch, i) => <li key={i} className="text-gray-700">• {ch}</li>)}
          </ul>
        </div>
        <div>
          <div className="font-semibold text-green-700 mb-1">Dynamics:</div>
          <p className="text-gray-700 pl-1">{cellData.dynamics}</p>
        </div>
        <div className={`${layerColorsDark[layerId]} text-white p-2 rounded font-medium text-xs`}>
          ⚔️ {cellData.battle}
        </div>
        {cellData.constraints && (
          <div className="border-t pt-2">
            <div className="font-semibold text-gray-600 mb-1">⏱ Constraints:</div>
            <p className="text-gray-600 pl-1 italic">{cellData.constraints}</p>
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // TAB: START HERE
  // ============================================

  const StartHereTab = () => (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center py-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Physical & Industrial AI Strategic Mapping</h1>
        <p className="text-lg text-gray-600 mb-1">Understanding the $15T transformation of how physical industries operate</p>
        <p className="text-sm text-gray-500">A research guide for founders getting smart on industrial AI — from landscape orientation to opportunity evaluation</p>
      </div>

      {/* Section 1: Big Picture */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">The Big Picture: Why Industrial AI, Why Now</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">The Shift</h3>
            <p className="text-sm text-gray-600 mb-3">AI is moving from the digital world (ads, search, content) into the physical world (factories, fleets, infrastructure, energy systems). This is a different game: real-world constraints, legacy systems, safety-critical operations, slower adoption cycles — but massive TAMs and stickier customers.</p>
            <h3 className="font-semibold text-gray-800 mb-2">Why Now</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Foundation models reaching physical domains</li>
              <li>• Edge infrastructure capable of real-time workloads</li>
              <li>• Workforce crisis forcing automation</li>
              <li>• OT/IT convergence creating software entry points</li>
              <li>• Incumbents struggling to move fast enough</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">The Prize</h3>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              <li>• Industrial sectors represent ~40% of global GDP</li>
              <li>• Most still run on 20-40 year old control systems</li>
              <li>• AI adoption is &lt;10% in most verticals — massive greenfield</li>
            </ul>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-800">
                <span>📍</span>
                <span className="font-medium text-sm">Explore in:</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                <button onClick={() => setActiveTab('framework')} className="underline hover:text-blue-900 font-medium">Framework</button> — See how the 8-layer technology stack is evolving, the constraints blocking transformation, and the future state as layers collapse
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Full Ecosystem View */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">The Full Ecosystem View</h2>
        <p className="text-sm text-gray-600 mb-4">The industrial AI landscape mapped as a 10×8 matrix:</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="font-semibold text-gray-800 text-sm mb-2">10 Verticals</div>
            <p className="text-xs text-gray-600">Process Mfg, Discrete Mfg, Energy, Utilities, Mining, Construction, Aerospace & Defense, Land Transport, Maritime, Data Centers</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="font-semibold text-gray-800 text-sm mb-2">8 Technology Layers</div>
            <p className="text-xs text-gray-600">From AI/ML (L6) down through operations, edge, sensors, physical assets, to workforce (L-1)</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4"><strong>80 Battlegrounds:</strong> Each cell represents a distinct competitive arena. See where incumbents dominate vs. where challengers are gaining ground.</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <span>📍</span>
            <span className="font-medium text-sm">Explore in:</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            <button onClick={() => setActiveTab('matrix')} className="underline hover:text-blue-900 font-medium">Matrix</button> — A comprehensive grid showing incumbents vs. challengers across all 80 cells. Use it to grasp the overall market structure, spot patterns across verticals or layers, and dive into specific cells that match your target area.
          </p>
        </div>
      </div>

      {/* Section 3: Technology Stack */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">The Technology Stack: Understanding the Layers</h2>
        <p className="text-sm text-gray-600 mb-4">How industrial technology is structured from intelligence to physical assets:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded p-2">
            <div className="font-bold text-xs text-indigo-800">L6 — Intelligence</div>
            <div className="text-xs text-gray-600">AI/ML, foundation models</div>
          </div>
          <div className="bg-violet-50 border border-violet-200 rounded p-2">
            <div className="font-bold text-xs text-violet-800">L5 — Supply Networks</div>
            <div className="text-xs text-gray-600">Planning, logistics</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded p-2">
            <div className="font-bold text-xs text-blue-800">L4 — Enterprise</div>
            <div className="text-xs text-gray-600">ERP, MES, asset mgmt</div>
          </div>
          <div className="bg-cyan-50 border border-cyan-200 rounded p-2">
            <div className="font-bold text-xs text-cyan-800">L3 — Operations</div>
            <div className="text-xs text-gray-600">Control, optimization</div>
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded p-2">
            <div className="font-bold text-xs text-teal-800">L2 — Edge</div>
            <div className="text-xs text-gray-600">Gateways, local compute</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded p-2">
            <div className="font-bold text-xs text-green-800">L1 — Sensing</div>
            <div className="text-xs text-gray-600">Sensors, vision systems</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded p-2">
            <div className="font-bold text-xs text-amber-800">L0 — Physical Assets</div>
            <div className="text-xs text-gray-600">Machines, robots</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded p-2">
            <div className="font-bold text-xs text-orange-800">L-1 — Labor</div>
            <div className="text-xs text-gray-600">Workforce, training</div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4"><strong>Why layers matter:</strong> Value flows up and down the stack. Defensible businesses often span multiple layers. Pure L6 plays struggle without data access (L1-L3) or workflow integration (L3-L4).</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <span>📍</span>
            <span className="font-medium text-sm">Explore in:</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            <button onClick={() => setActiveTab('layers')} className="underline hover:text-blue-900 font-medium">Layers</button> — Detailed breakdown of each technology layer with filtering by vertical, showing what's happening at each level across industries
          </p>
        </div>
      </div>

      {/* Section 4: Industrial Verticals */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Industrial Verticals: Markets and Buyers</h2>
        <p className="text-sm text-gray-600 mb-4">Ten sectors with distinct characteristics, buyer personas, and go-to-market dynamics:</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
          {[
            { name: 'Process Mfg', desc: 'Continuous/batch, regulated' },
            { name: 'Discrete Mfg', desc: 'Assembly, high-mix' },
            { name: 'Energy', desc: 'Capex-intensive, transition' },
            { name: 'Utilities', desc: 'Regulated monopolies' },
            { name: 'Mining', desc: 'Remote, safety-critical' },
            { name: 'Construction', desc: 'Fragmented, low digital' },
            { name: 'Aerospace & Defense', desc: 'Certification cycles' },
            { name: 'Land Transport', desc: 'Fleet ops, last-mile' },
            { name: 'Maritime', desc: 'Global trade, ports' },
            { name: 'Data Centers', desc: 'AI buildout, power' },
          ].map((v, i) => (
            <div key={i} className="bg-gray-50 rounded p-2 text-center">
              <div className="font-semibold text-xs text-gray-800">{v.name}</div>
              <div className="text-xs text-gray-500">{v.desc}</div>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <span>📍</span>
            <span className="font-medium text-sm">Explore in:</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            <button onClick={() => setActiveTab('industries')} className="underline hover:text-blue-900 font-medium">Industries</button> — Deep dives on each vertical including market overview, disruption use cases, buyer personas by layer, and sales motion guidance
          </p>
        </div>
      </div>

      {/* Section 5: Use Cases */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Disruptive Opportunities and Use Cases</h2>
        <p className="text-sm text-gray-600 mb-3">Where AI is creating new value across industrial operations:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {['Predictive maintenance', 'Autonomous operations', 'Quality inspection', 'Supply chain optimization', 'Operator copilots', 'Robotic manipulation', 'Energy optimization', 'Digital twins'].map((uc, i) => (
            <span key={i} className="bg-purple-50 border border-purple-200 text-purple-800 px-2 py-1 rounded text-xs">{uc}</span>
          ))}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <span>📍</span>
            <span className="font-medium text-sm">Explore in:</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            <button onClick={() => setActiveTab('usecases')} className="underline hover:text-blue-900 font-medium">Use Cases</button> — Filterable database of AI applications. Filter by industry and layer to find specific opportunities and see where innovation is concentrated.
          </p>
        </div>
      </div>

      {/* Section 6: Strategic Positioning */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Strategic Positioning: Business Models and Modifiers</h2>
        <p className="text-sm text-gray-600 mb-3">How companies position themselves in the market:</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="font-semibold text-gray-800 text-sm mb-2">Business Models</div>
            <p className="text-xs text-gray-600">Integrated product, horizontal platform, vertical platform, marketplace, infrastructure</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="font-semibold text-gray-800 text-sm mb-2">Strategy Modifiers</div>
            <p className="text-xs text-gray-600">Scope, asset focus, stack position, GTM approach, AI positioning</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <span>📍</span>
            <span className="font-medium text-sm">Explore in:</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            <button onClick={() => setActiveTab('strategies')} className="underline hover:text-blue-900 font-medium">Strategies</button> — Two-tier strategy framework. Select a business model and configure modifiers to understand positioning options and trade-offs.
          </p>
        </div>
      </div>

      {/* Section 7: Key Players */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Key Players: Startups and Incumbents</h2>
        <p className="text-sm text-gray-600 mb-3">Strategic breakdown of 21 companies shaping the market:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {['Strategic thesis', 'Wedge strategy', 'Moat & defensibility', 'Product offerings', 'Buyer personas', 'Sales flow', 'Competitive position', 'Coverage heatmap'].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded p-2 text-center">
              <span className="text-xs text-gray-700">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mb-4">Categories: Industrial AI platforms, predictive maintenance, physical AI, robotics, warehouse automation, visual AI, defense tech, autonomous vehicles, advanced manufacturing, AI infrastructure</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <span>📍</span>
            <span className="font-medium text-sm">Explore in:</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            <button onClick={() => setActiveTab('players')} className="underline hover:text-blue-900 font-medium">Key Players</button> — Select any company from the dropdown to see full strategic profile with coverage heatmap, go-to-market motion, and competitive analysis
          </p>
        </div>
      </div>

      {/* Section 8-12: Other Resources */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Resources</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">📋 Go-to-Market Playbooks</h3>
            <p className="text-sm text-gray-600 mb-2">Enterprise sales motions, design partners, proving value, land-and-expand strategies, navigating OT/IT dynamics</p>
            <button onClick={() => { setActiveTab('resources'); setSelectedResource('playbooks'); }} className="text-sm text-blue-600 underline hover:text-blue-800">Explore Playbooks →</button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">🔌 Standards & Interoperability</h3>
            <p className="text-sm text-gray-600 mb-2">Industry protocols (OPC-UA, MQTT), data standards, consortiums, integration patterns</p>
            <button onClick={() => { setActiveTab('resources'); setSelectedResource('standards'); }} className="text-sm text-blue-600 underline hover:text-blue-800">Explore Standards →</button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">💰 Investment & Capital Flows</h3>
            <p className="text-sm text-gray-600 mb-2">Funding trends by vertical and layer, notable raises, investor thesis patterns</p>
            <button onClick={() => { setActiveTab('resources'); setSelectedResource('investment'); }} className="text-sm text-blue-600 underline hover:text-blue-800">Explore Investment →</button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">🧠 Foundation Models for Physical AI</h3>
            <p className="text-sm text-gray-600 mb-2">Robotics FMs, sensor/time-series models, vision models, what's working vs. hype</p>
            <button onClick={() => { setActiveTab('resources'); setSelectedResource('fms'); }} className="text-sm text-blue-600 underline hover:text-blue-800">Explore Foundation Models →</button>
          </div>
        </div>
      </div>

      {/* Section 13: AI Assistant */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🤖 AI Research Assistant</h2>
        <p className="text-sm text-gray-600 mb-4">Use the AI assistant to explore this guide through conversation:</p>
        <div className="grid md:grid-cols-2 gap-2 mb-4">
          {[
            '"What are the transformation bottlenecks in utilities?"',
            '"Show me the competitive landscape in warehouse robotics"',
            '"How does Cognite\'s strategy differ from Palantir\'s?"',
            '"What are the top use cases in construction?"',
            '"Who are the buyers for predictive maintenance?"',
          ].map((q, i) => (
            <div key={i} className="bg-white rounded p-2 text-sm text-gray-600 italic border">
              {q}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500">The assistant synthesizes across all sections — connecting frameworks, players, industries, and use cases to answer your questions.</p>
      </div>

      {/* Section 14: Research Paths */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Suggested Research Paths</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-semibold text-gray-700">Goal</th>
                <th className="text-left py-2 font-semibold text-gray-700">Path</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Get oriented</td>
                <td className="py-2">Start Here → Framework → Matrix</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Understand a market</td>
                <td className="py-2">Industries (your vertical) → Use Cases → Key Players</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Evaluate an opportunity</td>
                <td className="py-2">Matrix (target cell) → Use Cases → Key Players (competitors)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Define your strategy</td>
                <td className="py-2">Strategies → Key Players (study comparable positioning)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Plan GTM</td>
                <td className="py-2">Industries (buyer personas) → Playbooks → Key Players</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Deep technical dive</td>
                <td className="py-2">Layers → Standards & Interoperability → Foundation Models</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 15: About */}
      <div className="bg-gray-50 rounded-lg border p-6 text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-2">About This Guide</h2>
        <p className="text-sm text-gray-600 mb-2">Point-in-time snapshot of a fast-moving market. Research synthesized from public sources, filings, interviews, and industry reports. Updated periodically.</p>
        <p className="text-sm font-semibold text-gray-700">Version 4.0 | December 2025</p>
      </div>
    </div>
  );

  // ============================================
  // TAB: STRATEGIC MATRIX (WITH TOGGLE)
  // ============================================

  const MatrixTab = () => (
    <div className="space-y-4">
      {/* Toggle Switch */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-medium ${matrixView === 'expanded' ? 'text-gray-900' : 'text-gray-400'}`}>Expanded</span>
        <button
          onClick={() => setMatrixView(matrixView === 'expanded' ? 'concise' : 'expanded')}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-300"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${matrixView === 'concise' ? 'translate-x-6' : 'translate-x-1'
              }`}
          />
        </button>
        <span className={`text-sm font-medium ${matrixView === 'concise' ? 'text-gray-900' : 'text-gray-400'}`}>Concise</span>
      </div>

      {matrixView === 'expanded' ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm" style={{ minWidth: '3000px' }}>
            <thead>
              <tr>
                <th className="sticky left-0 z-20 bg-gray-800 text-white p-3 min-w-[200px] border border-gray-600 text-left">
                  <div className="font-bold text-lg">Layer</div>
                  <div className="text-xs font-normal text-gray-300 mt-1">Theme & Strategic Question</div>
                </th>
                {verticals.map((v) => (
                  <th key={v.id} className="bg-gray-800 text-white p-3 min-w-[280px] border border-gray-600 text-left">
                    <div className="font-bold text-sm">{v.name}</div>
                    {v.subtitle && <div className="text-xs font-normal text-gray-300">{v.subtitle}</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {layers.map((layer) => (
                <tr key={layer.id}>
                  <td className={`sticky left-0 z-10 p-3 border ${layerColors[layer.id]} min-w-[200px] align-top`}>
                    <div className="text-xl font-bold">{layer.id}</div>
                    <div className="text-sm font-bold mt-1">{layer.name}</div>
                    <div className="text-xs font-semibold text-purple-700 mt-1">{layer.theme}</div>
                    <div className="text-xs text-gray-600 mt-2 italic">{layer.description}</div>
                  </td>
                  {verticals.map((v) => {
                    const cellKey = `${layer.id}-${v.id}`;
                    const cellData = data[cellKey];
                    return (
                      <td key={cellKey} className={`p-3 border align-top ${layerColors[layer.id]}`}>
                        <FullCellContent cellData={cellData} layerId={layer.id} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">The 80 Battles: Strategic Tensions by Layer × Vertical</h2>
            <p className="text-gray-600">Click any battle to see full context</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: '1400px' }}>
              <thead>
                <tr>
                  <th className="sticky left-0 z-20 bg-gray-800 text-white p-2 min-w-[120px] border border-gray-600">Layer</th>
                  {verticals.map((v) => (
                    <th key={v.id} className="bg-gray-800 text-white p-2 min-w-[120px] border border-gray-600 text-xs">
                      {v.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {layers.map((layer) => (
                  <tr key={layer.id}>
                    <td className={`sticky left-0 z-10 p-2 border font-bold ${layerColors[layer.id]}`}>
                      <div className="text-sm">{layer.id}</div>
                      <div className="text-xs">{layer.name}</div>
                    </td>
                    {verticals.map((v) => {
                      const cellKey = `${layer.id}-${v.id}`;
                      const cellData = data[cellKey];
                      return (
                        <td
                          key={cellKey}
                          className={`p-2 border align-top ${layerColors[layer.id]} hover:bg-white cursor-pointer transition-colors`}
                          onClick={() => setSelectedBattle(selectedBattle === cellKey ? null : cellKey)}
                        >
                          <div className="text-xs font-medium text-gray-800 leading-tight">
                            {cellData?.battle || '[No battle]'}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Battle Detail Pop-up */}
          {selectedBattle && data[selectedBattle] && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBattle(null)}>
              <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className={`${layerColorsDark[selectedBattle.split('-')[0]]} text-white p-4 rounded-t-xl`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xl font-bold">{selectedBattle.split('-')[0]}: {layers.find(l => l.id === selectedBattle.split('-')[0])?.name}</div>
                      <div className="text-sm opacity-90">{verticals.find(v => v.id === selectedBattle.split('-')[1])?.name}</div>
                    </div>
                    <button onClick={() => setSelectedBattle(null)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1">✕</button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-lg font-bold text-center mb-4 text-purple-700">
                    ⚔️ {data[selectedBattle].battle}
                  </div>
                  <FullCellContent cellData={data[selectedBattle]} layerId={selectedBattle.split('-')[0]} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ============================================
  // TAB: FRAMEWORK
  // ============================================

  // Enhanced layer descriptions for the framework view
  const layerDetails = {
    'L6': {
      fullName: 'Intelligence Layer',
      war: 'The Decision War',
      currentState: 'Traditional decision-making relies on first-principles physics models, statistical methods (SPC, ARIMA), and human expert judgment. AI promises learned intelligence that improves with data–but faces trust, explainability, and validation barriers.',
      whatItIs: 'The cognitive layer where data becomes decisions. Encompasses physics simulation, forecasting, optimization, anomaly detection, and expert knowledge systems.',
      keyQuestion: 'Can AI-powered intelligence earn trust in safety-critical environments, or will traditional methods remain the standard for validated decisions?'
    },
    'L5': {
      fullName: 'Supply Chain Layer',
      war: 'The Network War',
      currentState: 'Traditional supply chains operate as isolated silos–each company optimizes locally without visibility into supplier or customer operations. Multi-tier networks remain opaque.',
      whatItIs: 'The coordination layer spanning multiple enterprises: procurement, logistics, inventory, demand planning, and supplier management across the extended value chain.',
      keyQuestion: 'Can AI-powered supply chain platforms create true multi-enterprise visibility, or will data-sharing barriers preserve fragmentation?'
    },
    'L4': {
      fullName: 'Enterprise Layer',
      war: 'The Data Lake War',
      currentState: 'Legacy ERP systems (SAP, Oracle) hold transactional data but struggle with real-time analytics. Cloud platforms and data lakes compete to become the enterprise "source of truth."',
      whatItIs: 'The business system layer: ERP, MES integration, financial systems, quality management, and enterprise analytics that translate operational data into business decisions.',
      keyQuestion: 'Who owns the enterprise data model–incumbent ERP vendors extending down, or cloud-native platforms extending up?'
    },
    'L3': {
      fullName: 'Operations Layer',
      war: 'The Machine Brain War',
      currentState: 'MES and SCADA systems provide rigid, rules-based production control. AI agents promise dynamic optimization but face resistance from validated, compliance-critical workflows.',
      whatItIs: 'The execution layer: production scheduling, batch management, quality control, recipe management, and real-time operational decisions on the plant floor.',
      keyQuestion: 'Will AI agents replace rigid MES logic, or will they remain advisory tools constrained by compliance requirements?'
    },
    'L2': {
      fullName: 'Control Layer',
      war: 'The Edge War',
      currentState: 'Proprietary PLCs and DCS systems from Siemens, Rockwell, ABB dominate. Software-defined control and edge computing threaten vendor lock-in but face safety certification barriers.',
      whatItIs: 'The real-time control layer: PLCs, DCS, SCADA, and edge computing that execute millisecond-level control loops and safety interlocks.',
      keyQuestion: 'Can software-defined, open control systems penetrate safety-critical environments, or will proprietary hardware retain its moat?'
    },
    'L1': {
      fullName: 'Sensing Layer',
      war: 'The Sensing War',
      currentState: 'Traditional sensors provide single-point measurements. AI-enabled sensors, computer vision, and sensor fusion promise richer situational awareness but require integration into legacy infrastructure.',
      whatItIs: 'The perception layer: sensors, instrumentation, computer vision, vibration analysis, and all systems that convert physical reality into digital signals.',
      keyQuestion: 'Will dense, AI-native sensing retrofit brownfield assets, or will sensing upgrades wait for equipment replacement cycles?'
    },
    'L0': {
      fullName: 'Physics Layer',
      war: 'The Asset War',
      currentState: 'Physical assets have 20-50 year lifecycles. Brownfield facilities vastly outnumber greenfield. Modernization competes with replacement, and OEMs seek recurring software revenue.',
      whatItIs: 'The physical layer: production equipment, robots, vehicles, infrastructure–the actual machines and assets that transform materials and move goods.',
      keyQuestion: 'Can smart retrofits extend asset life, or will AI-native equipment eventually force wholesale replacement?'
    },
    'L-1': {
      fullName: 'Labor Layer',
      war: 'The Skill War',
      currentState: 'Workforce aging and skills gaps create urgency. AI copilots augment workers while robotics automates tasks. The human-machine interface is being redefined.',
      whatItIs: 'The human layer: operators, technicians, engineers, and managers–their skills, workflows, training, and interaction with automated systems.',
      keyQuestion: 'Will AI augment workers (keeping humans in the loop) or replace them (autonomous operations)?'
    }
  };

  // AI Collapse descriptions (top layers)
  const aiCollapseData = {
    'L6-L5': {
      title: 'Intelligence + Supply Chain Collapse',
      description: 'Foundation models absorb demand forecasting, supplier risk assessment, and network optimization. The "brain" extends across enterprise boundaries.',
      processMfgExample: 'A chemical company\'s AI predicts raw material price swings, automatically adjusts procurement timing, and coordinates with suppliers–all from a unified model that understands both market dynamics and production constraints.',
      outcome: 'Supply chain planning becomes a capability of the intelligence layer, not a separate system.'
    },
    'L5-L4': {
      title: 'Supply Chain + Enterprise Collapse',
      description: 'Real-time supply chain signals feed directly into financial planning. The distinction between "operational" and "transactional" data dissolves.',
      processMfgExample: 'Inventory levels, production costs, and customer commitments update financial forecasts in real-time. Monthly S&OP cycles become continuous, AI-driven rebalancing.',
      outcome: 'ERP becomes a compliance/audit layer while AI platforms handle actual decision-making.'
    },
    'L4-L3': {
      title: 'Enterprise + Operations Collapse',
      description: 'AI agents translate business objectives directly into production schedules. The MES layer thins as intelligence moves up and control moves down.',
      processMfgExample: 'A pharma plant receives a rush order. AI automatically resequences batches, adjusts cleaning schedules, updates quality documentation, and notifies affected customers–without human schedulers.',
      outcome: 'Operations management becomes orchestration of AI agents rather than manual planning.'
    }
  };

  // Robotics/Autonomy Collapse descriptions (bottom layers)
  const autonomyCollapseData = {
    'L-1-L0': {
      title: 'Labor + Physics Collapse',
      description: 'Humanoid robots and autonomous mobile robots merge "worker" and "equipment" categories. For brownfield, autonomy kits retrofit existing forklifts (Bedrock Robotics, Cyngn) rather than replacing fleets.',
      processMfgExample: 'Existing forklifts retrofitted with autonomy kits operate alongside human workers. Upgrading the millions of manual vehicles already deployed is 10-100x the market of greenfield AMRs.',
      outcome: 'Retrofit autonomy unlocks the installed base; greenfield follows for new capacity.'
    },
    'L0-L1': {
      title: 'Physics + Sensing Collapse',
      description: 'Future assets will ship sensor-dense, but most equipment today has minimal sensing. Wireless vibration sensors (Augury), bolt-on vision, and acoustic monitoring add intelligence to existing "dark" assets.',
      processMfgExample: 'Most pumps, motors, and fans have no continuous monitoring. Wireless sensors from Augury, SKF, Petasense turn "dumb" assets into data sources–no wiring, no downtime.',
      outcome: 'Retrofit sensing unlocks AI/PdM on existing assets; embedded sensing comes with replacements over decades.'
    },
    'L1-L2': {
      title: 'Sensing + Control Collapse',
      description: 'AI-at-the-edge merges perception and action, but validated PLCs/DCS have decades of remaining life. Edge computing sits alongside existing control systems–protocol gateways, edge historians, AI inference without touching safety-critical logic.',
      processMfgExample: 'Edge devices (Litmus, Siemens Industrial Edge) sit alongside 20-year-old DCS systems, ingesting data via OPC-UA and running AI models. "Augment, don\'t replace" is how intelligence enters the control layer.',
      outcome: 'Edge-alongside-existing is the path; software-defined control follows over 15-20 year replacement cycles.'
    }
  };

  // Bottleneck categories with expanded descriptions
  const bottleneckCategories = [
    {
      category: 'Physical & Infrastructure',
      icon: '🏭',
      color: 'bg-amber-50 border-amber-300',
      bottlenecks: [
        { name: 'Legacy Assets', description: 'Equipment designed before connectivity–no sensors, no APIs, proprietary protocols. 20-50 year replacement cycles lock in old technology.' },
        { name: 'Brownfield Dominance', description: '95% of industrial capacity is existing facilities. Greenfield AI-native designs are rare; most transformation must retrofit.' },
        { name: 'Physical Constraints', description: 'Space limitations, hazardous environments, and existing layouts restrict where new technology can be deployed.' }
      ]
    },
    {
      category: 'Data & Integration',
      icon: '📊',
      color: 'bg-red-50 border-red-300',
      bottlenecks: [
        { name: 'Bad/Missing Data', description: 'Historian gaps, inconsistent tagging, no unified data model. Years of "data debt" must be cleaned before AI can be effective.' },
        { name: 'Integration Spaghetti', description: 'Point-to-point connections, custom middleware, no standard APIs. Each new system requires custom integration work.' },
        { name: 'IT/OT Divide', description: 'Separate networks, different teams, security barriers. The Purdue model creates architectural friction between enterprise and plant.' }
      ]
    },
    {
      category: 'Organizational & Human',
      icon: '👥',
      color: 'bg-blue-50 border-blue-300',
      bottlenecks: [
        { name: 'Change Resistance', description: 'Workforce skepticism, union concerns, fear of job loss. Cultural inertia slows adoption even when technology is ready.' },
        { name: 'Skills Gaps', description: 'Operators trained on old systems, few data scientists who understand processes. The talent to bridge AI and operations is scarce.' },
        { name: 'Organizational Silos', description: 'IT, OT, engineering, and operations report to different leaders with different incentives. Cross-functional projects stall.' }
      ]
    },
    {
      category: 'Regulatory & Compliance',
      icon: '📋',
      color: 'bg-green-50 border-green-300',
      bottlenecks: [
        { name: 'Safety Certification', description: 'SIL-rated systems require extensive validation. AI in safety loops faces years of certification processes.' },
        { name: 'GMP/FDA Requirements', description: 'Pharmaceutical and food production require validated systems with complete audit trails. "Move fast and break things" is forbidden.' },
        { name: 'Change Control', description: 'Every software update requires documentation, testing, and approval. Continuous deployment is incompatible with compliance culture.' }
      ]
    },
    {
      category: 'Commercial & Vendor',
      icon: '🔐',
      color: 'bg-purple-50 border-purple-300',
      bottlenecks: [
        { name: 'Vendor Lock-in', description: 'Proprietary protocols, closed ecosystems, DCS/PLC vendor dependencies. Switching costs are measured in years and millions.' },
        { name: 'Misaligned Incentives', description: 'OEMs sell equipment, not outcomes. Automation vendors profit from complexity. Few benefit from simplification.' },
        { name: 'Procurement Cycles', description: 'Capital budgets planned 2-3 years ahead. Technology moves faster than enterprise purchasing processes.' }
      ]
    }
  ];

  const FrameworkTab = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Physical AI Transformation Framework</h2>
        <p className="text-gray-600">Current State → Constraints → Future State</p>
      </div>

      {/* 3-Column Side-by-Side Layout */}
      <div className="overflow-x-auto">
        <div className="flex gap-4" style={{ minWidth: '1600px' }}>

          {/* COLUMN 1: Current Layers */}
          <div className="flex-1 min-w-[500px]">
            <div className="bg-gray-800 text-white text-center py-2 rounded-t-lg font-bold">
              📊 CURRENT STATE: The 8-Layer Stack
            </div>
            <div className="border-2 border-t-0 border-gray-300 rounded-b-lg p-3 bg-gray-50">
              <div className="space-y-2">
                {layers.map((layer) => {
                  const details = layerDetails[layer.id];
                  return (
                    <div key={layer.id} className={`${layerColors[layer.id]} border rounded-lg p-3`}>
                      <div className="flex items-start gap-2">
                        <div className="text-lg font-bold text-gray-700 w-10">{layer.id}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm">{details.fullName}</span>
                            <span className={`${layerColorsDark[layer.id]} text-white px-2 py-0.5 rounded text-xs`}>
                              {details.war}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{details.whatItIs}</p>
                          <p className="text-xs text-purple-700 italic">{details.keyQuestion}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COLUMN 2: Constraints */}
          <div className="flex-1 min-w-[500px]">
            <div className="bg-red-700 text-white text-center py-2 rounded-t-lg font-bold">
              ⚠️ CONSTRAINTS: Transformation Bottlenecks
            </div>
            <div className="border-2 border-t-0 border-red-300 rounded-b-lg p-3 bg-red-50">
              <div className="space-y-3">
                {bottleneckCategories.map((cat) => (
                  <div key={cat.category} className={`${cat.color} border rounded-lg p-3`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="font-bold text-sm">{cat.category}</span>
                    </div>
                    <div className="space-y-1">
                      {cat.bottlenecks.map((b, i) => (
                        <div key={i} className="bg-white rounded p-2">
                          <div className="font-semibold text-xs text-gray-800">{b.name}</div>
                          <p className="text-xs text-gray-600">{b.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 3: Future State */}
          <div className="flex-1 min-w-[500px]">
            <div className="bg-gradient-to-r from-indigo-700 to-amber-600 text-white text-center py-2 rounded-t-lg font-bold">
              🔮 FUTURE STATE: Layer Collapse
            </div>
            <div className="border-2 border-t-0 border-gray-300 rounded-b-lg p-3 bg-gray-50">

              {/* AI Collapse (Top) */}
              <div className="bg-indigo-50 border border-indigo-300 rounded-lg p-3 mb-3">
                <div className="text-center mb-2">
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded text-sm font-bold">
                    ⬇️ AI COLLAPSING DOWN
                  </span>
                  <p className="text-xs text-gray-500 mt-1">L6 → L5 → L4 → L3</p>
                </div>
                <div className="space-y-2">
                  {Object.entries(aiCollapseData).map(([key, collapse]) => (
                    <div key={key} className="bg-white rounded p-2 border-l-4 border-indigo-400">
                      <div className="font-bold text-xs text-indigo-800">{collapse.title}</div>
                      <p className="text-xs text-gray-600 my-1">{collapse.description}</p>
                      <p className="text-xs text-indigo-600">→ {collapse.outcome}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Squeeze Zone */}
              <div className="bg-red-100 border-2 border-red-400 rounded-lg p-3 mb-3 text-center">
                <div className="font-bold text-red-700 text-sm">⚠️ THE SQUEEZE ZONE (L3-L2)</div>
                <p className="text-xs text-gray-700 mt-1">
                  AI pushes down, Robotics pushes up via RETROFIT. Most assets lack sensors and autonomy–bolt-on upgrades (Augury, Bedrock) unlock the brownfield installed base.
                </p>
              </div>

              {/* Robotics Collapse (Bottom) */}
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
                <div className="text-center mb-2">
                  <span className="bg-amber-600 text-white px-3 py-1 rounded text-sm font-bold">
                    ⬆️ ROBOTICS COLLAPSING UP (via Retrofit)
                  </span>
                  <p className="text-xs text-gray-500 mt-1">L-1 → L0 → L1 → L2 | Brownfield dominates</p>
                </div>
                <div className="space-y-2">
                  {Object.entries(autonomyCollapseData).map(([key, collapse]) => (
                    <div key={key} className="bg-white rounded p-2 border-l-4 border-amber-400">
                      <div className="font-bold text-xs text-amber-800">{collapse.title}</div>
                      <p className="text-xs text-gray-600 my-1">{collapse.description}</p>
                      <p className="text-xs text-amber-600">→ {collapse.outcome}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Process Mfg Examples (below the columns) */}
      <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 mt-4">
        <div className="text-center mb-3">
          <span className="bg-purple-700 text-white px-4 py-1 rounded font-bold text-sm">
            🏭 Process Manufacturing: Collapse Examples
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="font-bold text-indigo-700 text-sm mb-2">⬇️ AI Collapse Examples</div>
            {Object.entries(aiCollapseData).map(([key, collapse]) => (
              <div key={key} className="bg-white rounded p-2 mb-2 text-xs">
                <span className="font-semibold">{collapse.title}:</span> {collapse.processMfgExample}
              </div>
            ))}
          </div>
          <div>
            <div className="font-bold text-amber-700 text-sm mb-2">⬆️ Robotics Collapse Examples (Retrofit Path)</div>
            {Object.entries(autonomyCollapseData).map(([key, collapse]) => (
              <div key={key} className="bg-white rounded p-2 mb-2 text-xs">
                <span className="font-semibold">{collapse.title}:</span> {collapse.processMfgExample}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================
  // TAB: LAYERS DEEP DIVE
  // ============================================

  const LayersTab = () => {
    const layerInfo = layerTaxonomy[selectedLayer];

    return (
      <div className="space-y-6">
        {/* Layer Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {layers.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedLayer(l.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedLayer === l.id
                ? `${layerColorsDark[l.id]} text-white`
                : `${layerColors[l.id]} border-2 hover:opacity-80`
                }`}
            >
              {l.id}: {l.name}
            </button>
          ))}
        </div>

        {/* Layer Header */}
        <div className={`${layerColors[selectedLayer]} border-2 rounded-xl p-6`}>
          <div className="flex items-center gap-4">
            <div className={`${layerColorsDark[selectedLayer]} text-white text-3xl font-bold px-4 py-2 rounded-lg`}>
              {selectedLayer}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{layerInfo.fullName}</h2>
              <p className="text-purple-700 font-semibold">{layerInfo.theme}</p>
            </div>
          </div>
          <p className="mt-4 text-gray-700">{layerInfo.description}</p>
        </div>

        {/* Overview */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-bold text-lg mb-4">Layer Overview</h3>
          <div className="space-y-4 text-gray-700">
            {layerInfo.overview.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Taxonomy */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-bold text-lg mb-4">{layerInfo.taxonomy.title}</h3>
          <div className="space-y-4">
            {layerInfo.taxonomy.categories.map((cat, i) => (
              <div key={i} className={`${layerColors[selectedLayer]} border-2 rounded-lg p-4`}>
                <h4 className="font-bold text-lg mb-3">{cat.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded p-3">
                    <div className="font-semibold text-blue-700 mb-2">Traditional</div>
                    <p className="text-sm text-gray-700">{cat.traditional}</p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <div className="font-semibold text-green-700 mb-2">Modern / AI-Enabled</div>
                    <p className="text-sm text-gray-700">{cat.modern}</p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <div className="font-semibold text-gray-700 mb-2">Examples</div>
                    <div className="flex flex-wrap gap-1">
                      {cat.examples.map((ex, j) => (
                        <span key={j} className="bg-gray-200 text-xs px-2 py-1 rounded">{ex}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transition Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-4">The Transformation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
              <div className="font-bold text-blue-700 mb-2">Traditional State</div>
              <p className="text-sm text-gray-700">{layerInfo.transition.from}</p>
            </div>
            <div className="flex items-center justify-center">
              <div className={`${layerColorsDark[selectedLayer]} text-white px-6 py-3 rounded-full font-bold text-center`}>
                {layerInfo.transition.keyShift}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-green-300">
              <div className="font-bold text-green-700 mb-2">AI-Enabled Future</div>
              <p className="text-sm text-gray-700">{layerInfo.transition.to}</p>
            </div>
          </div>
        </div>

        {/* Cross-Industry View for this Layer */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-bold text-lg mb-4">{selectedLayer} Across Industries</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border p-2 text-left">Industry</th>
                  <th className="border p-2 text-left">Battle</th>
                  <th className="border p-2 text-left">Key Constraint</th>
                </tr>
              </thead>
              <tbody>
                {verticals.map((v) => {
                  const cellData = data[`${selectedLayer}-${v.id}`];
                  return (
                    <tr key={v.id} className={layerColors[selectedLayer]}>
                      <td className="border p-2 font-semibold">{v.name}</td>
                      <td className="border p-2 text-xs">{cellData?.battle || '-'}</td>
                      <td className="border p-2 text-xs text-gray-600">{cellData?.constraints?.substring(0, 150)}...</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // TAB: PROCESS MANUFACTURING DEEP DIVE
  // ============================================

  // ============================================
  // TAB: INDUSTRIES
  // ============================================

  const IndustriesTab = () => {
    const industry = industryData[selectedVertical];

    return (
      <div className="space-y-6">
        {/* Industry Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {verticals.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVertical(v.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedVertical === v.id
                ? 'bg-gray-800 text-white'
                : 'bg-white border hover:bg-gray-50'
                }`}
            >
              {v.name}
            </button>
          ))}
        </div>

        {/* Industry Header */}
        <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-6">
          <h2 className="text-2xl font-bold">{industry.name}</h2>
          <p className="text-gray-600">{industry.subtitle}</p>
        </div>

        {/* Overview */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-bold text-lg mb-4">Industry Overview</h3>
          <div className="space-y-4 text-gray-700">
            {industry.overview.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Layer-by-Layer Analysis */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">AI Transformation by Layer</h3>
          {layers.map((layer) => {
            const cellData = data[`${layer.id}-${selectedVertical}`];
            if (!cellData) return null;
            return (
              <div key={layer.id} className={`${layerColors[layer.id]} border-2 rounded-lg p-4`}>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-2xl font-bold">{layer.id}</div>
                  <div>
                    <div className="font-bold">{layer.name}</div>
                    <div className="text-sm text-purple-700">{layer.theme}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded p-3">
                    <div className="font-semibold text-blue-700 mb-2">Incumbents</div>
                    <ul className="text-sm space-y-1">
                      {cellData.incumbents?.map((inc, i) => <li key={i}>• {inc}</li>)}
                    </ul>
                  </div>
                  <div className="bg-white rounded p-3">
                    <div className="font-semibold text-orange-600 mb-2">Challengers</div>
                    <ul className="text-sm space-y-1">
                      {cellData.challengers?.map((ch, i) => <li key={i}>• {ch}</li>)}
                    </ul>
                  </div>
                  <div className="bg-white rounded p-3">
                    <div className="font-semibold text-green-700 mb-2">Dynamics & Battle</div>
                    <p className="text-sm mb-2">{cellData.dynamics}</p>
                    <div className="font-bold text-purple-700 text-sm border-t pt-2">{cellData.battle}</div>
                  </div>
                  <div className="bg-white rounded p-3">
                    <div className="font-semibold text-gray-700 mb-2">Constraints</div>
                    <p className="text-sm text-gray-600">{cellData.constraints}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Buyers & Sales Motion */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Who Buys & Who Uses</h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border p-3 text-left">Layer</th>
                  <th className="border p-3 text-left">Buyer (Budget Authority)</th>
                  <th className="border p-3 text-left">User (Daily Operator)</th>
                  <th className="border p-3 text-left">Key Pain Points</th>
                </tr>
              </thead>
              <tbody>
                {industry.buyers.map((row, i) => (
                  <tr key={i} className={layerColors[row.layer]}>
                    <td className="border p-3 font-bold">{row.layer}</td>
                    <td className="border p-3 text-sm">{row.buyer}</td>
                    <td className="border p-3 text-sm">{row.user}</td>
                    <td className="border p-3 text-sm">{row.painPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sales Motion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <h4 className="font-bold text-blue-800 mb-3">{industry.salesMotion.topDown.title}</h4>
              <ul className="text-sm space-y-2">
                <li>• <strong>Entry:</strong> {industry.salesMotion.topDown.entry}</li>
                <li>• <strong>Champion:</strong> {industry.salesMotion.topDown.champion}</li>
                <li>• <strong>Cycle:</strong> {industry.salesMotion.topDown.cycle}</li>
                <li>• <strong>Proof:</strong> {industry.salesMotion.topDown.proof}</li>
              </ul>
            </div>

            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
              <h4 className="font-bold text-green-800 mb-3">{industry.salesMotion.bottomUp.title}</h4>
              <ul className="text-sm space-y-2">
                <li>• <strong>Entry:</strong> {industry.salesMotion.bottomUp.entry}</li>
                <li>• <strong>Champion:</strong> {industry.salesMotion.bottomUp.champion}</li>
                <li>• <strong>Cycle:</strong> {industry.salesMotion.bottomUp.cycle}</li>
                <li>• <strong>Proof:</strong> {industry.salesMotion.bottomUp.proof}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // TAB: USE CASES
  // ============================================

  const UseCasesTab = () => {
    // Aggregate all use cases from all industries
    const allUseCases = [];
    Object.entries(industryData).forEach(([industryId, industry]) => {
      if (industry.disruptionUseCases) {
        industry.disruptionUseCases.forEach((useCase, idx) => {
          allUseCases.push({
            ...useCase,
            industryId,
            industryName: industry.name,
            id: `${industryId}-${idx}`
          });
        });
      }
    });

    // Get unique layers from all use cases
    const allLayers = [...new Set(allUseCases.flatMap(uc => uc.layers))].sort((a, b) => {
      const order = ['L6', 'L5', 'L4', 'L3', 'L2', 'L1', 'L0', 'L-1'];
      return order.indexOf(a) - order.indexOf(b);
    });

    // Filter use cases based on selections
    const filteredUseCases = allUseCases.filter(uc => {
      if (useCaseIndustryFilter !== 'all' && uc.industryId !== useCaseIndustryFilter) return false;
      if (useCaseLayerFilter !== 'all' && !uc.layers.includes(useCaseLayerFilter)) return false;
      if (useCaseImpactFilter !== 'all' && uc.impact !== useCaseImpactFilter) return false;
      return true;
    });

    // Group by industry
    const useCasesByIndustry = {};
    filteredUseCases.forEach(uc => {
      if (!useCasesByIndustry[uc.industryId]) {
        useCasesByIndustry[uc.industryId] = {
          name: uc.industryName,
          useCases: []
        };
      }
      useCasesByIndustry[uc.industryId].useCases.push(uc);
    });

    // Group by layer
    const useCasesByLayer = {};
    layers.forEach(layer => {
      useCasesByLayer[layer.id] = {
        name: layer.name,
        theme: layer.theme,
        useCases: filteredUseCases.filter(uc => uc.layers.includes(layer.id))
      };
    });

    // Stats
    const totalUseCases = allUseCases.length;
    const transformationalCount = allUseCases.filter(uc => uc.impact === 'Transformational').length;
    const highCount = allUseCases.filter(uc => uc.impact === 'High').length;
    const mediumCount = allUseCases.filter(uc => uc.impact === 'Medium').length;

    const UseCaseCard = ({ useCase, showIndustry = true }) => (
      <div className="bg-white rounded-lg p-4 border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-bold text-sm text-gray-800">{useCase.title}</h4>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${useCase.impact === 'Transformational' ? 'bg-red-100 text-red-700' :
            useCase.impact === 'High' ? 'bg-orange-100 text-orange-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
            {useCase.impact}
          </span>
        </div>
        {showIndustry && (
          <div className="text-xs text-purple-600 font-medium mb-2">{useCase.industryName}</div>
        )}
        <p className="text-sm text-gray-600 mb-3">{useCase.description}</p>
        <div className="flex flex-wrap gap-1">
          {useCase.layers.map((l, j) => (
            <span key={j} className={`text-xs px-2 py-1 rounded ${layerColors[l] || 'bg-gray-200'}`}>
              {l}: {layers.find(layer => layer.id === l)?.name}
            </span>
          ))}
        </div>
      </div>
    );

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">AI Disruption Use Cases</h2>
          <p className="text-gray-600">Comprehensive catalog of AI transformation opportunities across industries and layers</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-700">{totalUseCases}</div>
            <div className="text-sm text-gray-600">Total Use Cases</div>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-700">{transformationalCount}</div>
            <div className="text-sm text-gray-600">Transformational</div>
          </div>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-700">{highCount}</div>
            <div className="text-sm text-gray-600">High Impact</div>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-700">{mediumCount}</div>
            <div className="text-sm text-gray-600">Medium Impact</div>
          </div>
        </div>

        {/* View Toggle & Filters */}
        <div className="bg-gray-50 rounded-lg border p-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setUseCaseView('byIndustry')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${useCaseView === 'byIndustry' ? 'bg-gray-800 text-white' : 'bg-white border hover:bg-gray-100'
                    }`}
                >
                  By Industry
                </button>
                <button
                  onClick={() => setUseCaseView('byLayer')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${useCaseView === 'byLayer' ? 'bg-gray-800 text-white' : 'bg-white border hover:bg-gray-100'
                    }`}
                >
                  By Layer
                </button>
                <button
                  onClick={() => setUseCaseView('matrix')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${useCaseView === 'matrix' ? 'bg-gray-800 text-white' : 'bg-white border hover:bg-gray-100'
                    }`}
                >
                  Matrix
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Industry Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Industry:</span>
              <select
                value={useCaseIndustryFilter}
                onChange={(e) => setUseCaseIndustryFilter(e.target.value)}
                className="px-3 py-1.5 rounded border text-sm bg-white"
              >
                <option value="all">All Industries</option>
                {verticals.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Layer Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Layer:</span>
              <select
                value={useCaseLayerFilter}
                onChange={(e) => setUseCaseLayerFilter(e.target.value)}
                className="px-3 py-1.5 rounded border text-sm bg-white"
              >
                <option value="all">All Layers</option>
                {layers.map(l => (
                  <option key={l.id} value={l.id}>{l.id}: {l.name}</option>
                ))}
              </select>
            </div>

            {/* Impact Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Impact:</span>
              <select
                value={useCaseImpactFilter}
                onChange={(e) => setUseCaseImpactFilter(e.target.value)}
                className="px-3 py-1.5 rounded border text-sm bg-white"
              >
                <option value="all">All Impacts</option>
                <option value="Transformational">Transformational</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(useCaseIndustryFilter !== 'all' || useCaseLayerFilter !== 'all' || useCaseImpactFilter !== 'all') && (
              <button
                onClick={() => {
                  setUseCaseIndustryFilter('all');
                  setUseCaseLayerFilter('all');
                  setUseCaseImpactFilter('all');
                }}
                className="px-3 py-1.5 rounded text-sm text-red-600 hover:bg-red-50 border border-red-200"
              >
                Clear Filters
              </button>
            )}

            <div className="ml-auto text-sm text-gray-500">
              Showing {filteredUseCases.length} of {totalUseCases} use cases
            </div>
          </div>
        </div>

        {/* BY INDUSTRY VIEW */}
        {useCaseView === 'byIndustry' && (
          <div className="space-y-6">
            {Object.entries(useCasesByIndustry).map(([industryId, industryData]) => (
              <div key={industryId} className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                <div className="bg-gray-800 text-white px-4 py-3">
                  <h3 className="font-bold text-lg">{industryData.name}</h3>
                  <p className="text-sm text-gray-300">{industryData.useCases.length} use cases</p>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {industryData.useCases.map((uc, idx) => (
                      <UseCaseCard key={idx} useCase={uc} showIndustry={false} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {Object.keys(useCasesByIndustry).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No use cases match the current filters
              </div>
            )}
          </div>
        )}

        {/* BY LAYER VIEW */}
        {useCaseView === 'byLayer' && (
          <div className="space-y-6">
            {layers.map(layer => {
              const layerUseCases = useCasesByLayer[layer.id]?.useCases || [];
              if (layerUseCases.length === 0) return null;
              return (
                <div key={layer.id} className={`rounded-lg border-2 overflow-hidden ${layerColors[layer.id]}`}>
                  <div className={`${layerColorsDark[layer.id]} text-white px-4 py-3`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">{layer.id}</span>
                      <div>
                        <h3 className="font-bold text-lg">{layer.name}</h3>
                        <p className="text-sm opacity-90">{layer.theme}</p>
                      </div>
                      <div className="ml-auto bg-white bg-opacity-20 px-3 py-1 rounded">
                        {layerUseCases.length} use cases
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white bg-opacity-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {layerUseCases.map((uc, idx) => (
                        <UseCaseCard key={idx} useCase={uc} showIndustry={true} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MATRIX VIEW */}
        {useCaseView === 'matrix' && (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-bold text-lg mb-4 text-center">Use Case Distribution: Industry × Layer</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm" style={{ minWidth: '900px' }}>
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-800 text-white text-left">Industry / Layer</th>
                    {layers.map(l => (
                      <th key={l.id} className={`border p-2 text-center ${layerColors[l.id]}`}>
                        <div className="font-bold">{l.id}</div>
                        <div className="text-xs font-normal">{l.name}</div>
                      </th>
                    ))}
                    <th className="border p-2 bg-gray-100 text-center font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {verticals.map(v => {
                    const industryUseCases = allUseCases.filter(uc => uc.industryId === v.id);
                    return (
                      <tr key={v.id} className="hover:bg-gray-50">
                        <td className="border p-2 font-medium bg-gray-50">{v.name}</td>
                        {layers.map(l => {
                          const count = industryUseCases.filter(uc => uc.layers.includes(l.id)).length;
                          const useCasesForCell = industryUseCases.filter(uc => uc.layers.includes(l.id));
                          return (
                            <td
                              key={l.id}
                              className={`border p-2 text-center ${count > 0 ? 'cursor-pointer hover:bg-purple-100' : ''}`}
                              title={useCasesForCell.map(uc => uc.title).join('\n')}
                            >
                              {count > 0 ? (
                                <div className="flex flex-col items-center">
                                  <span className="font-bold text-purple-700">{count}</span>
                                  <div className="flex gap-0.5 mt-1">
                                    {useCasesForCell.slice(0, 3).map((uc, i) => (
                                      <span
                                        key={i}
                                        className={`w-2 h-2 rounded-full ${uc.impact === 'Transformational' ? 'bg-red-500' :
                                          uc.impact === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                                          }`}
                                      />
                                    ))}
                                    {useCasesForCell.length > 3 && <span className="text-xs text-gray-400">+{useCasesForCell.length - 3}</span>}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-300">-</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="border p-2 text-center font-bold bg-gray-100">
                          {industryUseCases.length}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-100 font-bold">
                    <td className="border p-2">Total by Layer</td>
                    {layers.map(l => {
                      const count = allUseCases.filter(uc => uc.layers.includes(l.id)).length;
                      return (
                        <td key={l.id} className="border p-2 text-center">{count}</td>
                      );
                    })}
                    <td className="border p-2 text-center bg-purple-100 text-purple-700">{totalUseCases}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span>Transformational</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span>High Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span>Medium Impact</span>
              </div>
            </div>
          </div>
        )}

        {/* Cross-Industry Patterns */}
        <div className="bg-purple-50 rounded-lg border-2 border-purple-200 p-6">
          <h3 className="font-bold text-lg text-purple-800 mb-4">🔍 Cross-Industry Patterns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border">
              <div className="font-bold text-sm mb-2">Most Common Use Cases</div>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Predictive Maintenance (appears in 8/10 industries)</li>
                <li>• AI-Powered Inspection/Quality (appears in 7/10 industries)</li>
                <li>• Digital Twin / Simulation (appears in 6/10 industries)</li>
                <li>• Supply Chain Optimization (appears in 6/10 industries)</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="font-bold text-sm mb-2">Highest Concentration Layers</div>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• <strong>L6 Intelligence:</strong> Most use cases - AI/ML models driving decisions</li>
                <li>• <strong>L3 Operations:</strong> High activity - MES/scheduling optimization</li>
                <li>• <strong>L1 Sensing:</strong> Growing - PdM, quality, and IoT sensors</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="font-bold text-sm mb-2">Transformation Hotspots</div>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• <strong>Autonomous Operations:</strong> Mining, Land Transport, Aerospace</li>
                <li>• <strong>AI-Driven Design:</strong> Discrete Mfg, Aerospace, Construction</li>
                <li>• <strong>Foundation Models:</strong> Process Mfg (bio/chem), Energy (physics)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // TAB: STRATEGIES
  // ============================================

  const StrategiesTab = () => {
    const model = businessModels[selectedModel];
    const [activeModifiers, setActiveModifiers] = useState({
      scope: 'horizontal',
      assetFocus: 'brownfield',
      stack: 'softwareOnly',
      gtm: 'bottomUp',
      aiPositioning: 'aiNative',
    });

    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">Physical AI Strategy Framework</h2>
          <p className="text-gray-600">Two-Tier Model: Pick your Business Model + Configure your Modifiers</p>
        </div>

        {/* Framework Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
              <div className="font-bold text-blue-800 text-lg mb-2">🎯 Tier 1: Business Model</div>
              <p className="text-sm text-gray-600 mb-2">Pick ONE primary business model – this defines your core value proposition and revenue model.</p>
              <div className="flex flex-wrap gap-1">
                {Object.values(businessModels).map((m) => (
                  <span key={m.id} className={`${m.color} px-2 py-0.5 rounded text-xs border`}>{m.icon} {m.name}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
              <div className="font-bold text-purple-800 text-lg mb-2">🔧 Tier 2: Modifiers</div>
              <p className="text-sm text-gray-600 mb-2">Configure modifiers to customize your strategy – real companies combine multiple.</p>
              <div className="flex flex-wrap gap-1">
                {Object.values(strategyModifiers).map((m) => (
                  <span key={m.id} className="bg-gray-100 px-2 py-0.5 rounded text-xs border">{m.icon} {m.name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TIER 1: Business Model Selector */}
        <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
          <h3 className="font-bold text-lg mb-3 text-center">Tier 1: Select Business Model</h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Object.values(businessModels).map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedModel === m.id
                  ? `${m.colorDark} text-white`
                  : `${m.color} border-2 hover:opacity-80`
                  }`}
              >
                {m.icon} {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Business Model Detail */}
        <div className={`${model.color} border-2 rounded-xl p-6`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`${model.colorDark} text-white text-3xl p-3 rounded-lg`}>
              {model.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{model.name}</h2>
              <p className="text-gray-600 italic">"{model.tagline}"</p>
            </div>
          </div>
          <p className="text-gray-700 text-lg">{model.definition}</p>
        </div>

        {/* Model Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* The Thesis */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-xl">💡</span> The Thesis
              </h3>
              <ul className="space-y-2">
                {model.thesis.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 mt-1">✔</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* When to Choose */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-xl">🎯</span> When to Choose This Model
              </h3>
              <ul className="space-y-2">
                {model.whenToChoose.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Layer Fit */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-xl">📍</span> Best Layer Fit
              </h3>
              <div className="flex flex-wrap gap-2">
                {model.layerFit.map((l, i) => (
                  <span key={i} className={`px-3 py-1 rounded-lg text-sm font-medium ${layerColors[l] || 'bg-gray-200'
                    }`}>
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Success Factors */}
            <div className="bg-green-50 rounded-lg border border-green-200 p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-green-800">
                <span className="text-xl">✅</span> Key Success Factors
              </h3>
              <ul className="space-y-2">
                {model.successFactors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Examples */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-xl">🏢</span> Examples
              </h3>
              <div className="space-y-3">
                {model.examples.map((ex, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="font-bold text-sm">{ex.company}</div>
                    <div className="text-xs text-gray-600">{ex.description}</div>
                    <div className="text-xs text-purple-600 mt-1">Modifiers: {ex.modifiers}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risks */}
            <div className="bg-red-50 rounded-lg border border-red-200 p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-red-800">
                <span className="text-xl">⚠️</span> Risks & Challenges
              </h3>
              <ul className="space-y-2">
                {model.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-600 mt-1">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Metrics */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-xl">📊</span> Key Metrics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded p-3 text-center">
                  <div className="text-xs text-gray-500">Capital Required</div>
                  <div className="font-bold text-lg">{model.capitalReq}</div>
                </div>
                <div className="bg-gray-50 rounded p-3 text-center">
                  <div className="text-xs text-gray-500">Time to Revenue</div>
                  <div className="font-bold text-lg">{model.timeToRevenue}</div>
                </div>
                <div className="bg-gray-50 rounded p-3 text-center">
                  <div className="text-xs text-gray-500">Moat Depth</div>
                  <div className="font-bold text-lg">{model.moatDepth}</div>
                </div>
                <div className="bg-gray-50 rounded p-3 text-center">
                  <div className="text-xs text-gray-500">Execution Risk</div>
                  <div className="font-bold text-lg">{model.executionRisk}</div>
                </div>
              </div>
              <div className="mt-3 bg-gray-50 rounded p-3">
                <div className="text-xs text-gray-500 mb-1">Moat Characteristics</div>
                <div className="text-sm">{model.moatCharacteristics}</div>
              </div>
            </div>
          </div>
        </div>

        {/* TIER 2: Modifiers */}
        <div className="bg-purple-50 rounded-lg border-2 border-purple-300 p-4">
          <h3 className="font-bold text-lg mb-4 text-center">Tier 2: Configure Your Modifiers</h3>
          <p className="text-sm text-gray-600 text-center mb-4">Select options for each dimension to customize your strategy</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(strategyModifiers).map((modifier) => (
              <div key={modifier.id} className="bg-white rounded-lg p-4 border">
                <div className="font-bold text-sm mb-2 flex items-center gap-2">
                  <span>{modifier.icon}</span> {modifier.name}
                </div>
                <div className="text-xs text-gray-500 mb-3">{modifier.question}</div>
                <div className="space-y-2">
                  {modifier.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setActiveModifiers({ ...activeModifiers, [modifier.id]: opt.id })}
                      className={`w-full text-left p-2 rounded text-xs transition-colors ${activeModifiers[modifier.id] === opt.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                      <div className="font-semibold">{opt.name}</div>
                      <div className={`${activeModifiers[modifier.id] === opt.id ? 'text-purple-200' : 'text-gray-500'}`}>
                        {opt.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Current Selection Summary */}
          <div className="mt-4 bg-white rounded-lg p-4 border">
            <div className="font-bold text-sm mb-2">Your Strategy Configuration:</div>
            <div className="flex flex-wrap gap-2">
              <span className={`${model.color} px-3 py-1 rounded-lg text-sm font-medium border-2`}>
                {model.icon} {model.name}
              </span>
              {Object.entries(activeModifiers).map(([key, value]) => {
                const modifier = strategyModifiers[key];
                const option = modifier?.options.find(o => o.id === value);
                return (
                  <span key={key} className="bg-purple-100 px-3 py-1 rounded-lg text-sm border border-purple-300">
                    {modifier?.icon} {option?.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Modifier Details */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-bold text-lg mb-4">Modifier Trade-offs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(activeModifiers).map(([key, value]) => {
              const modifier = strategyModifiers[key];
              const option = modifier?.options.find(o => o.id === value);
              if (!option) return null;
              return (
                <div key={key} className="bg-gray-50 rounded-lg p-3 border">
                  <div className="font-bold text-sm mb-2">{modifier.icon} {option.name}</div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs font-semibold text-green-700">Pros:</div>
                      <ul className="text-xs text-gray-600">
                        {option.pros.map((p, i) => <li key={i}>+ {p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-red-700">Cons:</div>
                      <ul className="text-xs text-gray-600">
                        {option.cons.map((c, i) => <li key={i}>- {c}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700">Examples:</div>
                      <div className="text-xs text-gray-500">{option.examples.join(', ')}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Business Model Comparison Matrix */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-bold text-lg mb-4">Business Model Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border p-2 text-left">Model</th>
                  <th className="border p-2 text-center">Capital</th>
                  <th className="border p-2 text-center">Time to Revenue</th>
                  <th className="border p-2 text-center">Moat</th>
                  <th className="border p-2 text-center">Risk</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(businessModels).map((m) => (
                  <tr
                    key={m.id}
                    className={`${m.id === selectedModel ? m.color : 'hover:bg-gray-50'} cursor-pointer`}
                    onClick={() => setSelectedModel(m.id)}
                  >
                    <td className="border p-2 font-medium">
                      <span className="mr-2">{m.icon}</span>{m.name}
                    </td>
                    <td className="border p-2 text-center text-xs">{m.capitalReq}</td>
                    <td className="border p-2 text-center text-xs">{m.timeToRevenue}</td>
                    <td className="border p-2 text-center text-xs">{m.moatDepth}</td>
                    <td className="border p-2 text-center text-xs">{m.executionRisk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Example Company Classifications */}
        <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-4">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="text-xl">🏢</span> Real Company Classifications
          </h3>
          <p className="text-sm text-gray-600 mb-4">How real Physical AI companies combine business models and modifiers:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {companyClassifications.map((c, i) => {
              const m = businessModels[c.model];
              return (
                <div key={i} className="bg-white rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-sm">{c.company}</span>
                    <span className={`${m?.color} px-2 py-0.5 rounded text-xs border`}>{m?.icon} {m?.name}</span>
                  </div>
                  <div className="text-xs text-gray-600">{c.summary}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Model-Layer Fit Matrix */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="text-xl">📚</span> Best Business Models by Layer
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border p-2 text-left">Layer</th>
                  <th className="border p-2 text-left">Best Fit Models</th>
                  <th className="border p-2 text-left">Why</th>
                </tr>
              </thead>
              <tbody>
                {layers.map((layer) => {
                  const fit = modelLayerFit[layer.id];
                  return (
                    <tr key={layer.id} className={layerColors[layer.id]}>
                      <td className="border p-2 font-bold">{layer.id}: {layer.name}</td>
                      <td className="border p-2">
                        <div className="flex flex-wrap gap-1">
                          {fit?.best.map((m, i) => (
                            <span
                              key={i}
                              className={`${businessModels[m]?.color || 'bg-gray-100'} px-2 py-0.5 rounded text-xs cursor-pointer hover:opacity-80 border`}
                              onClick={() => setSelectedModel(m)}
                            >
                              {businessModels[m]?.icon} {businessModels[m]?.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="border p-2 text-xs text-gray-600">{fit?.reason}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Founder-Model Fit */}
        <div className="bg-green-50 rounded-lg border-2 border-green-200 p-4">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="text-xl">👤</span> Founder-Model Fit Guide
          </h3>
          <p className="text-sm text-gray-600 mb-4">Match your background to the right business model and modifiers:</p>
          <div className="space-y-3">
            {founderModelFit.map((fit, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border">
                <div className="font-medium text-sm mb-2">
                  <span className="text-green-600">If you have:</span> {fit.have}
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-gray-500 text-xs">→ Consider:</span>
                  {fit.models.map((m, j) => (
                    <span
                      key={j}
                      className={`${businessModels[m]?.color || 'bg-gray-100'} px-2 py-0.5 rounded text-xs cursor-pointer hover:opacity-80 border`}
                      onClick={() => setSelectedModel(m)}
                    >
                      {businessModels[m]?.icon} {businessModels[m]?.name}
                    </span>
                  ))}
                  <span className="text-gray-400 text-xs">+</span>
                  {fit.modifiers.map((mod, k) => (
                    <span key={k} className="bg-purple-100 px-2 py-0.5 rounded text-xs border border-purple-300">
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pressure Test Questions */}
        <div className="bg-amber-50 rounded-lg border-2 border-amber-200 p-4">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="text-xl">📍</span> 10 Questions to Pressure-Test Your Strategy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pressureTestQuestions.map((q, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border">
                <div className="font-bold text-sm text-amber-800">{i + 1}. {q.q}</div>
                <div className="text-xs text-gray-600 mt-1">{q.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // TAB: KEY PLAYERS
  // ============================================

  const KeyPlayersTab = () => {
    const player = keyPlayersData[selectedPlayer];

    // Group players by category for the dropdown
    const playerCategories = {
      'Industrial AI Platforms': ['palantir', 'cognite'],
      'Predictive Maintenance': ['augury', 'tractian'],
      'Physical AI & Foundation Models': ['physicalintelligence', 'archetypeAI'],
      'Robotics & Automation': ['covariant', 'brightMachines', 'symbioRobotics'],
      'Warehouse & Logistics': ['symbotic', 'locusRobotics'],
      'Visual AI & Safety': ['landingAI', 'voxel'],
      'Defense & Aerospace': ['anduril'],
      'Autonomous Vehicles': ['wayve', 'aurora', 'thirdWave'],
      'Advanced Manufacturing': ['vulcanforms', 'bedrockRobotics'],
      'AI Infrastructure': ['cerebras', 'foxglove']
    };

    return (
      <div className="space-y-6">
        {/* Player Selector - Dropdown */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-gray-600 font-medium">Select Company:</span>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-gray-300 bg-white font-medium text-gray-800 focus:outline-none focus:border-gray-500 cursor-pointer min-w-[280px]"
          >
            {Object.entries(playerCategories).map(([category, playerKeys]) => (
              <optgroup key={category} label={category}>
                {playerKeys.filter(key => keyPlayersData[key]).map(key => (
                  <option key={key} value={key}>
                    {keyPlayersData[key].name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            ({Object.keys(keyPlayersData).length} companies)
          </span>
        </div>

        {/* Player Header */}
        <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-6">
          <div>
            <h2 className="text-3xl font-bold">{player.name}</h2>
            <p className="text-lg text-gray-600">{player.tagline}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Column 1: Heatmap */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-4 h-full">
              <h3 className="font-bold mb-3 text-center">Coverage Heatmap</h3>

              {/* Legend */}
              <div className="flex justify-center gap-4 mb-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span>Challenger</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span>Incumbent</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-1 bg-gray-100">Layer</th>
                      {verticals.map(v => (
                        <th key={v.id} className="border p-1 bg-gray-100" style={{ writingMode: 'vertical-rl', height: '80px' }}>
                          {v.name.substring(0, 8)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {layers.map((l) => (
                      <tr key={l.id}>
                        <td className={`border p-1 font-medium text-xs ${layerColors[l.id]}`}>{l.id}</td>
                        {verticals.map(v => {
                          const status = player.presence[`${l.id}-${v.id}`];
                          const cellColor = status === 'incumbent' ? 'bg-blue-600 text-white' :
                            status === 'challenger' ? 'bg-orange-500 text-white' : 'bg-gray-50';
                          return (
                            <td key={v.id} className={`border p-1 text-center ${cellColor}`}>
                              {status ? '◆' : ''}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Column 2: Strategy */}
          <div className="lg:col-span-2 space-y-4">
            {/* Strategic Thesis */}
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3">Strategic Thesis</h3>
              <p className="text-sm text-gray-700 mb-4">{player.strategy.thesis}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded p-3">
                  <div className="font-semibold text-sm mb-1">The Play</div>
                  <p className="text-xs text-gray-600">{player.strategy.play}</p>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="font-semibold text-sm mb-1">The Wedge</div>
                  <p className="text-xs text-gray-600">{player.strategy.wedge}</p>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="font-semibold text-sm mb-1">The Moat</div>
                  <p className="text-xs text-gray-600">{player.strategy.moat}</p>
                </div>
              </div>
            </div>

            {/* Offerings */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-bold mb-3">Products & Offerings</h3>
              <div className="space-y-2">
                {player.offerings.map((offering, i) => (
                  <div key={i} className="bg-gray-100 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm">{offering.name}</span>
                      <span className="bg-gray-700 text-white text-xs px-2 py-0.5 rounded">{offering.layer}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{offering.description}</p>
                    <p className="text-xs"><strong>Value:</strong> {offering.value}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {offering.industries.map((ind, j) => (
                        <span key={j} className="bg-gray-200 text-xs px-1.5 py-0.5 rounded">{ind}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Buyers & Users + Sales Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Buyers & Users */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-bold mb-3">Who They Sell To & Who Uses</h3>
            <div className="space-y-3">
              <div className="bg-green-50 rounded p-3">
                <div className="font-semibold text-green-800 text-sm mb-1">Executive Buyers (Budget)</div>
                <p className="text-xs text-gray-700">{player.buyers.executive.join(' • ')}</p>
              </div>
              <div className="bg-blue-50 rounded p-3">
                <div className="font-semibold text-blue-800 text-sm mb-1">Champions (Internal Advocates)</div>
                <p className="text-xs text-gray-700">{player.buyers.champion.join(' • ')}</p>
              </div>
              <div className="bg-purple-50 rounded p-3">
                <div className="font-semibold text-purple-800 text-sm mb-1">Daily Users</div>
                <p className="text-xs text-gray-700">{player.buyers.user.join(' • ')}</p>
              </div>
              <div className="bg-red-50 rounded p-3">
                <div className="font-semibold text-red-800 text-sm mb-1">Potential Blockers</div>
                <p className="text-xs text-gray-700">{player.buyers.blocker.join(' • ')}</p>
              </div>
            </div>
          </div>

          {/* Competitive Position */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-bold mb-3">Competitive Position</h3>
            <div className="space-y-3">
              <div className="bg-green-50 rounded p-3">
                <div className="font-semibold text-green-800 text-sm mb-1">Strengths</div>
                <ul className="text-xs text-gray-700">
                  {player.competitivePosition.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>
              <div className="bg-red-50 rounded p-3">
                <div className="font-semibold text-red-800 text-sm mb-1">Weaknesses</div>
                <ul className="text-xs text-gray-700">
                  {player.competitivePosition.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}
                </ul>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <div className="font-semibold text-sm mb-1">vs Incumbents</div>
                <p className="text-xs text-gray-700">{player.competitivePosition.vsIncumbents}</p>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <div className="font-semibold text-sm mb-1">vs Challengers</div>
                <p className="text-xs text-gray-700">{player.competitivePosition.vsChallengers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sales & Engagement Flow */}
        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
          <h3 className="font-bold text-gray-800 mb-4">Sales, Deploy & Expand Flow</h3>

          {/* Phase Timeline */}
          <div className="flex flex-wrap gap-2 mb-4">
            {player.salesFlow.phases.map((phase, i) => (
              <div key={i} className="flex-1 min-w-[200px]">
                <div className="bg-gray-700 text-white text-center py-1 rounded-t text-sm font-bold">
                  {i + 1}. {phase.phase}
                </div>
                <div className="bg-white border rounded-b p-3">
                  <div className="text-xs text-gray-500 mb-1">{phase.duration}</div>
                  <p className="text-xs text-gray-700 mb-2">{phase.activities}</p>
                  <div className="bg-gray-100 rounded p-2">
                    <div className="text-xs font-semibold">Key Action:</div>
                    <p className="text-xs text-gray-700">{phase.keyAction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Model & Expansion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded p-3">
              <div className="font-semibold text-sm mb-1">Commercial Model</div>
              <p className="text-xs text-gray-700">{player.salesFlow.model}</p>
            </div>
            <div className="bg-white rounded p-3">
              <div className="font-semibold text-sm mb-1">Expansion Path</div>
              <p className="text-xs text-gray-700">{player.salesFlow.expansion}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // TAB: FOUNDATION MODELS
  // ============================================

  // ============================================
  // TAB: OTHER RESOURCES
  // ============================================

  const resourceSubPages = [
    { id: 'playbooks', name: 'Playbooks', icon: '📋' },
    { id: 'standards', name: 'Standards & Interoperability', icon: '🔌' },
    { id: 'fms', name: 'Foundation Models', icon: '🧠' },
    { id: 'investment', name: 'Investment & Capital Flows', icon: '💰' },
  ];

  const OtherResourcesTab = () => {
    return (
      <div className="space-y-6">
        {/* Resource Sub-Page Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {resourceSubPages.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedResource(r.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedResource === r.id
                ? 'bg-gray-800 text-white'
                : 'bg-white border-2 border-gray-300 hover:bg-gray-100'
                }`}
            >
              {r.icon} {r.name}
            </button>
          ))}
        </div>

        {/* Sub-Page Content */}
        {selectedResource === 'playbooks' && <PlaybooksTab />}
        {selectedResource === 'standards' && <StandardsTab />}
        {selectedResource === 'fms' && <FMsTab />}
        {selectedResource === 'investment' && <InvestmentTab />}
      </div>
    );
  };

  const FMsTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Physical Foundation Models: The Taxonomy</h2>
        <p className="text-gray-600">Seven categories of FMs transforming physical industries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fmCategories.map((fm) => (
          <div key={fm.id} className={`${fm.color} border-2 rounded-lg p-4`}>
            <div className="font-bold text-lg mb-2">{fm.name}</div>
            <div className="text-sm space-y-2">
              <div><span className="font-semibold">Token Type:</span> {fm.token}</div>
              <div><span className="font-semibold">Predicts:</span> {fm.predicts}</div>
              <div className="border-t pt-2">
                <div className="font-semibold mb-1">Key Companies:</div>
                <div className="flex flex-wrap gap-1">
                  {fm.companies.map((c, i) => (
                    <span key={i} className="bg-white px-2 py-0.5 rounded text-xs">{c}</span>
                  ))}
                </div>
              </div>
              <div className="border-t pt-2">
                <div className="font-semibold mb-1">Primary Verticals:</div>
                <div className="flex flex-wrap gap-1">
                  {fm.verticals.map((v, i) => (
                    <span key={i} className="bg-gray-800 text-white px-2 py-0.5 rounded text-xs">
                      {verticals.find(vert => vert.id === v)?.name || v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FM × Vertical Matrix */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold mb-3">Foundation Model × Vertical Mapping</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100">FM Type</th>
                {verticals.map(v => <th key={v.id} className="border p-1 bg-gray-100 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>{v.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {fmCategories.map((fm) => (
                <tr key={fm.id}>
                  <td className={`border p-2 font-medium ${fm.color}`}>{fm.name}</td>
                  {verticals.map(v => (
                    <td key={v.id} className={`border p-1 text-center ${fm.verticals.includes(v.id) ? 'bg-green-200' : 'bg-gray-50'}`}>
                      {fm.verticals.includes(v.id) ? '✔' : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ============================================
  // STANDARDS & INTEROPERABILITY DATA
  // ============================================

  const industrialProtocols = [
    {
      id: 'opcua',
      name: 'OPC-UA',
      fullName: 'OPC Unified Architecture',
      category: 'Industrial Communication',
      icon: '🔗',
      color: 'bg-blue-100 border-blue-400',
      colorDark: 'bg-blue-600',
      overview: 'Platform-independent, service-oriented architecture for industrial automation. The de facto standard for secure, reliable data exchange from sensor to cloud.',
      history: 'Evolved from classic OPC (OLE for Process Control) which was Windows-only. OPC-UA released 2008 by OPC Foundation. Now supported by all major automation vendors.',
      keyFeatures: [
        'Platform-independent (runs on Linux, embedded, cloud)',
        'Built-in security (encryption, authentication, authorization)',
        'Information modeling with semantic context',
        'Pub/Sub and Client/Server communication patterns',
        'Companion specifications for vertical domains'
      ],
      strengths: [
        'Vendor-neutral, widely adopted',
        'Rich information modeling',
        'Scalable from sensor to enterprise',
        'Strong security architecture'
      ],
      weaknesses: [
        'Complex to implement fully',
        'Higher resource requirements than lightweight protocols',
        'Information model standardization still evolving'
      ],
      adoption: 'High – Required by Industry 4.0 reference architectures. Supported by Siemens, Rockwell, ABB, Honeywell, all major PLCs.',
      layerFit: ['L2', 'L3', 'L4'],
      useCases: ['PLC to MES communication', 'Edge to cloud data flow', 'Multi-vendor automation integration'],
      keyPlayers: ['OPC Foundation', 'Unified Automation', 'Prosys', 'Beckhoff', 'Siemens'],
      competitors: ['MQTT (simpler)', 'Proprietary fieldbus protocols'],
      governance: 'OPC Foundation (non-profit consortium)'
    },
    {
      id: 'mqtt',
      name: 'MQTT',
      fullName: 'Message Queuing Telemetry Transport',
      category: 'IoT Messaging',
      icon: '📡',
      color: 'bg-green-100 border-green-400',
      colorDark: 'bg-green-600',
      overview: 'Lightweight publish-subscribe messaging protocol designed for constrained devices and low-bandwidth networks. The lingua franca of IoT.',
      history: 'Created by IBM in 1999 for oil pipeline telemetry. Open-sourced and standardized by OASIS in 2014. Version 5.0 released 2019 with enhanced features.',
      keyFeatures: [
        'Extremely lightweight (minimal code footprint)',
        'Publish-subscribe with topic-based filtering',
        'Quality of Service levels (0, 1, 2)',
        'Last Will and Testament for connection monitoring',
        'Retained messages for state persistence'
      ],
      strengths: [
        'Simple to implement',
        'Low bandwidth and battery usage',
        'Massive ecosystem and tooling',
        'Works over unreliable networks'
      ],
      weaknesses: [
        'No built-in semantic model (just bytes)',
        'Security is transport-layer (TLS), not native',
        'Broker is single point of failure',
        'No native industrial data types'
      ],
      adoption: 'Very High – Default for IoT platforms. AWS IoT, Azure IoT Hub, Google Cloud IoT all use MQTT.',
      layerFit: ['L1', 'L2', 'L3'],
      useCases: ['Sensor to gateway', 'Edge to cloud telemetry', 'Mobile/remote monitoring'],
      keyPlayers: ['HiveMQ', 'EMQ', 'Mosquitto', 'VerneMQ', 'AWS IoT Core'],
      competitors: ['AMQP (enterprise)', 'CoAP (constrained)', 'OPC-UA Pub/Sub'],
      governance: 'OASIS (open standard)'
    },
    {
      id: 'sparkplugb',
      name: 'Sparkplug B',
      fullName: 'Sparkplug B Specification',
      category: 'Industrial IoT',
      icon: '⚡',
      color: 'bg-yellow-100 border-yellow-400',
      colorDark: 'bg-yellow-600',
      overview: 'MQTT-based specification that adds industrial semantics, state management, and interoperability. Bridges the gap between simple MQTT and industrial requirements.',
      history: 'Created by Cirrus Link Solutions (now part of Inductive Automation). Donated to Eclipse Foundation in 2016. Version 3.0 in development.',
      keyFeatures: [
        'Standardized topic namespace for industrial data',
        'Birth/Death certificates for device state',
        'Metric definitions with data types and metadata',
        'Efficient binary encoding (Protobuf)',
        'Store and forward for offline operation'
      ],
      strengths: [
        'Industrial semantics on top of MQTT',
        'Plug-and-play interoperability',
        'Lighter than OPC-UA',
        'Growing ecosystem (Ignition, etc.)'
      ],
      weaknesses: [
        'Less mature than OPC-UA',
        'Smaller vendor adoption',
        'Limited companion specifications',
        'Requires Sparkplug-aware broker/clients'
      ],
      adoption: 'Growing – Popular in North American oil & gas, utilities. Strong in Ignition ecosystem.',
      layerFit: ['L1', 'L2', 'L3'],
      useCases: ['SCADA modernization', 'Remote asset monitoring', 'Unified Namespace architectures'],
      keyPlayers: ['Inductive Automation (Ignition)', 'Cirrus Link', 'HiveMQ', 'Opto 22'],
      competitors: ['OPC-UA Pub/Sub', 'Proprietary SCADA protocols'],
      governance: 'Eclipse Foundation (open source)'
    },
    {
      id: 'mtconnect',
      name: 'MTConnect',
      fullName: 'MTConnect Standard',
      category: 'Manufacturing Equipment',
      icon: '�icing',
      color: 'bg-purple-100 border-purple-400',
      colorDark: 'bg-purple-600',
      overview: 'Open, royalty-free standard for exchanging data from manufacturing equipment. Designed specifically for CNC machines and factory floor devices.',
      history: 'Launched 2008 by AMT (Association for Manufacturing Technology). Designed by Berkeley Lab and Sun Microsystems. Used extensively in discrete manufacturing.',
      keyFeatures: [
        'RESTful HTTP/XML architecture',
        'Standardized vocabulary for machine data',
        'Streaming data with sample/current/asset requests',
        'Device information models',
        'Condition monitoring built-in'
      ],
      strengths: [
        'Purpose-built for machine tools',
        'Simple HTTP-based access',
        'No licensing fees',
        'Strong in CNC/discrete manufacturing'
      ],
      weaknesses: [
        'Limited to discrete manufacturing focus',
        'XML can be verbose',
        'Less suitable for real-time control',
        'Smaller ecosystem than OPC-UA'
      ],
      adoption: 'Moderate – Strong in North American machine tool industry. Required by some automotive OEMs.',
      layerFit: ['L0', 'L1', 'L3'],
      useCases: ['CNC machine monitoring', 'OEE calculation', 'Factory floor data collection'],
      keyPlayers: ['AMT', 'Mazak', 'Okuma', 'DMG Mori', 'FANUC'],
      competitors: ['OPC-UA', 'Proprietary CNC protocols', 'umati (OPC-UA for machine tools)'],
      governance: 'MTConnect Institute (AMT)'
    },
    {
      id: 'modbus',
      name: 'Modbus',
      fullName: 'Modbus Protocol',
      category: 'Legacy Fieldbus',
      icon: '📟',
      color: 'bg-gray-100 border-gray-400',
      colorDark: 'bg-gray-600',
      overview: 'The oldest and most widely deployed industrial protocol. Simple, reliable, but limited. The "lingua franca" that everything can speak.',
      history: 'Created by Modicon (now Schneider) in 1979. Original serial protocol extended to TCP/IP in 1999. Still ubiquitous 45 years later.',
      keyFeatures: [
        'Extremely simple register-based model',
        'Master/slave architecture',
        'RTU (serial) and TCP (Ethernet) variants',
        'Minimal resource requirements',
        'Universal device support'
      ],
      strengths: [
        'Universal compatibility',
        'Simple to implement',
        'Proven reliability',
        'No licensing costs'
      ],
      weaknesses: [
        'No security (designed pre-internet)',
        'No semantics (just register numbers)',
        'Polling-based (not event-driven)',
        'Limited addressing and data types'
      ],
      adoption: 'Very High – Still dominant in brownfield. Most PLCs, sensors, and devices support Modbus.',
      layerFit: ['L1', 'L2'],
      useCases: ['Legacy device integration', 'Simple sensor polling', 'Building automation'],
      keyPlayers: ['Modbus Organization', 'All automation vendors'],
      competitors: ['OPC-UA', 'EtherNet/IP', 'PROFINET'],
      governance: 'Modbus Organization (open standard)'
    },
    {
      id: 'profinet',
      name: 'PROFINET',
      fullName: 'Process Field Network',
      category: 'Industrial Ethernet',
      icon: '🔌',
      color: 'bg-orange-100 border-orange-400',
      colorDark: 'bg-orange-600',
      overview: 'Siemens-led industrial Ethernet standard for factory automation. Dominant in European discrete manufacturing.',
      history: 'Developed by PROFIBUS International and Siemens. Released 2003. IRT (Isochronous Real-Time) variant for motion control added later.',
      keyFeatures: [
        'Real-time Ethernet communication',
        'IRT for microsecond-level determinism',
        'Integrated safety (PROFIsafe)',
        'IT-friendly (standard Ethernet)',
        'Device profiles for interoperability'
      ],
      strengths: [
        'Excellent real-time performance',
        'Siemens ecosystem integration',
        'Mature and proven',
        'Strong in motion control'
      ],
      weaknesses: [
        'Siemens-centric ecosystem',
        'IRT requires special hardware',
        'Complex configuration',
        'Competes with EtherNet/IP in Americas'
      ],
      adoption: 'High in Europe – Dominant in German manufacturing. Siemens plants standardize on PROFINET.',
      layerFit: ['L1', 'L2'],
      useCases: ['Factory automation', 'Motion control', 'Discrete manufacturing'],
      keyPlayers: ['Siemens', 'Phoenix Contact', 'Wago', 'Pilz', 'Beckhoff'],
      competitors: ['EtherNet/IP (Rockwell)', 'EtherCAT (Beckhoff)', 'CC-Link IE'],
      governance: 'PROFIBUS & PROFINET International (PI)'
    },
    {
      id: 'ethernetip',
      name: 'EtherNet/IP',
      fullName: 'Ethernet Industrial Protocol',
      category: 'Industrial Ethernet',
      icon: '🌐',
      color: 'bg-red-100 border-red-400',
      colorDark: 'bg-red-600',
      overview: 'Rockwell/ODVA-led industrial Ethernet standard. Dominant in North American manufacturing and process industries.',
      history: 'Developed by Rockwell and ODVA. Based on CIP (Common Industrial Protocol). Released 2001. Widely adopted in Americas.',
      keyFeatures: [
        'Standard unmodified Ethernet',
        'CIP protocol for industrial data',
        'Producer/consumer model',
        'Device Level Ring for redundancy',
        'CIP Safety for functional safety'
      ],
      strengths: [
        'Uses standard Ethernet infrastructure',
        'Strong Rockwell ecosystem',
        'Good for process and discrete',
        'CIP Motion for servo control'
      ],
      weaknesses: [
        'Rockwell-centric perception',
        'Less deterministic than PROFINET IRT',
        'CIP complexity',
        'Competes with PROFINET in Europe'
      ],
      adoption: 'High in Americas – Dominant in North American discrete and process. Rockwell plants standardize on EtherNet/IP.',
      layerFit: ['L1', 'L2'],
      useCases: ['Factory automation', 'Process control', 'Packaging'],
      keyPlayers: ['Rockwell Automation', 'ODVA', 'Cisco', 'Molex', 'HMS'],
      competitors: ['PROFINET (Siemens)', 'EtherCAT (Beckhoff)', 'Modbus TCP'],
      governance: 'ODVA (Open DeviceNet Vendors Association)'
    }
  ];

  const industryConsortia = [
    {
      id: 'omp',
      name: 'Open Manufacturing Platform',
      acronym: 'OMP',
      icon: '🏭',
      color: 'bg-blue-100 border-blue-400',
      founded: '2019',
      founders: 'Microsoft, BMW',
      members: 'BMW, Microsoft, Bosch, ZF, Anheuser-Busch InBev, Red Hat, and others',
      focus: 'Cross-company collaboration platform for manufacturing. Standardizing industrial IoT architectures and enabling data sharing across OEMs and suppliers.',
      keyInitiatives: [
        'Manufacturing Reference Architecture',
        'Semantic Data Structuring',
        'IoT Connectivity Stack',
        'Production Data Marketplace (concept)'
      ],
      strategicImportance: 'Attempting to create an "Android for manufacturing" – a shared platform layer that enables automotive OEMs and suppliers to collaborate without giving up competitive advantage.',
      status: 'Active – Growing membership, but still early. Key question is whether competitors will truly share.',
      website: 'open-manufacturing.org'
    },
    {
      id: 'iic',
      name: 'Industrial Internet Consortium',
      acronym: 'IIC',
      icon: '🌐',
      color: 'bg-green-100 border-green-400',
      founded: '2014',
      founders: 'AT&T, Cisco, GE, IBM, Intel',
      members: '200+ members including Bosch, SAP, Siemens, Microsoft, Amazon, and many industrial players',
      focus: 'Accelerating Industrial IoT adoption through testbeds, frameworks, and best practices. Merged with Industry IoT Consortium (2021).',
      keyInitiatives: [
        'Industrial Internet Reference Architecture (IIRA)',
        'Industrial Internet Security Framework (IISF)',
        'Testbed Program (80+ testbeds)',
        'Trustworthiness Framework'
      ],
      strategicImportance: 'Created foundational IIoT architecture and security frameworks now widely referenced. Testbed program validates real-world implementations.',
      status: 'Active – Mature organization with broad influence on standards and architecture thinking.',
      website: 'iiconsortium.org'
    },
    {
      id: 'plattform40',
      name: 'Plattform Industrie 4.0',
      acronym: 'PI 4.0',
      icon: '🇩🇪',
      color: 'bg-yellow-100 border-yellow-400',
      founded: '2013',
      founders: 'German Federal Ministry, BITKOM, VDMA, ZVEI',
      members: 'German government, industry associations, companies, unions, research institutes',
      focus: 'German national initiative for digitalization of manufacturing. Defines reference architectures, standards recommendations, and coordinates German industrial policy.',
      keyInitiatives: [
        'Reference Architecture Model Industrie 4.0 (RAMI 4.0)',
        'Asset Administration Shell (Digital Twin standard)',
        'International cooperation (US, Japan, France, China)',
        'SME support programs'
      ],
      strategicImportance: 'Sets the agenda for German manufacturing digitalization. RAMI 4.0 and Asset Administration Shell are being adopted as global standards.',
      status: 'Active – Very influential in Europe. Shapes EU and international manufacturing standards.',
      website: 'plattform-i40.de'
    },
    {
      id: 'cesmii',
      name: 'CESMII',
      acronym: 'CESMII',
      icon: '🇺🇸',
      color: 'bg-red-100 border-red-400',
      founded: '2016',
      founders: 'US Department of Energy, UCLA',
      members: 'US government, universities, companies (Rockwell, Honeywell, etc.)',
      focus: 'US national smart manufacturing institute. Developing the Smart Manufacturing Innovation Platform (SMIP) and workforce programs.',
      keyInitiatives: [
        'Smart Manufacturing Innovation Platform (SMIP)',
        'SM Profiles (standardized data models)',
        'Smart Manufacturing Marketplace',
        'Workforce development programs'
      ],
      strategicImportance: 'US government-backed effort to accelerate smart manufacturing adoption, especially for small and medium manufacturers.',
      status: 'Active – Growing platform adoption. Key US counterpart to German Industrie 4.0.',
      website: 'cesmii.org'
    },
    {
      id: 'opcfoundation',
      name: 'OPC Foundation',
      acronym: 'OPC',
      icon: '🔗',
      color: 'bg-purple-100 border-purple-400',
      founded: '1996',
      founders: 'Fisher-Rosemount, Rockwell, Microsoft, others',
      members: '900+ members worldwide including all major automation vendors',
      focus: 'Develop and maintain OPC standards for industrial interoperability. Primary home of OPC-UA specification.',
      keyInitiatives: [
        'OPC-UA specification maintenance',
        'Companion specifications (PackML, ISA-95, MDIS, etc.)',
        'Certification and testing',
        'OPC-UA over TSN development'
      ],
      strategicImportance: 'The primary industrial interoperability standards body. OPC-UA is becoming the universal industrial communication protocol.',
      status: 'Very Active – Central to Industry 4.0. Growing rapidly with new companion specifications.',
      website: 'opcfoundation.org'
    },
    {
      id: 'mesa',
      name: 'MESA International',
      acronym: 'MESA',
      icon: '📊',
      color: 'bg-teal-100 border-teal-400',
      founded: '1992',
      founders: 'MES software vendors',
      members: 'Software vendors, manufacturers, consultants',
      focus: 'Manufacturing Execution System standards and best practices. Developed the MESA model and collaborates on ISA-95.',
      keyInitiatives: [
        'MESA Model (11 MES functions)',
        'ISA-95 collaboration',
        'Smart Manufacturing/MOM guidelines',
        'Research and publications'
      ],
      strategicImportance: 'Defined the original MES functional model that shaped the industry. Key partner on ISA-95 development.',
      status: 'Active – Evolved from MES-focused to broader Smart Manufacturing/MOM scope.',
      website: 'mesa.org'
    },
    {
      id: 'mfgusa',
      name: 'Manufacturing USA',
      acronym: 'MFG USA',
      icon: '🏛️',
      color: 'bg-indigo-100 border-indigo-400',
      founded: '2014',
      founders: 'US Department of Commerce, DoD, DoE',
      members: '17 manufacturing innovation institutes, industry, academia',
      focus: 'Network of US manufacturing innovation institutes tackling cross-cutting manufacturing challenges.',
      keyInitiatives: [
        'ARM (robotics)',
        'MxD (digital manufacturing)',
        'CESMII (smart manufacturing)',
        'LIFT (lightweight materials)',
        'PowerAmerica (power electronics)'
      ],
      strategicImportance: 'Coordinates US advanced manufacturing R&D across multiple technology domains. Public-private partnership model.',
      status: 'Active – 17 institutes operational. Key vehicle for US manufacturing policy.',
      website: 'manufacturingusa.com'
    }
  ];

  const dataModelStandards = [
    {
      id: 'isa95',
      name: 'ISA-95',
      fullName: 'ISA-95 Enterprise-Control System Integration',
      altNames: ['IEC 62264', 'ANSI/ISA-95'],
      icon: '📐',
      color: 'bg-blue-100 border-blue-400',
      overview: 'The foundational standard for integrating enterprise (ERP) and control (MES/SCADA) systems. Defines the functional hierarchy, data models, and interfaces between business and manufacturing operations.',
      scope: 'Enterprise to shop floor integration – Levels 0-4 of the Purdue model. Defines what data crosses the L3/L4 boundary and how.',
      keyComponents: [
        { name: 'Part 1: Models & Terminology', description: 'Defines the functional hierarchy (Levels 0-4) and activity models' },
        { name: 'Part 2: Object Models', description: 'Data structures for personnel, equipment, materials, physical assets' },
        { name: 'Part 3: Activity Models', description: 'Defines MES/MOM activities (production, quality, maintenance, inventory)' },
        { name: 'Part 4: Objects & Attributes', description: 'Detailed object models and messaging formats' },
        { name: 'Part 5: B2MML', description: 'Business to Manufacturing Markup Language – XML implementation' }
      ],
      strategicImportance: 'ISA-95 is the "constitution" for manufacturing IT. Every MES, ERP integration, and manufacturing data architecture references it.',
      adoption: 'Universal – All major ERP and MES vendors claim ISA-95 compliance. SAP, Oracle, Siemens, Rockwell, Honeywell all support.',
      limitations: [
        'Designed for traditional batch/discrete – less clear for continuous processes',
        'XML-based B2MML can be verbose',
        'Doesn\'t address cloud, edge, or AI architectures',
        'Slow update cycle vs. technology pace'
      ],
      governance: 'ISA (International Society of Automation) / IEC',
      relatedStandards: ['ISA-88 (Batch Control)', 'ISA-99 (Security)', 'IEC 62443']
    },
    {
      id: 'b2mml',
      name: 'B2MML',
      fullName: 'Business to Manufacturing Markup Language',
      altNames: ['ISA-95 Part 5'],
      icon: '📝',
      color: 'bg-green-100 border-green-400',
      overview: 'XML implementation of ISA-95 data models. Provides the actual message schemas for exchanging production orders, schedules, performance data between ERP and MES.',
      scope: 'Message format standard – Defines XML schemas for ISA-95 object models and transactions.',
      keyComponents: [
        { name: 'Production Schemas', description: 'Production schedules, production performance, production capability' },
        { name: 'Operations Schemas', description: 'Work orders, job lists, operations performance' },
        { name: 'Resource Schemas', description: 'Personnel, equipment, materials, physical assets' },
        { name: 'Transaction Schemas', description: 'Request/response patterns for ERP-MES integration' }
      ],
      strategicImportance: 'B2MML is the de facto standard for ERP-MES messaging. While JSON/REST alternatives exist, B2MML remains the reference for enterprise integration projects.',
      adoption: 'High in regulated industries – Pharma, food, aerospace rely heavily on B2MML for validated integrations.',
      limitations: [
        'XML is dated vs. JSON/REST',
        'Verbose for high-frequency data',
        'Schema complexity',
        'Being augmented by newer approaches (OPC-UA, cloud APIs)'
      ],
      governance: 'MESA International',
      relatedStandards: ['ISA-95', 'BatchML (ISA-88)', 'OAGIS']
    },
    {
      id: 'isa88',
      name: 'ISA-88',
      fullName: 'ISA-88 Batch Control',
      altNames: ['IEC 61512', 'S88'],
      icon: '🧪',
      color: 'bg-purple-100 border-purple-400',
      overview: 'Standard for batch process control. Defines the models, terminology, and data structures for designing and operating batch manufacturing systems.',
      scope: 'Batch process control – Recipes, equipment, procedural control for pharmaceutical, chemical, food & beverage.',
      keyComponents: [
        { name: 'Physical Model', description: 'Enterprise → Site → Area → Process Cell → Unit → Equipment Module → Control Module' },
        { name: 'Procedural Model', description: 'Procedure → Unit Procedure → Operation → Phase' },
        { name: 'Recipe Types', description: 'General, Site, Master, Control recipes' },
        { name: 'PackML/PackTags', description: 'Extension for packaging machine integration' }
      ],
      strategicImportance: 'ISA-88 standardized batch control and enabled MES/batch software interoperability. PackML extended it to packaging.',
      adoption: 'Very high in pharma, food, chemical – Basis for FDA 21 CFR Part 11 compliant batch systems.',
      limitations: [
        'Designed for discrete batch – continuous adaptation less clear',
        'Can be rigid for agile manufacturing',
        'Newer approaches (modular production) challenge the model'
      ],
      governance: 'ISA / IEC',
      relatedStandards: ['ISA-95', 'PackML', 'NAMUR NE148']
    },
    {
      id: 'aas',
      name: 'Asset Administration Shell',
      fullName: 'Asset Administration Shell (Digital Twin Standard)',
      altNames: ['AAS', 'Verwaltungsschale', 'IEC 63278'],
      icon: '🪪',
      color: 'bg-yellow-100 border-yellow-400',
      overview: 'German Industrie 4.0 standard for digital twins. Defines how to create standardized digital representations of assets with submodels for different aspects (identification, technical data, documentation).',
      scope: 'Digital twin interoperability – Standardized structure for representing any physical or logical asset digitally.',
      keyComponents: [
        { name: 'AAS Metamodel', description: 'Structure of asset shell: submodels, properties, operations, events' },
        { name: 'Submodel Templates', description: 'Standardized submodels for nameplate, technical data, documentation, etc.' },
        { name: 'Serialization Formats', description: 'JSON, XML, AASX package format' },
        { name: 'API Specification', description: 'REST API for AAS access and management' }
      ],
      strategicImportance: 'AAS is becoming the global standard for digital twin interoperability. Being adopted beyond Germany into IEC standards.',
      adoption: 'Growing – Strong push from German OEMs (VW, BMW, Siemens). Emerging in other regions.',
      limitations: [
        'Complex specification',
        'Submodel standardization still evolving',
        'Tooling ecosystem maturing',
        'Competition from vendor-specific digital twin platforms'
      ],
      governance: 'Plattform Industrie 4.0 / IDTA / IEC',
      relatedStandards: ['RAMI 4.0', 'OPC-UA', 'AutomationML']
    },
    {
      id: 'rami40',
      name: 'RAMI 4.0',
      fullName: 'Reference Architecture Model Industrie 4.0',
      altNames: ['IEC PAS 63088'],
      icon: '🏗️',
      color: 'bg-orange-100 border-orange-400',
      overview: 'Three-dimensional reference architecture for Industry 4.0. Maps the hierarchy levels (product to connected world), lifecycle (development to maintenance), and functional layers (asset to business).',
      scope: 'Reference architecture – Framework for positioning and relating Industry 4.0 concepts, standards, and use cases.',
      keyComponents: [
        { name: 'Hierarchy Axis', description: 'Product → Field Device → Station → Work Centers → Enterprise → Connected World' },
        { name: 'Life Cycle Axis', description: 'Type (development) → Instance (production/maintenance)' },
        { name: 'Layer Axis', description: 'Asset → Integration → Communication → Information → Functional → Business' }
      ],
      strategicImportance: 'RAMI 4.0 provides the conceptual framework that organizes Industry 4.0 discussions. Used to map where standards and technologies fit.',
      adoption: 'Influential – Referenced in most European Industry 4.0 architectures. US equivalent is NIST Smart Manufacturing model.',
      limitations: [
        'Abstract framework – not directly implementable',
        'Complexity can be overwhelming',
        'Less known outside Europe'
      ],
      governance: 'Plattform Industrie 4.0 / DIN / IEC',
      relatedStandards: ['ISA-95', 'Asset Administration Shell', 'IEC 62890']
    },
    {
      id: 'automationml',
      name: 'AutomationML',
      fullName: 'Automation Markup Language',
      altNames: ['IEC 62714'],
      icon: '🔧',
      color: 'bg-red-100 border-red-400',
      overview: 'XML-based data exchange format for engineering data. Enables exchange of plant topology, geometry, kinematics, logic, and behavior between engineering tools.',
      scope: 'Engineering data exchange – Transfer engineering information between CAD, PLM, simulation, and commissioning tools.',
      keyComponents: [
        { name: 'CAEX (IEC 62424)', description: 'Plant topology and hierarchy' },
        { name: 'COLLADA', description: '3D geometry and kinematics' },
        { name: 'PLCopen XML', description: 'PLC logic (IEC 61131-3)' },
        { name: 'Role Libraries', description: 'Standardized element classifications' }
      ],
      strategicImportance: 'AutomationML enables "digital thread" by allowing engineering data to flow between tools without manual re-entry.',
      adoption: 'Moderate – Supported by major CAD/PLM vendors (Siemens, Dassault, Autodesk). Used in virtual commissioning.',
      limitations: [
        'XML complexity',
        'Requires all tools to support AutomationML',
        'Vendor adoption varies',
        'Runtime data not in scope (design-time focus)'
      ],
      governance: 'AutomationML e.V.',
      relatedStandards: ['RAMI 4.0', 'OPC-UA', 'STEP (ISO 10303)']
    }
  ];

  const protocolBattles = [
    {
      id: 'opcua-vs-mqtt',
      title: 'OPC-UA vs. MQTT: The Communication Protocol War',
      status: 'Converging',
      color: 'bg-blue-50 border-blue-300',
      context: 'The debate over which protocol should be the foundation for industrial IoT communication.',
      positions: [
        { side: 'OPC-UA', argument: 'Rich semantic models, built-in security, vendor-neutral. The "complete" solution for industrial interoperability.' },
        { side: 'MQTT', argument: 'Simple, lightweight, massive ecosystem. Let applications define semantics. MQTT is "TCP/IP for IoT."' },
        { side: 'Both', argument: 'OPC-UA Pub/Sub over MQTT combines OPC-UA semantics with MQTT transport. Best of both worlds.' }
      ],
      resolution: 'Convergence happening: OPC-UA Pub/Sub can use MQTT as transport. Sparkplug B adds industrial semantics to MQTT. Different tools for different layers.',
      implication: 'Startups should support both. OPC-UA for integration with automation vendors; MQTT for cloud/edge IoT patterns. Sparkplug B for simpler industrial use cases.'
    },
    {
      id: 'profinet-vs-ethernetip',
      title: 'PROFINET vs. EtherNet/IP: The Factory Floor Cold War',
      status: 'Regional Stalemate',
      color: 'bg-orange-50 border-orange-300',
      context: 'Two incompatible industrial Ethernet standards backed by automation giants Siemens and Rockwell.',
      positions: [
        { side: 'PROFINET', argument: 'Superior real-time performance with IRT. Siemens ecosystem. Dominant in European discrete manufacturing.' },
        { side: 'EtherNet/IP', argument: 'Standard Ethernet (no special hardware). CIP protocol heritage. Dominant in Americas.' },
        { side: 'Both', argument: 'OPC-UA sits above both and provides interoperability at the information layer.' }
      ],
      resolution: 'Cold war continues. Each dominates its region. OPC-UA provides a bridge at higher layers. Plants typically standardize on one.',
      implication: 'Startups must support both if targeting global manufacturing. Regional focus may allow picking sides. OPC-UA provides escape hatch for multi-vendor environments.'
    },
    {
      id: 'open-vs-proprietary',
      title: 'Open Standards vs. Proprietary Lock-in',
      status: 'Ongoing Tension',
      color: 'bg-green-50 border-green-300',
      context: 'The fundamental tension between open interoperability and vendor ecosystem advantages.',
      positions: [
        { side: 'Open Standards', argument: 'Customer choice, multi-vendor competition, future-proofing. OPC-UA, MQTT, ISA-95 enable best-of-breed.' },
        { side: 'Proprietary', argument: 'Tighter integration, better support, single-vendor accountability. Siemens TIA Portal, Rockwell Studio 5000 ecosystems.' },
        { side: 'Pragmatic', argument: 'Open at the edges (IT integration), proprietary in the core (control). Use standards where they add value.' }
      ],
      resolution: 'No resolution – both models coexist. Trend toward "open at the top, proprietary at the bottom." OPC-UA becoming the standard bridge.',
      implication: 'Startups should be "open by default" – support open standards to maximize addressable market. Proprietary integrations for strategic partnerships.'
    },
    {
      id: 'cloud-vs-edge',
      title: 'Cloud-Native vs. Edge-First Architectures',
      status: 'Architecture War',
      color: 'bg-purple-50 border-purple-300',
      context: 'Where should industrial AI and analytics run? Hyperscalers push cloud; OT teams defend local control.',
      positions: [
        { side: 'Cloud-Native', argument: 'Unlimited compute, centralized AI training, easier updates. AWS IoT, Azure IoT, Google Cloud for Industry.' },
        { side: 'Edge-First', argument: 'Low latency, works offline, data sovereignty. Siemens Industrial Edge, Rockwell Edge.' },
        { side: 'Hybrid', argument: 'Edge for real-time, cloud for training and enterprise. Unified data model spanning both.' }
      ],
      resolution: 'Hybrid winning. Train in cloud, infer at edge. Unified Namespace architectures connecting edge to cloud.',
      implication: 'Startups need hybrid architectures. Cloud-only won\'t work for real-time control. Edge-only limits AI capability. Build for both.'
    },
    {
      id: 'uns-vs-traditional',
      title: 'Unified Namespace vs. Traditional ISA-95 Integration',
      status: 'Emerging Paradigm',
      color: 'bg-yellow-50 border-yellow-300',
      context: 'New architectural pattern (UNS) challenging traditional point-to-point ISA-95 integration approaches.',
      positions: [
        { side: 'Traditional ISA-95', argument: 'Proven, well-understood, vendor-supported. B2MML, standard integrations. "Nobody got fired for buying ISA-95."' },
        { side: 'Unified Namespace', argument: 'Single source of truth via MQTT broker. Event-driven, real-time. Eliminates point-to-point spaghetti.' },
        { side: 'Complementary', argument: 'UNS for operational data flow, ISA-95 models for semantic alignment. Not either/or.' }
      ],
      resolution: 'UNS gaining traction, especially with Sparkplug B. ISA-95 models still valuable for semantics. Emerging pattern: UNS + ISA-95 data models.',
      implication: 'Startups should understand UNS pattern – it\'s becoming popular with progressive manufacturers. Doesn\'t replace ISA-95 semantics.'
    }
  ];

  // ============================================
  // INVESTMENT & CAPITAL FLOW DATA
  // ============================================

  // Notable 2024-2025 Funding Rounds (Physical & Industrial AI)
  const fundingRounds2024_2025 = [
    // L-1 Labor - Humanoids & Labor Replacement
    { company: 'Figure', amount: '$1B', round: 'Series C', date: 'Sep 2025', valuation: '$39B', layer: 'L-1', category: 'Humanoid Robots', investors: 'Parkway Venture Capital, Brookfield, NVIDIA, Intel Capital', notes: 'Largest robotics round ever. General purpose humanoid robots.' },
    { company: 'Figure', amount: '$675M', round: 'Series B', date: 'Feb 2024', valuation: '$2.7B', layer: 'L-1', category: 'Humanoid Robots', investors: 'Microsoft, NVIDIA, OpenAI, Jeff Bezos', notes: 'OpenAI partnership. BMW manufacturing pilot.' },
    { company: 'Apptronik', amount: '$403M', round: 'Series A+Ext', date: 'Feb 2025', valuation: '$2B+', layer: 'L-1', category: 'Humanoid Robots', investors: 'B Capital, Capital Factory, Google', notes: 'Apollo humanoid for industrial work. NASA partnership.' },
    { company: 'Galaxy Bot', amount: '$154M', round: 'Series B', date: 'Jun 2025', valuation: '$1B+', layer: 'L-1', category: 'Humanoid Robots', investors: 'Various Chinese VCs', notes: 'Beijing-based humanoid robot developer.' },
    { company: 'The Bot Company', amount: '$150M', round: 'Series A', date: 'Mar 2025', valuation: '$2B', layer: 'L-1', category: 'Home Robots', investors: 'Greenoaks, Spark Capital', notes: 'Stealth mode. AI-powered home assistant robots. No product/revenue yet.' },
    { company: 'Skydio', amount: '$170M', round: 'Extension', date: 'Nov 2024', valuation: '$2.8B', layer: 'L-1', category: 'Autonomous Drones', investors: 'Andreessen Horowitz', notes: 'Drones replacing human inspectors. Enterprise and military.' },
    { company: 'Nimble Robotics', amount: '$106M', round: 'Series C', date: 'Oct 2024', valuation: '$1.1B', layer: 'L-1', category: 'Warehouse Robotics', investors: 'FedEx, Cedar Pine', notes: 'Autonomous picking replacing warehouse workers.' },
    { company: 'Collaborative Robotics', amount: '$100M', round: 'Series B', date: 'Apr 2024', valuation: '$500M+', layer: 'L-1', category: 'Cobots', investors: 'General Catalyst', notes: 'Cobots augmenting/replacing humans. Industrial carts and boxes.' },
    { company: 'Forterra', amount: '$75M', round: 'Series B', date: 'Nov 2024', valuation: 'N/A', layer: 'L-1', category: 'Autonomous Ground Vehicles', investors: 'Defense investors', notes: 'Autonomous vehicles replacing military drivers.' },
    { company: 'Carbon Robotics', amount: '$70M', round: 'Series C', date: 'May 2024', valuation: '$400M+', layer: 'L-1', category: 'AgTech Robotics', investors: 'Anthos Capital', notes: 'AI weeding robot replacing farm labor.' },
    { company: 'Bear Robotics', amount: '$60M', round: 'Series B', date: 'Mar 2024', valuation: '$300M+', layer: 'L-1', category: 'Service Robots', investors: 'LG Electronics', notes: 'Service robots replacing hospitality staff.' },
    // L6 Intelligence - Foundation Models
    { company: 'Physical Intelligence', amount: '$400M', round: 'Series A', date: 'Nov 2024', valuation: '$2B', layer: 'L6', category: 'Robotics Foundation Model', investors: 'Lux Capital, Sequoia, Jeff Bezos', notes: 'π₀ foundation model for robots. Founded by Google/Berkeley researchers.' },
    { company: 'Skild AI', amount: '$300M', round: 'Series A', date: 'Jul 2024', valuation: '$1.5B', layer: 'L6', category: 'Robot Brain', investors: 'Lightspeed, SoftBank, Bezos Expeditions', notes: 'Scalable robot brain models. Pittsburgh-based.' },
    { company: 'Field AI', amount: '$405M', round: 'Series A+B', date: 'Aug 2025', valuation: '$2B+', layer: 'L6', category: 'Autonomous Systems AI', investors: 'Bezos Expeditions', notes: 'AI systems for operating autonomous robots. Two rounds in same month.' },
    // L3 Operations - Manufacturing Platforms
    { company: 'Bright Machines', amount: '$106M', round: 'Series C', date: 'Jun 2024', valuation: '$1B+', layer: 'L3', category: 'Smart Manufacturing', investors: 'BlackRock, NVIDIA, Microsoft, Eclipse', notes: 'Software-defined manufacturing. Microfactories.' },
    // L1 Sensing - Predictive Maintenance
    { company: 'Augury', amount: '$75M', round: 'Series F', date: 'Feb 2025', valuation: '$1B+', layer: 'L1', category: 'Predictive Maintenance', investors: 'Lightrock, Insight Partners, Eclipse', notes: 'Machine health AI leader. 99.9% failure detection accuracy.' },
    // L0 Physics - Medical/Surgical Equipment
    { company: 'Neuralink', amount: '$650M', round: 'Series D', date: 'May 2025', valuation: '$8.5B', layer: 'L0', category: 'Brain-Computer Interface', investors: 'Founders Fund, DFJ Growth', notes: 'Surgical robots as medical equipment. BCI implants.' },
    { company: 'MMI', amount: '$110M', round: 'Series C', date: 'Feb 2024', valuation: 'N/A', layer: 'L0', category: 'Surgical Robotics', investors: 'Fidelity', notes: 'Robotic-assisted microsurgery equipment.' }
  ];

  const vcFlowByLayer = [
    { layer: 'L6 – Intelligence', funding2024: '$1.1B+', trend: '↑↑↑', hotSpots: 'Robotics FMs, VLAs, Robot Brains', keyDeals: 'Physical Intelligence ($400M), Field AI ($405M), Skild AI ($300M)', notes: 'Foundation models for robotics. AI-native platforms commanding 39x revenue multiples at early stage.' },
    { layer: 'L5 – Supply Chain', funding2024: '$800M', trend: '↑', hotSpots: 'Supply chain AI, network visibility', keyDeals: 'Project44, FourKites follow-ons', notes: 'Consolidation phase. PE roll-ups active. Focus on network effects and data moats.' },
    { layer: 'L4 – Enterprise', funding2024: '$1.2B', trend: '→', hotSpots: 'Industrial data platforms, digital twins', keyDeals: 'Cognite growth, Sight Machine rounds', notes: 'Mature category. Strategic acquirers (Siemens, ABB) active. Premium for AI integration.' },
    { layer: 'L3 – Operations', funding2024: '$600M', trend: '↑', hotSpots: 'MES modernization, smart manufacturing', keyDeals: 'Bright Machines ($106M), Tulip growth', notes: 'Software-defined manufacturing. Cloud MES replacing legacy on-prem.' },
    { layer: 'L2 – Control', funding2024: '$400M', trend: '↑↑', hotSpots: 'Edge AI, software-defined PLCs', keyDeals: 'Bedrock Automation, Litmus edge rounds', notes: 'Edge AI spending $10B+ by 2025. OT security also hot.' },
    { layer: 'L1 – Sensing', funding2024: '$500M', trend: '↑', hotSpots: 'AI sensors, predictive maintenance', keyDeals: 'Augury ($75M Series F, $369M total, $1B+ val)', notes: 'Retrofit opportunity massive. Machine health AI proving 5-20x ROI.' },
    { layer: 'L0 – Physics', funding2024: '$800M', trend: '↑', hotSpots: 'Surgical robotics, medical equipment', keyDeals: 'Neuralink ($650M), MMI ($110M)', notes: 'Physical assets and equipment. Surgical/medical robots as tools.' },
    { layer: 'L-1 – Labor', funding2024: '$3.5B+', trend: '↑↑↑', hotSpots: 'Humanoids, warehouse robots, autonomous vehicles, cobots', keyDeals: 'Figure ($1.7B total, $39B), Apptronik ($403M), Skydio ($170M), Nimble ($106M)', notes: 'The "Skill War" hottest layer. Robots replacing human workers across industries.' }
  ];

  const vcFlowByVertical = [
    { vertical: 'Discrete Manufacturing', funding2024: '$2.1B', trend: '↑↑', drivers: 'Reshoring, automation, AI quality', topFunded: 'Bright Machines, Tulip, Veo Robotics', strategicActivity: 'Siemens, Rockwell, ABB all acquiring' },
    { vertical: 'Process Manufacturing', funding2024: '$800M', trend: '↑', drivers: 'Sustainability, process optimization', topFunded: 'AspenTech ecosystem, Sight Machine', strategicActivity: 'Emerson + AspenTech, AVEVA acquisitions' },
    { vertical: 'Logistics & Warehousing', funding2024: '$1.5B', trend: '↑↑', drivers: 'E-commerce, labor shortage', topFunded: 'Locus, 6 River, Covariant, Nimble', strategicActivity: 'Amazon, Shopify warehouse automation' },
    { vertical: 'Energy & Utilities', funding2024: '$1.2B', trend: '↑', drivers: 'Grid modernization, renewables', topFunded: 'Crusoe ($1.38B), Autogrid, Bidgely', strategicActivity: 'PE consolidation of grid software' },
    { vertical: 'Construction', funding2024: '$600M', trend: '↑', drivers: 'Labor shortage, productivity gap', topFunded: 'ALICE, Built Robotics, nPlan', strategicActivity: 'Procore, Autodesk acquiring point solutions' },
    { vertical: 'Agriculture', funding2024: '$700M', trend: '↑', drivers: 'Precision ag, autonomy, sustainability', topFunded: 'Blue River (John Deere), Carbon Robotics', strategicActivity: 'John Deere, CNH aggressive acquirers' },
    { vertical: 'Aerospace & Defense', funding2024: '$1.8B', trend: '↑↑↑', drivers: 'Defense budgets, autonomy, space', topFunded: 'Anduril ($1.5B), Shield AI, Skydio', strategicActivity: 'Defense primes consolidating autonomy startups' },
    { vertical: 'Mining', funding2024: '$300M', trend: '→', drivers: 'Automation, safety, ESG', topFunded: 'MineSense, SafeAI', strategicActivity: 'Caterpillar, Komatsu internal development' }
  ];

  const majorMADeals2024_2025 = [
    { acquirer: 'Siemens', target: 'Altair Engineering', value: '$10.6B', category: 'L6 Intelligence', rationale: 'AI-powered simulation, digital twin enhancement', multiple: '~11x revenue' },
    { acquirer: 'Siemens', target: 'Dotmatics', value: '$5.1B', category: 'L4 Enterprise', rationale: 'Life sciences R&D software, AI drug discovery', multiple: '~17x revenue' },
    { acquirer: 'Siemens', target: 'Inspekto', value: 'Undisclosed', category: 'L1 Sensing', rationale: 'AI-based visual inspection, autonomous QC', multiple: 'N/A' },
    { acquirer: 'AVEVA (Schneider)', target: 'OSIsoft', value: '$5B', category: 'L4 Enterprise', rationale: 'PI System, industrial data historian dominance', multiple: '~12x revenue' },
    { acquirer: 'Emerson', target: 'AspenTech (majority)', value: '$11B', category: 'L6 Intelligence', rationale: 'Process simulation + automation integration', multiple: '~8x revenue' },
    { acquirer: 'NVIDIA', target: 'Run:ai', value: '$700M', category: 'L6 Intelligence', rationale: 'GPU workload orchestration for industrial AI', multiple: '~35x revenue' },
    { acquirer: 'Rockwell', target: 'Plex Systems', value: '$2.2B', category: 'L3 Operations', rationale: 'Cloud MES, smart manufacturing platform', multiple: '~15x revenue' },
    { acquirer: 'Rockwell', target: 'Fiix', value: '$500M', category: 'L3 Operations', rationale: 'AI-powered CMMS, maintenance optimization', multiple: '~12x revenue' },
    { acquirer: 'THK Group', target: 'Liberty Robotics', value: 'Undisclosed', category: 'L0 Physics', rationale: '3D vision for automotive, packaging, logistics', multiple: 'N/A' },
    { acquirer: 'Kubota', target: 'Bloomfield Robotics', value: 'Undisclosed', category: 'L1 Sensing', rationale: 'Crop monitoring, agricultural AI', multiple: 'N/A' }
  ];

  const tamByLayer = [
    { layer: 'L6 – Intelligence', tam2024: '$4-6B', tam2030: '$50-80B', cagr: '35-45%', segments: 'Industrial AI ($4.4B), Manufacturing AI ($5.3B), Physics FMs (emerging)', notes: 'Fastest growing. AI in manufacturing to hit $84-155B by 2030-2031.' },
    { layer: 'L5 – Supply Chain', tam2024: '$8B', tam2030: '$25B', cagr: '20%', segments: 'Supply chain visibility, planning, execution', notes: 'Mature but AI injection driving new growth cycle.' },
    { layer: 'L4 – Enterprise', tam2024: '$45B', tam2030: '$80B', cagr: '10%', segments: 'ERP ($45B), Industrial software ($21.5B), PLM ($8B)', notes: 'Largest TAM. Siemens, SAP, Oracle dominant. Challengers attacking edges.' },
    { layer: 'L3 – Operations', tam2024: '$12B', tam2030: '$25B', cagr: '13%', segments: 'MES ($12B), SCADA ($8B), APS ($3B)', notes: 'Cloud MES growing fastest. Legacy to SaaS migration.' },
    { layer: 'L2 – Control', tam2024: '$15B', tam2030: '$30B', cagr: '12%', segments: 'PLC/DCS ($15B), Edge AI ($2B growing to $10B)', notes: 'Hardware-centric but software-defined edge emerging.' },
    { layer: 'L1 – Sensing', tam2024: '$25B', tam2030: '$50B', cagr: '12%', segments: 'Industrial sensors, machine vision, LiDAR', notes: 'AI sensors premium segment. Computer vision fastest growth.' },
    { layer: 'L0 – Physics', tam2024: '$70B', tam2030: '$150B', cagr: '12%', segments: 'Industrial robots ($16B), Mobile robots ($6B), Humanoids (emerging)', notes: 'Robotics $6B+ in 2025 VC. Humanoids capturing outsized attention.' },
    { layer: 'L-1 – Labor', tam2024: '$3B', tam2030: '$15B', cagr: '25%', segments: 'Industrial AR/VR, workforce management, copilots', notes: 'Underpenetrated. Industrial copilots could be massive.' }
  ];

  const valuationBenchmarks = [
    { category: 'AI-Native Industrial Platform', revenueMultiple: '8-15x', ebitdaMultiple: '30-50x', characteristics: 'Strong AI IP, 30%+ growth, >120% NRR', examples: 'C3 AI, Palantir AIP, Cognite' },
    { category: 'Industrial SaaS (High Growth)', revenueMultiple: '5-10x', ebitdaMultiple: '20-30x', characteristics: '20-40% growth, >100% NRR, cloud-native', examples: 'Tulip, Augury, Sight Machine' },
    { category: 'Industrial SaaS (Mature)', revenueMultiple: '3-6x', ebitdaMultiple: '12-18x', characteristics: '10-20% growth, stable margins, sticky customers', examples: 'Most vertical SaaS, established MES vendors' },
    { category: 'Robotics (Pre-Revenue)', revenueMultiple: '30-50x (on projections)', ebitdaMultiple: 'N/A', characteristics: 'AI-native, humanoid/general purpose, strong team', examples: 'Figure ($39B), Physical Intelligence ($2B)' },
    { category: 'Robotics (Revenue Stage)', revenueMultiple: '5-12x', ebitdaMultiple: '20-35x', characteristics: 'Proven deployments, recurring RaaS revenue', examples: 'Covariant, Locus Robotics, 6 River' },
    { category: 'Industrial Hardware + Software', revenueMultiple: '2-5x', ebitdaMultiple: '10-15x', characteristics: 'Hardware-attached software, service revenue', examples: 'IoT platforms, edge computing' },
    { category: 'Defense/Gov AI', revenueMultiple: '10-20x', ebitdaMultiple: '25-40x', characteristics: 'Classified contracts, long cycles, high barriers', examples: 'Anduril, Palantir Gov, Shield AI' }
  ];

  const investorLandscape = [
    { category: 'Industrial-Focused VCs', investors: 'Eclipse Ventures, DCVC, Lux Capital, Energy Impact Partners, Congruent Ventures', focus: 'Deep tech, hard tech, industrial transformation', checkSize: '$10-50M Series A/B', notes: 'Best partners for industrial-first companies. Understand long sales cycles.' },
    { category: 'AI-Focused VCs', investors: 'a16z, Sequoia, Greylock, Index, Accel', focus: 'AI/ML platforms, foundation models, autonomy', checkSize: '$20-100M+ Series B+', notes: 'Chasing robotics FMs. Figure, Physical Intelligence mega-rounds.' },
    { category: 'Corporate VCs', investors: 'Intel Capital, NVIDIA, Siemens Next47, ABB Technology Ventures, Honeywell Ventures', focus: 'Strategic alignment, ecosystem building', checkSize: '$5-30M', notes: 'Can provide customer access. Watch for strategic strings.' },
    { category: 'Growth Equity', investors: 'General Atlantic, Tiger Global, Coatue, Insight Partners, ICONIQ', focus: 'Proven models, path to $100M+ ARR', checkSize: '$50-200M+', notes: 'Concentrated in late-stage leaders. High bar for metrics.' },
    { category: 'PE (Industrial Software)', investors: 'Vista Equity, Thoma Bravo, Francisco Partners, HGGC, TA Associates', focus: 'Profitable software, consolidation plays', checkSize: '$100M-$1B+', notes: 'Active in industrial software roll-ups. EBITDA-focused.' },
    { category: 'Strategic Acquirers', investors: 'Siemens, Rockwell, ABB, Emerson, Honeywell, Schneider', focus: 'Fill portfolio gaps, AI capabilities, market expansion', checkSize: '$100M-$10B', notes: 'Siemens most aggressive ($15B+ in 2024). Premium for AI.' }
  ];

  const InvestmentTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Investment & Capital Flows</h2>
        <p className="text-gray-600">Where money is flowing in Physical & Industrial AI – VC, M&A, and valuation benchmarks</p>
      </div>

      {/* Key Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-100 rounded-lg p-4 text-center border-2 border-green-400">
          <div className="text-3xl font-bold text-green-800">$100B+</div>
          <div className="text-sm text-green-700">Global AI VC (2024)</div>
        </div>
        <div className="bg-blue-100 rounded-lg p-4 text-center border-2 border-blue-400">
          <div className="text-3xl font-bold text-blue-800">$8.5B+</div>
          <div className="text-sm text-blue-700">Robotics VC (2025 YTD)</div>
        </div>
        <div className="bg-purple-100 rounded-lg p-4 text-center border-2 border-purple-400">
          <div className="text-3xl font-bold text-purple-800">$7.2B</div>
          <div className="text-sm text-purple-700">Robotics VC (2024)</div>
        </div>
        <div className="bg-orange-100 rounded-lg p-4 text-center border-2 border-orange-400">
          <div className="text-3xl font-bold text-orange-800">$15B+</div>
          <div className="text-sm text-orange-700">Siemens M&A (2024)</div>
        </div>
      </div>

      {/* Notable 2024-2025 Funding Rounds */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-xl mb-4">🚀 Notable Physical & Industrial AI Funding Rounds (2024-2025)</h3>
        <p className="text-sm text-gray-600 mb-3">Major deals in robotics, manufacturing AI, and industrial automation. Humanoid robots and foundation models dominating capital flows.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-2 text-left">Company</th>
                <th className="border p-2 text-center">Amount</th>
                <th className="border p-2 text-center">Round</th>
                <th className="border p-2 text-center">Date</th>
                <th className="border p-2 text-center">Valuation</th>
                <th className="border p-2 text-center">Layer</th>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Key Investors</th>
              </tr>
            </thead>
            <tbody>
              {fundingRounds2024_2025.map((deal, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="border p-2 font-bold text-blue-700">{deal.company}</td>
                  <td className="border p-2 text-center font-bold text-green-700">{deal.amount}</td>
                  <td className="border p-2 text-center">{deal.round}</td>
                  <td className="border p-2 text-center text-gray-600">{deal.date}</td>
                  <td className="border p-2 text-center font-semibold">{deal.valuation}</td>
                  <td className="border p-2 text-center">{deal.layer}</td>
                  <td className="border p-2">{deal.category}</td>
                  <td className="border p-2 text-gray-600 text-xs">{deal.investors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-red-50 p-2 rounded">
            <strong>🤖 L-1 Labor Replacement:</strong> Figure ($1.7B, $39B val), Apptronik ($403M), Nimble ($106M), Skydio ($170M), Carbon Robotics ($70M) – humanoids, warehouse bots, drones replacing workers
          </div>
          <div className="bg-indigo-50 p-2 rounded">
            <strong>🧠 L6 Robot Brains:</strong> Physical Intelligence ($400M at $2B), Skild AI ($300M at $1.5B), Field AI ($405M) – foundation models powering embodied AI
          </div>
          <div className="bg-green-50 p-2 rounded">
            <strong>🏭 L1-L3 Industrial:</strong> Augury ($75M, $1B+), Bright Machines ($106M) – sensing, operations, proven ROI in manufacturing
          </div>
        </div>
      </div>

      {/* VC Flow by Layer */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-xl mb-4">💵 VC Funding by Technology Layer</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-2 text-left">Layer</th>
                <th className="border p-2 text-center">2024 Funding</th>
                <th className="border p-2 text-center">Trend</th>
                <th className="border p-2 text-left">Hot Spots</th>
                <th className="border p-2 text-left">Key Deals</th>
                <th className="border p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {vcFlowByLayer.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="border p-2 font-semibold">{row.layer}</td>
                  <td className="border p-2 text-center font-bold text-green-700">{row.funding2024}</td>
                  <td className="border p-2 text-center text-lg">{row.trend}</td>
                  <td className="border p-2">{row.hotSpots}</td>
                  <td className="border p-2 text-gray-600">{row.keyDeals}</td>
                  <td className="border p-2 text-gray-500 italic">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VC Flow by Vertical */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-xl mb-4">🏭 VC Funding by Industry Vertical</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-2 text-left">Vertical</th>
                <th className="border p-2 text-center">2024 Funding</th>
                <th className="border p-2 text-center">Trend</th>
                <th className="border p-2 text-left">Key Drivers</th>
                <th className="border p-2 text-left">Top Funded</th>
                <th className="border p-2 text-left">Strategic Activity</th>
              </tr>
            </thead>
            <tbody>
              {vcFlowByVertical.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="border p-2 font-semibold">{row.vertical}</td>
                  <td className="border p-2 text-center font-bold text-green-700">{row.funding2024}</td>
                  <td className="border p-2 text-center text-lg">{row.trend}</td>
                  <td className="border p-2">{row.drivers}</td>
                  <td className="border p-2 text-gray-600">{row.topFunded}</td>
                  <td className="border p-2 text-gray-500 italic">{row.strategicActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Major M&A Deals */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-xl mb-4">🤝 Major M&A Activity (2024-2025)</h3>
        <p className="text-sm text-gray-600 mb-3">Strategic acquirers aggressively building AI capabilities through acquisition. Siemens leading with $15B+ deployed.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-2 text-left">Acquirer</th>
                <th className="border p-2 text-left">Target</th>
                <th className="border p-2 text-center">Value</th>
                <th className="border p-2 text-center">Layer</th>
                <th className="border p-2 text-left">Strategic Rationale</th>
                <th className="border p-2 text-center">Multiple</th>
              </tr>
            </thead>
            <tbody>
              {majorMADeals2024_2025.map((deal, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="border p-2 font-semibold">{deal.acquirer}</td>
                  <td className="border p-2 font-semibold text-blue-700">{deal.target}</td>
                  <td className="border p-2 text-center font-bold text-green-700">{deal.value}</td>
                  <td className="border p-2 text-center">{deal.category}</td>
                  <td className="border p-2">{deal.rationale}</td>
                  <td className="border p-2 text-center text-gray-600">{deal.multiple}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TAM by Layer */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-xl mb-4">📊 Market Sizing (TAM/SAM) by Layer</h3>
        <p className="text-sm text-gray-600 mb-3">Total addressable markets vary widely. L4 Enterprise largest, L6 Intelligence fastest growing.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-2 text-left">Layer</th>
                <th className="border p-2 text-center">TAM 2024</th>
                <th className="border p-2 text-center">TAM 2030</th>
                <th className="border p-2 text-center">CAGR</th>
                <th className="border p-2 text-left">Key Segments</th>
                <th className="border p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {tamByLayer.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="border p-2 font-semibold">{row.layer}</td>
                  <td className="border p-2 text-center font-bold">{row.tam2024}</td>
                  <td className="border p-2 text-center font-bold text-green-700">{row.tam2030}</td>
                  <td className="border p-2 text-center text-blue-700">{row.cagr}</td>
                  <td className="border p-2">{row.segments}</td>
                  <td className="border p-2 text-gray-500 italic">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Valuation Benchmarks */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-xl mb-4">📈 Valuation Multiples & Benchmarks</h3>
        <p className="text-sm text-gray-600 mb-3">2024-2025 valuation context. Public SaaS trading 5.5-8x ARR. AI-native commanding premiums. PE focused on EBITDA.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-center">Revenue Multiple</th>
                <th className="border p-2 text-center">EBITDA Multiple</th>
                <th className="border p-2 text-left">Key Characteristics</th>
                <th className="border p-2 text-left">Examples</th>
              </tr>
            </thead>
            <tbody>
              {valuationBenchmarks.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="border p-2 font-semibold">{row.category}</td>
                  <td className="border p-2 text-center font-bold text-green-700">{row.revenueMultiple}</td>
                  <td className="border p-2 text-center font-bold text-blue-700">{row.ebitdaMultiple}</td>
                  <td className="border p-2">{row.characteristics}</td>
                  <td className="border p-2 text-gray-600 italic">{row.examples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          <strong>Note:</strong> Multiples vary significantly based on growth rate, NRR, gross margin, and market conditions. AI-native platforms command 2-3x premium over traditional industrial software. PE buyers discount for growth but pay for profitability.
        </div>
      </div>

      {/* Investor Landscape */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-xl mb-4">🎯 Investor Landscape</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investorLandscape.map((cat, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-4 border">
              <div className="font-bold text-lg mb-2">{cat.category}</div>
              <div className="text-sm space-y-2">
                <div><span className="font-semibold">Key Investors:</span> {cat.investors}</div>
                <div><span className="font-semibold">Focus:</span> {cat.focus}</div>
                <div><span className="font-semibold">Typical Check:</span> <span className="text-green-700 font-bold">{cat.checkSize}</span></div>
                <div className="text-gray-500 italic text-xs">{cat.notes}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Investment Themes */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200 p-4">
        <h3 className="font-bold text-xl mb-4">🔑 Key Investment Themes (2025)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="font-bold text-green-700 mb-2">✅ Hot (Capital Flowing)</div>
            <ul className="text-sm space-y-1">
              <li>• <strong>Humanoid Robots (L-1)</strong> – Figure, Apptronik, 1X – labor replacement play</li>
              <li>• <strong>Robotics Foundation Models (L6)</strong> – VLAs, world models, robot brains</li>
              <li>• <strong>Defense/Autonomy</strong> – Anduril, Shield AI, Skydio</li>
              <li>• <strong>Predictive Maintenance AI (L1)</strong> – Augury, Uptake, SparkCognition</li>
              <li>• <strong>Edge AI (L2)</strong> – NVIDIA Jetson ecosystem, Qualcomm IQ</li>
              <li>• <strong>Retrofit Autonomy</strong> – Bedrock Robotics, SafeAI, autonomous tractors</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="font-bold text-red-700 mb-2">❌ Cold (Capital Scarce)</div>
            <ul className="text-sm space-y-1">
              <li>• <strong>Generic IoT Platforms</strong> – Commoditized, no differentiation</li>
              <li>• <strong>Hardware-Only Plays</strong> – Need software/AI for premium valuations</li>
              <li>• <strong>Legacy MES Modernization</strong> – Slow, low margins, long sales cycles</li>
              <li>• <strong>Point Solutions</strong> – Acqui-hire risk without platform potential</li>
              <li>• <strong>AR/VR Industrial</strong> – Promise unfulfilled, Apple/Meta uncertainty</li>
              <li>• <strong>Early-Stage SaaS</strong> – Series A drought continues into 2026</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 bg-white rounded-lg p-4">
          <div className="font-bold text-blue-700 mb-2">💡 Investor Perspective</div>
          <div className="text-sm text-gray-700 italic">
            "AI robotics startups that don't lead with AI risk being overlooked. Hardware alone is not enough. Investors seek integrated platforms with strong software IP, preferably trained on proprietary datasets. RaaS business models gaining traction, offering recurring revenue and faster paths to profitability." – Marion Street Capital, 2025
          </div>
        </div>
      </div>
    </div>
  );

  const StandardsTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Standards & Interoperability Landscape</h2>
        <p className="text-gray-600">The protocols, consortia, and data models shaping industrial connectivity</p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">🔌</div>
          <div className="font-bold">Communication Protocols</div>
          <div className="text-xs text-gray-600">OPC-UA, MQTT, Sparkplug B, MTConnect</div>
        </div>
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">🤝</div>
          <div className="font-bold">Industry Consortia</div>
          <div className="text-xs text-gray-600">OMP, IIC, CESMII, Plattform I4.0</div>
        </div>
        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">📐</div>
          <div className="font-bold">Data Model Standards</div>
          <div className="text-xs text-gray-600">ISA-95, B2MML, ISA-88, AAS</div>
        </div>
        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">⚔️</div>
          <div className="font-bold">Protocol Battles</div>
          <div className="text-xs text-gray-600">Open vs Proprietary, Cloud vs Edge</div>
        </div>
      </div>

      {/* Industrial Communication Protocols */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <span>🔌</span> Industrial Communication Protocols
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          The protocols that move data from sensors to cloud. Understanding these is essential for any Physical AI startup.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {industrialProtocols.map((protocol) => (
            <div key={protocol.id} className={`${protocol.color} border-2 rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{protocol.icon}</span>
                <div>
                  <div className="font-bold text-lg">{protocol.name}</div>
                  <div className="text-xs text-gray-600">{protocol.fullName}</div>
                </div>
                <span className={`ml-auto ${protocol.colorDark} text-white text-xs px-2 py-0.5 rounded`}>
                  {protocol.category}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-3">{protocol.overview}</p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white rounded p-2">
                  <div className="font-semibold text-xs text-green-700 mb-1">Strengths</div>
                  <ul className="text-xs text-gray-600">
                    {protocol.strengths.slice(0, 3).map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="font-semibold text-xs text-red-700 mb-1">Weaknesses</div>
                  <ul className="text-xs text-gray-600">
                    {protocol.weaknesses.slice(0, 3).map((w, i) => <li key={i}>• {w}</li>)}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                <span className="text-xs font-semibold">Layer Fit:</span>
                {protocol.layerFit.map((l, i) => (
                  <span key={i} className={`${layerColors[l] || 'bg-gray-200'} text-xs px-1.5 py-0.5 rounded`}>{l}</span>
                ))}
              </div>

              <div className="text-xs text-gray-500">
                <span className="font-semibold">Adoption:</span> {protocol.adoption}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Comparison Matrix */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-lg mb-4">Protocol Comparison Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-2 text-left">Protocol</th>
                <th className="border p-2 text-center">Semantics</th>
                <th className="border p-2 text-center">Security</th>
                <th className="border p-2 text-center">Real-Time</th>
                <th className="border p-2 text-center">Complexity</th>
                <th className="border p-2 text-center">Adoption</th>
                <th className="border p-2 text-left">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-blue-50">
                <td className="border p-2 font-bold">OPC-UA</td>
                <td className="border p-2 text-center">⭐⭐⭐⭐⭐</td>
                <td className="border p-2 text-center">⭐⭐⭐⭐⭐</td>
                <td className="border p-2 text-center">⭐⭐⭐</td>
                <td className="border p-2 text-center">High</td>
                <td className="border p-2 text-center">Very High</td>
                <td className="border p-2">Enterprise integration, multi-vendor</td>
              </tr>
              <tr className="bg-green-50">
                <td className="border p-2 font-bold">MQTT</td>
                <td className="border p-2 text-center">⭐</td>
                <td className="border p-2 text-center">⭐⭐⭐</td>
                <td className="border p-2 text-center">⭐⭐⭐</td>
                <td className="border p-2 text-center">Low</td>
                <td className="border p-2 text-center">Very High</td>
                <td className="border p-2">IoT, cloud connectivity, telemetry</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="border p-2 font-bold">Sparkplug B</td>
                <td className="border p-2 text-center">⭐⭐⭐</td>
                <td className="border p-2 text-center">⭐⭐⭐</td>
                <td className="border p-2 text-center">⭐⭐⭐</td>
                <td className="border p-2 text-center">Medium</td>
                <td className="border p-2 text-center">Growing</td>
                <td className="border p-2">SCADA modernization, UNS</td>
              </tr>
              <tr className="bg-purple-50">
                <td className="border p-2 font-bold">MTConnect</td>
                <td className="border p-2 text-center">⭐⭐⭐⭐</td>
                <td className="border p-2 text-center">⭐⭐</td>
                <td className="border p-2 text-center">⭐⭐</td>
                <td className="border p-2 text-center">Medium</td>
                <td className="border p-2 text-center">Moderate</td>
                <td className="border p-2">CNC machines, discrete mfg</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2 font-bold">Modbus</td>
                <td className="border p-2 text-center">⭐</td>
                <td className="border p-2 text-center">⭐</td>
                <td className="border p-2 text-center">⭐⭐</td>
                <td className="border p-2 text-center">Very Low</td>
                <td className="border p-2 text-center">Universal</td>
                <td className="border p-2">Legacy integration, simple devices</td>
              </tr>
              <tr className="bg-orange-50">
                <td className="border p-2 font-bold">PROFINET</td>
                <td className="border p-2 text-center">⭐⭐⭐</td>
                <td className="border p-2 text-center">⭐⭐⭐⭐</td>
                <td className="border p-2 text-center">⭐⭐⭐⭐⭐</td>
                <td className="border p-2 text-center">High</td>
                <td className="border p-2 text-center">High (EU)</td>
                <td className="border p-2">Siemens automation, motion control</td>
              </tr>
              <tr className="bg-red-50">
                <td className="border p-2 font-bold">EtherNet/IP</td>
                <td className="border p-2 text-center">⭐⭐⭐</td>
                <td className="border p-2 text-center">⭐⭐⭐⭐</td>
                <td className="border p-2 text-center">⭐⭐⭐⭐</td>
                <td className="border p-2 text-center">High</td>
                <td className="border p-2 text-center">High (US)</td>
                <td className="border p-2">Rockwell automation, process control</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Industry Consortia */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <span>🤝</span> Industry Consortia & Standards Bodies
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          The organizations shaping industrial standards. Understanding who drives standards helps navigate the landscape.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industryConsortia.map((org) => (
            <div key={org.id} className={`${org.color} border-2 rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{org.icon}</span>
                <div>
                  <div className="font-bold">{org.name}</div>
                  <div className="text-xs text-gray-600">Est. {org.founded}</div>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{org.focus}</p>

              <div className="bg-white rounded p-2 mb-2">
                <div className="font-semibold text-xs mb-1">Key Initiatives</div>
                <ul className="text-xs text-gray-600">
                  {org.keyInitiatives.slice(0, 3).map((init, i) => <li key={i}>• {init}</li>)}
                </ul>
              </div>

              <div className="text-xs text-gray-500">
                <span className="font-semibold">Status:</span> {org.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Model Standards */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <span>📐</span> Data Model Standards
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          The semantic frameworks that define how industrial data is structured. These standards ensure that "production order" means the same thing in SAP and on the shop floor.
        </p>

        <div className="space-y-4">
          {dataModelStandards.map((standard) => (
            <div key={standard.id} className={`${standard.color} border-2 rounded-lg p-4`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{standard.icon}</span>
                <div>
                  <div className="font-bold text-lg">{standard.name}</div>
                  <div className="text-sm text-gray-600">{standard.fullName}</div>
                  {standard.altNames && (
                    <div className="text-xs text-gray-500">Also known as: {standard.altNames.join(', ')}</div>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{standard.overview}</p>

              <div className="bg-white rounded p-3 mb-3">
                <div className="font-semibold text-sm mb-2">Key Components</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {standard.keyComponents.slice(0, 4).map((comp, i) => (
                    <div key={i} className="bg-gray-50 rounded p-2">
                      <div className="font-semibold text-xs">{comp.name}</div>
                      <div className="text-xs text-gray-600">{comp.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="font-semibold text-sm text-green-700 mb-1">Strategic Importance</div>
                  <p className="text-xs text-gray-600">{standard.strategicImportance}</p>
                </div>
                <div>
                  <div className="font-semibold text-sm text-orange-700 mb-1">Limitations</div>
                  <ul className="text-xs text-gray-600">
                    {standard.limitations.slice(0, 2).map((l, i) => <li key={i}>• {l}</li>)}
                  </ul>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold">Governance:</span>
                <span className="bg-gray-200 text-xs px-2 py-0.5 rounded">{standard.governance}</span>
                <span className="text-xs font-semibold ml-2">Related:</span>
                {standard.relatedStandards.map((rel, i) => (
                  <span key={i} className="bg-gray-100 text-xs px-2 py-0.5 rounded">{rel}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ISA-95 Levels Diagram */}
      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🏗️</span> ISA-95 Functional Hierarchy (Purdue Model)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          The foundational model for understanding where systems and data live in manufacturing enterprises.
        </p>

        <div className="space-y-2">
          <div className="bg-indigo-100 border-2 border-indigo-400 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold">Level 4: Business Planning & Logistics</span>
                <span className="ml-2 text-xs text-gray-600">ERP, Supply Chain</span>
              </div>
              <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded">Enterprise</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">SAP, Oracle, Microsoft Dynamics • Days-Weeks planning horizon</div>
          </div>

          <div className="flex justify-center">
            <div className="bg-yellow-200 border border-yellow-500 rounded px-3 py-1 text-xs font-bold">
              ← B2MML / ISA-95 Interface →
            </div>
          </div>

          <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold">Level 3: Manufacturing Operations</span>
                <span className="ml-2 text-xs text-gray-600">MES, MOM, QMS</span>
              </div>
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">Site/Area</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Siemens Opcenter, Rockwell Plex, AVEVA • Shifts-Days horizon</div>
          </div>

          <div className="bg-cyan-100 border-2 border-cyan-400 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold">Level 2: Control Systems</span>
                <span className="ml-2 text-xs text-gray-600">SCADA, DCS, HMI</span>
              </div>
              <span className="bg-cyan-600 text-white text-xs px-2 py-0.5 rounded">Cell/Line</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Honeywell Experion, Emerson DeltaV, Ignition • Minutes-Hours horizon</div>
          </div>

          <div className="bg-teal-100 border-2 border-teal-400 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold">Level 1: Basic Control</span>
                <span className="ml-2 text-xs text-gray-600">PLCs, RTUs, Controllers</span>
              </div>
              <span className="bg-teal-600 text-white text-xs px-2 py-0.5 rounded">Equipment</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Siemens S7, Rockwell ControlLogix, ABB AC500 • Seconds-Minutes horizon</div>
          </div>

          <div className="bg-green-100 border-2 border-green-400 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold">Level 0: Physical Process</span>
                <span className="ml-2 text-xs text-gray-600">Sensors, Actuators, Field Devices</span>
              </div>
              <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">Field</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Emerson, Endress+Hauser, Honeywell sensors • Milliseconds-Seconds horizon</div>
          </div>
        </div>
      </div>

      {/* Protocol Battles */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <span>⚔️</span> The Protocol Battles
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Understanding the ongoing debates and tensions in industrial standards helps navigate vendor conversations and architecture decisions.
        </p>

        <div className="space-y-4">
          {protocolBattles.map((battle) => (
            <div key={battle.id} className={`${battle.color} border-2 rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-lg">{battle.title}</div>
                <span className={`text-xs px-2 py-1 rounded ${battle.status === 'Converging' ? 'bg-green-200 text-green-800' :
                  battle.status === 'Regional Stalemate' ? 'bg-yellow-200 text-yellow-800' :
                    battle.status === 'Ongoing Tension' ? 'bg-orange-200 text-orange-800' :
                      battle.status === 'Architecture War' ? 'bg-red-200 text-red-800' :
                        'bg-blue-200 text-blue-800'
                  }`}>
                  {battle.status}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-3">{battle.context}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                {battle.positions.map((pos, i) => (
                  <div key={i} className="bg-white rounded p-3">
                    <div className="font-semibold text-sm mb-1">{pos.side}</div>
                    <p className="text-xs text-gray-600">{pos.argument}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded p-3 mb-2">
                <div className="font-semibold text-sm text-purple-700 mb-1">Resolution / Current State</div>
                <p className="text-xs text-gray-700">{battle.resolution}</p>
              </div>

              <div className="bg-gray-800 text-white rounded p-3">
                <div className="font-semibold text-sm mb-1">💡 Implication for Startups</div>
                <p className="text-xs">{battle.implication}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Startup Playbook */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <span>🚀</span> Startup Standards Playbook
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="font-bold text-green-700 mb-2">✅ Do</div>
            <ul className="text-sm space-y-2">
              <li>• <strong>Support OPC-UA</strong> – It's the universal translator. Required for enterprise sales.</li>
              <li>• <strong>Support MQTT</strong> – It's the IoT default. Essential for cloud connectivity.</li>
              <li>• <strong>Understand ISA-95</strong> – It's the vocabulary of manufacturing IT. Speak the language.</li>
              <li>• <strong>Be protocol-agnostic</strong> – Don't force customers to rip and replace.</li>
              <li>• <strong>Join relevant consortia</strong> – OPC Foundation membership signals credibility.</li>
              <li>• <strong>Consider Sparkplug B</strong> – Growing fast, especially in North America.</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="font-bold text-red-700 mb-2">❌ Don't</div>
            <ul className="text-sm space-y-2">
              <li>• <strong>Invent your own protocol</strong> – Customers won't adopt proprietary standards.</li>
              <li>• <strong>Ignore legacy protocols</strong> – Modbus isn't going away. Support it.</li>
              <li>• <strong>Assume cloud-only</strong> – Industrial customers need edge and on-prem options.</li>
              <li>• <strong>Pick sides in PROFINET vs EtherNet/IP</strong> – Support both or stay above the fray.</li>
              <li>• <strong>Underestimate compliance</strong> – Pharma, food, aerospace have strict requirements.</li>
              <li>• <strong>Ignore security</strong> – OT security (IEC 62443) is increasingly mandatory.</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-lg p-4">
          <div className="font-bold text-blue-700 mb-2">🎯 Quick Reference: Which Protocol When?</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-blue-50 rounded p-2">
              <div className="font-semibold">PLC/DCS Integration</div>
              <div className="text-xs text-gray-600">→ OPC-UA (or native fieldbus)</div>
            </div>
            <div className="bg-green-50 rounded p-2">
              <div className="font-semibold">Cloud Telemetry</div>
              <div className="text-xs text-gray-600">→ MQTT (or Sparkplug B)</div>
            </div>
            <div className="bg-purple-50 rounded p-2">
              <div className="font-semibold">CNC Machine Data</div>
              <div className="text-xs text-gray-600">→ MTConnect (or OPC-UA)</div>
            </div>
            <div className="bg-yellow-50 rounded p-2">
              <div className="font-semibold">ERP-MES Integration</div>
              <div className="text-xs text-gray-600">→ ISA-95 / B2MML</div>
            </div>
            <div className="bg-orange-50 rounded p-2">
              <div className="font-semibold">Brownfield Sensors</div>
              <div className="text-xs text-gray-600">→ Modbus (universal fallback)</div>
            </div>
            <div className="bg-red-50 rounded p-2">
              <div className="font-semibold">Digital Twin</div>
              <div className="text-xs text-gray-600">→ Asset Administration Shell</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================
  // PLAYBOOKS DATA
  // ============================================

  const pilotDesignPatterns = [
    {
      id: 'single-asset',
      name: 'Single Asset Proof of Value',
      icon: '🎯',
      color: 'bg-blue-100 border-blue-400',
      duration: '4-8 weeks',
      investment: '$25K-75K',
      riskLevel: 'Low',
      overview: 'Deploy on one critical asset to prove technical feasibility and capture early wins. The classic "land" motion.',
      whenToUse: [
        'First engagement with skeptical customer',
        'Predictive maintenance or condition monitoring use cases',
        'Asset with known failure history or high downtime cost',
        'Need quick proof point to justify larger investment'
      ],
      structure: {
        week1_2: 'Asset selection, sensor deployment (if needed), data connectivity validation',
        week3_4: 'Model training/configuration, baseline establishment, initial predictions',
        week5_6: 'Validation against actual events, tuning, stakeholder demos',
        week7_8: 'Results documentation, ROI calculation, expansion proposal'
      },
      successCriteria: [
        'At least one validated prediction or detected anomaly',
        'Clear before/after comparison with measurable metric',
        'Positive feedback from operations/maintenance team',
        'Business case for expansion documented'
      ],
      commonPitfalls: [
        'Selecting asset with no failure history (nothing to predict)',
        'Insufficient data history for training',
        'IT/OT connectivity delays eating pilot timeline',
        'No executive sponsor to approve expansion'
      ],
      expandPath: 'Single asset → Asset class → Site-wide → Enterprise'
    },
    {
      id: 'production-line',
      name: 'Production Line Pilot',
      icon: '🏭',
      color: 'bg-green-100 border-green-400',
      duration: '8-16 weeks',
      investment: '$75K-200K',
      riskLevel: 'Medium',
      overview: 'Deploy across an entire production line to prove end-to-end value and integration capabilities. Tests real operational complexity.',
      whenToUse: [
        'OEE improvement or quality optimization use cases',
        'Need to prove multi-system integration',
        'Customer requires proof at operational scale',
        'MES/SCADA integration is part of the value prop'
      ],
      structure: {
        week1_4: 'Line assessment, integration planning, data mapping, sensor gaps identified',
        week5_8: 'System deployment, MES/SCADA integration, historian connectivity',
        week9_12: 'Model deployment, operator training, initial optimization cycles',
        week13_16: 'Performance validation, OEE/quality measurement, results documentation'
      },
      successCriteria: [
        'Measurable OEE improvement (typically 3-10%)',
        'Quality defect reduction or early detection',
        'Operator adoption and positive feedback',
        'Integration stability proven over multiple shifts'
      ],
      commonPitfalls: [
        'Underestimating MES/SCADA integration complexity',
        'Line changes or product mix during pilot',
        'Shift-to-shift variation in adoption',
        'IT/OT security review delays'
      ],
      expandPath: 'Single line → Multiple lines → Full plant → Multi-site'
    },
    {
      id: 'shadow-mode',
      name: 'Shadow Mode Deployment',
      icon: '👁️',
      color: 'bg-purple-100 border-purple-400',
      duration: '12-24 weeks',
      investment: '$100K-300K',
      riskLevel: 'Low (no production impact)',
      overview: 'Run AI recommendations in parallel with existing operations without taking action. Build trust before automation.',
      whenToUse: [
        'Control/optimization use cases where wrong action has consequences',
        'Highly regulated environments (pharma, food, aerospace)',
        'Skeptical operations team needs proof before trusting AI',
        'Process control or setpoint optimization applications'
      ],
      structure: {
        week1_6: 'System deployment, data integration, model training on historical data',
        week7_12: 'Shadow mode: AI makes recommendations, humans decide, track accuracy',
        week13_18: 'Analysis of AI vs human decisions, identify where AI outperforms',
        week19_24: 'Graduated autonomy: low-risk recommendations automated, results measured'
      },
      successCriteria: [
        'AI recommendation accuracy >90% vs actual outcomes',
        'Identified scenarios where AI outperforms human judgment',
        'Operations team trust built through transparency',
        'Clear criteria defined for when AI can act autonomously'
      ],
      commonPitfalls: [
        'Shadow mode lasting forever (analysis paralysis)',
        'Not tracking AI vs human decision quality rigorously',
        'Operators ignoring AI recommendations entirely',
        'No clear graduation criteria defined upfront'
      ],
      expandPath: 'Shadow mode → Advisory mode → Supervised autonomy → Autonomous operation'
    },
    {
      id: 'digital-twin',
      name: 'Digital Twin Proof of Concept',
      icon: '🪞',
      color: 'bg-yellow-100 border-yellow-400',
      duration: '12-20 weeks',
      investment: '$150K-400K',
      riskLevel: 'Medium',
      overview: 'Build a digital replica of a process or asset for simulation, what-if analysis, and optimization before deploying to production.',
      whenToUse: [
        'Complex processes where experimentation is risky/expensive',
        'Optimization across multiple variables',
        'Training and scenario planning applications',
        'Capacity planning or process design validation'
      ],
      structure: {
        week1_4: 'Process mapping, data collection, physics/behavior modeling',
        week5_10: 'Digital twin construction, calibration against real operations',
        week11_16: 'Validation: twin predictions vs actual, model refinement',
        week17_20: 'Use case demonstration: optimization scenarios, what-if analysis'
      },
      successCriteria: [
        'Twin prediction accuracy within acceptable tolerance',
        'Optimization scenarios identify >5% improvement potential',
        'Stakeholders use twin for decision support',
        'Path to operational deployment defined'
      ],
      commonPitfalls: [
        'Over-engineering the twin (perfect is enemy of good)',
        'Insufficient real-world data for calibration',
        'Twin and reality drift over time',
        'No clear operational use case beyond "cool demo"'
      ],
      expandPath: 'Offline twin → Connected twin → Predictive twin → Prescriptive twin'
    },
    {
      id: 'quick-win',
      name: 'Quick Win Sprint',
      icon: '⚡',
      color: 'bg-orange-100 border-orange-400',
      duration: '2-4 weeks',
      investment: '$10K-30K',
      riskLevel: 'Very Low',
      overview: 'Rapid deployment targeting a specific, well-defined problem with existing data. Prove value before larger commitment.',
      whenToUse: [
        'Customer has clean, accessible data already',
        'Well-defined problem with clear success metric',
        'Need to build relationship before larger engagement',
        'Competitive situation requiring fast demonstration'
      ],
      structure: {
        week1: 'Data access, problem definition, success criteria agreement',
        week2: 'Rapid model development, initial results',
        week3: 'Refinement, stakeholder presentation, results validation',
        week4: 'Documentation, expansion proposal, next steps'
      },
      successCriteria: [
        'Demonstrable insight or prediction from customer data',
        'Clear articulation of value if deployed at scale',
        'Customer agreement to proceed with larger pilot',
        'Relationship established with key stakeholders'
      ],
      commonPitfalls: [
        'Data quality issues discovered too late',
        'Scope creep extending timeline',
        'Results not compelling enough to justify expansion',
        'No clear path from sprint to production'
      ],
      expandPath: 'Quick win → Full pilot → Site deployment → Enterprise rollout'
    }
  ];

  const scaleUpMethodologies = [
    {
      id: 'site-by-site',
      name: 'Site-by-Site Rollout',
      icon: '🏢',
      color: 'bg-blue-100 border-blue-400',
      overview: 'Sequential deployment across sites, using each site as a learning opportunity to refine the playbook.',
      phases: [
        { name: 'Lighthouse Site', duration: '3-6 months', description: 'Full deployment at first site, build playbook, train internal champions' },
        { name: 'Fast Follower Sites', duration: '2-3 months each', description: 'Replicate to 2-3 similar sites, refine deployment playbook' },
        { name: 'Wave Deployment', duration: '1-2 months each', description: 'Parallel deployment to multiple sites per wave, standardized approach' },
        { name: 'Long Tail', duration: 'Ongoing', description: 'Address edge cases, legacy sites, special requirements' }
      ],
      keySuccessFactors: [
        'Dedicated deployment team that moves site to site',
        'Standardized deployment playbook and training materials',
        'Site champions identified and trained before arrival',
        'Clear governance for site-specific customizations'
      ],
      metrics: ['Sites deployed', 'Time per site', 'Adoption rate by site', 'Support tickets per site'],
      risks: ['Lighthouse site not representative', 'Key person dependencies', 'Site-specific variations derailing standardization']
    },
    {
      id: 'use-case-expansion',
      name: 'Use Case Expansion',
      icon: '🎯',
      color: 'bg-green-100 border-green-400',
      overview: 'Start with one use case, prove value, then expand to adjacent use cases on the same infrastructure.',
      phases: [
        { name: 'Anchor Use Case', duration: '3-6 months', description: 'Deploy first use case (e.g., predictive maintenance), prove ROI' },
        { name: 'Adjacent Expansion', duration: '2-4 months each', description: 'Add related use cases (e.g., energy optimization, quality prediction)' },
        { name: 'Platform Positioning', duration: 'Ongoing', description: 'Position as enterprise platform, not point solution' },
        { name: 'New Domains', duration: 'Varies', description: 'Expand to entirely new problem domains' }
      ],
      keySuccessFactors: [
        'Architecture designed for multi-use-case from day one',
        'Data infrastructure that supports expansion',
        'Business case for each incremental use case',
        'Product roadmap aligned with customer expansion path'
      ],
      metrics: ['Use cases per customer', 'Revenue per customer', 'Data sources connected', 'User types engaged'],
      risks: ['Architecture not extensible', 'Use cases not connected enough', 'Customer team capacity limits']
    },
    {
      id: 'land-and-expand',
      name: 'Land and Expand',
      icon: '🚀',
      color: 'bg-purple-100 border-purple-400',
      overview: 'Classic enterprise SaaS motion: land with one team/site, prove value, expand through the organization.',
      phases: [
        { name: 'Land', duration: '2-4 months', description: 'Initial deployment with single team or site, prove value' },
        { name: 'Stick', duration: '3-6 months', description: 'Ensure adoption, build champions, integrate into workflows' },
        { name: 'Expand', duration: 'Ongoing', description: 'Grow to adjacent teams, more users, additional sites' },
        { name: 'Transform', duration: 'Long-term', description: 'Become enterprise standard, strategic platform' }
      ],
      keySuccessFactors: [
        'Product has natural viral/expansion mechanics',
        'Success with initial team creates demand from adjacent teams',
        'Low friction to add users/sites',
        'Executive sponsorship for enterprise deals'
      ],
      metrics: ['Net Revenue Retention (NRR)', 'Seats/users per account', 'Sites per account', 'Contract value growth'],
      risks: ['Stuck in single team forever', 'Procurement blocks expansion', 'Champion leaves', 'Competing priorities']
    },
    {
      id: 'center-of-excellence',
      name: 'Center of Excellence Model',
      icon: '🎓',
      color: 'bg-yellow-100 border-yellow-400',
      overview: 'Build internal customer capability (CoE) that then drives deployment across the enterprise.',
      phases: [
        { name: 'CoE Establishment', duration: '3-6 months', description: 'Train dedicated team, build internal expertise, define governance' },
        { name: 'Pilot Leadership', duration: '3-6 months', description: 'CoE leads initial deployments, builds playbooks' },
        { name: 'Federated Deployment', duration: 'Ongoing', description: 'CoE supports business units deploying independently' },
        { name: 'Self-Sustaining', duration: 'Long-term', description: 'Customer largely self-sufficient, vendor provides platform and support' }
      ],
      keySuccessFactors: [
        'Executive commitment to CoE investment',
        'Right people allocated to CoE (technical + domain)',
        'Clear CoE charter and governance',
        'Vendor training and enablement programs'
      ],
      metrics: ['CoE team size', 'Deployments led by CoE', 'Time to self-sufficiency', 'Internal NPS'],
      risks: ['CoE becomes bottleneck', 'CoE team turnover', 'Insufficient executive support', 'CoE disconnected from business']
    }
  ];

  const changeManagementFrameworks = [
    {
      id: 'adkar',
      name: 'ADKAR Model',
      icon: '🔄',
      color: 'bg-blue-100 border-blue-400',
      source: 'Prosci',
      overview: 'Individual-focused change model: Awareness, Desire, Knowledge, Ability, Reinforcement.',
      stages: [
        { name: 'Awareness', description: 'Why is change needed? Communicate the business case for AI/automation.', activities: ['Town halls', 'Executive communications', 'Problem statement sharing'] },
        { name: 'Desire', description: 'Create personal motivation to participate. Address "what\'s in it for me?"', activities: ['Benefits articulation', 'Fear/concern addressing', 'Early adopter recruitment'] },
        { name: 'Knowledge', description: 'How to change? Training on new systems and processes.', activities: ['Training programs', 'Documentation', 'Hands-on workshops'] },
        { name: 'Ability', description: 'Demonstrate new skills in practice. Supported real-world application.', activities: ['Coached deployment', 'Go-live support', 'Performance support tools'] },
        { name: 'Reinforcement', description: 'Sustain the change. Prevent backsliding to old ways.', activities: ['Metrics/dashboards', 'Recognition programs', 'Continuous improvement'] }
      ],
      industrialApplication: 'Particularly effective for operator adoption of AI-assisted decision support. Focus on individual operators and technicians who must change daily behaviors.',
      keyTip: 'Don\'t skip Desire – industrial workers need to believe AI helps them, not threatens them.'
    },
    {
      id: 'kotter',
      name: 'Kotter\'s 8-Step Process',
      icon: '📈',
      color: 'bg-green-100 border-green-400',
      source: 'John Kotter',
      overview: 'Organization-wide change framework emphasizing urgency and coalition building.',
      stages: [
        { name: '1. Create Urgency', description: 'Build case for why AI transformation must happen now.', activities: ['Competitive analysis', 'Cost of inaction', 'Market pressure articulation'] },
        { name: '2. Form Coalition', description: 'Assemble cross-functional leadership team.', activities: ['Executive sponsor', 'IT/OT leaders', 'Operations champions'] },
        { name: '3. Create Vision', description: 'Define the future state and how AI enables it.', activities: ['Vision statement', 'Target architecture', 'Success metrics'] },
        { name: '4. Communicate Vision', description: 'Repeat the vision constantly through multiple channels.', activities: ['All-hands meetings', 'Newsletters', 'Site visits'] },
        { name: '5. Remove Obstacles', description: 'Address barriers: technical, organizational, cultural.', activities: ['IT/OT alignment', 'Budget allocation', 'Policy changes'] },
        { name: '6. Create Quick Wins', description: 'Visible, unambiguous successes early.', activities: ['Pilot successes', 'Metrics dashboards', 'Recognition events'] },
        { name: '7. Build on Change', description: 'Use momentum to tackle bigger challenges.', activities: ['Expand scope', 'Add use cases', 'Increase automation'] },
        { name: '8. Anchor in Culture', description: 'Make AI-assisted operations "how we work here."', activities: ['Update SOPs', 'Revise training', 'Align incentives'] }
      ],
      industrialApplication: 'Best for enterprise-wide digital transformation programs. Useful when AI deployment requires significant organizational change beyond just technology.',
      keyTip: 'Industrial settings often skip step 1 – but without urgency, change dies in pilot phase.'
    },
    {
      id: 'operational-excellence',
      name: 'Operational Excellence Integration',
      icon: '⚙️',
      color: 'bg-purple-100 border-purple-400',
      source: 'Industrial Best Practice',
      overview: 'Embed AI into existing continuous improvement culture rather than treating as separate initiative.',
      stages: [
        { name: 'Align to Existing Programs', description: 'Connect AI to Lean, Six Sigma, TPM initiatives already underway.', activities: ['Map AI to current improvement goals', 'Use existing governance', 'Leverage CI team'] },
        { name: 'AI-Enabled Kaizen', description: 'Use AI insights to identify improvement opportunities.', activities: ['AI-generated improvement ideas', 'Data-driven root cause', 'Prioritization support'] },
        { name: 'Measure What Matters', description: 'Integrate AI metrics into existing OEE/KPI frameworks.', activities: ['Dashboard integration', 'Daily management boards', 'Shift handover inclusion'] },
        { name: 'Standardize and Sustain', description: 'Build AI into standard work and management systems.', activities: ['Update SOPs', 'Include in audits', 'Train on AI-assisted processes'] }
      ],
      industrialApplication: 'Highly effective in manufacturing environments with mature Lean/TPM culture. Reduces resistance by positioning AI as tool for existing goals.',
      keyTip: 'The CI team can be your best friend or worst enemy. Engage them early as partners, not targets.'
    },
    {
      id: 'frontline-adoption',
      name: 'Frontline Adoption Framework',
      icon: '👷',
      color: 'bg-orange-100 border-orange-400',
      source: 'Industrial Change Management',
      overview: 'Specifically designed for operator/technician adoption of AI tools in manufacturing environments.',
      stages: [
        { name: 'Engage Union/Works Council Early', description: 'Proactive partnership with labor representatives.', activities: ['Early briefings', 'Job impact assessment', 'Skill development commitment'] },
        { name: 'Train the Trainer', description: 'Develop internal super-users who train peers.', activities: ['Super-user selection', 'Deep training', 'Peer coaching skills'] },
        { name: 'Shift-by-Shift Rollout', description: 'Deploy with dedicated support for each shift.', activities: ['Shift-specific training', 'On-floor support', 'Feedback loops'] },
        { name: 'Feedback-Driven Iteration', description: 'Continuously improve based on frontline input.', activities: ['Daily standups', 'Improvement suggestions', 'Visible response to feedback'] },
        { name: 'Celebrate and Recognize', description: 'Highlight adoption champions and successes.', activities: ['Recognition programs', 'Success stories', 'Peer visibility'] }
      ],
      industrialApplication: 'Essential for any deployment that changes operator workflows. Ignoring frontline adoption is the #1 cause of industrial AI project failure.',
      keyTip: 'One trusted operator advocate is worth ten executive sponsors. Find and cultivate your frontline champions.'
    }
  ];

  const roiTemplates = [
    {
      id: 'pdm',
      name: 'Predictive Maintenance ROI',
      icon: '🔧',
      color: 'bg-blue-100 border-blue-400',
      description: 'Calculate ROI for predictive maintenance deployments based on avoided downtime and optimized maintenance.',
      valueDrivers: [
        { driver: 'Avoided Unplanned Downtime', calculation: 'Hours saved × Cost per hour of downtime', typical: '$50K-500K/year per asset class', confidence: 'High' },
        { driver: 'Extended Equipment Life', calculation: 'Deferred CapEx × Discount rate', typical: '10-20% life extension', confidence: 'Medium' },
        { driver: 'Reduced Maintenance Costs', calculation: 'Parts + Labor savings from condition-based vs time-based', typical: '15-25% maintenance cost reduction', confidence: 'High' },
        { driver: 'Energy Optimization', calculation: 'kWh saved from equipment running at optimal efficiency', typical: '3-8% energy reduction', confidence: 'Medium' },
        { driver: 'Safety Incident Reduction', calculation: 'Avoided incidents × Average incident cost', typical: 'Varies widely', confidence: 'Low' }
      ],
      costFactors: [
        { factor: 'Software/Platform', typical: '$50K-200K/year', notes: 'Varies by vendor and scope' },
        { factor: 'Sensors/Hardware', typical: '$5K-50K per asset class', notes: 'If not already instrumented' },
        { factor: 'Integration/Deployment', typical: '$25K-100K', notes: 'One-time professional services' },
        { factor: 'Internal Resources', typical: '0.5-2 FTE', notes: 'Ongoing administration and analysis' },
        { factor: 'Training', typical: '$10K-30K', notes: 'One-time plus ongoing refreshers' }
      ],
      sampleCalculation: {
        scenario: 'Mid-size manufacturing plant with 50 critical rotating assets',
        benefits: {
          downtime: { label: 'Avoided downtime (10 incidents × $25K)', value: 250000 },
          maintenance: { label: 'Maintenance optimization (20% of $500K)', value: 100000 },
          energy: { label: 'Energy savings (5% of $200K energy)', value: 10000 },
          total: { label: 'Total Annual Benefits', value: 360000 }
        },
        costs: {
          software: { label: 'Software (annual)', value: 100000 },
          hardware: { label: 'Sensors (one-time, amortized)', value: 15000 },
          services: { label: 'Deployment (amortized)', value: 20000 },
          internal: { label: 'Internal resources (1 FTE)', value: 80000 },
          total: { label: 'Total Annual Costs', value: 215000 }
        },
        roi: '67%',
        payback: '7 months'
      }
    },
    {
      id: 'quality',
      name: 'Quality/Yield Optimization ROI',
      icon: '✅',
      color: 'bg-green-100 border-green-400',
      description: 'Calculate ROI for AI-driven quality prediction and yield optimization.',
      valueDrivers: [
        { driver: 'Reduced Scrap/Rework', calculation: 'Defect rate reduction × Production volume × Scrap cost', typical: '20-50% defect reduction', confidence: 'High' },
        { driver: 'Increased Yield', calculation: 'Yield improvement × Production volume × Margin', typical: '2-10% yield improvement', confidence: 'Medium' },
        { driver: 'Reduced Inspection Costs', calculation: 'Labor savings from automated/reduced inspection', typical: '30-60% inspection reduction', confidence: 'High' },
        { driver: 'Warranty Cost Reduction', calculation: 'Field failures avoided × Warranty cost per incident', typical: '15-30% warranty reduction', confidence: 'Medium' },
        { driver: 'Customer Satisfaction', calculation: 'Retention improvement × Customer lifetime value', typical: 'Hard to quantify', confidence: 'Low' }
      ],
      costFactors: [
        { factor: 'Software/Platform', typical: '$75K-300K/year', notes: 'Quality-specific solutions often premium' },
        { factor: 'Vision Systems/Sensors', typical: '$25K-150K', notes: 'If inline inspection required' },
        { factor: 'Integration', typical: '$50K-150K', notes: 'MES/quality system integration' },
        { factor: 'Internal Resources', typical: '1-2 FTE', notes: 'Quality engineers + data science' },
        { factor: 'Training', typical: '$15K-40K', notes: 'Operators and quality team' }
      ],
      sampleCalculation: {
        scenario: 'Discrete manufacturing line with $50M annual production',
        benefits: {
          scrap: { label: 'Scrap reduction (50% of $1M scrap)', value: 500000 },
          yield: { label: 'Yield improvement (3% of $50M)', value: 1500000 },
          inspection: { label: 'Inspection labor (40% of $200K)', value: 80000 },
          total: { label: 'Total Annual Benefits', value: 2080000 }
        },
        costs: {
          software: { label: 'Software (annual)', value: 200000 },
          hardware: { label: 'Vision/sensors (amortized)', value: 40000 },
          services: { label: 'Deployment (amortized)', value: 35000 },
          internal: { label: 'Internal resources (1.5 FTE)', value: 150000 },
          total: { label: 'Total Annual Costs', value: 425000 }
        },
        roi: '389%',
        payback: '2.5 months'
      }
    },
    {
      id: 'energy',
      name: 'Energy Optimization ROI',
      icon: '⚡',
      color: 'bg-yellow-100 border-yellow-400',
      description: 'Calculate ROI for AI-driven energy management and optimization.',
      valueDrivers: [
        { driver: 'Direct Energy Reduction', calculation: 'kWh saved × Energy cost per kWh', typical: '5-15% energy reduction', confidence: 'High' },
        { driver: 'Peak Demand Reduction', calculation: 'Peak kW avoided × Demand charge rate', typical: '10-20% demand charge reduction', confidence: 'High' },
        { driver: 'Renewable Integration', calculation: 'Increased self-consumption × Rate differential', typical: '20-40% better renewable utilization', confidence: 'Medium' },
        { driver: 'Carbon Cost Avoidance', calculation: 'Tonnes CO2 reduced × Carbon price', typical: 'Varies by region', confidence: 'Medium' },
        { driver: 'Compressed Air/Steam Optimization', calculation: 'Utility-specific savings from AI control', typical: '10-25% for targeted utilities', confidence: 'High' }
      ],
      costFactors: [
        { factor: 'Energy Management Platform', typical: '$25K-150K/year', notes: 'Scales with sites and meters' },
        { factor: 'Submetering', typical: '$5K-25K per site', notes: 'If granular data not available' },
        { factor: 'Integration', typical: '$20K-75K', notes: 'BMS, SCADA, utility integration' },
        { factor: 'Internal Resources', typical: '0.25-1 FTE', notes: 'Energy manager + facilities' },
        { factor: 'Training', typical: '$5K-15K', notes: 'Often included in deployment' }
      ],
      sampleCalculation: {
        scenario: 'Industrial facility with $2M annual energy spend',
        benefits: {
          energy: { label: 'Energy reduction (10% of $2M)', value: 200000 },
          demand: { label: 'Demand charge reduction (15% of $300K)', value: 45000 },
          renewable: { label: 'Better renewable utilization', value: 30000 },
          total: { label: 'Total Annual Benefits', value: 275000 }
        },
        costs: {
          software: { label: 'Platform (annual)', value: 60000 },
          hardware: { label: 'Submetering (amortized)', value: 8000 },
          services: { label: 'Deployment (amortized)', value: 12000 },
          internal: { label: 'Internal resources (0.5 FTE)', value: 50000 },
          total: { label: 'Total Annual Costs', value: 130000 }
        },
        roi: '112%',
        payback: '6 months'
      }
    },
    {
      id: 'oee',
      name: 'OEE Improvement ROI',
      icon: '📊',
      color: 'bg-purple-100 border-purple-400',
      description: 'Calculate ROI for AI-driven Overall Equipment Effectiveness improvement.',
      valueDrivers: [
        { driver: 'Availability Improvement', calculation: 'Uptime increase × Production rate × Margin', typical: '3-8% availability gain', confidence: 'High' },
        { driver: 'Performance Improvement', calculation: 'Speed increase × Production hours × Margin', typical: '2-5% performance gain', confidence: 'Medium' },
        { driver: 'Quality Improvement', calculation: 'First-pass yield increase × Volume × Margin', typical: '2-5% quality gain', confidence: 'Medium' },
        { driver: 'Changeover Optimization', calculation: 'Time saved × Changeovers × Hourly rate', typical: '15-30% changeover reduction', confidence: 'High' },
        { driver: 'Capacity Unlocked', calculation: 'Deferred CapEx from better utilization', typical: 'Equivalent to 5-15% capacity add', confidence: 'Medium' }
      ],
      costFactors: [
        { factor: 'OEE/MES Platform', typical: '$50K-250K/year', notes: 'Depends on plant complexity' },
        { factor: 'Machine Connectivity', typical: '$5K-20K per machine', notes: 'If not already connected' },
        { factor: 'Integration', typical: '$50K-150K', notes: 'ERP, scheduling, historian' },
        { factor: 'Internal Resources', typical: '1-2 FTE', notes: 'CI engineer + data analyst' },
        { factor: 'Training', typical: '$20K-50K', notes: 'Operator and supervisor training' }
      ],
      sampleCalculation: {
        scenario: 'Manufacturing plant with 60% OEE, $100M throughput capacity',
        benefits: {
          availability: { label: 'Availability +5% (of $100M × 5%)', value: 1000000 },
          performance: { label: 'Performance +3%', value: 600000 },
          quality: { label: 'Quality +2%', value: 400000 },
          total: { label: 'Total Annual Benefits', value: 2000000 }
        },
        costs: {
          software: { label: 'Platform (annual)', value: 150000 },
          hardware: { label: 'Connectivity (amortized)', value: 25000 },
          services: { label: 'Deployment (amortized)', value: 30000 },
          internal: { label: 'Internal resources (1.5 FTE)', value: 150000 },
          total: { label: 'Total Annual Costs', value: 355000 }
        },
        roi: '463%',
        payback: '2 months'
      }
    }
  ];

  const PlaybooksTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Industrial AI Playbooks</h2>
        <p className="text-gray-600">Proven patterns for pilots, scale-up, change management, and ROI calculation</p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="font-bold">Pilot Design Patterns</div>
          <div className="text-xs text-gray-600">5 proven pilot structures</div>
        </div>
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">📈</div>
          <div className="font-bold">Scale-Up Methodologies</div>
          <div className="text-xs text-gray-600">From pilot to enterprise</div>
        </div>
        <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">🔄</div>
          <div className="font-bold">Change Management</div>
          <div className="text-xs text-gray-600">Driving adoption at scale</div>
        </div>
        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">💰</div>
          <div className="font-bold">ROI Templates</div>
          <div className="text-xs text-gray-600">Quantify value by use case</div>
        </div>
      </div>

      {/* Pilot Design Patterns */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <span>🎯</span> Pilot Design Patterns
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose the right pilot structure based on your use case, customer readiness, and risk tolerance.
        </p>

        {/* Pilot Pattern Comparison */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-2 text-left">Pattern</th>
                <th className="border p-2 text-center">Duration</th>
                <th className="border p-2 text-center">Investment</th>
                <th className="border p-2 text-center">Risk</th>
                <th className="border p-2 text-left">Best For</th>
              </tr>
            </thead>
            <tbody>
              {pilotDesignPatterns.map((pattern) => (
                <tr key={pattern.id} className={pattern.color}>
                  <td className="border p-2 font-bold">{pattern.icon} {pattern.name}</td>
                  <td className="border p-2 text-center">{pattern.duration}</td>
                  <td className="border p-2 text-center">{pattern.investment}</td>
                  <td className="border p-2 text-center">{pattern.riskLevel}</td>
                  <td className="border p-2 text-xs">{pattern.whenToUse[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          {pilotDesignPatterns.map((pattern) => (
            <div key={pattern.id} className={`${pattern.color} border-2 rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{pattern.icon}</span>
                  <div>
                    <div className="font-bold text-lg">{pattern.name}</div>
                    <div className="text-sm text-gray-600">{pattern.duration} | {pattern.investment} | {pattern.riskLevel} Risk</div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{pattern.overview}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="bg-white rounded p-3">
                  <div className="font-semibold text-sm mb-2 text-green-700">When to Use</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {pattern.whenToUse.map((use, i) => <li key={i}>• {use}</li>)}
                  </ul>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="font-semibold text-sm mb-2 text-red-700">Common Pitfalls</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {pattern.commonPitfalls.map((pitfall, i) => <li key={i}>• {pitfall}</li>)}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded p-3 mb-3">
                <div className="font-semibold text-sm mb-2">Typical Timeline</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(pattern.structure).map(([phase, desc], i) => (
                    <div key={i} className="bg-gray-50 rounded p-2">
                      <div className="font-semibold text-xs text-blue-700">{phase.replace('_', '-')}</div>
                      <div className="text-xs text-gray-600">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs">Success Criteria: </span>
                  <span className="text-xs text-gray-600">{pattern.successCriteria[0]}</span>
                </div>
                <div className="bg-gray-800 text-white text-xs px-3 py-1 rounded">
                  Expand Path: {pattern.expandPath}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scale-Up Methodologies */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <span>📈</span> Scale-Up Methodologies
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Proven approaches for expanding from successful pilot to enterprise-wide deployment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scaleUpMethodologies.map((method) => (
            <div key={method.id} className={`${method.color} border-2 rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{method.icon}</span>
                <div className="font-bold text-lg">{method.name}</div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{method.overview}</p>

              <div className="bg-white rounded p-3 mb-3">
                <div className="font-semibold text-sm mb-2">Phases</div>
                <div className="space-y-2">
                  {method.phases.map((phase, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="bg-gray-200 text-xs px-2 py-0.5 rounded font-mono">{i + 1}</span>
                      <div>
                        <span className="font-semibold text-xs">{phase.name}</span>
                        <span className="text-xs text-gray-500 ml-1">({phase.duration})</span>
                        <div className="text-xs text-gray-600">{phase.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded p-2">
                  <div className="font-semibold text-xs text-green-700 mb-1">Success Factors</div>
                  <ul className="text-xs text-gray-600">
                    {method.keySuccessFactors.slice(0, 2).map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="font-semibold text-xs text-blue-700 mb-1">Key Metrics</div>
                  <ul className="text-xs text-gray-600">
                    {method.metrics.slice(0, 2).map((m, i) => <li key={i}>• {m}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Management Frameworks */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <span>🔄</span> Change Management Frameworks
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Driving adoption is often harder than the technology. These frameworks address the human side of AI transformation.
        </p>

        <div className="space-y-4">
          {changeManagementFrameworks.map((framework) => (
            <div key={framework.id} className={`${framework.color} border-2 rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{framework.icon}</span>
                  <div>
                    <div className="font-bold text-lg">{framework.name}</div>
                    <div className="text-xs text-gray-500">Source: {framework.source}</div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{framework.overview}</p>

              <div className="bg-white rounded p-3 mb-3">
                <div className="font-semibold text-sm mb-2">Stages</div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {framework.stages.map((stage, i) => (
                    <div key={i} className="bg-gray-50 rounded p-2">
                      <div className="font-semibold text-xs text-blue-700">{stage.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{stage.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded p-3">
                  <div className="font-semibold text-sm text-purple-700 mb-1">Industrial Application</div>
                  <p className="text-xs text-gray-600">{framework.industrialApplication}</p>
                </div>
                <div className="bg-yellow-50 rounded p-3 border border-yellow-300">
                  <div className="font-semibold text-sm text-yellow-800 mb-1">💡 Key Tip</div>
                  <p className="text-xs text-gray-700">{framework.keyTip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROI Templates */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <span>💰</span> ROI Calculation Templates
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Quantify the business case for industrial AI investments. Use these templates to structure your ROI analysis.
        </p>

        <div className="space-y-6">
          {roiTemplates.map((template) => (
            <div key={template.id} className={`${template.color} border-2 rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{template.icon}</span>
                <div>
                  <div className="font-bold text-lg">{template.name}</div>
                  <div className="text-sm text-gray-600">{template.description}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Value Drivers */}
                <div className="bg-white rounded p-3">
                  <div className="font-semibold text-sm text-green-700 mb-2">Value Drivers</div>
                  <div className="space-y-2">
                    {template.valueDrivers.map((driver, i) => (
                      <div key={i} className="bg-green-50 rounded p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs">{driver.driver}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${driver.confidence === 'High' ? 'bg-green-200 text-green-800' :
                            driver.confidence === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-red-200 text-red-800'
                            }`}>{driver.confidence}</span>
                        </div>
                        <div className="text-xs text-gray-600">{driver.calculation}</div>
                        <div className="text-xs text-green-700 font-medium">Typical: {driver.typical}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Factors */}
                <div className="bg-white rounded p-3">
                  <div className="font-semibold text-sm text-red-700 mb-2">Cost Factors</div>
                  <div className="space-y-2">
                    {template.costFactors.map((cost, i) => (
                      <div key={i} className="bg-red-50 rounded p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs">{cost.factor}</span>
                          <span className="text-xs font-mono">{cost.typical}</span>
                        </div>
                        <div className="text-xs text-gray-600">{cost.notes}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Calculation */}
              <div className="bg-gray-50 rounded p-4">
                <div className="font-semibold text-sm mb-3">📊 Sample Calculation: {template.sampleCalculation.scenario}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-100 rounded p-3">
                    <div className="font-semibold text-sm text-green-800 mb-2">Annual Benefits</div>
                    {Object.values(template.sampleCalculation.benefits).map((item, i) => (
                      <div key={i} className="flex justify-between text-xs mb-1">
                        <span>{item.label}</span>
                        <span className="font-mono font-bold">${item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-red-100 rounded p-3">
                    <div className="font-semibold text-sm text-red-800 mb-2">Annual Costs</div>
                    {Object.values(template.sampleCalculation.costs).map((item, i) => (
                      <div key={i} className="flex justify-between text-xs mb-1">
                        <span>{item.label}</span>
                        <span className="font-mono font-bold">${item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-100 rounded p-3 flex flex-col justify-center items-center">
                    <div className="text-3xl font-bold text-blue-800">{template.sampleCalculation.roi}</div>
                    <div className="text-sm text-blue-600">ROI</div>
                    <div className="text-xl font-bold text-blue-700 mt-2">{template.sampleCalculation.payback}</div>
                    <div className="text-sm text-blue-600">Payback</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Reference */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <span>🚀</span> Quick Reference: Pilot to Scale Checklist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="font-bold text-blue-700 mb-2">1. Pre-Pilot</div>
            <ul className="text-xs space-y-1">
              <li>☐ Executive sponsor identified</li>
              <li>☐ Success criteria agreed</li>
              <li>☐ Data access confirmed</li>
              <li>☐ Resources allocated</li>
              <li>☐ Timeline realistic</li>
              <li>☐ Expansion path discussed</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="font-bold text-green-700 mb-2">2. During Pilot</div>
            <ul className="text-xs space-y-1">
              <li>☐ Weekly stakeholder updates</li>
              <li>☐ Metrics being tracked</li>
              <li>☐ User feedback captured</li>
              <li>☐ Issues escalated promptly</li>
              <li>☐ Documentation maintained</li>
              <li>☐ Champions cultivated</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="font-bold text-purple-700 mb-2">3. Pilot Close</div>
            <ul className="text-xs space-y-1">
              <li>☐ Results documented</li>
              <li>☐ ROI calculated</li>
              <li>☐ Lessons learned captured</li>
              <li>☐ User testimonials gathered</li>
              <li>☐ Expansion proposal ready</li>
              <li>☐ Budget request prepared</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="font-bold text-orange-700 mb-2">4. Scale-Up</div>
            <ul className="text-xs space-y-1">
              <li>☐ Playbook documented</li>
              <li>☐ Training materials ready</li>
              <li>☐ Support model defined</li>
              <li>☐ Change management plan</li>
              <li>☐ Governance established</li>
              <li>☐ Success metrics defined</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-lg p-4">
          <div className="font-bold text-gray-700 mb-2">💡 Golden Rules for Industrial AI Deployment</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>• <strong>Start small, prove value, then expand</strong> – Resist the urge to boil the ocean</div>
            <div>• <strong>Frontline adoption is everything</strong> – Technology without adoption is shelfware</div>
            <div>• <strong>Data quality &gt; Model sophistication</strong> – 80% of effort is data, not algorithms</div>
            <div>• <strong>Quick wins build momentum</strong> – Celebrate and communicate early successes</div>
            <div>• <strong>Executive sponsor is non-negotiable</strong> – Without air cover, projects die</div>
            <div>• <strong>Plan for scale from day one</strong> – Architecture decisions haunt you later</div>
          </div>
        </div>
      </div>
    </div>
  );





  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="p-4 bg-slate-50 min-h-screen font-sans text-slate-800" >
      <h1 className="text-3xl font-extrabold text-center mb-2 tracking-tight text-slate-900">Physical & Industrial AI Reference Guide</h1>
      <p className="text-center text-slate-500 mb-6 text-sm max-w-2xl mx-auto">Founder reference guide to Physical and Industrial AI, helping us get up to speed fast and have deeper strategic discussions.</p>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center" >
        {
          tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedCell(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-100'
                : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 shadow-sm hover:shadow'
                }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))
        }
      </div >

      {/* Tab Content */}
      < div className="bg-white rounded-lg shadow p-4" >
        {activeTab === 'start' && <StartHereTab />}
        {activeTab === 'matrix' && <MatrixTab />}
        {activeTab === 'valuechain' && <ValueChainTab verticals={verticals} lifecycleData={lifecycleData} />}
        {activeTab === 'framework' && <FrameworkTab />}
        {activeTab === 'layers' && <LayersTab />}
        {activeTab === 'industries' && <IndustriesTab />}
        {activeTab === 'usecases' && <UseCasesTab />}
        {activeTab === 'strategies' && <StrategiesTab />}
        {activeTab === 'players' && <KeyPlayersTab />}
        {activeTab === 'resources' && <OtherResourcesTab />}
      </div >

      {/* Footer */}
      < div className="mt-4 text-center text-xs text-gray-500" >
        Physical & Industrial AI Reference Guide v4.0
      </div >

      {/* Chat Button */}
      < button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 hover:shadow-xl transition-all duration-200 flex items-center justify-center text-2xl z-50 ring-2 ring-white"
      >
        {chatOpen ? '✕' : '💬'}
      </button >

      {/* Chat Panel */}
      {
        chatOpen && <ChatPanel
          setChatOpen={setChatOpen}
          chatMessages={chatMessages} setChatMessages={setChatMessages}
          chatInput={chatInput} setChatInput={setChatInput}
          chatLoading={chatLoading} setChatLoading={setChatLoading}
          activeTab={activeTab} setActiveTab={setActiveTab}
          selectedVertical={selectedVertical} setSelectedVertical={setSelectedVertical}
          selectedLayer={selectedLayer} setSelectedLayer={setSelectedLayer}
          selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer}
        />
      }
    </div >
  );
};



// ============================================
// VALUE CHAIN TAB
// ============================================
function ValueChainTab({ verticals, lifecycleData }) {
  const stages = [
    { id: 'design', name: 'Design', icon: '📐', desc: 'R&D, Engineering, Simulation' },
    { id: 'build', name: 'Build', icon: '🏗️', desc: 'Construction, Manufacturing, Drilling' },
    { id: 'operate', name: 'Operate', icon: '⚙️', desc: 'Real-time Control, Logistics, Production' },
    { id: 'maintain', name: 'Maintain', icon: '🔧', desc: 'MRO, Asset Health, Retrofits' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center py-8 bg-slate-900 rounded-xl shadow-xl border border-slate-700 text-white">
        <h2 className="text-3xl font-extrabold mb-2 tracking-tight">The Physical AI Value Chain</h2>
        <p className="text-lg text-slate-300 mb-1 font-medium">Design → Build → Operate → Maintain</p>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Mapping AI opportunities not just by technical layer, but by business process stage.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left bg-slate-100 border-b-2 border-slate-200">Industry</th>
              {stages.map(stage => (
                <th key={stage.id} className="p-3 text-left bg-slate-50 border-b-2 border-slate-200 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{stage.icon}</span>
                    <div>
                      <div className="font-bold text-slate-800">{stage.name}</div>
                      <div className="text-xs text-slate-500 font-normal">{stage.desc}</div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {verticals.map(vertical => {
              const vData = lifecycleData[vertical.id];
              return (
                <tr key={vertical.id} className="hover:bg-slate-50 border-b border-slate-100">
                  <td className="p-3 font-bold text-slate-700 border-r border-slate-100 w-48">
                    {vertical.name}
                    <div className="text-xs text-slate-400 font-normal mt-1">{vertical.subtitle}</div>
                  </td>
                  {stages.map(stage => {
                    const cell = vData ? vData[stage.id] : null;
                    return (
                      <td key={stage.id} className="p-3 border-r border-slate-100 align-top">
                        {cell ? (
                          <div className="group cursor-pointer">
                            <div className="font-bold text-indigo-700 text-sm mb-1 group-hover:text-indigo-900 transition-colors">
                              {cell.title}
                            </div>
                            <div className="text-xs text-slate-600 leading-relaxed">
                              {cell.text}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-300 italic">No data</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Ensure component is available globally for index.html
window.PhysicalAIFramework = PhysicalAIFramework;
