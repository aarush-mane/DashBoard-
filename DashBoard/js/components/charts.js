/**
 * Interactive SVG Charts for Project Analytics
 * Weekly Task Completion (Bar Chart with Tooltips),
 * Project Progress Comparison (Horizontal Bar Chart),
 * Team Workload Distribution (Radial / Donut Chart)
 */

class AnalyticsCharts {
  constructor(containerEl) {
    this.container = containerEl;
    this.init();
  }

  init() {
    this.render();
    window.store.subscribe((event) => {
      if (['TASK_ADDED', 'TASK_MOVED', 'TASK_DELETED', 'PROJECT_ADDED'].includes(event)) {
        this.render();
      }
    });
  }

  render() {
    const tasks = window.store.getTasks();
    const projects = window.store.getProjects();
    const members = window.store.getMembers();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const remainingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    this.container.innerHTML = `
      <!-- Top Metrics Row -->
      <div class="stats-grid" style="margin-bottom: 24px;">
        <div class="stat-card" style="--card-accent: var(--primary);">
          <div class="stat-card-header">
            <span class="stat-label">Project Completion</span>
            <div class="stat-trend positive">+14%</div>
          </div>
          <div class="stat-value">${completionRate}%</div>
          <div class="progress-track" style="margin-top: 10px;">
            <div class="progress-bar" style="width: ${completionRate}%;"></div>
          </div>
        </div>

        <div class="stat-card" style="--card-accent: var(--success);">
          <div class="stat-card-header">
            <span class="stat-label">Tasks Completed</span>
            <div class="stat-trend positive">On Track</div>
          </div>
          <div class="stat-value">${completedTasks}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 6px;">Out of ${totalTasks} total tasks</div>
        </div>

        <div class="stat-card" style="--card-accent: var(--warning);">
          <div class="stat-card-header">
            <span class="stat-label">Tasks Remaining</span>
            <div class="stat-trend negative">${remainingTasks} left</div>
          </div>
          <div class="stat-value">${remainingTasks}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 6px;">Active sprint items</div>
        </div>

        <div class="stat-card" style="--card-accent: var(--secondary);">
          <div class="stat-card-header">
            <span class="stat-label">Team Productivity</span>
            <div class="stat-trend positive">94.8%</div>
          </div>
          <div class="stat-value">94.8%</div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 6px;">High velocity index</div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 24px; margin-bottom: 28px;">
        <!-- Weekly Task Completion Chart -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Weekly Task Velocity</div>
              <div class="card-subtitle">Tasks completed per day this week</div>
            </div>
            <span class="badge badge-success">High Velocity</span>
          </div>
          <div id="weeklyVelocityChart" style="height: 220px; position: relative;">
            ${this.renderWeeklyBarChart()}
          </div>
        </div>

        <!-- Project Progress Comparison -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Project Progress</div>
              <div class="card-subtitle">Real-time completion milestone progress</div>
            </div>
            <span class="badge badge-primary">${projects.length} Active</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 16px; padding: 10px 0;">
            ${projects.map(p => `
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-weight: 700; font-size: 0.88rem;">${p.name}</span>
                  <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary);">${p.progress}%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-bar ${p.progress > 80 ? 'success' : ''}" style="width: ${p.progress}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Team Workload Distribution Card -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div>
            <div class="card-title">Team Workload Distribution</div>
            <div class="card-subtitle">Capacity allocation and sprint balance across members</div>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px;">
          ${members.map(m => `
            <div style="background: var(--bg-surface); padding: 14px; border-radius: var(--radius-md); box-shadow: var(--shadow-inset-sm); display: flex; align-items: center; gap: 12px;">
              <div class="avatar avatar-sm" style="background: ${m.avatarBg}">${m.initials}</div>
              <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="font-weight: 700; font-size: 0.84rem;">${m.name}</span>
                  <span style="font-size: 0.78rem; font-weight: 700; color: ${m.workload > 80 ? 'var(--danger)' : 'var(--text-muted)'};">${m.workload}%</span>
                </div>
                <div class="progress-track" style="height: 6px;">
                  <div class="progress-bar ${m.workload > 80 ? 'warning' : ''}" style="width: ${m.workload}%;"></div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Quick Export & Reports Download Action Bar -->
      <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-alt) 100%);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--bg-surface); box-shadow: var(--shadow-flat-sm); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: var(--primary);">
              📥
            </div>
            <div>
              <div style="font-weight: 700; font-size: 1rem; color: var(--text-primary);">Export & Download Workspace Reports</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Generate executive summaries, task CSV backlog exports, and team capacity audits</div>
            </div>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-default btn-sm" onclick="window.modals.downloadTasksCSV()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Tasks CSV
            </button>
            <button class="btn btn-default btn-sm" onclick="window.modals.downloadTeamCSV()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Team Workload CSV
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.modals.openDownloadReportsModal()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Download Full Report
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachTooltipEvents();
  }

  renderWeeklyBarChart() {
    const days = [
      { day: 'Mon', count: 6, goal: 8 },
      { day: 'Tue', count: 9, goal: 8 },
      { day: 'Wed', count: 12, goal: 8 },
      { day: 'Thu', count: 8, goal: 8 },
      { day: 'Fri', count: 14, goal: 8 },
      { day: 'Sat', count: 5, goal: 4 },
      { day: 'Sun', count: 4, goal: 4 }
    ];

    const maxCount = 16;
    const chartHeight = 160;

    return `
      <div style="display: flex; align-items: flex-end; justify-content: space-between; height: ${chartHeight}px; padding: 0 10px; border-bottom: 1px solid var(--divider);">
        ${days.map(d => {
          const barHeight = Math.round((d.count / maxCount) * (chartHeight - 30));
          return `
            <div class="chart-bar-group" style="display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; cursor: pointer;" data-tooltip="${d.day}: ${d.count} tasks completed">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted);">${d.count}</span>
              <div style="width: 28px; height: ${barHeight}px; background: linear-gradient(180deg, var(--primary) 0%, #6366f1 100%); border-radius: var(--radius-sm) var(--radius-sm) 0 0; box-shadow: var(--shadow-button-primary); transition: height 0.4s ease, transform 0.2s ease;"></div>
              <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-top: 4px;">${d.day}</span>
            </div>
          `;
        }).join('')}
      </div>
      <div style="display: flex; justify-content: space-between; padding-top: 8px; font-size: 0.72rem; color: var(--text-muted);">
        <span>Mon: Sprint start</span>
        <span>Fri: Weekly release</span>
        <span>Sun: Retrospective</span>
      </div>
    `;
  }

  attachTooltipEvents() {
    this.container.querySelectorAll('.chart-bar-group').forEach(group => {
      group.addEventListener('mouseenter', () => {
        const bar = group.querySelector('div');
        if (bar) bar.style.transform = 'scaleY(1.05)';
      });
      group.addEventListener('mouseleave', () => {
        const bar = group.querySelector('div');
        if (bar) bar.style.transform = 'scaleY(1)';
      });
    });
  }
}

window.AnalyticsCharts = AnalyticsCharts;
