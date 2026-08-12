"use client";

import { useSyncExternalStore } from "react";

const STAGES = [
  { label: "New", angle: 0, color: "#a9d8cf" },
  { label: "Contacted", angle: 72, color: "#6fbbae" },
  { label: "Interested", angle: 144, color: "#349884" },
  { label: "Follow Up", angle: 216, color: "#d8912b" },
  { label: "Booked", angle: 288, color: "#0f5449" },
];

const SIZE = 500;
const CENTER = SIZE / 2;
const RADIUS = 118;
const LABEL_RADIUS = 154;
const ARROW_BACKOFF_DEG = 9;

// Round to a fixed precision so server- and client-computed trig values
// serialize to identical strings — raw floats can differ in their last
// digit between Node and the browser, which otherwise trips a hydration
// mismatch on every SVG coordinate.
function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function point(radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: round(CENTER + radius * Math.sin(rad)),
    y: round(CENTER - radius * Math.cos(rad)),
  };
}

const STAGE_POINTS = STAGES.map((s) => point(RADIUS, s.angle));

// A point's angle (in degrees) IS the tangent direction of clockwise travel
// at that point, so the same value drives both position and arrow rotation.
const lastAngle = STAGES[STAGES.length - 1].angle;
const ARROW_POINT = point(RADIUS, lastAngle - ARROW_BACKOFF_DEG);
const ARROW_ROTATION = lastAngle - ARROW_BACKOFF_DEG;

const LOST_ANCHOR = point(RADIUS, 216); // branches off from Follow Up
const LOST_POS = { x: round(CENTER - 20), y: round(CENTER + RADIUS + 78) };
const LOST_CURVE_CTRL = {
  x: round((LOST_ANCHOR.x + LOST_POS.x) / 2 + 26),
  y: round((LOST_ANCHOR.y + LOST_POS.y) / 2),
};

function subscribeToMotionPreference(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getPrefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerPrefersReducedMotion() {
  return true;
}

export function LoopDiagram() {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getPrefersReducedMotion,
    getServerPrefersReducedMotion
  );
  const animate = !prefersReducedMotion;

  const fullFlowPath = `M ${STAGE_POINTS.map((p) => `${p.x} ${p.y}`).join(
    " A " + RADIUS + " " + RADIUS + " 0 0 1 "
  )}`;

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto h-full w-full max-w-[420px]"
      role="img"
      aria-label="Diagram of the LeadLoop status flow: New leads to Contacted, to Interested, to Follow Up, to Booked, with Lost branching off from Follow Up."
    >
      <defs>
        <radialGradient id="loop-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--primary-tint)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--primary-tint)" stopOpacity="0" />
        </radialGradient>

        {STAGES.slice(0, -1).map((stage, i) => (
          <linearGradient
            key={stage.label}
            id={`loop-segment-${i}`}
            gradientUnits="userSpaceOnUse"
            x1={STAGE_POINTS[i].x}
            y1={STAGE_POINTS[i].y}
            x2={STAGE_POINTS[i + 1].x}
            y2={STAGE_POINTS[i + 1].y}
          >
            <stop offset="0%" stopColor={STAGES[i].color} />
            <stop offset="100%" stopColor={STAGES[i + 1].color} />
          </linearGradient>
        ))}

        <filter id="loop-dot-shadow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.6" floodColor="#0f2b24" floodOpacity="0.22" />
        </filter>
        <filter id="loop-pulse-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <circle cx={CENTER} cy={CENTER} r={RADIUS + 60} fill="url(#loop-glow)" />

      {/* The real status flow: New -> Contacted -> Interested -> Follow Up -> Booked */}
      {STAGES.slice(0, -1).map((stage, i) => (
        <path
          key={stage.label}
          d={`M ${STAGE_POINTS[i].x} ${STAGE_POINTS[i].y} A ${RADIUS} ${RADIUS} 0 0 1 ${STAGE_POINTS[i + 1].x} ${STAGE_POINTS[i + 1].y}`}
          fill="none"
          stroke={`url(#loop-segment-${i})`}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}

      {/* Hand-placed arrowhead — a point's own angle is its tangent angle,
          so translate + rotate by the same value always aims it correctly
          (SVG markers on arc paths render inconsistently across browsers). */}
      <path
        d="M -7,-5.5 L 6.5,0 L -7,5.5 Z"
        fill={STAGES[STAGES.length - 1].color}
        transform={`translate(${ARROW_POINT.x} ${ARROW_POINT.y}) rotate(${ARROW_ROTATION})`}
      />

      <path
        d={`M ${LOST_ANCHOR.x} ${LOST_ANCHOR.y} Q ${LOST_CURVE_CTRL.x} ${LOST_CURVE_CTRL.y} ${LOST_POS.x} ${LOST_POS.y}`}
        fill="none"
        stroke="var(--ink-faint)"
        strokeWidth={1.5}
        strokeDasharray="3 5"
      />

      {animate ? (
        <circle r={5.5} fill="var(--primary-bright)" filter="url(#loop-pulse-glow)">
          <animateMotion dur="8s" repeatCount="indefinite" path={fullFlowPath} />
        </circle>
      ) : null}
      {animate ? (
        <circle r={5} fill="white">
          <animateMotion dur="8s" repeatCount="indefinite" path={fullFlowPath} />
        </circle>
      ) : null}

      {STAGES.map((stage, i) => {
        const dot = STAGE_POINTS[i];
        const label = point(LABEL_RADIUS, stage.angle);
        const isCenterTop = stage.angle === 0;
        const isRight = stage.angle > 0 && stage.angle < 180;
        const anchor = isCenterTop ? "middle" : isRight ? "start" : "end";

        return (
          <g key={stage.label}>
            <circle
              cx={dot.x}
              cy={dot.y}
              r={9}
              fill={stage.color}
              filter="url(#loop-dot-shadow)"
            />
            <circle cx={dot.x} cy={dot.y} r={9} fill="none" stroke="white" strokeWidth={2} />
            <text
              x={label.x}
              y={label.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="font-sans text-[15px] font-medium"
              fill="var(--ink)"
            >
              {stage.label}
            </text>
          </g>
        );
      })}

      <g>
        <circle cx={LOST_POS.x} cy={LOST_POS.y} r={7} fill="var(--ink-faint)" />
        <text
          x={LOST_POS.x + 16}
          y={LOST_POS.y}
          dominantBaseline="middle"
          className="font-sans text-[14px] font-medium"
          fill="var(--ink-faint)"
        >
          Lost
        </text>
      </g>

      <text
        x={CENTER}
        y={CENTER - 6}
        textAnchor="middle"
        className="font-display text-[18px] font-medium"
        fill="var(--ink)"
      >
        The Loop
      </text>
      <text
        x={CENTER}
        y={CENTER + 16}
        textAnchor="middle"
        className="font-sans text-[12px]"
        fill="var(--ink-faint)"
      >
        never leaves a lead behind
      </text>
    </svg>
  );
}
