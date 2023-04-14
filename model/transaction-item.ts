import { Model, attribute } from '@myback/sdk'
import { Product } from './product'
import { Transaction } from './transaction'

export class TransactionItem extends Model {
    protected static tableName: string = 'transaction_items'

    @attribute({ type: 'int'})
        id?: number

    @attribute({ type: 'relation' })
        transaction?: Transaction

    @attribute({ type: 'relation'})
        product?: Product

    @attribute({ type: 'int'})
        quantity?: number

    @attribute({ type: 'float'})
        labeled_price: number = 0

    @attribute({ type: 'string' })
        currency?: string

    @attribute({ type: 'float'})
        exchange_rate: number = 1

    @attribute({ type: 'float'})
        discount: number = 0

    @attribute({ type: 'float'})
        paid_price?: number
    
    @attribute({ type: 'string'})
        note: string = ''    
}
