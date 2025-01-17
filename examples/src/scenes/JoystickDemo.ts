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
            if (this.Joystick.force > 0) {
                const speed = 100 * this.Joystick.force;
                const angleInRadians = Phaser.Math.DegToRad(this.Joystick.joystickRotation);
                const velocityX = speed * Math.cos(angleInRadians);
                const velocityY = speed * Math.sin(angleInRadians);

                this.Sprite?.instance?.setVelocity(velocityX, velocityY);

                if (velocityX !== 0) {
                    this.Sprite?.instance?.setFlipX(velocityX < 0);
                }
            } else {
                this.Sprite?.instance?.setVelocity(0, 0);
            }
        }
    }
    create() {
        this.createReturnButton();

        this.createJoystick()
    }

    createJoystick() {

        this.Sprite = this.mai3.add.sprite({
            x: 400,
            y: 200,
            width: 64,
            height: 100,
            key: "fight96",
            frame: 0,
            leftVelocity: 300,
            rightVelocity: 300,
            upVelocity: 300,
            downVelocity: 300,
            enableMove: true,
        });

        this.Joystick = this.mai3.add.joystick({
            x: 100,
            y: 200,
            base: {
                key: "avatar2",
                frame: 0,
                radius: 50,
            },
            thumb: {
                key: "logo",
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