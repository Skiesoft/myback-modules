import { Model, attribute } from '@myback/sdk'
import { Member } from './member'

export class Order extends Model {
    protected static tableName: string = 'orders'

    @attribute({ type: 'int' , primary: true, autoIndex: true})
        id?: number

    @attribute({ type: 'datetime' })
        time?: string

    @attribute({ type: 'string', nullable: true})
        importer?: string

    @attribute({ type: 'relation', nullable: true})
        member?: Member

    @attribute({ type: 'int' })
        amount?: number
}