// URLs de streaming para los archivos de música
// Usando los archivos de la carpeta public/music

import { musicTracks } from "@/data";
import { Track } from "@/types";

// Función para obtener una pista por ID
export function getTrackById(id: string): Track | undefined {
  return musicTracks.find((track) => track.id === id);
}

// Función para obtener todas las pistas
export function getAllTracks(): Track[] {
  return musicTracks;
}

// Función para obtener pistas por artista
export function getTracksByArtist(artist: string): Track[] {
  return musicTracks.filter((track) =>
    track.artist.toLowerCase().includes(artist.toLowerCase()),
  );
}

// Función para buscar pistas
export function searchTracks(query: string): Track[] {
  const lowerQuery = query.toLowerCase();
  return musicTracks.filter(
    (track) =>
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery) ||
      track.album.toLowerCase().includes(lowerQuery),
  );
}
