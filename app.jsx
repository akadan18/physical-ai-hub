const { useState } = React;

const PhysicalAIFramework = () => {
  const [activeTab, setActiveTab] = useState('matrix');
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedBattle, setSelectedBattle] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState('palantir');
  const [selectedVertical, setSelectedVertical] = useState('process');
  const [matrixView, setMatrixView] = useState('expanded');
  const [selectedLayer, setSelectedLayer] = useState('L6');
  const [selectedResource, setSelectedResource] = useState('fms');

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
      dynamics: 'Process intelligence evolving from first-principles simulation and wet-lab experimentation to foundation models that learn chemistry, biology and process dynamics—designing molecules in silico and predicting plant behavior without full mechanistic models.',
      battle: 'First-Principles Simulation & Wet-Lab R&D vs. Neural Surrogates + Bio/Chem FMs',
      constraints: 'Core assets last 20–40+ years, and major process changes often wait for shutdown windows every 2–5 years. Model iteration can be 2–8 weeks, but validation and governance for anything that influences operations commonly takes 4–12 weeks (or 3–12 months in heavily regulated sites).'
    },
    'L6-aerospace': {
      incumbents: ['High-fidelity CFD and FEA (ANSYS Fluent, Dassault SIMULIA, Siemens Star-CCM+)', 'Human-intensive mission planning and wargaming', 'Hand-coded autonomy stacks with explicit state machines'],
      challengers: ['Neural CFD surrogates accelerating aerodynamic and thermal design cycles 100-1000× (PhysicsX, NVIDIA Modulus)', 'VLA and world models powering autonomous drone swarms and attritable platforms (Skild AI, Physical Intelligence)', 'AI mission planners that learn operational art from simulation and historical campaigns (Palantir AIP, Anduril)'],
      dynamics: 'Aerospace intelligence shifting from compute-heavy CFD runs and doctrine-based planning to foundation models that learn fluid dynamics, vehicle control and mission sequencing—enabling rapid design iteration and autonomous operations.',
      battle: 'High-Fidelity CFD & Doctrine-Based Planning vs. Neural Surrogates + Autonomous World Models',
      constraints: 'Platforms and programs span 20–50 years, and tool/process changes can require 6–18 months of approvals. Data access and review cycles frequently take 8–24 weeks, and deployment certification/assurance can stretch 6–24 months depending on scope.'
    },
    'L6-energy': {
      incumbents: ['Reservoir simulators (SLB Eclipse/Intersect, CMG, Halliburton Nexus)', 'Decline curve analysis and type-curve forecasting', 'Physics-based flow assurance and facilities modeling'],
      challengers: ['Neural reservoir surrogates learning subsurface flow from simulation ensembles (NVIDIA Modulus, SLB AI)', 'Time-series foundation models forecasting production, ESP failures and emissions (TimeGPT, Nixtla)', 'Physics-informed digital twins that fuse seismic, production and maintenance data into unified predictive models'],
      dynamics: 'Upstream intelligence evolving from compute-intensive reservoir simulation and empirical decline curves to foundation models that learn subsurface physics—predicting flow, optimizing recovery and forecasting equipment health without re-running full simulations.',
      battle: 'Full-Physics Reservoir Simulation & Decline Curves vs. Neural Surrogates + Production FMs',
      constraints: 'Major assets live 20–40 years, and controls often remain 10–25 years, creating long-lived heterogeneity. Remote deployments can take 4–12 weeks per site, and model improvements usually need 3–9 months of stable operations data to generalize.'
    },
    'L6-utilities': {
      incumbents: ['Statistical load forecasting models tuned per utility', 'NWP-based renewable generation forecasting', 'Power-flow solvers and contingency analysis tools (PSS/E, PowerWorld, PSCAD)'],
      challengers: ['Time-series foundation models generalizing load and renewable forecasting across utilities (Google TimesFM, Salesforce Moirai, Nixtla TimeGPT)', 'Earth and atmosphere FMs improving solar/wind prediction (Google GraphCast, Jua, NVIDIA Earth-2)', 'Neural power-flow surrogates enabling real-time grid simulation and DER coordination'],
      dynamics: 'Grid intelligence shifting from utility-specific statistical models and batch power-flow studies to foundation models that generalize forecasting across regions and simulate grid behavior in real time—critical for managing millions of DERs.',
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
      dynamics: 'Transport intelligence shifting from OR solvers and hand-tuned forecasting to foundation models that learn driving behavior, predict demand patterns and optimize routing end-to-end—enabling autonomous trucks and AI-native logistics.',
      battle: 'OR Solvers & Hand-Tuned Forecasting vs. VLA Driving Models + Demand/Routing FMs',
      constraints: 'Fleet assets turn over in 5–12 years, but operational policies can change on monthly–quarterly (1–3 month) cycles. Data normalization across OEMs/devices often takes 4–12 weeks, and proven model lift usually needs 8–24 weeks of at-scale deployment.'
    },
    'L6-mining': {
      incumbents: ['Geostatistical block modeling (Leapfrog, Vulcan, Datamine, Surpac)', 'Geomechanical and blast simulation tools', 'Fleet simulation and discrete-event scheduling'],
      challengers: ['AI-enhanced orebody models that fuse drilling, assay and sensor data with learned geological priors', 'Physics-informed geomechanics surrogates predicting slope stability and ground support needs', 'Industrial sensor fusion models (Archetype AI, Augury) detecting haul-truck and crusher anomalies across vibration, thermal and acoustic streams'],
      dynamics: 'Mining intelligence evolving from kriging-based block models and periodic geotechnical studies to foundation models that learn geology, predict ground behavior and diagnose equipment health—enabling continuous orebody updates and predictive operations.',
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
      dynamics: 'Multi-tier supply chains becoming transparent and responsive, with control towers ingesting signals from ports, roads, factories and weather to recommend actions—minutes instead of weeks.',
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
      dynamics: 'Defense and commercial aero supply chains under pressure to shrink lead times and improve resilience—driving digital thread adoption and multi-tier visibility across tens of thousands of suppliers.',
      battle: '18-Month Lead Times & Single-Source Risk vs. Digital Thread + Distributed Manufacturing',
      constraints: 'Program supply chains run on 12–60 month schedules, and supplier qualification/certification can take 6–24 months. Data sharing agreements and systems integration frequently take 3–9 months, even before optimization starts.'
    },
    'L5-energy': {
      incumbents: ['Integrated majors with internal trading, logistics and procurement', 'Commodity trading platforms (ICE, CME) separate from physical scheduling', 'Oilfield service procurement via RFPs and frame contracts'],
      challengers: ['Network twins integrating physical, commercial and carbon flows (Palantir, Cognite)', 'AI-driven trading and scheduling platforms linking production to market signals', 'Carbon tracking and offset platforms integrated with supply chain'],
      dynamics: 'Upstream supply chains linking wells, pipelines, trading desks and offtakers into unified digital twins—optimizing not just cost but carbon intensity, offtake commitments and hedging.',
      battle: 'Siloed Trading & Logistics vs. Integrated Network Twins Balancing Molecules, Markets & Carbon',
      constraints: 'Spares and logistics decisions can be constrained by lead times of 3–18 months for critical equipment. Remote inventory visibility improvements often take 8–24 weeks, and contracting cycles can take 6–18 months.'
    },
    'L5-utilities': {
      incumbents: ['ISO/RTO wholesale markets (CAISO, PJM, ERCOT)', 'Bilateral PPAs managed in spreadsheets', 'T&D planning as separate long-cycle processes'],
      challengers: ['DER aggregation platforms creating virtual supply (Sunrun, Tesla, AutoGrid)', 'AI-native grid-edge coordination linking EVs, batteries, solar (WeaveGrid, ev.energy)', 'Real-time carbon-aware dispatch and settlement platforms'],
      dynamics: 'The grid supply chain fragmenting from centralized generation to millions of distributed resources—requiring new market mechanisms, visibility and orchestration.',
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
      dynamics: 'Mining supply chains linking orebody models, processing, rail, port and shipping into continuous optimization—balancing grade, throughput, logistics and emissions.',
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
      dynamics: 'Control shifting from individual human operators per machine to edge autonomy layers—GPS-guided grading, semi-autonomous piling, robot-controlled layout—with centralized remote supervision.',
      battle: 'One Operator per Machine vs. Edge-Autonomous Equipment + Remote Tele-Op Centers',
      constraints: 'Equipment control systems often stay 7–20 years, and control changes must be proven over 2–8 weeks before broad rollout. Safety sign-off and liability review can take 4–12 weeks, and automation permissions may take 3–6 months.'
    },
    'L2-datacenters': {
      incumbents: ['BMS/BAS from Schneider, Honeywell, Johnson Controls', 'Standalone PLC/DDC loops for cooling, power and fire suppression', 'Manual changeover and configuration of IT loads'],
      challengers: ['AI-native cooling and power control (Phaidra, Google DeepMind-derived controls, Vigilent)', 'Software-defined power distribution (Eaton, ABB with smart switching)', 'Workload-aware control coupling IT load placement and facility response in real time'],
      dynamics: 'Data center control moving from siloed BMS loops to AI-driven holistic optimization—dynamically tuning airflows, chiller staging and power paths based on live IT workloads and weather.',
      battle: 'Siloed BMS Loops vs. AI-Driven, Workload-Aware Facility Control',
      constraints: 'Facility systems last 10–20 years, but control software may evolve every 3–12 months with tight uptime constraints. Testing and approval for control changes typically takes 2–8 weeks, and rollback plans must be validated within 1–2 weeks.'
    },
    'L2-discrete': {
      incumbents: ['Proprietary PLCs and motion controllers (Siemens, Rockwell, Mitsubishi, Beckhoff)', 'Hard-wired safety PLCs and interlocks', 'Rigid cell-level automation logic programmed per model year'],
      challengers: ['Software-defined PLC and containerized control environments (Beckhoff TwinCAT, PLCnext, CODESYS on Linux)', 'Edge platforms enabling ML inference alongside real-time control (Siemens Industrial Edge, Ignition Edge, AWS Outposts)', 'Open robotics middleware (ROS 2 Industrial) coordinating heterogeneous automation with CI/CD for automation logic'],
      dynamics: 'Factory control evolving from monolithic, vendor-locked PLC programs to software-defined, containerized logic that can be updated, tested and deployed like IT software—unlocking continuous improvement and AI write-back.',
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
      dynamics: 'Aerospace control shifting from platform-centric, deterministic flight computers to reusable autonomy cores that can be rapidly integrated across platforms—enabling contested-environment operations with minimal comms.',
      battle: 'Platform-Centric Flight Control vs. Reusable Autonomy Cores with On-Edge AI',
      constraints: 'Control logic may remain stable 10–25 years, and changes can require 6–24 months of assurance depending on certification scope. Testing and review cycles commonly take 8–24 weeks, and rollout is staged over 3–9 months.'
    },
    'L2-energy': {
      incumbents: ['SCADA/RTU networks for wells and pipelines (Emerson, Honeywell, ABB)', 'Local wellhead and pump controllers', 'Centralized control rooms with manual intervention'],
      challengers: ['Edge controllers with ML-based optimization (Ambyint, Kelvin, Rockwell edge)', 'Pad-level and field-level optimization coordinating multiple wells in real time', 'Autonomous drilling and completion systems that adjust parameters based on downhole conditions'],
      dynamics: 'Upstream control evolving from centralized SCADA with manual intervention to edge intelligence at the pad and well level—autonomously adjusting artificial lift, chokes and injection based on live reservoir and equipment data.',
      battle: 'Centralized SCADA with Manual Intervention vs. Edge AI Autonomously Optimizing Wells',
      constraints: 'Controls can persist 10–25 years across diverse sites, and remote rollout adds 4–12 weeks per site. Safety/HSE review and authorization for changes often takes 4–12 weeks, with broader governance taking 3–9 months.'
    },
    'L2-utilities': {
      incumbents: ['SCADA/EMS for transmission, SCADA/DMS for distribution (GE, Siemens, Schneider, ABB)', 'Relay protection and local automation (SEL, GE, ABB)', 'Manual switching and restoration procedures'],
      challengers: ['DERMS and VPP platforms enabling real-time dispatch of distributed resources (AutoGrid, Sunverge, Enbala)', 'Grid-edge intelligence enabling local optimization and islanding (Heila, Autogrid, Schneider)', 'FLISR (Fault Location, Isolation, Service Restoration) algorithms automating outage response'],
      dynamics: 'Grid control shifting from centralized dispatch of bulk generation to orchestration of millions of DERs—requiring edge intelligence that can act locally while coordinating globally.',
      battle: 'Centralized Bulk Dispatch vs. Distributed Edge Control Coordinating Millions of DERs',
      constraints: 'Control infrastructure lifecycles are 30–60 years, with upgrades planned on 12–36 month programs. Security and operations approvals often take 8–24 weeks, and write-back/automation permissioning can take 6–18 months.'
    },
    'L2-maritime': {
      incumbents: ['Bridge navigation and automation systems (Kongsberg, Wärtsilä, Raytheon Anschütz)', 'Engine automation and alarm systems', 'Separate cargo, ballast and stability control systems'],
      challengers: ['Integrated bridge systems with voyage optimization and semi-autonomous navigation', 'Remote engine-room monitoring and control enabling shore-based operations', 'Edge compute tying navigation, propulsion and cargo systems into unified optimization'],
      dynamics: 'Ship control evolving from bridge- and engine-room-centric manual operations to integrated automation layers—enabling remote monitoring, semi-autonomous voyages and real-time fuel and trim optimization.',
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
      dynamics: 'Mining control evolving from dispatcher-to-driver radio and siloed plant control to site-wide autonomous fleets managed from remote centers—optimizing traffic, fuel and throughput across the entire pit.',
      battle: 'Dispatcher-to-Driver Radio vs. Autonomous Fleet Control from Remote Operations Centers',
      constraints: 'Control systems on fixed plant can last 20–40 years, while mobile controls evolve over 7–15 years. Harsh environments can stretch validation to 4–12 weeks, and multi-site rollout often takes 3–9 months.'
    },

    // ==================== L1 - Sensing ====================
    'L1-construction': {
      incumbents: ['Total stations and GPS rovers (Trimble, Topcon, Leica)', 'Manual progress photos and walk-throughs', 'Periodic drone flights for topography'],
      challengers: ['Continuous reality capture (OpenSpace, Buildots, Disperse, Evercam) comparing as-built to BIM daily', 'IoT sensors on equipment, materials and workers', 'LiDAR and photogrammetry generating digital twins of sites'],
      dynamics: 'Jobsites shifting from periodic manual measurement to continuous, automated sensing—enabling real-time variance detection against BIM and schedule.',
      battle: 'Weekly Drone Flights & Walk-Throughs vs. Continuous AI-Powered Reality Capture',
      constraints: 'Sites change over 6–36 months, so installs must be fast (typically 1–4 weeks per site) and removable. Sensor calibration and maintenance cycles run 3–12 months, and connectivity may vary daily over 1–7 days of disruption.'
    },
    'L1-datacenters': {
      incumbents: ['BMS sensors (temperature, humidity, power metering)', 'Manual rounds and visual inspections', 'Siloed fire, security and access control systems'],
      challengers: ['Dense environmental sensing grids (EkkoSense, RF Code, Nlyte Energy Optimizer, Sunbird DCIM analytics)', 'AI-based thermal and airflow analytics', 'Integrated security, power and environmental monitoring'],
      dynamics: 'Data center sensing evolving from sparse BMS points to dense, AI-analyzed grids—enabling rack-level thermal optimization and predictive maintenance.',
      battle: 'Sparse BMS Points vs. Dense AI-Analyzed Environmental Sensing',
      constraints: 'Facilities persist 10–20 years, but telemetry stacks can change every 6–24 months. Deploying new sensing or normalization typically takes 2–8 weeks, and security approvals commonly take 2–8 weeks.'
    },
    'L1-discrete': {
      incumbents: ['End-of-line quality inspection (CMM, manual visual)', 'Periodic vibration and thermal checks by maintenance techs', 'Point-to-point wiring from sensors to PLCs'],
      challengers: ['Inline 3D metrology, X-ray/CT and force/torque sensing for 100% inspection', 'Condition monitoring on motors, gearboxes and spindles (SKF, Augury, Tractian)', 'Wireless sensor networks and IO-Link enabling dense, flexible instrumentation'],
      dynamics: 'Factory sensing shifting from sparse, end-of-line inspection to dense, inline instrumentation—enabling 100% quality verification and continuous equipment health monitoring.',
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
      dynamics: 'Defense sensing shifting from platform-centric, stovepiped sensors to distributed, AI-fused sensing networks—enabling kill webs where any sensor can cue any shooter.',
      battle: 'Platform-Centric Stovepiped Sensors vs. Distributed AI-Fused Kill Webs',
      constraints: 'Instrumentation may be retained 5–15 years, with documentation retention 10+ years. Security and data governance reviews often take 8–24 weeks, and qualifying sensing for production can take 3–12 months.'
    },
    'L1-energy': {
      incumbents: ['Wellhead and pipeline SCADA (pressure, temperature, flow)', 'Periodic pigging and inspection campaigns', 'Seismic surveys for exploration'],
      challengers: ['Fiber-optic DTS/DAS along wells and pipelines for continuous monitoring', 'Permanent downhole gauges and intelligent completions', 'Satellite methane and leak detection (GHGSat, Kairos)'],
      dynamics: 'Upstream sensing evolving from sparse SCADA and periodic inspections to continuous fiber, downhole and satellite monitoring—enabling real-time reservoir, integrity and emissions management.',
      battle: 'Sparse SCADA & Periodic Inspections vs. Continuous Fiber, Downhole & Satellite Sensing',
      constraints: 'Field sensing hardware may need replacement every 3–10 years, and deployments can take 2–8 weeks per remote site. Connectivity gaps can last hours–days, and achieving consistent data quality typically takes 8–24 weeks.'
    },
    'L1-utilities': {
      incumbents: ['SCADA RTUs at substations and feeders', 'Manual meter reading (declining)', 'Periodic line patrols and inspections'],
      challengers: ['AMI smart meters enabling granular load visibility', 'PMUs and high-speed fault recorders', 'Drone and robot inspection for lines, poles and substations', 'Grid-edge sensing (Sense, Whisker Labs, Schneider Wiser) inside homes'],
      dynamics: 'Grid sensing shifting from sparse SCADA and periodic inspections to AMI-enabled load visibility, drone/robot patrols and grid-edge intelligence—critical for hosting DERs and managing wildfire risk.',
      battle: 'Sparse SCADA & Periodic Patrols vs. AMI + Drone + Grid-Edge Sensing Networks',
      constraints: 'Grid sensing assets can last 10–25 years, but rollout programs often span 12–36 months. Security approvals often take 8–24 weeks, and field installation pacing can be 2–8 weeks per region.'
    },
    'L1-maritime': {
      incumbents: ['Bridge navigation sensors (radar, AIS, GPS, echo sounder)', 'Engine-room instrumentation (local gauges and alarms)', 'Manual hull and cargo inspections'],
      challengers: ['Denser onboard sensing (fuel flow, emissions, hull fouling, cargo condition)', 'AI-based voyage and performance analytics (Nautilus Labs, Orca AI)', 'Shore-based fleet monitoring centers'],
      dynamics: 'Maritime sensing evolving from bridge- and engine-room-centric instrumentation to dense, connected sensing feeding AI performance models—enabling continuous hull, propulsion and cargo optimization.',
      battle: 'Bridge- & Engine-Room-Centric Gauges vs. Dense, AI-Connected Fleet Sensing',
      constraints: 'Onboard sensing can persist 5–15 years, but major upgrades often happen at dry-dock every 2.5–5 years. Connectivity can drop for hours–days, and fleet standardization typically takes 3–9 months.'
    },
    'L1-land': {
      incumbents: ['Driver logs and manual inspections', 'Basic telematics (GPS, fuel)', 'Warehouse barcode scanning'],
      challengers: ['AV truck perception stacks (cameras, lidar, radar) from Aurora, Kodiak, Waymo Via, Gatik', 'AI telematics with dashcams and driver monitoring (Samsara, Motive)', 'Warehouse vision systems for inventory and pick verification (Plus One Robotics, Vimaan)'],
      dynamics: 'Transport sensing shifting from basic telematics and manual verification to rich perception stacks and AI-analyzed camera feeds—enabling autonomy, safety and real-time inventory accuracy.',
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
      dynamics: 'Jobsites shifting from all-diesel fleets and stick-built methods toward electrified equipment, factory-built modules and mass timber—driven by carbon mandates, labor shortages and productivity.',
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
      dynamics: 'Factory physics shifting from rigid, conveyor-fed lines to Lego-like cells, AMR logistics and additive—enabling rapid product changeover and distributed manufacturing.',
      battle: 'Fixed High-Volume Lines vs. Reconfigurable Cells + AMR Logistics + Additive',
      constraints: 'Lines last 10–25 years, and retrofits must fit maintenance windows weekly–monthly (1–4 weeks). Capex approval often takes 3–12 months, and production disruption must be kept to hours–days.'
    },
    'L0-process': {
      incumbents: ['Large stainless-steel batch trains (reactors, heat exchangers, evaporators, spray dryers)', 'OEMs: GEA, Alfa Laval, SPX FLOW, Tetra Pak, Bühler', 'Fixed CIP/SIP utilities and hardwired interlocks'],
      challengers: ['Single-use modular skids eliminating cleaning validation (Sartorius, Cytiva for biopharma)', 'Continuous manufacturing platforms replacing batch (GEA ConsiGma, PCMM mini-factories)', 'Bio-based fermentation and cell-culture facilities (Ginkgo Bioworks, LanzaTech) reshaping asset footprints'],
      dynamics: 'Process plants shifting from large batch trains requiring extensive cleaning to modular single-use, continuous-flow and bio-based assets—cutting footprints 50%+ while boosting flexibility.',
      battle: 'Big Steel Batch Trains vs. Modular, Continuous & Bio-Based Lines',
      constraints: 'Core assets last 20–40+ years, with major rebuilds tied to turnarounds every 2–5 years. Capex and engineering cycles can take 6–24 months, and safety constraints are enforced continuously over 24/7 operations.'
    },
    'L0-aerospace': {
      incumbents: ['Manned fighters, bombers, tankers, transports (Lockheed, Boeing, Northrop)', 'Large, exquisite satellite constellations (Lockheed, Northrop, Boeing)', 'Vertical integration at prime contractors'],
      challengers: ['Attritable and autonomous drones (Anduril Roadrunner, Kratos, GA-ASI, AeroVironment Switchblade)', 'LEO mega-constellations (SpaceX Starlink, Amazon Kuiper) commoditizing space', 'In-space manufacturing and servicing (Varda, Axiom, Astroscale)'],
      dynamics: 'Aerospace assets shifting from small numbers of exquisite platforms to large numbers of attritable, autonomous systems and commercial space infrastructure—disrupting primes and reshaping force structure.',
      battle: 'Exquisite Manned Platforms vs. Attritable Drones + Commercial LEO Constellations',
      constraints: 'Platforms and plants can run 20–50 years, and program changes are planned 12–60 months out. Certification and supplier constraints can add 6–24 months to any physical change.'
    },
    'L0-energy': {
      incumbents: ['Drilling rigs, frac fleets, production facilities (SLB, Halliburton, Baker Hughes)', 'Pipeline networks (Kinder Morgan, Enterprise, TC Energy)', 'Diesel and gas-turbine power for operations'],
      challengers: ['All-electric production facilities (electric ESPs, e-compressors, full-electric subsea)', 'CCUS and blue hydrogen at scale', 'Deep geothermal (Fervo, Quaise) using oilfield techniques'],
      dynamics: 'Upstream assets evolving from diesel-intensive operations toward electrified, lower-emission production—while new technologies like enhanced geothermal open adjacent opportunities for oilfield skills.',
      battle: 'Diesel-Intensive Extraction vs. Electrified Production + Geothermal Diversification',
      constraints: 'Assets last 20–40 years, often distributed across remote sites. Access and permitting can take 4–24 weeks, and major upgrades can require 6–24 months of planning.'
    },
    'L0-utilities': {
      incumbents: ['Central thermal generation (coal, gas, nuclear)', 'Radial T&D networks designed for one-way power flow', 'Aging water treatment plants and pipe networks'],
      challengers: ['Utility-scale renewables + storage (NextEra, AES, Fluence, Tesla Megapack)', 'HVDC links and grid-forming inverters enabling bidirectional flow', 'Modular water treatment and reuse (desalination, direct potable reuse)'],
      dynamics: 'Utility assets shifting from central thermal plants and one-way grids to distributed renewables, storage and bidirectional power flows—requiring new interconnection, control and market structures.',
      battle: 'Central Thermal + One-Way T&D vs. Distributed Renewables + Storage + Bidirectional Grids',
      constraints: 'Grid infrastructure lifecycles are 30–60 years, with upgrades planned on 12–36 month programs. Regulatory and procurement timelines can extend changes to 12–36 months, and outages are tightly managed in hours–days.'
    },
    'L0-maritime': {
      incumbents: ['Conventional steel-hull cargo vessels (container, bulk, tanker)', 'Marine diesel and heavy fuel oil propulsion', 'Traditional port cranes and terminal infrastructure'],
      challengers: ['Alternative fuels (LNG, methanol, ammonia, hydrogen) requiring new propulsion and bunkering', 'Hull innovations (air lubrication, wind-assist like Flettner rotors, foils)', 'Autonomous and unmanned surface vessels (Kongsberg, Sea Machines)'],
      dynamics: 'Shipping assets shifting from conventional diesel vessels to diverse hull forms and propulsion types—driven by IMO decarbonization mandates and digital-native newbuilds enabling autonomy.',
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
      dynamics: 'Workforce fell from 195K (2014) to 119K (2024); 62% of Gen Z find O&G careers unappealing. Safety, cost & decarbonization pressures systematically keeping workers out of red zones and off remote platforms—turning boots-on-ground roles into remote supervisors and robot operators.',
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
      dynamics: '50% of workforce retiring by 2029 (~221K workers); 71% of execs say talent shortage impacting production; 66% of youth aged 15-30 would not work in mining. Remote/hazardous locations make mining an early autonomy adopter—shifting roles from in-cab operators to control-room supervisors, fleet maintenance, and data analysts.',
      battle: 'In-Cab Operators in Every Truck & Shovel vs. Remote Supervisors Managing Autonomous Fleets',
      constraints: 'Operator competence typically takes 6–18 months, and senior pit/plant expertise takes 3–10 years. Shift-based change adoption usually takes 4–12 weeks, with sustained behavior change over 3–9 months.'
    },
  };

  // ============================================
  // SQUEEZE TAB DATA
  // ============================================

  const squeezeData = {
    construction: { aiPressure: 65, autonomyPressure: 45, bottlenecks: [
      { name: 'Fragmented Trades', severity: 85, description: 'Multiple subcontractors, no unified data model' },
      { name: 'Legacy Assets', severity: 60, description: 'Diesel equipment without connectivity' },
      { name: 'Workforce Resistance', severity: 70, description: 'Union concerns, skills gaps' },
      { name: 'Permitting/Regulations', severity: 55, description: 'Local codes, inspections, safety requirements' },
    ]},
    datacenters: { aiPressure: 85, autonomyPressure: 40, bottlenecks: [
      { name: 'Power Constraints', severity: 90, description: 'Grid connections, renewable mandates' },
      { name: 'Cooling Limits', severity: 80, description: 'Air vs liquid, density constraints' },
      { name: 'Integration Debt', severity: 50, description: 'IT/facilities silos, DCIM limitations' },
    ]},
    discrete: { aiPressure: 75, autonomyPressure: 70, bottlenecks: [
      { name: 'Vendor Lock-in', severity: 75, description: 'Proprietary PLCs, closed ecosystems' },
      { name: 'Legacy Assets', severity: 70, description: '20+ year old equipment without APIs' },
      { name: 'IT/OT Divide', severity: 65, description: 'Separate networks, different teams' },
      { name: 'Change Management', severity: 55, description: 'Production pressure, risk aversion' },
    ]},
    process: { aiPressure: 70, autonomyPressure: 40, bottlenecks: [
      { name: 'GMP/Regulatory', severity: 95, description: 'Every change needs validation, audit trails' },
      { name: 'Legacy DCS', severity: 85, description: '20-year-old Honeywell/Emerson systems' },
      { name: 'IT/OT Divide', severity: 80, description: 'Air-gapped networks, Purdue model' },
      { name: 'Data Quality', severity: 65, description: 'Historian gaps, manual batch records' },
      { name: 'Change Management', severity: 60, description: 'Risk-averse culture, operator skepticism' },
    ]},
    aerospace: { aiPressure: 75, autonomyPressure: 65, bottlenecks: [
      { name: 'Security/Classification', severity: 90, description: 'ITAR, clearances, air-gapped systems' },
      { name: 'Certification', severity: 85, description: 'DO-178C, flight safety requirements' },
      { name: 'Supply Chain', severity: 70, description: '18-month lead times, single sources' },
      { name: 'Legacy Platforms', severity: 65, description: '40-year-old aircraft, long service lives' },
    ]},
    energy: { aiPressure: 70, autonomyPressure: 55, bottlenecks: [
      { name: 'Remote Locations', severity: 75, description: 'Offshore, arctic, desert—connectivity limited' },
      { name: 'Legacy SCADA', severity: 70, description: 'Proprietary protocols, security concerns' },
      { name: 'Reservoir Uncertainty', severity: 65, description: 'Subsurface complexity, model limitations' },
      { name: 'HSE Requirements', severity: 60, description: 'Safety-critical, zone classifications' },
    ]},
    utilities: { aiPressure: 65, autonomyPressure: 35, bottlenecks: [
      { name: 'Regulatory Recovery', severity: 90, description: 'Rate cases, prudency reviews for AI spend' },
      { name: 'Legacy Grid', severity: 85, description: '50-year-old infrastructure, one-way design' },
      { name: 'IT/OT Divide', severity: 75, description: 'NERC CIP, air gaps, separate orgs' },
      { name: 'Workforce', severity: 70, description: 'Aging lineworkers, skills gaps' },
    ]},
    maritime: { aiPressure: 55, autonomyPressure: 45, bottlenecks: [
      { name: 'Union Resistance', severity: 80, description: 'Longshoremen, seafarer unions' },
      { name: 'Connectivity', severity: 70, description: 'VSAT limitations, bandwidth costs' },
      { name: 'IMO Regulations', severity: 65, description: 'Safety, emissions, Manning requirements' },
      { name: 'Legacy Vessels', severity: 60, description: '25-year ship lives, retrofit challenges' },
    ]},
    land: { aiPressure: 70, autonomyPressure: 75, bottlenecks: [
      { name: 'Regulatory Approval', severity: 75, description: 'AV certification, state-by-state' },
      { name: 'Labor Relations', severity: 65, description: 'Teamsters, warehouse unions' },
      { name: 'Infrastructure', severity: 55, description: 'Charging, ODD limitations' },
      { name: 'Integration', severity: 50, description: 'TMS/WMS fragmentation' },
    ]},
    mining: { aiPressure: 65, autonomyPressure: 70, bottlenecks: [
      { name: 'Remote Operations', severity: 80, description: 'Connectivity, harsh environments' },
      { name: 'Legacy Equipment', severity: 70, description: 'Diverse OEM fleets, proprietary systems' },
      { name: 'Workforce', severity: 65, description: 'Remote locations, skills gaps' },
      { name: 'Permitting', severity: 60, description: 'Environmental reviews, community relations' },
    ]},
  };

  const bottleneckDefinitions = [
    { id: 'legacy-assets', name: 'Legacy Assets', icon: '🏭', color: 'bg-orange-100 border-orange-400', description: 'Equipment designed before connectivity era—no sensors, no APIs, proprietary protocols' },
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
        wedge: 'Start with predictive maintenance and asset performance—immediate ROI from reduced downtime. Pre-built applications deploy in 1-2 quarters vs years for custom development.',
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
        thesis: 'Own the industrial data layer by solving the "data liberation" problem—contextualizing and connecting siloed OT/IT data so AI and analytics can actually work. Become the data foundation that all industrial AI applications build on.',
        play: 'Land by solving the #1 blocker to industrial AI: bad/missing/siloed data. Cognite Data Fusion contextualizes data from historians, ERP, sensors, and documents into a unified industrial data model. Then expand as the platform for all analytics and AI.',
        wedge: 'Start with asset-intensive industries drowning in data silos (Oil & Gas, Utilities, Process Mfg). Quick wins from finally connecting historian data to maintenance systems, enabling actual condition-based decisions.',
        moat: 'Proprietary industrial data model and contextualization engine. Network effects as more connectors and applications are built on the platform. Deep domain expertise in process industries.'
      },

      offerings: [
        { name: 'Cognite Data Fusion', layer: 'L4', description: 'Industrial DataOps platform for data liberation and contextualization', value: 'Connect 80% of industrial data that is currently siloed. Enable analytics and AI on unified data model.', industries: ['Energy', 'Process Mfg', 'Utilities', 'Mining'] },
        { name: 'Data Contextualization', layer: 'L4', description: 'AI-powered linking of time series, assets, documents, 3D models', value: 'Transform raw data into connected knowledge graph. 70% reduction in data preparation time.', industries: ['Energy', 'Process Mfg', 'Utilities'] },
        { name: 'Industrial Applications', layer: 'L3-L4', description: 'Pre-built apps for operations, maintenance, production', value: 'OEE monitoring, predictive insights, digital twin visualization. Built on Data Fusion foundation.', industries: ['Energy', 'Process Mfg', 'Utilities', 'Discrete Mfg'] },
        { name: 'Cognite AI/GenAI', layer: 'L6', description: 'Industrial AI and GenAI on contextualized data', value: 'Reliable AI responses grounded in actual operational data. Not hallucinating—data-backed insights.', industries: ['Energy', 'Process Mfg', 'Utilities'] },
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
        thesis: 'Build the "GPT for robots"—a general-purpose foundation model (π0) that enables any robot to perform dexterous manipulation tasks, trained on massive multi-robot datasets. Become the AI brain that powers billions of robots.',
        play: 'Develop Vision-Language-Action (VLA) models that combine internet-scale pretraining with real-world robot data. Open-source base models to drive adoption, then monetize through enterprise licensing and fine-tuning services.',
        wedge: 'Focus on dexterous manipulation—the hardest robotics problem. Demonstrate generalization across robots, tasks, and environments that no other approach can match.',
        moat: 'Proprietary training infrastructure and methodology. Data flywheel from deployments. Team includes top robotics AI researchers (Berkeley/Google). $1B+ raised from top investors.'
      },

      offerings: [
        { name: 'π0 Foundation Model', layer: 'L6', description: 'General-purpose VLA model for robot control', value: 'Pre-trained on 7 robot platforms, 68 tasks. Fine-tune to new tasks with 1-20 hours of data.', industries: ['Discrete Mfg', 'Land Transport', 'Process Mfg'] },
        { name: 'π0.5 (Open-World)', layer: 'L6', description: 'VLA with open-world generalization', value: 'Perform tasks in entirely new environments never seen in training. Kitchen/bedroom cleanup in new homes.', industries: ['Service Robotics', 'Logistics'] },
        { name: 'π0-FAST', layer: 'L6', description: 'Efficient VLA with action tokenization', value: '5x faster training, improved language following. Compress action sequences for efficient inference.', industries: ['All robotics'] },
        { name: 'Robot Labor Automation', layer: 'L-1/L0', description: 'Enable robots to perform human manipulation tasks', value: 'Folding laundry, bussing tables, packing items, cleaning—tasks previously requiring human dexterity. The "Labor + Physics Collapse."', industries: ['Discrete Mfg', 'Land Transport', 'Service'] },
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
        wedge: 'Warehouse picking—high variability (millions of SKUs), immediate ROI (labor costs), and generates training data. Deployed in 15 countries with dozens of customers.',
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
      logo: '🛡️',
      tagline: 'Defense Autonomy Platform',
      color: 'slate',
      presence: andurilPresence,
      
      strategy: {
        thesis: 'Transform defense with AI-powered autonomous systems by building both the software platform (Lattice) and the hardware (drones, submarines, missiles) that legacy primes cannot deliver at startup speed.',
        play: 'Lattice OS becomes the "operating system for war"—connecting sensors, shooters, and commanders across all domains. Hardware products generate revenue and prove the platform. Arsenal factories enable mass production.',
        wedge: 'Counter-UAS (drone defense)—urgent need, rapid iteration, proves the platform. Expand to surveillance (Sentry), autonomous vehicles (Ghost drones, submarines), and eventually offensive systems.',
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
        'Process manufacturing transforms raw materials through chemical, thermal, or biological reactions into products that cannot be easily disassembled—think pharmaceuticals, specialty chemicals, food & beverage, and consumer packaged goods. These industries operate continuous or batch processes where consistency, yield optimization, and regulatory compliance are paramount. The AI transformation here centers on replacing first-principles models with learned surrogates, automating recipe optimization, and enabling real-time quality prediction.',
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
        'Discrete manufacturing assembles distinct, countable items—automobiles, electronics, industrial machinery, and aerospace components. Unlike process industries, products can be disassembled, and production involves complex sequences of machining, fabrication, and assembly operations. AI transformation focuses on vision-based quality inspection, robotic manipulation, predictive maintenance for CNC equipment, and supply chain orchestration across tiered supplier networks.',
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
        'The energy sector encompasses exploration, production, transportation, and refining of hydrocarbons—from offshore platforms and shale fields to pipelines and refineries. AI transformation targets reservoir modeling, production optimization, predictive maintenance for critical rotating equipment, and emissions monitoring. The industry operates some of the most capital-intensive and safety-critical assets on earth, with 20-40 year field lifecycles.',
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
        { title: 'Virtual Power Plant Orchestration', description: 'AI coordination of millions of distributed energy resources—batteries, EVs, smart thermostats—as dispatchable capacity.', layers: ['L3', 'L2', 'L5'], impact: 'Transformational' },
        { title: 'Predictive Asset Management', description: 'ML models for transformer health, line sag, and vegetation encroachment. Prioritize maintenance and capital investment with risk-based optimization.', layers: ['L1', 'L4', 'L3'], impact: 'High' },
        { title: 'Outage Prediction & Restoration', description: 'AI that predicts outages from weather and asset condition, then optimizes crew dispatch and switching sequences for faster restoration.', layers: ['L3', 'L1', 'L6'], impact: 'High' },
        { title: 'Grid Edge Intelligence', description: 'Autonomous control at the distribution edge—smart inverters, reclosers, and capacitor banks that respond to local conditions in real-time.', layers: ['L2', 'L3', 'L1'], impact: 'High' },
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
        'Construction creates the built environment—from highways and bridges to commercial buildings and residential developments. Unlike manufacturing, every project is essentially a prototype built in uncontrolled outdoor conditions with temporary workforces. AI transformation targets design optimization, schedule prediction, safety monitoring, quality inspection, and equipment fleet management across fragmented subcontractor ecosystems.',
        'The industry is notoriously slow to digitize, with productivity flat for decades while manufacturing improved dramatically. Key barriers include project-based accounting that disincentivizes technology investment, fragmented value chains, and a workforce skeptical of surveillance. However, labor shortages and cost pressures are driving adoption of reality capture, AI-powered scheduling, and autonomous equipment. The construction tech stack remains fragmented across estimating, project management, and field execution.'
      ],
      disruptionUseCases: [
        { title: 'AI-Powered Schedule & Risk Prediction', description: 'ML models that predict schedule delays and cost overruns from project data. Early warning systems for at-risk activities.', layers: ['L4', 'L3', 'L6'], impact: 'High' },
        { title: 'Reality Capture & Progress Tracking', description: 'Drones, 360° cameras, and LiDAR combined with AI to automatically track construction progress against BIM. Detect deviations early.', layers: ['L1', 'L3', 'L6'], impact: 'High' },
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
        'The Intelligence Layer represents the highest level of abstraction in industrial operations—where data is transformed into decisions. For decades, this layer was dominated by three pillars: first-principles physics models (CFD, thermodynamic simulators), statistical methods (SPC, regression, ARIMA), and human expert judgment built from years of experience. These approaches are interpretable, validated, and trusted—but brittle, slow to adapt, and unable to exploit the flood of operational data.',
        'The strategic battle is not primarily between different AI vendors (GPT vs Claude vs Gemini)—it\'s between the entire traditional decision-making paradigm and the AI paradigm. The key tensions are: explainability (physics models are interpretable; neural networks are black boxes), validation (how do you certify an AI for safety-critical decisions?), and trust (will engineers accept AI recommendations over their own judgment?). Industries that solve these tensions first will gain decisive competitive advantage.'
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
        'The Enterprise Layer translates shop-floor operations into business metrics—cost per unit, inventory value, compliance status, and financial performance. Legacy ERP systems (SAP, Oracle) own transactional data but struggle with real-time analytics and AI integration.',
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
        'The Operations Layer is the "machine brain" that coordinates production—sequencing jobs, managing recipes, controlling quality, and responding to real-time events. Traditional MES and SCADA systems provide rigid, rules-based control validated for compliance.',
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
        'The Control Layer is where digital commands become physical actions—valves open, motors spin, robots move. Traditional PLCs and DCS systems from Siemens, Rockwell, ABB, and Honeywell execute deterministic control loops with guaranteed response times.',
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
            traditional: 'No edge layer—direct PLC/DCS to enterprise',
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
        'The Sensing Layer is the nervous system of industrial operations—capturing temperature, pressure, flow, vibration, images, and countless other signals that represent physical reality. Traditional sensors provide single-point measurements; AI-enabled sensing fuses multiple modalities.',
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
      description: 'The physical layer of production equipment, robots, vehicles, and infrastructure—the actual machines that transform materials and move goods. This is where bits meet atoms.',
      overview: [
        'The Physical Assets Layer represents the tangible capital that makes industry work—reactors, conveyors, robots, trucks, pumps, and buildings. These assets have 20-50 year lifecycles, creating massive installed bases that constrain the pace of digital transformation.',
        'The strategic battle is between OEMs seeking software revenue from connected equipment versus operators wanting vendor-agnostic flexibility. The brownfield challenge—modernizing existing assets—vastly outweighs greenfield opportunities.'
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
            traditional: 'Passive infrastructure—buildings, utilities, roads',
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
        'The Labor Layer represents the human capital that makes industry work—from shop-floor operators to control room technicians to maintenance crews. This workforce faces a demographic crisis as experienced workers retire faster than new talent enters, taking decades of tribal knowledge with them.',
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
  // TAB DEFINITIONS
  // ============================================

  const tabs = [
    { id: 'matrix', name: 'Matrix', icon: '📊' },
    { id: 'framework', name: 'Framework', icon: '🏗️' },
    { id: 'layers', name: 'Layers', icon: '📚' },
    { id: 'industries', name: 'Industries', icon: '🏭' },
    { id: 'players', name: 'Key Players', icon: '🏢' },
    { id: 'resources', name: 'Other Resources', icon: '📎' },
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
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              matrixView === 'concise' ? 'translate-x-6' : 'translate-x-1'
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
      currentState: 'Traditional decision-making relies on first-principles physics models, statistical methods (SPC, ARIMA), and human expert judgment. AI promises learned intelligence that improves with data—but faces trust, explainability, and validation barriers.',
      whatItIs: 'The cognitive layer where data becomes decisions. Encompasses physics simulation, forecasting, optimization, anomaly detection, and expert knowledge systems.',
      keyQuestion: 'Can AI-powered intelligence earn trust in safety-critical environments, or will traditional methods remain the standard for validated decisions?'
    },
    'L5': {
      fullName: 'Supply Chain Layer',
      war: 'The Network War',
      currentState: 'Traditional supply chains operate as isolated silos—each company optimizes locally without visibility into supplier or customer operations. Multi-tier networks remain opaque.',
      whatItIs: 'The coordination layer spanning multiple enterprises: procurement, logistics, inventory, demand planning, and supplier management across the extended value chain.',
      keyQuestion: 'Can AI-powered supply chain platforms create true multi-enterprise visibility, or will data-sharing barriers preserve fragmentation?'
    },
    'L4': {
      fullName: 'Enterprise Layer',
      war: 'The Data Lake War',
      currentState: 'Legacy ERP systems (SAP, Oracle) hold transactional data but struggle with real-time analytics. Cloud platforms and data lakes compete to become the enterprise "source of truth."',
      whatItIs: 'The business system layer: ERP, MES integration, financial systems, quality management, and enterprise analytics that translate operational data into business decisions.',
      keyQuestion: 'Who owns the enterprise data model—incumbent ERP vendors extending down, or cloud-native platforms extending up?'
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
      whatItIs: 'The physical layer: production equipment, robots, vehicles, infrastructure—the actual machines and assets that transform materials and move goods.',
      keyQuestion: 'Can smart retrofits extend asset life, or will AI-native equipment eventually force wholesale replacement?'
    },
    'L-1': {
      fullName: 'Labor Layer',
      war: 'The Skill War',
      currentState: 'Workforce aging and skills gaps create urgency. AI copilots augment workers while robotics automates tasks. The human-machine interface is being redefined.',
      whatItIs: 'The human layer: operators, technicians, engineers, and managers—their skills, workflows, training, and interaction with automated systems.',
      keyQuestion: 'Will AI augment workers (keeping humans in the loop) or replace them (autonomous operations)?'
    }
  };

  // AI Collapse descriptions (top layers)
  const aiCollapseData = {
    'L6-L5': {
      title: 'Intelligence + Supply Chain Collapse',
      description: 'Foundation models absorb demand forecasting, supplier risk assessment, and network optimization. The "brain" extends across enterprise boundaries.',
      processMfgExample: 'A chemical company\'s AI predicts raw material price swings, automatically adjusts procurement timing, and coordinates with suppliers—all from a unified model that understands both market dynamics and production constraints.',
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
      processMfgExample: 'A pharma plant receives a rush order. AI automatically resequences batches, adjusts cleaning schedules, updates quality documentation, and notifies affected customers—without human schedulers.',
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
      processMfgExample: 'Most pumps, motors, and fans have no continuous monitoring. Wireless sensors from Augury, SKF, Petasense turn "dumb" assets into data sources—no wiring, no downtime.',
      outcome: 'Retrofit sensing unlocks AI/PdM on existing assets; embedded sensing comes with replacements over decades.'
    },
    'L1-L2': {
      title: 'Sensing + Control Collapse',
      description: 'AI-at-the-edge merges perception and action, but validated PLCs/DCS have decades of remaining life. Edge computing sits alongside existing control systems—protocol gateways, edge historians, AI inference without touching safety-critical logic.',
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
        { name: 'Legacy Assets', description: 'Equipment designed before connectivity—no sensors, no APIs, proprietary protocols. 20-50 year replacement cycles lock in old technology.' },
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
                    ⬇️ AI COLLAPSING DOWN
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
                  AI pushes down, Robotics pushes up via RETROFIT. Most assets lack sensors and autonomy—bolt-on upgrades (Augury, Bedrock) unlock the brownfield installed base.
                </p>
              </div>

              {/* Robotics Collapse (Bottom) */}
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
                <div className="text-center mb-2">
                  <span className="bg-amber-600 text-white px-3 py-1 rounded text-sm font-bold">
                    ⬆️ ROBOTICS COLLAPSING UP (via Retrofit)
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
            <div className="font-bold text-indigo-700 text-sm mb-2">⬇️ AI Collapse Examples</div>
            {Object.entries(aiCollapseData).map(([key, collapse]) => (
              <div key={key} className="bg-white rounded p-2 mb-2 text-xs">
                <span className="font-semibold">{collapse.title}:</span> {collapse.processMfgExample}
              </div>
            ))}
          </div>
          <div>
            <div className="font-bold text-amber-700 text-sm mb-2">⬆️ Robotics Collapse Examples (Retrofit Path)</div>
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
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedLayer === l.id
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
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedVertical === v.id
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

        {/* Layer-by-Layer Analysis with Disruption Use Cases */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Layer Analysis - 3 columns */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-bold text-lg">AI Transformation by Layer</h3>
            {layers.map((layer) => {
              const cellData = data[`${layer.id}-${selectedVertical}`];
              if (!cellData) return null;
              // Find disruption opportunities relevant to this layer
              const relevantOpportunities = industry.disruptionUseCases?.filter(opp => opp.layers.includes(layer.id)) || [];
              return (
                <div key={layer.id} className={`${layerColors[layer.id]} border-2 rounded-lg p-4`}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-2xl font-bold">{layer.id}</div>
                    <div>
                      <div className="font-bold">{layer.name}</div>
                      <div className="text-sm text-purple-700">{layer.theme}</div>
                    </div>
                    {relevantOpportunities.length > 0 && (
                      <div className="ml-auto flex gap-1">
                        {relevantOpportunities.map((opp, i) => (
                          <span key={i} className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded" title={opp.title}>
                            {i + 1}
                          </span>
                        ))}
                      </div>
                    )}
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

          {/* Disruption Use Cases Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 sticky top-4">
              <h3 className="font-bold text-lg text-purple-800 mb-4">Disruption Use Cases</h3>
              <div className="space-y-3">
                {industry.disruptionUseCases?.map((opp, i) => (
                  <div key={i} className="bg-white rounded p-3 border border-purple-200">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded font-bold">{i + 1}</span>
                      <div className="font-semibold text-sm">{opp.title}</div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{opp.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {opp.layers.map((l, j) => (
                          <span key={j} className="bg-gray-200 text-xs px-1.5 py-0.5 rounded">{l}</span>
                        ))}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        opp.impact === 'Transformational' ? 'bg-red-100 text-red-700' :
                        opp.impact === 'High' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {opp.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
  // TAB: KEY PLAYERS
  // ============================================

  const KeyPlayersTab = () => {
    const player = keyPlayersData[selectedPlayer];

    return (
      <div className="space-y-6">
        {/* Player Selector */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-gray-600 font-medium">Select Company:</span>
          <div className="flex gap-2">
            {Object.entries(keyPlayersData).map(([key, p]) => (
              <button
                key={key}
                onClick={() => setSelectedPlayer(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPlayer === key
                    ? 'bg-gray-800 text-white'
                    : 'bg-white border hover:bg-gray-50'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
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
                        <th key={v.id} className="border p-1 bg-gray-100" style={{writingMode: 'vertical-rl', height: '80px'}}>
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
                              {status ? '●' : ''}
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
    { id: 'fms', name: 'Foundation Models', icon: '🧠' },
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedResource === r.id
                  ? 'bg-gray-800 text-white'
                  : 'bg-white border-2 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {r.icon} {r.name}
            </button>
          ))}
        </div>

        {/* Sub-Page Content */}
        {selectedResource === 'fms' && <FMsTab />}
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
                {verticals.map(v => <th key={v.id} className="border p-1 bg-gray-100 writing-mode-vertical" style={{writingMode: 'vertical-rl'}}>{v.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {fmCategories.map((fm) => (
                <tr key={fm.id}>
                  <td className={`border p-2 font-medium ${fm.color}`}>{fm.name}</td>
                  {verticals.map(v => (
                    <td key={v.id} className={`border p-1 text-center ${fm.verticals.includes(v.id) ? 'bg-green-200' : 'bg-gray-50'}`}>
                      {fm.verticals.includes(v.id) ? '✓' : ''}
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
  // MAIN RENDER
  // ============================================

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-2">Physical & Industrial AI — Strategic Framework</h1>
      <p className="text-center text-gray-600 mb-4 text-sm">10 Verticals × 8 Layers | Incumbents • Challengers • Dynamics • Battles • Constraints</p>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-gray-800 text-white' 
                : 'bg-white border hover:bg-gray-50'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow p-4">
        {activeTab === 'matrix' && <MatrixTab />}
        {activeTab === 'framework' && <FrameworkTab />}
        {activeTab === 'layers' && <LayersTab />}
        {activeTab === 'industries' && <IndustriesTab />}
        {activeTab === 'players' && <KeyPlayersTab />}
        {activeTab === 'resources' && <OtherResourcesTab />}
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-xs text-gray-500">
        Physical & Industrial AI Strategic Framework v3.0 | 6 Tabs | 80 Cells | 8 Layers | 10 Industries | 7 Key Players
      </div>
    </div>
  );
};


