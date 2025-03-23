## **🌱 Why TerraformaticJS?**  
**Terraform** is brilliant. **HCL**… less so.  
- **You’re a JavaScript developer**. You want loops, functions, and modules—not `for_each` and `lookup()`.  
- **You love Terraform’s power**, but hate debugging missing braces in 500-line `main.tf` files.  
- **You want to generate dynamic configs** (dev/staging/prod) without copy-pasting HCL.  

(Bean)[./image1.png]
**TerraformaticJS** bridges the gap:  
```javascript  
// Write JS  
const bucket = {  
  block: ["resource", "aws_s3_bucket", "web"],  
  attributes: { bucket: `${env}-my-bucket` }  
};  

// Get HCL  
resource "aws_s3_bucket" "web" {  
  bucket = "dev-my-bucket"  
}  
```  

---

## **✨ Killer Features**  
- **Zero New Abstractions**: Just JS objects → HCL.  
- **Full Terraform Compatibility**: Use existing modules/providers.  
- **TypeScript Support**: Autocomplete for AWS, GCP, Azure.  
- **Pre-Generation Validation**: Catch errors *before* `terraform apply`.  

---

## **🚀 Use Cases That’ll Make You Switch**  

### **1. Generate Configs Dynamically**  
**Problem**: Need 100 S3 buckets with similar rules? HCL’s `for_each` is clunky.  
**Solution**: Use JS `map()`:  
```javascript  
const buckets = ["user-data", "logs", "backups"];  

const bucketConfigs = buckets.map(name => ({  
  block: ["resource", "aws_s3_bucket", name],  
  attributes: {  
    bucket: `${name}-${env}`,  
    tags: { $func: `tomap({ Name = "${name}" })` }  
  }  
}));  
```  

---

### **2. Environment-Specific Infra**  
**Problem**: Duplicate HCL for dev/staging/prod.  
**Solution**: Parameterize with JS functions:  
```javascript  
// config.js  
export const envConfig = (env) => ({  
  block: ["module", "app"],  
  attributes: {  
    instance_count: env === "prod" ? 5 : 1,  
    enable_monitoring: env === "prod"  
  }  
});  
```  

---

### **3. Reusable Modules**  
**Problem**: Repeating the same VPC code across projects.  
**Solution**: Share JS modules like npm packages:  
```javascript  
// shared/modules/network.js  
export const vpcModule = {  
  block: ["module", "vpc"],  
  attributes: {  
    source: "terraform-aws-modules/vpc/aws",  
    cidr_block: "10.0.0.0/16"  
  }  
};  
```  

---

## **🆚 Why Not CDKTF or Pulumi?**  

|                        | **TerraformaticJS**       | **CDKTF**               | **Pulumi**              |  
|------------------------|---------------------------|-------------------------|-------------------------|  
| **Output**             | HCL (you control it)      | HCL (generated)         | Cloud API calls (no HCL)|  
| **Learning Curve**     | JS + Terraform basics     | CDK concepts            | Cloud SDKs             |  
| **Portability**        | Generated HCL works everywhere | CDK lock-in        | Pulumi runtime required|  
| **Best For**           | Terraform teams using JS  | CDK adopters            | Cloud-agnostic projects|  

---

## **⚡ Quick Start**  
1. **Install**:  
```bash  
npm install terraformatic  
```  

2. **Write Config**:  
```javascript  
// infra.js  
import { defineConfig } from "terraformatic";  

export default defineConfig({  
  block: ["resource", "aws_instance", "web"],  
  attributes: {  
    ami: "ami-0c55b159cbfafe1f0",  
    instance_type: { $var: "instance_size" }  
  }  
});  
```  

3. **Generate HCL**:  
```bash  
npx terraformatic generate infra.js -o main.tf  
```  

4. **Apply**:  
```bash  
terraform apply  
```  

---

## **🌟 Join the Revolution**  
**TerraformaticJS** is for developers who:  
- ❤️ **JavaScript** but need Terraform.  
- 🤝 Believe in **open infra** (no vendor lock-in).  
- 🚀 Want to code infrastructure **like software**, not YAML.  

```bash  
# Star the repo ⭐, build something magical, and tag us!  
git clone https://github.com/your-repo/terraformatic  
```  

---

## **📣 Roadmap**  
- [ ] **CLI Tool**: Watch mode, HCL → JS conversion.  
- [ ] **VS Code Extension**: Syntax highlighting, HCL previews.  
- [ ] **Terraform Cloud Integration**: Plan/apply from JS.  

---  

**🛠️ Built with ☕ by developers who escaped HCL hell.**  
*License: MIT*
