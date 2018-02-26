import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PriceCalculatorService } from '../../sidenav/shared/price-calculator.service';
import { BookingResponse, OrderResponse, OrderView } from '../../shared/viewModels/interfaces';
import { map, cloneDeep } from 'lodash';
import { Pagination, Sorting, FilterCockpit } from 'app/shared/backendModels/interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Injectable()
export class WaiterCockpitService {

  private readonly getReservationsRestPath: string = 'bookingmanagement/v1/booking/search';
  private readonly getOrdersRestPath: string = 'ordermanagement/v1/order/search';
  private readonly filterOrdersRestPath: string = 'ordermanagement/v1/order/search';

  constructor(private http: HttpClient,
              private priceCalculator: PriceCalculatorService) { }

  getOrders(pagination: Pagination, sorting: Sorting[], filters: FilterCockpit): Observable<OrderResponse> {
    let path: string;
    filters.pagination = pagination;
    filters.sort = sorting;
    if (filters.email || filters.bookingToken) {
      path = this.filterOrdersRestPath;
    } else {
      delete filters.email;
      delete filters.bookingToken;
      path = this.getOrdersRestPath;
    }
    // return this.http.post<OrderResponse[]>(`${environment.restServiceRoot}${path}`, filters);
    return Observable.of({result: undefined, pagination: {total: 0, size: 0, page: 0}});
  }

  getReservations(pagination: Pagination, sorting: Sorting[], filters: FilterCockpit): Observable<BookingResponse> {
    filters.pagination = pagination;
    filters.sort = sorting;
    // return this.http.post<BookingResponse[]>(`${environment.restServiceRoot}${this.getReservationsRestPath}`, filters);
    return Observable.of({ result: undefined, pagination: { total: 0, size: 0, page: 0 } });
  }
  orderComposer(orderList: OrderView[]): OrderView[] {
    let orders: OrderView[] = cloneDeep(orderList);
    map(orders, (o: OrderView) => {
      o.dish.price = this.priceCalculator.getPrice(o);
      o.extras = map(o.extras, 'name').join(', ');
    });
    return orders;
  }

  getTotalPrice(orderLines: OrderView[]): number {
    return this.priceCalculator.getTotalPrice(orderLines);
  }

}
