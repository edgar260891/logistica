var aux=false;
var map;

var vri;
var vrm;
var clientes;
var items;
var sucursales;
var clases;
var tipos;
var marcas;

var chart;
var chart2;
var chart3;

var operacion="RI";

var criterio="Piezas";

var sucursal_num=13;
var sucursal_valor="1";

var clase_num=13;
var clase_valor="1";

var tipo_num=13;
var tipo_valor="1";

var marca_num=13;
var marca_valor="1";

var cliente_num=13;
var cliente_valor="1";

var item_num=13;
var item_valor="1";

var zona_num=13;
var zona_valor="1";

var enero=0;
var febrero=0;
var marzo=0;
var abril=0;
var mayo=0;
var junio=0;
var julio=0;
var agosto=0;
var septiembre=0;
var octubre=0;
var noviembre=0;
var diciembre=0;

var factor=0;

var logo;

var fecha_inicial;
var fecha_final;

var meses = [];
var promedios = [];
var diferencias = [];
var esperados = [];
var forecast_1 = [];
var forecast_IA = [];

var estados_nombre = ["AGS","TJN","LPZ","TUX","TPC","CHH","CDJ","MCL","TOR","COL","DGO","CMD","TOL","CEL","IRA","LEN","GDL","TLT","MOR","ZAM","CUE","TEP","MTY",
                      "OAX","PUE","QRO","CUN","CEN","SLP","CUL","LMC","HER","VHS","RSA","TAM","TLX","COA","VER","MER","ZAC",];
var estados_valores = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];

function preload()
{
    map = new Datamap({element: document.getElementById('chart2'),
    responsive:false,
    setProjection:function(element) {
    var projection = d3.geo.equirectangular()
      .center([-100, 25])
      .rotate([2.5, 0])
      .scale(900)
      .translate([element.offsetWidth/2, element.offsetHeight/2]);
      var path = d3.geo.path().projection(projection);
      return {path: path, projection: projection};},
    });
    
    ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {

    type: 'line',

    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre','Forecast'],
        datasets: [{
            label: 'Comportamiento mensual',
            backgroundColor: 'rgb(255,255,255,0)',
            borderColor: 'rgb(255, 99, 132)',
            data: []
        },
        {
            label: 'Promedio',
            backgroundColor: 'rgb(255, 255, 255,0)',
            borderColor: 'rgb(0, 99, 132)',
            data: []
        },
        {
            label: 'Forecast 1',
            backgroundColor: 'rgb(255, 255, 255,0)',
            borderColor: 'rgb(0, 200, 0)',
            data: []
        },
        {
            label: 'Forcast IA',
            backgroundColor: 'rgb(255, 255, 255,0)',
            borderColor: 'rgb(100, 99, 132)',
            data: []
        }]
    },
    options: {}
});

    ctx2 = document.getElementById('chart3').getContext('2d');
    chart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre','Forecast'],
    datasets: [
    {
        label: 'Diferencia',
        barPercentage: 0.5,
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
        backgroundColor: 'rgb(255, 133, 33,50)',
        data: [],
    }]
    },
    options: {}
});
    
    ctx3 = document.getElementById('chart4').getContext('2d');
    chart3 = new Chart(ctx3, {
    type: 'bar',
    data: {
    labels: estados_nombre,
    datasets: [
    {
        label: 'Cantidad',
        barPercentage: 0.5,
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
        backgroundColor: 'rgb(255, 0, 0,50)',
        data: [],
    }]
    },
    options: {}
});
  vri = loadTable('data/VRI.csv', 'csv', 'header');
  vrm = loadTable('data/VRM.csv', 'csv', 'header');
  clientes = loadTable("data/CLIENTES.csv", 'csv', 'header');
  items = loadTable("data/ITEMS.csv", 'csv', 'header');
  sucursales = loadTable("data/SUCURSALES.csv", 'csv', 'header');
  clases = loadTable("data/CLASES.csv", 'csv', 'header');
  tipos = loadTable("data/TIPOS.csv", 'csv', 'header');
  marcas = loadTable("data/MARCAS.csv", 'csv', 'header');
}
function setup() 
{
   
  createCanvas(windowWidth,windowHeight);
  background(255);
  
  logo=loadImage("data/logo.png");
  
  
  boton = createButton('Buscar');
  boton.position((80*windowWidth)/100,(20*windowHeight)/100);
  boton.size((10*windowWidth)/100,(5*windowHeight)/100);
  boton.mousePressed(buscar);
  
  sel2 = createSelect();
  sel2.position((2*windowWidth)/100,(20*windowHeight)/100);
  sel2.size((10*windowWidth)/100,(5*windowHeight)/100);
  sel2.option("Todas las clases");
  for(var cl=0;cl<clases.getRowCount();cl++)
  {
    sel2.option(clases.getString(cl,0)+"-"+clases.getString(cl,1));
  }
  sel2.changed(sel_clase);
  
  
  sel5 = createSelect();
  sel5.position((54*windowWidth)/100,(20*windowHeight)/100);
  sel5.size((10*windowWidth)/100,(5*windowHeight)/100);
  sel5.option("RI");
  sel5.option("RM");
  sel5.changed(sel_operacion);
  
  sel6 = createSelect();
  sel6.position((67*windowWidth)/100,(20*windowHeight)/100);
  sel6.size((10*windowWidth)/100,(5*windowHeight)/100);
  sel6.option("Piezas");
  sel6.option("Costo");
  sel6.option("Precio");
  sel6.option("Margen");
  sel6.changed(sel_criterio);
  
  sel9 = createSelect();
  sel9.position((2*windowWidth)/100,(27*windowHeight)/100);
  sel9.size((10*windowWidth)/100,(5*windowHeight)/100);
  sel9.option("Todas las zonas");
  sel9.option("N-Zona norte");
  sel9.option("O-Zona occidente"); 
  sel9.option("S-Zona centro");
  sel9.option("E-Zona sur");
  sel9.changed(sel_zona);
  
  fecha_inicial = createInput('Fecha_inicial','date');
  //fecha_inicial.input(F_INICIAL);
  fecha_inicial.size((10*windowWidth)/100,(5*windowHeight)/100);
  fecha_inicial.position((54*windowWidth)/100,(27*windowHeight)/100);
  
  fecha_final = createInput('Fecha_final','date');
  //fecha_final.input(F_FINAL);
  fecha_final.size((10*windowWidth)/100,(5*windowHeight)/100);
  fecha_final.position((67*windowWidth)/100,(27*windowHeight)/100);
 
}


function draw() 
{
  background(255);
  noStroke();
  fill(222,222,222);
  rect(0,0,windowWidth,windowHeight/8);
  
  textSize((3)*(windowWidth)/100);
  fill(0);
  text("TBC-DS-LOGISTICA",(35*windowWidth)/100,(8.5*windowHeight)/100);
  
  image(logo,0,0,windowWidth/12,windowHeight/8);
  
}

function grafica(chart,valores1,valores2)
{
    chart.data = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre','Forecast'],
        datasets: [{
            label: 'Comportamiento mensual',
            backgroundColor: 'rgb(255,255,255,0)',
            borderColor: 'rgb(255, 99, 132)',
            data: valores1
        },
        {
            label: 'Promedio',
            backgroundColor: 'rgb(255, 255, 255,0)',
            borderColor: 'rgb(0, 99, 132)',
            data: valores2
        }]
    };
    chart.update();
}

function grafica2(chart,datos1)
{
  chart.data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre','Forecast'],
    datasets: [
    {
        label: 'Diferencia',
        barPercentage: 0.5,
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
        backgroundColor: 'rgb(255, 133, 33,50)',
        data: datos1,
    }]
  };
  chart.update();
}

function grafica3(chart,datos2)
{
  chart.data = {
    labels: estados_nombre,
    datasets: [
    {
        label: 'Cantidad',
        barPercentage: 0.5,
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
        backgroundColor: 'rgb(255, 0, 0,50)',
        data: datos2,
    }]
    };
    chart.update();
}

function mapa(e,f)
{
    map.bubbles([
    {
      name:'Aguascalientes: '+e[0],
      radius: (20*e[0])/f,
      latitude: 21.857309,
      longitude: -102.29475,
      borderColor: '#F2141B',
    },
    {
      name:'Tijuana: '+e[1],
      radius: (20*e[1])/f,
      latitude: 32.464413,
      longitude: -116.989729,
      borderColor: '#C90E9E',
    },
    {
      name:'La Paz: '+e[2],
      radius: (20*e[2])/f,
      latitude: 24.1322349,
      longitude: -110.299346,
      borderColor: '#5B0EC9',
    },
    {
      name:'Tuxtla Gutierrez: '+e[3],
      radius: (20*e[3])/f,
      latitude: 16.734005,
      longitude: -93.1671665,
      borderColor: '#330EC9',
    },
     {
      name:'Tapachula: '+e[4],
      radius: (20*e[4])/f,
      latitude: 14.8790855,
      longitude: -92.3043058,
      borderColor: '#0E1FC9',
    },
     {
      name:'Chihuahua: '+e[5],
      radius: (20*e[5])/f,
      latitude: 28.6683448,
      longitude: -106.0861773,
      borderColor: '#0E2BC9',
    },
     {
      name:'Ciudad Juarez: '+e[6],
      radius: (20*e[6])/f,
      latitude: 31.7139909,
      longitude: -106.4394749,
      borderColor: '#0E63C9',
    },
    {
      name:'Monclova: '+e[7],
      radius: (20*e[7])/f,
      latitude:  26.9229887,
      longitude: -101.4217056,
      borderColor: '#0EA2C9',
    },
    {
      name:'Torreon: '+e[8],
      radius: (20*e[8])/f,
      latitude: 25.5290588,
      longitude: -103.3728342,
      borderColor: '#0EC9C4',
    },
    {
      name:'Comala: '+e[9],
      radius: (20*e[9])/f,
      latitude: 19.290551,
      longitude: -103.7484362,
      borderColor: '#0EC999',
    },
    {
      name:'Durango: '+e[10],
      radius: (20*e[10])/f,
      latitude: 24.071700,
      longitude: -104.657438,
      borderColor: '#0EC967',
    },
    {
      name:'Naucalpan: '+e[11],
      radius: (20*e[11])/f,
      latitude: 19.471134,
      longitude: -99.242946,
      borderColor: '#0EC94E',
    },
    {
      name:'Toluca '+e[12],
      radius: (20*e[12])/f,
      latitude: 19.2919432,
      longitude: -99.6338472,
      borderColor: '#0EC92E',
    },
    {
      name:'Celaya: '+e[13],
      radius: (20*e[13])/f,
      latitude: 20.5499902,
      longitude: -100.7992054,
      borderColor: '#17C90E',
    },
    {
      name:'Irapuato: '+e[14],
      radius: (20*e[14])/f,
      latitude: 20.7061079,
      longitude: -101.35048,
      borderColor: '#2CC90E',
    },
    {
      name:'Leon: '+e[15],
      radius: (20*e[15])/f,
      latitude: 21.130175,
      longitude: -101.630155,
      borderColor: '#4CC90E',
    },
    {
      name:'Guadalajara: '+e[16],
      radius: (20*e[16])/f,
      latitude: 20.6359385,
      longitude: -103.3350098,
      borderColor: '#71C90E',
    },
    {
      name:'Tultitlan: '+e[17],
      radius: (20*e[17])/f,
      latitude: 19.622625,
      longitude: -99.163728,
      borderColor: '#A3C90E',
    },
    {
      name:'Morelia: '+e[18],
      radius: (20*e[18])/f,
      latitude: 19.719193,
      longitude:  -101.227973,
      borderColor: '#B9C90E',
    },
    {
      name:'Zamora: '+e[19],
      radius: (20*e[19])/f,
      latitude: 19.974898,
      longitude: -102.273923,
      borderColor: '#C9C00E',
    },
    {
      name:'Cuernavaca: '+e[20],
      radius: (20*e[20])/f,
      latitude: 18.889013,
      longitude: -99.173367,
      borderColor: '#C99E0E',
    },
    {
      name:'Tepic: '+e[21],
      radius: (20*e[21])/f,
      latitude: 21.5201983,
      longitude: -104.9221605,
      borderColor: '#C9880E',
    },
    {
      name:'Monterrey: '+e[22],
      radius: (20*e[22])/f,
      latitude: 25.8043183,
      longitude: -100.3533507,
      borderColor: '#C9620E',
    },
    {
      name:'Oaxaca: '+e[23],
      radius: (20*e[23])/f,
      latitude: 17.0879703,
      longitude: -96.7519174,
      borderColor: '#C9490E',
    },
    {
      name:'Puebla: '+e[24],
      radius: (20*e[24])/f,
      latitude: 19.0597044,
      longitude: -98.2114461,
      borderColor: '#C9340E',
    },
    {
      name:'Queretaro: '+e[25],
      radius: (20*e[25])/f,
      latitude: 20.60323,
      longitude: -100.416514,
      borderColor: '#C92D0E',
    },
    {
      name:'Cancun: '+e[26],
      radius: (20*e[26])/f,
      latitude: 21.049478,
      longitude: -86.860377,
      borderColor: '#F05A5A',
    },
    {
      name:'CEDI-SLP: '+e[27],
      radius: (20*e[27])/f,
      latitude: 22.11566,
      longitude: -100.906635,
      borderColor: '#F05A87',
    },
    {
      name:'San Luis Potosi: '+e[28],
      radius: (20*e[28])/f,
      latitude: 22.1730123,
      longitude: -100.9570771,
      borderColor: '#F05ABB',
    },
    {
      name:'Culiacan: '+e[29],
      radius: (20*e[29])/f,
      latitude: 24.773356,
      longitude: -107.430064,
      borderColor: '#F05AD7',
    },
    {
      name:'Los Mochis: '+e[30],
      radius: (20*e[30])/f,
      latitude: 25.814542,
      longitude: -108.972486,
      borderColor: '#F05AED',
    },
    {
      name:'Hermosillo: '+e[31],
      radius: (20*e[31])/f,
      latitude: 29.1003737,
      longitude: -111.0211254,
      borderColor: '#DE5AF0',
    },
    {
      name:'VilLahermosa: '+e[32],
      radius: (20*e[32])/f,
      latitude: 17.9665846,
      longitude: -92.9297759,
      borderColor: '#CC5AF0',
    },
    {
      name:'Reynosa: '+e[33],
      radius: (20*e[33])/f,
      latitude: 26.0343093,
      longitude: -98.3147667,
      borderColor: '#B55AF0',
    },
    {
      name:'Tampico: '+e[34],
      radius: (20*e[34])/f,
      latitude: 22.285915,
      longitude: -97.874516,
      borderColor: '#A15AF0',
    },
    {
      name:'Calpulapan: '+e[35],
      radius: (20*e[35])/f,
      latitude: 19.5920103,
      longitude: -98.564607,
      borderColor: '#905AF0',
    },
    {
      name:'Coatzacoalcos: '+e[36],
      radius: (20*e[36])/f,
      latitude: 18.1513729,
      longitude: -94.5542589,
      borderColor: '#775AF0',
    },
    {
      name:'Veracruz: '+e[37],
      radius: (20*e[37])/f,
      latitude: 19.134465,
      longitude: -96.1438256,
      borderColor: '#5A73F0',
    },
    {
      name:'Merida: '+e[38],
      radius: (20*e[38])/f,
      latitude: 21.047977,
      longitude: -89.637161,
      borderColor: '#5AA6F0',
    },
    {
      name:'Guadalupe: '+e[39],
      radius: (20*e[39])/f,
      latitude:  22.75224,
      longitude: -102.501547,
      borderColor: '#5ADAF0',
    },
    
    ]);
}

function buscar()
{
  if(operacion=="RI")
  {
    for(var i=0;i<vri.getRowCount();i++)
    {
        if(vri.getNum(i,8)>=119001 && vri.getNum(i,8)<119032)
        {
           if(vri.getString(i,sucursal_num)==sucursal_valor && vri.getString(i,clase_num)==clase_valor && vri.getString(i,tipo_num)==tipo_valor && vri.getString(i,marca_num)==marca_valor && vri.getString(i,cliente_num)==cliente_valor && vri.getString(i,item_num)==item_valor && vri.getString(i,zona_num)==zona_valor)
           {
             if(criterio=="Piezas")
             {
                enero=enero+vri.getNum(i,3);
             }
             if(criterio=="Costo")
             {
                enero=enero+(vri.getNum(i,11)/100);
             }
             if(criterio=="Precio")
             {
                enero=enero+(vri.getNum(i,10)/100);
             }
             if(criterio=="Margen")
             {
                enero=enero+(vri.getNum(i,12)/100);
             }
           }
        }
        if(vri.getNum(i,8)>=119032 && vri.getNum(i,8)<119060)
        {
          if(vri.getString(i,sucursal_num)==sucursal_valor && vri.getString(i,clase_num)==clase_valor && vri.getString(i,tipo_num)==tipo_valor && vri.getString(i,marca_num)==marca_valor && vri.getString(i,cliente_num)==cliente_valor && vri.getString(i,item_num)==item_valor && vri.getString(i,zona_num)==zona_valor)
           {
             if(criterio=="Piezas")
             {
                febrero=febrero+vri.getNum(i,3);
             }
             else if(criterio=="Costo")
             {
                febrero=febrero+(vri.getNum(i,11)/100);
             }
             else if(criterio=="Precio")
             {
                febrero=febrero+(vri.getNum(i,10)/100);
             }
             else if(criterio=="Margen")
             {
                febrero=febrero+(vri.getNum(i,12)/100);
             }
           }
        }
        if(vri.getNum(i,8)>=119060 && vri.getNum(i,8)<119091)
        {
          if(vri.getString(i,sucursal_num)==sucursal_valor && vri.getString(i,clase_num)==clase_valor && vri.getString(i,tipo_num)==tipo_valor && vri.getString(i,marca_num)==marca_valor && vri.getString(i,cliente_num)==cliente_valor && vri.getString(i,item_num)==item_valor && vri.getString(i,zona_num)==zona_valor)
           {
             if(criterio=="Piezas")
             {
                marzo=marzo+vri.getNum(i,3);
             }
             else if(criterio=="Costo")
             {
                marzo=marzo+(vri.getNum(i,11)/100);
             }
             else if(criterio=="Precio")
             {
                marzo=marzo+(vri.getNum(i,10)/100);
             }
             else if(criterio=="Margen")
             {
                marzo=marzo+(vri.getNum(i,12)/100);
             }
           }
        }
        if(vri.getNum(i,8)>=119091 && vri.getNum(i,8)<119121)
        {
          if(vri.getString(i,sucursal_num)==sucursal_valor && vri.getString(i,clase_num)==clase_valor && vri.getString(i,tipo_num)==tipo_valor && vri.getString(i,marca_num)==marca_valor && vri.getString(i,cliente_num)==cliente_valor && vri.getString(i,item_num)==item_valor && vri.getString(i,zona_num)==zona_valor)
           {
             if(criterio=="Piezas")
             {
                abril=abril+vri.getNum(i,3);
             }
             else if(criterio=="Costo")
             {
                abril=abril+(vri.getNum(i,11)/100);
             }
             else if(criterio=="Precio")
             {
                abril=abril+(vri.getNum(i,10)/100);
             }
             else if(criterio=="Margen")
             {
                abril=abril+(vri.getNum(i,12)/100);
             }
           }
        }
        if(vri.getNum(i,8)>=119121 && vri.getNum(i,8)<119152)
        {
          if(vri.getString(i,sucursal_num)==sucursal_valor && vri.getString(i,clase_num)==clase_valor && vri.getString(i,tipo_num)==tipo_valor && vri.getString(i,marca_num)==marca_valor && vri.getString(i,cliente_num)==cliente_valor && vri.getString(i,item_num)==item_valor && vri.getString(i,zona_num)==zona_valor)
           {
             if(criterio=="Piezas")
             {
                mayo=mayo+vri.getNum(i,3);
             }
             else if(criterio=="Costo")
             {
                mayo=mayo+(vri.getNum(i,11)/100);
             }
             else if(criterio=="Precio")
             {
                mayo=mayo+(vri.getNum(i,10)/100);
             }
             else if(criterio=="Margen")
             {
                mayo=mayo+(vri.getNum(i,12)/100);
             }
           } 
        }
        if(vri.getNum(i,8)>=119152 && vri.getNum(i,8)<119182)
        {
          if(vri.getString(i,sucursal_num)==sucursal_valor && vri.getString(i,clase_num)==clase_valor && vri.getString(i,tipo_num)==tipo_valor && vri.getString(i,marca_num)==marca_valor && vri.getString(i,cliente_num)==cliente_valor && vri.getString(i,item_num)==item_valor && vri.getString(i,zona_num)==zona_valor)
           {
             if(criterio=="Piezas")
             {
                junio=junio+vri.getNum(i,3);
             }
             else if(criterio=="Costo")
             {
                junio=junio+(vri.getNum(i,11)/100);
             }
             else if(criterio=="Precio")
             {
                junio=junio+(vri.getNum(i,10)/100);
             }
             else if(criterio=="Margen")
             {
                junio=junio+(vri.getNum(i,12)/100);
             }
           }
        }
        if(vri.getNum(i,8)>=119182 && vri.getNum(i,8)<119213)
        {
          if(vri.getString(i,sucursal_num)==sucursal_valor && vri.getString(i,clase_num)==clase_valor && vri.getString(i,tipo_num)==tipo_valor && vri.getString(i,marca_num)==marca_valor && vri.getString(i,cliente_num)==cliente_valor && vri.getString(i,item_num)==item_valor && vri.getString(i,zona_num)==zona_valor)
           {
             if(criterio=="Piezas")
             {
                julio=julio+vri.getNum(i,3);
             }
             else if(criterio=="Costo")
             {
                julio=julio+(vri.getNum(i,11)/100);
             }
             else if(criterio=="Precio")
             {
                julio=julio+(vri.getNum(i,10)/100);
             }
             else if(criterio=="Margen")
             {
                julio=julio+(vri.getNum(i,12)/100);
             }
           }
        }
        if(vri.getNum(i,8)>=119213 && vri.getNum(i,8)<119244)
        {
          if(vri.getString(i,sucursal_num)==sucursal_valor && vri.getString(i,clase_num)==clase_valor && vri.getString(i,tipo_num)==tipo_valor && vri.getString(i,marca_num)==marca_valor && vri.getString(i,cliente_num)==cliente_valor && vri.getString(i,item_num)==item_valor && vri.getString(i,zona_num)==zona_valor)
           {
             if(criterio=="Piezas")
             {
                agosto=agosto+vri.getNum(i,3);
             }
             else if(criterio=="Costo")
             {
                agosto=agosto+(vri.getNum(i,11)/100);
             }
             else if(criterio=="Precio")
             {
                agosto=agosto+(vri.getNum(i,10)/100);
             }
             else if(criterio=="Margen")
             {
                agosto=agosto+(vri.getNum(i,12)/100);
             }
           }
        }
        if(vri.getNum(i,8)>=119244 && vri.getNum(i,8)<119274)
        {
          if(vri.getString(i,sucursal_num)==sucursal_valor && vri.getString(i,clase_num)==clase_valor && vri.getString(i,tipo_num)==tipo_valor && vri.getString(i,marca_num)==marca_valor && vri.getString(i,cliente_num)==cliente_valor && vri.getString(i,item_num)==item_valor && vri.getString(i,zona_num)==zona_valor)
           {
             if(criterio=="Piezas")
             {
                septiembre=septiembre+vri.getNum(i,3);
             }
             else if(criterio=="Costo")
             {
                septiembre=septiembre+(vri.getNum(i,11)/100);
             }
             else if(criterio=="Precio")
             {
                septiembre=septiembre+(vri.getNum(i,10)/100);
             }
             else if(criterio=="Margen")
             {
                septiembre=septiembre+(vri.getNum(i,12)/100);
             }
           }
        }
        if(vri.getNum(i,8)>=119274 && vri.getNum(i,8)<119305)
        {
          if(vri.getString(i,sucursal_num)==sucursal_valor && vri.getString(i,clase_num)==clase_valor && vri.getString(i,tipo_num)==tipo_valor && vri.getString(i,marca_num)==marca_valor && vri.getString(i,cliente_num)==cliente_valor && vri.getString(i,item_num)==item_valor && vri.getString(i,zona_num)==zona_valor)
           {
             if(criterio=="Piezas")
             {
                octubre=octubre+vri.getNum(i,3);
             }
             else if(criterio=="Costo")
             {
                octubre=octubre+(vri.getNum(i,11)/100);
             }
             else if(criterio=="Precio")
             {
                octubre=octubre+(vri.getNum(i,10)/100);
             }
             else if(criterio=="Margen")
             {
                octubre=octubre+(vri.getNum(i,12)/100);
             }
           }
        }
        if(vri.getNum(i,8)>=119305 && vri.getNum(i,8)<119335)
        {
          if(vri.getString(i,sucursal_num)==sucursal_valor && vri.getString(i,clase_num)==clase_valor && vri.getString(i,tipo_num)==tipo_valor && vri.getString(i,marca_num)==marca_valor && vri.getString(i,cliente_num)==cliente_valor && vri.getString(i,item_num)==item_valor && vri.getString(i,zona_num)==zona_valor)
           {
             if(criterio=="Piezas")
             {
                noviembre=noviembre+vri.getNum(i,3);
             }
             else if(criterio=="Costo")
             {
                noviembre=noviembre+(vri.getNum(i,11)/100);
             }
             else if(criterio=="Precio")
             {
                noviembre=noviembre+(vri.getNum(i,10)/100);
             }
             else if(criterio=="Margen")
             {
                noviembre=noviembre+(vri.getNum(i,12)/100);
             }
           }
        }
        if(vri.getNum(i,8)>=119335 && vri.getNum(i,8)<120002)
        {
          if(vri.getString(i,sucursal_num)==sucursal_valor && vri.getString(i,clase_num)==clase_valor && vri.getString(i,tipo_num)==tipo_valor && vri.getString(i,marca_num)==marca_valor && vri.getString(i,cliente_num)==cliente_valor && vri.getString(i,item_num)==item_valor && vri.getString(i,zona_num)==zona_valor)
           {
             if(criterio=="Piezas")
             {
                diciembre=diciembre+vri.getNum(i,3);
             }
             else if(criterio=="Costo")
             {
                diciembre=diciembre+(vri.getNum(i,11)/100);
             }
             else if(criterio=="Precio")
             {
                diciembre=diciembre+(vri.getNum(i,10)/100);
             }
             else if(criterio=="Margen")
             {
                diciembre=diciembre+(vri.getNum(i,12)/100);
             }
           }
        }
        for(var k=0;k<40;k++)
        {
           if(vri.getString(i,0)=='         '+estados_nombre[k])
           {
             if(vri.getString(i,sucursal_num)==sucursal_valor && vri.getString(i,clase_num)==clase_valor && vri.getString(i,tipo_num)==tipo_valor && vri.getString(i,marca_num)==marca_valor && vri.getString(i,cliente_num)==cliente_valor && vri.getString(i,item_num)==item_valor && vri.getString(i,zona_num)==zona_valor)
             {
               if(criterio=="Piezas")
               {
                  let temp1 = vri.getNum(i,3);
                  estados_valores[k]=estados_valores[k]+ temp1;
               }
               else if(criterio=="Costo")
               {
                  let temp2 = vri.getNum(i,11)/100;
                  estados_valores[k]=estados_valores[k]+ temp2;
               }
               else if(criterio=="Precio")
               {
                  let temp3 = vri.getNum(i,10)/100;
                  estados_valores[k]=estados_valores[k]+ temp3;
               }
               else if(criterio=="Margen")
               {
                  let temp4 = vri.getNum(i,12)/100;
                  estados_valores[k]=estados_valores[k]+ temp4;
               }
             }
           }
        }
    }
  }
  
  meses=[enero,febrero,marzo,abril,mayo,junio,julio,agosto,septiembre,octubre,noviembre,diciembre,(diciembre+diciembre*.05)];
  
  var promedio = (enero+febrero+marzo+abril+mayo+junio+julio+agosto+septiembre+octubre+noviembre+diciembre)/12;
  promedios=[promedio,promedio,promedio,promedio,promedio,promedio,promedio,promedio,promedio,promedio,promedio,promedio];
  
  diferencias = [enero-promedio,febrero-promedio,marzo-promedio,abril-promedio,mayo-promedio,junio-promedio,julio-promedio,agosto-promedio,septiembre-promedio,octubre-promedio,noviembre-promedio,diciembre-promedio];
  
  grafica(chart,meses,promedios);
  
  grafica2(chart2,diferencias);
  
  estados_valores[27]=0;
  
  if(criterio=="Piezas")
  {
    factor=100000;
  }
  else if(criterio=="Costo")
  {
    factor=100000000;
  }
  else if(criterio=="Margen")
  {
    factor=20000000;
  }
  else if(criterio=="Precio")
  {
    factor=100000000;
  }
  
  
  grafica3(chart3,estados_valores);
  mapa(estados_valores,factor); 
  
  
  enero=0;
  febrero=0;
  marzo=0;
  abril=0;
  mayo=0;
  junio=0;
  julio=0;
  agosto=0;
  septiembre=0;
  octubre=0;
  noviembre=0;
  diciembre=0;
  promedio=0;
  
  estados_valores = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  
}

function sel_sucursal()
{
  if(sel1.value()=="Todas las sucursales")
  {
    sucursal_num=13;
    sucursal_valor="1";
    sel7.remove();
    cliente_num=13;
    cliente_valor="1";
  }
  else
  {
     sucursal_num=0;
     sucursal_valor="         "+sel1.value().substring(0,3);
     
     sel7 = createSelect();
     sel7.position((28*windowWidth)/100,(27*windowHeight)/100);
     sel7.size((23*windowWidth)/100,(5*windowHeight)/100);
     sel7.option("Todos los clientes");
     for(var b=0;b<clientes.getRowCount();b++)
     {
        if(clientes.getString(b,2) == sucursal_valor)
        {
           sel7.option(clientes.getString(b,0)+"-"+clientes.getString(b,1));
        }
     }
     sel7.changed(sel_cliente);
  }
}

function sel_clase()
{
  if(sel2.value()=="Todas las clases")
  {
    clase_num=13;
    clase_valor="1";
    sel8.remove();
    item_nume=13;
    item_valor="1";
    sel3.remove();
    tipo_num=13;
    tipo_valor="1";
    sel4.remove();
    marca_num=13;
    marca_valor="1";
  }
  else
  {
     clase_num=5;
     clase_valor=sel2.value().substring(0,3);
     
     sel3 = createSelect();
     sel3.position((15*windowWidth)/100,(20*windowHeight)/100);
     sel3.size((10*windowWidth)/100,(5*windowHeight)/100);
     sel3.option("Todos los tipos");
     for(var t=0;t<tipos.getRowCount();t++)
     {
        sel3.option(tipos.getString(t,0)+"-"+tipos.getString(t,1));
     }
     sel3.changed(sel_tipo);     
  }
}

function sel_tipo()
{
  if(sel3.value()=="Todos los tipos")
  {
     tipo_num=13;
     tipo_valor="1";
     sel4.remove();
     marca_num=13;
     marca_valor="1";
     sel8.remove();
     item_num=13;
     item_valor="1";
  }
  else
  {
     tipo_num=6;
     tipo_valor=sel3.value().substring(0,3);
     
     sel4 = createSelect();
     sel4.position((28*windowWidth)/100,(20*windowHeight)/100);
     sel4.size((10*windowWidth)/100,(5*windowHeight)/100);
     sel4.option("Todas las marcas");
     for(var m=0; m<marcas.getRowCount();m++)
     {
       sel4.option(marcas.getString(m,0)+"-"+marcas.getString(m,1));
     }
     sel4.changed(sel_marca);
  }
}

function sel_marca()
{
  if(sel4.value()=="Todas las marcas")
  {
     marca_num=13;
     marca_valor="1";
     sel8.remove();
     item_num=13;
     item_valor="1";
  }
  else
  {
     marca_num=7;
     marca_valor=sel4.value().substring(0,3);
     
     sel8 = createSelect();
     sel8.position((41*windowWidth)/100,(20*windowHeight)/100);
     sel8.size((10*windowWidth)/100,(5*windowHeight)/100);
     sel8.option("Todos los ITEMS");
     for(var c=0;c<items.getRowCount();c++)
     {
        if(items.getString(c,2)==clase_valor && items.getString(c,3)==tipo_valor && items.getString(c,4)==marca_valor)
        {
           var tempsi = trim(items.getString(c,0));
           sel8.option(tempsi+"="+items.getString(c,1));
        }
     }
     sel8.changed(sel_item);
  }
}

function sel_cliente()
{
  if(sel7.value()=="Todos los clientes")
  {
     cliente_num=13;
     cliente_valor="1";
  }
  else
  {
     cliente_num=4;
     let tempc = split(sel7.value(),'-');
     cliente_valor=tempc[0];
  }
}

function sel_item()
{
  if(sel8.value()=="Todos los ITEMS")
  {
     item_num=13;
     item_valor="1";
  }
  else
  {
     item_num=14;
     let tempi = split(sel8.value(),'=');
     item_valor=tempi[0];
  }
}

function sel_zona()
{
  if(sel9.value()=="Todas las zonas")
  {
     zona_num=13;
     zona_valor="1";
     sel1.remove();
     sucursal_num=13;
     sucursal_valor="1";
     sel7.remove();
     cliente_num=13;
     cliente_valor="1";
  }
  else
  {
     sel1 = createSelect();
     sel1.position((15*windowWidth)/100,(27*windowHeight)/100);
     sel1.size((10*windowWidth)/100,(5*windowHeight)/100);
     sel1.option('Todas las sucursales');
     for(var s=0;s<sucursales.getRowCount();s++)
     {
       if(sucursales.getString(s,2)==sel9.value().substring(0,1))
       {
         sel1.option(sucursales.getString(s,0)+"-"+sucursales.getString(s,1));
       }
     }
     sel1.changed(sel_sucursal);
     
     zona_num=14;
     let tempz = split(sel9.value(),'-');
     zona_valor=tempz[0];
  }
}

function sel_operacion()
{
  operacion=sel5.value();
}

function sel_criterio()
{
  criterio=sel6.value();
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight);
}
