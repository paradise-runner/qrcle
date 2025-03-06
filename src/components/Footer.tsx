import React from "react";
import { Github, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="text-center text-white/80 text-sm py-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
      <div>
        QRcle © {new Date().getFullYear()} - Create beautiful QR codes in seconds
      </div>
      <div className="mt-2 flex items-center justify-center gap-3">
        <Button
          variant="link"
          className="text-white/80 hover:text-white p-0 h-auto flex gap-1.5 items-center"
          asChild
        >
          <a
            href="https://github.com/paradise-runner/qrcle"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4" />
            <span>Open source</span>
          </a>
        </Button>
        <span>•</span>
        <Button
          variant="link"
          className="text-white/80 hover:text-white p-0 h-auto flex gap-1.5 items-center"
          asChild
        >
          <a
            href="https://hec.works"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Rocket className="h-4 w-4" />
            <span>Edward Champion</span>
          </a>
        </Button>
      </div>
    </footer>
  );
}
