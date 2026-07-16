/* Research entries — rendered as a question-led journal layout (distinct
   from the projects timeline). Each entry:
     question    — string, the open question driving the work (large serif)
     lab         — string, e.g. "Stanford — Social Interaction Lab"
     date        — string, e.g. "2026 — ongoing"
     tags        — array of short strings (rendered small / muted)
     description — string; blank line (\n\n) splits into paragraphs
     links       — array of { href, label }, optional
                   (a single `link` object is also accepted). */

export const research = [
  {
    question: `Why do LLM agents fail to coordinate even when they individually solve the task?`,
    lab: 'Stanford — Social Interaction Lab',
    date: '2026 — ongoing',
    tags: ['multi-agent', 'LLMs', 'negotiation'],
    description: `Designed an iterated multi-turn negotiation game to study dynamic grounding in LLM agent dyads. 720 game traces across three frontier models reveal that agents consistently fail to coordinate despite individually solving the task — failures traced to perfunctory fairness, proposal anchoring, and commitment violations. Accepted at the ICML 2026 FAGEN and LM4Plan workshops.`,
    links: [
      {
        href: 'https://arxiv.org/abs/2605.01750',
        label: 'Paper (COLM 2026)',
      },
      {
        href: 'https://drive.google.com/file/d/1t_SLQuxbXKQcHh1JAdci6-mPOJi3eSW_/view?usp=sharing',
        label: 'Poster (ICML 2026)',
      },
      {
        href: 'https://fagen-workshop.github.io/',
        label: 'FAGEN',
      },
      {
        href: 'https://llmforplanning.github.io/ICML26/',
        label: 'LM4Plan',
      },
    ],
  },
  {
    question: `When an autonomous AI agent causes harm, who should the law hold responsible?`,
    lab: 'Independent',
    date: '2026',
    tags: ['AI policy', 'tort law', 'agents'],
    description: `Proposed an interaction-based framework for agentic tort liability, grounded in Bratman's planning theory of shared agency. Human-AI interaction logs distinguish autonomous drift, pure tool use, and collaborative planning — each mapping onto existing tort doctrine — and a "Reasonable Agent Standard" (constraint verification, epistemic transparency, runtime grounding, forensic logging) anchors developer duty of care.`,
    links: [
      {
        href: 'https://arxiv.org/abs/2606.00518',
        label: 'Paper (arXiv)',
      },
    ],
  },
  {
    question: `When do people blame a person, and when do they blame the situation?`,
    lab: 'Stanford — Causality in Cognition Lab',
    date: '2025 — ongoing',
    tags: ['cognitive science', 'causal reasoning', 'modeling'],
    description: `Derived a computational model of causal explanation using counterfactual simulation to weigh trait vs. situational factors. Validated through a novel experimental paradigm — high predictive accuracy for human causal judgments and distinct participant clusters identified via counterfactual saliency.`,
    links: [
      {
        href: 'https://drive.google.com/file/d/17UQJeqErJ4g8Sg3HOuJreaz2bErMXhpb/view?usp=sharing',
        label: 'Thesis (archival link pending)',
      },
    ],
  },
  {
    question: `Can a language model learn to steer its own internal representations?`,
    lab: 'Stanford — NLP Lab',
    date: '2025 — ongoing',
    tags: ['LLMs', 'RL', 'interpretability'],
    description: `Developing self-steering capabilities in Gemma-series models via RL and representation-edit tool calling. Architected and validated a training pipeline for concept steering; extending the framework to improve reasoning capability.`,
  },
];
