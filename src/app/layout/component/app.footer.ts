import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `
    <div class="layout-footer justify-content-between">
    <!-- <footer id="footer" class="footer text-right"> -->


    <span class="font-medium ml-2">© <span id="year">{{anio}}</span> Desarrollado por <a href="*"
            target="_blank">CajalSac.com</a></span>
    <span class="font-medium ml-2"><b>Version: </b> {{version}}</span>
</div>
    `
})
export class AppFooter {
    version: string = '1.1.0-beta.1';
    anio: number = new Date().getFullYear();

}
