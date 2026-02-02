# Sound Files for Microbreak Games

This directory contains sound effects for the microbreak game feedback system.

## Required Files

The following sound files are needed:

### Game Feedback Sounds (3 files)
- `correct.mp3` - Success/correct answer sound
- `wrong.mp3` - Failure/incorrect answer sound
- `click.mp3` - Button click feedback sound

## Sound Usage

### Correct Sound (`correct.mp3`)
- **Used for**: Correct answers, successful matches, right choices
- **Volume levels**: 
  - 0.5 for individual correct answers
  - 0.7 for game completion
- **Purpose**: Positive reinforcement and success feedback

### Wrong Sound (`wrong.mp3`)
- **Used for**: Incorrect answers, wrong matches, errors
- **Volume levels**:
  - 0.5 for incorrect answers
  - 0.2 for partial success (e.g., 70% accuracy)
- **Purpose**: Gentle error feedback without being discouraging

### Click Sound (`click.mp3`)
- **Used for**: All button clicks in games
- **Volume level**: 0.3 (subtle, not distracting)
- **Purpose**: Tactile feedback for all user interactions

## Specifications

- **Format**: MP3
- **File size**: Under 50KB each (ideally 10-30KB)
- **Duration**: Short (0.3-0.5 seconds)
- **Volume**: Normalized, controlled programmatically (0.2-0.7 range)
- **License**: Royalty-free or Creative Commons

## Current Status

✅ **Sound files active** - The system uses 3 MP3 files for all game feedback:
- `correct.mp3` - Success feedback
- `wrong.mp3` - Error feedback
- `click.mp3` - Button click feedback

All game interactions now include audio feedback for enhanced user experience.

## Testing Sounds

To test the sound system:
1. Navigate to a lesson with microbreak games (e.g., lesson 201-1A)
2. Play any game and listen for:
   - **Click sound** on every button press
   - **Correct sound** for right answers
   - **Wrong sound** for incorrect answers
   - **Celebration sound** when completing the game

## Sound Controls

Users can control sound preferences via the microbreak preferences system:
- **soundEnabled**: Toggle all sounds on/off
- **volume**: Master volume control (0.0-1.0)
- **celebrationsEnabled**: Toggle celebration animations

Preferences are stored in localStorage under `microbreak-preferences`.
