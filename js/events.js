import { applyMetricHighlight } from './metrics.js';

export function setupInteractions(curriculum) {
  const arrows = curriculum.flatMap(course =>
    course.prereqs.map(pr => ({ from: pr, to: course.id }))
  );

  document.querySelectorAll('.course').forEach(course => {
    course.addEventListener('mouseenter', () => highlightArrows(course.id, curriculum, arrows));
    course.addEventListener('mouseleave', () => clearHighlights(curriculum));

    course.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent body click from closing the popup
      showCourseInfo(course, curriculum);
    });
  });

  document.addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
  });
}

function showCourseInfo(courseEl, curriculum) {
  const popup = document.getElementById('popup');
  const courseId = courseEl.id;
  const data = curriculum.find(c => c.id === courseId);
  if (!data) return;

  popup.innerHTML = `
    <strong>${data.label}</strong><br>
    <em>Type:</em> ${data.type}<br>
    <em>Units:</em> ${data.units}<br>
    ${data.metrics ? `
      <em>Blocking:</em> ${data.metrics.blocking}<br>
      <em>Delay:</em> ${data.metrics.delay}<br>
      <em>Complexity:</em> ${data.metrics.complexity}
    ` : ''}
  `;

  popup.style.display = 'block';

  // Calculate position relative to course element
  const rect = courseEl.getBoundingClientRect();
  popup.style.left = `${rect.left + window.scrollX + 60}px`;
  popup.style.top = `${rect.top + window.scrollY}px`;
}

function highlightArrows(courseId, curriculum, arrows) {
  const grid = document.getElementById('curriculum');
  grid.classList.add('dimmed');

  const direct = arrows.filter(a => a.from === courseId).map(a => a.to);
  const indirect = new Set();
  const prereqs = arrows.filter(a => a.to === courseId).map(a => a.from);

  const visited = new Set(direct);
  const queue = [...direct];
  while (queue.length) {
    const current = queue.shift();
    arrows.filter(a => a.from === current).forEach(a => {
      if (!visited.has(a.to)) {
        visited.add(a.to);
        indirect.add(a.to);
        queue.push(a.to);
      }
    });
  }

  document.querySelectorAll('.course').forEach(el => {
    el.classList.remove('active', 'direct-blocked', 'indirect-blocked', 'dependency', 'dimmed-triangle');
    const id = el.id;
    if (id === courseId) el.classList.add('active');
    if (direct.includes(id)) el.classList.add('direct-blocked');
    if (indirect.has(id) && !direct.includes(id)) el.classList.add('indirect-blocked');
    if (prereqs.includes(id)) el.classList.add('dependency');
    if (!direct.includes(id) && !indirect.has(id) && !prereqs.includes(id) && id !== courseId) {
      el.classList.add('dimmed-triangle');
    }
  });

  const mode = document.getElementById('metric-mode').value;
  applyMetricHighlight(curriculum, mode);

  document.querySelectorAll('.arrow').forEach(path => {
    path.classList.toggle('highlighted', path.dataset.from === courseId || path.dataset.to === courseId);
  });
}

function clearHighlights(curriculum) {
  const grid = document.getElementById('curriculum');
  grid.classList.remove('dimmed');

  document.querySelectorAll('.course').forEach(el =>
    el.classList.remove('active', 'direct-blocked', 'indirect-blocked', 'dependency', 'dimmed-triangle')
  );

  const mode = document.getElementById('metric-mode').value;
  applyMetricHighlight(curriculum, mode);

  document.querySelectorAll('.arrow').forEach(path =>
    path.classList.remove('highlighted')
  );
}
