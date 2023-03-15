import { Model, attribute } from '@myback/sdk'
    
export class Picture extends Model {
    protected static tableName: string = 'Picture'

    @attribute({ type: 'int' })
        product_id?: number

    @attribute({ type: 'string'})
        file_name?: string

    @attribute({ type: 'string' })
        url?:string
}
