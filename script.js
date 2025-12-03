document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const projectDetails = document.querySelectorAll(".project-detail");
  const backButtons = document.querySelectorAll(".back-button");
  const projectsShell = document.querySelector(".projects-shell");
  const projectCards = document.querySelectorAll(".project");
  const detailPanel = document.querySelector(".project-detail-panel");
 const IS_MOBILE = window.matchMedia("(max-width: 768px)").matches; // or 768px
  let lastScrollY = 0;

  // IDs for pages that should NOT be in the scroll sequence
  const STATIC_IDS = ["project-detail-100", "project-detail-101"];
  const contactBlock = document.getElementById("contact-block");

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

    if (contactBlock) {
      contactBlock.classList.remove("hidden");
    }

    // Reset layout classes first
    if (projectsShell) {
      projectsShell.classList.remove("detail-open-split", "detail-open-classic");
    }

    // ---- CV / About → SIDE PANEL, BUT NOT IN SCROLL ----
        // ---- CV / About ----
// ---- CV / About ----
if (STATIC_IDS.includes(detailToShow.id)) {
  // Show ONLY CV / About section
  projectDetails.forEach(section => section.classList.add("hidden"));
  detailToShow.classList.remove("hidden");
  

  setActiveBar(null);

  // Use classic (full-width) layout for CV / About
  if (projectsShell) {
    projectsShell.classList.remove("detail-open-split");
    projectsShell.classList.add("detail-open-classic");
    projectsShell.classList.add("cv-about-open");  // <-- key class
  }

  // Make sure detail panel itself is at top (desktop)
  if (detailPanel) {
    detailPanel.scrollTop = 0;
  }

  // Also scroll the page a bit so the section is nicely placed
  const rect = detailToShow.getBoundingClientRect();
  const targetY = window.scrollY + rect.top - 40;
  window.scrollTo({ top: targetY, behavior: "smooth" });

  return;
}



    // ---- SCROLL MODE (REAL PROJECTS) ----

    // 1) Clear any old "scrolling" flags
    projectCards.forEach(card => card.classList.remove("scrolling-project"));

// 2) If this click came from a bar (.project), mark that we are auto-scrolling
const clickedCard = projectEl.closest(".project");
if (clickedCard) {
  clickedCard.classList.add("scrolling-project"); // (optional, can remove later)

  if (projectsShell) {
    projectsShell.classList.add("is-auto-scrolling");
  }
}


        // mark that we are auto-scrolling → disables sidebar hover effects
    if (projectsShell) {
      projectsShell.classList.add("is-auto-scrolling");
    }


    // 🔸 IMPORTANT: we do NOT call setActiveBar(projectId) here.
    // We wait until after the scroll has finished.

    // 3) Show ONLY the scrollable project pages, hide CV/About
    projectDetails.forEach(section => {
      if (STATIC_IDS.includes(section.id)) {
        section.classList.add("hidden");
      } else {
        section.classList.remove("hidden");
      }
    });

    // 4) Always show gallery in split mode
    if (gallery) {
      gallery.classList.remove("hidden");
    }

    // 5) Enable split (bars left, scrollable detail right)
    if (projectsShell) {
      projectsShell.classList.add("detail-open-split");
      projectsShell.classList.add("freeze-heights");
    }

    
  // 6) Scroll to the project (panel if scrollable, otherwise page)
  if (detailPanel && detailPanel.contains(detailToShow)) {

    const ANIM_DURATION = 400;   // bar animation
    const EXTRA_OFFSET  = 80;

    setTimeout(() => {
      // Is the panel actually scrollable?
      const panelScrollable =
        detailPanel.scrollHeight > detailPanel.clientHeight + 5;

      if (panelScrollable) {
        // Scroll inside the right-hand panel (desktop / tall layouts)
        const rawOffset = detailToShow.offsetTop;
        const targetOffset = Math.max(rawOffset - EXTRA_OFFSET, 0);
        smoothScrollTo(detailPanel, targetOffset, 900);
      } else {
        // Fallback: scroll the whole page (some mobile layouts)
        const rect = detailToShow.getBoundingClientRect();
        const targetY = window.scrollY + rect.top - EXTRA_OFFSET;

        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });
      }

      // After scroll: highlight bar, remove flags
      setTimeout(() => {
        setActiveBar(projectId);
        projectCards.forEach(card =>
          card.classList.remove("scrolling-project")
        );
        if (projectsShell) {
          projectsShell.classList.remove("is-auto-scrolling");
        }
      }, 600);
    }, ANIM_DURATION);
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
        projectsShell.classList.remove("detail-open-split", "detail-open-classic", "cv-about-open");
      }

      if (contactBlock) {
      contactBlock.classList.add("hidden");
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
  // If we're auto-scrolling, ignore observer updates
  if (projectsShell && projectsShell.classList.contains("is-auto-scrolling")) {
    return;
  }

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
  root: observerRoot,
  threshold: [0.1, 0.25, 0.5, 0.75]
});


  // Observe only the scrollable project pages (1,2,3,4,5,6...)
  scrollProjectDetails.forEach(section => observer.observe(section));
});

//§------------- SMOOTH SCROLL FUNCTION ------------- 

function smoothScrollTo(element, to, duration = 800) {
  const start = element.scrollTop;
  const change = to - start;
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateScroll(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const eased = easeOutCubic(progress);
    element.scrollTop = start + change * eased;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.classList.remove("hidden");
    });
  });

  lightbox.addEventListener("click", () => {
    lightbox.classList.add("hidden");
  });
});
