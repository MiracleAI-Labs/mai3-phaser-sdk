import { BaseScene, Checkbox } from '../../../dist';

export class CheckboxDemo extends BaseScene {
    constructor() {
        super('CheckboxDemo');
    }

    preload() {
        super.preload();
    }

    async create() {
        //With image
        this.createCheckboxWithImages();
        this.createCheckboxGroup();
        this.createMultiSelectCheckboxGroup();
        this.createReturnButton();
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

    //With image
    private createCheckboxWithImages() {
        const ckbConfig = {
            x: 10,
            y: 350,
            text: "Mai3",
            isChecked: false,
            labelSpace: 10,
            textStyle: {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#fff',
                fontStyle: '',//bold or 100-1200
            },
            handleSelect(ckb: Checkbox) {
                console.log('checked: ', ckb.isChecked);
            },
            iconWidth: 50,
            iconHeight: 50,
            unCheckedTexture: "unChecked",
            checkedTexture: "checked",
        };

        const ckb = this.mai3.add.checkbox(ckbConfig);
        // ckb.debugDrawBorderLine();
        // ckb.debugHitArea();
        // ckb.setEventInteractive();
    }

    private createCheckboxGroup() {
        const checkboxGroup = this.mai3.add.checkboxGroup({
            x: 10,
            y: 500,
            orientation: 'horizontal',
            labelSpace: 10,
            items: [
                { text: 'Option 1---Single Select', value: 'option1' },
                { text: 'Option 2', value: 'option2' },
                { text: 'Option 3', value: 'option3' }
            ],
            textStyle: {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#fff',
                fontStyle: '',//bold or 100-1200
            },
            iconWidth: 50,
            iconHeight: 50,
            unCheckedTexture: "unChecked",
            checkedTexture: "checked",
        });

        checkboxGroup.on('change', (selectedItems: string[]) => {
            console.log('Selected items:', selectedItems);
        });
    }

    createMultiSelectCheckboxGroup() {
        const checkboxGroup = this.mai3.add.checkboxGroup({
            x: 10,
            y: 600,
            orientation: 'vertical',
            multiSelect: true,
            labelSpace: 10,
            isCircle: false,
            items: [
                { text: 'Option 1---Multi Select', value: 'option1' },
                { text: 'Option 2', value: 'option2' },
                { text: 'Option 3', value: 'option3' }
            ],
            textStyle: {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#fff',
                fontStyle: '',//bold or 100-1200
            },
            iconWidth: 50,
            iconHeight: 50,
            unCheckedTexture: "unChecked",
            checkedTexture: "checked",
        });

        checkboxGroup.on('change', (selectedItems: string[]) => {
            console.log('Selected items:', selectedItems);
        });
    }

    update() { }
}