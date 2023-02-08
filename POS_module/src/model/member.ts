import { Model, attribute } from '@myback/sdk'

export class Member extends Model {
    protected static tableName: string = 'members'

    @attribute({ type: 'int', primary: true, autoIndex: true })
        id?: number

    @attribute({ type:'string'})
        phone_number?:  string

    @attribute({ type: 'string' })
        name?: string

}