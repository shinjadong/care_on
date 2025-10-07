---
title: "Getting Started: Deploying | Next.js"
source: "https://nextjs.org/docs/app/getting-started/deploying"
author:
  - "[[Vercel]]"
published:
created: 2025-09-25
description: "Learn how to deploy your Next.js application."
tags:
  - "clippings"
---
## Deploying

Next.js can be deployed as a Node.js server, Docker container, static export, or adapted to run on different platforms.

## Node.js server

Next.js can be deployed to any provider that supports Node.js. Ensure your `package.json` has the `"build"` and `"start"` scripts:

package.json

\`\`\`
{

  "scripts": {

    "dev": "next dev",

    "build": "next build",

    "start": "next start"

  }

}
\`\`\`

Then, run `npm run build` to build your application and `npm run start` to start the Node.js server. This server supports all Next.js features. If needed, you can also eject to a [custom server](https://nextjs.org/docs/app/guides/custom-server).

Node.js deployments support all Next.js features. Learn how to [configure them](https://nextjs.org/docs/app/guides/self-hosting) for your infrastructure.

### Templates

- [Flightcontrol](https://github.com/nextjs/deploy-flightcontrol)
- [Railway](https://github.com/nextjs/deploy-railway)
- [Replit](https://github.com/nextjs/deploy-replit)

## Docker

Next.js can be deployed to any provider that supports [Docker](https://www.docker.com/) containers. This includes container orchestrators like Kubernetes or a cloud provider that runs Docker.

Docker deployments support all Next.js features. Learn how to [configure them](https://nextjs.org/docs/app/guides/self-hosting) for your infrastructure.

> **Note for development:** While Docker is excellent for production deployments, consider using local development (`npm run dev`) instead of Docker during development on Mac and Windows for better performance. [Learn more about optimizing local development](https://nextjs.org/docs/app/guides/local-development).

### Templates

- [Docker](https://github.com/vercel/next.js/tree/canary/examples/with-docker)
- [Docker Multi-Environment](https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env)
- [DigitalOcean](https://github.com/nextjs/deploy-digitalocean)
- [Fly.io](https://github.com/nextjs/deploy-fly)
- [Google Cloud Run](https://github.com/nextjs/deploy-google-cloud-run)
- [Render](https://github.com/nextjs/deploy-render)
- [SST](https://github.com/nextjs/deploy-sst)

## Static export

Next.js enables starting as a static site or [Single-Page Application (SPA)](https://nextjs.org/docs/app/guides/single-page-applications), then later optionally upgrading to use features that require a server.

Since Next.js supports [static exports](https://nextjs.org/docs/app/guides/static-exports), it can be deployed and hosted on any web server that can serve HTML/CSS/JS static assets. This includes tools like AWS S3, Nginx, or Apache.

Running as a [static export](https://nextjs.org/docs/app/guides/static-exports) **does not** support Next.js features that require a server. [Learn more](https://nextjs.org/docs/app/guides/static-exports#unsupported-features).

### Templates

- [GitHub Pages](https://github.com/nextjs/deploy-github-pages)

## Adapters

Next.js can be adapted to run on different platforms to support their infrastructure capabilities.

Refer to each provider's documentation for information on supported Next.js features:

- [AWS Amplify Hosting](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components)
- [Cloudflare](https://developers.cloudflare.com/workers/frameworks/framework-guides/nextjs)
- [Deno Deploy](https://docs.deno.com/examples/next_tutorial)
- [Netlify](https://docs.netlify.com/frameworks/next-js/overview/#next-js-support-on-netlify)
- [Vercel](https://vercel.com/docs/frameworks/nextjs)

> **Note:** We are working on a [Deployment Adapters API](https://github.com/vercel/next.js/discussions/77740) for all platforms to adopt. After completion, we will add documentation on how to write your own adapters.
