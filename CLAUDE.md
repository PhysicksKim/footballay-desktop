# CLAUDE.md

반드시 별도의 지시가 없다면 한국어로 대화합니다.
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## AI Guidance

- Ignore GEMINI.md and GEMINI-\*.md files
- To save main context space, for code searches, inspections, troubleshooting or analysis, use code-searcher subagent where appropriate - giving the subagent full context background for the task(s) you assign it.
- After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding. Use your thinking to plan and iterate based on this new information, and then take the best next action.
- For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
- Before you finish, please verify your solution
- Do what has been asked; nothing more, nothing less.
- NEVER create files unless they're absolutely necessary for achieving your goal.
- ALWAYS prefer editing an existing file to creating a new one.
- NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
- When you update or modify core context files, also update markdown documentation and memory bank
- When asked to commit changes, exclude CLAUDE.md and CLAUDE-\*.md referenced memory bank system files from any commits. Never delete these files.

## Memory Bank System

This project uses a structured memory bank system with specialized context files. Always check these files for relevant information before starting work:

### Core Context Files

- **CLAUDE-activeContext.md** - Current session state, goals, and progress (if exists)
- **CLAUDE-patterns.md** - Established code patterns and conventions (if exists)
- **CLAUDE-decisions.md** - Architecture decisions and rationale (if exists)
- **CLAUDE-troubleshooting.md** - Common issues and proven solutions (if exists)
- **CLAUDE-config-variables.md** - Configuration variables reference (if exists)
- **CLAUDE-temp.md** - Temporary scratch pad (only read when referenced)

**Important:** Always reference the active context file first to understand what's currently being worked on and maintain session continuity.

### Memory Bank System Backups

When asked to backup Memory Bank System files, you will copy the core context files above and @.claude settings directory to directory @/path/to/backup-directory. If files already exist in the backup directory, you will overwrite them.

## Project Overview

Footballay is an Electron desktop application that provides real-time football match overlays for streaming. It displays lineup, cards, goals, and substitution information during live matches. The app connects to a Spring backend for match data.

## Development Commands

```bash
# Start development server
npm start

# Start with production API (useful for testing with real backend)
npm run start:prod-api

# Build for production
npm run build

# Run tests
npm test

# Lint
npm run lint
npm run lint:fix
```

## Architecture

### Multi-Window Electron Architecture

The app runs multiple Electron windows, each with its own React application:

- **app** (`app.html` → `src/renderer/pages/app/`) - Main control window for selecting fixtures and managing settings
- **matchlive** (`matchlive.html` → `src/renderer/pages/matchlive/`) - Overlay window displaying live match data (lineup, stats)
- **updatechecker** (`updatechecker.html` → `src/renderer/pages/updatechecker/`) - Auto-update UI

### Electron Main Process

- Entry: `electron/main/main.ts`
- Window management: `electron/main/WindowManager.ts`
- IPC handlers: `electron/main/ipcManager.ts`
- STOMP WebSocket: `electron/main/stomp.ts`
- Electron store: `electron/main/store/`

### State Management

Each renderer window has its own Redux store:
- App store: `src/renderer/pages/app/store/`
- Matchlive store: `src/renderer/pages/matchlive/store/`

Key slices:
- `fixtureLiveSlice` - Live match data (events, lineups, statistics)
- `footballSelectionSlice` - User's league/fixture selection
- `fixtureLiveOptionSlice` - Display preferences

### IPC Communication

The app window communicates with matchlive window via Electron IPC:
- `MatchliveIpc.tsx` - Sends data from app to matchlive
- `ipcManager.ts` - Main process IPC handlers

### Path Aliases

```typescript
@src/*    → src/*
@assets/* → assets/*
@app/*    → src/renderer/pages/app/*
@matchlive/* → src/renderer/pages/matchlive/*
```

## Tech Stack

- Electron 33 + Vite + React 18 + TypeScript
- Redux Toolkit for state management
- STOMP over WebSocket for real-time data
- Tailwind CSS + SCSS + styled-components for styling
- Vitest + Playwright for testing

## ALWAYS START WITH THESE COMMANDS FOR COMMON TASKS

**Task: "List/summarize all files and directories"**

```bash
fd . -t f           # Lists ALL files recursively (FASTEST)
# OR
rg --files          # Lists files (respects .gitignore)
```

**Task: "Search for content in files"**

```bash
rg "search_term"    # Search everywhere (FASTEST)
```

**Task: "Find files by name"**

```bash
fd "filename"       # Find by name pattern (FASTEST)
```

### Directory/File Exploration

```bash
# FIRST CHOICE - List all files/dirs recursively:
fd . -t f           # All files (fastest)
fd . -t d           # All directories
rg --files          # All files (respects .gitignore)

# For current directory only:
ls -la              # OK for single directory view
```

### BANNED - Never Use These Slow Tools

- ❌ `tree` - NOT INSTALLED, use `fd` instead
- ❌ `find` - use `fd` or `rg --files`
- ❌ `grep` or `grep -r` - use `rg` instead
- ❌ `ls -R` - use `rg --files` or `fd`
- ❌ `cat file | grep` - use `rg pattern file`

### Use These Faster Tools Instead

```bash
# ripgrep (rg) - content search
rg "search_term"                # Search in all files
rg -i "case_insensitive"        # Case-insensitive
rg "pattern" -t py              # Only Python files
rg "pattern" -g "*.md"          # Only Markdown
rg -1 "pattern"                 # Filenames with matches
rg -c "pattern"                 # Count matches per file
rg -n "pattern"                 # Show line numbers
rg -A 3 -B 3 "error"            # Context lines
rg " (TODO| FIXME | HACK)"      # Multiple patterns

# ripgrep (rg) - file listing
rg --files                      # List files (respects •gitignore)
rg --files | rg "pattern"       # Find files by name
rg --files -t md                # Only Markdown files

# fd - file finding
fd -e js                        # All •js files (fast find)
fd -x command {}                # Exec per-file
fd -e md -x ls -la {}           # Example with ls

# jq - JSON processing
jq. data.json                   # Pretty-print
jq -r .name file.json           # Extract field
jq '.id = 0' x.json             # Modify field
```

### Search Strategy

1. Start broad, then narrow: `rg "partial" | rg "specific"`
2. Filter by type early: `rg -t python "def function_name"`
3. Batch patterns: `rg "(pattern1|pattern2|pattern3)"`
4. Limit scope: `rg "pattern" src/`

### INSTANT DECISION TREE

```
User asks to "list/show/summarize/explore files"?
  → USE: fd . -t f  (fastest, shows all files)
  → OR: rg --files  (respects .gitignore)

User asks to "search/grep/find text content"?
  → USE: rg "pattern"  (NOT grep!)

User asks to "find file/directory by name"?
  → USE: fd "name"  (NOT find!)

User asks for "directory structure/tree"?
  → USE: fd . -t d  (directories) + fd . -t f  (files)
  → NEVER: tree (not installed!)

Need just current directory?
  → USE: ls -la  (OK for single dir)
```
