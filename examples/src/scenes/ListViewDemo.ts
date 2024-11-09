import { BaseScene, Dialog, Container } from "../../../dist";
import { BaseConfig, DialogConfig } from "../../../dist/types";
export class ListViewDemo extends BaseScene {
  private dialog!: Dialog;
  private goodImageIds: string[] = [];
  constructor() {
    super("ListViewDemo");
  }

  preload() {
    super.preload();
  }

  create() {
    this.createDialog();
    this.createReturnButton();
    this.dialog.show();
  }

  private createDialog() {
    const dialogConfig: DialogConfig = {
      width: 500,
      height: 900,
      frame: 0,
      leftWidth: 20,
      rightWidth: 20,
      topHeight: 60,
      bottomHeight: 60,
      texture: "l-bg",
      isShowCloseButton: true,
      closeButtonConfig: {
        type: "ImageButton",
        width: 70,
        height: 70,
        texture: "l-close",
        handleUp: {
          handleFn: () => {
            this.dialog.hide();
          },
        },
      },
    };

    this.dialog = this.mai3.add.dialog(dialogConfig);
    this.dialog.hide();

    this.dialog.addItems([
      {
        x: 10,
        y: 200,
        width: 480,
        height: 640,
        borderWidth: 0,
        padding: { all: 0 },
        direction: "y",
        showScrollbar: false,
        type: "ListView",
        itemHeight: 150,
        itemDatas: this.createListViewItemDatas(),
      },
    ]);

    // Add tween animation to create swing effect
    this.goodImageIds.forEach((id) => {
      this.tweens.add({
        targets: this.dialog.findChild(id),
        angle: 15,
        duration: 1000,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      });
    });

    this.createDialogTitle();
  }

  private createListViewItemDatas(): BaseConfig[][] {
    const itemDatas: BaseConfig[][] = [];
    const actionButtonTextures: BaseConfig[] = [
      {
        texture: "l-blue-button",
        text: "免费",
        textStyle: {
          fontFamily: "Arial",
          fontSize: "12px",
          color: "#FFFFFF",
        },
      },
      {
        texture: "l-yellow-button",
        text: "1500",
        textStyle: {
          fontFamily: "Arial",
          fontSize: "12px",
          color: "#7D4813",
        },
        icon: "l-gold",
        iconWidth: 24,
        iconHeight: 24,
      },
      {
        texture: "l-green-button",
        text: "5",
        textStyle: { fontFamily: "Arial", fontSize: "12px", color: "#2E4F09" },
        icon: "l-fish",
        iconWidth: 24,
        iconHeight: 24,
      },
      {
        texture: "l-grey-button",
        text: "",
      },
    ];
    for (let row = 0; row < 100; row++) {
      itemDatas[row] = [
        {
          type: "Image",
          key: "l-item",
          width: 450,
          height: 120,
          x: 0,
          y: 0,
        },
        {
          id: "sprite_" + row,
          type: "Sprite",
          key: `l-cat${(row % 4) + 1}`,
          x: 72,
          y: 10,
          width: 100,
          height: 100,
        },
        {
          type: "Image",
          key: "l-star",
          width: 34,
          height: 40,
          x: 140,
          y: 15,
        },
        {
          type: "Text",
          text: `${row}`,
          textStyle: {
            fontFamily: "Arial",
            color: "#C4954E",
            fontSize: "12px",
          },
          x: row > 9 ? 150 : 154,
          y: 28,
        },
        {
          type: "Text",
          text: `速度`,
          textStyle: {
            fontFamily: "Arial",
            color: "#805638",
            fontSize: "12px",
          },
          x: 300,
          y: 37,
        },
        {
          type: "Label",
          x: 340,
          y: 30,
          text: "+59/s",
          width: 80,
          height: 26,
          texture: "l-speed",
          textStyle: {
            fontFamily: "Arial",
            fontSize: "12px",
            color: "#2E4F09",
          },
          padding: { x: 12, y: 8 },
        },
        {
          type: "Image",
          key: "l-gold",
          width: 22,
          height: 22,
          x: 390,
          y: 33,
        },
        {
          type: "TextButton",
          width: 124,
          height: 30,
          x: 300,
          y: 64,
          ...actionButtonTextures[row % 4],
        },
      ];
      if (row % 4 === 2) {
        const id = "good_" + row;
        this.goodImageIds.push(id);
        itemDatas[row].push({
          id: id,
          type: "Image",
          key: "l-good",
          width: 62,
          height: 42,
          x: 390,
          y: 55,
        });
      }
    }
    return itemDatas;
  }

  private createDialogTitle() {
    this.dialog.addItems([
      {
        type: "Text",
        x: 140,
        y: 70,
        text: "猫店",
        width: 220,
        textAlign: "center",
        textStyle: {
          fontFamily: "Arial",
          fontSize: "20px",
          color: "#714221",
        },
      },
      {
        type: "Image",
        key: "l-gold",
        width: 40,
        height: 40,
        x: 50,
        y: 130,
      },
      {
        type: "Text",
        x: 90,
        y: 140,
        text: "22275K",
        textAlign: "center",
        textStyle: {
          fontFamily: "Arial",
          fontSize: "20px",
          color: "#805638",
        },
      },
      {
        type: "Image",
        key: "l-fish",
        width: 40,
        height: 40,
        x: 300,
        y: 130,
      },
      {
        type: "Text",
        x: 350,
        y: 140,
        text: "0",
        textAlign: "center",
        textStyle: {
          fontFamily: "Arial",
          fontSize: "20px",
          color: "#805638",
        },
      },
      {
        type: "ImageButton",
        texture: "l-add",
        width: 40,
        height: 40,
        x: 370,
        y: 130,
      },
    ]);
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
