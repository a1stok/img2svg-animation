<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/demo-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="docs/demo-light.png">
  <img alt="img2svg-animation demo" src="docs/demo-light.png">
</picture>

# image → svg animation
drop in a picture. get back line art that draws itself.
[try it → img2svg-animation.vercel.app](https://img2svg-animation.vercel.app/)

## what it does

* turns any image into svg line art, in one color you choose, on a background color you choose
* animates the lines so they draw themselves on screen, one after another
* trace controls (threshold, inversion, curve smoothing) and animation controls (duration, stagger, easing, direction, looping, fade-in fill)
* export: copy the svg, download the svg, or download one html file with the svg, css, and animation code together

## how to use

* open the app in your browser
* upload an image file
* adjust the trace settings if needed
* adjust the animation settings
* watch the animation preview, then export it in whichever format you need

## why

most tools that turn images into svg just give you a still picture. this uses that picture as a starting point for animation — probably most useful on creative sites where a plain hero image could use some motion: portfolios, case studies, product pages, that kind of thing.

## run it locally

```bash
git clone https://github.com/a1stok/img2svg-animation
cd img2svg-animation
npm install
npm run dev
```

## stack

* react router v7 — the image conversion runs on the server, so `potrace` and `sharp` never get sent to the browser
* code is split into folders by feature (`uploader`, `potrace`, `animator`), each with its own tests
* `sharp` cleans up the image (grayscale, contrast) before `potrace` traces it into svg lines
* anime.js v4 draws the lines on screen
* radix ui + tailwind v4 for the interface
* vitest for tests, husky + lint-staged to run checks before each commit

issues and prs welcome.

## license

MIT
