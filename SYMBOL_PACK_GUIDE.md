# PNG Symbol Pack Guide

## Current Implementation
The game currently uses emoji symbols:
- 🍎 Apple (Low Value)
- 🍊 Orange (Low Value)
- 🍇 Grapes (Medium Value)
- 🍓 Strawberry (Medium Value)
- 💎 Diamond (High Value - Scatter)
- 👑 Crown (Highest Value - Wild)

## To Replace with PNG Symbols

### Step 1: Create Symbol Images
Create 6 PNG images (200x200px recommended):
- apple.png
- orange.png
- grapes.png
- strawberry.png
- diamond.png (for Scatter)
- crown.png (for Wild)

### Step 2: Place in Assets Folder
```
DS-Slot-Gam7/
├── assets/
│   ├── symbols/
│   │   ├── apple.png
│   │   ├── orange.png
│   │   ├── grapes.png
│   │   ├── strawberry.png
│   │   ├── diamond.png
│   │   └── crown.png
│   └── sounds/
│       ├── spin.mp3
│       ├── win.mp3
│       ├── jackpot.mp3
│       └── click.mp3
```

### Step 3: Update HTML to Use Images

Replace emoji symbols in `index.html`:

Before:
```html
<div class="symbol">🍎</div>
<div class="symbol">🍊</div>
```

After:
```html
<div class="symbol"><img src="assets/symbols/apple.png" alt="Apple"></div>
<div class="symbol"><img src="assets/symbols/orange.png" alt="Orange"></div>
```

### Step 4: Update JavaScript Configuration

Modify `js/app.js`:

Before:
```javascript
SYMBOLS: ['🍎', '🍊', '🍇', '🍓', '💎', '👑'],
SYMBOL_VALUES: {
    '🍎': 10,
    '🍊': 20,
    // ...
}
```

After:
```javascript
SYMBOLS: ['apple', 'orange', 'grapes', 'strawberry', 'diamond', 'crown'],
SYMBOL_IMAGES: {
    'apple': 'assets/symbols/apple.png',
    'orange': 'assets/symbols/orange.png',
    'grapes': 'assets/symbols/grapes.png',
    'strawberry': 'assets/symbols/strawberry.png',
    'diamond': 'assets/symbols/diamond.png',
    'crown': 'assets/symbols/crown.png'
},
SYMBOL_VALUES: {
    'apple': 10,
    'orange': 20,
    'grapes': 50,
    'strawberry': 100,
    'diamond': 300,
    'crown': 500
}
```

### Step 5: Update CSS for Images

Add to `css/style.css`:

```css
.symbol img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}
```

## Online Symbol Pack Resources

### Free Slot Machine Symbol Packs:
1. **OpenGameArt.org** - Free game assets
   - https://opengameart.org/

2. **Itch.io** - Game development assets
   - https://itch.io/game-assets/free

3. **Freepik** - Vector graphics
   - https://www.freepik.com/

4. **Pexels/Pixabay** - Free images
   - https://www.pexels.com/

### Design Your Own:
- **Canva** - Easy drag-and-drop design
- **GIMP** - Free image editor
- **Figma** - Professional design tool

## Symbol Specifications

For best performance:
- **Format:** PNG with transparency
- **Size:** 200x200 pixels (reel symbols)
- **DPI:** 72 DPI
- **Color Space:** RGB
- **Background:** Transparent
- **File Size:** < 50KB per symbol

## Testing

To test PNG symbols:
1. Create simple colored squares (red, blue, green, yellow, purple, orange)
2. Name them accordingly
3. Place in assets/symbols folder
4. Update the configuration as shown above
5. The game will work the same way

## Next Steps

After implementing PNG symbols:
1. Add sound effects
2. Integrate Firebase
3. Create Admin Panel
4. Deploy to production