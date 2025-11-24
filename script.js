document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const projectDetails = document.querySelectorAll(".project-detail");
  const backButtons = document.querySelectorAll(".back-button");
  const projectsShell = document.querySelector(".projects-shell");
  const projectCards = document.querySelectorAll(".project");
  const detailPanel = document.querySelector(".project-detail-panel");
  let lastScrollY = 0;

  // IDs for pages that should NOT be in the scroll sequence
  const STATIC_IDS = ["project-detail-100", "project-detail-101"];

  // Overlay images config (unchanged, in case you re-enable later)
  const hoverImagesByProject = {
    1: [
      'assets/FieldDay/FieldDay_2.png',
      'assets/FieldDay/FieldDay_3.png',
      'assets/FieldDay/FieldDay_5.png',
      'assets/FieldDay/FieldDay_7.png',
      'assets/FieldDay/FieldDay_4.png'
    ],
    2: [
      'assets/hover2-1.png',
      'assets/hover2-2.png',
      'assets/hover2-3.png',
      'assets/hover2-4.png',
      'assets/hover2-5.png'
    ],
    3: [
      'assets/hover3-1.png',
      'assets/hover3-2.png',
      'assets/hover3-3.png',
      'assets/hover3-4.png',
      'assets/hover3-5.png'
    ],
    4: [
      'assets/hover4-1.png',
      'assets/hover4-2.png',
      'assets/hover4-3.png',
      'assets/hover4-4.png',
      'assets/hover4-5.png'
    ],
    5: [
      'assets/hover5-1.png',
      'assets/hover5-2.png',
      'assets/hover5-3.png',
      'assets/hover5-4.png',
      'assets/hover5-5.png'
    ],
    6: [
      'assets/hover6-1.png',
      'assets/hover6-2.png',
      'assets/hover6-3.png',
      'assets/hover6-4.png',
      'assets/hover6-5.png'
    ]
  };

  const outsideElements = Array.from(document.body.children).filter(el => el !== gallery);

  function createOverlayImages(projectId) {
    const images = hoverImagesByProject[projectId] || [];
    const positions = [];
    const imgWidth = 150;
    const imgHeight = 150;

    images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.classList.add('overlay-image');

      let x, y;
      let attempts = 0;

      do {
        x = Math.random() * (window.innerWidth - imgWidth - 20) + 10;
        y = Math.random() * (window.innerHeight - imgHeight - 20) + 10;
        attempts++;
      } while (
        positions.some(pos => Math.hypot(pos.x - x, pos.y - y) < 200) && attempts < 20
      );

      positions.push({ x, y });
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;

      document.body.appendChild(img);
    });
  }

  function removeOverlayImages() {
    document.querySelectorAll('.overlay-image').forEach(img => img.remove());
  }

  // ------------- ACTIVE BAR HELPER -------------

  function setActiveBar(projectId) {
    projectCards.forEach(card => {
      const isActive = projectId && card.dataset.project === projectId;
      card.classList.toggle("active-project", isActive);
    });
  }

  // ------------- PREPARE DATASET ON SECTIONS -------------

  projectDetails.forEach(section => {
    const match = section.id.match(/project-detail-(.+)/);
    if (match) {
      section.dataset.project = match[1]; // "1", "2", "100", "101", ...
    }
  });

  // Only the "real" project pages belong to the scroll mode
  const scrollProjectDetails = Array.from(projectDetails).filter(
    section => !STATIC_IDS.includes(section.id)
  );

  

  // ------------- CLICK HANDLER (MENU + BARS) -------------

  document.addEventListener("click", (e) => {
    const projectEl = e.target.closest(".project, li[data-project], .project-link");
    if (!projectEl) return;

    const projectId = projectEl.dataset.project;
    if (!projectId) return;

    // remember where we were on the landing page
    lastScrollY = window.scrollY;

    const detailToShow = document.getElementById(`project-detail-${projectId}`);
    if (!detailToShow) return;

    // Reset layout classes first
    if (projectsShell) {
      projectsShell.classList.remove("detail-open-split", "detail-open-classic");
    }

    // ---- CV / About → SIDE PANEL, BUT NOT IN SCROLL ----
if (STATIC_IDS.includes(detailToShow.id)) {
  // Hide all other detail sections, show only CV / About
  projectDetails.forEach(section => section.classList.add("hidden"));
  detailToShow.classList.remove("hidden");

  // No active bar highlight (since there's no matching project bar)
  setActiveBar(null);

  // Use the SPLIT layout: bars on the left, detail panel on the right
  if (projectsShell) {
    projectsShell.classList.remove("detail-open-classic");
    projectsShell.classList.add("detail-open-split");
  }

  // Keep gallery visible on the left
  if (gallery) {
    gallery.classList.remove("hidden");
  }

  // Make sure the side panel is scrolled to the top
  if (detailPanel) {
    detailPanel.scrollTop = 0;
  }

  // Do not scroll the whole page
  return;
}


    // ---- SCROLL MODE (REAL PROJECTS) ----

    // Highlight bar for this project
    setActiveBar(projectId);

    // Show ONLY the scrollable project pages, hide CV/About
    projectDetails.forEach(section => {
      if (STATIC_IDS.includes(section.id)) {
        section.classList.add("hidden");
      } else {
        section.classList.remove("hidden");
      }
    });

    // Always show gallery in split mode
    if (gallery) {
      gallery.classList.remove("hidden");
    }

    // Enable split (bars left, scrollable detail right)
    if (projectsShell) {
      projectsShell.classList.add("detail-open-split");
      // Freeze bar animations so layout height doesn't shift during scroll
projectsShell.classList.add("freeze-heights");

    }

    // Scroll inside the detail panel to the project (no page jump)
if (detailPanel && detailPanel.contains(detailToShow)) {

  // Hide panel to prevent any flash of wrong content
  detailPanel.classList.add("detail-panel-hidden");

  // Delay scroll until layout is stable (bars collapsed)
  setTimeout(() => {

    const panelRect = detailPanel.getBoundingClientRect();
    const targetRect = detailToShow.getBoundingClientRect();

    const offsetWithinPanel =
      detailPanel.scrollTop + (targetRect.top - panelRect.top);

    // Set the scroll *instantly* to the correct position while hidden
    detailPanel.scrollTop = offsetWithinPanel;

    // Now reveal panel and start smooth scroll (optional)
    detailPanel.classList.remove("detail-panel-hidden");

    // If you want immediate jump:
    // (remove this block)
    detailPanel.scrollTo({
      top: offsetWithinPanel,
      behavior: "smooth"
    });

  }, 400);
}





  });

  // ------------- BACK BUTTONS: RETURN TO LANDING -------------

  backButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Hide all details again (back to landing)
      projectDetails.forEach(section => section.classList.add('hidden'));

      if (gallery) {
        gallery.classList.remove('hidden');
      }

      if (projectsShell) {
        projectsShell.classList.remove("detail-open-split", "detail-open-classic");
      }

      // remove the active highlight
      projectCards.forEach(card => card.classList.remove("active-project"));

      // go back to where we were on the landing page
      window.scrollTo({ top: lastScrollY, behavior: "auto" });

      removeOverlayImages();
      outsideElements.forEach(el => el.classList.remove('dim-outside-gallery'));

      if (gallery) {
        gallery.querySelectorAll('.project').forEach(p => p.classList.remove('dimmed', 'highlighted'));
      }
    });
  });

  // ------------- INTERSECTION OBSERVER: SCROLL → ACTIVE BAR -------------

  const observerRoot = detailPanel || null;

  const observer = new IntersectionObserver((entries) => {
    // Pick the entry with the largest visible area
    let bestEntry = null;

    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
        bestEntry = entry;
      }
    });

    if (bestEntry) {
      const projectId = bestEntry.target.dataset.project;
      setActiveBar(projectId);
    }
  }, {
    root: observerRoot,                  // scroll container (detail panel)
    threshold: [0.1, 0.25, 0.5, 0.75]
  });

  // Observe only the scrollable project pages (1,2,3,4,5,6...)
  scrollProjectDetails.forEach(section => observer.observe(section));
});
