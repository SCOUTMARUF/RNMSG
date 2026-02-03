# Rajosik Natore Mukto Scout Group (RNMSG) Website

This project is a React application built with TypeScript and Vite, styled with Tailwind CSS. It is fully configured for deployment on GitHub Pages.

## Prerequisites

- Node.js (v16 or higher)
- npm (installed with Node.js)
- A GitHub account

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/<your-username>/<your-repo-name>.git
    cd <your-repo-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Open your browser to the URL shown (usually `http://localhost:5173`).

## Deployment to GitHub Pages

This project is configured to use the `gh-pages` package for deployment.

1.  **Initialize Git (if not already done):**
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create a Repository on GitHub:**
    - Go to GitHub and create a new public repository.
    - Don't check "Initialize with README" or "gitignore" as we already have them.

3.  **Link your local repo to GitHub:**
    ```bash
    git branch -M main
    git remote add origin https://github.com/<your-username>/<your-repo-name>.git
    git push -u origin main
    ```

4.  **Deploy:**
    Run the following command to build the project and push it to the `gh-pages` branch on GitHub:
    ```bash
    npm run deploy
    ```

5.  **Configure GitHub Pages:**
    - Go to your repository **Settings** on GitHub.
    - Click on **Pages** in the left sidebar.
    - Under **Build and deployment**, ensure **Source** is set to "Deploy from a branch".
    - Under **Branch**, select `gh-pages` and `/ (root)`.
    - Save.

Your site will be live at `https://<your-username>.github.io/<your-repo-name>/`.

## Project Structure

- **src/**: Source code (entry point `index.tsx` is in the root for this specific setup, but Vite handles it).
- **vite.config.ts**: Configuration for Vite, set up for relative base paths.
- **package.json**: Dependency management and scripts.
- **index.html**: Main entry HTML file.
