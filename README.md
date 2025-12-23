# Meemaw

Elegant, declarative React utility components for common UI patterns.

## Installation

```bash
npm install meemaw
# or
yarn add meemaw
```

## Features

- **Zero dependencies** (peer deps: React 16.8+)
- **Tiny bundle size** (<10KB)
- **Tree-shakeable** - only import what you need
- **TypeScript** support
- **100% test coverage**

## Components

### Conditional Rendering

- `<Switch>`, `<Case>`, `<Default>` - Match-case style conditions
- `<Show>` - Show content with fallback
- `<Hidden>` - Hide content conditionally or by breakpoint

### Iteration

- `<Repeat>` - Repeat elements n times or iterate arrays

### Time-based (Coming Soon)

- `<Cycle>` - Auto-cycling carousel
- `<Delayed>` - Delayed rendering
- `<Sequence>` - Staggered animations
- `<ShowOnce>` - One-time displays

### Interaction (Coming Soon)

- `<CopyToClipboard>` - Copy text to clipboard
- `<Clamp>` - Text truncation with expand/collapse
- `<Idle>` - Inactivity detection

### Responsive (Coming Soon)

- `<Breakpoint>` - Render by viewport size

### Loading (Coming Soon)

- `<Skeleton>` - Loading placeholders

### State Persistence (Coming Soon)

- `<Storage>` - localStorage/sessionStorage sync

## Quick Start

```jsx
import { Switch, Case, Default, Show, Hidden, Repeat } from 'meemaw';

// Match-case conditionals
<Switch>
  <Case when={status === 'loading'}><Spinner /></Case>
  <Case when={status === 'error'}><Error /></Case>
  <Case when={status === 'success'}><Content /></Case>
  <Default><Empty /></Default>
</Switch>

// Show with fallback
<Show when={isLoggedIn} fallback={<Login />}>
  <Dashboard />
</Show>

// Hide on mobile
<Hidden on="mobile">
  <DesktopNav />
</Hidden>

// Repeat elements
<Repeat times={5}>
  {(_, index) => <Star key={index} />}
</Repeat>
```

## Documentation

See [full documentation](./docs/components.md) for all components and APIs.

## Bundle Size

This library is optimized for minimal bundle size:
- Tree-shakeable ESM exports
- No external dependencies
- Minified and compressed
- Target size: <10KB total

Check actual size: `npm run size`

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Type check
npm run typecheck
```

## Publishing

```bash
# Ensure tests pass and build succeeds
npm run prepublishOnly

# Publish to NPM
npm publish
```

## License

MIT
