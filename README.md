# Shortly URL Shortening Landing Page

A responsive landing page for the Shortly URL shortening service, built from the Frontend Mentor challenge design. The project combines a marketing-style landing page with a working URL shortener, client-side validation, persistent results, and a mobile navigation experience.

## Overview

This project recreates the Shortly landing page and adds the required interactive behavior for shortening links. Users can enter a URL, receive a shortened version, copy it to the clipboard, and revisit previously shortened links after a refresh thanks to `localStorage`.

## Features

- Responsive layout for mobile, tablet, and desktop screens
- Mobile hamburger navigation using Bootstrap collapse
- URL validation with inline error messaging
- URL shortening with an external API
- Fallback shortening flow if the primary service fails
- Copy-to-clipboard support with button state feedback
- Persistent shortened links using `localStorage`
- Accessible, semantic page structure

## Built With

- HTML5
- CSS3
- Bootstrap 5
- Vanilla JavaScript
- Google Fonts (`Poppins`)
- `is.gd` API with `CleanURI` as fallback

## My Approach

I treated the project as a static landing page first and then layered the interactivity on top.

- I built the page structure with semantic HTML sections so the layout stayed readable and easy to maintain.
- I used Bootstrap mainly for layout utilities and the responsive navbar behavior, while keeping the visual styling in a custom stylesheet so the design could closely match the challenge.
- I organized the CSS into clear sections such as design tokens, shared components, navbar, hero, form, statistics, CTA, and footer. This made it easier to style each part without mixing unrelated rules together.
- I kept the JavaScript framework-free and split it into small responsibilities: validation, storage helpers, rendering, copy behavior, and API requests.
- For reliability, the shortening logic tries `is.gd` first and falls back to `CleanURI` if the first service fails.
- I stored the most recent shortened links in `localStorage` so the user experience feels continuous even after a page refresh.

## Implementation Notes

- The app automatically normalizes URLs that do not include `http://` or `https://` by attempting to prepend `https://`.
- Shortened links are rendered dynamically into the results list and can be copied with a single click.
- Clipboard copying uses the modern Clipboard API when available and falls back to `document.execCommand("copy")` for broader support.
- The app keeps up to 10 saved links in local storage.

## Project Structure

```text
shortly/
|-- index.html
|-- css/
|   `-- style.css
|-- js/
|   `-- main.js
|-- images/
|-- README.md
`-- style-guide.md
```

## Getting Started

### Prerequisites

- A modern web browser
- Internet access for Bootstrap CDN, Google Fonts, and the shortening APIs
- A simple local server such as VS Code Live Server

### Run Locally

1. Clone or download this repository.
2. Open the project folder.
3. Start a local server from the project root.
4. Open the served URL in your browser.

Because the app makes external API requests, running it from a local server is recommended instead of opening `index.html` with `file://`.

## What I Focused On

- Matching the challenge layout closely across breakpoints
- Keeping the code readable and sectioned clearly
- Making the URL shortener feel smooth and practical to use
- Preserving results between sessions with minimal complexity
- Adding graceful fallbacks for clipboard and API behavior

## Acknowledgements

- Challenge by [Frontend Mentor](https://www.frontendmentor.io/)
- URL shortening powered by [is.gd](https://is.gd/) and [CleanURI](https://cleanuri.com/)
