import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {LinguaService} from "../../services/lingua.service";
import {Vocabulary, Word} from "../../domains/word";
import Keyboard from 'simple-keyboard';
import layout from "simple-keyboard-layouts/build/layouts/japanese";
import * as events from "events";


@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit {

  text = new FormControl('');
  vocabulary:Vocabulary|undefined
  showWord:Word|undefined
  from_lang:string = "ru"
  to_lang:string = "en"

  value = ""
  keyboard:Keyboard|undefined

  constructor(private lingua:LinguaService) { }

  ngOnInit(): void {
    this.text.setValue("Это о том, как быстро выучить новые слова")
  }

  readText() {
    // @ts-ignore
    this.lingua.trainReading(this.text.value, this.from_lang, this.to_lang).subscribe({
      next: value => {
        console.log(value)
        this.vocabulary = value
      }
    })

    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button)
    });
  }

  showThisWord(word: Word) {
    /* TODO store the need to show a word in the database for the user,
        so we know he has difficulties with this word inside a phrase */
    if (word && !this.showWord) {
      this.showWord = word
      setTimeout(() => this.showWord = undefined, 1000)
    }
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
  };

  onInputChange = (event: any) => {
    // @ts-ignore
    this.keyboard.setInput(event.target.value);
  };

  handleShift = () => {
    // @ts-ignore
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    // @ts-ignore
    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };


  protected readonly events = events;
}
