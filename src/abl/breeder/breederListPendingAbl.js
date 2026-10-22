
import { breederDao } from '../../dao/breederDao.js'; 

export async function breederListPendingAbl() {
  return await breederDao.listPending();
}