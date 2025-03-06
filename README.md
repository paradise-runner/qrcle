# QR<span style="color: #F9D923;">cle</span> - Modern QR Code Generator

A elegant, user-friendly QR code generator web application built with Next.js and React.

![QRcle Logo](/public/qrcle.png)

## 🌟 Features

- **Beautiful QR Codes**: Generate visually appealing QR codes with customizable themes
- **Privacy First**: All processing happens client-side - your data stays on your device
- **Instant Generation**: Create QR codes in seconds
- **Multiple Themes**: Choose from modern, pastel, and cartoony visual styles
- **Easily Shareable**: Download and share your QR codes with anyone
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Bun](https://bun.sh/) (recommended) or npm/yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/qrcle.git
   cd qrcle
   ```

2. Install dependencies
   ```bash
   bun install
   # or
   npm install
   ```

3. Start the development server
   ```bash
   bun dev
   # or
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💻 Usage

1. Enter the URL, text, or information you want to encode in your QR code
2. Select your preferred visual theme
3. Add optional text content
4. Click "Generate QR Code"
5. View, download, or share your custom QR code

## ⚙️ Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - UI component system
- [Zod](https://github.com/colinhacks/zod) - TypeScript-first schema validation
- [React Hook Form](https://react-hook-form.com/) - Form handling

## 🔐 Privacy

QRcle takes privacy seriously:
- No data is stored on servers
- All QR code generation happens client-side
- No tracking or analytics
- No external API calls for core functionality

## 🏗️ Project Structure

```
qrcle/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js app directory
│   │   ├── page.tsx     # Home page
│   │   ├── preview/     # QR code preview page
│   │   └── share/       # QR code share page
│   ├── components/      # React components
│   │   └── qr-code/     # QR code related components
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions
└── ...
```

## 📱 Deployment

The site is built to be deployed on Cloudflare Pages:

```bash
bun run build
```

## 📄 License

[MIT License](LICENSE)

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request