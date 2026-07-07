export const themes = [
  {
    id: "aura-saas",
    name: "Aura SaaS",
    description: "Sleek, futuristic software interface with deep neon glows, smooth spring animations, and high contrast typography.",
    category: "SaaS",
    tags: ["Dark Mode", "Neon Glow", "Modern Tech", "Soft Glass"],
    fonts: {
      heading: "Outfit",
      body: "Inter"
    },
    colors: {
      bg: "linear-gradient(180deg, #09090b 0%, #030303 100%)",
      primary: "#8b5cf6", // Violet
      secondary: "#06b6d4", // Cyan
      accent: "#f43f5e", // Rose
      stroke: "rgba(255, 255, 255, 0.08)",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)"
    },
    prompts: {
      designSystem: `Build a modern Next.js + Tailwind CSS landing page design system with a premium, dark-mode tech aesthetic.
- Colors: Deep pitch-black background (#030303), Slate-950 surfaces (#09090b), Violet-500 primary (#8b5cf6), Cyan-500 secondary (#06b6d4), Rose-500 accent (#f43f5e).
- Typography: Use Google Fonts. Header font is 'Outfit' (sans-serif, bold, tight tracking). Body font is 'Inter' (clean, neutral, readable).
- Theme: Dark Mode by default.
- Accents: Glassmorphism with 'backdrop-filter: blur(16px)' and subtle border strokes ('rgba(255, 255, 255, 0.08)').
- Animations: Smooth transitions using Framer Motion or clean CSS keyframes. Add a subtle floating animation on interactive cards.`,
      hero: `Create a high-impact, premium Hero Section.
- Background: Pitch dark with an animated radial gradient light source centering on the main CTA. Add a grid pattern background using a subtle SVG mask.
- Header/Navbar: Floating glassmorphic navigation bar (Logo, Features, Pricing, Testimonials, CTA button). Must blur the background on scroll.
- Hero Content:
  - An eyebrow pill with a glowing violet border: "Now in Public Beta".
  - Main Title: "Supercharge Your Dev Workflow with Aura AI" in bold Outfit font, with "Aura AI" styled as a gradient text clipping (Violet to Cyan).
  - Subtitle: "The context-aware coding partner that transforms raw ideas into production-ready repositories in seconds."
  - CTA Group: A primary glowing button with a spring-scale click effect, and a secondary glass button with arrow-right hover translate.
- Interactive Element: Below the CTAs, show a mock visual of the tool interface in a dark glass frame, with glowing green/violet ambient shadows behind it.`,
      features: `Design a features section using a 3-column interactive Bento Grid.
- Layout: Asymmetric Bento grid layout with 4 key features:
  - Feature 1 (Large - 2 columns): "Real-time Collaboration" with an interactive mock terminal screen showing simulated multi-user code updates.
  - Feature 2 (Small - 1 column): "High Performance" with a radial progress indicator and speedometer graphics.
  - Feature 3 (Small - 1 column): "Secure-by-Design" with floating keycards and locks using lucide-react icons.
  - Feature 4 (Large - 2 columns): "Automatic Deployments" featuring a timeline tree diagram indicating push-to-production workflows.
- Visuals: Glass cards with fine borders, hover scale-up, and localized glowing mouse-follow cursor spotlights.`,
      pricing: `Create a gorgeous three-tier Pricing Section.
- Toggle: A smooth, pill-shaped selector for Monthly / Annually with a sliding glass active state, offering a 20% discount on annual plans.
- Pricing Cards:
  - Hobby (Free): Clean card, gray accents.
  - Pro (Most Popular - $29/mo): Glowing purple border, a floating "Popular" tag, a pulse animation on the buy button, and a gradient background glow.
  - Enterprise (Custom): Darker glass card with bold typography and a custom contact sales button.
- Details: Under the price, list the features clearly with checkmarks that highlight green on hover. Include a comparative checklist for core features.`,
      cta: `Create a dramatic, immersive Call-To-Action (CTA) footer section.
- Layout: Large glassmorphic panel spanning 100% width with rounded corners and a deep violet radial glow emerging from behind.
- Content:
  - Heading: "Ready to build the future?"
  - Subtext: "Join over 10,000 developers building at the speed of thought."
  - Input: Inline email input field with glass background and glowing focus border, and a "Get Started Free" button.
- Footer Links: A minimalist grid below featuring logo, sitemap links, and social icons, with soft hover fades on link text.`
    }
  },
  {
    id: "minimalist-arch",
    name: "Minimalist Arch",
    description: "Brutalist and highly editorial layout combining sophisticated warm stone tones, bold serif typography, and generous negative space.",
    category: "Portfolio",
    tags: ["Light Mode", "Brutalist", "Editorial", "Sophisticated"],
    fonts: {
      heading: "Playfair Display",
      body: "Plus Jakarta Sans"
    },
    colors: {
      bg: "linear-gradient(180deg, #fbfaf8 0%, #f4f2ee 100%)",
      primary: "#1c1917", // Stone 900
      secondary: "#78716c", // Stone 500
      accent: "#b45309", // Amber 700
      stroke: "rgba(28, 25, 23, 0.1)",
      gradient: "linear-gradient(135deg, #1c1917 0%, #78716c 100%)"
    },
    prompts: {
      designSystem: `Build a highly editorial, minimalist design system with a museum/architectural aesthetic.
- Colors: Warm paper/stone background (#fbfaf8), dark charcoal typography (#1c1917), muted warm-gray borders and secondary text (#78716c), with optional rich terracotta/amber accents (#b45309).
- Typography: Large serif headings using 'Playfair Display' (classic, high-contrast, elegant italic options). Body text uses 'Plus Jakarta Sans' (highly legible, geometric, wide letterspacing).
- Feel: Spacious layout, high-contrast borders, solid shadows rather than blurs, elegant editorial feel, and smooth page transition reveals.`,
      hero: `Create a minimal, editorial Hero Section.
- Layout: Minimalist navbar with text-only links ("Work", "Studio", "Journal", "Contact") separated by elegant hairline dividers.
- Typography Focus:
  - Title: Extremely large display text in Playfair Display: "Curating Space, Form, & Light."
  - Split Column: A two-column grid. Left side has a short introductory paragraph in Plus Jakarta Sans ("An architectural studio crafting silent spaces in a noisy world"). Right side has a large black-and-white minimalist architecture image.
- Navigation/CTA: A single underline link: "Explore projects" which animates its underline width on hover. No flashy gradients or neon colors.`,
      features: `Design a projects list/grid section.
- Layout: Asymmetrical split list of projects. Each project expands or displays a larger thumbnail on hover.
- Items:
  - Project 01: "The Desert Pavilion" — Stone, Arizona (Large photo, text bottom-left).
  - Project 02: "Brutalist Oasis" — Concrete, Berlin (Wide photo, text bottom-right).
  - Project 03: "Lightwell Apartment" — Wood, Tokyo (Vertical photo, text top-left).
- Interactions: Hovering a project reveals a small text block about materials used and an elegant slide-in image transition. Modern image scale/zoom hover transitions.`,
      pricing: `Create an elegant, minimal pricing/inquiry grid.
- Layout: Two columns.
  - Left column: Consultation details, fixed pricing for standard design packages, timeline projections.
  - Right column: An interactive consultation inquiry form with custom clean text inputs.
- Styling: Plain black borders (1px) with solid grid lines, minimal form inputs that change color to charcoal on focus, and a solid black submission button.`,
      cta: `Create a silent, high-end closing/contact section.
- Content:
  - Main Heading: "Start a conversation."
  - Link: Large display email address (e.g., hello@archstudio.com) in Playfair Display that expands its font-weight or tracks letters outward on hover.
  - Footer: Location coords (e.g., "35.6762° N, 139.6503° E") and current local time indicator (GMT+9).`
    }
  },
  {
    id: "retro-cyber",
    name: "Retro Cyber",
    description: "Retro-futuristic terminal styling with neo-brutalist outlines, bright neon green accents, and monospace developer tools.",
    category: "Retro/Creative",
    tags: ["Neobrutalist", "Cyberpunk", "Terminal", "Monospace"],
    fonts: {
      heading: "Space Grotesk",
      body: "JetBrains Mono"
    },
    colors: {
      bg: "linear-gradient(180deg, #0c0f12 0%, #050708 100%)",
      primary: "#39ff14", // Neon Green
      secondary: "#00f0ff", // Neon Cyan
      accent: "#ffff00", // Bright Yellow
      stroke: "#1f2937",
      gradient: "linear-gradient(135deg, #39ff14 0%, #00f0ff 100%)"
    },
    prompts: {
      designSystem: `Build a retro-futuristic, cyber-terminal design system.
- Colors: Dark terminal-black background (#0c0f12), bright fluorescent neon-green (#39ff14), cyan details (#00f0ff), and cyber yellow highlights (#ffff00).
- Typography: Headers are in 'Space Grotesk' (tech, sharp, bold). Body text is in 'JetBrains Mono' (monospace, command-line coding font).
- Style: Solid pixel borders (2px solid #39ff14 or #1f2937), neon drop-shadows (no blur, just offset black or neon blocks), retro scanline overlay on images, and CLI-inspired command prompts.`,
      hero: `Create a terminal-themed Command Line Hero Section.
- Frame: The entire section is enclosed inside a retro OS application window with window control buttons (Close, Minimize, Maximize) on the top-left.
- Content:
  - Terminal Text Output: Simulated typewrite animation printing out boot sequence, system logs, and a command prompt.
  - Interactive CLI Input: A mock terminal command line showing: "guest@cyber-os:~$ run build-website"
  - Interactive action: Clicking the terminal window triggers a boot sound effect (using Web Audio API) or visual screen-glitch distortion effect.
- Core Titles: Beside the terminal window, show a huge Neobrutalist Title: "HACK THE WEB." in neon green with a thick black shadow.`,
      features: `Design a grid of developer utility panels.
- Layout: 4 retro-themed panels (styled like disk drives or hardware modules).
  - Module A: "CPU core allocation" with a live-animated retro bar graph.
  - Module B: "Encrypted transfer" showing a file dropzone with green binary matrix fall animation.
  - Module C: "API proxy wrapper" with copy-pasteable script commands.
  - Module D: "Custom config compiler" with toggle switches.
- Styling: Solid green borders, command prompt symbols (\`>\`) before headings, and hover animations that invert colors.`,
      pricing: `Create an arcade-machine themed Pricing Module.
- Interface: Designed like an arcade selector screen with insert-coin triggers.
  - Plan 1: "INSERT COIN" ($0) — Basic developer access.
  - Plan 2: "DOUBLE UP" ($16) — Team node license with neon highlight.
  - Plan 3: "UNLIMITED LIVES" ($99) — Lifetime enterprise support.
- Interactions: Selected plan is highlighted with flashing neon green borders and pixelated text blinking "PLAYER 1 READY".`,
      cta: `Create a terminal shutdown sequence CTA.
- Content: A scrolling feed of active matrix terminal streams.
- Main Input: A single prompt "ENTER LICENSE KEY:" with a flashing block cursor.
- Footer: Retro copyright notice, green console log output summary: "System running at 100% operational capacity."`
    }
  },
  {
    id: "glass-creative",
    name: "Glassmorphic Agency",
    description: "Highly polished, frosted glass card layouts overlaid on organic, moving gradient backgrounds for modern creative agencies.",
    category: "Creative Agency",
    tags: ["Glassmorphic", "Organic Gradients", "Liquid UI", "Fluid Motion"],
    fonts: {
      heading: "Cal Sans",
      body: "Inter"
    },
    colors: {
      bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)",
      primary: "#38bdf8", // Sky Blue
      secondary: "#ec4899", // Pink
      accent: "#a855f7", // Purple
      stroke: "rgba(255, 255, 255, 0.12)",
      gradient: "linear-gradient(135deg, #38bdf8 0%, #ec4899 100%)"
    },
    prompts: {
      designSystem: `Build a premium glassmorphic creative agency landing page design system.
- Background: Dynamic liquid gradient background using floating blurred colorful mesh spheres (Indigo, Deep Purple, Sky Blue, Magenta) shifting positions.
- Colors: Frosted translucent surface backgrounds (rgba(255, 255, 255, 0.05)), glowing border strokes (rgba(255, 255, 255, 0.15)), white text, and glowing neon pink/sky-blue accent buttons.
- Typography: Headers are in 'Cal Sans' (semi-geometric, bold, clean). Body text is in 'Inter'.
- Style: Heavy use of backdrop-filter blur (20px to 40px), drop-shadows with low opacity but wide radii, and ultra-fluid transitions.`,
      hero: `Create a majestic, blurred glass Hero Section.
- Background: A massive rotating, blurred pink-to-blue gradient orb directly behind the center of the viewport.
- Navbar: Frosted pill shape floating on top, holding simple links and a "Start Project" glass button with a pink glowing drop-shadow.
- Content:
  - Main Title: "We Craft Fluid Digital Experiences" in Cal Sans, with "Digital Experiences" clipping a smooth, slowly shifting gradient.
  - Description: "An award-winning studio creating immersive, high-conversion websites for progressive brands worldwide."
  - CTAs: Dual glass buttons that scale up on hover. The main button has a subtle border reflection effect.
- Media: A gorgeous floating 3D glass ring layout showing mock creative assets.`,
      features: `Design a fluid 2-column showcase of creative services.
- Layout: Alternating grid blocks displaying core capabilities:
  - Block 1: "Immersive Motion UI" with glass toggle elements that change the background gradient speed when clicked.
  - Block 2: "Interactive WebGL Art" showing a mock canvas interactive layout.
  - Block 3: "Conversion Design" showcasing animated charts inside frosted panels.
  - Block 4: "Next-Gen Frontend" showing code cards that glow under the mouse.
- Interactivity: Cards pivot slightly depending on the mouse pointer location (3D tilt hover effect).`,
      pricing: `Create a frosted-glass Pricing Card comparison.
- Layout: Glass cards stacked horizontally.
  - Starter: Frosted glass card with simple details.
  - Professional: Higher transparency card, bordered by a glowing multi-color gradient border, and an glowing hover glow overlay.
  - Premium: Solid frosted panel with dark highlights.
- Highlight: The mouse hover draws a spotlight circle that clears the card blur locally to reveal a sharper view.`,
      cta: `Create a dynamic, floating CTA card at the bottom.
- Card: Floating frosted capsule, holding a glowing email container.
- Content: "Let's build something unforgettable."
- Action: "Book a Discovery Call" button with double gradient rings rotating behind the border.`
    }
  },
  {
    id: "bento-ecommerce",
    name: "Bento E-Commerce",
    description: "Modern, grid-based interface layout optimized for physical products, featuring warm organic colors, round buttons, and clean product slots.",
    category: "E-commerce",
    tags: ["Bento Grid", "Warm Organic", "Product Display", "Clean Minimal"],
    fonts: {
      heading: "Syne",
      body: "Cabinet Grotesk"
    },
    colors: {
      bg: "linear-gradient(180deg, #fdfbf7 0%, #f5efe6 100%)",
      primary: "#292524", // Stone 800
      secondary: "#ea580c", // Orange 600
      accent: "#0d9488", // Teal 600
      stroke: "rgba(41, 37, 36, 0.06)",
      gradient: "linear-gradient(135deg, #292524 0%, #ea580c 100%)"
    },
    prompts: {
      designSystem: `Build a clean, bento-grid based e-commerce layout design system.
- Colors: Soft oatmeal warm background (#fdfbf7), deep charcoal for text and primary cards (#292524), hot orange (#ea580c) for highlights and buttons, and teal (#0d9488) for badges.
- Typography: Headers are in 'Syne' (wide, stylish, modern, creative). Body/Details are in 'Cabinet Grotesk' or standard clean geometric sans-serif.
- Style: Round pill shapes (border-radius: 9999px), grid cells with border-radius: 24px, subtle shadows, and clean, high-contrast imagery.`,
      hero: `Create a Product Hero layout featuring a Bento Grid structure.
- Grid Layout: A 4x4 grid workspace.
  - Cell A (Large - 2x2): High-quality product spotlight image with a circular rotating badge "Item of the Month".
  - Cell B (Wide - 2x1): Hero Title: "Crafted for Daily Comfort" in Syne font, and description with an orange "Shop Now" pill button.
  - Cell C (Tall - 1x2): A slider showing different color variants of the product (Sand, Slate, Rust) changing background colors on click.
  - Cell D (Small - 1x1): Fast shipping badge with a truck icon.
  - Cell E (Small - 1x1): Customer review score (4.9 stars) with floating avatars.`,
      features: `Design a grid of product features/materials.
- Layout: Bento box cells explaining product superiority:
  - Cell 1: "100% Organic Cotton" with a close-up texture image.
  - Cell 2: "Waterproof Coating" showing animated rain drops bouncing off a mock jacket card.
  - Cell 3: "Zero Carbon Shipping" showing a green leaf badge and local delivery offset stats.
  - Cell 4: "Lifetime Repair Guarantee" with an interactive card showing a sewing thread needle graphic.`,
      pricing: `Create an interactive product purchase block.
- Details: Product price tag ($89) in large Syne typography, size selector (S, M, L, XL) with round button pills, color swatches.
- Cart Action: A huge orange "ADD TO BAG" button that transforms into a loading checkmark on click, and updates a floating cart badge in the header.`,
      cta: `Create a newsletter discount block.
- Card: Warm cream background, rounded layout.
- Offer: "Get 15% off your first order."
- Input: Rounded text input and a simple submit arrow, clean grid-aligned footer links below.`
    }
  },
  {
    id: "solar-web3",
    name: "Solar Web3",
    description: "Deep charcoal interface with dark amber glows, high-contrast digital stats, and interactive blockchain component layouts.",
    category: "Web3",
    tags: ["Solar Gold", "Dark Mode", "Blockchain", "Digital Stats"],
    fonts: {
      heading: "Claria",
      body: "Geist"
    },
    colors: {
      bg: "linear-gradient(180deg, #08080a 0%, #020203 100%)",
      primary: "#f59e0b", // Amber 500
      secondary: "#ef4444", // Red 500
      accent: "#10b981", // Emerald 500
      stroke: "rgba(245, 158, 11, 0.08)",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"
    },
    prompts: {
      designSystem: `Build a futuristic Web3 interface design system.
- Colors: Deep outer-space black background (#020203), dark slate slate-900 card surfaces (#08080a), glowing solar gold (#f59e0b) as the primary theme, red accents (#ef4444) for alerts, and emerald green (#10b981) for success metrics.
- Typography: Headers are in 'Claria' or high-contrast tech fonts. Body text is in 'Geist' or 'Geist Mono' for numbers.
- Style: Glowing border lines, thin neon gradients, interactive charts, cyber grid backgrounds, and particle glow layers.`,
      hero: `Create a futuristic DeFi dashboard Hero Section.
- Background: Dark matrix grid with a large golden solar corona glow in the center-left.
- Dashboard Element: A glassmorphic trade console panel containing:
  - Token selector dropdown (ETH, SOL, ATOM).
  - High-fidelity stats: "Total Value Locked: $1,402,892,109" (numbers counting up on load).
  - Graph: Sparkline style active charts showing real-time price fluctuations.
- Text: Bold title "Decentralized Liquidity, Solar Speed" in Claria font, and a gold button "Connect Wallet" with rotating border outline gradients.`,
      features: `Design a grid of protocol specifications.
- Layout: 3 technical cards:
  - Card 1: "Smart Contract Safety" showing certified audit badges and floating lock graphics.
  - Card 2: "Instant Settlement" showing active throughput stats (TPS: 65,000) with a live progress indicator.
  - Card 3: "Staking Pool Yields" showing an interactive APY slider where user increases staking lock time and sees yield grow dynamically.`,
      pricing: `Create a transaction cost breakdown / fees calculator panel.
- Columns: Side-by-side comparison of gas fee metrics.
  - Left side: Conventional network transaction fee comparison (high price bars in red).
  - Right side: Solar Network fee comparison (virtually zero, glowing gold bar).
- Action: "Stake Now to Reduce Fees" interactive button with pulsing gold shadow.`,
      cta: `Create a newsletter and community block.
- Cards: Grid of boxes featuring social channel banners (Discord, Telegram, Twitter) with golden borders.
- Input: Email subscription input box with a golden submit button that flashes on hover.`
    }
  }
];
