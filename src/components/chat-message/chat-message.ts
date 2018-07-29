import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../../models/message.model';
import { config } from "../../config";
@Component({
  selector: 'chat-message',
  templateUrl: 'chat-message.html'
})
export class ChatMessageComponent implements OnInit {

  @Input() message: Message;
  userImage = config.personal_assistant.chat_icon.user.image;
  botImage = config.personal_assistant.chat_icon.bot.image;
  incoming: boolean;
  isLoading: boolean;
  constructor() {

  }

  ngOnInit() {
    this.isLoading = false;
    this.incoming = this.message.author === 'bot';
  }

}
