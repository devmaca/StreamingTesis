var millDay = 86400000;
var date = new Date(vehiculo.videos[0].time);
var vCam1 = [];
var vCam2 = [];
var cont1 = 0;
var cont2 = 0;

console.log(vehiculo.videos[0]);
$(function () {
    $.datepicker.setDefaults($.datepicker.regional["es"]);
    $("#datepicker").datepicker({
        firstDay: 1
    });
});

function vid() {
    var hr = document.getElementById('horaFecha');
    var video = document.getElementById('datepicker');
    var v1 = document.getElementById("video1");
    var v2 = document.getElementById("video2");
    var wbm1 = document.getElementById("webm1");
    var wbm2 = document.getElementById("webm2");
    var hrSelect = hr.value * 3600000;
    console.log("asdasd", video.value);
    var ad = new Date(video.value);
    var dayDespues = ad.getTime() + millDay;
    var HoraDiaSelect = (ad.getTime() + hrSelect)-(4*3600000);
    var HoraDiaDespues = HoraDiaSelect + 3600000;
    console.log(ad, "Hora mas", new Date(HoraDiaSelect), new Date(HoraDiaDespues),new Date(vehiculo.videos[0].time));
    var videosDia = [];
    vehiculo.videos.forEach(element => {
        if (element.time < HoraDiaDespues && element.time > HoraDiaSelect) {
            videosDia.push(element);
        }
    });

    v1.onended = function () {
        if (cont1 < vCam1.length) {
            cont1++;
            wbm1.src = '/videos/' + vCam1[cont1].name;
            v1.load();
            v1.play();
        }
        console.log("finalizando");
    };
    v2.onended = function () {
        if (cont2 < vCam2.length) {
            cont2++;
            wbm2.src = '/videos/' + vCam2[cont2].name;
            v2.load();
            v2.play();
        }
        console.log("finalizando");
    };
    videosDia.forEach(element => {
        if (element.cam == 1) vCam1.push(element);
        else vCam2.push(element);
    });
    for (let index = 0; index < vCam1.length; index++) {
        const element = vCam1[index];
        var hora = new Date(element.time);
        var stro = hora.getUTCHours() + ":" + hora.getUTCMinutes() + ":" + hora.getUTCSeconds();
        cargarBoton(stro, index);
    }
    document.getElementById('botton1').innerHTML = divHtml;
    for (let index = 0; index < vCam2.length; index++) {
        const element = vCam2[index];
        var hora = new Date(element.time);
        var stro = hora.getUTCHours() + ":" + hora.getUTCMinutes() + ":" + hora.getUTCSeconds();
        cargarBoton2(stro, index);
    }
    document.getElementById('botton2').innerHTML = divHtml2;
    wbm1.src = "/videos/" + vCam1[0].name;
    v1.load();
    v1.play();
    wbm2.src = "/videos/" + vCam2[0].name;
    v2.load();
    v2.play();

}

var divHtml = '';
function cargarBoton(name, indx) {

    divHtml += "<input type='button' value='" + name + "' onclick='reproducir1(" + indx + ")'><br>";
}
function reproducir1(indx) {
    var v1 = document.getElementById("video1");
    var wbm1 = document.getElementById("webm1");
    cont1 = indx;
    wbm1.src = '/videos/' + vCam1[indx].name;
    v1.load();
    v1.play();
}
var divHtml2 = '';
function cargarBoton2(name, indx) {
    divHtml2 += "<input type='button' value='" + name + "' onclick='reproducir2(" + indx + ")'><br>";
}
function reproducir2(indx) {
    var v2 = document.getElementById("video2");
    var wbm2 = document.getElementById("webm2");
    cont2 = indx;
    wbm2.src = '/videos/' + vCam1[indx].name;
    v2.load();
    v2.play();
}