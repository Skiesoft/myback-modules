import { Model, attribute } from '@myback/sdk'

export class Contact extends Model {
    protected static tableName: string = 'contacts'

    @attribute({ type: 'int' , primary: true , autoIndex: true })
        id?: number

    @attribute({ type: 'string', nullable: true})
        name?: string

    @attribute({ type: 'string', nullable: true})
        email?: string

    @attribute({ type: 'string', nullable: true})
        phone?: string

    @attribute({ type: 'string', nullable: true})
        address?: string

    @attribute({ type: 'date' })
        create_date?: Date

}