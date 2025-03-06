"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { getThemeColors, getThemePalettes, ThemePalette } from "@/lib/theme-utils";
import * as LucideIcons from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import QrCodeInfo from "@/components/QrCodeInfo";

// Font size mapping
const FONT_SIZES = [
  { value: 0, class: "text-xs" },
  { value: 1, class: "text-sm" },
  { value: 2, class: "text-base" },
  { value: 3, class: "text-lg" },
  { value: 4, class: "text-xl" },
  { value: 5, class: "text-2xl" },
];

// Popular Lucide icons for QR codes
const POPULAR_ICONS = [
  { name: "None", component: null },
  { name: "MapPin", component: LucideIcons.MapPin },
  { name: "Link", component: LucideIcons.Link },
  { name: "QrCode", component: LucideIcons.QrCode },
  { name: "Globe", component: LucideIcons.Globe },
  { name: "Info", component: LucideIcons.Info },
  { name: "Coffee", component: LucideIcons.Coffee },
  { name: "Store", component: LucideIcons.Store },
  { name: "Phone", component: LucideIcons.Phone },
  { name: "Mail", component: LucideIcons.Mail },
  { name: "Calendar", component: LucideIcons.Calendar },
  { name: "Heart", component: LucideIcons.Heart },
  { name: "Gift", component: LucideIcons.Gift },
  { name: "Music", component: LucideIcons.Music },
  { name: "Camera", component: LucideIcons.Camera },
  { name: "Instagram", component: LucideIcons.Instagram },
  { name: "Twitter", component: LucideIcons.Twitter },
  { name: "Facebook", component: LucideIcons.Facebook },
  { name: "Youtube", component: LucideIcons.Youtube },
  { name: "Linkedin", component: LucideIcons.Linkedin },
  { name: "Github", component: LucideIcons.Github },
  { name: "Bookmark", component: LucideIcons.Bookmark },
  { name: "Share", component: LucideIcons.Share2 },
  { name: "Download", component: LucideIcons.Download },
];

// Icon position options
const ICON_POSITIONS = [
  { value: "bottom-right", label: "Bottom Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "top-right", label: "Top Right" },
  { value: "top-left", label: "Top Left" },
  { value: "center", label: "Center" },
];

export default function PreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Get parameters from URL
  const location = searchParams.get("location");
  const theme = searchParams.get("theme");
  const text = searchParams.get("text");
  
  // Get position parameter from URL if it exists, otherwise default to "top"
  const urlTextPosition = searchParams.get("textPosition");
  const [textPosition, setTextPosition] = useState<string>(urlTextPosition || "top");
  
  // Get palette index from URL or default to 0
  const urlPaletteIndex = searchParams.get("paletteIndex");
  const [paletteIndex, setPaletteIndex] = useState<number>(urlPaletteIndex ? parseInt(urlPaletteIndex) : 0);
  
  // Get font size from URL or default to index 1 (text-sm)
  const urlFontSize = searchParams.get("fontSize");
  const [fontSizeIndex, setFontSizeIndex] = useState<number>(
    urlFontSize ? parseInt(urlFontSize) : 3
  );

  // Get icon from URL or default to "None"
  const urlIcon = searchParams.get("icon");
  const [selectedIcon, setSelectedIcon] = useState<string>(urlIcon || "None");
  
  // Get icon position from URL or default to "bottom-right"
  const urlIconPosition = searchParams.get("iconPosition");
  const [iconPosition, setIconPosition] = useState<string>(urlIconPosition || "bottom-right");

  // Initialize theme palette with the correct theme and palette index immediately
  const initialPalette = getThemeColors(theme, urlPaletteIndex ? parseInt(urlPaletteIndex) : 0);
  const [themePalette, setThemePalette] = useState<ThemePalette>(initialPalette);
  
  // Get available palettes for the current theme
  const [availablePalettes, setAvailablePalettes] = useState<ThemePalette[]>(getThemePalettes(theme));
  
  // Load available palettes when theme changes
  useEffect(() => {
    if (theme) {
      const palettes = getThemePalettes(theme);
      setAvailablePalettes(palettes);
      
      // Update palette when theme changes (if needed)
      if (paletteIndex >= palettes.length) {
        setPaletteIndex(0);
      }
    }
  }, [theme]);
  
  // Update palette when paletteIndex changes
  useEffect(() => {
    if (theme) {
      const selectedPalette = getThemeColors(theme, paletteIndex);
      setThemePalette(selectedPalette);
      
      // Regenerate QR code when palette changes
      if (location && theme && text) {
        generateQRCode(selectedPalette);
      }
    }
  }, [paletteIndex, theme]);

  // Ensure all required parameters exist and generate QR code on initial load
  useEffect(() => {
    if (!location || !theme || !text) {
      setError("Missing required information. Please go back to the form.");
      return;
    }

    // Generate QR code based on the provided information
    generateQRCode(themePalette);
  }, [location, theme, text]);

  // Update text position in URL when it changes
  useEffect(() => {
    if (location && theme && text) {
      const params = new URLSearchParams(searchParams);
      params.set("textPosition", textPosition);
      params.set("paletteIndex", paletteIndex.toString());
      params.set("fontSize", fontSizeIndex.toString());
      params.set("icon", selectedIcon);
      params.set("iconPosition", iconPosition);
      
      // Update URL without refreshing the page
      const url = new URL(window.location.href);
      url.search = params.toString();
      window.history.replaceState({}, '', url);
    }
  }, [textPosition, paletteIndex, fontSizeIndex, selectedIcon, iconPosition, location, theme, text]);

  // Function to generate the QR code
  const generateQRCode = async (palette: ThemePalette = themePalette) => {
    try {
      // Use only location for the QR code content (not text)
      const qrContent = location || '';
      
      // Set QR code options based on theme
      let qrOptions: QRCode.QRCodeToDataURLOptions = {
        margin: 1,
        width: 300,
      };
      
      // Apply theme-specific styling - ensure palette is valid
      if (palette && palette.dark && palette.light) {
        qrOptions.color = {
          dark: palette.dark,
          light: palette.light
        };
      } else {
        console.warn("Invalid palette provided to generateQRCode, using default colors");
        qrOptions.color = {
          dark: "#000000",
          light: "#FFFFFF"
        };
      }
      
      // Generate QR code as data URL
      const dataURL = await QRCode.toDataURL(qrContent, qrOptions);
      setQrCodeDataURL(dataURL);
    } catch (err) {
      console.error("Error generating QR code:", err);
      setError("Failed to generate QR code. Please try again.");
    }
  };

  // Function to navigate to share page
  const goToSharePage = () => {
    if (location && theme && text && qrCodeDataURL) {
      const params = new URLSearchParams(searchParams);
      params.set("qrcode", qrCodeDataURL);
      params.set("textPosition", textPosition);
      params.set("paletteIndex", paletteIndex.toString());
      params.set("fontSize", fontSizeIndex.toString());
      params.set("icon", selectedIcon);
      params.set("iconPosition", iconPosition);
      router.push(`/share?${params.toString()}`);
    }
  };

  // Function to go back to the form page
  const goBack = () => {
    router.push("/");
  };

  // Get current font size class
  const getFontSizeClass = () => {
    return FONT_SIZES[fontSizeIndex]?.class || "text-sm";
  };

  // Function to render text based on position
  const renderText = () => {
    if (!text) return null;
    
    const fontSizeClass = getFontSizeClass();
    
    const textContent = (
      <div className={`text-center ${fontSizeClass}`} style={{ color: themePalette.dark }}>
        {text.split('\n').map((line, i) => (
          <p key={i} className="font-medium">{line}</p>
        ))}
      </div>
    );
    
    const verticalTextContent = (
      <div className={`flex flex-col justify-center ${fontSizeClass}`} style={{ color: themePalette.dark }}>
        {text.split('').map((char, i) => (
          <p key={i} className="font-medium text-center my-0 py-0 leading-tight">
            {char === ' ' ? '\u00A0' : char}
          </p>
        ))}
      </div>
    );
    
    // Return the text wrapped in position-specific styling
    switch(textPosition) {
      case "top":
        return <div className="mb-3">{textContent}</div>;
      case "bottom":
        return <div className="mt-3">{textContent}</div>;
      case "left":
        return (
          <div className="flex flex-row items-center">
            <div className="mr-3 self-center" style={{ minWidth: '20px' }}>
              {verticalTextContent}
            </div>
            <img 
              src={qrCodeDataURL || ''} 
              alt="Generated QR Code" 
              className="w-[250px] h-[250px] object-contain"
            />
          </div>
        );
      case "right":
        return (
          <div className="flex flex-row items-center">
            <img 
              src={qrCodeDataURL || ''} 
              alt="Generated QR Code" 
              className="w-[250px] h-[250px] object-contain"
            />
            <div className="ml-3 self-center" style={{ minWidth: '20px' }}>
              {verticalTextContent}
            </div>
          </div>
        );
      default:
        return <div className="mb-3">{textContent}</div>;
    }
  };

  // Render the selected icon
  const renderIcon = () => {
    const iconInfo = POPULAR_ICONS.find(icon => icon.name === selectedIcon);
    if (!iconInfo || !iconInfo.component) return null;
    
    const IconComponent = iconInfo.component;
    
    // Set position classes based on selected position
    let positionClass = "";
    switch (iconPosition) {
      case "bottom-right":
        positionClass = "bottom-2 right-2";
        break;
      case "bottom-left":
        positionClass = "bottom-2 left-2";
        break;
      case "top-right":
        positionClass = "top-2 right-2";
        break;
      case "top-left":
        positionClass = "top-2 left-2";
        break;
      case "center":
        positionClass = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
        break;
      default:
        positionClass = "bottom-2 right-2";
    }
    
    return (
      <div className={`absolute ${positionClass} p-1 bg-white rounded-full shadow-sm flex items-center justify-center`}>
        <IconComponent 
          size={24} 
          color={themePalette.dark}
        />
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-6 md:py-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 animate-fade-in">
            QR<span className="text-yellow-300">cle</span> Preview
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Customize your QR code before sharing or downloading.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          {/* Controls Card */}
          <Card className="w-full lg:w-1/2 bg-white/95 backdrop-blur shadow-xl border-0 transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="text-xl font-bold">Customize Your QR Code</CardTitle>
              <CardDescription className="text-white/90">
                Adjust settings to personalize your QR code design.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              {error ? (
                <div className="text-red-500 text-center p-4 bg-red-50 rounded-md border border-red-200">{error}</div>
              ) : !qrCodeDataURL ? (
                <div className="text-center p-8 animate-pulse">
                  <div className="inline-block p-2 rounded-full bg-purple-100 mb-3">
                    <LucideIcons.Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                  </div>
                  <p>Generating your QR code...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 w-full">
                  <div className="w-full space-y-4">
                    <div>
                      <Label htmlFor="textPosition" className="mb-2 block font-medium text-gray-800">Text Position</Label>
                      <Select
                        value={textPosition}
                        onValueChange={setTextPosition}
                      >
                        <SelectTrigger id="textPosition" className="w-full border-gray-300 focus:ring-purple-500 focus:border-purple-500">
                          <SelectValue placeholder="Select text position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="paletteSelector" className="mb-2 block font-medium text-gray-800">Color Palette</Label>
                      <Select
                        value={paletteIndex.toString()}
                        onValueChange={(value) => setPaletteIndex(parseInt(value))}
                      >
                        <SelectTrigger id="paletteSelector" className="w-full border-gray-300 focus:ring-purple-500 focus:border-purple-500">
                          <SelectValue placeholder="Select color palette" />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePalettes.map((palette, idx) => (
                            <SelectItem key={idx} value={idx.toString()}>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center space-x-1">
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: palette.dark }}
                                  ></div>
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: palette.light }}
                                  ></div>
                                </div>
                                <span>{palette.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="fontSize" className="font-medium text-gray-800">Font Size</Label>
                        <span className="text-sm text-muted-foreground">
                          {FONT_SIZES[fontSizeIndex]?.class.replace('text-', '')}
                        </span>
                      </div>
                      <Slider
                        id="fontSize"
                        min={0}
                        max={FONT_SIZES.length - 1}
                        step={1}
                        value={[fontSizeIndex]}
                        onValueChange={(values) => setFontSizeIndex(values[0])}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="iconSelector" className="mb-2 block font-medium text-gray-800">Icon</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-between border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                            id="iconSelector"
                          >
                            <div className="flex items-center gap-2">
                              <span>{selectedIcon}</span>
                            </div>
                            <LucideIcons.ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-3">
                          <ScrollArea className="h-[300px] pr-3">
                            <div className="grid grid-cols-4 gap-2">
                              {POPULAR_ICONS.map((icon) => (
                                <Button
                                  key={icon.name}
                                  variant="outline"
                                  className={`h-10 p-2 justify-center relative ${
                                    selectedIcon === icon.name 
                                      ? "border-primary ring-2 ring-primary/20" 
                                      : ""
                                  }`}
                                  onClick={() => setSelectedIcon(icon.name)}
                                >
                                  <div className="flex flex-col items-center text-center gap-1">
                                    {icon.component ? (
                                      <icon.component size={20} />
                                    ) : (
                                      <span>None</span>
                                    )}
                                  </div>
                                  {selectedIcon === icon.name && (
                                    <div className="absolute top-1 right-1">
                                      <Check className="h-3 w-3 text-primary" />
                                    </div>
                                  )}
                                </Button>
                              ))}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {selectedIcon !== "None" && (
                      <div>
                        <Label htmlFor="iconPosition" className="mb-2 block font-medium text-gray-800">Icon Position</Label>
                        <Select
                          value={iconPosition}
                          onValueChange={setIconPosition}
                        >
                          <SelectTrigger id="iconPosition" className="w-full border-gray-300 focus:ring-purple-500 focus:border-purple-500">
                            <SelectValue placeholder="Select icon position" />
                          </SelectTrigger>
                          <SelectContent>
                            {ICON_POSITIONS.map((position) => (
                              <SelectItem key={position.value} value={position.value}>
                                {position.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <QrCodeInfo
                      location={location}
                      theme={theme}
                      paletteName={themePalette.name}
                      textPosition={textPosition}
                      fontSizeClass={FONT_SIZES[fontSizeIndex]?.class.replace("text-", "")}
                      icon={selectedIcon}
                      iconPosition={iconPosition}
                      text={text}
                      className="mt-4 bg-purple-50 border border-purple-200"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between p-6">
              <Button 
                variant="outline" 
                onClick={goBack}
                className="bg-white hover:bg-gray-100 transition-colors"
              >
                <LucideIcons.ArrowLeft className="w-4 h-4 mr-2" /> Go Back
              </Button>
              <Button 
                onClick={goToSharePage} 
                disabled={!qrCodeDataURL}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all duration-300 transform hover:scale-[1.02]"
              >
                Continue to Share <LucideIcons.ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          {/* QR Code Preview Card */}
          <Card className="w-full lg:w-1/2 bg-white/95 backdrop-blur shadow-xl border-0 transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="text-xl font-bold">QR Code Preview</CardTitle>
              <CardDescription className="text-white/90">
                See how your QR code will look with your current settings.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex flex-col items-center p-6">
              {!qrCodeDataURL ? (
                <div className="flex items-center justify-center w-full h-[400px]">
                  <div className="text-center text-gray-500">
                    <LucideIcons.ImageOff className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>QR code preview will appear here</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full p-6 bg-white rounded-lg shadow-inner border border-gray-100 transform transition-all duration-500 hover:rotate-0">
                  <div className="border-2 border-gray-200 p-6 rounded-lg relative mb-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                    {textPosition === "top" && (
                      <div className={`text-center mb-3 ${getFontSizeClass()}`} style={{ color: themePalette.dark }}>
                        {text && text.split('\n').map((line, i) => (
                          <p key={i} className="font-medium">{line}</p>
                        ))}
                      </div>
                    )}
                    
                    {(textPosition === "left" || textPosition === "right") ? (
                      renderText()
                    ) : (
                      <>
                        <div className="relative">
                          <img 
                            src={qrCodeDataURL} 
                            alt="Generated QR Code" 
                            className="w-[250px] h-[250px] object-contain"
                          />
                          {selectedIcon !== "None" && renderIcon()}
                        </div>
                        
                        {textPosition === "bottom" && (
                          <div className={`text-center mt-3 ${getFontSizeClass()}`} style={{ color: themePalette.dark }}>
                            {text && text.split('\n').map((line, i) => (
                              <p key={i} className="font-medium">{line}</p>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Remove the download and print buttons section */}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Continue with rest of file */}
        </div>
      </div>
    </div>
  );
}