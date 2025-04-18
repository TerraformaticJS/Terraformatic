# 🌌 Lexer Configuration – Understanding Character Type Handling

AphelionJS includes a lightweight, modular **Lexer Engine** that scans source files (`.tfmatic.js`) and turns them into structured tokens for later HCL generation.

This document explains how the lexer is configured using **character types**, **state management**, and **handlers**.

---

## 🧠 What is a Lexer?

A **lexer** (or lexical analyzer) breaks source code down into **tokens**. Tokens are the building blocks of syntax — identifiers, numbers, operators, strings, etc.

In AphelionJS, we tokenize JavaScript-style objects so they can later be transformed into Terraform HCL.

---

## ⚙️ Character Type Configuration

You tell the lexer **how to classify each character** using a config object:

```js
let lexerConfig = {
  charTypes: {
    OPERATOR: isOperator,
    NUMBER: isNum,
    STRING: isQoute,
    ALPHA: isAlpha,
    DELIMITER: isDelimiter,
    LINE_COMMENT: islineComment,
    default: "UNKNOWN"
  }
}
```

### 🪐 How It Works:
- Each key represents a **character type category** (like `NUMBER` or `OPERATOR`).
- The value is a **function that returns true** if the character matches that category.
- The `default` key is a **fallback** — used when no match is found.

These character types are used to route characters through the correct behavior handlers during lexing.

---

## 🧱 State Machine Setup

Once configured, we pass this to the lexer:

```js
let tfLexer = new Lexer(lexerConfig);
```

This:
- Creates a lexer instance
- Loads the character type handlers
- Sets up the FSM (Finite State Machine) to control lexer flow

---

## 🎮 The ENTRY State

The first state is `"ENTRY"` — the default state where the lexer begins scanning characters.

```js
let entryState = tfLexer.stateManager.STATES["ENTRY"];
let charTypeHandlerKeys = tfLexer.charTypes;

entryState.addHandler("charTypeHandler", tfLexer.getNewHandler(charTypeHandlerKeys));
```

### What this does:
- Adds a handler for each character type (`OPERATOR`, `STRING`, etc.)
- Creates custom logic for how each type should be processed

---

## 🤖 Default Behavior

Every state has a **behavior function** — this is called for every character processed in that state.

```js
let lexDefaultBehavior = function (ctx) {
  return getNexState(this.charTypeHandler, "default", [ctx]);
};

entryState.setBehavior(lexDefaultBehavior);
```

This function:
- Reads the current character type
- Routes it to the matching handler (e.g., `charTypeHandler.STRING`)
- Returns the **next state** name

---

## 🧩 Handler Logic by Type

Each character type has a dedicated handler defining how it should behave. Here's a breakdown:

### OPERATOR
Handles `+`, `}`, `=`, etc. with support for mode-based behavior like string interpolation:
```js
entryState.charTypeHandler.OPERATOR = function (ctx) {
  let operatorTypeHandler = new Handler(["RIGHT_BRACE", "DEFAULT"]);
  operatorTypeHandler.RIGHT_BRACE = function (ctx) {
    let modeHandler = new Handler(["INTERPOLATION", "REGULAR"]);
    modeHandler.INTERPOLATION = () => "string";
    modeHandler.REGULAR = (ctx) => {
      ctx.addToOperatorBuffer(ctx.currentChar);
      return "operator";
    };
    let currentMode = ctx.modeManager.getCurrentMode();
    return modeHandler[currentMode](ctx);
  };
  operatorTypeHandler.DEFAULT = function (ctx) {
    ctx.addToOperatorBuffer(ctx.currentChar);
    return "operator";
  };
};
```

### NUMBER
```js
entryState.charTypeHandler.NUMBER = function (ctx) {
  ctx.addToTokenBuffer(ctx.currentChar);
  return "number";
};
```

### STRING
```js
entryState.charTypeHandler.STRING = function (ctx) {
  ctx.modeManager.addToModeStack("REGULAR");
  return "string";
};
```

### ALPHA (Identifiers)
```js
entryState.charTypeHandler.ALPHA = function (ctx) {
  ctx.addToTokenBuffer(ctx.currentChar);
  return "identifier";
};
```

### DELIMITER (Spaces, newlines)
```js
entryState.charTypeHandler.DELIMITER = function (ctx) {
  return "default";
};
```

### LINE_COMMENT
```js
entryState.charTypeHandler.LINE_COMMENT = function (ctx) {
  return "lineComment";
};
```

### UNKNOWN
```js
entryState.charTypeHandler.UNKNOWN = function (ctx) {
  throw new Error(`Syntax Error: Unexpected character ${ctx.currentChar} at line ${ctx.line}`);
};
```

---

## 🔀 Transition Rules

Each handler returns a **string** representing the next state. You define valid transitions like this:

```js
entryState.addTransition("default", "ENTRY");
entryState.addTransition("string", "STRING_READ");
entryState.addTransition("number", "NUMBER_READ");
entryState.addTransition("identifier", "IDENTIFIER_READ");
entryState.addTransition("operator", "OPERATOR_READ");
entryState.addTransition("lineComment", "LINE_COMMENT");
```

This means:
- If `OPERATOR` returns `"operator"` → transition to `"OPERATOR_READ"`
- If `STRING` returns `"string"` → transition to `"STRING_READ"`
- etc.

These additional states (`STRING_READ`, `NUMBER_READ`, etc.) define deeper handling for longer tokens.

---

## 🧪 Summary

This modular lexer setup provides:

✅ Easy-to-understand character classification  
✅ Plug-and-play behavior per character type  
✅ Finite state control over parsing flow  
✅ Extendable architecture for language growth

---
