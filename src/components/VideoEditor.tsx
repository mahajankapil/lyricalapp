import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lyrics, LyricLine } from '@/utils/lyricsService';
import { cn } from '@/lib/utils';
import { Play, Pause, SkipBack, SkipForward, Settings2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LyricsDisplay from './LyricsDisplay';

interface VideoEditorProps {
  lyrics: Lyrics | null;
  currentTime: number;
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  onSeek: (time: number) => void;
  onSkip: (seconds: number) => void;
  onExport: (options: any) => void;
  onAudioFileSelected: (file: File, url: string) => void;
}

interface TimelineItem {
  line: LyricLine;
  startTime: number;
  endTime: number;
  duration: number;
}

const VideoEditor = ({ lyrics, currentTime, isPlaying, onPlayPauseToggle, onSeek, onSkip, onExport, onAudioFileSelected }: VideoEditorProps) => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [currentLine, setCurrentLine] = useState<LyricLine | null>(null);
  const [animationSettings, setAnimationSettings] = useState({
    fadeInDuration: 0.5,
    fadeOutDuration: 0.5,
    scale: 1.2,
  });
  const timelineRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Convert lyrics to timeline items
  useEffect(() => {
    if (!lyrics) return;

    const items = lyrics.lines.map(line => ({
      line,
      startTime: line.startTimeMs / 1000,
      endTime: (line.endTimeMs || 0) / 1000,
      duration: ((line.endTimeMs || 0) - line.startTimeMs) / 1000,
    }));

    setTimelineItems(items);
  }, [lyrics]);

  // Update current line based on time
  useEffect(() => {
    if (!lyrics) return;

    const currentLine = lyrics.lines.find(
      line => currentTime >= line.startTimeMs && currentTime < (line.endTimeMs || Infinity)
    );
    setCurrentLine(currentLine || null);
  }, [currentTime, lyrics]);

  // Handle playback animation (driven by isPlaying and currentTime props from parent)
  useEffect(() => {
    // Clear any existing animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (isPlaying) {
      // Set the start time of the playback session
      // Use currentTime passed from parent as the base for the session start time
      // This approach relies on the parent (Index.tsx) updating currentTime
      startTimeRef.current = Date.now() - currentTime; 

      const animate = () => {
        // No longer update time directly here, Index.tsx handles time updates based on audio

        // This animation loop primarily stays active while playing to allow potential future frame capturing or visual updates
        // The actual currentTime is updated by the timeupdate listener in Index.tsx

        // Request the next frame only if still playing
         if (isPlaying) { // Ensure we only request next frame if playback is still active
             animationFrameRef.current = requestAnimationFrame(animate);
         }
      };

      // Start the animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    // Cleanup function to cancel animation frame when playback stops or component unmounts
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, currentTime]); // Depend on isPlaying and currentTime. onTimeUpdate is no longer used to drive animation.

  const handlePlayPause = () => {
    onPlayPauseToggle();
  };

  const handleSeek = (value: number[]) => {
    onSeek(value[0] * 1000);
  };

  const handleSkip = (seconds: number) => {
    onSkip(seconds);
  };

  const handleAnimationSettingChange = (key: string, value: number) => {
    setAnimationSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onAudioFileSelected(file, url);
    }
  };

  const handleAddAudioClick = () => {
    const fileInput = document.getElementById('audioFileInput');
    fileInput?.click();
  };

  return (
    <div className="space-y-4">
      {/* Preview Window (hidden) */}
      {/*
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={previewRef}
            className="w-full aspect-video bg-chemistry-dark rounded-lg overflow-hidden relative"
          >
            {lyrics && (
              <div className="absolute inset-0">
                <LyricsDisplay
                  currentLine={currentLine}
                  displayMode="word"
                  layout="grid"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      */}
      {/* Timeline */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Timeline</CardTitle>
            <div className="flex items-center gap-2">
              {/* Hidden file input for audio selection */}
              <input 
                type="file" 
                id="audioFileInput"
                accept=".mp3,audio/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button variant="outline" size="sm" onClick={handleAddAudioClick}>
                 Add MP3 File
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings2 className="w-4 h-4 mr-2" />
                    Animation Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Animation Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Fade In Duration (seconds)</Label>
                      <Slider
                        value={[animationSettings.fadeInDuration]}
                        onValueChange={(value) => handleAnimationSettingChange('fadeInDuration', value[0])}
                        min={0.1}
                        max={2}
                        step={0.1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fade Out Duration (seconds)</Label>
                      <Slider
                        value={[animationSettings.fadeOutDuration]}
                        onValueChange={(value) => handleAnimationSettingChange('fadeOutDuration', value[0])}
                        min={0.1}
                        max={2}
                        step={0.1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Scale Factor</Label>
                      <Slider
                        value={[animationSettings.scale]}
                        onValueChange={(value) => handleAnimationSettingChange('scale', value[0])}
                        min={1}
                        max={2}
                        step={0.1}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-3 py-2">
              <Button variant="outline" size="icon" onClick={() => handleSkip(-5)} aria-label="Skip back 5 seconds">
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button variant="default" size="lg" onClick={handlePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'} className="rounded-full w-12 h-12 text-xl">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleSkip(5)} aria-label="Skip forward 5 seconds">
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Timeline Slider */}
            <div className="space-y-2 px-1">
              <Slider
                value={[currentTime / 1000]}
                onValueChange={(value) => onSeek(value[0] * 1000)}
                min={0}
                max={timelineItems.length > 0 ? timelineItems[timelineItems.length - 1].endTime : 0}
                step={0.1}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.floor(currentTime / 1000)}s</span>
                <span>{timelineItems.length > 0 ? Math.floor(timelineItems[timelineItems.length - 1].endTime) : 0}s</span>
              </div>
            </div>

            {/* Timeline Items */}
            <ScrollArea className="h-48 w-full rounded-md border p-2">
              <div className="space-y-2">
                {timelineItems.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-md transition-colors cursor-pointer",
                      currentTime >= item.startTime * 1000 && currentTime < (item.endTime * 1000 || Infinity)
                        ? "bg-primary/20 border border-primary/40"
                        : "bg-muted/30 hover:bg-muted/50"
                    )}
                    onClick={() => onSeek(item.startTime * 1000)}
                  >
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="truncate mr-4">{item.line.text}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {item.startTime.toFixed(2)}s - {item.endTime.toFixed(2)}s
                      </span>
                    </div>
                    {/* Basic visual representation of duration */}
                    <div className="w-full h-1 bg-background rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(item.duration / (timelineItems[timelineItems.length - 1]?.endTime || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoEditor; 