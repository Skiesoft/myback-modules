import { Product } from './src/model/product'
import { Contact } from './src/model/contact'
import { Transaction } from './src/model/transaction'
import { TransactionItem } from './src/model/transaction-item'
import { Picture } from './src/model/picture'
import { Tag } from './src/model/tag'
import { ProductTag } from './src/model/product-tag'
import { ModuleConfig } from '@myback/sdk'

const config: ModuleConfig = {
  name: 'Product',
  description: 'Manage Product items.',
  models: [Product, Contact, Transaction, TransactionItem, Picture, Tag, ProductTag]
}

module.exports = config
