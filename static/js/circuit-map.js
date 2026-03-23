// circuit-map.js — standalone D3/TopoJSON circuit map
// Data is injected by the Jinja2 template as CIRCUIT_DATA, NODE_DATA, STATE_FIPS_DATA

(function () {
  // Build fips → circuit lookup
  const fipsToCircuit = {};
  CIRCUIT_DATA.forEach(c =>
    c.states.forEach(s => {
      if (STATE_FIPS_DATA[s]) fipsToCircuit[STATE_FIPS_DATA[s]] = c;
    })
  );

  function getCircuitColor(circuitId) {
    const id = circuitId.replace(" (Base)", "");
    const found = CIRCUIT_DATA.find(c => c.id === id);
    return found ? found.color : "#D4A574";
  }

  function normalizeId(circuitId) {
    return circuitId.replace(" (Base)", "");
  }

  const NODE_LABEL_OFFSETS = {
    "Boston, MA":                     { dx:  9, dy: -8,  anchor: "start" },
    "Providence, RI":                  { dx:  9, dy:  7,  anchor: "start" },
    "Portland, ME":                    { dx:  9, dy: -8,  anchor: "start" },
    "New York City / Brooklyn, NY":    { dx: -9, dy: -8,  anchor: "end"   },
    "Buffalo, NY":                     { dx: -9, dy: -8,  anchor: "end"   },
    "Hartford, CT":                    { dx:  9, dy:  7,  anchor: "start" },
    "Philadelphia / Newark":           { dx:  9, dy:  7,  anchor: "start" },
    "Pittsburgh, PA":                  { dx: -9, dy: -8,  anchor: "end"   },
    "Camden, NJ":                      { dx: -9, dy:  7,  anchor: "end"   },
    "Alexandria / Baltimore":          { dx: -9, dy: -8,  anchor: "end"   },
    "Richmond, VA":                    { dx:  9, dy:  7,  anchor: "start" },
    "Charlotte, NC":                   { dx:  9, dy: -8,  anchor: "start" },
    "Houston / El Paso, TX":           { dx:  9, dy:  7,  anchor: "start" },
    "New Orleans, LA":                 { dx:  9, dy: -8,  anchor: "start" },
    "San Antonio, TX":                 { dx: -9, dy:  7,  anchor: "end"   },
    "Detroit, MI":                     { dx:  9, dy: -8,  anchor: "start" },
    "Cleveland, OH":                   { dx:  9, dy: -2,  anchor: "start" },
    "Memphis, TN":                     { dx:  9, dy: -8,  anchor: "start" },
    "Chicago, IL":                     { dx: -9, dy: -8,  anchor: "end"   },
    "Milwaukee, WI":                   { dx: -9, dy: -8,  anchor: "end"   },
    "Indianapolis, IN":                { dx:  9, dy:  7,  anchor: "start" },
    "St. Louis, MO":                   { dx:  9, dy:  7,  anchor: "start" },
    "Minneapolis, MN":                 { dx: -9, dy: -8,  anchor: "end"   },
    "Kansas City, MO":                 { dx: -9, dy:  7,  anchor: "end"   },
    "Sacramento / Stockton, CA":       { dx: 10, dy: -14, anchor: "end"   },
    "San Francisco, CA":               { dx: -9, dy: -8,  anchor: "end"   },
    "Oakland, CA":                     { dx:  9, dy: -8,  anchor: "start" },
    "San Jose, CA":                    { dx:  9, dy:  7,  anchor: "start" },
    "Fresno, CA":                      { dx:  9, dy: -8,  anchor: "start" },
    "Bakersfield, CA":                 { dx:  9, dy:  7,  anchor: "start" },
    "San Bernardino, CA":              { dx:  9, dy:  7,  anchor: "start" },
    "Los Angeles, CA":                 { dx: -9, dy: -8,  anchor: "end"   },
    "Phoenix, AZ":                     { dx:  9, dy:  7,  anchor: "start" },
    "Denver / Albuquerque":            { dx:  9, dy: -8,  anchor: "start" },
    "Salt Lake City, UT":              { dx: -9, dy: -8,  anchor: "end"   },
    "Oklahoma City, OK":               { dx:  9, dy:  7,  anchor: "start" },
    "Atlanta / Miami":                 { dx:  9, dy:  7,  anchor: "start" },
    "Orlando, FL":                     { dx:  9, dy: -8,  anchor: "start" },
    "Birmingham, AL":                  { dx: -9, dy:  7,  anchor: "end"   },
    "Washington, D.C.":                { dx: -9, dy: -8,  anchor: "end"   },
    "Silver Spring, MD":               { dx:  9, dy: -8,  anchor: "start" },
  };

  const EAST_CALLOUT_NUDGE = { "Buffalo, NY": -10, "Camden, NJ": -20 };
  const WEST_CALLOUT = new Set(["San Francisco, CA", "Oakland, CA", "San Jose, CA", "Bakersfield, CA"]);
  const EAST_CALLOUT = new Set(["Buffalo, NY", "Hartford, CT", "Camden, NJ", "Alexandria / Baltimore", "Silver Spring, MD"]);

  const container = document.getElementById("circuit-map");
  if (!container) return;

  const W = 960, H = 600;
  const projection = d3.geoAlbersUsa().scale(1100).translate([480, 300]);
  const pathGen = d3.geoPath().projection(projection);

  // Create SVG
  const svg = d3.select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${W} ${H}`)
    .style("width", "100%")
    .style("height", "100%");

  // Defs
  const defs = svg.append("defs");
  const radGrad = defs.append("radialGradient").attr("id", "mapBg").attr("cx", "50%").attr("cy", "40%").attr("r", "75%");
  radGrad.append("stop").attr("offset", "0%").attr("stop-color", "#14192A");
  radGrad.append("stop").attr("offset", "100%").attr("stop-color", "#0A0E17");
  const pat = defs.append("pattern").attr("id", "dotGrid").attr("x", 0).attr("y", 0).attr("width", 28).attr("height", 28).attr("patternUnits", "userSpaceOnUse");
  pat.append("circle").attr("cx", 14).attr("cy", 14).attr("r", 0.65).attr("fill", "rgba(255,255,255,0.055)");
  const glow = defs.append("filter").attr("id", "nodeGlow").attr("x", "-80%").attr("y", "-80%").attr("width", "260%").attr("height", "260%");
  glow.append("feGaussianBlur").attr("stdDeviation", 2.5).attr("result", "blur");
  const merge = glow.append("feMerge");
  merge.append("feMergeNode").attr("in", "blur");
  merge.append("feMergeNode").attr("in", "SourceGraphic");

  // Background
  svg.append("rect").attr("width", W).attr("height", H).attr("fill", "url(#mapBg)").attr("rx", 10);
  svg.append("rect").attr("width", W).attr("height", H).attr("fill", "url(#dotGrid)").attr("rx", 10);

  const statesGroup = svg.append("g").attr("class", "states");
  const nodesGroup  = svg.append("g").attr("class", "nodes");

  // Tooltip div (appended to body)
  const tooltip = d3.select("body").append("div")
    .style("position", "fixed")
    .style("pointer-events", "none")
    .style("display", "none")
    .style("background", "#1E293B")
    .style("border", "1px solid #2D3748")
    .style("border-radius", "8px")
    .style("padding", "10px 14px")
    .style("max-width", "280px")
    .style("z-index", "1000")
    .style("font-family", '"DM Sans", sans-serif');

  let hoveredCircuit = null;

  function updateHighlight() {
    statesGroup.selectAll("path")
      .attr("fill-opacity", d => {
        if (!hoveredCircuit) return 0.55;
        const c = fipsToCircuit[d.id];
        if (!c) return 0.55;
        return normalizeId(c.id) === hoveredCircuit ? 1.0 : 0.2;
      });
    nodesGroup.selectAll("text.city-label")
      .attr("fill-opacity", d => {
        if (!hoveredCircuit) return 0.9;
        return normalizeId(d.circuit) === hoveredCircuit ? 1.0 : 0.3;
      })
      .attr("font-size", d =>
        hoveredCircuit && normalizeId(d.circuit) === hoveredCircuit ? 12 : 9
      );
  }

  fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
    .then(r => r.json())
    .then(topo => {
      const geo = topojson.feature(topo, topo.objects.states);

      statesGroup.selectAll("path")
        .data(geo.features)
        .enter()
        .append("path")
        .attr("d", pathGen)
        .attr("fill", d => {
          const c = fipsToCircuit[d.id];
          return c ? c.color : "#1C2535";
        })
        .attr("fill-opacity", 0.55)
        .attr("stroke", "#0A0E17")
        .attr("stroke-width", 0.7)
        .style("cursor", "default")
        .on("mouseenter", function (event, d) {
          const c = fipsToCircuit[d.id];
          if (c) {
            hoveredCircuit = normalizeId(c.id);
            updateHighlight();
          }
        })
        .on("mouseleave", function () {
          hoveredCircuit = null;
          updateHighlight();
        });

      drawNodes();
    })
    .catch(() => { drawNodes(); });

  function drawNodes() {
    // West callout
    const westCities = NODE_DATA
      .filter(n => WEST_CALLOUT.has(n.city))
      .map(n => { const p = projection([n.lng, n.lat]); return p ? { n, cx: p[0], cy: p[1] } : null; })
      .filter(Boolean)
      .sort((a, b) => a.cy - b.cy);
    const westYs = [];
    westCities.forEach(({ cy }, i) => {
      westYs.push(i === 0 ? cy : Math.max(cy, westYs[i - 1] + 13));
    });
    const calloutWestX = 90;
    westCities.forEach(({ n, cx, cy }, i) => {
      const col = getCircuitColor(n.circuit);
      const ly = westYs[i];
      const shortName = n.city.split(" / ")[0].split(", ")[0];
      nodesGroup.append("polyline")
        .attr("points", `${cx},${cy} ${calloutWestX + 3},${ly}`)
        .attr("fill", "none").attr("stroke", col).attr("stroke-width", 0.65).attr("stroke-opacity", 0.4);
      nodesGroup.append("text")
        .datum(n)
        .attr("class", "city-label")
        .attr("x", calloutWestX).attr("y", ly + 3.5)
        .attr("text-anchor", "end")
        .attr("fill", col).attr("fill-opacity", 0.9)
        .attr("font-size", 9).attr("font-family", "DM Sans, sans-serif")
        .text(shortName);
    });

    // East callout
    const eastCities = NODE_DATA
      .filter(n => EAST_CALLOUT.has(n.city))
      .map(n => { const p = projection([n.lng, n.lat]); return p ? { n, cx: p[0], cy: p[1] } : null; })
      .filter(Boolean)
      .sort((a, b) => a.cy - b.cy);
    const eastYs = [];
    eastCities.forEach(({ cy }, i) => {
      eastYs.push(i === 0 ? cy : Math.max(cy, eastYs[i - 1] + 13));
    });
    const calloutEastX = 852;
    eastCities.forEach(({ n, cx, cy }, i) => {
      const col = getCircuitColor(n.circuit);
      const ly = eastYs[i] + (EAST_CALLOUT_NUDGE[n.city] || 0);
      const shortName = n.city.split(" / ")[0].split(", ")[0];
      nodesGroup.append("polyline")
        .attr("points", `${cx},${cy} ${calloutEastX - 3},${ly}`)
        .attr("fill", "none").attr("stroke", col).attr("stroke-width", 0.65).attr("stroke-opacity", 0.4);
      nodesGroup.append("text")
        .datum(n)
        .attr("class", "city-label")
        .attr("x", calloutEastX).attr("y", ly + 3.5)
        .attr("text-anchor", "start")
        .attr("fill", col).attr("fill-opacity", 0.9)
        .attr("font-size", 9).attr("font-family", "DM Sans, sans-serif")
        .text(shortName);
    });

    // Main nodes
    NODE_DATA.forEach((n, i) => {
      const pos = projection([n.lng, n.lat]);
      if (!pos) return;
      const [cx, cy] = pos;
      const col = getCircuitColor(n.circuit);
      const isHQ = n.circuit === "9th (Base)";

      const g = nodesGroup.append("g").attr("filter", "url(#nodeGlow)");

      // Halo ring
      g.append("circle").attr("cx", cx).attr("cy", cy).attr("r", isHQ ? 8 : 5.5)
        .attr("fill", "none").attr("stroke", col).attr("stroke-width", 1.2).attr("stroke-opacity", 0.4);

      // Node shape
      if (isHQ) {
        g.append("rect")
          .attr("x", cx - 4.5).attr("y", cy - 4.5).attr("width", 9).attr("height", 9)
          .attr("fill", col).attr("stroke", "#0A0E17").attr("stroke-width", 1.5)
          .attr("transform", `rotate(45 ${cx} ${cy})`)
          .style("cursor", "pointer")
          .on("mouseenter", (event) => showTooltip(event, n, col))
          .on("mousemove", (event) => moveTooltip(event))
          .on("mouseleave", () => hideTooltip(n));
        g.append("text").attr("x", cx + 13).attr("y", cy - 11)
          .attr("fill", col).attr("font-size", 9)
          .attr("font-family", "JetBrains Mono, monospace").attr("font-weight", 700)
          .attr("letter-spacing", 1.5).text("HQ");
      } else {
        g.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 4)
          .attr("fill", col).attr("stroke", "#0A0E17").attr("stroke-width", 1.5)
          .style("cursor", "pointer")
          .on("mouseenter", (event) => showTooltip(event, n, col))
          .on("mousemove", (event) => moveTooltip(event))
          .on("mouseleave", () => hideTooltip(n));
      }

      // Inline label (skip callout cities)
      if (!WEST_CALLOUT.has(n.city) && !EAST_CALLOUT.has(n.city)) {
        const off = NODE_LABEL_OFFSETS[n.city] || { dx: 9, dy: -8, anchor: "start" };
        const shortName = n.city.split(" / ")[0].split(", ")[0];
        g.append("text")
          .datum(n)
          .attr("class", "city-label")
          .attr("x", cx + off.dx).attr("y", cy + off.dy)
          .attr("text-anchor", off.anchor)
          .attr("fill", col).attr("fill-opacity", 0.9)
          .attr("font-size", 9).attr("font-family", "DM Sans, sans-serif")
          .text(shortName);
      }
    });
  }

  function showTooltip(event, n, col) {
    hoveredCircuit = normalizeId(n.circuit);
    updateHighlight();
    tooltip
      .style("display", "block")
      .style("border-color", col + "99")
      .html(`
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span style="width:8px;height:8px;border-radius:50%;background:${col};box-shadow:0 0 8px ${col};flex-shrink:0"></span>
          <span style="font-weight:600;font-size:13px;color:#E2E8F0">${n.city}</span>
        </div>
        <div style="font-size:10px;font-family:'JetBrains Mono',monospace;color:${col};background:${col}1A;border-radius:4px;padding:2px 8px;display:inline-block;margin-bottom:8px">${n.circuit} Circuit</div>
        <div style="font-size:12px;color:#94A3B8;line-height:1.6">${n.rationale}</div>
      `);
    moveTooltip(event);
  }

  function moveTooltip(event) {
    tooltip.style("left", (event.clientX + 16) + "px").style("top", (event.clientY - 10) + "px");
  }

  function hideTooltip(n) {
    tooltip.style("display", "none");
    hoveredCircuit = null;
    updateHighlight();
  }
})();
