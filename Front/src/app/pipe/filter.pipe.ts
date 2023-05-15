import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class filter implements PipeTransform {


    fil: string;

    transform(items: any[], filter: Object): any {

        if (!items || !filter) {
            return items;
        }

        this.fil = filter.toString().toLocaleLowerCase().trim().replace(/ /g, '');
        // filter items array, items which match and return true will be
        // kept, false will be filtered out


        var search = [];


        for (var i = 0; i < items.length; i++) {
            if (this.ricorsive(items[i])) {
                search.push(items[i]);
            }
        }

        return search;

    }

    confronta(parola) {
        if (parola !== null && parola !== undefined && parola !== "" && parola.length !== 0) {
 
          parola = parola.toString().toLowerCase().trim().replace(/ /g, '')
          var soluzione = parola.includes(this.fil);
        return soluzione;
        }
        return false;
    }
    ricorsive(item) {



        var check = false;

        if (typeof item === 'string' || item instanceof String || !isNaN(item)) {

            check = this.confronta(item);
        }
        else {
            var obj = Object.keys(item);

            for (var j = 0; j < obj.length && !check; j++) {
                check = this.ricorsive(item[obj[j]]);
            }
        }

        return check;
    }
}