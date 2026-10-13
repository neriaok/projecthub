import { useMemo } from 'react';
import type { FC } from 'react';
import styles from './NetworkPattern.module.css';

interface NetworkPatternProps {
  className?: string;
  seed?: number;
  nodes?: number;
  width?: number;
  height?: number;
  linkDistance?: number;
}

interface Point {
  x: number;
  y: number;
  r: number;
  pulse: boolean;
}

/** Small deterministic PRNG so the pattern is identical on every render. */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Decorative constellation of connected nodes, drawn in currentColor. */
const NetworkPattern: FC<NetworkPatternProps> = ({
  className,
  seed = 7,
  nodes = 42,
  width = 800,
  height = 600,
  linkDistance = 150,
}) => {
  const { points, links } = useMemo(() => {
    const random = createRandom(seed);
    const generated: Point[] = Array.from({ length: nodes }, () => ({
      x: random() * width,
      y: random() * height,
      r: 1.2 + random() * 2.4,
      pulse: random() > 0.85,
    }));
    const connections: [Point, Point, number][] = [];
    generated.forEach((a, i) => {
      generated.slice(i + 1).forEach((b) => {
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < linkDistance) connections.push([a, b, 1 - distance / linkDistance]);
      });
    });
    return { points: generated, links: connections };
  }, [seed, nodes, width, height, linkDistance]);

  return (
    <svg
      className={`${styles.pattern} ${className ?? ''}`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {links.map(([a, b, strength], index) => (
        <line key={index} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeOpacity={0.08 + strength * 0.35} />
      ))}
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={point.r}
          className={point.pulse ? styles.pulse : undefined}
          style={point.pulse ? { animationDelay: `${(index % 7) * 0.6}s` } : undefined}
        />
      ))}
    </svg>
  );
};

export default NetworkPattern;
