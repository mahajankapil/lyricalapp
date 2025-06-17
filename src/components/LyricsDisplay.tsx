import { useState, useEffect } from 'react';
import { ElementTile } from '@/components/ElementTile';
import { LyricLine, splitLyricContent } from '@/utils/lyricsService';
import { getElementForChar, Element as PeriodicElement, periodicTable } from '@/utils/periodicTable';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface LyricsDisplayProps {
  currentLine: LyricLine | null;
  displayMode: 'word' | 'character';
  layout: 'grid' | 'flow';
  animationBackgroundColor: string;
  chemistryTileColor: string;
}

// Define types for the items to be displayed
type ElementDisplayItem = { type: 'element'; text: string; element: PeriodicElement; };
type EmojiDisplayItem = { type: 'emoji'; word: string; emoji: string; };
type SpaceDisplayItem = { type: 'space'; };

type DisplayItem = ElementDisplayItem | EmojiDisplayItem | SpaceDisplayItem;

// Define a map for words that should be replaced by emojis
const wordEmojiMap: { [key: string]: string } = {
  'love': '❤️',
  'heart': '💖',
  'fire': '🔥',
  'broken': '💔',
  'cry': '😢',
  'tears': '😢',
  'star': '⭐',
  'right': '✅',
  'sad': '😢',
  'happy': '😊',
  'go': '🏃',
  'stop': '🛑',
  'play': '▶️',
  'rewind': '⏪',
  'smile': '😄',
  'time': '⏳',
  'peace': '✌️',
  'win': '🏆',
  'wave': '👋',
  '100': '💯',
  // Add more words and their corresponding emojis here
};

// Define a map for mathematical and physics symbols
const mathPhysicsSymbolsMap: { [key: string]: { symbol: string; name: string; category: string } } = {
  'A': { symbol: '∀', name: 'Universal Quant', category: 'symbol' }, // Universal Quantifier
  'B': { symbol: '𝔅', name: 'Magnetic Field', category: 'symbol' }, // Blackboard Bold B
  'C': { symbol: '℃', name: 'Celsius', category: 'symbol' }, // Celsius
  'D': { symbol: '∆', name: 'Delta', category: 'symbol' }, // Change (Delta)
  'E': { symbol: 'ℯ', name: "Euler's Num", category: 'symbol' }, // Euler's number
  'F': { symbol: '∮', name: 'Line Integral', category: 'symbol' }, // Line integral
  'G': { symbol: '𝒢', name: 'Gravity', category: 'symbol' }, // Math Script G
  'H': { symbol: 'ℏ', name: 'hbar', category: 'symbol' }, // Reduced Planck's constant
  'I': { symbol: '𝕀', name: 'Identity Matrix', category: 'symbol' }, // Blackboard Bold I
  'J': { symbol: '𝒥', name: 'Joule', category: 'symbol' }, // Math Script J (Joule / Current Density)
  'K': { symbol: '𝒦', name: 'Kelvin', category: 'symbol' }, // Math Script K
  'L': { symbol: '𝓛', name: 'Lagrangian', category: 'symbol' }, // Lagrangian
  'M': { symbol: '𝓜', name: 'Mass', category: 'symbol' }, // Math Script M
  'N': { symbol: '𝒩', name: 'Normal Dist', category: 'symbol' }, // Math Script N (Normal Distribution / Newton)
  'O': { symbol: 'Ω', name: 'Ohm', category: 'symbol' }, // Omega (Ohm)
  'P': { symbol: '∏', name: 'Product', category: 'symbol' }, // Product
  'Q': { symbol: 'ℚ', name: 'Rational Nums', category: 'symbol' }, // Blackboard Bold Q (Rational numbers / Charge)
  'R': { symbol: 'ℝ', name: 'Real Nums', category: 'symbol' }, // Blackboard Bold R (Real numbers / Resistance)
  'S': { symbol: '∑', name: 'Summation', category: 'symbol' }, // Summation / Entropy
  'T': { symbol: '⊤', name: 'Truth/Tesla', category: 'symbol' }, // Top (Truth / Tesla)
  'U': { symbol: 'µ', name: 'Micro', category: 'symbol' }, // Mu (Micro)
  'V': { symbol: '√', name: 'Square Root', category: 'symbol' }, // Square Root / Volt
  'W': { symbol: '𝒲', name: 'Watt/Work', category: 'symbol' }, // Math Script W (Watt / Work)
  'X': { symbol: '×', name: 'Multiply/Unknown', category: 'symbol' }, // Multiplication / Unknown
  'Y': { symbol: 'γ', name: 'Gamma Ray', category: 'symbol' }, // Gamma Ray
  'Z': { symbol: 'ℤ', name: 'Integers/Atomic', category: 'symbol' }, // Blackboard Bold Z (Integers / Atomic number)
  // Add other mathematical and physics symbols here if needed
  '+': { symbol: '+', name: 'Plus', category: 'symbol' },
  '-': { symbol: '-', name: 'Minus', category: 'symbol' },
  '*': { symbol: '*', name: 'Multiply', category: 'symbol' },
  '/': { symbol: '/', name: 'Divide', category: 'symbol' },
  '=': { symbol: '=', name: 'Equals', category: 'symbol' },
  '>': { symbol: '>', name: 'Greater Than', category: 'symbol' },
  '<': { symbol: '<', name: 'Less Than', category: 'symbol' },
  '(': { symbol: '(', name: 'Left Paren', category: 'symbol' },
  ')': { symbol: ')', name: 'Right Paren', category: 'symbol' },
  '[': { symbol: '[', name: 'Left Bracket', category: 'symbol' },
  ']': { symbol: ']', name: 'Right Bracket', category: 'symbol' },
  '{': { symbol: '{', name: 'Left Brace', category: 'symbol' },
  '}': { symbol: '}', name: 'Right Brace', category: 'symbol' },
  'e': { symbol: 'e', name: 'Exponential', category: 'symbol' },
};

// Helper function to get element data for math/physics symbols
const getSymbolElementData = (char: string): PeriodicElement | undefined => {
   const symbolInfo = mathPhysicsSymbolsMap[char.toUpperCase()]; // Check uppercase for map key
   if (symbolInfo) {
      return {
         symbol: symbolInfo.symbol,
         name: symbolInfo.name,
         atomicNumber: 0, // Indicate not a real element
         atomicWeight: 'N/A',
         category: 'symbol' // Custom category
      };
   }
   return undefined;
};

const LyricsDisplay = ({ currentLine, displayMode, layout, animationBackgroundColor, chemistryTileColor }: LyricsDisplayProps) => {
  const [displayItems, setDisplayItems] = useState<DisplayItem[]>([]);
  const [animating, setAnimating] = useState(false);
  
  // Update display items when the current line changes
  useEffect(() => {
    setAnimating(true);
    setTimeout(() => {
      if (currentLine) {
        let processedText = currentLine.text;
        // Replace hyphens with spaces
        processedText = processedText.replace(/-/g, ' ');
        // Replace text within parentheses with spaces, preserving length
        processedText = processedText.replace(/\([^)]*\)/g, (match) => ' '.repeat(match.length));

        const words = processedText.split(' '); // Split the line into words
        const newDisplayItems: DisplayItem[] = [];

        for (const word of words) {
          if (word.trim() === '') {
            // Add a space item for separation
            newDisplayItems.push({ type: 'space' }); // Use the new space item type
            continue;
          }

          let remainingWord = word;
          let wordProcessed = false;

          // Priority 2: Check for full word emoji match (case-insensitive)
          const lowerWord = word.toLowerCase();
          if (wordEmojiMap[lowerWord]) {
            newDisplayItems.push({ type: 'emoji', word: word, emoji: wordEmojiMap[lowerWord] });
            wordProcessed = true;
          }

          // If not processed as a full emoji word, process character by character
          if (!wordProcessed) {
            let i = 0;
            while (i < remainingWord.length) {
              let charProcessed = false;

              // Priority 1: Check for 2-letter real element (case-insensitive input, standard case output)
              if (i + 1 < remainingWord.length) {
                const twoCharOriginalCase = remainingWord.substring(i, i + 2);
                const twoCharStandardCase = twoCharOriginalCase.charAt(0).toUpperCase() + twoCharOriginalCase.charAt(1).toLowerCase();
                if (periodicTable[twoCharStandardCase]) {
                  newDisplayItems.push({ 
                    type: 'element',
                    text: periodicTable[twoCharStandardCase].symbol,
                    element: periodicTable[twoCharStandardCase]
                  });
                  i += 2;
                  charProcessed = true;
                }
              }

              // Priority 1: Check for 1-letter real element (case-insensitive input, standard case output)
              if (!charProcessed) {
                const oneCharOriginalCase = remainingWord.substring(i, i + 1);
                const oneCharStandardCase = oneCharOriginalCase.toUpperCase();
                if (periodicTable[oneCharStandardCase]) {
                   newDisplayItems.push({
                     type: 'element',
                     text: periodicTable[oneCharStandardCase].symbol,
                     element: periodicTable[oneCharStandardCase]
                   });
                  i += 1;
                  charProcessed = true;
                }
              }

              // Priority 3: Check for mathematical or physics symbols (case-insensitive input, map symbol output)
              if (!charProcessed) {
                 const currentSymbol = remainingWord.substring(i, i + 1);
                 const symbolElement = getSymbolElementData(currentSymbol); // Use helper to get symbol element data
                 if (symbolElement) {
                    newDisplayItems.push({ 
                       type: 'element', // Treat as element type for rendering consistency
                       text: symbolElement.symbol,
                       element: symbolElement
                    });
                    i += 1;
                    charProcessed = true;
                 }
              }

              // Fallback: Unmatched character
              if (!charProcessed) {
                const unmatchedChar = remainingWord.substring(i, i + 1);
                 // Create a placeholder element for unknown characters
                 const unknownElement: PeriodicElement = {
                    symbol: unmatchedChar,
                    name: 'Unknown',
                    atomicNumber: 0,
                    atomicWeight: 'N/A',
                    category: 'unknown' // Assign an unknown category
                 };
                newDisplayItems.push({ type: 'element', text: unmatchedChar, element: unknownElement });
                i += 1;
              }
            }
          }
        } // End word loop

        // Add a space after each word's items except the last one (handled by splitting)
        // This might not be needed with the flex-wrap layout and original spacing
        // If extra space is needed, add it here conditionally

        setDisplayItems(newDisplayItems);
      } else {
        setDisplayItems([]);
      }
      setAnimating(false);
    }, 100); // Reduced from 300ms to 100ms for smoother transition
  }, [currentLine]);
  
  // Render an empty state when no lyrics are present
  if (!currentLine) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <div className="text-2xl mb-2">🧪</div>
        <p className="text-lg font-semibold">No Lyrics Available</p>
        <p className="text-sm">Upload audio and lyrics to get started</p>
      </div>
    );
  }
  
  // Render display items using the original layout and appropriate components/styling
  return (
    <div className={cn(
      'flex flex-wrap justify-center items-center w-full p-4 gap-x-4 gap-y-4 overflow-hidden text-white transition-all duration-500 ease-in-out backdrop-blur-sm',
      animationBackgroundColor,
      layout === 'grid' ? '' : '',
      animating ? 'opacity-50' : 'opacity-100'
    )}>
      {/* Map over words and group their elements/emojis within word containers */}
      {currentLine?.text
        .replace(/-/g, ' ')
        .replace(/\([^)]*\)/g, (match) => ' '.repeat(match.length))
        .split(' ')
        .filter(word => word !== '')
        .map((word, wordIdx) => {
          const itemsForWord: DisplayItem[] = [];
          let remainingWord = word;
          let wordProcessed = false;

          // Priority 2: Check for full word emoji match (case-insensitive)
          const lowerWord = word.toLowerCase();
          if (wordEmojiMap[lowerWord]) {
            itemsForWord.push({ type: 'emoji', word: word, emoji: wordEmojiMap[lowerWord] });
            wordProcessed = true;
          }

          // If not processed as a full emoji word, process character by character
          if (!wordProcessed) {
            let i = 0;
            while (i < remainingWord.length) {
              let charProcessed = false;

              // Priority 1: Check for 2-letter real element (case-insensitive input, standard case output)
              if (i + 1 < remainingWord.length) {
                const twoCharOriginalCase = remainingWord.substring(i, i + 2);
                const twoCharStandardCase = twoCharOriginalCase.charAt(0).toUpperCase() + twoCharOriginalCase.charAt(1).toLowerCase();
                if (periodicTable[twoCharStandardCase]) {
                  itemsForWord.push({ 
                    type: 'element',
                    text: periodicTable[twoCharStandardCase].symbol,
                    element: periodicTable[twoCharStandardCase]
                  });
                  i += 2;
                  charProcessed = true;
                }
              }

              // Priority 1: Check for 1-letter real element (case-insensitive input, standard case output)
              if (!charProcessed) {
                const oneCharOriginalCase = remainingWord.substring(i, i + 1);
                const oneCharStandardCase = oneCharOriginalCase.toUpperCase();
                if (periodicTable[oneCharStandardCase]) {
                   itemsForWord.push({
                     type: 'element',
                     text: periodicTable[oneCharStandardCase].symbol,
                     element: periodicTable[oneCharStandardCase]
                   });
                  i += 1;
                  charProcessed = true;
                }
              }

              // Priority 3: Check for mathematical or physics symbols (case-insensitive input, map symbol output)
              if (!charProcessed) {
                 const currentSymbol = remainingWord.substring(i, i + 1);
                 const symbolElement = getSymbolElementData(currentSymbol); // Use helper to get symbol element data
                 if (symbolElement) {
                    itemsForWord.push({ 
                       type: 'element', // Treat as element type for rendering consistency
                       text: symbolElement.symbol,
                       element: symbolElement
                    });
                    i += 1;
                    charProcessed = true;
                 }
              }

              // Fallback: Unmatched character
              if (!charProcessed) {
                const unmatchedChar = remainingWord.substring(i, i + 1);
                 // Create a placeholder element for unknown characters
                 const unknownElement: PeriodicElement = {
                    symbol: unmatchedChar,
                    name: 'Unknown',
                    atomicNumber: 0,
                    atomicWeight: 'N/A',
                    category: 'unknown' // Assign an unknown category
                 };
                itemsForWord.push({ type: 'element', text: unmatchedChar, element: unknownElement });
                i += 1;
              }
            }
          }
          
          // Filter out unknown items
          const itemsToRender = itemsForWord.filter(item => !(item.type === 'element' && item.element.category === 'unknown'));
          if (itemsToRender.length === 0) return null;

          return (
            <div key={wordIdx} className="flex flex-wrap items-center group">
              <div className="flex items-center gap-0.5">
                {itemsToRender.map((item, itemIdx) => {
                  // Calculate animation delay based on item index within the word
                  const animationDelay = `${itemIdx * 50}ms`; // 50ms delay between items

                  if (item.type === 'emoji') {
                    return (
                      <div 
                        key={`emoji-${wordIdx}-${itemIdx}`} 
                        className={cn(
                          "element-tile flex flex-col items-center justify-between rounded-xl shadow-sm w-14 h-14 p-1 relative border border-white/10 transition-all duration-300 ease-out transform hover:scale-105 animate-fade-in", 
                          chemistryTileColor
                        )}
                        style={{ animationDelay }} // Apply the calculated delay
                      >
                        <span className="atomic-number opacity-0">0</span> {/* Placeholder for consistent spacing */}
                        <div className="flex flex-col items-center justify-center flex-grow w-full">
                          <span className="element-symbol text-base font-bold leading-none text-white">{item.emoji}</span>
                          <span className="element-name text-[7px] font-medium text-center leading-tight text-white whitespace-normal break-words opacity-90">{item.word}</span>
                        </div>
                        {item.type === 'emoji' && item.word !== 'N/A' && <span className="element-weight opacity-0">N/A</span>} {/* Placeholder for consistent spacing */}
                      </div>
                    );
                  } else if (item.type === 'element') {
                    return (
                      <div 
                        key={`element-wrapper-${wordIdx}-${itemIdx}`} 
                        style={{ animationDelay }} 
                        className="animate-fade-in transition-all duration-300 ease-out transform hover:scale-105"
                      >
            <ElementTile
                          key={`element-${wordIdx}-${itemIdx}-${item.text}`}
              symbol={item.element.symbol}
              name={item.element.name}
              atomicNumber={item.element.atomicNumber}
              atomicWeight={item.element.atomicWeight}
              category={item.element.category}
                          className={chemistryTileColor} // Pass chemistryTileColor directly
            />
          </div>
                    );
                  }
                  return null;
                })}
              </div>
      </div>
          );
        })}
    </div>
  );
};

export default LyricsDisplay;
