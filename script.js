document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const projectDetails = document.querySelectorAll(".project-detail");
  const backButtons = document.querySelectorAll(".back-button");
  const projectsShell = document.querySelector(".projects-shell");
  let lastScrollY = 0;

  // Overlay images for each project
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

  /* ============================================
     DISABLE HOVER OVERLAY EFFECT (COMMENTED OUT)
     ============================================

  // Hover effect
  gallery.querySelectorAll('.project').forEach(project => {
    const projectId = project.dataset.project;

    project.addEventListener('mouseenter', () => {
      project.classList.add('highlighted');
      gallery.querySelectorAll('.project').forEach(p => {
        if (p !== project) p.classList.add('dimmed');
      });
      outsideElements.forEach(el => el.classList.add('dim-outside-gallery'));
      createOverlayImages(projectId);
    });

    project.addEventListener('mouseleave', () => {
      project.classList.remove('highlighted');
      gallery.querySelectorAll('.project').forEach(p => p.classList.remove('dimmed'));
      outsideElements.forEach(el => el.classList.remove('dim-outside-gallery'));
      removeOverlayImages();
    });
  });

  ============================================= */

  // Click to show project details
  document.addEventListener("click", (e) => {
    const projectEl = e.target.closest(".project, li[data-project], .project-link");
    if (!projectEl) return;

    const projectId = projectEl.dataset.project;
    lastScrollY = window.scrollY;

    // Hide all details
    projectDetails.forEach(section => section.classList.add("hidden"));

    const detailToShow = document.getElementById(`project-detail-${projectId}`);
    if (!detailToShow) return;

    // Reset layout classes
    if (projectsShell) {
      projectsShell.classList.remove("detail-open-split", "detail-open-classic");
    }

    // SPECIAL CASE: project 2 (Ordkonst) → split layout 30/70
    if (projectId === "2") {
      detailToShow.classList.remove("hidden");
      if (gallery) {
        gallery.classList.remove("hidden"); // keep bars visible
      }
      if (projectsShell) {
        projectsShell.classList.add("detail-open-split");
      }
    } else {
      // Classic behavior for all other IDs (including 1,3–6,100,101)
      detailToShow.classList.remove("hidden");
      if (gallery) {
        gallery.classList.add("hidden"); // hide bars
      }
      if (projectsShell) {
        projectsShell.classList.add("detail-open-classic");
      }
    }

    window.scrollTo({ top: 0, behavior: "instant" });
  });

  // Back buttons
  backButtons.forEach(button => {
    button.addEventListener('click', () => {
      projectDetails.forEach(section => section.classList.add('hidden'));

      if (gallery) {
        gallery.classList.remove('hidden');
      }

      if (projectsShell) {
        projectsShell.classList.remove("detail-open-split", "detail-open-classic");
      }

      window.scrollTo({ top: lastScrollY, behavior: "instant" });
      removeOverlayImages();
      outsideElements.forEach(el => el.classList.remove('dim-outside-gallery'));

      if (gallery) {
        gallery.querySelectorAll('.project').forEach(p => p.classList.remove('dimmed', 'highlighted'));
      }
    });
  });
});
