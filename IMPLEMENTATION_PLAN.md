# Implementation plan

This plan implements the project described in `AGENTS.md`. Work through the milestones in order: each one creates the foundation required by the next.

## Current implementation and deployment decisions

### Completed foundation

- [x] Nuxt application shell, viewport-bound home route, and public placeholder routes for Thoughts and Earth.
- [x] Local webfont pipeline and font utility classes.
- [x] Reusable staggered `TextReveal` and looping `TextRevealLoop` primitives, including delays, settling motion, disappearance behavior, and reduced-motion support.
- [x] Persistent bubble navigation, one-time home headline choreography, home/subpage route transitions, return-home control, and responsive navigation positioning.
- [x] English and German JSON locale files, browser-language detection, persisted language choice, and the animated language switcher.
- [x] Central introduction circle and a reusable full-viewport Flower of Life background layer.

### Chosen infrastructure

- Deploy the Nuxt server through the author's self-hosted Coolify instance. Coolify should run `pnpm build` during builds and `node .output/server/index.mjs` as the production process.
- Use the author-hosted PostgreSQL service for application data. Adopt a migration-based TypeScript data layer before adding authoring features.
- Store uploaded images and future symbol assets in the author-hosted S3-compatible bucket. Keep only object keys and metadata in PostgreSQL; never store bucket credentials in the client.
- Keep authentication deliberately small: one owner account, password login, an HTTP-only secure session cookie, server-enforced owner checks, and a discreet entry point. Do not rely on a hidden URL as authorization.
- Use Open-Meteo for the first weather integration. Fetch it only from server routes, cache coarse global samples, and show attribution. Its free endpoint is suitable for non-commercial use and does not require an API key; reassess the licence and capacity before commercial use or high traffic.

### Immediate environment variables

- `DATABASE_URL`
- `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
- `AUTH_SESSION_SECRET`, `OWNER_EMAIL`, `OWNER_PASSWORD_HASH`
- `PUBLIC_SITE_URL`

No S3 or database credential may be prefixed with `NUXT_PUBLIC_`.

## 1. Establish the product foundation

**Status: In progress — public UI foundation is complete; runtime configuration, environment validation, error states, and deployment setup remain.**

- [x] Decide the deployment target, database, asset storage, authentication approach, and weather-data provider.
- Define environment variables for credentials and provider keys; keep them server-only.
- Add a configuration and validation layer for all runtime environment variables.
- Establish shared design tokens for colors, typography, opacity ranges, spacing, breakpoints, z-index layers, durations, and easing curves.
- Define shared motion rules for normal and reduced-motion modes.
- Define a seeded scene-variation system for bounded randomness in drift, cue timing, paths, and visual depth; it must remain stable during a visit.
- Define a transition choreography system with one primary motion and no more than one secondary response per interaction.
- Set up a clear application structure for public pages, authoring pages, server APIs, content/data access, shared UI primitives, and visual scenes.
- Add base error, loading, empty, and not-found states.

**Done when:** the project has a documented local setup, validates its configuration, and can deploy a minimal public page without exposing secrets.

## 2. Model and persist the content

**Status: Not started.**

- Create a quote record with: stable ID, status (`draft` or `published`), display order, image asset, image alt text, quote text, attribution, reflection, desktop placement, mobile placement, and timestamps.
- Create a background-symbol asset record with: stable ID, asset source, optional label, status, and timestamps.
- Create a country record keyed by a stable geographic identifier with: visited state, country note, status, and timestamps.
- Create a country-marker record with: stable ID, country identifier, latitude, longitude, note, optional label, status, and timestamps.
- Define placement and coordinate formats that work across screen sizes and survive future layout changes.
- Create server-side data-access functions for public published data and separate authenticated authoring data.
- Add seed data that exercises short and long quotes, varying image sizes, several countries, and overlapping markers.

**Done when:** all public content can be loaded from structured data without hard-coded page content.

## 3. Build the shared visual system

**Status: In progress — fonts, text animation primitives, and decorative-layer conventions are complete; shared controls and scene utilities remain.**

- [x] Finalize font loading and global typography.
- [x] Refine `TextReveal` and `TextRevealLoop` as reusable animation primitives, including initial delay, stagger, exit timing, looping, and reduced-motion behavior.
- Build reusable primitives for image buttons, focus rings, panels, icon buttons, loading states, and dismissible overlays.
- Add a small animation utility layer for cancellable transitions, seeded/constrained random values, page visibility handling, and resize/orientation updates.
- Add reusable depth, afterimage, refraction, and field-distortion primitives with strict opacity, duration, and pointer-event limits.
- Ensure all decorative layers have explicit z-index and pointer-event behavior.

**Done when:** public pages can use shared components without duplicating animation or accessibility logic.

## 4. Build the home page

**Status: In progress — the current visual composition and navigation are complete; deterministic scene variation, full interaction verification, and the final author introduction remain.**

- [x] Make the root route a viewport-bound, non-scrollable home page.
- [x] Create the large central introduction circle; the author-written final copy remains to be supplied through the locale JSON files.
- [x] Integrate the “stay a while” greeting and cycling “there are things to see / hear / find / read” subheadline.
- [x] Create reusable translucent soap-bubble links for Thoughts and Earth, with persistent descriptions and keyboard-accessible semantic links.
- [x] Design responsive desktop and mobile bubble arrangements around the central circle.
- [x] Add organic bubble refraction/distortion and the Flower of Life background layer without layout shifts.
- [x] Choreograph the one-time headline reveal, center hold, and bottom resting state.

**Done when:** the home page clearly introduces the author, explains the available destinations, and lets visitors reach Thoughts and Earth comfortably with mouse, keyboard, and touch.

## 5. Implement shared route transitions

**Status: In progress — persistent navigation, one-time home entry, home/subpage movement, and basic page transitions are complete; interruption/retargeting and depth-plane choreography remain.**

- [x] Build a persistent visual shell that owns navigation bubbles and route-transition state across public pages.
- [x] On first home entry, reveal “stay a while” in the center, hold it, then move it to its bottom resting position.
- [x] Define responsive home, navigation-area, and top-left active positions for each bubble.
- [x] On bubble selection, animate the selected bubble to the top-left active position without text-driven position shifts.
- Sequence the outgoing page dissolving downward before or alongside the incoming page entering from above and fading in.
- Keep the selected bubble in the top-left position throughout its active subpage.
- On direct subpage changes, move the newly selected bubble to top-left and return the previously active bubble to the navigation area.
- On return to home, move all bubbles back to their assigned positions around the introduction circle.
- Make transitions cancellable and retargetable so rapid route changes never leave duplicate navigation or stale page content.
- Provide a reduced-motion route transition that preserves navigation state without screen travel.
- Add complementary route layers: outgoing content loses cohesion while dissolving down; incoming content resolves from a higher, softly blurred plane.
- Choreograph subpage bubble handoffs on separate visual depth planes, with only the real active bubble remaining interactive.

**Done when:** route changes feel like one continuous scene and bubble navigation remains stable through home entry, subpage changes, browser navigation, and rapid selection.

## 6. Implement the Thoughts page

**Status: Not started — the route currently has a visual placeholder only.**

- Create the viewport-bound, non-scrollable public Thoughts layout.
- Render published quote images from data at deliberate desktop and mobile positions.
- Make every image a semantic button with useful accessible naming, keyboard support, visible focus, selected state, and touch-friendly hit area.
- Create the active quote panel with quote text, attribution, and author reflection.
- Make the active quote image travel to the center while its content appears.
- Implement click-again and Escape to dismiss the active quote.
- Implement direct switching from one active quote to another without resetting the scene.
- Make nearby images yield subtly along the active image’s path and return to their resting positions afterward.
- Use curved activation paths and a delayed local distortion wave so nearby images yield first and distant images make only a small counter-movement.
- Stage quote text on separate timing planes: quote first, attribution second, reflection last.
- Make rapid selection changes interrupt and retarget current motion smoothly.
- Build distinct desktop and mobile compositions; do not merely scale one layout.

**Done when:** quote selection, dismissal, switching, keyboard control, and touch input work smoothly at both breakpoints without scrollbars or layout shifts.

## 7. Add subtle field discovery and background motion

**Status: Not started — wait for supplied symbol assets before implementing the symbol layer.**

- Add an idle cue scheduler that periodically selects one inactive quote image for a gentle size lift, glow, or pulse.
- Prefer a brief refraction, halo, or depth anomaly over a conventional repeated pulse.
- Ensure only one invitation cue runs at a time; vary the target and timing within controlled bounds.
- Pause invitation cues while a quote is active, while the page is hidden, and for reduced-motion users.
- Add a non-interactive background-symbol layer once the symbol assets are supplied.
- Randomize symbol placement, timing, and selection within safe constraints; prevent distracting clustering and overlaps with active text.
- Give symbols tiny bounded drift or rotation so they read as fleeting traces from another plane.
- Keep symbols faint, never fully opaque, and behind all interactive content.
- Pause or reduce background motion based on visibility, performance conditions, and `prefers-reduced-motion`.

**Done when:** the scene feels subtly alive and mysterious without obscuring content, reducing click accuracy, or consuming unnecessary resources.

## 8. Build public navigation and resilience

**Status: In progress — direct public routes, return-home navigation, and localized public copy are complete; resilience and share-state work remain.**

- [x] Add quiet routes from home to Thoughts and Earth, plus a consistent path back to home.
- [x] Make each public destination directly addressable by URL.
- [x] Localize current public UI copy through English and German JSON files, detect browser language, and provide a persisted manual switcher.
- Decide whether a selected quote or country receives a shareable URL; if so, validate and restore it safely.
- Add graceful public fallbacks for missing images, unavailable weather data, unsupported 3D capability, and slow network conditions.
- Preserve useful public content when decorative assets or optional live services fail.

**Done when:** visitors can navigate all public experiences reliably, including on slow devices and without optional services.

## 9. Build the globe data and 3D scene

**Status: Not started.**

- Choose a globe-rendering approach that supports country geometry, reliable picking, mobile performance, and a fallback view.
- Load country boundaries and associate them with the stable country identifiers in the content model.
- Render all countries as outlined and unfilled by default.
- Fill only visited countries and make only those countries selectable.
- Implement a holographic visual system: restrained glow, depth, outlines, atmosphere, and a view-from-space palette.
- Build a decorative universe layer behind the globe: a black hole, distant galaxy, sparse stars, and nebulae. It must stay non-interactive, remain behind country targets and notes, use restrained movement, and reduce substantially for low-performance and reduced-motion modes.
- Add gentle idle rotation when nothing is selected.
- Add pointer, touch, and keyboard-accessible country selection behavior.
- On selection, pause or settle rotation, move the globe camera toward the selected country, and show its note.
- Approach the selected country on a gentle orbital arc; reveal its fill as a signal traveling across the border and resolve its note from a nearby depth plane.
- Add country marker dots from marker coordinates, with visual dots smaller than their interaction hit areas.
- Open marker notes on selection and provide a deliberate interaction for nearby or overlapping markers.
- Implement an outside-globe click to clear selection and return to the default camera and rotation state.
- Build a simplified 2D map or country-list fallback with the same country and marker notes.

**Done when:** visited countries, country notes, markers, marker notes, selection zoom, outside reset, and the fallback experience work from the same data.

## 10. Add the atmospheric weather layer

**Status: Not started.**

- Integrate Open-Meteo through server routes, honoring its current terms, rate limits, caching rules, and attribution requirements. Start with coarse, cached global samples rather than per-visitor live requests.
- Translate weather data into an intentionally approximate space-view effect rather than a literal forecast map.
- Render the effect as a subtle, separate layer that never captures pointer events or hides country borders, markers, or notes.
- Move atmosphere on a slower independent depth plane from the globe surface, with effects kept beneath borders and markers.
- Cache and refresh weather data on a suitable schedule.
- Add loading, stale-data, unavailable-data, and offline behavior that leaves the globe fully usable.
- Reduce weather effect complexity for mobile, low-power devices, and reduced-motion users.

**Done when:** the weather atmosphere enhances the globe without being required for country interaction or page usability.

## 11. Implement authenticated authoring

**Status: Not started.**

- Add a discreet public-facing entry to the owner login flow.
- Implement one real owner account with a password hash supplied through Coolify environment variables, an HTTP-only secure session cookie, CSRF protection for mutations, server-enforced authorization, and a reliable sign-out path.
- Build a separate authoring layout with clear navigation and a reliable sign-out path.
- Add quote management: create, edit, reorder, upload/select image, write alt text, set desktop/mobile placement, draft/publish, preview, and delete.
- Add background-symbol asset management.
- Add country management: set visited state, edit country notes, draft/publish, and preview.
- Add marker management: place/edit coordinates, add notes, resolve overlaps, draft/publish, and preview.
- Provide validation, save feedback, recoverable errors, and draft previews before publishing.
- Record audit-relevant timestamps and keep uploaded asset metadata available to the author.

**Done when:** the author can fully manage public content without changing source code or exposing unpublished material.

## 12. Accessibility, performance, and quality verification

**Status: Not started as a release milestone; production builds have passed for the current UI foundation.**

- Verify every interactive control with keyboard, touch, and pointer input.
- Verify focus order, selected states, Escape behavior, dialog/panel semantics, contrast, and image alternative text.
- Verify reduced-motion behavior preserves all content and selected states while reducing travel and decorative movement.
- Test mobile portrait, mobile landscape, tablet, and desktop layouts.
- Test public pages with missing assets, delayed images, unavailable weather, no WebGL, slow network, and JavaScript error boundaries where applicable.
- Profile the quote field and globe on representative mobile hardware; reduce animation density, shader complexity, and live updates when required.
- Verify that background layers never cause scrollbars, layout shifts, blocked clicks, or unacceptable battery/CPU use.
- Add focused automated tests for data validation and interaction state transitions, plus end-to-end coverage for home navigation, quote interactions, and globe flows.
- Run a production build and manual visual review before each release.

**Done when:** the public experiences are responsive, accessible, resilient, and visually calm on supported devices.

## 13. Release and ongoing operations

**Status: Not started.**

- Configure Coolify production environment variables, a PostgreSQL service, database migrations, S3 storage access, owner-auth redirects, and the Nuxt health check.
- Set up automated PostgreSQL backups and versioned or replicated S3 asset backups.
- Set up monitoring for server errors, failed weather requests, and client-side rendering failures.
- Document the author workflow for adding quotes, countries, markers, and symbol assets.
- Review content licensing and attribution for images, fonts, map data, country boundaries, weather data, and symbol assets before publishing.
- Establish a routine for dependency updates, security updates, data-provider changes, and performance reviews.

**Done when:** the author can maintain the site safely after launch and the project can evolve without rebuilding its foundations.
