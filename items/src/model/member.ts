import { Model, attribute } from '@myback/sdk'

export class Member extends Model {
    protected static tableName: string = 'members'

    @attribute({ type:'int', primary: true })
        phone_number?:  number

    @attribute({ type: 'string'})
        name?: string

}