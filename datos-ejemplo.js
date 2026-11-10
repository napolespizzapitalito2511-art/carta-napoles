/* Carta de EJEMPLO. Se usa solo cuando todavía no hay carta guardada desde el panel. */
window.CARTA_EJEMPLO = {
  negocio: {
    nombre: "Nápoles Pizza",
    lema: "La pizzería de siempre · Pitalito",
    abre: 15, cierra: 23,
    pagos: ["Efectivo", "Nequi", "Transferencia bancaria", "Datáfono (tarjeta)"],
    demo: true
  },
  sedes: [
    { nombre: "Nápoles Centro",  wa: "573203387070" },
    { nombre: "Nápoles Solarte", wa: "573174000531" },
    { nombre: "Nápoles Norte",   wa: "573203184464" }
  ],
  pizzas: {
    nombre: "Pizzas",
    sub: "Masa artesanal preparada en casa. Elige el sabor, el tamaño y si quieres combinar.",
    tamanos: [
      { id: "porcion",  nombre: "Porción",  sabores: 1, precio: 6000 },
      { id: "personal", nombre: "Personal", sabores: 2, precio: 16000 },
      { id: "junior",   nombre: "Junior",   sabores: 2, precio: 24000 },
      { id: "mediana",  nombre: "Mediana",  sabores: 2, precio: 32000 },
      { id: "familiar", nombre: "Familiar", sabores: 3, precio: 46000 }
    ],
    sabores: [
      { id: "hawaiana", nombre: "Hawaiana", desc: "Salsa de la casa, mozzarella, jamón y piña.", tag: "La favorita", art: { t: "pizza", c: ["#f2a7a0", "#f7d64a"] } },
      { id: "pollo-champi", nombre: "Pollo con champiñones", desc: "Pollo desmechado, champiñones salteados y mozzarella.", art: { t: "pizza", c: ["#e9d3b0", "#8a6a4f"] } },
      { id: "pepperoni", nombre: "Pepperoni", desc: "Doble pepperoni y mozzarella gratinada.", art: { t: "pizza", c: ["#b8321f"] } },
      { id: "mexicana", nombre: "Mexicana", desc: "Carne molida, maíz, pimentón, jalapeño y nachos.", tag: "Picante", art: { t: "pizza", c: ["#6b3b22", "#f2c230", "#3f9a3a"] } },
      { id: "vegetariana", nombre: "Vegetariana", desc: "Pimentón, cebolla, champiñón, aceitunas y maíz.", art: { t: "pizza", c: ["#3f9a3a", "#d8402c", "#2b2b2b", "#f2c230"] } },
      { id: "carnes", nombre: "Carnes", desc: "Jamón, salami, pepperoni, tocineta y carne molida.", art: { t: "pizza", c: ["#b8321f", "#6b3b22", "#f2a7a0"] } }
    ],
    especiales: [
      { id: "especial-napoles", nombre: "Especial Nápoles", desc: "Nuestra receta especial con ingredientes premium. Se prepara de un solo sabor.", tag: "Especial",
        precios: { personal: 20000, junior: 30000, mediana: 40000, familiar: 56000 }, art: { t: "pizza", c: ["#b8321f", "#3f9a3a", "#6b3b22", "#2b2b2b"] } }
    ]
  },
  categorias: [
    { id: "salchipapas", nombre: "Salchipapas", items: [
      { id: "salchi-especial", nombre: "Salchipapa especial", desc: "Papa francesa, salchicha, carne, pollo, queso gratinado y salsas.", tag: "Recomendada", precio: 28000, art: { t: "fries" } },
      { id: "salchi-sencilla", nombre: "Salchipapa sencilla", desc: "Papa francesa, salchicha y salsas de la casa.", precio: 14000, art: { t: "fries" } }
    ]},
    { id: "picadas", nombre: "Picadas y patacones", items: [
      { id: "picada-2", nombre: "Picada para 2", desc: "Carne, chorizo, pollo, papa criolla, patacón y arepa.", precio: 38000, art: { t: "picada" } },
      { id: "patacon", nombre: "Patacón con todo", desc: "Patacón crocante con carne desmechada, pollo, queso y hogao.", precio: 22000, art: { t: "patacon" } }
    ]},
    { id: "heladeria", nombre: "Heladería", items: [
      { id: "cono", nombre: "Cono de helado", desc: "Dos bolas del sabor que quieras.", precio: 7000, art: { t: "cone" } },
      { id: "malteada", nombre: "Malteada", desc: "Vainilla, chocolate o fresa, con crema.", precio: 12000, art: { t: "drink", c: "#f4b6c2" } }
    ]},
    { id: "bebidas", nombre: "Bebidas", items: [
      { id: "gaseosa", nombre: "Gaseosa", desc: "Coca-Cola o Postobón.", opciones: [{ nombre: "400 ml", precio: 4000 }, { nombre: "1.5 litros", precio: 8000 }], art: { t: "drink", c: "#3a1a10" } },
      { id: "limonada", nombre: "Limonada natural", desc: "Recién preparada.", precio: 6000, art: { t: "drink", c: "#d9ef8b" } },
      { id: "jugo", nombre: "Jugo natural", desc: "En agua o en leche: mora, maracuyá, lulo o mango.", precio: 7000, art: { t: "drink", c: "#e8862f" } }
    ]},
    { id: "adiciones", nombre: "Adiciones", items: [
      { id: "ad-queso", nombre: "Queso extra", desc: "Porción adicional de mozzarella.", precio: 4000, art: { t: "bowl", c: "#f6d36b" } },
      { id: "ad-salsas", nombre: "Salsas de la casa", desc: "Ajo, rosada o piña.", precio: 1500, art: { t: "bowl", c: "#f0e2c4" } }
    ]}
  ]
};
