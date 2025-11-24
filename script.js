document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const projectDetails = document.querySelectorAll(".project-detail");
  const backButtons = document.querySelectorAll(".back-button");
  const projectsShell = document.querySelector(".projects-shell");
  const projectCards = document.querySelectorAll(".project");
  let lastScrollY = 0;

  // Overlay images config (unchanged)
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

  /* (hover overlay currently disabled, keeping your comment)
  ...
  */

  // Click to show project details
  document.addEventListener("click", (e) => {
    const projectEl = e.target.closest(".project, li[data-project], .project-link");
    if (!projectEl) return;

    const projectId = projectEl.dataset.project;
    if (!projectId) return;

    lastScrollY = window.scrollY;

    // 🔹 highlight the active bar (use the bar that matches data-project)
    projectCards.forEach(card => card.classList.remove("active-project"));
    const clickedProjectCard = document.querySelector(`.project[data-project="${projectId}"]`);
    if (clickedProjectCard) {
      clickedProjectCard.classList.add("active-project");
    }

    // Hide all details
    projectDetails.forEach(section => section.classList.add("hidden"));

    const detailToShow = document.getElementById(`project-detail-${projectId}`);
    if (!detailToShow) return;

    // Reset layout classes
    if (projectsShell) {
      projectsShell.classList.remove("detail-open-split", "detail-open-classic");
    }

    // Show the correct detail
    detailToShow.classList.remove("hidden");

    // Always show the gallery bars in split mode
    if (gallery) {
      gallery.classList.remove("hidden");
    }

    // 🔹 THIS is what makes the bars shrink + detail appear to the right
    if (projectsShell) {
      projectsShell.classList.add("detail-open-split");
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

      // remove the active highlight
      projectCards.forEach(card => card.classList.remove("active-project"));

      window.scrollTo({ top: lastScrollY, behavior: "instant" });
      removeOverlayImages();
      outsideElements.forEach(el => el.classList.remove('dim-outside-gallery'));

      if (gallery) {
        gallery.querySelectorAll('.project').forEach(p => p.classList.remove('dimmed', 'highlighted'));
      }
    });
  });
});
