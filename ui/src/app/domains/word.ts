export class Word {
  word:string = "";
  translation:string = "";
}

export class Vocabulary {
  from_lang:string = ""
  to_lang:string = ""
  phrase_id:string = ""
  text:string = ""
  translation:string = ""
  translations:Word[] = []
}
