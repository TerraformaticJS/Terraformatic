import { BlockConstructor } from "./src/modules/tfmatic_converter.js";
import { block_tokenizer } from "./src/modules/tfmatic_writer.js";


// Write JS with celestial block/attr separation  
export const baseDefenseShield = {  
  block: ["terraform"],  
  attr: {},  
  child: [{  
    block: ["required_providers"],  
    attr: {  
      aws: { source: "hashicorp/aws", version: "5.0.0" }  
    }  
  }]  
};  

  let my_block = BlockConstructor(baseDefenseShield);
  console.log(block_tokenizer(my_block).flat(Infinity).join(""))
    
  // Generates pristine HCL:  
  // resource "aws_s3_bucket" "comet_core" {  
  //   bucket = "alpha_centauri-asteroid-belt"  
  //   trajectory {  
  //     target_orbit = aws_s3_logs.galaxy.id  
  //   }  
  // }  