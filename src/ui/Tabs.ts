import { Container } from './Container';
import { TabsConfig } from '../types';
import { LinearLayout } from './LinearLayout';
import { BaseScene } from "../game";
import { Label } from './Label';
import { Text } from './Text';
import { Panel } from './Panel';

export class Tabs extends Container<TabsConfig> {
    private _items?: LinearLayout;
    protected _config: TabsConfig;
    private _root?: Panel;
    public image?: Phaser.GameObjects.Image;

    constructor(scene: BaseScene, config: TabsConfig) {
        super(scene, config);
        this._config = config;
        this.Type = 'Tabs';

        this.createBg()
        this.createTabItems();
        this.setPosition(0, scene.scale.height - (this._config.height || 0));
    }

    createBg() {

        const {
            width,
            height = 0,
            texture = '', backgroundColor = 0x000000
        } = this._config!;

        const tabsWidth = width || this.scene.scale.width;

        if (texture) {
            this._root = new Panel(this.scene, {
                x: 0, y: 0,
                width: tabsWidth,
                height,
                texture
            });
        } else {
            this._root = new Panel(this.scene, {
                x: 0, y: 0,
                width: tabsWidth,
                height,
                backgroundColor: backgroundColor,
                borderWidth: 0,
                radius: 0
            });
        }
        this._root.setName("root");
        this._root.drawBackground();
        this.addAt(this._root, 1);
    }

    createTabItems(tabIndex = 0) {
        this._items?.destroy()

        const children: Container[] = [];
        const itemCount = this._config.items?.length || 0;
        const tabsWidth = this._config.width || this.scene.scale.width;
        const itemWidth = tabsWidth / itemCount;
        const padding = this._config.padding?.all || 0;

        const configHeight = this._config.height || 40;
        const multiple = 0.8;

        this._config.items?.forEach((item, index) => {

            const itemRoot = new Container(this.scene);

            const rectangle = this.scene.add.rectangle(0, 0, itemWidth, configHeight);
            rectangle.setOrigin(0);
            itemRoot.addAt(rectangle, 0);

            let image;
            if (tabIndex == index) {
                image = this.scene.add.image(padding, padding, item.activeImg ?? item.texture ?? '');
                image.setOrigin(0);
            }
            else {
                image = this.scene.add.image(padding, padding, item.texture ?? '');
                image.setOrigin(0);
            }

            // 以高度等比缩放，默认显示0.8倍
            const imgSize = configHeight * multiple - padding * 2;
            image.setDisplaySize(imgSize, imgSize);
            image.x = (itemWidth - imgSize) / 2;
            itemRoot.addAt(image, 1);

            const text = new Text(this.scene, {
                x: 0,
                y: configHeight * multiple - padding,
                width: itemWidth,
                text: item.title,
                textStyle: {
                    color: this._config.fontColor, // 颜色
                    fontSize: (configHeight - configHeight * multiple) * multiple + 'px'
                },
                textAlign: 'center',
            });
            itemRoot.addAt(text, 1);

            const hitArea = new Phaser.Geom.Rectangle(0, 0, itemWidth, configHeight);
            itemRoot.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
                .on('pointerup', () => this.onTabClick(index));

            children.push(itemRoot);

        });


        this._items = new LinearLayout(this.scene, {
            width: tabsWidth,
            height: this._config.height,
            children: children,
            orientation: 'horizontal',
        });

        this.add(this._items!);

    }

    private onTabClick(index: number) {
        if (this._config.onTabClick) {
            this._config.onTabClick(index);
        }
        this.emit('tabChange', index);
        this.createTabItems(index)
    }

}
