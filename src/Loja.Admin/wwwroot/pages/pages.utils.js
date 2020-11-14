var pages = pages || {};

pages.utils = function () {

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    const dayOfWeekNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sabado"]

    function initDataPassword() {
        $("[data-password]").on('click', function () {
            if ($(this).attr('data-password') == "false") {
                $(this).siblings("input").attr("type", "text");
                $(this).attr('data-password', 'true');
                $(this).addClass("show-password");
            } else {
                $(this).siblings("input").attr("type", "password");
                $(this).attr('data-password', 'false');
                $(this).removeClass("show-password");
            }
        });
    };

    function getUrlParameter (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    function formataDecimal(valor) {        
        return valor.replaceAll(".", "").replace(',', '.');
    };

    function format(date, formato) {
        if (date == null || date == "")
            return "";

        if (formato == null)
            formato = "dd/MM/yyyy HH:mm:ss";

        var yearFull = date.getFullYear();
        var yearMin = yearFull.toString().substring(2);
        var month = date.getMonth() + 1;
        var monthName = monthNames[month - 1];
        var day = date.getDate();
        var dayOfWeekName = dayOfWeekNames[date.getDay()];
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        if (day < 10)
            day = "0" + day;

        if (month < 10)
            month = "0" + month;

        if (hours < 10)
            hours = "0" + hours;

        if (minutes < 10)
            minutes = "0" + minutes;

        if (seconds < 10)
            seconds = "0" + seconds;

        return formato.replace("yyyy", yearFull).replace("yy", yearMin)
            .replace("MMMM", monthName).replace("MM", month)
            .replace("dd", day).replace("EEEE", dayOfWeekName)
            .replace("HH", hours).replace("mm", minutes)
            .replace("ss", seconds);
    };

    var languageDataTablePtBr = {
        "sEmptyTable": "Nenhum registro encontrado",
        "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
        "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
        "sInfoFiltered": "(Filtrados de _MAX_ registros)",
        "sInfoPostFix": "",
        "sInfoThousands": ".",
        "sLengthMenu": "_MENU_ resultados por página",
        "sLoadingRecords": "Carregando...",
        "sProcessing": "Processando...",
        "sZeroRecords": "Nenhum registro encontrado",
        "sSearch": "Buscar",
        "oPaginate": {
            "sNext": "Próximo",
            "sPrevious": "Anterior",
            "sFirst": "Primeiro",
            "sLast": "Último"
        },
        "oAria": {
            "sSortAscending": ": Ordenar colunas de forma ascendente",
            "sSortDescending": ": Ordenar colunas de forma descendente"
        },
        "select": {
            "rows": {
                "_": "Selecionado %d linhas",
                "0": "Nenhuma linha selecionada",
                "1": "Selecionado 1 linha"
            }
        },
        buttons: {
            copyTitle: 'Copiar',
            copySuccess: {
                _: '%d linhas copiadas para área de transferência',
                1: '1 linha copiada para área de transferência'
            }
        }
    };

    var hexToRGB = function (hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        if (alpha) {
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        } else {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    }
   
    return {
        initDataPassword,
        getUrlParameter,
        languageDataTablePtBr,
        formataDecimal,
        format,
        hexToRGB
    };
}();