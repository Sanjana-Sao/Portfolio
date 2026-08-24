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
      icon: '⬡', iconLabel: 'NLP',
      tags: ['INDUSTRIAL', 'NLP'],
      description: 'Industrial Ops Assistant utilizing custom-trained NLP models to interpret complex shop-floor logistics and historical manual documentation via MDF tool calling.',
      links: [{ label: 'VIEW PROJECT →', href: '#' }],
      color: 'teal', featured: false,
      ref: 'PR2_01', deployStatus: 'DEPLOYMENT_STABLE',
      liveTemp: '32.4°C', latency: '42ms',
      subtitle: 'AI INDUSTRIAL ASSISTANT // RAG ARCHITECTURE',
      sidebarSub: 'GEN-AI INDUSTRIAL ASST',
      scope: 'Traditional industrial manual lookups cause critical downtime. DakshVeda utilizes advanced RAG architecture to provide instant, precise technical guidance from massive PDF repositories to engineers on-site.',
      steps: [
        { num: '01', title: 'PDF PARSING & OCR', desc: 'Processing technical schemas and diagrams' },
        { num: '02', title: 'SEMANTIC VECTORING', desc: 'Azure AI search indexing for retrieval' },
        { num: '03', title: 'PROMPT ORCHESTRATION', desc: 'LangChain reasoning with GPT-4' },
      ],
      metric: { value: '85.0%', label: 'QUERY_ACCURACY_INDEX', note: '// validates non-expert manual review and ground truth testing.' },
      stack: ['AZURE OPENAI', 'LANGCHAIN', 'AZURE AI SEARCH', 'PYTHON', 'FASTAPI'],
      contributions: [
        'Engineered Text-to-SQL logic for querying live industrial inventory.',
        'Optimized chunking strategies for dense technical documentation.',
        'Implemented Tool-Calling (MCP) for real-time sensor integration.',
      ],
      version: 'v.4.2-STABLE', buildFactor: '78.5%',
    },
    {
      id: 'facial-dx',
      title: 'FACIAL-DX',
      icon: '◎', iconLabel: 'CV',
      tags: ['COMPUTER VISION', 'MULTI-MODAL'],
      description: 'Healthcare diagnostic tool using FER and audio analysis for PTSD screening. Achieved clinical-grade accuracy in pilot tests.',
      links: [],
      color: 'purple', featured: false,
      ref: 'PR3_01', deployStatus: 'PILOT_ACTIVE',
      liveTemp: '24.1°C', latency: '61ms',
      subtitle: 'NEURAL DIAGNOSTICS // PTSD SCREENING',
      sidebarSub: 'NEURO-DIAG AI',
      scope: 'Clinical PTSD assessment requires multi-modal data analysis. Facial-DX combines real-time FER and audio sentiment analysis to automate preliminary screening, achieving clinical-grade accuracy in pilot environments.',
      steps: [
        { num: '01', title: 'FACIAL ENCODING', desc: 'Real-time FER using DeepFace and custom CNN' },
        { num: '02', title: 'AUDIO ANALYSIS', desc: 'Sentiment extraction from speech patterns' },
        { num: '03', title: 'FUSION SCORING', desc: 'Multi-modal classifier for diagnosis output' },
      ],
      metric: { value: '78.4%', label: 'CLINICAL_ACCURACY_INDEX', note: '// validated against licensed clinical assessments in 3-month pilot.' },
      stack: ['PYTORCH', 'DEEPFACE', 'LIBROSA', 'OPENCV', 'FASTAPI'],
      contributions: [
        'Built real-time facial encoding pipeline achieving 30fps inference.',
        'Developed audio sentiment module with 84% classification accuracy.',
        'Achieved clinical-grade screening accuracy validated by licensed practitioners.',
      ],
      version: 'v.1.3-PILOT', buildFactor: '78.4%',
    },
    {
      id: 'churn-predictor',
      title: 'CHURN PREDICTOR',
      icon: '▲', iconLabel: 'ML',
      tags: ['PYTORCH', 'SKLEARN'],
      description: 'Predictive model for caregiver retention using XGBoost and SHAP for explainability. Reduced churn rates by 71% for enterprise partners.',
      links: [],
      color: 'blue', featured: false,
      ref: 'PR4_01', deployStatus: 'PRODUCTION',
      liveTemp: '21.8°C', latency: '12ms',
      subtitle: 'RETENTION ANALYTICS // PREDICTIVE ML',
      sidebarSub: 'RETENTION ANALYTICS',
      scope: 'Enterprise caregiver churn costs millions annually. This XGBoost-powered system identifies at-risk caregivers 60 days in advance with 82% accuracy, enabling proactive retention strategies across client organizations.',
      steps: [
        { num: '01', title: 'FEATURE ENGINEERING', desc: '47 behavioral and operational signals from CRM data' },
        { num: '02', title: 'MODEL TRAINING', desc: 'XGBoost with SHAP explainability integration layer' },
        { num: '03', title: 'ALERT PIPELINE', desc: 'Real-time at-risk scoring via REST API endpoints' },
      ],
      metric: { value: '82.0%', label: 'RETENTION_ACCURACY', note: '// deployed across 3 enterprise clients, saving $300k+ annually.' },
      stack: ['XGBOOST', 'SHAP', 'PYTORCH', 'SKLEARN', 'FASTAPI'],
      contributions: [
        'Engineered 47-feature pipeline from raw operational CRM data.',
        'Implemented SHAP explainability reducing model rejection by HR teams.',
        'Reduced enterprise churn rates by 71% post-deployment.',
      ],
      version: 'v.3.0-STABLE', buildFactor: '82.0%',
    },
    {
      id: 'ibm-chatbot',
      title: 'IBM CHATBOT PLATFORM',
      icon: '◉', iconLabel: 'NLP',
      tags: ['NLP', 'WATSON'],
      description: 'Full-stack implementation of a multi-turn conversational agent using IBM Watson Assistant and Python backends.',
      links: [],
      color: 'green', featured: false,
      ref: 'PR5_01', deployStatus: 'PRODUCTION',
      liveTemp: '19.3°C', latency: '89ms',
      subtitle: 'CONVERSATIONAL AI // ENTERPRISE NLP',
      sidebarSub: 'IBM NLP SYSTEM',
      scope: 'Enterprise chatbot deployment requires robust multi-turn conversation handling. This IBM Watson-backed platform delivers context-aware responses with full conversation state management and intelligent fallback escalation.',
      steps: [
        { num: '01', title: 'INTENT CLASSIFICATION', desc: 'Watson NLU with custom entity training data' },
        { num: '02', title: 'CONTEXT MANAGEMENT', desc: 'Multi-turn state persistence across conversation sessions' },
        { num: '03', title: 'ESCALATION ROUTING', desc: 'Human handoff with priority scoring algorithm' },
      ],
      metric: { value: '91.2%', label: 'INTENT_ACCURACY', note: '// measured across 10k+ production conversations in live deployment.' },
      stack: ['IBM WATSON', 'PYTHON', 'FASTAPI', 'NLP', 'REDIS'],
      contributions: [
        'Implemented full-stack multi-turn conversation engine with Watson Assistant.',
        'Built priority-based escalation routing reducing support wait times by 40%.',
        'Deployed real-time analytics dashboard for conversation health monitoring.',
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
    this.ws = new WebSocket('ws://localhost:8000/api/chat/ws');
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
