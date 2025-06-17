
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, Play, Pause, Download } from "lucide-react";

interface AudioPlayerProps {
  audioUrl?: string;
  onTimeUpdate: (currentTime: number) => void;
  duration: number;
  onEnded?: () => void;
}

const AudioPlayer = ({ audioUrl, onTimeUpdate, duration, onEnded }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on mount or when URL changes
  useEffect(() => {
    if (!audioUrl) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Audio play failed:", err));
      }
    } else {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("ended", handleEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current.pause();
      }
    };
  }, [audioUrl]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const time = Math.floor(audioRef.current.currentTime * 1000); // convert to ms
    setCurrentTime(time);
    onTimeUpdate(time);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onEnded) onEnded();
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Audio play failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    const seekTime = value[0];
    audioRef.current.currentTime = seekTime / 1000;
    setCurrentTime(seekTime);
    onTimeUpdate(seekTime);
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    const newTime = audioRef.current.currentTime + seconds;
    audioRef.current.currentTime = Math.max(0, Math.min(newTime, audioRef.current.duration));
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => skip(-5)}
          disabled={!audioUrl}
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="default" 
          size="icon" 
          onClick={togglePlay}
          disabled={!audioUrl}
          className="rounded-full"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => skip(5)}
          disabled={!audioUrl}
          className="rounded-full"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        
        {audioUrl && (
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full ml-auto"
            asChild
          >
            <a href={audioUrl} download>
              <Download className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>

      <div className="space-y-1">
        <Slider 
          value={[currentTime]} 
          min={0} 
          max={duration || 100} 
          step={1}
          onValueChange={handleSeek}
          disabled={!audioUrl}
          className="cursor-pointer"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
