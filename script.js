// ========================================
// NOVA MASSAGE
// Site functionality
// ========================================

document.addEventListener("DOMContentLoaded", function () {

  // ========================================
  // COPYRIGHT YEAR
  // ========================================

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // ========================================
  // ELEMENTS
  // ========================================

  // MOBILE NAVIGATION — accessible animated menu
  const mainNav = document.querySelector(".main-nav");
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileNavLinks = document.getElementById("mobileNavLinks");
  function setMobileMenu(open) {
    if (!mainNav || !mobileMenuToggle || !mobileNavLinks) return;
    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    const shouldOpen = Boolean(open && isMobile);
    mainNav.classList.toggle("mobile-menu-open", shouldOpen);
    document.body.classList.toggle("mobile-menu-active", shouldOpen);
    mobileMenuToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    mobileMenuToggle.setAttribute("aria-label", shouldOpen ? "Close navigation menu" : "Open navigation menu");
    mobileNavLinks.setAttribute("aria-hidden", isMobile && !shouldOpen ? "true" : "false");
    mobileNavLinks.querySelectorAll("a").forEach(link => {
      if (isMobile && !shouldOpen) link.setAttribute("tabindex", "-1");
      else link.removeAttribute("tabindex");
    });
  }
  if (mobileMenuToggle && mainNav && mobileNavLinks) {
    setMobileMenu(false);
    mobileMenuToggle.addEventListener("click", () => setMobileMenu(mobileMenuToggle.getAttribute("aria-expanded") !== "true"));
    mobileNavLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMobileMenu(false)));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && mobileMenuToggle.getAttribute("aria-expanded") === "true") { setMobileMenu(false); mobileMenuToggle.focus(); }
    });
    document.addEventListener("click", event => {
      if (mobileMenuToggle.getAttribute("aria-expanded") === "true" && !mainNav.contains(event.target)) setMobileMenu(false);
    });
    window.addEventListener("resize", () => { if (!window.matchMedia("(max-width: 760px)").matches) setMobileMenu(false); });
  }

  const body = document.body;

  const dropLineTrigger =
    document.getElementById("dropLineTrigger");

  const contactDrawer =
    document.getElementById("contactDrawer");

  const drawerBackdrop =
    document.getElementById("drawerBackdrop");

  const drawerClose =
    document.getElementById("drawerClose");

  const contactForm =
    document.getElementById("contactForm");

  const formStatus =
    document.getElementById("formStatus");

  const heroVideo =
    document.getElementById("heroVideo");


  // ========================================
  // CONTACT DRAWER
  // ========================================

  function openDrawer() {

    if (!contactDrawer || !drawerBackdrop) {
      return;
    }

    contactDrawer.classList.add("open");

    contactDrawer.setAttribute(
      "aria-hidden",
      "false"
    );

    drawerBackdrop.classList.add("open");

    body.classList.add("menu-open");

    if (contactForm) {
      const firstInput = contactForm.querySelector(
        "input:not([type='hidden']):not([type='file'])"
      );

      if (firstInput) {
        setTimeout(function () {
          firstInput.focus();
        }, 300);
      }
    }
  }


  function closeDrawer() {

    if (!contactDrawer || !drawerBackdrop) {
      return;
    }

    contactDrawer.classList.remove("open");

    contactDrawer.setAttribute(
      "aria-hidden",
      "true"
    );

    drawerBackdrop.classList.remove("open");

    body.classList.remove("menu-open");
  }


  if (dropLineTrigger) {
    dropLineTrigger.addEventListener(
      "click",
      openDrawer
    );
  }


  if (drawerClose) {
    drawerClose.addEventListener(
      "click",
      closeDrawer
    );
  }


  if (drawerBackdrop) {
    drawerBackdrop.addEventListener(
      "click",
      closeDrawer
    );
  }


  // ========================================
  // ESCAPE KEY
  // ========================================

  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Escape") {
        closeDrawer();
      }

    }
  );


  // ========================================
  // HERO VIDEO
  // ========================================

  if (heroVideo) {

    heroVideo.addEventListener(
      "error",
      function () {
        heroVideo.style.display = "none";
      }
    );


    // Some mobile browsers may prevent
    // autoplay. Try to start it manually.
    const playPromise = heroVideo.play();

    if (
      playPromise !== undefined
    ) {

      playPromise.catch(
        function () {
          // Autoplay may be blocked.
          // The poster image will remain visible.
        }
      );

    }

  }


  // ========================================
  // CONTACT FORM
  // ========================================

  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();


        const emailField =
          contactForm.querySelector("#email");

        const nameField =
          contactForm.querySelector("#name");

        const replyToField =
          contactForm.querySelector("#_replyto");

        const submitButton =
          contactForm.querySelector(
            'button[type="submit"]'
          );


        // ====================================
        // VALIDATE FORM
        // ====================================

        if (!contactForm.checkValidity()) {

          contactForm.reportValidity();

          return;
        }


        // ====================================
        // GET NAME
        // ====================================

        const name =
          nameField
            ? nameField.value.trim()
            : "";


        // ====================================
        // SET REPLY-TO
        // ====================================

        if (
          replyToField &&
          emailField
        ) {

          replyToField.value =
            emailField.value.trim();

        }


        // ====================================
        // FORM DATA
        // ====================================

        const formData =
          new FormData(contactForm);


        // ====================================
        // AJAX ENDPOINT
        // ====================================

        const ajaxAction =
          contactForm.action.replace(
            "https://formsubmit.co/",
            "https://formsubmit.co/ajax/"
          );


        // ====================================
        // DISABLE SEND BUTTON
        // ====================================

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Sending...";
        }


        setFormStatus(
          "Sending your message…",
          false
        );


        try {

          const response =
            await fetch(
              ajaxAction,
              {
                method: "POST",
                headers: {
                  Accept: "application/json"
                },
                body: formData
              }
            );


          if (!response.ok) {
            throw new Error(
              "Request failed"
            );
          }


          const result =
            await response.json();


          // FormSubmit normally returns
          // success information here.
          if (
            result &&
            result.success === false
          ) {
            throw new Error(
              "Form submission failed"
            );
          }


          // ==================================
          // SUCCESS
          // ==================================

          setFormStatus(

            (
              name
                ? name + ", thanks"
                : "Thanks"
            ) +

            " for reaching out! Your message is " +

            "on its way — we'll get back to you soon. " +

            "You're welcome to text +1 (708) 400-9333 too.",

            false

          );


          contactForm.reset();


          const attachmentNote =
            contactForm.querySelector(
              ".attachment-note"
            );

          if (attachmentNote) {
            attachmentNote.textContent =
              "Attachments (0)";
          }


          setTimeout(
            function () {
              closeDrawer();
            },
            2500
          );


        } catch (error) {

          console.error(
            "Contact form error:",
            error
          );


          setFormStatus(

            "Something went wrong sending that. " +

            "Please text +1 (708) 400-9333 directly, " +

            "or try again in a moment.",

            true

          );

        } finally {

          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Send";
          }

        }

      }
    );


    // ========================================
    // FORM RESET
    // ========================================

    contactForm.addEventListener(
      "reset",
      function () {

        setTimeout(
          function () {

            setFormStatus(
              "",
              false
            );


            const attachmentNote =
              contactForm.querySelector(
                ".attachment-note"
              );

            if (attachmentNote) {
              attachmentNote.textContent =
                "Attachments (0)";
            }

          },
          0
        );

      }
    );


    // ========================================
    // ATTACHMENT COUNTER
    // ========================================

    const attachmentInput =
      contactForm.querySelector(
        "#attachment"
      );

    const attachmentNote =
      contactForm.querySelector(
        ".attachment-note"
      );


    if (
      attachmentInput &&
      attachmentNote
    ) {

      attachmentInput.addEventListener(
        "change",
        function () {

          const count =
            attachmentInput.files
              ? attachmentInput.files.length
              : 0;


          attachmentNote.textContent =
            "Attachments (" +
            count +
            ")";

        }
      );

    }

  }


  // ========================================
  // FORM STATUS HELPER
  // ========================================

  function setFormStatus(
    message,
    isError
  ) {

    if (!formStatus) {
      return;
    }


    formStatus.textContent =
      message;


    if (isError) {

      formStatus.classList.add(
        "error"
      );

    } else {

      formStatus.classList.remove(
        "error"
      );

    }

  }


  // ========================================
  // LIGHT / DARK THEME SWITCH
  // ========================================

  const themeButtons = document.querySelectorAll("[data-theme-choice]");

  function applyTheme(theme) {
    const selected = theme === "light" ? "light" : "dark";
    body.setAttribute("data-theme", selected);
    themeButtons.forEach(function (button) {
      const active = button.getAttribute("data-theme-choice") === selected;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    try {
      localStorage.setItem("nova-massage-theme-v2", selected);
    } catch (error) {
      // Theme remains usable when storage is unavailable.
    }
  }

  let savedTheme = "light";
  try {
    const storedTheme = localStorage.getItem("nova-massage-theme-v2");
    if (storedTheme === "light" || storedTheme === "dark") savedTheme = storedTheme;
  } catch (error) {
    // Keep the default light theme.
  }
  applyTheme(savedTheme);

  themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      applyTheme(button.getAttribute("data-theme-choice"));
    });
  });


  // SERVICE SEARCH AND FILTERS
  const serviceCards = Array.from(document.querySelectorAll(".popular-grid .service-card"));
  const searchInput = document.getElementById("serviceSearch");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const resultsLabel = document.getElementById("serviceResults");
  let activeFilter = "all";
  function classifyService(card) {
    const name = (card.querySelector("h4")?.textContent || "").toLowerCase();
    if (/deep tissue|tmj|upper body|neck nirvana/.test(name)) return "therapeutic";
    if (/abdominal|lymph|brush|reflexology/.test(name)) return "specialty";
    return "relaxation";
  }
  function filterServices() {
    const term = (searchInput?.value || "").trim().toLowerCase();
    let visible = 0;
    serviceCards.forEach(card => {
      const matchesText = !term || card.textContent.toLowerCase().includes(term);
      const matchesFilter = activeFilter === "all" || classifyService(card) === activeFilter;
      const show = matchesText && matchesFilter;
      card.classList.toggle("is-filtered-out", !show);
      if (show) visible++;
    });
    if (resultsLabel) resultsLabel.textContent = visible + (visible === 1 ? " treatment shown" : " treatments shown");
  }
  filterButtons.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";
    filterButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    filterServices();
  }));
  if (searchInput) searchInput.addEventListener("input", filterServices);

  // Explore Treatments buttons scroll to the actual treatment cards.
  document.querySelectorAll("[data-explore-target]").forEach(button => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.exploreTarget);
      if (!target) return;
      target.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"center", inline:"nearest"});
    });
  });

  // Service detail experience: concise service-specific summaries plus the original full description.
  const serviceHighlights = {
    "X6XANGPWMXU4B6HJYA2ZSF6I":"A soothing blend of warm stones and calming scalp work to melt away everyday tension.",
    "HVYJ25LS3ZKUAB7TLIMZ2WYJ":"Focused neck, shoulder and upper-back massage paired with a refreshing foot reflexology session.",
    "OP3GGYAQREKWUCWMTUEKQUAE":"A focused jaw, face and neck treatment combined with deep-tissue work for the upper body.",
    "PUYNGH63DZPZTDPHVV3SJGME":"A generous two-hour escape combining focused therapeutic pressure with deeply relaxing massage.",
    "CAGPP7F3HHGY2B7J4KEX4V2Z":"A full-body massage with foot reflexology, a salt scrub and warm towels for a refreshed finish.",
    "4BCBHGX3U5JWNAGL5E77T4NR":"A luxurious spa combination featuring Swedish massage, scalp care, foot scrub, steam and facial massage.",
    "2ARGB3IGIQQC35GNO6KVQ2AI":"A 90-minute focused massage using therapeutic pressure to work through stubborn muscle tightness.",
    "SG4LEG5JIPSKF53NH7UBZS42":"A gentle abdominal massage designed to encourage comfort, relaxation and mindful body care.",
    "VPOLLJVI3RP5ZQHGAVYYNILW":"Gentle lymphatic-style massage paired with dry brushing for a light, refreshed spa experience.",
    "GTLSBPQGGQMZWG26UVLRRE4A":"A calming foot-focused session using targeted pressure techniques to relax tired feet.",
    "GJZTELLD76VKFG6G2RRQBOKR":"A targeted jaw, head, face and upper-body session using specialized massage techniques.",
    "SFHO6VLIWIB66UF76BNN3FKU":"A gentle massage experience with focused abdominal and facial techniques for soothing relaxation.",
    "IWUVUCNKKVI7AJO3ADPTZWSZ":"Focused care for the neck, shoulders, back, arms and hands to ease everyday upper-body tightness.",
    "KXHYPTTUWKYQVMSA5HVF5A3V":"Warm stones and flowing Swedish techniques combine for a comforting, deeply relaxing treatment.",
    "ZTL2WG6OLZMDP4N5TY64VVFQ":"A focused neck and shoulder-blade massage with precise pressure and gentle therapeutic stretching."
  };
  const detailModal = document.createElement("div");
  detailModal.className = "service-detail-modal";
  detailModal.hidden = true;
  detailModal.innerHTML = '<div class="service-detail-backdrop" data-detail-close></div><section class="service-detail-panel" role="dialog" aria-modal="true" aria-labelledby="serviceDetailTitle" tabindex="-1"><button class="service-detail-close" type="button" aria-label="Close details">×</button><div class="service-detail-image-wrap"><img class="service-detail-image" alt=""></div><div class="service-detail-copy"><span class="service-detail-eyebrow">NOVA TREATMENT DETAILS</span><h2 id="serviceDetailTitle"></h2><p class="service-detail-meta"></p><p class="service-detail-highlight"></p><div class="service-detail-divider"></div><h3>What to expect</h3><p class="service-detail-description"></p><a class="service-detail-book" target="_blank" rel="noopener noreferrer">Book this treatment <span aria-hidden="true">↗</span></a></div></section>';
  document.body.appendChild(detailModal);
  const detailPanel = detailModal.querySelector(".service-detail-panel");
  const detailClose = detailModal.querySelector(".service-detail-close");
  let detailReturnFocus = null;
  const closeServiceDetails = () => {
    detailModal.hidden = true;
    document.body.classList.remove("service-detail-open");
    if (detailReturnFocus?.focus) detailReturnFocus.focus();
  };
  document.querySelectorAll(".service-card").forEach(card => {
    const content = card.querySelector(".service-content");
    if (!content || content.querySelector(".service-details-button")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "service-details-button";
    button.textContent = "View Details";
    button.addEventListener("click", () => {
      const title = card.querySelector("h4")?.textContent.trim() || "NOVA Treatment";
      const meta = card.querySelector(".service-meta")?.textContent.trim() || "";
      const description = card.querySelector(".service-content > p:not(.fine-print)")?.textContent.trim() || "";
      const image = card.querySelector("img");
      const booking = card.querySelector("[data-square-url]");
      detailModal.querySelector("#serviceDetailTitle").textContent = title;
      detailModal.querySelector(".service-detail-meta").textContent = meta;
      detailModal.querySelector(".service-detail-highlight").textContent = serviceHighlights[card.dataset.serviceId] || description;
      detailModal.querySelector(".service-detail-description").textContent = description;
      const detailImage = detailModal.querySelector(".service-detail-image");
      detailImage.src = image?.currentSrc || image?.src || "";
      detailImage.alt = image?.alt || title;
      detailImage.parentElement.hidden = !detailImage.src;
      const bookLink = detailModal.querySelector(".service-detail-book");
      if (booking) {
        bookLink.href = booking.dataset.squareUrl || booking.href;
        bookLink.hidden = false;
      } else {
        bookLink.hidden = true;
        bookLink.removeAttribute("href");
      }
      detailReturnFocus = button;
      detailModal.hidden = false;
      document.body.classList.add("service-detail-open");
      detailClose.focus();
    });
    const bookingButton = content.querySelector(".secondary-button");
    content.insertBefore(button, bookingButton || null);
  });
  detailClose.addEventListener("click", closeServiceDetails);
  detailModal.querySelector("[data-detail-close]").addEventListener("click", closeServiceDetails);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !detailModal.hidden) closeServiceDetails();
  });

  // FREE CALLBACK REQUEST: stored in the NOVA admin dashboard; no SMS/call automation.
  const callbackRequestForm = document.getElementById("callbackRequestForm");
  if (callbackRequestForm) callbackRequestForm.addEventListener("submit", async event => {
    event.preventDefault();
    const submit=document.getElementById("callbackSubmit"),status=document.getElementById("callbackStatus");
    const payload={customer_name:document.getElementById("callbackName").value.trim(),customer_phone:document.getElementById("callbackPhone").value.trim(),customer_email:document.getElementById("callbackEmail").value.trim(),message:document.getElementById("callbackMessage").value.trim(),website:callbackRequestForm.querySelector('[name="website"]').value};
    if(submit)submit.disabled=true;if(status)status.textContent="Sending your callback request…";
    try{const response=await fetch("/api/callback-request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const result=await response.json();if(!response.ok)throw new Error(result.error||"Unable to send your request.");callbackRequestForm.reset();if(status)status.textContent="Your request has been saved. The studio will follow up when available. For urgent help, call or WhatsApp +1 (708) 400-9333."}
    catch(error){if(status)status.textContent=error.message+" You can also WhatsApp the studio."}
    finally{if(submit)submit.disabled=false}
  });

  // SCROLL REVEALS
  const revealTargets = document.querySelectorAll("main > section,.about-grid,.cards-grid,.service-card,.gallery-tile,.ritual-panel,.faq-item,.reviews-empty,.section-heading,.section-intro,.wellness-card,.review-card,.contact-grid,.about-section,.wellness-section,.reviews-section,.gallery-section,.faq-section,.contact-section,.service-tools,.service-search-wrap,.service-filters,.filter-chip");
  revealTargets.forEach((element, index) => {
    element.classList.add("js-reveal");
    element.style.transitionDelay = (index % 3) * 70 + "ms";
  });
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          /* Keep revealed content visible; avoids flicker and disappearing sections during touch scrolling. */
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });
    revealTargets.forEach(element => revealObserver.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add("is-visible"));
  }

  // SUBTLE POINTER-BASED 3D CARD TILT
  const canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (canHover) {
    document.querySelectorAll(".service-card").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 5;
        const rotateX = (0.5 - y) * 4;
        card.style.transform = "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-5px)";
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  // GUIDED FAQ CONCIERGE (NOT LIVE AI CHAT)
  const conciergeToggle = document.getElementById("conciergeToggle");
  const conciergePanel = document.getElementById("conciergePanel");
  const conciergeClose = document.getElementById("conciergeClose");
  const conciergeAnswer = document.getElementById("conciergeAnswer");
  function setConcierge(open) {
    if (!conciergeToggle || !conciergePanel) return;
    conciergePanel.hidden = !open;
    conciergeToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (conciergeToggle) conciergeToggle.addEventListener("click", () => setConcierge(conciergePanel.hidden));
  if (conciergeClose) conciergeClose.addEventListener("click", () => setConcierge(false));
  document.querySelectorAll("[data-answer]").forEach(button => {
    button.addEventListener("click", () => {
      if (conciergeAnswer) conciergeAnswer.textContent = button.dataset.answer || "";
    });
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setConcierge(false);
  });


  // NOVA AI CONCIERGE: uses the Cloudflare Workers AI binding when enabled.
  const novaChatForm = document.getElementById("novaChatForm");
  const novaChatInput = document.getElementById("novaChatInput");
  const novaChatStatus = document.getElementById("novaChatStatus");
  if (novaChatForm) novaChatForm.addEventListener("submit", async event => {
    event.preventDefault();
    const message = (novaChatInput?.value || "").trim();
    if (!message) return;
    const submit = novaChatForm.querySelector("button");
    if (submit) submit.disabled = true;
    if (novaChatStatus) novaChatStatus.textContent = "Nova is thinking…";
    if (conciergeAnswer) conciergeAnswer.textContent = "";
    try {
      const response = await fetch("/api/assistant", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message})});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The assistant is temporarily unavailable.");
      if (conciergeAnswer) conciergeAnswer.textContent = result.reply;
      novaChatInput.value = "";
      if (novaChatStatus) novaChatStatus.textContent = "AI concierge · For urgent booking changes, contact the studio directly.";
    } catch (error) {
      if (conciergeAnswer) conciergeAnswer.textContent = error.message + " You can reach us on WhatsApp at +1 (708) 400-9333.";
      if (novaChatStatus) novaChatStatus.textContent = "WhatsApp support is available.";
    } finally { if (submit) submit.disabled = false; }
  });

  // CUSTOMER REVIEWS: public submissions are queued for admin approval.
  const reviewForm = document.getElementById("customerReviewForm");
  const reviewStatus = document.getElementById("reviewFormStatus");
  const approvedReviews = document.getElementById("approvedReviews");
  function escapeReview(value) {
    return String(value || "").replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character]));
  }
  async function loadApprovedReviews() {
    if (!approvedReviews) return;
    try {
      const response = await fetch("/api/reviews");
      if (!response.ok) return;
      const data = await response.json();
      if (data.reviews && data.reviews.length) {
        approvedReviews.innerHTML = data.reviews.map(review =>
          '<article class="approved-review"><div class="stars" aria-label="' + Number(review.rating) + ' out of 5 stars">' + "★".repeat(Number(review.rating)) + "☆".repeat(5-Number(review.rating)) + '</div><p>“' + escapeReview(review.review_text) + '”</p><span class="review-note">' + escapeReview(review.customer_name) + '</span></article>'
        ).join("");
      }
    } catch (error) { /* Reviews remain optional if the database is not connected. */ }
  }
  if (reviewForm) reviewForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (reviewStatus) reviewStatus.textContent = "Submitting…";
    const payload = {
      customer_name: document.getElementById("reviewName").value.trim(),
      rating: Number(document.getElementById("reviewRating").value),
      review_text: document.getElementById("reviewText").value.trim()
    };
    try {
      const response = await fetch("/api/reviews", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to submit review.");
      reviewForm.reset();
      if (reviewStatus) reviewStatus.textContent = "Thank you. Your review is awaiting approval.";
    } catch (error) {
      if (reviewStatus) reviewStatus.textContent = error.message;
    }
  });
  loadApprovedReviews();

});