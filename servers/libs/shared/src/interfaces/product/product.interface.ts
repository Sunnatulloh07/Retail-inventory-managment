import { Observable } from 'rxjs';
import { GetProductRequest, Product } from './product-client.interface';

export interface ProductServiceClient {
  getProduct(request: GetProductRequest): Observable<Product>;
}
