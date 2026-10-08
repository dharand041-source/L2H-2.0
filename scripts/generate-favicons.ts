import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'apps', 'web', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate SVG Favicon
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" fill="#FF4F17" rx="8" />
  <rect x="2" y="2" width="60" height="60" fill="none" stroke="#0E0E0E" stroke-width="4" rx="6" />
  <text x="32" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="24" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="-1">L2H</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svg, 'utf8');

// 2. Generate site.webmanifest
const manifest = {
  name: 'Learn-2-Hire 2.0',
  short_name: 'L2H',
  description: 'Career intelligence, adaptive assessment, and verified employment platform',
  start_url: '/',
  display: 'standalone',
  background_color: '#FBF8F2',
  theme_color: '#FF4F17',
  icons: [
    {
      src: '/favicon.svg',
      sizes: 'any',
      type: 'image/svg+xml'
    },
    {
      src: '/favicon.ico',
      sizes: '32x32',
      type: 'image/x-icon'
    }
  ]
};

fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');

// 3. Generate a valid 32x32 BMP-based ICO file
// ICO Header: 6 bytes (idReserved=0, idType=1, idCount=1)
// Directory Entry: 16 bytes (width=32, height=32, colors=0, reserved=0, planes=1, bpp=32, size, offset=22)
// BMP InfoHeader: 40 bytes (biSize=40, biWidth=32, biHeight=64 (includes AND mask), biPlanes=1, biBitCount=32, biCompression=0, biSizeImage, ...)
// Pixel Data: 32x32 pixels * 4 bytes = 4096 bytes (BGRA format)
// AND Mask: 32 rows * 4 bytes (padded) = 128 bytes (0 = opaque)

const width = 32;
const height = 32;
const bpp = 32;
const imageSize = width * height * 4;
const maskRowSize = Math.floor((width + 31) / 32) * 4;
const maskSize = maskRowSize * height;
const bmpHeaderSize = 40;
const totalImageDataSize = bmpHeaderSize + imageSize + maskSize;
const icoHeaderSize = 6;
const dirEntrySize = 16;
const dataOffset = icoHeaderSize + dirEntrySize; // 22

const icoBuffer = Buffer.alloc(dataOffset + totalImageDataSize);

// ICO Header
icoBuffer.writeUInt16LE(0, 0); // reserved
icoBuffer.writeUInt16LE(1, 2); // 1 = icon
icoBuffer.writeUInt16LE(1, 4); // 1 image

// Directory Entry
icoBuffer.writeUInt8(width, 6);
icoBuffer.writeUInt8(height, 7);
icoBuffer.writeUInt8(0, 8); // color count
icoBuffer.writeUInt8(0, 9); // reserved
icoBuffer.writeUInt16LE(1, 10); // color planes
icoBuffer.writeUInt16LE(bpp, 12); // bits per pixel
icoBuffer.writeUInt32LE(totalImageDataSize, 14); // image data size
icoBuffer.writeUInt32LE(dataOffset, 18); // offset

// BMP Info Header
let offset = dataOffset;
icoBuffer.writeUInt32LE(bmpHeaderSize, offset); // biSize
icoBuffer.writeInt32LE(width, offset + 4); // biWidth
icoBuffer.writeInt32LE(height * 2, offset + 8); // biHeight (doubled for XOR + AND)
icoBuffer.writeUInt16LE(1, offset + 12); // biPlanes
icoBuffer.writeUInt16LE(bpp, offset + 14); // biBitCount
icoBuffer.writeUInt32LE(0, offset + 16); // biCompression (BI_RGB)
icoBuffer.writeUInt32LE(imageSize + maskSize, offset + 20); // biSizeImage
icoBuffer.writeInt32LE(0, offset + 24); // biXPelsPerMeter
icoBuffer.writeInt32LE(0, offset + 28); // biYPelsPerMeter
icoBuffer.writeUInt32LE(0, offset + 32); // biClrUsed
icoBuffer.writeUInt32LE(0, offset + 36); // biClrImportant
offset += bmpHeaderSize;

// Draw #FF4F17 (Orange) with #0E0E0E (Black) 2px border and white cross/block
// Brand orange: R=255, G=79, B=23 (#FF4F17) -> In BGRA: B=23 (0x17), G=79 (0x4F), R=255 (0xFF), A=255 (0xFF)
// Border black: R=14, G=14, B=14 (#0E0E0E) -> In BGRA: B=14, G=14, R=14, A=255
// White: R=255, G=255, B=255 -> In BGRA: B=255, G=255, R=255, A=255
// BMP rows are stored bottom-to-top (y = 0 is bottom)
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const pixelOffset = offset + (y * width + x) * 4;
    const isBorder = (x < 2 || x >= width - 2 || y < 2 || y >= height - 2);

    // Draw an 'L' on left (x: 5-11, y: 8-23)
    // Draw '2' in middle (x: 13-19, y: 8-23)
    // Draw 'H' on right (x: 21-27, y: 8-23)
    const isL = (x >= 6 && x <= 8 && y >= 9 && y <= 23) || (x >= 6 && x <= 11 && y >= 9 && y <= 11);
    const isH = (x >= 21 && x <= 23 && y >= 9 && y <= 23) || (x >= 25 && x <= 27 && y >= 9 && y <= 23) || (x >= 21 && x <= 27 && y >= 15 && y <= 17);
    const is2 = (x >= 13 && x <= 19 && y >= 21 && y <= 23) ||
                (x >= 17 && x <= 19 && y >= 16 && y <= 21) ||
                (x >= 13 && x <= 19 && y >= 14 && y <= 16) ||
                (x >= 13 && x <= 15 && y >= 9 && y <= 14) ||
                (x >= 13 && x <= 19 && y >= 9 && y <= 11);

    const isWhite = isL || isH || is2;

    if (isWhite) {
      icoBuffer.writeUInt8(255, pixelOffset);     // B
      icoBuffer.writeUInt8(255, pixelOffset + 1); // G
      icoBuffer.writeUInt8(255, pixelOffset + 2); // R
      icoBuffer.writeUInt8(255, pixelOffset + 3); // A
    } else if (isBorder) {
      icoBuffer.writeUInt8(14, pixelOffset);     // B
      icoBuffer.writeUInt8(14, pixelOffset + 1); // G
      icoBuffer.writeUInt8(14, pixelOffset + 2); // R
      icoBuffer.writeUInt8(255, pixelOffset + 3); // A
    } else {
      icoBuffer.writeUInt8(23, pixelOffset);     // B
      icoBuffer.writeUInt8(79, pixelOffset + 1); // G
      icoBuffer.writeUInt8(255, pixelOffset + 2); // R
      icoBuffer.writeUInt8(255, pixelOffset + 3); // A
    }
  }
}
offset += imageSize;

// AND mask: all 0s (opaque)
icoBuffer.fill(0, offset, offset + maskSize);

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
console.log('Successfully generated favicon.ico (valid 32x32 ICO binary)');
console.log('Successfully generated favicon.svg');
console.log('Successfully generated site.webmanifest');
