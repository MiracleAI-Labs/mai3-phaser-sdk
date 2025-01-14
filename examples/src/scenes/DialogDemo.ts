import { BaseScene, Dialog } from '../../../dist'
import { DialogConfig } from "../../../dist/types";

export class DialogDemo extends BaseScene {
    private dialog!: Dialog;

    constructor() {
        super('DialogDemo');
    }

    preload() {
        super.preload();
    }

    async create() {
        this.createDialog();
        this.createReturnButton();
        this.createShowDialogButton();
        this.dialog.show();
    }

    private createReturnButton() {
        this.mai3.add.textButton({
            x: 10,
            y: 30,
            width: 150,
            height: 50,
            text: "Return",
            backgroundColor: 0x4CAF50,
            borderColor: 0x45A049,
            borderWidth: 2,
            radius: 10,
            textStyle: {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#FFFFFF',
            },
            handleUp: {
                handleFn: () => {
                    this.scene.start('DemoScene');
                }
            },
        });
    }

    private createShowDialogButton() {
        this.mai3.add.textButton({
            x: 200,
            y: 200,
            width: 150,
            height: 50,
            text: "Show Dialog",
            backgroundColor: 0x2196F3,
            borderColor: 0x1E88E5,
            borderWidth: 2,
            radius: 10,
            textStyle: {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#FFFFFF',
            },
            handleUp: {
                handleFn: () => {
                    this.dialog.show();
                }
            },
        });
    }

    private createDialog() {
        const dialogConfig: DialogConfig = {
            width: 694,
            height: 606,
            frame: 0,
            leftWidth: 20,
            rightWidth: 20,
            topHeight: 60,
            bottomHeight: 60,
            texture: 'dialog-bg',
            closeButton: {
                type: 'ImageButton',
                width: 60,
                height: 70,
                texture: "dialog-close",
                handleUp: {
                    handleFn: () => {
                        this.dialog.hide();
                    }
                },
            }
        };

        this.dialog = this.mai3.add.dialog(dialogConfig);
        this.dialog.hide();

        const items = this.createDialogItems();
        this.dialog.addItems(items);
    }

    private createDialogItems() {
        const items: any[] = [];

        // Add title
        items.push({
            type: 'Text',
            x: 280,
            y: 18,
            text: 'Title Info',
            autoWidth: true,
            autoHeight: true,
            isWordWrap: true,
            textStyle: {
                fontFamily: 'Arial',
                fontSize: '30px',
                color: '#F9D59D',
            }
        });

        // Add text box
        items.push({
            type: 'Label',
            x: 80,
            y: 130,
            width: 530,
            height: 250,
            text: "Phaser is a fast free, and fun open source HTML5 game framework",
            borderWidth: 6,
            borderColor: 0xCEBBA3,
            backgroundColor: 0xA78E6B,
            backgroundAlpha: 1,
            textStyle: {
                fontFamily: 'Arial',
                fontSize: '30px',
                color: '#fff',
            },
            isWordWrap: true,
            padding: { all: 20 }
        });

        // Add buttons
        items.push(this.createFooterButtonConfig());
        items.push(this.createFooterCloseButtonConfig());

        return items;
    }

    private createFooterButtonConfig() {
        return {
            type: 'ImageButton',
            x: 80,
            y: 460,
            width: 214,
            height: 76,
            texture: "dialog-start-btn",
            handleHover: {
                audio: "sfx-hover",
                texture: "dialog-start-btn",
            },
            handleOut: {
                texture: "dialog-start-btn",
            },
            handleDown: {
                audio: "sfx-press",
                texture: "dialog-start-btn",
                handleFn: () => {
                    console.log("handleDown");
                }
            },
            handleUp: {
                handleFn: () => {
                    this.dialog.hide();
                }
            },
        };
    }

    private createFooterCloseButtonConfig() {
        return {
            type: 'ImageButton',
            x: 400,
            y: 460,
            width: 214,
            height: 76,
            texture: "dialog-close-btn",
            handleHover: {
                audio: "sfx-hover",
                texture: "dialog-close-btn",
            },
            handleOut: {
                texture: "dialog-close-btn",
            },
            handleDown: {
                audio: "sfx-press",
                texture: "dialog-close-btn",
                handleFn: () => {
                    console.log("handleDown");
                }
            },
            handleUp: {
                handleFn: () => {
                    this.dialog.hide();
                }
            },
        };
    }

    update() { }
}