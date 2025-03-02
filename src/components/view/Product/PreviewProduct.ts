import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/events";
import { CatalogProductView } from "./CatalogProduct";

export class PreviewProductView extends CatalogProductView {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        this._button.addEventListener('click', () => this.events.emit('previewButton: click'));
    }

    set description(value:string) {
        this.setText(this._description, value);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    set buttonState(value: boolean) {
        this._button.disabled = value;
    }
}