import { Component, OnInit ,ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";
import {LinguaService} from "../../services/lingua.service";
import {Word} from "../../domains/word";

import Keyboard from "simple-keyboard";
import layout from "simple-keyboard-layouts/build/layouts/russian";
import SimpleKeyboardLayouts from "simple-keyboard-layouts";

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
  skl = new SimpleKeyboardLayouts()
  languagesAvailable: string[] = []
  selectedLanguageLayout = new FormControl('');

  constructor(private lingua:LinguaService) { }

  ngOnInit(): void {
    this.languagesAvailable = Object.keys(this.skl.layouts)
    console.log(this.languagesAvailable)

    this.text.setValue("Это о том, как быстро выучить новые слова")
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      theme: "hg-theme-default darkKeyboardTheme",
      physicalKeyboardHighlight: true,
      ...layout
    });
    // Listen for physical keyboard inputs
    document.addEventListener('keydown', (event) => {
      this.handlePhysicalKeyboardInput(event);
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

  handlePhysicalKeyboardInput(event: KeyboardEvent) {
    // Update the virtual keyboard input with the physical keyboard event
    console.log(event.key)
    this.value += event.key;
    this.keyboard?.setInput(this.value);
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

  changeKeyBoardLayout() {
    let language = this.selectedLanguageLayout.value
    console.log(language)
    this.keyboard?.setOptions({
      layout: this.skl.layouts['russian']
    })
  }
}
