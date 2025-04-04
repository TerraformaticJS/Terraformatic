import { BlockConstructor } from "./modules/tfmatic_converter.js";
import { block_tokenizer } from "./modules/tfmatic_writer.js";


// Write JS with celestial block/attr separation  
const cometCore = {  
    block: ["resource", "aws_s3_bucket", "comet_core"],  
    attr: { bucket: `asteroid-belt` },  
    child: [{  
      block: ["trajectory"],  
      attr: { target_orbit: { $raw: "aws_s3_logs.galaxy.id" } }  
    }]  
  };  


  let my_block = BlockConstructor(cometCore);
  console.log(block_tokenizer(my_block).flat(Infinity).join(""))
    
  // Generates pristine HCL:  
  // resource "aws_s3_bucket" "comet_core" {  
  //   bucket = "alpha_centauri-asteroid-belt"  
  //   trajectory {  
  //     target_orbit = aws_s3_logs.galaxy.id  
  //   }  
  // }  