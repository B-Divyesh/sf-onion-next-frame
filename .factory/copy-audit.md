# Plain-language copy audit

Audit date: 2026-08-29. Scope: every visible landing-page string plus the light table's dynamic status and error messages. Counts treat symbols and hyphenated terms as one word. No line exceeds 22 words. No banned marketing word appears.

## Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Onion Next Frame | 3 | Pass |
| Home | 1 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Ready offline | 2 | Pass |
| Compare animation frames | 3 | Pass |
| Compare the frames before and after | 6 | Pass |
| For pixel artists checking motion between drawings without changing their main editor. | 11 | Pass |
| Try it with sample data | 5 | Pass |
| Loads a 6-frame run cycle. | 5 | Pass |
| Import your frames | 3 | Pass |
| Free to use | 3 | Pass |
| Works offline after the first visit | 6 | Pass |
| Images stay on this device | 5 | Pass |
| Previous / Current / Next | 3 | Pass |
| Frame comparison preview | 3 | Pass |
| Check the in-between drawing | 5 | Pass |
| Import numbered PNG files or one animated GIF. | 8 | Pass |
| File names set the frame order. | 6 | Pass |
| Your onion preview appears here. | 5 | Pass |
| Choose numbered PNG files or an animated GIF. | 8 | Pass |
| Drop PNG or GIF files | 5 | Pass |
| No sequence loaded | 3 | Pass |
| Import frames or load the sample to start. | 8 | Pass |
| Show layer | 2 | Pass |
| Opacity 28% | 2 | Pass |
| Tint | 1 | Pass |
| Use tint | 2 | Pass |
| Import frames | 2 | Pass |
| Export contact sheet | 3 | Pass |
| Import project | 2 | Pass |
| Export project | 2 | Pass |
| Clear sequence | 2 | Pass |
| Keyboard: ← → changes frames. | 5 | Pass |
| Shift jumps to an end. | 5 | Pass |
| How it works | 3 | Pass |
| Compare frames in three steps | 5 | Pass |
| Import the sequence | 3 | Pass |
| Select numbered PNG files or one animated GIF. | 8 | Pass |
| Tune each neighbour | 3 | Pass |
| Set visibility, opacity, and tint for all three layers. | 9 | Pass |
| Export the sheet | 3 | Pass |
| Download one PNG with every source frame in order. | 9 | Pass |
| Limits and privacy | 3 | Pass |
| This is a reviewer, not an editor | 7 | Pass |
| It does not paint, interpolate, host, or sync artwork. | 9 | Pass |
| Your browser decodes the images. | 5 | Pass |
| The app stores your latest real sequence in this browser. | 10 | Pass |
| Demo frames use memory only. | 5 | Pass |
| Read the privacy details | 4 | Pass |
| A local light table for animation frames. | 7 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| v1.0.0 · Generated artwork disclosed in the design notes. | 8 | Pass |

The first screen states the job, names pixel artists, and puts the sample result beside the primary action. It reads aloud in one breath.

## Dynamic messages

| Copy | Words | Result |
| --- | ---: | --- |
| Offline mode | 2 | Pass |
| An updated frame is ready. | 5 | Pass |
| Load update | 2 | Pass |
| Reading frames in this browser… | 5 | Pass |
| No files were selected. | 4 | Pass |
| Choose numbered PNG or GIF files. | 6 | Pass |
| The browser could not draw one frame. | 7 | Pass |
| Canvas drawing is not available. | 5 | Pass |
| The files could not be read. | 6 | Pass |
| The preview works, but this browser could not save the sequence. | 11 | Pass |
| One frame could not be drawn. | 6 | Pass |
| Import the source sequence again. | 5 | Pass |
| Building the contact sheet… | 4 | Pass |
| The contact sheet could not be made. | 7 | Pass |
| Try the export again. | 4 | Pass |
| Exported a project file with six frames. | 7 | Pass |
| Imported a project with six frames. | 6 | Pass |
| This is not an Onion Next Frame project. | 8 | Pass |
| Choose a project exported by this app. | 7 | Pass |
| The project has an unreadable frame. | 6 | Pass |
| Choose another project file or export it again from Onion Next Frame. | 12 | Pass |
| The project has invalid layer settings. | 6 | Pass |
| Choose another project file or export it again from Onion Next Frame. | 12 | Pass |
| The project file is not valid JSON. | 7 | Pass |
| Choose an exported project file. | 5 | Pass |
| This GIF has no readable frames. | 6 | Pass |
| Choose another GIF or export it again from the source editor. | 10 | Pass |
| The sequence was cleared. | 4 | Pass |
| Import frames to start again. | 5 | Pass |
| Saved frames could not be opened. | 6 | Pass |
| You can import the sequence again. | 6 | Pass |
| Restored one saved frame from this browser. | 8 | Pass |

File-specific errors add the failed file name before the audited instruction. Counts remain below the limit for supported names in the shipped fixtures.

## Terminology

| Concept | One term |
| --- | --- |
| One imported drawing | frame |
| Ordered set of drawings | sequence |
| Previous/current/next overlay | layer |
| Combined review canvas | onion preview |
| Downloaded overview PNG | contact sheet |
| Portable saved review | project |
| Seeded isolated experience | demo |
| Browser persistence | saved |

## README corrections

- “Imports naturally sorted PNG sequences and animated GIF frames.” is covered by `sequence-import`.
- “Six original sample frames load immediately.” is covered by `sample-six-frame-demo`.
- The compatibility note is actionable guidance, not a browser-support promise.
- The test command describes the suite without a stale test count.

## Catalog description

“Compare a pixel animation with its previous and next frames.” has 9 words and 60 characters. It starts with a verb.
