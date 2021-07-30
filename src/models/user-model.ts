export class UserModel {
  id?: number
  email: string = ''
  password: string = ''
  name: string = ''

  static createInstance(id: number): UserModel {
    const instance = new UserModel()
    instance.id = id
    instance.name = `User ${id}`
    return instance
  }
}
