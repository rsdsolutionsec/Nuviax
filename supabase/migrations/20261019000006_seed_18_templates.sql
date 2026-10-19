-- ============================================================================
-- MIGRATION: 20261019000006_seed_18_templates.sql
-- NUVIAX SAAS PLATFORM - RSD SOLUTIONS
-- Complete Library of 18 Production Templates
-- 6 per assigned developer (Programmer A, B, C)
-- ============================================================================

-- PROGRAMMER A: BODAS, ANIVERSARIOS Y CELEBRACIONES DE PAREJA (6 Plantillas)
INSERT INTO public.templates (
    category_id, code, name, description, thumbnail_url, schema_definition, default_config,
    compatible_plans, display_order, is_active, version, status, assigned_developer, artistic_style
) VALUES
(
    (SELECT id FROM public.categories WHERE code = 'bodas'),
    'boda-elegance-gold', 'Elegance Gold',
    'Diseño nupcial majestuoso con acentos dorados, tipografía romana clásica y toques florales sutiles.',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "ceremony", "reception", "itinerary", "gallery", "dress_code", "gifts", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "Ana & Carlos", "subtitle": "Nuestra Boda", "hosts": "Ana Lucía Silva & Carlos Mendoza", "quote": "Dos vidas, un solo corazón latiendo juntos.", "date": "2026-11-28T17:00:00Z", "ceremony": {"name": "Ceremonia Religiosa", "time": "17:00", "location_name": "Parroquia Nuestra Señora de la Paz", "address": "Av. Las Palmas # 120", "map_url": "https://maps.google.com"}, "reception": {"name": "Recepción & Fiesta", "time": "19:30", "location_name": "Hacienda Real Los Rosales", "address": "Km 14 Vía Campestre", "map_url": "https://maps.google.com"}, "dress_code": "Formal / Rigurosa Etiqueta", "gifts": {"message": "Su presencia es nuestro mayor regalo. Contaremos con lluvia de sobres."}}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 1, true, 1, 'published', 'Programador A', 'Gala Clásica Imperial'
),
(
    (SELECT id FROM public.categories WHERE code = 'bodas'),
    'boda-botanica-minimal', 'Botánica Minimal',
    'Follaje verde eucalipto, estilo rústico chic, tipografía moderna y fondo blanco cálido.',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "ceremony", "reception", "itinerary", "gallery", "dress_code", "gifts", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "Camila & Mateo", "subtitle": "Nos Casamos", "hosts": "Camila & Mateo", "quote": "El amor se compone de una sola alma que habita en dos cuerpos.", "date": "2026-12-05T16:00:00Z", "ceremony": {"name": "Jardín Los Encinos", "time": "16:00", "location_name": "Jardín Botánico", "address": "Camino Verde Km 3", "map_url": "https://maps.google.com"}, "dress_code": "Elegante Campestre"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 2, true, 1, 'published', 'Programador A', 'Orgánico & Minimalista'
),
(
    (SELECT id FROM public.categories WHERE code = 'bodas'),
    'boda-boho-sunset', 'Boho Chic Sunset',
    'Paleta terracota, arenas cálidas y flores secas para bodas bohemias al atardecer.',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "ceremony", "reception", "itinerary", "gallery", "dress_code", "gifts", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "Sofía & Andrés", "subtitle": "Nuestra Unión", "hosts": "Sofía & Andrés", "quote": "Caminar juntos hacia el horizonte de la vida.", "date": "2026-10-24T17:30:00Z", "dress_code": "Boho Chic / Tonos Tierra"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 3, true, 1, 'published', 'Programador A', 'Bohemio Romántico'
),
(
    (SELECT id FROM public.categories WHERE code = 'aniversarios'),
    'aniv-silver-jubilee', 'Bodas de Plata & Oro',
    'Conmemoración solemne y emotiva de 25 o 50 años de amor con detalles plateados y dorados.',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "ceremony", "reception", "itinerary", "gallery", "dress_code", "gifts", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "Elena & Roberto · 25 Años", "subtitle": "Nuestras Bodas de Plata", "hosts": "Elena & Roberto", "quote": "Un cuarto de siglo construyendo una historia de amor inquebrantable.", "date": "2026-11-15T19:00:00Z", "dress_code": "Gala Formal"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 4, true, 1, 'published', 'Programador A', 'Atemporal Conmemorativo'
),
(
    (SELECT id FROM public.categories WHERE code = 'bodas'),
    'boda-dark-romance', 'Midnight Velvet',
    'Estilo sofisticado de noche, tonos ciruela profunda, terciopelo negro y detalles en oro rosa.',
    'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "ceremony", "reception", "itinerary", "gallery", "dress_code", "gifts", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "Mariana & Gabriel", "subtitle": "Boda Nocturna", "hosts": "Mariana & Gabriel", "quote": "En la noche más hermosa, unimos nuestros destinos.", "date": "2026-12-12T20:00:00Z", "dress_code": "Black Tie / Traje Oscuro"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 5, true, 1, 'published', 'Programador A', 'Gótico Sofisticado & Velvet'
),
(
    (SELECT id FROM public.categories WHERE code = 'bodas'),
    'compromiso-champagne', 'Champagne Engagement',
    'Anuncio de compromiso exclusivo con copas de cristal, brillo dorado y brindis íntimo.',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "ceremony", "reception", "dress_code", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "¡Nos Comprometimos! · Paula & Diego", "subtitle": "Fiesta de Compromiso", "hosts": "Paula & Diego", "quote": "Ella dijo que sí. ¡Acompáñanos a brindar por nuestro futuro!", "date": "2026-11-07T19:30:00Z", "dress_code": "Cóctel Chic"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 6, true, 1, 'published', 'Programador A', 'Celebración Cóctel & Brindis'
)
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, thumbnail_url = EXCLUDED.thumbnail_url,
    schema_definition = EXCLUDED.schema_definition, default_config = EXCLUDED.default_config,
    assigned_developer = EXCLUDED.assigned_developer, artistic_style = EXCLUDED.artistic_style;

-- PROGRAMMER B: CUMPLEAÑOS ADULTOS, INFANTILES Y QUINCEAÑERAS (6 Plantillas)
INSERT INTO public.templates (
    category_id, code, name, description, thumbnail_url, schema_definition, default_config,
    compatible_plans, display_order, is_active, version, status, assigned_developer, artistic_style
) VALUES
(
    (SELECT id FROM public.categories WHERE code = 'quinceaneras'),
    'quince-glam-sparkle', 'Glam Sparkle XV',
    'Tonalidades magenta, violeta neón y partículas luminosas para una fiesta de 15 años electrizante.',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "reception", "itinerary", "gallery", "dress_code", "gifts", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "Mis XV Años · Valentina", "subtitle": "Una Noche Mágica", "hosts": "Valentina Martínez", "quote": "Quince años de sueños, risas y metas por cumplir.", "date": "2026-12-15T20:00:00Z", "dress_code": "Gala Elegante (Se reserva el esmeralda para la quinceañera)"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 7, true, 1, 'published', 'Programador B', 'Glamour Neón & Brillo'
),
(
    (SELECT id FROM public.categories WHERE code = 'quinceaneras'),
    'quince-princesa-rosea', 'Rose Princess XV',
    'Diseño tradicional de quinceañera en rosa empolvado, corona de cristal y vals solemne.',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "reception", "itinerary", "gallery", "dress_code", "gifts", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "XV Años · Isabella", "subtitle": "Cuento de Hadas", "hosts": "Isabella & Familia", "quote": "Hoy dejo de ser una niña para comenzar un nuevo camino.", "date": "2026-11-21T19:00:00Z", "dress_code": "Vestido de Gala"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 8, true, 1, 'published', 'Programador B', 'Cuento de Hadas & Rosa Pastel'
),
(
    (SELECT id FROM public.categories WHERE code = 'cumpleanos-adultos'),
    'cumple-neon-fest', 'Neon Fest & Cocktails',
    'Estilo moderno de cóctel nocturno con luces neón para celebraciones de 30, 40 o 50 años.',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "reception", "itinerary", "dress_code", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "Sebastián · Level 30", "subtitle": "Celebración de Cumpleaños", "hosts": "Sebastián R.", "quote": "La vida comienza a los 30. ¡Ven a brindar conmigo!", "date": "2026-11-20T21:00:00Z", "dress_code": "Casual Cóctel"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 9, true, 1, 'published', 'Programador B', 'Fiesta Neón & DJ Rooftop'
),
(
    (SELECT id FROM public.categories WHERE code = 'cumpleanos-adultos'),
    'cumple-vintage-jazz', 'Vintage Gatsby Night',
    'Art déco años 20, dorado sobre negro obsidiana, elegancia clásica y ambiente de jazz.',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "reception", "itinerary", "dress_code", "gifts", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "Los 50 de Fernando", "subtitle": "Una Noche Dorada", "hosts": "Fernando Gómez", "quote": "Cinco décadas de grandes momentos bien vividos.", "date": "2026-11-14T20:30:00Z", "dress_code": "Traje Gatsby / Elegante Años 20"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 10, true, 1, 'published', 'Programador B', 'Art Déco & Golden Gatsby'
),
(
    (SELECT id FROM public.categories WHERE code = 'cumpleanos-infantiles'),
    'cumple-kids-aventura', 'Aventura Cósmica',
    'Planetas, estrellas, cohetes y diversión espacial para cumpleaños infantiles llenos de energía.',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "reception", "dress_code", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "¡Lucas cumple 5!", "subtitle": "Misión Espacial", "hosts": "Papás de Lucas", "quote": "¡Prepárate para despegar hacia la fiesta más divertida del universo!", "date": "2026-10-31T15:00:00Z", "dress_code": "Ropa Cómoda para Jugar"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 11, true, 1, 'published', 'Programador B', 'Infantil Ilustrado & Aventura'
),
(
    (SELECT id FROM public.categories WHERE code = 'cumpleanos-infantiles'),
    'cumple-kids-safari', 'Safari Selvático',
    'Animalitos tiernos de la selva en acuarela, tonos verde menta y beige para primeros años.',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "reception", "dress_code", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "El 1er Añito de Mateo", "subtitle": "Aventura en la Selva", "hosts": "Familia Suárez", "quote": "Un año llenando nuestros días de risas y ternura.", "date": "2026-11-08T14:30:00Z", "dress_code": "Casual / Safari"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 12, true, 1, 'published', 'Programador B', 'Acuarela Safari & Primer Añito'
)
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, thumbnail_url = EXCLUDED.thumbnail_url,
    schema_definition = EXCLUDED.schema_definition, default_config = EXCLUDED.default_config,
    assigned_developer = EXCLUDED.assigned_developer, artistic_style = EXCLUDED.artistic_style;

-- PROGRAMMER C: BABY SHOWER, BAUTIZOS, GRADUACIONES Y CORPORATIVOS (6 Plantillas)
INSERT INTO public.templates (
    category_id, code, name, description, thumbnail_url, schema_definition, default_config,
    compatible_plans, display_order, is_active, version, status, assigned_developer, artistic_style
) VALUES
(
    (SELECT id FROM public.categories WHERE code = 'baby-shower'),
    'baby-shower-pastel', 'Pastel Cloud & Bears',
    'Ternura y bienvenida con nubes de ensueño, ositos en acuarela y mesa de regalos para el bebé.',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "reception", "gifts", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "Baby Shower · Esperando a Emma", "subtitle": "Llegada de Nuestra Princesa", "hosts": "Daniela & Jorge", "quote": "Un pedacito de cielo que viene a iluminar nuestro hogar.", "date": "2026-11-22T16:00:00Z", "gifts": {"message": "Mesa de pañales y regalos en BabyStore."}}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 13, true, 1, 'published', 'Programador C', 'Ternura Acuarela & Nubes'
),
(
    (SELECT id FROM public.categories WHERE code = 'baby-shower'),
    'baby-revelacion-luz', 'Glow Gender Reveal',
    'Estilo interactivo con destellos azul y rosa para la fiesta de revelación de sexo.',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "reception", "dress_code", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "¿Niño o Niña? · Revelación de Sexo", "subtitle": "Ven con tu predicción", "hosts": "Carla & Tomás", "quote": "¿Team Rosa o Team Azul? ¡Descúbrelo con nosotros!", "date": "2026-11-01T15:30:00Z", "dress_code": "Viste de rosa si crees que es niña, o de azul si crees que es niño"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 14, true, 1, 'published', 'Programador C', 'Revelación Dinámica Bicolor'
),
(
    (SELECT id FROM public.categories WHERE code = 'bautizos'),
    'bautizo-luz-celestial', 'Luz Celestial & Olivo',
    'Espiritualidad serena con ramas de olivo, cruz sutil en oro suave y tipografía delicada.',
    'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "ceremony", "reception", "dress_code", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "Bautizo de Santiago", "subtitle": "Bendición de Dios", "hosts": "Padres y Padrinos", "quote": "Que los ángeles guíen tus pasos en este sagrado sacramento.", "date": "2026-11-29T11:00:00Z", "dress_code": "Blanco o Tonos Claros"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 15, true, 1, 'published', 'Programador C', 'Espiritual & Olivo Santo'
),
(
    (SELECT id FROM public.categories WHERE code = 'graduaciones'),
    'graduacion-laurel-oro', 'Honor & Laurel',
    'Conmemoración académica universitaria formal en azul marino real, dorado y birrete.',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "ceremony", "reception", "dress_code", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "Graduación · Dra. Valeria Peña", "subtitle": "Doctora en Medicina", "hosts": "Valeria Peña & Familia", "quote": "El esfuerzo y la dedicación dan su fruto más valioso.", "date": "2026-12-18T18:00:00Z", "dress_code": "Traje Académico / Formal"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 16, true, 1, 'published', 'Programador C', 'Académico Clásico & Laurel'
),
(
    (SELECT id FROM public.categories WHERE code = 'graduaciones'),
    'graduacion-modern-tech', 'Modern Vanguard Grad',
    'Celebración de graduación dinámica, moderna con tipografía sans-serif y fiesta nocturna.',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "reception", "itinerary", "dress_code", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "¡Graduados! · Promoción 2026", "subtitle": "Ingeniería de Software", "hosts": "Comité de Grado", "quote": "El futuro ya llegó y nosotros lo estamos programando.", "date": "2026-12-20T21:00:00Z", "dress_code": "Cóctel Elegante"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 17, true, 1, 'published', 'Programador C', 'Contemporáneo Dinámico'
),
(
    (SELECT id FROM public.categories WHERE code = 'corporativo'),
    'gala-corporativa-lux', 'Executive Gala & Launch',
    'Lanzamientos corporativos, galas de fin de año y aniversarios empresariales con estética RSD.',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    '{"allowed_sections": ["hero", "countdown", "quote", "ceremony", "reception", "itinerary", "dress_code", "rsvp"], "supports_music": true, "supports_gallery": true, "supports_countdown": true}'::jsonb,
    '{"title": "Gala de Fin de Año · RSD Solutions", "subtitle": "Celebración de Logros 2026", "hosts": "RSD SOLUTIONS Directiva", "quote": "Agradecemos a todo el equipo que hace posible la excelencia tecnológica.", "date": "2026-12-19T19:30:00Z", "dress_code": "Black Tie / Rigurosa Etiqueta"}'::jsonb,
    ARRAY['essential', 'interactive', 'event_pro'], 18, true, 1, 'published', 'Programador C', 'Corporativo High-Tech & Gala'
)
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, thumbnail_url = EXCLUDED.thumbnail_url,
    schema_definition = EXCLUDED.schema_definition, default_config = EXCLUDED.default_config,
    assigned_developer = EXCLUDED.assigned_developer, artistic_style = EXCLUDED.artistic_style;

