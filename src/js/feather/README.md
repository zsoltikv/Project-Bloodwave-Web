# Feather

Feather is a small, explicit UI framework where functions define reactivity and modifiers shape the DOM.

## Why Feather Exists

Feather solves a simple problem: plain DOM code gets messy fast, and large frameworks often bring more machinery than the app needs.

Feather keeps the useful parts:

- local reactive state
- pages with `setup()` and `render()`
- a small router
- form helpers
- fluent DOM modifiers

Feather stays different by being direct.

- No compiler.
- No template language.
- No hidden render magic.
- No guessing about what is reactive.

## Core Rule

In Feather, values are only reactive when passed as functions.

Wrong: `Text(count.get())`  
Right: `Text(() => count.get())`

That rule is the framework.

Create state in `setup()` or module scope. Pass functions into the DOM when something should update.

## 30-Second Example

```js
import { Button, Paragraph, VStack, mount, signal } from '../feather/index.js';

const count = signal(0);

mount(
  VStack(
    Paragraph().text(() => `Count: ${count.get()}`),
    Button('Increment').onClick(() => count.update((value) => value + 1)),
  ).gap(12).padding(24),
);
```

`mount(...)` renders into `#app` by default.

## Key Concepts

### `setup()`

Create long-lived state here.

Create:

- `signal`
- `computed`
- `store`
- forms
- watchers
- timers

Do not create reactive state inside `render()`.

### `render()`

Return the view.

Keep it focused on structure, bindings, and event handlers.

### Bindings

Pass a function when a value should stay live.

```js
Paragraph().text(() => user.name.get());
Box().className({ active: () => open.get() });
Input().value(() => draft.get());
```

Read a value directly only when static output is intended.

### Modifiers

Start with a node. Shape it with chains.

```js
Button('Save')
  .className('primary')
  .ariaLabel('Save changes')
  .onClick(handleSave);
```

## What Feather Is Not

Feather is not a React or Vue replacement.

Feather is not magic.

Feather is not built to hide the DOM behind layers of abstraction.

Feather is not for apps that want a giant ecosystem, a compile step, or framework-driven architecture.

## One Real Example

```js
import {
  Box,
  Button,
  Paragraph,
  Title,
  page,
  setupState,
  signal,
} from '../feather/index.js';

export default page({
  name: 'SettingsPage',

  setup() {
    const open = signal(false);

    return setupState({
      open,
    });
  },

  render(ctx) {
    return Box(
      Title('Settings'),
      Button(() => (ctx.open.get() ? 'Hide details' : 'Show details'))
        .onClick(() => ctx.open.update((value) => !value)),
      Paragraph('These details stay reactive because visibility is passed as a function.')
        .showWhen(() => ctx.open.get()),
    ).padding(24);
  },
});
```

This is the full Feather loop:

1. Create state in `setup()`
2. Return a view from `render()`
3. Pass functions for reactive values
4. Use modifiers to shape behavior and DOM output

## Start Here

Reach for these first:

- `mount(...)` for bootstrapping
- `page(...)` for screens
- `signal(...)` for local state
- `Show(...)` and `ForEach(...)` for control flow
- `createForm(...)` for forms
- `createRouter(...)` for routing

## Runtime Rules

- Dev mode shows warnings and guidance.
- Strict mode turns binding misuse into errors.
- Nested bindings are not supported.
- Mixed binding styles are not supported.

If a binding feels complicated, flatten it or wrap it in a function.

## Public API

High-level building blocks:

- layout: `Box`, `VStack`, `HStack`, `ZStack`, `Spacer`
- text: `Text`, `Paragraph`, `Title`, `Subtitle`, `Span`
- controls: `Button`, `Input`, `Checkbox`, `Link`, `Form`, `Alert`
- helpers: `mount`, `page`, `Show`, `ForEach`
- state: `signal`, `computed`, `store`, `effect`
- forms: `createForm`, `TextField`, `CheckboxField`, `SubmitButton`
- routing: `createRouter`
- theme: `token`, `cx`, `defineTheme`

Low-level helpers stay available for advanced cases, but Feather reads best when built from the small set above.

## Why Developers Try Feather

Feather stays easy to read after the novelty wears off.

State is explicit.

Bindings are obvious.

DOM output stays close to the code that defines it.

That makes Feather fast to learn, easy to debug, and calm to maintain.
