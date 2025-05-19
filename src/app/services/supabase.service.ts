import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://lyotopwjahfarqruzrts.supabase.co', 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b3RvcHdqYWhmYXJxcnV6cnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NzY5MDAsImV4cCI6MjA2MTQ1MjkwMH0.Afc8_1k2cAylEUY-vkYqXn9iSOTH7gu6rBOvK7DCDO0'
    );
  }

  signIn(credentials: { email: string; password: string }) {
    return this.supabase.auth.signInWithPassword(credentials);
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
  signOut() {
    return this.supabase.auth.signOut();
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