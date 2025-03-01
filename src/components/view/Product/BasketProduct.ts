import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/events";
import { BaseProductView } from "./BaseProduct";

export class BasketProductView extends BaseProductView {
    protected _button: HTMLButtonElement;
    protected _index: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);

        this._button.addEventListener('click', () => this.events.emit('ItemBasket:delete', {productID: this.id}));
    }

    set index(value: number) {
        this.setText(this._index, value);
    }
}