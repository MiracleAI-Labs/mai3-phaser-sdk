import { BackgroundType, BaseBarConfig } from '../types';
import Utils from '../utils';
import { BaseScene } from "../game";
import { BaseButton } from './BaseButton';

export class BaseBar<T extends BaseBarConfig = BaseBarConfig> extends BaseButton<T> {
    protected borderWidth?: number;
    protected borderColor?: number;
    protected radius?: number;
    public bgWidth?: number;
    public bgHeight?: number;
    protected fillWidth?: number;
    protected _progressValue: number = 0;
    protected _config?: T;
    
    bg?: BackgroundType;
    fill?: BackgroundType;

    constructor(scene: BaseScene, config: T) {
        super(scene, config);
        this._config = config;
        this.Type = 'BaseBar';

        this.reDraw(config);
    }

    reDraw(config: T) {
        this._config = config;
        this.bgWidth = config.width ?? 300;
        this.bgHeight = config.height ?? 32;

        this.fillWidth = 0;
        this.borderWidth = config.borderWidth ?? 0;
        this.borderColor = this._config?.borderColor ?? 0xcf4b00;
        this.radius = this._config?.radius ?? 0;

        this.drawBarBg();
        this.drawBarFill();
        this.RefreshBounds();
    }

    drawBarBg() {
        if (this._config?.bgTexture && this._config?.bgTexture.length > 0) {
            this.bg = this.createOrGetSprite(this.bg, this._config?.bgTexture, true);
            this.bg.displayWidth = this.bgWidth!;
            this.bg.displayHeight = this.bgHeight!;
            this.bg.setOrigin(0);
        } else if ((this._config?.radius && this._config?.radius > 0 || (this._config?.bgTexture && this._config?.bgTexture.length == 0))) {
            this.bg = this.reDrawRoundedRectBG(0, 0, this.bgWidth!, this.bgHeight!, this.borderWidth!, this.radius!, this.borderColor!, this._config?.bgColor as number || 0xcf4b00);
        } else {
            this.bg = this.createOrGetRectangle(this.bg, true, 0, 0, this.bgWidth, this.bgHeight! - this.borderWidth!, this._config?.bgColor as number);
            this.bg.setStrokeStyle(this.borderWidth, this._config?.bgColor as number, this._config?.borderColorAlpha).setOrigin(0, 0);
            this.bg.setOrigin(0);
        }

        this.addChildAt(this.bg!, 0);
    }

    drawBarFill() {
        if (this._config?.fillTexture && this._config?.fillTexture.length > 0) {
            this.fill = this.createOrGetSprite(this.fill, this._config?.fillTexture, false);
            this.fill.displayWidth = 0;
            this.fill.displayHeight = this.bgHeight!;
            this.fill.setOrigin(0);
        } else if ((this._config?.radius && this._config?.radius > 0) || (this._config?.fillTexture && this._config?.fillTexture.length == 0)) {
            this.fill = this.reDrawRoundedRectFill(0, 0, 1, this.bgHeight!, this.borderWidth!, this.radius!, this.borderColor!, this._config?.fillColor as number || 0xff8221);
        } else {
            this.fill = this.createOrGetRectangle(this.fill, false, 0, 0, 4, this.bgHeight! - this.borderWidth!, this._config?.fillColor as number, this._config?.borderColorAlpha);
            this.fill.setOrigin(0);
        }

        this.addChildAt(this.fill!, 1);
    }

    createOrGetSprite(obj?: any, key?: string, isBg?: boolean) {
        let gameObj = obj ?? this.scene.make.sprite({ key });
        if (!(obj instanceof Phaser.GameObjects.Sprite)) {
            gameObj.destroy(true);
            gameObj = this.scene.make.sprite({ key });

            if (isBg) this.bg = gameObj;
            if (!isBg) this.fill = gameObj;
            this.addChildAt(isBg! ? this.bg! : this.fill!, isBg! ? 0 : 1);
        }

        gameObj.setTexture(key!);
        return gameObj as Phaser.GameObjects.Sprite;
    }

    createOrGetRectangle(obj?: any, isBg?: boolean, x?: number, y?: number, width?: number, height?: number, fillColor?: number, fillAlpha?: number) {
        let gameObj = (obj ?? this.scene.add.rectangle(x, y, width, height, fillColor, fillAlpha)) as Phaser.GameObjects.Rectangle;
        if (!(obj instanceof Phaser.GameObjects.Rectangle)) {
            gameObj.destroy(true);
            gameObj = this.scene.add.rectangle(x, y, width, height, fillColor, fillAlpha);

            if (isBg) this.bg = gameObj;
            if (!isBg) this.fill = gameObj;
            this.addChildAt(isBg! ? this.bg! : this.fill!, isBg! ? 0 : 1);
        }

        gameObj.width = width ?? gameObj.width;
        gameObj.height = height ?? gameObj.height;
        gameObj.setFillStyle(fillColor, fillAlpha);
        return gameObj;
    }

    reDrawRoundedRectBG(x: number, y: number, width: number, height: number, borderWidth: number, radius: number, borderColor: number, fillColor: number) {
        if (this.bg && !(this.bg instanceof Phaser.GameObjects.RenderTexture)) {
            this.bg.destroy(true);
        }

        const rt = this.bg as Phaser.GameObjects.RenderTexture;
        const newBg = Utils.reDrawRoundedRectRenderTexture(this.scene, rt, x, y, width, height, borderWidth, radius, borderColor, fillColor);
        if (newBg) {
            this.bg = newBg;
        }
        return this.bg;
    }

    reDrawRoundedRectFill(x: number, y: number, width: number, height: number, borderWidth: number, radius: number, borderColor: number, fillColor: number) {
        if (this.fill && !(this.fill instanceof Phaser.GameObjects.RenderTexture)) {
            this.fill.destroy(true);
        }

        const rt = this.fill as Phaser.GameObjects.RenderTexture;
        const newFill = Utils.reDrawRoundedRectRenderTexture(this.scene, rt, x, y, width, height, borderWidth, radius, borderColor, fillColor);
        if (newFill) {
            this.fill = newFill;
        }
        return this.fill;
    }

    updateProgress(progress: number) {
        if (this.fill instanceof Phaser.GameObjects.Sprite) {
            this.fill.x = 0;
            this.fill.displayWidth = this.bgWidth! * progress;
            this.fillWidth = this.fill.displayWidth;
        }

        if (this.fill instanceof Phaser.GameObjects.Rectangle) {
            this.fill.width = this.borderWidth! * 2 + (this.bgWidth! - this.borderWidth! * 2) * progress;
            this.fillWidth = this.fill.displayWidth;
        }

        if (this.fill instanceof Phaser.GameObjects.RenderTexture) {
            this.fillWidth = this.bgWidth! * progress;
            if (this.fillWidth === 0) this.fillWidth++;
            this.fill = this.reDrawRoundedRectFill(0, 0, this.fillWidth, this.bgHeight!, this.borderWidth!, this.radius!, this.borderColor!, this._config?.fillColor as number || 0xff8221);
            if (this.fill) {
                this.addChildAt(this.fill, 1);
            }
        }

        this._progressValue = progress;
    }

    set progress(value: number) {
        this.updateProgress(value);
    }

    get progress(): number {
        return this._progressValue;
    }

    public getProgressWith() {
        return this.fillWidth;
    }

}



