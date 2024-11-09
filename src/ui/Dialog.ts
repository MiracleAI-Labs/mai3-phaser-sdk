import { Container } from './Container';
import { BaseConfig, DialogConfig } from '../types';
import { BaseScene } from "../game";
import { Panel } from './Panel';
export class Dialog extends Container<DialogConfig> {
    private _root?: Panel;
    private _childComponents: Container[] = [];

    constructor(scene: BaseScene, config: DialogConfig) {
        super(scene, { ...config, x: 0, y: 0 });
        this.Type = 'Dialog';
        this.scene = scene;
        this._initDialog(config);
    }

    private _initDialog(config: DialogConfig): void {
        this._config = config;

        this._createRoot();
        this._positionDialog();
        this.updateConfig(this._config);
    }

    private _createRoot(): void {
        const {
            width = 0,
            height = 0,
            texture = '',
            frame,
            leftWidth = 0,
            rightWidth = 0,
            topHeight = 0,
            bottomHeight = 0,
            radius = 0,
            borderWidth = 0,
            borderColor = 0
        } = this._config!;
        this._root = new Panel(this.scene, { x: 0, y: 0, width, height, texture, frame, leftWidth, rightWidth, topHeight, bottomHeight, radius, borderWidth, borderColor });
        this._root.setName("root");
        this._root.drawBackground();
        this.addAt(this._root, 1);
        if (this._config?.isShowCloseButton && this._config?.closeButtonConfig) {
            let closeBtnConfig = this._config.closeButtonConfig;
            closeBtnConfig.x = closeBtnConfig.x ?? ((this._config.width ?? 0) - (closeBtnConfig.width ?? 0) - 30);
            closeBtnConfig.y = closeBtnConfig.y ?? 30
            const child = this.scene.getChild(closeBtnConfig);
            this._root!.addChild(child);
            this._childComponents.push(child);
        }
    }

    private _positionDialog(): void {
        const { width = 0, height = 0 } = this._config!;
        const rootX = (this.scene.scale.width - width) / 2;
        const rootY = (this.scene.scale.height - height) / 2;
        this.setPosition(rootX, rootY);
        this.setDepth(99999);
        this.RefreshBounds();
    }

    public addItems(childConfigs: BaseConfig[]) {
        childConfigs.forEach(childConfig => {
            const child = this.scene.getChild(childConfig);
            this._root!.addChild(child);
            this._childComponents.push(child);
        });
    }

    public reDraw(config: DialogConfig): void {
        if (this._root) {
            this._root.destroy(true);
            this._root = undefined;
        }
        this._initDialog(config);
    }

    public show(): void {
        this.setVisible(true);
    }

    public hide(): void {
        this.setVisible(false);
    }

    public close(): void {
        this.destroy();
    }

    private _handlePointerDown = (_: Phaser.Input.Pointer, _localX: number, _localY: number, event: Phaser.Types.Input.EventData): void => {
        event.stopPropagation();
    }

    destroy(fromScene?: boolean): void {
        this._childComponents.forEach(child => {
            child.destroy(true);
        });
        this._childComponents = [];
        this._root?.removeAll(true);
        this.getAll().forEach(obj => obj.destroy(true));
        
        super.destroy(fromScene);
        this._root?.destroy(fromScene);
        this._root = undefined;
        this._config = undefined;
    }
}
