import { Component, OnInit, AfterViewInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'portfolio';
  isScrolled = false;
  mobileMenuOpen = false;
  currentYear = new Date().getFullYear();
  activeProjectId: string | null = null;
  countedMetricValue = '';
  pdTick = 0;
  theme: 'dark' | 'light' = 'light';
  private pdParticleAnimId = 0;

  stats = [
    { value: '3+', label: 'Years of Experience' },
    { value: '5+', label: 'AI/ML Projects Built' },
    { value: '2+', label: 'POCs Developed' },
    { value: '15+', label: 'AI Tools & Frameworks' }
  ];

  navLinks = [
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ];

  experiences = [
    {
      company: 'AVL MOTORS',
      role: 'DATA SCIENTIST',
      period: 'NOV 2025 — PRESENT',
      status: 'CURRENT POSITION',
      statusClass: 'active',
      bullets: [
        'Led a team of 4 engineers in delivering production-grade AI solutions using LLMs, RAG, AI Agents, and MCP-based architectures.',
        'Built DakshVeda, a multi-agent AI platform using LangChain, LangGraph, and MCP for natural language querying of industrial data (OEE, downtime, production), achieving 85%+ query accuracy and supporting real-time interactions via FastAPI WebSockets.',
        'Developed an RFQ Procurement Assistant leveraging LangChain, LangGraph, OpenAI, Tavily Search, and historical RFQ retrieval to recommend chiller manufacturers, compliance documents, and technical specifications.',
        'Designed scalable RAG pipelines using Qdrant, SentenceTransformers, semantic search, and vector embeddings for intelligent document retrieval and recommendation systems.',
        'Engineered Text-to-SQL workflows and scalable backend services using FastAPI, PostgreSQL, Redis, JWT authentication, and Docker for enterprise AI applications.',
        'Worked on a POC to automate Excel-based expense reporting using Python (pandas), rebuilding pivot-table logic across multiple report views, saving 1–2 days of manual effort per report cycle.',
      ],
      tags: ['LANGCHAIN', 'LANGGRAPH', 'MCP', 'OPENAI', 'QDRANT', 'FASTAPI', 'POSTGRESQL', 'REDIS', 'DOCKER', 'TEXT-TO-SQL', 'PANDAS'],
    },
    {
      company: 'NETSMARTZ',
      role: 'AI/ML ENGINEER',
      period: 'FEB 2023 — OCT 2025',
      status: 'COMPLETED',
      statusClass: 'done',
      bullets: [
        'Built churn prediction system using Logistic Regression, XGBoost, and LDA with 90%+ accuracy.',
        'Engineered a facial diagnostic tool for PTSD, TBI, and Depression using YOLO, Faster-RCNN and OpenCV. Integrated Claude (Anthropic) via few-shot prompting for low-data features to improve predictions.',
        'Built enterprise document intelligence and multitenant chatbots using LangChain, RAG, Milvus, semantic search, JWT authentication, and Redis caching.',
        'Worked on a POC for caregiver scheduling optimization using a Genetic Algorithm — designed a constraint-aware assignment engine reducing scheduling conflicts and manual planning effort.',
      ],
      tags: ['LOGISTIC REGRESSION', 'XGBOOST', 'LDA', 'YOLO', 'FASTER-RCNN', 'OPENCV', 'CLAUDE', 'LANGCHAIN', 'RAG', 'MILVUS', 'JWT', 'REDIS'],
    },
  ];

  projects: any[] = [
    {
      id: 'rfq-chiller',
      title: 'RFQ GENERATION SYSTEM',
      icon: '◈', iconLabel: 'AGENT',
      tags: ['MULTI-AGENT', 'RAG', 'LANGGRAPH'],
      description: 'AI-powered RFQ generation system that predicts missing chiller specifications from partial user inputs using a multi-agent LangGraph pipeline, hybrid retrieval (PostgreSQL + Qdrant + Tavily), and climate intelligence — achieving ~85% field prediction accuracy at $0.026/RFQ.',
      links: [{ label: 'VIEW PROJECT →', href: '#' }],
      color: 'cyan', featured: true,
      ref: 'PR1_01', deployStatus: 'DEPLOYMENT_STABLE',
      liveTemp: '70k-80k/RFQ', latency: '4–5 min',
      liveStats: [
        { label: 'Token Usage', val: '60k-70k/RFQ' },
        { label: 'LATENCY', val: '3-4 min' },
        { label: 'Search Engine', val: 'Tavily' },
      ],
      subtitle: 'MULTI-AGENT RFQ GENERATION // CHILLER SPECIFICATIONS',
      sidebarSub: 'RFQ AUTOMATION',
      scope: 'Manual RFQ preparation for industrial chiller procurement is time-consuming and error-prone. This system takes partial user inputs and autonomously predicts missing chiller specifications using a hybrid retrieval pipeline — combining historical RFQ data, semantic search, and real-time web intelligence — generating complete, context-aware RFQs with ~85% field prediction accuracy and an average inference cost of just $0.026 per RFQ.',
      steps: [
        { num: '01', title: 'HYBRID RETRIEVAL', desc: 'Historical RFQs from PostgreSQL + semantic search via Qdrant + live web grounding via Tavily Search' },
        { num: '02', title: 'CLIMATE INTELLIGENCE', desc: 'ASHRAE Meteo API + Nominatim geocoding resolves project city to WMO station weather data for auto-populated site conditions' },
        { num: '03', title: 'MULTI-AGENT WORKFLOW', desc: 'LangGraph agents with tool calling validate, retrieve, and generate complete RFQ specifications end-to-end' },
      ],
      metric: { value: '85.0%', label: 'FIELD_PREDICTION_ACCURACY', note: '// benchmarked across real RFQ datasets; avg cost $0.026/RFQ using GPT-4o Mini.' },
      stack: ['LANGGRAPH', 'GPT-4O MINI', 'POSTGRESQL', 'QDRANT', 'TAVILY SEARCH', 'FASTAPI', 'ASHRAE API'],
      contributions: [
        'Built AI-powered RFQ generation system predicting missing chiller specs from partial inputs, reducing manual preparation time significantly.',
        'Designed and benchmarked retrieval approaches (Text-to-SQL → RAG → live web search); selected Tavily over Firecrawl and Exa AI for superior technical data accuracy.',
        'Built hybrid retrieval pipeline combining PostgreSQL historical analysis, Qdrant semantic search, and Tavily real-time web grounding.',
        'Integrated climate intelligence module using ASHRAE Meteo API v3.0 + Nominatim geocoding to auto-populate DBT, WBT, dew point, altitude, and monsoon zone across 6 global climate regions.',
        'Engineered multi-agent LangGraph workflow with tool calling achieving ~85% field prediction accuracy at <$0.026/RFQ with GPT-4o Mini.',
      ],
      version: 'v.2.1-STABLE', buildFactor: '85.0%',
    },
    {
      id: 'dakshveda',
      title: 'DAKSHVEDA',
      icon: '⬡', iconLabel: 'AI',
      tags: ['MULTI-AGENT', 'INDUSTRIAL', 'RAG'],
      description: 'AI-powered industrial operations assistant for a wire manufacturing client, enabling natural language querying of machine-level metrics (OEE, downtime, production) across plants, units, and divisions via a multi-agent LangChain system with MCP tool calling.',
      links: [{ label: 'VIEW PROJECT →', href: '#' }],
      color: 'teal', featured: false,
      ref: 'PR2_01', deployStatus: 'DEPLOYMENT_STABLE',
      liveTemp: '32.4°C', latency: '42ms',
      liveStats: [
        { label: 'Token Usage', val: '~22k/query' },
        { label: 'LATENCY', val: '42ms' },
        { label: 'Interface', val: 'WebSocket' },
      ],
      subtitle: 'MULTI-AGENT INDUSTRIAL AI // OEE · DOWNTIME · PRODUCTION',
      sidebarSub: 'GEN-AI INDUSTRIAL ASST',
      scope: 'Developed an AI-powered industrial operations assistant for a wire manufacturing client of AVL Motors. The system enables users to query machine-level production metrics — OEE, downtime, production — across specific plants, units, divisions, and machines using natural language. Built on a multi-agent LangChain architecture with hierarchical intent classification, RAG pipelines, MCP-based tool calling, and real-time FastAPI WebSocket services, achieving 85%+ accuracy on complex multi-step queries.',
      steps: [
        { num: '01', title: 'MULTI-AGENT WORKFLOW', desc: 'Hierarchical agent design with intent classification, query decomposition, contextual memory, and MCP-based tool calling for real-time operational insights' },
        { num: '02', title: 'RAG PIPELINE', desc: 'Qdrant + SentenceTransformers for semantic retrieval across operational documents and enterprise knowledge sources' },
        { num: '03', title: 'MULTILINGUAL & PERSONA-AWARE', desc: 'Responses adapt based on user roles and language preferences while maintaining contextual accuracy' },
        { num: '04', title: 'REAL-TIME SERVICES', desc: 'FastAPI WebSocket APIs with JWT auth, RBAC, Redis caching, and provider-agnostic OpenAI/Claude integrations' },
      ],
      metric: { value: '85.0%', label: 'QUERY_ACCURACY_INDEX', note: '// validated on complex multi-step industrial queries across OEE, downtime, and production metrics.' },
      stack: ['LANGCHAIN', 'MCP', 'QDRANT', 'SENTENCETRANSFORMERS', 'FASTAPI', 'WEBSOCKETS', 'JWT', 'REDIS', 'OPENAI', 'CLAUDE'],
      contributions: [
        'Built a multi-agent conversational AI system using LangChain for natural language querying of industrial metrics like OEE, downtime, and production.',
        'Designed hierarchical agent workflows with intent classification, query decomposition, contextual memory, and MCP-based tool calling; exposed enterprise APIs as MCP servers for real-time operational insights.',
        'Built multilingual and persona-aware conversational experiences, adapting responses based on user roles and language preferences.',
        'Implemented RAG pipelines using Qdrant and SentenceTransformers for semantic retrieval across operational documents and enterprise knowledge sources.',
        'Developed real-time FastAPI WebSocket services with JWT authentication, RBAC, Redis caching, and provider-agnostic OpenAI/Claude integrations, achieving 85%+ accuracy on complex multi-step queries.',
      ],
      version: 'v.4.2-STABLE', buildFactor: '85.0%',
    },
    {
      id: 'facial-dx',
      title: 'FACIAL-DX',
      icon: '◎', iconLabel: 'CV',
      tags: ['COMPUTER VISION', 'CLINICAL AI'],
      description: 'Facial diagnostic system for detecting PTSD, TBI, and depression by analyzing facial features through model-specific pipelines. Achieved 80%+ accuracy with doctor-defined rule engines and structured Pydantic outputs stored in PostgreSQL.',
      links: [],
      color: 'purple', featured: false,
      ref: 'PR3_01', deployStatus: 'PILOT_ACTIVE',
      liveTemp: '24.1°C', latency: '61ms',
      liveStats: [
        { label: 'Facial Traits', val: '11+' },
        { label: 'LATENCY', val: '61ms' },
        { label: 'Detection', val: '3 Conditions' },
      ],
      subtitle: 'AI-POWERED FACIAL SCREENING // PTSD · TBI · DEPRESSION',
     
      scope: 'Designed a facial diagnostic system to detect PTSD, TBI, and depression by analyzing facial features with model-specific pipelines. Facial feature extraction leverages YOLO, OpenCV, MediaPipe, Dlib, and Faster-RCNN for traits such as dark circles, forehead lines, pupil size, mouth tilt, and nose shape. Claude (Anthropic) is integrated with few/zero-shot prompting for low-data features. Outputs are structured with Pydantic, stored in PostgreSQL, and processed through doctor-defined rules to generate reliable mental health outcomes.',
      steps: [
        { num: '01', title: 'FEATURE EXTRACTION', desc: 'YOLO, OpenCV, MediaPipe, Dlib & Faster-RCNN detect traits: dark circles, forehead lines, pupil size, mouth tilt, nose shape' },
        { num: '02', title: 'LLM AUGMENTATION', desc: 'Claude (Anthropic) with few/zero-shot prompting handles low-data facial features' },
        { num: '03', title: 'MODEL EVALUATION', desc: 'mAP, Precision, Recall & F1-score metrics — high Recall prioritized to minimize false negatives for clinical screening' },
        { num: '04', title: 'RULE-BASED INFERENCE', desc: 'Doctor-defined rules applied to Pydantic-structured predictions stored in PostgreSQL to generate mental health outcomes' },
      ],
      metric: { value: '80%+', label: 'DIAGNOSTIC_ACCURACY', note: '// doctor-defined rule engine validated against clinical screening benchmarks.' },
      stack: ['YOLO', 'FASTER-RCNN', 'OPENCV', 'MEDIAPIPE', 'DLIB', 'CLAUDE (ANTHROPIC)', 'PYDANTIC', 'POSTGRESQL', 'FASTAPI'],
      contributions: [
        'Implemented facial feature extraction using YOLO, OpenCV, MediaPipe, Dlib, and Faster-RCNN for traits like dark circles, forehead lines, pupil size, mouth tilt, and nose shape.',
        'Integrated Claude (Anthropic) with few/zero-shot prompting to handle low-data facial features, improving prediction coverage.',
        'Evaluated models using mAP, Precision, Recall, and F1-score — prioritizing high Recall to minimize false negatives for reliable clinical screening.',
        'Structured outputs using Pydantic, stored predictions in PostgreSQL, and applied doctor-defined rules to generate mental health outcomes with over 80% accuracy.',
      ],
      version: 'v.1.3-PILOT', buildFactor: '80%',
    },
    {
      id: 'churn-predictor',
      title: 'CHURN PREDICTOR',
      icon: '▲', iconLabel: 'ML',
      tags: ['XGBOOST', 'SKLEARN', 'OPTUNA'],
      description: 'Caregiver churn prediction pipeline using Logistic Regression, XGBoost, and LDA. Achieved 90%+ accuracy through rigorous feature engineering, EDA, and hyperparameter tuning with Optuna and GridSearchCV.',
      links: [],
      color: 'blue', featured: false,
      ref: 'PR4_01', deployStatus: 'PRODUCTION',
      liveTemp: '21.8°C', latency: '12ms',
      liveStats: [
        { label: 'Dataset', val: '50K+ Records' },
        { label: 'Pipeline', val: 'Classification' },
        { label: 'Latency', val: '12ms' },
      ],
      subtitle: 'CAREGIVER RETENTION // PREDICTIVE ML PIPELINE',
      sidebarSub: 'RETENTION ANALYTICS',
      scope: 'Caregiver churn is a critical operational challenge in healthcare staffing. This classification pipeline predicts at-risk caregivers by applying thorough data cleaning, EDA, and feature selection on CRM data, then training Logistic Regression, XGBoost, and LDA models. Hyperparameter tuning via Optuna and GridSearchCV, combined with comprehensive evaluation metrics, delivered 90%+ accuracy for proactive retention decision-making.',
      steps: [
        { num: '01', title: 'DATA PREP & EDA', desc: 'Data cleaning, exploratory data analysis, feature selection, and correlation analysis on caregiver CRM data' },
        { num: '02', title: 'MODEL TRAINING', desc: 'Classification pipeline using Logistic Regression, XGBoost, and LDA with feature engineering for optimal signal extraction' },
        { num: '03', title: 'HYPERPARAMETER TUNING', desc: 'Optuna and GridSearchCV used to optimize model parameters and maximize predictive performance' },
        { num: '04', title: 'EVALUATION', desc: 'Models evaluated using ROC-AUC, Precision, Recall, F1-score, and confusion matrix — prioritizing reliable at-risk detection' },
      ],
      metric: { value: '90%+', label: 'CLASSIFICATION_ACCURACY', note: '// achieved via Logistic Regression, XGBoost & LDA with Optuna-tuned hyperparameters.' },
      stack: ['LOGISTIC REGRESSION', 'XGBOOST', 'LDA', 'OPTUNA', 'GRIDSEARCHCV', 'SKLEARN', 'PANDAS', 'PYTHON'],
      contributions: [
        'Built a classification pipeline using Logistic Regression, XGBoost, and LDA, achieving over 90% accuracy through feature engineering and hyperparameter tuning.',
        'Conducted data cleaning, EDA, and feature selection to extract meaningful behavioral and operational signals from caregiver CRM data.',
        'Optimized model performance using Optuna and GridSearchCV for automated hyperparameter search.',
        'Evaluated models using ROC-AUC, Precision, Recall, F1-score, and confusion matrix to ensure reliable churn detection.',
      ],
      version: 'v.3.0-STABLE', buildFactor: '90%',
    },
    {
      id: 'ibm-chatbot',
      title: 'ENTERPRISE CHATBOT PLATFORM',
      icon: '◉', iconLabel: 'AI',
      tags: ['MULTITENANT', 'RAG', 'LLM'],
      description: 'Multitenant enterprise chatbot platform enabling organizations to deploy customized knowledge-base assistants. Supports PDF, DOCX, and TXT ingestion with Milvus semantic search, JWT auth, Redis caching, and role-based tenant isolation.',
      links: [],
      color: 'green', featured: false,
      ref: 'PR5_01', deployStatus: 'PRODUCTION',
      liveTemp: '19.3°C', latency: '89ms',
      liveStats: [
        { label: 'Architecture', val: 'Multitenant' },
        { label: 'LATENCY', val: '89ms' },
        { label: 'Doc Formats', val: 'PDF · DOCX · TXT' },
      ],
      subtitle: 'MULTITENANT ENTERPRISE AI // DOCUMENT Q&A PLATFORM',
      sidebarSub: 'ENTERPRISE CHATBOT',
      scope: 'Developed a multitenant enterprise chatbot platform that organizations can purchase and customize with their own knowledge base. Super Admins and Admins manage documents and user access, while end users securely query organization-specific information through a conversational interface. Built on IBM Foundation Models with Milvus vector search, JWT-secured multitenancy, and Redis caching for high-performance, tenant-isolated document Q&A.',
      steps: [
        { num: '01', title: 'DOCUMENT INGESTION', desc: 'Unstructured PDFs, DOCX, and TXT files parsed and chunked for knowledge base construction per tenant' },
        { num: '02', title: 'VECTOR EMBEDDINGS', desc: 'Documents embedded into Milvus for semantic search and vector-based retrieval with contextual relevance' },
        { num: '03', title: 'LLM Q&A', desc: 'IBM Foundation Models extract precise answers from retrieved document chunks via RAG pipeline' },
        { num: '04', title: 'MULTITENANT SECURITY', desc: 'JWT authentication, Redis caching, email verification, RBAC, and tenant-specific knowledge isolation' },
      ],
      metric: { value: '91.2%', label: 'RETRIEVAL_ACCURACY', note: '// validated across multiple tenant knowledge bases with diverse document types.' },
      stack: ['IBM FOUNDATION MODELS', 'MILVUS', 'LANGCHAIN', 'JWT', 'REDIS', 'FASTAPI', 'PYTHON'],
      contributions: [
        'Built a document-based Q&A chatbot using IBM Foundation Models to extract answers from unstructured PDFs, DOCX, and TXT files.',
        'Embedded documents into Milvus for semantic search and vector-based retrieval with contextual relevance.',
        'Developed a multitenant backend using JWT authentication, Redis caching, email verification, secure role-based access, and tenant-specific knowledge isolation.',
      ],
      version: 'v.2.4-STABLE', buildFactor: '91.2%',
    },
  ];

  techSpectrum = [
    {
      category: 'LANGUAGES & LIBRARIES',
      icon: '⌨',
      preview: ['Python', 'Java', 'C#', 'NumPy', 'Pandas'],
      items: ['Python', 'Java', 'C#', 'NumPy', 'Pandas', 'OpenCV', 'EDA', 'scikit-learn', 'matplotlib', 'Git'],
    },
    {
      category: 'AI/ML & COMPUTER VISION',
      icon: '⬡',
      preview: ['PyTorch', 'TensorFlow', 'CNNs / RNNs', 'YOLO', 'Transformers'],
      items: ['CNNs', 'RNNs', 'LSTMs', 'Transformers', 'PyTorch', 'TensorFlow', 'Keras', 'YOLO', 'Faster R-CNN', 'MediaPipe', 'Dlib', 'Model Evaluation', 'Transfer Learning'],
    },
    {
      category: 'GENERATIVE AI & LLMS',
      icon: '◈',
      preview: ['LangChain', 'LangGraph', 'RAG', 'AI Agents', 'OpenAI'],
      items: ['OpenAI', 'Claude', 'Hugging Face', 'LangChain', 'LangGraph', 'RAG', 'AI Agents', 'MCP (Model Context Protocol)', 'Tool Calling', 'Prompt Engineering'],
    },
    {
      category: 'SEARCH & RETRIEVAL',
      icon: '◎',
      preview: ['Pinecone', 'FAISS', 'Milvus', 'Semantic Search', 'Embeddings'],
      items: ['Embeddings', 'Semantic Search', 'Pinecone', 'FAISS', 'Milvus', 'Qdrant', 'Hybrid Search', 'Reranking', 'FTS'],
    },
    {
      category: 'BACKEND & DEPLOYMENT',
      icon: '▲',
      preview: ['FastAPI', 'Docker', 'PostgreSQL', 'Redis', 'REST APIs'],
      items: ['FastAPI', 'Docker', 'PostgreSQL', 'SQLAlchemy', 'Redis', 'JWT', 'REST APIs', 'Azure'],
    },
    {
      category: 'CLOUD & MLOPS',
      icon: '☁',
      preview: ['Azure ML', 'Azure AI Services', 'Azure Data Factory', 'MLOps'],
      items: ['Azure Machine Learning', 'Azure Cognitive Services', 'Azure Data Factory', 'Azure AI Services', 'MLOps Pipelines', 'Azure DevOps', 'Docker & K8s'],
    },
  ];

  techOverlayOpen = false;

  activeTechCategory: string | null = null;

  openTechOverlay(category?: string): void {
    this.techOverlayOpen = true;
    this.activeTechCategory = category || null;
    document.body.style.overflow = 'hidden';
    if (category) {
      setTimeout(() => {
        const cards = document.querySelectorAll('.tech-overlay-card');
        cards.forEach(card => {
          const cat = card.querySelector('.tech-overlay-cat')?.textContent?.trim();
          if (cat === category) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      }, 80);
    }
  }
  closeTechOverlay(): void { this.techOverlayOpen = false; this.activeTechCategory = null; document.body.style.overflow = ''; }
  getTotalSkills(): number { return this.techSpectrum.reduce((s, t) => s + t.items.length, 0); }

  certifications = [
    { icon: '⬡', title: 'Microsoft Azure Data Scientist Associate', description: 'Validation of expert-level knowledge in Azure ML pipelines and predictive modeling.', badge: 'DP-100' },
    { icon: '★', title: 'Team Extra Miler Award', description: 'Awarded for exceptional leadership and architectural contributions during the RFQ Chiller launch.', badge: 'NETSMARTZ' },
  ];

  get activeProject(): any {
    return this.projects.find(p => p.id === this.activeProjectId) || null;
  }

  openProject(id: string): void {
    cancelAnimationFrame(this.pdParticleAnimId);
    this.countedMetricValue = '';
    this.pdTick = 0;                         // destroy inner content → animations reset
    this.activeProjectId = id;
    window.scrollTo(0, 0);
    // next tick: re-create inner content so CSS animations fire fresh
    setTimeout(() => {
      this.pdTick = 1;
      setTimeout(() => {
        this.initPdParticles();
        this.initMetricCountUp();
      }, 50);
    }, 20);
  }

  toggleTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
  }

  closeProject(): void {
    cancelAnimationFrame(this.pdParticleAnimId);
    this.pdTick = 0;
    this.activeProjectId = null;
  }

  ngOnInit(): void {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (saved) { this.theme = saved; }
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  ngAfterViewInit(): void {
    this.initParticles();
    this.initScrollAnimations();
    this.initNeuralCanvas();
    this.initTypewriter();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 60;
  }

  emailCopied = false;

  copyEmail(): void {
    navigator.clipboard.writeText('sanjana.sao01@gmail.com').then(() => {
      this.emailCopied = true;
      setTimeout(() => this.emailCopied = false, 2000);
    });
  }

  downloadResume(): void {
    const link = document.createElement('a');
    link.href = '/Sanjana_Sao_Resume.pdf';
    link.download = 'Sanjana_Sao_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  scrollTo(href: string, event: Event): void {
    event.preventDefault();
    this.mobileMenuOpen = false;
    if (this.activeProjectId) { this.closeProject(); return; }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  initParticles(): void {
    const canvas = document.getElementById('particles') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: any[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 1.5 + 0.5, a: Math.random() });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${p.a * 0.4})`; ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
  }

  initScrollAnimations(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('revealed');
      observer.observe(el);
    });
  }

  initNeuralCanvas(): void {
    const canvas = document.getElementById('neural-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.offsetWidth; const H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;
    const nodes: any[] = [];
    for (let i = 0; i < 18; i++) {
      nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 });
    }
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach(n => { n.x += n.vx; n.y += n.vy; if (n.x < 0 || n.x > W) n.vx *= -1; if (n.y < 0 || n.y > H) n.vy *= -1; });
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x; const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) { ctx.beginPath(); ctx.strokeStyle = `rgba(0,229,255,${0.5 * (1 - dist / 100)})`; ctx.lineWidth = 0.8; ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke(); }
      }
      nodes.forEach(n => { ctx.beginPath(); ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,229,255,0.8)'; ctx.fill(); });
      requestAnimationFrame(draw);
    };
    draw();
  }

  initTypewriter(): void {
    const el = document.querySelector('.hero-sub') as HTMLElement;
    if (!el) return;
    const text = el.textContent || '';
    el.textContent = ''; el.style.opacity = '1';
    let i = 0;
    const type = () => { if (i < text.length) { el.textContent += text[i++]; setTimeout(type, 18); } };
    setTimeout(type, 800);
  }

  initPdParticles(): void {
    cancelAnimationFrame(this.pdParticleAnimId);
    const canvas = document.getElementById('pd-particles') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const pts: any[] = [];
    for (let i = 0; i < 40; i++) {
      pts.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.5 + 0.1 });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${p.a})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x; const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 90) { ctx.beginPath(); ctx.strokeStyle = `rgba(0,229,255,${0.12*(1-d/90)})`; ctx.lineWidth = 0.5; ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
      }
      this.pdParticleAnimId = requestAnimationFrame(draw);
    };
    draw();
  }

  // ── Chatbot ────────────────────────────────────────────────────────
  chatOpen = false;
  chatInput = '';
  chatMessages: { role: 'user' | 'bot'; text: string; streaming?: boolean }[] = [];
  private ws: WebSocket | null = null;
  private currentBotText = '';
  chatHasUnread = false;

  toggleChat(): void {
    this.chatOpen = !this.chatOpen;
    if (this.chatOpen) {
      this.chatHasUnread = false;
      if (!this.ws || this.ws.readyState > 1) this.connectWs();
      setTimeout(() => this.scrollChatToBottom(), 60);
    }
  }

  private connectWs(): void {
    this.ws = new WebSocket('wss://portfolio-xi-wheat-yj4qx19bbp.vercel.app/api/chat/ws');
    this.ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'token') {
        this.currentBotText += msg.token;
        const last = this.chatMessages[this.chatMessages.length - 1];
        if (last?.role === 'bot' && last.streaming) {
          last.text = this.currentBotText;
        } else {
          this.chatMessages.push({ role: 'bot', text: this.currentBotText, streaming: true });
        }
        this.scrollChatToBottom();
        if (!this.chatOpen) this.chatHasUnread = true;
      } else if (msg.type === 'done') {
        const last = this.chatMessages[this.chatMessages.length - 1];
        if (last?.streaming) last.streaming = false;
        this.currentBotText = '';
      } else if (msg.type === 'error') {
        this.chatMessages.push({ role: 'bot', text: `⚠ ${msg.detail}` });
        this.currentBotText = '';
      }
    };
    this.ws.onerror = () => {
      this.chatMessages.push({ role: 'bot', text: '⚠ Could not connect to backend.' });
    };
  }

  sendChat(): void {
    const q = this.chatInput.trim();
    if (!q) return;
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.connectWs();
      // retry after connection
      const wait = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          clearInterval(wait);
          this._sendMessage(q);
        }
      }, 100);
      return;
    }
    this._sendMessage(q);
  }

  private _sendMessage(q: string): void {
    this.chatMessages.push({ role: 'user', text: q });
    this.chatInput = '';
    this.currentBotText = '';
    this.ws!.send(JSON.stringify({ type: 'ask', question: q, session_id: null }));
    this.scrollChatToBottom();
  }

  onChatKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendChat(); }
  }

  private scrollChatToBottom(): void {
    setTimeout(() => {
      const el = document.querySelector('.chat-messages') as HTMLElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 20);
  }

  ngOnDestroy(): void {
    this.ws?.close();
  }

  initMetricCountUp(): void {
    const project = this.activeProject;
    if (!project) return;
    const raw = project.metric.value as string;       // e.g. "92.0%"
    const num = parseFloat(raw);
    const suffix = raw.replace(/[0-9.]/g, '');        // e.g. "%"
    const decimals = (raw.split('.')[1] || '').replace(/[^0-9]/g, '').length;
    const duration = 1400;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);          // ease-out cubic
      this.countedMetricValue = (num * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}
