import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {LinguaService} from "../../services/lingua.service";
import {Word} from "../../domains/word";
import Keyboard from 'simple-keyboard';
import * as events from "events";
import {TrainingData} from "../../domains/TrainingData";


@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit {

  text = new FormControl('');
  trainingData:TrainingData = new TrainingData()
  showWord:Word|undefined
  keyboard:Keyboard|undefined

  constructor(private lingua:LinguaService) { }

  ngOnInit(): void {
    this.text.setValue("Это о том, как быстро выучить новые слова")
    this.trainingData.from_lang = "ru"
    this.trainingData.to_lang = "en"

    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button)
    });
  }

  readText() {

    this.trainingData.phrase_id = undefined
    // @ts-ignore
    this.trainingData.text = this.text.value

    this.lingua.trainReading(this.trainingData).subscribe({
      next: value => {
        console.log(value)
        this.trainingData = value

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

  onChange = (input: string) => {
    this.trainingData.text = input;
    this.trainingData.phrase_id = undefined
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
