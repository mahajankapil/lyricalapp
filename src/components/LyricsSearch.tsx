import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { searchLyrics, Lyrics, mockLyrics, getLyricsById } from '@/utils/lyricsService';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Search, SearchX } from 'lucide-react';

interface LyricsSearchProps {
  onLyricsSelected: (lyrics: Lyrics) => void;
  onFileSelected: (file: File, url: string) => void;
}

const LyricsSearch = ({ onLyricsSelected, onFileSelected }: LyricsSearchProps) => {
  const [songName, setSongName] = useState('');
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { toast } = useToast();

  const { data, error, refetch } = useQuery({
    queryKey: ['lyrics', songName],
    queryFn: () => searchLyrics('', songName),
    enabled: false,
    retry: 2,
  });

  const handleSearch = async () => {
    if (!songName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a song name",
        variant: "destructive"
      });
      return;
    }
    
    setSearchExecuted(true);
    setIsLoading(true);
    setSearchError(null);
    
    try {
      await refetch();
      setSearchError(null);
    } catch (error) {
      console.error("Search error:", error);
      
      setSearchError("Failed to search for lyrics. API might be unavailable.");
      toast({
        title: "Search failed",
        description: "Unable to connect to lyrics API. Try again or use demo lyrics.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseMockLyrics = async () => {
    // Use local demo.mp3 from public folder
    const demoAudioUrl = '/demo.mp3';
    try {
      const response = await fetch(demoAudioUrl);
      const blob = await response.blob();
      const file = new File([blob], 'demo.mp3', { type: 'audio/mp3' });
      onFileSelected(file, URL.createObjectURL(file));
    } catch (error) {
      console.error('Error loading demo audio:', error);
      toast({
        title: "Demo audio error",
        description: "Could not load demo audio file",
        variant: "destructive"
      });
    }

    toast({
      title: "Using demo lyrics",
      description: "Loaded sample lyrics for demonstration"
    });
    onLyricsSelected(mockLyrics);
  };

  const handleSelectLyrics = async (id: string) => {
    setIsLoading(true);
    toast({
      title: "Loading lyrics",
      description: "Fetching lyrics data..."
    });
    
    try {
      const lyrics = await getLyricsById(id);
      
      if (lyrics) {
        onLyricsSelected(lyrics);
        toast({
          title: "Lyrics loaded",
          description: "Lyrics have been successfully loaded"
        });
      } else {
        toast({
          title: "Using demo lyrics",
          description: "Could not load selected lyrics. Using demo lyrics instead."
        });
        onLyricsSelected(mockLyrics);
      }
    } catch (error) {
      console.error("Get lyrics error:", error);
      
      toast({
        title: "Using demo lyrics",
        description: "API error. Using demo lyrics instead."
      });
      
      onLyricsSelected(mockLyrics);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Find Lyrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="songName">Song Name</Label>
            <Input 
              id="songName" 
              placeholder="Enter song name (e.g., Bohemian Rhapsody, Shape of You)" 
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <Button onClick={handleSearch} disabled={isLoading}>
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? 'Searching...' : 'Search Songs'}
          </Button>
          <Button variant="outline" onClick={handleUseMockLyrics}>
            Use Demo Lyrics
          </Button>
        </div>

        {searchExecuted && !isLoading && (
          <div className="mt-6">
            {searchError || error ? (
              <div className="text-sm text-destructive space-y-2 p-3 border border-destructive/20 rounded-md bg-destructive/10">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} />
                  <p className="font-medium">
                    Error searching for lyrics
                  </p>
                </div>
                <p>
                  The API might be unavailable or experiencing issues. Try using the demo lyrics instead.
                </p>
                <Button variant="secondary" onClick={handleUseMockLyrics} className="mt-2">
                  Use Demo Lyrics Instead
                </Button>
              </div>
            ) : data && Array.isArray(data) && data.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Found {data.length} song(s):</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {data.map((result: any) => (
                    <div 
                      key={result.id} 
                      className="p-3 border rounded hover:bg-accent cursor-pointer transition-colors" 
                      onClick={() => handleSelectLyrics(result.id)}
                    >
                      <div className="text-sm font-medium">{result.trackName}</div>
                      <div className="text-xs text-muted-foreground">by {result.artistName}</div>
                      {result.albumName && (
                        <div className="text-xs text-muted-foreground">Album: {result.albumName}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2 p-3 border border-muted rounded-md">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <SearchX size={16} />
                  <p className="text-sm">
                    No songs found for "{songName}". Try a different song name or use the demo lyrics.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleUseMockLyrics} className="mt-2">
                  Use Demo Lyrics
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LyricsSearch;
