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
      localStorage.setItem("nova-massage-theme", selected);
    } catch (error) {
      // Theme remains usable when storage is unavailable.
    }
  }

  let savedTheme = "dark";
  try {
    const storedTheme = localStorage.getItem("nova-massage-theme");
    if (storedTheme === "light" || storedTheme === "dark") savedTheme = storedTheme;
  } catch (error) {
    // Keep the default dark theme.
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

  // NOVA SERVICE SELECTION & SQUARE CHECKOUT
  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutCount = document.getElementById("checkoutCount");
  const checkoutSubtotal = document.getElementById("checkoutSubtotal");
  const checkoutContinue = document.getElementById("checkoutContinue");
  const checkoutClear = document.getElementById("checkoutClear");
  const checkoutTipAmount = document.getElementById("checkoutTipAmount");
  const checkoutGrandTotal = document.getElementById("checkoutGrandTotal");
  const customTipField = document.getElementById("customTipField");
  const customTipAmount = document.getElementById("customTipAmount");
  let selectedTip = 20;
  const squareLocationUrl = "https://book.squareup.com/appointments/hp03im685paf9o/location/L5GA5FY28RTBX/services";
  const selectedServices = new Map();
  // Build an Explore Now-style service gallery from the actual published service cards.
  const checkoutServiceGrid = document.getElementById("checkoutServiceGrid");
  if (checkoutServiceGrid) {
    document.querySelectorAll("#wellness .service-card").forEach((sourceCard, index) => {
      const clone = sourceCard.cloneNode(true);
      clone.classList.add("checkout-service-card");
      clone.removeAttribute("id");
      clone.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
      clone.querySelectorAll("a,button").forEach(node => node.remove());
      const image = clone.querySelector("img");
      if (image) { image.loading = "lazy"; image.alt = image.alt || "NOVA massage treatment"; }
      clone.dataset.checkoutGalleryCard = String(index);
      checkoutServiceGrid.appendChild(clone);
    });
  }
  const formatCheckoutMoney = value => "$" + value.toFixed(2);
  const checkoutEscape = value => String(value || "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  function renderCheckout() {
    if (!checkoutItems) return;
    const items = Array.from(selectedServices.values());
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const tipValue = selectedTip === "custom" ? Math.max(0, Number(customTipAmount?.value || 0)) : subtotal * Number(selectedTip) / 100;
    if (checkoutTipAmount) checkoutTipAmount.textContent = formatCheckoutMoney(tipValue);
    if (checkoutGrandTotal) checkoutGrandTotal.textContent = formatCheckoutMoney(subtotal + tipValue);
    if (checkoutCount) checkoutCount.textContent = items.length + (items.length === 1 ? " item" : " items");
    if (checkoutSubtotal) checkoutSubtotal.textContent = formatCheckoutMoney(subtotal);
    checkoutItems.innerHTML = items.length ? items.map(item =>
      '<div class="checkout-line"><div><strong>' + checkoutEscape(item.name) + '</strong><span>' + formatCheckoutMoney(item.price) + '</span></div><button type="button" data-checkout-remove="' + checkoutEscape(item.id) + '" aria-label="Remove ' + checkoutEscape(item.name) + '">Remove</button></div>'
    ).join("") : '<p class="checkout-empty">Your selection is empty. Add a service to get started.</p>';
    checkoutItems.querySelectorAll("[data-checkout-remove]").forEach(button => button.addEventListener("click", () => {
      selectedServices.delete(button.dataset.checkoutRemove);
      document.querySelectorAll("[data-checkout-add]").forEach(add => {
        if (add.dataset.checkoutAdd === button.dataset.checkoutRemove) { add.textContent = "Add to selection"; add.classList.remove("is-added"); }
      });
      renderCheckout();
    }));
    if (checkoutContinue) {
      checkoutContinue.classList.toggle("is-disabled", !items.length);
      checkoutContinue.setAttribute("aria-disabled", items.length ? "false" : "true");
      checkoutContinue.href = items.length === 1 && items[0].bookingUrl ? items[0].bookingUrl : squareLocationUrl;
      checkoutContinue.textContent = items.length ? "Continue to Square booking" : "Select a service to continue";
    }
  }
  document.querySelectorAll(".service-card").forEach((card, index) => {
    const content = card.querySelector(".service-content") || card;
    if (content.querySelector("[data-checkout-add]")) return;
    const title = card.querySelector("h4")?.textContent?.trim() || "Massage service";
    const priceText = content.textContent.match(/\$\s*([\d,]+(?:\.\d{1,2})?)/);
    const price = priceText ? Number(priceText[1].replace(/,/g, "")) : 0;
    const bookingUrl = card.querySelector("[data-square-url]")?.dataset.squareUrl || squareLocationUrl;
    const id = card.dataset.serviceId || ("nova-service-" + index);
    if (!price) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary-button checkout-add-button";
    button.dataset.checkoutAdd = id;
    button.id = "add-service-" + id;
    button.textContent = "Add to selection";
    button.addEventListener("click", () => {
      if (selectedServices.has(id)) {
        selectedServices.delete(id);
      } else {
        selectedServices.set(id, {id, name:title, price, bookingUrl});
      }
      // Keep the original menu card and its checkout-gallery twin in sync.
      document.querySelectorAll("[data-checkout-add]").forEach(addButton => {
        if (addButton.dataset.checkoutAdd !== id) return;
        const isAdded = selectedServices.has(id);
        addButton.textContent = isAdded ? "Added ✓" : "Add to selection";
        addButton.classList.toggle("is-added", isAdded);
        addButton.setAttribute("aria-pressed", isAdded ? "true" : "false");
      });
      renderCheckout();
    });
    content.appendChild(button);
  });
  document.querySelectorAll("[data-tip]").forEach(button => button.addEventListener("click", () => {
    selectedTip = button.dataset.tip === "custom" ? "custom" : Number(button.dataset.tip);
    document.querySelectorAll("[data-tip]").forEach(option => option.classList.toggle("is-active", option === button));
    if (customTipField) customTipField.hidden = selectedTip !== "custom";
    renderCheckout();
  }));
  if (customTipAmount) customTipAmount.addEventListener("input", renderCheckout);
  if (checkoutClear) checkoutClear.addEventListener("click", () => {
    selectedServices.clear();
    document.querySelectorAll("[data-checkout-add]").forEach(button => { button.textContent = "Add to selection"; button.classList.remove("is-added"); });
    renderCheckout();
  });
  if (checkoutContinue) checkoutContinue.addEventListener("click", event => {
    if (!selectedServices.size) { event.preventDefault(); document.getElementById("checkout")?.scrollIntoView({behavior:"smooth"}); return; }
    if (selectedServices.size > 1) {
      // Square's public booking page is the secure source of truth for multi-service selection.
      // Customers confirm their chosen treatments in Square before payment.
    }
  });
  renderCheckout();

  // NOVA APPOINTMENT REQUEST FORM
  const appointmentRequestForm = document.getElementById("appointmentRequestForm");
  const appointmentRequestDate = document.getElementById("appointmentRequestDate");
  const appointmentRequestStatus = document.getElementById("appointmentRequestStatus");
  const appointmentRequestServices = document.getElementById("appointmentRequestServices");
  if (appointmentRequestDate) {
    const todayLocal = new Date();
    const localDate = new Date(todayLocal.getTime() - todayLocal.getTimezoneOffset() * 60000).toISOString().slice(0,10);
    appointmentRequestDate.min = localDate;
  }
  if (appointmentRequestForm) appointmentRequestForm.addEventListener("submit", async event => {
    event.preventDefault();
    const chosen = Array.from(selectedServices.values());
    if (!chosen.length) {
      if (appointmentRequestStatus) appointmentRequestStatus.textContent = "Please add at least one service above before requesting an appointment.";
      document.getElementById("checkout")?.scrollIntoView({behavior:"smooth"});
      return;
    }
    const date = document.getElementById("appointmentRequestDate").value;
    const time = document.getElementById("appointmentRequestTime").value;
    const preferred = new Date(date + "T" + time);
    if (!date || !time || Number.isNaN(preferred.getTime()) || preferred.getTime() <= Date.now()) {
      if (appointmentRequestStatus) appointmentRequestStatus.textContent = "Please choose a future date and time.";
      return;
    }
    const payload = {
      customer_name: document.getElementById("appointmentRequestName").value.trim(),
      customer_email: document.getElementById("appointmentRequestEmail").value.trim(),
      customer_phone: document.getElementById("appointmentRequestPhone").value.trim(),
      appointment_at: date + "T" + time,
      service_name: chosen.map(item => item.name).join(", ").slice(0,500),
      notes: document.getElementById("appointmentRequestNotes").value.trim()
    };
    if (appointmentRequestServices) appointmentRequestServices.value = payload.service_name;
    const submit = document.getElementById("appointmentRequestSubmit");
    if (submit) submit.disabled = true;
    if (appointmentRequestStatus) appointmentRequestStatus.textContent = "Sending your request…";
    try {
      const response = await fetch("/api/appointment-request", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send appointment request.");
      if (appointmentRequestStatus) appointmentRequestStatus.textContent = "Your preferred appointment request has been received. It is not confirmed yet. Please call or WhatsApp +1 (708) 400-9333, or complete booking through Square.";
      appointmentRequestForm.reset();
      selectedServices.clear();
      document.querySelectorAll("[data-checkout-add]").forEach(button => {button.textContent="Add to selection";button.classList.remove("is-added");});
      renderCheckout();
    } catch (error) {
      if (appointmentRequestStatus) appointmentRequestStatus.textContent = error.message + " Please call +1 (708) 400-9333.";
    } finally { if (submit) submit.disabled = false; }
  });

  // SCROLL REVEALS
  const revealTargets = document.querySelectorAll("main > section,.about-grid,.service-card,.gallery-tile,.ritual-panel,.faq-item,.reviews-empty,.section-heading,.section-intro,.wellness-card,.review-card,.contact-grid,.about-section,.wellness-section,.reviews-section,.gallery-section,.faq-section,.contact-section");
  revealTargets.forEach((element, index) => {
    element.classList.add("js-reveal");
    element.style.transitionDelay = (index % 3) * 70 + "ms";
  });
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); } else { entry.target.classList.remove("is-visible"); }
      });
    }, { threshold: 0.12 });
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