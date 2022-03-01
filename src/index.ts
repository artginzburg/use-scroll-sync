import * as React from 'react'

// https://stackoverflow.com/a/49725198/11474669
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

type UseScrollSyncOptions = {
  horizontal: true
  vertical: true
}

/**
 * Sync scroll positions between multiple refs.
 */
export function useScrollSync(
  options: RequireAtLeastOne<UseScrollSyncOptions>,
  ...refs: Array<{ current?: HTMLElement | null }>
) {
  const timeoutId = React.useRef<ReturnType<typeof setTimeout>>(null)
  const handleScroll = React.useCallback(event => {
    const syncedRefs = refs.filter(ref => ref.current !== event.target)
    const targetScrollLeft = event.target.scrollLeft
    const targetScrollTop = event.target.scrollTop

    clearTimeout(timeoutId.current)

    syncedRefs.forEach(ref => {
      removeEvent(ref)
      ref.current.style.willChange = 'scroll-position'
      if (options.horizontal) ref.current.scrollLeft = targetScrollLeft
      if (options.vertical) ref.current.scrollTop = targetScrollTop
    })

    timeoutId.current = setTimeout(() => {
      syncedRefs.forEach(ref => {
        addEvent(ref)
        ref.current.style.willChange = ''
      })
    }, 100)
  }, refs)

  const addEvent = React.useCallback(
    ref => {
      ref.current.addEventListener('scroll', handleScroll, {
        passive: true,
      })
    },
    [handleScroll]
  )

  const removeEvent = React.useCallback(
    ref => {
      ref.current.removeEventListener('scroll', handleScroll, {
        passive: true,
      })
    },
    [handleScroll]
  )

  React.useLayoutEffect(() => {
    refs.forEach(addEvent)
    return () => {
      clearTimeout(timeoutId.current)
      refs.forEach(removeEvent)
    }
  }, refs)
}
