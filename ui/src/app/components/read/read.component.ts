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
  constructor(private lingua:LinguaService) { }

  ngOnInit(): void {
  }

  readText() {
    // @ts-ignore
    this.lingua.readText(this.text.value).subscribe({
      next: value => {
        this.words = value
      }
    })
  }
}
