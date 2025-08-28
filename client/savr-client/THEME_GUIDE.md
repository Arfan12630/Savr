# Theme Guide

Switch between different color themes in Storybook using the toolbar.

## Available Themes

- **🌿 Default** - Light green theme
- **🌿🌙 Default Dark** - Dark green theme

## How to Use

1. **Switch themes**: Use the theme dropdown in the Storybook toolbar
2. **Story-specific theme**: Add `parameters: { theme: 'default-dark' }` to any story

## Add New Theme

1. Add color palette to `themeDecorator.tsx`
2. Update `getGlobalTheme()` function
3. Add to toolbar in `preview.tsx`

That's it! 🎨
