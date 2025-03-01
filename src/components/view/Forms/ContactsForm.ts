import { TForm } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/events";
import { Form } from "./Form";

export class OrderFormContactsView extends Form<TForm> {

    protected phoneNumber: HTMLInputElement;
	protected _email: HTMLInputElement;

	private phoneRegex = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
	private emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.phoneNumber = ensureElement<HTMLInputElement>(
			`input[name="phone"]`,
			this.container
		);
		this._email = ensureElement<HTMLInputElement>(
			`input[name="email"]`,
			this.container
		);

		// Обработчик для поля телефона
		this.phoneNumber.addEventListener('input', () => {
			const phoneValue = this.phoneNumber.value?.trim() || '';
			this.onInputChange('phone', phoneValue);
			this.validateForm();
		});

		// Обработчик для поля email
		this._email.addEventListener('input', () => {
			const mailValue = this._email.value?.trim() || '';
			this.onInputChange('email', mailValue);
			// this.valid = isMailValid;
			this.validateForm();
		});
	}

	set phone(value: string) {
		const phoneInput = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
		if (phoneInput) phoneInput.value = value;
	}

	set email(value: string) {
		const emailInput = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;
		if (emailInput) emailInput.value = value;
	}
	
	validateForm(): void {
		const isPhoneValid = this.phoneRegex.test(this.phoneNumber.value);
		const isMailValid = this.emailRegex.test(this._email.value);
		this.valid =
			isPhoneValid &&
			isMailValid &&
			this.phoneNumber.value.trim() !== '' &&
			this._email.value.trim() !== '';
	}

	clearAll(): void {
		this._email.value = '';
		this.phoneNumber.value = '';
	}
}