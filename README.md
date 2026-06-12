# Flappy Bird Enhanced 🐦

An enhanced version of the classic Flappy Bird game with modern features including fullscreen support, multiple difficulty levels, new enemies, and an upgrade system.

## Features ✨

### 🎮 Fullscreen Support
- Toggle fullscreen mode with the button in the header
- Immersive gaming experience
- Works on all modern browsers

### 📊 Multiple Difficulty Levels

1. **Easy** - Classic gameplay with basic pipes
   - Speed: 4px/frame
   - Pipe Gap: 130px
   - Max Enemies: 1 (pipes only)

2. **Medium** - Faster obstacles and tighter gaps
   - Speed: 6px/frame
   - Pipe Gap: 100px
   - Max Enemies: 2 (pipes, lasers)

3. **Hard** - Moving lasers and complex enemies
   - Speed: 8px/frame
   - Pipe Gap: 80px
   - Max Enemies: 3 (pipes, lasers, spheres)

4. **Insane** - Everything at maximum speed and difficulty
   - Speed: 10px/frame
   - Pipe Gap: 60px
   - Max Enemies: 4 (all types)

### 👾 Enemy Types

- **Pipes** - Traditional obstacles to avoid
- **Lasers** - Moving energy beams that change direction
- **Spheres** - Bouncing obstacles with physics

### 🎁 Power-ups & Upgrades

**In-Game Power-ups:**
- 🛡️ **Shield** - Absorbs one hit, collect for free during gameplay
- ⚡ **Speed Boost** - Fly faster for 5 seconds
- 🐢 **Slow Motion** - Slow down all obstacles by 50%

**Upgrade Shop:**
- Purchase permanent upgrades with currency earned during gameplay
- Shield: 50 points
- Speed Boost: 75 points
- Slow Motion: 100 points

### 💾 Persistent Data
- High scores saved locally
- Upgrade currency saved between sessions
- Progress tracked automatically

## How to Play 🎯

### Controls
- **Click** or **Space Bar** - Make the bird fly
- **Fullscreen Button** - Toggle fullscreen mode
- **Help Button** - View game instructions
- **Mute Button** - Toggle sound on/off

### Scoring
- Avoid pipes and enemies to survive
- Pass through pipe gaps to earn points
- Collect power-ups for bonus points (+50)
- Earn upgrade currency while playing (+10 per power-up)

### Tips & Tricks
- Higher difficulty levels earn more points
- Shield power-ups are crucial for hard modes
- Use Slow Motion for tight situations
- Speed Boost helps you navigate quickly
- Build up upgrade currency in Easy mode first

## Game Mechanics 🔧

### Physics
- Gravity system affects bird movement
- Velocity-based falling and flapping
- Collision detection with all obstacles

### Difficulty Scaling
- Each level increases game speed progressively
- Pipe gaps become tighter at higher difficulties
- More enemies spawn simultaneously
- Different enemy types appear based on difficulty

### Enemy AI
- Lasers move horizontally and change direction
- Spheres bounce realistically with gravity
- All enemies slow down with Slow Motion upgrade

## Technical Details 🛠️

### Files
- `index.html` - Game structure and markup
- `styles.css` - All styling and animations
- `game.js` - Complete game logic

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with fullscreen support

### Performance
- 60 FPS gameplay
- Optimized rendering with DOM manipulation
- LocalStorage for data persistence

## Customization 🎨

### Modify Game Configuration
Edit `GAME_CONFIG` in `game.js` to change:
- Pipe speed and gap size
- Spawn rates for obstacles
- Gravity and physics values
- Points per level

### Adjust Difficulty
- Change `pipeGap` for tighter/looser gaps
- Modify `pipeSpeed` for faster/slower gameplay
- Adjust `spawnRate` for more/fewer obstacles

### Add New Enemies
- Define new enemy types in `GAME_CONFIG`
- Add update logic in `updateEnemies()`
- Create CSS styling for the enemy
- Add rendering in `render()`

## Statistics 📈

Track your performance:
- Final Score - Points earned in current game
- Level Reached - Difficulty completed
- High Score - Best score achieved
- Upgrades Collected - Power-ups gathered
- Currency Earned - Total upgrade points

## Future Enhancements 🚀

Potential additions:
- Sound effects and background music
- Leaderboard system
- Achievement badges
- Additional enemy types
- Boss levels
- Multiplayer modes
- Touch controls optimization
- More power-up types

## Credits 🙏

Enhanced version of the classic Flappy Bird game.
Original concept by Dong Nguyen.

## License 📝

Open source - feel free to modify and improve!

---

Enjoy the game! 🎮✨
