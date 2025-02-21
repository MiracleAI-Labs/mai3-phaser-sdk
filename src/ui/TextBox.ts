import Phaser from 'phaser';
import { TextBoxConfig } from '../types';
import { Container } from './Container';
import { BaseScene } from "../game";
import { Label } from './Label';

/**
 * A text input box component that supports text selection, cursor movement, and IME input
 */
export class TextBox<T extends TextBoxConfig = TextBoxConfig> extends Container<T> {
    protected _config?: T;

    label!: Label;
    selection!: Phaser.GameObjects.Rectangle;
    cursor!: Phaser.GameObjects.Text;
    timerEvent?: Phaser.Time.TimerEvent;
    hiddenInput?: HTMLInputElement;

    private static measureCanvas: HTMLCanvasElement | null = null;
    private static measureContext: CanvasRenderingContext2D | null = null;
    private static activeTextBox: TextBox | null = null;

    protected isFocus: boolean = false;
    protected charWidths: number[] = [];
    protected selectionStart?: number;
    protected selectionEnd?: number;
    protected isSelecting: boolean = false;
    protected maxWidth: number = 100;
    protected isComposing: boolean = false;
    protected compositionText: string = '';
    protected placeholder: string = '';
    protected previousValue: string = '';

    constructor(scene: BaseScene, config: T) {
        super(scene, config, 'TextBox');
        this._config = config;
        this.scene = scene;

        config.text = config.text ?? '';
        this.previousValue = config.text;
        this.placeholder = config.placeholder ?? '';
        this.Type = 'TextBox';
        this.reDraw(config);
    }

    reDraw(config?: T): void {
        if (!config) return;
        this._config = config;

        this.clearPreviousElements();
        this.initializeState(config);

        this.createLabel(config);
        this.createCursor(config);
        this.createSelection();

        this.setupEventHandlers();
        this.createHiddenInput();

        this.updateConfig(config);
        this.RefreshBounds();
        this.setupKeyboardEvents();
        this.updatePlaceholder();
    }

    private clearPreviousElements(): void {
        if (this.label) this.label.destroy();
        if (this.cursor) this.cursor.destroy();
        if (this.selection) this.selection.destroy();
        if (this.hiddenInput) this.hiddenInput.remove();
    }

    private initializeState(config: T): void {
        this.isFocus = false;
        this.maxWidth = config.width ?? 100;
        this.isSelecting = false;
        this.selectionStart = undefined;
        this.selectionEnd = undefined;
        this.isComposing = false;
        this.compositionText = '';
        this.charWidths = [];
        this.placeholder = config.placeholder ?? '';
        this.previousValue = config.text ?? '';
    }

    private createLabel(config: T): void {
        this.label = new Label(this.scene, config);
        if (config.text) {
            this.label.Text = config.text;
            if (config.textStyle) {
                this.label.Label.setStyle(config.textStyle);
            }
        } else {
            this.label.Text = this.placeholder;
            if (config.textStyle) {
                this.label.Label.setStyle({
                    ...config.textStyle,
                    color: '#999'
                });
            }
        }
        this.label.setPosition(0, 0);
        this.addChildAt(this.label, 0);
    }

    private updatePlaceholder(): void {
        if (!this.label || !this._config) return;

        if (!this.label.Text && !this.isComposing) {
            this.label.Text = this.placeholder;
            if (this._config.textStyle) {
                this.label.Label.setStyle({
                    ...this._config.textStyle,
                    color: '#999'
                });
            }
            this.cursor.setVisible(false);
        } else if (this.label.Text && this.label.Text !== this.placeholder) {
            if (this._config.textStyle) {
                this.label.Label.setStyle(this._config.textStyle);
            }
        }
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
        this.cursor.x = this.label.TextWidth + 2;
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

    private setupEventHandlers(): void {
        this.setEventInteractive();
        this.on('pointerover', this.handleOver, this);
        this.on('pointerout', this.handleOut, this);
        this.on('pointerup', this.handlePointerUp, this);
        this.on('pointerdown', this.handlePointerDown, this);
        this.on('pointermove', this.handlePointerMove, this);
    }

    private setupKeyboardEvents(): void {
        const keyboard = this.scene.input.keyboard;
        if (!keyboard) return;

        keyboard.off('keyup', this.handleKeyup, this);
        keyboard.off('keydown', this.handleKeydown, this);
        keyboard.on('keyup', this.handleKeyup, this);
        keyboard.on('keydown', this.handleKeydown, this);
    }

    handleKeydown(event: KeyboardEvent): void {
        if (!this.isFocus || !this.hiddenInput || TextBox.activeTextBox !== this) return;
        this.updateCursorPosition();
    }

    handleKeyup(event: KeyboardEvent): void {
        if (!this.isFocus || TextBox.activeTextBox !== this) return;

        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Backspace') {
            this.handleMoveCursor();
        }
    }

    getCursorPosition(): number {
        return this.hiddenInput?.selectionStart ?? 0;
    }

    private updateCharWidths(): void {
        this.charWidths = this.getCharacterWidths();
    }

    createHiddenInput(): void {
        this.hiddenInput = document.createElement('input');
        this.setupHiddenInputStyles();
        this.hiddenInput.value = this.label.Text === this.placeholder ? '' : this.label.Text;
        document.body.appendChild(this.hiddenInput);
        this.setupHiddenInputEvents();
    }

    private setupHiddenInputStyles(): void {
        if (!this.hiddenInput) return;
        this.hiddenInput.type = 'text';
        this.hiddenInput.style.position = 'absolute';
        this.hiddenInput.style.opacity = '0';
        this.hiddenInput.style.pointerEvents = 'none';
        this.hiddenInput.style.zIndex = '-1';
        this.hiddenInput.style.top = '-1000px';
    }

    private setupHiddenInputEvents(): void {
        if (!this.hiddenInput) return;

        this.hiddenInput.addEventListener('input', (e: Event) => {
            const inputEvent = e as InputEvent;
            if (!this.isComposing) {
                this.handleInput();
                this.updateCursorPosition();
            } else if (inputEvent.inputType === 'insertCompositionText') {
                this.compositionText = (e.target as HTMLInputElement).value;
                this.label.Text = this.compositionText;
                this.updateCharWidths();
                this.updateCursorPosition();
            }
            this.updatePlaceholder();
        });

        this.hiddenInput.addEventListener('compositionstart', () => {
            this.isComposing = true;
            this.compositionText = this.hiddenInput?.value || '';
        });

        this.hiddenInput.addEventListener('compositionend', () => {
            this.handleCompositionEnd();
            this.updateCursorPosition();
            this.updatePlaceholder();
        });

        this.hiddenInput.addEventListener('blur', () => {
            this.isFocus = false;
            this.cursor.setVisible(false);
            if (this.timerEvent) {
                this.timerEvent.remove();
                this.timerEvent = undefined;
            }
            this.updatePlaceholder();
        });

        this.hiddenInput.addEventListener('focus', () => {
            this.isFocus = true;
            if (this.label.Text !== this.placeholder) {
                this.cursor.setVisible(true);
                this.addTimerEvent();
            }
        });

        document.addEventListener('selectionchange', () => {
            if (TextBox.activeTextBox === this && document.activeElement === this.hiddenInput) {
                this.updateCursorPosition();
            }
        });
    }

    handleInput(): void {
        if (!this.hiddenInput) return;
        const newValue = this.hiddenInput.value;
        this.label.Text = newValue;
        this.updateCharWidths();
        this.updateSelectionAfterInput();
        this.updateCursorPosition();

        if (this._config?.onChange && newValue !== this.previousValue) {
            this._config.onChange(newValue);
            this.previousValue = newValue;
        }
    }

    handleCompositionEnd(): void {
        if (!this.hiddenInput) return;
        this.isComposing = false;
        this.compositionText = '';
        const newValue = this.hiddenInput.value;
        this.label.Text = newValue;
        this.updateCharWidths();
        this.updateSelectionAfterInput();
        this.updateCursorPosition();

        if (this._config?.onChange && newValue !== this.previousValue) {
            this._config.onChange(newValue);
            this.previousValue = newValue;
        }
    }

    getTextWidth(text: string): number {
        const context = this.getOrCreateMeasureContext();
        if (!context) return 0;

        const fontSize = this.label.Label.style.fontSize || '16px';
        const fontFamily = this.label.Label.style.fontFamily || 'Arial';
        context.font = `${fontSize} ${fontFamily}`;

        return context.measureText(text).width;
    }

    private getOrCreateMeasureContext(): CanvasRenderingContext2D | null {
        if (!TextBox.measureCanvas) {
            TextBox.measureCanvas = document.createElement('canvas');
            TextBox.measureContext = TextBox.measureCanvas.getContext('2d');
        }
        return TextBox.measureContext;
    }

    updateSelectionAfterInput(): void {
        if (!this.hiddenInput) return;

        const cursorPosition = this.hiddenInput.selectionStart ?? 0;
        this.selectionStart = cursorPosition;
        this.selectionEnd = cursorPosition;
        this.selection.width = 0;
        this.selection.setVisible(false);
        this.cursor.x = this.getCharacterXPosition(cursorPosition) + 2;
        if (this.label.Text !== this.placeholder) {
            this.cursor.setVisible(true);
        }
    }

    handleOver(): void {
        this.scene.input.setDefaultCursor('text');
    }

    handleOut(): void {
        this.scene.input.setDefaultCursor('default');
    }

    handlePointerDown(pointer: Phaser.Input.Pointer): void {
        if (TextBox.activeTextBox && TextBox.activeTextBox !== this) {
            this.deactivateTextBox(TextBox.activeTextBox);
        }

        TextBox.activeTextBox = this;
        this.isFocus = true;

        // Clear text if currently showing placeholder when clicked
        if (this.label.Text === this.placeholder) {
            this.label.Text = '';
            if (this.hiddenInput) this.hiddenInput.value = '';
            if (this._config?.textStyle) {
                this.label.Label.setStyle(this._config.textStyle);
            }
        }

        const worldPoint = this.getLabelWorldPoint();
        const cursorX = Math.min(pointer.x - worldPoint.x, this.label.TextWidth);

        this.cursor.x = cursorX + 2;
        if (this.label.Text !== this.placeholder) {
            this.cursor.setVisible(true);
            this.addTimerEvent();
        }

        this.resetSelection();
        this.setDomCursorPosition();
        this.setNativeCursorPosition();

        this.selection.x = this.cursor.x;
        this.selectionStart = this.getCursorPosition();
        this.selectionEnd = this.selectionStart;

        this.isSelecting = true;

        // Focus the hidden input after a short delay
        setTimeout(() => {
            this.hiddenInput?.focus();
        }, 10);
    }

    private deactivateTextBox(textBox: TextBox): void {
        textBox.isFocus = false;
        textBox.cursor.setVisible(false);
        textBox.selection.setVisible(false);
        if (textBox.timerEvent) {
            textBox.timerEvent.remove();
            textBox.timerEvent = undefined;
        }
        // Show placeholder when losing focus if there is no content
        textBox.updatePlaceholder();
    }

    private resetSelection(): void {
        this.selection.width = 0;
        this.selection.setVisible(false);
    }

    handlePointerMove(pointer: Phaser.Input.Pointer): void {
        if (!this.isSelecting || TextBox.activeTextBox !== this) return;

        const worldPoint = this.getLabelWorldPoint();
        const cursorX = Math.max(0, Math.min(pointer.x - worldPoint.x, this.label.TextWidth));

        this.selectionEnd = this.getCharacterIndexAtPosition(cursorX);
        this.updateSelection();
    }

    handlePointerUp(): void {
        this.isSelecting = false;
        if (this.selectionStart === this.selectionEnd) {
            this.selection.setVisible(false);
        }
    }

    updateCursorPosition(): void {
        if (!this.isFocus || TextBox.activeTextBox !== this) return;
        const cursorPosition = this.hiddenInput?.selectionStart ?? 0;
        this.updateCharWidths();
        this.cursor.x = this.getCharacterXPosition(cursorPosition) + 2;
        if (this.label.Text !== this.placeholder) {
            this.cursor.setVisible(true);
        }

        this.resetCursorBlink();
    }

    private resetCursorBlink(): void {
        if (!this.timerEvent) return;

        this.timerEvent.reset({
            delay: 800,
            callback: () => {
                if (this.label.Text !== this.placeholder) {
                    this.cursor.visible = !this.cursor.visible;
                }
            },
            loop: true
        });
    }

    updateSelection(): void {
        if (this.selectionStart === undefined || this.selectionEnd === undefined) return;

        const [start, end] = [
            Math.min(this.selectionStart, this.selectionEnd),
            Math.max(this.selectionStart, this.selectionEnd)
        ];

        const startX = this.getCharacterXPosition(start);
        const endX = this.getCharacterXPosition(end);

        this.updateSelectionVisuals(startX, endX);
        this.hiddenInput?.setSelectionRange(start, end);
    }

    private updateSelectionVisuals(startX: number, endX: number): void {
        this.selection.x = startX;
        this.selection.width = endX - startX;
        this.selection.setVisible(true);

        this.cursor.x = endX + 2;
        if (this.label.Text !== this.placeholder) {
            this.cursor.setVisible(true);
        }
    }

    handleMoveCursor(): void {
        this.setNativeCursorPosition();
    }

    setDomCursorPosition(): void {
        if (!this.hiddenInput) return;

        this.cursor.x = Math.min(this.cursor.x, this.label.TextWidth + 2);
        const characterIndex = this.getCharacterIndexAtPosition(this.cursor.x - 2);
        this.hiddenInput.setSelectionRange(characterIndex, characterIndex);
    }

    setNativeCursorPosition(): void {
        const characterIndex = this.getCursorPosition();
        this.cursor.x = this.getCharacterXPosition(characterIndex) + 2;
        if (this.label.Text !== this.placeholder) {
            this.cursor.setVisible(true);
        }
    }

    getCharacterIndexAtPosition(x: number): number {
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

    getCharacterWidths(): number[] {
        const context = this.getOrCreateMeasureContext();
        if (!context) return [];

        const fontSize = this.label.Label.style.fontSize || '16px';
        const fontFamily = this.label.Label.style.fontFamily || 'Arial';
        context.font = `${fontSize} ${fontFamily}`;

        const text = this.isComposing ? this.compositionText : (this.hiddenInput?.value ?? '');
        return Array.from(text).map(char => context.measureText(char).width);
    }

    getCharacterXPosition(index: number): number {
        const charWidths = this.getCharacterWidths();
        index = Math.min(index, charWidths.length);
        return charWidths.slice(0, index).reduce((sum, width) => sum + (width ?? 0), 0);
    }

    addTimerEvent(): void {
        if (this.timerEvent) return;
        this.timerEvent = this.scene.time.addEvent({
            delay: 800,
            callback: () => {
                if (this.label.Text !== this.placeholder) {
                    this.cursor.visible = !this.cursor.visible;
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    getLabelWorldPoint(): Phaser.Math.Vector2 {
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

        const keyboard = this.scene.input.keyboard;
        if (keyboard) {
            keyboard.off('keyup', this.handleKeyup);
            keyboard.off('keydown', this.handleKeydown);
        }
    }

    private destroyComponents(fromScene?: boolean): void {
        this.label.destroy(fromScene);
        this.cursor.destroy(fromScene);
        this.selection.destroy(fromScene);
        if (this.timerEvent) {
            this.timerEvent.remove();
            this.timerEvent.destroy();
        }
        this.hiddenInput?.remove();
    }
}
