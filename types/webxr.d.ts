// Minimal ambient WebXR typings. The TypeScript DOM lib version used by this
// project does not include the WebXR device API, and the `navigator.xr` usage
// in lib/lab/neuro/ar-vr-detection.ts needs it at compile time.

type XRSessionMode = 'immersive-ar' | 'immersive-vr' | 'inline'

interface XRSystemSessionOptions {
  requiredFeatures?: string[]
  optionalFeatures?: string[]
}

interface XRSession {
  end(): Promise<void>
}

interface XRSystem {
  isSessionSupported(mode: XRSessionMode): Promise<boolean>
  requestSession(
    mode: XRSessionMode,
    options?: XRSystemSessionOptions,
  ): Promise<XRSession>
}

interface Navigator {
  readonly xr?: XRSystem
}
