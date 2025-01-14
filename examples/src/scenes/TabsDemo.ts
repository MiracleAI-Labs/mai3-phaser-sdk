import { BaseScene, Tabs } from "../../../dist";
export class TabsDemo extends BaseScene {
  private tabs!: Tabs;

  constructor() {
    super('TabsDemo');
  }

  preload() {
    super.preload();
  }

  async create() {
    this.createTabs();
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

  private createTabs() {
    this.tabs = this.mai3.add.tabs({
      x: 10,
      y: 500,
      height: 120,
      padding: { all: 10 },
      background: 0xff0000,
      texture: 'tabsBg',
      fontColor: '#000',
      items: [
        { title: 'tab1', texture: 'tabs1', activeImg: 'tabs1-hover' },
        { title: 'tab2', texture: 'tabs2', activeImg: 'tabs2-hover' },
        { title: 'tab3', texture: 'tabs3', activeImg: 'tabs3-hover' },
        { title: 'tab4', texture: 'tabs4', activeImg: 'tabs4-hover' },
        { title: 'tab5', texture: 'tabs5', activeImg: 'tabs5-hover' }
      ]
    });

    // 添加标签切换事件监听
    this.tabs.on('tabChange', (index: number) => {
      const toast = this.mai3.add.toast({
        x: 400,
        y: 300,
        width: 200,
        height: 60,
        text: `Switched to tab ${index + 1}`,
        type: 'info',
        textAlign: 'center',
        animationType: 'fade',
        backgroundColor: 0x008B00,
        textStyle: {
          fontFamily: 'Arial',
          fontSize: '18px',
          color: '#FFFFFF',
        },
        duration: 2000
      });
      toast.show();
      // 在这里可以添加切换标签时的逻辑
    });
  }

  update() { }
}