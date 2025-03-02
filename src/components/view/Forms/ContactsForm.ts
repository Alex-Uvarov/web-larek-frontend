import { TForm } from "../../../types";
import { Form } from "./Form";

export class ContactsForm extends Form<TForm> {

    protected phoneNumber: HTMLInputElement;
	protected _email: HTMLInputElement;

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value = value;
	}
}