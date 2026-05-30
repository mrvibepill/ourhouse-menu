"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ── Palette ──────────────────────────────────────────────────────────────────
const B = {
  accent:       "#C1FF72",
  accentDim:    "rgba(193,255,114,0.08)",
  accentBorder: "rgba(193,255,114,0.22)",
  black:        "#000000",
  card:         "#111111",
  cardAlt:      "#1A1A1A",
  border:       "#262626",
  borderLight:  "#333333",
  text:         "#FFFFFF",
  textMid:      "#888888",
  textDim:      "#444444",
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
    { id:"a1", name:"Game Platter",       price:17.99, description:"Selecciona 3: Wings (4), Onion Rings (4), Carne Frita (4), Mozzarella Sticks (4), Waffle Batata Fries, Boneless Wings (4).", imageUrl:"https://foodie.sysco.com/wp-content/uploads/2025/11/001_Sysco_January_Game_Day_Platter-46-scaled.jpg", badge:"bestseller", tags:["Shareable"] },
    { id:"a2", name:"Buffalo Wings",      price:9.99,  description:"Alitas de Pollo (8). Elige tu salsa: BBQ, Buffalo, Blue Cheese, Ranch o Honey Mustard.", imageUrl:"https://www.thespicehouse.com/cdn/shop/articles/Buffalo_Wings_720x.jpg", badge:"bestseller", tags:[] },
    { id:"a3", name:"Boneless Wings",     price:10.99, description:"Trocitos de Pollo sin hueso (8). Elige tu salsa: BBQ, Buffalo, Blue Cheese, Ranch o Honey Mustard.", imageUrl:"https://olo-images-live.imgix.net/ee/ee1211b4dda14565a3722daee4b0633b.jpg", badge:null, tags:[] },
    { id:"a4", name:"Mozzarella Sticks",  price:9.99,  description:"Queso mozzarella empanizados y crujientes (7), acompañados con salsa marinara.", imageUrl:"https://www.eatthis.com/wp-content/uploads/sites/4/2021/07/mozzarella-sticks.jpg", badge:null, tags:["Vegetarian"] },
    { id:"a5", name:"Croquetas",          price:12.99, description:"Croquetas de bacalao con queso manchego (5).", imageUrl:"https://mariefoodtips.com/wp-content/uploads/2024/07/croquetas.jpg", badge:null, tags:[] },
    { id:"a6", name:"Onion Rings Tower",  price:12.99, description:"Torre de crujientes aros de cebolla (5), servidos con la salsa de tu preferencia.", imageUrl:"https://www.eatthis.com/wp-content/uploads/sites/4/2024/02/OnionRings-MAIN.jpg", badge:null, tags:["Vegetarian"] },
    { id:"a7", name:"Pizza Balls",        price:11.99, description:"Relleno de queso mozzarella y chorizo (5oz).", imageUrl:"https://profusioncurry.com/wp-content/uploads/2024/04/Stuffed-pizza-balls-recipe-served-as-appetizer.jpg", badge:null, tags:[] },
    { id:"a8", name:"Queso Fundido",      price:9.99,  description:"Queso fundido con bacon, chorizo o salchicha.", imageUrl:"https://cookingwithcurls.com/wp-content/uploads/2024/04/Queso-Fundido-Mexican-melted-cheese-in-cast-iron-skillet-cookingwithcurls.com_.jpg", badge:null, tags:[] },
    { id:"a9", name:"Our House Nachos",   price:12.99, description:"Queso, pico de gallo y sour cream.", imageUrl:"https://www.thepkpway.com/wp-content/uploads/2017/04/better-than-restaurants-skillet-nachos-6f.jpg", badge:null, tags:["Vegetarian"] },
  ]},
  { id:"grill", label:"Grill Master", emoji:"🥩", items:[
    { id:"g1", name:"Ribeye (16oz)",                    price:33.99, description:"Ribeye de 16oz, marmoleado perfecto para un gran sabor.", imageUrl:"https://www.wholesomeyum.com/wp-content/uploads/2024/01/wholesomeyum-Ribeye-Steak-Recipe-6.jpg", badge:"bestseller", tags:[] },
    { id:"g2", name:"Parmesan Crust Churrasco (14oz)",  price:26.99, description:"Churrasco de 14oz con crust crujiente de parmesano.", imageUrl:"https://www.sweetteaandthyme.com/wp-content/uploads/2021/02/churrasco-grilled-skirt-steak-overhead-sliced-close-up.jpg", badge:null, tags:[] },
    { id:"g3", name:"NY Steak with Shrimp (12oz)",      price:26.99, description:"Steak de 12oz con 3 camarones, combinación perfecta.", imageUrl:"https://dinnerthendessert.com/wp-content/uploads/2024/05/Surf-and-Turf-NY-Steak-and-Shrimp-31-e1764364861244.jpg", badge:null, tags:[] },
    { id:"g4", name:"Bourbon Ribs",                     price:27.99, description:"Costillas tradicionales bañadas en salsa BBQ bourbon.", imageUrl:"https://assets.bonappetit.com/photos/57b266a23e1d654349a2fea3/1:1/w_2560%2Cc_limit/sweet-and-smoky-baby-back-ribs-with-bourbon-barbecue-sauce-646.jpg", badge:null, tags:[] },
    { id:"g5", name:"Parmesan Grill Chicken",           price:16.99, description:"Pechuga de pollo con crust crujiente de parmesano.", imageUrl:"https://www.onceuponachef.com/images/2020/05/best-grilled-chicken-760x1050.jpg", badge:null, tags:[] },
    { id:"g6", name:"Orange Honey Salmon & Shrimp",     price:25.99, description:"Salmón con infusión de naranja y miel, acompañado de camarones.", imageUrl:"https://blackberrybabe.com/wp-content/uploads/2024/09/Cajun-Salmon-and-Shrimp-2-2.jpg", badge:"new", tags:[] },
  ]},
  { id:"burgers", label:"Burgers", emoji:"🍔", items:[
    { id:"b1", name:"Bacon Burger",      price:15.99, description:"Clásica con queso cheddar, lechuga y bacon crujiente.", imageUrl:"https://friendlysrestaurants.com/assets/live/img/production/detail/menu/lunch-dinner_burgers_bacon-cheeseburger.jpg", badge:"bestseller", tags:[] },
    { id:"b2", name:"Smokehouse Burger", price:15.99, description:"Ahumada con queso cheddar, bacon y aros de cebolla.", imageUrl:"https://bbq-heroes.com/wp-content/uploads/smokehouse-burger-feature.jpg", badge:null, tags:[] },
    { id:"b3", name:"Boricua Burger",    price:15.99, description:"Con amarillos, queso suizo y cebollas caramelizadas.", imageUrl:"https://senseandedibility.com/wp-content/uploads/2020/08/Mofongo-Burger-Lead-500x500.jpg", badge:"new", tags:[] },
    { id:"b4", name:"Our House Bites",   price:16.99, description:"Sliders con queso cheddar, bacon y salsa ranch.", imageUrl:"https://upload.wikimedia.org/wikipedia/commons/d/d2/A_party_tray_of_sliders_at_a_restaurant.jpg", badge:null, tags:["Shareable"] },
  ]},
  { id:"mains", label:"Mains", emoji:"🍽️", items:[
    { id:"m1", name:"Chicken Sandwich",      price:15.99, description:"Pollo, lechuga, tomate, queso suizo y bacon en pan crujiente.", imageUrl:"https://www.chick-fil-a.com/wp-content/uploads/sites/2/2025/12/Chick-fil-A-Chicken-Sandwich-plp-newstalgia-patch-mob.png", badge:null, tags:[] },
    { id:"m2", name:"Philly Cheesesteak",    price:17.99, description:"Steak con queso suizo y pimientos en pan hoagie.", imageUrl:"https://tonylukes.com/wp-content/uploads/2022/06/Philly-cheesesteak-restaurant.jpg", badge:"bestseller", tags:[] },
    { id:"m3", name:"Chicken Alfredo Pasta", price:17.99, description:"Penne o Gnocchi con pollo en salsa alfredo con parmesano.", imageUrl:"https://mykitchenmystudio.com/wp-content/uploads/2023/11/Fettucinialfredo-1-scaled.jpg", badge:null, tags:[] },
    { id:"m4", name:"Quesadilla de Pollo",   price:15.99, description:"Queso cheddar, pico de gallo y sour cream con pollo.", imageUrl:"https://thenightowlchef.com/wp-content/uploads/2021/12/Restaurant-Style-Chicken-Quesadillas-14.jpg", badge:null, tags:[] },
    { id:"m5", name:"Quesadilla NY Steak",   price:28.99, description:"Queso cheddar, pico de gallo y sour cream con NY Steak.", imageUrl:"https://thenightowlchef.com/wp-content/uploads/2021/12/Restaurant-Style-Chicken-Quesadillas-14.jpg", badge:null, tags:[] },
    { id:"m6", name:"Quesadilla Camarones",  price:17.99, description:"Queso cheddar, pico de gallo y sour cream con camarones.", imageUrl:"https://thenightowlchef.com/wp-content/uploads/2021/12/Restaurant-Style-Chicken-Quesadillas-14.jpg", badge:null, tags:[] },
  ]},
  { id:"pizza", label:"Pizza Party", emoji:"🍕", items:[
    { id:"p1", name:"Cheese Pizza",    price:14.99, description:"Salsa roja y queso mozzarella.", imageUrl:"https://frommichigantothetable.com/wp-content/uploads/2023/03/from-michigan-to-the-table1511_226-800x1200.jpg", badge:null, tags:["Vegetarian"] },
    { id:"p2", name:"Honey Pepperoni", price:16.99, description:"Salsa roja, mozzarella, pepperoni y un toque de miel.", imageUrl:"https://www.tablefortwoblog.com/wp-content/uploads/2025/06/pepperoni-pizza-recipe-photos-tablefortwoblog-6.jpg", badge:"bestseller", tags:[] },
  ]},
  { id:"ensaladas", label:"Ensaladas", emoji:"🥗", items:[
    { id:"e1", name:"Caesar Salad — Pollo",     price:16.99, description:"Lechuga romana, crutones y queso parmesano con pollo.", imageUrl:"https://lexiscleankitchen.com/wp-content/uploads/2021/04/Caesar-Salad-Recipe.jpg", badge:null, tags:[] },
    { id:"e2", name:"Caesar Salad — NY Steak",  price:27.99, description:"Lechuga romana, crutones y queso parmesano con NY Steak.", imageUrl:"https://lexiscleankitchen.com/wp-content/uploads/2021/04/Caesar-Salad-Recipe.jpg", badge:null, tags:[] },
    { id:"e3", name:"Caesar Salad — Camarones", price:17.99, description:"Lechuga romana, crutones y queso parmesano con camarones.", imageUrl:"https://lexiscleankitchen.com/wp-content/uploads/2021/04/Caesar-Salad-Recipe.jpg", badge:null, tags:[] },
    { id:"e4", name:"Red Rooster Salad",        price:16.99, description:"Lechuga, tomate, cebolla, crutones y vinagreta balsámica.", imageUrl:"https://lexiscleankitchen.com/wp-content/uploads/2021/04/Caesar-Salad-Recipe.jpg", badge:null, tags:["Vegetarian"] },
  ]},
  { id:"brunch", label:"Brunch", emoji:"🍳", items:[
    { id:"br1",  name:"Morning Beast",             price:26.99, description:"Medio Costillar con 2 Huevos Sunny Side Up, Salsa BBQ, acompañados de Papas Fritas.", imageUrl:"https://girlcarnivore.com/wp-content/uploads/2017/12/BBQ-Rib-Hash-with-fried-egg-Recipe-at-GirlCarnivore-by-Kita-Roberts-7-of-8-1.jpg", badge:"bestseller", tags:[] },
    { id:"br2",  name:"Steak & Egg",               price:27.99, description:"Churrasco, New York o Ribeye (12oz) con 1 Huevo Sunny Side Up y Queso Parmesano.", imageUrl:"https://www.wholesomeyum.com/wp-content/uploads/2023/01/wholesomeyum-Steak-And-Eggs-19-500x500.jpg", badge:null, tags:[] },
    { id:"br3",  name:"Chicken & Waffle",          price:15.99, description:"Pollo Empanado con Waffle, Queso Cheddar y Syrup de Fresa.", imageUrl:"https://www.butterbeready.com/wp-content/uploads/2022/05/DK6A0247-680x1020.jpg", badge:"new", tags:[] },
    { id:"br4",  name:"Chicken Club Sandwich",     price:17.99, description:"Pollo, 3 Lascas de Bacon, Queso Suizo, Lechuga y Tomate.", imageUrl:"https://www.chick-fil-a.com/wp-content/uploads/sites/2/2025/12/Chick-fil-A-Chicken-Sandwich-plp-newstalgia-patch-mob.png", badge:null, tags:[] },
    { id:"br5",  name:"Lemy Sandwich",             price:15.99, description:"Pan Sobao con Mantequilla, Jamón de Pavo, 2 Huevos Fritos y Queso Suizo.", imageUrl:"https://www.chick-fil-a.com/wp-content/uploads/sites/2/2025/12/Chick-fil-A-Chicken-Sandwich-plp-newstalgia-patch-mob.png", badge:null, tags:[] },
    { id:"br6",  name:"Sunrise Burrito",           price:13.99, description:"Tortilla Wrap Rellena de Revoltillo, Queso Cheddar y Lechuga. Opcional: Bacon o Salchicha.", imageUrl:"https://hips.hearstapps.com/hmg-prod/images/breakfast-burrito-lead-66a7e23ce81b0.jpg", badge:null, tags:[] },
    { id:"br7",  name:"Sweet & Salty French Toast",price:13.99, description:"Pan de Mallorca, Pedazos de Bacon, Syrup de Fresa y Whipped Cream.", imageUrl:"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/24/89/8e/cb/french-toast.jpg", badge:null, tags:[] },
    { id:"br8",  name:"Sunny Bowls",               price:13.99, description:"Escoge: Ropa Vieja $13.99 · Carne Frita $13.99 · Churrasco $19.99. Con Papas + Huevo Sunny Side Up y Queso Parmesano.", imageUrl:"https://www.wholesomeyum.com/wp-content/uploads/2023/01/wholesomeyum-Steak-And-Eggs-19-500x500.jpg", badge:null, tags:[] },
    { id:"br9",  name:"Caramel Waffles",           price:6.99,  description:"Waffles Bañados en Salsa de Caramelo y Azúcar en Polvo.", imageUrl:"https://eatlittlebird.com/wp-content/uploads/2015/10/Waffles-with-Salted-Caramel-Sauce-6.jpg.webp", badge:null, tags:["Vegetarian"] },
    { id:"br10", name:"Good Morning Sampler",      price:15.99, description:"French Toast Sticks, Waffles, Sweet Potato Fries con Salsas de Chocolate, Fresa y Caramelo.", imageUrl:"https://eatlittlebird.com/wp-content/uploads/2015/10/Waffles-with-Salted-Caramel-Sauce-6.jpg.webp", badge:null, tags:["Shareable"] },
  ]},
  { id:"cervezas", label:"Cervezas", emoji:"🍺", items:[
    { id:"cv1",  name:"Medalla",               price:4.00, description:"La lager icónica de Puerto Rico. Ligera, crujiente y refrescante.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv2",  name:"Michelob",              price:4.00, description:"Lager americana clásica, suave y limpia.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv3",  name:"Michelob Gold",         price:5.00, description:"Lager dorada premium con un sabor equilibrado.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv4",  name:"Heineken",              price:5.00, description:"La famosa lager holandesa, botella verde icónica.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv5",  name:"Corona Extra",          price:6.00, description:"Lager mexicana refrescante, mejor con limón.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv6",  name:"Modelo Especial",       price:5.00, description:"Pilsner mexicano crujiente y equilibrado.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:"bestseller", tags:[] },
    { id:"cv7",  name:"La Parchita",           price:7.00, description:"Craft local con notas tropicales de parcha.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:"new", tags:[] },
    { id:"cv8",  name:"312 Goose Island",      price:8.00, description:"Wheat ale de Chicago — cítrico y suave.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv9",  name:"Ocean American Wheat",  price:8.00, description:"American wheat ale con final ligero y brumoso.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv10", name:"Blue Moon",             price:6.00, description:"Cerveza de trigo estilo belga con toque de naranja.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv11", name:"Dos XX",                price:5.00, description:"Dos Equis lager — cerveza mexicana crujiente desde 1897.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv12", name:"Guinness",              price:7.00, description:"El stout oscuro irlandés con cabeza cremosa icónica.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv13", name:"Samuel Adams",          price:6.00, description:"Boston Lager — la craft beer que lo inició todo.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv14", name:"Lagunitas IPA",         price:7.00, description:"West Coast IPA con lúpulos intensos y aromas cítricos.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv15", name:"Sapporo Light",         price:6.00, description:"Lager japonesa ligera, ultra limpia y refrescante.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv16", name:"Sapporo Premium",       price:7.00, description:"Lager japonesa premium en la icónica lata plateada.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv17", name:"Estrella Damm",         price:6.00, description:"La lager mediterránea premium de Barcelona desde 1876.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv18", name:"Sierra Nevada Torpedo", price:7.00, description:"Double IPA West Coast — con lúpulos intensos y atrevidos.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv19", name:"Heineken 0.0",          price:4.00, description:"Todo el sabor de Heineken, cero alcohol.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:["Non-Alcoholic"] },
    { id:"cv20", name:"Heineken Silver",       price:4.00, description:"Heineken extra suave con menor amargor.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv21", name:"Alhambra Verde",        price:6.00, description:"Lager española premium de etiqueta verde.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv22", name:"Alhambra Roja",         price:6.00, description:"Lager ámbar española con notas de malta y caramelo.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv23", name:"Miller Lite",           price:4.00, description:"La cerveza light original de América.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv24", name:"Coors Light",           price:4.00, description:"Filtrada en frío en las Montañas Rocosas.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv25", name:"Stella Artois",         price:7.00, description:"Pilsner belga con carácter limpio y crujiente.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
    { id:"cv26", name:"Peroni",                price:7.00, description:"Lager italiana premium con sabor limpio y refrescante.", imageUrl:"https://sonderdram.com/wp-content/uploads/2018/04/Soder-Dram-Beer-tap-Beer-Alcohol-Brewery-Craft-Beer-Bar-Drink-Establishment-Pouring-PubDrinking-Restaurant-Alcohol-Drink-Beer-Glass-Stout-Lager-Pale-Ale.jpg", badge:null, tags:[] },
  ]},
  { id:"cocktails", label:"Cocktails", emoji:"🍹", items:[
    { id:"ck1", name:"Tamarindo Sunset",      price:11, description:"Ron Abuelo, Raspberry Syrup, Jugo de Limón y Jugo de Tamarindo.", imageUrl:"https://www.paeats.org/wp-content/uploads/2017/05/Margarita-Cheers-Foodiesfeed.jpg", badge:"bestseller", tags:[] },
    { id:"ck2", name:"Caribbean Storm",       price:10, description:"Rum Spiced Bacardi, Limón, Piña Syrup, Habanero, Sprite, Grenadine.", imageUrl:"https://www.paeats.org/wp-content/uploads/2017/05/Margarita-Cheers-Foodiesfeed.jpg", badge:null, tags:[] },
    { id:"ck3", name:"Cosmo Guava",           price:10, description:"Tanqueray, Guava, Blueberry, Limón.", imageUrl:"https://www.paeats.org/wp-content/uploads/2017/05/Margarita-Cheers-Foodiesfeed.jpg", badge:null, tags:[] },
    { id:"ck4", name:"Golden Honey",          price:11, description:"Jack Daniel's, Miel, Limón, Ginger Syrup y Amaretto.", imageUrl:"https://abarabove.com/wp-content/uploads/2019/01/cozy-cocktail-with-bitters-and-simple-syrup-with-maraschino-cherry.jpg", badge:"new", tags:[] },
    { id:"ck5", name:"Moscow Mule",           price:11, description:"Bravada, Lima Fresca y Our House Ginger Beer.", imageUrl:"https://mixthatdrink.com/wp-content/uploads/2009/03/moscow-mule-copper-mug-1-720x720.jpg", badge:null, tags:[] },
    { id:"ck6", name:"Our House Old Fashion", price:11, description:"Woodford Reserve Bourbon Whiskey, Angostura y Jarabe de Cerveza IPA.", imageUrl:"https://abarabove.com/wp-content/uploads/2019/01/cozy-cocktail-with-bitters-and-simple-syrup-with-maraschino-cherry.jpg", badge:"bestseller", tags:[] },
    { id:"ck7", name:"Espresso Martini",      price:11, description:"Borghetti (Licor de café expresso), Averna (Amaro de Sicilia) y café.", imageUrl:"https://www.urbanbar.com/cdn/shop/articles/Espresso_Martini.jpg", badge:null, tags:[] },
    { id:"ck8", name:"Watermelon Margarita",  price:11, description:"José Cuervo Gold, Sandía, Cointreau y Jugo de Limón.", imageUrl:"https://www.paeats.org/wp-content/uploads/2017/05/Margarita-Cheers-Foodiesfeed.jpg", badge:null, tags:[] },
    { id:"ck9", name:"Reptile Mezcarita",     price:12, description:"Montelobos Mezcal, Agave Infusionado con Naranja y Lima Fresca.", imageUrl:"https://www.paeats.org/wp-content/uploads/2017/05/Margarita-Cheers-Foodiesfeed.jpg", badge:"new", tags:[] },
  ]},
  { id:"ninos", label:"Niños", emoji:"🧒", items:[
    { id:"n1", name:"Chicken Pops",     price:7.99, description:"Popcorn chicken crujiente para los más pequeños.", imageUrl:"https://olo-images-live.imgix.net/ee/ee1211b4dda14565a3722daee4b0633b.jpg", badge:null, tags:[] },
    { id:"n2", name:"Cheese Sliders",   price:8.99, description:"Mini burgers con queso cheddar fundido.", imageUrl:"https://upload.wikimedia.org/wikipedia/commons/d/d2/A_party_tray_of_sliders_at_a_restaurant.jpg", badge:null, tags:[] },
    { id:"n3", name:"Pechuga de Pollo", price:7.99, description:"Pechuga de pollo a la plancha, suave y jugosa.", imageUrl:"https://www.onceuponachef.com/images/2020/05/best-grilled-chicken-760x1050.jpg", badge:null, tags:[] },
    { id:"n4", name:"Kids Pizza",       price:8.99, description:"Pizza con salsa roja y queso mozzarella, tamaño individual.", imageUrl:"https://frommichigantothetable.com/wp-content/uploads/2023/03/from-michigan-to-the-table1511_226-800x1200.jpg", badge:null, tags:["Vegetarian"] },
    { id:"n5", name:"Kids Pasta",       price:7.99, description:"Pasta con salsa marinara o mantequilla.", imageUrl:"https://mykitchenmystudio.com/wp-content/uploads/2023/11/Fettucinialfredo-1-scaled.jpg", badge:null, tags:["Vegetarian"] },
    { id:"n6", name:"Mac & Cheese",     price:8.99, description:"Macarrones cremosos con salsa de queso cheddar.", imageUrl:"https://www.butterandbaggage.com/wp-content/uploads/2016/12/Mac-Cheese-Pooles-Diner-7.jpg", badge:"bestseller", tags:["Vegetarian"] },
  ]},
  { id:"postres", label:"Postres", emoji:"🍰", items:[
    { id:"po1", name:"Brownie Sunday",        price:8.99,  description:"Brownie calientito acompañado de tu helado favorito.", imageUrl:"https://millersalehouse.com/wp-content/uploads/2021/06/Ghirardelli-Chocolate-Brownie-Sundae.jpg", badge:"bestseller", tags:["Vegetarian"] },
    { id:"po2", name:"Waffle con Helado",     price:8.99,  description:"Waffle servido con tu helado y topping favorito.", imageUrl:"https://eatlittlebird.com/wp-content/uploads/2015/10/Waffles-with-Salted-Caramel-Sauce-6.jpg.webp", badge:null, tags:["Vegetarian"] },
    { id:"po3", name:"Cheesecake",            price:8.99,  description:"Cremoso cheesecake clásico.", imageUrl:"https://c8.alamy.com/comp/MPDWF9/new-york-cheesecake-served-at-restaurant-dessert-concept-MPDWF9.jpg", badge:null, tags:["Vegetarian"] },
    { id:"po4", name:"Chocolate Chip Cookie", price:13.99, description:"Galleta gigante de chispas de chocolate.", imageUrl:"https://millersalehouse.com/wp-content/uploads/2021/06/Ghirardelli-Chocolate-Brownie-Sundae.jpg", badge:"new", tags:["Vegetarian"] },
    { id:"po5", name:"Ice Cream",             price:3.99,  description:"Helado artesanal. Pregunta por los sabores disponibles.", imageUrl:"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/7e/a8/23/come-taste-the-best-homemade.jpg", badge:null, tags:["Vegetarian"] },
  ]},
];

const ALL_TAGS = ["Shareable", "Vegetarian", "Non-Alcoholic"];

const badgeCfg: Record<BadgeType, { label: string; bg: string; color: string }> = {
  bestseller: { label: "BESTSELLER", bg: B.accent,   color: B.black },
  new:        { label: "NEW DROP",   bg: "#FFFFFF",   color: B.black },
};

// ── Badge ────────────────────────────────────────────────────────────────────
function Badge({ type }: { type: BadgeType | null }) {
  if (!type) return null;
  const c = badgeCfg[type];
  return (
    <span style={{
      background: c.bg, color: c.color,
      fontSize: 9, fontWeight: 900,
      padding: "3px 8px", borderRadius: 2,
      letterSpacing: "0.12em",
      textTransform: "uppercase" as const,
      whiteSpace: "nowrap" as const,
    }}>
      {c.label}
    </span>
  );
}

// ── Item Card ────────────────────────────────────────────────────────────────
function ItemCard({ item, index, onClick }: {
  item: MenuItem;
  index: number;
  onClick: (item: MenuItem) => void;
}) {
  const oos = item.status === "out-of-stock";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18, delay: index * 0.025, ease: [0.25, 0.1, 0.25, 1] }}
      whileTap={{ scale: oos ? 1 : 0.96 }}
      onClick={() => !oos && onClick(item)}
      style={{
        background: B.card,
        borderRadius: 6,
        overflow: "hidden",
        cursor: oos ? "default" : "pointer",
        border: `1px solid ${B.border}`,
        opacity: oos ? 0.38 : 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 160, overflow: "hidden", background: "#080808", flexShrink: 0 }}>
        <img
          src={item.imageUrl} alt={item.name} loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: oos ? "grayscale(1) brightness(0.5)" : "brightness(0.88)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.92) 100%)" }} />
        {item.badge && !oos && (
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <Badge type={item.badge} />
          </div>
        )}
        {oos && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 9, fontWeight: 900, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", border: "1px solid #333", padding: "4px 10px", borderRadius: 2 }}>
              SOLD OUT
            </span>
          </div>
        )}
        {/* Price stamped on image */}
        <div style={{ position: "absolute", bottom: 10, right: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: B.accent, lineHeight: 1, letterSpacing: "-0.02em" }}>{fmt(item.price)}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "11px 13px 0", flex: 1 }}>
        <span style={{ fontSize: 13, fontWeight: 900, color: B.text, lineHeight: 1.2, display: "block", textTransform: "uppercase", letterSpacing: "-0.01em", marginBottom: 5 }}>
          {item.name}
        </span>
        <p style={{ fontSize: 12, color: B.textMid, lineHeight: 1.55, margin: "0 0 8px" }}>
          {item.description}
        </p>
        {item.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
            {item.tags.map(t => (
              <span key={t} style={{ fontSize: 9, color: B.accent, background: B.accentDim, border: `1px solid ${B.accentBorder}`, padding: "2px 7px", borderRadius: 2, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      {!oos && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 13px 11px", borderTop: `1px solid ${B.border}`, marginTop: 4 }}>
          <span style={{ fontSize: 9, color: B.textDim, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Details
          </span>
          <div style={{ width: 26, height: 26, borderRadius: 3, background: B.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke={B.black} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Drawer ───────────────────────────────────────────────────────────────────
function Drawer({ item, onClose, containerRef }: {
  item: MenuItem;
  onClose: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.style.overflow = "hidden";
    return () => { if (el) el.style.overflow = ""; };
  }, [containerRef]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "flex-end" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 540, damping: 44, mass: 0.7 }}
        onClick={e => e.stopPropagation()}
        className="w-full md:max-w-2xl md:mx-auto rounded-t-xl md:rounded-t-2xl"
        style={{ maxHeight: "90vh", background: B.black, border: `1px solid ${B.border}`, borderBottom: "none", overflow: "hidden", display: "flex", flexDirection: "column" }}
      >
        {/* Drag pill */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 4, flexShrink: 0 }}>
          <div style={{ width: 30, height: 3, background: B.border, borderRadius: 99 }} />
        </div>

        {/* Image */}
        <div style={{ position: "relative", height: 220, flexShrink: 0 }}>
          <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.82)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #000000 0%, transparent 55%)" }} />
          {item.badge && (
            <div style={{ position: "absolute", top: 12, left: 14 }}>
              <Badge type={item.badge} />
            </div>
          )}
          <button onClick={onClose} aria-label="Close"
            style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.7)", border: `1px solid ${B.border}`, color: B.text, borderRadius: 4, width: 44, height: 44, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", fontWeight: 900 }}>
            ×
          </button>
          {/* Price on image */}
          <div style={{ position: "absolute", bottom: 14, right: 16 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: B.accent, letterSpacing: "-0.03em" }}>{fmt(item.price)}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ overflowY: "auto", padding: "14px 18px", paddingBottom: "max(28px, calc(16px + env(safe-area-inset-bottom)))", overscrollBehavior: "contain" } as React.CSSProperties}>
          {/* Name */}
          <h2 style={{ fontSize: 20, fontWeight: 900, color: B.text, margin: "0 0 8px", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: "-0.025em" }}>
            {item.name}
          </h2>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
              {item.tags.map(t => (
                <span key={t} style={{ fontSize: 9, color: B.accent, background: B.accentDim, border: `1px solid ${B.accentBorder}`, padding: "3px 9px", borderRadius: 2, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p style={{ fontSize: 14, color: B.textMid, lineHeight: 1.65, margin: "0 0 20px" }}>
            {item.description}
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: B.border, marginBottom: 20 }} />

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            style={{ width: "100%", padding: "16px", background: B.accent, color: B.black, border: "none", borderRadius: 5, fontSize: 13, fontWeight: 900, cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Order — {fmt(item.price)}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function OurHouseMenu() {
  const [filters, setFilters]       = useState<string[]>([]);
  const [activeCat, setActiveCat]   = useState(menuData[0].id);
  const [selected, setSelected]     = useState<MenuItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const navRef       = useRef<HTMLDivElement>(null);
  const stickyRef    = useRef<HTMLDivElement>(null);
  const secRefs      = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observers = menuData.map(cat => {
      const el = secRefs.current[cat.id];
      if (!el) return null;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !isScrolling) {
          setActiveCat(cat.id);
          navRef.current?.querySelector<HTMLElement>(`[data-cat="${cat.id}"]`)
            ?.scrollIntoView({ inline: "center", block: "nearest" });
        }
      }, { root: containerRef.current, threshold: 0.15, rootMargin: "-100px 0px -55% 0px" });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, [filters, isScrolling]);

  const scrollTo = useCallback((id: string) => {
    const el     = secRefs.current[id];
    const sticky = stickyRef.current;
    const cont   = containerRef.current;
    if (!el || !sticky || !cont) return;

    setActiveCat(id);
    setIsScrolling(true);
    navRef.current?.querySelector<HTMLElement>(`[data-cat="${id}"]`)?.scrollIntoView({ inline: "center", block: "nearest" });

    const stickyH    = sticky.getBoundingClientRect().height;
    const contTop    = cont.getBoundingClientRect().top;
    const elTop      = el.getBoundingClientRect().top;
    cont.scrollTo({ top: cont.scrollTop + (elTop - contTop) - stickyH, behavior: "smooth" });

    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setIsScrolling(false), 800);
  }, []);

  const toggleFilter = (t: string) =>
    setFilters(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const filtered = menuData
    .map(cat => ({
      ...cat,
      items: filters.length === 0 ? cat.items : cat.items.filter(i => filters.every(f => i.tags?.includes(f))),
    }))
    .filter(c => c.items.length > 0);

  return (
    <div
      ref={containerRef}
      style={{ height: "100dvh", overflowY: "auto", overflowX: "hidden", background: B.black, fontFamily: "-apple-system,BlinkMacSystemFont,'Inter',sans-serif", color: B.text, overscrollBehavior: "contain" } as React.CSSProperties}
    >

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div style={{ background: B.black, borderBottom: `1px solid ${B.border}`, position: "relative", overflow: "hidden" }}>
        {/* Accent left rail */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: B.accent }} />

        <div style={{ padding: "22px 18px 18px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 48, height: 48, background: B.accent, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: B.black, flexShrink: 0, letterSpacing: "-0.03em" }}>
              OH
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: B.text, lineHeight: 1, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
                Our House
              </div>
              <div style={{ fontSize: 9, color: B.accent, fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase", marginTop: 4 }}>
                Sport & Gaming Bar
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {["🎮 Gaming", "📍 Bayamón PR", "⭐ 4.8", "🕐 Open Now"].map(t => (
              <span key={t} style={{ fontSize: 9, background: "#0A0A0A", color: B.textMid, border: `1px solid ${B.border}`, padding: "3px 9px", borderRadius: 2, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky Nav ────────────────────────────────────────────────────── */}
      <div
        ref={stickyRef}
        style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(0,0,0,0.96)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${B.border}` }}
      >
        {/* Category tabs — horizontal scroll mobile, wraps on md+ */}
        <div
          ref={navRef}
          className="flex overflow-x-auto md:overflow-x-visible md:flex-wrap"
          style={{ padding: "8px 10px 0" }}
        >
          {menuData.map(cat => {
            const active = activeCat === cat.id;
            return (
              <div key={cat.id} style={{ position: "relative", flexShrink: 0 }}>
                {active && (
                  <motion.div
                    layoutId="tab-indicator"
                    style={{ position: "absolute", inset: 0, background: B.accent, borderRadius: "4px 4px 0 0" }}
                    transition={{ type: "spring", stiffness: 600, damping: 42 }}
                  />
                )}
                <button
                  data-cat={cat.id}
                  onClick={() => scrollTo(cat.id)}
                  style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 4, padding: "9px 11px", border: "none", background: "transparent", color: active ? B.black : B.textDim, fontSize: 11, fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap", borderRadius: "4px 4px 0 0", textTransform: "uppercase", letterSpacing: "0.06em", transition: "color 0.1s" }}
                >
                  <span style={{ fontSize: 13 }}>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-2 overflow-x-auto" style={{ padding: "7px 10px 9px" }}>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setShowFilters(p => !p)}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 11px", borderRadius: 2, border: `1.5px solid ${showFilters ? B.accent : B.border}`, background: showFilters ? B.accentDim : "transparent", color: showFilters ? B.accent : B.textDim, fontSize: 9, fontWeight: 900, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.1em" }}
          >
            <svg width="12" height="9" viewBox="0 0 13 10" fill="none">
              <path d="M0 1h13M2 5h9M4 9h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            Filter
            {filters.length > 0 && (
              <span style={{ background: B.accent, color: B.black, borderRadius: 2, width: 16, height: 16, fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>
                {filters.length}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showFilters && ALL_TAGS.map((t, i) => (
              <motion.button
                key={t}
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.04 } }}
                exit={{ opacity: 0, scale: 0.82 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => toggleFilter(t)}
                style={{ padding: "6px 11px", borderRadius: 2, fontSize: 9, fontWeight: 900, cursor: "pointer", flexShrink: 0, border: `1.5px solid ${filters.includes(t) ? B.accent : B.border}`, background: filters.includes(t) ? B.accent : "transparent", color: filters.includes(t) ? B.black : B.textDim, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.08em" }}
              >
                {t}
              </motion.button>
            ))}
          </AnimatePresence>

          {filters.length > 0 && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileTap={{ scale: 0.92 }}
              onClick={() => setFilters([])}
              style={{ fontSize: 9, color: "#FF4422", background: "transparent", border: "1px solid rgba(255,68,34,0.3)", borderRadius: 2, padding: "5px 10px", cursor: "pointer", flexShrink: 0, fontWeight: 900, whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.08em" }}
            >
              Clear
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Menu Sections ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-3 md:px-6" style={{ paddingTop: 22, paddingBottom: 80 }}>
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "80px 20px" }}
            >
              <div style={{ fontSize: 40, marginBottom: 14 }}>🎮</div>
              <p style={{ fontSize: 11, fontWeight: 900, color: B.textDim, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 20 }}>
                No items match that filter
              </p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setFilters([])}
                style={{ background: B.accent, color: B.black, border: "none", borderRadius: 4, padding: "13px 30px", fontSize: 11, fontWeight: 900, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em" }}
              >
                Reset Filters
              </motion.button>
            </motion.div>
          ) : filtered.map(cat => (
            <div
              key={cat.id}
              ref={el => { secRefs.current[cat.id] = el; }}
              style={{ marginBottom: 44 }}
            >
              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 3, height: 16, background: B.accent, borderRadius: 1, flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 900, color: B.text, textTransform: "uppercase", letterSpacing: "0.14em" }}>
                  {cat.emoji}&nbsp;&nbsp;{cat.label}
                </span>
                <div style={{ flex: 1, height: 1, background: B.border }} />
                <span style={{ fontSize: 10, color: B.textDim, fontWeight: 700, letterSpacing: "0.04em" }}>
                  {cat.items.length}
                </span>
              </div>

              {/* Responsive card grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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

      {/* ── Footer Banner ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 md:px-6" style={{ paddingBottom: 28 }}>
        <div style={{ background: B.card, borderRadius: 5, padding: "15px 16px", border: `1px solid ${B.border}`, display: "flex", alignItems: "center", gap: 14, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: B.accent }} />
          <div style={{ width: 42, height: 42, background: B.accent, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, marginLeft: 8 }}>
            🎮
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 900, color: B.text, margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Game Night — Every Friday
            </p>
            <p style={{ fontSize: 11, color: B.textDim, margin: 0, lineHeight: 1.5 }}>
              Tournaments, drink specials & more. Reserve your table.
            </p>
          </div>
        </div>
      </div>

      {/* ── Drawer ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <Drawer
            key="drawer"
            item={selected}
            onClose={() => setSelected(null)}
            containerRef={containerRef}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
