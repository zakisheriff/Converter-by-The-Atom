FROM node:20-slim

# Install system dependencies for file conversion
RUN apt-get update && apt-get install -y --no-install-recommends \
  ffmpeg \
  libreoffice \
  imagemagick \
  ghostscript \
  pdftk \
  p7zip-full \
  wkhtmltopdf \
  unzip \
  unrar-free \
  python3 \
  python3-pip \
  curl \
  && rm -rf /var/lib/apt/lists/*

# Fix ImageMagick policy to allow common conversions
RUN sed -i 's/<policy domain="coder" rights="none" pattern="PDF"/<policy domain="coder" rights="read|write" pattern="PDF"/' /etc/ImageMagick-6/policy.xml 2>/dev/null || true

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json requirements.txt ./

# Install npm dependencies
RUN npm ci

# Install Python dependencies for AI-powered background/watermark removal
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=7860

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 7860

# Start server
CMD ["npm", "start"]
