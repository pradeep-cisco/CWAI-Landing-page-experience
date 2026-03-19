# Nodes

A list of design system nodes grouped by type with their descriptions.

## Templates

- **dashboard**: Dashboard layout using hbr-layout variants for responsive widget grids.
- **form-multi-section**: Multi-section form template. Use when form has multiple distinct sections (e.g., Basic Info, Preferences, Settings). Sticky action bar goes OUTSIDE sections at the form level.
- **form**: Single-section form template. Use when form has one logical group of fields. Sticky action bar goes INSIDE the section.

## Components

- **accordion**: Expandable list that shows or hides sections of related content.
- **anchor-link-menu**: Menu of in‑page anchor links for quick section navigation.
- **bar-chart-horizontal**: horizontal bar chart for comparing discrete values among categories
- **bar-chart**: vertical bar chart for comparing discrete values among categories
- **breadcrumb-item**: Breadcrumb items are used as children of hbr-breadcrumb.
- **breadcrumb**: Navigation trail showing the user's hierarchical location.
- **button**: Primary interactive element triggering an immediate action.
- **card-basic**: Basic card: simple container for related content. Used for small, self-contained pieces of content like status indicators, summaries, or key metrics.
- **card-container**: Container card: larger card that can contain multiple sections or components. Used for page-level groupings of related content, such as dashboard widgets or detailed views.
- **card**: Container grouping related content and actions.
- **checkbox-group**: Group of checkboxes for selecting multiple options.
- **checkbox**: Binary selection control allowing multiple independent choices.
- **code-snippet**: Preformatted code block with optional copy affordances.
- **copy-to-clipboard**: Element that displays the provided text value and a button that copies the text value to the clipboard.
- **date-picker**: hbr-input with type='date' for selecting dates.
- **divider**: Thin rule separating groups of content.
- **donut-chart**: Graph showing parts of a whole as segments of a circle, with a central cutout.
- **drawer**: Panel that slides in from an edge to reveal supplemental content.
- **dropdown**: Trigger and panel pattern for choosing an action or option list.
- **empty-state**: Message and visuals shown when a dataset has no items.
- **filter**: Composable bar of inputs for narrowing a data set. Used within tables and occasionally other data-driven components to filter the data. Displays as a responsive row of inputs.
- **footer**: Page or section footer area with supporting links or actions.
- **header**: Application shell header with branding, navigation and global actions.
- **heatmap-chart**: Visual representation of data using color intensity to show patterns and relationships across two dimensions. Used for cross-examination of data.
- **highlight**: Inline wrapper emphasizing matched or important text.
- **icon**: Visual symbol representing an action, object, state, or status.
- **illustration**: Decorative or explanatory graphic asset.
- **input**: Single-line text or number entry field.
- **key-value-pairs**: Displays labeled data pairs using semantic dl/dt/dd markup. Automatically styles dt (secondary text) and dd (primary text) elements. Multiple dl elements create a grouped layout with consistent spacing.
- **layout**: Semantic layout primitive for structuring UI blocks. Provides flex and grid layouts with consistent spacing and alignment. Use semantic variants for common page patterns (page, form, dashboard), or set primitive props (display, direction, gap, align) for custom layouts. Variants configure layout presets - explicit props override variant defaults.
- **line-chart**: Chart displaying data points connected by lines to show trends and changes over time or continuous variables.
- **link**: Navigational text element linking to another location.
- **list-item**: Item within a list providing aligned content and optional interaction.
- **list**: Semantic list container for grouped list items.
- **matrix**: Chart for comparing information between multiple categories, across two dimensions, where intersections represent relationships.
- **menu-divider**: Non-interactive separator grouping related menu items, for use within hbr-menu.
- **menu-item**: Menu item component, for use within hbr-menu.
- **menu**: Container listing options for user selection.
- **modal**: Focused overlay displaying information that requires user attention or input.
- **navigation**: Primary navigation component, expandable side panel for app sections.
- **notification-indicator**: Notification indicator component showing status or count information, typically attached to another object.
- **notifications**: Container surface displaying system or user-triggered messages.
- **option**: component for use within hbr-select.
- **page-title**: Page title and content container.
- **pagination**: Use as a sibling to the hbr-dom-table component for navigating large datasets split across multiple pages.
- **pie-chart**: Graph showing parts of a whole as segments of a circle.
- **popover**: Contextual floating layer anchored to a trigger element.
- **progress-loading-indicators**: Inline indicators conveying ongoing loading or progress state.
- **radio-button**: Radio styled as a button for exclusive selection.
- **radio-group**: Group of radio buttons for selecting a single option.
- **radio**: Single-choice selection control within a radio group.
- **search**: input field with search-specific styling
- **select**: Form control presenting a list of options for single or multiple selection.
- **slider**: Control for selecting a numeric value or range along a track.
- **stepper**: Wizard component for guided multi-step workflows requiring sequential completion. Use when: (1) tasks have 3+ dependent steps that must be completed in order, (2) each step needs validation before proceeding, (3) users need to review before final submission. Ideal for: device provisioning (add/claim/replace devices), network configuration (VLAN, VPN, wireless setup), security workflows (firewall rules, access policies, 802.1X), scheduled report configuration, firmware upgrades, bulk imports, and any create/configure flow requiring step-by-step guidance. NOT for: viewing data, simple forms, or independent settings. Includes sidebar navigation, step status tracking (disabled/active/done), and action bar (Cancel/Back/Next/Submit).
- **sticky-action-bar**: Used in inline forms (body-content) and drawer/modal forms (drawer). Refer form template examples for usage. It can also be outside of forms as button groups.
- **tab-horizontal**: Horizontal tab trigger controlling an associated panel.
- **tab-vertical**: Vertical tab container coordinating tab navigation and panels.
- **table-basic**: Baseline simple table: columns + data rendering only.
- **table-filtering-sorting-search-paging-selection**: Combines filtering, sorting, search, pagination, and multi-row selection. Refer this node for ideal implementation of table features, always pick this node when implementing multiple table features together.
- **table**: Tabular display of structured data with rows and columns.
- **tag**: Tags are compact elements that represent attributes, keywords, or categories. They help users identify, filter, or organize content quickly. Tags can also indicate status or selections in a concise manner.
- **text**: 
- **textarea**: Multi-line text entry field.
- **timeline-panel**: Section of a timeline detailing a single event.
- **timeline**: Chronological sequence of events or steps.
- **toggle**: Switch control representing an on/off state.
- **tooltip**: Brief contextual label that appears on hover or focus.
- **transfer**: For transferring items between two lists, with transfer specific styling, behavior like searching, and multi-selection.
- **uploader**: File upload interface.
- **view-switcher**: Segmented control for switching between discrete views.