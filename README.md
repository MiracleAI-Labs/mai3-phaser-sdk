# mai3-phaser-sdk - Phaser 3 UI Components Library

**mai3-phaser-sdk** is a highly customizable and reusable UI component library designed specifically for the **Phaser 3** game engine. With this library, developers can quickly create and integrate essential UI elements like buttons, sliders, dialogs, and more into Phaser-based games, reducing the complexity of UI implementation and allowing more focus on gameplay.

## Key Features

- **Phaser 3 Compatibility**: Fully compatible with Phaser 3.8+.
- **Customizable Components**: Provides out-of-the-box UI components such as buttons, sliders, checkboxes, dialogs, and more.
- **TypeScript Support**: Includes TypeScript types for a better development experience.
- **Flexible Event Handling**: Easy-to-use event handlers for interactions like clicks, hovers, and value changes.
- **Responsive Design**: Adaptable UI elements that work across different screen sizes and game layouts.

## Supported Components

- ✅ Checkbox
- ✅ CheckboxGroup
- ✅ Container
- ✅ Dialog
- ✅ Grid
- ✅ LinearLayout
- ✅ Image
- ✅ ImageButton
- ✅ Label
- ✅ ProgressBar
- ✅ RoundedButton
- ✅ Slider
- ✅ Tabs
- ✅ Text
- ✅ TextBox
- ✅ TextButton
- ✅ Toast
- ✅ VolumeSlider
- ✅ Sprite
- ✅ ListView

## future implementation:

- 🚧 FloatButton
- 🚧 Divider
- 🚧 Flex
- 🚧 Space
- 🚧 Splitter
- 🚧 Dropdown
- 🚧 Menu
- 🚧 Pagination
- 🚧 ColorPicker
- 🚧 Form
- 🚧 InputNumber
- 🚧 Rate
- 🚧 Avatar
- 🚧 Badge
- 🚧 Card
- 🚧 Carousel
- 🚧 Popover
- 🚧 Table
- 🚧 Tooltip
- 🚧 Alert
- 🚧 QRCode
- 🚧 Segmented
- 🚧 Tree


## Installation

Install **mai3-phaser-sdk** via npm or yarn:

```bash
npm install @mai3/phaser-sdk
# or
yarn add @mai3/phaser-sdk
```

## Usage Example

Here’s a quick example of how to create different types of buttons using the **mai3-phaser-sdk** library:

```typescript
import { BaseScene, Mai3Game, Mai3Plugin } from "@mai3/phaser-sdk";

export class ButtonDemo extends BaseScene {

  constructor() {
    super('ButtonDemo');
  }
  
  preload() {
    super.preload();
  }

  create() {
    this.createButtons();
  }

  private createButtons() {
    this.createTextButton();
    this.createDraggableButton();
    this.createRoundedButton();
    this.createImageButton();
  }

  private createTextButton() {
    this.mai3.add.textButton({
      x: 10,
      y: 70,
      width: 200,
      height: 80,
      borderColor: 0x900C3F,
      borderWidth: 3,
      backgroundColor: 0xC70039,
      text: "Close Window",
      radius: 20,
      textStyle: {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#FFFFFF',
      },
      handleHover: {
        audio: "sfx-hover",
      },
      handleDown: {
        audio: "sfx-press",
      },
      handleUp: {
        handleFn: () => {
          // Add action for handleUp if needed
        }
      },
    });
  }

  private createDraggableButton() {
    const btn = this.mai3.add.textButton({
      x: 220,
      y: 70,
      borderColor: 0xFF5733,
      borderWidth: 3,
      backgroundColor: 0xFFC300,
      text: "Mai3 (Draggable)",
      radius: 20,
      textStyle: {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#000000',
      },
      handleHover: {
        audio: "sfx-hover",
      },
      handleDown: {
        audio: "sfx-press",
        handleFn: () => {
          btn.text = "Hello There";
        }
      },
      enableDrag: true
    });
  }

  private createRoundedButton() {
    this.mai3.add.roundedButton({
      x: 430,
      y: 70,
      radius: 100,
      texture: "cangshu",
      borderWidth: 6,
      borderColor: 0xFFD700,
      backgroundColor: 0x32CD32,
      handleHover: {
        audio: "sfx-hover"
      },
      handleDown: {
        audio: "sfx-press",
        handleFn: () => {
          // Add action for handleDown if needed
        }
      },
    });
  }

  private createImageButton() {
    this.mai3.add.imageButton({
      x: 10,
      y: 160,
      width: 160,
      height: 60,
      texture: "StartGameButton",
      borderWidth: 3,
      handleHover: {
        audio: "sfx-hover",
        texture: "StartGameButtonHover",
      },
      handleOut: {
        texture: "StartGameButton",
      },
      handleDown: {
        audio: "sfx-press",
        texture: "StartGameButtonDown",
        handleFn: () => {
          console.log("Button pressed");
        }
      },
      handleUp: {
        texture: "StartGameButton",
        handleFn: () => {
          console.log("Button released");
        }
      },
    });
  }
}

const config = getGameConfig();
const game = Mai3Game.Init(config);
game.scene.add('ButtonDemo', ButtonDemo, true);

//==== config.ts ====
export function getGameConfig() {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#00746b',
    scale: {
      width: 960,
      height: 1280,
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    dom: {
      createContainer: true
    },
    parent: 'root',
    physics: {
      default: 'arcade',
      arcade: {
        debug: true,
        gravity: { x: 0, y: 0 }
      }
    },
  };

  return config;
}
```

This example demonstrates how to integrate different types of buttons, including text, draggable, rounded, and image buttons, all fully customizable through the **mai3-phaser-sdk** library.

## Live Demos

You can explore various **mai3-phaser-sdk** components by following these steps:

```bash
# Clone the repository
git clone https://github.com/miracleAI-Lab/mai3-phaser-sdk

cd mai3-phaser-sdk

yarn install

yarn build

# Navigate to the examples directory
cd examples

yarn install


yarn start
```

## Contribution

We welcome contributions! If you’d like to help improve **mai3-phaser-sdk**, feel free to submit issues or pull requests on our [GitHub repository](https://github.com/miracleAI-Lab/mai3-phaser-sdk).

## License

This project is licensed under the MIT License. For details, check the [LICENSE](https://github.com/miracleAI-Lab/mai3-phaser-sdk/blob/main/LICENSE) file.