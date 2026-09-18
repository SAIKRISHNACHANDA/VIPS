console.log("🚀 Main JS loaded");

// ---------- FOOTER ----------
fetch('footer.html?v=' + Date.now())
  .then(res => res.text())
  .then(html => {
    document.getElementById("footer").innerHTML = html;
  })
  .catch(err => console.error("❌ Footer load failed", err));


// ---------- NAVBAR ----------
fetch('nav-bar.html?v=' + Date.now())
  .then(res => res.text())
  .then(html => {
    document.getElementById("navBar").innerHTML = html;
    initNavbarEvents();
  })
  .catch(err => console.error("❌ Navbar load failed", err));


// ---------- NAVBAR LOGIC ----------
function initNavbarEvents() {
  console.log("🧠 initNavbarEvents()");

  setTimeout(() => {

    const popupMenu = document.querySelector('.popup-mobile-menu');
    const hamburgerBtn = document.querySelector('.hamberger-button');
    const closeBtn = popupMenu?.querySelector('.close-button');

    if (!popupMenu) {
      console.error("❌ popup-mobile-menu not found");
      return;
    }

    // ---------- OPEN MOBILE MENU ----------
    hamburgerBtn?.addEventListener('click', () => {
      popupMenu.classList.add('active');
    });

    // ---------- CLOSE MOBILE MENU ----------
    closeBtn?.addEventListener('click', () => {
      popupMenu.classList.remove('active');

      // close all dropdowns when menu closes
      popupMenu
        .querySelectorAll('.active')
        .forEach(el => el.classList.remove('active'));
    });


    // ---------- DROPDOWN + MEGAMENU TOGGLE ----------
    const mobileLinks = popupMenu.querySelectorAll(
      '.has-droupdown > a, .with-megamenu > a'
    );

    mobileLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault(); // 🚨 IMPORTANT

        const parentLi = link.parentElement;
        const isOpen = parentLi.classList.contains('active');

        // close all other dropdowns
        popupMenu
          .querySelectorAll('.has-droupdown.active, .with-megamenu.active')
          .forEach(li => {
            if (li !== parentLi) li.classList.remove('active');
          });

        // toggle current
        parentLi.classList.toggle('active', !isOpen);
      });
    });

  }, 200);
}





/* Replace your old script with this */
(function () {
  const MOBILE_QUERY = "(max-width: 767px)";
  const SELECTOR = ".service.service__style--1, .card-box.card-style-1, .rainbow-callto-action .content-wrapper";

  function init() {
    // Only run on mobile
    if (!window.matchMedia(MOBILE_QUERY).matches) {
      // cleanup if not mobile
      document.querySelectorAll(SELECTOR).forEach(el => el.classList.remove("animate-on-scroll", "active"));
      return;
    }

    const elements = Array.from(document.querySelectorAll(SELECTOR));
    if (!elements.length) {
      console.warn("No elements found for selector:", SELECTOR);
      return;
    }

    // Give starting class (CSS should keep these hidden until active on mobile)
    elements.forEach(el => el.classList.add("animate-on-scroll"));

    // store latest intersectionRatios
    const ratios = new Map();

    // Thresholds for smoother updates
    const thresholds = [];
    for (let i = 0; i <= 100; i += 5) thresholds.push(i / 100);

    const observer = new IntersectionObserver((entries) => {
      // update ratios map
      entries.forEach(entry => ratios.set(entry.target, entry.intersectionRatio));

      // choose element with highest ratio
      let maxEl = null;
      let maxRatio = 0;
      for (const [el, r] of ratios.entries()) {
        if (r > maxRatio) {
          maxRatio = r;
          maxEl = el;
        }
      }

      // apply active only to the element with the highest visibility (and only if visible)
      elements.forEach(el => {
        if (el === maxEl && maxRatio > 0) el.classList.add("active");
        else el.classList.remove("active");
      });
    }, { threshold: thresholds, root: null, rootMargin: "0px" });

    // initialize ratios & observe
    elements.forEach(el => {
      ratios.set(el, 0);
      observer.observe(el);
    });

    // handle switch between mobile/desktop (cleanup when not mobile)
    const mql = window.matchMedia(MOBILE_QUERY);
    function onMediaChange(e) {
      if (!e.matches) {
        observer.disconnect();
        elements.forEach(el => el.classList.remove("animate-on-scroll", "active"));
      } else {
        // re-init on becoming mobile again (small delay to allow layout)
        setTimeout(init, 60);
      }
    }
    if (mql.addEventListener) mql.addEventListener("change", onMediaChange);
    else if (mql.addListener) mql.addListener(onMediaChange);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();




