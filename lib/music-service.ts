// Define interfaces based on original service expectations, mapping from Track

import { musicTracks } from "@/data";

// Note: We might need to adjust or add dummy data for fields not in the original Track interface.
export interface MusicFile {
  id: string;
  name: string;
  artist: string;
  data: Uint8Array; // This will be mocked as empty
  contentType: string;
  size: number; // We can estimate or use a dummy value
  uploadedAt: bigint; // Mock timestamp
  uploadedBy: string; // Use string for mock principal
}

export interface MusicMetadata {
  id: string;
  name: string;
  artist: string;
  size: number;
  contentType: string;
  uploadedAt: bigint;
  uploadedBy: string;
}

export interface MusicStats {
  totalFiles: number;
  totalSize: number; // Estimate based on duration or use dummy
}

// Mock implementation of the Music Service
class MockMusicService {
  // Simulate adding music (doesn't actually modify the imported array)
  async uploadMusic(
    name: string,
    artist: string,
    data: Uint8Array,
    contentType: string,
  ): Promise<string> {
    console.log(`Mock: Uploading music "${name}" by ${artist}`);
    const newId = `mock_${Date.now()}`;
    // In a real mock needing persistence, you might add to a local state array here
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay
    return newId;
  }

  // Get metadata for a specific track from mock data
  async getMusicMetadata(id: string): Promise<MusicMetadata> {
    const track = musicTracks.find((t) => t.id === id);
    if (!track) {
      throw new Error("Mock: Music file not found");
    }
    await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate delay
    return {
      id: track.id,
      name: track.title,
      artist: track.artist,
      size: track.duration * 100000, // Estimate size
      contentType: "audio/mpeg", // Dummy value
      uploadedAt: BigInt(Date.now() * 1_000_000), // Dummy timestamp (nanoseconds)
      uploadedBy: "mock-uploader-principal", // Dummy principal string
    };
  }

  // Get metadata for all tracks from mock data
  async getAllMusicMetadata(): Promise<MusicMetadata[]> {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate delay
    return musicTracks.map((track) => ({
      id: track.id,
      name: track.title,
      artist: track.artist,
      size: track.duration * 100000, // Estimate size
      contentType: "audio/mpeg",
      uploadedAt: BigInt(Date.now() * 1_000_000 - Math.random() * 1e12), // Dummy timestamps
      uploadedBy: "mock-uploader-principal",
    }));
  }

  // Get raw music data (return empty array as mock)
  async getMusicData(id: string): Promise<Uint8Array> {
    const track = musicTracks.find((t) => t.id === id);
    if (!track) {
      throw new Error("Mock: Music file not found");
    }
    console.warn(
      `Mock: getMusicData called for ${id}. Returning empty Uint8Array as mock.`,
    );
    await new Promise((resolve) => setTimeout(resolve, 150)); // Simulate delay
    // In a more complex mock, you could fetch the actual audioUrl here,
    // but for now, we return empty data as the player uses the URL.
    return new Uint8Array();
  }

  // Get combined metadata and (mocked) data
  async getMusicFile(id: string): Promise<MusicFile> {
    const metadata = await this.getMusicMetadata(id);
    const data = await this.getMusicData(id); // Will be empty array
    return {
      ...metadata,
      data: data,
    };
  }

  // Simulate deleting music
  async deleteMusic(id: string): Promise<void> {
    console.log(`Mock: Deleting music with id ${id}`);
    const trackIndex = musicTracks.findIndex((t) => t.id === id);
    if (trackIndex === -1) {
      throw new Error("Mock: Music file not found for deletion");
    }
    // Note: This won't actually remove from the imported musicTracks array.
    // To test deletion effects, manage a mutable copy of the tracks within the service state.
    await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate delay
    return;
  }

  // Calculate stats from mock data
  async getMusicStats(): Promise<MusicStats> {
    await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate delay
    const totalFiles = musicTracks.length;
    // Estimate total size
    const totalSize = musicTracks.reduce(
      (sum, track) => sum + track.duration * 100000,
      0,
    );
    return {
      totalFiles: totalFiles,
      totalSize: totalSize,
    };
  }

  // Create blob URL (just return the existing audioUrl)
  async createMusicBlobUrl(id: string): Promise<string> {
    const track = musicTracks.find((t) => t.id === id);
    if (!track || !track.audioUrl) {
      throw new Error("Mock: Track or audio URL not found");
    }
    console.log(`Mock: Returning existing audioUrl for ${id} as blob URL.`);
    return track.audioUrl;
  }

  // Get streaming URL (return existing audioUrl)
  getStreamingUrl(id: string): string {
    const track = musicTracks.find((t) => t.id === id);
    if (!track || !track.audioUrl) {
      console.warn(
        `Mock: Track or audio URL not found for getStreamingUrl(${id}). Returning empty string.`,
      );
      return "";
    }
    return track.audioUrl;
  }
}

// Export singleton instance with the same name
export const musicService = new MockMusicService();
