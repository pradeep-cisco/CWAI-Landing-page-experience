# Menu Item

Menu Item is implemented using the web component: <hbr-menu-item>.

## Description
Menu item component, for use within hbr-menu.

## API Reference

### Props
`ariacontrols`: Set aria-controls to the component. (any)
`cascading`: Set this to true in case of using inside the hbr-cascader. (boolean)
`checkMark`: Set to show checkmark on the right side of the menu item. (boolean)
`checkbox`: Set to enable checkbox type menu item. (boolean)
`checked`: Set to true to draw the item in a checked state. (boolean)
`density`: Toggle css classes: The density of the menu item. ("comfy" | "compact")
`disabled`: Set to true to draw the menu item in a disabled state. (boolean)
`hasChildren`: show right caret if has children. (boolean)
`indented`: Set this to true in case of category items. (boolean)
`indeterminate`: Set to true to draw the item in an indeterminate state. (boolean)
`level`: The hierarchical level of the menu item in a multi-level menu (number)
`loading`: Set this to true in case of loading items. (boolean)
`nav`: This is set for left side navigation (boolean)
`nested`: Set this to true in case of using inside another hbr-menu. (boolean)
`nestedInteractive`: enable focus on interactive element in the menuitem. (boolean)
`nestedSelected`: Set this to true when menu item is checked in a nested menu. (boolean)
`noSelectedState`: Set to true to disable the selected state style - menu-item--checked. (boolean)
`noninteractive`: Set this to true in case of non-interactive element in the menuitem. (boolean)
`open`: Set to true to indicate if the menu item is focused. (boolean)
`sentiment`: The sentiment of the menu item. (string)
`size`: The size of the menu item. ("large" | "medium" | "small")
`tabindx`: Set tab index prop. (string)
`value`: A unique value to store in the menu item. This can be used as a way to identify menu items when selected. (string)

### Methods
`removeFocus()`
`setFocus()`

### Events
`hbr-checked`:
`hbr-hide-popover`:
`hbr-trigger-focus`:

### Slots
`[default]`: The menu item's label.
`prefix`: Used to prepend an icon or similar element to the menu item.
`suffix`: Used to append an icon or similar element to the menu item.

### Parts
`base`: The component's base wrapper.
`check-mark`
`checked-icon`: The container that wraps the checked icon.
`icon-checked`
`label`: The menu item label.
`nested`
`prefix`: The prefix container.
`suffix`: The suffix container.
`trigger-gap`
`trigger-gap-fixed`
`wrapper`