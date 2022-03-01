# useScrollSync

Sync scroll positions between multiple elements.

This fork differs from the main one — it allows to also sync vertical scrolling position, in addition to horizontal, and requires first argument as the synchronization options.

<small>Note, if the main thread is too busy or the user's battery is low, scrollbars can get out of sync.</small>

## Install

```bash
yarn add @artginzburg/use-scroll-sync
```

```bash
npm install @artginzburg/use-scroll-sync
```

## Example

```jsx
import * as React from 'react'
import { useScrollSync } from 'use-scroll-sync'

function SyncedScrollbars() {
  const headerRef = React.useRef()
  const mainRef = React.useRef()
  useScrollSync({ vertical: true }, headerRef, mainRef)
  return (
    <div>
      <header ref={headerRef}>...</header>
      <main ref={mainRef}>...</main>
    </div>
  )
}
```
