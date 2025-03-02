import { IOderFormsData, IOrderForm} from "../../types";
import { IEvents } from "../base/events";

export class OrderModel implements IOderFormsData {
	protected events: IEvents;
	protected order: IOrderForm = {
		payment: '',
		address: '',
		phone: '',
		email: '',
	};
	protected formErrors: Partial<Record<keyof IOrderForm, string>> = {};

	constructor(events: IEvents) {
		this.events = events;
	}

	getUserInfo(): IOrderForm {
		return this.order;
	}

	setInputField(field: keyof IOrderForm, value: string): void {
		this.order[field] = value;
	}

	validateOrder(): Partial<Record<keyof IOrderForm, string>> {
			const errors: typeof this.formErrors = {};
			if (!this.order.email) {
				errors.email = 'Укажите почту';
			}
			if (!this.order.phone) {
				errors.phone = 'Укажите телефон';
			}
			if (!this.order.address) {
				errors.address = 'Укажите адрес';
			}
			if (!this.order.payment) {
				errors.payment = 'Выберите способ оплаты';
			}
			this.formErrors = errors;
			this.events.emit('formErrors:change', this.formErrors);
			return errors;
	}

	clearOrderData(): void {
		this.order = {
			payment: '',
			address: '',
			phone: '',
			email: '',
		};
	}
}