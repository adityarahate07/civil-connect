/**
 * CivilConnect - Master Application Controller
 * Serving Buldhana District, Maharashtra
 * Implements Sections 30 to 52: Welcome Splash, Multi-Step Auth, Role Dashboards,
 * Reactive Search, Micro-Interactions, Animated Charts, and District Notifications.
 */

(function (window) {
  'use strict';

  class CivilConnectApp {
    constructor() {
      this.currentRegStep = 1;
      this.selectedJobForApply = null;
      this.activePage = 'home';
      this.initTheme();
    }

    init() {
      this.setupEventListeners();
      this.setupScrollObserver();
      this.setupStickyNavbar();
      this.renderAll();
      this.initWelcomeScreen();
      this.animateHeroCounters();

      // Subscribe to DB changes
      window.CivilConnectDB.subscribe(() => {
        this.renderAll();
      });

      // Handle URL hash on load
      this.handleHashChange();
      window.addEventListener('hashchange', () => this.handleHashChange());
    }

    // ========================================================
    // SECTION 48: THEME INITIALIZATION & SWITCHER
    // ========================================================
    initTheme() {
      const saved = window.CivilConnectDB.getTheme();
      this.applyTheme(saved);
    }

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      window.CivilConnectDB.setTheme(theme);
      const icon = document.getElementById('themeIcon');
      if (icon) {
        icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      }
      if (window.CivilConnectCharts) {
        window.CivilConnectCharts.setTheme(theme === 'dark');
        this.renderCharts();
      }
    }

    toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      this.applyTheme(next);
      this.showToast('info', `Switched to ${next === 'dark' ? '🌙 Dark' : '☀️ Light'} Mode`);
    }

    // ========================================================
    // SECTION 30, 31, 32: WELCOME / SPLASH SCREEN
    // ========================================================
    initWelcomeScreen() {
      const welcome = document.getElementById('welcomeScreen');
      if (!welcome) return;

      // Check if user already dismissed welcome in this session
      const dismissed = sessionStorage.getItem('civilconnect_welcome_dismissed');
      if (dismissed === 'true') {
        welcome.classList.add('dismissed');
      } else {
        welcome.classList.remove('dismissed');
      }

      const btnGetStarted = document.getElementById('btnGetStarted');
      const btnExploreJobs = document.getElementById('btnExploreJobs');
      const btnBackToWelcome = document.getElementById('btnBackToWelcome');

      if (btnGetStarted) {
        btnGetStarted.onclick = () => this.showWelcomeRoleSelect();
      }

      if (btnExploreJobs) {
        btnExploreJobs.onclick = () => {
          this.dismissWelcome();
          this.scrollToSection('jobs');
          this.showToast('info', 'Welcome to CivilConnect Buldhana! Exploring active jobs.', 'Welcome 🏗️');
        };
      }

      if (btnBackToWelcome) {
        btnBackToWelcome.onclick = () => this.showWelcomeSplashMain();
      }
    }

    showWelcomeRoleSelect() {
      const splashMain = document.getElementById('welcomeSplashMain');
      const roleSelect = document.getElementById('welcomeRoleSelect');
      if (splashMain && roleSelect) {
        splashMain.style.display = 'none';
        roleSelect.classList.add('active');
      }
    }

    showWelcomeSplashMain() {
      const splashMain = document.getElementById('welcomeSplashMain');
      const roleSelect = document.getElementById('welcomeRoleSelect');
      if (splashMain && roleSelect) {
        splashMain.style.display = 'block';
        roleSelect.classList.remove('active');
      }
    }

    dismissWelcome() {
      const welcome = document.getElementById('welcomeScreen');
      if (welcome) {
        welcome.classList.add('dismissed');
        sessionStorage.setItem('civilconnect_welcome_dismissed', 'true');
      }
    }

    replayWelcome() {
      const welcome = document.getElementById('welcomeScreen');
      if (welcome) {
        welcome.classList.remove('dismissed');
        this.showWelcomeSplashMain();
      }
    }

    // Section 32: Select role from welcome screen and proceed to registration
    selectRoleAndRegister(role) {
      this.dismissWelcome();
      this.openRegisterWithRole(role);
    }

    // ========================================================
    // SECTION 35: STICKY NAVBAR & NAVIGATION
    // ========================================================
    setupStickyNavbar() {
      const navbar = document.getElementById('mainNavbar');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          navbar.classList.add('navbar-scrolled');
        } else {
          navbar.classList.remove('navbar-scrolled');
        }
      });

      const hamburgerBtn = document.getElementById('hamburgerBtn');
      const mobileDrawer = document.getElementById('mobileDrawer');
      if (hamburgerBtn && mobileDrawer) {
        hamburgerBtn.onclick = () => {
          hamburgerBtn.classList.toggle('hamburger-active');
          mobileDrawer.classList.toggle('open');
        };
      }

      const themeToggleBtn = document.getElementById('themeToggleBtn');
      if (themeToggleBtn) {
        themeToggleBtn.onclick = () => this.toggleTheme();
      }

      const navBellBtn = document.getElementById('navBellBtn');
      if (navBellBtn) {
        navBellBtn.onclick = () => {
          this.navigateTo('home');
          this.scrollToSection('notifications');
        };
      }
    }

    closeMobileMenu() {
      const hamburgerBtn = document.getElementById('hamburgerBtn');
      const mobileDrawer = document.getElementById('mobileDrawer');
      if (hamburgerBtn) hamburgerBtn.classList.remove('hamburger-active');
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    }

    handleHashChange() {
      const hash = window.location.hash.replace('#', '') || 'home';
      if (hash === 'dashboard') {
        this.navigateTo('dashboard');
      } else if (hash === 'about') {
        this.navigateTo('about');
      } else if (['jobs', 'workers', 'sites', 'notifications', 'home'].includes(hash)) {
        this.navigateTo('home');
        if (hash !== 'home') {
          setTimeout(() => this.scrollToSection(hash), 100);
        }
      }
    }

    // SECTION 34: MAIN PAGE TRANSITIONS (200-400ms duration)
    navigateTo(page) {
      this.activePage = page;
      const pages = {
        home: document.getElementById('pageHome'),
        dashboard: document.getElementById('pageDashboard'),
        about: document.getElementById('pageAbout')
      };

      Object.keys(pages).forEach((p) => {
        if (pages[p]) {
          pages[p].classList.remove('active-page');
        }
      });

      if (pages[page]) {
        pages[page].classList.add('active-page');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Update Nav Link Active class
      const navLinks = document.querySelectorAll('.navbar-links a');
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === '#' + page) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      if (page === 'dashboard') {
        this.renderDashboard();
      }
    }

    scrollToSection(sectionId) {
      if (this.activePage !== 'home') {
        this.navigateTo('home');
      }
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }

    // ========================================================
    // SECTION 41: SCROLL-BASED REVEAL OBSERVER
    // ========================================================
    setupScrollObserver() {
      if (!('IntersectionObserver' in window)) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal-active');
            }
          });
        },
        { threshold: 0.12 }
      );

      document.querySelectorAll('.reveal-init').forEach((el) => observer.observe(el));
    }

    // ========================================================
    // SECTION 36: HERO COUNTERS ANIMATION
    // ========================================================
    animateHeroCounters() {
      const stats = window.CivilConnectDB.getStats();
      const elWorkers = document.getElementById('statWorkers');
      const elContractors = document.getElementById('statContractors');
      const elSites = document.getElementById('statSites');
      const elJobs = document.getElementById('statJobs');

      if (window.CivilConnectCharts) {
        window.CivilConnectCharts.animateCounter(elWorkers, stats.workersCount, '', '+');
        window.CivilConnectCharts.animateCounter(elContractors, stats.contractorsCount, '', '+');
        window.CivilConnectCharts.animateCounter(elSites, stats.sitesCount, '', '+');
        window.CivilConnectCharts.animateCounter(elJobs, stats.jobsCount, '', '+');
      }
    }

    // ========================================================
    // RENDER ALL DATA
    // ========================================================
    renderAll() {
      this.updateNavbarUserBadge();
      this.renderUrgentWorkers();
      this.renderJobs();
      this.renderSites();
      this.renderNotifications();
      this.renderDashboard();
    }

    updateNavbarUserBadge() {
      const user = window.CivilConnectDB.getCurrentUser();
      const roleIcons = {
        worker: '👷',
        contractor: '🏗️',
        builder: '🏢',
        supervisor: '🦺'
      };

      const iconEl = document.getElementById('navRoleIcon');
      const nameEl = document.getElementById('navUserName');
      if (iconEl && nameEl && user) {
        iconEl.textContent = roleIcons[user.role] || '👷';
        const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        nameEl.textContent = `${user.name.split(' ')[0]} (${roleLabel})`;
      }

      // Unread bell count
      const notifs = window.CivilConnectDB.getNotifications();
      const unreadCount = notifs.filter((n) => n.isNew).length;
      const badge = document.getElementById('bellBadgeCount');
      if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
      }
    }

    // ========================================================
    // SECTION 38: "WORKERS NEEDED NOW" (URGENT REQUIREMENTS)
    // ========================================================
    renderUrgentWorkers() {
      const container = document.getElementById('urgentWorkersContainer');
      if (!container) return;

      const urgentJobs = window.CivilConnectDB.getUrgentRequirements();
      if (urgentJobs.length === 0) {
        container.innerHTML = `
          <div class="empty-state-box">
            <div class="empty-state-icon"><i class="fa-solid fa-circle-check"></i></div>
            <h3>No Urgent Labour Shortages Right Now</h3>
            <p>All emergency worker requirements in Buldhana have been filled.</p>
          </div>
        `;
        return;
      }

      let html = '';
      urgentJobs.forEach((job, index) => {
        html += `
          <div class="urgent-worker-card role-card-item reveal-init reveal-fade-up stagger-${(index % 4) + 1}">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <span class="urgent-pill urgent-badge-pulse">
                  <span class="urgent-dot-pulse"></span> URGENT
                </span>
                <span style="font-size: 12px; font-weight: 700; color: #10b981;">₹${job.wage}/day</span>
              </div>
              <h3 style="font-size: 17px; font-weight: 800; color: var(--text-primary); margin-bottom: 6px;">
                ${job.category}
              </h3>
              <p style="font-size: 13.5px; font-weight: 700; color: var(--brand-amber); margin-bottom: 6px;">
                <i class="fa-solid fa-users"></i> ${job.workersNeeded} Workers Needed
              </p>
              <p style="font-size: 13px; color: var(--text-secondary);">
                <i class="fa-solid fa-location-dot" style="color: var(--brand-amber);"></i> ${job.location}, ${job.taluka}
              </p>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 10px;">
              <button class="btn-primary btn-sm" style="flex: 1;" onclick="CivilConnectApp.openJobDetail('${job.id}')">
                Apply Now <i class="fa-solid fa-arrow-right"></i>
              </button>
              <a href="tel:${job.contractorPhone}" class="btn-secondary btn-sm" title="Call Contractor Directly">
                <i class="fa-solid fa-phone"></i>
              </a>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
      this.setupScrollObserver();
    }

    // ========================================================
    // SECTION 37: CONSTRUCTION JOB CARDS
    // ========================================================
    renderJobs(filters = {}) {
      const container = document.getElementById('jobsContainer');
      if (!container) return;

      const jobs = window.CivilConnectDB.getJobs(filters);

      if (jobs.length === 0) {
        // SECTION 44: EMPTY STATE DESIGN
        container.innerHTML = `
          <div class="empty-state-box">
            <div class="empty-state-icon"><i class="fa-solid fa-trowel-bricks"></i></div>
            <h3>No Construction Jobs Match Your Filters</h3>
            <p>Try resetting your search query or selecting "All 13 Talukas".</p>
            <button class="btn-primary btn-sm" onclick="CivilConnectApp.resetFilters()">
              <i class="fa-solid fa-rotate-left"></i> Clear Filters
            </button>
          </div>
        `;
        return;
      }

      let html = '';
      jobs.forEach((job, index) => {
        const urgentBadge = job.urgent
          ? `<span class="urgent-pill urgent-badge-pulse" style="font-size: 10.5px;"><span class="urgent-dot-pulse"></span> URGENT</span>`
          : `<span style="font-size: 11px; background: rgba(59, 130, 246, 0.12); color: #3b82f6; padding: 2px 8px; border-radius: 6px; font-weight: 700;">Standard</span>`;

        html += `
          <div class="job-card job-card-wrapper reveal-init reveal-fade-up stagger-${(index % 4) + 1}">
            <div>
              <div class="job-card-top">
                <div>
                  <span style="font-size: 11.5px; font-weight: 700; color: var(--brand-amber); text-transform: uppercase;">${job.category}</span>
                  <h3 class="job-card-title">${job.title}</h3>
                </div>
                ${urgentBadge}
              </div>

              <div class="job-card-meta" style="margin-top: 14px;">
                <div class="job-card-meta-item">
                  <i class="fa-solid fa-location-dot"></i>
                  <span><strong>${job.taluka}</strong> — ${job.location}</span>
                </div>
                <div class="job-card-meta-item">
                  <i class="fa-solid fa-users"></i>
                  <span>${job.workersNeeded} Workers Required (${job.workersFilled || 0} Filled)</span>
                </div>
                <div class="job-card-meta-item">
                  <i class="fa-solid fa-indian-rupee-sign"></i>
                  <span class="job-wage-tag">₹${job.wage} ${job.wageType}</span>
                </div>
                <div class="job-card-meta-item">
                  <i class="fa-solid fa-building-user"></i>
                  <span style="color: var(--text-muted); font-size: 12.5px;">${job.contractorName}</span>
                </div>
              </div>
            </div>

            <div class="job-card-footer">
              <span style="font-size: 12px; color: var(--text-muted);">
                <i class="fa-regular fa-clock"></i> ${job.timeAgo || 'Recent'}
              </span>

              <button class="btn-primary btn-sm btn-interactive" onclick="CivilConnectApp.openJobDetail('${job.id}')">
                <span>View Requirement</span>
                <i class="fa-solid fa-arrow-right job-btn-arrow"></i>
              </button>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
      this.setupScrollObserver();
    }

    // ========================================================
    // SECTION 39: CONSTRUCTION SITE CARDS
    // ========================================================
    renderSites(taluka = 'all') {
      const container = document.getElementById('sitesContainer');
      if (!container) return;

      const sites = window.CivilConnectDB.getSites(taluka);

      let html = '';
      sites.forEach((site, index) => {
        html += `
          <div class="site-card reveal-init reveal-fade-up stagger-${(index % 3) + 1}">
            <div class="site-visual-banner site-image-container">
              <!-- Animated Site Graphic -->
              <svg viewBox="0 0 320 160" style="width: 100%; height: 100%;">
                <rect width="320" height="160" fill="#0f172a" />
                <!-- Grid background -->
                <path d="M 0,40 L 320,40 M 0,80 L 320,80 M 0,120 L 320,120" stroke="rgba(245, 158, 11, 0.12)" stroke-width="1" />
                <path d="M 60,0 L 60,160 M 120,0 L 120,160 M 180,0 L 180,160 M 240,0 L 240,160" stroke="rgba(245, 158, 11, 0.12)" stroke-width="1" />
                <!-- Building frame -->
                <rect x="70" y="45" width="180" height="115" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
                <!-- Windows/Slabs -->
                <rect x="90" y="60" width="30" height="20" fill="rgba(245, 158, 11, 0.3)" />
                <rect x="145" y="60" width="30" height="20" fill="rgba(245, 158, 11, 0.3)" />
                <rect x="200" y="60" width="30" height="20" fill="rgba(245, 158, 11, 0.3)" />
                <rect x="90" y="95" width="30" height="20" fill="rgba(245, 158, 11, 0.3)" />
                <rect x="145" y="95" width="30" height="20" fill="rgba(245, 158, 11, 0.3)" />
                <rect x="200" y="95" width="30" height="20" fill="rgba(245, 158, 11, 0.3)" />
                <!-- Scaffolding lines -->
                <line x1="250" y1="45" x2="280" y2="160" stroke="#fbbf24" stroke-width="1.5" />
                <line x1="280" y1="45" x2="250" y2="160" stroke="#fbbf24" stroke-width="1.5" />
              </svg>
              <span class="site-status-pill"><i class="fa-solid fa-circle-check"></i> ${site.status}</span>
            </div>

            <div class="site-card-body">
              <div>
                <span style="font-size: 11.5px; font-weight: 700; color: var(--brand-amber); text-transform: uppercase;">
                  ${site.projectType}
                </span>
                <h3 style="margin-top: 4px;">${site.name}</h3>
                <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
                  <i class="fa-solid fa-location-dot" style="color: var(--brand-amber);"></i> ${site.location}, <strong>${site.taluka}</strong>
                </p>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; font-weight: 600;">
                  <span>Stage: ${site.stage}</span>
                  <span style="color: var(--brand-amber);">${site.progress}%</span>
                </div>
                <div class="site-progress-bar-wrap">
                  <div class="site-progress-fill" style="width: ${site.progress}%;"></div>
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--border-color); font-size: 12.5px;">
                <span style="color: var(--text-secondary);"><i class="fa-solid fa-person-digging" style="color: var(--brand-amber);"></i> ${site.workersActive}/${site.workersRequired} Workers Active</span>
                <button class="btn-secondary btn-sm" onclick="CivilConnectApp.showSiteModal('${site.id}')">
                  View Site <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
      this.setupScrollObserver();
    }

    // ========================================================
    // SECTION 40: BULDHANA NOTIFICATIONS SECTION
    // ========================================================
    renderNotifications(taluka = 'all') {
      const container = document.getElementById('notificationsContainer');
      if (!container) return;

      const notifs = window.CivilConnectDB.getNotifications(taluka);

      if (notifs.length === 0) {
        container.innerHTML = `
          <div class="empty-state-box" style="padding: 30px;">
            <div class="empty-state-icon"><i class="fa-solid fa-bell-slash"></i></div>
            <h3>No Updates for ${taluka}</h3>
            <p>No new labour notifications currently posted for this taluka.</p>
          </div>
        `;
        return;
      }

      let html = '';
      notifs.forEach((n, index) => {
        const badgeNew = n.isNew
          ? `<span class="badge-new-glow" style="padding: 2px 7px; border-radius: 4px; font-size: 10px; margin-left: 6px;">NEW</span>`
          : '';

        html += `
          <div class="notification-card reveal-init reveal-fade-up stagger-${(index % 3) + 1}">
            <div class="notif-left">
              <div class="notif-icon-box">
                <i class="fa-solid ${n.icon || 'fa-bell'}"></i>
              </div>
              <div class="notif-details">
                <h4>
                  <span>${n.title}</span>
                  ${badgeNew}
                </h4>
                <p>${n.detail}</p>
                <div style="display: flex; gap: 12px; margin-top: 6px; font-size: 11.5px; color: var(--text-muted);">
                  <span><i class="fa-solid fa-location-dot" style="color: var(--brand-amber);"></i> ${n.taluka}</span>
                  <span><i class="fa-regular fa-clock"></i> ${n.timeAgo}</span>
                </div>
              </div>
            </div>

            <div>
              ${
                n.jobId
                  ? `<button class="btn-primary btn-sm" onclick="CivilConnectApp.openJobDetail('${n.jobId}')">View Requirement</button>`
                  : `<button class="btn-secondary btn-sm" onclick="CivilConnectApp.markNotifRead('${n.id}')">Dismiss</button>`
              }
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
      this.setupScrollObserver();
    }

    filterNotifsByTaluka(taluka) {
      const tabs = document.querySelectorAll('#notifTalukaTabs .filter-tab-btn');
      tabs.forEach((tab) => {
        if (tab.textContent.includes(taluka) || (taluka === 'all' && tab.textContent.includes('All'))) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
      this.renderNotifications(taluka);
    }

    simulateNewNotification() {
      const talukas = ['Khamgaon', 'Mehkar', 'Buldhana', 'Shegaon', 'Chikhli', 'Malkapur'];
      const randomTaluka = talukas[Math.floor(Math.random() * talukas.length)];
      const skills = ['Masons', 'Helpers', 'RCC Bar Benders', 'Carpenters', 'Electricians'];
      const randomSkill = skills[Math.floor(Math.random() * skills.length)];
      const count = Math.floor(Math.random() * 10) + 4;
      const wage = 750 + Math.floor(Math.random() * 5) * 50;

      const newNotif = window.CivilConnectDB.addNotification({
        icon: 'fa-triangle-exclamation',
        title: `URGENT: ${count} ${randomSkill} Needed in ${randomTaluka}`,
        taluka: randomTaluka,
        category: randomSkill,
        detail: `Daily wage ₹${wage}/day. Work commences tomorrow morning. Immediate hiring.`,
        urgency: 'high'
      });

      this.showToast('success', `New Buldhana Alert: ${count} ${randomSkill} in ${randomTaluka}!`, '🔔 Live Notification');
      this.renderNotifications();
      this.updateNavbarUserBadge();
    }

    markNotifRead(id) {
      window.CivilConnectDB.markNotificationRead(id);
      this.renderNotifications();
      this.updateNavbarUserBadge();
    }

    markAllNotificationsRead() {
      window.CivilConnectDB.markAllNotificationsRead();
      this.renderNotifications();
      this.updateNavbarUserBadge();
      this.showToast('info', 'All notifications marked as read.');
    }

    // ========================================================
    // SECTION 46 & 47: ROLE-SPECIFIC DASHBOARD & CHARTS
    // ========================================================
    renderDashboard() {
      const user = window.CivilConnectDB.getCurrentUser();
      if (!user) return;

      const heading = document.getElementById('roleWelcomeHeading');
      const subtitle = document.getElementById('roleWelcomeSubtitle');

      // SECTION 46: Personalized Role Welcome
      const greetings = {
        worker: {
          title: `Welcome back, ${user.name} 👷`,
          sub: "Let's find your next construction opportunity in Buldhana District."
        },
        contractor: {
          title: `Welcome back, ${user.name} 🏗️`,
          sub: 'Find skilled workers and manage active labour requirements.'
        },
        builder: {
          title: `Welcome back, ${user.name} 🏢`,
          sub: 'Manage your construction sites and overall workforce deployment.'
        },
        supervisor: {
          title: `Welcome back, ${user.name} 🦺`,
          sub: "Manage today's construction shift, muster roll, and site safety."
        }
      };

      const g = greetings[user.role] || greetings.worker;
      if (heading) heading.textContent = g.title;
      if (subtitle) subtitle.textContent = g.sub;

      // Update active role chip
      ['Worker', 'Contractor', 'Builder', 'Supervisor'].forEach((r) => {
        const chip = document.getElementById(`chip${r}`);
        if (chip) {
          if (r.toLowerCase() === user.role) chip.classList.add('active');
          else chip.classList.remove('active');
        }
      });

      // SECTION 47: ANIMATED DASHBOARD METRICS (0 -> Target)
      this.renderDashboardStats(user.role);

      // SECTION 47: RENDER CHARTS
      this.renderCharts();

      // Render Role-specific tab panes
      this.renderRolePanes(user);
    }

    renderDashboardStats(role) {
      const row = document.getElementById('dashboardStatsRow');
      if (!row) return;

      const dbStats = window.CivilConnectDB.getStats();

      let metrics = [];
      if (role === 'worker') {
        metrics = [
          { label: 'Active Jobs in District', target: dbStats.rawActiveJobs, icon: 'fa-briefcase' },
          { label: 'My Submitted Applications', target: 2, icon: 'fa-file-lines' },
          { label: 'Average Mason Wage', target: 900, prefix: '₹', suffix: '/day', icon: 'fa-indian-rupee-sign' },
          { label: 'Verified Sites in Buldhana', target: dbStats.rawActiveSites, icon: 'fa-building' }
        ];
      } else if (role === 'contractor') {
        metrics = [
          { label: 'My Posted Requirements', target: 4, icon: 'fa-bullhorn' },
          { label: 'Workers Hired this Month', target: 42, icon: 'fa-user-check' },
          { label: 'Candidate Applications', target: 19, icon: 'fa-users' },
          { label: 'Active Work Sites', target: 3, icon: 'fa-trowel-bricks' }
        ];
      } else if (role === 'builder') {
        metrics = [
          { label: 'Active Construction Sites', target: 3, icon: 'fa-building' },
          { label: 'Total On-Site Workforce', target: 86, icon: 'fa-users-gear' },
          { label: 'Avg Project Completion', target: 68, suffix: '%', icon: 'fa-chart-pie' },
          { label: 'Safety Compliance Rating', target: 98, suffix: '%', icon: 'fa-shield-halved' }
        ];
      } else {
        // Supervisor
        metrics = [
          { label: "Today's Present Workers", target: 28, suffix: '/30', icon: 'fa-clipboard-user' },
          { label: 'Supervised Project Sites', target: 2, icon: 'fa-vest' },
          { label: 'Safety Tool Box Talks', target: 14, icon: 'fa-helmet-safety' },
          { label: 'Shift Hours Completed', target: 8, suffix: ' hrs', icon: 'fa-business-time' }
        ];
      }

      let html = '';
      metrics.forEach((m, idx) => {
        html += `
          <div class="dashboard-stat-card">
            <div class="stat-icon-wrapper">
              <i class="fa-solid ${m.icon}"></i>
            </div>
            <div class="stat-info">
              <div class="stat-num" id="dashMetric${idx}">0</div>
              <div class="stat-desc">${m.label}</div>
            </div>
          </div>
        `;
      });
      row.innerHTML = html;

      // Animate Counters (Section 47)
      if (window.CivilConnectCharts) {
        metrics.forEach((m, idx) => {
          const el = document.getElementById(`dashMetric${idx}`);
          window.CivilConnectCharts.animateCounter(el, m.target, m.prefix || '', m.suffix || '', 1000);
        });
      }
    }

    renderCharts() {
      if (!window.CivilConnectCharts) return;

      const talukaData = window.CivilConnectDB.getTalukaAnalytics();
      window.CivilConnectCharts.renderTalukaBarChart('talukaChartContainer', talukaData);

      const skillData = window.CivilConnectDB.getSkillAnalytics();
      window.CivilConnectCharts.renderSkillDoughnutChart('skillChartContainer', skillData);

      window.CivilConnectCharts.renderHiringAreaChart('hiringChartContainer');
    }

    renderRolePanes(user) {
      const container = document.getElementById('roleSpecificPanes');
      if (!container) return;

      if (user.role === 'worker') {
        const apps = window.CivilConnectDB.getApplications();
        container.innerHTML = `
          <div class="chart-card">
            <div class="chart-card-header">
              <div>
                <h3>My Submitted Job Applications</h3>
                <p style="font-size: 12px; color: var(--text-muted);">Track contractor responses and joining dates</p>
              </div>
              <button class="btn-primary btn-sm" onclick="CivilConnectApp.scrollToSection('jobs')">Apply for More Jobs</button>
            </div>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left;">
                <thead>
                  <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-muted); font-size: 12px; text-transform: uppercase;">
                    <th style="padding: 10px 14px;">Requirement</th>
                    <th style="padding: 10px 14px;">Taluka</th>
                    <th style="padding: 10px 14px;">Applied Date</th>
                    <th style="padding: 10px 14px;">Status</th>
                    <th style="padding: 10px 14px;">Contractor Note</th>
                  </tr>
                </thead>
                <tbody>
                  ${apps
                    .map(
                      (a) => `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                      <td style="padding: 12px 14px; font-weight: 700;">${a.jobTitle}</td>
                      <td style="padding: 12px 14px;">${a.taluka}</td>
                      <td style="padding: 12px 14px; color: var(--text-muted); font-size: 12px;">${new Date(a.appliedDate).toLocaleDateString()}</td>
                      <td style="padding: 12px 14px;">
                        <span style="padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; ${
                          a.status === 'Accepted'
                            ? 'background: rgba(16, 185, 129, 0.15); color: #10b981;'
                            : 'background: rgba(245, 158, 11, 0.15); color: var(--brand-amber);'
                        }">${a.status}</span>
                      </td>
                      <td style="padding: 12px 14px; color: var(--text-secondary); font-size: 12.5px;">${a.notes || 'Under review by contractor'}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      } else if (user.role === 'contractor') {
        container.innerHTML = `
          <div class="chart-card">
            <div class="chart-card-header">
              <div>
                <h3>My Active Labour Postings</h3>
                <p style="font-size: 12px; color: var(--text-muted);">Manage requirements posted for Khamgaon & Mehkar</p>
              </div>
              <button class="btn-primary btn-sm" onclick="CivilConnectApp.openPostJobModal()">
                <i class="fa-solid fa-plus"></i> Post New Requirement
              </button>
            </div>
            <p style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.6;">
              You have <strong>4 active job postings</strong> across Buldhana District. 19 applications have been submitted by local masons and helpers. You can view applicant numbers, verify their experience, and direct-call them from your dashboard.
            </p>
          </div>
        `;
      } else if (user.role === 'builder') {
        container.innerHTML = `
          <div class="chart-card">
            <div class="chart-card-header">
              <div>
                <h3>Project Workforce & Sub-Contractor Management</h3>
                <p style="font-size: 12px; color: var(--text-muted);">Buldhana Sadar and Khamgaon site tracking</p>
              </div>
              <button class="btn-primary btn-sm" onclick="CivilConnectApp.openAddSiteModal()">
                <i class="fa-solid fa-plus"></i> Add New Construction Site
              </button>
            </div>
            <p style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.6;">
              Monitoring 3 major projects: <strong>Buldhana Sadar Complex</strong> (45 workers active), <strong>Khamgaon Bypass Plaza</strong> (18 workers active), and <strong>Mehkar Civil Hospital Block</strong> (30 workers active). All site muster rolls and milestone completion percentages are synchronized in real-time.
            </p>
          </div>
        `;
      } else {
        // Supervisor Muster Roll (Section 47)
        const attendance = [
          { name: 'Ramesh Jadhav', role: 'Lead Mason', status: 'Present', time: '08:15 AM' },
          { name: 'Santosh Gaikwad', role: 'Helper', status: 'Present', time: '08:25 AM' },
          { name: 'Vikas Solanke', role: 'Electrician', status: 'Present', time: '08:40 AM' },
          { name: 'Anil Rathod', role: 'Carpenter', status: 'Late', time: '09:10 AM' },
          { name: 'Sunil Wankhede', role: 'RCC Binder', status: 'Present', time: '08:20 AM' },
          { name: 'Prakash Chavan', role: 'Helper', status: 'Absent', time: '-' }
        ];

        container.innerHTML = `
          <div class="chart-card">
            <div class="chart-card-header">
              <div>
                <h3>Today's Daily Muster Roll (Worker Attendance)</h3>
                <p style="font-size: 12px; color: var(--text-muted);">Site: Shegaon Pilgrim Complex • Shift: 08:30 AM - 05:30 PM</p>
              </div>
              <button class="btn-primary btn-sm" onclick="CivilConnectApp.showToast('success', 'Today\\'s Muster Roll Saved Successfully!')">
                <i class="fa-solid fa-check"></i> Save Daily Attendance
              </button>
            </div>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; text-align: left;">
                <thead>
                  <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-muted); font-size: 12px; text-transform: uppercase;">
                    <th style="padding: 10px 14px;">Worker Name</th>
                    <th style="padding: 10px 14px;">Trade</th>
                    <th style="padding: 10px 14px;">Check-In</th>
                    <th style="padding: 10px 14px;">Status</th>
                    <th style="padding: 10px 14px;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${attendance
                    .map(
                      (item) => `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                      <td style="padding: 12px 14px; font-weight: 700;">${item.name}</td>
                      <td style="padding: 12px 14px;">${item.role}</td>
                      <td style="padding: 12px 14px; color: var(--text-muted); font-size: 12.5px;">${item.time}</td>
                      <td style="padding: 12px 14px;">
                        <span style="padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; ${
                          item.status === 'Present'
                            ? 'background: rgba(16, 185, 129, 0.15); color: #10b981;'
                            : item.status === 'Late'
                            ? 'background: rgba(245, 158, 11, 0.15); color: var(--brand-amber);'
                            : 'background: rgba(239, 68, 68, 0.15); color: #ef4444;'
                        }">${item.status}</span>
                      </td>
                      <td style="padding: 12px 14px;">
                        <button class="btn-secondary btn-sm" style="padding: 4px 8px; font-size: 11px;" onclick="CivilConnectApp.showToast('info', 'Attendance status toggled for ${item.name}')">Toggle</button>
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }
    }

    switchDemoRole(role) {
      window.CivilConnectDB.switchRole(role);
      this.updateNavbarUserBadge();
      this.renderDashboard();
      this.showToast('success', `Switched view to ${role.toUpperCase()}`, 'Role Perspective');
    }

    // ========================================================
    // SEARCH & FILTER HANDLERS
    // ========================================================
    setupEventListeners() {
      const btnApplySearch = document.getElementById('btnApplySearch');
      const btnResetFilters = document.getElementById('btnResetFilters');

      if (btnApplySearch) {
        btnApplySearch.onclick = () => this.applySearch();
      }

      if (btnResetFilters) {
        btnResetFilters.onclick = () => this.resetFilters();
      }

      // Live search input on enter
      const searchInput = document.getElementById('searchKeywordInput');
      if (searchInput) {
        searchInput.onkeydown = (e) => {
          if (e.key === 'Enter') this.applySearch();
        };
      }
    }

    applySearch() {
      const keyword = (document.getElementById('searchKeywordInput').value || '').trim();
      const taluka = document.getElementById('filterTalukaSelect').value;
      const category = document.getElementById('filterCategorySelect').value;

      this.renderJobs({
        search: keyword,
        taluka: taluka,
        category: category
      });

      this.scrollToSection('jobs');
      this.showToast('info', 'Filtered construction jobs in Buldhana.');
    }

    resetFilters() {
      const kw = document.getElementById('searchKeywordInput');
      const t = document.getElementById('filterTalukaSelect');
      const c = document.getElementById('filterCategorySelect');
      if (kw) kw.value = '';
      if (t) t.value = 'all';
      if (c) c.value = 'all';

      this.renderJobs();
      this.showToast('info', 'Filters reset to default.');
    }

    filterByCategory(category) {
      const c = document.getElementById('filterCategorySelect');
      if (c) c.value = category;
      this.renderJobs({ category: category });
      this.scrollToSection('jobs');
    }

    filterByTaluka(taluka) {
      const t = document.getElementById('filterTalukaSelect');
      if (t) t.value = taluka;
      this.renderJobs({ taluka: taluka });
      this.scrollToSection('jobs');
    }

    filterUrgentOnly() {
      this.renderJobs({ urgentOnly: true });
      this.scrollToSection('jobs');
      this.showToast('info', 'Showing urgent requirements across Buldhana.');
    }

    // ========================================================
    // SECTION 33: MULTI-STEP REGISTRATION CONTROLLER (5 STEPS)
    // ========================================================
    openRegister() {
      this.closeLogin();
      const modal = document.getElementById('registerModal');
      if (modal) modal.classList.add('open');
      this.currentRegStep = 1;
      this.updateRegStepUI();
    }

    openRegisterWithRole(role) {
      this.openRegister();
      const select = document.getElementById('regRoleSelect');
      if (select) {
        select.value = role;
        this.handleRegRoleChange();
      }
    }

    closeRegister() {
      const modal = document.getElementById('registerModal');
      if (modal) modal.classList.remove('open');
    }

    handleRegRoleChange() {
      const role = document.getElementById('regRoleSelect').value;
      const workerSkills = document.getElementById('regWorkerSkillsBlock');
      const companyBlock = document.getElementById('regCompanyBlock');

      if (role === 'worker') {
        if (workerSkills) workerSkills.style.display = 'block';
        if (companyBlock) companyBlock.style.display = 'none';
      } else {
        if (workerSkills) workerSkills.style.display = 'none';
        if (companyBlock) companyBlock.style.display = 'block';
      }
    }

    nextRegStep() {
      // Validate current step fields
      if (this.currentRegStep === 1) {
        const name = document.getElementById('regFullNameInput').value.trim();
        const phone = document.getElementById('regPhoneInput').value.trim();
        const pwd = document.getElementById('regPasswordInput').value;
        const cpwd = document.getElementById('regConfirmPasswordInput').value;

        if (!name || !phone || !pwd) {
          this.showToast('error', 'Please fill in your name, mobile number, and password.');
          return;
        }
        if (pwd !== cpwd) {
          this.showToast('error', 'Passwords do not match.');
          return;
        }
      }

      if (this.currentRegStep < 5) {
        this.currentRegStep++;
        this.updateRegStepUI();
      }
    }

    prevRegStep() {
      if (this.currentRegStep > 1) {
        this.currentRegStep--;
        this.updateRegStepUI();
      }
    }

    updateRegStepUI() {
      // Update Step Panes
      for (let i = 1; i <= 5; i++) {
        const pane = document.getElementById(`stepPane${i}`);
        const node = document.getElementById(`stepNode${i}`);
        if (pane) {
          if (i === this.currentRegStep) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        }
        if (node) {
          if (i === this.currentRegStep) {
            node.className = 'step-circle active';
          } else if (i < this.currentRegStep) {
            node.className = 'step-circle done';
            node.innerHTML = '<i class="fa-solid fa-check"></i>';
          } else {
            node.className = 'step-circle';
            node.textContent = i;
          }
        }
      }

      // Update progress line width
      const activeLine = document.getElementById('stepTrackActiveLine');
      const label = document.getElementById('stepProgressLabel');
      if (activeLine) {
        const pct = ((this.currentRegStep - 1) / 4) * 100;
        activeLine.style.width = `${pct}%`;
      }
      if (label) {
        label.textContent = `Step ${this.currentRegStep} of 5`;
      }

      // Update buttons
      const prevBtn = document.getElementById('regPrevBtn');
      const nextBtn = document.getElementById('regNextBtn');
      const submitBtn = document.getElementById('regSubmitBtn');

      if (prevBtn) prevBtn.style.display = this.currentRegStep > 1 ? 'inline-flex' : 'none';
      if (nextBtn) nextBtn.style.display = this.currentRegStep < 5 ? 'inline-flex' : 'none';
      if (submitBtn) submitBtn.style.display = this.currentRegStep === 5 ? 'inline-flex' : 'none';
    }

    handleRegisterSubmit(e) {
      e.preventDefault();
      const role = document.getElementById('regRoleSelect').value;
      const name = document.getElementById('regFullNameInput').value.trim();
      const phone = document.getElementById('regPhoneInput').value.trim();
      const email = document.getElementById('regEmailInput').value.trim();
      const password = document.getElementById('regPasswordInput').value;
      const taluka = document.getElementById('regTalukaSelect').value;
      const village = document.getElementById('regVillageInput').value.trim();

      const skillCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
      const skills = Array.from(skillCheckboxes).map((cb) => cb.value);

      const experience = document.getElementById('regExpSelect').value;
      const dailyWage = document.getElementById('regWageInput').value;
      const availability = document.getElementById('regAvailabilitySelect').value;

      const newUser = window.CivilConnectDB.registerUser({
        name,
        phone,
        email,
        password,
        role,
        taluka,
        village,
        skills,
        experience,
        dailyWage,
        availability
      });

      this.closeRegister();
      // SECTION 45: SUCCESS ANIMATION
      this.showSuccessModal(
        'Welcome to CivilConnect! 👷',
        `Your ${role.toUpperCase()} account has been created for ${taluka}, Buldhana. You are now logged in.`
      );

      this.updateNavbarUserBadge();
      this.navigateTo('dashboard');
    }

    // ========================================================
    // SECTION 33: LOGIN CONTROLLER & PASSWORD VISIBILITY
    // ========================================================
    openLogin() {
      this.closeRegister();
      const modal = document.getElementById('loginModal');
      if (modal) modal.classList.add('open');
    }

    closeLogin() {
      const modal = document.getElementById('loginModal');
      if (modal) modal.classList.remove('open');
    }

    switchToRegister() {
      this.closeLogin();
      this.openRegister();
    }

    togglePasswordVisibility(inputId, btn) {
      const input = document.getElementById(inputId);
      if (!input) return;
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      btn.innerHTML = isPwd ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
    }

    handleLoginSubmit(e) {
      e.preventDefault();
      const id = document.getElementById('loginIdentifierInput').value;
      const pwd = document.getElementById('loginPasswordInput').value;
      const role = document.getElementById('loginRoleSelect').value;
      const btn = document.getElementById('loginSubmitBtn');

      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
        btn.disabled = true;
      }

      setTimeout(() => {
        const res = window.CivilConnectDB.loginUser(id, pwd, role);
        if (btn) {
          btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';
          btn.disabled = false;
        }

        if (res.success) {
          this.closeLogin();
          this.showSuccessModal(
            `Welcome Back, ${res.user.name.split(' ')[0]}!`,
            `Logged in as ${res.user.role.toUpperCase()} in ${res.user.taluka || 'Buldhana'}.`
          );
          this.updateNavbarUserBadge();
          this.navigateTo('dashboard');
        } else {
          this.showToast('error', res.message || 'Login failed.');
        }
      }, 400);
    }

    quickLogin(role) {
      this.switchDemoRole(role);
      this.closeLogin();
      this.navigateTo('dashboard');
      this.showToast('success', `Logged in as Demo ${role.toUpperCase()}!`, 'Demo Access');
    }

    // ========================================================
    // JOB DETAILS & APPLY MODAL
    // ========================================================
    openJobDetail(jobId) {
      const job = window.CivilConnectDB.getJobById(jobId);
      if (!job) return;

      this.selectedJobForApply = job;
      document.getElementById('jobModalTitle').textContent = job.title;
      document.getElementById('jobModalCategory').textContent = job.category;
      document.getElementById('jobModalLocation').textContent = `${job.location}, ${job.taluka}`;
      document.getElementById('jobModalWage').textContent = `₹${job.wage} ${job.wageType}`;
      document.getElementById('jobModalWorkers').textContent = `${job.workersNeeded} Workers Needed (${job.workersFilled || 0} Filled)`;
      document.getElementById('jobModalContractor').textContent = job.contractorName;
      document.getElementById('jobModalDescription').textContent = job.description;

      const badge = document.getElementById('jobModalUrgentBadge');
      if (badge) badge.style.display = job.urgent ? 'inline-block' : 'none';

      const modal = document.getElementById('jobDetailModal');
      if (modal) modal.classList.add('open');
    }

    closeJobDetail() {
      const modal = document.getElementById('jobDetailModal');
      if (modal) modal.classList.remove('open');
      this.selectedJobForApply = null;
    }

    submitJobApplication() {
      if (!this.selectedJobForApply) return;
      const user = window.CivilConnectDB.getCurrentUser();
      const notes = document.getElementById('applyNotesInput').value.trim();

      const app = window.CivilConnectDB.submitApplication(this.selectedJobForApply.id, {
        userId: user ? user.id : 'usr_guest',
        name: user ? user.name : 'Ramesh Jadhav',
        phone: user ? user.phone : '9822101122',
        taluka: user ? user.taluka : this.selectedJobForApply.taluka,
        notes: notes || 'Immediately available with safety gear.'
      });

      this.closeJobDetail();
      // SECTION 45: SUCCESS ANIMATION
      this.showSuccessModal(
        'Application Submitted Successfully! ✓',
        `Your application for "${this.selectedJobForApply.title}" in ${this.selectedJobForApply.taluka} has been sent to ${this.selectedJobForApply.contractorName}.`
      );

      this.renderJobs();
    }

    // ========================================================
    // POST JOB MODAL (CONTRACTOR)
    // ========================================================
    openPostJobModal() {
      const modal = document.getElementById('postJobModal');
      if (modal) modal.classList.add('open');
    }

    closePostJobModal() {
      const modal = document.getElementById('postJobModal');
      if (modal) modal.classList.remove('open');
    }

    handlePostJobSubmit(e) {
      e.preventDefault();
      const user = window.CivilConnectDB.getCurrentUser();
      const title = document.getElementById('postJobTitleInput').value.trim();
      const category = document.getElementById('postJobCategorySelect').value;
      const taluka = document.getElementById('postJobTalukaSelect').value;
      const wage = document.getElementById('postJobWageInput').value;
      const workersNeeded = document.getElementById('postJobWorkersInput').value;
      const location = document.getElementById('postJobLocationInput').value.trim();
      const description = document.getElementById('postJobDescInput').value.trim();
      const urgent = document.getElementById('postJobUrgentInput').checked;

      const newJob = window.CivilConnectDB.addJob({
        title,
        category,
        taluka,
        wage,
        workersNeeded,
        location,
        description,
        urgent,
        contractorName: user && user.company ? user.company : user ? user.name : 'Local Contractor',
        contractorPhone: user ? user.phone : '9850123456'
      });

      this.closePostJobModal();
      // SECTION 45: SUCCESS ANIMATION
      this.showSuccessModal(
        'Labour Requirement Published! 🏗️',
        `Your requirement for ${newJob.workersNeeded} ${newJob.category} in ${newJob.taluka} has been published and alerted to Buldhana workers.`
      );

      this.renderJobs();
      this.renderUrgentWorkers();
      this.animateHeroCounters();
    }

    // ========================================================
    // ADD SITE MODAL (BUILDER)
    // ========================================================
    openAddSiteModal() {
      const modal = document.getElementById('addSiteModal');
      if (modal) modal.classList.add('open');
    }

    closeAddSiteModal() {
      const modal = document.getElementById('addSiteModal');
      if (modal) modal.classList.remove('open');
    }

    handleAddSiteSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('siteNameInput').value.trim();
      const taluka = document.getElementById('siteTalukaSelect').value;
      const projectType = document.getElementById('siteTypeSelect').value;
      const workersRequired = document.getElementById('siteWorkersInput').value;
      const stage = document.getElementById('siteStageInput').value.trim();
      const location = document.getElementById('siteLocationInput').value.trim();

      const newSite = window.CivilConnectDB.addSite({
        name,
        taluka,
        projectType,
        workersRequired,
        stage,
        location,
        progress: 15
      });

      this.closeAddSiteModal();
      // SECTION 45: SUCCESS ANIMATION
      this.showSuccessModal(
        'Construction Site Added Successfully! 🏢',
        `Site "${newSite.name}" in ${newSite.taluka} is now registered in the Buldhana database.`
      );

      this.renderSites();
      this.animateHeroCounters();
    }

    showSiteModal(siteId) {
      const site = window.CivilConnectDB.getSiteById(siteId);
      if (!site) return;
      this.showToast('info', `Site Details: ${site.name} (${site.taluka}) - ${site.workersActive}/${site.workersRequired} Workers Active.`);
    }

    // ========================================================
    // SECTION 45: SUCCESS MODAL CONTROLLER
    // ========================================================
    showSuccessModal(title, message) {
      const titleEl = document.getElementById('successModalTitle');
      const msgEl = document.getElementById('successModalMessage');
      if (titleEl) titleEl.textContent = title;
      if (msgEl) msgEl.textContent = message;

      const modal = document.getElementById('successModal');
      if (modal) modal.classList.add('open');
    }

    closeSuccessModal() {
      const modal = document.getElementById('successModal');
      if (modal) modal.classList.remove('open');
    }

    // ========================================================
    // SECTION 42: MICRO INTERACTIONS & TOAST NOTIFICATIONS
    // ========================================================
    showToast(type, message, title = '') {
      const container = document.getElementById('toastContainer');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = 'toast-item';

      const isSuccess = type === 'success';
      const isError = type === 'error';
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      toast.style.background = isDark ? '#1a253c' : '#ffffff';
      toast.style.color = isDark ? '#ffffff' : '#0f172a';
      toast.style.borderLeft = isSuccess ? '4px solid #10b981' : isError ? '4px solid #ef4444' : '4px solid #f59e0b';

      const icon = isSuccess ? 'fa-circle-check' : isError ? 'fa-triangle-exclamation' : 'fa-bell';
      const iconColor = isSuccess ? '#10b981' : isError ? '#ef4444' : '#f59e0b';

      toast.innerHTML = `
        <div style="font-size: 18px; color: ${iconColor};"><i class="fa-solid ${icon}"></i></div>
        <div style="flex: 1;">
          ${title ? `<div style="font-weight: 700; font-size: 13.5px; margin-bottom: 2px;">${title}</div>` : ''}
          <div style="font-size: 13px; color: ${isDark ? '#cbd5e1' : '#475569'};">${message}</div>
        </div>
        <button style="background: transparent; border: none; cursor: pointer; color: #94a3b8; font-size: 14px;" onclick="this.parentElement.remove()">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="toast-progress"></div>
      `;

      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }
  }

  // Instantiate application
  window.CivilConnectApp = new CivilConnectApp();

  document.addEventListener('DOMContentLoaded', () => {
    window.CivilConnectApp.init();
  });
})(window);
