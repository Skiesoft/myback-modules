import { Model, attribute } from '@myback/sdk'

export class Member extends Model {
    protected static tableName: string = 'members'

    @attribute({ type:'string', primary: true })
        phone_number?:  string

    @attribute({ type: 'string'})
        name?: string

}