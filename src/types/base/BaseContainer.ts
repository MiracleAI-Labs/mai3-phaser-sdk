import { BaseConfig } from "./BaseConfig";
import { Container } from "../../ui/Container";

export interface ReDrawProtocol {
  reDraw(config?: BaseConfig): void;
  clear(): void;
}

/**
 * Base container class that extends Phaser Container and implements ReDrawProtocol
 * Provides basic container functionality with config management
 */
export abstract class BaseContainer<T extends BaseConfig = BaseConfig>
  extends Phaser.GameObjects.Container
  implements ReDrawProtocol
{
  /** The content container instance */
  protected _content?: Container;

  /** Configuration object for this container */
  protected _config?: T;

  /**
   * Redraws the container with new config
   * @param config - Optional new configuration
   */
  abstract reDraw(config?: T): void;

  /**
   * Clears the container content
   */
  abstract clear(): void;

  /**
   * Updates the container configuration
   * @param config - New configuration to apply
   */
  updateConfig(config?: T): void {
    this._config = config;
  }

  /**
   * Adds a child container
   * @param child - Child container to add
   */
  abstract addChild(child: Container): void;

  abstract setChildren(childConfigs?: BaseConfig[]): void;

  setPosition(x?: number, y?: number, z?: number, w?: number): this {
    super.setPosition(x, y, z, w);
    this.config.x = x;
    this.config.y = y;
    return this;
  }

  /**
   * Gets the current container config
   * @returns The current config or empty object if none set
   */
  get config(): T {
    return this._config ?? ({} as T);
  }

  get content(): Container | undefined {
    return this._content;
  }

  /**
   * Gets the real child configurations by recursively traversing the container tree
   * @returns Array of BaseConfig objects representing the current container hierarchy
   */
  get realChildConfigs(): BaseConfig[] {
    const buildConfigTree = (container: Container): BaseConfig[] => {
      if (!(container instanceof Container)) {
        return [];
      }
      const children = container.getAll() as Container[];
      return children.reduce<BaseConfig[]>((acc, child) => {
        let config = child.config;
        if (!config) {
          return acc;
        }
        const childConfig = { ...config };
        const subConfigs = buildConfigTree(child);
        if (subConfigs.length > 0) {
          childConfig.childConfigs = subConfigs;
        }
        acc.push(childConfig);
        return acc;
      }, []);
    };
    return this._content ? buildConfigTree(this._content as Container) : [];
  }

  destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
    this._content?.destroy(fromScene);
    this._content = undefined;
  }
}
