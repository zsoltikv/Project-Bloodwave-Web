# Feather

Feather is the small UI framework used by Project Bloodwave. It gives us a page model, a reactive state system, a DOM renderer, form helpers, router support, and a fluent component API without pulling the app into a much larger framework.

It is intentionally practical. Feather exists to make common app screens easy to build, easy to reason about, and easy to customize with plain JavaScript and CSS.

## Why Feather Exists

Feather exists because this project needs a middle ground:

- More structure than hand-written DOM code and scattered event listeners.
- Less overhead than a large framework with its own build-time assumptions and architectural gravity.
- A consistent way to build pages, forms, and interactive flows in the same style across the codebase.
- A reactive model that is simple enough to understand from the source.
- Styling that can be fully custom, but can also opt into shared theme tokens when helpful.

In short: Feather tries to solve the "we need a real app framework, but we still want direct control" problem.

## What Feather Is Good At

Use Feather when you want to:

- Build routed pages with `setup()` and `render()`.
- Keep page state local and explicit with `signal`, `computed`, and `store`.
- Bind text, attributes, classes, styles, and visibility to reactive values.
- Compose UI from small reusable functions and primitives.
- Build forms with validation, touched state, submit state, and field helpers.
- Mix semantic components, plain CSS classes, and Tailwind-style utility classes.
- Stay close to the DOM and the platform instead of hiding everything behind abstractions.

## What Feather Is Not

Feather is not trying to be:

- A full React/Vue/Svelte replacement.
- A giant component library.
- A schema-driven form framework.
- A server rendering framework.
- A state container for your whole application by default.

If a feature does not help us build app screens more clearly, Feather usually should not own it.

## Core Mental Model

Feather is built around a few ideas:

1. Build views with functions.
2. Create state in `setup()` or outside render.
3. Pass reactive bindings as functions like `() => value`.
4. Use modifiers to shape nodes fluently.
5. Put side effects and subscriptions in `setup()`, `mount()`, or context helpers, not inline in render.

Example:

```js
import { Box, Button, Paragraph, mount, signal } from './index.js';

const count = signal(0);

mount(
  Box(
    Paragraph().text(() => `Count: ${count.get()}`),
    Button('Increment').onClick(() => count.update((value) => value + 1)),
  ),
);
```

## The Rules You Should Follow

These are the important usage rules for Feather today.

### Do

- Create `signal`, `computed`, `store`, and `effect` instances in `setup()` or module scope.
- Pass reactive values into UI as functions such as `.text(() => state.get())`.
- Keep page setup focused on state, derived values, watchers, timers, and one-time wiring.
- Use the page context for DOM queries, cleanup, timers, watchers, and navigation.
- Prefer field objects from `createForm()` for forms instead of rolling your own per-input glue.
- Use small component functions that return Feather nodes.

### Do Not

- Do not create reactive state during `render()`. Feather will throw for that.
- Do not eagerly read reactive values during render and pass the result as a static value if you expect updates later.
- Do not put long-lived side effects directly in render.
- Do not rely on deeply nested binding objects or arrays. Feather warns against that.
- Do not pass reactive sources directly to `Show` or `ForEach` in new code. Use getter functions instead.
- Do not treat Feather like a magic diffing engine that should own every concern in the app.

## Quick Start

The public API lives in `src/js/feather/index.js`.

```js
import {
  Box,
  Button,
  mount,
  Paragraph,
  signal,
} from '../feather/index.js';

const name = signal('Hunter');

mount(
  Box(
    Paragraph('Welcome back'),
    Paragraph().text(() => name.get()),
    Button('Rename').onClick(() => name.set('Raven')),
  ),
);
```

`mount(view)` mounts into `#app` by default. If you want a different target, use `mount(view, '#other-root')` or `mount(view, someElement)`.

## Pages

For app screens, the main pattern is `page({ setup, render, mount })`.

```js
import {
  Box,
  Button,
  page,
  signal,
  setupState,
} from '../feather/index.js';

export default page({
  name: 'ExamplePage',

  setup(ctx) {
    const open = signal(false);

    return setupState({
      open,
    });
  },

  render(ctx) {
    return Box(
      Button('Toggle').onClick(() => ctx.open.update((value) => !value)),
      Box('Panel').showWhen(() => ctx.open.get()),
    );
  },
});
```

### `setup(ctx)`

Use `setup()` for:

- Creating reactive state.
- Creating form objects.
- Starting watchers, timeouts, intervals, and one-time work.
- Preparing derived state or grouped context data.

The object returned from `setup()` is merged into the page context that `render()` receives.

### `setupState(...entries)`

`setupState()` merges plain objects into one context payload and throws on duplicate keys. It is the safest way to assemble page state from several sources.

```js
return setupState(
  { form },
  { submitState },
);
```

### `setupGroup(name, value)`

`setupGroup()` is a convenience for creating named groups inside the returned setup state.

```js
return setupState(
  setupGroup('fields', {
    email: form.field('email'),
    password: form.field('password'),
  }),
);
```

## Page Context

Every page render receives a context object. It includes anything returned from `setup()` plus helper methods.

Useful context helpers:

- `ctx.container` is the current page container element.
- `ctx.navigate(path, options)` navigates through the router.
- `ctx.cleanup(fn, scope)` registers cleanup work for `render` or `lifetime`.
- `ctx.once(key, fn)` runs one-time initialization and caches the result.
- `ctx.$(selector)` queries inside the page container.
- `ctx.$all(selector)` queries multiple nodes inside the page container.
- `ctx.bind(target, type, handler, options)` adds an event listener and auto-cleans it up.
- `ctx.timeout(callback, delay, scope)` registers a timeout with cleanup.
- `ctx.interval(callback, delay, scope)` registers an interval with cleanup.
- `ctx.raf(callback, scope)` schedules a frame with cleanup.
- `ctx.watch(source, listener, options)` watches reactive values.
- `ctx.setHTML(html)` replaces the page content with raw HTML.
- `ctx.setView(view)` replaces the page content with a Feather view.
- `ctx.render(view)` renders a new Feather view into the current container.

`scope` is usually either `render` or `lifetime`.

- `render` cleanup runs before the next render.
- `lifetime` cleanup runs when the page is destroyed.

## Reactive State

Feather's reactivity is intentionally small.

### `signal(initialValue)`

Mutable single value.

```js
const open = signal(false);

open.get();
open.set(true);
open.update((value) => !value);
```

### `computed(getter)`

Derived reactive value.

```js
const fullName = computed(() => `${first.get()} ${last.get()}`.trim());
```

### `store(initialObject)`

Reactive object store for shallow object state.

```js
const profile = store({
  name: '',
  email: '',
});

profile.patch({ name: 'Ayla' });
profile.update((current) => ({ email: `${current.name}@mail.com` }));
```

### `effect(fn)`

Runs a reactive observer and re-runs when tracked dependencies change. Return a cleanup function if needed.

```js
const stop = effect(() => {
  console.log(count.get());
});
```

### Other helpers

- `read(value)` unwraps reactive values or returns plain values unchanged.
- `batch(fn)` groups updates.
- `untrack(fn)` reads reactive state without subscribing.
- `isReactive(value)` checks whether a value is a Feather reactive handle.

### Important Reactive Rule

When a node should stay in sync with state, pass a getter function:

```js
Paragraph().text(() => count.get());
Box().className({ active: () => open.get() });
Input().value(() => draft.get());
```

Prefer this over reading the value during render and passing the result directly.

## View Authoring

Feather views are plain values returned by component functions. Children can be strings, numbers, nodes, arrays, or binding functions that resolve to any of those.

Main helpers:

- `mount(output, target, options)` mounts into `#app` by default or into a selector/element you pass.
- `$(selector, root)` and `$all(selector, root)` query from `document` or a provided root.
- `view(type, props, ...children)` low-level node creation.
- `El(type, ...args)` low-level element helper with props-first ergonomics.
- `Fragment(...children)` groups children without adding a DOM element.
- `html\`...\`` builds HTML strings from template literals.
- `render(output, container, options)` mounts a view.
- `mountView(output, container, context)` lower-level mount helper.

## Built-In Components

Feather exports a set of primitives and aliases.

### Layout and content

- `Box`, `Container`, `Surface`, `Group`, `FieldBox`
- `VStack`, `HStack`, `ZStack`, `Spacer`
- `Section`, `Article`, `Aside`, `Header`, `Footer`, `Main`, `Nav`
- `Text`, `Span`, `Paragraph`, `Strong`, `Emphasis`, `Small`, `Code`
- `Title`, `Subtitle`
- `List`, `OrderedList`, `ListItem`
- `Icon`, `Path`, `Img`, `Break`

### Interactive elements

- `Button`
- `Input`
- `Checkbox`
- `Link`
- `Form`
- `Label`
- `Alert`

### Control flow helpers

- `Show(condition, truthyValue, falsyValue)`
- `ForEach(items, renderItem)`

Preferred usage:

```js
Show(() => open.get(), Box('Open'), Box('Closed'));

ForEach(() => items.get(), (item) => Paragraph(item.label));
```

Passing direct reactive sources still works in some compatibility paths, but function bindings are the preferred pattern.

## Modifiers

Every Feather node supports a fluent modifier API.

Common examples:

```js
Button('Save')
  .id('saveButton')
  .className('bw-btn')
  .attr('data-kind', 'primary')
  .ariaLabel('Save changes')
  .onClick(handleSave)
  .showWhen(() => canSave.get());
```

Useful modifier groups:

- Props and composition: `.prop()`, `.props()`, `.with()`, `.when()`, `.if()`, `.as()`
- Text and HTML: `.text()`, `.html()`
- Attributes: `.attr()`, `.attrs()`, `.data()`
- Accessibility: `.aria()`, `.ariaLabel()`, `.ariaInvalid()`, `.ariaDescribedBy()`
- Events: `.on()`, `.onClick()`, `.onInput()`, `.onChange()`, `.onSubmit()`, `.onEnter()`, `.onEscape()`
- Conditional presence: `.showWhen()`, `.hideWhen()`, `.focusWhen()`
- Styling: `.className()`, `.class()`, `.toggleClass()`, `.tw()`, `.style()`
- Layout styles: `.padding()`, `.margin()`, `.gap()`, `.display()`, `.position()`
- Size styles: `.width()`, `.height()`, `.minWidth()`, `.maxWidth()`
- Utility-style class helpers: `.rounded()`, `.background()`, `.textColor()`, `.border()`, `.font()`, `.textSize()`, `.justify()`, `.align()`, `.animate()`

Primitive-specific modifiers also exist:

- `Button`: `.variant()`, `.size()`, `.block()`, `.loading()`, `.submit()`
- `Link`: `.to('/path')`
- `Input` and `Checkbox`: `.field(form.field('name'))`, `.model(signalValue)`
- Text elements: `.balance()`, `.pretty()`, `.clamp(lines)`
- `Title` and `Subtitle`: `.level(1..6)`
- Lists: `.marker()`, `.inside()`, `.outside()`, `.gap()`, `.dense()`

## Styling and Theme Tokens

Feather supports two styling modes:

1. Fully custom classes and inline styles.
2. Opt-in shared theme tokens.

Most primitives only apply their default themed classes when you pass `{ styled: true }`.

```js
Button({ styled: true }, 'Continue');
Input({ styled: true }).placeholder('Email');
Alert({ styled: true }, 'Saved').variant('success');
```

This lets project-specific UI stay fully custom while still keeping a reusable design token path available.

Theme utilities:

- `cx(...values)` merges classes, arrays, objects, and reactive class toggles.
- `defineTheme(overrides)` creates a theme object based on Feather defaults.
- `setTheme(overrides)` sets the active theme.
- `getTheme()` returns the active theme.
- `token(path, fallback)` resolves a token path like `button.base`.
- `resolveToken(group, value, fallback)` resolves grouped token paths.
- `defineVariants(config)` builds class resolvers from variant definitions.

## Constants

Feather exports named constants for common utility values:

- `Width`, `Height`
- `Justify`, `Align`
- `Rounded`, `Shadow`
- `Font`, `TextSize`, `Leading`, `Tracking`
- `Display`, `Animation`
- `Background`, `TextColor`, `BorderColor`
- `Variant`, `Tone`, `Size`

These are useful when you want readable enum-like values instead of string literals.

```js
Button('Save').size(Size.Large).variant(Variant.Primary);
Box().justify(Justify.Between).align(Align.Center);
```

## Forms

Feather has a first-class form layer built on top of the reactive system.

### `createForm(options)`

```js
const form = createForm({
  initial: {
    email: '',
    password: '',
    tos: false,
  },
  accepts: [
    {
      name: 'tos',
      message: 'You must accept the terms',
    },
  ],
  validate(values) {
    return {
      email: values.email ? '' : 'Email is required',
      password: values.password ? '' : 'Password is required',
      tos: '',
    };
  },
  async submit(values, formRef, event) {
    await api.login(values);
  },
});
```

The returned form object includes:

- `values`, `errors`, `touched`, `submitting`, `submitError`
- `valid`, `invalid`, `dirty`
- `field(name)`
- `validate()`, `submit(event)`, `reset()`
- `set(nextValues)`, `patch(partialValues)`, `touch(nextTouched)`
- `state(key, initialValue)` and `memo(key, factory)` for form-local helper state

### Field Objects

`form.field(name)` returns a field helper with:

- `value`, `error`, `touched`, `invalid`
- `set(nextValue)`, `touch(nextValue)`, `reset()`
- `bind(props)` to merge `field` into props
- `state(key, initialValue)` and `memo(key, factory)` for field-local state

This makes patterns like password visibility toggles and field-local animation state easy to keep close to the field.

### Form Components

Feather exports helpers for common form structures:

- `FormScope`
- `Field`
- `FieldLabel`
- `FieldControl`
- `FieldHint`
- `FieldError`
- `TextField`
- `CheckboxField`
- `InputField`
- `SubmitButton`

Example:

```js
const form = createForm({
  initial: {
    email: '',
  },
  validate(values) {
    return {
      email: values.email ? '' : 'Email is required',
    };
  },
});

const emailField = form.field('email');

Form(
  TextField({
    field: emailField,
    label: 'Email',
    id: 'loginEmail',
    autocomplete: 'email',
    hint: 'Use the email tied to your account',
  }),
  SubmitButton(form, 'Continue'),
).form(form);
```

### Form Guidance

Prefer this pattern:

- Put overall form state in `createForm()`.
- Use `form.field(name)` for per-input binding.
- Use `field.error`, `field.invalid`, and `form.submitting` in bindings.
- Keep validation inside `validate()` and submit work inside `submit()`.

Avoid this pattern:

- Ad-hoc input state scattered across several unrelated signals.
- Manual touched/error bookkeeping per input when `createForm()` already provides it.
- Duplicating form submission guards that `form.submitting` already covers.

## Routing

Feather includes a small client-side router.

```js
import { createRouter } from '../feather/index.js';
import LoginPage from './Login.js';
import RegisterPage from './Register.js';

const router = createRouter({
  root: '#app',
  routes: [
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
  ],
  notFoundPath: '/login',
});

router.start();
```

Router notes:

- Route components can be page objects or plain functions.
- `beforeResolve` can redirect before a route is rendered.
- `afterRender` runs after the route view mounts.
- `router.navigate(path, { replace })` changes routes programmatically.
- The router intercepts links with `data-link`, which `Link().to(...)` and `.routerLink()` provide.
- The active page context is cleaned up automatically during navigation.

## Component Authoring

If you need custom primitives, Feather exposes low-level helpers.

### `createPrimitive(tagName, options)`

Use this when you want a reusable component with:

- Defaults
- State-backed modifiers
- Theme-aware class resolution
- Prop preparation or prop resolution hooks

### `unstyled(component)`

Returns a version of a component that forces `unstyled: true`.

### `mergeProps(...)` and `splitProps(...)`

Useful when building your own component wrappers and prop adapters.

## Recommended Style of Feather Code

Feather code stays easiest to maintain when it looks like this:

- `setup()` creates the reactive model.
- Small helper functions build repeated UI fragments.
- `render()` mostly composes nodes and bindings.
- CSS classes stay project-specific unless shared theme tokens are genuinely useful.
- Forms use `createForm()`.
- Routing is page-oriented, not global-state-oriented.

## Anti-Patterns

Try not to do these things:

- Creating `signal()` or `computed()` inside `render()`.
- Calling `someSignal.get()` in render and passing the plain result where a live binding is expected.
- Returning huge nested binding objects when a simple getter function would be clearer.
- Using raw DOM queries everywhere when the page context or refs would keep the code local.
- Turning every UI helper into a giant configurable abstraction too early.
- Mixing several competing styling systems in one component without a reason.

## File Overview

- `core.js`: renderer, nodes, modifiers, primitives, pages, mounting
- `state.js`: reactive state system
- `forms.js`: form model and form components
- `router.js`: client-side routing
- `theme.js`: theme tokens and class helpers
- `constants.js`: enum-like constants
- `index.js`: public exports

## Final Advice

If you are unsure which Feather feature to reach for, start simple:

1. Build the UI with `Box`, text components, and modifiers.
2. Add `signal` or `createForm` in `setup()`.
3. Bind with getter functions like `() => value.get()`.
4. Use context helpers for timers, watchers, and cleanup.

That path matches how Feather is designed to work, and it will keep your code aligned with the rest of the framework.
