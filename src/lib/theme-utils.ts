/**
 * Theme palette interface
 */
export interface ThemePalette {
  name: string;
  dark: string;
  light: string;
}

/**
 * Theme information with multiple palettes
 */
export interface ThemeInfo {
  name: string;
  palettes: ThemePalette[];
}

/**
 * Available themes with their palettes
 */
export const themes: { [key: string]: ThemeInfo } = {
  modern: {
    name: "Modern",
    palettes: [
      { name: "Classic", dark: "#000000", light: "#FFFFFF" },
      { name: "Slate", dark: "#1E293B", light: "#F8FAFC" },
      { name: "Midnight", dark: "#312E81", light: "#F1F5F9" }
    ]
  },
  pastel: {
    name: "Pastel",
    palettes: [
      { name: "Ocean", dark: "#5B8FB9", light: "#FAF3F0" },
      { name: "Lavender", dark: "#9C6ADE", light: "#F9F5FF" },
      { name: "Mint", dark: "#36B37E", light: "#E6FCEF" }
    ]
  },
  cartoony: {
    name: "Cartoony",
    palettes: [
      { name: "Playful", dark: "#FF6B6B", light: "#FFF9C4" },
      { name: "Vibrant", dark: "#FF5470", light: "#FDFFB6" },
      { name: "Bubbly", dark: "#FF9F1C", light: "#CAFFBF" }
    ]
  }
};

/**
 * Gets available palettes for a given theme
 */
export function getThemePalettes(theme: string | null): ThemePalette[] {
  if (!theme || !themes[theme]) {
    return themes.modern.palettes;
  }
  return themes[theme].palettes;
}

/**
 * Gets theme colors based on theme name and palette index
 */
export function getThemeColors(theme: string | null, paletteIndex: number = 0): ThemePalette {
  if (!theme || !themes[theme]) {
    return themes.modern.palettes[0];
  }
  
  const selectedTheme = themes[theme];
  // Ensure palette index is within bounds
  const index = paletteIndex >= 0 && paletteIndex < selectedTheme.palettes.length 
    ? paletteIndex 
    : 0;
    
  return selectedTheme.palettes[index];
}
