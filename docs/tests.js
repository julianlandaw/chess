(function () {
  'use strict';
  const frame = document.querySelector('iframe');
  frame.addEventListener('load', () => {
    const results = frame.contentWindow.QuietKnight.runSelfTests();
    const failures = results.filter(result => !result.pass);
    const summary = document.getElementById('summary');
    summary.className = failures.length ? 'fail' : 'pass';
    summary.textContent = failures.length ? `${failures.length} of ${results.length} checks failed` : `All ${results.length} checks passed`;
    const list = document.getElementById('results');
    results.forEach(result => {
      const item = document.createElement('li');
      item.className = result.pass ? 'pass' : 'fail';
      item.textContent = `${result.pass ? 'PASS' : 'FAIL'} — ${result.name}${result.detail ? ` (${result.detail})` : ''}`;
      list.appendChild(item);
    });
    document.body.dataset.result = failures.length ? 'failed' : 'passed';
  });
}());
