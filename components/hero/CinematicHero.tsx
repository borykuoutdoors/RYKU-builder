'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import BtnColorful from '@/components/ui/BtnColorful'

// ─── SSR-safe deterministic pseudo-random ────────────────────────────────────
function lcg(s: number) {
  return ((1664525 * s + 1013904223) & 0x7fffffff) / 0x7fffffff
}

// Embers — left/dark zone only
const EMBERS = Array.from({ length: 12 }, (_, i) => ({
  id:     i,
  left:   Math.round(lcg(i * 11 + 1) * 38),
  top:    35 + Math.round(lcg(i * 11 + 2) * 500) / 10,
  size:   parseFloat((0.9 + lcg(i * 11 + 3) * 1.8).toFixed(1)),
  op:     parseFloat((0.22 + lcg(i * 11 + 4) * 0.38).toFixed(2)),
  dur:    parseFloat((5 + lcg(i * 11 + 5) * 9).toFixed(1)),
  dly:    parseFloat((lcg(i * 11 + 6) * 8).toFixed(1)),
  driftX: Math.round((lcg(i * 11 + 7) - 0.5) * 48),
  rise:   Math.round(40 + lcg(i * 11 + 8) * 90),
}))

// Boundary blobs — dark/orange edge
const BLOBS = [
  { cx: '35%', cy: '22%', rx: '8%',   ry: '14%', op: 0.94 },
  { cx: '41%', cy: '64%', rx: '6%',   ry: '10%', op: 0.90 },
  { cx: '33%', cy: '48%', rx: '4%',   ry: '7%',  op: 0.96 },
  { cx: '44%', cy: '35%', rx: '3.5%', ry: '6%',  op: 0.82 },
  { cx: '38%', cy: '78%', rx: '5%',   ry: '8%',  op: 0.88 },
  { cx: '46%', cy: '55%', rx: '3%',   ry: '5%',  op: 0.78 },
  { cx: '30%', cy: '33%', rx: '3%',   ry: '4%',  op: 0.92 },
  { cx: '42%', cy: '88%', rx: '4%',   ry: '6%',  op: 0.85 },
  { cx: '48%', cy: '18%', rx: '2.5%', ry: '4%',  op: 0.72 },
  { cx: '36%', cy: '90%', rx: '3.5%', ry: '5%',  op: 0.80 },
  { cx: '50%', cy: '42%', rx: '2%',   ry: '3.5%',op: 0.65 },
  { cx: '29%', cy: '62%', rx: '2.5%', ry: '4%',  op: 0.88 },
]

// ─── Vehicle SVG (4Runner/Land Cruiser profile, facing left) ─────────────────
function VehicleSVG() {
  const REAR_WX = 168   // rear wheel center X
  const FRONT_WX = 554  // front wheel center X
  const WY = 282        // wheel center Y
  const WR = 64         // wheel radius (big off-road tires)
  const WR_ARCH = 72    // arch radius (slightly wider than tire)
  const BODY_TOP_R = 148  // body top at rear
  const BODY_TOP_F = 148  // body top at front (boxy SUV)
  const CABIN_TOP = 88    // roof/cabin top
  const BODY_BOT = 230    // body bottom (above wheel centers = lifted look)

  // Wheel arch path helper — semicircle cutout
  const archPath = (cx: number) =>
    `M ${cx - WR_ARCH} ${BODY_BOT} A ${WR_ARCH} ${WR_ARCH} 0 0 1 ${cx + WR_ARCH} ${BODY_BOT}`

  // Spoke positions for rims
  const spokes = [0, 60, 120, 180, 240, 300]

  return (
    <svg
      viewBox="0 0 750 360"
      fill="none"
      style={{ width: '100%', height: 'auto', display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        {/* Body gradient — warm orange workshop light hitting metal */}
        <linearGradient id="vBodyGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%"   stopColor="rgba(255,155,55,0.48)" />
          <stop offset="55%"  stopColor="rgba(190,80,18,0.38)" />
          <stop offset="100%" stopColor="rgba(90,32,5,0.28)" />
        </linearGradient>
        {/* Cabin gradient — sky/cyan reflection on glass */}
        <linearGradient id="vCabinGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="rgba(102,220,255,0.32)" />
          <stop offset="100%" stopColor="rgba(30,80,160,0.12)" />
        </linearGradient>
        {/* Rear glass (faces the orange light) */}
        <linearGradient id="vGlassR" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,180,90,0.28)" />
          <stop offset="100%" stopColor="rgba(102,180,255,0.10)" />
        </linearGradient>
        {/* Roof gradient */}
        <linearGradient id="vRoofGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,180,70,0.65)" />
          <stop offset="100%" stopColor="rgba(255,100,20,0.42)" />
        </linearGradient>
        {/* Wheel gradient */}
        <radialGradient id="vWheelGrad" cx="38%" cy="32%" r="62%">
          <stop offset="0%"   stopColor="rgba(120,90,60,0.92)" />
          <stop offset="100%" stopColor="rgba(12,10,8,0.96)" />
        </radialGradient>
        {/* Tire tread */}
        <radialGradient id="vTireGrad" cx="50%" cy="50%" r="50%">
          <stop offset="70%"  stopColor="rgba(22,18,14,0.98)" />
          <stop offset="100%" stopColor="rgba(40,30,20,0.85)" />
        </radialGradient>
        {/* Ground glow */}
        <radialGradient id="vGndGlow" cx="50%" cy="0%" r="100%">
          <stop offset="0%"   stopColor="rgba(255,100,20,0.30)" />
          <stop offset="100%" stopColor="rgba(255,60,10,0)" />
        </radialGradient>
        {/* Soft glow filter */}
        <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
        <filter id="tinyBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>

      {/* ── Ground glow ──────────────────────────────────────────── */}
      <ellipse
        cx="365" cy="347" rx="270" ry="16"
        fill="url(#vGndGlow)" opacity="0.85"
      />
      <ellipse
        cx={REAR_WX} cy="350" rx="72" ry="9"
        fill="rgba(255,80,20,0.18)" filter="url(#tinyBlur)"
      />
      <ellipse
        cx={FRONT_WX} cy="350" rx="72" ry="9"
        fill="rgba(255,80,20,0.18)" filter="url(#tinyBlur)"
      />

      {/* ── Body — main slab ─────────────────────────────────────── */}
      {/* Main lower body with wheel arch cutouts */}
      <path
        d={`
          M 95  ${BODY_BOT}
          ${archPath(REAR_WX)}
          L ${REAR_WX + WR_ARCH}  ${BODY_BOT}
          L ${FRONT_WX - WR_ARCH} ${BODY_BOT}
          ${archPath(FRONT_WX)}
          L ${FRONT_WX + WR_ARCH} ${BODY_BOT}
          L 640 ${BODY_BOT}
          L 640 ${BODY_TOP_F}
          L 95  ${BODY_TOP_R}
          Z
        `}
        fill="url(#vBodyGrad)"
      />

      {/* ── Cabin / greenhouse ───────────────────────────────────── */}
      {/* Cabin body (sits atop lower body) */}
      <polygon
        points={`
          130,${BODY_TOP_R}
          150,${CABIN_TOP}
          590,${CABIN_TOP}
          640,${BODY_TOP_F}
        `}
        fill="url(#vBodyGrad)"
        opacity="0.88"
      />

      {/* Roof top */}
      <rect
        x="150" y={CABIN_TOP - 2}
        width="440" height="8"
        fill="url(#vRoofGrad)"
        rx="2"
      />

      {/* ── Roof rack ────────────────────────────────────────────── */}
      <rect x="185" y={CABIN_TOP - 18} width="360" height="16" rx="2"
        fill="rgba(160,80,15,0.72)" />
      {/* Rack cross-members */}
      {[200, 240, 280, 320, 360, 400, 440, 480, 520].map(x => (
        <rect key={x} x={x} y={CABIN_TOP - 24} width="5" height="6" rx="1"
          fill="rgba(180,100,20,0.80)" />
      ))}
      {/* Top rack rail */}
      <rect x="188" y={CABIN_TOP - 24} width="354" height="6" rx="1"
        fill="rgba(160,80,15,0.62)" />
      {/* LED light bar suggestion */}
      <rect x="220" y={CABIN_TOP - 36} width="140" height="9" rx="2"
        fill="rgba(40,35,28,0.90)" />
      <rect x="222" y={CABIN_TOP - 34} width="136" height="5" rx="1"
        fill="rgba(255,230,150,0.06)" />
      {[228, 240, 252, 264, 276, 288, 300, 312, 324, 336, 348].map(x => (
        <rect key={x} x={x} y={CABIN_TOP - 34} width="6" height="5" rx="0.5"
          fill="rgba(255,240,180,0.12)" />
      ))}

      {/* ── Windows ──────────────────────────────────────────────── */}
      {/* Rear quarter window */}
      <polygon
        points={`152,${BODY_TOP_R} 168,${CABIN_TOP + 4} 270,${CABIN_TOP + 4} 270,${BODY_TOP_R}`}
        fill="url(#vGlassR)"
        opacity="0.80"
      />
      {/* Rear main window */}
      <polygon
        points={`275,${CABIN_TOP + 4} 275,${BODY_TOP_R} 380,${BODY_TOP_R} 380,${CABIN_TOP + 4}`}
        fill="url(#vCabinGrad)"
        opacity="0.75"
      />
      {/* Front main window (wider) */}
      <polygon
        points={`385,${CABIN_TOP + 4} 385,${BODY_TOP_R} 565,${BODY_TOP_R} 600,${CABIN_TOP + 4}`}
        fill="url(#vCabinGrad)"
        opacity="0.80"
      />
      {/* A-pillar frame */}
      <line x1="596" y1={CABIN_TOP + 4} x2="636" y2={BODY_TOP_F}
        stroke="rgba(160,80,15,0.60)" strokeWidth="7" strokeLinecap="round" />
      {/* B-pillar */}
      <rect x="377" y={CABIN_TOP + 4} width="7" height={BODY_TOP_R - CABIN_TOP - 4}
        fill="rgba(120,55,10,0.75)" />
      {/* C-pillar */}
      <line x1="153" y1={CABIN_TOP + 4} x2="132" y2={BODY_TOP_R}
        stroke="rgba(120,55,10,0.65)" strokeWidth="7" strokeLinecap="round" />

      {/* Window reflections */}
      <polygon
        points={`290,${CABIN_TOP + 8} 300,${CABIN_TOP + 8} 295,${BODY_TOP_R - 12} 280,${BODY_TOP_R - 12}`}
        fill="rgba(255,255,255,0.04)"
      />
      <polygon
        points={`420,${CABIN_TOP + 8} 436,${CABIN_TOP + 8} 430,${BODY_TOP_R - 12} 415,${BODY_TOP_R - 12}`}
        fill="rgba(255,255,255,0.04)"
      />

      {/* ── Rear bumper / tailgate details ───────────────────────── */}
      <rect x="80" y={BODY_TOP_R} width="15" height={BODY_BOT - BODY_TOP_R} rx="1"
        fill="rgba(180,85,20,0.55)" />
      {/* Tail lights */}
      <rect x="81" y={BODY_TOP_R + 8} width="12" height="28" rx="2"
        fill="rgba(255,45,25,0.88)" />
      <rect x="81" y={BODY_TOP_R + 8} width="12" height="28" rx="2"
        fill="rgba(255,45,25,0.45)" filter="url(#tinyBlur)" />
      {/* Spare tire hint */}
      <circle cx="88" cy={WY} r="38"
        fill="rgba(20,15,10,0.80)" stroke="rgba(140,70,15,0.40)" strokeWidth="3" />
      <circle cx="88" cy={WY} r="28"
        fill="rgba(35,28,20,0.85)" />
      {[0, 72, 144, 216, 288].map(deg => {
        const r = deg * Math.PI / 180
        return (
          <line key={deg}
            x1={88 + 8 * Math.cos(r)} y1={WY + 8 * Math.sin(r)}
            x2={88 + 26 * Math.cos(r)} y2={WY + 26 * Math.sin(r)}
            stroke="rgba(140,70,15,0.50)" strokeWidth="3"
          />
        )
      })}

      {/* ── Front bumper / grille ─────────────────────────────────── */}
      <rect x="638" y={BODY_TOP_F} width="24" height={BODY_BOT - BODY_TOP_F} rx="2"
        fill="rgba(200,90,18,0.55)" />
      {/* Grille */}
      <rect x="642" y={BODY_TOP_F + 20} width="16" height={BODY_BOT - BODY_TOP_F - 40} rx="1"
        fill="rgba(20,15,10,0.80)" />
      {[0, 10, 20, 30].map((yOff, i) => (
        <rect key={i}
          x="644" y={BODY_TOP_F + 24 + yOff} width="12" height="6" rx="0.5"
          fill="rgba(80,45,10,0.60)"
        />
      ))}
      {/* Headlights */}
      <rect x="636" y={BODY_TOP_F + 5} width="26" height="16" rx="2"
        fill="rgba(255,230,140,0.88)" />
      <rect x="636" y={BODY_TOP_F + 5} width="26" height="16" rx="2"
        fill="rgba(255,210,80,0.55)" filter="url(#tinyBlur)" />
      {/* DRL strip */}
      <rect x="636" y={BODY_TOP_F + 3} width="26" height="3"
        fill="rgba(255,255,220,0.70)" />
      {/* Fog light */}
      <rect x="638" y={BODY_BOT - 22} width="18" height="10" rx="1"
        fill="rgba(255,200,80,0.60)" />

      {/* ── Running boards ───────────────────────────────────────── */}
      <rect
        x={REAR_WX + WR_ARCH - 10}
        y={BODY_BOT + 2}
        width={FRONT_WX - WR_ARCH - (REAR_WX + WR_ARCH) + 20}
        height="10" rx="1"
        fill="rgba(120,60,10,0.55)"
      />

      {/* ── Rear wheel ───────────────────────────────────────────── */}
      {/* Tire outer */}
      <circle cx={REAR_WX} cy={WY} r={WR}
        fill="url(#vTireGrad)" />
      {/* Sidewall texture */}
      <circle cx={REAR_WX} cy={WY} r={WR}
        fill="none" stroke="rgba(60,45,28,0.45)" strokeWidth="6" />
      {/* Rim */}
      <circle cx={REAR_WX} cy={WY} r={WR - 16}
        fill="url(#vWheelGrad)" />
      {/* Center cap */}
      <circle cx={REAR_WX} cy={WY} r={WR - 48}
        fill="rgba(200,110,25,0.60)" />
      {/* Spokes */}
      {spokes.map(deg => {
        const r = deg * Math.PI / 180
        return (
          <line key={deg}
            x1={REAR_WX + (WR - 48) * Math.cos(r)}
            y1={WY + (WR - 48) * Math.sin(r)}
            x2={REAR_WX + (WR - 18) * Math.cos(r)}
            y2={WY + (WR - 18) * Math.sin(r)}
            stroke="rgba(180,120,40,0.65)"
            strokeWidth="5"
            strokeLinecap="round"
          />
        )
      })}
      {/* Lug nuts */}
      {[30, 90, 150, 210, 270, 330].map(deg => {
        const r = deg * Math.PI / 180
        return (
          <circle key={deg}
            cx={REAR_WX + (WR - 28) * Math.cos(r)}
            cy={WY + (WR - 28) * Math.sin(r)}
            r="4"
            fill="rgba(140,90,30,0.80)"
          />
        )
      })}
      {/* Hub cap glow */}
      <circle cx={REAR_WX} cy={WY} r={WR - 50}
        fill="rgba(255,110,30,0.18)" filter="url(#tinyBlur)" />

      {/* ── Front wheel (same structure) ─────────────────────────── */}
      <circle cx={FRONT_WX} cy={WY} r={WR}
        fill="url(#vTireGrad)" />
      <circle cx={FRONT_WX} cy={WY} r={WR}
        fill="none" stroke="rgba(60,45,28,0.45)" strokeWidth="6" />
      <circle cx={FRONT_WX} cy={WY} r={WR - 16}
        fill="url(#vWheelGrad)" />
      <circle cx={FRONT_WX} cy={WY} r={WR - 48}
        fill="rgba(200,110,25,0.60)" />
      {spokes.map(deg => {
        const r = deg * Math.PI / 180
        return (
          <line key={deg}
            x1={FRONT_WX + (WR - 48) * Math.cos(r)}
            y1={WY + (WR - 48) * Math.sin(r)}
            x2={FRONT_WX + (WR - 18) * Math.cos(r)}
            y2={WY + (WR - 18) * Math.sin(r)}
            stroke="rgba(180,120,40,0.65)"
            strokeWidth="5"
            strokeLinecap="round"
          />
        )
      })}
      {[30, 90, 150, 210, 270, 330].map(deg => {
        const r = deg * Math.PI / 180
        return (
          <circle key={deg}
            cx={FRONT_WX + (WR - 28) * Math.cos(r)}
            cy={WY + (WR - 28) * Math.sin(r)}
            r="4"
            fill="rgba(140,90,30,0.80)"
          />
        )
      })}
      <circle cx={FRONT_WX} cy={WY} r={WR - 50}
        fill="rgba(255,110,30,0.18)" filter="url(#tinyBlur)" />

      {/* ── Lifted suspension detail ──────────────────────────────── */}
      {/* Coil-over visual hint (just vertical lines) */}
      <line x1={REAR_WX - 8} y1={BODY_BOT} x2={REAR_WX - 8} y2={WY - WR + 6}
        stroke="rgba(180,100,20,0.28)" strokeWidth="2" />
      <line x1={REAR_WX + 8} y1={BODY_BOT} x2={REAR_WX + 8} y2={WY - WR + 6}
        stroke="rgba(180,100,20,0.28)" strokeWidth="2" />
      <line x1={FRONT_WX - 8} y1={BODY_BOT} x2={FRONT_WX - 8} y2={WY - WR + 6}
        stroke="rgba(180,100,20,0.28)" strokeWidth="2" />
      <line x1={FRONT_WX + 8} y1={BODY_BOT} x2={FRONT_WX + 8} y2={WY - WR + 6}
        stroke="rgba(180,100,20,0.28)" strokeWidth="2" />

      {/* ── Side body edge highlights ─────────────────────────────── */}
      <line x1="95" y1={BODY_TOP_R} x2="638" y2={BODY_TOP_F}
        stroke="rgba(255,160,55,0.28)" strokeWidth="1.5" />
      <line x1="95" y1={BODY_BOT} x2="638" y2={BODY_BOT}
        stroke="rgba(255,130,30,0.18)" strokeWidth="1" />
    </svg>
  )
}

// ─── Geometric shape elements (Shape Landing Hero inspiration) ────────────────
function TechShapes({ show }: { show: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={show ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.6, delay: 1.2 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4, overflow: 'hidden' }}
    >
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cyanLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(102,255,255,0)" />
            <stop offset="50%"  stopColor="rgba(102,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(102,255,255,0)" />
          </linearGradient>
          <linearGradient id="orangeLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,85,31,0)" />
            <stop offset="50%"  stopColor="rgba(255,85,31,0.28)" />
            <stop offset="100%" stopColor="rgba(255,85,31,0)" />
          </linearGradient>
          <radialGradient id="hexGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(102,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(102,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Large hexagon ring — upper right, cyan accent */}
        <polygon
          points="1200,60 1310,120 1360,230 1310,340 1200,400 1090,340 1040,230 1090,120"
          fill="none"
          stroke="rgba(102,255,255,0.07)"
          strokeWidth="1"
        />
        <polygon
          points="1200,100 1290,150 1330,230 1290,310 1200,360 1110,310 1070,230 1110,150"
          fill="none"
          stroke="rgba(102,255,255,0.05)"
          strokeWidth="1"
        />

        {/* Hex glow fill */}
        <polygon
          points="1200,60 1310,120 1360,230 1310,340 1200,400 1090,340 1040,230 1090,120"
          fill="url(#hexGlow)"
        />

        {/* Diagonal angular lines — top right quadrant */}
        <line x1="900" y1="0" x2="1440" y2="320" stroke="url(#cyanLine)" strokeWidth="0.6" opacity="0.6" />
        <line x1="980" y1="0" x2="1440" y2="260" stroke="url(#cyanLine)" strokeWidth="0.4" opacity="0.4" />
        <line x1="860" y1="0" x2="1440" y2="380" stroke="rgba(255,85,31,0.08)" strokeWidth="0.5" />

        {/* Horizontal scan-grid lines */}
        {[180, 360, 540, 720].map(y => (
          <line key={y} x1="680" y1={y} x2="1440" y2={y}
            stroke="rgba(102,255,255,0.04)" strokeWidth="0.5" />
        ))}
        {/* Vertical scan-grid lines */}
        {[780, 900, 1020, 1140, 1260, 1380].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="900"
            stroke="rgba(102,255,255,0.03)" strokeWidth="0.5" />
        ))}

        {/* Compass ring — far right mid */}
        <circle cx="1380" cy="450" r="80" fill="none" stroke="rgba(102,255,255,0.06)" strokeWidth="1" />
        <circle cx="1380" cy="450" r="68" fill="none" stroke="rgba(102,255,255,0.04)" strokeWidth="0.5" />
        {/* Compass tick marks */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = i * 30 * Math.PI / 180
          const outer = 78, inner = i % 3 === 0 ? 68 : 72
          return (
            <line key={i}
              x1={1380 + outer * Math.cos(angle)} y1={450 + outer * Math.sin(angle)}
              x2={1380 + inner * Math.cos(angle)} y2={450 + inner * Math.sin(angle)}
              stroke="rgba(102,255,255,0.10)" strokeWidth={i % 3 === 0 ? 1.5 : 0.8}
            />
          )
        })}
        {/* North indicator */}
        <line x1="1380" y1="374" x2="1380" y2="386"
          stroke="rgba(255,85,31,0.45)" strokeWidth="2" />
        <line x1="1380" y1="514" x2="1380" y2="526"
          stroke="rgba(102,255,255,0.20)" strokeWidth="1.5" />

        {/* Angular bracket — lower right, orange accent */}
        <polyline
          points="1100,780 1200,780 1200,860"
          fill="none" stroke="rgba(255,85,31,0.14)" strokeWidth="1.5"
        />
        <polyline
          points="1280,780 1380,780 1380,860"
          fill="none" stroke="rgba(255,85,31,0.10)" strokeWidth="1"
        />

        {/* Thin horizontal accent lines left side */}
        <line x1="0" y1="200" x2="380" y2="200" stroke="url(#orangeLine)" strokeWidth="0.5" opacity="0.7" />
        <line x1="0" y1="202" x2="300" y2="202" stroke="url(#orangeLine)" strokeWidth="0.3" opacity="0.4" />

        {/* Tech data readout dots — tactical feel */}
        {[[820, 820], [860, 820], [900, 820], [820, 850], [860, 850]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.5"
            fill={i % 2 === 0 ? 'rgba(102,255,255,0.20)' : 'rgba(255,85,31,0.15)'}
          />
        ))}
      </svg>
    </motion.div>
  )
}

// ─── Stats data ───────────────────────────────────────────────────────────────
const STATS = [
  { value: '55+',    label: 'Verified Products' },
  { value: '10',     label: 'Vehicle Platforms' },
  { value: '4,200+', label: 'Builds Configured' },
]

interface Props { introComplete: boolean }

export default function CinematicHero({ introComplete }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced    = useReducedMotion()
  const [chaosLive, setChaosLive] = useState(false)

  useEffect(() => {
    if (!introComplete) return
    if (reduced) { setChaosLive(true); return }
    const t = setTimeout(() => setChaosLive(true), 3200)
    return () => clearTimeout(t)
  }, [introComplete, reduced])

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '10%'])

  const show = introComplete

  const fadeUp = (delay = 0) => ({
    initial:    reduced ? false : { opacity: 0, y: 14, filter: 'blur(8px)' },
    animate:    show ? { opacity: 1, y: 0, filter: 'blur(0px)' } : (reduced ? {} : { opacity: 0, y: 14, filter: 'blur(8px)' }),
    transition: { duration: reduced ? 0 : 1.0, ease: [0.2, 0.7, 0.2, 1] as const, delay: reduced ? 0 : delay },
  })

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      style={{
        position:     'relative',
        height:       '100vh',
        minHeight:    600,
        overflow:     'hidden',
        background:   '#050811',          // deep navy instead of pure black
        display:      'flex',
        alignItems:   'center',
        paddingBottom:'var(--status-h)',
      }}
      aria-label="Hero"
    >

      {/* ══════════════════════════════════════════════════════════════════
          BACKGROUND — layered atmospheric depth
      ══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', inset: '-4%',
          y: bgY, willChange: 'transform',
        }}
      >
        {/* Base — deep navy */}
        <div style={{ position: 'absolute', inset: 0, background: '#050811' }} />

        {/* Orange ambient — primary workshop glow from center-right */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 62% 88% at 78% 52%,
              rgba(255,106,10,0.96)  0%,
              rgba(220,70,0,0.82)    22%,
              rgba(150,40,0,0.58)    42%,
              rgba(55,14,0,0.22)     62%,
              transparent            80%)
          `,
        }} />

        {/* Hot inner workshop core */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 34% 42% at 75% 54%,
              rgba(255,150,40,0.52) 0%,
              rgba(255,88,10,0.24)  50%,
              transparent           80%)
          `,
        }} />

        {/* Cyan tech accent — subtle upper-right technology glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 45% 55% at 88% 20%,
              rgba(102,255,255,0.06) 0%,
              rgba(40,140,255,0.03)  50%,
              transparent            80%)
          `,
        }} />

        {/* Navy-indigo depth — lower left atmospheric */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 50% 60% at 10% 85%,
              rgba(20,30,80,0.35) 0%,
              transparent         65%)
          `,
        }} />

        {/* Top/bottom vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(to bottom,
              rgba(5,8,17,0.62)  0%,
              transparent        26%,
              transparent        66%,
              rgba(5,8,17,0.78)  100%)
          `,
        }} />

        {/* Dark left panel — content zone */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(to right,
              #050811   0%,
              #050811   14%,
              rgba(5,8,17,0.96)  20%,
              rgba(5,8,17,0.70)  28%,
              rgba(5,8,17,0.12)  42%,
              transparent        56%)
          `,
        }} />

        {/* Paint splatter blobs — dark/orange boundary */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {BLOBS.map((b, i) => (
            <ellipse key={i} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry}
              fill={`rgba(5,8,17,${b.op})`} />
          ))}
        </svg>

        {/* Blueprint grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: [
            'linear-gradient(rgba(102,255,255,0.018) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(102,255,255,0.018) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '120px 120px',
          opacity: 0.55,
          maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 40%, transparent 100%)',
        }} />

        {/* CRT scanlines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.028) 2px,rgba(0,0,0,0.028) 4px)',
        }} />

        {/* Grain texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.08,
          animation: 'grainShift 0.9s steps(6) infinite',
          mixBlendMode: 'overlay',
          zIndex: 9999,
        }} />
      </motion.div>

      {/* ── GEOMETRIC TECH SHAPES (Shape Landing Hero inspired) ──────── */}
      <TechShapes show={show} />

      {/* ── VEHICLE SILHOUETTE — right side ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 48, filter: 'blur(12px)' }}
        animate={show
          ? { opacity: 1, x: 0, filter: 'blur(0px)' }
          : { opacity: 0, x: 48, filter: 'blur(12px)' }
        }
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
        style={{
          position:      'absolute',
          right:         '-2%',
          bottom:        'var(--status-h)',
          width:         'clamp(380px, 52vw, 820px)',
          pointerEvents: 'none',
          zIndex:        5,
        }}
        className="hero-vehicle"
      >
        {/* Vehicle ambient glow — blurred halo behind vehicle */}
        <div style={{
          position:   'absolute',
          bottom:     '8%',
          left:       '12%',
          right:      '5%',
          height:     '55%',
          background: 'radial-gradient(ellipse at 55% 100%, rgba(255,85,31,0.18) 0%, rgba(255,140,30,0.08) 45%, transparent 75%)',
          filter:     'blur(32px)',
          pointerEvents: 'none',
        }} />
        <VehicleSVG />
      </motion.div>

      {/* ── EMBERS (dark zone left) ────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 3 }}>
        {EMBERS.map(p => (
          <motion.div
            key={p.id}
            animate={{
              y:       [0, -p.rise, -p.rise * 1.2],
              x:       [0, p.driftX * 0.3, p.driftX],
              opacity: [0, p.op, p.op * 0.5, 0],
              scale:   [0.1, 1, 0.55, 0],
            }}
            transition={{ duration: p.dur, delay: p.dly, repeat: Infinity, ease: [0.12, 0, 0.88, 1] }}
            style={{
              position: 'absolute',
              left: p.left + '%', top: p.top + '%',
              width: p.size, height: p.size, borderRadius: '50%',
              background: 'rgba(255,90,18,0.9)',
              boxShadow: `0 0 ${p.size * 2.8}px rgba(255,78,16,0.65)`,
            }}
          />
        ))}
      </div>

      {/* ── SCANNING LINE ─────────────────────────────────────────────── */}
      <motion.div
        animate={{ top: ['0%', '108%'] }}
        transition={{ duration: 11, repeat: Infinity, repeatDelay: 18, ease: 'linear' }}
        style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          pointerEvents: 'none', zIndex: 4,
          background: 'linear-gradient(90deg,transparent,rgba(102,255,255,0.04) 20%,rgba(255,85,31,0.10) 50%,rgba(102,255,255,0.04) 80%,transparent)',
        }}
      />

      {/* ── CORNER BRACKETS ───────────────────────────────────────────── */}
      {([
        { top: 20,    left: 20,   borderTop:    '1px solid rgba(243,237,226,0.24)', borderLeft:   '1px solid rgba(243,237,226,0.24)' },
        { top: 20,    right: 20,  borderTop:    '1px solid rgba(102,255,255,0.18)', borderRight:  '1px solid rgba(102,255,255,0.18)' },
        { bottom: 54, left: 20,   borderBottom: '1px solid rgba(243,237,226,0.24)', borderLeft:   '1px solid rgba(243,237,226,0.24)' },
        { bottom: 54, right: 20,  borderBottom: '1px solid rgba(102,255,255,0.18)', borderRight:  '1px solid rgba(102,255,255,0.18)' },
      ] as React.CSSProperties[]).map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.65, delay: 2.6 + i * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ position: 'absolute', width: 24, height: 24, pointerEvents: 'none', zIndex: 10, ...s }}
        />
      ))}

      {/* ── LEFT HUD TICKS ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: 1.6 }}
        style={{
          position: 'absolute', left: 22, top: 0, bottom: 38,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly',
          paddingTop: 70, paddingBottom: 55,
          pointerEvents: 'none', zIndex: 10,
        }}
      >
        {[44, 43, 42, 41, 40].map(lat => (
          <div key={lat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 1, background: 'rgba(243,237,226,0.18)', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              letterSpacing: '0.25em', color: 'var(--ink-faint)',
              textTransform: 'uppercase',
            }}>
              N {lat}°
            </span>
          </div>
        ))}
      </motion.div>

      {/* ── TOP-RIGHT HUD ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: 1.7 }}
        style={{
          position: 'absolute', top: 22, right: 22,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
          pointerEvents: 'none', zIndex: 10,
          fontFamily: 'var(--font-mono)', fontSize: '9px',
          letterSpacing: '0.25em', color: 'var(--ink-faint)',
        }}
      >
        <span>44°N · 110°W</span>
        <span>95.8° HDG</span>
        <span style={{ color: 'rgba(102,255,255,0.35)' }}>SYS · ONLINE</span>
      </motion.div>

      {/* ── BOTTOM-RIGHT HUD ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: 1.8 }}
        style={{
          position: 'absolute', right: 24, bottom: 44,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6,
          pointerEvents: 'none', zIndex: 10,
        }}
        className="hero-hud-br"
      >
        {[
          { label: 'ELEVATION', value: '11,420 FT', orange: false },
          { label: 'HEADING',   value: '284° W',    orange: false },
          { label: 'STATUS',    value: 'ARMED',      orange: true  },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px',
              letterSpacing: '0.25em', color: 'var(--ink-faint)',
              textTransform: 'uppercase',
            }}>
              {row.label}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              letterSpacing: '0.06em',
              color: row.orange ? 'var(--orange)' : 'var(--ink-dim)',
              textShadow: row.orange ? '0 0 10px rgba(255,85,31,0.5)' : 'none',
            }}>
              {row.value}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════
          HERO CONTENT — left-aligned, vertically centered
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="hero-text-panel"
        style={{
          position:    'relative',
          zIndex:      10,
          paddingLeft: 'clamp(72px, 8vw, 160px)',
          paddingRight:'4vw',
          maxWidth:    'clamp(400px, 48vw, 720px)',
          pointerEvents:'none',
          flexShrink:  0,
        }}
      >

        {/* EYEBROW */}
        <motion.div {...fadeUp(0.6)} style={{ marginBottom: 16, pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Cyan accent line */}
            <div style={{
              width: 28, height: 1,
              background: 'linear-gradient(to right, rgba(102,255,255,0.8), rgba(102,255,255,0.2))',
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily:    'var(--font-tactical)',
              fontSize:      '11px',
              fontWeight:    700,
              letterSpacing: '0.44em',
              color:         'var(--orange)',
              textTransform: 'uppercase',
            }}>
              BUILD. EQUIP. EXPLORE.
            </span>
          </div>
        </motion.div>

        {/* TITLE */}
        <div style={{ marginBottom: 20, pointerEvents: 'auto', willChange: 'filter, transform, opacity' }}>
          <h1 style={{
            fontFamily:    'var(--font-display)',
            fontSize:      'clamp(58px, 7.2vw, 122px)',
            lineHeight:    0.88,
            letterSpacing: '0.005em',
            fontWeight:    700,
            margin:        0,
            textTransform: 'uppercase',
          }}>
            <motion.span
              className="l1"
              initial={{ opacity: 0, y: 20, filter: 'blur(14px)' }}
              animate={show
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 20, filter: 'blur(14px)' }
              }
              transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1], delay: 0.9 }}
              style={{
                display:    'block',
                color:      'var(--ink)',
                textShadow: '0 2px 52px rgba(0,0,0,0.92)',
              }}
            >
              CONTROL
            </motion.span>
            <motion.span
              className={`l2${chaosLive ? ' chaos-live' : ''}`}
              initial={{ opacity: 0, y: 20, filter: 'blur(14px)' }}
              animate={chaosLive
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : show
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 20, filter: 'blur(14px)' }
              }
              transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1], delay: 1.2 }}
              style={{
                display:    'block',
                color:      'var(--orange)',
                textShadow: chaosLive
                  ? undefined
                  : '0 0 36px rgba(255,85,31,0.55), 0 0 80px rgba(255,85,31,0.18), 0 2px 52px rgba(0,0,0,0.9)',
              }}
            >
              THE CHAOS
            </motion.span>
          </h1>
        </div>

        {/* SUBHEADLINE */}
        <motion.div {...fadeUp(1.8)} style={{ marginBottom: 28, pointerEvents: 'auto' }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize:   '15px',
            fontWeight: 300,
            color:      'var(--ink-dim)',
            margin:     0,
            lineHeight: 1.7,
            maxWidth:   '40ch',
          }}>
            Mission-based build planning, premium gear systems, installer discovery, and
            modern overland technology for those who create their own path.
          </p>
        </motion.div>

        {/* CTA BUTTONS */}
        <motion.div
          {...fadeUp(2.2)}
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', pointerEvents: 'auto', marginBottom: 28 }}
        >
          <Link href="/build" data-action="hero-start-build">
            <BtnColorful
              variant="primary"
              size="lg"
              arrow
              style={{ fontSize: '13px', letterSpacing: '0.26em', padding: '18px 38px' }}
            >
              START YOUR BUILD
            </BtnColorful>
          </Link>

          <Link href="/builds" data-action="hero-explore-builds">
            <motion.button
              whileHover={{
                borderColor: 'rgba(102,255,255,0.30)',
                color:       'rgba(243,237,226,0.82)',
                background:  'rgba(102,255,255,0.04)',
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={{
                fontFamily:    'var(--font-tactical)',
                fontWeight:    700,
                fontSize:      '13px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                padding:       '18px 30px',
                background:    'rgba(243,237,226,0.02)',
                border:        '1px solid rgba(243,237,226,0.12)',
                color:         'rgba(243,237,226,0.55)',
                cursor:        'pointer',
                borderRadius:  3,
                display:       'inline-flex',
                alignItems:    'center',
                gap:           9,
                backdropFilter:'blur(12px)',
                transition:    'all 0.15s',
              }}
            >
              EXPLORE BUILDS
              <span style={{ fontSize: '0.85em', opacity: 0.8 }}>→</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* STATS STRIP */}
        <motion.div
          {...fadeUp(2.6)}
          style={{
            display:    'flex',
            gap:        24,
            flexWrap:   'wrap',
            pointerEvents: 'auto',
          }}
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {i > 0 && (
                <div style={{
                  display: 'none', // handled by the flex gap
                }} />
              )}
              <span style={{
                fontFamily:    'var(--font-display)',
                fontSize:      'clamp(1.1rem, 2vw, 1.5rem)',
                letterSpacing: '0.04em',
                color:         'var(--orange)',
                lineHeight:    1,
              }}>
                {stat.value}
              </span>
              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '0.55rem',
                letterSpacing: '0.20em',
                color:         'var(--ink-faint)',
                textTransform: 'uppercase',
              }}>
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── RESPONSIVE ────────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 860px) {
          .hero-section {
            align-items: flex-end !important;
            padding-bottom: calc(var(--status-h) + 10%) !important;
          }
          .hero-text-panel {
            max-width: 92% !important;
            padding-left: clamp(20px, 5vw, 72px) !important;
            padding-right: clamp(20px, 4vw, 48px) !important;
          }
          .hero-vehicle {
            opacity: 0.25 !important;
            width: 80vw !important;
            right: -10% !important;
            bottom: 0 !important;
          }
          .hero-hud-br { display: none !important; }
        }
        @media (max-width: 560px) {
          .hero-vehicle { display: none !important; }
        }
      `}</style>
    </section>
  )
}
