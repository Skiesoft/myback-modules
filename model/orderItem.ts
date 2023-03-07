import { Model, attribute } from '@myback/sdk'
import { Product } from './product'

export class OrderItem extends Model {
    protected static tableName: string = 'orderItems'

    @attribute({ type: 'int'})
        id?: number

    @attribute({ type: 'relation'})
        product?: Product

    @attribute({ type: 'int'})
        stock_change?: number

    @attribute({ type: 'float'})
        labeled_price?: number

    @attribute({ type: 'float'})
        exchange_rate?: number

    @attribute({ type: 'float'})
        discount?: number

    @attribute({ type: 'float'})
        actual_price?: number
    
    @attribute({ type: 'string'})
        note?: string
    
}