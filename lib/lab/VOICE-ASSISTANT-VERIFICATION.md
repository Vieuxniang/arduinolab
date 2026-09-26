# Voice Assistant - Visual Verification Guide

## Verification Checklist ✓

### 1. **Single LAB-AI Button** (Bottom-Right)
- [ ] Only ONE button visible in bottom-right corner
- [ ] Button shows `Sparkles` icon when idle
- [ ] Button shows `Volume2` with spin animation when speaking
- [ ] Button has primary color border glow
- [ ] "LAB-AI" label visible below button

### 2. **Menu Visibility** (Critical)
- [ ] Click button to open menu
- [ ] Menu appears to the LEFT of button (prevents overflow)
- [ ] Menu has bright primary/secondary border (not faded)
- [ ] Menu background is dark (black/95) with good contrast
- [ ] Text is clearly readable (primary color)
- [ ] Menu shows "⚡ LAB-AI VOICE COMMANDS" header

### 3. **Menu Items** (5 commands)
- [ ] ✓ Welcome - "Start intro message"
- [ ] ▶ Mission Start - "New mission begins"  
- [ ] ✦ Success - "Mission completed"
- [ ] Sound status indicator visible
- [ ] Each item highlights on hover with primary/20 background
- [ ] Each item has description text (smaller, faded)

### 4. **Interactive Features**
- [ ] Click any command to trigger voice (if sound enabled)
- [ ] Click button again to close menu
- [ ] Menu closes after selecting command
- [ ] Drag button to reposition (grab cursor on hover)
- [ ] New position saves to localStorage

### 5. **Sound Control**
- [ ] When sound is ON: "🔊 ENABLED" (bold, bright)
- [ ] When sound is OFF: "🔇 DISABLED" (faded)
- [ ] Footer shows "Toggle in Settings"

---

## Layout Details

### Button Position (Fixed)
```
Bottom-right corner at 64px x 64px
Z-index: 40 (above most content)
Draggable with grab cursor
```

### Menu Position (Absolute)
```
Positioned LEFT of button to prevent viewport overflow
Width: 224px (56 units)
Z-index: 50 (above button)
Has backdrop blur and shadow
```

### Styling Priority
```
1. Border: 2px solid primary/70 (bright)
2. Background: black/95 (dark, high contrast)
3. Shadow: primary/40 (colored glow)
4. Hover: primary/20 background + shadow effect
```

---

## Troubleshooting

### Menu Not Visible
1. Check z-index (should be 50)
2. Check position: "absolute" with proper top/left
3. Clear browser cache
4. Check if soundEnabled state is loading

### Text Not Readable
1. Verify primary color token is bright (#00ff41 or similar)
2. Check bg-black/95 opacity
3. Verify border-primary/70 (not too faded)

### Dragging Issues
1. Menu must be closed to drag (if menuOpen, return)
2. Position saved to localStorage under "lab-ai-position"
3. Viewport bounds: maxX = window.innerWidth - 64

---

## Visual Hierarchy

```
HEADER (LAB-AI VOICE COMMANDS)
   ⚡ bright, bold, primary color
   
COMMANDS (3 items)
   ✓ Welcome
   ▶ Mission Start
   ✦ Success
   
   Each has:
   - Title (font-bold)
   - Description (smaller, faded)
   - Hover effect (bright background + shadow)
   
FOOTER (Sound status)
   🔊 ENABLED / 🔇 DISABLED
   "Toggle in Settings"
```

---

## Expected Behavior

| Action | Result |
|--------|--------|
| Click button | Menu opens to the left |
| Menu open + click button | Menu closes |
| Click command | Voice plays, menu closes |
| Sound disabled | All commands greyed out |
| Drag button | Position updates, saves to localStorage |
| Window resize | Button stays within viewport |

---

## No Duplicates ✓

- ✓ AiBot component marked @deprecated
- ✓ AiBot no longer imported in lab-app.tsx
- ✓ VoiceAssistant is the ONLY LAB-AI interface
- ✓ Single z-index hierarchy (40 for button, 50 for menu)
