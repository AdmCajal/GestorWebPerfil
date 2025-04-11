let agregarDia = function (fecha: Date): Date {
    fecha.setDate(fecha.getDate() + 1);
    return fecha;
}

let obtenerPrimerDiaDelMes = function (fecha: Date): Date {
    return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
}

let obtenerUltimoDiaDelMes = function (fecha: Date): Date {
    return new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
}

let obtenerFormatoPeriodo = function (fecha: Date): string {
    return fecha.toISOString().slice(0, 7).replace(/-/g, "");
}


const obtenerPorDiaFechaHoraFin = function (fecha: Date): Date {
    return new Date(fecha.setHours(23, 59));
};



let regexIso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
let convertDateStringsToDates = function (input: any): any {
    if (typeof input !== "object") return input;

    for (let key in input) {
        if (!input.hasOwnProperty(key)) continue;

        let value = input[key];
        let match: any;
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
            //para validar los que vienen con el cero adelante que no los tome solo fechas
            var resul = isValidDate(value.substring(-1, 10));
            if (resul) {
                let milliseconds = Date.parse(match[0])
                if (!isNaN(milliseconds)) {
                    input[key] = new Date(milliseconds);
                }
            }
        } else if (typeof value === "object") {
            convertDateStringsToDates(value);
        }
    }
    return input;
}


function isValidDate(dateString) {
    var dateStringSplit = dateString.split('-');
    var year, month, day;
    if (dateString.length >= 8 && dateString.length <= 10) {
        try {
            day = parseInt(dateStringSplit[2]), 10;
            year = parseInt(dateStringSplit[0], 10) ;
            month = parseInt(dateStringSplit[1], 10);
            var d = new Date(year, month - 1, day);
             if (d.getFullYear() === year && (d.getMonth() + 1) === month && d.getDate() === day) {
                return true;
            }
            else {
                return false;
            }

        } catch (e) {
            return false;
        }
    }
    return false;

};

let ddMMyyyy = function (date: Date): string {
    let MM = date.getMonth() + 1;
    let dd = date.getDate();

    return [`${dd > 9 ? '' : '0'}${dd}`, `${MM > 9 ? '' : '0'}${MM}`, date.getFullYear()].join('/');
}




export { agregarDia, obtenerPrimerDiaDelMes, obtenerUltimoDiaDelMes, obtenerFormatoPeriodo, obtenerPorDiaFechaHoraFin, convertDateStringsToDates, ddMMyyyy }