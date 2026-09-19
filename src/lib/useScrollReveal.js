import { useEffect } from 'react'

/**
 * Reveals `[data-reveal]` elements inside `ref` as they scroll into view.
 * Elements are marked visible immediately when IntersectionObserver is
 * unavailable or the visitor prefers reduced motion, so content never hides.
 *
 * @param {import('react').RefObject<HTMLElement>} ref Container to scan.
 * @param {unknown[]} [deps] Re-scan when async content mounts new nodes.
 */
export default function useScrollReveal(ref, deps = []) {
  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll('[data-reveal]')).filter(
      el => !el.classList.contains('is-visible'),
    )
    if (targets.length === 0) return

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof IntersectionObserver === 'undefined') {
      targets.forEach(el => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )

    targets.forEach(el => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
