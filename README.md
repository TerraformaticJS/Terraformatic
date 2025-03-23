
## **🌱 Why TerraformaticJS?**  
**Terraform** is brilliant. **HCL**… less so.  
- **You're a JavaScript developer**. You want native loops, functions, and modules - not `for_each` and `lookup()`.  
- **You love Terraform's power**, but hate debugging missing braces in 500-line HCL files.  
- **You want dynamic config generation** (dev/staging/prod) without HCL copy-paste.  

---

**TerraformaticJS** bridges the gap with intuitive block structure:  
```javascript  
// Write JS with clear block/attr separation  
const bucket = {  
  block: ["resource", "aws_s3_bucket", "web"],  
  attr: { bucket: `${env}-my-bucket` },  
  child: [{  
    block: ["logging"],  
    attr: { target_bucket: { $raw: "aws_s3_logs.main.id" } }  
  }]  
};  

// Generates clean HCL:  
// resource "aws_s3_bucket" "web" {  
//   bucket = "dev-my-bucket"  
//   logging {  
//     target_bucket = aws_s3_logs.main.id  
//   }  
// }  
```  

---

## **✨ Killer Features**  
- **Zero New Syntax**: Just JS objects → HCL with `block`/`attr` structure  
- **Native Terraform Compatibility**: Use existing providers/modules directly  
- **TypeScript Autocomplete**: Full resource type safety  
- **Pre-Flight Validation**: Catch errors before `terraform apply`  

---

## **🚀 Use Cases That'll Make You Switch**  

### **1. Dynamic Configuration Generation**  
**Problem**: Need 20 EC2 instances with tagging variations?  
**Solution**: Use JS array methods with block templates:  
```javascript  
const services = ["api", "worker", "cache"];  

const instances = services.map(name => ({  
  block: ["resource", "aws_instance", name],  
  attr: {  
    ami: { $raw: "data.aws_ami.ubuntu.id" },  
    instance_type: "t3.micro",  
    tags: {  
      Role: name,  
      Env: { $var: "environment" }  
    }  
  }  
}));  
```  

---

### **2. Environment-Specific Infrastructure**  
**Problem**: Duplicate HCL across environments  
**Solution**: Parameterize with JS functions:  
```javascript  
// network-config.js  
export const createNetwork = (env) => ({  
  block: ["module", "vpc"],  
  attr: {  
    source: "terraform-aws-modules/vpc/aws",  
    cidr_block: env === "prod" ? "10.0.0.0/16" : "192.168.0.0/24",  
    enable_nat_gateway: env === "prod"  
  }  
});  
```  

---

### **3. Shared Module Library**  
**Problem**: Repeating security group patterns  
**Solution**: Create reusable JS modules:  
```javascript  
// security-module.js  
export const baseSecurityGroup = {  
  block: ["resource", "aws_security_group", "base"],  
  attr: {  
    vpc_id: { $var: "vpc_id" },  
    ingress: {  
      $func: `[for port in var.ports : {  
        from_port = port  
        to_port   = port  
        protocol  = "tcp"  
      }]`  
    }  
  }  
};  
```  

---

## **🆚 Why Not CDKTF or Pulumi?**  

|                        | **TerraformaticJS**       | **CDKTF**               | **Pulumi**              |  
|------------------------|---------------------------|-------------------------|-------------------------|  
| **Control**            | Pure HCL output           | Generated HCL           | Cloud API calls         |  
| **Syntax**             | Native JS objects         | CDK constructs          | Language SDKs           |  
| **State Management**   | Standard Terraform        | Terraform               | Pulumi Engine           |  
| **Adoption**           | Gradual HCL replacement   | Full CDK commitment     | New paradigm            |  

---

## **⚡ Quick Start**  
1. **Install**:  
```bash  
npm install terraformatic  
```  

2. **Write Config**:  
```javascript  
// infra.tfmatic.js  
export default {  
  block: ["terraform"],  
  attr: {},  
  child: [{  
    block: ["required_providers"],  
    attr: {  
      aws: { source: "hashicorp/aws", version: "5.0.0" }  
    }  
  }]  
};  
```  

3. **Generate HCL**:  
```bash  
npx terraformatic compile infra.tfmatic.js -o main.tf  
```  

4. **Apply**:  
```bash  
terraform init && terraform apply  
```  

---

## **🌟 Join the Revolution**  
**TerraformaticJS** is for teams who:  
- ❤️ **JavaScript/TypeScript** ecosystems  
- 🛠️ Want gradual Terraform adoption  
- 🔁 Need dynamic config generation  
- 🔒 Require full HCL transparency  

```bash  
# Contribute to the future of infra-as-code:  
git clone https://github.com/terraformaticjs/core  
```  

---

## **📣 Roadmap**  
- [ ] **Visual Debugger**: Browser-based HCL preview  
- [ ] **Policy Pack**: JS-based validation rules  
- [ ] **HCL Import**: Convert existing TF to JS configs  

---

**🛠️ Built by developers who believe infrastructure should be *programmable*, not *painful*.**  
*Apache 2.0 License | Contributors Welcome*  

--- 

This version maintains consistency with the updated block/attr structure while emphasizing the native JS approach. I've added concrete examples of the $raw and $func operators, and preserved the comparison table while aligning it with the new syntax.
