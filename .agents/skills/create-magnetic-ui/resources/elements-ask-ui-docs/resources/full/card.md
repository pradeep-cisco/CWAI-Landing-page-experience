# Card

Card is implemented using the web component: <hbr-card>.

## Description
Container grouping related content and actions.

## Generation Guidance
# CARD USAGE GUIDE

Cards group related information in flexible containers.
There are two main types of cards in the Magnetic Design System:

1. **Basic Cards** – for simple content, status, statistics, or health summaries (see `card-basic.md`).
2. **Container Cards** – for complex content layouts with multiple sections (see `card-container.md`).

Treat spacing between multiple card children as required structure. Use an explicit `hbr-layout` with a documented `gap` value inside the card.

## Capabilities
- card-basic: Basic card: simple container for related content. Used for small, self-contained pieces of content like status indicators, summaries, or key metrics.
- card-container: Container card: larger card that can contain multiple sections or components. Used for page-level groupings of related content, such as dashboard widgets or detailed views.

## API Reference

### Props
`aria`: Attributes related to screen readers. ({ labelledby: string; })
`arialabelledby`: Accessibility aria-labelledby attribute  - deprecate candidate. Use "aria={arialabelledby: value}" prop instead. (string)
`col`: Column span for container cards in dashboard grids.
Semantic fractions that map to responsive data-col-span attributes.
- "1/4": quarter width (3 cols desktop, 6 tablet, 12 mobile)
- "1/3": third width (4 cols desktop, 6 tablet, 12 mobile)
- "1/2": half width (6 cols desktop, 12 tablet, 12 mobile)
- "2/3": two-thirds (8 cols desktop, 12 tablet, 12 mobile)
- "3/4": three-quarters (9 cols desktop, 12 tablet, 12 mobile)
- "full": full width (12 cols at all breakpoints) ("1/2" | "1/3" | "1/4" | "2/3" | "3/4" | "full")
`container`: Container card (boolean)
`disabled`: for interactive cards, set to true to disable (boolean)
`selectable`: selectable card (boolean)
`selected`: card selected state (boolean)
`sentiment`: Sentiment determines the top border accent color. Cards with sentiment accents are typically paired with a status tag for accessibility purposes. (string)
`span`: Systematically set responsive column spans ({ base: number; sm: number; xs: number; })
`tabIndexNumber`:  (number)

### Slots
`[default]`: The card's body.
`footer`: The card's footer.
`header`: The card's header
`image`: The card's image.

### Custom CSS Properties
--body-padding: The body's padding.
--border: The card's border properties
--border-color: The card's border color, including borders that occur inside the card.
--border-radius: The border radius for card edges.
--border-width: The width of card borders.
--footer-padding: The footer's padding.
--header-padding: The header's padding.
--height: The card's height
--max-height: maximum height
--max-width: maximum width
--min-height: minimum height
--min-width: minimum width
--selected-border: Selected border style
--sentiment-color: header accent color
--width: The card's width

### Parts
`accent`
`base`: The component's base wrapper.
`body`: The card's body.
`footer`: The card's footer, if present.
`header`: The card's header, if present.
`image`: The card's image, if present.
