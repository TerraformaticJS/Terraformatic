# TerraformaticJS HCL Generator

A JavaScript-based Terraform HCL (HashiCorp Configuration Language) generator for programmatically creating infrastructure-as-code configurations.

## Overview

This project provides a structured way to generate Terraform HCL configurations using JavaScript objects. It follows a modular architecture with clear separation between data modeling, conversion logic, and code generation.

## Architecture

### Core Components

1. **Handlers** (`handlers/`):
   - **Attribute/Block Generation**: Convert JS objects to `Attr`/`Block` prototypes
   - **Tokenizer Handlers**: Convert internal representations to HCL tokens
   - Key Files:
     - `tfmatic_handlers.js` - Attribute/Block construction logic
     - `tfmatic_tokenizer_handlers.js` - Tokenization rules

2. **Converters** (`converters/`):
   - **Attribute Processor**: Transforms JS objects to attribute collections
   - **Block Constructor**: Creates nested block structures
   - Key File: `tfmatic_converter.js`

3. **Writers** (`writers/`):
   - **Tokenization Engine**: Converts prototypes to valid HCL
   - **Formatting**: Handles indentation and syntax formatting
   - Key File: `tfmatic_writer.js`

4. **Prototypes** (`proto/`):
   - **Block**: Represents Terraform blocks with prefix/children/attributes
   - **Attr**: Base class for Terraform attributes
   - Key Files: `block.js`, `attr.js`

### Data Flow
1. User provides JS configuration objects
2. Converters transform objects to Block/Attr prototypes
3. Writers recursively process prototypes
4. Handlers apply type-specific tokenization rules
5. Formatted HCL output is generated

## Key Features

- **Recursive Processing**: Handles nested blocks and complex object structures
- **Type-aware Generation**: Automatic handling of different data types
- **Special Syntax Support**:
  - `$var` for variable references
  - `$raw` for unquoted values
  - `$heredoc` for multi-line strings
  - Custom string handling with `$string`

## Example Usage

```javascript
// Define configuration
const aws_config = {
  block: ["resource", "aws_instance", "web"],
  attr: {
    ami: { $raw: "data.aws_ami.ubuntu.id" },
    instance_type: "t3.micro",
    tags: { Name: "WebServer" }
  },
  child: [{
    block: ["root_block_device"],
    attr: {
      volume_size: 20,
      delete_on_termination: true
    }
  }]
};

// Generate HCL
const block = BlockConstructor(aws_config);
const hcl = block_tokenizer(block).flat(Infinity).join("");
console.log(hcl);
