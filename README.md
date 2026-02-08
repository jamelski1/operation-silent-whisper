# OPERATION SILENT FREQUENCY

Interactive presentation website for a fictional threat actor scenario — National Defense University academic exercise.

## Quick Start

Open `index.html` in any modern browser. No server required.

## Navigation

- **Arrow keys** (Left/Right or Up/Down) to navigate between sections
- **Space / PageDown** to advance, **PageUp** to go back
- **Mouse wheel** to scroll between sections
- **Click** right side of screen to advance, left side to go back
- **Swipe** on touch devices
- **Nav dots** on right edge for direct section access
- **Home / End** keys jump to first/last section

## Adding Photos

Place your images in the `/images/` folder, then edit `index.html`:

### Character Photos

For each operative, find the corresponding `<div class="photo-frame" id="...">` and replace the placeholder div with an `<img>` tag:

| Character | Element ID | Image Path |
|-----------|-----------|------------|
| Nolan Barco | `#nolan-photo` | `images/nolan.jpg` |
| Jamel Lawson | `#jamel-photo` | `images/jamel.jpg` |
| Rachael Shima | `#rachael-photo` | `images/rachael.jpg` |
| LTG Caldwell | `#caldwell-photo` | `images/caldwell.jpg` |
| Whisper II | `#weapon-schematic` | `images/whisper2.jpg` |

**Example** — Replace this:

```html
<div class="photo-placeholder">
  <span class="photo-placeholder__label">PHOTO<br>CLASSIFIED</span>
</div>
```

With this:

```html
<img src="images/nolan.jpg" alt="Nolan Barco">
```

Photos are automatically styled to grayscale with high contrast. Recommended size: 400x520px (portrait orientation).

## File Structure

```
/operation-silent-frequency/
  index.html      — Main presentation
  styles.css      — All styling
  script.js       — Navigation controller
  /images/        — Place photos here
  README.md       — This file
```

## Notes

- Optimized for 16:9 laptop/projector display
- Mobile responsive
- Black and white only — images are auto-converted to grayscale via CSS
- All content is fictional, created for educational purposes
