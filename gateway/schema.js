const { gql } = require('graphql-tag');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String
  }

  type Order {
    id: ID!
    userId: ID!
    items: [String!]!
    totalAmount: Float!
    status: String!
    createdAt: String
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  type OrderResponse {
    message: String!
    order: Order!
  }

  type Query {
    # User queries
    getUser(token: String!): User
    
    # Order queries
    getOrders(token: String!): [Order]
    getOrder(token: String!, id: ID!): Order
  }

  type Mutation {
    # Auth mutations
    login(email: String!, password: String!): AuthResponse
    register(name: String!, email: String!, password: String!): String
    
    # Order mutations
    createOrder(token: String!, items: [String!]!, totalAmount: Float!): OrderResponse
    validateOrder(token: String!, orderId: ID!): OrderResponse
  }
`;
