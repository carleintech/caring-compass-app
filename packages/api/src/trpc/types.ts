import { 
  AnyRouter, 
  inferRouterInputs, 
  inferRouterOutputs,
  ProcedureBuilder,
  RootConfig,
  DefaultErrorShape
} from '@trpc/server'
import { PERMISSIONS } from '@caring-compass/auth'
import { BaseContext, ProtectedContext } from './context'

export type ProcedureType = ProcedureBuilder<any>

export type CRUDProcedures<T extends string> = {
  create: ProcedureType;
  read: ProcedureType;
  update: ProcedureType;
  delete: ProcedureType;
  list: ProcedureType;
}

export type RouterTypes<TRouter extends AnyRouter> = {
  input: inferRouterInputs<TRouter>;
  output: inferRouterOutputs<TRouter>;
}
