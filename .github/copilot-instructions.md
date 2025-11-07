# GitHub Copilot Instructions for PixelSocial

## Project Overview

PixelSocial is a micro-blogging social network app with PixelArt aesthetics and integrated filter to pixelate shared images. It's built using [webxdc](https://webxdc.org) technology, which means:

- No login or registration needed
- No dependency on any server
- Each instance is independent in a group chat
- Data stays on devices and is e2e encrypted when used inside Delta Chat
- Can be wired with bots that allow importing RSS feeds (including Mastodon accounts)

## Technology Stack

- **Framework**: Preact 10.x (React-like library with smaller footprint)
- **Language**: TypeScript with strict mode enabled
- **Build Tool**: Vite
- **Package Manager**: pnpm (always use pnpm, not npm or yarn)
- **WebXDC**: Platform-specific plugins for building `.xdc` files
- **State Management**: React Context API with custom Manager class
- **Database**: Dexie (IndexedDB wrapper)
- **Styling**: CSS with PixelArt aesthetics
- **Icons**: Unplugin-icons with custom pixel art icons
- **Fonts**: Jersey 10 and Unixel (pixelated fonts)

## Code Style and Conventions

### General

- **Formatting**: Prettier is used for code formatting
  - Run `pnpm check` before committing to verify formatting
  - Run `pnpm fix` to auto-format code
- **TypeScript**: Strict mode is enabled with additional linting rules
  - `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` are enforced
  - Use explicit types where beneficial for clarity

### React/Preact Patterns

- Use functional components with hooks
- Use `useMemo` for expensive computations and to prevent unnecessary re-renders
- Context providers are used for global state (`ManagerContext`, `PageContext`)
- Import React hooks from "react" (Preact compatibility layer)

### File Structure

- **src/**: Source code
  - **components/**: Reusable UI components
  - **pages/**: Top-level page components (Home, NewPost, PostComments)
  - **lib/**: Utility libraries and business logic (manager, database, etc.)
  - **types.d.ts**: Global type definitions
  - **constants.ts**: Application constants
  - **contexts.ts**: React context definitions
- **public/**: Static assets and WebXDC manifest
- **fonts/**: Custom pixelated fonts
- Path alias: `~/*` maps to `./src/*` (use for imports)

### Naming Conventions

- Components: PascalCase (e.g., `PostItem`, `UserAvatar`)
- Files: Match component names for component files
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE when appropriate
- CSS classes: Use semantic names that reflect purpose

## Development Commands

### Setup

```bash
pnpm i  # Install dependencies (always use pnpm)
```

### Development

```bash
pnpm start     # Start dev server on port 3000 with hot reload
pnpm emulator  # Run with WebXDC emulator
```

### Code Quality

```bash
pnpm check  # Run TypeScript compiler and Prettier checks
pnpm fix    # Auto-format code with Prettier
```

### Building

```bash
pnpm build            # Build production .xdc file
NODE_ENV=debug pnpm build  # Build with debug tools for Delta Chat
```

The resulting `.xdc` file is saved in the `dist-xdc/` folder.

## Project Architecture

### State Management

- **Manager class** (`src/lib/manager.ts`): Core business logic for handling posts, comments, and WebXDC state
- **Context API**: Used for sharing Manager instance and page navigation state
- **Dexie**: Local database for storing posts and user data

### Page Navigation

Simple page-based navigation using PageContext:

- `{ key: "home" }`: Home feed
- `{ key: "newpost" }`: New post creation
- `{ key: "comments", postId: string }`: Post comments view

### WebXDC Integration

- Uses `@webxdc/vite-plugins` for building WebXDC packages
- The `Manager` class interfaces with WebXDC API for state synchronization
- State updates are broadcasted to all participants in the group chat

## Important Files

- **public/manifest.toml**: WebXDC app metadata (update version before releases)
- **vite.config.ts**: Build configuration with WebXDC and icon plugins
- **src/lib/pixelit.js**: Third-party library for image pixelation (excluded from Prettier)
- **.prettierignore**: Files excluded from formatting (dist folders, lock files)

## Contributing Guidelines

1. Always run `pnpm check` before committing
2. Update version in `public/manifest.toml` before creating releases
3. Follow existing code patterns and component structure
4. Use pixel art aesthetics (blocky, retro styling)
5. Ensure WebXDC compatibility (no external API calls)
6. Test in both browser (`pnpm start`) and WebXDC emulator

## Release Process

1. Update version in `public/manifest.toml`
2. Create and push a git tag:
   ```bash
   git tag -a v1.0.1
   git push origin v1.0.1
   ```
3. GitHub Actions will automatically build and create a release with the `.xdc` file

## Special Considerations

### WebXDC Constraints

- **No external network access**: All data must be local or shared via WebXDC state
- **No backend**: The app is fully client-side
- **State synchronization**: Use WebXDC API for sharing data between participants

### Performance

- Use `useMemo` to optimize rendering of large lists (feeds, comments)
- Dexie provides indexed lookups for efficient data retrieval
- Images are pixelated client-side using the Pixel It library

### UI/UX

- Maintain pixel art aesthetic throughout
- Use custom pixel art icons from Pixelarticons
- Keep UI simple and intuitive (no complex navigation)
- Mobile-first design (primary use case is in chat apps)
