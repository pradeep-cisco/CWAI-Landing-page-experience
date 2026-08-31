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
`col`: Column width for container cards in dashboard grids. Semantic fractions with smart responsive defaults: '1/4' (quarter), '1/3' (third, default), '1/2' (half), '2/3' (two-thirds), '3/4' (three-quarters), 'full' (full width). Cards auto-expand on smaller screens. ('1/4' | '1/3' | '1/2' | '2/3' | '3/4' | 'full')
`container`: Container card (boolean)
`disabled`: for interactive cards, set to true to disable (boolean)
`selectable`: selectable card (boolean)
`selected`: card selected state (boolean)
`sentiment`: Sentiment determines the top border accent color. Cards with sentiment accents are typically paired with a status tag for accessibility purposes. (string)
