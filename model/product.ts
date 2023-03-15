import { Model, attribute } from '@myback/sdk'
    
export class Product extends Model {
    protected static tableName: string = 'products'

    @attribute({ type: 'int', primary: true, autoIndex: true})
        id?: number

    @attribute({ type: 'string', nullable: true})
        serial_number?: string

    @attribute({ type: 'string', nullable: true, unique: true })
        upc?: string

    @attribute({ type: 'string'})
        name: string = ''

    @attribute({ type: 'string'})
        category: string = ''

    @attribute({ type: 'string'})
        status: string = ''

    @attribute({ type: 'date'})
        create_time?: Date

    @attribute({ type: 'string'})
        manufacturer: string = ''

    @attribute({ type: 'string'})
        unit: string = ''

    @attribute({ type: 'float'})
        weight: number = 0

    @attribute({ type: 'float'})
        length: number = 0

    @attribute({ type: 'float'})
        width: number = 0

    @attribute({ type: 'float'})
        height: number = 0

    @attribute({ type:'string'})
        info: string = ''

    @attribute({ type: 'int'})
        price: number = 0

    @attribute({ type: 'string'})
        note: string = ''

    @attribute({ type: 'int'})
        plan_on_ordering: number = 0

    @attribute({ type: 'int'})
        ordered: number = 0

    @attribute({ type: 'int'})
        stock: number = 0
}
