"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { getThemeColors, ThemePalette } from "@/lib/theme-utils";
import * as LucideIcons from "lucide-react";
import QrCodeInfo from "@/components/QrCodeInfo";

// Font size mapping (same as in preview page)
const FONT_SIZES = [
  { value: 0, class: "text-xs" },
  { value: 1, class: "text-sm" },
  { value: 2, class: "text-base" },
  { value: 3, class: "text-lg" },
  { value: 4, class: "text-xl" },
  { value: 5, class: "text-2xl" },
];

// Popular Lucide icons for QR codes (same as in preview page)
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
  { name: "Music", component: LucideIcons.Music },
];

// Icon position options (same as in preview page)
const ICON_POSITIONS = [
  { value: "bottom-right", label: "Bottom Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "top-right", label: "Top Right" },
  { value: "top-left", label: "Top Left" },
  { value: "center", label: "Center" },
];

// Loading fallback component
function SharePageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur shadow-xl border-0">
        <div className="text-center p-8 animate-pulse">
          <div className="inline-block p-2 rounded-full bg-purple-100 mb-3">
            <LucideIcons.Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Loading QR Code Share Page</h3>
          <p className="text-gray-500">Please wait while we prepare your sharing options...</p>
        </div>
      </Card>
    </div>
  );
}

function SharePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [canShare, setCanShare] = useState(false);

  // Get parameters from URL
  const location = searchParams.get("location");
  const theme = searchParams.get("theme");
  const text = searchParams.get("text");
  const textPosition = searchParams.get("textPosition") || "top";
  const paletteIndex = searchParams.get("paletteIndex") ? parseInt(searchParams.get("paletteIndex") || "0") : 0;
  const fontSizeIndex = searchParams.get("fontSize") ? parseInt(searchParams.get("fontSize") || "1") : 1;
  const selectedIcon = searchParams.get("icon") || "None";
  const iconPosition = searchParams.get("iconPosition") || "bottom-right";
  const qrCodeDataURL = searchParams.get("qrcode");

  // Get theme colors using the shared utility
  const themePalette: ThemePalette = getThemeColors(theme, paletteIndex);
  
  // Get font size class
  const getFontSizeClass = () => {
    return FONT_SIZES[fontSizeIndex]?.class || "text-sm";
  };

  // Ensure all required parameters exist
  useEffect(() => {
    if (!location || !theme || !text || !qrCodeDataURL) {
      setError("Missing required information. Please go back to start over.");
    }
  }, [location, theme, text, qrCodeDataURL]);

  // Update the title of the page to include palette information
  useEffect(() => {
    if (theme && themePalette) {
      document.title = `QRcle - ${theme} ${themePalette.name} QR Code`;
    }
  }, [theme, themePalette]);

  // Function to capture QR code with text as image
  const captureQRCodeWithText = async () => {
    if (qrContainerRef.current) {
      try {
        const canvas = await html2canvas(qrContainerRef.current);
        const imgData = canvas.toDataURL('image/png');
        setDownloadUrl(imgData);
        return imgData;
      } catch (err) {
        console.error("Error capturing QR code:", err);
        toast.error("Failed to capture QR code with text");
        return null;
      }
    }
    return null;
  };

  // Generate the downloadable image when component mounts
  useEffect(() => {
    if (qrContainerRef.current) {
      captureQRCodeWithText();
    }
  }, [qrCodeDataURL]);

  // Regenerate the image when palette changes
  useEffect(() => {
    if (qrContainerRef.current) {
      captureQRCodeWithText();
    }
  }, [themePalette]);

  // Add this useEffect after other useEffects
  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);

  // Function to download the QR code with text
  const downloadQRCode = async () => {
    let imgToDownload = downloadUrl;
    
    // If we don't have a captured image yet, try to capture it
    if (!imgToDownload) {
      imgToDownload = await captureQRCodeWithText();
    }
    
    if (imgToDownload) {
      // Create a temporary anchor element
      const downloadLink = document.createElement("a");
      downloadLink.href = imgToDownload;
      
      // Set the file name with theme and palette info
      const textPosInfo = textPosition !== "none" ? `-${textPosition}Text` : "";
      downloadLink.download = `qrcode-${theme}-${themePalette.name}${textPosInfo}-${new Date().getTime()}.png`;
      
      // Trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success("QR code download started!");
    } else {
      toast.error("Failed to download. Please try again.");
    }
  };

  // Function to copy the QR code to clipboard (as an image)
  const copyToClipboard = async () => {
    try {
      let imgToCopy = downloadUrl;
      
      // If we don't have a captured image yet, try to capture it
      if (!imgToCopy) {
        imgToCopy = await captureQRCodeWithText();
      }
      
      if (imgToCopy && navigator.clipboard) {
        // Fetch the image data from the data URL
        const response = await fetch(imgToCopy);
        const blob = await response.blob();
        
        // Create a ClipboardItem and write it to clipboard
        const item = new ClipboardItem({ [blob.type] : blob });
        await navigator.clipboard.write([item]);
        
        toast.success("QR code copied to clipboard!");
      } else {
        throw new Error("Clipboard API not supported in this browser");
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy QR code. Try downloading instead.");
    }
  };

  // Function to create a new QR code (preserving all preferences)
  const createNewQRCode = () => {
    const params = new URLSearchParams();
    if (textPosition) params.set("textPosition", textPosition);
    if (paletteIndex !== undefined) params.set("paletteIndex", paletteIndex.toString());
    if (fontSizeIndex !== undefined) params.set("fontSize", fontSizeIndex.toString());
    if (selectedIcon) params.set("icon", selectedIcon);
    if (iconPosition) params.set("iconPosition", iconPosition);
    router.push(`/?${params.toString()}`);
  };

  // Ensure the textPosition and paletteIndex are included in parameters when navigating
  const goBack = () => {
    // Preserve current parameters when going back
    if (textPosition || paletteIndex !== undefined || fontSizeIndex !== undefined) {
      const currentPath = window.location.pathname;
      const referrer = document.referrer;
      
      // Check if we can determine the previous URL
      if (referrer && referrer.includes('/preview')) {
        // Navigate back with parameters
        const params = new URLSearchParams(searchParams);
        router.push(`/preview?${params.toString()}`);
        return;
      }
    }
    
    // Default back behavior if we can't determine the previous URL
    router.back();
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

  // Function to render QR code with text based on position
  const renderQRCodeWithText = () => {
    if (!qrCodeDataURL) return null;
    
    const fontSizeClass = getFontSizeClass();
    
    // Create vertical text content for left/right positioning
    const verticalTextContent = (
      <div className={`flex flex-col justify-center ${fontSizeClass}`} style={{ color: themePalette.dark }}>
        {text && text.split('').map((char, i) => (
          <p key={i} className="font-medium text-center my-0 py-0 leading-tight">
            {char === ' ' ? '\u00A0' : char}
          </p>
        ))}
      </div>
    );
    
    // Normal text content for top/bottom positioning
    const horizontalTextContent = (
      <div className={`text-center ${fontSizeClass}`} style={{ color: themePalette.dark }}>
        {text && text.split('\n').map((line, i) => (
          <p key={i} className="font-medium">{line}</p>
        ))}
      </div>
    );
    
    switch(textPosition) {
      case "left":
        return (
          <div className="flex flex-row items-center">
            <div className="mr-3 self-center" style={{ minWidth: '20px' }}>
              {verticalTextContent}
            </div>
            <div className="relative">
              <img 
                src={qrCodeDataURL} 
                alt="Generated QR Code" 
                className="w-[250px] h-[250px] object-contain"
              />
              {selectedIcon !== "None" && renderIcon()}
            </div>
          </div>
        );
      case "right":
        return (
          <div className="flex flex-row items-center">
            <div className="relative">
              <img 
                src={qrCodeDataURL} 
                alt="Generated QR Code" 
                className="w-[250px] h-[250px] object-contain"
              />
              {selectedIcon !== "None" && renderIcon()}
            </div>
            <div className="ml-3 self-center" style={{ minWidth: '20px' }}>
              {verticalTextContent}
            </div>
          </div>
        );
      case "top":
        return (
          <>
            <div className="text-center mb-3">
              {horizontalTextContent}
            </div>
            <div className="relative">
              <img 
                src={qrCodeDataURL} 
                alt="Generated QR Code" 
                className="w-[250px] h-[250px] object-contain mx-auto"
              />
              {selectedIcon !== "None" && renderIcon()}
            </div>
          </>
        );
      case "bottom":
      default:
        return (
          <>
            <div className="relative">
              <img 
                src={qrCodeDataURL} 
                alt="Generated QR Code" 
                className="w-[250px] h-[250px] object-contain mx-auto"
              />
              {selectedIcon !== "None" && renderIcon()}
            </div>
            <div className="text-center mt-3">
              {horizontalTextContent}
            </div>
          </>
        );
    }
  };

  // Add this function before the return statement
  const shareQRCode = async () => {
    try {
      let imgToShare = downloadUrl;
      
      if (!imgToShare) {
        imgToShare = await captureQRCodeWithText();
      }
      
      if (imgToShare) {
        const blob = await (await fetch(imgToShare)).blob();
        const file = new File([blob], 'qrcode.png', { type: 'image/png' });
        
        if (navigator.share) {
          await navigator.share({
            title: `QRcle - ${theme} ${themePalette.name} QR Code`,
            text: 'Check out my custom QR code created with QRcle!',
            files: [file]
          });
          toast.success('Shared successfully!');
        } else {
          throw new Error('Web Share API not supported');
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.toString().includes('AbortError')) {
          console.log("User aborted share");
          // suppress error message
          return;
        } else {
          console.error('Share error:', err);
        }
      }
      toast.error('Could not open share sheet');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-6 md:py-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 animate-fade-in">
            QR<span className="text-yellow-300">cle</span> Share
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Your QR code is ready! Download, share, and use it anywhere.
          </p>
        </div>
        <Toaster position="top-center" richColors />
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          {/* QR Code Display Card */}
          <Card className="w-full lg:w-1/2 bg-white/95 backdrop-blur shadow-xl border-0 transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="text-xl font-bold">Your QR Code</CardTitle>
              <CardDescription className="text-white/90">
                Here's your ready-to-use QR code with your customizations.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex flex-col items-center justify-center p-6">
              {error ? (
                <div className="text-red-500 text-center p-4 bg-red-50 rounded-md border border-red-200">
                  <LucideIcons.AlertCircle className="h-12 w-12 mx-auto mb-2 text-red-400" />
                  <p className="font-medium">{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/')} 
                    className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Start Over
                  </Button>
                </div>
              ) : !qrCodeDataURL ? (
                <div className="flex items-center justify-center w-full h-[300px]">
                  <div className="text-center p-8 animate-pulse">
                    <div className="inline-block p-2 rounded-full bg-purple-100 mb-3">
                      <LucideIcons.Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                    </div>
                    <p>Loading your QR code...</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <div 
                    ref={qrContainerRef} 
                    className="border-2 border-gray-200 p-6 rounded-lg relative mb-6 bg-white shadow-md hover:shadow-lg transition-shadow transform hover:scale-[1.02] duration-300 max-w-md"
                  >
                    {renderQRCodeWithText()}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-center mt-4 w-full">
                    <Button 
                      onClick={downloadQRCode}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-5 py-2 rounded-lg transition-all duration-300"
                    >
                      <LucideIcons.Download className="w-5 h-5" />
                      <span>Download</span>
                    </Button>
                    
                    <Button 
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white px-5 py-2 rounded-lg transition-all duration-300"
                    >
                      <LucideIcons.Copy className="w-5 h-5" />
                      <span>Copy to Clipboard</span>
                    </Button>
                    {canShare && (
                      <Button 
                        onClick={shareQRCode}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-5 py-2 rounded-lg transition-all duration-300"
                      >
                        <LucideIcons.Share2 className="w-5 h-5" />
                        <span>Share</span>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Information & Options Card */}
          <Card className="w-full lg:w-1/2 bg-white/95 backdrop-blur shadow-xl border-0 transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="text-xl font-bold">QR Code Details</CardTitle>
              <CardDescription className="text-white/90">
                Information about your QR code and options for what to do next.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-6">
                <QrCodeInfo
                  location={location}
                  theme={theme}
                  paletteName={themePalette.name}
                  textPosition={textPosition}
                  fontSizeClass={FONT_SIZES[fontSizeIndex]?.class.replace("text-", "")}
                  icon={selectedIcon}
                  iconPosition={iconPosition}
                  text={text}
                />
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-blue-700 flex items-center gap-2 mb-2">
                    <LucideIcons.HelpCircle className="w-5 h-5" />
                    <span>Tips for Using Your QR Code</span>
                  </h3>
                  <ul className="space-y-3 text-sm text-blue-700/90">
                    <li className="flex items-start gap-2">
                      <LucideIcons.CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Download your QR code as a PNG image file</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <LucideIcons.CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Use in digital marketing materials, websites, or print media</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <LucideIcons.CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>For best scanning results, maintain high contrast and adequate size</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <h3 className="text-lg font-medium text-gray-800">What would you like to do next?</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button 
                      onClick={goBack}
                      variant="outline"
                      className="flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
                    >
                      <LucideIcons.ArrowLeft className="w-4 h-4" />
                      <span>Edit QR Code</span>
                    </Button>
                    
                    <Button 
                      onClick={createNewQRCode}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      <LucideIcons.Plus className="w-4 h-4" />
                      <span>Create New QR Code</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-between">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <LucideIcons.Info className="w-4 h-4" />
                <span>Test your QR code by scanning with your device's camera</span>
              </div>
              
              <Button
                variant="ghost"
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-2"
                onClick={() => window.location.href = "mailto:?subject=Check%20out%20my%20QR%20code&body=I%20created%20a%20custom%20QR%20code%20using%20QRcle!"}
              >
                <LucideIcons.Share2 className="w-5 h-5" />
                <span className="sr-only">Share via email</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<SharePageLoading />}>
      <SharePageContent />
    </Suspense>
  );
}