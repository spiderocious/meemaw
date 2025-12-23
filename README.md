# Meemaw

**Elegant, declarative React utility components for common UI patterns**

• [Installation](#installation)
• [Components](#components)
• [Examples](#examples)
• [Documentation](#documentation)

---

## Why Meemaw?

Stop writing repetitive JSX patterns. Meemaw provides a collection of lightweight, zero-dependency React components that make your code more readable and maintainable.

```jsx
// Before
{
  isLoggedIn ? <Dashboard /> : <Login />;
}

// After
<Show when={isLoggedIn} fallback={<Login />}>
  <Dashboard />
</Show>;
```

### Features

- **Zero dependencies** - Only React as peer dependency
- **Tiny bundle** - Less than 10KB total
- **Tree-shakeable** - Import only what you need
- **TypeScript first** - Full type safety out of the box
- **100% test coverage** - Thoroughly tested and reliable
- **SSR compatible** - Works with Next.js, Remix, and other frameworks

---

## Installation

```bash
npm install meemaw
```

```bash
yarn add meemaw
```

```bash
pnpm add meemaw
```

---

## Components

### Conditional Rendering

#### `<Switch>`, `<Case>`, `<Default>`

Clean match-case pattern for multiple conditions. No more nested ternaries.

```jsx
import { Switch, Case, Default } from 'meemaw';

function OrderStatus({ status }) {
  return (
    <Switch>
      <Case when={status === 'pending'}>
        <PendingIcon /> Processing your order...
      </Case>
      <Case when={status === 'shipped'}>
        <TruckIcon /> On the way!
      </Case>
      <Case when={status === 'delivered'}>
        <CheckIcon /> Delivered
      </Case>
      <Default>
        <ErrorIcon /> Unknown status
      </Default>
    </Switch>
  );
}
```

#### `<Show>`

Simple conditional rendering with optional fallback.

```jsx
import { Show } from 'meemaw';

// Basic usage
<Show when={isLoggedIn}>
  <UserProfile />
</Show>

// With fallback
<Show when={hasPermission} fallback={<AccessDenied />}>
  <AdminPanel />
</Show>

// Using 'if' prop (alias for 'when')
<Show if={isLoading} fallback={<Content />}>
  <Spinner />
</Show>
```

#### `<Hidden>`

Hide content conditionally or based on viewport breakpoints.

```jsx
import { Hidden } from 'meemaw';

// Conditional hiding
<Hidden when={!isPublic}>
  <SecretContent />
</Hidden>

// Responsive hiding
<Hidden on="mobile">
  <DesktopNav />
</Hidden>

<Hidden on={['mobile', 'tablet']}>
  <DesktopOnlyFeature />
</Hidden>
```

**Breakpoints:**

- `mobile`: < 768px
- `tablet`: < 1024px
- `desktop`: ≥ 1024px

#### `<Loadable>`

Handle async operation states with built-in loading and error UI.

```jsx
import { Loadable } from 'meemaw';

function UserData() {
  const { data, loading, error } = useFetch('/api/user');

  return (
    <Loadable loading={loading} error={error}>
      <UserProfile data={data} />
    </Loadable>
  );
}

// Custom loading and error components
<Loadable
  loading={isLoading}
  error={error}
  loadingComponent={<CustomSpinner />}
  errorComponent={<ErrorAlert message={err.message} />}
>
  <Content />
</Loadable>;
```

---

### Iteration

#### `<Repeat>`

Iterate arrays or repeat elements n times with clean syntax.

```jsx
import { Repeat } from 'meemaw';

// Repeat n times
<Repeat times={5}>
  {(_, index) => <Star key={index} />}
</Repeat>

// Iterate over array
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

<Repeat each={users}>
  {(user, index) => (
    <UserCard key={user.id} user={user} />
  )}
</Repeat>

// Static children (repeated as-is)
<Repeat times={3}>
  <Divider />
</Repeat>
```

---

### Time-based Components

#### `<Delayed>`

Delay rendering until a condition is met or timeout expires.

```jsx
import { Delayed } from 'meemaw';

// Show after 3 seconds
<Delayed till={3000}>
  <Announcement />
</Delayed>

// Show at specific date/time
<Delayed till={new Date('2025-01-01')}>
  <NewYearMessage />
</Delayed>

// Show when condition becomes true
<Delayed until={dataLoaded} fallback={<Loading />}>
  <DataView />
</Delayed>
```

#### `<ShowOnce>`

Display content only once with optional persistence.

```jsx
import { ShowOnce } from 'meemaw';

// Show for 5 seconds then hide forever
<ShowOnce for={5000} persist>
  <WelcomeBanner />
</ShowOnce>

// Show once per session
<ShowOnce persist persistType="session">
  <NewFeatureTooltip />
</ShowOnce>

// Show once across all sessions (localStorage)
<ShowOnce persist persistKey="onboarding-v1" persistType="local">
  <OnboardingTour />
</ShowOnce>

// Show once in memory (resets on page reload)
<ShowOnce persist persistType="memory">
  <FirstTimeHint />
</ShowOnce>
```

**Persistence types:**

- `local` - Persists across browser sessions (localStorage)
- `session` - Persists within current session (sessionStorage)
- `memory` - Persists only in memory (resets on reload)

---

### Interaction Components

#### `<CopyToClipboard>`

Copy text to clipboard with automatic success/error handling.

```jsx
import { CopyToClipboard } from 'meemaw';

// Copy specific text
<CopyToClipboard text="npm install meemaw">
  <button>Copy command</button>
</CopyToClipboard>

// Copy with callbacks
<CopyToClipboard
  text={code}
  onSuccess={() => toast.success('Copied!')}
  onError={(err) => toast.error(err.message)}
>
  <CopyButton />
</CopyToClipboard>

// Render function pattern with copy state
<CopyToClipboard text={shareUrl}>
  {(copy, copied) => (
    <button onClick={copy}>
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  )}
</CopyToClipboard>

// Auto-extract text from children
<CopyToClipboard>
  <code>const greeting = "Hello, World!";</code>
</CopyToClipboard>
```

#### `<Clamp>`

Truncate text with optional expand/collapse functionality.

```jsx
import { Clamp } from 'meemaw';

// Clamp by character count
<Clamp maxChar={100}>
  {longText}
</Clamp>

// Clamp by line count
<Clamp maxLines={3}>
  <p>{article}</p>
</Clamp>

// Expandable with custom text
<Clamp
  maxChar={200}
  expandable
  expandText="Read more"
  collapseText="Show less"
  truncateEnd="..."
  onToggle={(isExpanded) => console.log('Expanded:', isExpanded)}
>
  {biography}
</Clamp>
```

---

## Real-World Examples

### Loading States

```jsx
function UserDashboard() {
  const { data, loading, error } = useQuery('/api/dashboard');

  return (
    <Loadable loading={loading} error={error} loadingComponent={<DashboardSkeleton />}>
      <Switch>
        <Case when={!data.posts.length}>
          <EmptyState />
        </Case>
        <Case when={data.posts.length > 0}>
          <Repeat each={data.posts}>{post => <PostCard key={post.id} post={post} />}</Repeat>
        </Case>
      </Switch>
    </Loadable>
  );
}
```

### Responsive Navigation

```jsx
function Navigation() {
  return (
    <>
      <Hidden on={['mobile', 'tablet']}>
        <DesktopNav />
      </Hidden>

      <Hidden on="desktop">
        <MobileNav />
      </Hidden>
    </>
  );
}
```

### First-Time User Experience

```jsx
function App() {
  return (
    <div>
      <ShowOnce persist persistKey="welcome-v2" persistType="local">
        <WelcomeModal />
      </ShowOnce>

      <Delayed until={userDataLoaded}>
        <MainContent />
      </Delayed>
    </div>
  );
}
```

### Role-Based Content

```jsx
function Dashboard({ user }) {
  return (
    <Switch>
      <Case when={user.role === 'admin'}>
        <AdminDashboard />
      </Case>
      <Case when={user.role === 'moderator'}>
        <ModeratorDashboard />
      </Case>
      <Case when={user.role === 'user'}>
        <UserDashboard />
      </Case>
      <Default>
        <GuestView />
      </Default>
    </Switch>
  );
}
```

### Code Snippet with Copy

```jsx
function CodeBlock({ code, language }) {
  return (
    <div className="code-block">
      <CopyToClipboard text={code}>
        {(copy, copied) => (
          <button onClick={copy} className="copy-btn">
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </CopyToClipboard>
      <pre>
        <code className={language}>{code}</code>
      </pre>
    </div>
  );
}
```

### Article Preview

```jsx
function ArticleCard({ article }) {
  return (
    <article>
      <h2>{article.title}</h2>
      <Clamp maxLines={3} expandable expandText="Read more" collapseText="Show less">
        <p>{article.content}</p>
      </Clamp>
    </article>
  );
}
```

---

## TypeScript Support

All components are written in TypeScript with full type definitions included.

```tsx
import { Show, Repeat, ShowOnce, PersistenceType } from 'meemaw';

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  /* ... */
];

<Repeat<User> each={users}>{(user, index) => <div key={user.id}>{user.name}</div>}</Repeat>;

const persistType: PersistenceType = 'local';
<ShowOnce persist persistType={persistType}>
  <Notification />
</ShowOnce>;
```

---

## Bundle Size

Meemaw is optimized for minimal bundle impact:

| Export                | Size (minified + gzipped) |
| --------------------- | ------------------------- |
| Full package          | ~7 KB                     |
| Individual components | ~0.5-1.5 KB each          |

Check the current size: `npm run size`

Only import what you need - tree-shaking ensures you only ship the components you use.

---

## Browser Support

Meemaw supports all modern browsers:

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

For older browsers, you may need to include appropriate polyfills.

---

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Build the library
npm run build

# Type check
npm run typecheck

# Lint
npm run lint

# Format code
npm run format
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT © [spiderocious](https://github.com/spiderocious)

---

## Links

- [npm Package](https://www.npmjs.com/package/meemaw)
- [GitHub Repository](https://github.com/spiderocious/meemaw)
- [Issue Tracker](https://github.com/spiderocious/meemaw/issues)

---

<div align="center">

**Made with ❤️ for the React community**

If you find this library useful, please consider giving it a star on GitHub!

</div>
