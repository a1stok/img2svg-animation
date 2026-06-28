# Core Architecture & Implementation References

This directory contains detailed technical references that agents must consult when working on specific parts of the `imgtosvganimation` project. Instead of bloating the main `SKILL.md` file, deep-dives into complex topics are stored here.

## References Available

1. **[Zod Validation Strategy](./zod_validation.md)** (To be created) - How to structure schemas, validate loaders/actions, and handle boundary crossing safely.
2. **[Node.js SVG Processing](./svg_processing.md)** (To be created) - Detailed implementation notes on using `potrace` directly in Node/React Router instead of passing data to an external Python process.
3. **[Anime.js / GSAP Animations](./animation_guidelines.md)** (To be created) - Rules for declarative SVG path animations, drawing effects, and morphing.

**Rule for Agents:** Whenever a task involves one of the domains listed above, you MUST read the corresponding markdown file in this `references/` folder before writing any code.
