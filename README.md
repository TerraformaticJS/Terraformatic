
# **TerraformaticJS** 🌱⚡  
*Sprout Terraform configs from JavaScript seeds.*  

---

## **🌌 Introduction**  
**TerraformaticJS** is a JavaScript-based DSL that generates **HashiCorp Configuration Language (HCL)** files. It lets you craft Terraform configurations using JavaScript’s flexibility while avoiding HCL’s quirks.  

> *“Terraform, but with semicolons and sass.”*  
> – A Developer Who Escaped YAML Hell  

## Use cases:
[/docs/usecases]
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

### **1. Blocks: Simpler Than Ever**  
Blocks now use minimalist keys:  

| Key       | Description                                  | Example JS                            | Rendered HCL                     |  
|-----------|----------------------------------------------|---------------------------------------|----------------------------------|  
| `block`   | Block type + labels (e.g., `["resource", "aws_s3_bucket"]`) | `["resource", "aws_s3_bucket", "my_bucket"]` | `resource "aws_s3_bucket" "my_bucket"` |  
| `attributes` | Key-value pairs (literals, vars, or raw expressions) | `{ acl: "private" }`                  | `acl = "private"`                |  
| `child`   | Nested blocks (e.g., `lifecycle`, `content`) | `[{ block: ["lifecycle"] }]`          | `lifecycle { ... }`              |  

```javascript  
// S3 bucket with lifecycle rule (updated syntax)  
const s3Bucket = {  
  block: ["resource", "aws_s3_bucket", "my_bucket"],  
  attributes: {  
    bucket: "my-magical-bucket",  
    tags: { $func: 'tomap({ Name = "Bucket of Wonders" })' },  
  },  
  child: [{  
    block: ["lifecycle"],  
    attributes: {  
      prevent_destroy: { $var: "production" } // Renders as var.production  
    }  
  }]  
};  
```  

---

### **2. Attributes: Clarity with `$var` and `$raw`**  
| Type          | JS Syntax                      | HCL Output                  |  
|---------------|--------------------------------|-----------------------------|  
| **Literal**   | `"tcp"`                       | `"tcp"`                     |  
| **Variable**  | `{ $var: "region" }`          | `var.region`                |  
| **Raw Expr**  | `{ $raw: "ingress.value" }`   | `ingress.value`             |  
| **Function**  | `{ $func: "tolist([...])" }`  | `tolist([...])`             |  
| **Heredoc**   | `{ $heredoc: "MULTILINE" }`   | `<<-EOT\nMULTILINE\nEOT`    |  

```javascript  
// Mixing literals, vars, and raw expressions (no ambiguity!)  
const ec2Instance = {  
  block: ["resource", "aws_instance", "web"],  
  attributes: {  
    ami: "ami-0c55b159cbfafe1f0",  
    instance_type: { $var: "instance_size" }, // var.instance_size  
    user_data: {  
      $heredoc: `<<-EOT  
        #!/bin/bash  
        echo "Welcome to ${ { $raw: "var.app_name" } }!"  
      EOT`  
    }  
  }  
};  
```  

---

### **3. Dynamic Blocks: Explicit and Clean**  
```javascript  
// Generate security group rules (fixed syntax!)  
const sg = {  
  block: ["resource", "aws_security_group", "web"],  
  child: [{  
    block: ["dynamic", "ingress"], // ✅ Dynamic block  
    attributes: {  
      for_each: { $var: "allowed_ports" } // var.allowed_ports  
    },  
    child: [{  
      block: ["content"], // Nested content block  
      attributes: {  
        from_port: { $raw: "ingress.value" }, // Raw expression  
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

### **Step 1: Plant the Seed**  
```javascript  
// terraform.js  
const terraformConfig = {  
  block: ["terraform"],  
  attributes: {  
    required_version: ">= 1.2.0"  
  },  
  child: [{  
    block: ["required_providers"],  
    attributes: {  
      aws: { source: "hashicorp/aws", version: "5.0.0" }  
    }  
  }]  
};  
```  

### **Step 2: Summon Resources**  
```javascript  
// database.js  
const magicalDatabase = {  
  block: ["resource", "aws_db_instance", "default"],  
  attributes: {  
    engine: "postgres",  
    instance_class: { $var: "db_size" }, // var.db_size  
    password: { $var: "secrets.db_password" }  
  }  
};  
```  

### **Step 3: Cast the Spell**  
```bash  
node terraformatic.js > main.tf  
terraform apply  
```  

---

## **🔮 Best Practices**  
- **Use `$raw` for Non-Variables**: Mark Terraform references (e.g., `aws_instance.web.id`).  
- **Keep JS Configs DRY**: Reuse blocks with JS functions and modules.  
- **Type Safety**: Add TypeScript types for autocomplete and validation.  

---

## **🌩️ Troubleshooting**  
| Symptom                  | Fix                                  |  
|--------------------------|--------------------------------------|  
| **HCL renders `"ingress.value"`** | Use `{ $raw: "ingress.value" }` instead of a raw string. |  
| **Missing `var.` prefix** | Ensure `$var: "name"` (not `"var.name"`). |  
| **Dynamic block errors** | Nest `content` under `block: ["dynamic", "..."]`. |  

---

## **🎉 Conclusion**  
**TerraformaticJS** turns infrastructure code into a playground for JavaScript lovers. Less HCL, more JS—because you deserve nicer syntax and `console.log` debugging. 🌈  

*Documentation brewed with ☕ by the Cloud Alchemists Guild.*  

--- 
