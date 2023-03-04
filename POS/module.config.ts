import { Order } from './src/model/order'
import { Product } from './src/model/product'
import { Member } from './src/model/member'
import { OrderItem } from './src/model/orderItem'

module.exports = {
  name: 'POS',
  description: 'Point of sale system for cashier.',
  models: [Order, Product, Member, OrderItem]
}
