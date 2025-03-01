import { IBasket, IProduct } from "../../types";
import { IEvents } from "../base/events";

export class BasketModel implements IBasket {
    protected products: IProduct[];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this.products = [];
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('BasketModel:changed');
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getOneProduct(id: string): IProduct {
        return this.products.find(product => product.id === id) as IProduct;
    }

    addToBasket(product: IProduct): void {
        this.products = [...this.products, product];
        this.events.emit('BasketModel:changed');
    }

    removeFromBasket(product: IProduct): void {
        const index = this.products.indexOf(product);
		if (index >= 0) {
			this.products.splice(index, 1);
		}
        this.events.emit('BasketModel:changed');
    }

    getCountOfProducts(): number {
        return this.products.length;
    }

    getTotalPrice(): number {
        return this.products.reduce(function(currentSum,card) {
            return currentSum+=card.price;
          },0);
    }

    clearBasket(): void {
        this.products = [];
    }
}