const fs = require('fs');
const path = require('path');

// WAV file header creation
function createWavHeader(dataLength, sampleRate, numChannels = 1, bitsPerSample = 16) {
  const header = Buffer.alloc(44);
  
  // "RIFF" chunk descriptor
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataLength, 4);
  header.write('WAVE', 8);
  
  // "fmt " sub-chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size
  header.writeUInt16LE(1, 20); // AudioFormat (PCM)
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * numChannels * bitsPerSample / 8, 28); // ByteRate
  header.writeUInt16LE(numChannels * bitsPerSample / 8, 32); // BlockAlign
  header.writeUInt16LE(bitsPerSample, 34);
  
  // "data" sub-chunk
  header.write('data', 36);
  header.writeUInt32LE(dataLength, 40);
  
  return header;
}

// Generate pleasant bell-like tone with ADSR envelope
function generateTone(frequency, duration, sampleRate = 44100) {
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Int16Array(numSamples);
  const maxAmplitude = 32767 * 0.8; // 80% to avoid clipping
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const progress = i / numSamples;
    
    // ADSR envelope for bell-like sound
    let envelope;
    if (progress < 0.01) {
      // Attack: 1% - quick rise
      envelope = progress / 0.01;
    } else if (progress < 0.3) {
      // Decay: next 29% - smooth fall
      envelope = 1.0 - (progress - 0.01) * 0.3 / 0.29;
    } else {
      // Release: remaining - exponential decay
      envelope = 0.7 * Math.exp(-5 * (progress - 0.3));
    }
    
    // Generate sine wave with envelope
    const value = Math.sin(2 * Math.PI * frequency * t) * maxAmplitude * envelope;
    samples[i] = Math.floor(value);
  }
  
  return Buffer.from(samples.buffer);
}

// Generate buzz/error tone
function generateBuzz(frequency, duration, sampleRate = 44100) {
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Int16Array(numSamples);
  const maxAmplitude = 32767 * 0.5; // Quieter for error sounds
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const progress = i / numSamples;
    
    // Smooth fade in/out
    const envelope = Math.sin(Math.PI * progress);
    
    // Mix of two low frequencies for buzz effect
    const wave1 = Math.sin(2 * Math.PI * frequency * t);
    const wave2 = Math.sin(2 * Math.PI * frequency * 1.5 * t);
    const value = (wave1 + wave2 * 0.5) * maxAmplitude * envelope;
    
    samples[i] = Math.floor(value);
  }
  
  return Buffer.from(samples.buffer);
}

// Main generation function
function generateAllSounds() {
  const outputDir = path.join(__dirname, '..', 'public', 'sounds');
  
  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('🎵 Generating sound files...\n');
  
  // Success sounds - Musical scale (C5 to G6)
  const successFrequencies = [
    { freq: 523, name: 'C5 ding' },
    { freq: 659, name: 'E5 chime' },
    { freq: 784, name: 'G5 bell' },
    { freq: 880, name: 'A5 pluck' },
    { freq: 1047, name: 'C6 sparkle' },
    { freq: 587, name: 'D5 marimba' },
    { freq: 698, name: 'F5 glockenspiel' },
    { freq: 988, name: 'B5 xylophone' },
    { freq: 1319, name: 'E6 chime high' },
    { freq: 1568, name: 'G6 ding high' }
  ];
  
  successFrequencies.forEach((sound, index) => {
    const audioData = generateTone(sound.freq, 0.3);
    const header = createWavHeader(audioData.length, 44100);
    const wavFile = Buffer.concat([header, audioData]);
    const filename = `success${index + 1}.wav`;
    
    fs.writeFileSync(path.join(outputDir, filename), wavFile);
    console.log(`✅ Created ${filename} - ${sound.name} (${sound.freq}Hz)`);
  });
  
  console.log('');
  
  // Failure sounds - Low frequency buzzes
  const failureFrequencies = [
    { freq: 200, name: 'Gentle buzz' },
    { freq: 150, name: 'Soft error tone' },
    { freq: 180, name: 'Low thud' }
  ];
  
  failureFrequencies.forEach((sound, index) => {
    const audioData = generateBuzz(sound.freq, 0.5);
    const header = createWavHeader(audioData.length, 44100);
    const wavFile = Buffer.concat([header, audioData]);
    const filename = `failure${index + 1}.wav`;
    
    fs.writeFileSync(path.join(outputDir, filename), wavFile);
    console.log(`❌ Created ${filename} - ${sound.name} (${sound.freq}Hz)`);
  });
  
  console.log('\n🎉 All sound files generated successfully!');
  console.log(`📁 Location: ${outputDir}`);
}

// Run the generator
generateAllSounds();
