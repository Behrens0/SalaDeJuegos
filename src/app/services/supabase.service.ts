import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  // Estado reactivo de login
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
    const { data: usuarioActual, error: errorSelect } = await this.supabase
      .from('ranking')
      .select('score')
      .eq('correo', correo)
      .single();
  
    if (errorSelect && errorSelect.code !== 'PGRST116') {
      return { data: null, error: errorSelect };
    }
  
    const puntosTotales =
      (parseInt(usuarioActual?.score ?? '0', 10)) + nuevosPuntos;
  
    const { data, error } = await this.supabase
      .from('ranking')
      .upsert({ correo, score: puntosTotales.toString() }, { onConflict: 'correo' });
  
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

  // Guarda el puntaje del juego de Game of Thrones
async insertPuntajeThrones(puntaje: number) {
  const correo = await this.getUserEmail();

  return this.supabase
    .from('ranking_thrones')
    .insert([{ correo, puntaje, fecha: new Date().toISOString() }]);
}


// Obtener los 5 mejores puntajes
getTopThronesRanking(limit: number = 5) {
  return this.supabase
    .from('ranking_thrones')
    .select('correo, puntaje')
    .order('puntaje', { ascending: false })
    .limit(limit);
}

// Obtener el email del usuario actual
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