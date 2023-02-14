import { Order } from './src/model/order'
import { Product } from './src/model/product'
import { Member } from './src/model/member'
import { OrderItem } from './src/model/orderItem'

module.exports = {
  name: 'Simple Todo List',
  description: 'Example module of a simple todo list.',
  models: [Order, Product, Member, OrderItem]
}
