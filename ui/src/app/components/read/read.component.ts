import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";
import {LinguaService} from "../../services/lingua.service";
import {Word} from "../../domains/word";

import Keyboard from "simple-keyboard";

@Component({
  selector: 'app-read',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit {

  text = new FormControl('');
  words:Word[] = []
  showWord:Word|undefined
  from_lang:string = "ru"
  to_lang:string = "en"

  value = "";
  keyboard: Keyboard|undefined;

  constructor(private lingua:LinguaService) { }

  ngOnInit(): void {
    this.text.setValue("Это о том, как быстро выучить новые слова")
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      theme: "hg-theme-default darkKeyboardTheme"
    });
  }

  onChange = (input: string) => {
    this.value = input;
    console.log("Input changed", input);
  };

  onKeyPress = (button: string) => {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") this.handleShift();

    const buttonElement = document.querySelector(`.hg-button-${button}`);
    if (buttonElement) {
      buttonElement.classList.add('animated');
      setTimeout(() => buttonElement.classList.remove('animated'), 300); // Duration of the animation
    }
  };

  onInputChange = (event: any) => {
    this.keyboard?.setInput(event.target.value);
  };

  handleShift = () => {
    let currentLayout = this.keyboard?.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard?.setOptions({
      layoutName: shiftToggle
    });
  };

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
