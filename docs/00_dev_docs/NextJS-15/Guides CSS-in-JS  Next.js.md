---
title: "Guides: CSS-in-JS | Next.js"
source: "https://nextjs.org/docs/app/guides/css-in-js"
author:
  - "[[Vercel]]"
published:
created: 2025-09-25
description: "Use CSS-in-JS libraries with Next.js"
tags:
  - "clippings"
---
## How to use CSS-in-JS libraries

> **Warning:** Using CSS-in-JS with newer React features like Server Components and Streaming requires library authors to support the latest version of React, including [concurrent rendering](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react).

The following libraries are supported in Client Components in the `app` directory (alphabetical):

- [`ant-design`](https://ant.design/docs/react/use-with-next#using-app-router)
- [`chakra-ui`](https://chakra-ui.com/getting-started/nextjs-app-guide)
- [`@fluentui/react-components`](https://react.fluentui.dev/?path=/docs/concepts-developer-server-side-rendering-next-js-appdir-setup--page)
- [`kuma-ui`](https://kuma-ui.com/)
- [`@mui/material`](https://mui.com/material-ui/guides/next-js-app-router/)
- [`@mui/joy`](https://mui.com/joy-ui/integrations/next-js-app-router/)
- [`pandacss`](https://panda-css.com/)
- [`styled-jsx`](https://nextjs.org/docs/app/guides/#styled-jsx)
- [`styled-components`](https://nextjs.org/docs/app/guides/#styled-components)
- [`stylex`](https://stylexjs.com/)
- [`tamagui`](https://tamagui.dev/docs/guides/next-js#server-components)
- [`tss-react`](https://tss-react.dev/)
- [`vanilla-extract`](https://vanilla-extract.style/)

The following are currently working on support:

- [`emotion`](https://github.com/emotion-js/emotion/issues/2928)

> **Good to know**: We're testing out different CSS-in-JS libraries and we'll be adding more examples for libraries that support React 18 features and/or the `app` directory.

## Configuring CSS-in-JS in app

Configuring CSS-in-JS is a three-step opt-in process that involves:

1. A **style registry** to collect all CSS rules in a render.
2. The new `useServerInsertedHTML` hook to inject rules before any content that might use them.
3. A Client Component that wraps your app with the style registry during initial server-side rendering.

### styled-jsx

Using `styled-jsx` in Client Components requires using `v5.1.0`. First, create a new registry:

Then, wrap your [root layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout) with the registry:

app/layout.tsx

\`\`\`
import StyledJsxRegistry from './registry'

 

export default function RootLayout({

  children,

}: {

  children: React.ReactNode

}) {

  return (

    <html>

      <body>

        <StyledJsxRegistry>{children}</StyledJsxRegistry>

      </body>

    </html>

  )

}
\`\`\`

[View an example here](https://github.com/vercel/next.js/tree/canary/examples/with-styled-jsx).

### Styled Components

Below is an example of how to configure `styled-components@6` or newer:

First, enable styled-components in `next.config.js`.

next.config.js

\`\`\`
module.exports = {

  compiler: {

    styledComponents: true,

  },

}
\`\`\`

Then, use the `styled-components` API to create a global registry component to collect all CSS style rules generated during a render, and a function to return those rules. Then use the `useServerInsertedHTML` hook to inject the styles collected in the registry into the `<head>` HTML tag in the root layout.

Wrap the `children` of the root layout with the style registry component:

app/layout.tsx

\`\`\`
import StyledComponentsRegistry from './lib/registry'

 

export default function RootLayout({

  children,

}: {

  children: React.ReactNode

}) {

  return (

    <html>

      <body>

        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>

      </body>

    </html>

  )

}
\`\`\`

[View an example here](https://github.com/vercel/next.js/tree/canary/examples/with-styled-components).

> **Good to know**:
> 
> - During server rendering, styles will be extracted to a global registry and flushed to the `<head>` of your HTML. This ensures the style rules are placed before any content that might use them. In the future, we may use an upcoming React feature to determine where to inject the styles.
> - During streaming, styles from each chunk will be collected and appended to existing styles. After client-side hydration is complete, `styled-components` will take over as usual and inject any further dynamic styles.
> - We specifically use a Client Component at the top level of the tree for the style registry because it's more efficient to extract CSS rules this way. It avoids re-generating styles on subsequent server renders, and prevents them from being sent in the Server Component payload.
> - For advanced use cases where you need to configure individual properties of styled-components compilation, you can read our [Next.js styled-components API reference](https://nextjs.org/docs/architecture/nextjs-compiler#styled-components) to learn more.
