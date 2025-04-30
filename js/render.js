function createCourse(course) {
    const div = document.createElement("div");
    div.className = "course";
    div.id = course.id;
    div.dataset.type = course.type;
    div.style.gridColumn = course.term;
    div.style.gridRow = course.row;
    // Add visual metric class
    if (course.metrics) {
      const { blocking, delay, complexity } = course.metrics;
      if (blocking >= 6) div.classList.add('high-blocking');
      else if (delay >= 4) div.classList.add('high-delay');
      else if (complexity >= 8) div.classList.add('high-complexity');
    }
  
    const shapeEl = document.createElement("div");
  
    shapeEl.className = "shape";
    shapeEl.textContent = course.units;
    
  
    const label = document.createElement("div");
    label.className = "label";
    label.innerHTML = course.label;
  
    div.appendChild(shapeEl);
    div.appendChild(label);
    return div;
  }

export function renderCourses(curriculum) {
    const grid = document.getElementById("curriculum");
    curriculum.forEach(course => {
      const el = createCourse(course);
      grid.appendChild(el);
    });  }
  
  export function renderArrows(curriculum,arrows) {
    const svg = document.getElementById('svg');
    const grid = document.getElementById('curriculum');
    const gridRect = grid.getBoundingClientRect();

    svg.setAttribute('width', grid.scrollWidth);
    svg.setAttribute('height', grid.scrollHeight);
    
    //Remove all existing arrows from the SVG
    svg.querySelectorAll('.arrow').forEach(e => e.remove()); 
    //Loop through arrow list and draw each one
    arrows.forEach(({ from, to }) => {drawArrow(from, to);});
    document.querySelectorAll('.course').forEach(course => {
    course.addEventListener('mouseenter', () => {
      highlightArrows(course.id); // highlight dependencies on hover
    });

    course.addEventListener('mouseleave', () => {
      clearHighlights(); // remove highlights when mouse leaves
    });

    course.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent body click from clearing popup
      showCourseInfo(course); // show info popup
    });
  });

  // Hide popup when clicking anywhere else
  document.addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
  });

    //Hide popup if you click anywhere else on the page
        document.addEventListener('click', () => {
        document.getElementById('popup').style.display = 'none';
        });
      }
      //Draws one curved SVG arrow between two course circles
      function drawArrow(fromId, toId) {
        const svg = document.getElementById('svg');
        const fromShape = document.querySelector(`#${fromId} .shape`);
        const toShape = document.querySelector(`#${toId} .shape`);
        
        if (!fromShape || !toShape) return;
      
        const svgRect = svg.getBoundingClientRect();
        const from = fromShape.getBoundingClientRect();
        const to = toShape.getBoundingClientRect();
      
        const startX = from.right - svgRect.left;
        const startY = from.top + from.height / 2 - svgRect.top;
        const endX = to.left - svgRect.left;
        const endY = to.top + to.height / 2 - svgRect.top;
      
        const dx = endX - startX;
        const curveX = Math.max(40, Math.min(dx / 2, 80));
        const curveY = 30;
      
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("class", "arrow");
        path.setAttribute("d", `M ${startX} ${startY} C ${startX + curveX} ${startY - curveY}, ${endX - curveX} ${endY - curveY}, ${endX} ${endY}`);
        path.dataset.from = fromId;
        path.dataset.to = toId;
      
        svg.appendChild(path);
      }
      

