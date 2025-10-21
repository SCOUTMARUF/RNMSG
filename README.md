# Project README

## API Keys

This project does not use any API keys. It is a static website that can be run without any special configuration or secrets. The images are loaded from public URLs, which is standard practice and does not involve API keys.

## How to Deploy to Blogger

Deploying a modern JavaScript application built with React to Blogger is a complex process because Blogger is not designed to host this kind of website. It requires converting the entire application into a single HTML file.

The current project uses modern features like JSX (the syntax used for building components) and ES Modules, which require a **"build step"** to be converted into a format that all web browsers can understand. This project is not set up with a build tool, which makes it very difficult to deploy to a platform like Blogger.

### What is a "Build Step"?

A build step uses tools (like Vite or Webpack) to:
1.  Compile JSX/TypeScript code into plain JavaScript.
2.  Bundle all separate JavaScript files into one or a few optimized files.
3.  Process CSS files.
4.  Inject the final CSS and JavaScript file links into the `index.html`.

The result is a `dist` or `build` folder containing simple static files that can be hosted anywhere.

### Why this is difficult for Blogger

1.  **No Build Process:** This project lacks a configured build process. It cannot be easily converted into the simple format Blogger needs.
2.  **Hosting Assets:** Blogger is not designed to host the JavaScript files (`.js`) and other assets that a web application needs. You would have to host them on a separate service and link to them, which is complicated to manage.

### Recommended Alternatives

For hosting this kind of application, we strongly recommend using a modern hosting platform that is designed for it. These platforms will automatically handle the build process and make deployment very easy.

Popular free options include:
*   **Netlify:** [https://www.netlify.com/](https://www.netlify.com/)
*   **Vercel:** [https://vercel.com/](https://vercel.com/)
*   **GitHub Pages:** [https://pages.github.com/](https://pages.github.com/)

Using one of these services will provide a much better and more reliable experience for both you and your website's visitors.