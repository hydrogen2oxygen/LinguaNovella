import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {LinguaService} from "../../services/lingua.service";
import {Word} from "../../domains/word";

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit {

  text = new FormControl('');
  words:Word[] = []
  showWord:Word|undefined
  from_lang:string = "ru"
  to_lang:string = "en"

  constructor(private lingua:LinguaService) { }

  ngOnInit(): void {
    this.text.setValue("Это о том, как быстро выучить новые слова")
  }

  readText() {
    // @ts-ignore
    this.lingua.translateWords(this.text.value, this.from_lang, this.to_lang).subscribe({
      next: value => {
        this.words = value
      }
    })
  }

  showThisWord(word: Word) {
    /* TODO store the need to show a word in the database for the user,
        so we know he has difficulties with this word inside a phrase */
    if (word && !this.showWord) {
      this.showWord = word
      setTimeout(() => this.showWord = undefined, 1000)
    }
  }
}
