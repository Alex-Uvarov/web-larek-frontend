import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

//Интерфеейс корзины 
interface IBasket {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.button', container);

        if(this._button) {
            this._button.addEventListener('click', () => {
                events.emit('Order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if(items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this._button, false);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this.setDisabled(this._button, true);
        }
    }

    set total(total: number) {
        this._total.textContent = `${total} синапсов`;
    }
}
