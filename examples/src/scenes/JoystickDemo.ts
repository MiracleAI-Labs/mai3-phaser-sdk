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
            if (this.Joystick.left) {
                this.Sprite?.setX(this.Sprite?.x! - 1)
            }
            if (this.Joystick.right) {
                this.Sprite?.setX(this.Sprite?.x! + 1)
            }
            if (this.Joystick.up) {
                this.Sprite?.setY(this.Sprite?.y! - 1)
            }
            if (this.Joystick.down) {
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

        this.Joystick = this.mai3.add.joystick({
            x: 100,
            y: 200,
            base: {
                key: "avatar",
                frame: 0,
                radius: 50,
            },
            thumb: {
                key: "circle",
                frame: 0,
                radius: 25,
            }
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