import { Message } from "../../models/message.model";
import { Observable } from "rxjs/Observable";
import { Content } from "ionic-angular";

import { Component, OnInit, ViewChild } from "@angular/core";
import { MessagesService } from "../../services/message.service";
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  @ViewChild(Content) content: Content;

  messages$: Observable<Message[]>;
  userInput: string;
  isLoading = false;

  constructor(private messagesService: MessagesService) {
    console.log("in home component");
  }

  initialMessages: Array<Message> = ["Hi"].map(msg => {
    return new Message({
      author: "bot",
      text: msg
    });
  });

  ngOnInit() {
    // for all new messages
    this.messagesService.messages.subscribe();
    this.messages$ = this.messagesService.messages;

    this.messages$.subscribe(() => {
      setTimeout(() => {
        this.scrollToBottom();
      });
    });
    // create the initial messages
    this.initialMessages.map((message: Message) => {
      this.messagesService.addMessage(message);
    });
  }

  /** to check if textfield is empty and return true if it is */
  public get isTextFieldEmpty(): boolean {
    const isWhiteSpace = (this.userInput || "").trim().length;
    if (isWhiteSpace === 0) {
      return true;
    } else {
      return false;
    }
  }

  setup() {
    this.messagesService.userMessages().forEach((message: Message) => {});
  }
  onEnter() {
    if (!this.isTextFieldEmpty) {
      this.isLoading = true;
      this.sendMessage();
      this.userInput = "";
      event.preventDefault();
    }
  }
  sendMessage(): void {
    this.messagesService.addTextOnlyMessage(this.userInput);
  }

  /** to scroll to bottom when user sends a query */
  scrollToBottom(): void {
    this.content.scrollToBottom(300);
  }
}
