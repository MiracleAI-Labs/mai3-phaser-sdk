import { BaseScene } from "../game";
import { SpriteConfig, SpriteAnimConfig } from '../types';
import Utils from "../utils";
import { BaseButton } from "./BaseButton";

export class Sprite extends BaseButton<SpriteConfig> {
  protected _config: SpriteConfig;
  public directionX: 'left' | 'right' | 'none' = 'none';
  public directionY: 'up' | 'down' | 'none' = 'none';
  public instance?: Phaser.Physics.Arcade.Sprite;
  public group?: Phaser.Physics.Arcade.Group;
  private _useCount: number = 0;
  private _updateListener?: () => void;

  constructor(scene: BaseScene, config: SpriteConfig) {
    super(scene, config, "Sprite");
    this._config = config;

    this.reDraw(config);
    this.setEventInteractive();
    this._config.animConfigs?.forEach((animconfig) => {
      this.createAnimsSprite(animconfig.key, animconfig)
    })
  }

  reDraw(config: SpriteConfig) {
    this._config = config;
    this._config.width = config.width ?? 0;
    this._config.height = config.height ?? 0;
    this._config.leftVelocity = config.leftVelocity ?? 0;
    this._config.rightVelocity = config.rightVelocity ?? 0;
    this._config.upVelocity = config.upVelocity ?? 0;
    this._config.downVelocity = config.downVelocity ?? 0;
    this._config.repeat = config.repeat ?? 0;

    if (this.instance) {
      this.instance.destroy();
      this.instance = undefined;
    }

    this.instance = this.scene.physics.add.sprite(0, 0, this._config.key ?? "", this._config.frame ?? 0);

    if (this._config.isStatic) {
      this.instance?.setImmovable(true);
    }
    if (this._config.isCameraFollow) {
      this.scene.cameras.main.startFollow(this.instance, true);
    }

    this.instance?.setGravityY(this._config.gravity ?? 0);
    this.instance?.setCollideWorldBounds(true);
    this.instance?.setDisplaySize(this._config.width, this._config.height);
    this.instance?.setOrigin(0);
    if (this._config.flipX) {
      this.instance?.setScale(
        -Math.abs(this.instance.scaleX),
        this.instance.scaleY
      );
      this.instance?.setPosition(this._config.width, 0);
    }
    this.addChild(this.instance!);

    this.RefreshBounds();
    this.setDepth(this._config?.depth ?? 1);
    this.setScrollFactor(this._config.isScrollFactor ? 0 : 1);

    if (this._config.isGroup) {
      this.reDrawGroup();
    }

    this.instance.on("animationstart", () => {
      this.resetBody();
    });
    this.instance.on("animationcomplete", () => {
      this.resetBody();
    });
    this.resetBody();
  }

  resetBody() {
    if (this.instance && (this._config?.height ?? 0) < (this.instance?.height* this.instance.scaleY)) {
      if (this.instance.body?.blocked.down) {
        this.setPosition(this._config.x ?? 0, (this._config.y ?? 0) - (this.instance.height * this.instance.scaleY - (this._config?.height ?? 0)));
      }
    }
    this.instance?.body?.setSize(this.instance!.width, this.instance!.height);
    if (this._config.flipX) {
      this.instance?.body?.setOffset(-1 * this.instance!.width, 0);
    }
  }


  reDrawGroup() {
    if (this.group) {
      this.group.destroy();
      this.group = undefined;
    }

    this.group = this.scene.physics.add.group({
      defaultKey: this._config.key ?? "",
      maxSize: this._config.repeat ?? 0
    });
  }

  public createAnimsSprite(animKey: string, config: SpriteAnimConfig) {
    if (this.scene.anims.exists(animKey)) return;
    if (Array.isArray(config.frames)) {
      this.scene.anims.create({
        key: animKey,
        frames: this.scene.anims.generateFrameNumbers(config.frameKey ?? "", { frames: config.frames }),
        frameRate: config.frameRate,
        repeat: config.repeat,
      });
    } else if (Array.isArray(config.keys)) {
      this.scene.anims.create({
        key: animKey,
        frames: config.keys.map((key) => ({ key })),
        frameRate: config.frameRate,
        repeat: config.repeat,
      });
    }
  }

  public play(
    key:
      | string
      | Phaser.Animations.Animation
      | Phaser.Types.Animations.PlayAnimationConfig,
    ignoreIfPlaying?: boolean
  ) {
    this.instance?.play(key, ignoreIfPlaying);
  }

  public getGroupChild(x?: number, y?: number) {
    if (!this._config.isGroup) {
      console.log('not sprite group')
      return;
    }

    if (!this.group) {
      console.log('not group')
      return;
    }

    // Check if exceeded repeat limit
    if (this._config.repeat !== -1 && this._useCount >= this._config.repeat) {
      return;
    }

    let child = this.group?.get();
    this._useCount++;

    if (child) {
      child.setActive(true);
      child.setVisible(true);
      child.body.reset(x, y);
      child.setDisplaySize(this._config.width, this._config.height);

      // Copy animation from instance if it exists
      if (this.instance?.anims.currentAnim) {
        const currentAnim = this.instance.anims.currentAnim;
        child.play(currentAnim.key, {
          frameRate: currentAnim.frameRate,
          repeat: currentAnim.repeat
        });
      }

      // Add update check to recycle when out of bounds
      this.scene.events.on('update', () => {
        if (child.active) {
          const bounds = this.scene?.physics?.world?.bounds;
          if (bounds) {
            if (child.x > bounds.width ||
              child.x < bounds.x ||
              child.y > bounds.height ||
              child.y < bounds.y) {
              child.setActive(false);
              child.setVisible(false);
              child.destroy();
            }
          }
        }
      });

      return child;
    }
    return;
  }

  updatePosition() {
    if (!this.instance) return;
    const { x, y } = Utils.getWorldPosition(this.instance);
    const xOffset = this.config.flipX ? -(this.config.width ?? 0) : 0;  
    const roundedX = Math.round(x + xOffset);
    const roundedY = Math.round(y);
    this.setPosition(roundedX, roundedY);  
    if (this._config.flipX) {
      this.instance?.setPosition(this._config.width, 0);
    } else {
    this.instance?.setPosition(0, 0);
    }
    this.RefreshBounds();
  }

  public moveLeft(velocity?: number) {
    if (this._config.enableMove) {
      if (velocity) this._config.leftVelocity = velocity;
      this.instance?.setVelocityX(-(this._config.leftVelocity ?? 0));
      this.directionX = 'left';
      this.directionY = 'none';
      this.instance?.setDragX(Math.abs((this._config.leftVelocity ?? 0) * 3));
    }
  }

  public moveRight(velocity?: number) {
    if (this._config.enableMove) {
      if (velocity) this._config.rightVelocity = velocity;
      this.instance?.setVelocityX(this._config.rightVelocity ?? 0);
      this.directionX = 'right';
      this.directionY = 'none';
      this.instance?.setDragX(Math.abs((this._config.rightVelocity ?? 0) * 3));
    }
  }

  public moveUpward(velocity?: number) {
    if (this._config.enableMove) {
      if (velocity) this._config.upVelocity = velocity;
      this.instance?.setVelocityY(-(this._config.upVelocity ?? 0));
      this.directionY = 'up';
    }
  }

  public moveDownward(velocity?: number) {
    if (this._config.enableMove) {
      if (velocity) this._config.downVelocity = velocity;
      this.instance?.setVelocityY(this._config.downVelocity ?? 0);
      this.directionY = 'down';
    }
  }

  public stopHorizontal() {
    if (this._config.enableMove) {
      this.instance?.setVelocityX(0);
    }
  }

  public stopVertical() {
    if (this._config.enableMove) {
      this.instance?.setVelocityY(0);
    }
  }

  public setImmovable(immovable: boolean = true): void {
    if (this.instance?.body) {
      this.instance.body.enable = !immovable;
    }
  }

  public setBounce() {
    if (this._config.enableMove) {
      this.instance?.setBounce(this._config.bounce ?? 0);
    }
  }

  public setGravity() {
    this.instance?.setGravityY(this._config.gravity ?? 0);
  }

  public stop() {
    this.instance?.stop();
    this.updatePosition();
  }

  public setFlipX(flip: boolean) {
    this.instance?.setFlipX(flip);
  }

  public getData(key: string | string[]): any {
    return this.instance?.getData(key)
  }

  public setData<T extends any>(key: (string | T), data?: any): this {
    this.instance?.setData(key, data)
    return this
  }

  destroy(fromScene?: boolean) {

    // if (this.group) {
    //   this.group.clear(true, true);
    //   this.group.destroy(true);
    //   this.group = undefined;
    // }

    if (this.instance) {
      if (this.instance.body) {
        this.instance.body.enable = false;
      }
      this.instance.destroy();
      this.instance = undefined;
    }

    super.destroy(fromScene);
  }
}
