export interface ExportOptions {
  filename: string;
  quality: 'low' | 'medium' | 'high';
  includeAudio: boolean;
  duration: number;
  currentTime?: number;
  lyrics?: any;
} 