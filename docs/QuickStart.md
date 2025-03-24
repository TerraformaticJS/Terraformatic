# **TerraformaticJS** 🌱⚡  
*Sprout Terraform configs from JavaScript seeds.*  

---

## **🌌 Introduction**  
**TerraformaticJS** is a JavaScript-based DSL that generates **HashiCorp Configuration Language (HCL)** files. It lets you craft Terraform configurations using JavaScript’s flexibility while avoiding HCL’s quirks.  

> *“Terraform, but with semicolons and sass.”*  
> – A Developer Who Escaped YAML Hell  

---

## **🚫 Why TerraformaticJS Over Raw HCL?**  
### **For Those Who:**  
- ❤️ **JavaScript/TypeScript** but need to write Terraform.  
- 🤯 Hate balancing braces in nested HCL blocks.  
- 🎨 Want to **generate configs dynamically** (e.g., loops, functions, shared logic).  
- 🛠️ Prefer JS tooling (ESLint, TypeScript, npm scripts) over HCL’s limited ecosystem.  

### **Use Cases:**  
- Generate **environment-specific configs** (dev/staging/prod) from a single JS file.  
- Reuse configurations across projects with JS modules.  
- Build **self-documenting infra code** with JSDoc and TypeScript.  

---

## **🚀 Core Concepts** (Updated!)  

### **1. Blocks: Structure Simplified**  
Blocks are defined using three core keys:  

| Key       | Description                                  | Example JS                            | Rendered HCL                     |  
|-----------|----------------------------------------------|---------------------------------------|----------------------------------|  
| `block`   | Block type + labels as an array (e.g., `["resource", "aws_s3_bucket", "name"]`) | `["terraform"]` | `terraform { ... }` |  
| `attr`    | Key-value pairs (literals, variables, expressions) | `{ ami: "ami-123" }` | `ami = "ami-123"` |  
| `child`   | Nested blocks (e.g., `cpu_options`, `content`) | `[{ block: ["cpu_options"], attr: {...} }]` | `cpu_options { ... }` |  

**Block Structure Rules:**  
- The first string in `block` always specifies the block type (e.g., `resource`, `provider`).  
- Subsequent strings are Terraform labels (resource type, name).  

```javascript  
// EC2 instance with nested CPU options (updated syntax)  
const aws_instance_config = {  
  block: ["resource", "aws_instance", "myinstance"],  
  attr: {  
    ami: { $raw: "aws_ami.ubuntu.id" }, // Renders as aws_ami.ubuntu.id  
    instance_type: "t3.micro",  
    tags: {  
      Name: "Helloworlds"  
    }  
  },  
  child: [{  
    block: ["cpu_options"],  
    attr: { core_count: 2, threads_per_core: 2 }  
  }]  
};  
```  

---

### **2. Attribute Rendering**  
Attributes (`attr`) always use `=` assignment in HCL. Blocks without attributes render as empty structures.  

```javascript  
// Block with attributes vs empty block  
{ block: ["required_providers"], attr: {} }  
// Renders as:  
// required_providers {}  

{  
  block: ["required_providers"],  
  attr: {  
    aws: { source: "hashicorp/aws", version: "~>5.5.0" }  
  }  
}  
// Renders as:  
// required_providers {  
//   aws = {  
//     source = "hashicorp/aws"  
//     version = "~>5.5.0"  
//   }  
// }  
```  

---

### **3. Dynamic Attributes: $ Magic**  
Use special `$` operators to inject variables, functions, and raw HCL:  

| Operator  | JS Syntax                      | HCL Output                  |  
|-----------|--------------------------------|-----------------------------|  
| **`$var`** | `{ $var: "region" }`          | `var.region`                |  
| **`$raw`** | `{ $raw: "aws_ami.ubuntu.id" }` | `aws_ami.ubuntu.id`         |  
| **`$func`**| `{ $func: "tolist([1,2,3])" }` | `tolist([1,2,3])`           |  
| **`$heredoc`** | `{ $heredoc: "Hello\nWorld" }` | `<<-EOT\nHello\nWorld\nEOT` |  

```javascript  
// Mixing operators  
const user_data = {  
  $heredoc: `#!/bin/bash  
  echo "Welcome to ${ { $raw: "var.app_name" } }!"  
  `  
};  

const ec2Config = {  
  block: ["resource", "aws_instance", "web"],  
  attr: {  
    ami: "ami-0c55b159cbfafe1f0",  
    instance_type: { $var: "instance_size" }, // var.instance_size  
    user_data: user_data  
  }  
};  
```  

---

### **4. Dynamic Blocks**  
Use `["dynamic", "BLOCK_NAME"]` in the `block` array to create dynamic blocks:  

```javascript  
// Security group with dynamic ingress rules  
const sg = {  
  block: ["resource", "aws_security_group", "web"],  
  child: [{  
    block: ["dynamic", "ingress"],  
    attr: {  
      for_each: { $var: "allowed_ports" } // var.allowed_ports  
    },  
    child: [{  
      block: ["content"],  
      attr: {  
        from_port: { $raw: "ingress.value" }, // Raw reference  
        to_port: { $raw: "ingress.value" },  
        protocol: "tcp"  
      }  
    }]  
  }]  
};  
```  

*Renders as:*  
```hcl  
resource "aws_security_group" "web" {  
  dynamic "ingress" {  
    for_each = var.allowed_ports  
    content {  
      from_port = ingress.value  
      to_port   = ingress.value  
      protocol  = "tcp"  
    }  
  }  
}  
```  

---

## **✨ Quickstart Guide**  

### **Step 1: Define Configuration**  
```javascript  
// terraform.js  
const terraformConfig = {  
  block: ["terraform"],  
  attr: {  
    required_version: ">= 1.2.0"  
  },  
  child: [{  
    block: ["required_providers"],  
    attr: {  
      aws: { source: "hashicorp/aws", version: "5.0.0" }  
    }  
  }]  
};  
```  

### **Step 2: Add Resources**  
```javascript  
// database.js  
const db = {  
  block: ["resource", "aws_db_instance", "default"],  
  attr: {  
    engine: "postgres",  
    instance_class: { $var: "db_size" }, // var.db_size  
    password: { $var: "secrets.db_password" }  
  }  
};  
```  

### **Step 3: Generate & Apply**  
```bash  
node terraformatic.js > main.tf  
terraform apply  
```  

---

## **🔮 Best Practices**  
- **Use `$raw` for Cross-References**: Directly reference resources (e.g., `aws_ami.ubuntu.id`).  
- **Centralize Variables**: Manage `$var` references in a config object.  
- **Leverage JS Logic**: Use loops and functions to avoid repetitive blocks.  

---

## **🌩️ Troubleshooting**  
| Symptom                  | Fix                                  |  
|--------------------------|--------------------------------------|  
| **HCL renders `"ingress.value"`** | Use `{ $raw: "ingress.value" }` instead of a string. |  
| **Missing `var.` prefix** | Ensure `$var: "name"` (not `"var.name"`). |  
| **Empty block rendering** | Add at least one `attr` or `child` to the block. |  

---

## **🎉 Conclusion**  
**TerraformaticJS** turns infrastructure code into a playground for JavaScript lovers. Less HCL, more JS—because you deserve nicer syntax and `console.log` debugging. 🌈  

*Documentation brewed with ☕ by the Cloud Alchemists Guild.*  

--- 

**What’s Next?**  
- Explore the **CLI tool** for config generation.  
- Add **TypeScript types** for autocomplete.  
- Contribute on GitHub! 🌍
