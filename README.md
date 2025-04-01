## **☄️ Why TerraformaticJS?**  
**Terraform** is stellar. **HCL**… feels like navigating an asteroid belt.  
- **You're a JavaScript developer**. You want native loops, functions, and modules - not `for_each` and `lookup()` meteor showers.  
- **You love Terraform's power**, but hate debugging missing braces in 500-line HCL asteroid maps.  
- **You want dynamic config generation** (alpha_centauri/andromeda/milky_way) without HCL copy-paste.  

---
![Logo](https://github.com/TerraformaticJS/Terraformatic/blob/main/docs/pebbelhpglow.jpg?raw=true)

**TerraformaticJS** propels your infrastructure with cosmic block structure:  
```javascript  
// Write JS with celestial block/attr separation  
const cometCore = {  
  block: ["resource", "aws_s3_bucket", "comet_core"],  
  attr: { bucket: `${sector}-asteroid-belt` },  
  child: [{  
    block: ["trajectory"],  
    attr: { target_orbit: { $raw: "aws_s3_logs.galaxy.id" } }  
  }]  
};  

// Generates pristine HCL:  
// resource "aws_s3_bucket" "comet_core" {  
//   bucket = "alpha_centauri-asteroid-belt"  
//   trajectory {  
//     target_orbit = aws_s3_logs.galaxy.id  
//   }  
// }  
```  

---

## **🚀 Killer Features**  
- **Zero New Syntax**: Just JS objects → HCL with `block`/`attr` gravitational pull  
- **Native Terraform Compatibility**: Dock with existing providers/modules  
- **TypeScript Autocomplete**: Navigate configs like a star chart  
- **Pre-Flight Validation**: Avoid asteroid collisions before `terraform apply`  

---

## **🌌 Use Cases That'll Launch Your Infrastructure**  

### **1. Orbital Configuration Generation**  
**Problem**: Need 20 probe clusters with varying defense protocols?  
**Solution**: Use JS array methods with cosmic templates:  
```javascript  
const missions = ["explorer", "miner", "research"];  

const probes = missions.map(name => ({  
  block: ["resource", "aws_instance", name],  
  attr: {  
    ami: { $raw: "data.aws_ami.space_station.id" },  
    instance_type: "t3.cosmic",  
    tags: {  
      Mission: name,  
      Sector: { $var: "galaxy" }  
    }  
  }  
}));  
```  

---

### **2. Galaxy-Specific Infrastructure**  
**Problem**: Duplicate HCL across star systems  
**Solution**: Warp-speed parameterization:  
```javascript  
// galaxy-config.js  
export const createGalaxyNetwork = (sector) => ({  
  block: ["module", "wormhole"],  
  attr: {  
    source: "terraform-aws-modules/wormhole/aws",  
    cidr_block: sector === "alpha_centauri" ? "10.0.0.0/16" : "192.168.0.0/24",  
    enable_nebula_gateway: sector === "alpha_centauri"  
  }  
});  
```  

---

### **3. Cosmic Defense Modules**  
**Problem**: Repeating shield patterns across fleets  
**Solution**: Reusable defense blueprints:  
```javascript  
// defense-module.js  
export const baseDefenseShield = {  
  block: ["resource", "aws_security_group", "shield"],  
  attr: {  
    vpc_id: { $var: "wormhole_id" },  
    ingress: {  
      $func: `[for port in var.defense_ports : {  
        from_port = port  
        to_port   = port  
        protocol  = "tcp"  
      }]`  
    }  
  }  
};  
```  

---

## **🛸 Why Not CDKTF or Pulumi?**  

|                        | **TerraformaticJS**       | **CDKTF**               | **Pulumi**              |  
|------------------------|---------------------------|-------------------------|-------------------------|  
| **Control**            | Pure HCL output           | Generated HCL           | Cloud API calls         |  
| **Syntax**             | Native JS constellations  | CDK constructs          | Language SDKs           |  
| **State Management**   | Standard Terraform        | Terraform               | Pulumi Engine           |  
| **Adoption**           | Gradual HCL replacement   | Full CDK commitment     | New paradigm            |  

---

## **🌠 Quick Start**  
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

4. **Launch**:  
```bash  
terraform init && terraform apply  
```  

---

## **🪐 Join the Cosmic Fleet**  
**TerraformaticJS** is for teams who:  
- 🌠 **JavaScript/TypeScript** ecosystems fuel their engines  
- 🛰️ Want gradual Terraform adoption across galaxies  
- 🌪️ Need dynamic config generation at warp speed  
- 🔭 Require full HCL transparency through the telescope  

```bash  
# Contribute to the future of cosmic infrastructure:  
git clone https://github.com/terraformaticjs/core  
```  

---

## **📡 Roadmap**  
- [ ] **Astro Viewer**: Browser-based HCL constellation maps  
- [ ] **Orbital Defense Policies**: JS-based validation shields  
- [ ] **Meteorite Assimilation**: Convert existing TF to JS star charts  
