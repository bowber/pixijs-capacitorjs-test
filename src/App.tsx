import { useEffect, useRef } from 'react'
import { Application, Assets, Container, Graphics, Sprite, Spritesheet, Texture } from 'pixi.js';
import { simpleSpaceKenney } from './resources/simplespace-kenney';
import { useInput } from './contexts/input';
// Load and cache the texture
await Assets.load(simpleSpaceKenney.meta.image);

function App() {
  const app = useRef(new Application());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  console.debug("Texture:", Texture.from(simpleSpaceKenney.meta.image));
  const spritesheet = useRef(new Spritesheet(
    Texture.from(simpleSpaceKenney.meta.image),
    simpleSpaceKenney
  ));
  const { control } = useInput()

  // Start Up PixiJS
  useEffect(() => {
    console.debug('Starting PixiJS');
    const init = async () => {
      if (!canvasRef.current) return;
      if (app.current.renderer) return;
      await app.current.init({ background: '#1099bb', resizeTo: window, canvas: canvasRef.current });

      // Generate all the Textures asynchronously
      console.debug('Loading spritesheet:', spritesheet.current);
      await spritesheet.current.parse();
      console.debug('Spritesheet loaded:', spritesheet.current);

      // Add a Camera Container to the stage ===================================
      // Create a graphics object to define our mask
      const mask = new Graphics()
        // Add the rectangular area to show
        .rect(0, 0, 200, 200)
        .fill(0xffffff);

      const camera = new Container();
      // Set the mask to use our graphics object from above
      camera.mask = mask;
      // Add the mask as a child, so that the mask is positioned relative to its parent
      camera.addChild(mask);
      // Offset by the window's frame width
      camera.position.set(0, 0);
      // And add the container to the window!

      // Add a Sprite to the Container
      const sprite = new Sprite(spritesheet.current.textures.ship_A);
      sprite.anchor.set(0.5);
      sprite.position.set(100, 100);
      camera.addChild(sprite);
      // Add the camera to the stage
      app.current.stage.addChild(camera);
      // End Camera Container ================================================

      let elapsed = 0;
      app.current.ticker.add((ticker) => {
        // Update the player's y coordinate to scroll it
        elapsed += ticker.deltaTime;
        // camera.y = 10 + -100.0 + Math.cos(elapsed / 50.0) * 100.0;
        sprite.x += control.current.x * 1;
        sprite.y += control.current.y * 1;
        console.debug('Camera:', camera.position);
        console.debug('Sprite:', sprite.position);
      });

    }
    init();
  }, [canvasRef.current]);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  )
}

export default App
