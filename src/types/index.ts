//Интерфейс товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

//Интерфейс каталога
export interface IProductsCatalog {
    setProducts(products: IProduct[]): void;
    getProducts(): IProduct[];
    getOneProduct(id: string): IProduct;
    setPreview(id: string): void;
    getPreview(): string | null;
}

//Интерфейc корзины
export interface IBasket {
    setProducts(products: IProduct[]): void;
    getProducts(): IProduct[];
    getOneProduct(id: string): IProduct;
    addToBasket(product: IProduct): void;
    removeFromBasket(product: IProduct): void;
    getCountOfProducts(): number;
    getTotalPrice(): number;
    clearBasket(): void;
}

//Типы для данных пользователя
export type TUserInfo = 'paymentMethod' | 'email' | 'phone' | 'address';

//Интерфейс данных пользователя
export interface IOrderForm {
    payment: string;
    email: string;
    phone: string;
    address: string;
}

export type TPayment = 'card' | 'cash';

//Интерфейс действий с данными пользователя
export interface IOderFormsData {
    getUserInfo(field: keyof IOrderForm): void;
	setInputField(field: keyof IOrderForm, value: string): void;
	validateOrder(): void;
	clearUser(): void;
}

//Типы данных для формы
export type TForm = Pick<IOrderForm, 'payment' | 'address' | 'email' | 'phone'>;

//Интерфейс заказа
export interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}

//Интерфейс того, что возвращает заказ
export interface IOrderResult {
    id: string;
    total: number;
}

export interface IApiResponse {
    total:number;
    items:IProduct[];
}

//Ошибки
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;
