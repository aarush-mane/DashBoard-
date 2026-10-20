/**
 * Sidebar Navigation Component
 * Handles sidebar rendering, collapsing, mobile drawer, and active view switching
 */

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>' },
  { id: 'tasks', label: 'My Tasks', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>', badgeKey: 'tasksCount' },
  { id: 'projects', label: 'Projects', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>' },
  { id: 'team', label: 'Team', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' },
  { id: 'calendar', label: 'Calendar', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' },
  { id: 'files', label: 'Files', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>' },
  { id: 'messages', label: 'Messages', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>', badge: '4' },
  { id: 'activity', label: 'Activity', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>' },
  { id: 'reports', label: 'Reports', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>' },
  { id: 'settings', label: 'Settings', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>' }
];

class SidebarComponent {
  constructor(containerEl, onNavigate) {
    this.container = containerEl;
    this.onNavigate = onNavigate;
    this.isCollapsed = false;
    this.currentView = 'dashboard';
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
    
    // Subscribe to store updates for badge counts
    window.store.subscribe((event) => {
      if (['TASK_ADDED', 'TASK_DELETED', 'TASK_MOVED'].includes(event)) {
        this.updateBadges();
      }
    });
  }

  render() {
    const user = window.store.getCurrentUser();
    const activeTasksCount = window.store.getTasks().filter(t => t.status !== 'completed').length;

    this.container.innerHTML = `
      <div class="sidebar-header">
        <a href="#dashboard" class="brand-logo" id="brandLogo">
          <div class="brand-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <span class="brand-text">Pulse<span>Flow</span></span>
        </a>
        <button class="sidebar-toggle-btn" id="sidebarToggleBtn" title="Toggle Sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="11 17 6 12 11 7"></polyline>
            <polyline points="18 17 13 12 18 7"></polyline>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-title">Menu</div>
        ${NAV_ITEMS.map(item => {
          let badgeHtml = '';
          if (item.badgeKey === 'tasksCount') {
            badgeHtml = `<span class="nav-item-badge" id="tasksBadge">${activeTasksCount}</span>`;
          } else if (item.badge) {
            badgeHtml = `<span class="nav-item-badge">${item.badge}</span>`;
          }

          return `
            <a class="nav-item ${this.currentView === item.id ? 'active' : ''}" data-view="${item.id}" href="#${item.id}">
              <span class="nav-item-icon">${item.icon}</span>
              <span class="nav-item-label">${item.label}</span>
              ${badgeHtml}
            </a>
          `;
        }).join('')}
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile-card" id="userProfileSidebar" title="View Profile">
          <div class="user-avatar-wrap">
            <div class="avatar avatar-sm" style="background: ${user.avatarBg}">${user.initials}</div>
            <span class="user-status-indicator" title="Status: Online"></span>
          </div>
          <div class="user-profile-info">
            <div class="user-profile-name truncate">${user.name}</div>
            <div class="user-profile-role truncate">${user.role}</div>
          </div>
          <button class="user-profile-action" id="sidebarLogoutBtn" title="Logout / Switch User">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const toggleBtn = this.container.querySelector('#sidebarToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleCollapse());
    }

    // Nav clicks
    this.container.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        this.setActive(view);
        if (this.onNavigate) this.onNavigate(view);

        // Close mobile drawer if open
        this.container.classList.remove('mobile-open');
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) overlay.classList.remove('active');
      });
    });

    // Brand logo click
    const brandLogo = this.container.querySelector('#brandLogo');
    if (brandLogo) {
      brandLogo.addEventListener('click', (e) => {
        e.preventDefault();
        this.setActive('dashboard');
        if (this.onNavigate) this.onNavigate('dashboard');
      });
    }

    // Logout / profile click
    const logoutBtn = this.container.querySelector('#sidebarLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.modals.showToast('Session Active', 'You are logged in as ' + window.store.getCurrentUser().name, 'info');
      });
    }

    const profileCard = this.container.querySelector('#userProfileSidebar');
    if (profileCard) {
      profileCard.addEventListener('click', () => {
        this.setActive('settings');
        if (this.onNavigate) this.onNavigate('settings');
      });
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.container.classList.toggle('collapsed', this.isCollapsed);
    const mainWrapper = document.querySelector('.main-wrapper');
    if (mainWrapper && window.innerWidth > 992) {
      // Smooth reflow
    }
  }

  setActive(view) {
    this.currentView = view;
    this.container.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-view') === view);
    });
  }

  updateBadges() {
    const activeTasksCount = window.store.getTasks().filter(t => t.status !== 'completed').length;
    const badgeEl = this.container.querySelector('#tasksBadge');
    if (badgeEl) badgeEl.textContent = activeTasksCount;
  }
}

window.SidebarComponent = SidebarComponent;
