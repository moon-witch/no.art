# Stay A While

## Product intention

This is a personal, quote-led website: a place for visitors to pause with a thought and the author's reflection on it.

The root route is a home page. It introduces the author and serves as the calm starting point for the rest of the site. The opening headline is **“stay a while”**. Its subheadline is **“there are things to see / hear / find / read”**, with the final word cycling through those four choices.

The rest of the site is a collection of quotes. Every quote has:

- a small image;
- the quote text and its attribution, for example **“I am Batman” — Batman**;
- a paragraph containing the author's thoughts about it.

## Content model

Treat quotes as structured data, rather than markup embedded in a page. Each record should have a stable identifier, image source, useful image alt text, quote text, attribution, reflection, and placement information for desktop and mobile.

Keep the quote and attribution together in the active presentation. The reflection belongs to the author of this site and should be visually distinct from the quoted material.

Plan content storage and UI boundaries for future additions. The author needs to add, edit, reorder, publish, and remove quote entries, images, reflections, background-symbol assets, visited countries, country notes, and country marker notes without editing source files.

Country records should use a stable geographic identifier rather than a display name as their key. Marker records belong to a country and need stable IDs, geographic coordinates, a note, and any display metadata. Keep public, draft, and unpublished content distinct so unfinished writing cannot appear by accident.

## Authoring access

Provide a visually discreet authoring entry point and login flow so the author can manage site content from within the website. The entry point may be semi-hidden in the visual design, but access control must use real authentication and authorization rather than relying on an obscure URL or hidden interface.

Keep the public experience and authoring interface separate. The editor should prioritize clear, reliable forms and previews over the public site's experimental visual language. Treat uploads, saved drafts, publishing state, validation, and image metadata as first-class concerns when the content system is implemented.

Do not expose credentials, weather-provider keys, or unpublished data to the browser. Record enough metadata to recover from edits, including timestamps and image attribution or licensing information where applicable.

## Navigation and page state

The home page, quote field, and globe are separate destinations with a clear, quiet way to move between them. Preserve a direct URL for each public page and make browser back/forward navigation restore a sensible unselected state unless preserving a selected item is intentionally implemented.

Public pages should not be blocked by missing optional services. If weather data, 3D capability, an image, or a background-symbol asset fails to load, retain the primary content and interaction with a graceful fallback.

## Home page

The home page is a viewport-bound, non-scrollable composition. A large central circle contains the author's introduction. It is the visual anchor of the page and may incorporate the “stay a while” greeting without making the introduction hard to read.

Smaller circles surround the central circle and act as navigation to the site’s subpages, including **Thoughts** and **Earth**. They should read as translucent soap bubbles: soft, luminous, slightly imperfect, and responsive to interaction. Each navigation bubble has a short description directly beneath it so its destination is clear without requiring hover.

Treat every bubble as a real link with keyboard focus, accessible naming, and a generous touch target. The motion of bubbles should follow the established language of constrained randomness and paradox: small, gentle drift and subtle optical change are welcome; constant distracting movement is not. Desktop and mobile must have deliberately composed bubble arrangements.

## Route transitions

Treat the home, Thoughts, and Earth views as parts of one continuous scene. The bubble-navigation layer persists across route changes so bubbles move between meaningful positions instead of disappearing and being recreated.

On entry to the home page, the “stay a while” headline reveals in the center, remains there for roughly one to two seconds, then travels to its resting position at the bottom of the viewport. Keep the movement calm and readable; it should feel like an invitation settling into the composition.

When a visitor selects a navigation bubble:

1. the selected bubble moves to the top-left active position;
2. the outgoing page dissolves downward;
3. the incoming page enters from above while fading in;
4. the selected bubble remains in the top-left position for the duration of that subpage.

When moving directly between subpages, the newly selected bubble takes the top-left active position and the previously active bubble returns to the navigation area. When returning home, every bubble travels back to its assigned home-page position around the central introduction circle.

Coordinate route, bubble, and content transitions as one interruptible sequence. Do not allow rapid navigation to leave duplicate bubbles, stranded content, or conflicting animations. For reduced-motion users, preserve the same route and active-navigation state with brief fades or immediate state changes instead of travel through the screen.

## Thoughts page: core interaction

The Thoughts page does not scroll. At rest, it shows only the collection's small images, spread organically across the viewport.

Selecting an image makes it active:

1. The selected image travels to the center of the viewport.
2. Its quote and accompanying reflection appear.
3. Selecting the active image again returns it to its original position and hides its text.
4. Selecting a different image while one is active transitions directly to the new one: the outgoing and incoming items swap states without resetting the experience.

At any moment there is either one active item or none. Rapid selections should retarget the current transition from each image's current visual position, rather than snapping it back to a saved starting point first.

Make each image operable as a real button. It must be reachable with the keyboard, activate with Enter and Space, expose its selected state, and have a clear focus treatment. Escape should return an active item to the field when that fits the final interaction design.

## Discoverability cues

The image field should quietly communicate that images are interactive. Every few seconds, choose one inactive image and give it a brief, subtle invitation: a slight size lift, a soft background glow, or another restrained visual pulse. Use only one cue at a time, vary the chosen image, and never apply it to the active item.

These cues should be infrequent and short enough to feel like a small living detail, not a notification. Pause them while an item is active or the page is not visible. Do not run them for people who prefer reduced motion; keyboard focus and visible button states still provide the interaction affordance in that case.

## Background symbols

The background contains a separate layer of mystical-symbol assets, supplied later by the author. Do not invent substitute symbols. Symbols should emerge and fade away at semi-random intervals and placements, adding a quiet sense of mystery behind the image field.

Keep every symbol subdued: it must never reach full opacity or compete with the quote images and active text. The layer must sit behind all interactive content, ignore pointer events, and avoid placing a symbol where it compromises the readability of active text. Constrain the random choices so symbols remain sparse, do not visibly overlap in distracting ways, and do not pulse in unison. Pause the layer when the page is hidden and reduce or disable its motion for `prefers-reduced-motion`.

## Globe page

The site will include a second page: an interactive 3D Earth with a holographic, view-from-space aesthetic. Countries are outlined and unfilled by default. Only countries listed as visited are filled; those filled countries are interactive.

Selecting a visited country should:

1. smoothly bring that country closer in the globe view;
2. reveal the author's country note;
3. show any marker dots placed within that country.

Each country can contain multiple marker dots. A marker opens its own associated note when selected. Selecting an empty area outside the globe clears the country and marker selection and returns the globe to its default state.

Use real geographic coordinates for markers and keep them attached to the country as the globe moves. Markers need large enough hit areas for touch input even if their visible dots are small. If multiple markers are close together, provide an intentional way to choose among them rather than letting one block the others.

The globe spins gently while nothing is selected. It should settle or pause during selection so country and marker interaction stays easy and precise. Country borders, fills, markers, labels, and notes must remain clearly selectable above decorative effects.

The globe includes an optional atmospheric weather layer sourced from live weather data. Aim for an impression of weather seen from space—subtle clouds, storms, or atmospheric variation—rather than a literal weather map. The weather visualization should be approximate, visually light, clearly separate from country interaction targets, and degrade gracefully when live data is unavailable.

Use organic, pleasant motion throughout the globe: calm rotation, soft holographic light, and atmospheric movement. Keep rendering and effects lightweight enough that the page stays responsive on mobile and never obstructs selecting a country or marker.

Provide a usable non-WebGL or low-performance fallback: a simplified 2D map or country list must still let visitors read visited-country notes and marker notes. The authoring interface must not depend on the 3D renderer to edit this data.

## Motion direction

Motion should feel alive, gentle, and physical. Avoid abrupt state changes, rigid grid-like movement, or mechanical timing.

The larger animation language should evoke **randomness and paradoxes**. Let the field feel ordered enough to be navigable, yet slightly unpredictable: images can drift aside, invitation cues can appear on different items, and timings can vary within restrained bounds. Pair opposing qualities on purpose—stillness with motion, chaos with structure, subtle disturbance with calm resolution. Randomness should be seeded or constrained so the experience remains intentional, stable, and accessible rather than erratic.

When an image moves to the center, it should appear to pass through the field of other images. Images along its route should shift subtly aside to make space, then settle back once it has passed. Apply the same spatial awareness when an active image returns to its resting position. Use soft easing, small overlaps in timing, and restrained secondary movement rather than exaggerated effects.

Text should enter and leave with the same considered feel. Preserve `prefers-reduced-motion` support for every animated interaction.

Favor transform and opacity animations so surrounding elements do not reflow while items move. Update image positions on viewport resize and orientation changes. Avoid permanently running decorative animations that consume attention or battery.

For reduced motion, preserve the same content and selected state while replacing travel through the image field with an immediate or brief fade transition.

## Multidimensional paradox choreography

Use motion to suggest that the site contains several overlapping planes of reality. The effect should come from depth, timing, and relationships between elements—not from constant spectacle. Each interaction has one clear primary motion and, at most, one quiet secondary response.

Randomness must be bounded and repeatable within a visit. Generate a scene seed when a visitor arrives, then derive small variations in drift, timing, paths, and glow from that seed. Keep all resting positions, interaction targets, and readable-content areas deterministic. Do not use unbounded randomness, which makes the site feel broken rather than mysterious.

### Home headline

The initial text reveal should feel as though it is resolving from several possible states: letters can arrive with slightly varied blur, depth, and vertical offsets, then settle into one crisp phrase. After its one-to-two-second hold, the phrase should take a gently curved route to the bottom rather than a purely vertical slide. A faint delayed afterimage may remain momentarily in the center, then dissolve, suggesting that the headline exists in two places for a brief instant.

### Navigation bubbles

Soap-bubble links should use subtle refraction, a faint edge highlight, and barely perceptible depth drift. Their movement should not be a repeated bobbing loop. Instead, give each bubble a slow, irregular breathing cycle with a different phase and small seeded variation.

When one bubble is selected, nearby bubbles should react as if the selected bubble has changed the local physics: a soft repulsion, delayed sway, or slight change in apparent depth. The selected bubble can leave a fading positional echo as it moves toward the top-left, while the real bubble remains the only interactive element. On a subpage switch, the old and new active bubbles should briefly cross on different visual depth planes so the handoff feels like a paradoxical exchange rather than a simple swap.

### Route changes

Retain the downward dissolve for outgoing content and the top-down fade for incoming content, but give them complementary behavior. The outgoing page can lose cohesion as it descends: slight blur, reduced scale, and a short stagger between its visual layers. The incoming page should condense from a softly blurred, higher plane into focus. Keep the overlap brief so visitors always know which page is current.

Use the bubble movement as the route transition's visual anchor. Page content should respond to that movement, never compete with it. Avoid full-screen flashes, rotating page transitions, or effects that make the destination difficult to identify.

### Thoughts field

At rest, quote images can have small, seeded depth differences through scale, softness, and occasional low-amplitude drift. Their field should feel like a constellation with shifting relationships rather than random scattered cards.

An active image should follow a curved, non-linear path to the center. Images near its path yield with a delayed wave, while more distant images make a smaller counter-movement, creating a local distortion in the field. When the active image returns, reverse the relationship without replaying the exact path mechanically: it should feel familiar but not identical. The quote panel can appear as a second plane that resolves alongside the image, with the attribution arriving a fraction after the quote and the reflection last.

### Discovery cues and symbols

The periodic invitation cue should resemble a small anomaly: a brief refraction shift, halo, or change in depth rather than a conventional button pulse. It should occur rarely and never while another major transition is happening.

Background symbols can behave like fleeting traces from another plane. Let them fade in at partial opacity, drift or rotate by only a few degrees, then dissolve before they become the focus. Vary their duration and placement with the scene seed while keeping them out of interactive and reading areas.

### Globe, countries, markers, and weather

The globe is the site’s clearest literal depth object, but its holographic treatment should still feel restrained. At idle, use a calm rotation with faint changes in atmospheric depth rather than a constant showy glow.

When a country is selected, the camera should approach on a gentle orbital arc instead of a direct zoom. The selected country can fill as though a signal travels across its boundary, while its note resolves from a nearby depth plane. Marker dots should appear as quiet points of light that become more precise as the camera settles.

The weather layer should move on a slower, separate plane from the globe surface. Clouds and atmospheric traces may drift independently, giving a view through several layers of space, but they must never hide borders, markers, or country hit areas.

### Motion limits

- Reserve the strongest movement for a visitor-initiated selection or route change.
- Do not run more than one decorative anomaly while a primary transition is active.
- Keep visual echoes non-interactive and short-lived.
- Use transform, opacity, filter, and carefully bounded scale changes; never move layout boxes during a transition.
- Test motion at low frame rates. If an effect reads as noise when frames drop, simplify it.

## Responsive design

Design desktop and mobile intentionally as distinct compositions; do not treat mobile as a scaled-down desktop view.

- Desktop can use a broad, scattered field of images with generous negative space.
- Mobile should keep images easy to select, preserve readable quote and reflection layouts, and adapt the image field to a narrow viewport without relying on hover.
- Keep the experience viewport-bound and non-scrollable unless a later design decision explicitly changes that requirement.
- Give every image a deliberate resting position at each breakpoint. Do not rely on random placement that changes on every render.
- Keep active quote text within a readable measure and clear of the image controls on small screens.

## Code organization

Keep the project organized around reusable visual components with focused responsibilities. Separate:

- quote data and content;
- the image field and its positioning rules;
- individual quote-image items and their active/inactive states;
- the active quote and reflection presentation;
- shared animation primitives, including text reveals;
- responsive layout composition;
- authoring, authentication, and content-management flows;
- globe data, country selection, country notes, marker notes, and weather visualization.

Prefer components and data-driven rendering over one-off page-specific implementations. Keep animation state explicit, so image transitions, content changes, and reduced-motion behavior remain predictable and testable.

Use one source of truth for the active quote identifier. Components should receive state and callbacks through clear props and events instead of independently deciding which quote is active.

Keep layout values, motion timings, and easing curves centralized as shared design tokens where they are reused. This makes desktop and mobile behavior easier to tune as a coherent system.

Keep globe rendering isolated behind a small, data-driven interface. Public components should receive visited-country state, country notes, marker notes, and weather display data without being coupled to a particular 3D or weather provider. This leaves room to change the rendering technology or data source later.

## Quality guardrails

Before shipping a visual change, check the public pages at mobile and desktop sizes, with keyboard navigation, with `prefers-reduced-motion`, and with delayed or unavailable network resources. Test the active-image swap, active-image dismissal, country selection, marker selection, and outside-click reset as distinct interactions.

Treat interaction clarity as more important than decorative fidelity. A visual layer may be reduced, paused, or removed when it makes content harder to read, controls harder to reach, or animation less smooth.
