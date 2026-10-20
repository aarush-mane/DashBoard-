/**
 * PulseFlow - Central Reactive Data Store
 * Provides State Management, Persistence (localStorage), and Events
 */

const STORAGE_KEY = 'pulseflow_team_dashboard_state_v1';

const INITIAL_MEMBERS = [
  {
    id: 'user-1',
    name: 'Aarush Mane',
    role: 'Founder / Project Lead',
    email: 'aarush@pulseflow.io',
    initials: 'AM',
    avatarBg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    status: 'online',
    assignedTasks: 8,
    completedTasks: 14,
    workload: 65,
    skills: ['Architecture', 'React', 'Product', 'System Design']
  },
  {
    id: 'user-2',
    name: 'Riya Sharma',
    role: 'Frontend Developer',
    email: 'riya@pulseflow.io',
    initials: 'RS',
    avatarBg: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
    status: 'online',
    assignedTasks: 6,
    completedTasks: 11,
    workload: 72,
    skills: ['Vue.js', 'CSS Neumorphism', 'TypeScript', 'Tailwind']
  },
  {
    id: 'user-3',
    name: 'Rahul Patel',
    role: 'Backend Developer',
    email: 'rahul@pulseflow.io',
    initials: 'RP',
    avatarBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    status: 'away',
    assignedTasks: 5,
    completedTasks: 9,
    workload: 58,
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'GraphQL']
  },
  {
    id: 'user-4',
    name: 'Priya Nair',
    role: 'AI/ML Developer',
    email: 'priya@pulseflow.io',
    initials: 'PN',
    avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    status: 'online',
    assignedTasks: 7,
    completedTasks: 8,
    workload: 85,
    skills: ['PyTorch', 'LLMs', 'Vector DBs', 'Python']
  },
  {
    id: 'user-5',
    name: 'Vikram Joshi',
    role: 'UI/UX Designer',
    email: 'vikram@pulseflow.io',
    initials: 'VJ',
    avatarBg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    status: 'offline',
    assignedTasks: 4,
    completedTasks: 12,
    workload: 45,
    skills: ['Figma', 'Design Systems', 'Micro-interactions', 'Prototyping']
  },
  {
    id: 'user-6',
    name: 'Ananya Desai',
    role: 'Marketing Lead',
    email: 'ananya@pulseflow.io',
    initials: 'AD',
    avatarBg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    status: 'online',
    assignedTasks: 3,
    completedTasks: 7,
    workload: 50,
    skills: ['Growth', 'User Acquisition', 'Copywriting', 'SEO']
  },
  {
    id: 'user-7',
    name: 'David Chen',
    role: 'Full Stack Developer',
    email: 'david@pulseflow.io',
    initials: 'DC',
    avatarBg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    status: 'online',
    assignedTasks: 5,
    completedTasks: 6,
    workload: 60,
    skills: ['Next.js', 'FastAPI', 'Redis', 'AWS']
  }
];

const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'QuickLink Campus',
    description: 'Smart high-speed campus networking portal and academic resource directory for students.',
    status: 'In Progress',
    progress: 68,
    priority: 'High',
    dueDate: '2026-11-15',
    lastUpdated: '15 mins ago',
    ownerId: 'user-1',
    members: ['user-1', 'user-2', 'user-3', 'user-5'],
    category: 'EdTech Web App',
    milestones: [
      { id: 'm-1', title: 'Student Authentication & OAuth', status: 'completed', date: 'Oct 10, 2026' },
      { id: 'm-2', title: 'Directory Search & Indexing Engine', status: 'completed', date: 'Oct 18, 2026' },
      { id: 'm-3', title: 'Interactive Campus Map Integration', status: 'current', date: 'Nov 02, 2026' },
      { id: 'm-4', title: 'Beta Testing with 500 Students', status: 'upcoming', date: 'Nov 15, 2026' }
    ]
  },
  {
    id: 'proj-2',
    name: 'AI Study Assistant',
    description: 'Intelligent flashcard generation, concept summaries, and multi-modal quiz engine.',
    status: 'Near Launch',
    progress: 84,
    priority: 'Urgent',
    dueDate: '2026-10-30',
    lastUpdated: '1 hour ago',
    ownerId: 'user-4',
    members: ['user-1', 'user-4', 'user-7', 'user-3'],
    category: 'Artificial Intelligence',
    milestones: [
      { id: 'm-21', title: 'RAG Pipeline & Embeddings Storage', status: 'completed', date: 'Sep 25, 2026' },
      { id: 'm-22', title: 'Flashcard Generation Algorithm', status: 'completed', date: 'Oct 05, 2026' },
      { id: 'm-23', title: 'Voice Note Transcription', status: 'current', date: 'Oct 25, 2026' },
      { id: 'm-24', title: 'Public App Store Submission', status: 'upcoming', date: 'Oct 30, 2026' }
    ]
  },
  {
    id: 'proj-3',
    name: 'E-Commerce Platform',
    description: 'Modern headless shopping architecture with instant checkout and real-time inventory.',
    status: 'In Progress',
    progress: 45,
    priority: 'Medium',
    dueDate: '2026-12-05',
    lastUpdated: '3 hours ago',
    ownerId: 'user-3',
    members: ['user-2', 'user-3', 'user-7', 'user-6'],
    category: 'Full Stack Web',
    milestones: [
      { id: 'm-31', title: 'Product Catalog Database Schema', status: 'completed', date: 'Oct 01, 2026' },
      { id: 'm-32', title: 'Stripe & Apple Pay Integration', status: 'current', date: 'Nov 10, 2026' },
      { id: 'm-33', title: 'Vendor Analytics Portal', status: 'upcoming', date: 'Nov 25, 2026' },
      { id: 'm-34', title: 'Production Load Testing', status: 'upcoming', date: 'Dec 05, 2026' }
    ]
  },
  {
    id: 'proj-4',
    name: 'Campus Event App',
    description: 'Interactive student club schedules, QR code ticketing, and live crowd heatmap.',
    status: 'Planning',
    progress: 28,
    priority: 'Medium',
    dueDate: '2026-12-20',
    lastUpdated: 'Yesterday',
    ownerId: 'user-5',
    members: ['user-5', 'user-6', 'user-2'],
    category: 'Mobile / Hybrid',
    milestones: [
      { id: 'm-41', title: 'User Research & Persona Interviews', status: 'completed', date: 'Oct 12, 2026' },
      { id: 'm-42', title: 'Wireframing & Prototype Review', status: 'current', date: 'Nov 05, 2026' },
      { id: 'm-43', title: 'Ticket Scanner Mobile App', status: 'upcoming', date: 'Dec 01, 2026' },
      { id: 'm-44', title: 'Campus Fest Launch Event', status: 'upcoming', date: 'Dec 20, 2026' }
    ]
  }
];

const INITIAL_TASKS = [
  // To Do
  {
    id: 'task-1',
    title: 'UI Design',
    description: 'Design comprehensive high-fidelity Figma components including dark neumorphic widgets and modal transitions.',
    projectId: 'proj-1',
    status: 'todo',
    priority: 'Medium',
    assigneeId: 'user-5',
    dueDate: '2026-10-28',
    tags: ['Figma', 'UI/UX', 'Design System'],
    comments: [
      { id: 'c-1', userId: 'user-1', text: 'Ensure the Neumorphic shadows have crisp contrast in both modes.', time: '2 hours ago' },
      { id: 'c-2', userId: 'user-5', text: 'Working on the dual-direction lighting tokens now!', time: '1 hour ago' }
    ],
    attachmentsCount: 3
  },
  {
    id: 'task-2',
    title: 'Database Setup',
    description: 'Configure PostgreSQL tables, indexes, and connection pooling for the product catalog and student sessions.',
    projectId: 'proj-3',
    status: 'todo',
    priority: 'High',
    assigneeId: 'user-3',
    dueDate: '2026-10-31',
    tags: ['PostgreSQL', 'Schema', 'Infra'],
    comments: [
      { id: 'c-3', userId: 'user-3', text: 'Schema drafted with foreign key constraints and audit triggers.', time: 'Yesterday' }
    ],
    attachmentsCount: 1
  },
  {
    id: 'task-3',
    title: 'Research',
    description: 'Evaluate open-weight embedding models (BGE-M3 vs GTE-Large) for semantic study notes indexing.',
    projectId: 'proj-2',
    status: 'todo',
    priority: 'Low',
    assigneeId: 'user-4',
    dueDate: '2026-11-04',
    tags: ['AI/ML', 'Embeddings', 'Benchmarking'],
    comments: [],
    attachmentsCount: 2
  },

  // In Progress
  {
    id: 'task-4',
    title: 'Landing Page',
    description: 'Implement high-converting hero section with interactive preview, student testimonials, and responsive cards.',
    projectId: 'proj-1',
    status: 'inprogress',
    priority: 'High',
    assigneeId: 'user-2',
    dueDate: '2026-10-24',
    tags: ['Frontend', 'Vanilla CSS', 'Animation'],
    comments: [
      { id: 'c-4', userId: 'user-1', text: 'Keep the CTA buttons tactile and pressed on click.', time: 'Yesterday' },
      { id: 'c-5', userId: 'user-2', text: 'Hero animations and mobile layout ready for initial review.', time: '3 hours ago' }
    ],
    attachmentsCount: 2
  },
  {
    id: 'task-5',
    title: 'Authentication System',
    description: 'Implement secure JWT refresh token rotation, Google SSO, and role-based access control.',
    projectId: 'proj-3',
    status: 'inprogress',
    priority: 'Urgent',
    assigneeId: 'user-3',
    dueDate: '2026-10-25',
    tags: ['Security', 'OAuth', 'FastAPI'],
    comments: [
      { id: 'c-6', userId: 'user-7', text: 'Added OAuth callback endpoints. Ready for token verification.', time: '4 hours ago' }
    ],
    attachmentsCount: 1
  },

  // Review
  {
    id: 'task-6',
    title: 'Dashboard UI',
    description: 'Refactor stat cards, Kanban drag-and-drop feedback, and interactive SVG chart widgets.',
    projectId: 'proj-1',
    status: 'review',
    priority: 'Medium',
    assigneeId: 'user-5',
    dueDate: '2026-10-22',
    tags: ['Neumorphism', 'Components', 'SaaS'],
    comments: [
      { id: 'c-7', userId: 'user-1', text: 'Looking super clean and fast! Reviewing interactions now.', time: '50 mins ago' }
    ],
    attachmentsCount: 4
  },
  {
    id: 'task-7',
    title: 'API Integration',
    description: 'Connect REST endpoints for quiz generation and integrate real-time streaming response sockets.',
    projectId: 'proj-2',
    status: 'review',
    priority: 'High',
    assigneeId: 'user-7',
    dueDate: '2026-10-23',
    tags: ['REST', 'FastAPI', 'WebSockets'],
    comments: [
      { id: 'c-8', userId: 'user-4', text: 'Tested streaming response times — latency under 80ms.', time: '20 mins ago' }
    ],
    attachmentsCount: 2
  },

  // Completed
  {
    id: 'task-8',
    title: 'Project Setup',
    description: 'Initialize repository structure, automated linting, CI/CD pipelines, and local dev environments.',
    projectId: 'proj-1',
    status: 'completed',
    priority: 'Low',
    assigneeId: 'user-1',
    dueDate: '2026-10-14',
    tags: ['DevOps', 'Git', 'Setup'],
    comments: [
      { id: 'c-9', userId: 'user-1', text: 'Monorepo initialized and team permissions granted.', time: 'Oct 14' }
    ],
    attachmentsCount: 1
  },
  {
    id: 'task-9',
    title: 'User Research',
    description: 'Interviewed 40 student club presidents and startup builders to map workflow bottlenecks.',
    projectId: 'proj-4',
    status: 'completed',
    priority: 'Medium',
    assigneeId: 'user-6',
    dueDate: '2026-10-16',
    tags: ['Interviews', 'Data', 'Discovery'],
    comments: [
      { id: 'c-10', userId: 'user-6', text: 'Full synthesis report uploaded to documents section.', time: 'Oct 16' }
    ],
    attachmentsCount: 3
  }
];

const INITIAL_ACTIVITIES = [
  { id: 'act-1', user: 'Aarush Mane', action: 'completed', target: '"Landing Page"', time: '5 minutes ago', type: 'task' },
  { id: 'act-2', user: 'Riya Sharma', action: 'created a new task', target: '"Authentication System"', time: '1 hour ago', type: 'task' },
  { id: 'act-3', user: 'Rahul Patel', action: 'uploaded a project file', target: '"Design_System_v2.fig"', time: '2 hours ago', type: 'file' },
  { id: 'act-4', user: 'Priya Nair', action: 'commented on', target: '"API Integration"', time: '3 hours ago', type: 'comment' },
  { id: 'act-5', user: 'David Chen', action: 'joined project', target: '"AI Study Assistant"', time: 'Yesterday', type: 'team' },
  { id: 'act-6', user: 'Vikram Joshi', action: 'moved task to Review', target: '"Dashboard UI"', time: 'Yesterday', type: 'task' }
];

const INITIAL_FILES = [
  { id: 'file-1', name: 'Design_System_v2.fig', type: 'figma', size: '24.8 MB', uploadedBy: 'Vikram Joshi', uploadDate: 'Oct 18, 2026', projectId: 'proj-1' },
  { id: 'file-2', name: 'Architecture_Diagram.pdf', type: 'pdf', size: '4.2 MB', uploadedBy: 'Aarush Mane', uploadDate: 'Oct 17, 2026', projectId: 'proj-1' },
  { id: 'file-3', name: 'Database_Schema.sql', type: 'code', size: '185 KB', uploadedBy: 'Rahul Patel', uploadDate: 'Oct 19, 2026', projectId: 'proj-3' },
  { id: 'file-4', name: 'Pitch_Deck_2026.pdf', type: 'pdf', size: '14.6 MB', uploadedBy: 'Ananya Desai', uploadDate: 'Oct 15, 2026', projectId: 'proj-4' },
  { id: 'file-5', name: 'Logo_Assets_Vector.zip', type: 'zip', size: '12.1 MB', uploadedBy: 'Vikram Joshi', uploadDate: 'Oct 12, 2026', projectId: 'proj-1' },
  { id: 'file-6', name: 'User_Interviews_Summary.doc', type: 'doc', size: '890 KB', uploadedBy: 'Ananya Desai', uploadDate: 'Oct 16, 2026', projectId: 'proj-4' }
];

const INITIAL_CALENDAR_EVENTS = [
  { id: 'cal-1', title: 'Sprint 4 Planning & Demo', type: 'meeting', date: '2026-10-21', time: '10:00 AM', project: 'QuickLink Campus' },
  { id: 'cal-2', title: 'Dashboard UI Review Deadline', type: 'deadline', date: '2026-10-22', time: '5:00 PM', project: 'QuickLink Campus' },
  { id: 'cal-3', title: 'Landing Page Go-Live', type: 'deadline', date: '2026-10-24', time: '6:00 PM', project: 'QuickLink Campus' },
  { id: 'cal-4', title: 'AI Study Assistant Beta Release', type: 'milestone', date: '2026-10-30', time: '12:00 PM', project: 'AI Study Assistant' },
  { id: 'cal-5', title: 'Team Sync & Product Strategy', type: 'meeting', date: '2026-10-27', time: '11:00 AM', project: 'All Projects' },
  { id: 'cal-6', title: 'Stripe Payment Gateway Milestone', type: 'milestone', date: '2026-11-10', time: '11:59 PM', project: 'E-Commerce Platform' }
];

const INITIAL_MESSAGES = {
  general: [
    { id: 'msg-1', userId: 'user-1', text: 'Hey team! Welcome to the new PulseFlow workspace. All projects have been synced.', time: '09:30 AM' },
    { id: 'msg-2', userId: 'user-2', text: 'The neumorphic interface feels super smooth and tactile! Excited to push the new landing page.', time: '09:34 AM' },
    { id: 'msg-3', userId: 'user-4', text: '@Aarush Mane The LLM streaming endpoints are ready for testing.', time: '10:15 AM' },
    { id: 'msg-4', userId: 'user-1', text: 'Awesome work @Priya Nair! Checking it right now.', time: '10:18 AM' }
  ],
  development: [
    { id: 'msg-dev-1', userId: 'user-3', text: 'PostgreSQL migrations ran smoothly on staging. Read replicas configured.', time: 'Yesterday' },
    { id: 'msg-dev-2', userId: 'user-7', text: 'Adding JWT refresh rotation in auth middleware today.', time: '11:00 AM' }
  ],
  design: [
    { id: 'msg-des-1', userId: 'user-5', text: 'Uploaded the updated Figma design tokens in files. Check out the inset shadows.', time: '10:45 AM' },
    { id: 'msg-des-2', userId: 'user-2', text: 'Looks gorgeous Vikram! Matching CSS variables are linked.', time: '10:50 AM' }
  ],
  'dm-user-2': [
    { id: 'dm-r-1', userId: 'user-2', text: 'Hey Aarush! I finished the responsive breakpoints for the QuickLink Campus landing page.', time: '10:05 AM' },
    { id: 'dm-r-2', userId: 'user-1', text: 'Awesome Riya! How do the neumorphic inset cards feel on mobile devices?', time: '10:12 AM' },
    { id: 'dm-r-3', userId: 'user-2', text: 'Tested on mobile and desktop, tactile push transitions feel super smooth and responsive! 🚀', time: '10:14 AM' }
  ],
  'dm-user-3': [
    { id: 'dm-p-1', userId: 'user-3', text: 'Aarush, database indexes for the product catalog are optimized. Query latency dropped 60%.', time: 'Yesterday' },
    { id: 'dm-p-2', userId: 'user-1', text: 'Impressive work Rahul! Did you configure the read replica failover?', time: 'Yesterday' },
    { id: 'dm-p-3', userId: 'user-3', text: 'Yes, healthcheck probes and auto-recovery are running in staging.', time: 'Yesterday' }
  ],
  'dm-user-4': [
    { id: 'dm-pr-1', userId: 'user-4', text: 'Hey Aarush, the BGE-M3 embedding latency is down to 42ms on our GPU test runner.', time: '09:40 AM' },
    { id: 'dm-pr-2', userId: 'user-1', text: 'That is incredible Priya! Let us prepare a demo for the AI Study Assistant sprint check-in.', time: '09:45 AM' }
  ],
  'dm-user-5': [
    { id: 'dm-v-1', userId: 'user-5', text: 'Exported the new dual-direction neumorphic shadow tokens. Both light and dark palettes are in files.', time: 'Yesterday' },
    { id: 'dm-v-2', userId: 'user-1', text: 'Thanks Vikram! The bevel contrast looks top tier.', time: 'Yesterday' }
  ],
  'dm-user-6': [
    { id: 'dm-a-1', userId: 'user-6', text: 'Hey Aarush! Campus ambassador signups reached 120 students this morning across 4 universities.', time: '11:20 AM' },
    { id: 'dm-a-2', userId: 'user-1', text: 'Great milestone Ananya! Let us schedule the campus launch event date.', time: '11:25 AM' }
  ],
  'dm-user-7': [
    { id: 'dm-d-1', userId: 'user-7', text: 'Swagger documentation and automated API testing pipelines are active on the test server.', time: '10:30 AM' },
    { id: 'dm-d-2', userId: 'user-1', text: 'Thanks David, I will review the endpoint response codes today.', time: '10:35 AM' }
  ]
};

const INITIAL_NOTIFICATIONS = [
  { id: 'notif-1', text: 'Aarush Mane assigned you to "Dashboard UI"', time: '15 mins ago', read: false, type: 'assignment' },
  { id: 'notif-2', text: 'Reminder: "Landing Page" is due in 3 days', time: '1 hour ago', read: false, type: 'deadline' },
  { id: 'notif-3', text: 'Priya Nair mentioned you in #general', time: '3 hours ago', read: true, type: 'mention' },
  { id: 'notif-4', text: 'Rahul Patel uploaded Database_Schema.sql', time: 'Yesterday', read: true, type: 'file' }
];

class Store {
  constructor() {
    this.listeners = [];
    this.loadState();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.state = {
          currentUser: parsed.currentUser || INITIAL_MEMBERS[0],
          members: parsed.members || INITIAL_MEMBERS,
          projects: parsed.projects || INITIAL_PROJECTS,
          tasks: parsed.tasks || INITIAL_TASKS,
          activities: parsed.activities || INITIAL_ACTIVITIES,
          files: parsed.files || INITIAL_FILES,
          calendarEvents: parsed.calendarEvents || INITIAL_CALENDAR_EVENTS,
          messages: parsed.messages || INITIAL_MESSAGES,
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
          theme: parsed.theme || 'light'
        };
        return;
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage, using defaults', e);
    }

    this.state = {
      currentUser: INITIAL_MEMBERS[0],
      members: INITIAL_MEMBERS,
      projects: INITIAL_PROJECTS,
      tasks: INITIAL_TASKS,
      activities: INITIAL_ACTIVITIES,
      files: INITIAL_FILES,
      calendarEvents: INITIAL_CALENDAR_EVENTS,
      messages: INITIAL_MESSAGES,
      notifications: INITIAL_NOTIFICATIONS,
      theme: 'light'
    };
    this.saveState();
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to persist state to localStorage', e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(event, payload) {
    this.saveState();
    this.listeners.forEach(fn => fn(event, payload, this.state));
  }

  // --- GETTERS ---
  getState() { return this.state; }
  getCurrentUser() { return this.state.currentUser; }
  getMembers() { return this.state.members; }
  getProjects() { return this.state.projects; }
  getTasks() { return this.state.tasks; }
  getActivities() { return this.state.activities; }
  getFiles() { return this.state.files; }
  getCalendarEvents() { return this.state.calendarEvents; }
  getMessages(channel = 'general') { return this.state.messages[channel] || []; }
  getNotifications() { return this.state.notifications; }
  getTheme() { return this.state.theme; }

  getMemberById(id) {
    return this.state.members.find(m => m.id === id) || {
      name: 'Unassigned',
      initials: '?',
      avatarBg: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
      role: 'Contributor'
    };
  }

  getProjectById(id) {
    return this.state.projects.find(p => p.id === id);
  }

  // --- ACTIONS ---
  setTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.notify('THEME_CHANGED', theme);
  }

  toggleTheme() {
    const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
    return nextTheme;
  }

  // Tasks
  addTask(taskData) {
    const newTask = {
      id: 'task-' + Date.now(),
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      projectId: taskData.projectId || this.state.projects[0].id,
      status: taskData.status || 'todo',
      priority: taskData.priority || 'Medium',
      assigneeId: taskData.assigneeId || this.state.currentUser.id,
      dueDate: taskData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      tags: taskData.tags || ['General'],
      comments: [],
      attachmentsCount: 0
    };

    this.state.tasks.unshift(newTask);
    this.addActivity(`${this.state.currentUser.name} created task "${newTask.title}"`, this.state.currentUser.name, 'task');
    this.notify('TASK_ADDED', newTask);
    return newTask;
  }

  updateTask(taskId, updates) {
    const index = this.state.tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      this.state.tasks[index] = { ...this.state.tasks[index], ...updates };
      this.notify('TASK_UPDATED', this.state.tasks[index]);
      return this.state.tasks[index];
    }
  }

  moveTask(taskId, newStatus) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      const prevStatus = task.status;
      task.status = newStatus;
      
      const statusLabels = {
        todo: 'To Do',
        inprogress: 'In Progress',
        review: 'Review',
        completed: 'Completed'
      };

      this.addActivity(
        `${this.state.currentUser.name} moved "${task.title}" to ${statusLabels[newStatus] || newStatus}`,
        this.state.currentUser.name,
        'task'
      );

      this.notify('TASK_MOVED', { taskId, newStatus, prevStatus });
    }
  }

  deleteTask(taskId) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (task) {
      this.state.tasks = this.state.tasks.filter(t => t.id !== taskId);
      this.addActivity(`${this.state.currentUser.name} deleted task "${task.title}"`, this.state.currentUser.name, 'task');
      this.notify('TASK_DELETED', taskId);
    }
  }

  addTaskComment(taskId, commentText) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (task && commentText.trim()) {
      const newComment = {
        id: 'c-' + Date.now(),
        userId: this.state.currentUser.id,
        text: commentText.trim(),
        time: 'Just now'
      };
      if (!task.comments) task.comments = [];
      task.comments.push(newComment);
      this.addActivity(`${this.state.currentUser.name} commented on "${task.title}"`, this.state.currentUser.name, 'comment');
      this.notify('COMMENT_ADDED', { taskId, comment: newComment });
    }
  }

  // Projects
  addProject(projectData) {
    const newProject = {
      id: 'proj-' + Date.now(),
      name: projectData.name || 'Untitled Project',
      description: projectData.description || '',
      status: projectData.status || 'Planning',
      progress: projectData.progress || 0,
      priority: projectData.priority || 'Medium',
      dueDate: projectData.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      lastUpdated: 'Just now',
      ownerId: this.state.currentUser.id,
      members: projectData.members || [this.state.currentUser.id],
      category: projectData.category || 'General',
      milestones: [
        { id: 'm-' + Date.now(), title: 'Project Kickoff & Requirements', status: 'current', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
      ]
    };

    this.state.projects.unshift(newProject);
    this.addActivity(`${this.state.currentUser.name} created new project "${newProject.name}"`, this.state.currentUser.name, 'project');
    this.notify('PROJECT_ADDED', newProject);
    return newProject;
  }

  // Team Members
  addMember(memberData) {
    const initials = (memberData.name || 'New Member')
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const colors = [
      'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
    ];

    const newMember = {
      id: 'user-' + Date.now(),
      name: memberData.name || 'New Contributor',
      role: memberData.role || 'Developer',
      email: memberData.email || 'teammate@pulseflow.io',
      initials: initials,
      avatarBg: colors[Math.floor(Math.random() * colors.length)],
      status: 'online',
      assignedTasks: 0,
      completedTasks: 0,
      workload: 25,
      skills: memberData.skills || ['Full Stack', 'Agile']
    };

    this.state.members.push(newMember);
    this.addActivity(`New team member "${newMember.name}" joined the project`, this.state.currentUser.name, 'team');
    this.notify('MEMBER_ADDED', newMember);
    return newMember;
  }

  // Files
  addFile(fileData) {
    const newFile = {
      id: 'file-' + Date.now(),
      name: fileData.name || 'document.pdf',
      type: fileData.type || 'pdf',
      size: fileData.size || '1.2 MB',
      uploadedBy: this.state.currentUser.name,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      projectId: fileData.projectId || this.state.projects[0].id
    };

    this.state.files.unshift(newFile);
    this.addActivity(`${this.state.currentUser.name} uploaded a project file "${newFile.name}"`, this.state.currentUser.name, 'file');
    this.notify('FILE_ADDED', newFile);
    return newFile;
  }

  deleteFile(fileId) {
    const file = this.state.files.find(f => f.id === fileId);
    if (file) {
      this.state.files = this.state.files.filter(f => f.id !== fileId);
      this.addActivity(`${this.state.currentUser.name} deleted file "${file.name}"`, this.state.currentUser.name, 'file');
      this.notify('FILE_DELETED', fileId);
    }
  }

  // Messages
  addMessage(channel, text) {
    if (!text.trim()) return;
    if (!this.state.messages[channel]) {
      this.state.messages[channel] = [];
    }

    const newMsg = {
      id: 'msg-' + Date.now(),
      userId: this.state.currentUser.id,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.state.messages[channel].push(newMsg);
    this.notify('MESSAGE_ADDED', { channel, message: newMsg });

    // Intelligent automated teammate reply for Direct Messages
    if (channel.startsWith('dm-')) {
      const recipientId = channel.replace('dm-', '');
      const teammate = this.getMemberById(recipientId);
      if (teammate && teammate.id !== this.state.currentUser.id) {
        setTimeout(() => {
          const roleReplies = {
            'Frontend Developer': [
              'Got it Aarush! Updating the responsive components and checking CSS tokens right away 🚀',
              'Sounds great! I will test this on mobile touch and push the commit.',
              'Understood! Adding those UI states to the landing page now.'
            ],
            'Backend Developer': [
              'Understood! Checking the database query plans and verifying the API endpoints.',
              'Got it! Monitoring the server logs and configuring the cache layer.',
              'Thanks for the update. Staging microservices are updated.'
            ],
            'AI/ML Developer': [
              'Analyzing the embeddings test suite now! Latency looks very good.',
              'Got it! Running the prompt evaluation script on the new dataset.',
              'Understood! Syncing with the vector database index.'
            ],
            'UI/UX Designer': [
              'Great feedback! Adjusting the Figma shadow bevels and contrast ratios.',
              'I will export the updated component tokens for dark and light mode.',
              'Looking sharp! Adding the micro-interaction prototype.'
            ],
            'Marketing Lead': [
              'Awesome! Drafting the student newsletter announcement for tomorrow.',
              'Adding this to our campus launch checklist and ambassador briefing!',
              'Sounds great! I will coordinate the announcement schedule.'
            ]
          };

          const options = roleReplies[teammate.role] || [
            'Thanks for the note Aarush! Checking this right now. 👍',
            'Got it! Working on it right away and will keep you posted.',
            'Sounds great, I will review and follow up shortly.'
          ];

          const replyText = options[Math.floor(Math.random() * options.length)];
          const replyMsg = {
            id: 'msg-' + Date.now(),
            userId: teammate.id,
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          if (!this.state.messages[channel]) this.state.messages[channel] = [];
          this.state.messages[channel].push(replyMsg);
          this.notify('MESSAGE_ADDED', { channel, message: replyMsg });
        }, 1100);
      }
    }

    return newMsg;
  }

  // Notifications
  markNotificationsRead() {
    this.state.notifications.forEach(n => n.read = true);
    this.notify('NOTIFICATIONS_READ');
  }

  // Activity Feed
  addActivity(description, user, type) {
    const newActivity = {
      id: 'act-' + Date.now(),
      user: user,
      action: description,
      target: '',
      time: 'Just now',
      type: type || 'general'
    };
    this.state.activities.unshift(newActivity);
    if (this.state.activities.length > 50) this.state.activities.pop();
    this.notify('ACTIVITY_ADDED', newActivity);
  }

  // Global Search
  searchAll(query) {
    if (!query || !query.trim()) return { tasks: [], projects: [], members: [], files: [] };
    const q = query.toLowerCase().trim();

    return {
      tasks: this.state.tasks.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))),
      projects: this.state.projects.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)),
      members: this.state.members.filter(m => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)),
      files: this.state.files.filter(f => f.name.toLowerCase().includes(q))
    };
  }
}

// Export singleton
window.store = new Store();
