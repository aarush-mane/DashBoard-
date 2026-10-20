/**
 * Files & Documents Component
 * Grid & List views, File Preview Modal, Download, Upload simulation, and Deletion
 */

class FilesComponent {
  constructor(containerEl) {
    this.container = containerEl;
    this.viewMode = 'grid'; // 'grid' or 'list'
    this.searchQuery = '';
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();

    window.store.subscribe((event) => {
      if (['FILE_ADDED', 'FILE_DELETED'].includes(event)) {
        this.renderFiles();
      }
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="files-toolbar">
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <div class="input-container" style="width: 240px;">
            <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="filesSearchInput" class="neu-input" placeholder="Search files & documents..." style="padding-top:7px; padding-bottom:7px; font-size:0.85rem;" />
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <!-- View Toggle -->
          <div class="tab-nav" style="padding: 3px;">
            <button class="tab-btn ${this.viewMode === 'grid' ? 'active' : ''}" id="fileGridViewBtn" style="padding: 5px 12px; font-size: 0.8rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Grid
            </button>
            <button class="tab-btn ${this.viewMode === 'list' ? 'active' : ''}" id="fileListViewBtn" style="padding: 5px 12px; font-size: 0.8rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              List
            </button>
          </div>

          <button class="btn btn-primary btn-sm" id="uploadFileBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Upload File
          </button>
        </div>
      </div>

      <div id="filesMount"></div>
    `;

    this.renderFiles();
  }

  getFilteredFiles() {
    let files = window.store.getFiles();
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      files = files.filter(f => f.name.toLowerCase().includes(q) || f.uploadedBy.toLowerCase().includes(q));
    }
    return files;
  }

  renderFiles() {
    const mount = this.container.querySelector('#filesMount');
    if (!mount) return;

    const files = this.getFilteredFiles();

    if (files.length === 0) {
      mount.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path></svg>
          </div>
          <h3>No files found</h3>
          <p>No project documents match your search criteria. Upload files to share with the team.</p>
        </div>
      `;
      return;
    }

    if (this.viewMode === 'list') {
      this.renderTable(mount, files);
    } else {
      this.renderGrid(mount, files);
    }

    this.attachActionEvents(mount);
  }

  renderGrid(mount, files) {
    mount.innerHTML = `
      <div class="files-grid">
        ${files.map(f => `
          <div class="file-card" data-file-id="${f.id}">
            <div>
              <div class="file-icon-box ${f.type}">
                ${this.getFileIcon(f.type)}
              </div>
              <div class="file-name truncate" title="${f.name}">${f.name}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${f.size} • by ${f.uploadedBy}</div>
            </div>

            <div>
              <div class="file-meta-row">
                <span>${f.uploadDate}</span>
                <span class="badge badge-muted" style="text-transform: uppercase;">${f.type}</span>
              </div>
              <div class="file-actions-row">
                <button class="btn btn-default btn-sm w-full preview-file-btn" data-file-id="${f.id}">
                  Preview
                </button>
                <button class="btn btn-default btn-icon-only download-file-btn" data-file-id="${f.id}" title="Download">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </button>
                <button class="btn btn-ghost btn-icon-only delete-file-btn" data-file-id="${f.id}" title="Delete file" style="color: var(--danger);">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderTable(mount, files) {
    mount.innerHTML = `
      <div class="file-table-wrap">
        <table class="file-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Uploaded By</th>
              <th>Date</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${files.map(f => `
              <tr data-file-id="${f.id}">
                <td>
                  <div style="display: flex; align-items: center; gap: 10px; font-weight: 700;">
                    <span style="font-size: 1.1rem;">${this.getFileIcon(f.type)}</span>
                    <span class="truncate" style="max-width: 240px;">${f.name}</span>
                  </div>
                </td>
                <td><span class="badge badge-muted" style="text-transform: uppercase;">${f.type}</span></td>
                <td>${f.size}</td>
                <td>${f.uploadedBy}</td>
                <td>${f.uploadDate}</td>
                <td style="text-align: right;">
                  <button class="btn btn-default btn-sm preview-file-btn" data-file-id="${f.id}">Preview</button>
                  <button class="btn btn-ghost btn-sm download-file-btn" data-file-id="${f.id}">Download</button>
                  <button class="btn btn-ghost btn-sm delete-file-btn" data-file-id="${f.id}" style="color: var(--danger);">&times;</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  getFileIcon(type) {
    switch (type) {
      case 'figma': return '🎨';
      case 'pdf': return '📄';
      case 'code': return '💻';
      case 'zip': return '📦';
      case 'doc': return '📝';
      default: return '📁';
    }
  }

  attachActionEvents(mount) {
    mount.querySelectorAll('.preview-file-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const fileId = btn.getAttribute('data-file-id');
        window.modals.openFilePreviewModal(fileId);
      });
    });

    mount.querySelectorAll('.download-file-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const fileId = btn.getAttribute('data-file-id');
        const file = window.store.getFiles().find(f => f.id === fileId);
        window.modals.showToast('Download Started', `Downloading ${file?.name}`, 'success');
      });
    });

    mount.querySelectorAll('.delete-file-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const fileId = btn.getAttribute('data-file-id');
        window.store.deleteFile(fileId);
        window.modals.showToast('File Removed', 'The file was deleted from the project workspace', 'warning');
      });
    });
  }

  attachEvents() {
    // Search
    const searchInput = this.container.querySelector('#filesSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderFiles();
      });
    }

    // View toggles
    const gridBtn = this.container.querySelector('#fileGridViewBtn');
    const listBtn = this.container.querySelector('#fileListViewBtn');
    if (gridBtn && listBtn) {
      gridBtn.addEventListener('click', () => {
        this.viewMode = 'grid';
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        this.renderFiles();
      });

      listBtn.addEventListener('click', () => {
        this.viewMode = 'list';
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        this.renderFiles();
      });
    }

    // Upload File simulation
    this.container.querySelector('#uploadFileBtn')?.addEventListener('click', () => {
      const sampleNames = ['Sprint_Kickoff_Specs.pdf', 'Mobile_Wireframes_v3.fig', 'API_Endpoints_Test.json', 'Pitch_Deck_Final.pdf'];
      const chosen = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const type = chosen.split('.').pop() === 'fig' ? 'figma' : (chosen.split('.').pop() === 'json' ? 'code' : 'pdf');

      window.store.addFile({
        name: chosen,
        type: type,
        size: `${(Math.random() * 8 + 1).toFixed(1)} MB`
      });

      window.modals.showToast('File Uploaded', `"${chosen}" is now accessible to the team`, 'success');
    });
  }
}

window.FilesComponent = FilesComponent;
