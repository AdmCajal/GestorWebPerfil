import { Component, OnInit } from '@angular/core';
import { Product } from '../asignar-servicio/model/asignar-servicio';
import { ProductService } from '../asignar-servicio/service/asignar-servicio.service';

@Component({
  selector: 'ngx-asignar-examenes',
  templateUrl: './asignar-examenes.component.html',
  styleUrls: ['./asignar-examenes.component.scss']
})
export class AsignarExamenesComponent implements OnInit {

  sourceProducts: Product[];

  targetProducts: Product[];

  constructor(private carService: ProductService) { }

  ngOnInit() {
      this.carService.getProductsSmall().then(products => this.sourceProducts = products);
      this.targetProducts = [];
  }
}
