# X9Elysium

Shopify unified commerce consulting — audits, custom integrations, migrations, and growth strategy for ambitious retailers.

**Live site:** [x9elysium.com](https://x9elysium.com)

## Tech Stack

- **Framework:** Next.js 15 (App Router) + Next.js 14 (Pages Router for legacy routes)
- **Language:** TypeScript (new pages), JavaScript (legacy)
- **Styling:** Tailwind CSS 3
- **Animations:** Framer Motion
- **Icons:** lucide-react
- **Fonts:** Inter (via next/font)
- **Content:** Markdown + MDX (blog posts)

## Getting Started

```bash
npm install
npm run dev
```

Opens at [localhost:3000](http://localhost:3000).

## Project Structure

```
app/                    # New App Router (homepage, new pages)
  components/           # React components (Navigation, Hero, Services, etc.)
  globals.css           # Tailwind directives + custom utility classes
  layout.tsx            # Root layout (fonts, metadata)
  page.tsx              # Homepage
pages/                  # Legacy Pages Router (blog, about, etc.)
config/                 # Site configuration (JSON)
content/                # Markdown content (pages, blog posts)
public/images/          # Static assets
styles/                 # Legacy SCSS styles
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Design

Dark-mode premium aesthetic with:
- Near-black background (`#09090b`)
- Indigo + teal accent gradients
- Inter typeface with bold, tight-tracked headings
- Framer Motion scroll-reveal animations
- Responsive mobile-first layout
