import { BaseScene } from "../game";
import { JoystickConfig } from "../types";
import { Container } from "./Container";
import { GameObjects } from "phaser";
import Utils from "../utils";

export class Joystick extends Container<JoystickConfig> {
    protected _config: JoystickConfig;
    public base?: GameObjects.Image;
    public thumb?: GameObjects.Image;
    private pointer?: Phaser.Input.Pointer;
    private isBeingDragged: boolean = false;
    private forceX: number = 0;
    private forceY: number = 0;
    private _force: number = 0;
    private _angle: number = 0;
    private baseRadius: number = 50;
    private thumbRadius: number = 25;
    protected maskShape?: Phaser.GameObjects.Graphics;
    protected thumbMaskShape?: Phaser.GameObjects.Graphics;

    constructor(scene: BaseScene, config: JoystickConfig) {
        super(scene, config);
        this.Type = "Joystick";
        config.geomType = 'Circle';
        this._config = config;
        this.reDraw(config);
    }

    reDraw(config: JoystickConfig): void {
        this._config = config;
        const { width = 0, height = 0 } = config;
        const defaultBaseRadius = 50;
        const defaultThumbRadius = 25;

        // Calculate base radius from config or use default
        let baseRadius = 0;
        if (width > 0 && height > 0) {
            baseRadius = Math.min(
                width / 2,
                height / 2,
            );
        } else {
            baseRadius = config.base?.radius || defaultBaseRadius;
        }

        // Update config dimensions to match calculated radius
        this._config.width = baseRadius * 2;
        this._config.height = baseRadius * 2;
        this._config.radius = baseRadius;
        this._config.base!.radius = baseRadius;

        // Set instance properties
        this.baseRadius = baseRadius;
        this.thumbRadius = config.thumb?.radius || defaultThumbRadius;

        this.clearComponents();
        this.createComponents();
        this.setupComponents();
    }

    private clearComponents(): void {
        [this.base, this.thumb, this.maskShape, this.thumbMaskShape].forEach(component => {
            if (component) component.destroy();
        });

        this.base = undefined;
        this.thumb = undefined;
        this.maskShape = undefined;
        this.thumbMaskShape = undefined;
    }

    private createComponents(): void {
        this.createBase();
        this.createThumb();
        if (this.base && this.thumb) {
            this.add([this.base, this.thumb]);
            // Ensure thumb is centered on base
            this.thumb.setPosition(this.baseRadius, this.baseRadius);
            if (this.thumbMaskShape) {
                const imageLeftTopPos = Utils.getWorldPosition(this.thumb);
                this.thumbMaskShape.setPosition(imageLeftTopPos.x, imageLeftTopPos.y);
            }
        }
    }

    private setupComponents(): void {
        this.setPosition(this._config.x || 0, this._config.y || 0);
        this.updateConfig(this._config);
        this.RefreshBounds();
        this.setScrollFactor(0);
        this.setEventInteractive();
        this.setupInteractive();
    }

    private createMaskedImage(key: string, radius: number, index: number): {
        image: GameObjects.Image,
        maskShape: Phaser.GameObjects.Graphics
    } | undefined {
        if (!key) {
            console.warn(`No ${index === 0 ? 'base' : 'thumb'} key provided for joystick`);
            return;
        }

        const maskShape = this.scene.add.graphics();
        const image = this.scene.make.image({})
            .setTexture(key)
            .setPosition(radius, radius)
            .setDisplaySize(radius * 2, radius * 2)
            .setOrigin(0.5)

        this.addChildAt(image, index * 2);

        maskShape.clear()
            .fillStyle(0xffffff)
            .fillCircle(0, 0, radius);

        const mask = maskShape.createGeometryMask();
        maskShape.setVisible(false);
        image.setMask(mask);
        this.addChildAt(maskShape, index * 2 + 1);

        const imageLeftTopPos = Utils.getWorldPosition(image);
        maskShape.setPosition(imageLeftTopPos.x, imageLeftTopPos.y);

        return { image, maskShape };
    }

    private createBase(): void {
        const result = this.createMaskedImage(this._config.base?.key || '', this.baseRadius, 0);
        if (result) {
            this.base = result.image;
            this.maskShape = result.maskShape;
        }
    }

    private createThumb(): void {
        const result = this.createMaskedImage(this._config.thumb?.key || '', this.thumbRadius, 1);
        if (result) {
            this.thumb = result.image;
            this.thumbMaskShape = result.maskShape;
        }
    }

    private setupInteractive(): void {
        if (!this.thumb) return;

        this.thumb.setInteractive();
        const events = ['pointerdown', 'pointermove', 'pointerup'];
        const handlers = [this.onPointerDown, this.onPointerMove, this.onPointerUp];

        events.forEach((event, index) => {
            this.scene.input.on(event, handlers[index], this);
        });
    }

    private onPointerDown(pointer: Phaser.Input.Pointer): void {
        if (!this.thumb) return;

        const thumbPos = Utils.getWorldPosition(this.thumb);
        const distance = Phaser.Math.Distance.Between(
            thumbPos.x,
            thumbPos.y,
            pointer.x,
            pointer.y
        );

        if (distance <= this.thumbRadius) {
            this.isBeingDragged = true;
            this.pointer = pointer;
            this.updateJoystickPosition(pointer);
        }
    }

    private onPointerMove(pointer: Phaser.Input.Pointer): void {
        if (!this.isBeingDragged || this.pointer?.id !== pointer.id) return;
        this.updateJoystickPosition(pointer);
    }

    private onPointerUp(pointer: Phaser.Input.Pointer): void {
        if (this.pointer?.id !== pointer.id) return;
        this.resetJoystick();
    }

    private resetJoystick(): void {
        this.isBeingDragged = false;
        this.pointer = undefined;

        if (this.thumb) {
            this.thumb.setPosition(this.baseRadius, this.baseRadius);
            if (this.thumbMaskShape) {
                const imageLeftTopPos = Utils.getWorldPosition(this.thumb);
                this.thumbMaskShape.setPosition(imageLeftTopPos.x, imageLeftTopPos.y);
            }
        }

        this.forceX = 0;
        this.forceY = 0;
        this._force = 0;
        this._angle = 0;
    }

    private updateJoystickPosition(pointer: Phaser.Input.Pointer): void {
        if (!this.thumb || !this.thumbMaskShape) return;

        const deltaX = pointer.x - (this.x + this.baseRadius);
        const deltaY = pointer.y - (this.y + this.baseRadius);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX);

        this._angle = Phaser.Math.RadToDeg(angle);
        this._force = Phaser.Math.Clamp(distance / this.baseRadius, 0, 1);

        const isWithinRadius = distance <= this.baseRadius;
        const newX = this.baseRadius + (isWithinRadius ? deltaX : Math.cos(angle) * this.baseRadius);
        const newY = this.baseRadius + (isWithinRadius ? deltaY : Math.sin(angle) * this.baseRadius);

        this.forceX = isWithinRadius ? deltaX / this.baseRadius : Math.cos(angle);
        this.forceY = isWithinRadius ? deltaY / this.baseRadius : Math.sin(angle);

        this.thumb.setPosition(newX, newY);
        const imageLeftTopPos = Utils.getWorldPosition(this.thumb);
        this.thumbMaskShape.setPosition(imageLeftTopPos.x, imageLeftTopPos.y);
    }

    public get force(): number {
        return this._force;
    }

    public get joystickRotation(): number {
        return this._angle;
    }

    public get up(): boolean {
        return this.forceY < -0.5;
    }

    public get down(): boolean {
        return this.forceY > 0.5;
    }

    public get left(): boolean {
        return this.forceX < -0.5;
    }

    public get right(): boolean {
        return this.forceX > 0.5;
    }

    public setVisible(visible: boolean): this {
        [this.base, this.thumb].forEach(component => {
            if (component) component.setVisible(visible);
        });
        return this;
    }

    public setScrollFactor(factor: number): this {
        [this.base, this.thumb].forEach(component => {
            if (component) component.setScrollFactor(factor);
        });
        return this;
    }

    // Update mask positions without redrawing
    public updateMaskPos(): void {
        const basePos = Utils.getWorldPosition(this.base!);
        const thumbPos = Utils.getWorldPosition(this.thumb!);

        this.maskShape!.setPosition(basePos.x, basePos.y);
        this.thumbMaskShape!.setPosition(thumbPos.x, thumbPos.y);
    }

    public destroy(): void {
        const events = ['pointerdown', 'pointermove', 'pointerup'];
        const handlers = [this.onPointerDown, this.onPointerMove, this.onPointerUp];

        events.forEach((event, index) => {
            this.scene.input.off(event, handlers[index], this);
        });

        this.clearComponents();
        super.destroy();
    }
}