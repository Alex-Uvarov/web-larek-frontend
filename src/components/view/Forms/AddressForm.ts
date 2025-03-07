import { TForm } from "../../../types";
import { ensureAllElements } from "../../../utils/utils";
import { IEvents } from "../../base/events";
import { Form } from "./Form";

export class AddressForm extends Form<TForm> {
    protected _buttons: HTMLButtonElement[];
	protected _address: HTMLInputElement;

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			this.container
		);

		this._buttons.forEach((button) => {
			button.addEventListener('click', (e: Event) => {
				const target = e.target as HTMLButtonElement;
				const value = target.name as 'card' | 'cash';
				this.payment = value;
				this.onInputChange('payment', value);
			});

			this.container.addEventListener('submit', (event: Event) => {
				event.preventDefault();
				this.events.emit('contacts:open');
			});
		});
	}

	set payment(value: 'card' | 'cash') {
		this._buttons.forEach((button) => {
			button.name === value
				? button.classList.add('button_alt-active')
				: button.classList.remove('button_alt-active');
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}