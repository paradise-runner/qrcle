import React from "react";

interface QrCodeInfoProps {
  location: string | null;
  theme: string | null;
  paletteName: string;
  textPosition: string;
  fontSizeClass: string;
  icon: string;
  iconPosition: string;
  text: string | null;
}

export default function QrCodeInfo({
  location,
  theme,
  paletteName,
  textPosition,
  fontSizeClass,
  icon,
  iconPosition,
  text,
}: QrCodeInfoProps) {
  return (
    <div className="w-full bg-white/95 backdrop-blur rounded-lg p-4">
      <h3 className="text-xl font-bold mb-4">QR Code Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Location", value: location },
          { label: "Theme", value: theme },
          { label: "Palette", value: paletteName },
          { label: "Text Position", value: textPosition },
          { label: "Font Size", value: fontSizeClass },
          { label: "Icon", value: icon },
          ...(icon !== "None" ? [{ label: "Icon Position", value: iconPosition }] : []),
        ].map((item) => (
          <div
            key={item.label}
            className="p-2 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors duration-300"
          >
            <p className="text-sm font-semibold text-purple-700 mb-1">{item.label}</p>
            <p className="text-sm text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-lg bg-gradient-to-br from-orange-50 to-pink-50">
        <p className="text-sm font-semibold text-purple-700 mb-1">Text Content</p>
        <p className="text-sm text-gray-800 break-words">
          {text && text.length > 50 ? `${text.substring(0, 50)}...` : text}
        </p>
      </div>
    </div>
  );
}
