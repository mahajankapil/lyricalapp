import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from '@/components/FileUpload';
import LyricsSearch from '@/components/LyricsSearch';
import LyricsDisplay from '@/components/LyricsDisplay';
import AudioPlayer from '@/components/AudioPlayer';
import ExportVideo, { ExportOptions } from '@/components/ExportVideo';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Lyrics, LyricLine } from '@/utils/lyricsService';
import { exportVideo } from '@/utils/videoExporter';
import html2canvas from 'html2canvas';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { LyricsEditor } from '@/components/LyricsEditor';
import { AddMp3Button } from '@/components/AddMp3Button';

const Index = () => {
  const [audioFile, setAudioFile] = useState<{ file: File; url: string } | null>(null);
  const [lyrics, setLyrics] = useState<Lyrics | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLine, setCurrentLine] = useState<LyricLine | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [displayMode, setDisplayMode] = useState<'word' | 'character'>('word');
  const [layout, setLayout] = useState<'grid' | 'flow'>('grid');
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeTab, setActiveTab] = useState('lyrics');
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationBackgroundColor, setAnimationBackgroundColor] = useState('bg-black');
  const [chemistryTileColor, setChemistryTileColor] = useState('bg-gray-700');

  // Update current line based on playback time
  useEffect(() => {
    if (!lyrics) return;
    
    const currentLineIndex = lyrics.lines.findIndex(
      (line) => currentTime >= line.startTimeMs && 
      (!line.endTimeMs || currentTime < line.endTimeMs)
    );
    
    if (currentLineIndex !== -1) {
      setCurrentLine(lyrics.lines[currentLineIndex]);
    } else if (lyrics.lines.length > 0) {
      // If no matching line, check if we're at the beginning or end
      if (currentTime < lyrics.lines[0].startTimeMs) {
        setCurrentLine(null);
      } else if (currentTime >= lyrics.lines[lyrics.lines.length - 1].endTimeMs!) {
        setCurrentLine(lyrics.lines[lyrics.lines.length - 1]);
      }
    }
  }, [currentTime, lyrics]);

  // Handle file selection (for both audio and potentially other files later)
  const handleFileSelected = (file: File, url: string) => {
    setAudioFile({ file, url });
  };

  const handleLyricsSelected = (selectedLyrics: Lyrics) => {
    setLyrics(selectedLyrics);
    setActiveTab('data');
    toast({
      title: "Lyrics loaded",
      description: `${selectedLyrics.lines.length} lines of lyrics are ready`
    });
  };

  // Handle time updates from the audio element (used by AudioPlayer internally)
  const handleTimeUpdate = (newTime: number) => {
    setCurrentTime(newTime);
  };

  // Handle audio ending (used by AudioPlayer internally)
  const handleEnded = () => {
      setIsPlaying(false);
  };

  // Effect to manage the audio element and its state (for direct audio control if needed)
  useEffect(() => {
    const cleanupAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ''; // Clear the source
        audioRef.current = null; // Clear the ref
      }
    };

    if (audioFile) {
      // We are now passing audioUrl to AudioPlayer, which manages its own internal Audio object.
      // This effect can be simplified or removed if no direct HTMLAudioElement control is needed here.
      // For now, it remains for setting up the initial audioRef for potential direct play/pause from Index.tsx
      if (!audioRef.current) {
        audioRef.current = new Audio();
        // The AudioPlayer component will handle its own timeupdate and ended listeners
      }
      audioRef.current.src = audioFile.url;

      // Attempt to play if it was previously playing or if a new file is loaded
      if (isPlaying && audioRef.current.paused) {
        audioRef.current.play().catch(err => console.error(`Audio play failed after load: ${err}`));
      }

    } else {
      cleanupAudio();
      setIsPlaying(false); // Ensure isPlaying is false if audio is removed
    }

    return cleanupAudio;

  }, [audioFile, isPlaying]); // Depend on audioFile and isPlaying

  // Handle playback toggle (will primarily be controlled by AudioPlayer's internal UI)
  const handlePlayPause = () => {
    // This will toggle the isPlaying state, which AudioPlayer uses internally
    // The actual play/pause on the HTMLAudioElement is managed by AudioPlayer's own togglePlay function
    // This function can be simplified if AudioPlayer truly encapsulates all playback control.
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Audio play failed:", err));
      }
      setIsPlaying(!isPlaying);
    } else {
      toast({
        title: "Audio not loaded",
        description: "Please load an audio file to play.",
        variant: "destructive"
      });
    }
  };

  const handleSeek = (time: number) => {
    // This is called by AudioPlayer and also used during export for setting time
    if (audioRef.current) {
      audioRef.current.currentTime = time / 1000; // Convert ms to seconds for HTMLAudioElement
    }
    setCurrentTime(time);
  };

  // handleSkip is not directly used by AudioPlayer anymore as it has its own skip buttons
  // const handleSkip = (seconds: number) => {
  //   if (audioRef.current) {
  //     const newTime = Math.max(0, Math.min(currentTime + seconds * 1000, audioRef.current.duration * 1000));
  //     handleSeek(newTime);
  //   }
  // };

  const handleExport = async (options: ExportOptions) => {
    const lyricsContainer = canvasRef.current; // Get the lyrics container element
    if (!lyricsContainer) {
      toast({
        title: "Export error",
        description: "Lyrics container element not found",
        variant: "destructive"
      });
      return;
    }

    if (!lyrics) {
       toast({
         title: "Export error",
         description: "No lyrics data available for export",
         variant: "destructive"
       });
       return;
    }
    
    setIsExporting(true);
    const initialCurrentTime = currentTime; // Store current time to revert later
    const wasPlaying = isPlaying; // Store playing state
    if (wasPlaying && audioRef.current) {
        audioRef.current.pause(); // Pause audio playback during export
        setIsPlaying(false);
    }

    // Show an initial toast for export start
    const progressToast = toast({
      title: "Export started",
      description: "Preparing for video export...",
      duration: Infinity, // Keep toast open
    });

    try {
      // Define the progress callback function
      const onProgress = (progress: { stage: string; percentage?: number }) => {
        let description = progress.stage;
        if (progress.percentage !== undefined) {
          description += `: ${progress.percentage}%`;
        }
        // Update the existing toast with progress information
        progressToast.update({
          id: progressToast.id, // Include the toast ID in the update object
          title: "Exporting video...",
          description: description,
        });
      };

      // Calculate export duration and frames
      const totalDuration = options.duration * 1000; // Convert seconds to ms
      const fps = 30; // Assuming 30 FPS
      const totalFrames = Math.ceil((totalDuration / 1000) * fps);
      const frameInterval = 1000 / fps; // Time in ms between frames

      const frames: Uint8Array[] = [];

      onProgress({ stage: 'Capturing frames', percentage: 0 });

      for (let i = 0; i < totalFrames; i++) {
        const frameTimeMs = i * frameInterval;

        // Update the currentTime state to trigger LyricsDisplay update
        setCurrentTime(frameTimeMs);

        // Wait for the DOM to update after setting the state
        await new Promise(requestAnimationFrame);

        // Capture the frame from the lyrics container
        const canvas = await html2canvas(lyricsContainer, {
          useCORS: true,
          backgroundColor: null, // Capture with transparent background
        });

        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        if (!blob) throw new Error('Failed to create blob from canvas');
        const arrayBuffer = await blob.arrayBuffer();
        frames.push(new Uint8Array(arrayBuffer));

        onProgress({ stage: 'Capturing frames', percentage: Math.round(((i + 1) / totalFrames) * 100) });
      }
       onProgress({ stage: 'Capturing frames completed' });

      // Now call exportVideo with the captured frames and audio options
      const url = await exportVideo(
        options,
        canvasRef.current
      ); // Pass the options and the canvas element

      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${options.filename}.png`; // Ensure it's .png as it's a screenshot now
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      progressToast.update({
        id: progressToast.id, // Include the toast ID in the update object
        title: "Download started",
        description: "Your video download should begin shortly.",
        duration: 5000, // Set a duration for the final toast
      });

    } catch (error) {
      console.error('Export failed:', error);
      progressToast.update({
        id: progressToast.id, // Include the toast ID in the update object
        title: "Export failed",
        description: "There was an error exporting your video",
        variant: "destructive",
        duration: 5000, // Set a duration for the final toast
      });
    } finally {
      setIsExporting(false);

      // Revert currentTime and playback state
      setCurrentTime(initialCurrentTime);
      if (wasPlaying && audioRef.current) {
        audioRef.current.play().catch(err => console.error(`Audio play failed after export: ${err}`));
        setIsPlaying(true);
      }
    }
  };

  const handleLyricsEdit = (updatedLyrics: Lyrics) => {
    setLyrics(updatedLyrics);
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <img 
                src="/logo.png" 
                alt="Lyrical Elements Logo" 
                className="h-8 w-8 object-contain"
                style={{ maxHeight: '32px', maxWidth: '32px' }}
              />
              <span className="font-bold text-lg">Lyrical Elements</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-4 space-y-4">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Column 1: Lyrics Search, Data, Edit, and About Section */}
          <div className="md:col-span-1 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="lyrics">Search</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="animation">Animation</TabsTrigger>
              </TabsList>
              <TabsContent value="lyrics" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Search Lyrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LyricsSearch onLyricsSelected={handleLyricsSelected} onFileSelected={handleFileSelected} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="data" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Lyrics Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {lyrics ? (
                      <ScrollArea className="h-[400px]">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed">{JSON.stringify(lyrics, null, 2)}</pre>
                        </ScrollArea>
                    ) : (
                      <p>No lyrics data loaded.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="edit" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Lyrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LyricsEditor lyrics={lyrics} onSave={handleLyricsEdit} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="animation" className="mt-4">
            <Card>
                  <CardHeader>
                    <CardTitle>Animation Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Display Mode</label>
                      <ToggleGroup type="single" value={displayMode} onValueChange={(value: "word" | "character") => setDisplayMode(value)} className="justify-start">
                        <ToggleGroupItem value="word">Word by Word</ToggleGroupItem>
                        <ToggleGroupItem value="character">Character by Character</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Layout</label>
                      <ToggleGroup type="single" value={layout} onValueChange={(value: "grid" | "flow") => setLayout(value)} className="justify-start">
                      <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
                      <ToggleGroupItem value="flow">Flow</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Background Color</label>
                      <ToggleGroup type="single" value={animationBackgroundColor} onValueChange={setAnimationBackgroundColor} className="justify-start">
                        <ToggleGroupItem value="bg-black">Black</ToggleGroupItem>
                        <ToggleGroupItem value="bg-blue-900">Blue</ToggleGroupItem>
                        <ToggleGroupItem value="bg-red-900">Red</ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Chemistry Tile Color</label>
                      <ToggleGroup type="single" value={chemistryTileColor} onValueChange={setChemistryTileColor} className="justify-start">
                        <ToggleGroupItem value="bg-gray-700">Gray</ToggleGroupItem>
                        <ToggleGroupItem value="bg-green-700">Green</ToggleGroupItem>
                        <ToggleGroupItem value="bg-blue-700">Blue</ToggleGroupItem>
                        <ToggleGroupItem value="bg-red-700">Red</ToggleGroupItem>
                        <ToggleGroupItem value="bg-black">Black</ToggleGroupItem>
                      </ToggleGroup>
                </div>
              </CardContent>
            </Card>
              </TabsContent>
            </Tabs>
            
            {/* About This Project Section */}
            <Card>
              <CardHeader>
                <CardTitle>About This Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>🎶 Transform your lyrics into animated chemical elements! 🧪</p>
                <div>
                  <h4 className="font-semibold">How to Use:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use "Search" or "Demo Lyrics" to load.</li>
                    <li>"Data" shows parsed lyrics; "Edit" to refine timings.</li>
                    <li>"Animation" customizes display and colors.</li>
                    <li>"Export Video" generates a screenshot (video export coming soon!).</li>
                  </ul>
                </div>
                <p>✨ This is a <Badge variant="secondary">Beta Version</Badge>, constantly improving! ✨</p>
                <p className="text-muted-foreground">Created by Rahul. Connect on <a href="https://instagram.com/developer_rahul_" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Instagram</a></p>
                <p className="text-muted-foreground">Site Visitors: <span>{Math.floor(Math.random() * 10000) + 100}</span> (simulated)</p>
              </CardContent>
            </Card>
          </div>
          
        {/* Column 2: Animation Display and Controls */}
        <div className="md:col-span-1 space-y-6 flex flex-col items-center justify-center">
          <div className={cn(
            "p-4 rounded-lg shadow-inner",
            "w-[450px] h-[720px]", // Fixed width and height for 9:16 aspect ratio
            animationBackgroundColor // Use the selected background color
          )} ref={canvasRef}>
                  <LyricsDisplay 
                    currentLine={currentLine} 
                    displayMode={displayMode}
                    layout={layout}
              animationBackgroundColor={animationBackgroundColor}
              chemistryTileColor={chemistryTileColor}
                  />
              </div>
              
          {/* Controls and Now Displaying Section */}
          <Card className="w-[450px] pt-4">
            <CardContent className="p-4 bg-card/80 backdrop-blur-sm">
              <div className="flex justify-between items-center gap-3 w-full">
                    {currentLine && (
                  <p className="text-sm text-muted-foreground font-mono">
                        Now displaying: "{currentLine.text}"
                      </p>
                    )}
                <ExportVideo onExport={handleExport} isExporting={isExporting} />
              </div>
            </CardContent>
          </Card>
                  </div>
                  
        {/* Column 3: Timeline and Audio Controls */}
        <div className="md:col-span-1 space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
                <AddMp3Button onFileSelected={handleFileSelected} />
                <Button variant="outline" onClick={() => setActiveTab('animation')}> 
                  <span className="pr-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sliders"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/></svg></span>
                    Animation Settings
                  </Button>
                </div>
                
                <AudioPlayer
                  audioUrl={audioFile?.url}
                  onTimeUpdate={handleTimeUpdate}
                  duration={audioFile ? audioRef.current?.duration * 1000 || 0 : 0}
                  onEnded={handleEnded}
                />

                {lyrics && (
                  <ScrollArea className="h-64 w-full border rounded p-3">
                    <div className="space-y-2">
                      {lyrics.lines.map((line, index) => (
                        <div key={index} className={cn(
                          "text-sm p-2 rounded cursor-pointer transition-colors",
                          currentTime >= line.startTimeMs && (!line.endTimeMs || currentTime < line.endTimeMs) ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                        )} onClick={() => handleSeek(line.startTimeMs)}>
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <span className="text-muted-foreground font-mono">
                              {Math.floor(line.startTimeMs / 1000).toFixed(2)}s
                            </span>
                            {line.endTimeMs && (
                              <span className="text-muted-foreground font-mono">
                                {Math.floor(line.endTimeMs / 1000).toFixed(2)}s
                              </span>
                            )}
                          </div>
                          <div className="text-foreground font-medium">{line.text}</div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://instagram.com/developer_rahul_"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              developer_rahul_
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/developer-rahul/lyrical-elements-react"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
