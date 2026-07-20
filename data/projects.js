/* Projects timeline data. Edit this file to add / reorder / remove entries.
   Each entry:
     title       — string, displayed as the heading
     tags        — array of short strings (rendered as stack chips)
     description — string; blank line (\n\n) splits into paragraphs
     link        — { href, label }, optional. Omit for entries with no link.
     image       — string path, optional. Renders on the side opposite the text.
   The numeric index (01, 02, ...) is generated automatically from array order. */

export const projects = [
  {
    title: 'Alodium',
    date: '2026',
    tags: ['self-hosting', 'infrastructure', 'security'],
    description: `Your personal corner of the internet, digital walled-garden with your very own software development team ready to cook up whatever apps/tools you should want. Your data stays on hardware you control. Security by structure: deterministic policy enforcement and network isolation give you the personal-assistant features of OpenClaw without the security nightmare.

Shape technology to your interaction patterns. Technology shouldn't shape how you interact.`,
    link: { href: 'https://github.com/devYaoYH/alodium', label: 'Source' },
    image: 'img/geth_dashboard.webp',
  },
  {
    title: 'Mnemosyne',
    date: '2026',
    tags: ['LLMs', 'HCI', 'memory systems'],
    description: `A new experimental way of interacting with chatbots. Clusters memories along both semantic and episodic dimensions for interpretable, granular control over shared context. A branching chat interface supports non-linear cognitive workflows: parallel threads for independent explorations, temporary threads for side queries, and intent routing that autonomously detects topic shifts — all without compromising the primary conversation's coherence.`,
    link: { href: 'https://github.com/devYaoYH/Mnemosyne', label: 'Source' },
    youtube: 'GjbcilKqo20',
  },
  {
    title: 'HAL-IRT',
    date: '2026',
    tags: ['LLMs', 'evaluation', 'IRT', 'agent benchmarks'],
    description: `A Multidimensional Item Response Theory model fitted on the public HAL leaderboard dataset — 13 harnesses, 36 models, 1,796 tasks. Identifies maximally discriminating tasks per benchmark, cutting evaluation costs by 40-44% while maintaining ability-estimation accuracy. Feature-informed priors enable cold-start performance prediction for novel scaffold × model combinations never seen during training.`,
    link: { href: 'https://devyaoyh.github.io/hal-harness-plus-plus/', label: 'Demo' },
    image: 'img/hal_irt.webp',
  },
  {
    title: 'Samwise Flight Software',
    date: '2025',
    tags: ['embedded', 'C', 'Python', 'satellites'],
    description: `Software team lead for Stanford Student Space Initiative. Ran the program end-to-end — feature scoping, task allocation, cross-team coordination — leading ~8 engineers against a 9-month deadline to ship a new flight OS for a CubeSat. Primary technical work on the codebase architecture for testing custom embedded OS, including remote hardware-in-the-loop, integration with the TinyGS ground station network, and designing an OTA (over-the-air) Update protocol from scratch.`,
    link: { href: 'https://github.com/stanford-ssi/samwise-flight-software', label: 'Source' },
    image: 'img/samwise_satellite.webp',
  },
  {
    title: 'Anyplot',
    date: '2025',
    tags: ['LLMs', 'privacy', 'data visualization'],
    description: `Privacy-forward dataset exploration tool — all the goodness of modern agentic coding systems without leaking your dataset. CSV uploads are filtered locally via SQL before a differential privacy layer masks sensitive information sent to Claude, which then generates visualization code executed in a sandboxed subprocess. React frontend, FastAPI backend, MCP-based privacy engine.`,
    link: { href: 'https://devyaoyh.github.io/anyplot/', label: 'Demo' },
    image: 'img/anyplot_full_app.webp',
  },
  {
    title: 'Do LLMs Mirror Human Morality?',
    date: '2025',
    tags: ['LLMs', 'moral cognition', 'evaluation'],
    description: `A re-run of the Moral Machine paradigm against frontier models, using chain-of-thought prompting and structured outputs to (a) reproduce results in this space more reliably, (b) compare model performance across languages, and (c) capture a dataset on model moral decisions for downstream study.`,
    link: {
      href: 'https://github.com/devYaoYH/TETHICON-moral-machines/blob/main/presentation/TETHICON%202025%20Moral%20Machines%20Redux.pdf',
      label: 'Poster',
    },
    image: 'img/moral_machines_redux.webp',
  },
  {
    title: 'Cloud Watcher',
    date: '2021',
    tags: ['JavaScript', 'Canvas', 'generative'],
    description: `The page you're looking at. Hand-rolled cloud puffs that erode on click, a Conway's Game of Life lattice as a living backdrop, and an isometric polar-bear city with agentic simulation. A small composable engine: every node carries its own animate / draw closure, transforms compose down the tree, and collision dispatches on a pair of shape types.`,
    link: { href: 'https://github.com/devYaoYH/landing_page/blob/master/CanvasAnimation.js', label: 'Source' },
    imageNoLink: true,
    image: 'img/polar_landing_helmet_cc-01.png',
    stamp: {
      title: 'Opus 4.6 Approved',
      bullets: [
        'Clean separation of concerns: math primitives, transforms, collision, drawables, scene graph',
        'Double-dispatch pattern for collision detection — handles different shape-pair intersections cleanly',
        'Composable animation via animationFn chaining with parent propagation',
        'Transform functions return object for chaining',
      ],
    },
  },
];
