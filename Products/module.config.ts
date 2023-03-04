import { Member } from './src/model/member'
import { Order } from './src/model/order'
import { OrderItem } from './src/model/orderItem'
import { Product } from './src/model/product'

module.exports = {
  name: 'Product',
  description: 'Manage Product items.',
  models: [Member, Order, OrderItem, Product]
}
