import { JSDOM } from "jsdom"
const dom = new JSDOM(`<!DOCTYPE html><p>Hello</p>`)
global.window = dom.window
global.document = dom.window.document

import { animate } from "animejs"

console.log("Testing loop: true")
const anim1 = animate(document.querySelector("p"), {
  opacity: [0, 1],
  duration: 100,
  loop: true,
  autoplay: false,
})
console.log("anim1.iterationCount:", anim1.iterationCount)

console.log("Testing loop: Infinity")
const anim2 = animate(document.querySelector("p"), {
  opacity: [0, 1],
  duration: 100,
  loop: Infinity,
  autoplay: false,
})
console.log("anim2.iterationCount:", anim2.iterationCount)

console.log("Testing loop: 5")
const anim3 = animate(document.querySelector("p"), {
  opacity: [0, 1],
  duration: 100,
  loop: 5,
  autoplay: false,
})
console.log("anim3.iterationCount:", anim3.iterationCount)
