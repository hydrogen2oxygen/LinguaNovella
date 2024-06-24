import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {LinguaService} from "../../services/lingua.service";
import Keyboard from 'simple-keyboard';
import * as events from "events";
import {TrainingData} from "../../domains/TrainingData";
import {Vocabulary} from "../../domains/Vocabulary";


@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit {

  text = new FormControl('');
  typing = new FormControl('');
  trainingData:TrainingData = new TrainingData()
  comparing:Vocabulary[] = []
  showWord:Vocabulary|undefined
  keyboard:Keyboard|undefined

  constructor(private lingua:LinguaService) { }

  ngOnInit(): void {
    this.text.setValue("да нет")
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

  showThisWord(word: Vocabulary) {
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

  checkInput = ($event: any) => {
    // @ts-ignore
    this.keyboard.setInput($event.target.value);
    console.log($event.target.value)

    let words = this.typing.value?.split(" ")
    this.comparing = []

    words?.forEach((word, index) => {
      if (this.trainingData.vocabulary[index].word == word) {
        this.comparing.push(this.trainingData.vocabulary[index])
      }
    })

    if (this.trainingData.vocabulary.length == this.comparing.length) {
      setTimeout(()=>{
        this.trainingData.vocabulary.forEach(vocabular => {
          vocabular.written += 1
        })
        console.log(this.trainingData)
        this.typing.setValue("")
        this.comparing = []
      }, 1000)
    }
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
