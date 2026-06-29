import { JSDOM } from "jsdom"
const dom = new JSDOM(
  `<!DOCTYPE html><html><body><svg><path id="p" d="M0,0 L100,100" stroke="black"></path></svg></body></html>`,
)
global.window = dom.window
global.document = dom.window.document
global.getComputedStyle = dom.window.getComputedStyle
let rafCbs = []
global.requestAnimationFrame = (cb) => {
  rafCbs.push(cb)
  return rafCbs.length
}
global.cancelAnimationFrame = (id) => {
  rafCbs[id - 1] = null
}

import { animate, svg } from "animejs"

const path = document.querySelector("#p")
path.getTotalLength = () => 141.42

async function runTests() {
  const drawables = [svg.createDrawable(path)]

  console.log("--- Normal: 0 0 to 0 1 ---")
  let anim1 = animate(drawables, {
    draw: ["0 0", "0 1"],
    duration: 100,
    autoplay: false,
  })
  anim1.seek(0)
  console.log("0% progress dashoffset:", path.style.strokeDashoffset)
  anim1.seek(100)
  console.log("100% progress dashoffset:", path.style.strokeDashoffset)

  console.log("--- Reverse Draw: 1 1 to 0 1 ---")
  let anim2 = animate(drawables, {
    draw: ["1 1", "0 1"],
    duration: 100,
    autoplay: false,
  })
  anim2.seek(0)
  console.log("0% progress dashoffset:", path.style.strokeDashoffset)
  anim2.seek(100)
  console.log("100% progress dashoffset:", path.style.strokeDashoffset)
}

runTests().catch(console.error)
