import { loadCurriculum } from './utils.js';
import { renderCourses, renderArrows } from './render.js';
import { setupInteractions } from './events.js';
import { setupMetricDropdown } from './metrics.js';

let curriculum = [];

loadCurriculum('data/curriculum.json').then(data => {
  curriculum = data;
  renderCourses(curriculum);
  const arrows = curriculum.flatMap(course => course.prereqs.map(pr => ({ from: pr, to: course.id })));
  renderArrows(curriculum,arrows);
  setupInteractions(curriculum);
  setupMetricDropdown(curriculum);
});
