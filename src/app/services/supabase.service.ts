import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor() {
    this.supabase = createClient(
      'https://lyotopwjahfarqruzrts.supabase.co', 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b3RvcHdqYWhmYXJxcnV6cnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NzY5MDAsImV4cCI6MjA2MTQ1MjkwMH0.Afc8_1k2cAylEUY-vkYqXn9iSOTH7gu6rBOvK7DCDO0'
    );

    this.getUser().then(({ data }) => {
      this.isLoggedInSubject.next(!!data.user);
    });
  }

  async signIn(credentials: { email: string; password: string }) {
    const result = await this.supabase.auth.signInWithPassword(credentials);
    if (result.data.user) {
      this.isLoggedInSubject.next(true);
    }
    return result;
  }
  listenToMessages(callback: (payload: any) => void) {
  console.log('Suscribiéndose a mensajes nuevos en la tabla chats...');
  return this.supabase
    .channel('public:chats')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chats',
      },
      (payload) => {
        console.log('Nuevo mensaje recibido en listenToMessages:', payload);
        if (payload && payload.new) {
          console.log('Datos del nuevo mensaje:', payload.new);
        } else {
          console.warn('Payload sin propiedad new:', payload);
        }
        callback(payload);
      }
    )
    .subscribe();
}


  async signOut() {
    const result = await this.supabase.auth.signOut();
    this.isLoggedInSubject.next(false);
    return result;
  }

  signUp(email: string, password: string, userData?: { nombre: string; username: string }) {
    return this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
  }

  getUser() {
    return this.supabase.auth.getUser();
  }

  getMessages() {
    return this.supabase
      .from('chats')
      .select('*')
      .order('timestamp', { ascending: true });
  }
  
  addMessage(user: string, text: string) {
    return this.supabase
      .from('chats')
      .insert([{ user, text, timestamp: new Date().toISOString() }]);
  }
  
  getCurrentUser() {
    return this.supabase.auth.getUser();
  }
  async guardarResultadoRanking(correo: string, nuevosPuntos: number) {
  const { data, error } = await this.supabase
    .from('ranking')
    .insert([
      {
        correo,
        score: nuevosPuntos.toString(), // o directamente `nuevosPuntos` si el campo es tipo integer
        fecha: new Date().toISOString() // opcional, si querés guardar cuándo se jugó
      }
    ]);

  return { data, error };
}

  async guardarResultadoRanking2(correo: string, nuevosPuntos: number) {
  const { data, error } = await this.supabase
    .from('ranking_mayor_menor')
    .insert([
      {
        correo,
        score: nuevosPuntos.toString(), // o directamente `nuevosPuntos` si el campo es tipo integer
        fecha: new Date().toISOString() // opcional, si querés guardar cuándo se jugó
      }
    ]);

  return { data, error };
}

  
  insertPuntajePreguntados(data: { correo: string; puntaje: number; fecha: string }) {
  return this.supabase.from('ranking_preguntados').insert([data]);
}


  getTopPreguntadosRanking(limit: number = 5) {
    return this.supabase
      .from('ranking_preguntados')
      .select('correo, puntaje')
      .order('puntaje', { ascending: false })
      .limit(limit);
  }

  

  async obtenerTopRanking(limit: number = 5) {
    return this.supabase
      .from('ranking')
      .select('correo, score')
      .order('score', { ascending: false })
      .limit(limit);
  }

  async obtenerTopRanking2(limit: number = 5) {
    return this.supabase
      .from('ranking_mayor_menor')
      .select('correo, score')
      .order('score', { ascending: false })
      .limit(limit);
  }

async insertPuntajeThrones(puntaje: number) {
  const correo = await this.getUserEmail();

  return this.supabase
    .from('ranking_thrones')
    .insert([{ correo, puntaje, fecha: new Date().toISOString() }]);
}

guardarEncuesta(encuestaData: any) {
  return this.supabase
    .from('encuesta')
    .insert([encuestaData]);
}


getTopThronesRanking(limit: number = 5) {
  return this.supabase
    .from('ranking_thrones')
    .select('correo, puntaje')
    .order('puntaje', { ascending: false })
    .limit(limit);
}

private async getUserEmail(): Promise<string> {
  const { data, error } = await this.supabase.auth.getUser();
  return data?.user?.email || 'Anónimo';
}


  insertUserData(data: {
    uid: string;
    nombre: string;
    username: string;
    correo: string;
    fechaIngreso: string;
  }) {
    return this.supabase
      .from('usuarios')
      .insert([data]);
  }

  
}