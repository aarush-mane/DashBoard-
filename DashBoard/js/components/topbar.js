/**
 * Top Navigation Bar Component
 * Global Search, Notifications Drawer, Quick Add Button, Neumorphic Theme Toggle, and User Menu
 */

class TopbarComponent {
  constructor(containerEl) {
    this.container = containerEl;
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
    
    // Subscribe to notifications updates
    window.store.subscribe((event) => {
      if (['NOTIFICATIONS_READ', 'TASK_ADDED', 'PROJECT_ADDED', 'FILE_ADDED'].includes(event)) {
        this.updateNotifications();
      }
    });
  }

  render() {
    const user = window.store.getCurrentUser();
    const currentTheme = window.store.getTheme();
    const notifications = window.store.getNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;

    this.container.innerHTML = `
      <div class="topbar-left">
        <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Open Sidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div class="global-search-container" id="globalSearchTrigger">
          <svg class="global-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" class="global-search-input" placeholder="Search tasks, projects, members, files..." readonly />
          <span class="search-shortcut-hint">⌘K</span>
        </div>
      </div>

      <div class="topbar-right">
        <!-- Quick Add Dropdown -->
        <div class="dropdown-wrap" id="quickAddWrap">
          <button class="btn btn-primary" id="quickAddBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span class="quick-add-text">Quick Add</span>
          </button>

          <div class="dropdown-menu" id="quickAddMenu">
            <div class="dropdown-item" id="quickAddTask">
              <span class="dropdown-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"></path></svg>
              </span>
              <span>Create Task</span>
            </div>
            <div class="dropdown-item" id="quickAddProject">
              <span class="dropdown-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              </span>
              <span>Create Project</span>
            </div>
            <div class="dropdown-item" id="quickAddMember">
              <span class="dropdown-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              </span>
              <span>Invite Member</span>
            </div>
            <div class="dropdown-item" id="quickAddTeamMessage">
              <span class="dropdown-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              </span>
              <span>Message to Team</span>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item" id="quickAddNote">
              <span class="dropdown-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              </span>
              <span>Add Quick Note</span>
            </div>
          </div>
        </div>

        <!-- Neumorphic Theme Toggle -->
        <div class="theme-switch" id="themeToggleBtn" title="Toggle Light / Dark Neumorphism">
          <div class="theme-switch-thumb">
            <svg id="themeIcon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              ${currentTheme === 'dark' 
                ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>' 
                : '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>'
              }
            </svg>
          </div>
        </div>

        <!-- Notifications Bell -->
        <div class="dropdown-wrap" id="notifWrap">
          <button class="btn btn-default btn-icon-only notif-btn" id="notifBtn" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            ${unreadCount > 0 ? '<span class="notif-badge"></span>' : ''}
          </button>

          <div class="notif-dropdown" id="notifDropdown">
            <div class="notif-header">
              <h4 style="margin:0; font-size: 0.95rem;">Notifications</h4>
              <button class="btn btn-ghost btn-sm" id="markAllReadBtn" style="padding: 2px 6px; font-size: 0.76rem;">Mark all as read</button>
            </div>
            <div class="notif-list" id="notifList">
              ${notifications.map(n => `
                <div class="notif-item ${!n.read ? 'unread' : ''}">
                  <div class="notif-item-body">
                    <div class="notif-text">${n.text}</div>
                    <div class="notif-time">${n.time}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- User Profile Dropdown Menu -->
        <div class="dropdown-wrap" id="userMenuWrap">
          <button class="btn-ghost" id="userMenuBtn" style="padding: 2px; border-radius: 50%;">
            <div class="avatar avatar-sm" style="background: ${user.avatarBg}">${user.initials}</div>
          </button>

          <div class="dropdown-menu" id="userMenuDropdown" style="width: 200px;">
            <div style="padding: 8px 12px; border-bottom: 1px solid var(--divider);">
              <div style="font-weight:700; font-size:0.88rem;">${user.name}</div>
              <div style="font-size:0.75rem; color: var(--text-muted);">${user.email}</div>
            </div>
            <div class="dropdown-item" id="userMenuSettings">
              <span class="dropdown-item-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </span>
              <span>Account Settings</span>
            </div>
            <div class="dropdown-item" id="userMenuStatusToggle">
              <span class="dropdown-item-icon">
                <span class="status-dot online"></span>
              </span>
              <span>Status: Active</span>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item" id="userMenuLogout" style="color: var(--danger);">
              <span class="dropdown-item-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </span>
              <span>Log Out</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // Mobile Drawer Open
    const mobileBtn = this.container.querySelector('#mobileMenuBtn');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        if (sidebar && overlay) {
          sidebar.classList.add('mobile-open');
          overlay.classList.add('active');
        }
      });
    }

    // Search Trigger (input click or ⌘K)
    const searchTrigger = this.container.querySelector('#globalSearchTrigger');
    if (searchTrigger) {
      searchTrigger.addEventListener('click', () => {
        window.modals.openSearchModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        window.modals.openSearchModal();
      }
    });

    // Theme Toggle
    const themeBtn = this.container.querySelector('#themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const nextTheme = window.store.toggleTheme();
        const iconContainer = this.container.querySelector('#themeIcon');
        if (iconContainer) {
          iconContainer.innerHTML = nextTheme === 'dark' 
            ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>' 
            : '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        }
        window.modals.showToast('Theme Changed', `Switched to ${nextTheme === 'dark' ? 'Dark Neumorphism' : 'Light Neumorphism'}`, 'info');
      });
    }

    // Quick Add Dropdown Toggle
    const quickAddBtn = this.container.querySelector('#quickAddBtn');
    const quickAddMenu = this.container.querySelector('#quickAddMenu');
    if (quickAddBtn && quickAddMenu) {
      quickAddBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeAllDropdowns(quickAddMenu);
        quickAddMenu.classList.toggle('show');
      });

      this.container.querySelector('#quickAddTask')?.addEventListener('click', () => {
        quickAddMenu.classList.remove('show');
        window.modals.openCreateTaskModal();
      });

      this.container.querySelector('#quickAddProject')?.addEventListener('click', () => {
        quickAddMenu.classList.remove('show');
        window.modals.openCreateProjectModal();
      });

      this.container.querySelector('#quickAddMember')?.addEventListener('click', () => {
        quickAddMenu.classList.remove('show');
        window.modals.openInviteMemberModal();
      });

      this.container.querySelector('#quickAddTeamMessage')?.addEventListener('click', () => {
        quickAddMenu.classList.remove('show');
        window.modals.openMessageTeamModal();
      });

      this.container.querySelector('#quickAddNote')?.addEventListener('click', () => {
        quickAddMenu.classList.remove('show');
        window.modals.openAddNoteModal();
      });
    }

    // Notifications Dropdown Toggle
    const notifBtn = this.container.querySelector('#notifBtn');
    const notifDropdown = this.container.querySelector('#notifDropdown');
    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeAllDropdowns(notifDropdown);
        notifDropdown.classList.toggle('show');
      });

      this.container.querySelector('#markAllReadBtn')?.addEventListener('click', () => {
        window.store.markNotificationsRead();
        window.modals.showToast('Notifications Cleared', 'All notifications marked as read', 'success');
      });
    }

    // User Menu Toggle
    const userMenuBtn = this.container.querySelector('#userMenuBtn');
    const userMenuDropdown = this.container.querySelector('#userMenuDropdown');
    if (userMenuBtn && userMenuDropdown) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeAllDropdowns(userMenuDropdown);
        userMenuDropdown.classList.toggle('show');
      });

      this.container.querySelector('#userMenuSettings')?.addEventListener('click', () => {
        userMenuDropdown.classList.remove('show');
        if (window.appRouter) window.appRouter.navigate('settings');
      });

      this.container.querySelector('#userMenuStatusToggle')?.addEventListener('click', () => {
        userMenuDropdown.classList.remove('show');
        window.modals.showToast('Online Status', 'Your status is set to Available', 'info');
      });

      this.container.querySelector('#userMenuLogout')?.addEventListener('click', () => {
        userMenuDropdown.classList.remove('show');
        window.modals.showToast('Session Active', 'Demo session refreshed', 'info');
      });
    }

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      this.closeAllDropdowns();
    });
  }

  closeAllDropdowns(except = null) {
    this.container.querySelectorAll('.dropdown-menu, .notif-dropdown').forEach(d => {
      if (d !== except) d.classList.remove('show');
    });
  }

  updateNotifications() {
    const notifications = window.store.getNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = this.container.querySelector('.notif-badge');
    const notifBtn = this.container.querySelector('#notifBtn');
    
    if (unreadCount > 0 && !badge && notifBtn) {
      const newBadge = document.createElement('span');
      newBadge.className = 'notif-badge';
      notifBtn.appendChild(newBadge);
    } else if (unreadCount === 0 && badge) {
      badge.remove();
    }

    const notifList = this.container.querySelector('#notifList');
    if (notifList) {
      notifList.innerHTML = notifications.map(n => `
        <div class="notif-item ${!n.read ? 'unread' : ''}">
          <div class="notif-item-body">
            <div class="notif-text">${n.text}</div>
            <div class="notif-time">${n.time}</div>
          </div>
        </div>
      `).join('');
    }
  }
}

window.TopbarComponent = TopbarComponent;
