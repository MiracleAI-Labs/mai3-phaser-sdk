import Phaser from 'phaser';
import { TextBoxConfig } from '../types';
import BaseScene from '../scene';
import { Label } from './Label';
import { TextBox } from './TextBox';

export class TextArea extends TextBox {
    
    declare config: TextBoxConfig;
    declare label: Label;
    declare selection: Phaser.GameObjects.Rectangle;
    declare cursor: Phaser.GameObjects.Text;
    declare timerEvent?: Phaser.Time.TimerEvent;
    declare hiddenTextArea?: HTMLTextAreaElement;
    declare selectionStart?: number;
    declare selectionEnd?: number;

    isFocus: boolean;
    charWidths: number[] = [];
    isSelecting: boolean = false;
    maxWidth: number;
    maxHeight: number;
    lineHeight: number;

    constructor(scene: BaseScene, config: TextBoxConfig) {
        super(scene, config);
        this.config = config;
        this.isFocus = false;
        this.maxWidth = config.width ?? 100;
        this.maxHeight = config.height ?? 100;
        this.lineHeight = config.textStyle?.fontSize ? 
            parseInt(config.textStyle.fontSize.toString()) : 16;

        this.createMultilineLabel();

        this.setEventInteractive();
        this.on('pointerover', this.handleOver, this);
        this.on('pointerout', this.handleOut, this);
        this.on('pointerup', this.handlePointerUp, this);
        this.on('pointerdown', this.handlePointerDown, this);
        this.on('pointermove', this.handlePointerMove, this);

        if (scene.input.keyboard) {
            scene.input.keyboard.on('keydown', this.handleKeyDown, this);
        }

        this.createHiddenTextArea();
    }

    createMultilineLabel() {
        this.label.destroy();
        this.label = this.scene.mai3.make.label({
            ...this.config,
            height: this.maxHeight,
            isWordWrap: true,
            autoHeight: true
        });
        this.label.setPosition(0, 0);
        this.addChildAt(this.label, 0);
    }

    handleKeyDown(event: KeyboardEvent) {
        if (!this.isFocus) return;

        if (event.key === 'Enter') {
            event.preventDefault();
            this.insertTextAtCursor('\n');
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || 
                   event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            setTimeout(() => this.updateCursorPosition(), 0);
        } else {
            super.handleKeyup(event);
        }
        this.updateTextFromTextArea();
    }

    createHiddenTextArea() {
        this.hiddenTextArea = document.createElement('textarea');
        this.hiddenTextArea.style.position = 'absolute';
        this.hiddenTextArea.style.opacity = '0';
        this.hiddenTextArea.style.pointerEvents = 'none';
        this.hiddenTextArea.style.zIndex = '-1';
        this.hiddenTextArea.value = this.label.Text;
        document.body.appendChild(this.hiddenTextArea);

        this.hiddenTextArea.addEventListener('input', () => {
            this.updateTextFromTextArea();
        });
    }

    updateTextFromTextArea() {
        if (this.hiddenTextArea) {
            this.label.Text = this.hiddenTextArea.value;
            this.updateCursorPosition();
        }
    }

    getCursorPosition(): number {
        return this.hiddenTextArea?.selectionStart ?? 0;
    }

    setCursorPosition(position: number) {
        this.hiddenTextArea?.setSelectionRange(position, position);
        this.updateCursorPosition();
    }

    updateCursorPosition() {
        const cursorPosition = this.getCursorPosition();
        const lines = this.label.Text.split('\n');
        let currentLineIndex = 0;
        let accumulatedLength = 0;

        for (let i = 0; i < lines.length; i++) {
            if (cursorPosition <= accumulatedLength + lines[i].length) {
                currentLineIndex = i;
                break;
            }
            accumulatedLength += lines[i].length + 1; // +1 for newline character
        }

        const offsetInLine = cursorPosition - accumulatedLength;
        this.cursor.x = this.getCharacterXPosition(offsetInLine, lines[currentLineIndex]);
        this.cursor.y = currentLineIndex * this.lineHeight;

        // 确保光标在可见区域内
        if (this.cursor.y + this.cursor.height > this.maxHeight) {
            this.label.y = this.maxHeight - (this.cursor.y + this.cursor.height);
        } else if (this.cursor.y < 0) {
            this.label.y = -this.cursor.y;
        }
    }

    override getCharacterXPosition(index: number, line?: string): number {
        if (line === undefined) {
            return super.getCharacterXPosition(index);
        }
        const textStyle = this.label.Label.style as Phaser.GameObjects.TextStyle;
        const context = this.scene.sys.game.canvas.getContext('2d');
        if (context) {
            context.font = `${textStyle.fontSize}px ${textStyle.fontFamily}`;
            return context.measureText(line.substring(0, index)).width;
        }
        return 0;
    }

    insertTextAtCursor(text: string) {
        const cursorPosition = this.getCursorPosition();
        const currentText = this.hiddenTextArea!.value;
        const newText = currentText.slice(0, cursorPosition) + text + currentText.slice(cursorPosition);
        this.hiddenTextArea!.value = newText;
        this.setCursorPosition(cursorPosition + text.length);
        this.updateTextFromTextArea();
    }

    destroy(fromScene?: boolean): void {
        if (this.hiddenTextArea) {
            document.body.removeChild(this.hiddenTextArea);
        }
        super.destroy(fromScene);
    }
}