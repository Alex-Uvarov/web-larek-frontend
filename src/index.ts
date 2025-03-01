import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/LarekAPI';
import { BasketModel } from './components/Model/BasketModel';
import { ProductsModel } from './components/Model/ProductsModel';
import { OrderModel } from './components/Model/OrderModel';
import { Basket } from './components/view/Basket';
import { OrderFormAddressView } from './components/view/Forms/AddressForm';
import { OrderFormContactsView } from './components/view/Forms/ContactsForm';
import { Modal } from './components/view/Modals';
import { Page } from './components/view/Page';
import { BasketProductView } from './components/view/Product/BasketProduct';
import { CatalogProductView } from './components/view/Product/CatalogProduct';
import { PreviewProductView } from './components/view/Product/PreviewProduct';
import { Success } from './components/view/Success';
import './scss/styles.scss';
import { IApiResponse, IOrderForm, IProduct} from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL,API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Все модели данных
const basketData = new BasketModel(events);
const productsData = new ProductsModel(events);
const orderData = new OrderModel(events);

//Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

//Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const addressForm = new OrderFormAddressView(cloneTemplate(orderTemplate), events);
const contactsForm = new OrderFormContactsView(cloneTemplate(contactsTemplate), events);
const successWindow = new Success(cloneTemplate(successTemplate), events);

//Бизнес логика

// Получаем продукты с сервера
api.get('/product/')
    .then(res => {
        return <IApiResponse>res;
    })
    .then(res => {
        productsData.setProducts(res.items);
    })
    .catch(console.error);

//Рендерим продукты при обновлении
events.on('Products:loaded', () => {
    page.catalog = productsData.getProducts().map(item => {
        const card = new CatalogProductView(cloneTemplate(cardCatalogTemplate), events);
        return card.render({
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category,
            id: item.id,
            image: item.image,
        });
    });

    page.counter = basketData.getProducts().length;
});

// Получить id товара на который кликнули
events.on('Catalog:click', (data: {cardID: string}) => {
    productsData.setPreview(data.cardID);
})

//Открытие модального окна товара
events.on('product: selected', (item: IProduct) => {
    const cardID = productsData.getPreview();
    const preview = new PreviewProductView(cloneTemplate(cardPreviewTemplate), events);
    if (cardID) {
        const card = productsData.getOneProduct(cardID);
        const cardBasket = basketData.getOneProduct(cardID);

        if(cardBasket) {
            preview.ButtonText = 'Удалить из корзины'
        } else {
            preview.ButtonText = 'Купить'
        }

        if(card.price === null) {
            preview.ButtonText = 'Покупка невозможна'
            preview.ButtonState = true;
        }
    }

    modal.render({content: preview.render(item)})
})
// Блокируем прокрутку при открытии модалки
events.on('modal:open', () => {
    page.locked = true;
});

//Разблокируем прокрутку при закрытии модалки
events.on('modal:close', () => {
    page.locked = false;
})

//рендеринг элементов корзины
const renderBasketProducts = () => {
    const basketItems = basketData.getProducts().map((item, index) => {
        const basketProduct = new BasketProductView(cloneTemplate(cardBasketTemplate), events);
        basketProduct.index = index + 1;
        return basketProduct.render(item);
    })
    return basketItems;
}

// клик на кнопку в карточке товара
events.on('previewButton: click', () => {
    const cardID = productsData.getPreview();
    const preview = new PreviewProductView(cloneTemplate(cardPreviewTemplate), events);
    if(basketData.getOneProduct(cardID)) {
        basketData.removeFromBasket(productsData.getOneProduct(cardID));
        preview.ButtonText = 'Купить'
    } else {
        basketData.addToBasket(productsData.getOneProduct(cardID));
        preview.ButtonText = 'Удалить из корзины'
    }
})

// открытие корзины
events.on('Basket:open', () => {
    modal.render({
        content: basket.render({
            items: renderBasketProducts(),
            total: basketData.getTotalPrice(),
        })
    })
})

//Изменение корзины
events.on('BasketModel:changed', () => {
    page.counter = basketData.getCountOfProducts();

    const basketItems = basketData.getProducts().map((item, index) => {
        const basketProduct = new BasketProductView(cloneTemplate(cardBasketTemplate), events);
        basketProduct.index = index + 1;
        return basketProduct.render(item);
    })

    basket.render({
        items: basketItems,
        total: basketData.getTotalPrice(),
    })
})


// Удаление товара из корзины
events.on('ItemBasket:delete', (data: {productID: string}) => {
    const cardID = data.productID;
    basketData.removeFromBasket(basketData.getOneProduct(cardID));
})

// Открыть форму заказа
events.on('Order:open', () => {
	const { address: addressError, payment: paymentError } =
		orderData.validation();
	const { address, payment } = orderData.getUserInfo();
	modal.render({
		content: addressForm.render({
			address: orderData.getUserInfo().address,
			payment: orderData.getUserInfo().payment,
			valid: !(addressError || paymentError),
			errors: !(address || payment)
				? ''
				: Object.values({ paymentError, addressError })
						.filter((i) => !!i)
						.join('; '),
		}),
	});
});

// Открыть контактов
events.on('contacts:open', () => {
	const { phone: phoneError, email: mailError } = orderData.validation();
	const { phone, email } = orderData.getUserInfo();
	modal.render({
		content: contactsForm.render({
			phone: orderData.getUserInfo().phone,
			email: orderData.getUserInfo().email,
			valid: !(phoneError && mailError),
			errors: !(phone && email)
				? ''
				: Object.values({ phoneError, mailError })
						.filter((i) => !!i)
						.join('; '),
		}),
	});
});

// Изменилось состояние валидации формы
events.on('user:changed', (errors: Partial<IOrderForm>) => {
	const { address, payment, phone, email } = errors;
	addressForm.valid = !(address || payment);
	addressForm.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contactsForm.valid = !(phone || email);
	contactsForm.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		orderData.setInputField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		orderData.setInputField(data.field, data.value);
		contactsForm.validateForm();
	}
);

events.on('contacts:submit', () => {
	let totalAmountFinall = 0;
	const cardsInOrder: string[] = [];
	basketData.getProducts().forEach((card) => cardsInOrder.push(card.id));
	api
		.orderProducts({
			payment: orderData.getUserInfo().payment,
			address: orderData.getUserInfo().address,
			email: orderData.getUserInfo().email,
			phone: orderData.getUserInfo().phone,
			total: basketData.getTotalPrice(),
			items: cardsInOrder,
		})
		.then((answerOrder) => {
			totalAmountFinall = answerOrder.total;
			modal.render({ content: successWindow.render({ total: totalAmountFinall }) });
			basketData.clearBasket();
			addressForm.clearAll();
			contactsForm.clearAll();
			page.counter = basketData.getCountOfProducts();
			addressForm.clearForm();
			contactsForm.clearForm();
		})
		.catch((err) => {
			console.log('Ошибка оформления заказа', err);
		});
});

events.on('Success:closed', () => {
	modal.close();
});