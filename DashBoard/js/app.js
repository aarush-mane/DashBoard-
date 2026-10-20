/**
 * PulseFlow - Main Application Bootstrap & Client-Side View Router
 */

class AppRouter {
  constructor() {
    this.currentView = 'dashboard';
    this.viewContainers = {};
    this.init();
  }

  init() {
    // Cache view containers
    const views = ['dashboard', 'tasks', 'projects', 'team', 'calendar', 'files', 'messages', 'activity', 'reports', 'settings', 'project-detail'];
    views.forEach(v => {
      this.viewContainers[v] = document.getElementById(`view-${v}`);
    });

    // Initialize Sidebar & Topbar
    const sidebarEl = document.getElementById('sidebar');
    const topbarEl = document.getElementById('topbar');

    window.sidebarInstance = new SidebarComponent(sidebarEl, (view) => this.navigate(view));
    window.topbarInstance = new TopbarComponent(topbarEl);

    // Initialize Project Detail View instance
    const projDetailMount = document.getElementById('view-project-detail');
    window.projectDetailView = new ProjectDetailView(projDetailMount, () => this.navigate('projects'));

    // Hash navigation listener
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      if (hash.startsWith('project/')) {
        const projId = hash.replace('project/', '');
        window.projectDetailView.openProject(projId);
      } else {
        this.navigate(hash, false);
      }
    });

    // Initial render of dashboard components
    this.renderDashboardView();

    // Check initial hash
    const initialHash = window.location.hash.replace('#', '') || 'dashboard';
    if (initialHash.startsWith('project/')) {
      const projId = initialHash.replace('project/', '');
      window.projectDetailView.openProject(projId);
    } else {
      this.navigate(initialHash, false);
    }

    // Subscribe to state changes to refresh dashboard sections
    window.store.subscribe((event) => {
      if (['TASK_ADDED', 'TASK_MOVED', 'TASK_DELETED', 'PROJECT_ADDED', 'MEMBER_ADDED', 'ACTIVITY_ADDED'].includes(event)) {
        if (this.currentView === 'dashboard') {
          this.renderDashboardStats();
          this.renderDashboardProjects();
          this.renderDashboardActivity();
        } else if (this.currentView === 'projects') {
          this.renderProjectsGallery();
        } else if (this.currentView === 'team') {
          this.renderTeamView();
        } else if (this.currentView === 'activity') {
          this.renderActivityView();
        }
      }
    });
  }

  navigate(viewName, updateHash = true) {
    if (!this.viewContainers[viewName]) viewName = 'dashboard';
    this.currentView = viewName;

    // Toggle active view container
    Object.keys(this.viewContainers).forEach(v => {
      if (this.viewContainers[v]) {
        this.viewContainers[v].classList.toggle('active', v === viewName);
      }
    });

    // Update sidebar
    if (window.sidebarInstance) {
      window.sidebarInstance.setActive(viewName);
    }

    if (updateHash) {
      window.location.hash = viewName;
    }

    // Render view-specific content if needed
    switch (viewName) {
      case 'dashboard':
        this.renderDashboardView();
        break;
      case 'tasks':
        this.renderTasksView();
        break;
      case 'projects':
        this.renderProjectsGallery();
        break;
      case 'team':
        this.renderTeamView();
        break;
      case 'calendar':
        this.renderCalendarView();
        break;
      case 'files':
        this.renderFilesView();
        break;
      case 'messages':
        this.renderMessagesView();
        break;
      case 'activity':
        this.renderActivityView();
        break;
      case 'reports':
        this.renderReportsView();
        break;
      case 'settings':
        this.renderSettingsView();
        break;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showProjectDetail() {
    this.currentView = 'project-detail';
    Object.keys(this.viewContainers).forEach(v => {
      if (this.viewContainers[v]) {
        this.viewContainers[v].classList.toggle('active', v === 'project-detail');
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openDirectMessage(memberId) {
    this.navigate('messages');
    setTimeout(() => {
      if (window.messagesInstance) {
        window.messagesInstance.openDirectMessage(memberId);
      }
    }, 50);
  }

  // =========================================================================
  // VIEW RENDERERS
  // =========================================================================

  // 1. DASHBOARD OVERVIEW
  renderDashboardView() {
    this.renderDashboardStats();
    this.renderDashboardProjects();

    // Render Dashboard Kanban preview
    const kanbanMount = document.getElementById('dashboardKanbanMount');
    if (kanbanMount && !kanbanMount.hasChildNodes()) {
      new KanbanBoardComponent(kanbanMount);
    }

    this.renderDashboardActivity();

    // Mini charts preview
    const chartsMount = document.getElementById('dashboardChartsMount');
    if (chartsMount && !chartsMount.hasChildNodes()) {
      new AnalyticsCharts(chartsMount);
    }
  }

  renderDashboardStats() {
    const statsMount = document.getElementById('dashboardStatsMount');
    if (!statsMount) return;

    const projects = window.store.getProjects();
    const tasks = window.store.getTasks();
    const members = window.store.getMembers();

    const totalProjects = projects.length;
    const activeTasks = tasks.filter(t => t.status !== 'completed').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const teamCount = members.length;
    const upcomingDeadlines = tasks.filter(t => t.dueDate && t.status !== 'completed').length;

    statsMount.innerHTML = `
      <div class="stat-card" style="--card-accent: var(--primary);" onclick="window.appRouter.navigate('projects')">
        <div class="stat-card-header">
          <div class="stat-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <div class="stat-trend positive">+2 this month</div>
        </div>
        <div class="stat-value">${totalProjects}</div>
        <div class="stat-label">Total Projects</div>
      </div>

      <div class="stat-card" style="--card-accent: var(--info);" onclick="window.appRouter.navigate('tasks')">
        <div class="stat-card-header">
          <div class="stat-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          </div>
          <div class="stat-trend positive">+8% velocity</div>
        </div>
        <div class="stat-value">${activeTasks}</div>
        <div class="stat-label">Active Tasks</div>
      </div>

      <div class="stat-card" style="--card-accent: var(--success);" onclick="window.appRouter.navigate('tasks')">
        <div class="stat-card-header">
          <div class="stat-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div class="stat-trend positive">84% rate</div>
        </div>
        <div class="stat-value">${completedTasks}</div>
        <div class="stat-label">Completed Tasks</div>
      </div>

      <div class="stat-card" style="--card-accent: var(--purple);" onclick="window.appRouter.navigate('team')">
        <div class="stat-card-header">
          <div class="stat-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="stat-trend positive">${members.filter(m => m.status === 'online').length} online</div>
        </div>
        <div class="stat-value">${teamCount}</div>
        <div class="stat-label">Team Members</div>
      </div>

      <div class="stat-card" style="--card-accent: var(--danger);" onclick="window.appRouter.navigate('calendar')">
        <div class="stat-card-header">
          <div class="stat-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div class="stat-trend negative">Next 7 days</div>
        </div>
        <div class="stat-value">${upcomingDeadlines}</div>
        <div class="stat-label">Upcoming Deadlines</div>
      </div>
    `;
  }

  renderDashboardProjects() {
    const projectsMount = document.getElementById('dashboardProjectsMount');
    if (!projectsMount) return;

    const projects = window.store.getProjects();

    projectsMount.innerHTML = `
      <div class="projects-grid">
        ${projects.map(p => {
          const members = (p.members || []).map(id => window.store.getMemberById(id));
          const pTasks = window.store.getTasks().filter(t => t.projectId === p.id);
          const completedCount = pTasks.filter(t => t.status === 'completed').length;

          return `
            <div class="project-card" data-project-id="${p.id}">
              <div>
                <div class="project-card-header">
                  <span class="badge badge-primary">${p.category}</span>
                  <span class="priority-tag priority-${p.priority.toLowerCase()}">${p.priority}</span>
                </div>
                <div class="project-title">${p.name}</div>
                <div class="project-desc">${p.description}</div>
              </div>

              <div>
                <div class="project-stats-row">
                  <span>Progress</span>
                  <strong style="color: var(--primary);">${p.progress}%</strong>
                </div>
                <div class="progress-track">
                  <div class="progress-bar ${p.progress > 80 ? 'success' : ''}" style="width: ${p.progress}%;"></div>
                </div>

                <div class="project-card-footer">
                  <div class="avatar-stack">
                    ${members.slice(0, 3).map(m => `
                      <div class="avatar avatar-sm" style="background: ${m.avatarBg}" title="${m.name} (${m.role})">
                        ${m.initials}
                      </div>
                    `).join('')}
                    ${members.length > 3 ? `<div class="avatar-more">+${members.length - 3}</div>` : ''}
                  </div>

                  <div style="text-align: right;">
                    <div class="project-due-info">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      <span>Due ${p.dueDate}</span>
                    </div>
                    <div class="project-tasks-count" style="margin-top: 2px;">
                      ${completedCount}/${pTasks.length} tasks • ${p.lastUpdated}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    projectsMount.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-project-id');
        window.location.hash = `project/${id}`;
      });
    });
  }

  renderDashboardActivity() {
    const actMount = document.getElementById('dashboardActivityMount');
    if (!actMount) return;

    const activities = window.store.getActivities().slice(0, 5);

    actMount.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${activities.map(a => `
          <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: var(--bg-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-flat-sm); border: 1px solid var(--border-card);">
            <div class="avatar avatar-sm" style="background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);">
              ${(a.user || 'AM').split(' ').map(n => n[0]).join('')}
            </div>
            <div style="flex:1;">
              <div style="font-size: 0.88rem; color: var(--text-primary);">
                <strong>${a.user}</strong> ${a.action} ${a.target || ''}
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">${a.time}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 2. MY TASKS VIEW
  renderTasksView() {
    const mount = document.getElementById('myTasksViewMount');
    if (mount && !mount.hasChildNodes()) {
      new KanbanBoardComponent(mount);
    }
  }

  // 3. PROJECTS GALLERY
  renderProjectsGallery() {
    const mount = document.getElementById('projectsGalleryMount');
    if (!mount) return;

    const projects = window.store.getProjects();

    mount.innerHTML = `
      <div class="projects-grid">
        ${projects.map(p => {
          const members = (p.members || []).map(id => window.store.getMemberById(id));
          const pTasks = window.store.getTasks().filter(t => t.projectId === p.id);
          const completedCount = pTasks.filter(t => t.status === 'completed').length;

          return `
            <div class="project-card" data-project-id="${p.id}">
              <div>
                <div class="project-card-header">
                  <span class="badge badge-primary">${p.category}</span>
                  <span class="priority-tag priority-${p.priority.toLowerCase()}">${p.priority}</span>
                </div>
                <div class="project-title">${p.name}</div>
                <div class="project-desc">${p.description}</div>
              </div>

              <div>
                <div class="project-stats-row">
                  <span>Progress</span>
                  <strong style="color: var(--primary);">${p.progress}%</strong>
                </div>
                <div class="progress-track">
                  <div class="progress-bar ${p.progress > 80 ? 'success' : ''}" style="width: ${p.progress}%;"></div>
                </div>

                <div class="project-card-footer">
                  <div class="avatar-stack">
                    ${members.map(m => `
                      <div class="avatar avatar-sm" style="background: ${m.avatarBg}" title="${m.name} (${m.role})">
                        ${m.initials}
                      </div>
                    `).join('')}
                  </div>

                  <div style="text-align: right;">
                    <div class="project-due-info">Due ${p.dueDate}</div>
                    <div class="project-tasks-count">${completedCount}/${pTasks.length} tasks</div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    mount.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-project-id');
        window.location.hash = `project/${id}`;
      });
    });
  }

  // 4. TEAM VIEW
  renderTeamView() {
    const mount = document.getElementById('teamViewMount');
    if (!mount) return;

    const members = window.store.getMembers();

    mount.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px;">
        ${members.map(m => `
          <div class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 26px;">
            <div style="position: relative; margin-bottom: 14px;">
              <div class="avatar avatar-xl" style="background: ${m.avatarBg}">${m.initials}</div>
              <span class="status-dot ${m.status}" style="position: absolute; bottom: 4px; right: 4px; width: 14px; height: 14px; border: 2px solid var(--bg-surface);" title="Status: ${m.status}"></span>
            </div>

            <h3 style="font-size: 1.15rem; margin-bottom: 4px;">${m.name}</h3>
            <div style="font-size: 0.85rem; font-weight: 600; color: var(--primary); margin-bottom: 12px;">${m.role}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 16px;">${m.email}</div>

            <!-- Stats Box -->
            <div style="width: 100%; padding: 14px; background: var(--bg-surface); box-shadow: var(--shadow-inset-sm); border-radius: var(--radius-md); display: flex; justify-content: space-around; margin-bottom: 16px;">
              <div>
                <div style="font-size: 1.25rem; font-weight: 800;">${m.assignedTasks}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Assigned</div>
              </div>
              <div style="border-left: 1px solid var(--divider);"></div>
              <div>
                <div style="font-size: 1.25rem; font-weight: 800; color: var(--success);">${m.completedTasks}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Completed</div>
              </div>
              <div style="border-left: 1px solid var(--divider);"></div>
              <div>
                <div style="font-size: 1.25rem; font-weight: 800; color: ${m.workload > 80 ? 'var(--danger)' : 'var(--primary)'};">${m.workload}%</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Workload</div>
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 20px;">
              ${(m.skills || []).map(s => `<span class="badge badge-muted">${s}</span>`).join('')}
            </div>

            <div style="display: flex; gap: 10px; width: 100%;">
              <button class="btn btn-default btn-sm w-full" onclick="window.appRouter.openDirectMessage('${m.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Message
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 5. CALENDAR VIEW
  renderCalendarView() {
    const mount = document.getElementById('calendarViewMount');
    if (mount && !mount.hasChildNodes()) {
      new CalendarComponent(mount);
    }
  }

  // 6. FILES VIEW
  renderFilesView() {
    const mount = document.getElementById('filesViewMount');
    if (mount && !mount.hasChildNodes()) {
      new FilesComponent(mount);
    }
  }

  // 7. MESSAGES VIEW
  renderMessagesView() {
    const mount = document.getElementById('messagesViewMount');
    if (mount && !mount.hasChildNodes()) {
      window.messagesInstance = new MessagesComponent(mount);
    }
  }

  // 8. ACTIVITY TIMELINE VIEW
  renderActivityView() {
    const mount = document.getElementById('activityViewMount');
    if (!mount) return;

    const activities = window.store.getActivities();

    mount.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Real-Time Team Audit Stream</div>
            <div class="card-subtitle">Every task completion, deployment, and document upload</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 14px;">
          ${activities.map(a => `
            <div style="display: flex; gap: 14px; padding: 14px 18px; background: var(--bg-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-flat-sm); border: 1px solid var(--border-card);">
              <div class="avatar avatar-sm" style="background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);">
                ${(a.user || 'AM').split(' ').map(n => n[0]).join('')}
              </div>
              <div style="flex:1;">
                <div style="font-size: 0.92rem; color: var(--text-primary);">
                  <strong>${a.user}</strong> ${a.action} ${a.target || ''}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">${a.time}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 9. REPORTS VIEW
  renderReportsView() {
    const mount = document.getElementById('reportsViewMount');
    if (mount && !mount.hasChildNodes()) {
      new AnalyticsCharts(mount);
    }
  }

  // 10. SETTINGS VIEW
  renderSettingsView() {
    const mount = document.getElementById('settingsViewMount');
    if (!mount) return;

    const user = window.store.getCurrentUser();

    mount.innerHTML = `
      <div style="max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
        <!-- User Profile Settings -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Profile Settings</div>
              <div class="card-subtitle">Manage your personal identification and roles</div>
            </div>
          </div>

          <form id="profileSettingsForm">
            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
              <div class="avatar avatar-xl" style="background: ${user.avatarBg}">${user.initials}</div>
              <div>
                <button type="button" class="btn btn-default btn-sm" onclick="window.modals.showToast('Avatar', 'Gradient color scheme updated', 'info')">Change Avatar Color</button>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 6px;">Neumorphic dynamic gradient avatar</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" name="name" class="neu-input" value="${user.name}" required />
              </div>

              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" name="email" class="neu-input" value="${user.email}" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Professional Role</label>
              <input type="text" name="role" class="neu-input" value="${user.role}" required />
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>

        <!-- Workspace & Preferences -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Appearance & Notifications</div>
              <div class="card-subtitle">Personalize your SaaS workspace preferences</div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 18px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <div style="font-weight: 700;">Tactile Neumorphic Sounds & Transitions</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Enable soft micro-animations on button clicks</div>
              </div>
              <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: var(--primary);" />
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--divider);">
              <div>
                <div style="font-weight: 700;">Daily Deadline Digest</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Receive summary email for tasks due within 48 hours</div>
              </div>
              <input type="checkbox" checked style="width: 20px; height: 20px; accent-color: var(--primary);" />
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--divider);">
              <div>
                <div style="font-weight: 700;">Dark Neumorphic Mode</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Toggle high-contrast obsidian slate surfaces</div>
              </div>
              <button type="button" class="btn btn-default btn-sm" onclick="window.store.toggleTheme()">Switch Theme</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const profileForm = mount.querySelector('#profileSettingsForm');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(profileForm);
        window.store.state.currentUser.name = fd.get('name');
        window.store.state.currentUser.email = fd.get('email');
        window.store.state.currentUser.role = fd.get('role');
        window.store.saveState();
        if (window.sidebarInstance) window.sidebarInstance.render();
        window.modals.showToast('Profile Updated', 'Your profile changes have been saved', 'success');
      });
    }
  }
}

// Instantiate router on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.appRouter = new AppRouter();
});
