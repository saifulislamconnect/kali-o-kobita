// Create a simple single-line SVG path illustration
// Uses seed to vary head offsets, curves, sway etc.
export function makeIllustrationSVG(seed?: number): string {
  // Generate a random seed if none is provided
  const actualSeed = seed !== undefined ? seed : Math.floor(Math.random() * 10000);
  console.log(`Using illustration seed: ${actualSeed}`);
  const r = Math.abs(seededRandom(actualSeed));
  const headOffset = 6 + Math.round(r * 14);
  const curve = 18 + Math.round(r * 48);
  const sway = -10 + Math.round(r * 24);
  const leafAngle = -15 + Math.round(r * 30);

  // create a flowing path that looks like two heads and shoulders in one stroke
  const pathData = [
    `M 20 ${40 - headOffset}`,
    `C ${52 + sway} ${28 - headOffset}, ${92 - sway} ${28 - headOffset}, 128 ${40 - headOffset}`,
    `C ${100 + curve} ${78}, ${60 - curve} ${78}, 20 ${40 - headOffset}`,
    `L 8 108`,
    `C 36 124, 84 124, 128 108`
  ].join(' ');

  // small heart motif with more detail
  const heart = `M74 46 C72 44, 69 42, 66 42 C58 42, 58 52, 66 58 C72 62, 76 66, 82 58 C92 48, 88 42, 78 42 C75 42, 76 44, 74 46 Z`;

  // decorative leaf/flourish element
  const leaf = `M${35 + Math.round(r * 15)} ${90 + Math.round(r * 10)}
                C${40 + Math.round(r * 10)} ${70 + Math.round(r * 20)},
                ${55 + Math.round(r * 20)} ${65 + Math.round(r * 15)},
                ${70 + Math.round(r * 25)} ${80 + Math.round(r * 5)}`;

  // stars/sparkles
  const makeStar = (x: number, y: number, size: number) => {
    return `M${x} ${y-size} L${x+size/4} ${y-size/4} L${x+size} ${y} L${x+size/4} ${y+size/4} L${x} ${y+size} L${x-size/4} ${y+size/4} L${x-size} ${y} L${x-size/4} ${y-size/4} Z`;
  };

  const stars = [];
  const starCount = 2 + Math.floor(r * 3);
  for (let i = 0; i < starCount; i++) {
    const starX = 20 + Math.round(r * 120 * (i/starCount));
    const starY = 20 + Math.round(r * 100);
    const starSize = 2 + Math.round(r * 4);
    stars.push(makeStar(starX, starY, starSize));
  }

  const svg = `
    <svg viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" data-seed="${actualSeed}">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--accent-light)" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.8"/>
        </linearGradient>
      </defs>

      <!-- Decorative background elements -->
      <path d="${leaf}" fill="none" stroke="var(--gold)" stroke-width="1.2" stroke-linecap="round"
            stroke-dasharray="60" stroke-dashoffset="60" opacity="0.5" transform="rotate(${leafAngle}, 80, 70)">
        <animate attributeName="stroke-dashoffset" from="60" to="0" dur="1.5s" begin="0.3s" fill="freeze" />
      </path>

      <!-- Stars/sparkles -->
      ${stars.map((star, i) =>
        `<path d="${star}" fill="var(--gold)" opacity="0">
          <animate attributeName="opacity" from="0" to="0.7" dur="0.3s" begin="${0.8 + i*0.2}s" fill="freeze" />
          <animate attributeName="opacity" from="0.7" to="0.3" dur="1.5s" begin="${1.1 + i*0.2}s" repeatCount="indefinite" />
        </path>`
      ).join('')}

      <!-- Main illustration path -->
      <g fill="none" stroke="url(#lineGradient)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="${pathData}" style="stroke-dasharray: 300; stroke-dashoffset: 300;">
          <animate attributeName="stroke-dashoffset" from="300" to="0" dur="1.2s" fill="freeze" />
        </path>
      </g>

      <!-- Heart -->
      <path d="${heart}" fill="var(--accent)" opacity="0">
        <animate attributeName="opacity" from="0" to="0.9" dur="0.5s" begin="0.8s" fill="freeze" />
      </path>
    </svg>
  `;
  return svg;
}

// pseudo-random from seed (deterministic)
export function seededRandom(n: number): number {
  return (Math.sin(n) * 10000) % 1;
}

// Utility function to clamp a value between min and max
export function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}
