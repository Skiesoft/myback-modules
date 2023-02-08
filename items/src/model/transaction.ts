import { Model, attribute } from '@myback/sdk'
import { Item } from './item'

export class Transaction extends Model {
    protected static tableName: string = 'transactions'

    @attribute({ type: 'datetime'})
        time?: string

    @attribute({ type: 'relation'})
        item?: Item

    @attribute({ type: 'int'})
        stock_change?: number

    
    @attribute({ type: 'float', nullable: true})
        adviced_price?: number

    @attribute({ type: 'float'})
        pricing?: number

    @attribute({ type: 'float'})
        exchange_rate?: number

    @attribute({ type: 'float'})
        discount?: number

    @attribute({ type: 'float'})
        actual_price?: number
    
    @attribute({ type: 'string'})
        remark?: string
    
}