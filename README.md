# **TerraformaticJS** 🌱⚡  
*Because writing HCL should feel like planting magic beans.*  

---

## **🌌 Introduction**  
**TerraformaticJS** is a JavaScript-based DSL (Domain-Specific Language) for generating **HashiCorp Configuration Language (HCL)** files. It turns JavaScript objects into Terraform configurations, letting you wield the power of infrastructure-as-code with the familiarity of JS.  

> *"Why whisper to YAML or HCL when you can dance with JavaScript?"*  
> – A DevOps Poet (probably)

---

## **🚀 Core Concepts**  

### **1. Blocks: The Building Blocks**  
Blocks are the DNA of Terraform. In TerraformaticJS, they’re defined as **objects** with three keys:  

| Key             | Description                                  | Example JS                            | Rendered HCL                     |  
|-----------------|----------------------------------------------|---------------------------------------|----------------------------------|  
| `block_prefix`  | Block type + labels (e.g., `["resource", "aws_s3_bucket"]`) | `["resource", "aws_s3_bucket", "my_bucket"]` | `resource "aws_s3_bucket" "my_bucket"` |  
| `attributes`    | Key-value pairs (literals or expressions)    | `{ acl: "private" }`                  | `acl = "private"`                |  
| `child_blocks`  | Nested blocks (e.g., `lifecycle`, `website`) | `[{ block_prefix: ["lifecycle"] }]`   | `lifecycle { ... }`              |  

```javascript  
// Define an S3 bucket with a nested lifecycle rule  
const s3Bucket = {  
  block_prefix: ["resource", "aws_s3_bucket", "my_bucket"],  
  attributes: {  
    bucket: "my-magical-bucket",  
    tags: { $func: 'tomap({ Name = "Bucket of Wonders" })' },  
  },  
  child_blocks: [{  
    block_prefix: ["lifecycle"],  
    attributes: {  
      prevent_destroy: { $var: "var.production" } // Renders as var.production  
    }  
  }]  
};  
```  

---

### **2. Attributes: Literals vs. Sorcery**  
Not all attributes are created equal. Some are **static**, others are **dynamic incantations**:  

| Type          | JS Syntax                      | HCL Output                  |  
|---------------|--------------------------------|-----------------------------|  
| **Literal**   | `"hello"`                     | `"hello"`                   |  
| **Variable**  | `{ $var: "var.region" }`      | `var.region`                |  
| **Function**  | `{ $func: "jsonencode({...})" }` | `jsonencode({...})`         |  
| **Heredoc**   | `{ $heredoc: "<<-EOT\n..." }` | `<<-EOT\n...\nEOT`          |  

```javascript  
// Mixing literals, vars, and functions  
const ec2Instance = {  
  block_prefix: ["resource", "aws_instance", "web"],  
  attributes: {  
    ami: "ami-0c55b159cbfafe1f0",  
    instance_type: { $var: "var.instance_size" },  
    user_data: {  
      $heredoc: `<<-EOT  
        #!/bin/bash  
        echo "Behold, ${ { $var: "var.app_name" } }!"  
      EOT`  
    }  
  }  
};  
```  

---

### **3. Dynamic Blocks: The Shape-Shifters**  
For loops that generate blocks dynamically, channel the power of `dynamic`:  

```javascript  
// Generate multiple security group rules  
const sg = {  
  block_prefix: ["resource", "aws_security_group", "web"],  
  child_blocks: [{  
    dynamic: "ingress",  
    for_each: { $var: "var.allowed_ports" },  
    content: {  
      attributes: {  
        from_port: { $var: "ingress.value" },  
        to_port: { $var: "ingress.value" },  
        protocol: "tcp"  
      }  
    }  
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
Define your root block (e.g., `terraform`, `provider`):  
```javascript  
const terraformConfig = {  
  block_prefix: ["terraform"],  
  attributes: {  
    required_version: ">= 1.2.0"  
  },  
  child_blocks: [  
    {  
      block_prefix: ["required_providers"],  
      attributes: {  
        aws: { source: "hashicorp/aws", version: "5.0.0" }  
      }  
    }  
  ]  
};  
```  

### **Step 2: Summon Resources**  
Add resources/data sources:  
```javascript  
const magicalDatabase = {  
  block_prefix: ["resource", "aws_db_instance", "default"],  
  attributes: {  
    engine: "postgres",  
    instance_class: { $var: "var.db_size" },  
    password: { $var: "secrets.db_password" }  
  }  
};  
```  

### **Step 3: Cast the Spell**  
Run your generator to convert JS ➔ HCL:  
```bash  
node terraformatic.js > main.tf  
```  

---

## **🔮 Best Practices**  
- **Avoid Escaped Quotes**: Let the generator handle quoting!  
- **Embrace Expressions**: Use `$var`, `$func`, and `$heredoc` to keep JS clean.  
- **Version Control**: Commit your JS configs—they’re the source of truth!  

---

## **🌩️ Troubleshooting**  
| Symptom                  | Fix                                  |  
|--------------------------|--------------------------------------|  
| **HCL renders `"var.region"`** | Use `{ $var: "var.region" }` instead of `"var.region"`. |  
| **Dynamic block not rendering** | Forgot `dynamic:` key? Check nested `content`. |  
| **Unquoted literal**      | Ensure strings are values, not keys. |  

---

## **🎉 Conclusion**  
With **TerraformaticJS**, you’re not just writing configs—you’re composing symphonies of infrastructure. Now go forth, and may your `terraform apply` always exit with code `0`!  

*Documentation crafted with 🧙♂️ by the Order of the Cloud Wizards.*  

---  
