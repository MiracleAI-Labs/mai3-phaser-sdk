import { RoundedButtonConfig } from '../types';
import Utils from '../utils';
import { BaseScene } from '../game';
import { BaseButton } from './BaseButton';
import { Text } from './Text';

export class RoundedButton extends BaseButton<RoundedButtonConfig> {
    protected _config: RoundedButtonConfig;
    protected bg?: Phaser.GameObjects.RenderTexture | null;
    protected image?: Phaser.GameObjects.Image;
    protected maskShape?: Phaser.GameObjects.Graphics;

    constructor(scene: BaseScene, config: RoundedButtonConfig) {
        config.geomType = 'Circle';
        super(scene, config, 'RoundedButton');
        this._config = config;
        this.reDraw(this._config);
    }

    reDraw(config: RoundedButtonConfig) {
        this._config = config;
        this.updateConfig(config);

        const radius = config.radius ?? 0;
        const borderWidth = config.borderWidth ?? 0;
        const btnRadius = radius + borderWidth;
        const borderColor = config.borderColor ?? 0xFFD700;
        const backgroundColor = config.backgroundColor ?? 0x32CD32;
        const backgroundAlpha = config.backgroundAlpha ?? 1;

        if (!this.maskShape) this.maskShape = this.scene.add.graphics();
        if (!this.image) this.image = this.scene.make.image({});
        this.reDrawBg(btnRadius, btnRadius, btnRadius, borderWidth, borderColor, backgroundColor, backgroundAlpha);
        let visible = true;
        if (!config.texture) {
            visible = false;
        }
        //即使是隐藏图片也要绘制大小出来，因为至少给一个宽高给container，不然触摸区域会出问题
        this.reDrawImage(config.texture!, borderWidth, borderWidth, radius * 2, radius * 2, visible);
        const color = 0xffffff;
        this.reDrawMaskShap(radius, color);
        this.RefreshBounds();
        this._config.width = this.RealWidth;
        this._config.height = this.RealHeight;
    }

    reDrawBg(x: number, y: number, radius: number, borderWidth: number, borderColor: number, fillColor: number, backgroundAlpha: number) {
        if (this.bg) {
            this.bg.destroy();
        }
        this.bg = Utils.drawCircleRenderTexture(this.scene, x, y, radius, borderWidth, borderColor, fillColor).setAlpha(backgroundAlpha);
        this.image!.setVisible(false);
        this.addChildAt(this.bg, 1);
    }

    reDrawText() {
        const config = this._config
        const radius = config.radius ?? 0;
        const borderWidth = config.borderWidth ?? 0;
        const btnRadius = radius + borderWidth;
        const FSize = config.fontSize ?? 18

        if (!config.text) return
        // 绘制文字
        const text = new Text(this.scene, {
            y: btnRadius - FSize / 2,
            width: btnRadius * 2,
            text: config.text,
            textStyle: {
                color: config.fontColor, // 颜色
                fontSize: FSize + 'px'
            },
            textAlign: 'center',
        });

        this.addChildAt(text, 3);
    }


    reDrawImage(textureKey: string, x: number, y: number, w: number, h: number, visible = true) {
        this.image?.setTexture(textureKey);
        this.image?.setPosition(x, y);
        this.image?.setDisplaySize(w, h);
        this.image?.setOrigin(0);
        this.image!.setVisible(visible);
        this.addChildAt(this.image!, 2);
        this.reDrawText();
    }

    reDrawMaskShap(radius: number, fillColor: number) {
        this.maskShape!.clear();
        this.maskShape!.fillStyle(fillColor);
        this.maskShape!.fillCircle(0, 0, radius);
        let mask = this.maskShape!.createGeometryMask();
        this.maskShape!.setVisible(false);
        this.image!.setMask(mask);
        this.addChildAt(this.maskShape!, 0);
        this.updateMaskShapePos();


    }

    //根据按钮的位置来更新mask的位置但不重绘
    updateMaskShapePos() {
        const radius = this._config.radius ?? 0;
        const borderWidth = this._config.borderWidth ?? 0;
        const btnRadius = radius + borderWidth;
        let bgLeftTopPos = Utils.getWorldPosition(this.bg!);
        this.maskShape!.setPosition(bgLeftTopPos.x + btnRadius, bgLeftTopPos.y + btnRadius);
    }

}