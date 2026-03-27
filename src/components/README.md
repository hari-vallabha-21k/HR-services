# Components

This directory contains reusable UI components for the application.

## Structure

Place your React components here, organized by feature or type (e.g., `Button.tsx`, `Card.tsx`, etc.).

## Example

```tsx
import React from 'react'

interface ButtonProps {
  label: string
  onClick: () => void
}

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  )
}
```
