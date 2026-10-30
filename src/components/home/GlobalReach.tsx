import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import { geoEqualEarth } from "d3-geo";
import { useCounter } from "@/hooks/useCounter";
import EditorialHeading from "@/components/shared/EditorialHeading";
import { homeCopy } from "@/data/copy";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const JAIPUR: [number, number] = [75.7873, 26.9124];

type Route = {
  to: string;
  type: "plane" | "ship";
  coords: [number, number];
  duration: number;
  startOffset: number;
  labelOffset: [number, number];
};

const DESTINATION_POOL: Omit<Route, "startOffset" | "labelOffset">[] = [
  // PLANES — long haul air routes
  { to: "London",       type: "plane", coords: [ -0.1276,  51.5074], duration: 8000  },
  { to: "New York",     type: "plane", coords: [-74.0060,  40.7128], duration: 11000 },
  { to: "Berlin",       type: "plane", coords: [ 13.4050,  52.5200], duration: 8500  },
  { to: "Paris",        type: "plane", coords: [  2.3522,  48.8566], duration: 8000  },
  { to: "Amsterdam",    type: "plane", coords: [  4.9041,  52.3676], duration: 8200  },
  { to: "Milan",        type: "plane", coords: [  9.1900,  45.4654], duration: 8000  },
  { to: "Tokyo",        type: "plane", coords: [139.6917,  35.6895], duration: 10000 },
  { to: "Toronto",      type: "plane", coords: [-79.3832,  43.6532], duration: 12000 },
  { to: "Los Angeles",  type: "plane", coords: [-118.2437,  34.0522], duration: 13000 },
  { to: "São Paulo",    type: "plane", coords: [ -46.6333, -23.5505], duration: 14000 },
  { to: "Madrid",       type: "plane", coords: [  -3.7038,  40.4168], duration: 8000  },
  { to: "Stockholm",    type: "plane", coords: [  18.0686,  59.3293], duration: 8500  },
  { to: "Seoul",        type: "plane", coords: [ 126.9780,  37.5665], duration: 9500  },
  { to: "Bangkok",      type: "plane", coords: [ 100.5018,  13.7563], duration: 5000  },
  { to: "Zurich",       type: "plane", coords: [   8.5417,  47.3769], duration: 7500  },
  { to: "Barcelona",    type: "plane", coords: [   2.1540,  41.3900], duration: 7800  },
  // SHIPS — sea freight routes
  { to: "Dubai",        type: "ship",  coords: [  55.2708,  25.2048], duration: 7000  },
  { to: "Singapore",    type: "ship",  coords: [ 103.8198,   1.3521], duration: 9000  },
  { to: "Sydney",       type: "ship",  coords: [ 151.2093, -33.8688], duration: 13000 },
  { to: "Cape Town",    type: "ship",  coords: [  18.4241, -33.9249], duration: 11000 },
  { to: "Hamburg",      type: "ship",  coords: [  10.0000,  53.5500], duration: 12000 },
  { to: "Rotterdam",    type: "ship",  coords: [   4.4777,  51.9244], duration: 12000 },
  { to: "Los Angeles",  type: "ship",  coords: [-118.2437,  34.0522], duration: 18000 },
  { to: "Nairobi",      type: "ship",  coords: [  36.8172,  -1.2921], duration: 10000 },
];

const ACTIVE_PLANE_COUNT = 8;
const ACTIVE_SHIP_COUNT  = 4;

const planePool = DESTINATION_POOL.filter((d) => d.type === "plane");
const shipPool  = DESTINATION_POOL.filter((d) => d.type === "ship");

const activeRoutes: Route[] = [
  ...Array.from({ length: ACTIVE_PLANE_COUNT }, (_, i) => ({
    ...planePool[i % planePool.length],
    startOffset: i / ACTIVE_PLANE_COUNT,
    labelOffset: [8, -10] as [number, number],
  })),
  ...Array.from({ length: ACTIVE_SHIP_COUNT }, (_, i) => ({
    ...shipPool[i % shipPool.length],
    startOffset: i / ACTIVE_SHIP_COUNT,
    labelOffset: [8, -10] as [number, number],
  })),
];

// Build the projection once so icon math matches the map exactly.
// The world fills the whole width of the box (the sphere is ~5.41 x scale wide), with the polar ends trimmed off.
const MAP_WIDTH = 1240;
const MAP_HEIGHT = 600;
const projection = geoEqualEarth()
  .scale((MAP_WIDTH / 5.413) * 1.08)
  .center([10, 10])
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

// name + ISO code; the round flags are small self-hosted SVGs in /public/flags
const countries = [
  ["USA", "us"], ["United Kingdom", "gb"], ["Germany", "de"], ["France", "fr"], ["Netherlands", "nl"], ["Japan", "jp"],
  ["Australia", "au"], ["UAE", "ae"], ["Canada", "ca"], ["Italy", "it"], ["Singapore", "sg"], ["South Africa", "za"],
  ["Spain", "es"], ["Sweden", "se"], ["Switzerland", "ch"], ["New Zealand", "nz"], ["Belgium", "be"], ["Denmark", "dk"],
] as const;

function PlaneIcon({ size = 1 }: { size?: number }) {
  const s = size;
  return (
    <g>
      {/* Fuselage */}
      <ellipse cx={0} cy={0} rx={7 * s} ry={1.8 * s} fill="#C9973A" />
      {/* Nose cone */}
      <ellipse cx={6 * s} cy={0} rx={2.5 * s} ry={1.2 * s} fill="#E8B96A" />
      {/* Main wings */}
      <path d={`M ${-1 * s},0 L ${-4 * s},${-8 * s} L ${-6 * s},${-8 * s} L ${1 * s},0 L ${-6 * s},${8 * s} L ${-4 * s},${8 * s} Z`} fill="#C9973A" opacity={0.9} />
      {/* Tail fin vertical */}
      <path d={`M ${-5 * s},0 L ${-7 * s},${-5 * s} L ${-6 * s},${-5 * s} L ${-4 * s},0 Z`} fill="#C9973A" />
      {/* Tail fins horizontal */}
      <path d={`M ${-5 * s},0 L ${-7 * s},${-3 * s} L ${-7 * s},${-4 * s} L ${-4 * s},0 L ${-7 * s},${4 * s} L ${-7 * s},${3 * s} Z`} fill="#C9973A" opacity={0.75} />
      {/* Window line */}
      <rect x={-1 * s} y={-0.7 * s} width={5 * s} height={1.4 * s} rx={0.7 * s} fill="#FAF7F0" opacity={0.4} />
      {/* Engine pods */}
      <ellipse cx={-1 * s} cy={-5.5 * s} rx={2.2 * s} ry={0.9 * s} fill="#8B5E3C" />
      <ellipse cx={-1 * s} cy={5.5 * s} rx={2.2 * s} ry={0.9 * s} fill="#8B5E3C" />
    </g>
  );
}

function ShipIcon({ size = 1 }: { size?: number }) {
  const s = size;
  return (
    <g>
      {/* Hull — wide bottom */}
      <path d={`M ${-10 * s},${2 * s} L ${10 * s},${2 * s} L ${8 * s},${5 * s} L ${-8 * s},${5 * s} Z`} fill="#4A7BA7" />
      {/* Hull waterline detail */}
      <path d={`M ${-10 * s},${2 * s} L ${10 * s},${2 * s} L ${10 * s},${3 * s} L ${-10 * s},${3 * s} Z`} fill="#2D5F8A" />
      {/* Main deck */}
      <rect x={-9 * s} y={-1 * s} width={18 * s} height={3 * s} rx={0.5 * s} fill="#5B8DB8" />
      {/* Bridge/superstructure */}
      <rect x={3 * s} y={-5 * s} width={5 * s} height={4 * s} rx={0.5 * s} fill="#3D6E94" />
      {/* Bridge windows */}
      <rect x={4 * s} y={-4.2 * s} width={1.2 * s} height={1 * s} rx={0.2 * s} fill="#FAF7F0" opacity={0.7} />
      <rect x={5.8 * s} y={-4.2 * s} width={1.2 * s} height={1 * s} rx={0.2 * s} fill="#FAF7F0" opacity={0.7} />
      {/* Cargo containers */}
      <rect x={-8 * s} y={-4 * s} width={4 * s} height={3 * s} rx={0.3 * s} fill="#C9973A" />
      <rect x={-3.5 * s} y={-4 * s} width={4 * s} height={3 * s} rx={0.3 * s} fill="#8B5E3C" />
      <rect x={-8 * s} y={-7.5 * s} width={4 * s} height={3 * s} rx={0.3 * s} fill="#8B5E3C" />
      <rect x={-3.5 * s} y={-7.5 * s} width={4 * s} height={3 * s} rx={0.3 * s} fill="#C9973A" />
      {/* Chimney/funnel */}
      <rect x={5.5 * s} y={-8 * s} width={1.5 * s} height={3 * s} rx={0.5 * s} fill="#2D3748" />
      {/* Bow (front pointed tip) */}
      <path d={`M ${9 * s},${-1 * s} L ${12 * s},${1 * s} L ${9 * s},${2 * s} Z`} fill="#5B8DB8" />
      {/* Wake lines */}
      <path d={`M ${-9 * s},${5 * s} Q ${-11 * s},${7 * s} ${-13 * s},${5 * s}`} stroke="#6B9EC9" strokeWidth={0.8 * s} fill="none" opacity={0.5} />
      <path d={`M ${-8 * s},${6 * s} Q ${-10 * s},${8 * s} ${-12 * s},${6 * s}`} stroke="#6B9EC9" strokeWidth={0.6 * s} fill="none" opacity={0.3} />
    </g>
  );
}

const ORIGIN = projection(JAIPUR) as [number, number];
const TRAILS = [
  { dt: 0.012, op: 0.55, rr: 2.5 },
  { dt: 0.025, op: 0.30, rr: 1.8 },
  { dt: 0.040, op: 0.12, rr: 1.2 },
];

// where one vehicle is, `tick` ms after the page started: spread across routes with startOffset, there and back again
function pose(r: Route, tick: number) {
  const dest = projection(r.coords) as [number, number];
  const cycle = ((tick / r.duration) + r.startOffset) % 2;
  const t = cycle <= 1 ? cycle : 2 - cycle;
  const isReturning = cycle > 1;
  const [fromX, fromY] = isReturning ? dest : ORIGIN;
  const [toX, toY] = isReturning ? ORIGIN : dest;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const dist = Math.hypot(dx, dy);
  const arcHeight = r.type === "plane" ? Math.min(70, Math.max(25, dist * 0.2)) : Math.min(18, Math.max(8, dist * 0.04));
  const compute = (tt: number): [number, number] => [fromX + dx * tt, fromY + dy * tt - Math.sin(tt * Math.PI) * arcHeight];
  const [x, y] = compute(t);
  const ahead = compute(Math.min(1, t + 0.01));
  const angle = (Math.atan2(ahead[1] - y, ahead[0] - x) * 180) / Math.PI;
  return {
    transform: `translate(${x} ${y}) rotate(${angle}) scale(${r.type === "plane" ? 0.7 : 0.55})`,
    trail: TRAILS.map((tr) => compute(Math.max(0, t - tr.dt))),
  };
}

// The planes and ships are moved by changing a few SVG attributes each frame, outside React, and only while the map is on screen
// (they used to re-render the whole section, every country included, on every frame, even when it was far off screen).
function Vehicles() {
  const root = useRef<SVGGElement>(null);

  useEffect(() => {
    const g = root.current;
    if (!g) return;
    const nodes = activeRoutes.map((_, i) => {
      const el = g.children[i] as SVGGElement;
      return { trail: Array.from(el.children).slice(0, TRAILS.length) as SVGCircleElement[], icon: el.children[TRAILS.length] as SVGGElement };
    });
    let raf = 0;
    let start = 0;
    const frame = (ts: number) => {
      if (!start) start = ts;
      const tick = ts - start;
      activeRoutes.forEach((r, i) => {
        const p = pose(r, tick);
        const n = nodes[i];
        n.icon.setAttribute("transform", p.transform);
        p.trail.forEach(([x, y], ti) => { n.trail[ti].setAttribute("cx", String(x)); n.trail[ti].setAttribute("cy", String(y)); });
      });
      raf = requestAnimationFrame(frame);
    };
    const svg = (g.ownerSVGElement ?? g) as SVGSVGElement;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(frame); svg.removeAttribute("data-idle"); svg.unpauseAnimations?.(); }
      else { cancelAnimationFrame(raf); raf = 0; svg.setAttribute("data-idle", ""); svg.pauseAnimations?.(); }
    });
    io.observe(svg);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <g ref={root}>
      {activeRoutes.map((r, idx) => {
        const p = pose(r, 0);
        const trailColor = r.type === "plane" ? "#C9973A" : "#6B9EC9";
        return (
          <g key={`v-${idx}`}>
            {TRAILS.map((tr, ti) => (
              <circle key={ti} cx={p.trail[ti][0]} cy={p.trail[ti][1]} r={tr.rr} fill={trailColor} opacity={tr.op} />
            ))}
            <g transform={p.transform}>{r.type === "plane" ? <PlaneIcon /> : <ShipIcon />}</g>
          </g>
        );
      })}
    </g>
  );
}

function Stat({ value, suffix = "", label, group = true }: { value: number; suffix?: string; label: string; group?: boolean }) {
  const { value: v, ref } = useCounter(value);
  return (
    <div className="flex flex-col items-center text-center">
      <span
        ref={ref}
        className="text-gold-light lining-nums tabular-nums"
        style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 28 }}
      >
        {group ? v.toLocaleString() : v}{suffix}
      </span>
      <span
        className="mt-1 text-cream uppercase"
        style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 12, letterSpacing: "0.18em" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function GlobalReach() {
  return (
    <section className="bg-ink text-cream py-20 md:py-28 lg:py-32 overflow-hidden" style={{ background: "#0F0B08" }}>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <EditorialHeading light eyebrow={homeCopy.globalReach.eyebrow} count={homeCopy.globalReach.count} line1={homeCopy.globalReach.line1} line2={homeCopy.globalReach.line2} intro={homeCopy.globalReach.intro} />

        <div
          className="mt-8 md:mt-16 relative w-full rounded-xl overflow-hidden max-sm:!aspect-[1.7]"
          style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}
        >
          {/* on phones the map is enlarged a further 30% and trimmed at the sides (the empty Pacific), so it is not a thin strip */}
          <ComposableMap
            projection={projection as never}
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="max-sm:scale-[1.3] max-sm:origin-[56%_50%]"
            style={{ width: "100%", height: "100%", background: "#0F0B08" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: Array<{ rsmKey: string }> }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo as never}
                    fill="#2A2018"
                    stroke="#3D3020"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#2A2018" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>

          {/* Everything that moves sits in its own transparent map laid exactly over the countries (same size, same projection), so the
              countries are drawn once instead of being redrawn under every pulse, dash and plane on every frame. */}
          <ComposableMap
            projection={projection as never}
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="absolute inset-0 pointer-events-none will-change-transform max-sm:scale-[1.3] max-sm:origin-[56%_50%]"
            style={{ width: "100%", height: "100%" }}
          >
            {/* Route lines */}
            {activeRoutes.map((r, i) => (
              <Line
                key={`line-${i}`}
                from={JAIPUR}
                to={r.coords}
                stroke={r.type === "plane" ? "#C9973A" : "#6B9EC9"}
                strokeWidth={r.type === "plane" ? 1.0 : 0.8}
                strokeOpacity={r.type === "plane" ? 0.25 : 0.18}
                strokeDasharray={r.type === "plane" ? "4 6" : "2 8"}
                strokeLinecap="round"
                className="route-line"
              />
            ))}

            {/* Destination markers — deduplicated by coords */}
            {Array.from(
              new Map(activeRoutes.map((r) => [`${r.coords[0]},${r.coords[1]}`, r])).values()
            ).map((r) => (
              <Marker key={`m-${r.to}`} coordinates={r.coords}>
                <circle r={3} fill="#C9973A" />
                <circle r={6} fill="#C9973A" opacity={0.3}>
                  <animate attributeName="r" values="3;9;3" dur="2.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2.8s" repeatCount="indefinite" />
                </circle>
                <text
                  x={8}
                  y={4}
                  textAnchor="start"
                  style={{ fontFamily: "Jost, sans-serif", fontSize: 7.5, fontWeight: 400, letterSpacing: "0.1em" }}
                  fill="#FAF7F0"
                  opacity={0.8}
                  className="hidden md:block"
                >
                  {r.to.toUpperCase()}
                </text>
              </Marker>
            ))}

            {/* Origin: Jaipur */}
            <Marker coordinates={JAIPUR}>
              <circle r={10} fill="#C9973A" opacity={0.6}>
                <animate attributeName="r" values="5;14;5" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle r={5} fill="#C9973A" />
              <circle r={2} fill="#FAF7F0" />
              <text
                textAnchor="middle"
                y={-14}
                style={{ fontFamily: "Jost, sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em" }}
                fill="#C9973A"
              >
                JAIPUR
              </text>
            </Marker>

            <Vehicles />
          </ComposableMap>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 border-y border-warm-grey/15 py-8">
          {homeCopy.globalReach.stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-10 overflow-hidden"
        >
          <div
            // w-max: the track is exactly as wide as its content, so translating -50% lands precisely on the second copy (a seamless loop)
            className="flex w-max whitespace-nowrap will-change-transform motion-reduce:animate-none!"
            style={{
              animation: "marquee 20s linear infinite",
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: 13,
              color: "rgba(250,247,240,0.6)",
              letterSpacing: "0.12em",
            }}
          >
            {[...countries, ...countries].map(([name, code], i) => (
              <span key={i} className="shrink-0 flex items-center gap-2.5 mr-3 rounded-full pl-1.5 pr-4 py-1.5" style={{ boxShadow: "inset 0 0 0 1px rgba(250,247,240,0.14)" }}>
                <img src={`/flags/${code}.svg`} alt="" width={22} height={22} decoding="async" className="shrink-0 w-[22px] h-[22px] object-cover" style={{ borderRadius: "50%" }} />
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
