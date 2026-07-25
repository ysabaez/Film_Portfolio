(function () {
	"use strict";

	document.getElementById("year").textContent = new Date().getFullYear();

	/* ---------- Mobile nav toggle ---------- */
	var navToggle = document.getElementById("navToggle");
	var siteNav = document.getElementById("siteNav");

	navToggle.addEventListener("click", function () {
		var open = siteNav.classList.toggle("open");
		navToggle.setAttribute("aria-expanded", open ? "true" : "false");
	});

	siteNav.querySelectorAll(".nav-link").forEach(function (link) {
		link.addEventListener("click", function () {
			siteNav.classList.remove("open");
			navToggle.setAttribute("aria-expanded", "false");
		});
	});

	/* ---------- Active section highlighting ---------- */
	var navLinks = siteNav.querySelectorAll(".nav-link");
	var sections = Array.prototype.map.call(navLinks, function (link) {
		return document.getElementById(link.getAttribute("data-section"));
	});

	if ("IntersectionObserver" in window) {
		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					var id = entry.target.id;
					navLinks.forEach(function (link) {
						link.classList.toggle("active", link.getAttribute("data-section") === id);
					});
				});
			},
			{ rootMargin: "-45% 0px -50% 0px", threshold: 0 }
		);
		sections.forEach(function (section) {
			if (section) observer.observe(section);
		});
	}

	/* ---------- Tiny drifting particle field (with shooting stars) behind the hero ---------- */
	var canvas = document.getElementById("particles");
	var particleState = null;

	function initParticles() {
		var hero = canvas.parentElement;
		var w = hero.clientWidth, h = hero.clientHeight;
		if (!w || !h) return;

		var dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = w * dpr;
		canvas.height = h * dpr;
		var ctx = canvas.getContext("2d");
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		var colors = ["rgba(230,57,70,0.5)", "rgba(255,107,118,0.4)", "rgba(210,210,214,0.3)"];

		if (!particleState || particleState.w !== w || particleState.h !== h) {
			var count = Math.round((w * h) / 9000);
			var particles = [];
			for (var i = 0; i < count; i++) {
				particles.push({
					x: Math.random() * w,
					y: Math.random() * h,
					r: Math.random() * 1.2 + 0.4,
					vx: (Math.random() - 0.5) * 0.12,
					vy: (Math.random() - 0.5) * 0.12,
					c: colors[i % colors.length]
				});
			}
			particleState = { w: w, h: h, particles: particles, shootingStars: [], nextStarAt: performance.now() + 1500 + Math.random() * 2000, raf: null };
		}

		if (particleState.raf) cancelAnimationFrame(particleState.raf);

		function spawnShootingStar() {
			var angle = (Math.PI / 180) * (20 + Math.random() * 20);
			var speed = 5 + Math.random() * 3;
			return {
				x: Math.random() * w * 0.7,
				y: -20 - Math.random() * 40,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				len: 90 + Math.random() * 70,
				alpha: 1
			};
		}

		function draw() {
			ctx.clearRect(0, 0, w, h);
			particleState.particles.forEach(function (p) {
				if (!reduceMotion) {
					p.x += p.vx;
					p.y += p.vy;
					if (p.x < -2) p.x = w + 2; else if (p.x > w + 2) p.x = -2;
					if (p.y < -2) p.y = h + 2; else if (p.y > h + 2) p.y = -2;
				}
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fillStyle = p.c;
				ctx.fill();
			});

			if (!reduceMotion) {
				var now = performance.now();
				if (now > particleState.nextStarAt && particleState.shootingStars.length < 2) {
					particleState.shootingStars.push(spawnShootingStar());
					particleState.nextStarAt = now + 3500 + Math.random() * 5500;
				}

				particleState.shootingStars = particleState.shootingStars.filter(function (s) {
					s.x += s.vx;
					s.y += s.vy;
					s.alpha -= 0.012;
					return s.alpha > 0 && s.x < w + s.len && s.y < h + s.len;
				});

				particleState.shootingStars.forEach(function (s) {
					var mag = Math.sqrt(s.vx * s.vx + s.vy * s.vy) || 1;
					var ux = s.vx / mag, uy = s.vy / mag;
					var tailX = s.x - ux * s.len, tailY = s.y - uy * s.len;
					var grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
					grad.addColorStop(0, "rgba(255,214,214,0)");
					grad.addColorStop(1, "rgba(255,255,255," + (0.85 * s.alpha) + ")");
					ctx.beginPath();
					ctx.moveTo(tailX, tailY);
					ctx.lineTo(s.x, s.y);
					ctx.strokeStyle = grad;
					ctx.lineWidth = 1.5;
					ctx.lineCap = "round";
					ctx.stroke();

					ctx.beginPath();
					ctx.arc(s.x, s.y, 1.4, 0, Math.PI * 2);
					ctx.fillStyle = "rgba(255,255,255," + s.alpha + ")";
					ctx.fill();
				});
			}

			if (!reduceMotion) particleState.raf = requestAnimationFrame(draw);
		}
		draw();
	}

	window.addEventListener("resize", initParticles);
	initParticles();

	/* ---------- YouTube video modal ---------- */
	var videoModal = document.getElementById("videoModal");
	var vmFrame = document.getElementById("vmFrame");
	var vmLastFocused = null;

	function openVideoModal(videoId, trigger) {
		vmLastFocused = trigger || document.activeElement;
		vmFrame.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0";
		videoModal.classList.add("open");
		videoModal.setAttribute("aria-hidden", "false");
		document.getElementById("vmClose").focus();
	}

	function closeVideoModal() {
		videoModal.classList.remove("open");
		videoModal.setAttribute("aria-hidden", "true");
		vmFrame.src = "";
		if (vmLastFocused) vmLastFocused.focus();
	}

	document.querySelectorAll("[data-youtube]").forEach(function (card) {
		card.addEventListener("click", function () {
			openVideoModal(card.getAttribute("data-youtube"), card);
		});
		card.addEventListener("keydown", function (e) {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				openVideoModal(card.getAttribute("data-youtube"), card);
			}
		});
	});

	document.getElementById("vmClose").addEventListener("click", closeVideoModal);
	videoModal.addEventListener("click", function (e) {
		if (e.target === videoModal) closeVideoModal();
	});
	document.addEventListener("keydown", function (e) {
		if (videoModal.classList.contains("open") && e.key === "Escape") closeVideoModal();
	});

	/* ---------- Image lightbox (thumbnails / flyers / photos) ---------- */
	var lbState = { images: [], index: 0 };
	var lightbox = document.getElementById("lightbox");
	var lbImg = document.getElementById("lbImg");
	var lbCounter = document.getElementById("lbCounter");
	var lbPrevBtn = document.getElementById("lbPrev");
	var lbNextBtn = document.getElementById("lbNext");
	var lbLastFocused = null;

	function renderLightbox() {
		lbImg.src = lbState.images[lbState.index];
		var multiple = lbState.images.length > 1;
		lbCounter.style.display = multiple ? "block" : "none";
		lbPrevBtn.style.display = multiple ? "flex" : "none";
		lbNextBtn.style.display = multiple ? "flex" : "none";
		lbCounter.textContent = (lbState.index + 1) + " / " + lbState.images.length;
	}

	function openLightbox(images, index, trigger) {
		lbLastFocused = trigger || document.activeElement;
		lbState.images = images;
		lbState.index = index;
		renderLightbox();
		lightbox.classList.add("open");
		lightbox.setAttribute("aria-hidden", "false");
		document.getElementById("lbClose").focus();
	}

	function closeLightbox() {
		lightbox.classList.remove("open");
		lightbox.setAttribute("aria-hidden", "true");
		if (lbLastFocused) lbLastFocused.focus();
	}

	document.querySelectorAll(".media-grid").forEach(function (grid) {
		var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-gallery-image]"));
		if (!cards.length) return;
		var images = cards.map(function (card) { return card.getAttribute("data-gallery-image"); });
		cards.forEach(function (card, index) {
			card.addEventListener("click", function () { openLightbox(images, index, card); });
			card.addEventListener("keydown", function (e) {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					openLightbox(images, index, card);
				}
			});
		});
	});

	document.getElementById("lbClose").addEventListener("click", closeLightbox);
	lbPrevBtn.addEventListener("click", function () {
		lbState.index = (lbState.index - 1 + lbState.images.length) % lbState.images.length;
		renderLightbox();
	});
	lbNextBtn.addEventListener("click", function () {
		lbState.index = (lbState.index + 1) % lbState.images.length;
		renderLightbox();
	});
	lightbox.addEventListener("click", function (e) {
		if (e.target === lightbox) closeLightbox();
	});
	document.addEventListener("keydown", function (e) {
		if (!lightbox.classList.contains("open")) return;
		if (e.key === "Escape") closeLightbox();
		if (e.key === "ArrowLeft") lbPrevBtn.click();
		if (e.key === "ArrowRight") lbNextBtn.click();
	});
})();
