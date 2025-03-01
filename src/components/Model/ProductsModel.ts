import { IProduct, IProductsCatalog } from "../../types";
import { IEvents } from "../base/events";

export class ProductsModel implements IProductsCatalog {
    protected products: IProduct[];
    protected preview: string | null;
    protected events: IEvents;
    
    constructor(events: IEvents) {
        this.events = events;
        this.preview = null;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('Products:loaded');
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getOneProduct(id: string): IProduct {
        return this.products.find(product => product.id === id) as IProduct;
    }

    setPreview(id: string | null): void {
        if(!id) {
            this.preview = null;
            return
        }
        
        const selectedProduct = this.getOneProduct(id);
        this.preview = id;
        this.events.emit('product: selected', selectedProduct);
    }

    getPreview(): string | null {
        return this.preview;
    }
}