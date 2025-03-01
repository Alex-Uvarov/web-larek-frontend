import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    protected position: number;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this.handleEscUp = this.handleEscUp.bind(this);
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.position = window.scrollY;
        this.container.classList.add('modal_active');
        document.addEventListener('keyup', this.handleEscUp);
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        document.removeEventListener('keyup', this.handleEscUp);
        window.scrollTo(0, this.position);
        this.events.emit('modal:close');

        if (document.activeElement) {
            (document.activeElement as HTMLElement).blur();
        }
    }

    handleEscUp(evt: KeyboardEvent) {
        if (evt.key === 'Escape') {
            this.close();
        }
    }

    render(content: IModalData): HTMLElement {
        super.render(content);
        this.open();
        return this.container;
    }
}