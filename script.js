document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const projectDetails = document.querySelectorAll(".project-detail");
  const backButtons = document.querySelectorAll(".back-button");
  const projectsShell = document.querySelector(".projects-shell");
  const projectCards = document.querySelectorAll(".project");
  const detailPanel = document.querySelector(".project-detail-panel");
  let lastScrollY = 0;

  // CV + About → should NOT be part of scroll stack
  const STATIC_IDS = ["project-detail-100", "project-detail-101"];

  // ---------------- ACTIVE BAR HELPER ----------------

  function setActiveBar(projectId) {
    projectCards.forEach(card => {
      const isActive = projectId && card.dataset.project === projectId;
      card.classList.toggle("active-project", isActive);
    });
  }

  // ---------------- PREPARE DATASET ON SECTIONS ----------------

  projectDetails.forEach(section => {
    const match = section.id.match(/project-detail-(.+)/);
    if (match) {
      section.dataset.project = match[1]; // "1", "2", "3", "100", "101", ...
    }
  });

  // Only the REAL project pages (1–8) belong to the scroll mode
  const scrollProjectDetails = Array.from(projectDetails).filter(
    section => !STATIC_IDS.includes(section.id)
  );

  // ---------------- CLICK HANDLER (MENU + BARS) ----------------

  document.addEventListener("click", (e) => {
    const projectEl = e.target.closest(".project, li[data-project], .project-link");
    if (!projectEl) return;

    const projectId = projectEl.dataset.project;
    if (!projectId) return;

    // remember where we were on the landing list
    lastScrollY = window.scrollY;

    const detailToShow = document.getElementById(`project-detail-${projectId}`);
    if (!detailToShow) return;

    // Reset layout classes
    if (projectsShell) {
      projectsShell.classList.remove("detail-open-classic", "detail-open-split");
    }

    // ---------------- CV / ABOUT (NOT IN SCROLL STACK) ----------------
    if (STATIC_IDS.includes(detailToShow.id)) {
      // Hide all details, show only CV/ABOUT
      projectDetails.forEach(section => section.classList.add("hidden"));
      detailToShow.classList.remove("hidden");

      // Keep split layout: bars left, detail right
      if (projectsShell) {
        projectsShell.classList.add("detail-open-split");
      }

      if (gallery) {
        gallery.classList.remove("hidden");
      }

      // No sidebar highlight (no bar for 100/101)
      setActiveBar(null);

      // Make sure the detail panel is at the top
      if (detailPanel) {
        detailPanel.scrollTop = 0;
      }

      return;
    }

    // ---------------- REAL PROJECTS (SCROLL STACK) ----------------

    // Highlight sidebar bar for this project
    setActiveBar(projectId);

    // Show ONLY the scrollable project pages, hide CV/About
    projectDetails.forEach(section => {
      if (STATIC_IDS.includes(section.id)) {
        section.classList.add("hidden");
      } else {
        section.classList.remove("hidden");
      }
    });

    // Always use split layout: bars left, detail right
    if (projectsShell) {
      projectsShell.classList.add("detail-open-split");
    }

    if (gallery) {
      gallery.classList.remove("hidden");
    }

    // Scroll INSIDE the detail panel to the chosen project
    if (detailPanel && detailPanel.contains(detailToShow)) {
      detailPanel.scrollTo({
        top: detailToShow.offsetTop,
        behavior: "smooth"
      });
    }
  });

  // ---------------- BACK BUTTONS ----------------

  backButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Hide all details
      projectDetails.forEach(section => section.classList.add("hidden"));

      // Show gallery full-width again
      if (gallery) {
        gallery.classList.remove("hidden");
      }

      // Remove split/classic layout
      if (projectsShell) {
        projectsShell.classList.remove("detail-open-split", "detail-open-classic");
      }

      // Remove highlight on bars
      projectCards.forEach(card => card.classList.remove("active-project"));

      // Go back to where we were on the landing page
      window.scrollTo({ top: lastScrollY, behavior: "auto" });
    });
  });

  // ---------------- SCROLL → ACTIVE BAR (INTERSECTION OBSERVER) ----------------

  if (detailPanel) {
    const observer = new IntersectionObserver((entries) => {
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
      root: detailPanel,                 // only track inside the detail panel
      threshold: [0.2, 0.5, 0.8]        // decent granularity
    });

    // Observe only the scrollable project pages (1,2,3,4,5,6...)
    scrollProjectDetails.forEach(section => observer.observe(section));
  }
});
