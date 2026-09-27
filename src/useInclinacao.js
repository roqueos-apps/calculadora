// O reflexo que segue o aparelho: veio do `useDeviceTilt` do RoqueOS, que só a Calculadora
// usava, e saiu do núcleo junto com ela (Goal 28, Onda 2).

import { ref, onMounted, onUnmounted } from 'vue'

/**
 * useInclinacao — "physical object catching light" delight.
 *
 * Exposes smoothed `tiltX` / `tiltY` (roughly in [-1, 1]) that a caller maps to
 * moving specular highlights so a surface feels like it reflects real light as
 * the device moves. Sources, in priority order:
 *   1. Device orientation (accelerometer) on mobile — the real effect.
 *   2. Pointer position over `targetRef` on desktop — light follows the cursor.
 *
 * Fully inert (stays 0/0, attaches nothing) under `prefers-reduced-motion` or
 * when `modoLeve()` says the device asked for the light profile (the
 * `desempenho` capability of the app-sdk), and degrades gracefully to static when orientation is
 * unavailable or its permission is denied. iOS 13+ gates orientation behind a
 * user-gesture permission prompt, so the caller must invoke `requestMotion()`
 * from a real interaction (e.g. the first tap).
 *
 * @param {import('vue').Ref<HTMLElement|null>} targetRef element for the pointer fallback
 * @param {{ pointerStrength?: number, smoothing?: number, modoLeve?: () => boolean }} [options]
 */
export function useInclinacao(targetRef, options = {}) {
  const { pointerStrength = 1, smoothing = 0.12, modoLeve = () => false } = options

  const tiltX = ref(0)
  const tiltY = ref(0)

  let targetX = 0
  let targetY = 0
  let raf = 0
  let orientationActive = false
  let disabled = false
  let requested = false

  // `Math.min`/`Math.max` em vez do ternário duplo: mesma conta, uma linha mais
  // curta e sem a borda ambígua do `v > hi` (no valor exato do teto os dois
  // devolvem `hi`, então aquele operador não tinha como ser afirmado).
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

  const tick = () => {
    raf = 0
    tiltX.value += (targetX - tiltX.value) * smoothing
    tiltY.value += (targetY - tiltY.value) * smoothing
    if (Math.abs(targetX - tiltX.value) < 0.002 && Math.abs(targetY - tiltY.value) < 0.002) {
      tiltX.value = targetX
      tiltY.value = targetY
    } else {
      schedule()
    }
  }
  const schedule = () => {
    if (!raf && typeof requestAnimationFrame === 'function') raf = requestAnimationFrame(tick)
  }

  const onOrientation = (e) => {
    if (e.gamma == null && e.beta == null) return
    orientationActive = true
    // gamma: left-right [-90,90]; beta: front-back [-180,180]. Neutral hold is
    // a phone held ~40° from flat, so subtract that from beta before scaling.
    targetX = clamp((e.gamma || 0) / 32, -1, 1)
    targetY = clamp(((e.beta || 0) - 40) / 32, -1, 1)
    schedule()
  }

  const onPointer = (e) => {
    if (orientationActive) return
    const el = targetRef && targetRef.value
    if (!el) return
    const r = el.getBoundingClientRect()
    targetX = clamp(((e.clientX - r.left) / (r.width || 1) - 0.5) * 2, -1, 1) * pointerStrength
    targetY = clamp(((e.clientY - r.top) / (r.height || 1) - 0.5) * 2, -1, 1) * pointerStrength
    schedule()
  }
  const onPointerLeave = () => {
    if (orientationActive) return
    targetX = 0
    targetY = 0
    schedule()
  }

  // iOS 13+: orientation needs a user-gesture permission grant. Safe no-op on
  // browsers without the prompt (Android attaches at mount) and when disabled.
  const requestMotion = async () => {
    if (disabled || requested) return
    requested = true
    try {
      const DOE = window.DeviceOrientationEvent
      if (DOE && typeof DOE.requestPermission === 'function') {
        const res = await DOE.requestPermission()
        if (res === 'granted') {
          window.addEventListener('deviceorientation', onOrientation, { passive: true })
        }
      }
    } catch {
      /* permission prompt failed / denied — stay static */
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // O perfil leve vem do sistema (`desempenho.modoLeve`), e não do atributo
    // `data-low-end` do documento do RoqueOS: esse é detalhe de lá, que ninguém trava.
    if (reduce || modoLeve()) {
      disabled = true
      return
    }
    const DOE = window.DeviceOrientationEvent
    // Browsers that don't gate orientation behind a prompt (Android, older
    // Safari) can listen immediately; iOS waits for requestMotion().
    if (DOE && typeof DOE.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', onOrientation, { passive: true })
    }
    const el = targetRef && targetRef.value
    if (el) {
      el.addEventListener('pointermove', onPointer, { passive: true })
      el.addEventListener('pointerleave', onPointerLeave, { passive: true })
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('deviceorientation', onOrientation)
    }
    const el = targetRef && targetRef.value
    if (el) {
      el.removeEventListener('pointermove', onPointer)
      el.removeEventListener('pointerleave', onPointerLeave)
    }
    if (raf && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(raf)
  })

  return { tiltX, tiltY, requestMotion }
}
