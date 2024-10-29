import { BaseScene, Container, Grid } from "../../../dist";
import { Sprite } from "../../../dist/ui/Sprite";

export class GridDemo extends BaseScene {
  private grid!: Grid;
  private catGrid!: Grid;

  constructor() {
    super("GridDemo");
  }

  preload() {
    super.preload();

    this.load.image("cat0", "/assets/images/cat0.png");
    this.load.image("cat1", "/assets/images/cat1.png");
    this.load.image("hexagon", "/assets/images/hexagon.png");
    this.load.image("cushion", "/assets/images/cushion.png");
  }

  async create() {
    this.createDemoNavigation();
    this.createCatGrid();
    this.createReturnButton();
  }

  private createDemoNavigation() {
    this.grid = new Grid(this, {
      x: 100,
      y: 100,
      width: 600,
      height: 400,
      padding: { all: 20 },
      rowGap: 10,
      columnGap: 10,
      rows: 4,
      columns: 3,
      // autoFill: true,
      draggable: true,
      borderWidth: 6,
      borderColor: 0xcd8500,
      backgroundColor: 0x000000,
      alignment: { horizontal: "center", vertical: "middle" },
      radius: 10,
      handleDragEnd: (
        dragChild: Container | undefined,
        targetChild: Container | undefined,
        pointer: Phaser.Input.Pointer
      ) => {
        if (targetChild) {
          this.grid.swapChildren(dragChild!, targetChild);
        }
      }, 
    });

    this.add.existing(this.grid);

    const demoScenes = [
      { name: "Drag Me 1", scene: "ToastDemo", color: 0x4caf50 },
      { name: "Drag Me 2", scene: "GridDemo", color: 0x2196f3 },
      { name: "Drag Me 3", scene: "TabsDemo", color: 0xffc107 },
      { name: "Drag Me 4", scene: "CheckboxDemo", color: 0xff5722 },
      { name: "button5", scene: "SliderDemo", color: 0x9c27b0 },
      { name: "button6", scene: "ProgressBarDemo", color: 0x795548 },
      { name: "button7", scene: "DialogDemo", color: 0x607d8b },
      { name: "button8", scene: "LabelDemo", color: 0x3f51b5 },
      { name: "button9", scene: "ImageDemo", color: 0x009688 },
    ];

    const rowButtons = [];
    for (let i = 0; i < demoScenes.length; i++) {
      const demo = demoScenes[i];
      const cellItems = [];
      cellItems.push({
        width: 150,
        height: 60,
        type: "TextButton",
        text: demo.name,
        draggable: true,
        textStyle: { fontFamily: "Arial", fontSize: "20px", color: "#FFFFFF" },
        backgroundColor: demo.color,
        borderColor: Phaser.Display.Color.IntegerToColor(demo.color).darken(15)
          .color,
        borderWidth: 2,
        radius: 10,
        columnSpan: 4,
        handleHover: { audio: "sfx-hover" },
        handleDown: { audio: "sfx-press" },
        handleUp: {
          handleFn: () => {
            // this.scene.start(demo.scene);
          },
        },
      });

      cellItems.push({
        x: 140,
        y: 10,
        width: 40,
        height: 40,
        type: "Image",
        key: "cangshu",
        draggable: false,
      });

      rowButtons.push(cellItems);
    }

    console.log("rowButtons", rowButtons);
    this.grid.addCellItems(rowButtons);

    this.grid.addItems([
      {
        type: "TextButton",
        text: "Button 10",
        width: 150,
        height: 60,
        textStyle: { fontFamily: "Arial", fontSize: "20px", color: "#FFFFFF" },
        backgroundColor: 0xffc107,
        borderColor:
          Phaser.Display.Color.IntegerToColor(0xff5722).darken(15).color,
        borderWidth: 2,
        radius: 10,
        columnSpan: 4,
        handleHover: { audio: "sfx-hover" },
        handleDown: { audio: "sfx-press" },
        handleUp: {
          handleFn: () => {
            // this.scene.start(demo.scene);
          },
        },
      },
    ]);
  }

  private createCatGrid() {
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

	this.catGrid = new Grid(this, {
    x: 100,
    y: 510,
    width: 600,
    height: 300,
    padding: { all: 10 },
    rowGap: 10,
    columnGap: 10,
    rows: 3,
    columns: 4,
    //   autoFill: true,
    draggable: true,
    borderWidth: 6,
    borderColor: 0xcd8500,
    backgroundColor: 0x000000,
    // alignment: { horizontal: "center", vertical: "middle" },
    radius: 10,
    handleDragStart: (
      child: Container | undefined,
      pointer: Phaser.Input.Pointer,
      dragX: number,
      dragY: number
    ) => {
		if (child && child.Type === 'Sprite') {
			const sprite = child as Sprite;
			sprite.instance?.play("stop");
		}
    },
    handleDragEnd: (
      dragChild: Container | undefined,
      targetChild: Container | undefined,
      pointer: Phaser.Input.Pointer
    ) => {
      if (targetChild) {
        this.catGrid.swapChildren(dragChild!, targetChild);
      }
      
      if (dragChild && targetChild) {
        this.catGrid.removeChild(targetChild);
      }

      if (dragChild?.Type === "Sprite") {
        const sprite = dragChild as Sprite;
        sprite.instance?.play("walk");
      }
    },    
  });

  this.add.existing(this.catGrid);
  console.log("aa", this.catGrid.getCellItemsAtIndex(0));

    const cellItems = [];
    let index = 0;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        cellItems.push([
          {
            type: "Image",
            key: "cushion",
            width: 75,
            height: 30,
            x: 37.5,
            y: 60,
            draggable: false,
          },
		  {
			id: 'sprite_' + index,
            type: "Sprite",
            key: `cat${index % 2}`,
            x: 48,
            y: 10,
            width: 55.8,
            height: 59.4,
            draggable: true,
          },
          {
            type: "Image",
            key: "hexagon",
            width: 30,
            height: 30,
            x: 76,
            y: 0,
          },
          {
            type: "Text",
            text: (index + 1).toString(),
            textStyle: {
              fontFamily: "Arial",
              color: "#000",
              fontSize: "12px",
            },
            x: 87.5,
            y: 5,
          },
        ]);

        index++;
      }
    }
    this.catGrid.addCellItems(cellItems);

    cellItems.forEach((_, index) => {
      const item = this.catGrid.getCellItemsAtIndex(index);
      item.forEach((child: any) => {
        if (child.Type === "Sprite") {
          const sprite = child as Sprite;
          sprite.instance?.play("walk");
        }
      });
    });
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

  update() {}
}
