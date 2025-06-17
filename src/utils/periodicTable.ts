
export interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicWeight: string;
  category: string;
}

// Periodic table data - simplified list of elements
export const periodicTable: Record<string, Element> = {
  "H": { symbol: "H", name: "Hydrogen", atomicNumber: 1, atomicWeight: "1.008", category: "nonmetal" },
  "He": { symbol: "He", name: "Helium", atomicNumber: 2, atomicWeight: "4.0026", category: "noble" },
  "Li": { symbol: "Li", name: "Lithium", atomicNumber: 3, atomicWeight: "6.94", category: "alkali" },
  "Be": { symbol: "Be", name: "Beryllium", atomicNumber: 4, atomicWeight: "9.0122", category: "alkaline" },
  "B": { symbol: "B", name: "Boron", atomicNumber: 5, atomicWeight: "10.81", category: "metalloid" },
  "C": { symbol: "C", name: "Carbon", atomicNumber: 6, atomicWeight: "12.011", category: "nonmetal" },
  "N": { symbol: "N", name: "Nitrogen", atomicNumber: 7, atomicWeight: "14.007", category: "nonmetal" },
  "O": { symbol: "O", name: "Oxygen", atomicNumber: 8, atomicWeight: "15.999", category: "nonmetal" },
  "F": { symbol: "F", name: "Fluorine", atomicNumber: 9, atomicWeight: "18.998", category: "nonmetal" },
  "Ne": { symbol: "Ne", name: "Neon", atomicNumber: 10, atomicWeight: "20.180", category: "noble" },
  "Na": { symbol: "Na", name: "Sodium", atomicNumber: 11, atomicWeight: "22.990", category: "alkali" },
  "Mg": { symbol: "Mg", name: "Magnesium", atomicNumber: 12, atomicWeight: "24.305", category: "alkaline" },
  "Al": { symbol: "Al", name: "Aluminum", atomicNumber: 13, atomicWeight: "26.982", category: "post" },
  "Si": { symbol: "Si", name: "Silicon", atomicNumber: 14, atomicWeight: "28.085", category: "metalloid" },
  "P": { symbol: "P", name: "Phosphorus", atomicNumber: 15, atomicWeight: "30.974", category: "nonmetal" },
  "S": { symbol: "S", name: "Sulfur", atomicNumber: 16, atomicWeight: "32.06", category: "nonmetal" },
  "Cl": { symbol: "Cl", name: "Chlorine", atomicNumber: 17, atomicWeight: "35.45", category: "nonmetal" },
  "Ar": { symbol: "Ar", name: "Argon", atomicNumber: 18, atomicWeight: "39.948", category: "noble" },
  "K": { symbol: "K", name: "Potassium", atomicNumber: 19, atomicWeight: "39.098", category: "alkali" },
  "Ca": { symbol: "Ca", name: "Calcium", atomicNumber: 20, atomicWeight: "40.078", category: "alkaline" },
  "Sc": { symbol: "Sc", name: "Scandium", atomicNumber: 21, atomicWeight: "44.956", category: "transition" },
  "Ti": { symbol: "Ti", name: "Titanium", atomicNumber: 22, atomicWeight: "47.867", category: "transition" },
  "V": { symbol: "V", name: "Vanadium", atomicNumber: 23, atomicWeight: "50.942", category: "transition" },
  "Cr": { symbol: "Cr", name: "Chromium", atomicNumber: 24, atomicWeight: "51.996", category: "transition" },
  "Mn": { symbol: "Mn", name: "Manganese", atomicNumber: 25, atomicWeight: "54.938", category: "transition" },
  "Fe": { symbol: "Fe", name: "Iron", atomicNumber: 26, atomicWeight: "55.845", category: "transition" },
  "Co": { symbol: "Co", name: "Cobalt", atomicNumber: 27, atomicWeight: "58.933", category: "transition" },
  "Ni": { symbol: "Ni", name: "Nickel", atomicNumber: 28, atomicWeight: "58.693", category: "transition" },
  "Cu": { symbol: "Cu", name: "Copper", atomicNumber: 29, atomicWeight: "63.546", category: "transition" },
  "Zn": { symbol: "Zn", name: "Zinc", atomicNumber: 30, atomicWeight: "65.38", category: "transition" },
  "Ga": { symbol: "Ga", name: "Gallium", atomicNumber: 31, atomicWeight: "69.723", category: "post" },
  "Ge": { symbol: "Ge", name: "Germanium", atomicNumber: 32, atomicWeight: "72.630", category: "metalloid" },
  "As": { symbol: "As", name: "Arsenic", atomicNumber: 33, atomicWeight: "74.922", category: "metalloid" },
  "Se": { symbol: "Se", name: "Selenium", atomicNumber: 34, atomicWeight: "78.971", category: "nonmetal" },
  "Br": { symbol: "Br", name: "Bromine", atomicNumber: 35, atomicWeight: "79.904", category: "nonmetal" },
  "Kr": { symbol: "Kr", name: "Krypton", atomicNumber: 36, atomicWeight: "83.798", category: "noble" },
  "Rb": { symbol: "Rb", name: "Rubidium", atomicNumber: 37, atomicWeight: "85.468", category: "alkali" },
  "Sr": { symbol: "Sr", name: "Strontium", atomicNumber: 38, atomicWeight: "87.62", category: "alkaline" },
  "Y": { symbol: "Y", name: "Yttrium", atomicNumber: 39, atomicWeight: "88.906", category: "transition" },
  "Zr": { symbol: "Zr", name: "Zirconium", atomicNumber: 40, atomicWeight: "91.224", category: "transition" },
  "Nb": { symbol: "Nb", name: "Niobium", atomicNumber: 41, atomicWeight: "92.906", category: "transition" },
  "Mo": { symbol: "Mo", name: "Molybdenum", atomicNumber: 42, atomicWeight: "95.95", category: "transition" },
  "Tc": { symbol: "Tc", name: "Technetium", atomicNumber: 43, atomicWeight: "[98]", category: "transition" },
  "Ru": { symbol: "Ru", name: "Ruthenium", atomicNumber: 44, atomicWeight: "101.07", category: "transition" },
  "Rh": { symbol: "Rh", name: "Rhodium", atomicNumber: 45, atomicWeight: "102.91", category: "transition" },
  "Pd": { symbol: "Pd", name: "Palladium", atomicNumber: 46, atomicWeight: "106.42", category: "transition" },
  "Ag": { symbol: "Ag", name: "Silver", atomicNumber: 47, atomicWeight: "107.87", category: "transition" },
  "Cd": { symbol: "Cd", name: "Cadmium", atomicNumber: 48, atomicWeight: "112.41", category: "transition" },
  "In": { symbol: "In", name: "Indium", atomicNumber: 49, atomicWeight: "114.82", category: "post" },
  "Sn": { symbol: "Sn", name: "Tin", atomicNumber: 50, atomicWeight: "118.71", category: "post" },
  "Sb": { symbol: "Sb", name: "Antimony", atomicNumber: 51, atomicWeight: "121.76", category: "metalloid" },
  "Te": { symbol: "Te", name: "Tellurium", atomicNumber: 52, atomicWeight: "127.60", category: "metalloid" },
  "I": { symbol: "I", name: "Iodine", atomicNumber: 53, atomicWeight: "126.90", category: "nonmetal" },
  "Xe": { symbol: "Xe", name: "Xenon", atomicNumber: 54, atomicWeight: "131.29", category: "noble" },
  "Cs": { symbol: "Cs", name: "Cesium", atomicNumber: 55, atomicWeight: "132.91", category: "alkali" },
  "Ba": { symbol: "Ba", name: "Barium", atomicNumber: 56, atomicWeight: "137.33", category: "alkaline" },
  "La": { symbol: "La", name: "Lanthanum", atomicNumber: 57, atomicWeight: "138.91", category: "lanthanide" },
  "Ce": { symbol: "Ce", name: "Cerium", atomicNumber: 58, atomicWeight: "140.12", category: "lanthanide" },
  "Pr": { symbol: "Pr", name: "Praseodymium", atomicNumber: 59, atomicWeight: "140.91", category: "lanthanide" },
  "Nd": { symbol: "Nd", name: "Neodymium", atomicNumber: 60, atomicWeight: "144.24", category: "lanthanide" },
  "W": { symbol: "W", name: "Tungsten", atomicNumber: 74, atomicWeight: "183.84", category: "transition" },
  "U": { symbol: "U", name: "Uranium", atomicNumber: 92, atomicWeight: "238.03", category: "actinide" },
};

// Custom elements for letters that don't exist in the periodic table
export const customElements: Record<string, Element> = {
  "A": { symbol: "A", name: "Artificial", atomicNumber: 101, atomicWeight: "26.982", category: "nonmetal" },
  "D": { symbol: "D", name: "Designium", atomicNumber: 102, atomicWeight: "4.0026", category: "noble" },
  "E": { symbol: "E", name: "Elementium", atomicNumber: 103, atomicWeight: "15.999", category: "nonmetal" },
  "G": { symbol: "G", name: "Gravitonium", atomicNumber: 104, atomicWeight: "64.106", category: "transition" },
  "J": { symbol: "J", name: "Jokulium", atomicNumber: 105, atomicWeight: "39.098", category: "alkali" },
  "L": { symbol: "L", name: "Luminarium", atomicNumber: 106, atomicWeight: "6.94", category: "alkali" },
  "M": { symbol: "M", name: "Musicum", atomicNumber: 107, atomicWeight: "24.305", category: "alkaline" },
  "Q": { symbol: "Q", name: "Quantium", atomicNumber: 108, atomicWeight: "44.956", category: "transition" },
  "R": { symbol: "R", name: "Rhythmium", atomicNumber: 109, atomicWeight: "85.468", category: "alkali" },
  "T": { symbol: "T", name: "Tunium", atomicNumber: 110, atomicWeight: "204.38", category: "post" },
  "X": { symbol: "X", name: "Xylium", atomicNumber: 111, atomicWeight: "131.29", category: "noble" },
  "Z": { symbol: "Z", name: "Zingium", atomicNumber: 112, atomicWeight: "91.224", category: "transition" },
};

export const getElementForChar = (char: string): Element => {
  // Handle spaces and special characters
  if (!char || char === ' ' || !char.trim()) {
    return {
      symbol: ' ',
      name: 'Space',
      atomicNumber: 0,
      atomicWeight: '0',
      category: 'nonmetal'
    };
  }

  // Convert to uppercase for matching
  const upperChar = char.toUpperCase();
  
  // Check if it's a one or two character element
  if (upperChar.length === 2 && periodicTable[upperChar]) {
    return periodicTable[upperChar];
  }
  
  // Check if the first character matches an element
  const firstChar = upperChar.charAt(0);
  if (periodicTable[firstChar]) {
    return periodicTable[firstChar];
  }
  
  // Check if we have a custom element for this letter
  if (customElements[firstChar]) {
    return customElements[firstChar];
  }
  
  // Create a generic element for other characters
  return {
    symbol: firstChar,
    name: `Unknown-${firstChar}`,
    atomicNumber: 113 + upperChar.charCodeAt(0) % 13,
    atomicWeight: `${(upperChar.charCodeAt(0) % 100) + 0.42}`,
    category: 'nonmetal'
  };
};
