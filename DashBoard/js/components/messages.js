/**
 * Interactive Team Messages & Communication Component
 * Supports Channels, Direct Messages, @ Mentions Autocomplete, and File Sharing
 */

class MessagesComponent {
  constructor(containerEl) {
    this.container = containerEl;
    this.activeChannel = 'general';
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();

    window.store.subscribe((event, payload) => {
      if (event === 'MESSAGE_ADDED') {
        this.renderMessages();
      }
    });
  }

  render() {
    const channels = [
      { id: 'general', name: 'general', desc: 'Company & team announcements' },
      { id: 'development', name: 'development', desc: 'Code commits, PRs, and infra' },
      { id: 'design', name: 'design', desc: 'Figma tokens, UI feedback, and specs' }
    ];

    const members = window.store.getMembers();

    this.container.innerHTML = `
      <div class="chat-container">
        <!-- Chat Channels Sidebar -->
        <div class="chat-sidebar">
          <div class="chat-search-wrap">
            <input type="text" class="neu-input" placeholder="Search discussions..." style="padding: 8px 14px; font-size: 0.82rem;" />
          </div>

          <div style="padding: 10px 14px 4px;">
            <button class="btn btn-primary btn-sm w-full" id="sidebarMessageTeamBtn" style="gap: 6px; box-shadow: var(--shadow-button-primary);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              Message to Team
            </button>
          </div>

          <div class="chat-channels-list">
            <div class="nav-section-title">Channels</div>
            ${channels.map(c => `
              <div class="chat-channel-item ${this.activeChannel === c.id ? 'active' : ''}" data-channel="${c.id}">
                <span class="channel-hash">#</span>
                <span>${c.name}</span>
                ${c.id === 'general' ? '<span class="chat-channel-unread"></span>' : ''}
              </div>
            `).join('')}

            <div class="nav-section-title" style="margin-top: 14px;">Direct Messages</div>
            ${members.map(m => `
              <div class="chat-channel-item ${this.activeChannel === 'dm-' + m.id ? 'active' : ''}" data-channel="dm-${m.id}">
                <div class="avatar avatar-sm" style="background: ${m.avatarBg}">${m.initials}</div>
                <span class="truncate" style="flex:1;">${m.name}</span>
                <span class="status-dot ${m.status}"></span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Main Chat Panel -->
        <div class="chat-main">
          <div class="chat-header">
            <div class="chat-header-title">
              <span class="channel-hash" style="font-size: 1.4rem; color: var(--primary);">#</span>
              <div>
                <h3 id="currentChannelTitle">${this.activeChannel}</h3>
                <div style="font-size: 0.75rem; color: var(--text-muted);" id="currentChannelDesc">Team discussion stream</div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 10px;">
              <button class="btn btn-primary btn-sm" id="headerMessageTeamBtn" style="gap: 6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                Message to Team
              </button>
              <button class="btn btn-default btn-sm" id="chatSearchHistoryBtn" title="Search history">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </div>
          </div>

          <!-- Messages Stream -->
          <div class="chat-messages-stream" id="chatMessagesStream">
            <!-- Messages rendered dynamically -->
          </div>

          <!-- Chat Input Bar -->
          <div class="chat-input-bar">
            <!-- Mention Autocomplete Popup -->
            <div class="mention-popup" id="mentionPopup">
              <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); padding: 4px 8px; text-transform: uppercase;">Mention Teammate</div>
              ${members.map(m => `
                <div class="mention-item" data-mention-name="${m.name}">
                  <div class="avatar avatar-sm" style="background: ${m.avatarBg}">${m.initials}</div>
                  <span class="truncate">${m.name}</span>
                </div>
              `).join('')}
            </div>

            <form id="chatMessageForm">
              <div class="chat-input-wrapper">
                <button type="button" class="btn-ghost" id="attachFileBtn" title="Attach file or code snippet" style="padding: 6px; color: var(--text-muted);">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                </button>

                <input type="text" id="chatInputField" class="chat-input-field" placeholder="Message #${this.activeChannel} (type @ to mention teammates)..." autocomplete="off" />

                <div class="chat-input-actions">
                  <button type="button" class="btn-ghost" id="quickEmojiBtn" title="Emoji" style="padding: 6px; font-size: 1.1rem;">
                    💡
                  </button>
                  <button type="submit" class="btn btn-primary btn-sm" style="border-radius: var(--radius-full); padding: 8px 14px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    this.renderMessages();
  }

  renderMessages() {
    const stream = this.container.querySelector('#chatMessagesStream');
    if (!stream) return;

    const messages = window.store.getMessages(this.activeChannel);
    const currentUser = window.store.getCurrentUser();

    if (messages.length === 0) {
      if (this.activeChannel.startsWith('dm-')) {
        const memberId = this.activeChannel.replace('dm-', '');
        const member = window.store.getMemberById(memberId);
        stream.innerHTML = `
          <div style="text-align: center; margin: auto; color: var(--text-muted); padding: 32px 16px;">
            <div class="avatar avatar-lg" style="background: ${member.avatarBg}; margin: 0 auto 12px; width: 64px; height: 64px; font-size: 1.4rem;">${member.initials}</div>
            <div style="font-weight: 800; font-size: 1.2rem; color: var(--text-primary); margin-bottom: 2px;">${member.name}</div>
            <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600; margin-bottom: 10px;">${member.role}</div>
            <p style="font-size: 0.88rem; max-width: 360px; margin: 0 auto; line-height: 1.5;">This is the beginning of your direct conversation with ${member.name}. Send a message below to start collaborating!</p>
          </div>
        `;
      } else {
        stream.innerHTML = `
          <div style="text-align: center; margin: auto; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 8px;">💬</div>
            <div style="font-weight: 700; color: var(--text-primary);">This is the start of #${this.activeChannel}</div>
            <p style="font-size: 0.85rem; margin-top: 4px;">Send a message or mention teammates using @ to begin collaborating.</p>
          </div>
        `;
      }
      return;
    }

    stream.innerHTML = messages.map(msg => {
      const sender = window.store.getMemberById(msg.userId);
      const isMe = msg.userId === currentUser.id;

      // Format @mentions
      const formattedText = msg.text.replace(/@([A-Za-z0-9 ]+)/g, '<span class="message-mention">@$1</span>');

      return `
        <div class="chat-message ${isMe ? 'is-me' : ''}">
          <div class="avatar avatar-sm" style="background: ${sender.avatarBg}">${sender.initials}</div>
          <div class="message-bubble">
            <div class="message-meta">
              <span class="message-author">${sender.name}</span>
              <span class="message-time">${msg.time}</span>
            </div>
            <div class="message-text">${formattedText}</div>
          </div>
        </div>
      `;
    }).join('');

    stream.scrollTop = stream.scrollHeight;
  }

  updateHeader() {
    const titleContainer = this.container.querySelector('.chat-header-title');
    const input = this.container.querySelector('#chatInputField');
    if (!titleContainer) return;

    if (this.activeChannel.startsWith('dm-')) {
      const memberId = this.activeChannel.replace('dm-', '');
      const member = window.store.getMemberById(memberId);
      titleContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="avatar avatar-sm" style="background: ${member.avatarBg}">${member.initials}</div>
          <div>
            <h3 id="currentChannelTitle" style="margin: 0; font-size: 1.05rem;">${member.name}</h3>
            <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;" id="currentChannelDesc">
              <span class="status-dot ${member.status}"></span>
              <span>${member.role} • ${member.status === 'online' ? 'Online Now' : (member.status === 'away' ? 'Away' : 'Offline')}</span>
            </div>
          </div>
        </div>
      `;
      if (input) input.placeholder = `Message ${member.name} (type @ to mention teammates)...`;
    } else {
      titleContainer.innerHTML = `
        <span class="channel-hash" style="font-size: 1.4rem; color: var(--primary);">#</span>
        <div>
          <h3 id="currentChannelTitle">#${this.activeChannel}</h3>
          <div style="font-size: 0.75rem; color: var(--text-muted);" id="currentChannelDesc">Team discussion stream</div>
        </div>
      `;
      if (input) input.placeholder = `Message #${this.activeChannel} (type @ to mention teammates)...`;
    }
  }

  openDirectMessage(memberId) {
    this.activeChannel = 'dm-' + memberId;
    this.container.querySelectorAll('.chat-channel-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-channel') === this.activeChannel);
    });
    this.updateHeader();
    this.renderMessages();
    const input = this.container.querySelector('#chatInputField');
    if (input) input.focus();
  }

  attachEvents() {
    // Channel switcher
    this.container.querySelectorAll('.chat-channel-item').forEach(item => {
      item.addEventListener('click', () => {
        const channel = item.getAttribute('data-channel');
        this.activeChannel = channel;

        this.container.querySelectorAll('.chat-channel-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');

        this.updateHeader();
        this.renderMessages();
      });
    });

    // Message submit
    const form = this.container.querySelector('#chatMessageForm');
    const input = this.container.querySelector('#chatInputField');
    const mentionPopup = this.container.querySelector('#mentionPopup');

    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
          window.store.addMessage(this.activeChannel, text);
          input.value = '';
          if (mentionPopup) mentionPopup.classList.remove('show');
        }
      });

      // Detect '@' for mention popup
      input.addEventListener('keyup', (e) => {
        const val = input.value;
        const lastWord = val.split(' ').pop();
        if (lastWord.startsWith('@')) {
          if (mentionPopup) mentionPopup.classList.add('show');
        } else {
          if (mentionPopup) mentionPopup.classList.remove('show');
        }
      });
    }

    // Mention Item click
    if (mentionPopup) {
      mentionPopup.querySelectorAll('.mention-item').forEach(mItem => {
        mItem.addEventListener('click', () => {
          const name = mItem.getAttribute('data-mention-name');
          const words = input.value.split(' ');
          words.pop(); // remove incomplete @word
          words.push(`@${name} `);
          input.value = words.join(' ');
          input.focus();
          mentionPopup.classList.remove('show');
        });
      });
    }

    // Attach file simulation
    this.container.querySelector('#attachFileBtn')?.addEventListener('click', () => {
      window.modals.showToast('Attachment Ready', 'Code snippet or file attached to your message draft', 'info');
      input.value += ' [Attachment: Sprint_Notes.pdf] ';
      input.focus();
    });

    // Quick emoji button
    this.container.querySelector('#quickEmojiBtn')?.addEventListener('click', () => {
      input.value += ' 🚀 ';
      input.focus();
    });

    // Message to Team Broadcast Triggers
    const openTeamMsg = () => {
      window.modals.openMessageTeamModal(this.activeChannel.startsWith('dm-') ? 'general' : this.activeChannel);
    };

    this.container.querySelector('#sidebarMessageTeamBtn')?.addEventListener('click', openTeamMsg);
    this.container.querySelector('#headerMessageTeamBtn')?.addEventListener('click', openTeamMsg);
  }
}

window.MessagesComponent = MessagesComponent;

