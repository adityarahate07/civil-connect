/**
 * CivilConnect - High-Performance Animated Construction Charts Engine
 * Lightweight, zero-dependency SVG & Canvas charts with smooth render animations.
 */

(function (window) {
  'use strict';

  class CivilConnectCharts {
    constructor() {
      this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    }

    setTheme(isDark) {
      this.isDark = isDark;
    }

    // ----------------------------------------------------
    // 1. ANIMATED BAR CHART: Jobs by Buldhana Taluka
    // ----------------------------------------------------
    renderTalukaBarChart(containerId, data) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const labels = Object.keys(data);
      const values = Object.values(data);
      const maxValue = Math.max(...values, 1);

      const textColor = this.isDark ? '#94a3b8' : '#64748b';
      const labelColor = this.isDark ? '#e2e8f0' : '#1e293b';
      const gridColor = this.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

      let html = `
        <div class="chart-wrapper" style="width: 100%; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; height: 180px; padding: 10px 10px 30px 10px; border-bottom: 2px solid ${gridColor}; gap: 8px;">
      `;

      labels.forEach((taluka, index) => {
        const val = values[index];
        const percent = Math.max(12, Math.round((val / maxValue) * 100));
        const delay = index * 50;

        html += `
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; position: relative;" title="${taluka}: ${val} Active Jobs">
            <span style="font-size: 11px; font-weight: 700; color: #f59e0b; margin-bottom: 4px;">${val}</span>
            <div style="width: 100%; max-width: 28px; background: rgba(245, 158, 11, 0.15); border-radius: 6px 6px 0 0; height: 100%; display: flex; align-items: flex-end;">
              <div class="bar-fill" style="width: 100%; height: 0%; max-height: ${percent}%; background: linear-gradient(180deg, #f59e0b, #d97706); border-radius: 6px 6px 0 0; transition: height 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms; box-shadow: 0 2px 8px rgba(245,158,11,0.25);"></div>
            </div>
            <span style="position: absolute; bottom: -24px; font-size: 10px; font-weight: 500; color: ${textColor}; white-space: nowrap; transform: rotate(-25deg); transform-origin: top left;">${taluka.slice(0, 7)}</span>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;

      container.innerHTML = html;

      // Trigger animation on next frame
      requestAnimationFrame(() => {
        const bars = container.querySelectorAll('.bar-fill');
        bars.forEach((bar) => {
          const target = bar.style.maxHeight;
          bar.style.height = target;
        });
      });
    }

    // ----------------------------------------------------
    // 2. ANIMATED DOUGHNUT CHART: Workers by Skill
    // ----------------------------------------------------
    renderSkillDoughnutChart(containerId, data) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const labels = Object.keys(data);
      const values = Object.values(data);
      const total = values.reduce((sum, v) => sum + v, 0) || 1;

      const colors = [
        '#f59e0b', // Amber/Mason
        '#3b82f6', // Blue/Helper
        '#10b981', // Emerald/Carpenter
        '#8b5cf6', // Violet/Painter
        '#ec4899', // Pink/Plumber
        '#06b6d4', // Cyan/Electrician
        '#f97316', // Orange/RCC
        '#64748b'  // Slate/Other
      ];

      // Build SVG Donut with stroke-dasharray animation
      const size = 160;
      const strokeWidth = 24;
      const radius = (size - strokeWidth) / 2;
      const circumference = 2 * Math.PI * radius;

      let accumulatedAngle = 0;
      let pathsSvg = '';

      labels.forEach((label, i) => {
        const val = values[i];
        const slicePercent = val / total;
        const strokeLength = slicePercent * circumference;
        const strokeOffset = circumference - strokeLength;
        const rotation = accumulatedAngle * 360 - 90;
        accumulatedAngle += slicePercent;
        const color = colors[i % colors.length];

        pathsSvg += `
          <circle
            cx="${size / 2}" cy="${size / 2}" r="${radius}"
            fill="transparent"
            stroke="${color}"
            stroke-width="${strokeWidth}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${circumference}"
            data-target-offset="${strokeOffset}"
            transform="rotate(${rotation} ${size / 2} ${size / 2})"
            class="doughnut-segment"
            style="transition: stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms; cursor: pointer;"
          >
            <title>${label}: ${val} Workers (${Math.round(slicePercent * 100)}%)</title>
          </circle>
        `;
      });

      let legendHtml = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-left: 20px;">';
      labels.forEach((label, i) => {
        const val = values[i];
        const color = colors[i % colors.length];
        legendHtml += `
          <div style="display: flex; align-items: center; gap: 6px; font-size: 11px;">
            <span style="width: 10px; height: 10px; border-radius: 3px; background-color: ${color}; display: inline-block;"></span>
            <span style="color: ${this.isDark ? '#cbd5e1' : '#334155'}; font-weight: 500;">${label.split(' ')[0]}</span>
            <span style="font-weight: 700; color: #f59e0b; margin-left: auto;">${val}</span>
          </div>
        `;
      });
      legendHtml += '</div>';

      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 16px;">
          <div style="position: relative; width: ${size}px; height: ${size}px;">
            <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
              ${pathsSvg}
            </svg>
            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;">
              <span style="font-size: 20px; font-weight: 800; color: ${this.isDark ? '#fff' : '#0f172a'}; line-height: 1;">${total}</span>
              <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 600; margin-top: 2px;">Workers</span>
            </div>
          </div>
          ${legendHtml}
        </div>
      `;

      // Trigger animation
      requestAnimationFrame(() => {
        const segments = container.querySelectorAll('.doughnut-segment');
        segments.forEach((seg) => {
          seg.style.strokeDashoffset = seg.getAttribute('data-target-offset');
        });
      });
    }

    // ----------------------------------------------------
    // 3. ANIMATED AREA / LINE CHART: Monthly Hiring Trends
    // ----------------------------------------------------
    renderHiringAreaChart(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
      const demand = [120, 160, 210, 290, 380, 490];
      const hired = [95, 130, 185, 250, 330, 420];
      const maxVal = 550;

      const width = 380;
      const height = 150;
      const padding = 25;

      const pointsDemand = demand.map((val, idx) => {
        const x = padding + (idx / (months.length - 1)) * (width - 2 * padding);
        const y = height - padding - (val / maxVal) * (height - 2 * padding);
        return `${x},${y}`;
      });

      const pointsHired = hired.map((val, idx) => {
        const x = padding + (idx / (months.length - 1)) * (width - 2 * padding);
        const y = height - padding - (val / maxVal) * (height - 2 * padding);
        return `${x},${y}`;
      });

      const areaDemandPath = `M ${padding},${height - padding} L ${pointsDemand.join(' L ')} L ${width - padding},${height - padding} Z`;

      container.innerHTML = `
        <div style="width: 100%; overflow-x: auto;">
          <svg viewBox="0 0 ${width} ${height}" style="width: 100%; max-height: 170px; display: block;">
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.0"/>
              </linearGradient>
            </defs>

            <!-- Grid Lines -->
            <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="${this.isDark ? '#334155' : '#e2e8f0'}" stroke-width="1"/>
            <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="${this.isDark ? '#1e293b' : '#f1f5f9'}" stroke-dasharray="3,3" stroke-width="1"/>

            <!-- Area fill -->
            <path d="${areaDemandPath}" fill="url(#areaGradient)"/>

            <!-- Demand Line -->
            <path d="M ${pointsDemand.join(' L ')}" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>

            <!-- Hired Line -->
            <path d="M ${pointsHired.join(' L ')}" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="4,4" stroke-linecap="round"/>

            <!-- Data circles -->
            ${demand.map((v, i) => {
              const p = pointsDemand[i].split(',');
              return `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#f59e0b" stroke="#fff" stroke-width="1.5"><title>${months[i]} Demand: ${v}</title></circle>`;
            }).join('')}

            <!-- Month Labels -->
            ${months.map((m, i) => {
              const x = padding + (i / (months.length - 1)) * (width - 2 * padding);
              return `<text x="${x}" y="${height - 6}" font-size="10" fill="${this.isDark ? '#94a3b8' : '#64748b'}" text-anchor="middle" font-weight="500">${m}</text>`;
            }).join('')}
          </svg>

          <div style="display: flex; justify-content: center; gap: 16px; margin-top: 8px; font-size: 11px;">
            <div style="display: flex; align-items: center; gap: 5px;">
              <span style="width: 12px; height: 3px; background: #f59e0b; border-radius: 2px;"></span>
              <span style="color: ${this.isDark ? '#cbd5e1' : '#475569'};">Labour Demand</span>
            </div>
            <div style="display: flex; align-items: center; gap: 5px;">
              <span style="width: 12px; height: 3px; background: #10b981; border-radius: 2px; border-top: 2px dashed #10b981;"></span>
              <span style="color: ${this.isDark ? '#cbd5e1' : '#475569'};">Workers Placed</span>
            </div>
          </div>
        </div>
      `;
    }

    // ----------------------------------------------------
    // 4. ANIMATED COUNTER UP (Section 36 & 47)
    // ----------------------------------------------------
    animateCounter(element, target, prefix = '', suffix = '', duration = 1400) {
      if (!element) return;
      const start = 0;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(start + (target - start) * easeOut);

        element.textContent = prefix + currentVal.toLocaleString('en-IN') + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.textContent = prefix + target.toLocaleString('en-IN') + suffix;
        }
      }

      requestAnimationFrame(update);
    }
  }

  window.CivilConnectCharts = new CivilConnectCharts();
})(window);
