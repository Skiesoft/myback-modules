import { Model, attribute } from '@myback/sdk'
    
export class Item extends Model {
    protected static tableName: string = 'items'

    @attribute({ type: 'int', primary: true, autoIndex: true})
        id?: number

    @attribute({ type: 'int', nullable: true})
        serial_number?: number

    @attribute({ type: 'int', nullable: true, unique: true })
        upc?: number

    @attribute({ type: 'string'})
        name?: string

    @attribute({ type: 'string'})
        category?: string

    @attribute({ type: 'string'})
        status?: string

    @attribute({ type: 'date'})
        create_time?: string

    @attribute({ type: 'string'})
        manufacturer?: string


    @attribute({ type: 'string'})
        unit?: string

    @attribute({ type: 'float'})
        weight?: number

    @attribute({ type: 'float'})
        length?: number

    @attribute({ type: 'float'})
        width?: number

    @attribute({ type: 'float'})
        height?: number

    @attribute({ type:'string'})
        info?: string

    @attribute({ type: 'int'})
        price?: number

    @attribute({ type: 'string'})
        remark?: string

    @attribute({ type: 'int'})
        plan_on_ordering?: number

    @attribute({ type: 'int'})
        ordered?: number

    @attribute({ type: 'int'})
        stock?: number
}
