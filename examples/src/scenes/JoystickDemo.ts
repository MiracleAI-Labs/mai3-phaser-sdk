import { BaseScene, Sprite } from '../../../dist';
import { Joystick } from '../../../dist/ui/Joystick';

export class JoystickDemo extends BaseScene {
    Joystick?: Joystick;
    Sprite?: Sprite
    constructor() {
        super("JoystickDemo");
    }

    preload() {
        super.preload()
        this.load.spritesheet("fight96", "/assets/sprites/fight96.png", { frameWidth: 32, frameHeight: 50 });

    }
    update(time: number, delta: number) {
        super.update(time, delta)
        if (this.Joystick) {
            const cursorKeys = this.Joystick.instance?.createCursorKeys()
            if (cursorKeys?.left.isDown) {
                console.log("cursorKeys==>left");
                this.Sprite?.setX(this.Sprite?.x! - 1)
            }
            if (cursorKeys?.right.isDown) {
                console.log("cursorKeys==>right");
                this.Sprite?.setX(this.Sprite?.x! + 1)
            }
            if (cursorKeys?.up.isDown) {
                console.log("cursorKeys==>up");
                this.Sprite?.setY(this.Sprite?.y! - 1)
            }
            if (cursorKeys?.down.isDown) {
                console.log("cursorKeys==>down");
                this.Sprite?.setY(this.Sprite?.y! + 1)
            }
        }
    }
    create() {
        this.createReturnButton();

        this.createJoystick()

    }

    createJoystick() {

        this.Sprite = this.mai3.add.sprite({
            x: 200,
            y: 200,
            width: 64,
            height: 100,
            key: "fight96",
            frame: 0,
        });

        this.Joystick = this.mai3.add.Joystick({
            x: 100,
            y: 200,
            radius: 50,
            base: this.add.circle(0, 0, 50, 0x888888),
            thumb: this.add.circle(0, 0, 50 / 2, 0xcccccc)
        })
    }
    createReturnButton() {
        this.mai3.add.textButton({
            x: 10,
            y: 10,
            width: 150,
            height: 50,
            text: "返回DemoScene",
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