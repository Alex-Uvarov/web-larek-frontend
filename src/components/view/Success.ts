import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _content: HTMLElement;
    protected _close: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._content = ensureElement<HTMLElement>('.order-success__description', container);
        this._close = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this._close.addEventListener('click', () => {
            this.events.emit('Success:closed');
        })
    }

    set total (value: number) {
        this.setText(this._content, `Списано ${value} синапсов`)
    }
}