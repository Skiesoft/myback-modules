import { Transaction } from './src/model/transaction'
import { Product } from './src/model/product'
import { Contact } from './src/model/contact'
import { TransactionItem } from './src/model/transaction-item'
import { ModuleConfig } from '@myback/sdk'

const config: ModuleConfig ={
  name: 'Member',
  description: 'Manage Members. ',
  models: [Transaction, Product, Contact, TransactionItem]
}

module.exports = config