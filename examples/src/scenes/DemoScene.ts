import { BaseScene, Grid } from '../../../dist';
export class DemoScene extends BaseScene {
    private grid!: Grid;

    constructor() {
        super('DemoScene');
    }

    preload() {
        super.preload();
    }

    async create() {
        this.createDemoNavigation();
    }

    private createDemoNavigation() {
        this.grid = new Grid(this, {
            x: 100,
            y: 100,
            width: 600,
            height: 500,
            padding: { all: 20 },
            rowGap: 10,
            columnGap: 10,
            rows: 6,
            columns: 3,
            autoFill: true,
            draggable: false,
            borderWidth: 6,
            borderColor: 0xB03060,
            backgroundColor: 0x333333,
            alignment: { horizontal: 'center', vertical: 'middle' },
            radius: 10,
        });

        this.add.existing(this.grid);

        const demoScenes = [
            { name: 'Toast Demo', scene: 'ToastDemo', color: 0x4CAF50 },
            { name: 'Grid Demo', scene: 'GridDemo', color: 0x2196F3 },
            { name: 'Tabs Demo', scene: 'TabsDemo', color: 0xFFC107 },
            { name: 'Checkbox Demo', scene: 'CheckboxDemo', color: 0xFF5722 },
            { name: 'Slider Demo', scene: 'SliderDemo', color: 0x9C27B0 },
            { name: 'Progress Bar Demo', scene: 'ProgressBarDemo', color: 0x795548 },
            { name: 'Dialog Demo', scene: 'DialogDemo', color: 0x607D8B },
            { name: 'Label Demo', scene: 'LabelDemo', color: 0x3F51B5 },
            { name: 'Image Demo', scene: 'ImageDemo', color: 0x009688 },
            { name: 'Button Demo', scene: 'ButtonDemo', color: 0xCDDC39 },
            { name: 'Resize Demo', scene: 'ResizeDemo', color: 0xFF9800 },
            { name: 'Text Box Demo', scene: 'TextBoxDemo', color: 0x8BC34A },
            { name: 'Sprite Demo', scene: 'SpriteDemo', color: 0x4CA600 },
            { name: 'TON Demo', scene: 'TonDemo', color: 0x009688 },
            { name: 'ScrollView Demo', scene: 'ScrollViewDemo', color: 0x009688 },
            { name: 'ListView Demo', scene: 'ListViewDemo', color: 0x009688 },
        ];

        const rowButtons = [];
        for (let i = 0; i < demoScenes.length; i++) {      
            const demo = demoScenes[i];
            rowButtons.push({
                type: 'TextButton',
                text: demo.name,
                width: 150,
                height: 60,
                textStyle: { fontFamily: 'Arial', fontSize: '20px', color: '#FFFFFF' },
                backgroundColor: demo.color,
                borderColor: Phaser.Display.Color.IntegerToColor(demo.color).darken(15).color,
                borderWidth: 2,
                radius: 10,
                columnSpan: 4,
                handleHover: { audio: "sfx-hover" },
                handleDown: { audio: "sfx-press" },
                handleUp: {
                    handleFn: () => {
                        this.scene.start(demo.scene);
                    }
                },
            });
        }
        this.grid.addItems(rowButtons);
    }
    
    update() { }
}