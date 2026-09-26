export type XRCapability = 'ar' | 'vr' | 'webxr' | 'none'

export interface XRDeviceInfo {
  capability: XRCapability
  hasARKit: boolean
  hasARCore: boolean
  hasWebXR: boolean
  isVRHeadsetConnected: boolean
  deviceName: string
}

export class XRDetector {
  private deviceInfo: XRDeviceInfo = {
    capability: 'none',
    hasARKit: false,
    hasARCore: false,
    hasWebXR: false,
    isVRHeadsetConnected: false,
    deviceName: 'standard',
  }

  constructor() {
    this.detectCapabilities()
    this.monitorXRSessions()
  }

  private detectCapabilities() {
    // Check WebXR support
    if (navigator.xr) {
      this.deviceInfo.hasWebXR = true

      navigator.xr?.isSessionSupported('immersive-ar').then((supported) => {
        if (supported) {
          this.deviceInfo.capability = 'ar'
        }
      })

      navigator.xr?.isSessionSupported('immersive-vr').then((supported) => {
        if (supported) {
          this.deviceInfo.capability = 'vr'
        }
      })
    }

    // Check for ARKit (iOS)
    if (this.isIOS() && 'ontouchstart' in window) {
      this.deviceInfo.hasARKit = true
      this.deviceInfo.capability = 'ar'
      this.deviceInfo.deviceName = 'iOS'
    }

    // Check for ARCore (Android)
    if (this.isAndroid()) {
      this.deviceInfo.hasARCore = true
      this.deviceInfo.capability = 'ar'
      this.deviceInfo.deviceName = 'Android'
    }

    // Check for VR headset
    this.detectVRHeadset()
  }

  private isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  }

  private isAndroid(): boolean {
    return /Android/.test(navigator.userAgent)
  }

  private detectVRHeadset() {
    // Check for Gamepad API (VR controllers)
    window.addEventListener('gamepadconnected', () => {
      this.deviceInfo.isVRHeadsetConnected = true
      this.deviceInfo.capability = 'vr'
    })

    window.addEventListener('gamepaddisconnected', () => {
      this.deviceInfo.isVRHeadsetConnected = false
    })
  }

  private monitorXRSessions() {
    setInterval(() => {
      if (this.deviceInfo.hasWebXR) {
        navigator.xr?.isSessionSupported('immersive-ar').then(() => {
          // Update capability
        })
      }
    }, 5000)
  }

  getDeviceInfo(): XRDeviceInfo {
    return this.deviceInfo
  }

  canARProject(): boolean {
    return this.deviceInfo.capability === 'ar' || this.deviceInfo.hasARKit || this.deviceInfo.hasARCore
  }

  canVRExperience(): boolean {
    return this.deviceInfo.capability === 'vr' || this.deviceInfo.isVRHeadsetConnected
  }

  async startARSession() {
    if (!this.canARProject()) return null

    try {
      if (this.deviceInfo.hasWebXR) {
        return await navigator.xr?.requestSession('immersive-ar', {
          requiredFeatures: ['hit-test'],
          optionalFeatures: ['dom-overlay'],
        })
      }
    } catch (e) {
      console.log('[v0] AR session error:', e)
    }

    return null
  }

  async startVRSession() {
    if (!this.canVRExperience()) return null

    try {
      if (this.deviceInfo.hasWebXR) {
        return await navigator.xr?.requestSession('immersive-vr', {
          requiredFeatures: ['local-floor'],
        })
      }
    } catch (e) {
      console.log('[v0] VR session error:', e)
    }

    return null
  }
}

export const xrDetector = new XRDetector()
