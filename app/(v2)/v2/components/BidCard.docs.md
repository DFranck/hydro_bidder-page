# BidCard Component Documentation

The `BidCard` component displays individual bid information within a tranche and supports various interactive states and visual feedback mechanisms.

## Core Functionality

### Basic Display

- **Logo & Title**: Project logo and bid title
- **Fields**: Duration, APR, and Vote percentage
- **Actions**: Vote button and navigation arrow

### Layout Modes

The component supports two layout modes via container queries:

- **Card Mode** (default): Grid layout for smaller containers
- **Row Mode** (`@card-is-row`): Table row layout for larger containers

## State Management & Visual Variants

### Existing Vote States

#### `is-voted-on`

Applied when the user has voted on this specific bid.

- **Trigger**: `userHasVotedOnThisBid` is true
- **Visual Effects**:
  - Green theme color override (`--color-theme-color: var(--color-palette-green)`)
  - Border highlight with green theme color
  - Vote button shows completed state (solid circle with checkmark)
  - Background highlight with theme color

#### `is-below-threshold`

Applied when a bid is below the vote threshold for its tranche.

- **Trigger**: `bid.vote_perc < voteThreshold`
- **Visual Effects**:
  - Beige theme color override (`--color-theme-color: var(--color-palette-beige)`)
  - Indicates the bid may not receive funding due to insufficient vote share

#### `has-voted-within` (Tranche Level)

Applied at the tranche level when user has voted on any bid within that tranche.

- **Purpose**: Shows tranche-level voting status in header
- **Visual Effects**: Changes tranche header styling to show "You've voted!" message

## New Vote Button Focus Interactions

### Focus State Detection

The component automatically detects three types of vote button interactions:

#### 1. `is-vote-focused`

**When**: User hovers/focuses a vote button on an unvoted bid in an unvoted tranche

```typescript
// Normal vote scenario
!userHasVotedOnThisBid && !userHasVotedInThisTranche && isHoveringVoteButton
```

#### 2. `is-voted-on-focused`

**When**: User hovers/focuses a vote button on a bid they've already voted on

```typescript
// Re-focusing on voted bid
userHasVotedOnThisBid && isHoveringVoteButton
```

#### 3. `is-change-vote-focused`

**When**: User hovers/focuses a vote button on an unvoted bid in a tranche where they've already voted elsewhere

```typescript
// Change vote scenario
!userHasVotedOnThisBid && userHasVotedInThisTranche && isHoveringVoteButton
```

### CSS Has Selector Integration

The focus states work with CSS `:has()` selectors to create container-level effects:

#### Container Variants

- `is-vote-focused-elsewhere`: Container has a child with `is-vote-focused`
- `is-voted-on-focused-elsewhere`: Container has a child with `is-voted-on-focused`
- `is-change-vote-focused-elsewhere`: Container has a child with `is-change-vote-focused`

#### Visual Effects

**Dimming Non-Focused Bids**:

```css
/* All bids dim when any vote button is focused */
.is-vote-focused-elsewhere .bid-card {
  opacity: 0.5;
}
.is-voted-on-focused-elsewhere .bid-card {
  opacity: 0.5;
}
.is-change-vote-focused-elsewhere .bid-card {
  opacity: 0.5;
}

/* Focused bid stays at full opacity */
.is-vote-focused {
  opacity: 1 !important;
}
.is-voted-on-focused {
  opacity: 1 !important;
}
.is-change-vote-focused {
  opacity: 1 !important;
}
```

**Change Vote Highlighting**:

```css
/* In change-vote-focus mode, highlight voted bids */
.is-change-vote-focused-elsewhere .is-voted-on {
  background-color: theme-color/60;
  opacity: 1 !important;
}
```

### Mobile Double-Tap Behavior

The vote button requires two taps on mobile devices:

1. **First Tap**: Focuses the button, triggers visual feedback
2. **Second Tap**: Executes the vote action

```typescript
onClick: (e: React.MouseEvent) => {
  e.preventDefault()
  // On mobile, require focus before click (double-tap behavior)
  const target = e.currentTarget as HTMLElement
  if (document.activeElement !== target) {
    target.focus()
    return
  }
  // Execute vote action...
}
```

## Theme Color System

### Dynamic Theme Colors

The component uses CSS custom properties to dynamically change theme colors:

```typescript
// Vote focus: Green theme
isHoveringVoteButton && {
  '--color-theme-color': 'var(--color-palette-green)',
}

// Voted on: Green theme
userHasVotedOnThisBid && {
  '--color-theme-color': 'var(--color-palette-green)',
}

// Below threshold: Beige theme
isBelowVoteThreshold && {
  '--color-theme-color': 'var(--color-palette-beige)',
}
```

### Theme Color Inheritance

- Colors cascade through the component via CSS custom properties
- Allows consistent theming across all child elements
- Enables smooth transitions between different states

## Interactive Elements

### FloatingCardElements

- **Internal Link**: Covers entire card for navigation to bid details
- **Background Highlights**: Visual feedback with theme colors
- **Border Indicators**: Show voting status with colored borders

### Vote Button Integration

- **Hover/Focus Tracking**: `setIsVoteButtonHovered`, `setIsVoteButtonFocused`
- **State Propagation**: Focus state affects entire card appearance
- **Action Integration**: Seamless connection to voting functionality

## Usage Examples

### Basic Usage

```tsx
<BidCard sourceId="atom" bidId={123} />
```

### With Custom Styling

```tsx
<BidCard sourceId="atom" bidId={123} className="custom-bid-styling" />
```

### In Table Layout (Tranche)

```tsx
// Automatically switches to row mode in larger containers
<div className="@container">
  <BidCard sourceId="atom" bidId={123} />
</div>
```

## Dependencies

### Required Props

- `sourceId`: Source identifier for data lookup
- `bidId`: Unique bid identifier

### State Dependencies

- `useAppState()`: Global application state
- `currentRoundDataPerSource`: Bid and wallet data
- `bidDescriptionsById`: Bid metadata and descriptions

### Visual Dependencies

- Tailwind CSS with custom variants
- CSS container queries (`@container`)
- CSS `:has()` selector support
- Custom CSS properties for theme colors
