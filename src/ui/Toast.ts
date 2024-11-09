import { Container } from './Container';
import { ToastConfig } from '../types';
import { BaseScene } from "../game";
import { Label } from './Label';
import Utils from '../utils';

const DefaultTextStyle = {
  fontFamily: 'Arial',
  fontSize: '18px',
  color: '#000000',
};

export class Toast extends Container<ToastConfig> {
  protected _config: ToastConfig;
  private label?: Label;
  private tween?: Phaser.Tweens.Tween;
  private autoHideTimer?: Phaser.Time.TimerEvent;

  constructor(scene: BaseScene, config: ToastConfig) {
    super(scene, config);
    this._config = config;
    this.Type = 'Toast';

    this.reDraw();
    this.setVisible(false);
    this.setAlpha(0);
  }

  reDraw() {
    const width = this._config.width ?? 300;
    const height = this._config.height ?? 80;
    const alignX = this._config.alignment?.horizontal ?? 'right';
    const alignY = this._config.alignment?.vertical ?? 'top';
    const type = this._config.type ?? 'info';
    const marginAll = this._config.margin?.all;
    const marginLeft = marginAll ?? (this._config.margin?.x ?? 0);
    const marginRight = marginAll ?? (this._config.margin?.x ?? 0);
    const marginTop = marginAll ?? (this._config.margin?.y ?? 0);
    const marginBottom = marginAll ?? (this._config.margin?.y ?? 0);

    if (alignX === 'left') {
      this._config.x = marginLeft;
    } else if (alignX === 'center') {
      this._config.x = (this.scene.scale.width - width) / 2;
    } else if (alignX === 'right') {
      this._config.x = this.scene.scale.width - width - marginRight;
    }

    if (alignY === 'top') {
      this._config.y = marginTop;
    } else if (alignY === 'middle') {
      this._config.y = (this.scene.scale.height - height) / 2;
    } else if (alignY === 'bottom') {
      this._config.y = this.scene.scale.height - height - marginBottom;
    }

    const style = this.getStyleByType(type);
    const color = Utils.numberToHex(style.color);
    this._config.textStyle = Utils.MergeRight(this._config.textStyle ?? DefaultTextStyle, { color: color });
    this._config.textAlign = this._config.textAlign ?? 'center';

    if (!this.label) {
      this.label = new Label(this.scene, {
        ...this._config,
        ...style,
        borderColor: style.borderColor,
        backgroundColor: style.backgroundColor
      });
    } else {
      this.label.reDraw({
        ...this._config,
        ...style,
        borderColor: style.borderColor,
        backgroundColor: style.backgroundColor
      });
    }

    this.label.setPosition(0, 0);
    this.addChildAt(this.label, 0);
    this.setPosition(this._config.x, this._config.y);
  }

  private getStyleByType(type: string) {
    switch (type) {
      case 'success':
        return { backgroundColor: 0x008B00, color: 0xffffff, borderColor: 0xc3e6cb };
      case 'warn':
        return { backgroundColor: 0xFF8C00, color: 0xffffff, borderColor: 0xffeeba };
      case 'error':
        return { backgroundColor: 0xCD3333, color: 0xffffff, borderColor: 0xf5c6cb };
      case 'info':
      default:
        return { backgroundColor: 0x009ACD, color: 0xffffff, borderColor: 0xbee5eb };
    }
  }

  public show(animationType?: string) {
    const animation = animationType || this._config.animationType || 'fade';
    this.setVisible(true);
    if (this.tween) {
      this.tween.stop();
    }

    switch (animation) {
      case 'fade':
        this.tween = this.scene.tweens.add({
          targets: this,
          alpha: 1,
          duration: 300,
          ease: 'Power2'
        });
        break;
      case 'slide':
      case 'slideDown':
        this.setY(this.y - 50);
        this.tween = this.scene.tweens.add({
          targets: this,
          y: '+=50',
          alpha: 1,
          duration: 300,
          ease: 'Back.easeOut'
        });
        break;
      case 'scale':
        this.setScale(0);
        this.tween = this.scene.tweens.add({
          targets: this,
          scaleX: 1,
          scaleY: 1,
          alpha: 1,
          duration: 300,
          ease: 'Back.easeOut'
        });
        break;
      case 'bounce':
        this.setY(this.y - 20);
        this.tween = this.scene.tweens.add({
          targets: this,
          y: '+=20',
          alpha: 1,
          duration: 800,
          ease: 'Bounce.easeOut'
        });
        break;
    }

    // 设置自动隐藏计时器
    if (this._config.duration && this._config.duration > 0) {
      this.autoHideTimer = this.scene.time.delayedCall(this._config.duration, () => {
        this.hide(animation);
      });
    }
  }

  public hide(animationType?: string) {
    const animation = animationType || this._config.animationType || 'fade';
    if (this.tween) {
      this.tween.stop();
    }

    // 清除自动隐藏计时器
    if (this.autoHideTimer) {
      this.autoHideTimer.remove();
      this.autoHideTimer = undefined;
    }

    switch (animation) {
      case 'fade':
        this.tween = this.scene.tweens.add({
          targets: this,
          alpha: 0,
          duration: 300,
          ease: 'Power2',
          onComplete: () => {
            this.setVisible(false);
          }
        });
        break;
      case 'slide':
      case 'slideUp':
        this.tween = this.scene.tweens.add({
          targets: this,
          y: '-=50',
          alpha: 0,
          duration: 300,
          ease: 'Back.easeIn',
          onComplete: () => {
            this.setVisible(false);
            this.setY(this.y + 50);
          }
        });
        break;
      case 'scale':
        this.tween = this.scene.tweens.add({
          targets: this,
          scaleX: 0,
          scaleY: 0,
          alpha: 0,
          duration: 300,
          ease: 'Back.easeIn',
          onComplete: () => {
            this.setVisible(false);
            this.setScale(1);
          }
        });
        break;
      case 'bounce':
        this.tween = this.scene.tweens.add({
          targets: this,
          y: '-=20',
          alpha: 0,
          duration: 800,
          ease: 'Bounce.easeIn',
          onComplete: () => {
            this.setVisible(false);
            this.setY(this.y + 20);
          }
        });
        break;
    }
  }

  public close(animationType?: string) {
    const animation = animationType || this._config.animationType || 'fade';
    this.hide(animation);
    this.scene.time.delayedCall(300, () => {
      this.destroy(true);
    });
  }

  destroy(fromScene?: boolean): void {
    if (this.tween) {
      this.tween.stop();
      this.tween = undefined;
    }
    if (this.autoHideTimer) {
      this.autoHideTimer.remove();
      this.autoHideTimer = undefined;
    }
    this.label?.destroy(fromScene);
    super.destroy(fromScene);
  }
}
