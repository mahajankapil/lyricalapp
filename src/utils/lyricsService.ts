export interface LyricLine {
  startTimeMs: number;
  endTimeMs?: number;
  text: string;
}

export interface Lyrics {
  syncType: string; // unsynced, line-synced, word-synced
  lines: LyricLine[];
}

// Mock data for initial testing
export const mockLyrics: Lyrics = {
  syncType: 'line-synced',
  lines: [
    { startTimeMs: 0, endTimeMs: 1000, text: "GUDDI" },
  //   { startTimeMs: 1000, endTimeMs: 2000, text: "I Like It Like It" },
  //   { startTimeMs: 2000, endTimeMs: 4000, text: "Tujha Nosepin Earring Eyelashes Bling Bling" },
  //   { startTimeMs: 4000, endTimeMs: 6000, text: "Highlighter Blusher Ani Lipstick Pink Pink" },
  //   { startTimeMs: 6000, endTimeMs: 8000, text: "Ae Maajhi Girl Ae Jaane Jigar" },
  //   { startTimeMs: 8000, endTimeMs: 10000, text: "Ae Chammak Challo" },
  //   { startTimeMs: 10000, endTimeMs: 13000, text: "Mi Tujha King King King King" },
  //   { startTimeMs: 13000, endTimeMs: 14000, text: "Jaadu Mantar" },
  //   { startTimeMs: 14000, endTimeMs: 15000, text: "Haan Mantar" },
  //   { startTimeMs: 15000, endTimeMs: 16000, text: "Tujha Swag OG" },
  //   { startTimeMs: 16000, endTimeMs: 17000, text: "OG" },
  //   { startTimeMs: 17000, endTimeMs: 18000, text: "Haay Tujhi Kambar" },
  //   { startTimeMs: 18000, endTimeMs: 20000, text: "Ek Number" },
  //   { startTimeMs: 20000, endTimeMs: 22000, text: "Tula 100 100 Paiki" },
  //   { startTimeMs: 22000, endTimeMs: 23000, text: "Ek Number" },
  //   { startTimeMs: 23000, endTimeMs: 24000, text: "Tujhi Kambar" },
  //   { startTimeMs: 24000, endTimeMs: 25000, text: "Haay Chaal" },
  //   { startTimeMs: 25000, endTimeMs: 27000, text: "Shaky Shaky" },
  //   { startTimeMs: 27000, endTimeMs: 28000, text: "Haay Kitti Sundar" },
  //   { startTimeMs: 28000, endTimeMs: 30000, text: "Tujhe Dimple" },
  //   { startTimeMs: 30000, endTimeMs: 31000, text: "Je Paahije Te Ghe" },
  //   { startTimeMs: 31000, endTimeMs: 33000, text: "Take It Take It" },
  // ] 
  ]
};

export async function searchLyrics(artist: string, title: string): Promise<any> {
  try {
    // Use the correct API endpoint according to the documentation
    const apiUrl = `https://lrclib.net/api/search`;
    
    // Build the query parameters according to the docs
    const params = new URLSearchParams();
    if (title) params.append('track_name', title);
    if (artist) params.append('artist_name', artist);
    
    // Add User-Agent header as suggested in the docs
    const headers = {
      'User-Agent': 'PeriodicTableLyricsGenerator v1.0.0'
    };
    
    const fullUrl = `${apiUrl}?${params.toString()}`;
    
    console.log(`Searching lyrics with: ${fullUrl}`);
    const response = await fetch(fullUrl, { headers });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error details: ${errorText}`);
      return [];
    }
    
    const data = await response.json();
    console.log('Search results:', data);
    return data;
  } catch (error) {
    console.error("Error searching lyrics:", error);
    return [];
  }
}

export async function getLyricsById(id: string): Promise<Lyrics | null> {
  try {
    // Use the correct API endpoint according to the documentation
    const apiUrl = `https://lrclib.net/api/get/${id}`;
    
    // Add User-Agent header as suggested in the docs
    const headers = {
      'User-Agent': 'PeriodicTableLyricsGenerator v1.0.0'
    };
    
    console.log(`Getting lyrics by ID: ${apiUrl}`);
    const response = await fetch(apiUrl, { headers });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error details: ${errorText}`);
      return null;
    }
    
    const data = await response.json();
    console.log('Lyrics data:', data);
    
    if (!data) {
      return null;
    }
    
    // Check if we have synchronized lyrics, otherwise use plain lyrics
    if (data.syncedLyrics) {
      // Parse the LRC format to our format
      const parsedLyrics = parseLrc(data.syncedLyrics);
      return parsedLyrics;
    } else if (data.plainLyrics) {
      // Convert plain lyrics to our format
      return convertPlainLyrics(data.plainLyrics);
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return null;
  }
}

function parseLrc(lrc: string): Lyrics {
  const lines = lrc.split('\n');
  const timeTagRegex = /\[(\d+):(\d+)\.(\d+)\]/g;
  const result: LyricLine[] = [];
  let syncType = 'unsynced';
  
  lines.forEach((line) => {
    const matches = [...line.matchAll(timeTagRegex)];
    if (matches.length > 0) {
      syncType = matches.length > 1 ? 'word-synced' : 'line-synced';
      
      const text = line.replace(timeTagRegex, '').trim();
      if (text) { // Only add lines with text
        const timeTag = matches[0];
        if (timeTag && timeTag[1] && timeTag[2] && timeTag[3]) {
          const minutes = parseInt(timeTag[1]);
          const seconds = parseInt(timeTag[2]);
          const milliseconds = parseInt(timeTag[3]) * 10; // Adjust for correct ms
          const startTimeMs = (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
          
          result.push({ startTimeMs, text });
        }
      }
    }
  });

  // Update endTimes based on next line's start time
  for (let i = 0; i < result.length - 1; i++) {
    result[i].endTimeMs = result[i + 1].startTimeMs;
  }
  
  // Set end time for the last line (add 4 seconds)
  if (result.length > 0) {
    result[result.length - 1].endTimeMs = result[result.length - 1].startTimeMs + 4000;
  }
  
  return {
    syncType,
    lines: result
  };
}

function convertPlainLyrics(plainLyrics: string): Lyrics {
  const lines = plainLyrics.split('\n').filter(line => line.trim());
  const result: LyricLine[] = [];
  
  lines.forEach((line, index) => {
    const startTimeMs = index * 4000; // 4 seconds per line
    const endTimeMs = (index + 1) * 4000;
    
    result.push({
      startTimeMs,
      endTimeMs,
      text: line.trim()
    });
  });
  
  return {
    syncType: 'unsynced',
    lines: result
  };
}

// This function will split a line into words or characters based on the mode
export const splitLyricContent = (text: string, mode: 'word' | 'character' = 'word'): string[] => {
  if (mode === 'character') {
    return text.split('');
  }
  return text.split(/\s+/);
};
