/**
 * Project Details Workspace View
 * 6 Tabs: Overview | Tasks | Team | Files | Timeline | Discussions
 */

class ProjectDetailView {
  constructor(containerEl, onBack) {
    this.container = containerEl;
    this.onBack = onBack;
    this.currentProjectId = null;
    this.activeTab = 'overview';
    this.kanbanInstance = null;
  }

  openProject(projectId) {
    this.currentProjectId = projectId;
    this.activeTab = 'overview';
    this.render();

    // Switch view in router
    if (window.appRouter) {
      window.appRouter.showProjectDetail();
    }
  }

  render() {
    const project = window.store.getProjectById(this.currentProjectId);
    if (!project) return;

    const owner = window.store.getMemberById(project.ownerId);
    const members = (project.members || []).map(id => window.store.getMemberById(id));
    const projectTasks = window.store.getTasks().filter(t => t.projectId === project.id);
    const completedTasksCount = projectTasks.filter(t => t.status === 'completed').length;

    this.container.innerHTML = `
      <!-- Breadcrumbs & Back Button -->
      <div class="project-breadcrumb">
        <a href="#projects" id="projDetailBackBtn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Back to Projects
        </a>
        <span>/</span>
        <span style="color: var(--text-primary); font-weight: 700;">${project.name}</span>
      </div>

      <!-- Project Hero Card -->
      <div class="project-detail-hero">
        <div class="project-detail-header">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span class="badge badge-primary">${project.category}</span>
              <span class="badge badge-success">${project.status}</span>
              <span class="priority-tag priority-${project.priority.toLowerCase()}">${project.priority}</span>
            </div>
            <h1 style="font-size: 1.85rem; margin-bottom: 8px;">${project.name}</h1>
            <p style="max-width: 680px; font-size: 0.95rem; line-height: 1.5;">${project.description}</p>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-default" id="projShareBtn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              Share
            </button>
            <button class="btn btn-primary" id="projNewTaskBtn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Task
            </button>
          </div>
        </div>

        <!-- Meta Grid -->
        <div class="project-detail-meta-grid">
          <div class="meta-box">
            <span class="meta-box-label">Project Owner</span>
            <div class="meta-box-value">
              <div class="avatar avatar-sm" style="background: ${owner.avatarBg}">${owner.initials}</div>
              <span>${owner.name}</span>
            </div>
          </div>

          <div class="meta-box">
            <span class="meta-box-label">Overall Progress</span>
            <div class="meta-box-value" style="color: var(--primary);">
              ${project.progress}%
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">(${completedTasksCount}/${projectTasks.length} tasks)</span>
            </div>
          </div>

          <div class="meta-box">
            <span class="meta-box-label">Target Completion</span>
            <div class="meta-box-value">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>${project.dueDate}</span>
            </div>
          </div>

          <div class="meta-box">
            <span class="meta-box-label">Team Members (${members.length})</span>
            <div class="meta-box-value">
              <div class="avatar-stack">
                ${members.map(m => `
                  <div class="avatar avatar-sm" style="background: ${m.avatarBg}" title="${m.name} (${m.role})">
                    ${m.initials}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="progress-track" style="height: 10px;">
          <div class="progress-bar ${project.progress > 80 ? 'success' : ''}" style="width: ${project.progress}%;"></div>
        </div>
      </div>

      <!-- Navigation Tabs: Overview | Tasks | Team | Files | Timeline | Discussions -->
      <div class="project-tabs-bar">
        <button class="project-tab-btn ${this.activeTab === 'overview' ? 'active' : ''}" data-tab="overview">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Overview
        </button>
        <button class="project-tab-btn ${this.activeTab === 'tasks' ? 'active' : ''}" data-tab="tasks">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          Tasks (${projectTasks.length})
        </button>
        <button class="project-tab-btn ${this.activeTab === 'team' ? 'active' : ''}" data-tab="team">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
          Team (${members.length})
        </button>
        <button class="project-tab-btn ${this.activeTab === 'files' ? 'active' : ''}" data-tab="files">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
          Files
        </button>
        <button class="project-tab-btn ${this.activeTab === 'timeline' ? 'active' : ''}" data-tab="timeline">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Timeline
        </button>
        <button class="project-tab-btn ${this.activeTab === 'discussions' ? 'active' : ''}" data-tab="discussions">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          Discussions
        </button>
      </div>

      <!-- Tab Panes Mount -->
      <div id="projectTabPaneMount"></div>
    `;

    this.attachEvents();
    this.renderCurrentTab();
  }

  renderCurrentTab() {
    const mount = this.container.querySelector('#projectTabPaneMount');
    if (!mount) return;

    const project = window.store.getProjectById(this.currentProjectId);
    const members = (project.members || []).map(id => window.store.getMemberById(id));
    const projectTasks = window.store.getTasks().filter(t => t.projectId === project.id);
    const files = window.store.getFiles().filter(f => f.projectId === project.id);

    if (this.activeTab === 'overview') {
      mount.innerHTML = `
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
          <div>
            <div class="card" style="margin-bottom: 24px;">
              <div class="card-header">
                <div class="card-title">Project Vision & Goals</div>
              </div>
              <p style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 16px;">
                ${project.description} This project is engineered with scalable architecture, microservices integration, and modern neumorphic interfaces for seamless user adoption.
              </p>
              <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <span class="badge badge-primary">Target: MVP 1.0</span>
                <span class="badge badge-success">Code Quality: 98%</span>
                <span class="badge badge-info">Deploy: Staging OK</span>
              </div>
            </div>

            <!-- Milestones Snapshot -->
            <div class="card">
              <div class="card-header">
                <div class="card-title">Milestone Progress</div>
              </div>
              <div class="milestones-timeline">
                ${(project.milestones || []).map(m => `
                  <div class="milestone-item">
                    <div class="milestone-left">
                      <div class="milestone-status-icon ${m.status}">
                        ${m.status === 'completed' ? '✓' : (m.status === 'current' ? '▶' : '○')}
                      </div>
                      <div>
                        <div style="font-weight: 700; font-size: 0.92rem;">${m.title}</div>
                        <div style="font-size: 0.78rem; color: var(--text-muted);">${m.date}</div>
                      </div>
                    </div>
                    <span class="badge ${m.status === 'completed' ? 'badge-success' : (m.status === 'current' ? 'badge-primary' : 'badge-muted')}">
                      ${m.status.toUpperCase()}
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Quick Stats Sidebar -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div class="card">
              <div class="card-header">
                <div class="card-title">Task Distribution</div>
              </div>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                  <span>To Do</span>
                  <strong>${projectTasks.filter(t => t.status === 'todo').length}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                  <span>In Progress</span>
                  <strong>${projectTasks.filter(t => t.status === 'inprogress').length}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                  <span>In Review</span>
                  <strong>${projectTasks.filter(t => t.status === 'review').length}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                  <span>Completed</span>
                  <strong style="color: var(--success);">${projectTasks.filter(t => t.status === 'completed').length}</strong>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <div class="card-title">Project Lead</div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div class="avatar avatar-md" style="background: ${window.store.getMemberById(project.ownerId).avatarBg}">
                  ${window.store.getMemberById(project.ownerId).initials}
                </div>
                <div>
                  <div style="font-weight: 700;">${window.store.getMemberById(project.ownerId).name}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${window.store.getMemberById(project.ownerId).role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'tasks') {
      mount.innerHTML = `<div id="projectKanbanMount"></div>`;
      const kanbanContainer = mount.querySelector('#projectKanbanMount');
      new KanbanBoardComponent(kanbanContainer, { projectId: project.id });
    } else if (this.activeTab === 'team') {
      mount.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
          ${members.map(m => `
            <div class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 24px;">
              <div class="avatar avatar-lg" style="background: ${m.avatarBg}; margin-bottom: 12px;">${m.initials}</div>
              <h3 style="font-size: 1.05rem; margin-bottom: 4px;">${m.name}</h3>
              <div style="font-size: 0.8rem; color: var(--primary); font-weight: 600; margin-bottom: 14px;">${m.role}</div>
              
              <div style="width: 100%; padding: 12px; background: var(--bg-surface); box-shadow: var(--shadow-inset-sm); border-radius: var(--radius-md); font-size: 0.8rem; display: flex; justify-content: space-around; margin-bottom: 16px;">
                <div>
                  <div style="font-weight: 800; font-size: 1.1rem;">${m.assignedTasks}</div>
                  <div style="color: var(--text-muted); font-size: 0.72rem;">Assigned</div>
                </div>
                <div style="border-left: 1px solid var(--divider);"></div>
                <div>
                  <div style="font-weight: 800; font-size: 1.1rem; color: var(--success);">${m.completedTasks}</div>
                  <div style="color: var(--text-muted); font-size: 0.72rem;">Done</div>
                </div>
              </div>

              <div style="display: flex; gap: 8px; width: 100%;">
                <button class="btn btn-default btn-sm w-full" onclick="window.appRouter.openDirectMessage('${m.id}')">Message</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (this.activeTab === 'files') {
      mount.innerHTML = `<div id="projectFilesMount"></div>`;
      const filesMount = mount.querySelector('#projectFilesMount');
      new FilesComponent(filesMount);
    } else if (this.activeTab === 'timeline') {
      mount.innerHTML = `
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Project Roadmap & Milestones</div>
              <div class="card-subtitle">Scheduled delivery gates and release goals</div>
            </div>
            <button class="btn btn-default btn-sm" onclick="window.modals.showToast('Milestone Added', 'New target milestone defined', 'success')">+ Add Milestone</button>
          </div>
          <div class="milestones-timeline" style="margin-top: 14px;">
            ${(project.milestones || []).map(m => `
              <div class="milestone-item">
                <div class="milestone-left">
                  <div class="milestone-status-icon ${m.status}">
                    ${m.status === 'completed' ? '✓' : (m.status === 'current' ? '▶' : '○')}
                  </div>
                  <div>
                    <div style="font-weight: 700; font-size: 0.95rem;">${m.title}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Target: ${m.date}</div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span class="badge ${m.status === 'completed' ? 'badge-success' : (m.status === 'current' ? 'badge-primary' : 'badge-muted')}">
                    ${m.status.toUpperCase()}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (this.activeTab === 'discussions') {
      mount.innerHTML = `
        <div class="discussion-feed">
          <div class="card">
            <h4 style="margin-bottom: 12px;">Start a New Discussion Thread</h4>
            <form id="projectDiscussionForm">
              <textarea class="neu-textarea" placeholder="Share updates, architecture questions, or blocker notes for ${project.name}..." style="margin-bottom: 12px;"></textarea>
              <div style="display: flex; justify-content: flex-end;">
                <button type="submit" class="btn btn-primary btn-sm">Post to Project</button>
              </div>
            </form>
          </div>

          <div class="discussion-post">
            <div class="discussion-post-header">
              <div class="discussion-author">
                <div class="avatar avatar-sm" style="background: ${owner.avatarBg}">${owner.initials}</div>
                <div>
                  <div style="font-weight: 700; font-size: 0.88rem;">${owner.name}</div>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">3 hours ago</div>
                </div>
              </div>
              <span class="badge badge-primary">Sprint Update</span>
            </div>
            <div class="discussion-content">
              Great progress on the sprint deliverables this week! The interactive component hierarchy has been validated. Let's make sure test suites pass before merging the API integration PRs.
            </div>
            <div class="discussion-actions">
              <button class="btn btn-ghost btn-sm" onclick="window.modals.showToast('Liked', 'You liked this update', 'info')">👍 4 Likes</button>
              <button class="btn btn-ghost btn-sm" onclick="window.modals.showToast('Reply', 'Reply box focused', 'info')">💬 2 Replies</button>
            </div>
          </div>
        </div>
      `;

      const discForm = mount.querySelector('#projectDiscussionForm');
      if (discForm) {
        discForm.addEventListener('submit', (e) => {
          e.preventDefault();
          window.modals.showToast('Discussion Posted', 'Your message was added to the project stream', 'success');
          discForm.reset();
        });
      }
    }
  }

  attachEvents() {
    this.container.querySelector('#projDetailBackBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.onBack) this.onBack();
    });

    this.container.querySelector('#projShareBtn')?.addEventListener('click', () => {
      window.modals.showToast('Link Copied', 'Shareable workspace URL copied to clipboard', 'info');
    });

    this.container.querySelector('#projNewTaskBtn')?.addEventListener('click', () => {
      window.modals.openCreateTaskModal('todo', this.currentProjectId);
    });

    this.container.querySelectorAll('.project-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.activeTab = tab;
        this.container.querySelectorAll('.project-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderCurrentTab();
      });
    });
  }
}

window.ProjectDetailView = ProjectDetailView;
