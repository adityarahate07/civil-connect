# 🏗️ CivilConnect - Construction Employment Platform
### Serving Buldhana District, Maharashtra (13 Talukas)

CivilConnect connects construction workers, contractors, builders/site owners, and construction site supervisors across **Buldhana District, Maharashtra**.

---

## 🚀 Quick Start Guide

### Option 1: Direct Browser Launch (Zero Setup)
Simply double-click or open:
```
c:\Users\aditya rahate\OneDrive\CivilConnect\index.html
```
in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Brave, Safari). It works completely offline with zero installation required!

### Option 2: Local HTTP Server (Node.js)
Open PowerShell or Terminal in this directory:
```powershell
npm start
# or
node server.js
```
Then visit:
```
http://localhost:3000
```

---

## 🛠️ Complete Feature Implementation (Sections 30 – 52)

### 30. Welcome / Splash Page
- **Full-screen Construction Visual**: High-resolution vector sky, distant Buldhana skyline silhouette, modern multi-storey buildings under construction with concrete slabs and scaffolding.
- **Dark Readability Overlay**: Smooth radial gradient preserving typography clarity.
- **Accents**: Construction amber/orange (`#f59e0b`, `#ea580c`, `#fbbf24`).
- **Branded Center Card**: CivilConnect logo with safety helmet badge, title, subtitle ("Connecting Construction Workers, Contractors & Construction Sites"), slogan ("Find work. Find skilled workers. Build together."), and action buttons: `[Get Started]` and `[Explore Construction Jobs]`.
- **District Tag**: "Serving Buldhana District, Maharashtra".
- **Welcome Animation Sequence**:
  1. Logo fades in (0ms)
  2. Logo scales up (300ms)
  3. Construction illustration smoothly appears (400ms)
  4. Title slides upward (600ms)
  5. Subtitle fades in (800ms)
  6. Action buttons scale in with subtle settle (1000ms)

### 31. Welcome Page Construction Animation
- **Subtle Animated Tower Crane**: Lattice mast, revolving horizontal jib, counter-jib with counterweight, moving trolley along the arm, and swaying hoist cable with suspended steel I-beam.
- **Construction Worker Silhouette**: Worker on scaffolding with animated golden welding sparks.
- **Building Up Animation**: Multi-floor concrete slab frames and scaffolding cross-bracing.
- **Floating Particles**: Drifting subtle dust motes and sunlight glints.
- **Moving Clouds & Sunlight Sheen**: Smooth continuous CSS translation across the sky.
- **Moving Construction Vehicle**: Animated dump truck / concrete mixer rolling along the foundation level.
- **Performance**: Pure hardware-accelerated CSS keyframes and SVG (<40KB total footprint).

### 32. Get Started Experience
- Clicking `[Get Started]` triggers a smooth transition into:
  **"How do you want to use CivilConnect?"**
- **4 Animated Role Cards**:
  1. 👷 **Worker / Labour**: Find construction jobs and labour requirements near your village.
  2. 🏗️ **Contractor**: Find skilled workers and post urgent labour requirements.
  3. 🏢 **Builder / Site Owner**: Manage construction sites and worker requirements.
  4. 🛠️ **Construction Supervisor**: Manage daily muster roll, worker attendance, and site logs.
- Each card has an icon box, role badge, hover elevation lift, arrow icon sliding right (`→`), and orange border glow.
- Selecting any card opens the 5-step registration modal with that specific role pre-selected!

### 33. Login / Register Animations
- **Login Modal**:
  - Modal backdrop blur and slide/fade entrance.
  - Side construction visual panel with safety quote.
  - Floating orange border focus on inputs.
  - Password visibility toggle (eye icon switch).
  - 1-Click Demo Login for all 4 roles (Worker, Contractor, Builder, Supervisor).
  - Animated button loading state ("Authenticating...").
- **Multi-Step Registration Form (5 Steps)**:
  - **Step 1: Basic Information** (Name, Phone, Email, Password, Confirm Password).
  - **Step 2: Location** (Buldhana Taluka dropdown: Khamgaon, Mehkar, Buldhana, Shegaon, Chikhli, etc., Village/Area, Pincode).
  - **Step 3: Skills & Role Details** (Worker skill checkboxes: Mason, Helper, Carpenter, Painter, Plumber, Electrician, RCC Worker, Tile Mason, or Contractor firm name and license).
  - **Step 4: Experience & Rates** (Years of experience, expected daily wage in ₹/day, past Buldhana projects).
  - **Step 5: Availability & Preferences** (Immediate, next week, day shift, own bike/bus transport).
  - **Interactive Progress Bar**: Connecting line fills from 0% to 100% (`●────○────○────○────○`) with step badge "Step X of 5".

### 34. Main Website Page Transitions
- Smooth 200–400ms transitions between Home, Jobs, Construction Sites, Workers Needed, Notifications, Dashboard, and About.
- Fade, slide, and subtle scale easing (`cubic-bezier(0.16, 1, 0.3, 1)`).

### 35. Navbar Animation
- Sticky modern navbar with glassmorphism.
- Transparent overlay on hero section; becomes solid with subtle elevation shadow on scroll (`.navbar-scrolled`).
- Logo: `🏗️ CivilConnect` with pulsating indicator dot.
- Theme switch (☀️ / 🌙) with spinning icon animation.
- Notification bell with live unread counter badge.
- Mobile animated hamburger menu (morphs from 3 bars to X).

### 36. Hero Section Animation
- Animated headline: "Find Construction Work. Find Skilled Workers." (word-by-word staggered reveal).
- Subtitle fade-in with hover-reactive CTA buttons.
- **Dynamic Animated Upward Counters**:
  - 👷 Registered Workers: counts 0 → 1,250+
  - 🏗️ Active Contractors: counts 0 → 180+
  - 🏢 Live Construction Sites: counts 0 → 75+
  - 🔨 Active Requirements: counts 0 → 320+
- Values update dynamically when jobs or workers are added!

### 37. Construction Job Card Animation
- Enters screen with fade-in and slide-up.
- Hover effect: card lifts by 5px, shadow expands with safety orange glow, and `[View Requirement →]` highlights with arrow sliding forward.
- Information displayed: Trade Category, Job Title, Buldhana Taluka & Village, Workers Needed & Filled, Daily Wage (₹700–₹1000/day), Urgent Badge, Contractor Name, and Posted Time Ago.
- Click opens detailed modal with site requirements and application form.

### 38. "Workers Needed Now" Urgent Section
- Dedicated high-priority section with 🔴 URGENT badge.
- **Gentle pulse animation** (`urgentGentlePulse`, no harsh or jarring blinking).
- Displays immediate requirements:
  - Mason (8 Workers Needed 📍 Khamgaon)
  - Helper (12 Workers Needed 📍 Mehkar)
  - Carpenter (4 Workers Needed 📍 Buldhana)
  - Electrician (2 Workers Needed 📍 Shegaon)
- Includes one-click "Apply Now" and direct "Call Contractor" buttons.

### 39. Construction Site Animation
- Cards for major Buldhana construction projects:
  - Khamgaon Bypass Commercial Complex
  - Mehkar Sub-District Hospital Extension
  - Shegaon Pilgrim Bhavan & Annachhatra
  - Buldhana Sadar Administrative Complex
  - Lonar Crater Eco-Tourism Welcome Center
  - Chikhli Mega Agricultural Terminal Yard
- Interactive hover zoom on site visual graphic (`transform: scale(1.06)`).
- Visual progress bar showing completion percentage and workers active vs required.

### 40. Buldhana Notification Animation
- "Latest Buldhana Construction Updates" section.
- Gentle bell chime wiggle animation on 🔔 icon.
- Small gradient "NEW" badge on recent updates.
- Real-time taluka filter tabs (All, Khamgaon, Mehkar, Buldhana, Shegaon, Chikhli, Lonar).
- **"Simulate Live Alert"** button: lets you trigger a real-time job alert with top-right toast notification!

### 41. Scroll Animations
- Native IntersectionObserver triggers smooth reveal classes (`reveal-fade-up`, `reveal-fade-left`, `reveal-scale`, `stagger-1` through `stagger-4`).
- No layout shifts or performance drops.

### 42. Micro Interactions
- Buttons: Press scale (0.97), glowing borders, spinner states.
- Inputs: Animated amber focus rings and validation feedback.
- Custom Checkboxes: Animated SVG checkmark pop.
- Toast Notifications: Slide in from top-right with auto-dismiss progress countdown bar.

### 43. Branded Loading Screen
- Animated construction loader: `🏗️` (Crane) → `🧱` (Bricks) → `🏠` (House) in smooth continuous sequence.
- "Connecting Construction Opportunities in Buldhana..."
- Fast initial load (<400ms).

### 44. Empty States
- Custom construction-themed empty state boxes with clear actions (`[Clear Filters]` or `[Reset Search]`) when queries return no results.

### 45. Success Animation
- Modal / toast celebration with SVG checkmark drawing (`stroke-dashoffset` keyframes).
- Triggered on:
  - Worker registration ("Welcome to CivilConnect!")
  - Job application submission ("Application Submitted Successfully!")
  - Contractor requirement posting ("Labour Requirement Published!")
  - Site registration ("Construction Site Added Successfully!")

### 46. Role-Specific Welcome
- Top of dashboard displays personalized greeting:
  - **Worker**: "Welcome back, [Name] 👷 - Let's find your next construction opportunity in Buldhana District."
  - **Contractor**: "Welcome back, [Name] 🏗️ - Find skilled workers and manage active labour requirements."
  - **Builder**: "Welcome back, [Name] 🏢 - Manage your construction sites and overall workforce deployment."
  - **Supervisor**: "Welcome back, [Name] 🦺 - Manage today's construction shift, muster roll, and site safety."

### 47. Dashboard Animations & Interactive Charts
- Animated metric cards (0 → target) tailored to each role.
- **3 Animated Charts Engine (`charts.js`)**:
  1. **Bar Chart**: Active Jobs by Buldhana Taluka (Khamgaon, Mehkar, Buldhana, Shegaon, etc.).
  2. **Doughnut Chart**: Workers by Trade Skill (Mason, Helper, Carpenter, RCC, Electrician, Painter).
  3. **Area / Line Chart**: Buldhana District Labour Hiring Trends & Demand vs Placed.
- Role-Specific Views:
  - Worker: Track submitted applications with statuses.
  - Contractor: Active requirements & applicant review.
  - Builder: Site workforce progress meters.
  - Supervisor: **Daily Muster Roll** with worker attendance status (Present, Late, Absent).

### 48. Dark / Light Mode Switcher
- Smooth animated theme switch (☀️ / 🌙) in the sticky navbar.
- Safety orange & amber accents remain consistent and legible in both modes.
- Preference is remembered across browser sessions in `localStorage`.

### 49 & 50. Animation Quality & Professionalism
- Built with CSS transforms and keyframes, hardware acceleration (`translate3d`, `opacity`, `will-change`).
- Professional construction industry aesthetic — clean, trustworthy, and fast.

### 51 & 52. Final Flow & Production Quality
- Complete operational flow from Welcome Splash -> Role Selection -> Registration -> Login -> Role Dashboard -> Job Search & Filters -> Apply -> Site Tracking.
- Every button, modal, filter, and action is fully functional with persistent database storage.

---

## 🏛️ Buldhana District Coverage (13 Talukas)
1. **Khamgaon** (Major commercial hub, cotton market, heavy civil projects)
2. **Mehkar** (Residential construction, sub-district hospital expansion)
3. **Buldhana** (District headquarters, administrative and residential sites)
4. **Shegaon** (Pilgrim infrastructure, Anand Sagar, guest house electrical & RCC)
5. **Chikhli** (Agricultural market yard, bypass flyovers, warehouses)
6. **Malkapur** (Railway junction infrastructure, commercial buildings)
7. **Jalgaon Jamod** (Satpura foothills, steel trusses, agricultural sheds)
8. **Nandura** (National Highway 53 service road paver work)
9. **Deulgaon Raja** (Balaji temple premises, community halls)
10. **Sindkhed Raja** (Historic heritage and public works)
11. **Lonar** (Crater eco-tourism welcome centers & lodges)
12. **Sangrampur** (Rural roads and canal civil works)
13. **Motala** (Nalganga dam irrigation wall masonry)
