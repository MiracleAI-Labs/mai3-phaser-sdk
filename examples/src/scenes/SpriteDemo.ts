import { BaseScene, Sprite } from '../../../dist';
import { SpriteConfig, SpriteAnimConfig } from '../../../dist/types';

export class SpriteDemo extends BaseScene {
  // private catGrid!: Grid;
  constructor() {
    super("SpriteDemo");
  }

  preload() {
    super.preload();

    this.load.image("cat0", "/assets/images/cat0.png");
    this.load.image("cat1", "/assets/images/cat1.png");
    this.load.spritesheet("fight96", "/assets/sprites/fight96.png", { frameWidth: 32, frameHeight: 50 });

  }

  create() {
    this.createSprite();
    this.createAnimsSprite();
    this.createReturnButton();
    const sm = new SpriteMove(this, { x: 100, y: 600, width: 600, height: 400 }, {
      animalSprites: [
        {
          width: 64,
          height: 100,
          key: "cat0",
          animConfigs: [
            {
              key: "walk",
              keys: ["cat0", "cat1"],
              frameRate: 10,
              repeat: -1,
            },
          ]
        },
        {
          width: 64,
          height: 100,
          key: "cat0",
          animConfigs: [
            {
              key: "walk",
              keys: ["cat0", "cat1"],
              frameRate: 10,
              repeat: -1,
            },
          ]
        }
      ],
      // characterSprites: [{
      //   x: 200,
      //   y: 100,
      //   width: 64,
      //   height: 100,
      //   key: "fight96",
      //   animConfigs: [
      //     {
      //       key: "fight",
      //       frameKey: "fight96",
      //       frames: [0, 1, 2],
      //       frameRate: 10,
      //       repeat: -1,
      //     },
      //   ]
      // }]
    })

    this.time.delayedCall(5000, () => {
      sm.destroy();
    });
  }
  private createSprite() {

    this.mai3.add.sprite({
      x: 100,
      y: 100,
      width: 64,
      height: 100,
      key: "fight96",
      frame: 0,
    });

    this.anims.create({
      key: "fight",
      frames: this.anims.generateFrameNumbers("fight96", { frames: [0, 1, 2] }),
      frameRate: 10,
      repeat: -1,
    });

    this.mai3.add.sprite({
      x: 200,
      y: 100,
      width: 64,
      height: 100,
      key: "fight96",
      anims: "fight",
      enableSmoothScaleAnim: true,
    });
  }

  private createAnimsSprite() {
    const sprite = this.mai3.add.sprite({
      x: 200,
      y: 200,
      width: 64,
      height: 100,
      key: "cat0",
      animConfigs: [
        {
          key: "walk",
          keys: ["cat0", "cat1"],
          frameRate: 10,
          repeat: -1,
        },
      ],
      enableSmoothScaleAnim: true,
    });
    //play walk
    sprite.play("walk");

    const cat = this.mai3.add.sprite({
      x: 100,
      y: 200,
      width: 64,
      height: 100,
      key: "cat0",
    });
    cat.play("walk");
  }

  // private createRandomSprite() {

  //   const moveArea = {
  //     x: 100,
  //     y: 600,
  //     width: 600,
  //     height: 400
  //   };

  //   const spriteArry: Phaser.GameObjects.GameObject[] = [];
  //   for (let i = 0; i < 12; i++) {
  //     const randomX = Phaser.Math.Between(moveArea.x, moveArea.x + moveArea.width);
  //     const randomY = Phaser.Math.Between(moveArea.y, moveArea.y + moveArea.height);
  //     const sprite = this.mai3.make.sprite({
  //       x: randomX,
  //       y: randomY,
  //       width: 64,
  //       height: 100,
  //       key: "cat0",
  //       animConfigs: [
  //         {
  //           key: "walk",
  //           keys: ["cat0", "cat1"],
  //           frameRate: 10,
  //           repeat: -1,
  //         },
  //       ]
  //     });
  //     this.add.existing(sprite);
  //     spriteArry.push(sprite);
  //   }
  //   this.spriteGroup = this.add.group(spriteArry);
  //   this.moveSpriteGroup(moveArea)
  // }

  // private moveSpriteGroup(area: { x: number, y: number, width: number, height: number }) {
  //   this.completedSpritesCount = 0
  //   this.spriteGroup?.children.entries.forEach((sprite: any) => {
  //     const initialDelay = Phaser.Math.Between(0, 2000);
  //     this.time.delayedCall(initialDelay, () => {
  //       this.moveRandomlyInArea(sprite, area);
  //     });
  //   });
  // }

  // private moveRandomlyInArea(sprite: any, area: { x: number, y: number, width: number, height: number }) {
  //   const randomX = Phaser.Math.Between(area.x, area.x + area.width);
  //   const randomY = Phaser.Math.Between(area.y, area.y + area.height);

  //   const moveDuration = Phaser.Math.Between(1500, 2500);
  //   const movingRight = randomX < sprite.x;

  //   this.tweens.add({
  //     targets: sprite,
  //     x: randomX,
  //     y: randomY,
  //     duration: moveDuration,
  //     ease: 'Linear',
  //     onStart: () => {
  //       sprite.play("walk");
  //       // 根据移动方向设置精灵的水平翻转
  //       sprite.setFlipX(!movingRight);
  //     },
  //     onComplete: () => {
  //       this.completedSpritesCount++;
  //       sprite.stop()
  //       if (this.completedSpritesCount === this.spriteGroup?.children.entries.length) {
  //         this.moveSpriteY(area)
  //       }
  //     }
  //   });
  // }

  // private moveSpriteY(area: { x: number, y: number, width: number, height: number }) {
  //   let currentIndex = 0;
  //   const sprites = this.spriteGroup?.children.entries;
  //   const animateNextSprite = () => {
  //     if (currentIndex < sprites!.length) {
  //       const sprite = sprites![currentIndex] as Sprite;
  //       let originalY = sprite.y;
  //       const people = this.mai3.add.sprite({
  //         x: 200,
  //         y: 100,
  //         width: 64,
  //         height: 100,
  //         key: "fight96",
  //         anims: "fight",
  //         enableSmoothScaleAnim: true,
  //       });

  //       this.tweens.add({
  //         targets: people,
  //         x: sprite.x - sprite.width,
  //         y: sprite.y,
  //         duration: 3000,
  //         ease: 'Linear',
  //         onComplete: () => {
  //           this.tweens.add({
  //             targets: sprite,
  //             x: sprite.x,
  //             y: sprite.y - 50,
  //             duration: 1000,
  //             ease: 'Linear',
  //             onComplete: () => {
  //               sprite.setPosition(sprite.x, originalY);
  //               this.tweens.add({
  //                 targets: people,
  //                 x: 200,
  //                 y: 100,
  //                 duration: 3000,
  //                 ease: 'Linear',
  //                 onComplete: () => {
  //                   currentIndex++;
  //                   animateNextSprite();
  //                 }
  //               });
  //             }
  //           });
  //         }
  //       });
  //       // this.time.delayedCall(3000, () => {
  //       //   this.tweens.add({
  //       //     targets: sprite,
  //       //     x: sprite.x,
  //       //     y: sprite.y - 50,
  //       //     duration: 1000,
  //       //     ease: 'Linear',
  //       //     onComplete: () => {
  //       //       sprite.setPosition(sprite.x, originalY);
  //       //       currentIndex++;
  //       //       animateNextSprite();
  //       //     }
  //       //   });
  //       // });
  //     } else {
  //       this.time.delayedCall(3000, () => {
  //         this.completedSpritesCount = 0;
  //         this.moveSpriteGroup(area)
  //       });
  //     }
  //   };
  //   animateNextSprite();
  // }

  private createReturnButton() {
    this.mai3.add.textButton({
      x: 10,
      y: 30,
      width: 150,
      height: 50,
      text: "Return",
      backgroundColor: 0x4CAF50,
      borderColor: 0x45A049,
      borderWidth: 2,
      radius: 10,
      textStyle: {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#FFFFFF',
      },
      handleUp: {
        handleFn: () => {
          this.scene.start('DemoScene');
        }
      },
    });
  }

  update() {
  }

}

class SpriteMove {
  private createdAnimKeys: string[] = [];
  private tweens: Phaser.Tweens.Tween[] = [];
  spriteData?: SpriteData
  spriteGroup?: Phaser.GameObjects.Group
  characterSpritesGroup?: Phaser.GameObjects.Group
  completedSpritesCount: number = 0
  scene?: BaseScene
  spriteAreaConfig?: SpriteAreaConfig

  constructor(scene: BaseScene, spriteAreaConfig: SpriteAreaConfig, spriteData: SpriteData) {
    this.scene = scene
    this.spriteAreaConfig = spriteAreaConfig
    this.spriteData = spriteData
    this.createRandomSprite()
  }
  private createRandomSprite() {
    const animalSpritesArry: Phaser.GameObjects.GameObject[] = [];
    const characterSpritesArry: Phaser.GameObjects.GameObject[] = [];
    const areaX = this.spriteAreaConfig?.x!
    const areaY = this.spriteAreaConfig?.y!
    const areaWidth = this.spriteAreaConfig?.width!
    const areaHeight = this.spriteAreaConfig?.height!

    this.spriteData?.animalSprites?.forEach((iteminfo) => {
      const randomX = Phaser.Math.Between(areaX, areaX + areaWidth);
      const randomY = Phaser.Math.Between(areaY, areaY + areaHeight);
      const sprite = this.scene?.mai3.make.sprite({
        x: randomX,
        y: randomY,
        width: iteminfo.width,
        height: iteminfo.height,
        key: iteminfo.key,
        animConfigs: iteminfo.animConfigs
      });
      this.scene?.add.existing(sprite!);
      animalSpritesArry.push(sprite!);
    });

    this.spriteData?.characterSprites?.forEach((iteminfo) => {
      const animsArry: SpriteAnimConfig[] = []
      iteminfo.animConfigs?.forEach((animinfo) => {
        if (!this.scene?.anims.exists(animinfo.key)) {
          animsArry.push(animinfo)
          this.createdAnimKeys.push(animinfo.key);
        }
      })

      const characterSprite = this.scene?.mai3.make.sprite({
        x: iteminfo.x,
        y: iteminfo.y,
        width: iteminfo.width,
        height: iteminfo.height,
        key: iteminfo.key,
        animConfigs: animsArry
      });


      characterSprite?.setActive(false)
      characterSprite?.setVisible(false)
      this.scene?.add.existing(characterSprite!);

      characterSpritesArry.push(characterSprite!);
    });

    this.spriteGroup = this.scene?.add.group(animalSpritesArry);
    this.characterSpritesGroup = this.scene?.add.group(characterSpritesArry);
    this.moveSpriteGroup(this.spriteAreaConfig!)
  }

  private moveSpriteGroup(area: { x: number, y: number, width: number, height: number }) {
    this.completedSpritesCount = 0
    this.spriteGroup?.children.entries.forEach((sprite: any) => {
      const initialDelay = Phaser.Math.Between(0, 2000);
      this.scene?.time.delayedCall(initialDelay, () => {
        this.moveRandomlyInArea(sprite, area);
      });
    });
  }

  private moveRandomlyInArea(sprite: any, area: { x: number, y: number, width: number, height: number }) {

    const randomX = Phaser.Math.Between(area.x, area.x + area.width);
    const randomY = Phaser.Math.Between(area.y, area.y + area.height);

    const moveDuration = Phaser.Math.Between(1500, 2500);
    const movingRight = randomX < sprite.x;

    this.createTween({
      targets: sprite,
      x: randomX,
      y: randomY,
      duration: moveDuration,
      ease: 'Linear',
      onStart: () => {
        if (sprite._config.animConfigs) {
          sprite.play(sprite._config.animConfigs[0].key);
        }
        // 根据移动方向设置精灵的水平翻转
        sprite.setFlipX(!movingRight);
      },
      onComplete: () => {
        this.completedSpritesCount++;
        sprite.stop()
        if (this.completedSpritesCount === this.spriteGroup?.children.entries.length) {
          this.moveSpriteY(area)
        }
      }
    });
  }

  private moveSpriteY(area: { x: number, y: number, width: number, height: number }) {
    let currentIndex = 0;
    const sprites = this.spriteGroup?.children.entries;

    const animateNextSprite = () => {
      if (currentIndex < sprites!.length) {
        const sprite = sprites![currentIndex] as Sprite;
        let originalY = sprite.y;

        let characterlength = this.characterSpritesGroup?.children.entries.length ?? 0;
        if (characterlength > 0) {
          const characterIndex = Phaser.Math.Between(0, characterlength - 1);
          const characterSprite = this.characterSpritesGroup?.children.entries[characterIndex] as any;
          characterSprite?.setActive(true);
          characterSprite?.setVisible(true);
          characterSprite?.play(characterSprite._config.animConfigs[0].key);

          this.createTween({
            targets: characterSprite,
            x: sprite.x - sprite.width,
            y: sprite.y,
            duration: 3000,
            ease: 'Linear',
            onComplete: () => {
              this.createTween({
                targets: sprite,
                x: sprite.x,
                y: sprite.y - 50,
                duration: 1000,
                ease: 'Linear',
                onComplete: () => {
                  sprite.setPosition(sprite.x, originalY);
                  this.createTween({
                    targets: characterSprite,
                    x: this.spriteData?.characterSprites![characterIndex].x,
                    y: this.spriteData?.characterSprites![characterIndex].y,
                    duration: 3000,
                    ease: 'Linear',
                    onComplete: () => {
                      currentIndex++;
                      animateNextSprite();
                    }
                  });
                }
              });
            }
          });
        } else {
          currentIndex++;
          animateNextSprite();
        }
      } else {
        this.scene?.time.delayedCall(3000, () => {
          this.completedSpritesCount = 0;
          this.moveSpriteGroup(area);
        });
      }
    };

    animateNextSprite();
  }

  private createTween(config: Phaser.Types.Tweens.TweenBuilderConfig): Phaser.Tweens.Tween | undefined {
    const tween = this.scene?.tweens.add(config);
    if (tween) {
      this.tweens.push(tween);
      tween.once('complete', () => {
        const index = this.tweens.indexOf(tween);
        if (index > -1) {
          this.tweens.splice(index, 1);
        }
      });
    }
    return tween;
  }

  public setAnimalSpritesData(spriteData: SpriteData) {
    this.spriteData = spriteData
    const animalSpritesArry: Phaser.GameObjects.GameObject[] = [];
    const areaX = this.spriteAreaConfig?.x!
    const areaY = this.spriteAreaConfig?.y!
    const areaWidth = this.spriteAreaConfig?.width!
    const areaHeight = this.spriteAreaConfig?.height!
    this.spriteData?.animalSprites?.forEach((iteminfo) => {
      const randomX = Phaser.Math.Between(areaX, areaX + areaWidth);
      const randomY = Phaser.Math.Between(areaY, areaY + areaHeight);
      const sprite = this.scene?.mai3.make.sprite({
        x: randomX,
        y: randomY,
        width: iteminfo.width,
        height: iteminfo.height,
        key: iteminfo.key,
        animConfigs: iteminfo.animConfigs
      });
      this.scene?.add.existing(sprite!);
      animalSpritesArry.push(sprite!);
    });
    this.spriteGroup?.clear(true, true)
    this.spriteGroup = this.scene?.add.group(animalSpritesArry);
    this.moveSpriteGroup(this.spriteAreaConfig!)
  }

  public destroy() {
    this.spriteGroup?.clear(true, true);
    this.characterSpritesGroup?.clear(true, true);
    this.tweens.forEach(tween => {
      if (tween.isPlaying()) {
        tween.stop();
      }
    });
    this.createdAnimKeys.forEach(key => {
      this.scene?.anims.remove(key);
    });
    this.tweens = [];
    this.createdAnimKeys = [];
    this.scene = undefined;
    this.spriteAreaConfig = undefined;
    this.spriteData = undefined;
    this.spriteGroup = undefined;
    this.characterSpritesGroup = undefined;
  }
}

interface SpriteAreaConfig {
  x: number
  y: number,
  width: number,
  height: number
}

interface SpriteData {
  animalSprites?: SpriteConfig[]
  characterSprites?: SpriteConfig[]
}