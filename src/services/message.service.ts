import { Injectable } from "@angular/core";
import { Subject, Observable } from 'rxjs';
// import { map, scan, filter } from 'rxjs/operator';
import { Message } from '../models/message.model';
// import { HttpClient } from '@angular/common/http';
const initialMessages: Message[] = [];

type IMessagesOperation = (messages: Message[]) => Message[];


@Injectable()
export class MessagesService {
  newMessages: Subject<Message> = new Subject<Message>();

  // `messages` is a stream that emits an array of the most up to date messages
  messages: Observable<Message[]>;

  // `updates` receives _operations_ to be applied to our `messages`
  // it's a way we can perform changes on *all* messages (that are currently
  // stored in `messages`)
  updates: Subject<any> = new Subject<any>();

  // action streams
  create: Subject<Message> = new Subject<Message>();

  constructor() {
    this.messages = this.updates
      // watch the updates and accumulate operations on the messages
      .scan((messages: Message[], operation: IMessagesOperation) => {
        return operation(messages);
      }, initialMessages)
      // make sure we can share the most recent list of messages across anyone
      // who's interested in subscribing and cache the last known list of
      // messages
      .publishReplay(1)
      .refCount();

    this.setup();
  }

  private setup() {
    // `create` takes a Message and then puts an operation (the inner function)
    // on the `updates` stream to add the Message to the list of messages.
    //
    // That is, for each item that gets added to `create` (by using `next`)
    // this stream emits a concat operation function.
    //
    // Next we subscribe `this.updates` to listen to this stream, which means
    // that it will receive each operation that is created
    //
    // Note that it would be perfectly acceptable to simply modify the
    // "addMessage" function below to simply add the inner operation function to
    // the update stream directly and get rid of this extra action stream
    // entirely. The pros are that it is potentially clearer. The cons are that

    // the stream is no longer composable.
    this.create
      .map(function(message: Message): IMessagesOperation {
        return (messages: Message[]) => {
          if (message.type === 'clear') {
            return [
              new Message({
                author: "bot",
                text: 'Hi'
              })
            ];
          } else {
            return messages.concat(message);
          }
        };
      })
      .subscribe(this.updates);

    this.newMessages.subscribe(this.create);
  }

  // an imperative function call to this action stream
  addMessage(message: Message): void {
    this.newMessages.next(message);
  }

  userMessages(): Observable<Message> {
    return this.newMessages.filter((message: Message) => {
      return message.author === 'user';
    });
  }

    /**
   * add text message to the newMessages[] in message.service
   * @param text - The text of the message
   */
  addTextOnlyMessage(text: string) {
    this.addMessage(
      new Message({
        text: text,
        author: 'user',
        type: 'default'
      })
    );
  }

    /**
   * add text message to the newMessages[] in message.service
   * @param text - The text of the message
   */
  addTextOnlyMessageForBot(text: string) {
    this.addMessage(
      new Message({
        author: 'bot',
        text: text,
        type: 'default'
      })
    );
  }
}

export const messagesServiceInjectables: Array<any> = [MessagesService];
