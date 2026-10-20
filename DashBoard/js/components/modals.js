/**
 * Modals, Dialogs, Toast Notifications, and Search Overlay
 */

class ModalSystem {
  constructor() {
    this.overlay = null;
    this.toastContainer = null;
    this.init();
  }

  init() {
    // Create Modal Overlay Container
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.id = 'globalModalOverlay';
    document.body.appendChild(this.overlay);

    // Create Toast Container
    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'toast-container';
    document.body.appendChild(this.toastContainer);

    // Close on backdrop click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.closeModal();
      }
    });

    // Close on ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  closeModal() {
    this.overlay.classList.remove('active');
    setTimeout(() => {
      this.overlay.innerHTML = '';
    }, 200);
  }

  // --- TOAST NOTIFICATIONS ---
  showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
      success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
      warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
      <button class="btn-ghost" style="padding: 4px; color: var(--text-muted);">&times;</button>
    `;

    toast.querySelector('button').addEventListener('click', () => {
      toast.remove();
    });

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(30px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // --- CREATE TASK MODAL ---
  openCreateTaskModal(defaultStatus = 'todo', defaultProjectId = null) {
    const projects = window.store.getProjects();
    const members = window.store.getMembers();

    this.overlay.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"></path></svg>
            Create New Task
          </h3>
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
        </div>
        <form id="createTaskForm">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Task Title *</label>
              <input type="text" name="title" class="neu-input" placeholder="e.g. Design Authentication Flow" required autofocus />
            </div>

            <div class="form-group">
              <label class="form-label">Project</label>
              <select name="projectId" class="neu-select">
                ${projects.map(p => `
                  <option value="${p.id}" ${defaultProjectId === p.id ? 'selected' : ''}>${p.name}</option>
                `).join('')}
              </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label">Status</label>
                <select name="status" class="neu-select">
                  <option value="todo" ${defaultStatus === 'todo' ? 'selected' : ''}>To Do</option>
                  <option value="inprogress" ${defaultStatus === 'inprogress' ? 'selected' : ''}>In Progress</option>
                  <option value="review" ${defaultStatus === 'review' ? 'selected' : ''}>Review</option>
                  <option value="completed" ${defaultStatus === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Priority</label>
                <select name="priority" class="neu-select">
                  <option value="Low">Low</option>
                  <option value="Medium" selected>Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label">Assignee</label>
                <select name="assigneeId" class="neu-select">
                  ${members.map(m => `
                    <option value="${m.id}">${m.name} (${m.role})</option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Due Date</label>
                <input type="date" name="dueDate" class="neu-input" value="${new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]}" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Tags (comma separated)</label>
              <input type="text" name="tags" class="neu-input" placeholder="Frontend, UI/UX, Sprint-2" />
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea name="description" class="neu-textarea" placeholder="Detail the task objectives and acceptance criteria..."></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-default" id="modalCancelBtn">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Task</button>
          </div>
        </form>
      </div>
    `;

    this.overlay.classList.add('active');

    this.overlay.querySelector('#modalCloseBtn').addEventListener('click', () => this.closeModal());
    this.overlay.querySelector('#modalCancelBtn').addEventListener('click', () => this.closeModal());

    const form = this.overlay.querySelector('#createTaskForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const tags = (fd.get('tags') || '')
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      window.store.addTask({
        title: fd.get('title'),
        projectId: fd.get('projectId'),
        status: fd.get('status'),
        priority: fd.get('priority'),
        assigneeId: fd.get('assigneeId'),
        dueDate: fd.get('dueDate'),
        description: fd.get('description'),
        tags: tags.length ? tags : ['General']
      });

      this.closeModal();
      this.showToast('Task Created', `"${fd.get('title')}" added to ${fd.get('status')}`, 'success');
    });
  }

  // --- TASK DETAILS / EDIT MODAL ---
  openTaskDetailModal(taskId) {
    const task = window.store.getTasks().find(t => t.id === taskId);
    if (!task) return;

    const project = window.store.getProjectById(task.projectId) || { name: 'General' };
    const assignee = window.store.getMemberById(task.assigneeId);
    const members = window.store.getMembers();

    this.overlay.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-header">
          <div>
            <div style="font-size: 0.76rem; font-weight:700; color: var(--primary); text-transform: uppercase;">
              ${project.name}
            </div>
            <h3 class="modal-title" style="margin-top: 2px;">${task.title}</h3>
          </div>
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
        </div>

        <div class="modal-body">
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
            <!-- Left: Description, Tags, Comments -->
            <div>
              <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 8px;">Description</h4>
                <p style="font-size: 0.92rem; line-height: 1.6;">${task.description || 'No description provided.'}</p>
              </div>

              <div style="margin-bottom: 24px;">
                <h4 style="margin-bottom: 8px;">Tags</h4>
                <div class="task-tags">
                  ${(task.tags || []).map(t => `<span class="task-tag">${t}</span>`).join('')}
                </div>
              </div>

              <!-- Comments Section -->
              <div>
                <h4 style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
                  <span>Discussion & Comments</span>
                  <span class="badge badge-muted">${(task.comments || []).length}</span>
                </h4>

                <div class="task-comments-list" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
                  ${(task.comments || []).length === 0 
                    ? '<p style="font-size: 0.85rem; color: var(--text-muted);">No comments yet. Start the conversation below.</p>'
                    : (task.comments || []).map(c => {
                        const commenter = window.store.getMemberById(c.userId);
                        return `
                          <div style="display: flex; gap: 10px; background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); box-shadow: var(--shadow-inset-sm);">
                            <div class="avatar avatar-sm" style="background: ${commenter.avatarBg}">${commenter.initials}</div>
                            <div style="flex: 1;">
                              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                                <span style="font-weight: 700; font-size: 0.82rem;">${commenter.name}</span>
                                <span style="font-size: 0.72rem; color: var(--text-muted);">${c.time}</span>
                              </div>
                              <div style="font-size: 0.88rem; color: var(--text-primary);">${c.text}</div>
                            </div>
                          </div>
                        `;
                      }).join('')
                  }
                </div>

                <!-- Add Comment Input -->
                <form id="addCommentForm" style="display: flex; gap: 10px;">
                  <input type="text" id="commentTextInput" class="neu-input" placeholder="Write a comment or update..." style="flex:1;" required />
                  <button type="submit" class="btn btn-primary btn-sm">Post</button>
                </form>
              </div>
            </div>

            <!-- Right: Status, Priority, Assignee, Deadlines -->
            <div style="background: var(--bg-surface-alt); padding: 18px; border-radius: var(--radius-lg); box-shadow: var(--shadow-inset); display: flex; flex-direction: column; gap: 16px;">
              <div>
                <label class="form-label">Status</label>
                <select id="taskStatusSelect" class="neu-select">
                  <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To Do</option>
                  <option value="inprogress" ${task.status === 'inprogress' ? 'selected' : ''}>In Progress</option>
                  <option value="review" ${task.status === 'review' ? 'selected' : ''}>Review</option>
                  <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
              </div>

              <div>
                <label class="form-label">Priority</label>
                <select id="taskPrioritySelect" class="neu-select">
                  <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low</option>
                  <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                  <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High</option>
                  <option value="Urgent" ${task.priority === 'Urgent' ? 'selected' : ''}>Urgent</option>
                </select>
              </div>

              <div>
                <label class="form-label">Assignee</label>
                <select id="taskAssigneeSelect" class="neu-select">
                  ${members.map(m => `
                    <option value="${m.id}" ${task.assigneeId === m.id ? 'selected' : ''}>${m.name}</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label class="form-label">Due Date</label>
                <input type="date" id="taskDueDateInput" class="neu-input" value="${task.dueDate}" />
              </div>

              <div style="padding-top: 10px; border-top: 1px solid var(--divider);">
                <button type="button" class="btn btn-danger btn-sm w-full" id="deleteTaskBtn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-primary" id="saveTaskDetailsBtn">Done</button>
        </div>
      </div>
    `;

    this.overlay.classList.add('active');
    this.overlay.querySelector('#modalCloseBtn').addEventListener('click', () => this.closeModal());
    this.overlay.querySelector('#saveTaskDetailsBtn').addEventListener('click', () => this.closeModal());

    // Reactive Status/Priority changes
    this.overlay.querySelector('#taskStatusSelect').addEventListener('change', (e) => {
      window.store.moveTask(task.id, e.target.value);
      this.showToast('Status Updated', `Task moved to ${e.target.value}`, 'success');
    });

    this.overlay.querySelector('#taskPrioritySelect').addEventListener('change', (e) => {
      window.store.updateTask(task.id, { priority: e.target.value });
      this.showToast('Priority Updated', `Set to ${e.target.value}`, 'info');
    });

    this.overlay.querySelector('#taskAssigneeSelect').addEventListener('change', (e) => {
      window.store.updateTask(task.id, { assigneeId: e.target.value });
      this.showToast('Assignee Changed', `Reassigned task`, 'info');
    });

    this.overlay.querySelector('#taskDueDateInput').addEventListener('change', (e) => {
      window.store.updateTask(task.id, { dueDate: e.target.value });
      this.showToast('Deadline Updated', `Due date: ${e.target.value}`, 'info');
    });

    // Add Comment
    const commentForm = this.overlay.querySelector('#addCommentForm');
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = this.overlay.querySelector('#commentTextInput');
      if (input.value.trim()) {
        window.store.addTaskComment(task.id, input.value.trim());
        this.openTaskDetailModal(task.id); // re-render modal
        this.showToast('Comment Added', 'Your comment has been posted', 'success');
      }
    });

    // Delete Task
    this.overlay.querySelector('#deleteTaskBtn').addEventListener('click', () => {
      if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
        window.store.deleteTask(task.id);
        this.closeModal();
        this.showToast('Task Deleted', `"${task.title}" was removed`, 'warning');
      }
    });
  }

  // --- CREATE PROJECT MODAL ---
  openCreateProjectModal() {
    this.overlay.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            Create New Project
          </h3>
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
        </div>
        <form id="createProjectForm">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Project Name *</label>
              <input type="text" name="name" class="neu-input" placeholder="e.g. AI Workflow Engine" required autofocus />
            </div>

            <div class="form-group">
              <label class="form-label">Category</label>
              <input type="text" name="category" class="neu-input" placeholder="e.g. Machine Learning, Mobile App, Web App" required />
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea name="description" class="neu-textarea" placeholder="Summarize the core vision, objectives, and deliverables..."></textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label">Initial Status</label>
                <select name="status" class="neu-select">
                  <option value="Planning">Planning</option>
                  <option value="In Progress" selected>In Progress</option>
                  <option value="Review">Review</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Priority</label>
                <select name="priority" class="neu-select">
                  <option value="Medium">Medium</option>
                  <option value="High" selected>High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Target Completion Date</label>
              <input type="date" name="dueDate" class="neu-input" value="${new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]}" />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-default" id="modalCancelBtn">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Project</button>
          </div>
        </form>
      </div>
    `;

    this.overlay.classList.add('active');
    this.overlay.querySelector('#modalCloseBtn').addEventListener('click', () => this.closeModal());
    this.overlay.querySelector('#modalCancelBtn').addEventListener('click', () => this.closeModal());

    const form = this.overlay.querySelector('#createProjectForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const newProj = window.store.addProject({
        name: fd.get('name'),
        category: fd.get('category'),
        description: fd.get('description'),
        status: fd.get('status'),
        priority: fd.get('priority'),
        dueDate: fd.get('dueDate'),
        progress: 10
      });

      this.closeModal();
      this.showToast('Project Created', `"${newProj.name}" is now active!`, 'success');
    });
  }

  // --- INVITE MEMBER MODAL ---
  openInviteMemberModal() {
    this.overlay.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            Invite Team Member
          </h3>
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
        </div>
        <form id="inviteMemberForm">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" name="name" class="neu-input" placeholder="e.g. Maya Patel" required autofocus />
            </div>

            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" name="email" class="neu-input" placeholder="maya@studentstartup.org" required />
            </div>

            <div class="form-group">
              <label class="form-label">Role</label>
              <select name="role" class="neu-select">
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="AI/ML Developer">AI/ML Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Marketing Lead">Marketing Lead</option>
                <option value="QA / Test Engineer">QA / Test Engineer</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Key Skills (comma separated)</label>
              <input type="text" name="skills" class="neu-input" placeholder="React, Python, Figma, Tailwind" />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-default" id="modalCancelBtn">Cancel</button>
            <button type="submit" class="btn btn-primary">Send Invitation</button>
          </div>
        </form>
      </div>
    `;

    this.overlay.classList.add('active');
    this.overlay.querySelector('#modalCloseBtn').addEventListener('click', () => this.closeModal());
    this.overlay.querySelector('#modalCancelBtn').addEventListener('click', () => this.closeModal());

    const form = this.overlay.querySelector('#inviteMemberForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const skills = (fd.get('skills') || '')
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const newMember = window.store.addMember({
        name: fd.get('name'),
        email: fd.get('email'),
        role: fd.get('role'),
        skills: skills.length ? skills : ['Development']
      });

      this.closeModal();
      this.showToast('Invitation Sent', `${newMember.name} has joined the workspace!`, 'success');
    });
  }

  // --- ADD NOTE MODAL ---
  openAddNoteModal() {
    this.overlay.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            Add Quick Note
          </h3>
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
        </div>
        <form id="addNoteForm">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Note Title</label>
              <input type="text" name="title" class="neu-input" placeholder="e.g. Feedback from user test" required autofocus />
            </div>

            <div class="form-group">
              <label class="form-label">Content</label>
              <textarea name="content" class="neu-textarea" style="min-height: 140px;" placeholder="Capture key ideas, meeting action points, or scratchpad notes..." required></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-default" id="modalCancelBtn">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Note</button>
          </div>
        </form>
      </div>
    `;

    this.overlay.classList.add('active');
    this.overlay.querySelector('#modalCloseBtn').addEventListener('click', () => this.closeModal());
    this.overlay.querySelector('#modalCancelBtn').addEventListener('click', () => this.closeModal());

    const form = this.overlay.querySelector('#addNoteForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      window.store.addActivity(`${window.store.getCurrentUser().name} added note: "${fd.get('title')}"`, window.store.getCurrentUser().name, 'general');
      this.closeModal();
      this.showToast('Note Saved', 'Your note was recorded in the activity stream', 'success');
    });
  }

  // --- FILE PREVIEW MODAL ---
  openFilePreviewModal(fileId) {
    const file = window.store.getFiles().find(f => f.id === fileId);
    if (!file) return;

    this.overlay.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title" style="font-size: 1.05rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
            ${file.name}
          </h3>
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
        </div>

        <div class="modal-body" style="text-align: center; padding: 32px 24px;">
          <div class="file-icon-box ${file.type}" style="margin: 0 auto 16px; width: 72px; height: 72px; font-size: 2rem;">
            ${file.type.toUpperCase()}
          </div>
          <h4 style="margin-bottom: 6px;">${file.name}</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 24px;">
            Uploaded by ${file.uploadedBy} • ${file.uploadDate} • ${file.size}
          </p>

          <div style="background: var(--bg-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-inset); padding: 20px; font-family: monospace; font-size: 0.8rem; text-align: left; max-height: 180px; overflow-y: auto; color: var(--text-secondary);">
            // Preview content for ${file.name}<br/>
            // File verified with team integrity hash [SHA-256 OK]<br/>
            // Ready for distribution and staging environment deployment.<br/>
            // Last modified: ${file.uploadDate}
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-default" id="modalCloseAction">Close</button>
          <button type="button" class="btn btn-primary" id="downloadFileBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download File
          </button>
        </div>
      </div>
    `;

    this.overlay.classList.add('active');
    this.overlay.querySelector('#modalCloseBtn').addEventListener('click', () => this.closeModal());
    this.overlay.querySelector('#modalCloseAction').addEventListener('click', () => this.closeModal());

    this.overlay.querySelector('#downloadFileBtn').addEventListener('click', () => {
      this.showToast('Download Started', `Downloading ${file.name} (${file.size})`, 'success');
      this.closeModal();
    });
  }

  // --- GLOBAL SEARCH MODAL ---
  openSearchModal() {
    this.overlay.innerHTML = `
      <div class="modal-dialog search-modal-dialog">
        <div class="search-modal-input-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary);">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="liveSearchInput" class="search-modal-input" placeholder="Type to search tasks, projects, team members, files..." autofocus />
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
        </div>

        <div class="search-results-list" id="searchResultsContainer">
          <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
            Type a query to search across all projects, tasks, team members, and documents.
          </div>
        </div>
      </div>
    `;

    this.overlay.classList.add('active');
    const input = this.overlay.querySelector('#liveSearchInput');
    const resultsContainer = this.overlay.querySelector('#searchResultsContainer');
    this.overlay.querySelector('#modalCloseBtn').addEventListener('click', () => this.closeModal());

    input.focus();

    input.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      if (!q) {
        resultsContainer.innerHTML = `
          <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
            Type a query to search across all projects, tasks, team members, and documents.
          </div>
        `;
        return;
      }

      const results = window.store.searchAll(q);
      const totalResults = results.tasks.length + results.projects.length + results.members.length + results.files.length;

      if (totalResults === 0) {
        resultsContainer.innerHTML = `
          <div style="padding: 32px; text-align: center; color: var(--text-muted);">
            No matching items found for "<strong>${q}</strong>".
          </div>
        `;
        return;
      }

      let html = '';

      // Tasks
      if (results.tasks.length > 0) {
        html += `<div class="search-result-group-title">Tasks (${results.tasks.length})</div>`;
        results.tasks.forEach(t => {
          html += `
            <div class="search-result-item" data-type="task" data-id="${t.id}">
              <span class="badge badge-primary">Task</span>
              <div style="flex:1;">
                <div style="font-weight: 700;">${t.title}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${t.description ? t.description.substring(0, 60) + '...' : ''}</div>
              </div>
              <span class="priority-tag priority-${t.priority.toLowerCase()}">${t.priority}</span>
            </div>
          `;
        });
      }

      // Projects
      if (results.projects.length > 0) {
        html += `<div class="search-result-group-title">Projects (${results.projects.length})</div>`;
        results.projects.forEach(p => {
          html += `
            <div class="search-result-item" data-type="project" data-id="${p.id}">
              <span class="badge badge-success">Project</span>
              <div style="flex:1;">
                <div style="font-weight: 700;">${p.name}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${p.category} • ${p.progress}% completed</div>
              </div>
            </div>
          `;
        });
      }

      // Members
      if (results.members.length > 0) {
        html += `<div class="search-result-group-title">Team Members (${results.members.length})</div>`;
        results.members.forEach(m => {
          html += `
            <div class="search-result-item" data-type="member" data-id="${m.id}">
              <div class="avatar avatar-sm" style="background: ${m.avatarBg}">${m.initials}</div>
              <div style="flex:1;">
                <div style="font-weight: 700;">${m.name}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${m.role} • ${m.email}</div>
              </div>
            </div>
          `;
        });
      }

      // Files
      if (results.files.length > 0) {
        html += `<div class="search-result-group-title">Files (${results.files.length})</div>`;
        results.files.forEach(f => {
          html += `
            <div class="search-result-item" data-type="file" data-id="${f.id}">
              <span class="badge badge-info">File</span>
              <div style="flex:1;">
                <div style="font-weight: 700;">${f.name}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${f.size} • by ${f.uploadedBy}</div>
              </div>
            </div>
          `;
        });
      }

      resultsContainer.innerHTML = html;

      // Click handling on results
      resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const type = item.getAttribute('data-type');
          const id = item.getAttribute('data-id');
          this.closeModal();

          if (type === 'task') {
            this.openTaskDetailModal(id);
          } else if (type === 'project') {
            if (window.projectDetailView) window.projectDetailView.openProject(id);
          } else if (type === 'file') {
            this.openFilePreviewModal(id);
          } else if (type === 'member') {
            if (window.appRouter) window.appRouter.navigate('team');
          }
        });
      });
    });
  }

  // --- MESSAGE TO TEAM MODAL ---
  openMessageTeamModal(defaultChannel = 'general') {
    const members = window.store.getMembers();

    this.overlay.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-header">
          <h3 class="modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="color: var(--primary);"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            Message to Team
          </h3>
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
        </div>
        <form id="messageTeamForm">
          <div class="modal-body">
            <div style="background: rgba(79, 70, 229, 0.08); border: 1px solid rgba(79, 70, 229, 0.2); border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 1.4rem;">📢</span>
              <div style="font-size: 0.86rem; color: var(--text-primary);">
                <strong>Team Broadcast:</strong> This message will be sent to all team members, added to the communication stream, and notified across the workspace.
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Destination Channel / Audience</label>
                <select name="channel" id="teamMessageChannelSelect" class="neu-select">
                  <option value="general" ${defaultChannel === 'general' ? 'selected' : ''}>#general (All 7 Team Members)</option>
                  <option value="development" ${defaultChannel === 'development' ? 'selected' : ''}>#development (Engineering & Architecture)</option>
                  <option value="design" ${defaultChannel === 'design' ? 'selected' : ''}>#design (UI/UX & Design Systems)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Message Priority / Tag</label>
                <select name="priorityTag" class="neu-select">
                  <option value="📢 Announcement" selected>📢 Announcement</option>
                  <option value="🚀 Sprint Update">🚀 Sprint Update</option>
                  <option value="💬 General Discussion">💬 General Discussion</option>
                  <option value="⚠️ Urgent Notice">⚠️ Urgent Notice</option>
                  <option value="🎯 Milestone Reached">🎯 Milestone Reached</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Subject / Headline *</label>
              <input type="text" name="subject" class="neu-input" placeholder="e.g. Sprint 4 Retrospective & Release Review" required autofocus />
            </div>

            <div class="form-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label class="form-label" style="margin-bottom: 0;">Message Content *</label>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Quick mentions:</div>
              </div>

              <!-- Quick Mention Insertion Chips -->
              <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
                <button type="button" class="btn btn-default btn-sm mention-chip" data-mention="@all" style="padding: 3px 8px; font-size: 0.74rem;">@all</button>
                ${members.map(m => `
                  <button type="button" class="btn btn-default btn-sm mention-chip" data-mention="@${m.name}" style="padding: 3px 8px; font-size: 0.74rem;">@${m.name.split(' ')[0]}</button>
                `).join('')}
              </div>

              <textarea name="message" id="teamMessageTextArea" class="neu-textarea" style="min-height: 120px;" placeholder="Write your announcement or briefing to the team... Mention teammates using @ or click the chips above." required></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Attachment / Resource Link (Optional)</label>
              <div style="display: flex; gap: 10px;">
                <input type="text" name="attachment" class="neu-input" placeholder="e.g. Sprint_Backlog_Spec.pdf or GitHub PR #42" />
                <button type="button" class="btn btn-default btn-sm" id="attachRecentDocBtn" style="white-space:nowrap;">Attach File</button>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-default" id="modalCancelBtn">Cancel</button>
            <button type="submit" class="btn btn-primary" id="sendMessageSubmitBtn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              Send Message to Team
            </button>
          </div>
        </form>
      </div>
    `;

    this.overlay.classList.add('active');
    this.overlay.querySelector('#modalCloseBtn').addEventListener('click', () => this.closeModal());
    this.overlay.querySelector('#modalCancelBtn').addEventListener('click', () => this.closeModal());

    const textArea = this.overlay.querySelector('#teamMessageTextArea');

    // Quick mention chip clicks
    this.overlay.querySelectorAll('.mention-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const mention = chip.getAttribute('data-mention');
        textArea.value = (textArea.value ? textArea.value + ' ' : '') + mention + ' ';
        textArea.focus();
      });
    });

    // Attach recent file helper
    this.overlay.querySelector('#attachRecentDocBtn').addEventListener('click', () => {
      const attachInput = this.overlay.querySelector('input[name="attachment"]');
      attachInput.value = 'Design_System_v2.fig (24.8 MB)';
      this.showToast('Attachment Added', 'Attached Design_System_v2.fig to your broadcast', 'info');
    });

    const form = this.overlay.querySelector('#messageTeamForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const channel = fd.get('channel') || 'general';
      const priorityTag = fd.get('priorityTag') || '📢 Announcement';
      const subject = fd.get('subject') || '';
      const messageBody = fd.get('message') || '';
      const attachment = fd.get('attachment') || '';

      let fullText = `[${priorityTag}] **${subject}**\n${messageBody}`;
      if (attachment) {
        fullText += `\n📎 Attachment: ${attachment}`;
      }

      // Add to messages in store
      window.store.addMessage(channel, fullText);

      // Add to activity stream
      window.store.addActivity(
        `${window.store.getCurrentUser().name} broadcasted message to #${channel}: "${subject}"`,
        window.store.getCurrentUser().name,
        'message'
      );

      this.closeModal();
      this.showToast('Message Broadcasted!', `Your message was delivered to #${channel}`, 'success');

      // Navigate to Messages view so user sees it right away
      if (window.appRouter) {
        window.appRouter.navigate('messages');
        const channelItem = document.querySelector(`.chat-channel-item[data-channel="${channel}"]`);
        if (channelItem) channelItem.click();
      }
    });
  }

  // --- DOWNLOAD REPORTS MODAL ---
  openDownloadReportsModal() {
    const tasks = window.store.getTasks();
    const projects = window.store.getProjects();
    const members = window.store.getMembers();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    this.overlay.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-header">
          <h3 class="modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="color: var(--primary);"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download & Export Reports
          </h3>
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
        </div>

        <div class="modal-body">
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 20px;">
            Export current sprint analytics, project status benchmarks, and member capacity records to CSV, PDF, or structured JSON.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; margin-bottom: 24px;">
            <!-- Report Card 1: Executive Summary -->
            <div class="card" style="padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-size: 1.5rem;">📊</span>
                  <span class="badge badge-primary">HTML / PDF</span>
                </div>
                <h4 style="margin-bottom: 4px;">Executive Sprint Summary</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 14px;">
                  Complete formatted performance report with completion rates (${completionRate}%), KPI velocity, and milestone targets.
                </p>
              </div>
              <button class="btn btn-primary btn-sm w-full" id="exportSummaryPdfBtn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Executive Report
              </button>
            </div>

            <!-- Report Card 2: Tasks CSV -->
            <div class="card" style="padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-size: 1.5rem;">📑</span>
                  <span class="badge badge-success">CSV Spreadsheet</span>
                </div>
                <h4 style="margin-bottom: 4px;">Tasks & Backlog Export</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 14px;">
                  Full itemized list of ${totalTasks} tasks with statuses, assignees, deadlines, and priority rankings.
                </p>
              </div>
              <button class="btn btn-default btn-sm w-full" id="exportTasksCsvBtn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Tasks CSV
              </button>
            </div>

            <!-- Report Card 3: Team Workload CSV -->
            <div class="card" style="padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-size: 1.5rem;">👥</span>
                  <span class="badge badge-info">CSV Spreadsheet</span>
                </div>
                <h4 style="margin-bottom: 4px;">Team Productivity Report</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 14px;">
                  Member breakdown with assigned vs. completed tasks, workload metrics, and roles across ${members.length} teammates.
                </p>
              </div>
              <button class="btn btn-default btn-sm w-full" id="exportTeamCsvBtn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Team CSV
              </button>
            </div>

            <!-- Report Card 4: JSON Backup -->
            <div class="card" style="padding: 18px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-size: 1.5rem;">💾</span>
                  <span class="badge badge-warning">Raw JSON</span>
                </div>
                <h4 style="margin-bottom: 4px;">Full Workspace Raw Data</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 14px;">
                  Complete programmatic export of projects, tasks, milestones, and audit activities for data integration.
                </p>
              </div>
              <button class="btn btn-default btn-sm w-full" id="exportFullJsonBtn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Full JSON
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-default" id="modalCloseAction">Close</button>
        </div>
      </div>
    `;

    this.overlay.classList.add('active');
    this.overlay.querySelector('#modalCloseBtn').addEventListener('click', () => this.closeModal());
    this.overlay.querySelector('#modalCloseAction').addEventListener('click', () => this.closeModal());

    // Event handlers for downloads
    this.overlay.querySelector('#exportTasksCsvBtn').addEventListener('click', () => {
      this.downloadTasksCSV();
    });

    this.overlay.querySelector('#exportTeamCsvBtn').addEventListener('click', () => {
      this.downloadTeamCSV();
    });

    this.overlay.querySelector('#exportSummaryPdfBtn').addEventListener('click', () => {
      this.downloadExecutiveSummary();
    });

    this.overlay.querySelector('#exportFullJsonBtn').addEventListener('click', () => {
      this.downloadFullJSON();
    });
  }

  // --- REPORT EXPORT HELPERS ---
  downloadBlob(content, filename, contentType = 'text/csv;charset=utf-8;') {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.showToast('Download Complete', `File "${filename}" saved successfully`, 'success');
  }

  downloadTasksCSV() {
    const tasks = window.store.getTasks();
    let csv = 'Task ID,Title,Project,Status,Priority,Assignee,Due Date,Tags\n';
    tasks.forEach(t => {
      const proj = window.store.getProjectById(t.projectId) || { name: 'General' };
      const assignee = window.store.getMemberById(t.assigneeId);
      const tagsStr = (t.tags || []).join('; ');
      csv += `"${t.id}","${t.title.replace(/"/g, '""')}","${proj.name}","${t.status}","${t.priority}","${assignee.name}","${t.dueDate}","${tagsStr}"\n`;
    });
    this.downloadBlob(csv, `pulseflow_tasks_report_${new Date().toISOString().split('T')[0]}.csv`);
  }

  downloadTeamCSV() {
    const members = window.store.getMembers();
    let csv = 'Member ID,Name,Role,Email,Status,Assigned Tasks,Completed Tasks,Workload Percentage,Key Skills\n';
    members.forEach(m => {
      const skillsStr = (m.skills || []).join('; ');
      csv += `"${m.id}","${m.name}","${m.role}","${m.email}","${m.status}",${m.assignedTasks},${m.completedTasks},"${m.workload}%","${skillsStr}"\n`;
    });
    this.downloadBlob(csv, `pulseflow_team_productivity_${new Date().toISOString().split('T')[0]}.csv`);
  }

  downloadFullJSON() {
    const state = window.store.getState();
    const jsonStr = JSON.stringify(state, null, 2);
    this.downloadBlob(jsonStr, `pulseflow_workspace_backup_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  }

  downloadExecutiveSummary() {
    const tasks = window.store.getTasks();
    const projects = window.store.getProjects();
    const members = window.store.getMembers();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const remainingTasks = totalTasks - completedTasks;
    const rate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>PulseFlow Executive Sprint Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e293b; max-width: 900px; margin: 0 auto; line-height: 1.5; }
    h1 { color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 8px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
    .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; }
    .kpi-val { font-size: 24px; font-weight: bold; color: #4f46e5; }
    .kpi-lbl { font-size: 12px; color: #64748b; text-transform: uppercase; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #e2e8f0; padding: 10px 14px; text-align: left; font-size: 13px; }
    th { background: #f1f5f9; font-weight: 600; }
    .badge { padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; display: inline-block; }
    .badge-done { background: #dcfce7; color: #15803d; }
    .badge-prog { background: #e0e7ff; color: #4338ca; }
    .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <h1>PulseFlow Executive Sprint Performance Report</h1>
  <p>Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • Workspace Lead: Aarush Mane</p>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-val">${rate}%</div>
      <div class="kpi-lbl">Completion Rate</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val">${completedTasks}</div>
      <div class="kpi-lbl">Tasks Done</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val">${remainingTasks}</div>
      <div class="kpi-lbl">Tasks Remaining</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val">${members.length}</div>
      <div class="kpi-lbl">Active Members</div>
    </div>
  </div>

  <h2>Active Projects Status</h2>
  <table>
    <thead>
      <tr>
        <th>Project Name</th>
        <th>Category</th>
        <th>Status</th>
        <th>Progress</th>
        <th>Target Due Date</th>
      </tr>
    </thead>
    <tbody>
      ${projects.map(p => `
        <tr>
          <td><strong>${p.name}</strong></td>
          <td>${p.category}</td>
          <td><span class="badge ${p.progress > 70 ? 'badge-done' : 'badge-prog'}">${p.status}</span></td>
          <td>${p.progress}%</td>
          <td>${p.dueDate}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2 style="margin-top: 32px;">Sprint Task Matrix</h2>
  <table>
    <thead>
      <tr>
        <th>Task Title</th>
        <th>Status</th>
        <th>Priority</th>
        <th>Assignee</th>
        <th>Due Date</th>
      </tr>
    </thead>
    <tbody>
      ${tasks.map(t => `
        <tr>
          <td><strong>${t.title}</strong></td>
          <td>${t.status.toUpperCase()}</td>
          <td>${t.priority}</td>
          <td>${window.store.getMemberById(t.assigneeId).name}</td>
          <td>${t.dueDate}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    PulseFlow Team Project Hub • Confidential & Proprietary Report • Generated automatically
  </div>
</body>
</html>`;

    this.downloadBlob(htmlContent, `pulseflow_executive_report_${new Date().toISOString().split('T')[0]}.html`, 'text/html');
  }
}

window.modals = new ModalSystem();

