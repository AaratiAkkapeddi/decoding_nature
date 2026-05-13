let cnv;
let hoveredStation = null;
let lockedStation = null;
let lastPanelStationId = null;
let currentLens = "rate";

let hoveredLegendRoute = null;
let activeLegendRoute = null;
let activeRouteStop = null;
let routeFocusFlash = 0;

const FLOW_SPEED = 0.00082;
const HALO_SPEED = 0.038;

function setup() {
  const holder = document.getElementById("map-canvas");

  if (!holder) {
    console.error("Missing #map-canvas div in index.html.");
    return;
  }

  const w = holder.clientWidth;
  const h = Math.round((w * DESIGN_H) / DESIGN_W);

  cnv = createCanvas(w, h);
  cnv.parent("map-canvas");

  pixelDensity(1);
  textFont("Helvetica");

  setupModeButtons();
  setupRouteLegendInteractions();

  lockedStation = getStationById(DEFAULT_STATION_ID);
  updatePanel(lockedStation);
}

function windowResized() {
  const holder = document.getElementById("map-canvas");
  if (!holder || !cnv) return;

  const w = holder.clientWidth;
  const h = Math.round((w * DESIGN_H) / DESIGN_W);

  resizeCanvas(w, h);
}

function draw() {
  detectHover();

  const activeStation =
    lockedStation || hoveredStation || getStationById(DEFAULT_STATION_ID);

  if (!lastPanelStationId || activeStation.id !== lastPanelStationId) {
    updatePanel(activeStation);
    lastPanelStationId = activeStation.id;
  }

  background(MTA.water);

  push();
  scale(width / DESIGN_W, height / DESIGN_H);

  drawCartographicBase();
  drawWaterLabels();
  drawBoroughLabels();
  drawFerry();
  drawRoutes();
  drawAnimatedFlow();
  drawMinorStops();
  drawStations(activeStation);
  drawRouteFocusHalo();
  drawRouteAcknowledgeHUD();
  drawCursorAssist();
  drawHoverTooltip();

  pop();
}

function setupModeButtons() {
  const buttons = document.querySelectorAll(".mode-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      currentLens = button.dataset.mode;

      buttons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");

      setText("lensContext", LENS_COPY[currentLens] || LENS_COPY.rate);
    });
  });
}

function setupRouteLegendInteractions() {
  const pills = document.querySelectorAll(".legend .pill");

  pills.forEach((pill) => {
    const route = pill.textContent.trim();

    pill.dataset.route = route;
    pill.classList.add("route-hoverable");
    pill.title = `${route} · ${getRouteName(route)}`;

    pill.addEventListener("mouseenter", () => {
      hoveredLegendRoute = route;
      updateRouteLensText(route, "hover");
    });

    pill.addEventListener("mouseleave", () => {
      hoveredLegendRoute = null;

      if (activeLegendRoute) {
        updateRouteLensText(activeLegendRoute, "active");
      } else {
        setText("lensContext", LENS_COPY[currentLens] || LENS_COPY.rate);
      }
    });

    pill.addEventListener("click", () => {
      const alreadyActive = activeLegendRoute === route;

      document
        .querySelectorAll(".legend .pill")
        .forEach((p) => p.classList.remove("route-active"));

      if (alreadyActive) {
        activeLegendRoute = null;
        activeRouteStop = null;
        routeFocusFlash = 0;
        setText("lensContext", LENS_COPY[currentLens] || LENS_COPY.rate);
        return;
      }

      activeLegendRoute = route;
      activeRouteStop = chooseRouteStop(route);
      routeFocusFlash = 1;

      pill.classList.add("route-active");
      updateRouteLensText(route, "active");
    });
  });
}

function drawCartographicBase() {
  noStroke();

  fill(MTA.land);

  // Manhattan
  beginShape();
  vertex(280, 25);
  vertex(355, 20);
  vertex(385, 210);
  vertex(368, 520);
  vertex(350, 705);
  vertex(300, 705);
  vertex(260, 500);
  vertex(255, 245);
  endShape(CLOSE);

  // Bronx
  beginShape();
  vertex(505, 65);
  vertex(700, 50);
  vertex(825, 120);
  vertex(835, 255);
  vertex(710, 265);
  vertex(560, 240);
  vertex(525, 140);
  endShape(CLOSE);

  // Queens
  beginShape();
  vertex(620, 85);
  vertex(850, 70);
  vertex(985, 145);
  vertex(995, 355);
  vertex(885, 440);
  vertex(690, 410);
  vertex(585, 300);
  vertex(580, 165);
  endShape(CLOSE);

  // Brooklyn
  beginShape();
  vertex(545, 420);
  vertex(830, 475);
  vertex(940, 680);
  vertex(790, 720);
  vertex(620, 720);
  vertex(470, 605);
  endShape(CLOSE);

  // Staten Island
  beginShape();
  vertex(85, 485);
  vertex(240, 455);
  vertex(315, 560);
  vertex(250, 695);
  vertex(105, 655);
  vertex(50, 565);
  endShape(CLOSE);

  // Parks / civic green zones
  fill(MTA.park);
  rect(300, 135, 42, 120, 20);
  rect(560, 75, 60, 110, 24);
  rect(770, 595, 115, 80, 28);

  // Cartographic grid
  stroke(MTA.grid);
  strokeWeight(1);

  for (let x = 0; x <= DESIGN_W; x += 40) {
    line(x, 0, x, DESIGN_H);
  }

  for (let y = 0; y <= DESIGN_H; y += 40) {
    line(0, y, DESIGN_W, y);
  }

  // Light rail / geography guide marks
  stroke("rgba(69,106,151,.35)");
  strokeWeight(2);
  line(110, 350, 280, 350);
  line(735, 130, 1000, 130);
  line(790, 210, 1000, 210);
}

function drawWaterLabels() {
  push();
  fill(MTA.waterText);
  noStroke();
  textStyle(BOLD);
  textAlign(CENTER, CENTER);

  textSize(15);
  text("LONG ISLAND SOUND", 835, 105);

  push();
  translate(75, 470);
  rotate(-HALF_PI);
  text("HUDSON RIVER", 0, 0);
  pop();

  push();
  translate(520, 310);
  rotate(-1.13);
  text("EAST RIVER", 0, 0);
  pop();

  push();
  translate(535, 165);
  rotate(-1.25);
  text("HARLEM RIVER", 0, 0);
  pop();

  text("UPPER NEW YORK BAY", 290, 700);
  text("JAMAICA BAY", 830, 705);
  text("THE NARROWS", 200, 555);

  pop();
}

function drawBoroughLabels() {
  push();
  fill(MTA.boroughText);
  noStroke();
  textStyle(BOLD);
  textAlign(CENTER, CENTER);

  textSize(34);
  text("MANHATTAN", 350, 330);
  text("THE BRONX", 640, 135);
  text("QUEENS", 830, 240);
  text("BROOKLYN", 655, 515);
  text("STATEN ISLAND", 150, 560);

  pop();
}

function drawFerry() {
  push();
  stroke(45, 123, 201, 170);
  strokeWeight(3);
  noFill();

  drawingContext.setLineDash([14, 10]);
  beginShape();
  vertex(185, 500);
  vertex(250, 525);
  vertex(315, 530);
  endShape();

  drawingContext.setLineDash([]);

  noStroke();
  fill(MTA.civicBlue);
  textSize(13);
  textStyle(BOLD);
  textAlign(CENTER, BOTTOM);
  text("Staten Island Ferry", 250, 495);

  pop();
}

function drawRoutes() {
  const focusRoute = activeLegendRoute || hoveredLegendRoute;

  for (const group of routeGroups) {
    const offsets = getVisualOffsets(group);
    const isFocusedGroup = focusRoute
      ? group.labels.includes(focusRoute)
      : true;

    for (let i = 0; i < offsets.length; i++) {
      const shifted = offsetPolyline(group.points, offsets[i]);

      noFill();

      stroke(255, 255, 255, isFocusedGroup ? 130 : 55);
      strokeWeight(isFocusedGroup ? 12 : 8);
      drawPolyline(shifted);

      stroke(hexToRgba(group.color, isFocusedGroup ? 255 : 78));
      strokeWeight(isFocusedGroup ? 7.4 : 4.2);
      drawPolyline(shifted);

      stroke(0, 0, 0, isFocusedGroup ? 45 : 18);
      strokeWeight(1);
      drawPolyline(shifted);
    }
  }
}

function drawAnimatedFlow() {
  const focusRoute = activeLegendRoute || hoveredLegendRoute;

  for (let g = 0; g < routeGroups.length; g++) {
    const group = routeGroups[g];
    const offsets = getVisualOffsets(group);
    const isFocusedGroup = focusRoute
      ? group.labels.includes(focusRoute)
      : true;

    for (let i = 0; i < offsets.length; i++) {
      const shifted = offsetPolyline(group.points, offsets[i]);
      const markerCount = isFocusedGroup ? 3 : 1;

      for (let k = 0; k < markerCount; k++) {
        const t = (frameCount * 0.00042 + k * 0.36 + i * 0.04 + g * 0.017) % 1;

        const p = pointOnPolyline(shifted, t);

        noStroke();
        fill(255, 255, 255, isFocusedGroup ? 170 : 65);
        circle(p.x, p.y, isFocusedGroup ? 6.8 : 4.2);

        fill(hexToRgba(group.color, isFocusedGroup ? 255 : 95));
        circle(p.x, p.y, isFocusedGroup ? 3.3 : 2.1);
      }
    }
  }
}

function drawMinorStops() {
  const focusRoute = activeLegendRoute || hoveredLegendRoute;
  const stops = getAllOverlayStops();

  push();
  textAlign(LEFT, CENTER);
  textStyle(BOLD);

  for (let i = 0; i < stops.length; i++) {
    const s = stops[i];
    const belongsToFocus = focusRoute && stopHasRoute(s, focusRoute);
    const shouldDim = focusRoute && !belongsToFocus;

    stroke(0, 0, 0, shouldDim ? 40 : 135);
    strokeWeight(0.9);
    fill(255, 255, 255, shouldDim ? 65 : 235);
    circle(s.x, s.y, belongsToFocus ? 8.4 : 6.6);

    noStroke();
    fill(hexToRgba(s.color, shouldDim ? 70 : 255));
    circle(s.x, s.y, belongsToFocus ? 4.4 : 3.2);

    if (shouldShowOverlayStopLabel(s, i, focusRoute)) {
      fill(0, 0, 0, shouldDim ? 65 : 230);
      textSize(belongsToFocus ? 8.4 : 7.4);

      stroke(255, 255, 255, shouldDim ? 90 : 210);
      strokeWeight(2.4);
      text(s.name, s.x + 7, s.y - 7);
    }
  }

  pop();
}

function drawStations(activeStation) {
  for (const s of stations) {
    const isHover = hoveredStation && hoveredStation.id === s.id;
    const isLocked = lockedStation && lockedStation.id === s.id;
    const isActive = activeStation && activeStation.id === s.id;

    if (isActive) {
      drawHalo(s);
    }

    stroke("#222");
    strokeWeight(isLocked ? 2.4 : 1.8);
    fill("#ffffff");
    circle(s.x, s.y, isHover || isLocked ? 14 : 12);

    noStroke();
    fill(getStationColor(s));
    circle(s.x, s.y, isHover || isLocked ? 7.5 : 6);

    drawStationLabel(s, isActive);
    drawRouteDock(s, isActive);
  }
}

function drawHalo(s) {
  const haloSize = 24 + sin(frameCount * HALO_SPEED) * 5;

  noFill();
  stroke(0, 57, 166, 95);
  strokeWeight(3);
  circle(s.x, s.y, haloSize);

  stroke(0, 57, 166, 50);
  strokeWeight(2);
  circle(s.x, s.y, haloSize + 18);

  stroke(255, 255, 255, 135);
  strokeWeight(1.5);
  circle(s.x, s.y, haloSize + 30);
}

function drawStationLabel(station, isActive) {
  const focusRoute = activeLegendRoute || hoveredLegendRoute;
  const routeFocused = focusRoute && station.routes.includes(focusRoute);

  const important =
    isActive ||
    routeFocused ||
    station.id === "72st" ||
    station.id === "timessq" ||
    station.id === "grandcentral" ||
    station.id === "jackson" ||
    station.id === "atlantic" ||
    station.id === "bwayjct" ||
    station.id === "jamaica" ||
    station.id === "stgeorge" ||
    station.id === "tottenville" ||
    station.readingRate < 50;

  if (!important) return;

  push();
  textAlign(LEFT, CENTER);
  textSize(isActive || routeFocused ? 10.2 : 8.3);
  textStyle(BOLD);

  stroke(255, 255, 255, 225);
  strokeWeight(3);
  fill(routeFocused ? routeColor(focusRoute) : "#1c1c1c");
  text(station.name, station.x + 10, station.y - 11);

  pop();
}

function drawRouteDock(station, isActive) {
  const focusRoute = activeLegendRoute || hoveredLegendRoute;
  const routeFocused = focusRoute && station.routes.includes(focusRoute);
  const majorTransfer = station.routes.length >= 5;
  const clicked = lockedStation && lockedStation.id === station.id;
  const hovered = hoveredStation && hoveredStation.id === station.id;

  if (!isActive && !clicked && !hovered && !majorTransfer && !routeFocused)
    return;

  const routes = station.routes.slice(0, 9);
  const padX = 8;
  const badgeW = 17;
  const badgeGap = 3;
  const w = padX * 2 + routes.length * badgeW + (routes.length - 1) * badgeGap;
  const h = 25;

  let bx = station.x - w * 0.5;
  let by = station.y - 34;

  if (bx < 6) bx = 6;
  if (bx + w > DESIGN_W - 6) bx = DESIGN_W - w - 6;
  if (by < 6) by = station.y + 12;

  stroke(routeFocused ? routeColor(focusRoute) : "#3c3c3c");
  strokeWeight(isActive || hovered || clicked || routeFocused ? 2 : 1.25);
  fill(
    255,
    255,
    255,
    isActive || hovered || clicked || routeFocused ? 248 : 220
  );
  rect(bx, by, w, h, 8);

  for (let i = 0; i < routes.length; i++) {
    const r = routes[i];
    const cx = bx + padX + i * (badgeW + badgeGap) + badgeW / 2;
    const cy = by + h / 2;
    const thisBadgeFocused = focusRoute && r === focusRoute;

    stroke(thisBadgeFocused ? routeColor(r) : "#222");
    strokeWeight(thisBadgeFocused ? 2 : 1);
    fill(routeColor(r));
    circle(cx, cy, thisBadgeFocused ? 15 : 13);

    noStroke();
    fill(routeUsesDarkText(r) ? "#111" : "#fff");
    textAlign(CENTER, CENTER);
    textSize(r.length > 1 ? 6.6 : 8.4);
    textStyle(BOLD);
    text(r, cx, cy + 0.3);
  }
}

function drawCursorAssist() {
  if (!mouseInsideCanvas()) return;

  const p = toDesignPoint(mouseX, mouseY);

  push();
  stroke(0, 57, 166, 35);
  strokeWeight(1);
  line(p.x, 0, p.x, DESIGN_H);
  line(0, p.y, DESIGN_W, p.y);

  noFill();
  stroke(0, 57, 166, 82);
  strokeWeight(2);
  circle(p.x, p.y, 18);

  pop();
}

function drawHoverTooltip() {
  if (!hoveredStation || lockedStation) return;

  const s = hoveredStation;
  const p = toDesignPoint(mouseX, mouseY);
  const w = 184;
  const h = 66;

  let tx = p.x + 14;
  let ty = p.y - 76;

  if (tx + w > DESIGN_W - 12) tx = p.x - w - 14;
  if (ty < 12) ty = p.y + 14;

  push();

  stroke("#2c2c2c");
  strokeWeight(1.6);
  fill(255, 255, 255, 246);
  rect(tx, ty, w, h, 8);

  noStroke();
  fill("#111");
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(11);
  text(s.name, tx + 10, ty + 8);

  fill(MTA.civicBlue);
  textSize(10);
  text(`${s.readingRate}% reading · ${s.supportNeed} need`, tx + 10, ty + 28);

  fill("#555");
  textSize(9.5);
  text(`${s.borough} · ${s.district} · ${currentLens}`, tx + 10, ty + 43);

  pop();
}

function drawRouteFocusHalo() {
  if (!activeLegendRoute || !activeRouteStop) return;

  const c = routeColor(activeLegendRoute);
  const pulse = 1 + sin(frameCount * 0.065) * 0.14;

  routeFocusFlash = max(0, routeFocusFlash - 0.012);

  push();
  noFill();

  stroke(hexToRgba(c, 110 + routeFocusFlash * 120));
  strokeWeight(4);
  circle(activeRouteStop.x, activeRouteStop.y, 34 * pulse);

  stroke(hexToRgba(c, 58));
  strokeWeight(7);
  circle(activeRouteStop.x, activeRouteStop.y, 52 * pulse);

  noStroke();
  fill(hexToRgba(c, 255));
  circle(activeRouteStop.x, activeRouteStop.y, 14);

  fill(routeUsesDarkText(activeLegendRoute) ? "#111" : "#fff");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(activeLegendRoute.length > 1 ? 7 : 10);
  text(activeLegendRoute, activeRouteStop.x, activeRouteStop.y + 0.5);

  pop();
}

function drawRouteAcknowledgeHUD() {
  const route = activeLegendRoute || hoveredLegendRoute;

  if (!route) return;

  const name = getRouteName(route);
  const c = routeColor(route);
  const stopName = activeRouteStop ? activeRouteStop.name : "hover preview";

  push();

  const x = 20;
  const y = 20;
  const w = 285;
  const h = 58;

  stroke("#111");
  strokeWeight(2);
  fill(255, 255, 255, 238);
  rect(x, y, w, h, 9);

  fill(c);
  noStroke();
  circle(x + 28, y + 29, 31);

  fill(routeUsesDarkText(route) ? "#111" : "#fff");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(route.length > 1 ? 10 : 15);
  text(route, x + 28, y + 30);

  fill("#111");
  textAlign(LEFT, TOP);
  textSize(11);
  text(`${route} · ${name}`, x + 52, y + 12);

  fill("#0039a6");
  textSize(9.5);
  text(`Line acknowledged · ${stopName}`, x + 52, y + 31);

  pop();
}

function detectHover() {
  hoveredStation = null;

  if (!mouseInsideCanvas()) return;

  const p = toDesignPoint(mouseX, mouseY);
  let best = null;
  let bestDist = Infinity;

  for (const s of stations) {
    const d = dist(p.x, p.y, s.x, s.y);

    if (d < 17 && d < bestDist) {
      best = s;
      bestDist = d;
    }
  }

  hoveredStation = best;
}

function mousePressed() {
  if (!mouseInsideCanvas()) return;

  if (hoveredStation) {
    lockedStation =
      lockedStation && lockedStation.id === hoveredStation.id
        ? null
        : hoveredStation;

    updatePanel(hoveredStation);
  } else {
    lockedStation = null;
  }
}

function touchStarted() {
  mousePressed();
  return false;
}

function mouseInsideCanvas() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function toDesignPoint(mx, my) {
  return {
    x: mx * (DESIGN_W / width),
    y: my * (DESIGN_H / height),
  };
}

function updatePanel(station) {
  if (!station) return;

  const signal = getSignalLabel(station.readingRate);

  setText("stationName", station.name);
  setText(
    "stationMeta",
    `${station.borough} · ${station.district} · ${station.type}`
  );
  setText("readingRate", `${station.readingRate}%`);
  setText("readingSignal", `Signal: ${signal}`);
  setText("medianIncome", formatMoney(station.income));
  setText("englishLearners", `${station.englishLearners.toFixed(1)}%`);
  setText("cityGap", `${station.gap >= 0 ? "+" : ""}${station.gap} pts`);
  setText("supportNeed", station.supportNeed);
  setText("dataStatus", station.status);
  setText("stationContext", station.note);
  setText("lensContext", LENS_COPY[currentLens] || LENS_COPY.rate);

  const routeWrap = document.getElementById("routeBadges");

  if (routeWrap) {
    routeWrap.innerHTML = station.routes
      .map((r) => `<span class="route-badge ${routeClass(r)}">${r}</span>`)
      .join("");
  }
}

function updateRouteLensText(route, state) {
  const verb = state === "active" ? "Locked route" : "Previewing route";
  const stopText = activeRouteStop
    ? ` Pulse stop: ${activeRouteStop.name}.`
    : "";

  setText(
    "lensContext",
    `${verb}: ${route} · ${getRouteName(route)}.${stopText}`
  );
}

function chooseRouteStop(route) {
  const options = getStopsForRoute(route);

  if (!options.length) return null;

  const index = Math.floor(random(options.length));
  return options[index];
}

function getStopsForRoute(route) {
  const major = stations
    .filter((s) => s.routes.includes(route))
    .map((s) => ({
      name: s.name,
      x: s.x,
      y: s.y,
      routes: s.routes,
      color: routeColor(route),
      stationId: s.id,
    }));

  const overlay = getAllOverlayStops()
    .filter((s) => stopHasRoute(s, route))
    .map((s) => ({
      name: s.name,
      x: s.x,
      y: s.y,
      routes: s.routes,
      color: routeColor(route),
      stationId: null,
    }));

  return dedupeStops([...major, ...overlay]);
}

function getAllOverlayStops() {
  const extras = typeof lineStopOverlay !== "undefined" ? lineStopOverlay : [];
  const minor = typeof minorStops !== "undefined" ? minorStops : [];

  return dedupeStops([...minor, ...extras]);
}

function dedupeStops(list) {
  const seen = new Set();
  const clean = [];

  for (const item of list) {
    const key = `${item.name}-${Math.round(item.x)}-${Math.round(item.y)}`;

    if (!seen.has(key)) {
      seen.add(key);
      clean.push(item);
    }
  }

  return clean;
}

function stopHasRoute(stop, route) {
  return stop.routes && stop.routes.includes(route);
}

function shouldShowOverlayStopLabel(stop, index, focusRoute) {
  if (focusRoute && stopHasRoute(stop, focusRoute)) return true;

  const alwaysShow = [
    "103 St",
    "50 St",
    "Canal St",
    "86 St",
    "Lorimer St",
    "Stapleton",
    "Great Kills",
  ];

  return alwaysShow.includes(stop.name);
}

function setText(id, value) {
  const el = document.getElementById(id);

  if (el) {
    el.textContent = value;
  }
}

function getStationById(id) {
  return stations.find((s) => s.id === id);
}

function getSignalLabel(rate) {
  if (rate >= 80) return "Very High";
  if (rate >= 65) return "High";
  if (rate >= 50) return "Mid";
  if (rate >= 40) return "Low";
  return "Very Low";
}

function getStationColor(s) {
  if (currentLens === "need") return needColor(s.supportNeed);
  if (currentLens === "ell") return ellColor(s.englishLearners);
  if (currentLens === "income") return incomeColor(s.income);

  return readingColor(s.readingRate);
}

function readingColor(rate) {
  if (rate >= 80) return "#123c8c";
  if (rate >= 65) return "#00a878";
  if (rate >= 50) return "#f2c94c";
  if (rate >= 40) return "#f28c28";
  return "#d6452f";
}

function needColor(need) {
  if (need === "Very High") return "#d6452f";
  if (need === "High") return "#f28c28";
  if (need === "Moderate") return "#f2c94c";
  if (need === "Low") return "#00a878";

  return "#123c8c";
}

function ellColor(value) {
  if (value >= 22) return "#d6452f";
  if (value >= 16) return "#f28c28";
  if (value >= 10) return "#f2c94c";

  return "#00a878";
}

function incomeColor(value) {
  if (value >= 85000) return "#123c8c";
  if (value >= 65000) return "#00a878";
  if (value >= 50000) return "#f2c94c";

  return "#f28c28";
}

function routeColor(route) {
  if (["A", "C", "E"].includes(route)) return MTA.blue;
  if (["1", "2", "3"].includes(route)) return MTA.red;
  if (["B", "D", "F", "M"].includes(route)) return MTA.orange;
  if (["N", "Q", "R", "W"].includes(route)) return MTA.yellow;
  if (["4", "5", "6"].includes(route)) return MTA.green;
  if (route === "7") return MTA.purple;
  if (route === "G") return MTA.lime;
  if (["J", "Z"].includes(route)) return MTA.brown;
  if (route === "L") return MTA.gray;
  if (route === "SIR") return MTA.civicBlue;
  if (route === "S") return MTA.gray;

  return "#222";
}

function routeUsesDarkText(route) {
  return ["N", "Q", "R", "W", "L"].includes(route);
}

function routeClass(route) {
  if (["A", "C", "E"].includes(route)) return "blue";
  if (["1", "2", "3"].includes(route)) return "red";
  if (["B", "D", "F", "M"].includes(route)) return "orange";
  if (["N", "Q", "R", "W"].includes(route)) return "yellow";
  if (["4", "5", "6"].includes(route)) return "green";
  if (route === "7") return "purple";
  if (route === "G") return "lime";
  if (["J", "Z"].includes(route)) return "brown";
  if (route === "L") return "gray";
  if (route === "SIR") return "sir";

  return "";
}

function formatMoney(value) {
  return `$${value.toLocaleString()}`;
}

function drawPolyline(points) {
  beginShape();

  for (const p of points) {
    vertex(p[0], p[1]);
  }

  endShape();
}

function pointOnPolyline(points, t) {
  let total = 0;
  const lengths = [];

  for (let i = 0; i < points.length - 1; i++) {
    const len = dist(
      points[i][0],
      points[i][1],
      points[i + 1][0],
      points[i + 1][1]
    );

    lengths.push(len);
    total += len;
  }

  let target = t * total;
  let run = 0;

  for (let i = 0; i < lengths.length; i++) {
    if (run + lengths[i] >= target) {
      const localT = (target - run) / lengths[i];

      return {
        x: lerp(points[i][0], points[i + 1][0], localT),
        y: lerp(points[i][1], points[i + 1][1], localT),
      };
    }

    run += lengths[i];
  }

  const last = points[points.length - 1];

  return {
    x: last[0],
    y: last[1],
  };
}

function offsetPolyline(points, offset) {
  const out = [];

  for (let i = 0; i < points.length; i++) {
    const p = createVector(points[i][0], points[i][1]);

    const prevDir =
      i === 0
        ? createVector(
            points[i + 1][0] - points[i][0],
            points[i + 1][1] - points[i][1]
          )
        : createVector(
            points[i][0] - points[i - 1][0],
            points[i][1] - points[i - 1][1]
          );

    const nextDir =
      i === points.length - 1
        ? createVector(
            points[i][0] - points[i - 1][0],
            points[i][1] - points[i - 1][1]
          )
        : createVector(
            points[i + 1][0] - points[i][0],
            points[i + 1][1] - points[i][1]
          );

    prevDir.normalize();
    nextDir.normalize();

    const n1 = createVector(-prevDir.y, prevDir.x);
    const n2 = createVector(-nextDir.y, nextDir.x);

    let n = p5.Vector.add(n1, n2);

    if (n.mag() < 0.001) {
      n = n2.copy();
    }

    n.normalize().mult(offset);

    out.push([p.x + n.x, p.y + n.y]);
  }

  return out;
}

function getVisualOffsets(group) {
  if (
    group.labels.length === 1 &&
    (group.labels[0] === "7" || group.labels[0] === "L")
  ) {
    return [-4, 4];
  }

  if (group.labels.length === 1) {
    return [0];
  }

  const gap = 8;
  const startOffset = -((group.labels.length - 1) * gap) / 2;

  return group.labels.map((_, i) => startOffset + i * gap);
}

function getRouteName(route) {
  if (typeof ROUTE_META !== "undefined" && ROUTE_META[route]) {
    return ROUTE_META[route];
  }

  return "MTA corridor";
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha / 255})`;
}
