import BaseService from './BaseService'

class User extends BaseService {
  public name: string
  constructor(name: string) {
    super(['eat'])
    this.name = name
  }

  public eat(food: string) {
    console.log(`${this.name}吃${food}`)
  }
}

export default User
