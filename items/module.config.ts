import { Member } from './src/model/member'
import { Item } from './src/model/item'
import { Transaction } from './src/model/transaction'
import { Order } from './src/model/order'

module.exports = {
  name: 'Simple Todo List',
  description: 'Example module of a simple todo list.',
  models: [Member, Item, Transaction, Order]
}
