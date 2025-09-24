---
title: "Getting Started: CSS | Next.js"
source: "https://nextjs.org/docs/app/getting-started/css"
author:
  - "[[Vercel]]"
published:
created: 2025-09-25
description: "Learn about the different ways to add CSS to your application, including Tailwind CSS, CSS Modules, Global CSS, and more."
tags:
  - "clippings"
---
## CSS

Next.js provides several ways to style your application using CSS, including:

- [Tailwind CSS](https://nextjs.org/docs/app/getting-started/#tailwind-css)
- [CSS Modules](https://nextjs.org/docs/app/getting-started/#css-modules)
- [Global CSS](https://nextjs.org/docs/app/getting-started/#global-css)
- [External Stylesheets](https://nextjs.org/docs/app/getting-started/#external-stylesheets)
- [Sass](https://nextjs.org/docs/app/guides/sass)
- [CSS-in-JS](https://nextjs.org/docs/app/guides/css-in-js)

## Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) is a utility-first CSS framework that provides low-level utility classes to build custom designs.

Install Tailwind CSS:

Terminal

```
pnpm add -D tailwindcss @tailwindcss/postcss
```

Add the PostCSS plugin to your `postcss.config.mjs` file:

postcss.config.mjs

```
export default {

  plugins: {

    '@tailwindcss/postcss': {},

  },

}
```

Import Tailwind in your global CSS file:

app/globals.css

```
@import 'tailwindcss';
```

Import the CSS file in your root layout:

app/layout.tsx

```
import './globals.css'

 

export default function RootLayout({

  children,

}: {

  children: React.ReactNode

}) {

  return (

    <html lang="en">

      <body>{children}</body>

    </html>

  )

}
```

Now you can start using Tailwind's utility classes in your application:

app/page.tsx

```
export default function Page() {

  return (

    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>

    </main>

  )

}
```

> **Good to know:** If you need broader browser support for very old browsers, see the [Tailwind CSS v3 setup instructions](https://nextjs.org/docs/app/guides/tailwind-v3-css).

## CSS Modules

CSS Modules locally scope CSS by generating unique class names. This allows you to use the same class in different files without worrying about naming collisions.

To start using CSS Modules, create a new file with the extension `.module.css` and import it into any component inside the `app` directory:

app/blog/blog.module.css

```
.blog {

  padding: 24px;

}
```

app/blog/page.tsx

```
import styles from './blog.module.css'

 

export default function Page() {

  return <main className={styles.blog}></main>

}
```

## Global CSS

You can use global CSS to apply styles across your application.

Create a `app/global.css` file and import it in the root layout to apply the styles to **every route** in your application:

app/global.css

```
body {

  padding: 20px 20px 60px;

  max-width: 680px;

  margin: 0 auto;

}
```

app/layout.tsx

```
// These styles apply to every route in the application

import './global.css'

 

export default function RootLayout({

  children,

}: {

  children: React.ReactNode

}) {

  return (

    <html lang="en">

      <body>{children}</body>

    </html>

  )

}
```

> **Good to know:** Global styles can be imported into any layout, page, or component inside the `app` directory. However, since Next.js uses React's built-in support for stylesheets to integrate with Suspense, this currently does not remove stylesheets as you navigate between routes which can lead to conflicts. We recommend using global styles for *truly* global CSS (like Tailwind's base styles), [Tailwind CSS](https://nextjs.org/docs/app/getting-started/#tailwind-css) for component styling, and [CSS Modules](https://nextjs.org/docs/app/getting-started/#css-modules) for custom scoped CSS when needed.

## External stylesheets

Stylesheets published by external packages can be imported anywhere in the `app` directory, including colocated components:

app/layout.tsx

```
import 'bootstrap/dist/css/bootstrap.css'

 

export default function RootLayout({

  children,

}: {

  children: React.ReactNode

}) {

  return (

    <html lang="en">

      <body className="container">{children}</body>

    </html>

  )

}
```

> **Good to know:** In React 19, `<link rel="stylesheet" href="..." />` can also be used. See the [React `link` documentation](https://react.dev/reference/react-dom/components/link) for more information.

## Ordering and Merging

Next.js optimizes CSS during production builds by automatically chunking (merging) stylesheets. The **order of your CSS** depends on the **order you import styles in your code**.

For example, `base-button.module.css` will be ordered before `page.module.css` since `<BaseButton>` is imported before `page.module.css`:

page.tsx

```
import { BaseButton } from './base-button'

import styles from './page.module.css'

 

export default function Page() {

  return <BaseButton className={styles.primary} />

}
```

base-button.tsx

```
import styles from './base-button.module.css'

 

export function BaseButton() {

  return <button className={styles.primary} />

}
```

To keep CSS ordering predictable:

- Try to contain CSS imports to a single JavaScript or TypeScript entry file
- Import global styles and Tailwind stylesheets in the root of your application.
- **Use Tailwind CSS** for most styling needs as it covers common design patterns with utility classes.
- Use CSS Modules for component-specific styles when Tailwind utilities aren't sufficient.
- Use a consistent naming convention for your CSS modules. For example, using `<name>.module.css` over `<name>.tsx`.
- Extract shared styles into shared components to avoid duplicate imports.
- Turn off linters or formatters that auto-sort imports like ESLint’s [`sort-imports`](https://eslint.org/docs/latest/rules/sort-imports).
- You can use the [`cssChunking`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cssChunking) option in `next.config.js` to control how CSS is chunked.

## Development vs Production

- In development (`next dev`), CSS updates apply instantly with [Fast Refresh](https://nextjs.org/docs/architecture/fast-refresh).
- In production (`next build`), all CSS files are automatically concatenated into **many minified and code-split**`.css` files, ensuring the minimal amount of CSS is loaded for a route.
- CSS still loads with JavaScript disabled in production, but JavaScript is required in development for Fast Refresh.
- CSS ordering can behave differently in development, always ensure to check the build (`next build`) to verify the final CSS order.

Learn more about the alternatives ways you can use CSS in your application.### [Tailwind CSS v3](https://nextjs.org/docs/app/guides/tailwind-v3-css)

[

Style your Next.js Application using Tailwind CSS v3 for broader browser support.

](https://nextjs.org/docs/app/guides/tailwind-v3-css)Sass

Style your Next.js application using Sass.

[View original](https://nextjs.org/docs/app/guides/sass)CSS-in-JS

Use CSS-in-JS libraries with Next.js

[View original](https://nextjs.org/docs/app/guides/css-in-js)