(function () {
  'use strict';

  var KEY = 'oli_email';

  // ── Server endpoint ───────────────────────────────────────────────────────
  // After deploying backend/Code.gs as a Google Apps Script web app,
  // paste your deployment URL here:
  var API_URL = '';

  // ── Helpers ───────────────────────────────────────────────────────────────
  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function syncToServer(payload) {
    if (!API_URL) return;
    fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(function () {});
  }

  // ── Styles ────────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    /* ---- email header bar ---- */
    '#oli-email-bar {',
    '  width: 100%; background: white;',
    '  border-bottom: 1px solid #e2e8f0;',
    '  font-family: Inter, system-ui, sans-serif;',
    '  font-size: 13px; color: #555;',
    '}',
    '#oli-email-bar-inner {',
    '  display: flex; align-items: center; gap: 10px;',
    '  padding: 10px 20px;',
    '}',
    '#oli-bar-label { color: #888; font-size: 12px; flex-shrink: 0; }',
    '#oli-bar-display { font-weight: 600; color: #111; }',
    '#oli-bar-edit-btn {',
    '  background: none; border: 1px solid #d1d5db; border-radius: 5px;',
    '  padding: 3px 10px; font-size: 12px; font-weight: 600;',
    '  color: #555; cursor: pointer; font-family: inherit;',
    '  transition: border-color 0.15s, color 0.15s; margin-left: 6px;',
    '}',
    '#oli-bar-edit-btn:hover { border-color: #00329d; color: #00329d; }',
    '#oli-bar-edit-row {',
    '  display: none; align-items: center; gap: 8px;',
    '  padding: 8px 20px; border-top: 1px solid #f1f5f9;',
    '}',
    '#oli-bar-input {',
    '  padding: 7px 12px; border: 1.5px solid #d1d5db; border-radius: 7px;',
    '  font-size: 13px; font-family: Inter, system-ui, sans-serif;',
    '  color: #111; outline: none; width: 260px; max-width: 100%;',
    '  transition: border-color 0.15s;',
    '}',
    '#oli-bar-input:focus { border-color: #00329d; }',
    '#oli-bar-save {',
    '  background: #00329d; color: white; border: none; border-radius: 7px;',
    '  padding: 7px 16px; font-size: 13px; font-weight: 600;',
    '  font-family: inherit; cursor: pointer; transition: background 0.15s;',
    '}',
    '#oli-bar-save:hover { background: #002580; }',
    '#oli-bar-cancel {',
    '  background: none; border: 1px solid #d1d5db; border-radius: 7px;',
    '  padding: 7px 14px; font-size: 13px; font-weight: 600;',
    '  font-family: inherit; color: #555; cursor: pointer;',
    '  transition: border-color 0.15s; ',
    '}',
    '#oli-bar-cancel:hover { border-color: #888; }',
    '#oli-bar-edit-error {',
    '  font-size: 12px; color: #dc2626; display: none;',
    '}',
    /* ---- modal ---- */
    '#oli-gate-backdrop {',
    '  position: fixed; inset: 0; z-index: 9999;',
    '  background: rgba(10, 20, 50, 0.5);',
    '  display: flex; align-items: flex-start; justify-content: center;',
    '  padding: 48px 24px 24px;',
    '  backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);',
    '}',
    '#oli-gate-card {',
    '  background: white; border-radius: 16px;',
    '  padding: 36px 32px; max-width: 420px; width: 100%;',
    '  box-shadow: 0 8px 40px rgba(0,0,0,0.18);',
    '  font-family: Inter, system-ui, sans-serif;',
    '}',
    '#oli-gate-card .og-eyebrow {',
    '  font-size: 11px; font-weight: 700; color: #888;',
    '  letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;',
    '}',
    '#oli-gate-card .og-title {',
    '  font-size: 20px; font-weight: 700; color: #111;',
    '  margin-bottom: 8px; line-height: 1.3;',
    '}',
    '#oli-gate-card .og-desc {',
    '  font-size: 14px; color: #555; line-height: 1.65; margin-bottom: 24px;',
    '}',
    '#oli-gate-card label {',
    '  display: block; font-size: 12px; font-weight: 700;',
    '  color: #444; margin-bottom: 6px; letter-spacing: 0.3px;',
    '}',
    '#oli-gate-email {',
    '  width: 100%; padding: 10px 14px; box-sizing: border-box;',
    '  border: 1.5px solid #d1d5db; border-radius: 8px;',
    '  font-size: 14px; font-family: Inter, system-ui, sans-serif;',
    '  color: #111; outline: none; transition: border-color 0.15s;',
    '}',
    '#oli-gate-email:focus { border-color: #00329d; }',
    '#oli-gate-error {',
    '  font-size: 12px; color: #dc2626; margin-top: 6px; display: none;',
    '}',
    '#oli-gate-submit {',
    '  width: 100%; margin-top: 20px;',
    '  background: #00329d; color: white;',
    '  border: none; border-radius: 8px; padding: 12px 20px;',
    '  font-size: 14px; font-weight: 600;',
    '  font-family: Inter, system-ui, sans-serif;',
    '  cursor: pointer; transition: background 0.15s;',
    '}',
    '#oli-gate-submit:hover { background: #002580; }'
  ].join('\n');
  document.head.appendChild(style);

  // ── Email header bar ──────────────────────────────────────────────────────
  function showHeader(email) {
    if (window.OLI_EMAIL_HEADER_HIDDEN) return;

    var bar = document.createElement('div');
    bar.id = 'oli-email-bar';
    bar.innerHTML =
      '<div id="oli-email-bar-inner">' +
        '<span id="oli-bar-label">Signed in as</span>' +
        '<span id="oli-bar-display">' + email + '</span>' +
        '<button id="oli-bar-edit-btn">Edit</button>' +
      '</div>' +
      '<div id="oli-bar-edit-row">' +
        '<input type="email" id="oli-bar-input" autocomplete="email" spellcheck="false">' +
        '<button id="oli-bar-save">Save</button>' +
        '<button id="oli-bar-cancel">Cancel</button>' +
        '<span id="oli-bar-edit-error">Please enter a valid email address.</span>' +
      '</div>';

    document.body.insertBefore(bar, document.body.firstChild);

    var display   = document.getElementById('oli-bar-display');
    var editBtn   = document.getElementById('oli-bar-edit-btn');
    var editRow   = document.getElementById('oli-bar-edit-row');
    var input     = document.getElementById('oli-bar-input');
    var saveBtn   = document.getElementById('oli-bar-save');
    var cancelBtn = document.getElementById('oli-bar-cancel');
    var editError = document.getElementById('oli-bar-edit-error');

    function openEdit() {
      input.value = localStorage.getItem(KEY) || '';
      editRow.style.display = 'flex';
      editBtn.style.display = 'none';
      editError.style.display = 'none';
      input.focus();
      input.select();
    }

    function closeEdit() {
      editRow.style.display = 'none';
      editBtn.style.display = '';
    }

    function saveEdit() {
      var newEmail = input.value.trim();
      if (!isValidEmail(newEmail)) {
        editError.style.display = 'inline';
        input.focus();
        return;
      }
      var oldEmail = localStorage.getItem(KEY);
      localStorage.setItem(KEY, newEmail);
      display.textContent = newEmail;
      syncToServer({ action: 'update', oldEmail: oldEmail, email: newEmail });
      closeEdit();
    }

    editBtn.addEventListener('click', openEdit);
    cancelBtn.addEventListener('click', closeEdit);
    saveBtn.addEventListener('click', saveEdit);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') saveEdit();
      if (e.key === 'Escape') closeEdit();
    });
    input.addEventListener('input', function () {
      editError.style.display = 'none';
    });
  }

  // ── First-visit modal ─────────────────────────────────────────────────────
  function showModal() {
    var backdrop = document.createElement('div');
    backdrop.id = 'oli-gate-backdrop';

    var card = document.createElement('div');
    card.id = 'oli-gate-card';
    card.innerHTML =
      '<div class="og-eyebrow">Accounting Prework</div>' +
      '<div class="og-title">Welcome — let\'s get you set up</div>' +
      '<p class="og-desc">Enter the email address you used to register with OLI. We\'ll use it to link your progress to your course record.</p>' +
      '<label for="oli-gate-email">OLI Email Address</label>' +
      '<input type="email" id="oli-gate-email" placeholder="you@example.com" autocomplete="email" spellcheck="false">' +
      '<div id="oli-gate-error">Please enter a valid email address.</div>' +
      '<button id="oli-gate-submit">Continue</button>';
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);

    function submit() {
      var input = document.getElementById('oli-gate-email');
      var val = input.value.trim();
      if (!isValidEmail(val)) {
        document.getElementById('oli-gate-error').style.display = 'block';
        input.focus();
        return;
      }
      localStorage.setItem(KEY, val);
      syncToServer({ action: 'register', email: val });
      backdrop.remove();
      showHeader(val);
    }

    document.getElementById('oli-gate-submit').addEventListener('click', submit);
    document.getElementById('oli-gate-email').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') submit();
    });
    document.getElementById('oli-gate-email').addEventListener('input', function () {
      document.getElementById('oli-gate-error').style.display = 'none';
    });

    setTimeout(function () {
      var input = document.getElementById('oli-gate-email');
      if (input) input.focus();
    }, 50);
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    var email = localStorage.getItem(KEY);
    if (email) {
      showHeader(email);
    } else {
      showModal();
    }
  });

}());
