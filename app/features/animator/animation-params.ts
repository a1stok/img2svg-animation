export type AnimationParams = {
  duration: number
  delay: number
  easing: string
  direction: string
  loop: boolean
  strokeWidth: number
  fadeInFill: boolean
}

export const defaultAnimationParams: AnimationParams = {
  duration: 2000,
  delay: 0,
  easing: "inOutSine",
  direction: "normal",
  loop: false,
  strokeWidth: 1,
  fadeInFill: false,
}

/**
 * Generates a self-contained animated HTML file from an SVG string and
 * animation parameters. The output mirrors the "Download Animation (HTML)"
 * action in SvgPlayer and can be used for both single-file export and
 * batch ZIP assembly.
 */
export function generateAnimationHtml(
  svgString: string,
  params: AnimationParams,
  compact = false,
): string {
  const { duration, delay, easing, direction, loop, strokeWidth, fadeInFill } = params

  const generatedCSS = `/* --- Required CSS --- */
.svg-container path {
  ${fadeInFill ? "fill-opacity: 0;" : "fill: transparent;"}
  stroke-width: ${strokeWidth}px;
}`

  // We don't have pathCount here, so we skip the comment about extracted paths.
  // The path count comment is for the integration guide in SvgPlayer, not needed
  // in the standalone HTML.
  const generatedJS = `/* --- Animation code --- */
import { animate, svg, stagger } from "animejs";

const paths = document.querySelectorAll(".svg-container path");

// Copy the path's fill color to its stroke color
paths.forEach(path => {
  const fill = path.getAttribute("fill") || "#000000";
  path.setAttribute("stroke", fill);
  ${fadeInFill ? `path.setAttribute("fill", fill);\n  path.style.fillOpacity = "0";` : `// Fill hidden via CSS`}
});

const drawables = Array.from(paths).map(path => svg.createDrawable(path));

// Initialize line drawing animation
const animation = animate(drawables, {
  draw: ['0 0', '0 1'],
  duration: ${duration},
  delay: ${delay > 0 ? `stagger(${delay})` : 0},
  ease: "${easing}",${direction === "alternate" ? `\n  alternate: true,` : ""}
  loop: ${loop},
  autoplay: true,
});
${
  fadeInFill
    ? `
// Fade in original fill opacity after drawing completes
animate(paths, {
  fillOpacity: [0, 1],
  duration: 1000,
  delay: ${duration},
  ease: "linear",
  loop: ${loop},
  autoplay: true,
});
`
    : ""
}${direction === "reverse" ? `\nanimation.reverse();` : ""}`.trim()

  const inlineCSS = generatedCSS
    .replace("/* --- Required CSS --- */\n", "")
    .replace(/\n/g, "\n    ")

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SVG Animation</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${compact ? "transparent" : "#05070a"};
    }
    .svg-container {
      width: 100%;
      max-width: 600px;
      padding: ${compact ? "0.5rem" : "2rem"};
    }
    .svg-container svg {
      width: 100%;
      height: auto;
    }
    ${inlineCSS}
  </style>
</head>
<body>
  <div class="svg-container">
    ${svgString}
  </div>

  <script type="module">
${generatedJS.replace(/from "animejs";?/, 'from "https://esm.sh/animejs@4.5.0";')}
  </script>
</body>
</html>`
}
