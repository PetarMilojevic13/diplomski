import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Observable, from } from 'rxjs';
import { Film } from '../models/film';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiChatService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private chat: any;
  private conversationHistory: ChatMessage[] = [];

  // Google Gemini API Key
  private apiKey = 'AIzaSyDsermo3AtgW-JpK0wX-KGvFu1qIjAiBUs';

  constructor() {
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.initializeChat();
  }

  private initializeChat() {
    this.chat = this.model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Ti si Video Klub asistent. Tvoje ime je CineBot. Pomažeš korisnicima da pronađu filmove, daješ preporuke na osnovu žanra, glumaca, režisera i raspoloženja. Odgovaraš na pitanja o filmovima, glumcima i režiserima. Uvek budi ljubazan, entuzijastičan i kratko odgovaraj (max 3-4 rečenice). Koristi emotikone 🎬🎥🍿 kada je prikladno." }],
        },
        {
          role: "model",
          parts: [{ text: "Zdravo! 🎬 Ja sam CineBot, tvoj Video Klub asistent! Spreman sam da ti pomognem da pronađeš savršen film za večeras. Samo mi reci šta te zanima - žanr, glumac, raspoloženje - i daću ti odličnu preporuku! 🍿" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });
  }

  sendMessage(userMessage: string, filmovi?: Film[]): Observable<string> {
    // Dodaj kontekst o filmovima ako su prosleđeni
    let contextMessage = userMessage;
    if (filmovi && filmovi.length > 0) {
      const filmoviContext = filmovi.slice(0, 20).map(f =>
        `${f.naslov} (${f.godina}) - ${f.zanr.join(', ')} - Režija: ${f.reziser.join(', ')} - Ocena: ${this.getProsecnaOcena(f)}/10`
      ).join('\n');

      contextMessage = `Dostupni filmovi u Video Klubu:\n${filmoviContext}\n\nKorisničko pitanje: ${userMessage}`;
    }

    // Dodaj u istoriju
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    const promise = this.chat.sendMessage(contextMessage)
      .then((result: any): string => {
        const response = result.response.text();

        // Dodaj u istoriju
        this.conversationHistory.push({
          role: 'assistant',
          content: response,
          timestamp: new Date()
        });

        return response as string;
      })
      .catch((error: any) => {
        console.error('Gemini API Error:', error);
        throw new Error('Greška pri komunikaciji sa AI-jem. Proveri API key i internet konekciju.');
      });

    return from(promise) as Observable<string>;
  }

  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  clearHistory() {
    this.conversationHistory = [];
    this.initializeChat(); // Resetuj chat
  }

  private getProsecnaOcena(film: Film): number {
    if (!film.ocene || film.ocene.length === 0) return 0;
    const suma = film.ocene.reduce((acc: number, ocena: any) => acc + (ocena.vrednost || 0), 0);
    return Math.round((suma / film.ocene.length) * 10) / 10;
  }
}
