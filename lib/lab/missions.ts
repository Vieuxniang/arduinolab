export type MissionLevel = "beginner" | "intermediate" | "expert"

export type SimType = "led" | "sensor" | "motor" | "lcd" | "iot"

export interface Mission {
  id: number
  level: MissionLevel
  sim: SimType
  cost: number
  xp: number
  // translation keys for name + objective per language
  name: { fr: string; en: string; es: string }
  objective: { fr: string; en: string; es: string }
}

export const BADGE_BY_LEVEL: Record<MissionLevel, string> = {
  beginner: "badge_beg",
  intermediate: "badge_int",
  expert: "badge_adv",
}

export const LEVEL_LABEL_KEY: Record<MissionLevel, string> = {
  beginner: "lvl_beginner",
  intermediate: "lvl_intermediate",
  expert: "lvl_expert",
}

export const LEVEL_ORDER: MissionLevel[] = ["beginner", "intermediate", "expert"]

function makeMissions(): Mission[] {
  const data: {
    level: MissionLevel
    // Simulator used by each mission, in the same order as `titles`.
    sims: SimType[]
    titles: [string, string, string][]
  }[] = [
    {
      level: "beginner",
      sims: [
        "led", "led", "led", "sensor", "sensor",
        "sensor", "lcd", "lcd", "motor", "motor",
        "led", "led", "sensor", "sensor", "iot",
      ],
      titles: [
        ["LED clignotante", "Blinking LED", "LED parpadeante"],
        ["Allumer une LED", "Turn on a LED", "Encender un LED"],
        ["Double LED", "Dual LED", "LED doble"],
        ["Lecture température", "Read temperature", "Leer temperatura"],
        ["Capteur de lumière", "Light sensor", "Sensor de luz"],
        ["Détecteur de mouvement", "Motion detector", "Detector de movimiento"],
        ["Texte sur LCD", "Text on LCD", "Texto en LCD"],
        ["Compteur LCD", "LCD counter", "Contador LCD"],
        ["Moteur simple", "Simple motor", "Motor simple"],
        ["Vitesse moteur", "Motor speed", "Velocidad motor"],
        ["LED + bouton", "LED + button", "LED + botón"],
        ["Feu tricolore", "Traffic light", "Semáforo"],
        ["Thermomètre", "Thermometer", "Termómetro"],
        ["Veilleuse auto", "Auto nightlight", "Luz nocturna auto"],
        ["Mini dashboard", "Mini dashboard", "Mini panel"],
      ],
    },
    {
      level: "intermediate",
      sims: [
        "led", "sensor", "motor", "lcd", "iot",
        "led", "motor", "sensor", "sensor", "motor",
        "lcd", "sensor", "lcd", "sensor", "iot",
      ],
      titles: [
        ["PWM gradation LED", "LED PWM dimming", "Atenuación PWM LED"],
        ["Capteur seuil alarme", "Threshold alarm", "Alarma por umbral"],
        ["Moteur progressif", "Ramp motor", "Motor progresivo"],
        ["LCD défilant", "Scrolling LCD", "LCD desplazante"],
        ["Station météo", "Weather station", "Estación meteo"],
        ["LED RGB", "RGB LED", "LED RGB"],
        ["Servo angle", "Servo angle", "Ángulo servo"],
        ["Logger capteur", "Sensor logger", "Registro sensor"],
        ["Détection nuit", "Night detection", "Detección noche"],
        ["Contrôle vitesse", "Speed control", "Control velocidad"],
        ["Affichage temp+lum", "Temp+light display", "Pantalla temp+luz"],
        ["Alarme mouvement", "Motion alarm", "Alarma movimiento"],
        ["Barre de progression", "Progress bar", "Barra de progreso"],
        ["Multi-capteurs", "Multi-sensor", "Multi-sensor"],
        ["Dashboard IoT", "IoT dashboard", "Panel IoT"],
      ],
    },
    {
      level: "expert",
      sims: [
        "motor", "iot", "motor", "lcd", "iot",
        "led", "sensor", "motor", "iot", "sensor",
        "iot", "iot", "iot", "motor", "iot",
      ],
      titles: [
        ["Régulation PID", "PID control", "Control PID"],
        ["Réseau de capteurs", "Sensor network", "Red de sensores"],
        ["Moteur asservi", "Closed-loop motor", "Motor en lazo"],
        ["Interface LCD avancée", "Advanced LCD UI", "UI LCD avanzada"],
        ["Hub IoT complet", "Full IoT hub", "Hub IoT completo"],
        ["Machine à états", "State machine", "Máquina de estados"],
        ["Calibration capteur", "Sensor calibration", "Calibración sensor"],
        ["Contrôle multi-moteur", "Multi-motor control", "Control multimotor"],
        ["Télémétrie temps réel", "Realtime telemetry", "Telemetría tiempo real"],
        ["Système d'alerte", "Alert system", "Sistema de alertas"],
        ["Tableau de bord pro", "Pro dashboard", "Panel pro"],
        ["Automatisation maison", "Home automation", "Automatización hogar"],
        ["Optimisation énergie", "Energy optimization", "Optimización energía"],
        ["Robot suiveur", "Line follower", "Seguidor de línea"],
        ["Projet final", "Final project", "Proyecto final"],
      ],
    },
  ]

  const objectivesByLevel: Record<MissionLevel, [string, string, string]> = {
    beginner: [
      "Maîtrise les bases du circuit",
      "Master the circuit basics",
      "Domina lo básico del circuito",
    ],
    intermediate: [
      "Combine plusieurs composants",
      "Combine several components",
      "Combina varios componentes",
    ],
    expert: [
      "Construis un système complet",
      "Build a complete system",
      "Construye un sistema completo",
    ],
  }

  const result: Mission[] = []
  let id = 1
  data.forEach((group, gi) => {
    const baseCost = gi === 0 ? 10 : gi === 1 ? 25 : 50
    const baseXp = gi === 0 ? 50 : gi === 1 ? 120 : 250
    group.titles.forEach((t, i) => {
      const obj = objectivesByLevel[group.level]
      result.push({
        id,
        level: group.level,
        sim: group.sims[i] ?? "led",
        cost: baseCost + i * (gi === 0 ? 2 : gi === 1 ? 5 : 10),
        xp: baseXp + i * (gi === 0 ? 10 : gi === 1 ? 20 : 40),
        name: { fr: t[0], en: t[1], es: t[2] },
        objective: { fr: obj[0], en: obj[1], es: obj[2] },
      })
      id++
    })
  })
  return result
}

export const MISSIONS: Mission[] = makeMissions()

export interface GalleryItem {
  id: string
  title: string
  author: string
  level: MissionLevel
  sim: SimType
  tips: number
  code: string
}

export const GALLERY: GalleryItem[] = [
  {
    id: "g1",
    title: "Smart Blink Pattern",
    author: "neo_maker",
    level: "beginner",
    sim: "led",
    tips: 42,
    code: 'void setup(){pinMode(13,OUTPUT);}\nvoid loop(){digitalWrite(13,HIGH);delay(200);digitalWrite(13,LOW);delay(200);}',
  },
  {
    id: "g2",
    title: "Temp Guardian",
    author: "ada_dev",
    level: "intermediate",
    sim: "sensor",
    tips: 88,
    code: 'int t=analogRead(A0);\nif(t>700){digitalWrite(8,HIGH);}else{digitalWrite(8,LOW);}',
  },
  {
    id: "g3",
    title: "Servo Sweep Pro",
    author: "circuit_witch",
    level: "intermediate",
    sim: "motor",
    tips: 65,
    code: 'for(int a=0;a<180;a++){servo.write(a);delay(15);}',
  },
  {
    id: "g4",
    title: "OLED Clock",
    author: "byte_runner",
    level: "expert",
    sim: "lcd",
    tips: 120,
    code: 'lcd.setCursor(0,0);\nlcd.print("12:45 PM");\nlcd.setCursor(0,1);\nlcd.print("ArduinoLab");',
  },
  {
    id: "g5",
    title: "Home IoT Hub",
    author: "spark_lord",
    level: "expert",
    sim: "iot",
    tips: 210,
    code: 'publish("temp", readTemp());\npublish("led", ledState);\npublish("motor", motorSpeed);',
  },
  {
    id: "g6",
    title: "Night Light Auto",
    author: "lumi_x",
    level: "beginner",
    sim: "sensor",
    tips: 30,
    code: 'int l=analogRead(A1);\nif(l<300)digitalWrite(9,HIGH);else digitalWrite(9,LOW);',
  },
]
