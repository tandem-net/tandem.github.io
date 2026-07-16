# Tandem — landing page

Marketing site for **Tandem**: cloud hosting by developers, for developers.
Tandem pools storage and compute across a network of everyday machines — a
cheap, open alternative to large managed providers.

Live at **[tandemize.app](https://tandemize.app)**.

## What this is

A framework-free static site: hand-authored HTML/CSS with a small vanilla-JS
sprinkle for the scroll animations. No build framework, no runtime dependencies.

It was generated from the **Tandem Design System** (a Claude Design project) —
specifically the `templates/landing-page/LandingPage.dc.html` component. The
design tokens and component primitives it depends on were imported into
`styles.css`.

```
index.html      # the page markup
styles.css      # design tokens + tnd-* component primitives + base reset
landing.css     # page-scoped .lp-* styles (hero, ticker, steps, finale)
main.js         # scroll reveal, terminal typing, finale word-roller
assets/mark.svg # brand mark (also the favicon)
build.js        # copies the site into ./build for deploy
scripts/serve.js# tiny local static server
```

## Develop

```bash
npm start        # build, then serve ./build at http://localhost:3000
```

Or just open `index.html` directly in a browser.

## Build

```bash
npm run build    # emits ./build (what GitHub Pages publishes)
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs
`npm run build` and publishes `./build` to GitHub Pages on the `tandemize.app`
domain. No dependencies are installed for the build itself — it's plain Node.

## Design system

The visual language (neobrutalist: 2px navy ink borders, hard offset shadows,
warm cream paper, brand red `#CC2936` on navy `#001550`) lives in the Tandem
Design System project. To evolve the look, update the tokens there and re-import
into `styles.css`.
