import Phaser from 'phaser';
import { TextBoxConfig } from '../types';
import { Container } from './Container';
import { BaseScene } from "../game";
import { Label } from './Label';

export class TextBox<T extends TextBoxConfig = TextBoxConfig> extends Container<T> {
    protected _config?: T;
    scene: BaseScene;
    label!: Label;
    selection!: Phaser.GameObjects.Rectangle;
    cursor!: Phaser.GameObjects.Text;
    timerEvent?: Phaser.Time.TimerEvent;
    hiddenInput?: HTMLInputElement;

    private static measureCanvas: HTMLCanvasElement | null = null;
    private static measureContext: CanvasRenderingContext2D | null = null;
    private static activeTextBox: TextBox | null = null;

    isFocus: boolean = false;
    charWidths: number[] = [];
    selectionStart?: number;
    selectionEnd?: number;
    isSelecting: boolean = false;
    maxWidth: number = 100;
    isComposing: boolean = false;

    constructor(scene: BaseScene, config: T) {
        super(scene, config, 'TextBox');
        this._config = config;
        this.scene = scene;

        // Ensure text is empty during initialization
        if (config.text === undefined) {
            config.text = '';
        }
        this.reDraw(config);
    }

    reDraw(config?: T): void {
        if (!config) return;
        this._config = config;

        // Ensure all states are cleared
        this.clearPreviousElements();
        this.initializeState(config);

        // Ensure text has initial value
        if (config.text === undefined) {
            config.text = '';
        }

        this.createLabel(config);
        this.createCursor(config);
        this.createSelection();
        this.setupEventListeners();
        this.createHiddenInput();

        this.setDepth(config.depth ?? 1);
        this.setScrollFactor(config.isScrollFactor ? 0 : 1);

        this.updateConfig(config);
        this.RefreshBounds();

        // Remove previous keyboard event listeners
        if (this.scene.input.keyboard) {
            this.scene.input.keyboard.off('keyup', this.handleKeyup, this);
            this.scene.input.keyboard.off('keydown', this.handleKeydown, this);
            // Re-add keyboard event listeners
            this.scene.input.keyboard.on('keyup', this.handleKeyup, this);
            this.scene.input.keyboard.on('keydown', this.handleKeydown, this);
        }
    }

    private clearPreviousElements(): void {
        if (this.label) this.label.destroy();
        if (this.cursor) this.cursor.destroy();
        if (this.selection) this.selection.destroy();
        if (this.timerEvent) {
            this.timerEvent.remove();
            this.timerEvent.destroy();
        }
        if (this.hiddenInput) {
            this.hiddenInput.remove();
        }

        // Reset all states
        this.charWidths = [];
        this.selectionStart = undefined;
        this.selectionEnd = undefined;
        this.isSelecting = false;
        this.isComposing = false;
    }

    private initializeState(config: T): void {
        this.isFocus = false;
        this.maxWidth = config.width ?? 100;
    }

    private createLabel(config: T): void {
        this.label = new Label(this.scene, config);
        // Ensure text has value and is empty string
        this.label.Text = config.text ?? '';
        this.label.setPosition(0, 0);
        this.addChildAt(this.label, 0);
    }

    private createCursor(config: T): void {
        this.cursor = this.scene.make.text({
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
    }

    private createSelection(): void {
        this.selection = this.scene.add.rectangle(0, 0, 0, 0, 0xEE6363, 0.5);
        this.selection.setOrigin(0);
        this.selection.y = this.cursor.y;
        this.selection.height = this.cursor.displayHeight;
        this.addChildAt(this.selection, 1);
    }

    private setupEventListeners(): void {
        this.setEventInteractive();
        this.on('pointerover', this.handleOver, this);
        this.on('pointerout', this.handleOut, this);
        this.on('pointerup', this.handlePointerUp, this);
        this.on('pointerdown', this.handlePointerDown, this);
        this.on('pointermove', this.handlePointerMove, this);
    }

    handleKeydown(event: KeyboardEvent) {
        if (!this.isFocus || this.isComposing || TextBox.activeTextBox !== this) return;
        if (!this.ensureHiddenInputFocused()) return;

        if (event.key === 'Tab') {
            event.preventDefault();
            return;
        }

        if (event.key.length === 1) {
            this.handleCharacterInput(event);
        } else if (event.key === 'Backspace') {
            this.handleBackspace();
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            this.handleArrowKeys(event);
        }

        this.cursor.setVisible(true);
        this.addTimerEvent();
    }

    private ensureHiddenInputFocused(): boolean {
        if (!this.hiddenInput || document.activeElement !== this.hiddenInput) {
            this.hiddenInput?.focus();
            return false;
        }
        return true;
    }

    private handleCharacterInput(event: KeyboardEvent): void {
        event.preventDefault();
        const newText = this.label.Text.slice(0, this.selectionStart) +
            event.key +
            this.label.Text.slice(this.selectionEnd);

        if (this.getTextWidth(newText) <= this.maxWidth) {
            this.label.Text = newText;
            this.hiddenInput!.value = newText;

            const newPosition = (this.selectionStart || 0) + 1;
            this.selectionStart = newPosition;
            this.selectionEnd = newPosition;
            this.updateCursorPosition();
            this.selection.width = 0;
            this.selection.setVisible(false);

            // Call onChange when text changes
            if (this._config?.onChange) {
                this._config.onChange(newText);
            }
        }
    }

    private handleBackspace(): void {
        if (this.selectionStart === this.selectionEnd && this.selectionStart! > 0) {
            const newText = this.label.Text.slice(0, this.selectionStart! - 1) +
                this.label.Text.slice(this.selectionStart!);
            this.label.Text = newText;
            this.hiddenInput!.value = newText;

            const newPosition = this.selectionStart! - 1;
            this.selectionStart = newPosition;
            this.selectionEnd = newPosition;
            this.updateCursorPosition();

            // Call onChange when text changes
            if (this._config?.onChange) {
                this._config.onChange(newText);
            }
        }
    }

    private handleArrowKeys(event: KeyboardEvent): void {
        const direction = event.key === 'ArrowLeft' ? -1 : 1;
        if (this.selectionStart !== undefined) {
            const newPosition = Math.max(0, Math.min(this.selectionStart + direction, this.label.Text.length));
            this.selectionStart = newPosition;
            this.selectionEnd = newPosition;
            this.updateCursorPosition();
            this.selection.width = 0;
            this.selection.setVisible(false);
        }
    }

    handleKeyup(event: KeyboardEvent) {
        if (!this.isFocus || TextBox.activeTextBox !== this) return;

        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Backspace') {
            this.handleMoveCursor();
        }
    }

    getCursorPosition(): number {
        return this.hiddenInput?.selectionStart ?? 0;
    }

    createHiddenInput() {
        this.hiddenInput = document.createElement('input');
        this.setupHiddenInputAttributes();
        this.setupHiddenInputEventListeners();
        document.body.appendChild(this.hiddenInput);
    }

    private setupHiddenInputAttributes(): void {
        if (!this.hiddenInput) return;

        this.hiddenInput.type = 'text';
        this.hiddenInput.style.position = 'absolute';
        this.hiddenInput.style.opacity = '0';
        this.hiddenInput.style.pointerEvents = 'none';
        this.hiddenInput.style.zIndex = '-1';
        this.hiddenInput.style.top = '-1000px';
        this.hiddenInput.value = this.label.Text;
    }

    private setupHiddenInputEventListeners(): void {
        if (!this.hiddenInput) return;

        this.hiddenInput.addEventListener('compositionstart', () => {
            this.isComposing = true;
        });

        this.hiddenInput.addEventListener('compositionend', () => {
            this.handleCompositionEnd();
        });

        this.hiddenInput.addEventListener('input', (event) => {
            if (!this.isComposing) {
                this.handleInput();
            }
        });
    }

    private handleCompositionEnd(): void {
        this.isComposing = false;
        const newText = this.hiddenInput?.value ?? '';
        if (this.getTextWidth(newText) <= this.maxWidth) {
            this.label.Text = newText;
            this.updateCursorPosition();
            // Call onChange when text changes
            if (this._config?.onChange) {
                this._config.onChange(newText);
            }
        } else {
            this.hiddenInput!.value = this.label.Text;
        }
        this.updateSelectionAfterInput();
    }

    private handleInput(): void {
        const newText = this.hiddenInput?.value ?? '';
        if (this.getTextWidth(newText) <= this.maxWidth) {
            this.label.Text = newText;
            this.updateCursorPosition();
            // Call onChange when text changes
            if (this._config?.onChange) {
                this._config.onChange(newText);
            }
        } else {
            this.hiddenInput!.value = this.label.Text;
        }
        this.updateSelectionAfterInput();
    }

    getTextWidth(text: string): number {
        if (!TextBox.measureCanvas) {
            TextBox.measureCanvas = this.scene.game.canvas ?? document.createElement('canvas');
            TextBox.measureContext = TextBox.measureCanvas.getContext('2d');
        }

        const context = TextBox.measureContext;
        if (!context) return 0;

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
        // Deactivate other textboxes
        if (TextBox.activeTextBox && TextBox.activeTextBox !== this) {
            TextBox.activeTextBox.isFocus = false;
            TextBox.activeTextBox.cursor.setVisible(false);
            TextBox.activeTextBox.selection.setVisible(false);
            if (TextBox.activeTextBox.timerEvent) {
                TextBox.activeTextBox.timerEvent.remove();
                TextBox.activeTextBox.timerEvent.destroy();
                TextBox.activeTextBox.timerEvent = undefined;
            }
        }

        // Activate current textbox
        TextBox.activeTextBox = this;
        this.isFocus = true;
        this.hiddenInput?.focus();

        const worldPoint = this.getLabelWorldPoint();
        let cursorX = this.calculateCursorX(pointer, worldPoint);
        this.cursor.x = cursorX;
        this.cursor.setVisible(true);

        this.resetSelection();
        this.updateSelectionPositions();
        this.isSelecting = true;

        this.addTimerEvent();
    }

    private calculateCursorX(pointer: Phaser.Input.Pointer, worldPoint: Phaser.Math.Vector2): number {
        let cursorX = pointer.x - worldPoint.x;
        return Math.min(cursorX, this.label.TextWidth);
    }

    private resetSelection(): void {
        this.selection.width = 0;
        this.selection.setVisible(false);
    }

    private updateSelectionPositions(): void {
        this.setDomCursorPosition();
        this.setNativeCursorPosition();
        this.selection.x = this.cursor.x;
        this.selectionStart = this.getCursorPosition();
        this.selectionEnd = this.selectionStart;
    }

    handlePointerMove(pointer: Phaser.Input.Pointer) {
        if (!this.isSelecting || TextBox.activeTextBox !== this) return;

        const worldPoint = this.getLabelWorldPoint();
        let cursorX = this.clampCursorX(pointer.x - worldPoint.x);

        this.selectionEnd = this.getCharacterIndexAtPosition(cursorX);
        this.updateSelection();
    }

    private clampCursorX(x: number): number {
        return Math.max(0, Math.min(x, this.label.TextWidth));
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

        const [start, end] = this.getSelectionRange();
        const [startX, endX] = this.getSelectionCoordinates(start, end);

        this.updateSelectionVisuals(startX, endX);
        this.updateHiddenInputSelection(start, end);
    }

    private getSelectionRange(): [number, number] {
        return [
            Math.min(this.selectionStart!, this.selectionEnd!),
            Math.max(this.selectionStart!, this.selectionEnd!)
        ];
    }

    private getSelectionCoordinates(start: number, end: number): [number, number] {
        return [
            this.getCharacterXPosition(start),
            this.getCharacterXPosition(end)
        ];
    }

    private updateSelectionVisuals(startX: number, endX: number): void {
        this.selection.x = startX;
        this.selection.width = endX - startX;
        this.selection.setVisible(true);

        this.cursor.x = endX;
        this.cursor.setVisible(true);
    }

    private updateHiddenInputSelection(start: number, end: number): void {
        this.hiddenInput?.setSelectionRange(start, end);
    }

    handleMoveCursor() {
        this.setNativeCursorPosition();
    }

    setDomCursorPosition() {
        if (this.cursor.x > this.label.TextWidth) {
            this.cursor.x = this.label.TextWidth;
        }
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
        this.initializeMeasureCanvas();
        const context = TextBox.measureContext;
        if (!context) return [];

        const fontSize = this.label.Label.style.fontSize || '16px';
        const fontFamily = this.label.Label.style.fontFamily || 'Arial';
        context.font = `${fontSize} ${fontFamily}`;

        return this.calculateCharWidths(context);
    }

    private initializeMeasureCanvas(): void {
        if (!TextBox.measureCanvas) {
            TextBox.measureCanvas = document.createElement('canvas');
            TextBox.measureContext = TextBox.measureCanvas.getContext('2d');
        }
    }

    private calculateCharWidths(context: CanvasRenderingContext2D): number[] {
        const text = this.hiddenInput?.value ?? '';
        return Array.from(text).map(char => context.measureText(char).width);
    }

    getCharacterXPosition(index: number) {
        const charWidths = this.getCharacterWidths();
        index = Math.min(index, charWidths.length);
        return charWidths.slice(0, index).reduce((sum, width) => sum + (width ?? 0), 0);
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
        if (TextBox.activeTextBox === this) {
            TextBox.activeTextBox = null;
        }
        this.removeEventListeners();
        this.destroyComponents(fromScene);
        super.destroy(fromScene);
    }

    private removeEventListeners(): void {
        this.off('pointerover', this.handleOver);
        this.off('pointerout', this.handleOut);
        this.off('pointerup', this.handlePointerUp);
        this.off('pointerdown', this.handlePointerDown);
        this.off('pointermove', this.handlePointerMove);

        if (this.scene.input.keyboard) {
            this.scene.input.keyboard.off('keyup', this.handleKeyup);
        }
    }

    private destroyComponents(fromScene?: boolean): void {
        this.label.destroy(fromScene);
        this.cursor.destroy(fromScene);
        this.timerEvent?.remove();
        this.timerEvent?.destroy();
        this.hiddenInput?.remove();
    }
}
