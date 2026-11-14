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

  // NOVA SERVICE CART — selection is stored locally; Square remains the booking source of truth.
  const novaCartKey = "nova-service-cart-v1";
  const cartButton = document.getElementById("navCartButton");
  const cartPanel = document.getElementById("serviceCart");
  const cartBackdrop = document.getElementById("serviceCartBackdrop");
  const cartClose = document.getElementById("serviceCartClose");
  const cartContinue = document.getElementById("serviceCartContinue");
  const cartCheckout = document.getElementById("serviceCartCheckout");
  const cartItems = document.getElementById("serviceCartItems");
  const cartCount = document.getElementById("navCartCount");
  const cartCountLabel = document.getElementById("serviceCartCountLabel");
  const cartTotal = document.getElementById("serviceCartTotal");
  let novaCart = [];
  try {
    const stored = JSON.parse(localStorage.getItem(novaCartKey) || "[]");
    if (Array.isArray(stored)) novaCart = stored.filter(item =>
      item && /^[A-Z0-9]{10,40}$/.test(item.id) &&
      typeof item.name === "string" && typeof item.url === "string" &&
      /^https:\/\/book\.squareup\.com\//.test(item.url) &&
      Number.isFinite(Number(item.price)) && Number(item.price) >= 0
    ).slice(0, 15);
  } catch (error) { novaCart = []; }

  const money = value => "$" + Number(value).toFixed(2).replace(/\.00$/, "");
  function saveCart() {
    try { localStorage.setItem(novaCartKey, JSON.stringify(novaCart)); } catch (error) {}
  }
  function renderCart() {
    const count = novaCart.length;
    const total = novaCart.reduce((sum, item) => sum + Number(item.price), 0);
    if (cartCount) cartCount.textContent = String(count);
    if (cartCountLabel) cartCountLabel.textContent = "(" + count + ")";
    if (cartTotal) cartTotal.textContent = money(total);
    if (cartCheckout) cartCheckout.disabled = count === 0;
    if (!cartItems) return;
    if (!count) {
      cartItems.innerHTML = '<p class="cart-empty">Your cart is empty. Add a treatment to get started.</p>';
      return;
    }
    cartItems.innerHTML = novaCart.map(item =>
      '<article class="service-cart-item"><div class="service-cart-item-copy"><strong>' +
      escapeCartText(item.name) + '</strong><span>' + money(item.price) +
      '</span></div><button type="button" class="service-cart-remove" data-cart-remove="' +
      escapeCartText(item.id) + '" aria-label="Remove ' + escapeCartText(item.name) +
      ' from cart">Remove</button></article>'
    ).join("");
  }
  function escapeCartText(value) {
    return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }
  function setCartOpen(open) {
    if (!cartPanel || !cartButton) return;
    cartPanel.classList.toggle("is-open", open);
    cartPanel.setAttribute("aria-hidden", String(!open));
    cartPanel.inert = !open;
    cartBackdrop.hidden = !open;
    cartButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("cart-is-open", open);
    if (open) cartClose?.focus();
    else cartButton.focus();
  }
  cartButton?.addEventListener("click", () => setCartOpen(true));
  cartClose?.addEventListener("click", () => setCartOpen(false));
  cartContinue?.addEventListener("click", () => setCartOpen(false));
  cartBackdrop?.addEventListener("click", () => setCartOpen(false));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && cartPanel?.classList.contains("is-open")) setCartOpen(false);
  });
  cartItems?.addEventListener("click", event => {
    const button = event.target.closest("[data-cart-remove]");
    if (!button) return;
    novaCart = novaCart.filter(item => item.id !== button.dataset.cartRemove);
    saveCart(); renderCart();
  });
  document.querySelectorAll(".service-card").forEach(card => {
    const content = card.querySelector(".service-content") || card;
    const existingLink = content.querySelector("a[data-square-url]");
    if (!existingLink) return;
    const id = card.dataset.serviceId || card.id.replace("service-", "");
    const name = card.querySelector("h4")?.textContent?.trim() || "NOVA Treatment";
    const meta = content.querySelector(".service-meta")?.textContent || "";
    const priceMatch = meta.match(/\$\s*(\d+(?:\.\d{1,2})?)/);
    const price = priceMatch ? Number(priceMatch[1]) : null;
    const url = existingLink.dataset.squareUrl;
    existingLink.classList.add("service-booking-link");
    existingLink.textContent = "Add to Cart";
    existingLink.removeAttribute("target");
    existingLink.removeAttribute("rel");
    existingLink.setAttribute("href", "#");
    existingLink.setAttribute("role", "button");
    existingLink.setAttribute("aria-label", "Add " + name + " to cart");
    if (price === null) {
      existingLink.textContent = "Price unavailable — contact us";
      existingLink.setAttribute("aria-disabled", "true");
      return;
    }
    existingLink.addEventListener("click", event => {
      event.preventDefault();
      if (!novaCart.some(item => item.id === id)) {
        novaCart.push({id,name,price,url});
        saveCart(); renderCart();
      }
      setCartOpen(true);
    });
  });
  cartCheckout?.addEventListener("click", () => {
    if (!novaCart.length) return;
    const first = novaCart[0];
    const otherServices = novaCart.slice(1).map(item => item.name);
    if (otherServices.length) {
      const confirmed = window.confirm(
        "Your cart contains " + novaCart.length + " treatments. Square will open the first selected service. " +
        "Please add or confirm the remaining treatments in Square if its booking flow allows it. " +
        "Your NOVA cart is only a selection summary, not a confirmed multi-service booking. Continue?"
      );
      if (!confirmed) return;
    }
    window.open(first.url, "_blank", "noopener,noreferrer");
  });
  renderCart();

  // Three-card carousel: swipe and arrow controls advance the track by one card.
  document.querySelectorAll("#wellness .cards-grid, #popular .cards-grid").forEach(grid => {
    grid.setAttribute("role", "region");
    grid.setAttribute("aria-roledescription", "carousel");
    grid.setAttribute("aria-label", "Massage treatments");
    grid.querySelectorAll(".service-card").forEach((card, index) => {
      card.setAttribute("role", "group");
      card.setAttribute("aria-roledescription", "slide");
      card.setAttribute("aria-label", "Treatment " + (index + 1) + " of " + grid.querySelectorAll(".service-card").length);
    });
    if (grid.parentElement.querySelector(".service-carousel-controls")) return;
    const controls = document.createElement("div");
    controls.className = "service-carousel-controls";
    controls.innerHTML = '<button type="button" class="service-carousel-arrow" data-carousel-direction="-1" aria-label="Previous treatments">‹</button><span class="service-carousel-position" aria-live="polite">1–3</span><button type="button" class="service-carousel-arrow" data-carousel-direction="1" aria-label="Next treatments">›</button>';
    grid.insertAdjacentElement("afterend", controls);
    const cards = Array.from(grid.querySelectorAll(".service-card"));
    const position = controls.querySelector(".service-carousel-position");
    const previous = controls.querySelector('[data-carousel-direction="-1"]');
    const next = controls.querySelector('[data-carousel-direction="1"]');
    const cardStep = () => cards[0] ? cards[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(grid).columnGap || getComputedStyle(grid).gap) || 0) : grid.clientWidth;
    const update = () => {
      const step = cardStep() || 1;
      const first = Math.min(cards.length, Math.max(1, Math.round(grid.scrollLeft / step) + 1));
      position.textContent = first + "–" + Math.min(cards.length, first + 2);
      cards.forEach(card => card.classList.remove("is-carousel-center"));
      if (cards.length) cards[Math.min(cards.length - 1, first)].classList.add("is-carousel-center");
      previous.disabled = grid.scrollLeft <= 2;
      next.disabled = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 2;
    };
    previous.addEventListener("click", () => grid.scrollBy({left:-cardStep(),behavior:"smooth"}));
    next.addEventListener("click", () => grid.scrollBy({left:cardStep(),behavior:"smooth"}));
    grid.addEventListener("scroll", () => window.requestAnimationFrame(update), {passive:true});
    window.addEventListener("resize", update, {passive:true});
    update();
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