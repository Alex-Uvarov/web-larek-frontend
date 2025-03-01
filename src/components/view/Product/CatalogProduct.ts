import { productCategory } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/events";
import { BaseProductView } from "./BaseProduct";

export class CatalogProductView extends BaseProductView {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this.container.addEventListener('click', ()=>this.events.emit('Catalog:click',{cardID:this.id}));
    }

    set category(value: string) {
        this.setText(this._category, value);
        this._category.classList.add(`card__category${productCategory[value]}`)
    }

    set image(src:string) {
        this.setImage(this._image, src);
    }
}