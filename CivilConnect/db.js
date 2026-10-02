/**
 * CivilConnect - Relational Client-Side Database Engine
 * Serving Buldhana District, Maharashtra
 * Provides persistent storage via LocalStorage with fallback, seed data, and reactive listeners.
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'civilconnect_db_v2';
  const CURRENT_USER_KEY = 'civilconnect_current_user_v2';
  const THEME_KEY = 'civilconnect_theme';

  // 13 Talukas of Buldhana District
  const BULDHANA_TALUKAS = [
    'Khamgaon',
    'Mehkar',
    'Buldhana',
    'Shegaon',
    'Chikhli',
    'Malkapur',
    'Jalgaon Jamod',
    'Nandura',
    'Deulgaon Raja',
    'Sindkhed Raja',
    'Lonar',
    'Sangrampur',
    'Motala'
  ];

  // Construction Skill Categories
  const SKILL_CATEGORIES = [
    { id: 'mason', name: 'Mason (गवंडी)', icon: 'fa-trowel-bricks' },
    { id: 'helper', name: 'Construction Helper (मजूर)', icon: 'fa-person-digging' },
    { id: 'carpenter', name: 'Carpenter (सुतार)', icon: 'fa-hammer' },
    { id: 'painter', name: 'Painter (रंगारी)', icon: 'fa-paint-roller' },
    { id: 'plumber', name: 'Plumber (प्लंबर)', icon: 'fa-faucet' },
    { id: 'electrician', name: 'Electrician (इलेक्ट्रिशियन)', icon: 'fa-bolt' },
    { id: 'rcc', name: 'RCC Steel Worker (आरसीसी कामगार)', icon: 'fa-cubes-stacked' },
    { id: 'road', name: 'Road Construction Worker (रस्ता कामगार)', icon: 'fa-road' },
    { id: 'tile', name: 'Tile & Marble Mason (फरशी कारागीर)', icon: 'fa-border-all' },
    { id: 'welder', name: 'Welder & Fabricator (वेल्डर)', icon: 'fa-fire' }
  ];

  // Seed Data
  const DEFAULT_DATA = {
    users: [
      {
        id: 'usr_w1',
        name: 'Ramesh Jadhav',
        phone: '9822101122',
        email: 'ramesh.jadhav@example.com',
        role: 'worker',
        taluka: 'Khamgaon',
        village: 'Ghatpuri Road, Khamgaon',
        skills: ['Mason', 'RCC Worker'],
        experience: '8 Years',
        dailyWage: 900,
        availability: 'Immediately Available',
        workType: 'Daily Wage & Contract',
        rating: 4.8,
        completedJobs: 42
      },
      {
        id: 'usr_w2',
        name: 'Santosh Gaikwad',
        phone: '9766543210',
        email: 'santosh.gaikwad@example.com',
        role: 'worker',
        taluka: 'Mehkar',
        village: 'Dongaon, Mehkar',
        skills: ['Construction Helper'],
        experience: '4 Years',
        dailyWage: 700,
        availability: 'Immediately Available',
        workType: 'Daily Wage',
        rating: 4.6,
        completedJobs: 28
      },
      {
        id: 'usr_w3',
        name: 'Vikas Solanke',
        phone: '9421098765',
        email: 'vikas.solanke@example.com',
        role: 'worker',
        taluka: 'Shegaon',
        village: 'Near Anand Sagar, Shegaon',
        skills: ['Electrician'],
        experience: '6 Years',
        dailyWage: 950,
        availability: 'Immediately Available',
        workType: 'Contract Work',
        rating: 4.9,
        completedJobs: 65
      },
      {
        id: 'usr_c1',
        name: 'Kailash Patil',
        phone: '9850123456',
        email: 'patil.infra@example.com',
        role: 'contractor',
        company: 'Patil Civil Infra & Earthmovers',
        taluka: 'Mehkar',
        village: 'Main Market, Mehkar',
        licenseNo: 'MH-28-BLD-C-4091',
        experience: '14 Years',
        activeSitesCount: 4,
        hiredWorkersCount: 42
      },
      {
        id: 'usr_b1',
        name: 'Sanjay Deshmukh',
        phone: '9881234567',
        email: 'deshmukh.builders@example.com',
        role: 'builder',
        company: 'Deshmukh Builders & Developers',
        taluka: 'Buldhana',
        village: 'Civil Lines, Buldhana',
        licenseNo: 'MH-28-RERA-B-1082',
        experience: '18 Years',
        activeSitesCount: 3,
        totalWorkforce: 86
      },
      {
        id: 'usr_s1',
        name: 'Ganesh Shinde',
        phone: '9923887766',
        email: 'ganesh.shinde@example.com',
        role: 'supervisor',
        company: 'Shinde Site Management',
        taluka: 'Shegaon',
        village: 'Station Road, Shegaon',
        experience: '9 Years',
        supervisedSites: 2,
        todayPresent: 28
      }
    ],

    jobs: [
      {
        id: 'job_1',
        title: 'Experienced Mason Required',
        category: 'Mason',
        taluka: 'Khamgaon',
        location: 'Jalamb Naka, Khamgaon',
        wage: 900,
        wageType: 'Per Day',
        workersNeeded: 8,
        workersFilled: 3,
        urgent: true,
        projectType: 'Commercial Building (G+4)',
        description: 'Urgent requirement for skilled brickwork and plastering masons for commercial complex near Jalamb Naka. Daily payment and tea provided.',
        contractorName: 'Khamgaon Buildcon Ltd.',
        contractorPhone: '9850234111',
        postedDate: '2026-09-27T09:15:00Z',
        timeAgo: '2 hours ago',
        status: 'Open'
      },
      {
        id: 'job_2',
        title: 'Construction Helpers for Foundation Digging',
        category: 'Helper',
        taluka: 'Mehkar',
        location: 'Dongaon Road, Mehkar',
        wage: 700,
        wageType: 'Per Day',
        workersNeeded: 12,
        workersFilled: 4,
        urgent: true,
        projectType: 'Residential Row House Project',
        description: 'Need energetic labour helpers for foundation excavation, cement mixing, and material handling. Work starts immediately at 8:30 AM.',
        contractorName: 'Patil Civil Infra (Kailash Patil)',
        contractorPhone: '9850123456',
        postedDate: '2026-09-27T10:30:00Z',
        timeAgo: '1 hour ago',
        status: 'Open'
      },
      {
        id: 'job_3',
        title: 'Shuttering Carpenter Needed',
        category: 'Carpenter',
        taluka: 'Buldhana',
        location: 'Near Collector Office, Buldhana Sadar',
        wage: 850,
        wageType: 'Per Day',
        workersNeeded: 4,
        workersFilled: 1,
        urgent: true,
        projectType: 'Government Administrative Building',
        description: 'Centering and shuttering plywood formwork carpenters required for first-floor slab casting. Precision work needed.',
        contractorName: 'Vidarbha Construction Co.',
        contractorPhone: '9890456789',
        postedDate: '2026-09-27T11:00:00Z',
        timeAgo: '30 mins ago',
        status: 'Open'
      },
      {
        id: 'job_4',
        title: 'Site Electricians for Conduit Piping',
        category: 'Electrician',
        taluka: 'Shegaon',
        location: 'Anand Sagar Temple Ring Road, Shegaon',
        wage: 950,
        wageType: 'Per Day',
        workersNeeded: 2,
        workersFilled: 0,
        urgent: true,
        projectType: 'Pilgrim Guest House & Food Plaza',
        description: 'Concealed electrical conduit placement, junction box fitting, and distribution board wiring for 24-room guest lodge.',
        contractorName: 'Shri Gajanan Electricals',
        contractorPhone: '9423112233',
        postedDate: '2026-09-27T12:00:00Z',
        timeAgo: '20 mins ago',
        status: 'Open'
      },
      {
        id: 'job_5',
        title: 'RCC Steel Bar Benders & Fitters',
        category: 'RCC Worker',
        taluka: 'Chikhli',
        location: 'MIDC Phase-1, Chikhli',
        wage: 850,
        wageType: 'Per Day',
        workersNeeded: 6,
        workersFilled: 2,
        urgent: false,
        projectType: 'Industrial Shed & Heavy Slab',
        description: 'TMT bar cutting, bending as per structural drawing, column cage tying, and beam reinforcement for factory construction.',
        contractorName: 'Chikhli Agro-Tech Infra',
        contractorPhone: '9823554433',
        postedDate: '2026-09-26T15:00:00Z',
        timeAgo: 'Yesterday',
        status: 'Open'
      },
      {
        id: 'job_6',
        title: 'Skilled Exterior Painters',
        category: 'Painter',
        taluka: 'Malkapur',
        location: 'Railway Station Road, Malkapur',
        wage: 800,
        wageType: 'Per Day',
        workersNeeded: 5,
        workersFilled: 1,
        urgent: false,
        projectType: 'Commercial Complex Renovation',
        description: 'Scaffolding-based exterior weather-proof painting, primer application, and texture work. Safety harness mandatory.',
        contractorName: 'Malkapur Colors & Infra',
        contractorPhone: '9765443322',
        postedDate: '2026-09-26T11:00:00Z',
        timeAgo: 'Yesterday',
        status: 'Open'
      },
      {
        id: 'job_7',
        title: 'Tile & Marble Laying Masons',
        category: 'Tile Mason',
        taluka: 'Lonar',
        location: 'Sultanpur Road, Lonar',
        wage: 950,
        wageType: 'Per Day',
        workersNeeded: 3,
        workersFilled: 0,
        urgent: true,
        projectType: 'Resort & Tourist Lodge',
        description: 'Vitrified tile laying (2x4 ft), wall tile groove alignment, and granite doorstep fitting for new tourist resort near Lonar Crater.',
        contractorName: 'Crater Vista Developers',
        contractorPhone: '9881776655',
        postedDate: '2026-09-27T08:00:00Z',
        timeAgo: '4 hours ago',
        status: 'Open'
      },
      {
        id: 'job_8',
        title: 'Road Paver & Asphalt Workers',
        category: 'Road Worker',
        taluka: 'Nandura',
        location: 'NH-53 Highway Extension, Nandura',
        wage: 800,
        wageType: 'Per Day',
        workersNeeded: 10,
        workersFilled: 4,
        urgent: false,
        projectType: 'Highway Service Road & Drainage',
        description: 'Road levelling, concrete kerb stone laying, paver block installation, and side drainage channel construction along NH-53.',
        contractorName: 'Vidarbha Highways Pvt Ltd',
        contractorPhone: '9422889900',
        postedDate: '2026-09-25T14:00:00Z',
        timeAgo: '2 days ago',
        status: 'Open'
      },
      {
        id: 'job_9',
        title: 'Sanitary Plumber for Multi-Storey Building',
        category: 'Plumber',
        taluka: 'Khamgaon',
        location: 'Nandura Road, Khamgaon',
        wage: 900,
        wageType: 'Per Day',
        workersNeeded: 3,
        workersFilled: 1,
        urgent: false,
        projectType: 'Residential Apartment Complex',
        description: 'CPVC & UPVC pipe jointing, drainage stack plumbing, overhead tank manifold connection for 16 apartments.',
        contractorName: 'Sai Samarth Plumbing Works',
        contractorPhone: '9860334455',
        postedDate: '2026-09-26T16:30:00Z',
        timeAgo: 'Yesterday',
        status: 'Open'
      },
      {
        id: 'job_10',
        title: 'Structural Welders & Fabricators',
        category: 'Welder',
        taluka: 'Jalgaon Jamod',
        location: 'Industrial Area, Jalgaon Jamod',
        wage: 1000,
        wageType: 'Per Day',
        workersNeeded: 4,
        workersFilled: 1,
        urgent: true,
        projectType: 'Grain Warehouse Steel Truss',
        description: 'Heavy MS angle and channel welding for roof truss structure of 20,000 sq ft agricultural warehouse. Arc welding proficiency required.',
        contractorName: 'Satpura Agro Engineering',
        contractorPhone: '9890667788',
        postedDate: '2026-09-27T07:30:00Z',
        timeAgo: '5 hours ago',
        status: 'Open'
      },
      {
        id: 'job_11',
        title: 'Civil Mason for Canal Wall Repair',
        category: 'Mason',
        taluka: 'Motala',
        location: 'Nalganga Dam Left Bank, Motala',
        wage: 850,
        wageType: 'Per Day',
        workersNeeded: 6,
        workersFilled: 2,
        urgent: false,
        projectType: 'Irrigation & Canal Infrastructure',
        description: 'Stone pitching and cement pointing work along the irrigation distributary channel near Nalganga dam reservoir.',
        contractorName: 'Motala Irrigation Contractors',
        contractorPhone: '9421556677',
        postedDate: '2026-09-26T10:00:00Z',
        timeAgo: 'Yesterday',
        status: 'Open'
      },
      {
        id: 'job_12',
        title: 'Construction Helpers for Temple Hall',
        category: 'Helper',
        taluka: 'Deulgaon Raja',
        location: 'Balaji Temple Premises, Deulgaon Raja',
        wage: 700,
        wageType: 'Per Day',
        workersNeeded: 8,
        workersFilled: 3,
        urgent: true,
        projectType: 'Community Pilgrim Hall',
        description: 'General construction helpers for shifting stone blocks, sand sieving, concrete curing, and site cleaning.',
        contractorName: 'Raja Balaji Heritage Works',
        contractorPhone: '9822998877',
        postedDate: '2026-09-27T10:00:00Z',
        timeAgo: '1.5 hours ago',
        status: 'Open'
      }
    ],

    sites: [
      {
        id: 'site_1',
        name: 'Khamgaon Bypass Commercial Hub',
        taluka: 'Khamgaon',
        location: 'National Highway 53, Near Toll Plaza, Khamgaon',
        projectType: 'Commercial Shopping Mall & Offices',
        workersRequired: 24,
        workersActive: 18,
        status: 'Active',
        stage: 'RCC 3rd Floor Framing',
        progress: 65,
        builderName: 'Vidarbha Commercial Developers',
        supervisor: 'Rajesh Solanke',
        startDate: '2026-04-10',
        estimatedFinish: '2026-12-30',
        imageSvg: 'commercial'
      },
      {
        id: 'site_2',
        name: 'Mehkar Sub-District Hospital Extension',
        taluka: 'Mehkar',
        location: 'Hospital Road, Mehkar',
        projectType: 'Public Healthcare & ICU Block',
        workersRequired: 35,
        workersActive: 30,
        status: 'Active',
        stage: 'Brickwork & Electrical Conduits',
        progress: 42,
        builderName: 'Patil Civil Infra (Kailash Patil)',
        supervisor: 'Arun Gawande',
        startDate: '2026-02-15',
        estimatedFinish: '2026-11-15',
        imageSvg: 'hospital'
      },
      {
        id: 'site_3',
        name: 'Shegaon Pilgrim Bhavan & Annachhatra',
        taluka: 'Shegaon',
        location: 'Temple Ring Road, Shegaon',
        projectType: 'Institutional / Pilgrim Accommodation',
        workersRequired: 40,
        workersActive: 38,
        status: 'Active',
        stage: 'Interior Finishing & Tiling',
        progress: 80,
        builderName: 'Sansthan Infrastructure Board',
        supervisor: 'Ganesh Shinde',
        startDate: '2025-11-01',
        estimatedFinish: '2026-10-30',
        imageSvg: 'heritage'
      },
      {
        id: 'site_4',
        name: 'Buldhana Sadar Administrative Complex',
        taluka: 'Buldhana',
        location: 'Civil Lines, Near Collectorate, Buldhana',
        projectType: 'Government / Public Administrative',
        workersRequired: 50,
        workersActive: 45,
        status: 'Active',
        stage: 'Foundation & Basement Retaining Wall',
        progress: 28,
        builderName: 'Deshmukh Builders & Developers',
        supervisor: 'Pravin Deshmukh',
        startDate: '2026-06-01',
        estimatedFinish: '2027-04-15',
        imageSvg: 'government'
      },
      {
        id: 'site_5',
        name: 'Lonar Crater Eco-Tourism Welcome Center',
        taluka: 'Lonar',
        location: 'Crater View Point Road, Lonar',
        projectType: 'Eco-Tourism & Interpretive Center',
        workersRequired: 15,
        workersActive: 12,
        status: 'Active',
        stage: 'Stone Masonry & Timber Truss',
        progress: 55,
        builderName: 'Maharashtra Tourism Infrastructure',
        supervisor: 'Sanjay More',
        startDate: '2026-03-01',
        estimatedFinish: '2026-11-30',
        imageSvg: 'eco'
      },
      {
        id: 'site_6',
        name: 'Chikhli Mega Agricultural Terminal Yard',
        taluka: 'Chikhli',
        location: 'APMC Market Area, Chikhli',
        projectType: 'Industrial Warehousing & Cold Storage',
        workersRequired: 30,
        workersActive: 22,
        status: 'Active',
        stage: 'Steel Trusses & Concrete Flooring',
        progress: 72,
        builderName: 'Buldhana Agro Infra Corp',
        supervisor: 'Mahesh Kale',
        startDate: '2026-01-20',
        estimatedFinish: '2026-10-20',
        imageSvg: 'warehouse'
      }
    ],

    notifications: [
      {
        id: 'notif_1',
        icon: 'fa-bell',
        title: '10 Mason workers urgently required in Khamgaon',
        taluka: 'Khamgaon',
        category: 'Mason',
        timeAgo: '20 minutes ago',
        timestamp: '2026-09-27T14:40:00Z',
        isNew: true,
        urgency: 'high',
        detail: 'Immediate hiring for Jalamb Naka commercial complex. Daily wage ₹900 with transport from railway gate.',
        jobId: 'job_1'
      },
      {
        id: 'notif_2',
        icon: 'fa-building',
        title: 'New Hospital Wing Site in Mehkar Approved',
        taluka: 'Mehkar',
        category: 'Public Works',
        timeAgo: '45 minutes ago',
        timestamp: '2026-09-27T14:15:00Z',
        isNew: true,
        urgency: 'medium',
        detail: 'Patil Civil Infra has posted 30 new vacancies for Helpers and RCC workers at Mehkar Hospital.',
        jobId: 'job_2'
      },
      {
        id: 'notif_3',
        icon: 'fa-triangle-exclamation',
        title: 'Urgent: 4 Centering Carpenters Needed in Buldhana Sadar',
        taluka: 'Buldhana',
        category: 'Carpenter',
        timeAgo: '1 hour ago',
        timestamp: '2026-09-27T14:00:00Z',
        isNew: true,
        urgency: 'high',
        detail: 'Slab casting scheduled for tomorrow morning. High daily rate ₹850 + lunch provided.',
        jobId: 'job_3'
      },
      {
        id: 'notif_4',
        icon: 'fa-bolt',
        title: '2 Industrial Electricians needed at Shegaon',
        taluka: 'Shegaon',
        category: 'Electrician',
        timeAgo: '2 hours ago',
        timestamp: '2026-09-27T13:00:00Z',
        isNew: false,
        urgency: 'medium',
        detail: 'Pilgrim guest house project requires certified wiring technicians. ₹950/day.',
        jobId: 'job_4'
      },
      {
        id: 'notif_5',
        icon: 'fa-road',
        title: 'Highway Paver requirement at Nandura bypass',
        taluka: 'Nandura',
        category: 'Road Worker',
        timeAgo: '4 hours ago',
        timestamp: '2026-09-27T11:00:00Z',
        isNew: false,
        urgency: 'low',
        detail: '10 paver block layers needed for NH-53 shoulder work.',
        jobId: 'job_8'
      },
      {
        id: 'notif_6',
        icon: 'fa-circle-check',
        title: 'Buldhana District Minimum Wage Revision Notification',
        taluka: 'Buldhana',
        category: 'General',
        timeAgo: '1 day ago',
        timestamp: '2026-09-26T10:00:00Z',
        isNew: false,
        urgency: 'low',
        detail: 'District Labour Commissioner revised standard masonry rates for Vidarbha zone.'
      }
    ],

    applications: [
      {
        id: 'app_1',
        jobId: 'job_1',
        jobTitle: 'Experienced Mason Required',
        applicantId: 'usr_w1',
        applicantName: 'Ramesh Jadhav',
        applicantPhone: '9822101122',
        taluka: 'Khamgaon',
        experience: '8 Years',
        appliedDate: '2026-09-27T11:30:00Z',
        status: 'Under Review',
        notes: 'Available with personal trowel and safety boots.'
      },
      {
        id: 'app_2',
        jobId: 'job_2',
        jobTitle: 'Construction Helpers for Foundation Digging',
        applicantId: 'usr_w2',
        applicantName: 'Santosh Gaikwad',
        applicantPhone: '9766543210',
        taluka: 'Mehkar',
        experience: '4 Years',
        appliedDate: '2026-09-27T11:45:00Z',
        status: 'Accepted',
        notes: 'Ready to join tomorrow 8:30 AM.'
      }
    ],

    supervisorAttendance: [
      { workerName: 'Ramesh Jadhav', role: 'Lead Mason', status: 'Present', checkIn: '08:15 AM' },
      { workerName: 'Santosh Gaikwad', role: 'Helper', status: 'Present', checkIn: '08:25 AM' },
      { workerName: 'Vikas Solanke', role: 'Electrician', status: 'Present', checkIn: '08:40 AM' },
      { workerName: 'Anil Rathod', role: 'Carpenter', status: 'Late', checkIn: '09:10 AM' },
      { workerName: 'Sunil Wankhede', role: 'RCC Binder', status: 'Present', checkIn: '08:20 AM' },
      { workerName: 'Prakash Chavan', role: 'Helper', status: 'Absent', checkIn: '-' }
    ]
  };

  class CivilConnectDB {
    constructor() {
      this.listeners = [];
      this.data = this._loadData();
    }

    _loadData() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.jobs && parsed.jobs.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn('Could not read from localStorage, using memory storage', err);
      }
      this._saveData(DEFAULT_DATA);
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }

    _saveData(dataToSave) {
      this.data = dataToSave;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (err) {
        console.warn('Could not save to localStorage', err);
      }
      this._emitChange();
    }

    _emitChange() {
      this.listeners.forEach((fn) => {
        try {
          fn(this.data);
        } catch (e) {
          console.error('Error in db listener:', e);
        }
      });
    }

    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter((fn) => fn !== listener);
      };
    }

    // Dynamic Statistics calculation (Section 36 & 47)
    getStats() {
      const activeJobs = this.data.jobs.filter((j) => j.status === 'Open').length;
      const totalWorkers = 1250 + this.data.users.filter((u) => u.role === 'worker').length;
      const totalContractors = 180 + this.data.users.filter((u) => u.role === 'contractor').length;
      const totalSites = 75 + this.data.sites.length;
      const totalApplications = 143 + this.data.applications.length;
      const workersNeeded = this.data.jobs
        .filter((j) => j.status === 'Open')
        .reduce((sum, j) => sum + (j.workersNeeded || 1), 0);

      return {
        workersCount: totalWorkers,
        contractorsCount: totalContractors,
        sitesCount: totalSites,
        jobsCount: activeJobs + 320,
        rawActiveJobs: activeJobs,
        rawWorkersNeeded: workersNeeded,
        rawApplications: totalApplications,
        rawActiveSites: this.data.sites.length
      };
    }

    // Buldhana Talukas
    getTalukas() {
      return [...BULDHANA_TALUKAS];
    }

    // Skill Categories
    getCategories() {
      return [...SKILL_CATEGORIES];
    }

    // Jobs CRUD
    getJobs(filters = {}) {
      let result = [...this.data.jobs];

      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.description.toLowerCase().includes(q) ||
            j.location.toLowerCase().includes(q) ||
            j.taluka.toLowerCase().includes(q) ||
            j.category.toLowerCase().includes(q)
        );
      }

      if (filters.taluka && filters.taluka !== 'all') {
        result = result.filter((j) => j.taluka.toLowerCase() === filters.taluka.toLowerCase());
      }

      if (filters.category && filters.category !== 'all') {
        result = result.filter((j) => j.category.toLowerCase() === filters.category.toLowerCase());
      }

      if (filters.urgentOnly) {
        result = result.filter((j) => j.urgent === true);
      }

      if (filters.minWage) {
        result = result.filter((j) => j.wage >= Number(filters.minWage));
      }

      // Sort newest first
      result.sort((a, b) => new Date(b.postedDate || 0) - new Date(a.postedDate || 0));
      return result;
    }

    getJobById(id) {
      return this.data.jobs.find((j) => j.id === id) || null;
    }

    addJob(jobData) {
      const newJob = {
        id: 'job_' + Date.now(),
        title: jobData.title,
        category: jobData.category,
        taluka: jobData.taluka || 'Buldhana',
        location: jobData.location,
        wage: Number(jobData.wage) || 750,
        wageType: jobData.wageType || 'Per Day',
        workersNeeded: Number(jobData.workersNeeded) || 1,
        workersFilled: 0,
        urgent: Boolean(jobData.urgent),
        projectType: jobData.projectType || 'General Construction',
        description: jobData.description || '',
        contractorName: jobData.contractorName || 'Local Contractor',
        contractorPhone: jobData.contractorPhone || '9800000000',
        postedDate: new Date().toISOString(),
        timeAgo: 'Just now',
        status: 'Open'
      };

      this.data.jobs.unshift(newJob);

      // Create a live notification for Buldhana District
      this.addNotification({
        icon: 'fa-briefcase',
        title: `New Requirement: ${newJob.workersNeeded} ${newJob.category} needed in ${newJob.taluka}`,
        taluka: newJob.taluka,
        category: newJob.category,
        detail: `${newJob.title} - ₹${newJob.wage}/day. Posted by ${newJob.contractorName}.`,
        urgency: newJob.urgent ? 'high' : 'medium',
        jobId: newJob.id
      });

      this._saveData(this.data);
      return newJob;
    }

    // Workers Needed Now (Section 38)
    getUrgentRequirements() {
      return this.data.jobs.filter((j) => j.urgent && j.status === 'Open').slice(0, 6);
    }

    // Construction Sites (Section 39)
    getSites(taluka = 'all') {
      let sites = [...this.data.sites];
      if (taluka && taluka !== 'all') {
        sites = sites.filter((s) => s.taluka.toLowerCase() === taluka.toLowerCase());
      }
      return sites;
    }

    getSiteById(id) {
      return this.data.sites.find((s) => s.id === id) || null;
    }

    addSite(siteData) {
      const newSite = {
        id: 'site_' + Date.now(),
        name: siteData.name,
        taluka: siteData.taluka || 'Buldhana',
        location: siteData.location,
        projectType: siteData.projectType || 'Residential Building',
        workersRequired: Number(siteData.workersRequired) || 10,
        workersActive: Number(siteData.workersActive) || 0,
        status: siteData.status || 'Active',
        stage: siteData.stage || 'Foundation Phase',
        progress: Number(siteData.progress) || 15,
        builderName: siteData.builderName || 'Registered Builder',
        supervisor: siteData.supervisor || 'Site Supervisor',
        startDate: siteData.startDate || new Date().toISOString().split('T')[0],
        estimatedFinish: siteData.estimatedFinish || '2026-12-31',
        imageSvg: siteData.imageSvg || 'commercial'
      };

      this.data.sites.unshift(newSite);

      this.addNotification({
        icon: 'fa-building',
        title: `New Construction Site in ${newSite.taluka}: ${newSite.name}`,
        taluka: newSite.taluka,
        category: 'New Site',
        detail: `${newSite.workersRequired} workers will be required for this ${newSite.projectType}.`,
        urgency: 'medium'
      });

      this._saveData(this.data);
      return newSite;
    }

    // Notifications (Section 40)
    getNotifications(taluka = 'all') {
      let notifs = [...this.data.notifications];
      if (taluka && taluka !== 'all') {
        notifs = notifs.filter((n) => n.taluka && n.taluka.toLowerCase() === taluka.toLowerCase());
      }
      return notifs;
    }

    addNotification(notifData) {
      const notif = {
        id: 'notif_' + Date.now(),
        icon: notifData.icon || 'fa-bell',
        title: notifData.title,
        taluka: notifData.taluka || 'Buldhana',
        category: notifData.category || 'General',
        timeAgo: 'Just now',
        timestamp: new Date().toISOString(),
        isNew: true,
        urgency: notifData.urgency || 'medium',
        detail: notifData.detail || '',
        jobId: notifData.jobId || null
      };

      this.data.notifications.unshift(notif);
      this._saveData(this.data);
      return notif;
    }

    markNotificationRead(id) {
      const notif = this.data.notifications.find((n) => n.id === id);
      if (notif) {
        notif.isNew = false;
        this._saveData(this.data);
      }
    }

    markAllNotificationsRead() {
      this.data.notifications.forEach((n) => (n.isNew = false));
      this._saveData(this.data);
    }

    // Applications (Section 45 & 51)
    getApplications(userId = null) {
      if (userId) {
        return this.data.applications.filter((a) => a.applicantId === userId);
      }
      return [...this.data.applications];
    }

    submitApplication(jobId, applicantData) {
      const job = this.getJobById(jobId);
      const app = {
        id: 'app_' + Date.now(),
        jobId: jobId,
        jobTitle: job ? job.title : 'Construction Job',
        applicantId: applicantData.userId || 'usr_guest',
        applicantName: applicantData.name || 'Anonymous Applicant',
        applicantPhone: applicantData.phone || '9800000000',
        taluka: applicantData.taluka || (job ? job.taluka : 'Buldhana'),
        experience: applicantData.experience || '2 Years',
        appliedDate: new Date().toISOString(),
        status: 'Under Review',
        notes: applicantData.notes || 'Immediate joining available'
      };

      this.data.applications.unshift(app);

      if (job) {
        job.workersFilled = (job.workersFilled || 0) + 1;
      }

      this._saveData(this.data);
      return app;
    }

    updateApplicationStatus(appId, newStatus) {
      const app = this.data.applications.find((a) => a.id === appId);
      if (app) {
        app.status = newStatus;
        this._saveData(this.data);
      }
      return app;
    }

    // User Authentication & Roles (Section 32, 33, 46)
    registerUser(userData) {
      const newUser = {
        id: 'usr_' + Date.now(),
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'worker',
        taluka: userData.taluka || 'Buldhana',
        village: userData.village || 'Buldhana',
        skills: userData.skills || [],
        experience: userData.experience || '1-2 Years',
        dailyWage: Number(userData.dailyWage) || 800,
        availability: userData.availability || 'Immediately Available',
        workType: userData.workType || 'Daily Wage',
        shift: userData.shift || 'Day Shift',
        transport: userData.transport || 'Local Bus',
        company: userData.company || '',
        licenseNo: userData.licenseNo || '',
        rating: 5.0,
        completedJobs: 0,
        registeredAt: new Date().toISOString()
      };

      this.data.users.push(newUser);
      this._saveData(this.data);
      this.setCurrentUser(newUser);
      return newUser;
    }

    loginUser(identifier, password, role) {
      const cleanId = (identifier || '').trim().toLowerCase();
      // Match by phone or email or demo accounts
      let found = this.data.users.find((u) => {
        const matchContact =
          (u.email && u.email.toLowerCase() === cleanId) ||
          (u.phone && u.phone.includes(cleanId));
        const matchRole = role ? u.role === role : true;
        return matchContact && matchRole;
      });

      if (!found && role) {
        // Find by role demo
        found = this.data.users.find((u) => u.role === role);
      }

      if (!found && this.data.users.length > 0) {
        found = this.data.users[0];
      }

      if (found) {
        this.setCurrentUser(found);
        return { success: true, user: found };
      }

      return { success: false, message: 'Invalid credentials or user not found' };
    }

    getCurrentUser() {
      try {
        const stored = localStorage.getItem(CURRENT_USER_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {}
      // Default to demo worker for instant testing
      return this.data.users[0];
    }

    setCurrentUser(user) {
      try {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } catch (e) {}
      this._emitChange();
    }

    logoutUser() {
      try {
        localStorage.removeItem(CURRENT_USER_KEY);
      } catch (e) {}
      this._emitChange();
    }

    switchRole(role) {
      const found = this.data.users.find((u) => u.role === role);
      if (found) {
        this.setCurrentUser(found);
      } else {
        const placeholder = {
          id: 'usr_' + role,
          name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
          role: role,
          taluka: 'Buldhana',
          village: 'Buldhana City',
          skills: role === 'worker' ? ['Mason'] : []
        };
        this.setCurrentUser(placeholder);
      }
    }

    // Analytics Data for Charts (Section 47)
    getTalukaAnalytics() {
      const counts = {};
      BULDHANA_TALUKAS.forEach((t) => (counts[t] = 0));
      this.data.jobs.forEach((j) => {
        if (counts[j.taluka] !== undefined) counts[j.taluka]++;
        else counts[j.taluka] = 1;
      });
      return counts;
    }

    getSkillAnalytics() {
      const counts = {};
      this.data.jobs.forEach((j) => {
        counts[j.category] = (counts[j.category] || 0) + (j.workersNeeded || 1);
      });
      return counts;
    }

    getTheme() {
      try {
        return localStorage.getItem(THEME_KEY) || 'light';
      } catch (e) {
        return 'light';
      }
    }

    setTheme(theme) {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch (e) {}
    }

    resetToDefaults() {
      this._saveData(JSON.parse(JSON.stringify(DEFAULT_DATA)));
      return this.data;
    }
  }

  window.CivilConnectDB = new CivilConnectDB();
})(window);
