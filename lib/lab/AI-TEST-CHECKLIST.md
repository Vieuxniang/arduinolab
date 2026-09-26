# LAB-AI Test Checklist

## 🧪 Points de vérification

### 1. Voice Assistant (Déplaçable)
- [ ] Bouton ✨ visible bas-droit
- [ ] Peut être dragué n'importe où
- [ ] Position sauvegardée après rechargement
- [ ] Menu s'ouvre au clic
- [ ] 3 boutons de test: Welcome, Mission Start, Success
- [ ] Label "LAB-AI" sous le bouton
- [ ] Animation pulse quand parlant
- [ ] Son mute si désactivé dans settings

### 2. AI Bot (Popup)
- [ ] Bouton ✨ visible bas-gauche
- [ ] Menu bulle chat s'ouvre au clic
- [ ] Titre "LAB-AI Assistant"
- [ ] 5 commandes (Welcome, Start Mission, Success, Error, Combo)
- [ ] Indicateur son 🔊/🔇
- [ ] Ferme après sélection commande

### 3. Settings Panel
- [ ] Section "LAB-AI Control Panel" visible
- [ ] Toggle son on/off
- [ ] Icône 🔊 quand on, 🔇 quand off
- [ ] Texte "Sound enabled/disabled"
- [ ] Click toggle change état

### 4. Mission Runner Integration
- [ ] Au lancer mission: "mission_start" joue
- [ ] À l'ajout de bloc: "block_added" joue
- [ ] À l'exécution: "executing" joue
- [ ] À la réussite: "success" joue
- [ ] Tous les sons respectent le toggle

### 5. Voice Quality
- [ ] Audio audible et clair
- [ ] Vitesse appropriée (rate ~0.9)
- [ ] Pitch correct (0.8)
- [ ] Messages en anglais

---

## 🎬 Scénario de Test Complet

### Étape 1: UI Placement
```
1. Ouvrir l'app
2. Voir VoiceAssistant bas-droit ✓
3. Voir AiBot bas-gauche ✓
4. Drag VoiceAssistant vers haut-gauche ✓
5. Recharger page ✓
6. VoiceAssistant doit rester haut-gauche ✓
```

### Étape 2: Menu Testing
```
1. Clic sur VoiceAssistant
2. Menu déroulant s'ouvre ✓
3. Clic "Welcome" → son joue ✓
4. Clic "Mission Start" → son joue ✓
5. Clic "Success" → son joue ✓
6. Ferme menu ✓
```

### Étape 3: AiBot Testing
```
1. Clic sur AiBot
2. Bulle chat s'ouvre ✓
3. Clic "Start Mission" → son joue ✓
4. Menu se ferme ✓
```

### Étape 4: Settings
```
1. Clic settings en haut à gauche
2. Voir "LAB-AI Control Panel" ✓
3. Toggle son OFF ✓
4. Clic VoiceAssistant → pas de son ✓
5. Toggle SON ON ✓
6. Clic VoiceAssistant → son joue ✓
```

### Étape 5: Mission Flow
```
1. Home view
2. Clic mission (niveau DÉBUTANT)
3. "mission_start" joue ✓
4. Ajouter bloc (LED ON) ✓
5. "block_added" joue ✓
6. Clic "Exécuter" ✓
7. "executing" joue ✓
8. Clic "Valider" ✓
9. "success" joue + reward ✓
```

---

## 🔍 Debug Console

```javascript
// Tester directement
labAI.speak('welcome')
labAI.isActive()

// Vérifier localStorage
localStorage.getItem('lab-ai-position')
localStorage.getItem('arduinolab.state.v1')

// Vérifier Web Speech API support
'speechSynthesis' in window  // true = supported
```

---

## ⚠️ Problèmes Courants

| Problème | Solution |
|----------|----------|
| Son ne joue pas | Vérifier settings (🔊 on), volume système |
| Position non sauvegardée | Clear localStorage, recharger |
| Menu pas de clic | Vérifier z-index (40), pas d'overlay |
| Son coupé dans mission | Vérifier soundEnabled dans store |
| Pas de "mission_start" | Vérifier useEffect dans mission-runner |

---

## 📊 Logs Attendus

```
[v0] Voice command: RUN
[v0] Block added: led_on
[v0] Executing code...
[v0] Mission completed!
```

---

## ✅ Validation Finale

- [ ] Tous les sons jouent correctement
- [ ] VoiceAssistant déplaçable et persistant
- [ ] AiBot accessible et fonctionnel
- [ ] Settings contrôle le son
- [ ] Missions déclenchent les sons
- [ ] Pas de console error
- [ ] Pas de z-index conflict
- [ ] Performance acceptable

**Status:** Ready to Deploy ✓
