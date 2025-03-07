import { Padding, PhaserTextPadding, RoundedRectRadius } from "../types";
import {Address} from '../common/external';
import { EVMConnector } from "../game/EVMConnetor";

const Horizontal = [0, 'x', 'h', 'horizontal', 'left-to-right'];
const Vertical = [1, 'y', 'v', 'vertical', 'top-to-bottom'];

const Utils = {
  isHorizontal(val: any): boolean {
    return Horizontal.includes(val);
  },
  
  isVertical(val: any): boolean {
    return Vertical.includes(val);
  },

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  hexColorToNumber(color: string) {
    return parseInt(color.replace('#', ''), 16);
  },

  numberToHex(num: number, minLength: number = 2): string {
    let hex = num.toString(16).toLowerCase();
    while (hex.length < minLength) {
      hex = '0' + hex;
    }
    return '#' + hex;
  },

  hexToNumber(hex: string) {
    return parseInt(hex.replace('#', '0x'), 16);
  },

  rawAddressToFriendly(address: string, shorten = false) {
    const result = Address.parseRaw(address).toString();
    if (!shorten) {
      return result;
    }

    return result.substring(0, 4) + '...' + result.substring(result.length - 4);
  },

  smoothScale(
    manager: Phaser.Tweens.TweenManager,
    obj: object | object[],
    scaleValue: number,
    duration: number
  ) {
    manager.add({
      targets: obj,
      scaleX: scaleValue,
      scaleY: scaleValue,
      duration: duration
    });
  },

  drawRoundedRectRenderTexture(scene: Phaser.Scene, x: number = 0, y: number = 0, width: number = 100, height: number = 100, borderWidth: number = 0, radius: RoundedRectRadius = 0, borderColor: number = 0x000000, fillColor: number = 0xffffff, backgroundAlpha: number = 1) {
    // 检查宽高是否有效
    if (width <= 0 || height <= 0) {
      console.error("Width and height must be positive values.");
      return null; // 返回 null 以避免后续调用报错
    }

    let rt = scene.make.renderTexture({ width, height });
    return this.reDrawRoundedRectRenderTexture(scene, rt, x, y, width, height, borderWidth, radius, borderColor, fillColor, backgroundAlpha);
  },

  drawCircleRenderTexture(scene: Phaser.Scene, x: number, y: number, radius: number, borderWidth: number, borderColor: number, fillColor: number) {
    let rt = scene.make.renderTexture({ width: radius * 2, height: radius * 2 });
    return this.reDrawCircleRenderTexture(scene, rt, x, y, radius, borderWidth, borderColor, fillColor);
  },

  reDrawRoundedRectRenderTexture(
    scene: Phaser.Scene,
    rt: Phaser.GameObjects.RenderTexture,
    x: number = 0,
    y: number = 0,
    width: number = 100,
    height: number = 100,
    borderWidth: number = 0,
    radius: RoundedRectRadius = 0,
    borderColor: number = 0x000000,
    fillColor: number = 0xffffff,
    backgroundAlpha: number = 1
  ) {
    // 参数有效性检查
    if (width <= 0 || height <= 0) {
      console.error("Width and height must be positive values.");
      return rt;
    }

    const g = scene && scene.make.graphics();
    this.reDrawRoundedRect(g, scene, x, y, width, height, borderWidth, radius, borderColor, fillColor, backgroundAlpha);
    g.setVisible(false);
  
    // 检查 rt 是否为 undefined
    if (!rt) {
      rt = scene.make.renderTexture({ width, height });
    }
  
    // 销毁之前的RenderTexture对象，确保无内存泄漏
    rt.clear(); // 确保没有遗留的内容
  
    // 渲染Graphics对象到RenderTexture
    rt.draw(g, 0, 0);
    rt.setOrigin(0);
    g.destroy(); // 销毁Graphics对象，避免内存泄漏
  
    return rt;
  },
  
  reDrawCircleRenderTexture(scene: Phaser.Scene, rt: Phaser.GameObjects.RenderTexture, x: number, y: number, _radius: number = 0, borderWidth: number = 0, borderColor: number = 0x000000, fillColor: number = 0xffffff) {
    const radius = _radius ?? 0;
    const width = radius * 2;
    const height = width;
    const g = scene.make.graphics();
    this.reDrawCircle(g, x, y, radius, borderWidth, borderColor, fillColor);
    g.setVisible(false);

    rt.clear();
    rt.beginDraw();
    rt.batchDraw(g, 0, 0);
    rt.endDraw();
    rt.setOrigin(0);
    rt.setDisplaySize(radius * 2, radius * 2);
    g.destroy();
    
    return rt;
  },

  drawRoundedRect(scene: Phaser.Scene, x: number = 0, y: number = 0, width: number = 100, height: number = 100, borderWidth: number = 0, radius: number = 0, borderColor: number = 0x000000, fillColor: number = 0xffffff, backgroundAlpha: number = 1) {
    const g = scene.make.graphics();
    return this.reDrawRoundedRect(g, scene, x, y, width, height, borderWidth, radius, borderColor, fillColor, backgroundAlpha);
  },

  drawCircle(scene: Phaser.Scene, x: number, y: number, radius: number, borderWidth: number, borderColor: number, fillColor: number) {
    const g = scene.make.graphics();
    this.reDrawCircle(g, x, y, radius, borderWidth, borderColor, fillColor);
    return g;
  },

  reDrawCircle(g: Phaser.GameObjects.Graphics, x: number = 0, y: number = 0, radius: number = 0, borderWidth: number = 0, borderColor: number = 0x000000, fillColor: number = 0xffffff) {
    g.clear();

    if (borderWidth > 0) {
      g.fillStyle(borderColor);
      g.fillCircle(x, y, radius);
    }

    g.fillStyle(fillColor);
    g.fillCircle(x, y, radius - borderWidth);

    return g;
  },

  reDrawRoundedRect(g: Phaser.GameObjects.Graphics, scene: Phaser.Scene, x: number = 0, y: number = 0, width: number = 100, height: number = 100, borderWidth: number = 0, radius: RoundedRectRadius = 0, borderColor: number = 0x000000, fillColor: number = 0xffffff, backgroundAlpha: number = 1) {
    g.clear();
    if (backgroundAlpha > 0) g.alpha = backgroundAlpha;

    if (borderWidth > 0) {
      g.fillStyle(borderColor);
      g.fillRoundedRect(x, y, width, height, radius);
    }

    g.fillStyle(fillColor);
    g.fillRoundedRect(x + borderWidth, y + borderWidth, width - borderWidth * 2, height - borderWidth * 2, radius);

    return g;
  },

  clampX(x: number, sceneWidth: number, displayWidth: number) {
    return Phaser.Math.Clamp(x, 0, sceneWidth - displayWidth);
  },

  clampY(y: number, sceneHeight: number, displayHeight: number) {
    return Phaser.Math.Clamp(y, 0, sceneHeight - displayHeight);
  },

  isNullOrZeroOrEmpty(value: any): boolean {
    return value === undefined || value === '' || value === 0;
  },

  GetValue(source: object, key: string, defaultValue: any, altSource?: object): any {
    return Phaser.Utils.Objects.GetValue(source, key, defaultValue, altSource);
  },

  GetOrDefaultValue(value: any, defaultValue: any): any {
    return this.isNullOrZeroOrEmpty(value) ? defaultValue : value;
  },

  MergeRight(obj1: object, obj2: object): object {
    return Phaser.Utils.Objects.MergeRight(obj1, obj2);
  },

  getWorldPosition(transformObj: Phaser.GameObjects.Components.Transform) {
    const worldTransform = transformObj.getWorldTransformMatrix();
    return { x: worldTransform.tx, y: worldTransform.ty };
  },

  getLocalPosition(transformObj: Phaser.GameObjects.Components.Transform) {
    const localTransform = transformObj.getLocalTransformMatrix();
    return { x: localTransform.tx, y: localTransform.ty };
  },

  addTimer(scene: Phaser.Scene, delay?: number, callback?: Function, loop?: boolean) {
    const timer = scene.time.addEvent({
      delay: delay ?? 50,
      callback: callback,
      callbackScope: scene,
      loop: loop ?? true
    });

    return timer;
  },

  getPadding(padding?: Padding) {
    const left =  padding?.all ?? padding?.x ?? padding?.left ?? 0;
    const right =  padding?.all ?? padding?.x ?? padding?.right ?? 0;
    const top =  padding?.all ?? padding?.y ?? padding?.top ?? 0;
    const bottom = padding?.all ?? padding?.y ?? padding?.bottom ?? 0;
    const x = left;
    const y = top;
    
    return { x, y, left, right, top, bottom}
  },

  evmConnector() {
    return EVMConnector;
  }
  
}

export default Utils;
