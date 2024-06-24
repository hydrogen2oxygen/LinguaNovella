import {Vocabulary} from "./Vocabulary";

/*
TrainingData represents one set of training data, there will be multiple of them during one session
 */
export class TrainingData {
  phrase_id:number|undefined
  text:string = ""
  vocabulary:Vocabulary[] = []
  from_lang:string|undefined
  to_lang:string|undefined
}
