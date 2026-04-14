# Shortly – URL Shortening Landing Page

![Shortly preview](../preview.jpg)

## Overview

A responsive landing page for **Shortly**, a URL shortening service. Built as a [Frontend Mentor](https://www.frontendmentor.io) challenge.

## Features

- Shorten any valid URL using the [CleanURI API](https://cleanuri.com/docs)
- Shortened links persist across page refreshes (localStorage)
- Copy any shortened link to the clipboard in one click
- Responsive layout — optimised for 375px (mobile) through 1440px (desktop)
- Empty-input validation with inline error messaging
- Mobile hamburger navigation

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Structure | HTML5 (semantic) | Clean, accessible markup |
| Layout & responsiveness | Bootstrap 5 (CDN) | Grid system + navbar utilities |
| Styling | Vanilla CSS (`css/style.css`) | Full control, no utility-class bloat |
| Behaviour | Vanilla JavaScript (`js/main.js`) | No framework overhead needed |
| Font | Poppins (Google Fonts) | Matches design spec exactly |
| API | CleanURI `POST /api/v1/shorten` | Free, no auth required |

## Approach

1. **Scaffold first** – semantic HTML shell before any styling
2. **Design tokens upfront** – all colours and type set as CSS custom properties
3. **Mobile-first** – base styles target 375 px, then scale up with `min-width` media queries
4. **Progressive enhancement** – page is readable even without JS; JS adds the interactive shortening layer
5. **Atomic commits** – each feature phase is its own commit so the git history tells the story

## Project Structure

```
shortly/
├── index.html          # Single-page app shell
├── css/
│   └── style.css       # All custom styles (design tokens → components → sections)
├── js/
│   └── main.js         # API calls, DOM rendering, clipboard, localStorage
└── images/             # All SVG / PNG assets
```

## Running Locally

No build step required. Open `index.html` directly in a browser, or use the VS Code **Live Server** extension.

## Author

- Frontend Mentor profile – [@YourHandle](https://www.frontendmentor.io/profile/YourHandle)
- GitHub – [@YourHandle](https://github.com/YourHandle)
