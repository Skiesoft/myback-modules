import { Model, attribute } from '@myback/sdk'
import { Item } from './item'
import { Member } from './member'

export class Deal extends Model {
    protected static tableName: string = 'deals'

    @attribute({ type: 'datetime'})
        time?: string

    @attribute({ type: 'relation', nullable: true })
        item?: Item

    @attribute({ type: 'int'})
        stock_change?: number

    @attribute({ type: 'string', nullable: true})
        importer?: string

    @attribute({ type: 'relation', nullable: true})
        member?: Member
    
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