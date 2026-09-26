# LAB-AI System - Documentation Complète

## 🤖 Vue d'ensemble

Le système **LAB-AI** d'ArduinoLab propose une assistance vocale intelligente guidant les utilisateurs à travers les missions de programmation Arduino. Le système se compose de 3 éléments principaux.

---

## 📦 Architecture

### 1. **Voice AI Core** (`lib/lab/voice-ai.ts`)
- Moteur de synthèse vocale Web Speech API
- 8 messages pré-enregistrés en anglais
- Classe `LabAI` singleton
- Méthode principale: `speak(key, rate)`

```typescript
labAI.speak('mission_start')   // Lance une mission
labAI.speak('success')          // Mission réussie
labAI.speak('block_added')      // Bloc ajouté
labAI.speak('executing')        // Code en exécution
labAI.speak('error')            // Erreur de code
labAI.speak('combo')            // Combo activé
labAI.speak('time_attack')      // Mode temps
labAI.speak('welcome')          // Bienvenue
```

### 2. **Voice Assistant** (`components/lab/voice-assistant.tsx`) ⭐ PRINCIPAL
**Bouton déplaçable interactif** - Le cœur du système

**Caractéristiques:**
- ✅ **Déplaçable par drag & drop** (sauvegardé en localStorage)
- ✅ **Menu déroulant** avec 3 commandes rapides
- ✅ **Position mémorisée** entre les sessions
- ✅ **Indicateur visuel** pulsant quand actif
- ✅ **Responsif** - reste dans la fenêtre

**Utilisation:**
```tsx
import { VoiceAssistant } from "@/components/lab/voice-assistant"

// Dans lab-app.tsx:
<VoiceAssistant />  // Positionné en bas à droite
```

**Contrôles:**
- Clic pour ouvrir le menu
- Drag pour déplacer
- Menu: 3 boutons de test (Welcome, Mission Start, Success)

### 3. **AI Bot Popup** (`components/lab/ai-bot.tsx`)
**Assistant chatbot interactif** - Interface secondaire

**Caractéristiques:**
- Position configurable (bottom-right, bottom-left, etc.)
- Menu bulle chat
- 5 commandes vocales
- État parlant avec animation

**Utilisation:**
```tsx
import { AiBot } from "@/components/lab/ai-bot"

// Dans lab-app.tsx:
<AiBot position="bottom-left" />
```

---

## 🔧 Intégrations dans les Missions

### Mission Runner (`components/lab/views/mission-runner.tsx`)
**3 points d'intégration IA:**

1. **Au démarrage de la mission** (useEffect)
```typescript
useEffect(() => {
  if (soundEnabled && labAI && !done) {
    setTimeout(() => labAI.speak("mission_start"), 500)
  }
}, [done, soundEnabled])
```

2. **Quand un bloc est ajouté**
```typescript
const onAddBlock = (block: BlockType) => {
  setSequence([...sequence, block])
  if (soundEnabled && labAI) {
    setTimeout(() => labAI.speak("block_added"), 100)
  }
}
```

3. **À l'exécution du code**
```typescript
const runAll = () => {
  if (soundEnabled && labAI) {
    labAI.speak("executing")
  }
  // ... reste du code
}
```

### Store Integration (`lib/lab/store.tsx`)
**Quand une mission est complétée:**
```typescript
const completeMission = useCallback((id: number) => {
  setState((s) => {
    // ...
    if (soundEnabled && labAI) {
      setTimeout(() => labAI.speak("success"), 300)
    }
    // ...
  })
}, [soundEnabled])
```

---

## 🎨 UI/UX Design

### VoiceAssistant (Principal)
```
┌─────────────────────┐
│  [✨ PULSE]         │  ← Bouton déplaçable
│   LAB-AI            │
│                     │
│  Menu ouvert ▼      │
├─────────────────────┤
│ ✓ Welcome          │
│ ▶ Mission Start    │
│ ✦ Success          │
│ 🔊 Sound On        │
└─────────────────────┘
```

**Couleurs & Animations:**
- Couleur primaire: `var(--primary)` (#00ff41 terminal green)
- Animation: `neon-pulse` quand en parlant
- Border: 2px, arrondi complet
- Z-index: 40 (juste en dessous des overlays)

### AiBot (Secondaire)
```
┌──────────────────────────┐
│ ✨ LAB-AI Assistant      │
│ Guide d'ArduinoLab...    │
├──────────────────────────┤
│ ➜ Welcome              │
│ ➜ Start Mission        │
│ ➜ Success!             │
│ ➜ Error Help           │
│ ➜ Combo!               │
├──────────────────────────┤
│ 🔊 Sound enabled        │
└──────────────────────────┘
```

---

## ⚙️ Configuration

### Paramètres (Settings Sheet)
```tsx
// Dans settings-sheet.tsx:
- Toggle Sound (ON/OFF)
- Visual indicator: 🔊/🔇
- Status: "Sound enabled" / "Sound disabled in settings"
```

### Positions Personnalisables

**VoiceAssistant** - Position fixe (bas à droite, déplaçable)
```typescript
position: {
  left: `${position.x}px`,
  top: `${position.y}px`
}
```

**AiBot** - Position configurable
```typescript
position="bottom-right"  // Défaut
position="bottom-left"   // Actuel
position="top-right"
position="top-left"
```

### Stockage (localStorage)

```typescript
// VoiceAssistant position
localStorage.getItem("lab-ai-position")
localStorage.setItem("lab-ai-position", JSON.stringify({ x, y }))

// État global
soundEnabled (via useLab context)
```

---

## 🎯 Cas d'usage

### Flux Utilisateur Complet

1. **L'app démarre**
   - VoiceAssistant apparaît bas-droit (déplaçable)
   - AiBot prêt bas-gauche

2. **Utilisateur clique sur une mission**
   - `mission_start` joue (si son activé)
   - Interface MissionRunner s'ouvre

3. **Utilisateur ajoute des blocs**
   - Pour chaque bloc: `block_added` joue

4. **Utilisateur exécute le code**
   - `executing` joue
   - Simulation s'execute

5. **Mission complétée**
   - `success` joue
   - XP + LAB gagnés
   - Progression mise à jour

### Interaction LAB-AI

1. **Menu VoiceAssistant**
   - Clic sur bouton → menu déroulant
   - Sélection commande → audio jouée
   - Drag pour déplacer

2. **Menu AiBot Popup**
   - Clic sur bouton → bulle chat
   - 5 commandes disponibles
   - Ferme après sélection

3. **Settings**
   - Toggle son on/off
   - Affiche état courant

---

## 🔌 Extension Future

### Points d'accès pour intégration IA avancée

```typescript
// Ajouter plus de messages vocaux
export class LabAI {
  private responses = {
    // Existants...
    custom_message: "Your custom message"
  }
}

// Ajouter commandes contextuelles
labAI.speak('hint_for_' + missionType)
labAI.speak('celebrate_' + level)

// Intégrer API TTS externe
import { synthesizeSpeech } from 'external-tts-api'
```

---

## 📊 État Actuel

✅ **Activé et fonctionnel:**
- Voice Assistant déplaçable
- Menu interactif avec 3 tests
- AI Bot popup
- Intégration mission runner (start, block_added, executing)
- Intégration store (success)
- Settings toggle son
- Toutes les animations

⏳ **À faire (optionnel):**
- Reconnaissance vocale (Speech Recognition API)
- Messages dynamiques par difficulté
- Intégration avec métaverse
- Réponses multi-langues (actuellement EN)
- Analyitque utilisation IA

---

## 🐛 Debugging

### Vérifier l'état LAB-AI

```typescript
// En console:
labAI.isActive()  // true si en train de parler
labAI.speak('welcome')  // Tester un message
```

### Son non activé?

```typescript
// Vérifier:
1. soundEnabled dans settings
2. Browser autorise Web Speech API
3. Pas de console error
4. Volume système non mute
```

### Position VoiceAssistant non sauvegardée?

```typescript
// Nettoyer localStorage:
localStorage.removeItem("lab-ai-position")
// Recharger la page
```

---

## 📝 Notes

- **Langue:** Messages IA en anglais (Web Speech API limitation)
- **Navigateurs:** Chrome/Edge/Safari (Web Speech API support)
- **Performance:** Léger (synthèse vocale asynchrone)
- **Accessibilité:** Audio captions possibles via sous-titres (future)

---

Generated: ArduinoLab LAB-AI System v1.0
