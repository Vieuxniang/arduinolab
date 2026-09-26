# LAB-AI Menu Fix - Verification Guide

## Problèmes Corrigés

### 1. Menu Caché par Bottom Nav ✓
**Avant**: `top-16` positionnait le menu trop bas, recouvert par la nav
**Après**: `bottom-20` place le menu 80px au-dessus du bouton LAB-AI, au-dessus de la nav

### 2. Z-Index Insuffisant ✓
- VoiceAssistant: `z-40` → `z-50` (conteneur principal)
- Menu: `z-50` → conservé (suffit maintenant)
- BottomNav: Aucun (héritait du contexte) → `z-10` explicite

### 3. Clics Non Détectés ✓
**Problèmes**:
- Conteneur parent utilisait `onMouseDown` pour drag
- Pas de `stopPropagation()` sur les clics du menu
- Pas de `pointer-events-auto` explicite

**Solutions**:
- `e.stopPropagation()` sur le bouton principal
- `e.stopPropagation()` sur chaque bouton de commande
- `pointer-events-auto` sur le conteneur du menu
- `pointer-events-auto` sur tous les boutons

### 4. Positionnement Horizontal ✓
- Largeur: `w-56` → `w-64` (meilleur espace)
- Position: `-left-48` → `-left-56` (alignement optimal avec le bouton)

## Test Checklist

- [ ] Cliquer sur le bouton LAB-AI (bas-droit)
- [ ] Le menu apparaît à GAUCHE du bouton
- [ ] Le menu ne disparaît PAS sous la barre de navigation
- [ ] Cliquer sur "✓ Welcome" → doit déclencher le son
- [ ] Cliquer sur "▶ Mission Start" → doit déclencher le son
- [ ] Cliquer sur "✦ Success" → doit déclencher le son
- [ ] Le menu se ferme après chaque clic
- [ ] Pouvoir déplacer le bouton (sauf quand le menu est ouvert)
- [ ] Le menu se repositionne correctement après déplacement

## Détails Techniques

### Z-Index Hierarchy
```
VoiceAssistant container: z-50 (highest)
  └─ Menu dropdown: z-50 (inherits, on top)
BottomNav: z-10 (lower, behind)
Content: default (lower)
```

### Event Handling
```
VoiceAssistant div
  ├─ onMouseDown → drag handling (sauf si menuOpen)
  └─ Main button
      ├─ onClick → e.stopPropagation() + toggle menu
      └─ Menu div (if open)
          ├─ onClick → e.stopPropagation() (prevent drag)
          └─ Command buttons
              └─ onClick → e.stopPropagation() + trigger action
```

### Position Calculation
- Défaut: `x: window.innerWidth - 80, y: window.innerHeight - 200`
- Menu offset: `bottom-20` = 80px au-dessus du bouton
- Viewport safety: Clampé entre 0 et maxX/maxY

## Notes Importantes

1. **Déplacement du Bouton**
   - Impossible quand menu ouvert (check au MouseDown)
   - Position sauvegardée en localStorage
   - Rechargée au montage

2. **Menu Visibility**
   - `overflow-visible` permet aux contenus d'être visibles
   - `backdrop-blur-sm` crée un effet de profondeur
   - Shadow `shadow-primary/40` rehausse les couleurs

3. **Mobile Considerations**
   - Drag fonctionne sur mobile (touches)
   - Menu cliquable sur mobile (pointer-events)
   - Pas de hover effects mobiles (pas d'effet visuel)
