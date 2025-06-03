import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message: string = '';
  messages: { user: string, text: string, timestamp: string }[] = [];
  username: string = '';
  isLoggedIn: boolean = false;
  currentUserEmail: string = '';

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.checkUserStatus();
    await this.loadMessages();
      this.supabaseService.getUser().then(({ data }) => {
    this.currentUserEmail = data?.user?.email ?? '';
  });
     this.supabaseService.listenToMessages((payload) => {
  console.log('Callback de listenToMessages llamado con payload:', payload);

  const newMessage = payload.new;

  if (!newMessage) {
    console.warn('Payload recibido sin propiedad "new":', payload);
    return;
  }

  console.log('Nuevo mensaje recibido:', newMessage);

  this.messages.push({
    user: newMessage.user,
    text: newMessage.text,
    timestamp: new Date(newMessage.timestamp).toLocaleTimeString([], {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  });

  console.log('Mensaje agregado al array messages:', this.messages[this.messages.length - 1]);
  this.scrollToBottom();
});

  }
  isNewDay(index: number): boolean {
  if (index === 0) return true;
  const currentDate = new Date(this.messages[index].timestamp).toDateString();
  const previousDate = new Date(this.messages[index - 1].timestamp).toDateString();
  return currentDate !== previousDate;
}

formatDate(fecha: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  console.log(fecha);
  return new Date(fecha).toLocaleDateString('es-AR', options);
}

  async checkUserStatus() {
    const { data, error } = await this.supabaseService.getUser();
    console.log('checkUserStatus:', { data, error });
    this.isLoggedIn = !!data?.user;
    console.log(this.isLoggedIn);
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
            year: '2-digit',
        month: '2-digit',
        day: '2-digit',
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
    console.log('Intentando navegar a:', juego, 'isLoggedIn:', this.isLoggedIn);
    if (this.isLoggedIn) {
      this.router.navigate([`/${juego}`]);
    }
  }
}