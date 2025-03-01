import { FormErrors, IOderFormsData, IOrderForm} from "../../types";
import { IEvents } from "../base/events";

export class OrderModel implements IOderFormsData {
	protected events: IEvents;
	protected order: IOrderForm = {
		payment: '',
		address: '',
		phone: '',
		email: '',
	};

	constructor(events: IEvents) {
		this.events = events;
		this.order = {
			payment: '',
			address: '',
			phone: '',
			email: '',
		};
	}

	getUserInfo() {
		return this.order;
	}

	setInputField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		this.events.emit('order:change', this.order);
	}

	validation() {
			const errors: FormErrors = {};
			if (!this.order.email) {
				errors.email = 'Укажите почту';
			}
			if (!this.order.phone) {
				errors.phone = 'Укажите телефон';
			}
			if (!this.order.address) {
				errors.address = 'Укажите адресс';
			}
			if (!this.order.payment) {
				errors.payment = 'Выберите способ оплаты';
			}
			return errors;
	}

	clearUser() {
		this.order = {
			payment: '',
			address: '',
			phone: '',
			email: '',
		};
	}
}