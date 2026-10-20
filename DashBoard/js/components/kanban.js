/**
 * Interactive Drag-and-Drop Kanban Board Component
 * Supports HTML5 Drag & Drop, Filtering, Search, List/Board View Toggle, and Task Creation
 */

class KanbanBoardComponent {
  constructor(containerEl, options = {}) {
    this.container = containerEl;
    this.filterProject = options.projectId || 'all';
    this.filterPriority = 'all';
    this.searchQuery = '';
    this.currentViewMode = 'board'; // 'board' or 'list'
    this.draggedTaskId = null;

    this.init();
  }

  init() {
    this.render();
    this.attachEvents();

    // Subscribe to store events
    window.store.subscribe((event) => {
      if (['TASK_ADDED', 'TASK_UPDATED', 'TASK_MOVED', 'TASK_DELETED', 'COMMENT_ADDED'].includes(event)) {
        this.renderBoard();
      }
    });
  }

  render() {
    const projects = window.store.getProjects();

    this.container.innerHTML = `
      <div class="kanban-toolbar">
        <div class="kanban-filters">
          <div class="input-container" style="width: 220px;">
            <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="kanbanSearchInput" class="neu-input" placeholder="Filter tasks..." style="padding-top:7px; padding-bottom:7px; font-size:0.82rem;" />
          </div>

          <select id="kanbanPriorityFilter" class="neu-select" style="padding-top:7px; padding-bottom:7px; font-size:0.82rem; width: 140px;">
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select id="kanbanProjectFilter" class="neu-select" style="padding-top:7px; padding-bottom:7px; font-size:0.82rem; width: 170px;">
            <option value="all">All Projects</option>
            ${projects.map(p => `
              <option value="${p.id}" ${this.filterProject === p.id ? 'selected' : ''}>${p.name}</option>
            `).join('')}
          </select>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <!-- View Toggle (Board vs List) -->
          <div class="tab-nav" style="padding: 3px;">
            <button class="tab-btn ${this.currentViewMode === 'board' ? 'active' : ''}" id="boardViewBtn" style="padding: 5px 12px; font-size: 0.8rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><rect x="3" y="3" width="7" height="18"></rect><rect x="14" y="3" width="7" height="18"></rect></svg>
              Board
            </button>
            <button class="tab-btn ${this.currentViewMode === 'list' ? 'active' : ''}" id="listViewBtn" style="padding: 5px 12px; font-size: 0.8rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              List
            </button>
          </div>

          <button class="btn btn-primary btn-sm" id="kanbanAddTaskBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Task
          </button>
        </div>
      </div>

      <div id="kanbanBoardMount"></div>
    `;

    this.renderBoard();
  }

  getFilteredTasks() {
    let tasks = window.store.getTasks();

    if (this.filterProject !== 'all') {
      tasks = tasks.filter(t => t.projectId === this.filterProject);
    }

    if (this.filterPriority !== 'all') {
      tasks = tasks.filter(t => t.priority.toLowerCase() === this.filterPriority.toLowerCase());
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    return tasks;
  }

  renderBoard() {
    const mount = this.container.querySelector('#kanbanBoardMount');
    if (!mount) return;

    const tasks = this.getFilteredTasks();

    if (this.currentViewMode === 'list') {
      this.renderListView(mount, tasks);
    } else {
      this.renderKanbanColumns(mount, tasks);
    }
  }

  renderKanbanColumns(mount, tasks) {
    const columns = [
      { id: 'todo', title: 'To Do', colorClass: 'col-todo' },
      { id: 'inprogress', title: 'In Progress', colorClass: 'col-inprogress' },
      { id: 'review', title: 'Review', colorClass: 'col-review' },
      { id: 'completed', title: 'Completed', colorClass: 'col-completed' }
    ];

    mount.innerHTML = `
      <div class="kanban-board">
        ${columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return `
            <div class="kanban-col ${col.colorClass}" data-col-id="${col.id}">
              <div class="kanban-col-header">
                <div class="kanban-col-title">
                  <span class="kanban-col-indicator"></span>
                  <span>${col.title}</span>
                  <span class="kanban-col-count">${colTasks.length}</span>
                </div>
                <div class="kanban-col-actions">
                  <button class="btn-ghost btn-icon-only quick-add-col-btn" data-col-id="${col.id}" title="Add task to ${col.title}" style="width: 28px; height: 28px; padding: 4px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                </div>
              </div>

              <div class="kanban-task-list" data-status="${col.id}">
                ${colTasks.map(t => this.renderTaskCard(t)).join('')}
              </div>

              <button class="add-task-col-btn" data-col-id="${col.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Add Card
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    this.attachDragAndDropEvents(mount);
    this.attachCardClickEvents(mount);
  }

  renderTaskCard(task) {
    const project = window.store.getProjectById(task.projectId) || { name: 'Campus' };
    const assignee = window.store.getMemberById(task.assigneeId);
    const commentsCount = (task.comments || []).length;
    const attachmentsCount = task.attachmentsCount || 0;

    return `
      <div class="task-card" draggable="true" data-task-id="${task.id}">
        <div class="task-card-header">
          <span class="task-project-badge truncate" style="max-width: 140px;">${project.name}</span>
          <span class="priority-tag priority-${task.priority.toLowerCase()}">${task.priority}</span>
        </div>

        <div class="task-title">${task.title}</div>

        ${task.tags && task.tags.length ? `
          <div class="task-tags">
            ${task.tags.map(tag => `<span class="task-tag">${tag}</span>`).join('')}
          </div>
        ` : ''}

        <div class="task-card-footer">
          <div class="avatar avatar-sm" style="background: ${assignee.avatarBg}" title="Assigned to ${assignee.name}">
            ${assignee.initials}
          </div>

          <div class="task-meta">
            ${task.dueDate ? `
              <div class="task-due-date ${task.priority === 'Urgent' ? 'urgent' : ''}" title="Due Date">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                ${this.formatShortDate(task.dueDate)}
              </div>
            ` : ''}

            <div class="task-meta-item" title="${commentsCount} Comments">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span>${commentsCount}</span>
            </div>

            <div class="task-meta-item" title="${attachmentsCount} Attachments">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
              <span>${attachmentsCount}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderListView(mount, tasks) {
    if (tasks.length === 0) {
      mount.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <h3>No tasks matched your filter</h3>
          <p>Try adjusting your search query or reset the priority filters.</p>
        </div>
      `;
      return;
    }

    const statusPillColors = {
      todo: 'badge-muted',
      inprogress: 'badge-info',
      review: 'badge-warning',
      completed: 'badge-success'
    };

    mount.innerHTML = `
      <div class="task-list-view">
        ${tasks.map(t => {
          const project = window.store.getProjectById(t.projectId) || { name: 'Campus' };
          const assignee = window.store.getMemberById(t.assigneeId);

          return `
            <div class="task-list-item" data-task-id="${t.id}">
              <div class="task-list-left">
                <span class="badge ${statusPillColors[t.status] || 'badge-muted'}" style="text-transform: capitalize;">
                  ${t.status === 'inprogress' ? 'In Progress' : t.status}
                </span>
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem;">${t.title}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${project.name} • Due ${t.dueDate}</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 14px;">
                <span class="priority-tag priority-${t.priority.toLowerCase()}">${t.priority}</span>
                <div class="avatar avatar-sm" style="background: ${assignee.avatarBg}" title="${assignee.name}">${assignee.initials}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    mount.querySelectorAll('.task-list-item').forEach(item => {
      item.addEventListener('click', () => {
        const taskId = item.getAttribute('data-task-id');
        window.modals.openTaskDetailModal(taskId);
      });
    });
  }

  attachDragAndDropEvents(mount) {
    // Cards drag start / end
    mount.querySelectorAll('.task-card').forEach(card => {
      card.addEventListener('dragstart', (e) => {
        this.draggedTaskId = card.getAttribute('data-task-id');
        card.classList.add('dragging');
        e.dataTransfer.setData('text/plain', this.draggedTaskId);
        e.dataTransfer.effectAllowed = 'move';
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        this.draggedTaskId = null;
        mount.querySelectorAll('.kanban-col').forEach(col => col.classList.remove('drag-over'));
      });
    });

    // Columns drag over / leave / drop
    mount.querySelectorAll('.kanban-col').forEach(col => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        col.classList.add('drag-over');
      });

      col.addEventListener('dragleave', () => {
        col.classList.remove('drag-over');
      });

      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drag-over');
        const targetStatus = col.getAttribute('data-col-id');
        const taskId = e.dataTransfer.getData('text/plain') || this.draggedTaskId;

        if (taskId && targetStatus) {
          window.store.moveTask(taskId, targetStatus);
          window.modals.showToast('Task Moved', `Shifted to ${targetStatus}`, 'success');
        }
      });
    });
  }

  attachCardClickEvents(mount) {
    mount.querySelectorAll('.task-card').forEach(card => {
      card.addEventListener('click', () => {
        const taskId = card.getAttribute('data-task-id');
        window.modals.openTaskDetailModal(taskId);
      });
    });

    mount.querySelectorAll('.add-task-col-btn, .quick-add-col-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const colId = btn.getAttribute('data-col-id');
        window.modals.openCreateTaskModal(colId, this.filterProject !== 'all' ? this.filterProject : null);
      });
    });
  }

  attachEvents() {
    // Search input
    const searchInput = this.container.querySelector('#kanbanSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderBoard();
      });
    }

    // Priority filter
    const prioritySelect = this.container.querySelector('#kanbanPriorityFilter');
    if (prioritySelect) {
      prioritySelect.addEventListener('change', (e) => {
        this.filterPriority = e.target.value;
        this.renderBoard();
      });
    }

    // Project filter
    const projectSelect = this.container.querySelector('#kanbanProjectFilter');
    if (projectSelect) {
      projectSelect.addEventListener('change', (e) => {
        this.filterProject = e.target.value;
        this.renderBoard();
      });
    }

    // View toggle buttons
    const boardBtn = this.container.querySelector('#boardViewBtn');
    const listBtn = this.container.querySelector('#listViewBtn');
    if (boardBtn && listBtn) {
      boardBtn.addEventListener('click', () => {
        this.currentViewMode = 'board';
        boardBtn.classList.add('active');
        listBtn.classList.remove('active');
        this.renderBoard();
      });

      listBtn.addEventListener('click', () => {
        this.currentViewMode = 'list';
        listBtn.classList.add('active');
        boardBtn.classList.remove('active');
        this.renderBoard();
      });
    }

    // Top add task button
    const addTaskBtn = this.container.querySelector('#kanbanAddTaskBtn');
    if (addTaskBtn) {
      addTaskBtn.addEventListener('click', () => {
        window.modals.openCreateTaskModal('todo', this.filterProject !== 'all' ? this.filterProject : null);
      });
    }
  }

  formatShortDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  }
}

window.KanbanBoardComponent = KanbanBoardComponent;
