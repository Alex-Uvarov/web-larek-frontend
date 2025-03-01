import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/component";
import { IEvents } from "../../base/events";

export interface ICard {
	render(data: IProduct): HTMLElement;
}

export class BaseProductView extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected events: IEvents;
    protected productId: string;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.events = events;

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number) {
        if (value === null) {
            this.setText(this._price, `Бесценный товар`);
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    set id(value: string) {
        this.productId = value;
    }

    get id():string {
        return this.productId;
    }
}