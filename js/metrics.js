export function setupMetricDropdown(curriculum) {
  const select = document.getElementById('metric-mode');
  select.addEventListener('change', () => {
    applyMetricHighlight(curriculum, select.value);
  });
}

export function applyMetricHighlight(curriculum, mode) {
  document.querySelectorAll('.course').forEach(courseEl => {
    courseEl.classList.remove('high-blocking', 'high-delay', 'high-complexity');
    const data = curriculum.find(c => c.id === courseEl.id);
    if (!data?.metrics) return;

    if (mode === 'blocking' && data.metrics.blocking >= 6) {
      courseEl.classList.add('high-blocking');
    } else if (mode === 'delay' && data.metrics.delay >= 4) {
      courseEl.classList.add('high-delay');
    } else if (mode === 'complexity' && data.metrics.complexity >= 8) {
      courseEl.classList.add('high-complexity');
    }
  });
}
