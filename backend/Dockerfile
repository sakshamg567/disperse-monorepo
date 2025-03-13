# Use a lightweight Node.js image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install required dependencies (Python, pip, curl, ffmpeg, yt-dlp)
RUN apt update && apt install -y python3 python3-pip curl ffmpeg && \
   curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
   chmod a+rx /usr/local/bin/yt-dlp

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install --omit=dev

# Copy the entire project
COPY . .

# Expose the app port (same as in index.js)
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
