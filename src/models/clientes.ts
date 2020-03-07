export class Clientes{
    constructor(
      public key?:string,
      public nome?:string,
      public cnpj?:string,
      public endereco?:string,
      public complemente?: string,
      public cidade?:string,
      public estado?: string,
      public cep?: string
    ){}
}