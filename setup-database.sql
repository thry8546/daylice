-- Daylice Café - Supabase setup (schema + seeds)
-- Exécuter dans l'éditeur SQL Supabase

begin;

-- Extensions utiles
create extension if not exists "pgcrypto";

-- Types
do $$
begin
  if not exists (select 1 from pg_type where typname = 'menu_category') then
    create type menu_category as enum ('boissons', 'plats_chauds', 'plats_froids');
  end if;
end$$;

-- Tables
create table if not exists menus (
  id uuid primary key default gen_random_uuid(),
  category menu_category not null,
  family text,
  name text not null,
  detail text,
  price_p numeric(10,2),
  price_m numeric(10,2),
  price_g numeric(10,2),
  position int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(category, name)
);

create table if not exists daily_special (
  id int primary key default 1 check (id = 1),
  name text not null,
  price numeric(10,2),
  detail text,
  updated_at timestamptz default now()
);

create table if not exists promos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10,2) not null,
  position int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  paragraph text,
  url text not null,
  position int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  detail text not null,
  label text not null,
  url text,
  position int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Triggers updated_at
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_menus_updated before update on menus
  for each row execute function set_updated_at();
create trigger trg_promos_updated before update on promos
  for each row execute function set_updated_at();
create trigger trg_banners_updated before update on banners
  for each row execute function set_updated_at();
create trigger trg_contacts_updated before update on contacts
  for each row execute function set_updated_at();
create trigger trg_daily_updated before update on daily_special
  for each row execute function set_updated_at();

-- Seeds (extraits des CSV et maquettes)

-- Bannières (url pour preview Supabase storage ou chemin statique)
insert into banners (title, paragraph, url, position) values
('Allergie et/ou intolérances alimentaires', 'Chacun est différent, donc n''hésitez pas à vous adresser à notre personnel qui saura vous renseigner avec plaisir.', '/assets/image/banner-img-1.jpg', 1),
('Qualité des produits', 'Snack ne veut pas dire junk-food, nous mettons tout notre cœur pour vous proposer les meilleurs produits.', '/assets/image/banner-img-2.jpg', 2),
('Horaires', 'Lundi à Mercredi 7h30 - 19h00 | Jeudi 7h30 - 20h00 | Vendredi 7h30 - 19h00 | Samedi 7h00 - 18h00 | Dimanche fermé', '/assets/image/banner-img-3.jpg', 3),
('Convivialité', 'Toute notre équipe cherche à répondre aux attentes de nos hôtes. En prime, nos sourires sont gratuits.', '/assets/image/banner-img-4.jpg', 4),
('Terrasse 34 places', 'Pour des apéros inoubliables, nous disposons d''une terrasse couverte et 4 transats en été.', '/assets/image/banner-img-5.jpg', 5),
('Service take-away et réservation', 'Envie de grignoter ? Appelez-nous au 032 852 03 46 et nous préparons votre commande à emporter.', '/assets/image/banner-img-6.jpg', 6)
on conflict (id) do nothing;

-- Contacts
insert into contacts (detail, label, url, position) values
('Avenue Robert 12 2052 Fontainemelon', 'Adresse', '', 1),
('032 852 03 46', 'Téléphone', '', 2),
('info@daylice.ch', 'Email', 'mailto:info@daylice.ch', 3),
('Facebook', 'Facebook', 'https://www.facebook.com/daylice', 4),
('Instagram', 'Instagram', 'https://www.instagram.com/daylice', 5),
('© 2026 Daylice Café. Tous droits réservés.', 'Copyright', '', 6)
on conflict (id) do nothing;

-- Plat du jour (singleton)
insert into daily_special (id, name, price, detail) values
(1, 'Assortissement en vitrine', 4.50, 'Plat assorti de jambon et de salade')
on conflict (id) do update set name=excluded.name, price=excluded.price, detail=excluded.detail;

-- Promos (prix unique)
insert into promos (name, price, position) values
('Assortissement en vitrine', 4.50, 1),
('Tartare de saumon', 15.00, 2),
('Café + croissant', 4.60, 3),
('Dessert du mois', 6.50, 4)
on conflict (id) do nothing;

-- Menus : Boissons
insert into menus (category, family, name, detail, price_p, price_m, price_g, position) values
('boissons','Apéritifs','Absinthe 53 %','2cl',5.50,null,null,1),
('boissons','Digestifs','Amaretto Disaronno 28%','2cl',5.00,null,null,2),
('boissons','Apéritifs','Apérol 11%','4dl. Apérol, Prosseco et eau minérale.',10.50,null,null,3),
('boissons','Café','Café viennois','',5.20,null,null,4),
('boissons','Café','Café | Espresso','',3.60,null,null,5),
('boissons','Bières','Cariberg | 1876','2dl | 3dl | 5dl',3.70,4.40,6.40,6),
('boissons','Vins','Chardonnay 13 %','1dl | 50cl | 75cl',4.90,24.00,34.00,7),
('boissons','Vins','Chardonnay Angelrath 13%','Blanc Neuchâtel. Disponible en 1dl | 7,5dl.',4.90,24.00,34.00,8),
('boissons','Chocolat','Chocolat Chaud | Froid','3dl',4.10,null,null,9),
('boissons','Chocolat','Chocolat viennois','',5.20,null,null,10),
('boissons','Apéritifs','Cinzano rouge 23%','4cl',5.30,null,null,11),
('boissons','Apéritifs','Cinzano, Campari 23 %','4cl',5.30,null,null,12),
('boissons','Minérales','Coca cola','Disponible en : 2dl | 3dl | 5dl',3.30,3.80,5.70,13),
('boissons','Minérales','Coca zéro','Disponible en : 2dl | 3dl | 5dl',3.30,3.80,5.70,14),
('boissons','Minérales en bouteille','Coca zéro','33cl',4.50,null,null,15),
('boissons','Digestifs','Cognac Rémi Martin 40%','2cl',8.50,null,null,16),
('boissons','Apéritifs','Cynar 16,5%','4cl',5.30,null,null,17),
('boissons','Thé','Dammann','',4.10,null,null,18),
('boissons','Café','Double expresso','',4.70,null,null,19),
('boissons','Minérales','Eau minérale','Disponible en : 2dl | 3dl | 5dl',3.20,3.50,4.70,20),
('boissons','Minérales','Eau minérale + sirop','Disponible en : 2dl | 3dl | 5dl',3.40,3.50,5.00,21),
('boissons','Bières','Erdinger 33cl','Blanche',4.20,null,null,22),
('boissons','Bières','Erdinger blanche 33cl sans alcool','Blanche sans alcool',4.20,null,null,23),
('boissons','Bières','Feldschlösschen 33cl','Blanche',4.50,null,null,24),
('boissons','Bières','Feldschlösschen 33cl sans alcool','Blanche sans alcool',4.50,null,null,25),
('boissons','Gravine','Goron 12,4%','Rosé. Disponible en 1dl | 3dl | 5dl.',3.60,10.50,18.00,26),
('boissons','Gravine','Goron 12,8%','Rouge. Disponible en 1dl | 3dl | 5dl.',3.60,10.50,18.00,27),
('boissons','Digestifs','Grappa Fior di Vite 40%','2cl',5.50,null,null,28),
('boissons','Minérales','Jus d''orange','Disponible en Granini : 2dl | 3dl',3.70,5.20,null,29),
('boissons','Jus de fruits','Jus d''oranges pressées','2dl / 3dl',4.30,6.10,null,30),
('boissons','Minérales en bouteille','Jus de pomme','33cl',4.50,null,null,31),
('boissons','Lait','Lait Chaud | Froid','',3.50,null,null,32),
('boissons','Lait','Lait grenadine','',3.90,null,null,33),
('boissons','Café','Latte macchiato','',4.40,null,null,34),
('boissons','Minérales','Limonade','Disponible en : 2dl | 3dl | 5dl',3.30,3.80,5.70,35),
('boissons','Digestifs','Limoncello 25%','2cl',5.30,null,null,36),
('boissons','Digestifs','Marc 40%','2cl',6.50,null,null,37),
('boissons','Jus de fruits','Nectars de fruits','20cl. Arômes pêche, abricot, cocktail de fruits, poire, tomate.',4.70,null,null,38),
('boissons','Thé','Noir / Cynorhodon','',3.50,null,null,39),
('boissons','Vins','Oeil de perdrix 17%','Rosé. Disponible en 1dl | 5dl.',4.90,null,24.00,40),
('boissons','Minérales','Orangina','Disponible en : 2dl | 3dl | 5dl',3.30,3.80,5.70,41),
('boissons','Chocolat','Ovomaltine chaud / froid','3dl',4.50,null,null,42),
('boissons','Vins','Pinot gris 13,9%','Disponible en 10cl et 50cl',5.70,24.50,null,43),
('boissons','Vins','Pinot noir 13%','Rouge. Disponible en 1dl | 5dl',5.10,24.50,36.00,44),
('boissons','Digestifs','Pomme 40%','2cl',4.50,null,null,45),
('boissons','Apéritifs','Porto 20 %','4cl',4.80,null,null,46),
('boissons','Bières','Pression Grimbergen','2dl / 3dl / 5dl - Blanche, rouge ou de saison',3.80,4.50,6.60,47),
('boissons','Bières','Pression blanche','2dl | 3dl | 5dl',3.70,4.40,6.40,48),
('boissons','Bières','Pression blonde','2dl | 3dl | 5dl',3.70,4.40,6.40,49),
('boissons','Café','Renversé | Cappuccino','',4.10,null,null,50),
('boissons','Minérales','Rhâzunser citron','Disponible en : 2dl | 3dl | 5dl',3.30,3.80,5.70,51),
('boissons','Minérales','Rhâzunser naturelle','Disponible en : 2dl | 3dl | 5dl',3.20,3.50,4.70,52),
('boissons','Apéritifs','Ricard 45%','2cl',3.90,null,null,53),
('boissons','Vins','Riesling Silvaner 13 %','Disponible en 1dl | 75cl',5.10,null,36.00,54),
('boissons','Café','Ristretto','',3.60,null,null,55),
('boissons','Minérales en bouteille','Rivella bleu | rouge','33cl',4.50,null,null,56),
('boissons','Minérales en bouteille','San Bitter | Crodino','',4.60,null,null,57),
('boissons','Minérales','Schweppes Mojito','Disponible en : 2dl | 3dl | 5dl',3.60,4.10,6.00,58),
('boissons','Minérales en bouteille','Schweppes Tonic | Lemon','20cl',4.50,null,null,59),
('boissons','Apéritifs','Supplément','minérale, coca, jus d''orange',1.00,null,null,60),
('boissons','Apéritifs','Suze 20%','4cl',5.30,null,null,61),
('boissons','Thé','Thé au rhum','',6.70,null,null,62),
('boissons','Minérales','Thé froid','Disponible en : Citron | pêche - 2dl | 3dl | 5dl',3.30,3.80,5.70,63),
('boissons','Digestifs','Williamine 37,5%','2cl',6.90,null,null,64)
on conflict (category, name) do nothing;

-- Menus : Plats chauds
insert into menus (category, family, name, detail, price_p, price_m, price_g, position) values
('plats_chauds','Dessert','Asortissement en vitrine','',4.50,null,null,1),
('plats_chauds','Pizzas','Calzone Jambon Champigon','',14.50,null,null,2),
('plats_chauds','Paninis','Chorizo','',9.50,null,null,3),
('plats_chauds','Pizzas','Chorizo Pizzas','',13.50,null,null,4),
('plats_chauds','Paninis','Chèvre','',10.00,null,null,5),
('plats_chauds','Paninis','Chèvre jambon Cru','',10.00,null,null,6),
('plats_chauds','Snacks','Croissant au jambon','',4.00,null,null,7),
('plats_chauds','Snacks','Croque-monsieur','',4.50,null,null,8),
('plats_chauds','Paninis','Jambon','',9.50,null,null,9),
('plats_chauds','Paninis','Jambon Cru','',9.50,null,null,10),
('plats_chauds','Pizzas','Jambon Pizzas','',13.50,null,null,11),
('plats_chauds','Pizzas','Marguerita','',11.00,null,null,12),
('plats_chauds','Selon la disponibilité','Partage du jour','',7.00,null,null,13),
('plats_chauds','Paninis','Poulet','',9.50,null,null,14),
('plats_chauds','Snacks','Ramequin','',4.00,null,null,15),
('plats_chauds','Paninis','Saumon','',10.00,null,null,16),
('plats_chauds','Dessert','Selon l''humeur du jour et la saison','',6.00,null,null,17),
('plats_chauds','Paninis','Thon','',9.50,null,null,18),
('plats_chauds','Pizzas','Thon et oignons','',14.50,null,null,19),
('plats_chauds','Paninis','Tomates-Mozzarella','',8.00,null,null,20)
on conflict (category, name) do nothing;

-- Menus : Plats froids
insert into menus (category, family, name, detail, price_p, price_m, price_g, position) values
('plats_froids','Sandwiches','Chorizo','3 tailles : petit, moyen, grand.',6.50,8.30,9.90,1),
('plats_froids','Sandwiches','Crevettes','3 tailles : petit, moyen, grand.',7.00,9.00,10.50,2),
('plats_froids','Sandwiches','De la semaine','3 tailles : petit, moyen, grand.',7.00,9.00,10.50,3),
('plats_froids','Sandwiches','Escalope panée','3 tailles : petit, moyen, grand.',8.00,10.00,11.50,4),
('plats_froids','Salades','Exotique','Salade verte, poulet au curry, ananas, tomates',13.90,null,null,5),
('plats_froids','Matin','Formule matin','Café ou espresso ou thé, croissant parisien',4.80,null,null,6),
('plats_froids','Matin','Formule matin 2','Renversé / Cappuccino / Chocolat + Croissant',5.00,null,null,7),
('plats_froids','Matin','Formule matin 3','Jus d''orange / Cocktail de fruits + Croissant',5.30,null,null,8),
('plats_froids','Midi','Formule midi','Sandwich moyen + boisson (bte PET selon dispo)',11.00,null,null,9),
('plats_froids','Midi','Formule midi plus ','Sandwich moyen + pâtisserie + boisson (bte PET selon dispo)',15.00,null,null,10),
('plats_froids','Matin','Formule petit-déj''','Jus d''orange 1dl, croissant parisien ou 1/3 de baguette + café ou thé',8.50,null,null,11),
('plats_froids','Sandwiches','Fromage','3 tailles : petit, moyen, grand.',5.70,7.50,9.30,12),
('plats_froids','Sandwiches','Fromage de chèvre','3 tailles : petit, moyen, grand.',7.00,9.00,10.50,13),
('plats_froids','Sandwiches','Jambon','3 tailles : petit, moyen, grand.',5.70,7.50,9.30,14),
('plats_froids','Sandwiches','Jambon / Fromage','3 tailles : petit, moyen, grand.',6.50,9.00,10.50,15),
('plats_froids','Sandwiches','Jambon cru','3 tailles : petit, moyen, grand.',7.00,9.00,10.50,16),
('plats_froids','Sandwiches','Le régional','3 tailles : petit, moyen, grand.',7.00,9.00,10.50,17),
('plats_froids','Salades','Nordique','Salade verte, tomates, saumon, oignons, câpres, citron',14.50,null,null,18),
('plats_froids','Salades','Paysanne','Salade verte, viande séchée, croûtons, fromage, tomates',13.90,null,null,19),
('plats_froids','Sandwiches','Poulet','3 tailles : petit, moyen, grand.',6.50,8.30,9.90,20),
('plats_froids','Sandwiches','Roastbeef','3 tailles : petit, moyen, grand.',7.00,9.00,10.50,21),
('plats_froids','Salades','Salade aux crevettes','Salade verte, tomates, crevettes sauce cocktail, citron, aneth',14.50,null,null,22),
('plats_froids','Salades','Salade chèvre chaud','Salade verte, croûtons, toasts au chèvre chaud, tomates',14.50,null,null,23),
('plats_froids','Salades','Salade tomates |  mozzarella','Normale',13.50,null,null,24),
('plats_froids','Salades','Salade verte','2 tailles : petite, normale.',3.90,6.90,null,25),
('plats_froids','Salades','Salade verte tomates','Normale.',7.20,null,null,26),
('plats_froids','Sandwiches','Salami','3 tailles : petit, moyen, grand.',5.70,7.50,9.30,27),
('plats_froids','Sandwiches','Saumon','3 tailles : petit, moyen, grand.',7.00,9.00,10.50,28),
('plats_froids','Sandwiches','Thon','3 tailles : petit, moyen, grand.',8.00,10.00,11.50,29),
('plats_froids','Sandwiches','Tomates-mozzarella','3 tailles : petit, moyen, grand.',5.70,7.50,9.30,30),
('plats_froids','Sandwiches','Viande séchée','3 tailles : petit, moyen, grand.',7.00,9.00,10.50,31)
on conflict (category, name) do nothing;

-- Index
create index if not exists idx_menus_category on menus(category);
create index if not exists idx_menus_position on menus(position);
create index if not exists idx_promos_position on promos(position);
create index if not exists idx_banners_position on banners(position);
create index if not exists idx_contacts_position on contacts(position);

-- RLS
alter table menus enable row level security;
alter table daily_special enable row level security;
alter table promos enable row level security;
alter table banners enable row level security;
alter table contacts enable row level security;

-- Policies : lecture anonyme, écriture authentifiée
do $$
declare
  t text;
  pol_select text;
  pol_insert text;
  pol_update text;
  pol_delete text;
begin
  foreach t in array array['menus','daily_special','promos','banners','contacts'] loop
    pol_select := t||'_anon_select';
    pol_insert := t||'_auth_insert';
    pol_update := t||'_auth_update';
    pol_delete := t||'_auth_delete';

    if not exists (select 1 from pg_policies where policyname = pol_select and tablename = t) then
      execute format('create policy %I on %I for select using (true);', pol_select, t);
    end if;

    if not exists (select 1 from pg_policies where policyname = pol_insert and tablename = t) then
      execute format('create policy %I on %I for insert with check (auth.role() = ''authenticated'');', pol_insert, t);
    end if;

    if not exists (select 1 from pg_policies where policyname = pol_update and tablename = t) then
      execute format('create policy %I on %I for update using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'');', pol_update, t);
    end if;

    if not exists (select 1 from pg_policies where policyname = pol_delete and tablename = t) then
      execute format('create policy %I on %I for delete using (auth.role() = ''authenticated'');', pol_delete, t);
    end if;
  end loop;
end$$;

commit;
