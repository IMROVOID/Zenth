<div align="center">

<img src="assets/zenth-banner.svg" alt="Zenth — Autonomous Self-Learning Crypto Paper Trading Terminal" width="100%" />

<p align="center">
  <strong>Autonomous, self-learning cryptocurrency paper trading terminal and bot powered by pluggable multi-exchange feeds (Binance, Coinbase, OKX, Upbit, Bitget, XT.com) & Supabase PostgreSQL memory with Row-Level Security (RLS).</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/zenth"><img src="https://img.shields.io/npm/v/zenth?style=flat-square&color=CB3837&logo=npm" alt="npm version" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-7.0+-1D4ED8?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 7.0+" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-22+-15803D?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 22+" /></a>
  <a href="https://developers.binance.com/"><img src="https://img.shields.io/badge/Binance-Public_REST-F0B90B?style=flat-square&logo=binance&logoColor=black" alt="Binance" /></a>
  <a href="https://docs.cdp.coinbase.com/"><img src="https://img.shields.io/badge/Coinbase-CDP_/_Exchange-0052FF?style=flat-square&logo=coinbase&logoColor=white" alt="Coinbase" /></a>
  <a href="https://www.okx.com/docs-v5/en/"><img src="https://img.shields.io/badge/OKX-v5_API-000000?style=flat-square" alt="OKX" /></a>
  <a href="https://docs.upbit.com/"><img src="https://img.shields.io/badge/Upbit-Public_Feed-093687?style=flat-square" alt="Upbit" /></a>
  <a href="https://www.bitget.com/api-doc/uta/intro"><img src="https://img.shields.io/badge/Bitget-v2_API-00F0FF?style=flat-square&logoColor=black" alt="Bitget" /></a>
  <a href="https://www.xt.com/"><img src="https://img.shields.io/badge/XT.com-Public_API-0284C7?style=flat-square" alt="XT.com" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-PostgreSQL_RLS-0F766E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase PostgreSQL RLS" /></a>
  <a href="#strict-risk-management--1000-hard-cap"><img src="https://img.shields.io/badge/Mode-PAPER_ONLY-C2410C?style=flat-square" alt="Paper Trading Only" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-GPL--3.0-6D28D9?style=flat-square" alt="License GPL-3.0" /></a>
</p>

<p align="center">
  <a href="#getting-started">Quick Start</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#architecture-and-project-structure">Architecture</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#supported-exchange-venues">Exchange Venues</a> •
  <a href="#4-database-schema--rls-setup-supabase">Database Setup</a> •
  <a href="#multi-format-export-engine">Export Engine</a> •
  <a href="#license">License</a>
</p>

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [Pluggable Multi-Exchange Ingestion](#1-pluggable-multi-exchange-ingestion)
  - [Interactive Onboarding Wizard & Multi-DB Auto-Provisioning](#2-interactive-onboarding-wizard--multi-db-auto-provisioning)
  - [Touch & Click Interactive TUI & Live Config Cycling](#3-touch--click-interactive-tui--live-config-cycling)
  - [Pinned Top Viewport Docked HUD](#4-pinned-top-viewport-docked-hud)
  - [Quantitative Strategy & Indicators](#5-quantitative-strategy--indicators)
  - [Strict Risk Management & $1,000 Hard Cap](#6-strict-risk-management--1000-hard-cap)
  - [Pluggable Multi-Database Architecture & Memory](#7-pluggable-multi-database-architecture--memory)
- [Architecture and Project Structure](#architecture-and-project-structure)
  - [Architecture Overview](#architecture-overview)
  - [System Flow & Component Diagram](#system-flow--component-diagram)
  - [Directory & File Layout](#directory--file-layout)
- [Tech Stack](#tech-stack)
  - [Core Runtime & Frameworks](#core-runtime--frameworks)
  - [Database & Storage Integration](#database--storage-integration)
  - [Development & Tooling](#development--tooling)
- [Supported Exchange Venues](#supported-exchange-venues)
- [Getting Started](#getting-started)
  - [1. Prerequisites & How to Install Them](#1-prerequisites--how-to-install-them)
  - [2. Installation Methods](#2-installation-methods)
    - [Method 1: NPM / PNPM Package (Fast, Recommended)](#method-1-npm--pnpm-package-fast-recommended)
    - [Method 2: Manual (Clone & Build from Source)](#method-2-manual-clone--build-from-source)
  - [3. Interactive Onboarding Wizard (First Launch)](#3-interactive-onboarding-wizard-first-launch)
  - [4. Environment Configuration (`.env`)](#4-environment-configuration-env)
  - [5. Database Schema & RLS Setup (Supabase)](#5-database-schema--rls-setup-supabase)
  - [6. Execution Commands & Operational Modes](#6-execution-commands--operational-modes)
  - [7. Interactive Slash Commands Palette](#7-interactive-slash-commands-palette)
  - [8. TUI Themes](#8-tui-themes)
  - [9. Creating Custom Themes](#9-creating-custom-themes)
- [Multi-Format Export Engine](#multi-format-export-engine)
  - [Supported Export Formats](#supported-export-formats)
  - [Interactive File Path & Clipboard Flow](#interactive-file-path--clipboard-flow)
- [Verification & Automated Test Suite](#verification--automated-test-suite)
  - [Run All Tests (Master Test Suite Runner)](#run-all-test-suites-master-test-suite-runner)
  - [Individual Test Suites](#individual-test-suites)
- [License](#license)

---

## Overview

**Zenth** is a high-performance crypto paper trading terminal designed for quantitative signal discovery, execution simulation, and continuous failure learning without financial risk. Built natively in TypeScript (ES2022 / NodeNext), Zenth ingests live candlestick feeds across **Binance**, **Coinbase**, **OKX**, **Upbit**, **Bitget**, and **XT.com**, computes multi-timeframe moving averages and momentum oscillators, applies strict capital preservation rules, and records all decisions in a **Supabase PostgreSQL database protected with Row-Level Security (RLS)**.

Whenever a simulated trade closes at a loss, Zenth's **Adaptive Learning Engine** classifies the root failure mode (e.g. low-volume whipsaw, overbought exhaustion trap) and synthesizes a plain-English trading rule into memory. Future incoming trade setups matching active failure rules are automatically filtered and skipped before paper capital is committed.

---

## Key Features

### 1. Pluggable Multi-Exchange Ingestion
- **Universal Provider Architecture**: Switch between Binance, Coinbase, OKX, Upbit, Bitget, and XT.com on the fly via CLI flag (`--exchange <venue>`), slash command (`/exchange <venue>`), or TUI settings.
- **Universal Symbol Normalization**: Seamlessly translate pairs across exchange notations (e.g. standard `BTC/USDT` to `BTCUSDT`, `BTC-USDT`, `KRW-BTC`, `USDT-BTC`, or `btc_usdt`).
- **Resilient Fallback Protection**: Auto-detects rate limits or network drops and falls back gracefully to synthetic candle generation without crashing the loop.

### 2. Interactive Onboarding Wizard & Multi-DB Auto-Provisioning
- **Zero-Config First Run**: Automatically detects missing `.env` on first launch and launches a 4-step guided setup wizard.
- **5-Engine Storage Selector**: Choose between `[1] SQLite (Local File)`, `[2] PostgreSQL (Local / Docker)`, `[3] MongoDB (Local / Docker)`, `[4] Supabase (Cloud PostgreSQL)`, or `[5] In-Memory (Offline)`.
- **1-Click Auto-Creation**: Automatic database creation (`CREATE DATABASE zenth`), table/collection generation, and index configuration without manual DB administration.
- **Dynamic Credential Generator**: Press `[G]` during credential setup to instantly generate cryptographically strong usernames and passwords.
- **Exchange Venue Selection**: Select your desired primary market provider directly in Step 3 with a dedicated interactive picker dialog.
- **Space-Driven Parameter Pickers**: Press `[SPACE]` on any trading parameter to open curated selection menus for exchange venues, timeframes, quantities, safety caps, and bracket targets.
- **Live Asset Search & Sparkline Charts**: Search live crypto pairs and tokenized stocks dynamically fetched from the active exchange feed, complete with 24h delta and Braille dot price sparklines.
- **Fullscreen Reconfigurability**: Relaunch the onboarding wizard anytime using `/onboard` or `/setup`.

### 3. Touch & Click Interactive TUI & Live Config Cycling
- Full mouse and touch screen support in modern terminal emulators.
- Click top navigation tabs (`[1: STATUS]`, `[2: LEDGER]`, `[3: RULES]`, `[4: THEME]`, `[5: CONFIG]`, `[6: COINS]`, `[7: STOCKS]`, `[8: HELP]`).
- Live parameter cycling in `[5: CONFIG]` for `STORAGE_BACKEND`, `ACTIVE_EXCHANGE`, default symbol, MA periods, RSI thresholds, risk caps, and verbosity.

### 4. Pinned Top Viewport Docked HUD
- Permanently pinned 3-row HUD at the top of the terminal viewport.
- Real-time display of active exchange venue, symbol, price, 24h delta, SMA 9, SMA 21, RSI 14, live position PnL ($ and %), session win rate, and total closed capital.
- Zero screen tearing or duplicate border rendering during streaming market ticks.

### 5. Quantitative Strategy & Indicators
- **Fast SMA (9)** & **Slow SMA (21)** crossover engine for trend identification.
- **RSI (14)** Wilder's smoothed momentum oscillator with overbought threshold filtering (`RSI < 75` or configurable `RSI < 65`).
- **Volume SMA (20)** filter for liquidity confirmation and breakout validation.
- **Asymmetric Profit Brackets (1:2 R:R)**: Stop-Loss at `1.5%` below entry, Take-Profit at `3.0%` above entry.
- **Reverse Crossover Exit**: Optional automatic position liquidation if a death-cross occurs before reaching bracket limits.

### 6. Strict Risk Management & $1,000 Hard Cap
- **$1,000 Notional Cap**: Maximum allocation limit of **$1,000.00 USD/USDT** per trade. Orders exceeding notional capacity are immediately converted to a `SKIP` decision with plain-English justification.
- **Max Daily Drawdown Circuit Breaker**: Halts new entries if session realized loss exceeds configured daily loss limit (e.g. -$50.00).
- **Max Consecutive Losses Circuit Breaker**: Halts trading upon hitting consecutive losing streaks (e.g. 3 losses).
- **Single Active Position Rule**: Maximum 1 concurrent paper trade per symbol.

### 7. Pluggable Multi-Database Architecture & Memory
Zenth implements a unified, high-performance database interface contract (`DatabaseAdapter`) with full polymorphic support across 5 storage backends:

```
+────────────────────+─────────────────────────────────────────────────────────────+
| Database Method    | Description & Operations Performed                         |
+────────────────────+─────────────────────────────────────────────────────────────+
| init()             | Establishes connection, auto-creates database, tables & DDL|
| isAvailable()      | Healthcheck probe verifying active database connectivity   |
| logTrade()         | Records trade execution, fill price, quantity, fees & PnL  |
| updateSessionMetrics()| Upserts live win-rate, entered/closed capital & active position|
| recordLearning()   | Ingests distilled root-cause failure rules & pattern tags  |
| getActiveLearnings()| Queries active failure-pattern rules for trade filtering   |
| getLedger()        | Queries historical trade records with symbol & limit filters|
| incrementTrigger() | Increments trigger counter and updates last-triggered time |
| reset()            | Clears trade ledger and learned rules for a specific symbol |
| resetAll()         | Performs full wipe of ledger, learnings, and session metrics|
| close()            | Safely disconnects pools, clients, and database handles    |
+────────────────────+─────────────────────────────────────────────────────────────+
```

- **Local SQLite (`node:sqlite`)**: Embedded file-based persistence (`./data/zenth.db`) requiring **zero external server setup**. Built into Node.js 22+.
- **Local PostgreSQL (`pg.Pool`)**: Enterprise relational storage with automated database provisioning (`CREATE DATABASE zenth`), DDL execution, and JSONB position serialization.
- **Local MongoDB (`MongoClient`)**: High-throughput document store with auto-collection initialization and compound indexing on `symbol`, `timestamp`, and `session_id`.
- **Supabase Cloud PostgreSQL (`@supabase/supabase-js`)**: Multi-device cloud sync with Row-Level Security (RLS) policies and 1-click PAT token setup.
- **In-Memory Store (`LocalMemoryStore`)**: Ephemeral RAM-only store providing seamless offline fallback and zero disk footprints.
- **Adaptive Memory Filtering**: Real-time evaluation against active learning rules with configurable modes (`STRICT`, `REPEAT_LOSSES`, `DRY_RUN`, `DISABLED`).
- **1-Click Database Reset**: Wipe and re-initialize tables with 1-click via `/resetdb`, `/wipe`, or the Configs menu.

---

## Architecture and Project Structure

### Architecture Overview

Zenth is organized as a decoupled, multi-tier system with strict separation between exchange market adapters, strategy evaluation, risk controls, memory persistence, presentation, and report export engines.

```mermaid
flowchart TD
    subgraph MarketLayer ["1. Pluggable Market Feed Layer (Zero Keys)"]
        Binance["Binance Public Feed\n(api.binance.com)"]
        Coinbase["Coinbase Exchange / CDP\n(api.exchange.coinbase.com)"]
        OKX["OKX v5 Open API\n(www.okx.com)"]
        Upbit["Upbit Public API\n(api.upbit.com)"]
        Bitget["Bitget v2 API\n(api.bitget.com)"]
        XT["XT.com Public Feed\n(sapi.xt.com / fapi.xt.com)"]
        
        Reg["ExchangeRegistry & Adapters\n(Normalization & Resilient HTTP)"]
        MS["MarketService Facade\n(Dynamic Venue Coordinator)"]
        
        Binance --> Reg
        Coinbase --> Reg
        OKX --> Reg
        Upbit --> Reg
        Bitget --> Reg
        XT --> Reg
        Reg --> MS
    end

    subgraph CoreEngine ["2. Quantitative Core & Risk Engine"]
        SE["StrategyEngine\n(SMA 9/21, RSI 14, Vol SMA 20)"]
        RM["RiskManager\n($1,000 Cap, Drawdown & Streak Limits)"]
        EE["ExecutionEngine\n(Paper Fill Simulator)"]
        PM["PositionManager\n(SL 1.5% / TP 3.0% Brackets)"]
        
        MS -->|Candles & Ticker| SE
        SE -->|Raw Signal| RM
        RM -->|Approved Signal| EE
        EE -->|Paper Trade| PM
    end

    subgraph MemoryLayer ["3. Memory & Adaptive Learning Layer"]
        AF["AdaptiveFilter\n(Pre-Trade Pattern Gate)"]
        MemS["MemoryService\n(PostgreSQL & Local Store)"]
        SupaDB[("Supabase PostgreSQL\n(RLS Protected)")]
        LocalStore[("LocalMemoryStore\n(Offline Fallback)")]

        SE -.->|Evaluate Pattern| AF
        AF <-->|Query Active Rules| MemS
        PM -->|Loss Debrief & Ingestion| MemS
        MemS <-->|Cloud Sync| SupaDB
        MemS <-->|Offline Fallback| LocalStore
    end

    subgraph PresentationLayer ["4. Presentation & Export Layer"]
        TUI["TuiApp\n(Terminal User Interface)"]
        HUD["DockedHud\n(Pinned Top Viewport)"]
        CP["CommandPalette\n(Slash Commands /)"]
        Exp["ExportEngine\n(TXT, CSV, MD, DOCX, PDF)"]

        PM -->|Live Telemetry| TUI
        TUI --- HUD
        TUI --- CP
        TUI -->|Export Session| Exp
    end
```

### Directory & File Layout

```
AITraderBot/
├── assets/
│   └── zenth-banner.svg             # Vector Matrix Green pixel header banner
├── docs/
│   └── project-context.md           # Deep architectural specification & context
├── src/
│   ├── index.ts                     # Main entry point & CLI router
│   ├── cli.ts                       # Standalone binary runner (`zenth`)
│   ├── bot.ts                       # TradingBot facade
│   ├── types.ts                     # Global TypeScript interfaces
│   │
│   ├── core/                        # Headless trading engine
│   │   ├── bot/                     # Trading bot orchestrator, scanner, loop
│   │   │   ├── tradingBot.ts        # Main bot coordinator
│   │   │   ├── scanner.ts           # Single-pass market scanner
│   │   │   ├── continuousLoop.ts    # Async polling loop runner
│   │   │   ├── loopIteration.ts     # Single cycle execution logic
│   │   │   ├── loopEntryEvaluator.ts# Signal & memory entry gating
│   │   │   ├── loopPositionMonitor.ts # Bracket monitoring & exits
│   │   │   ├── positionManager.ts   # In-memory paper position tracking
│   │   │   ├── replayRunner.ts      # Replay backtest runner
│   │   │   └── sessionTracker.ts    # Session metrics aggregation
│   │   ├── market/                  # Pluggable Multi-Exchange market subsystem
│   │   │   ├── marketService.ts     # Multi-exchange market coordinator facade
│   │   │   ├── exchangeRegistry.ts  # Exchange factory & adapter registry
│   │   │   ├── adapters/            # Dedicated exchange adapters (< 200 lines)
│   │   │   │   ├── exchangeAdapter.ts # ExchangeAdapter interface contracts
│   │   │   │   ├── baseAdapter.ts   # Resilient HTTP JSON fetcher & float guards
│   │   │   │   ├── binanceAdapter.ts# Binance Spot & Futures public feed
│   │   │   │   ├── coinbaseAdapter.ts# Coinbase Exchange & CDP AgentKit feed
│   │   │   │   ├── okxAdapter.ts    # OKX v5 unified open market feed
│   │   │   │   ├── upbitAdapter.ts  # Upbit KRW/USDT market feed
│   │   │   │   ├── bitgetAdapter.ts # Bitget v2 market feed
│   │   │   │   └── xtAdapter.ts     # XT.com spot & stock adapter
│   │   │   ├── normalization/       # Universal timeframe & pair standardizers
│   │   │   │   ├── intervalMapper.ts# Multi-exchange timeframe mapper
│   │   │   │   └── symbolNormalizer.ts # Symbol parser & formatter
│   │   │   ├── klineFetcher.ts      # XT kline fetcher helper
│   │   │   ├── tickerFetcher.ts     # XT 24h ticker & top gainers/losers
│   │   │   ├── dictionaries.ts      # Fallback metadata for coins & stocks
│   │   │   ├── fallbackData.ts      # Synthetic candle generator for tests
│   │   │   └── search.ts            # Symbol resolver & search
│   │   ├── strategy/                # Indicators & signal generation
│   │   │   ├── strategyEngine.ts    # MA crossover & RSI filter logic
│   │   │   └── indicators.ts        # SMA & RSI mathematical calculations
│   │   ├── risk/                    # Capital preservation & circuit breakers
│   │   │   └── riskManager.ts       # $1,000 cap, daily drawdown checks
│   │   ├── execution/               # Paper order simulator
│   │   │   └── executionEngine.ts   # Paper fill simulator & logger
│   │   ├── memory/                  # Supabase PostgreSQL & offline store
│   │   │   ├── memoryService.ts     # Unified memory service
│   │   │   ├── adaptiveFilter.ts    # Pre-trade pattern matching filter
│   │   │   ├── supabaseClient.ts    # Supabase JS client factory
│   │   │   ├── supabaseQueries.ts   # Typed PostgreSQL query helpers
│   │   │   └── localStore.ts        # In-memory fallback ledger & learnings
│   │   ├── replay/                  # Historical backtesting & comparison
│   │   │   ├── replayEngine.ts      # Replay backtest coordinator
│   │   │   ├── rawReplay.ts         # Baseline backtest without memory
│   │   │   ├── memoryReplay.ts      # Backtest with adaptive filtering
│   │   │   ├── patternClassifier.ts # Pattern setup classifier
│   │   │   ├── metrics.ts           # Win rate, profit factor, max drawdown
│   │   │   └── formatters.ts        # Side-by-side terminal comparison
│   │   ├── logger/                  # ANSI console formatting
│   │   │   ├── logger.ts            # Standardized badge logger
│   │   │   └── ansiColors.ts        # Color codes & formatting constants
│   │   └── export/                  # Multi-format report generation
│   │       ├── clipboardService.ts  # Cross-platform clipboard integration
│   │       ├── dataFormatter.ts     # TXT, CSV, Markdown serializers
│   │       ├── docxExporter.ts      # Native Office Open XML (.docx) generator
│   │       ├── pdfExporter.ts       # Native Vector PDF 1.4 document builder
│   │       ├── logExporter.ts       # File system export controller
│   │       └── pdf/                 # PDF layout engine & binary writer
│   │
│   └── tui/                         # Interactive Terminal User Interface
│       ├── tuiApp.ts                # Fullscreen TUI lifecycle manager
│       ├── tuiRunner.ts             # Live tick loop runner for TUI
│       ├── tuiRenderer.ts           # Viewport compositor & render engine
│       ├── components/              # Pinned HUD, CommandPalette, ExportModal
│       ├── views/                   # Dashboard, Ledger, Rules, Config, Coins
│       ├── state/                   # Reactive state & config schema
│       ├── input/                   # Keyboard, mouse, slash command handlers
│       ├── theme/                   # 7 Theme presets & ANSI styling
│       └── utils/                   # Box drawing, sparklines, screen buffer
│
├── tests/                           # Unit & E2E verification suites
│   ├── run_all_tests.ts             # Master sequential test suite runner
│   ├── test_strategy_indicators.ts  # SMA, RSI, and crossover evaluation tests
│   ├── test_risk_manager.ts         # $1,000 hard allocation cap & circuit breakers
│   ├── test_adaptive_filter.ts      # Adaptive memory filtering across all modes
│   ├── test_execution_position.ts   # Paper order fills, SL/TP/Trailing brackets
│   ├── test_market_service.ts       # Market feeds, synthetic OHLCV & asset search
│   ├── test_replay_engine.ts        # Backtest replay, metrics & pattern classifier
│   ├── test_bot_session_loop.ts     # SessionTracker & live scanner pipeline
│   ├── test_tui_utils.ts            # Mathematical Box drawing, Braille & ANSI utils
│   ├── test_export_clipboard.ts     # Tests for all 5 export formats & clipboard
│   ├── test_database_reset.ts       # Database wipe & truncation suite
│   ├── test_env_config.ts           # Environment validator & writer suite
│   ├── test_theme_presets.ts        # 14 Theme presets & ANSI palette validation
│   ├── test_tui_command_flow.ts     # Headless E2E simulation of TUI commands
│   └── test_supabase_validator.ts   # Supabase connection & schema verification
│
├── AGENTS.md                        # Verified agent instructions block
├── TradingBotV2.md                   # Product & feature roadmap
├── trading_bot_instructions.md      # Strategy & broker rules
├── package.json                     # NPM configuration & executable scripts
└── tsconfig.json                    # TypeScript compiler configuration
```

---

## Tech Stack

### Core Runtime & Frameworks

| Technology / Library | Exact Version | Link | Purpose / Description |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>=20.0.0` (LTS 22+) | [nodejs.org](https://nodejs.org/) | High-performance asynchronous JavaScript/TypeScript runtime. |
| **TypeScript** | `^7.0.2` | [typescriptlang.org](https://www.typescriptlang.org/) | Strongly-typed JavaScript superset for compile-time safety across all trading and mathematical pipelines. |
| **TSX** | `^4.23.12` | [github.com/privatenumber/tsx](https://github.com/privatenumber/tsx) | Fast TypeScript execution engine for native ES module execution during development and testing. |

### Database & Storage Integration

| Technology / Library | Exact Version | Link | Purpose / Description |
| :--- | :--- | :--- | :--- |
| **node:sqlite** | `Built-in` (Node 22+) | [nodejs.org/api/sqlite.html](https://nodejs.org/api/sqlite.html) | Zero-config embedded SQLite database for local persistence without external servers or build tools. |
| **pg** | `^8.13.1` | [node-postgres.com](https://node-postgres.com/) | Enterprise-grade PostgreSQL client for local and server-based relational persistence. |
| **mongodb** | `^6.12.0` | [mongodb.com](https://www.mongodb.com/) | Official Node.js driver for local and cloud MongoDB document database storage. |
| **@supabase/supabase-js** | `^2.112.4` | [supabase.com](https://supabase.com/) | PostgreSQL client library for cloud trade ledger, adaptive learnings, and metrics with RLS. |
| **dotenv** | `^17.4.2` | [npmjs.com/package/dotenv](https://www.npmjs.com/package/dotenv) | Zero-dependency module for loading configuration and secrets from `.env`. |

### Development & Tooling

| Technology / Library | Exact Version | Link | Purpose / Description |
| :--- | :--- | :--- | :--- |
| **@types/node** | `^26.3.0` | [npmjs.com/package/@types/node](https://www.npmjs.com/package/@types/node) | Type definitions for Node.js standard libraries (`node:fs`, `node:path`, `node:assert`, `node:child_process`). |
| **Native ES Modules** | `NodeNext` | [nodejs.org/api/esm.html](https://nodejs.org/api/esm.html) | Native ECMAScript modules with strict explicit `.js` import resolution. |

---

## Supported Exchange Venues

All 6 integrated exchanges operate through **100% public REST endpoints requiring zero API keys, zero registration, and zero credentials exposure**:

| Exchange Venue | Public Data Endpoints | Auth / API Key Required? | Rate Quota | Key Features |
| :--- | :--- | :---: | :--- | :--- |
| **Binance** | `/api/v3/klines`, `/ticker/24hr`, `/exchangeInfo` | **No** (Public REST) | 1,200 req/min | Global high-liquidity crypto spot and derivatives feeds |
| **Coinbase** | `/products/{id}/candles`, `/ticker`, `/stats` | **No** (Public REST) | 10 req/sec | US-regulated spot markets & CDP AgentKit integration |
| **OKX** | `/api/v5/market/candles`, `/market/tickers` | **No** (Public REST) | 20 req/2s | Unified accounts, spot, and perpetual futures feeds |
| **Upbit** | `/v1/candles/minutes/{unit}`, `/ticker`, `/market/all` | **No** (Public REST) | 10 req/sec | Top Korean market with KRW and USDT trading pairs |
| **Bitget** | `/api/v2/spot/market/candles`, `/tickers` | **No** (Public REST) | 20 req/sec | Spot and futures feeds with Agent Skill Hub support |
| **XT.com** | `/v4/public/kline`, `/ticker/24h` | **No** (Public REST) | 10 req/sec (1,000 req/min) | Crypto pairs and tokenized US equities (AAPLX, NVDAX) |

---

## Getting Started

### 1. Prerequisites & How to Install Them

Before running Zenth, ensure you have the following prerequisites installed:

- **Node.js**: `v20.0.0` or later (`v22+ LTS` recommended)
- **Package Manager**: **npm** (`v9.0.0+`) or **pnpm** (`v9.0.0+` recommended)
- **Supabase Account**: *(Optional)* Free project at [supabase.com](https://supabase.com) for cloud PostgreSQL memory with RLS (local fallback included)

---

#### A. Node.js (v22+ LTS)

Choose your operating system:

##### Windows

Install using Windows Package Manager (winget):
```powershell
winget install OpenJS.NodeJS.LTS
```

Or install using Fast Node Manager (fnm):
```powershell
fnm install --lts
```

*(You can also download the official graphical installer from [nodejs.org](https://nodejs.org/))*

##### macOS

Install using Homebrew:
```bash
brew install node
```

##### Linux (Ubuntu / Debian)

Add the NodeSource repository:
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
```

Install Node.js:
```bash
sudo apt-get install -y nodejs
```

##### Verify Node.js Installation

Check Node.js version:
```bash
node -v
```

Check NPM version:
```bash
npm -v
```

---

#### B. PNPM (Fast & Recommended Package Manager)

Install pnpm globally via npm:
```bash
npm install -g pnpm
```

Or enable via Node Corepack:
```bash
corepack enable
```

```bash
corepack prepare pnpm@latest --activate
```

##### Verify PNPM Installation

Check PNPM version:
```bash
pnpm -v
```

---

#### C. Database Storage Engine Setup (Choose Any Option)

Zenth features a pluggable database architecture supporting 5 persistence backends:

```
+───────────────────+─────────────────────────────────────────────────────────────+
| Database Option   | Setup Required & Operating System Compatibility             |
+───────────────────+─────────────────────────────────────────────────────────────+
| 1. Local SQLite   | Zero setup (Built-in) — 100% native on Windows, macOS, Linux|
| 2. PostgreSQL     | Local service / Docker container with auto-creation         |
| 3. MongoDB        | Local service / Docker container with auto-initialization   |
| 4. Supabase Cloud | Remote cloud PostgreSQL with Row-Level Security (RLS)       |
| 5. In-Memory      | Zero setup (RAM only) — Ephemeral simulation mode           |
+───────────────────+─────────────────────────────────────────────────────────────+
```

##### Option 1: Local SQLite (Recommended & Default — Zero Install)
SQLite is embedded directly in Node.js (Node 22+) and creates its database file (`./data/zenth.db`) automatically on first launch.
- **Windows / macOS / Linux**: **No software installation required**. Simply launch Zenth and select `[1] SQLite`.

##### Option 2: Docker Compose (Instant PostgreSQL + MongoDB)
If you have Docker installed, start both PostgreSQL 16 and MongoDB 7.0 with a single command:
```bash
docker compose up -d
```
- **PostgreSQL**: `localhost:5432` (User: `postgres`, Pass: `postgrespassword`, DB: `zenth`)
- **MongoDB**: `localhost:27017` (DB: `zenth`)

To stop database containers:
```bash
docker compose down
```

##### Option 3: Local PostgreSQL (Native Service)
###### Windows
Install via Windows Package Manager:
```powershell
winget install PostgreSQL.PostgreSQL.16
```
*(Or download installer from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/))*

###### macOS
Install and start service via Homebrew:
```bash
brew install postgresql@16
brew services start postgresql@16
```

###### Linux (Ubuntu / Debian)
```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
```

###### Auto-Creation by Zenth Bot
During the onboarding wizard or startup, Zenth automatically connects, executes `CREATE DATABASE zenth`, and applies all DDL tables and indexes automatically!

##### Option 4: Local MongoDB (Native Service)
###### Windows
Install via Windows Package Manager:
```powershell
winget install MongoDB.Server
```

###### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

###### Linux (Ubuntu / Debian)
```bash
sudo apt-get install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
sudo apt-get update && sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

##### Option 5: Supabase Cloud PostgreSQL (Remote)
Create a free cloud project at **[supabase.com](https://supabase.com)** to sync trades and failure rules across multiple devices. Provisioning is 1-click automated via Personal Access Token (`sbp_...`) or manual SQL copy.

---

### 2. Installation Methods

Choose between the recommended package manager installation or manual source build.

#### Method 1: NPM / PNPM Package (Fast, Recommended)

Install `zenth` globally to access the standalone `zenth` command anywhere in your terminal.

##### A. Global CLI Installation

Install using pnpm:
```bash
pnpm add -g zenth
```

Install using npm:
```bash
npm install -g zenth
```

##### B. Running Operational Modes via `zenth` Command

Launch the interactive TUI terminal (Default):
```bash
zenth
```

Other available operational modes:

| Command | Description |
| :--- | :--- |
| `zenth scan` | Single-pass real-time scan against default exchange feed |
| `zenth scan --exchange <venue>` | Single-pass scan on specific venue (`binance`, `coinbase`, `okx`, `upbit`, `bitget`, `xt`) |
| `zenth replay:raw` | Baseline historical backtest without memory |
| `zenth replay:memory` | Replay comparison with Supabase adaptive filter enabled |
| `zenth memory:reset` | Clear and reset Supabase memory tables |

---

#### Method 2: Manual (Clone & Build from Source)

Ideal for developers and contributors who want to customize strategies, indicators, or TUI components.

##### Step 1: Clone the repository

Clone the repository:
```bash
git clone https://github.com/IMROVOID/Zenth.git
```

Enter the directory:
```bash
cd Zenth
```

##### Step 2: Install dependencies

```bash
npm install
```

##### Step 3: Compile TypeScript to JavaScript

```bash
npm run build
```

##### Step 4: Run operational modes

Launch interactive TUI (Default):
```bash
npm start
```

Run all automated verification tests:
```bash
npm test
# Or:
npm run test:all
```

Other available operational modes:

| Command | Description |
| :--- | :--- |
| `npm test` / `npm run test:all` | Run all 13 test suites sequentially via Master Test Runner |
| `npm run scan` | Single-pass real-time scan against default exchange feed |
| `npx tsx src/index.ts scan -e binance` | Single-pass scan against Binance public feed |
| `npx tsx src/index.ts scan -e okx` | Single-pass scan against OKX v5 public feed |
| `npx tsx src/index.ts scan -e bitget` | Single-pass scan against Bitget v2 public feed |
| `npx tsx src/index.ts scan -e coinbase` | Single-pass scan against Coinbase Exchange feed |
| `npm run replay:raw` | Baseline historical backtest without memory |
| `npm run replay:memory` | Replay comparison with Supabase adaptive filter enabled |
| `npm run memory:reset` | Clear and reset Supabase memory tables |

##### Step 5: (Optional) Link locally as a global CLI

Link globally with npm:
```bash
npm link
```

Now you can use `zenth` anywhere in your terminal:
```bash
zenth
```

### 3. Interactive Onboarding Wizard (First Launch)

When launching Zenth for the first time without a configured `.env` file (or by typing `/onboard` in the running terminal), the interactive wizard guides you through 4 steps:

- **Step 1: Database Backend Selection**
  - `[1] SQLite (Local File - Recommended)`: Zero setup, instant embedded local database in `./data/zenth.db`.
  - `[2] PostgreSQL (Local Server / Docker)`: Full relational database with 1-click auto-creation & table provisioning.
  - `[3] MongoDB (Local Server / Docker)`: High-performance document store with auto-collection & index creation.
  - `[4] Supabase Cloud (Remote PostgreSQL)`: Cloud PostgreSQL protected with Row-Level Security (RLS).
  - `[5] In-Memory (Offline / Ephemeral)`: Fast in-memory ledger only (RAM-only, zero disk footprint).

- **Step 2: Database Provisioning & Auto-Creation**
  - **SQLite**: Press `[ENTER]` for 1-click auto-creation of directory and tables.
  - **PostgreSQL**: Choose between 1-click auto-creation (`CREATE DATABASE zenth` + DDL tables) or custom credentials (`[G]` auto-generates secure passwords).
  - **MongoDB**: Choose between 1-click auto-initialization (indexes + collections) or custom connection URI.
  - **Supabase**: Connect via Personal Access Token (`sbp_...`) for 1-click provisioning or enter existing `SUPABASE_URL` / `SUPABASE_KEY`.

- **Step 3: Bot Trading & Risk Parameters**
  - **Exchange Venue**: Primary market provider (`Binance`, `Coinbase`, `OKX`, `Upbit`, `Bitget`, `XT.com`).
  - **Symbol / Asset**: Target pair on active exchange with live price feeds and 24h sparklines.
  - **Interval**: Candlestick timeframe (`1m`, `5m`, `15m`, `30m`, `1h`, `4h`, `1d`).
  - **Quantity**: Base asset order size per signal (`0.001` to `1.0` units).
  - **Max Position Cap**: Hard notional safety ceiling per trade in USD/USDT (`$100` to `$5,000`).
  - **Stop-Loss / Take-Profit**: Downside risk limit (`0.5%`–`5.0%`) and upside target (`1.0%`–`10.0%`).
  - **Candle Lookback**: Historical candlestick history fetched for indicator stability (`100` to `1,000` candles).

- **Step 4: Summary & Launch**
  - Reviews finalized parameters and writes configuration to `.env` before booting into the live trading terminal.

---

### 4. Environment Configuration (`.env`)

If you prefer configuring `.env` manually, create `.env` from the example file:
```bash
cp .env.example .env
```

Configure your parameters in `.env`:

```env
# ─────────────────────────────────────────────────────────────
# 1. STORAGE BACKEND (sqlite | postgres | mongodb | supabase | local)
# ─────────────────────────────────────────────────────────────
STORAGE_BACKEND=sqlite

# ─────────────────────────────────────────────────────────────
# 2. LOCAL SQLITE CONFIGURATION (Zero setup, embedded file DB)
# ─────────────────────────────────────────────────────────────
SQLITE_DB_PATH=./data/zenth.db

# ─────────────────────────────────────────────────────────────
# 3. LOCAL / SERVER POSTGRESQL (Used when STORAGE_BACKEND=postgres)
# ─────────────────────────────────────────────────────────────
# POSTGRES_URL=postgresql://postgres:postgrespassword@localhost:5432/zenth
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgrespassword
POSTGRES_DATABASE=zenth

# ─────────────────────────────────────────────────────────────
# 4. LOCAL / SERVER MONGODB (Used when STORAGE_BACKEND=mongodb)
# ─────────────────────────────────────────────────────────────
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=zenth

# ─────────────────────────────────────────────────────────────
# 5. SUPABASE CLOUD POSTGRESQL (Used when STORAGE_BACKEND=supabase)
# ─────────────────────────────────────────────────────────────
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-anon-or-service-key

# ─────────────────────────────────────────────────────────────
# 6. EXCHANGE VENUE (binance | coinbase | okx | upbit | bitget | xt)
# ─────────────────────────────────────────────────────────────
EXCHANGE=binance

# ─────────────────────────────────────────────────────────────
# 7. BOT TRADING & RISK PARAMETERS (Simulated Paper Trading Mode)
# ─────────────────────────────────────────────────────────────
DEFAULT_SYMBOL=btc_usdt
DEFAULT_INTERVAL=5m
DEFAULT_QUANTITY=0.01
MAX_POSITION_NOTIONAL_CAP=1000.0
STOP_LOSS_PCT=1.5
TAKE_PROFIT_PCT=3.0
CANDLE_LOOKBACK=300
POLL_INTERVAL_SECONDS=15
```

### 5. Database Schemas & Auto-Provisioning

All database engines are automatically initialized with 3 core tables/collections:
- `trade_ledger`: Execution timestamp, pair, action (`[BUY]`/`[SELL]`), fill price, quantity, fees, outcome, and PnL.
- `adaptive_learnings`: Classification tag, root cause, synthesized trading rule, status, and trigger count.
- `session_metrics`: Win rate, total closed PnL, realized profit %, active position, and peak drawdown.

#### PostgreSQL & Supabase DDL Script
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.trade_ledger (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    symbol TEXT NOT NULL,
    action TEXT NOT NULL,
    price NUMERIC(18, 8) NOT NULL,
    quantity NUMERIC(18, 8) NOT NULL,
    notional_value NUMERIC(18, 4),
    entry_value NUMERIC(18, 4),
    exit_value NUMERIC(18, 4),
    pnl_percentage NUMERIC(8, 4),
    fee_cost NUMERIC(18, 4),
    session_id TEXT,
    reason TEXT,
    mode TEXT NOT NULL DEFAULT 'PAPER',
    outcome TEXT NOT NULL DEFAULT 'PENDING',
    pnl NUMERIC(18, 4)
);

CREATE TABLE IF NOT EXISTS public.adaptive_learnings (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    symbol TEXT NOT NULL,
    pattern_condition TEXT NOT NULL,
    loss_reason TEXT NOT NULL,
    trading_rule TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    trigger_count INTEGER NOT NULL DEFAULT 0,
    last_triggered_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.session_metrics (
    id TEXT PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    symbol TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    last_updated_at TIMESTAMPTZ NOT NULL,
    total_entries INTEGER NOT NULL DEFAULT 0,
    total_wins INTEGER NOT NULL DEFAULT 0,
    total_losses INTEGER NOT NULL DEFAULT 0,
    win_rate NUMERIC(8, 4) NOT NULL DEFAULT 0,
    entered_capital NUMERIC(18, 4) NOT NULL DEFAULT 0,
    closed_capital NUMERIC(18, 4) NOT NULL DEFAULT 0,
    realized_pnl NUMERIC(18, 4) NOT NULL DEFAULT 0,
    realized_pnl_percentage NUMERIC(8, 4) NOT NULL DEFAULT 0,
    peak_unrealized_pnl NUMERIC(18, 4) NOT NULL DEFAULT 0,
    peak_unrealized_pct NUMERIC(8, 4) NOT NULL DEFAULT 0,
    active_position JSONB
);
```

#### SQLite DDL Script
```sql
CREATE TABLE IF NOT EXISTS trade_ledger (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    symbol TEXT NOT NULL,
    action TEXT NOT NULL,
    price REAL NOT NULL,
    quantity REAL NOT NULL,
    notional_value REAL,
    entry_value REAL,
    exit_value REAL,
    pnl_percentage REAL,
    fee_cost REAL,
    session_id TEXT,
    reason TEXT,
    mode TEXT NOT NULL DEFAULT 'PAPER',
    outcome TEXT NOT NULL DEFAULT 'PENDING',
    pnl REAL
);

CREATE TABLE IF NOT EXISTS adaptive_learnings (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    symbol TEXT NOT NULL,
    pattern_condition TEXT NOT NULL,
    loss_reason TEXT NOT NULL,
    trading_rule TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    trigger_count INTEGER NOT NULL DEFAULT 0,
    last_triggered_at TEXT,
    metadata TEXT DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS session_metrics (
    id TEXT PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    symbol TEXT NOT NULL,
    started_at TEXT NOT NULL,
    last_updated_at TEXT NOT NULL,
    total_entries INTEGER NOT NULL DEFAULT 0,
    total_wins INTEGER NOT NULL DEFAULT 0,
    total_losses INTEGER NOT NULL DEFAULT 0,
    win_rate REAL NOT NULL DEFAULT 0,
    entered_capital REAL NOT NULL DEFAULT 0,
    closed_capital REAL NOT NULL DEFAULT 0,
    realized_pnl REAL NOT NULL DEFAULT 0,
    realized_pnl_percentage REAL NOT NULL DEFAULT 0,
    peak_unrealized_pnl REAL NOT NULL DEFAULT 0,
    peak_unrealized_pct REAL NOT NULL DEFAULT 0,
    active_position TEXT
);
```

### 6. Execution Commands & Operational Modes

Zenth supports multiple operational modes across all execution methods (Global CLI, Instant Runner, and Source Repository):

| Operational Mode | Global CLI (`zenth`) | Instant Runner (`pnpm dlx` / `npx`) | Source Script (`npm` / `pnpm`) | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Interactive TUI** *(Default)* | `zenth` | `pnpm dlx zenth`<br>`npx zenth` | `npm start`<br>`pnpm start` | Launches full interactive fullscreen terminal interface with live HUD, telemetry, and slash commands. |
| **Live Market Scan** | `zenth scan` | `pnpm dlx zenth scan`<br>`npx zenth scan` | `npm run scan`<br>`pnpm scan` | Performs a single-pass headless real-time scan against default exchange feed. |
| **Multi-Exchange Scan** | `zenth scan -e binance` | `npx zenth scan -e okx` | `npx tsx src/index.ts scan -e bitget` | Runs live scan against specific venue (`binance`, `coinbase`, `okx`, `upbit`, `bitget`, `xt`). |
| **Raw Backtest Replay** | `zenth replay:raw` | `pnpm dlx zenth replay:raw`<br>`npx zenth replay:raw` | `npm run replay:raw`<br>`pnpm replay:raw` | Executes a historical backtest (300 candles) evaluating raw SMA/RSI signals without memory filtering. |
| **Adaptive Memory Replay** | `zenth replay:memory` | `pnpm dlx zenth replay:memory`<br>`npx zenth replay:memory` | `npm run replay:memory`<br>`pnpm replay:memory` | Executes backtest with Supabase adaptive filter enabled, showcasing automatic loss pattern skipping. |
| **Reset Memory Ledger** | `zenth memory:reset` | `pnpm dlx zenth memory:reset`<br>`npx zenth memory:reset` | `npm run memory:reset`<br>`pnpm memory:reset` | Clears all learned failure rules and trade records from Supabase and local stores. |
| **Wipe & Reset Database** | `zenth db:reset` | `pnpm dlx zenth db:reset`<br>`npx zenth db:reset` | `npm run db:reset`<br>`pnpm db:reset` | Truncates and resets all remote Supabase tables (`trade_ledger`, `adaptive_learnings`, `session_metrics`). |

### 7. Interactive Slash Commands Palette

Inside the interactive terminal interface, press `/` to open the autocomplete slash command menu:

- `/exchange [venue]` — Switch active market feed (`binance`, `coinbase`, `okx`, `upbit`, `bitget`, `xt`)
- `/onboard` — Relaunch the full-screen interactive onboarding & configuration wizard
- `/status` — Live Trading HUD & real-time tick stream
- `/ledger` — Browse historical trade records from Supabase
- `/learnings` — Inspect active learned failure patterns
- `/theme` — Open interactive color theme switcher
- `/config` — Edit bot parameters and risk constraints live
- `/scan` — Trigger an instant live market scan
- `/replay` — Execute historical backtest comparison
- `/reset` — Reset or clear symbol memory records
- `/resetdb` — Wipe and reset entire remote Supabase PostgreSQL database
- `/copy` — Copy all tick & trade logs directly to OS clipboard
- `/export` — Export session logs to TXT, CSV, MD, DOCX, or PDF
- `/coins` — Browse top crypto gainers & losers on active exchange
- `/stocks` — Browse tokenized US equity feeds on XT.com
- `/help` — View full keyboard & mouse shortcut manual
- `/quit` — Graceful exit with session performance debrief

### 8. TUI Themes

Dynamically switch color palettes at runtime using the `/theme` command or navigation tab `[4: THEME]`. Zenth includes 14 curated high-contrast developer themes:

- **Cyber Aesthetics**:
  - `matrix-terminal` — Phosphor green CRT matrix stream on pitch black background.
  - `cyberpunk` — High-voltage electric magenta, cyan, and acid yellow.
  - `synthwave-84` — Retro 80s neon grid sunset with hot pink, teal, and glow yellow.
- **Dark & Minimal**:
  - `pure-dark` — Minimalist pitch black OLED background with emerald and cyan accents.
  - `amber-charcoal` — Warm copper and amber glow on deep dark background.
  - `tokyo-night` — Deep navy nightscape with lavender, neon blue, and mint.
  - `solarized-dark` — Classic low-contrast precision teal with amber and cyan accents.
  - `monokai-pro` — Matte dark charcoal with lime, sunshine yellow, and coral.
  - `catppuccin-mocha` — Soothing pastel palette with mauve, sky blue, and sapphire.
  - `dracula` — Iconic gothic dark theme with purple, pink, and vibrant cyan.
  - `one-dark` — Atom editor dark palette with soft cyan, blue, and chalk white.
- **Retro & Nordic**:
  - `gruvbox-dark` — Warm earthy retro tones with terracotta, forest green, and gold.
  - `nord-dark` — Arctic icy blues, glaciers, and storm clouds.
  - `oxide-cloud` — Clean developer terminal with jade green, slate gray, and crisp white.

### 9. Creating Custom Themes

Zenth features a modular, strongly typed theme engine located in `src/tui/theme/`. All themes implement the `ColorPalette` interface and use the standard ANSI color helper `ansi` (`hex()`, `bgHex()`, `bold`, `dim`, etc.).

#### Step 1: Use the Theme Template
Import `ColorPalette`, `ansi`, and the `defineTheme` helper from `src/tui/theme/`:

```typescript
import { ColorPalette, ansi, defineTheme } from '../theme/index.js';

export const myCustomTheme: ColorPalette = defineTheme({
  // --- 1. Metadata ---
  name: 'my-custom-theme',
  displayName: 'My Custom Theme',
  isDark: true,
  category: 'cyber', // 'dark' | 'cyber' | 'minimal' | 'retro' | 'nordic'
  description: 'Custom neon purple and electric emerald palette',

  // --- 2. Backgrounds ---
  bg: '',
  headerBg: '',
  cardBg: '',
  inputBg: '',
  selectedBg: ansi.bgHex('#A855F7') + ansi.hex('#000000') + ansi.bold,

  // --- 3. Foregrounds & Accents ---
  text: ansi.hex('#F3E8FF'),
  dimText: ansi.hex('#7E22CE'),
  boldText: ansi.bold + ansi.hex('#FFFFFF'),
  accent: ansi.hex('#A855F7'),
  accentSecondary: ansi.hex('#10B981'),
  border: ansi.hex('#581C87'),
  borderActive: ansi.hex('#A855F7'),

  // --- 4. Functional Status Colors ---
  success: ansi.hex('#10B981'),
  danger: ansi.hex('#EF4444'),
  warning: ansi.hex('#F59E0B'),
  info: ansi.hex('#06B6D4'),

  // --- 5. Inverted Pill Badges ---
  badgeBuy: ansi.bgHex('#065F46') + ansi.hex('#A7F3D0') + ansi.bold,
  badgeSell: ansi.bgHex('#7F1D1D') + ansi.hex('#FECACA') + ansi.bold,
  badgeHold: ansi.bgHex('#27272A') + ansi.hex('#A1A1AA') + ansi.bold,
  badgeSkip: ansi.bgHex('#78350F') + ansi.hex('#FDE68A') + ansi.bold,
  badgeInfo: ansi.bgHex('#1E3A8A') + ansi.hex('#BFDBFE') + ansi.bold,
  badgeSuccess: ansi.bgHex('#065F46') + ansi.hex('#A7F3D0') + ansi.bold,
  badgeWarning: ansi.bgHex('#78350F') + ansi.hex('#FDE68A') + ansi.bold,
  badgeError: ansi.bgHex('#7F1D1D') + ansi.hex('#FECACA') + ansi.bold,
  badgeMemory: ansi.bgHex('#581C87') + ansi.hex('#E9D5FF') + ansi.bold,
  badgeRisk: ansi.bgHex('#164E63') + ansi.hex('#A5F3FC') + ansi.bold,
});
```

#### Step 2: Register Your Theme
Add your theme into one of the preset files (`src/tui/theme/presets/cyberThemes.ts`, `darkThemes.ts`, or `nordicThemes.ts`) or create a new preset file and export it in `src/tui/theme/presets/index.ts`:

```typescript
import { THEMES } from './src/tui/theme/presets/index.js';
// THEMES automatically picks up all presets defined in index.ts
```

#### Step 3: Activate Your Theme
You can set your custom theme as default in `.env`:
```env
ZENTH_THEME=my-custom-theme
```
Or switch to it dynamically inside the TUI by typing `/theme` or pressing tab `[4: THEME]`.

#### Step 4: Verify Theme Integrity
Run the automated theme test suite to ensure all tokens and schema properties are valid:
```bash
npx tsx tests/test_theme_presets.ts
```

---

## Multi-Format Export Engine

Zenth provides a standalone, zero-dependency report generator supporting 5 export formats and direct clipboard copying.

### Supported Export Formats

| Format | Extension | Description |
| :--- | :--- | :--- |
| **Plain Text** | `.txt` | Clean ASCII-bordered tabular report for terminal reading or standard logging. |
| **CSV Table** | `.csv` | Dual structured CSV tables separating Trade Ledger records and Tick Log telemetry. |
| **Markdown** | `.md` | GitHub Flavored Markdown document with summary cards, tables, and badge formatting. |
| **Office DOCX** | `.docx` | Native Office Open XML ZIP document with formatted headers, tables, and callouts. |
| **Vector PDF** | `.pdf` | Native binary PDF 1.4 document with Helvetica fonts, headers, metrics boxes, and tables. |

### Interactive File Path & Clipboard Flow

1. In TUI mode, type `/export` to open the format selection modal.
2. Select format (`1: TXT`, `2: CSV`, `3: MD`, `4: DOCX`, `5: PDF`).
3. An interactive input bar opens with prefilled default path (`exported-logs/zenth_session_<timestamp>.<ext>`). Edit path freely or press `Enter` to export.
4. Type `/copy` anytime to copy all tick telemetry and trade ledger logs to your system clipboard (`Windows Set-Clipboard`, macOS `pbcopy`, or Linux `xclip`/`wl-copy`).

---

## Verification & Automated Test Suite

### Run All Test Suites (Master Test Suite Runner)
Execute the complete master test runner sequentially across all 13 test suites:
```bash
npm test
# Or:
npx tsx tests/run_all_tests.ts
```

### Individual Test Suites

#### 1. Strategy & Indicators (SMA 9/21, RSI 14, Volume Filter)
```bash
npx tsx tests/test_strategy_indicators.ts
```

#### 2. Risk Management & Circuit Breakers ($1,000 Allocation Cap)
```bash
npx tsx tests/test_risk_manager.ts
```

#### 3. Adaptive Memory Filtering & Learning Triggers
```bash
npx tsx tests/test_adaptive_filter.ts
```

#### 4. Execution Engine & Position Management (SL / TP / Trailing Brackets)
```bash
npx tsx tests/test_execution_position.ts
```

#### 5. Market Service, Search & Synthetic Candlesticks
```bash
npx tsx tests/test_market_service.ts
```

#### 6. Replay Engine, Metrics & Pattern Classifier
```bash
npx tsx tests/test_replay_engine.ts
```

#### 7. Session Tracker & Live Scanner Integration
```bash
npx tsx tests/test_bot_session_loop.ts
```

#### 8. TUI Mathematical Box Drawing, Braille Charts & ANSI Formatting
```bash
npx tsx tests/test_tui_utils.ts
```

#### 9. Multi-Format Export Engine (TXT, CSV, MD, DOCX, PDF) & Clipboard
```bash
npx tsx tests/test_export_clipboard.ts
```

#### 10. Database Wipe & Store Reset
```bash
npx tsx tests/test_database_reset.ts
```

#### 11. Environment Configuration & Multi-DB Writer
```bash
npx tsx tests/test_env_config.ts
```

#### 12. Theme Presets & Color Palette Integrity
```bash
npx tsx tests/test_theme_presets.ts
```

#### 13. TUI Command Flow E2E Simulation
```bash
npx tsx tests/test_tui_command_flow.ts
```

#### 14. Supabase Connection & Schema Validator
```bash
npx tsx tests/test_supabase_validator.ts
```

---

## License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**. See the [LICENSE](LICENSE) file for full details.

```
Zenth — Autonomous Self-Learning Crypto Paper Trading Terminal
Copyright (C) 2026

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
```
