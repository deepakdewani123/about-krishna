import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessageComponent } from './chat-message/chat-message';
@NgModule({
	declarations: [ChatMessageComponent],
	imports: [
    CommonModule,
  ],
	exports: [ChatMessageComponent]
})
export class ComponentsModule {}
