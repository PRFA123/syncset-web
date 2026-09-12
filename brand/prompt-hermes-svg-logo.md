# Prompt para Hermes — SVG do Logo SyncSet

Cole este prompt inteiro no Hermes. Ele vai gerar o SVG, você cola no Figma (File → Import ou arrasta o arquivo .svg), vê o resultado e volta com feedback. Repita até convergir.

\---

## PROMPT

You are a precision SVG engineer specializing in geometric logo construction. Your task is to produce a clean, production-ready SVG of the SyncSet logomark — iteratively, one version at a time, until it matches the reference description exactly.

## Your objective — read this first

Reproduce the attached reference image as faithfully as possible in clean SVG code. This is NOT a creative brief asking for interpretation — the design is final and approved. Your job is to translate what already exists into production-ready vector code. Do not simplify, do not "improve", do not change proportions. Match the reference.

## What the reference shows (describe of the approved mark)

The mark is a stylized "S" made of **two thick ribbon/band shapes that interlock at the center**, like two interlocked hooks forming an S curve together.

**Ribbon A (upper hook):**

* A thick band that enters from the lower-left with a pointed/tapered tip (like a calligraphic stroke ending)
* Curves upward and to the right in a large smooth arc (like the top half of the letter S)
* At the upper-right it turns back inward, forming the top loop of the S
* The inner curve of this top loop is a tight U-turn (small radius, rounded end — not pointed)
* Exits back toward center-right with a blunt horizontal cut
* The upper-left exterior has a long sweeping tapered tail extending out to the left

**Ribbon B (lower hook):**

* Mirror of Ribbon A, rotated 180° around the mark's center
* Enters from the upper-right with a tapered tip
* Curves down and to the left forming the bottom half of the S
* Inner curve at bottom-left is a tight rounded U-turn
* Has a sweeping tapered tail extending to the lower-right
* Exits back toward center-left with a blunt cut

**The crossing / interlocking:**

* The two ribbons cross each other in the vertical center of the mark
* At this crossing point, Ribbon A (upper) passes IN FRONT of Ribbon B (lower)
* This overlap creates a visible white negative-space channel between the two ribbons
* The channel is clearly visible — it is what makes the mark read as two separate interlocked bands
* Channel width at the crossing ≈ 10% of total mark width

**Key visual details:**

* Both ribbons have consistent thickness through their main body (approx 20–22% of total width)
* The tapered tails thin to a sharp point — this is intentional calligraphic contrast, keep it
* The inner U-turn at each loop end is rounded and smooth, with visible interior negative space (a counter)
* The overall silhouette reads clearly as "S" even without the interior detail
* The mark is slightly taller than wide — approximately 1:1.1 ratio (width:height)

**Colors and background:**

* Fill: #101112
* Background: transparent
* viewBox="0 0 400 440"

## Construction method

Do NOT use stroke-based paths and outlineStroke. Do NOT use boolean subtract of circles.

Instead, use **filled closed paths (filled bezier shapes)** for each ribbon, drawn as the complete filled silhouette of each ribbon including its thickness. Then use a **white filled shape** (color #FFFFFF or matching the background, e.g. #FBFAF7) to punch the gap where the ribbons cross — placed on top of Ribbon B, behind Ribbon A.

Layer order (bottom to top):

1. Ribbon B — filled #101112
2. Gap puncher — filled #FBFAF7 (the white gap at crossing, slightly wider than the ribbon to create clean separation)
3. Ribbon A — filled #101112

## SVG output requirements

* `viewBox="0 0 400 440"`
* `width="400" height="440"`
* No external dependencies, no fonts, no filters, no gradients
* Transparent background (no background rect)
* Three elements only: `<path id="ribbon-b">`, `<path id="gap">`, `<path id="ribbon-a">`
* All paths use absolute cubic bezier commands (M, C, L, Z) — no relative commands
* Include a `<!-- SyncSet logomark v1 -->` comment at the top
* Output ONLY the raw SVG code, starting with `<svg` — no markdown, no explanation, no backticks

## Iteration protocol

After you output the SVG:

1. Describe in 2 sentences what geometric decisions you made (ribbon radius, crossing position, terminal angles)
2. Ask: "Does this match? If not, describe what looks wrong and I will fix it in the next version."

Increment the version comment each iteration: v1, v2, v3...

## What has already been tried and failed — do not repeat

* Boolean subtract of two half-ellipses: produces two disconnected arcs
* Stroke-based paths with outlineStroke: produces uncontrolled blob shapes without interior counters
* Freehand tracing of the raster reference: produces a solid filled silhouette with no internal negative space

The filled-path + gap-puncher approach above has not been tried yet. Start there.

\---

## Instructions for Paulo (after you get the SVG back from Hermes)

1. Copy the SVG code
2. Open a text editor (Notepad, VS Code, qualquer um), cole o código, salve como `syncset-mark-v1.svg`
3. No Figma, vá em `File → Place image...` ou arraste o arquivo `.svg` direto para a prancha **01 — Marca Isolada**
4. Veja como ficou
5. Volte aqui (Claude.ai) e descreva o que está errado — ou mande um print
6. Eu traduzo o feedback em instrução de correção e você cola no Hermes para a próxima iteração

**O que observar em cada versão:**

* As duas fitas estão claramente separadas no cruzamento? (canal branco visível)
* Os terminais são blunt/cortados, não pontiagudos?
* A forma geral lê como "S" rotacionado, não como dois arcos soltos?
* Escala reduzida: cole também na caixa de 32px da prancha 05 e veja se ainda é legível

