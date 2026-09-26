export type EnvironmentTheme = 'space' | 'ocean' | 'cyberpunk' | 'forest' | 'laboratory'

export interface EnvironmentConfig {
  theme: EnvironmentTheme
  bgGradient: [string, string]
  accentColor: string
  particleColor: string
  ambientSound: 'void' | 'waves' | 'synth' | 'forest' | 'lab'
  lightingIntensity: number
  vignette: boolean
}

const ENVIRONMENTS: Record<EnvironmentTheme, EnvironmentConfig> = {
  space: {
    theme: 'space',
    bgGradient: ['#0a0e27', '#1a1f3a'],
    accentColor: '#00ffff',
    particleColor: 'rgba(0, 255, 136, 0.8)',
    ambientSound: 'void',
    lightingIntensity: 0.8,
    vignette: true,
  },
  ocean: {
    theme: 'ocean',
    bgGradient: ['#001a33', '#003d66'],
    accentColor: '#00ccff',
    particleColor: 'rgba(0, 200, 255, 0.6)',
    ambientSound: 'waves',
    lightingIntensity: 0.6,
    vignette: false,
  },
  cyberpunk: {
    theme: 'cyberpunk',
    bgGradient: ['#0f0f1e', '#2d1b4e'],
    accentColor: '#ff00ff',
    particleColor: 'rgba(255, 0, 255, 0.7)',
    ambientSound: 'synth',
    lightingIntensity: 1,
    vignette: true,
  },
  forest: {
    theme: 'forest',
    bgGradient: ['#1a3a2a', '#0d2818'],
    accentColor: '#00ff88',
    particleColor: 'rgba(0, 255, 136, 0.5)',
    ambientSound: 'forest',
    lightingIntensity: 0.7,
    vignette: false,
  },
  laboratory: {
    theme: 'laboratory',
    bgGradient: ['#1a1f2e', '#252d3d'],
    accentColor: '#00ff41',
    particleColor: 'rgba(0, 255, 65, 0.8)',
    ambientSound: 'lab',
    lightingIntensity: 0.9,
    vignette: true,
  },
}

export function getEnvironmentForLevel(level: number): EnvironmentTheme {
  const themes: EnvironmentTheme[] = ['space', 'ocean', 'cyberpunk', 'forest', 'laboratory']
  return themes[level % themes.length] ?? 'space'
}

export function getEnvironmentConfig(theme: EnvironmentTheme): EnvironmentConfig {
  return ENVIRONMENTS[theme]
}

export function generateBackgroundCSS(config: EnvironmentConfig): string {
  const [start, end] = config.bgGradient
  let css = `background: linear-gradient(135deg, ${start} 0%, ${end} 100%);`

  if (config.vignette) {
    css += `
      box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.5);
      background-attachment: fixed;
    `
  }

  return css
}
