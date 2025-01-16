import { BaseScene } from "../game";
import { JoystickConfig } from "../types";
import { Container } from "./Container";
import { GameObjects } from "phaser";

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

    constructor(scene: BaseScene, config: JoystickConfig) {
        super(scene, config);
        this.Type = "Joystick";
        this._config = config;
        this.reDraw(config);
    }

    reDraw(config: JoystickConfig): void {
        this._config = config;
        this._config.width = (config.base?.radius || 50) * 2;
        this._config.height = (config.base?.radius || 50) * 2;
        this.baseRadius = config.base?.radius || 50;
        this.thumbRadius = config.thumb?.radius || 25;

        if (this.base) this.base.destroy();
        if (this.thumb) this.thumb.destroy();

        this.base = undefined;
        this.thumb = undefined;

        this.createBase();
        this.createThumb();

        this.add([this.base!, this.thumb!]);
        this.setPosition(config.x || 0, config.y || 0);
        this.setScrollFactor(0);
        this.setupInteractive();
        this.updateConfig(this._config);
    }

    private createBase(): void {
        this.base = this.scene.add.image(this.baseRadius, this.baseRadius, this._config.base?.key || '')
            .setFrame(this._config.base?.frame || 0)
            .setDisplaySize(this.baseRadius * 2, this.baseRadius * 2)
            .setOrigin(0.5)
            .setInteractive({
                hitArea: new Phaser.Geom.Circle(this.baseRadius, this.baseRadius, this.baseRadius),
                hitAreaCallback: Phaser.Geom.Circle.Contains
            });
    }

    private createThumb(): void {
        this.thumb = this.scene.add.image(this.baseRadius, this.baseRadius, this._config.thumb?.key || '')
            .setFrame(this._config.thumb?.frame || 0)
            .setDisplaySize(this.thumbRadius * 2, this.thumbRadius * 2)
            .setOrigin(0.5)
            .setInteractive({
                hitArea: new Phaser.Geom.Circle(this.thumbRadius, this.thumbRadius, this.thumbRadius),
                hitAreaCallback: Phaser.Geom.Circle.Contains
            });
    }

    private setupInteractive(): void {
        if (!this.base) return;

        this.base.setInteractive();
        this.scene.input.on('pointerdown', this.onPointerDown, this);
        this.scene.input.on('pointermove', this.onPointerMove, this);
        this.scene.input.on('pointerup', this.onPointerUp, this);
    }

    private onPointerDown(pointer: Phaser.Input.Pointer): void {
        const distance = Phaser.Math.Distance.Between(
            this.x + this.baseRadius,
            this.y + this.baseRadius,
            pointer.x,
            pointer.y
        );

        if (distance <= this.baseRadius) {
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
        }
        this.forceX = 0;
        this.forceY = 0;
        this._force = 0;
        this._angle = 0;
    }

    private updateJoystickPosition(pointer: Phaser.Input.Pointer): void {
        if (!this.thumb) return;

        const deltaX = pointer.x - (this.x + this.baseRadius);
        const deltaY = pointer.y - (this.y + this.baseRadius);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        this._angle = Phaser.Math.RadToDeg(Math.atan2(deltaY, deltaX));
        this._force = Phaser.Math.Clamp(distance / this.baseRadius, 0, 1);

        if (distance <= this.baseRadius) {
            this.thumb.setPosition(this.baseRadius + deltaX, this.baseRadius + deltaY);
            this.forceX = deltaX / this.baseRadius;
            this.forceY = deltaY / this.baseRadius;
        } else {
            const angle = Math.atan2(deltaY, deltaX);
            this.thumb.setPosition(
                this.baseRadius + Math.cos(angle) * this.baseRadius,
                this.baseRadius + Math.sin(angle) * this.baseRadius
            );
            this.forceX = Math.cos(angle);
            this.forceY = Math.sin(angle);
        }
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
        if (this.base) this.base.setVisible(visible);
        if (this.thumb) this.thumb.setVisible(visible);
        return this;
    }

    public setScrollFactor(factor: number): this {
        if (this.base) this.base.setScrollFactor(factor);
        if (this.thumb) this.thumb.setScrollFactor(factor);
        return this;
    }

    public destroy(): void {
        this.scene.input.off('pointerdown', this.onPointerDown, this);
        this.scene.input.off('pointermove', this.onPointerMove, this);
        this.scene.input.off('pointerup', this.onPointerUp, this);

        super.destroy();

        if (this.base) this.base.destroy();
        if (this.thumb) this.thumb.destroy();

        this.base = undefined;
        this.thumb = undefined;
    }
}