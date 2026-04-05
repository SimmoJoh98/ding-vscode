# Ding Language Support for VSCode

Syntax highlighting, error diagnostics, and IntelliSense for the Ding programming language.

## Requirements

- Ding compiler installed and on PATH
  - Install: [dinglang.dev](https://dinglang.dev)
  - Or: `gh repo clone Simmoloh98/dinglang`

## Features

- Syntax highlighting for `.dg` files
- Real-time error diagnostics (via `ding lsp`)
- Keyword and snippet completion
- Hover documentation
- `Ding: Run` and `Ding: Build` commands

## Setup

1. Install this extension
2. Install the Ding compiler
3. Open any `.dg` file — it just works

## Extension Settings

- `ding.serverPath` — path to the `ding` binary if it is not on `PATH`
- `ding.trace.server` — LSP communication tracing (`off` | `messages` | `verbose`)
