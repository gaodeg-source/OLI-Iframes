(function () {
  'use strict';

  var KEY = 'oli_email';

  // Already registered — skip
  if (localStorage.getItem(KEY)) return;

  // ── Styles ────────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
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

  // ── Modal HTML ────────────────────────────────────────────────────────────
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

  // ── Logic ─────────────────────────────────────────────────────────────────
  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function submit() {
    var input = document.getElementById('oli-gate-email');
    var error = document.getElementById('oli-gate-error');
    var val = input.value.trim();
    if (!isValidEmail(val)) {
      error.style.display = 'block';
      input.focus();
      return;
    }
    localStorage.setItem(KEY, val);
    backdrop.remove();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(backdrop);

    document.getElementById('oli-gate-submit').addEventListener('click', submit);

    document.getElementById('oli-gate-email').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') submit();
    });

    document.getElementById('oli-gate-email').addEventListener('input', function () {
      document.getElementById('oli-gate-error').style.display = 'none';
    });

    // Auto-focus the input
    setTimeout(function () {
      var input = document.getElementById('oli-gate-email');
      if (input) input.focus();
    }, 50);
  });
}());
