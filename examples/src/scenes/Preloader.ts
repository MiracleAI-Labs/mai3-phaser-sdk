import { BaseScene, ProgressBar } from "../../../dist";
import { ProgressBarConfig } from "../../../dist/types";
export class Preloader extends BaseScene {
    config?: ProgressBarConfig;
    progressBar1?: ProgressBar;

    nextScene?: string
    constructor() {
        super("Preloader");
    }
    preload() {
        super.preload();

        this.loadskill()
        this.loadDecorations();
        this.add.image(0, 0, "preloader");
        this.load.image('logo', 'assets/images/logo.jpg');
        this.load.image('logo2', 'assets/images/logo2.jpg');
        this.load.image('logo3', 'assets/images/logo3.jpeg');
        this.load.image('logo4', 'assets/images/logo4.jpeg');
        this.load.json('config', 'assets/json/config.json');
        this.load.pack('loadimg', 'assets/json/assetimg.json');

        this.load.image("mainMenuBg", "assets/images/mainMenuBg.png");
        this.load.image("btn001", "assets/images/btn001.png");
        this.load.image('StartGameButton', 'assets/images/StartGameButton.png');
        this.load.image('StartGameButtonDown', 'assets/images/StartGameButtonDown.png');
        this.load.image('StartGameButtonHover', 'assets/images/StartGameButtonHover.png');
        this.load.image('playBtn', 'assets/images/playBtn.png');
        this.load.image('restBtn', 'assets/images/restBtn.png');
        this.load.image('scoreBox', 'assets/images/scoreBox.png');
        this.load.image('cangshu', 'assets/images/cangshu.png');
        this.load.image('dialog_bg', 'assets/images/dialog_bg.png');
        this.load.image('wallet_btn', 'assets/images/wallet_btn.png');

        this.load.image('playButton', 'assets/images/playButton.png');
        this.load.image('startButton', 'assets/images/startButton.png');
        this.load.image('checked', 'assets/images/checked.png');
        this.load.image('unChecked', 'assets/images/unChecked.png');
        this.load.image('avatar1', 'assets/images/avatar1.png');
        this.load.image('avatar2', 'assets/images/avatar2.png');
        this.load.image('rectangle', 'assets/images/rectangle.png');
        this.load.image('circle', 'assets/images/circle.png');
        this.load.image('startIcon', 'assets/images/startIcon.png');
        this.load.image('pauseIcon', 'assets/images/pauseIcon.png');
        this.load.image('checkbox_mul_checked', 'assets/images/checkbox_mul_checked.png');
        this.load.image('checkbox_mul_unChecked', 'assets/images/checkbox_mul_unChecked.png');

        this.load.image("avatar", "assets/images/avatar.png");
        this.load.image("energy", "assets/images/energy.png");
        this.load.image("main-bg", "assets/images/main-bg.png");
        this.load.image("main-btn", "assets/images/main-btn.png");
        this.load.image("money", "assets/images/money.png");

        // dialog
        this.load.image("dialog-bg", "assets/images/dialog/bg.png");
        this.load.image("dialog-close", "assets/images/dialog/close.png");
        this.load.image("dialog-start-btn", "assets/images/dialog/start-btn.png");
        this.load.image("dialog-close-btn", "assets/images/dialog/close-btn.png");

        this.load.audio('sfx-hover', 'assets/audio/sfx-hover.wav');
        this.load.audio('sfx-press', 'assets/audio/sfx-press.wav');
        this.load.audio('bgm-game', 'assets/audio/bgm-game.mp3');
        this.load.audio('bgm-main', 'assets/audio/bgm-main.mp3');

        //ImageButtonFillBg
        this.load.image('ImageButtonFillBg', 'assets/images/ImageButtonFillBg.png');

        //slider
        this.load.image('RoundedButtonFillBg', 'assets/images/RoundedButtonFillBg.png');

        // tabs
        this.load.image('tabs1', 'assets/images/tabs/tabs1.png');
        this.load.image('tabs1-hover', 'assets/images/tabs/tabs1-hover.png');
        this.load.image('tabs2', 'assets/images/tabs/tabs2.png');
        this.load.image('tabs2-hover', 'assets/images/tabs/tabs2-hover.png');
        this.load.image('tabs3', 'assets/images/tabs/tabs3.png');
        this.load.image('tabs3-hover', 'assets/images/tabs/tabs3-hover.png');
        this.load.image('tabs4', 'assets/images/tabs/tabs4.png');
        this.load.image('tabs4-hover', 'assets/images/tabs/tabs4-hover.png');
        this.load.image('tabs5', 'assets/images/tabs/tabs5.png');
        this.load.image('tabs5-hover', 'assets/images/tabs/tabs5-hover.png');

        this.load.image('tabsBg', 'assets/images/preloader.png');

        //button
        this.load.image('imgBtn', 'assets/images/button/img-btn.png');

        // listview
        this.load.image("l-bg", "/assets/images/listview/bg.png");
        this.load.image("l-add", "/assets/images/listview/add.png");
        this.load.image("l-blue-button", "/assets/images/listview/blue-button.png");
        this.load.image("l-cat1", "/assets/images/listview/cat1.png");
        this.load.image("l-cat2", "/assets/images/listview/cat2.png");
        this.load.image("l-cat3", "/assets/images/listview/cat3.png");
        this.load.image("l-cat4", "/assets/images/listview/cat4.png");
        this.load.image("l-fish", "/assets/images/listview/fish.png");
        this.load.image("l-gold", "/assets/images/listview/gold.png");
        this.load.image("l-good", "/assets/images/listview/good.png");
        this.load.image("l-green-button", "/assets/images/listview/green-button.png");
        this.load.image("l-grey-button", "/assets/images/listview/grey-button.png");
        this.load.image("l-item", "/assets/images/listview/item.png");
        this.load.image("l-speed", "/assets/images/listview/speed.png");
        this.load.image("l-yellow-button", "/assets/images/listview/yellow-button.png");
        this.load.image("l-star", "/assets/images/listview/star.png");
        this.load.image("l-close", "/assets/images/listview/close.png");

        this.nextScene = "scenes11"

        const bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x551A8B);
        bg.setOrigin(0, 0);

        const config: ProgressBarConfig = {
            x: (this.sys.scale.width - 500) / 2,
            y: 300,
            barTexture: {
                key: "ui",
                frame: "ButtonOrange",
                width: 500,
            },
            fillTexture: {
                x: 16,
                y: 10,
                key: "ui",
                frame: "ButtonOrangeFill1",
                width: 13,
                leftWidth: 6,
                rightWidth: 6,
            }
        };

        const p1 = this.mai3.add.progressBar(config);
        this.load.on("progress", async (progress: number) => {
            p1.value = progress;
        });
    }

    async create() {
        this.scene.start('DemoScene');
    }
    loadDecorations() {
        for (let i = 1; i < 7; i++) {
            this.load.image("decoration" + i, "assets/images/decorations/" + i + ".png")
        }
    }
    loadskill() {
        for (let i = 1; i < 6; i++) {
            this.load.image("blast" + i, "assets/images/skills/blast/" + i + ".png")
        }

        for (let i = 1; i < 20; i++) {
            this.load.image("fire" + i, "assets/images/skills/fire/" + i + ".png")
        }

        for (let i = 1; i < 9; i++) {
            this.load.image("flame" + i, "assets/images/skills/flame/" + i + ".png")
        }

        for (let i = 1; i < 6; i++) {
            this.load.image("light" + i, "assets/images/skills/light/" + i + ".png")
        }

        for (let i = 1; i < 17; i++) {
            this.load.image("thunder" + i, "assets/images/skills/thunder/" + i + ".png")
        }
        for (let i = 1; i < 7; i++) {
            this.load.image("attack" + i, "assets/images/skills/attack/" + i + ".png")
        }

    }
}