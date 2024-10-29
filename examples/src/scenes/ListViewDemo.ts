import { BaseScene, Container, ListView, Sprite } from "../../../dist";
export class ListViewDemo extends BaseScene {
  private verticalListView!: ListView;
  constructor() {
    super("ListViewDemo");
  }

  preload() {
    super.preload();

    this.load.image("cat0", "/assets/images/cat0.png");
    this.load.image("cat1", "/assets/images/cat1.png");
    this.load.image("hexagon", "/assets/images/hexagon.png");
    this.load.image("cushion", "/assets/images/cushion.png");
    this.load.image("scoreBox", "/assets/images/scoreBox.png");
    this.load.image("play", "/assets/images/button/play.png");
  }

  create() {
    this.createListView();
    this.createReturnButton();
  }

  private createListView() {
    this.verticalListView = new ListView(this, {
      x: 150,
      y: 150,
      width: 600,
      height: 800,
      borderWidth: 10,
      backgroundColor: 0xffffff,
      padding: { all: 0 },
      direction: "y",
      showScrollbar: true,
    });
    this.add.existing(this.verticalListView);

    this.anims.create({
      key: "walk",
      frames: [{ key: "cat0" }, { key: "cat1" }],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "stop",
      frames: [{ key: "cat0" }],
      frameRate: 10,
      repeat: 1,
    });

    this.addListViewItems(this.verticalListView);
  }

  private async addListViewItems(listView: ListView) {
    const cellItems: any[] = [];
    for (let row = 0; row < 100; row++) {
      cellItems[row] = {
        type: "Container",
        childConfigs: [],
        width: 600,
        height: 150,
        handleSetChildrenAsyncEnd: (children: Container[]) => {
          children.forEach((child: Container) => {
            if (child.Type === "Sprite") {
              const sprite = child as Sprite;
              sprite.instance?.play("walk");
            }
          });
        },
      };
      cellItems[row].childConfigs = [
        {
          type: "Image",
          key: "scoreBox",
          width: 580,
          height: 140,
          x: 0,
          y: 0,
        },
        {
          id: "sprite_" + row,
          type: "Sprite",
          key: `cat${row % 2}`,
          x: 148,
          y: 25,
          width: 55.8,
          height: 59.4,
        },
        {
          type: "Image",
          key: "hexagon",
          width: 30,
          height: 30,
          x: 176,
          y: 15,
        },
        {
          type: "Text",
          text: `${row}`,
          textStyle: {
            fontFamily: "Arial",
            color: "#000",
            fontSize: "12px",
          },
          x: row > 9 ? 183.5 : 187.5,
          y: 22,
        },
        {
          type: "Text",
          text: `速度`,
          textStyle: {
            fontFamily: "Arial",
            color: "#000",
            fontSize: "12px",
          },
          x: 410,
          y: 26,
        },
        {
          type: "Label",
          width: 100,
          height: 20,
          textAlign: "center",
          text: `+9999T/s`,
          textStyle: {
            fontFamily: "Arial",
            color: "#000",
            fontSize: "12px",
          },
          borderWidth: 1,
          borderColor: 0x000000,
          backgroundColor: 0xA0C75B,
          x: 440,
          y: 22,
        },
        {
          type: "ImageButton",
          texture: "play",
          width: 80,
          height: 30,
          x: 460,
          y: 50,
        },
      ];
    }
    listView.setItemsAsync(cellItems);
  }

  private createReturnButton() {
    this.mai3.add.textButton({
      x: 10,
      y: 30,
      width: 150,
      height: 50,
      text: "Return",
      backgroundColor: 0x4caf50,
      borderColor: 0x45a049,
      borderWidth: 2,
      radius: 10,
      textStyle: {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#FFFFFF",
      },
      handleUp: {
        handleFn: () => {
          this.scene.start("DemoScene");
        },
      },
    });
  }
}
