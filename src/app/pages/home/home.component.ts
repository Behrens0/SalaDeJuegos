import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message: string = '';
  messages: { user: string, text: string, timestamp: string }[] = [];
  username: string = '';
  isLoggedIn: boolean = false;

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.checkUserStatus();
    await this.loadMessages();
  }

  async checkUserStatus() {
    const { data, error } = await this.supabaseService.getUser();
    this.isLoggedIn = !!data?.user;
    this.username = data?.user?.email || '';
  }

  async sendMessage() {
    if (this.message.trim() && this.isLoggedIn) {
      const { error } = await this.supabaseService.addMessage(this.username, this.message);
      if (!error) {
        this.message = '';
        await this.loadMessages();
        this.scrollToBottom();
      } else {
        console.error('Error al enviar mensaje:', error.message);
      }
    }
  }

  async loadMessages() {
    const { data, error } = await this.supabaseService.getMessages();
    if (!error && data) {
      this.messages = data.map((msg: any) => ({
        user: msg['user'],
        text: msg['text'],
        timestamp: new Date(msg['timestamp']).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
      this.scrollToBottom();
    } else {
      console.error('Error al obtener mensajes:', error?.message);
    }
  }

  private scrollToBottom(): void {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  navegarAGrupo(juego: string) {
    if (this.isLoggedIn) {
      this.router.navigate([`/${juego}`]);
    }
  }
}