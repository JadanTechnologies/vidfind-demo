import { GoogleGenAI, Type } from "@google/genai";
import { MovieResult, MusicResult } from '../types';

// Initialize Gemini
// Robust check for process.env to prevent browser crash if not polyfilled during build/runtime
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : ''; 
const ai = new GoogleGenAI({ apiKey });

export const identifyMedia = async (base64Data: string, mimeType: string = "image/jpeg"): Promise<MovieResult> => {
  if (!apiKey) {
    console.error("API Key is missing");
    // Return mock data if no key to prevent app crash in preview without env
    return new Promise(resolve => setTimeout(() => resolve({
      title: "Inception",
      year: "2010",
      productionCompany: "Warner Bros. Pictures",
      copyrightHolder: "Warner Bros. Entertainment Inc.",
      isCopyrighted: true,
      director: "Christopher Nolan",
      timestamp: "01:24:15",
      trailerUrl: "https://www.youtube.com/results?search_query=inception+trailer",
      cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
      genre: ["Sci-Fi", "Action"],
      plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      confidence: 98,
      streaming: ["Netflix", "HBO Max"],
      imageUrl: "https://picsum.photos/seed/inception/300/450",
      actors: [
        { name: "Leonardo DiCaprio", filmography: ["Titanic", "The Revenant", "Wolf of Wall Street"], similarMovies: ["Shutter Island", "The Departed"] },
        { name: "Joseph Gordon-Levitt", filmography: ["Looper", "500 Days of Summer", "Don Jon"], similarMovies: ["Looper", "Brick"] }
      ]
    }), 2000));
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Analyze this media (image or video frame). 
      Identify the movie, series, or video source with high precision.
      
      Extract the following details:
      - Official Title
      - Release Year
      - Production Company (Studio)
      - Copyright Holder (Who owns the rights?)
      - Is Copyrighted? (Boolean, likely true for commercial movies)
      - Director
      - Approximate Timestamp of this scene (Estimate based on visual context, e.g., "00:45:10"). If unsure, estimate.
      - Cast (Main actors visible or known for this scene)
      - Actor Face Recognition (Identify specific faces visible in the frame)
      - Genre
      - Plot Summary of the specific scene/context
      - Confidence Score (0-100)
      - Streaming Platforms (Where it can be watched)
      
      Return a JSON object matching the schema.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            year: { type: Type.STRING },
            productionCompany: { type: Type.STRING },
            copyrightHolder: { type: Type.STRING },
            isCopyrighted: { type: Type.BOOLEAN },
            director: { type: Type.STRING },
            timestamp: { type: Type.STRING },
            cast: { type: Type.ARRAY, items: { type: Type.STRING } },
            actors: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  filmography: { type: Type.ARRAY, items: { type: Type.STRING } },
                  similarMovies: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              } 
            },
            genre: { type: Type.ARRAY, items: { type: Type.STRING } },
            plot: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            streaming: { type: Type.ARRAY, items: { type: Type.STRING } },
            imageUrl: { type: Type.STRING },
          },
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("AI returned an empty response. Please try a different frame.");
    }
    
    try {
        const result = JSON.parse(text) as MovieResult;
        // Generate a dynamic trailer search link since AI doesn't always give a valid direct URL
        result.trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(result.title + ' ' + result.year + ' trailer')}`;
        return result;
    } catch (e) {
        console.error("JSON Parse Error", e);
        throw new Error("Failed to process the AI response. Please try again.");
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message && error.message.includes("SAFETY")) {
        throw new Error("Content blocked by safety filters. Please try a different frame.");
    }
    throw new Error(error.message || "An unexpected error occurred during identification.");
  }
};

export const identifyMusic = async (base64Data: string, mimeType: string = "image/jpeg"): Promise<MusicResult | null> => {
    if (!apiKey) {
      return new Promise(resolve => setTimeout(() => resolve({
        title: "Essence",
        artist: "Wizkid ft. Tems",
        album: "Made in Lagos",
        genre: "Afrobeats",
        year: "2020",
        lyricsSnippet: "You don't need no other body...",
        streaming: ["Spotify", "Apple Music", "YouTube Music"],
        coverUrl: "https://picsum.photos/seed/wizkid/300/300"
      }), 2000));
    }
  
    try {
      const model = "gemini-2.5-flash";
      const prompt = `
        Analyze this input (image or video snippet). 
        If it's a video, analyze the audio and visual context.
        Identify the song, artist, and album details.
        
        Return JSON with these exact fields:
        - title: Song title
        - artist: Artist name(s)
        - album: Album name
        - genre: Music genre
        - year: Release year
        - lyricsSnippet: A famous line from the song (or heard in the clip)
        - streaming: Platforms available
        - coverUrl: A generated description or placeholder for the cover art
      `;
  
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            { inlineData: { mimeType: mimeType, data: base64Data } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              album: { type: Type.STRING },
              genre: { type: Type.STRING },
              year: { type: Type.STRING },
              lyricsSnippet: { type: Type.STRING },
              streaming: { type: Type.ARRAY, items: { type: Type.STRING } },
              coverUrl: { type: Type.STRING },
            },
          }
        }
      });
  
      const text = response.text;
      if (!text) return null;
      return JSON.parse(text) as MusicResult;
  
    } catch (error) {
      console.error("Gemini API Error:", error);
      return null;
    }
};

export const getChatResponse = async (message: string, history: string[]): Promise<string> => {
   if (!apiKey) return "I am an AI assistant. Please configure your API Key to chat with me.";
   
   try {
     const model = "gemini-2.5-flash";
     const response = await ai.models.generateContent({
       model,
       contents: [
         ...history.map(h => ({ role: 'user', parts: [{ text: h }] })), 
         { role: 'user', parts: [{ text: message }] }
       ],
       config: {
         systemInstruction: "You are VidFind+, a helpful movie and video expert assistant. Keep answers short and fun."
       }
     });
     return response.text || "I couldn't generate a response.";
   } catch (e) {
     console.error(e);
     return "Sorry, I'm having trouble connecting to the mainframe.";
   }
}