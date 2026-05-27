"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const B = {
  yellow: "#F5C800", yellowDark: "#C9A200", yellowBg: "rgba(245,200,0,0.12)",
  black: "#0A0A0A", dark: "#111", card: "#161616", cardHover: "#1C1C1C",
  border: "#242424", borderLight: "#2E2E2E",
  text: "#F5F5F5", textMid: "#999", textDim: "#555",
};

const fmt = (p: number | string) => `$${Number(p).toFixed(2)}`;

type BadgeType = "bestseller" | "new";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  badge: BadgeType | null;
  tags: string[];
  status?: string;
}

interface Category {
  id: string;
  label: string;
  emoji: string;
  items: MenuItem[];
}

const menuData: Category[] = [
  { id:"aperitivos", label:"Aperitivos", emoji:"🎮", items:[
    { id:"a1", name:"Game Platter",       price:17.99, description:"Selecciona 3: Wings (4), Onion Rings (4), Carne Frita (4), Mozzarella Sticks (4), Waffle Batata Fries, Boneless Wings (4).", imageUrl:"https://picsum.photos/seed/gameplatter/600/400", badge:"bestseller", tags:["Shareable"] },
    { id:"a2", name:"Buffalo Wings",      price:9.99,  description:"Alitas de Pollo (8). Elige tu salsa: BBQ, Buffalo, Blue Cheese, Ranch o Honey Mustard.", imageUrl:"https://picsum.photos/seed/buffalowings/600/400", badge:"bestseller", tags:[] },
    { id:"a3", name:"Boneless Wings",     price:10.99, description:"Trocitos de Pollo sin hueso (8). Elige tu salsa: BBQ, Buffalo, Blue Cheese, Ranch o Honey Mustard.", imageUrl:"https://picsum.photos/seed/boneless/600/400", badge:null, tags:[] },
    { id:"a4", name:"Mozzarella Sticks",  price:9.99,  description:"Queso mozzarella empanizados y crujientes (7), acompañados con salsa marinara.", imageUrl:"https://picsum.photos/seed/mozzsticks/600/400", badge:null, tags:["Vegetarian"] },
    { id:"a5", name:"Croquetas",          price:12.99, description:"Croquetas de bacalao con queso manchego (5).", imageUrl:"https://picsum.photos/seed/croquetas/600/400", badge:null, tags:[] },
    { id:"a6", name:"Onion Rings Tower",  price:12.99, description:"Torre de crujientes aros de cebolla (5), servidos con la salsa de tu preferencia.", imageUrl:"https://picsum.photos/seed/onionrings/600/400", badge:null, tags:["Vegetarian"] },
    { id:"a7", name:"Pizza Balls",        price:11.99, description:"Relleno de queso mozzarella y chorizo (5oz).", imageUrl:"https://picsum.photos/seed/pizzaballs/600/400", badge:null, tags:[] },
    { id:"a8", name:"Queso Fundido",      price:9.99,  description:"Queso fundido con bacon, chorizo o salchicha.", imageUrl:"https://picsum.photos/seed/quesofundido/600/400", badge:null, tags:[] },
    { id:"a9", name:"Our House Nachos",   price:12.99, description:"Queso, pico de gallo y sour cream.", imageUrl:"https://picsum.photos/seed/nachos/600/400", badge:null, tags:["Vegetarian"] },
  ]},
  { id:"grill", label:"Grill Master", emoji:"🥩", items:[
    { id:"g1", name:"Ribeye (16oz)",                    price:33.99, description:"Ribeye de 16oz, marmoleado perfecto para un gran sabor.", imageUrl:"https://picsum.photos/seed/ribeye/600/400", badge:"bestseller", tags:[] },
    { id:"g2", name:"Parmesan Crust Churrasco (14oz)",  price:26.99, description:"Churrasco de 14oz con crust crujiente de parmesano.", imageUrl:"https://picsum.photos/seed/churrasco/600/400", badge:null, tags:[] },
    { id:"g3", name:"NY Steak with Shrimp (12oz)",      price:26.99, description:"Steak de 12oz con 3 camarones, combinación perfecta.", imageUrl:"https://picsum.photos/seed/steakshrimp/600/400", badge:null, tags:[] },
    { id:"g4", name:"Bourbon Ribs",                     price:27.99, description:"Costillas tradicionales bañadas en salsa BBQ bourbon.", imageUrl:"https://picsum.photos/seed/bourbonribs/600/400", badge:null, tags:[] },
    { id:"g5", name:"Parmesan Grill Chicken",           price:16.99, description:"Pechuga de pollo con crust crujiente de parmesano.", imageUrl:"https://picsum.photos/seed/grillchicken/600/400", badge:null, tags:[] },
    { id:"g6", name:"Orange Honey Salmon & Shrimp",     price:25.99, description:"Salmón con infusión de naranja y miel, acompañado de camarones.", imageUrl:"https://picsum.photos/seed/salmonshrimp/600/400", badge:"new", tags:[] },
  ]},
  { id:"burgers", label:"Burgers", emoji:"🍔", items:[
    { id:"b1", name:"Bacon Burger",     price:15.99, description:"Clásica con queso cheddar, lechuga y bacon crujiente.", imageUrl:"https://picsum.photos/seed/baconburger/600/400", badge:"bestseller", tags:[] },
    { id:"b2", name:"Smokehouse Burger",price:15.99, description:"Ahumada con queso cheddar, bacon y aros de cebolla.", imageUrl:"https://picsum.photos/seed/smokehouse/600/400", badge:null, tags:[] },
    { id:"b3", name:"Boricua Burger",   price:15.99, description:"Con amarillos, queso suizo y cebollas caramelizadas.", imageUrl:"https://picsum.photos/seed/boricua/600/400", badge:"new", tags:[] },
    { id:"b4", name:"Our House Bites",  price:16.99, description:"Sliders con queso cheddar, bacon y salsa ranch.", imageUrl:"https://picsum.photos/seed/sliders/600/400", badge:null, tags:["Shareable"] },
  ]},
  { id:"mains", label:"Mains", emoji:"🍽️", items:[
    { id:"m1", name:"Chicken Sandwich",     price:15.99, description:"Pollo, lechuga, tomate, queso suizo y bacon en pan crujiente.", imageUrl:"https://picsum.photos/seed/chickensandwich/600/400", badge:null, tags:[] },
    { id:"m2", name:"Philly Cheesesteak",   price:17.99, description:"Steak con queso suizo y pimientos en pan hoagie.", imageUrl:"https://picsum.photos/seed/phillycheese/600/400", badge:"bestseller", tags:[] },
    { id:"m3", name:"Chicken Alfredo Pasta",price:17.99, description:"Penne o Gnocchi con pollo en salsa alfredo con parmesano.", imageUrl:"https://picsum.photos/seed/alfredopasta/600/400", badge:null, tags:[] },
    { id:"m4", name:"Quesadilla de Pollo",  price:15.99, description:"Queso cheddar, pico de gallo y sour cream con pollo.", imageUrl:"https://picsum.photos/seed/quesapollo/600/400", badge:null, tags:[] },
    { id:"m5", name:"Quesadilla NY Steak",  price:28.99, description:"Queso cheddar, pico de gallo y sour cream con NY Steak.", imageUrl:"https://picsum.photos/seed/quesasteak/600/400", badge:null, tags:[] },
    { id:"m6", name:"Quesadilla Camarones", price:17.99, description:"Queso cheddar, pico de gallo y sour cream con camarones.", imageUrl:"https://picsum.photos/seed/quesacamarones/600/400", badge:null, tags:[] },
  ]},
  { id:"pizza", label:"Pizza Party", emoji:"🍕", items:[
    { id:"p1", name:"Cheese Pizza",    price:14.99, description:"Salsa roja y queso mozzarella.", imageUrl:"https://picsum.photos/seed/cheesepizza/600/400", badge:null, tags:["Vegetarian"] },
    { id:"p2", name:"Honey Pepperoni", price:16.99, description:"Salsa roja, mozzarella, pepperoni y un toque de miel.", imageUrl:"https://picsum.photos/seed/pepperonipizza/600/400", badge:"bestseller", tags:[] },
  ]},
  { id:"ensaladas", label:"Ensaladas", emoji:"🥗", items:[
    { id:"e1", name:"Caesar Salad — Pollo",    price:16.99, description:"Lechuga romana, crutones y queso parmesano con pollo.", imageUrl:"https://picsum.photos/seed/caesarpollo/600/400", badge:null, tags:[] },
    { id:"e2", name:"Caesar Salad — NY Steak", price:27.99, description:"Lechuga romana, crutones y queso parmesano con NY Steak.", imageUrl:"https://picsum.photos/seed/caesarsteak/600/400", badge:null, tags:[] },
    { id:"e3", name:"Caesar Salad — Camarones",price:17.99, description:"Lechuga romana, crutones y queso parmesano con camarones.", imageUrl:"https://picsum.photos/seed/caesarcamarones/600/400", badge:null, tags:[] },
    { id:"e4", name:"Red Rooster Salad",       price:16.99, description:"Lechuga, tomate, cebolla, crutones y vinagreta balsámica.", imageUrl:"https://picsum.photos/seed/redrooster/600/400", badge:null, tags:["Vegetarian"] },
  ]},
  { id:"brunch", label:"Brunch", emoji:"🍳", items:[
    { id:"br1",  name:"Morning Beast",            price:26.99, description:"Medio Costillar con 2 Huevos Sunny Side Up, Salsa BBQ, acompañados de Papas Fritas.", imageUrl:"https://picsum.photos/seed/morningbeast/600/400", badge:"bestseller", tags:[] },
    { id:"br2",  name:"Steak & Egg",              price:27.99, description:"Churrasco, New York o Ribeye (12oz) con 1 Huevo Sunny Side Up y Queso Parmesano.", imageUrl:"https://picsum.photos/seed/steakegg/600/400", badge:null, tags:[] },
    { id:"br3",  name:"Chicken & Waffle",         price:15.99, description:"Pollo Empanado con Waffle, Queso Cheddar y Syrup de Fresa.", imageUrl:"https://picsum.photos/seed/chickenwaffle/600/400", badge:"new", tags:[] },
    { id:"br4",  name:"Chicken Club Sandwich",    price:17.99, description:"Pollo, 3 Lascas de Bacon, Queso Suizo, Lechuga y Tomate.", imageUrl:"https://picsum.photos/seed/clubsandwich/600/400", badge:null, tags:[] },
    { id:"br5",  name:"Lemy Sandwich",            price:15.99, description:"Pan Sobao con Mantequilla, Jamón de Pavo, 2 Huevos Fritos y Queso Suizo.", imageUrl:"https://picsum.photos/seed/lemysandwich/600/400", badge:null, tags:[] },
    { id:"br6",  name:"Sunrise Burrito",          price:13.99, description:"Tortilla Wrap Rellena de Revoltillo, Queso Cheddar y Lechuga. Opcional: Bacon o Salchicha.", imageUrl:"https://picsum.photos/seed/sunriseburrito/600/400", badge:null, tags:[] },
    { id:"br7",  name:"Sweet & Salty French Toast",price:13.99, description:"Pan de Mallorca, Pedazos de Bacon, Syrup de Fresa y Whipped Cream.", imageUrl:"https://picsum.photos/seed/frenchtoast/600/400", badge:null, tags:[] },
    { id:"br8",  name:"Sunny Bowls",              price:13.99, description:"Escoge: Ropa Vieja $13.99 · Carne Frita $13.99 · Churrasco $19.99. Con Papas + Huevo Sunny Side Up y Queso Parmesano.", imageUrl:"https://picsum.photos/seed/sunnybowls/600/400", badge:null, tags:[] },
    { id:"br9",  name:"Caramel Waffles",          price:6.99,  description:"Waffles Bañados en Salsa de Caramelo y Azúcar en Polvo.", imageUrl:"https://picsum.photos/seed/caramelwaffles/600/400", badge:null, tags:["Vegetarian"] },
    { id:"br10", name:"Good Morning Sampler",     price:15.99, description:"French Toast Sticks, Waffles, Sweet Potato Fries con Salsas de Chocolate, Fresa y Caramelo.", imageUrl:"https://picsum.photos/seed/morningsampler/600/400", badge:null, tags:["Shareable"] },
  ]},
  { id:"cervezas", label:"Cervezas", emoji:"🍺", items:[
    { id:"cv1",  name:"Medalla",               price:4.00, description:"La lager icónica de Puerto Rico. Ligera, crujiente y refrescante.", imageUrl:"https://picsum.photos/seed/medalla/600/400", badge:null, tags:[] },
    { id:"cv2",  name:"Michelob",              price:4.00, description:"Lager americana clásica, suave y limpia.", imageUrl:"https://picsum.photos/seed/michelob/600/400", badge:null, tags:[] },
    { id:"cv3",  name:"Michelob Gold",         price:5.00, description:"Lager dorada premium con un sabor equilibrado.", imageUrl:"https://picsum.photos/seed/michelobgold/600/400", badge:null, tags:[] },
    { id:"cv4",  name:"Heineken",              price:5.00, description:"La famosa lager holandesa, botella verde icónica.", imageUrl:"https://picsum.photos/seed/heineken/600/400", badge:null, tags:[] },
    { id:"cv5",  name:"Corona Extra",          price:6.00, description:"Lager mexicana refrescante, mejor con limón.", imageUrl:"https://picsum.photos/seed/corona/600/400", badge:null, tags:[] },
    { id:"cv6",  name:"Modelo Especial",       price:5.00, description:"Pilsner mexicano crujiente y equilibrado.", imageUrl:"https://picsum.photos/seed/modelo/600/400", badge:"bestseller", tags:[] },
    { id:"cv7",  name:"La Parchita",           price:7.00, description:"Craft local con notas tropicales de parcha.", imageUrl:"https://picsum.photos/seed/parchita/600/400", badge:"new", tags:[] },
    { id:"cv8",  name:"312 Goose Island",      price:8.00, description:"Wheat ale de Chicago — cítrico y suave.", imageUrl:"https://picsum.photos/seed/gooseisland/600/400", badge:null, tags:[] },
    { id:"cv9",  name:"Ocean American Wheat",  price:8.00, description:"American wheat ale con final ligero y brumoso.", imageUrl:"https://picsum.photos/seed/oceanwheat/600/400", badge:null, tags:[] },
    { id:"cv10", name:"Blue Moon",             price:6.00, description:"Cerveza de trigo estilo belga con toque de naranja.", imageUrl:"https://picsum.photos/seed/bluemoon/600/400", badge:null, tags:[] },
    { id:"cv11", name:"Dos XX",                price:5.00, description:"Dos Equis lager — cerveza mexicana crujiente desde 1897.", imageUrl:"https://picsum.photos/seed/dosxx/600/400", badge:null, tags:[] },
    { id:"cv12", name:"Guinness",              price:7.00, description:"El stout oscuro irlandés con cabeza cremosa icónica.", imageUrl:"https://picsum.photos/seed/guinness/600/400", badge:null, tags:[] },
    { id:"cv13", name:"Samuel Adams",          price:6.00, description:"Boston Lager — la craft beer que lo inició todo.", imageUrl:"https://picsum.photos/seed/samadams/600/400", badge:null, tags:[] },
    { id:"cv14", name:"Lagunitas IPA",         price:7.00, description:"West Coast IPA con lúpulos intensos y aromas cítricos.", imageUrl:"https://picsum.photos/seed/lagunitas/600/400", badge:null, tags:[] },
    { id:"cv15", name:"Sapporo Light",         price:6.00, description:"Lager japonesa ligera, ultra limpia y refrescante.", imageUrl:"https://picsum.photos/seed/sapporolight/600/400", badge:null, tags:[] },
    { id:"cv16", name:"Sapporo Premium",       price:7.00, description:"Lager japonesa premium en la icónica lata plateada.", imageUrl:"https://picsum.photos/seed/sapporoprem/600/400", badge:null, tags:[] },
    { id:"cv17", name:"Estrella Damm",         price:6.00, description:"La lager mediterránea premium de Barcelona desde 1876.", imageUrl:"https://picsum.photos/seed/estrella/600/400", badge:null, tags:[] },
    { id:"cv18", name:"Sierra Nevada Torpedo", price:7.00, description:"Double IPA West Coast — con lúpulos intensos y atrevidos.", imageUrl:"https://picsum.photos/seed/sierranevada/600/400", badge:null, tags:[] },
    { id:"cv19", name:"Heineken 0.0",          price:4.00, description:"Todo el sabor de Heineken, cero alcohol.", imageUrl:"https://picsum.photos/seed/heineken00/600/400", badge:null, tags:["Non-Alcoholic"] },
    { id:"cv20", name:"Heineken Silver",       price:4.00, description:"Heineken extra suave con menor amargor.", imageUrl:"https://picsum.photos/seed/heinekensilver/600/400", badge:null, tags:[] },
    { id:"cv21", name:"Alhambra Verde",        price:6.00, description:"Lager española premium de etiqueta verde.", imageUrl:"https://picsum.photos/seed/alhambraverde/600/400", badge:null, tags:[] },
    { id:"cv22", name:"Alhambra Roja",         price:6.00, description:"Lager ámbar española con notas de malta y caramelo.", imageUrl:"https://picsum.photos/seed/alhambraroja/600/400", badge:null, tags:[] },
    { id:"cv23", name:"Miller Lite",           price:4.00, description:"La cerveza light original de América.", imageUrl:"https://picsum.photos/seed/millerlite/600/400", badge:null, tags:[] },
    { id:"cv24", name:"Coors Light",           price:4.00, description:"Filtrada en frío en las Montañas Rocosas.", imageUrl:"https://picsum.photos/seed/coorslight/600/400", badge:null, tags:[] },
    { id:"cv25", name:"Stella Artois",         price:7.00, description:"Pilsner belga con carácter limpio y crujiente.", imageUrl:"https://picsum.photos/seed/stella/600/400", badge:null, tags:[] },
    { id:"cv26", name:"Peroni",                price:7.00, description:"Lager italiana premium con sabor limpio y refrescante.", imageUrl:"https://picsum.photos/seed/peroni/600/400", badge:null, tags:[] },
  ]},
  { id:"cocktails", label:"Cocktails", emoji:"🍹", items:[
    { id:"ck1", name:"Tamarindo Sunset",      price:11, description:"Ron Abuelo, Raspberry Syrup, Jugo de Limón y Jugo de Tamarindo.", imageUrl:"https://picsum.photos/seed/tamarindosunset/600/400", badge:"bestseller", tags:[] },
    { id:"ck2", name:"Caribbean Storm",       price:10, description:"Rum Spiced Bacardi, Limón, Piña Syrup, Habanero, Sprite, Grenadine.", imageUrl:"https://picsum.photos/seed/caribbeanstorm/600/400", badge:null, tags:[] },
    { id:"ck3", name:"Cosmo Guava",           price:10, description:"Tanqueray, Guava, Blueberry, Limón.", imageUrl:"https://picsum.photos/seed/cosmoguava/600/400", badge:null, tags:[] },
    { id:"ck4", name:"Golden Honey",          price:11, description:"Jack Daniel's, Miel, Limón, Ginger Syrup y Amaretto.", imageUrl:"https://picsum.photos/seed/goldenhoney/600/400", badge:"new", tags:[] },
    { id:"ck5", name:"Moscow Mule",           price:11, description:"Bravada, Lima Fresca y Our House Ginger Beer.", imageUrl:"https://picsum.photos/seed/moscowmule/600/400", badge:null, tags:[] },
    { id:"ck6", name:"Our House Old Fashion", price:11, description:"Woodford Reserve Bourbon Whiskey, Angostura y Jarabe de Cerveza IPA.", imageUrl:"https://picsum.photos/seed/oldfashioned/600/400", badge:"bestseller", tags:[] },
    { id:"ck7", name:"Espresso Martini",      price:11, description:"Borghetti (Licor de café expresso), Averna (Amaro de Sicilia) y café.", imageUrl:"https://picsum.photos/seed/espressomartini/600/400", badge:null, tags:[] },
    { id:"ck8", name:"Watermelon Margarita",  price:11, description:"José Cuervo Gold, Sandía, Cointreau y Jugo de Limón.", imageUrl:"https://picsum.photos/seed/watermelonmarg/600/400", badge:null, tags:[] },
    { id:"ck9", name:"Reptile Mezcarita",     price:12, description:"Montelobos Mezcal, Agave Infusionado con Naranja y Lima Fresca.", imageUrl:"https://picsum.photos/seed/mezcarita/600/400", badge:"new", tags:[] },
  ]},
  { id:"ninos", label:"Niños", emoji:"🧒", items:[
    { id:"n1", name:"Chicken Pops",     price:7.99, description:"Popcorn chicken crujiente para los más pequeños.", imageUrl:"https://picsum.photos/seed/chickenpops/600/400", badge:null, tags:[] },
    { id:"n2", name:"Cheese Sliders",   price:8.99, description:"Mini burgers con queso cheddar fundido.", imageUrl:"https://picsum.photos/seed/cheesesliders/600/400", badge:null, tags:[] },
    { id:"n3", name:"Pechuga de Pollo", price:7.99, description:"Pechuga de pollo a la plancha, suave y jugosa.", imageUrl:"https://picsum.photos/seed/pechuganinos/600/400", badge:null, tags:[] },
    { id:"n4", name:"Kids Pizza",       price:8.99, description:"Pizza con salsa roja y queso mozzarella, tamaño individual.", imageUrl:"https://picsum.photos/seed/kidspizza/600/400", badge:null, tags:["Vegetarian"] },
    { id:"n5", name:"Kids Pasta",       price:7.99, description:"Pasta con salsa marinara o mantequilla.", imageUrl:"https://picsum.photos/seed/kidspasta/600/400", badge:null, tags:["Vegetarian"] },
    { id:"n6", name:"Mac & Cheese",     price:8.99, description:"Macarrones cremosos con salsa de queso cheddar.", imageUrl:"https://picsum.photos/seed/maccheese/600/400", badge:"bestseller", tags:["Vegetarian"] },
  ]},
  { id:"postres", label:"Postres", emoji:"🍰", items:[
    { id:"po1", name:"Brownie Sunday",        price:8.99,  description:"Brownie calientito acompañado de tu helado favorito.", imageUrl:"https://picsum.photos/seed/browniesunday/600/400", badge:"bestseller", tags:["Vegetarian"] },
    { id:"po2", name:"Waffle con Helado",     price:8.99,  description:"Waffle servido con tu helado y topping favorito.", imageUrl:"https://picsum.photos/seed/wafflehelado/600/400", badge:null, tags:["Vegetarian"] },
    { id:"po3", name:"Cheesecake",            price:8.99,  description:"Cremoso cheesecake clásico.", imageUrl:"https://picsum.photos/seed/cheesecake/600/400", badge:null, tags:["Vegetarian"] },
    { id:"po4", name:"Chocolate Chip Cookie", price:13.99, description:"Galleta gigante de chispas de chocolate.", imageUrl:"https://picsum.photos/seed/chipcookie/600/400", badge:"new", tags:["Vegetarian"] },
    { id:"po5", name:"Ice Cream",             price:3.99,  description:"Helado artesanal. Pregunta por los sabores disponibles.", imageUrl:"https://picsum.photos/seed/icecream/600/400", badge:null, tags:["Vegetarian"] },
  ]},
];

const ALL_TAGS = ["Shareable", "Vegetarian", "Non-Alcoholic"];
const badgeCfg: Record<BadgeType, { label: string; bg: string; color: string }> = {
  bestseller: { label:"⭐ Fan Fave", bg:B.yellow, color:B.black },
  new:        { label:"✦ New",      bg:"#FF4500", color:"#fff" },
};

function Badge({ type }: { type: BadgeType | null }) {
  if (!type) return null;
  const c = badgeCfg[type];
  if (!c) return null;
  return (
    <span style={{ background:c.bg, color:c.color, fontSize:10, fontWeight:800, padding:"3px 9px", borderRadius:99, letterSpacing:"0.04em", whiteSpace:"nowrap" }}>
      {c.label}
    </span>
  );
}

function ItemCard({ item, index, onClick }: { item: MenuItem; index: number; onClick: (item: MenuItem) => void }) {
  const oos = item.status === "out-of-stock";
  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, y:-10, scale:0.97 }}
      transition={{ duration:0.25, delay: index * 0.04, ease:[0.25,0.1,0.25,1] }}
      whileTap={{ scale: oos ? 1 : 0.97 }}
      onClick={() => !oos && onClick(item)}
      style={{ background:B.card, borderRadius:16, overflow:"hidden", cursor:oos?"default":"pointer", border:`1px solid ${B.border}`, opacity:oos?0.45:1, display:"flex", gap:0, flexDirection:"column" }}
    >
      <div style={{ position:"relative", height:160, overflow:"hidden", background:"#1a1a1a" }}>
        <img src={item.imageUrl} alt={item.name} loading="lazy"
          style={{ width:"100%", height:"100%", objectFit:"cover", filter:oos?"grayscale(1)":"none", transition:"transform 0.4s ease" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)" }} />
        {item.badge && !oos && <div style={{ position:"absolute", top:10, left:10 }}><Badge type={item.badge} /></div>}
        {oos && (
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ background:"rgba(0,0,0,0.8)", color:"#666", fontSize:11, fontWeight:800, padding:"6px 14px", borderRadius:8, border:`1px solid #333`, letterSpacing:"0.1em", textTransform:"uppercase" }}>86'd — Sold Out</span>
          </div>
        )}
      </div>
      <div style={{ padding:"12px 14px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
          <span style={{ fontSize:15, fontWeight:700, color:B.text, lineHeight:1.3, flex:1 }}>{item.name}</span>
          <span style={{ fontSize:15, fontWeight:800, color:B.yellow, whiteSpace:"nowrap" }}>{fmt(item.price)}</span>
        </div>
        <p style={{ fontSize:13.5, color:B.textMid, lineHeight:1.55, margin:"5px 0 8px" }}>{item.description}</p>
        {item.tags?.length > 0 && (
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:8 }}>
            {item.tags.map(t => (
              <span key={t} style={{ fontSize:10, color:B.yellow, background:B.yellowBg, border:`1px solid rgba(245,200,0,0.3)`, padding:"2px 8px", borderRadius:99, fontWeight:700 }}>{t}</span>
            ))}
          </div>
        )}
      </div>
      {!oos && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px 12px", borderTop:`1px solid ${B.border}`, marginTop:4 }}>
          <span style={{ fontSize:11.5, color:B.textDim, fontWeight:500 }}>Ver detalles</span>
          <div style={{ width:28, height:28, borderRadius:"50%", background:B.yellow, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke={B.black} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function Drawer({ item, onClose, containerRef }: { item: MenuItem; onClose: () => void; containerRef: React.RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.style.overflow = "hidden";
    return () => { if (el) el.style.overflow = ""; };
  }, [containerRef]);

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:0.2 }}
      style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"flex-end" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
        transition={{ type:"spring", stiffness:380, damping:38, mass:0.8 }}
        onClick={e => e.stopPropagation()}
        style={{ width:"100%", maxHeight:"90vh", background:"#141414", borderRadius:"24px 24px 0 0", border:`1px solid ${B.borderLight}`, overflow:"hidden", display:"flex", flexDirection:"column" }}
      >
        {/* drag pill */}
        <div style={{ display:"flex", justifyContent:"center", paddingTop:10, paddingBottom:2, flexShrink:0 }}>
          <div style={{ width:36, height:4, background:"#333", borderRadius:99 }} />
        </div>
        <div style={{ position:"relative", height:220, flexShrink:0 }}>
          <img src={item.imageUrl} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, #141414 0%, transparent 55%)" }} />
          <button onClick={onClose} aria-label="Cerrar"
            style={{ position:"absolute", top:12, right:12, background:"rgba(0,0,0,0.7)", border:`1px solid ${B.border}`, color:B.text, borderRadius:"50%", width:44, height:44, cursor:"pointer", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)" }}>×</button>
          {item.badge && <div style={{ position:"absolute", top:12, left:12 }}><Badge type={item.badge} /></div>}
        </div>
        <div style={{ overflowY:"auto", padding:"4px 20px 36px", paddingBottom:"max(36px, calc(20px + env(safe-area-inset-bottom)))", overscrollBehavior:"contain" } as React.CSSProperties}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", margin:"12px 0 8px" }}>
            <h2 style={{ fontSize:22, fontWeight:800, color:B.text, margin:0, flex:1, paddingRight:12, lineHeight:1.2 }}>{item.name}</h2>
            <span style={{ fontSize:22, fontWeight:800, color:B.yellow }}>{fmt(item.price)}</span>
          </div>
          <p style={{ fontSize:14, color:"#aaa", lineHeight:1.7, margin:"0 0 16px" }}>{item.description}</p>
          {item.tags?.length > 0 && (
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
              {item.tags.map(t => <span key={t} style={{ fontSize:11, color:B.yellow, background:B.yellowBg, border:`1px solid rgba(245,200,0,0.3)`, padding:"3px 10px", borderRadius:99, fontWeight:700 }}>{t}</span>)}
            </div>
          )}
          <motion.button whileTap={{ scale:0.96 }}
            style={{ width:"100%", padding:"16px", background:B.yellow, color:B.black, border:"none", borderRadius:14, fontSize:16, fontWeight:900, cursor:"pointer", letterSpacing:"0.01em" }}>
            🎮 Ordenar — {fmt(item.price)}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function OurHouseMenu() {
  const [filters, setFilters]     = useState<string[]>([]);
  const [activeCat, setActiveCat] = useState(menuData[0].id);
  const [selected, setSelected]   = useState<MenuItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const navRef       = useRef<HTMLDivElement>(null);
  const stickyRef    = useRef<HTMLDivElement>(null);
  const secRefs      = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Observe which section is in view
  useEffect(() => {
    const observers = menuData.map(cat => {
      const el = secRefs.current[cat.id];
      if (!el) return null;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !isScrolling) {
          setActiveCat(cat.id);
          navRef.current?.querySelector<HTMLElement>(`[data-cat="${cat.id}"]`)
            ?.scrollIntoView({ inline:"center", block:"nearest" });
        }
      }, { root: containerRef.current, threshold:0.15, rootMargin:"-100px 0px -55% 0px" });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, [filters, isScrolling]);

  const scrollTo = useCallback((id: string) => {
    const el = secRefs.current[id];
    const sticky = stickyRef.current;
    const container = containerRef.current;
    if (!el || !sticky || !container) return;

    setActiveCat(id);
    setIsScrolling(true);

    navRef.current?.querySelector<HTMLElement>(`[data-cat="${id}"]`)?.scrollIntoView({ inline:"center", block:"nearest" });

    const stickyH = sticky.getBoundingClientRect().height;
    const containerTop = container.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const target = container.scrollTop + (elTop - containerTop) - stickyH;

    container.scrollTo({ top: target, behavior:"smooth" });

    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setIsScrolling(false), 800);
  }, []);

  const toggleFilter = (t: string) =>
    setFilters(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const filtered = menuData.map(cat => ({
    ...cat,
    items: filters.length === 0 ? cat.items : cat.items.filter(i => filters.every(f => i.tags?.includes(f)))
  })).filter(c => c.items.length > 0);

  return (
    <div ref={containerRef} style={{ height:"100dvh", overflowY:"auto", overflowX:"hidden", background:B.black, fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',sans-serif", color:B.text, overscrollBehavior:"contain", scrollBehavior:"auto" } as React.CSSProperties}>

      {/* ── Hero ─────────────────────────────── */}
      <div style={{ background:"#0D0D0D", padding:"28px 18px 22px", borderBottom:`2px solid ${B.yellow}`, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, borderRadius:"50%", background:B.yellow, opacity:0.04 }} />
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
          <div style={{ width:52, height:52, background:B.yellow, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:900, color:B.black, flexShrink:0 }}>OH</div>
          <div>
            <div style={{ fontSize:24, fontWeight:900, color:B.text, lineHeight:1, letterSpacing:"-0.02em" }}>Our House</div>
            <div style={{ fontSize:10, color:B.yellow, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", marginTop:3 }}>Sport & Gaming Bar</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {["🎮 Gaming Lounge","📍 Bayamón, PR","⭐ 4.8","🕐 Open Now"].map(t => (
            <span key={t} style={{ fontSize:11, background:"#1E1E1E", color:"#888", border:`1px solid ${B.border}`, padding:"4px 10px", borderRadius:99, fontWeight:600 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── Sticky Nav ───────────────────────── */}
      <div ref={stickyRef} id="sticky-nav" style={{ position:"sticky", top:0, zIndex:100, background:"rgba(10,10,10,0.97)", backdropFilter:"blur(16px)", borderBottom:`1px solid ${B.border}` }}>
        {/* Category tabs */}
        <div ref={navRef} style={{ display:"flex", gap:0, overflowX:"auto", scrollbarWidth:"none", padding:"10px 12px 0" } as React.CSSProperties}>
          {menuData.map(cat => {
            const active = activeCat === cat.id;
            return (
              <div key={cat.id} style={{ position:"relative", flexShrink:0 }}>
                {active && (
                  <motion.div layoutId="tab-bg"
                    style={{ position:"absolute", inset:0, background:B.yellow, borderRadius:"10px 10px 0 0" }}
                    transition={{ type:"spring", stiffness:500, damping:38 }} />
                )}
                <button data-cat={cat.id} onClick={() => scrollTo(cat.id)}
                  style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:5, padding:"9px 13px", border:"none", background:"transparent", color: active ? B.black : B.textDim, fontSize:13, fontWeight: active ? 800 : 500, cursor:"pointer", whiteSpace:"nowrap", borderRadius:"10px 10px 0 0", transition:"color 0.15s" }}>
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Filter row */}
        <div style={{ display:"flex", alignItems:"center", gap:7, overflowX:"auto", scrollbarWidth:"none", padding:"8px 12px 10px" } as React.CSSProperties}>
          <motion.button whileTap={{ scale:0.94 }} onClick={() => setShowFilters(p => !p)}
            style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:99, border:`1.5px solid ${showFilters ? B.yellow : B.border}`, background: showFilters ? B.yellowBg : "transparent", color: showFilters ? B.yellow : B.textDim, fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0, whiteSpace:"nowrap" }}>
            <svg width="13" height="10" viewBox="0 0 13 10" fill="none"><path d="M0 1h13M2 5h9M4 9h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            Filtrar
            {filters.length > 0 && <span style={{ background:B.yellow, color:B.black, borderRadius:"50%", width:16, height:16, fontSize:9, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900 }}>{filters.length}</span>}
          </motion.button>
          <AnimatePresence>
            {showFilters && ALL_TAGS.map((t, i) => (
              <motion.button key={t}
                initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1, transition:{ delay: i*0.05 } }} exit={{ opacity:0, scale:0.85 }}
                whileTap={{ scale:0.93 }} onClick={() => toggleFilter(t)}
                style={{ padding:"6px 13px", borderRadius:99, fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0, border:`1.5px solid ${filters.includes(t) ? B.yellow : B.border}`, background: filters.includes(t) ? B.yellow : "transparent", color: filters.includes(t) ? B.black : B.textDim, whiteSpace:"nowrap" }}>
                {t}
              </motion.button>
            ))}
          </AnimatePresence>
          {filters.length > 0 && (
            <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }} whileTap={{ scale:0.93 }}
              onClick={() => setFilters([])}
              style={{ fontSize:11, color:"#FF4500", background:"transparent", border:"1px solid rgba(255,69,0,0.3)", borderRadius:99, padding:"5px 10px", cursor:"pointer", flexShrink:0, fontWeight:700, whiteSpace:"nowrap" }}>
              Clear
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Menu Sections ────────────────────── */}
      <div style={{ padding:"20px 14px 80px" }}>
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ textAlign:"center", padding:"80px 20px" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🎮</div>
              <p style={{ fontSize:16, fontWeight:700, color:"#aaa" }}>No hay items con ese filtro.</p>
              <motion.button whileTap={{ scale:0.95 }} onClick={() => setFilters([])}
                style={{ marginTop:16, background:B.yellow, color:B.black, border:"none", borderRadius:99, padding:"10px 24px", fontSize:14, fontWeight:800, cursor:"pointer" }}>
                Reset filtros
              </motion.button>
            </motion.div>
          ) : filtered.map(cat => (
            <div key={cat.id} ref={el => { secRefs.current[cat.id] = el; }} style={{ marginBottom:36 }}>
              {/* Section header */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:B.yellow, borderRadius:10, padding:"6px 14px" }}>
                  <span style={{ fontSize:15 }}>{cat.emoji}</span>
                  <span style={{ fontSize:12, fontWeight:900, color:B.black, textTransform:"uppercase", letterSpacing:"0.1em" }}>{cat.label}</span>
                </div>
                <div style={{ flex:1, height:1, background:B.border }} />
                <span style={{ fontSize:11, color:B.textDim }}>{cat.items.length}</span>
              </div>
              {/* Cards */}
              <div style={{ display:"grid", gap:12 }}>
                <AnimatePresence>
                  {cat.items.map((item, i) => (
                    <ItemCard key={item.id} item={item} index={i} onClick={setSelected} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Footer banner ────────────────────── */}
      <div style={{ margin:"0 14px 24px", background:"#161616", borderRadius:16, padding:"16px 18px", border:`1px solid ${B.border}`, display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:44, height:44, background:B.yellow, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🎮</div>
        <div>
          <p style={{ fontSize:13, fontWeight:800, color:B.text, margin:"0 0 2px" }}>Game Night — Every Friday</p>
          <p style={{ fontSize:11.5, color:B.textDim, margin:0, lineHeight:1.5 }}>Torneos, drink specials y más. ¡Reserva tu mesa!</p>
        </div>
      </div>

      {/* ── Drawer ───────────────────────────── */}
      <AnimatePresence>
        {selected && <Drawer key="drawer" item={selected} onClose={() => setSelected(null)} containerRef={containerRef} />}
      </AnimatePresence>
    </div>
  );
}
