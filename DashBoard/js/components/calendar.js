/**
 * Interactive Calendar Component
 * Renders full month grid with task deadlines, project milestones, meetings, and date inspector
 */

class CalendarComponent {
  constructor(containerEl) {
    this.container = containerEl;
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.init();
  }

  init() {
    this.render();
    window.store.subscribe((event) => {
      if (['TASK_ADDED', 'TASK_UPDATED', 'TASK_DELETED'].includes(event)) {
        this.renderCalendarGrid();
      }
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="calendar-wrapper">
        <!-- Controls Bar -->
        <div class="calendar-controls">
          <div class="calendar-month-nav">
            <button class="btn btn-default btn-sm" id="calPrevMonthBtn" title="Previous Month">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div class="calendar-current-month" id="calCurrentMonthLabel"></div>
            <button class="btn btn-default btn-sm" id="calNextMonthBtn" title="Next Month">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
            <button class="btn btn-default btn-sm" id="calTodayBtn">Today</button>
          </div>

          <div class="calendar-legend">
            <div class="legend-item"><span class="legend-dot deadline"></span> Deadlines</div>
            <div class="legend-item"><span class="legend-dot milestone"></span> Milestones</div>
            <div class="legend-item"><span class="legend-dot meeting"></span> Meetings</div>
            <div class="legend-item"><span class="legend-dot event"></span> Events</div>
          </div>

          <button class="btn btn-primary btn-sm" id="calAddEventBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Event
          </button>
        </div>

        <!-- Layout Grid: Calendar on Left, Date Inspector on Right -->
        <div style="display: grid; grid-template-columns: 2.2fr 1fr; gap: 24px; align-items: start;">
          <div class="calendar-grid" id="calendarGridMount"></div>
          
          <!-- Selected Date Details Panel -->
          <div class="card" id="calSelectedDatePanel" style="position: sticky; top: 96px;">
            <div class="card-header">
              <div>
                <div class="card-title" id="selectedDateTitle">Activities</div>
                <div class="card-subtitle" id="selectedDateSubtitle">Scheduled for selected date</div>
              </div>
            </div>
            <div id="selectedDateActivitiesList" style="display: flex; flex-direction: column; gap: 12px; max-height: 480px; overflow-y: auto;">
              <!-- Populated on date click -->
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachControlsEvents();
    this.renderCalendarGrid();
    this.renderSelectedDateDetails();
  }

  renderCalendarGrid() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const label = this.container.querySelector('#calCurrentMonthLabel');
    if (label) {
      label.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(this.currentDate);
    }

    const gridMount = this.container.querySelector('#calendarGridMount');
    if (!gridMount) return;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let html = dayHeaders.map(d => `<div class="calendar-day-header">${d}</div>`).join('');

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = daysInPrevMonth - i;
      html += `
        <div class="calendar-cell other-month">
          <span class="cell-date-num">${prevDate}</span>
        </div>
      `;
    }

    // Days in current month
    const tasks = window.store.getTasks();
    const calendarEvents = window.store.getCalendarEvents();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = isCurrentMonth && today.getDate() === day;
      const isSelected = this.selectedDate.getFullYear() === year && 
                         this.selectedDate.getMonth() === month && 
                         this.selectedDate.getDate() === day;

      // Find events for this date
      const dateEvents = calendarEvents.filter(e => e.date === dateStr);
      const dateTasks = tasks.filter(t => t.dueDate === dateStr);

      html += `
        <div class="calendar-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" data-date="${dateStr}">
          <span class="cell-date-num">${day}</span>
          <div class="cell-events">
            ${dateTasks.map(t => `
              <div class="calendar-event-pill deadline" title="Task: ${t.title}">
                ${t.title}
              </div>
            `).join('')}
            ${dateEvents.map(e => `
              <div class="calendar-event-pill ${e.type}" title="${e.type}: ${e.title}">
                ${e.title}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    gridMount.innerHTML = html;

    // Attach cell click events
    gridMount.querySelectorAll('.calendar-cell[data-date]').forEach(cell => {
      cell.addEventListener('click', () => {
        const dateStr = cell.getAttribute('data-date');
        this.selectedDate = new Date(dateStr + 'T00:00:00');
        this.renderCalendarGrid();
        this.renderSelectedDateDetails();
      });
    });
  }

  renderSelectedDateDetails() {
    const titleEl = this.container.querySelector('#selectedDateTitle');
    const subtitleEl = this.container.querySelector('#selectedDateSubtitle');
    const listEl = this.container.querySelector('#selectedDateActivitiesList');

    if (!listEl) return;

    const formattedDate = this.selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
    const dateStr = this.selectedDate.toISOString().split('T')[0];

    if (titleEl) titleEl.textContent = this.selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (subtitleEl) subtitleEl.textContent = formattedDate;

    const tasks = window.store.getTasks().filter(t => t.dueDate === dateStr);
    const events = window.store.getCalendarEvents().filter(e => e.date === dateStr);

    if (tasks.length === 0 && events.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 32px 14px; color: var(--text-muted);">
          <div style="font-size: 1.5rem; margin-bottom: 8px;">🗓️</div>
          <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary); margin-bottom: 4px;">No activities scheduled</div>
          <p style="font-size: 0.8rem;">Click 'Add Event' above or create a task with this deadline.</p>
        </div>
      `;
      return;
    }

    let itemsHtml = '';

    // Tasks due
    tasks.forEach(t => {
      const project = window.store.getProjectById(t.projectId) || { name: 'Campus' };
      itemsHtml += `
        <div style="background: var(--bg-surface); border-radius: var(--radius-md); padding: 12px; box-shadow: var(--shadow-flat-sm); border-left: 4px solid var(--danger); cursor: pointer;" onclick="window.modals.openTaskDetailModal('${t.id}')">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span class="badge badge-danger">Task Deadline</span>
            <span class="priority-tag priority-${t.priority.toLowerCase()}">${t.priority}</span>
          </div>
          <div style="font-weight: 700; font-size: 0.9rem;">${t.title}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${project.name}</div>
        </div>
      `;
    });

    // Calendar events
    events.forEach(e => {
      const colors = {
        deadline: 'var(--danger)',
        milestone: 'var(--purple)',
        meeting: 'var(--secondary)',
        event: 'var(--success)'
      };

      itemsHtml += `
        <div style="background: var(--bg-surface); border-radius: var(--radius-md); padding: 12px; box-shadow: var(--shadow-flat-sm); border-left: 4px solid ${colors[e.type] || 'var(--primary)'};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span class="badge badge-primary" style="text-transform: capitalize;">${e.type}</span>
            <span style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted);">${e.time || 'All Day'}</span>
          </div>
          <div style="font-weight: 700; font-size: 0.9rem;">${e.title}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${e.project || 'General'}</div>
        </div>
      `;
    });

    listEl.innerHTML = itemsHtml;
  }

  attachControlsEvents() {
    this.container.querySelector('#calPrevMonthBtn')?.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderCalendarGrid();
    });

    this.container.querySelector('#calNextMonthBtn')?.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendarGrid();
    });

    this.container.querySelector('#calTodayBtn')?.addEventListener('click', () => {
      this.currentDate = new Date();
      this.selectedDate = new Date();
      this.renderCalendarGrid();
      this.renderSelectedDateDetails();
    });

    this.container.querySelector('#calAddEventBtn')?.addEventListener('click', () => {
      window.modals.openCreateTaskModal('todo');
    });
  }
}

window.CalendarComponent = CalendarComponent;
