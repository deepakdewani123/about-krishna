export class Message {
  id: string;
  type: string;
  sentAt: Date;
  status: boolean;
  author: string;
  text: string;
  constructor(obj?: any) {
    this.sentAt = (obj && obj.sentAt) || new Date();
    this.status = (obj && obj.status) || false;
    this.author = (obj && obj.author) || null;
    this.text = (obj && obj.text) || '';
    this.type = (obj && obj.type) || 'default';
  }
}
