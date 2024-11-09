import Phaser from 'phaser';
import { TextBoxConfig } from '../types';
import { Container } from './Container';
import { BaseScene } from "../game";
import { Label } from './Label';
export class TextBox<T extends TextBoxConfig = TextBoxConfig> extends Container<T> {
    protected _config?: T;
    
    label: Label;
    selection: Phaser.GameObjects.Rectangle;
    cursor: Phaser.GameObjects.Text;
    timerEvent?: Phaser.Time.TimerEvent;
    hiddenInput?: HTMLInputElement;

    private static measureCanvas: HTMLCanvasElement | null = null;
    private static measureContext: CanvasRenderingContext2D | null = null;

    isFocus: boolean;
    charWidths: number[] = [];
    selectionStart?: number;
    selectionEnd?: number;
    isSelecting: boolean = false;
    maxWidth: number;

    constructor(scene: BaseScene, config: T) {
        super(scene, config, 'TextBox');
        this._config = config;
        this.isFocus = false;
        this.maxWidth = config.width ?? 100;

        this.label = new Label(scene, config);
        this.label.Text = config.text ?? '';
        this.label.setPosition(0, 0);
        this.addChildAt(this.label, 0);

        this.cursor = scene.make.text({
            style: {
                color: '#383838',
                fontSize: config.textStyle?.fontSize
            }
        });
        this.cursor.text = "|";
        this.cursor.setOrigin(0);
        this.cursor.x = this.label.TextWidth;
        this.cursor.y = (this.label.RealHeight - this.cursor.displayHeight) / 2;
        this.cursor.setVisible(false);
        this.addChildAt(this.cursor, 1);

        this.selection = scene.add.rectangle(0, 0, 0, 0, 0xEE6363, 0.5);
        this.selection.setOrigin(0);
        this.selection.y = this.cursor.y;
        this.selection.height = this.cursor.displayHeight;
        this.addChildAt(this.selection, 1);

        this.setEventInteractive();
        this.on('pointerover', this.handleOver, this);
        this.on('pointerout', this.handleOut, this);
        this.on('pointerup', this.handlePointerUp, this);
        this.on('pointerdown', this.handlePointerDown, this);
        this.on('pointermove', this.handlePointerMove, this);

        if (scene.input.keyboard) {
            scene.input.keyboard.on('keyup', this.handleKeyup, this);
        }

        this.createHiddenInput();
    }

    handleKeyup(event: KeyboardEvent) {
        if (!this.isFocus) return;

        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Backspace') {
            this.handleMoveCursor();
        }
    }

    getCursorPosition(): number {
        return this.hiddenInput?.selectionStart ?? 0;
    }

    createHiddenInput() {
        this.hiddenInput = document.createElement('input');
        this.hiddenInput.type = 'text';
        this.hiddenInput.style.position = 'absolute';
        this.hiddenInput.style.opacity = '0';
        this.hiddenInput.style.pointerEvents = 'none';
        this.hiddenInput.style.zIndex = '-1';
        this.hiddenInput.style.top = '-1000px';  // 将隐藏输入框移到屏幕外
        this.hiddenInput.value = this.label.Text;
        document.body.appendChild(this.hiddenInput);

        this.hiddenInput.addEventListener('input', () => {
            const newText = this.hiddenInput?.value ?? '';
            if (this.getTextWidth(newText) <= this.maxWidth) {
                this.label.Text = newText;
                this.updateCursorPosition();
            } else {
                this.hiddenInput!.value = this.label.Text;
            }
            this.updateSelectionAfterInput();
        });
    }

    getTextWidth(text: string): number {
        if (!TextBox.measureCanvas) {
            TextBox.measureCanvas = this.scene.game.canvas ?? document.createElement('canvas');
            TextBox.measureContext = TextBox.measureCanvas.getContext('2d');
        }

        const context = TextBox.measureContext;
        if (!context) {
            console.error('无法获取2D上下文');
            return 0;
        }

        const fontSize = this.label.Label.style.fontSize || '16px';
        const fontFamily = this.label.Label.style.fontFamily || 'Arial';
        context.font = `${fontSize} ${fontFamily}`;

        return context.measureText(text).width;
    }

    updateSelectionAfterInput() {
        if (this.hiddenInput) {
            const cursorPosition = this.hiddenInput.selectionStart ?? 0;
            this.selectionStart = cursorPosition;
            this.selectionEnd = cursorPosition;
            this.selection.width = 0;
            this.selection.setVisible(false);
            this.updateCursorPosition();
            this.cursor.setVisible(true);
        }
    }

    handleOver() {
        this.scene.input.setDefaultCursor('text');
    }

    handleOut() {
        this.scene.input.setDefaultCursor('default');
    }

    handlePointerDown(pointer: Phaser.Input.Pointer) {
        this.isFocus = true;
        this.hiddenInput?.focus();

        const worldPoint = this.getLabelWorldPoint();
        let cursorX = pointer.x - worldPoint.x;
        if (cursorX > this.label.TextWidth) {
            cursorX = this.label.TextWidth;
        }
        this.cursor.x = cursorX;
        this.cursor.setVisible(true);

        this.selection.width = 0;
        this.selection.setVisible(false);

        this.setDomCursorPosition();
        this.setNativeCursorPosition();
        this.selection.x = this.cursor.x;
        this.selectionStart = this.getCursorPosition();
        this.selectionEnd = this.selectionStart;

        this.isSelecting = true;

        this.addTimerEvent();
    }

    handlePointerMove(pointer: Phaser.Input.Pointer) {
        if (!this.isSelecting) return;

        const worldPoint = this.getLabelWorldPoint();
        let cursorX = pointer.x - worldPoint.x;
        if (cursorX > this.label.TextWidth) {
            cursorX = this.label.TextWidth;
        }
        if (cursorX < 0) {
            cursorX = 0;
        }

        this.selectionEnd = this.getCharacterIndexAtPosition(cursorX);
        this.updateSelection();
    }

    handlePointerUp() {
        this.isSelecting = false;
        if (this.selectionStart === this.selectionEnd) {
            this.selection.setVisible(false);
        }
    }

    updateCursorPosition() {
        const cursorPosition = this.hiddenInput?.selectionStart ?? 0;
        this.cursor.x = this.getCharacterXPosition(cursorPosition);
    }

    updateSelection() {
        if (this.selectionStart === undefined || this.selectionEnd === undefined) return;

        const start = Math.min(this.selectionStart, this.selectionEnd);
        const end = Math.max(this.selectionStart, this.selectionEnd);

        const startX = this.getCharacterXPosition(start);
        const endX = this.getCharacterXPosition(end);

        this.selection.x = startX;
        this.selection.width = endX - startX;
        this.selection.setVisible(true);

        this.cursor.x = endX;
        this.cursor.setVisible(true);

        this.hiddenInput?.setSelectionRange(start, end);
    }

    handleMoveCursor() {
        this.setNativeCursorPosition();
    }

    setDomCursorPosition() {
        if (this.cursor.x > this.label.TextWidth) { this.cursor.x = this.label.TextWidth; }
        let characterIndex = this.getCharacterIndexAtPosition(this.cursor.x);
        this.hiddenInput?.setSelectionRange(characterIndex, characterIndex);
    }

    setNativeCursorPosition() {
        let characterIndex = this.getCursorPosition();
        const characterX = this.getCharacterXPosition(characterIndex);
        this.cursor.x = characterX;
        this.cursor.setVisible(true);
    }

    getCharacterIndexAtPosition(x: number) {
        this.charWidths = this.getCharacterWidths();
        let accumulatedWidth = 0;

        for (let i = 0; i < this.label.Text.length; i++) {
            accumulatedWidth += this.charWidths[i] ?? 0;
            if (x < accumulatedWidth) {
                return i;
            }
        }

        return this.label.Text.length;
    }

    getCharacterWidths() {
        if (!TextBox.measureCanvas) {
            TextBox.measureCanvas = document.createElement('canvas');
            TextBox.measureContext = TextBox.measureCanvas.getContext('2d');
        }

        const context = TextBox.measureContext;
        if (!context) {
            console.error('无法获取2D上下文');
            return [];
        }

        const fontSize = this.label.Label.style.fontSize || '16px';
        const fontFamily = this.label.Label.style.fontFamily || 'Arial';
        context.font = `${fontSize} ${fontFamily}`;

        const charWidths: number[] = [];

        const text = this.hiddenInput?.value ?? '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charWidth = context.measureText(char).width;
            charWidths.push(charWidth);
        }

        return charWidths;
    }

    getCharacterXPosition(index: number) {
        const charWidths = this.getCharacterWidths();
        index = Math.min(index, charWidths.length);
        let x = 0;

        for (let i = 0; i < index; i++) {
            x += charWidths[i] ?? 0;
        }

        return x;
    }

    addTimerEvent() {
        if (this.timerEvent) return;
        this.timerEvent = this.scene.time.addEvent({
            delay: 800,
            callback: () => {
                this.cursor.visible = !this.cursor.visible;
            },
            callbackScope: this,
            loop: true
        });
    }

    getLabelWorldPoint() {
        const worldPoint = new Phaser.Math.Vector2();
        const transformMatrix = this.label.getWorldTransformMatrix();
        transformMatrix.transformPoint(this.label.x, this.label.y, worldPoint);
        return worldPoint;
    }
    
    destroy(fromScene?: boolean): void {
        this.label.destroy(fromScene);
        this.cursor.destroy(fromScene);
        this.timerEvent?.remove();
        this.timerEvent?.destroy();
        if (this.hiddenInput) {
            this.hiddenInput.remove();
        }
        super.destroy(fromScene);
    }
}
