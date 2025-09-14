<h1>
    <picture>
        <img alt="GDG Logo" src="./public/gdg-logo.png" height="34">
    </picture>
    GDG Website
</h1>

Google Developer Group (GDG) at University of Toronto Scarborough - An open-source student-led community focused on building technology solutions and fostering developer growth through workshops, projects, and collaboration.

## About The Project

This is the official website for the University of Toronto Scarborough Google Developer Group. Built with Next.js 15, TypeScript, Tailwind CSS v4, and Firebase, featuring modern development practices and comprehensive tooling for student developers.

## Features

- **MCP Server**: Model Context Protocol server for admin integrations
- **Custom CMS**: Content management system for events, projects, and more
- **Resume AutoRanker API**: Automated resume evaluation service

## Getting Started

Run the startup script to install dependencies and start development:

```bash
sh startup.sh
```

This will:

- Install Firebase CLI tools
- Install project dependencies
- Start the Next.js development server (localhost:3002)

**⚠️ Important:** Do not change the port from 3002 to 3000 as the pdf service worker and firebase worker configurations WILL cause conflicts with other projects that you might run on 3000. (Clearing browser cache fixes this)

## Development Commands

```bash
npm run build:worker # Build the worker for Firebase SSR
```

## Contributing

We welcome contributions from students and developers! This is an open-source project designed to help the GDG community learn and grow together.

### Development Guidelines

- Follow the existing code style and TypeScript conventions
- Test your changes with the development server
- Ensure your code is accessible and responsive
- Update documentation if needed

Questions? [Open a GitHub issue](https://github.com/GDSC-UTSC/gdg-website/issues) or reach out to the GDG UofT Scarborough team!
