export interface Country {
  id: string;
  name: string;
  flag: string;
  continent: 'Europe' | 'Asia' | 'Africa' | 'Americas' | 'Oceania';
  fact: string;
  difficulty: 1 | 2 | 3;
}

export const countries: Country[] = [
  {
    id: 'es',
    name: 'España',
    flag: '🇪🇸',
    continent: 'Europe',
    fact: 'España es el único país de Europa que tiene una frontera física con un país africano (Marruecos).',
    difficulty: 1
  },
  {
    id: 'jp',
    name: 'Japón',
    flag: '🇯🇵',
    continent: 'Asia',
    fact: 'Japón tiene más de 6,800 islas, aunque las cuatro más grandes representan el 97% de su superficie.',
    difficulty: 1
  },
  {
    id: 'br',
    name: 'Brasil',
    flag: '🇧🇷',
    continent: 'Americas',
    fact: 'Brasil es el único país de América del Sur donde el idioma oficial es el portugués.',
    difficulty: 1
  },
  {
    id: 'eg',
    name: 'Egipto',
    flag: '🇪🇬',
    continent: 'Africa',
    fact: 'La Gran Pirámide de Giza es la única de las Siete Maravillas del Mundo Antiguo que aún sigue en pie.',
    difficulty: 1
  },
  {
    id: 'au',
    name: 'Australia',
    flag: '🇦🇺',
    continent: 'Oceania',
    fact: 'Australia es el hogar de más de 10,000 playas; podrías visitar una nueva cada día durante 27 años.',
    difficulty: 1
  },
  {
    id: 'ca',
    name: 'Canadá',
    flag: '🇨🇦',
    continent: 'Americas',
    fact: 'Canadá tiene más lagos que el resto del mundo combinado.',
    difficulty: 1
  },
  {
    id: 'fr',
    name: 'Francia',
    flag: '🇫🇷',
    continent: 'Europe',
    fact: 'Francia es el país más visitado del mundo.',
    difficulty: 1
  },
  {
    id: 'in',
    name: 'India',
    flag: '🇮🇳',
    continent: 'Asia',
    fact: 'El ajedrez se inventó en la India hace más de 1,500 años.',
    difficulty: 1
  },
  {
    id: 'mx',
    name: 'México',
    flag: '🇲🇽',
    continent: 'Americas',
    fact: 'La pirámide más grande del mundo no está en Egipto, sino en México (Cholula).',
    difficulty: 1
  },
  {
    id: 'za',
    name: 'Sudáfrica',
    flag: '🇿🇦',
    continent: 'Africa',
    fact: 'Sudáfrica tiene tres capitales diferentes: Pretoria, Ciudad del Cabo y Bloemfontein.',
    difficulty: 2
  },
  {
    id: 'kr',
    name: 'Corea del Sur',
    flag: '🇰🇷',
    continent: 'Asia',
    fact: 'En Corea del Sur, los bebés tienen un año de edad al nacer.',
    difficulty: 2
  },
  {
    id: 'it',
    name: 'Italia',
    flag: '🇮🇹',
    continent: 'Europe',
    fact: 'Italia tiene el mayor número de sitios del Patrimonio Mundial de la UNESCO en el mundo.',
    difficulty: 1
  },
  {
    id: 'ar',
    name: 'Argentina',
    flag: '🇦🇷',
    continent: 'Americas',
    fact: 'Argentina fue el primer país en usar huellas dactilares para identificar a un criminal.',
    difficulty: 1
  },
  {
    id: 'th',
    name: 'Tailandia',
    flag: '🇹🇭',
    continent: 'Asia',
    fact: 'Bangkok tiene el nombre de ciudad más largo del mundo (Krung Thep Mahanakhon...).',
    difficulty: 2
  },
  {
    id: 'gr',
    name: 'Grecia',
    flag: '🇬🇷',
    continent: 'Europe',
    fact: 'Grecia es considerada la cuna de la democracia y los Juegos Olímpicos.',
    difficulty: 1
  },
  {
    id: 'ke',
    name: 'Kenia',
    flag: '🇰🇪',
    continent: 'Africa',
    fact: 'Kenia es famosa por su migración anual de ñus, uno de los espectáculos naturales más increíbles.',
    difficulty: 2
  },
  {
    id: 'nz',
    name: 'Nueva Zelanda',
    flag: '🇳🇿',
    continent: 'Oceania',
    fact: 'En Nueva Zelanda hay aproximadamente 5 ovejas por cada persona.',
    difficulty: 2
  },
  {
    id: 'no',
    name: 'Noruega',
    flag: '🇳🇴',
    continent: 'Europe',
    fact: 'Noruega introdujo el sushi de salmón a Japón en la década de 1980.',
    difficulty: 2
  },
  {
    id: 'vn',
    name: 'Vietnam',
    flag: '🇻🇳',
    continent: 'Asia',
    fact: 'Vietnam es el segundo mayor exportador de café del mundo.',
    difficulty: 2
  },
  {
    id: 'bt',
    name: 'Bután',
    flag: '🇧🇹',
    continent: 'Asia',
    fact: 'Bután es el único país del mundo que es carbono negativo.',
    difficulty: 3
  },
  {
    id: 'kz',
    name: 'Kazajistán',
    flag: '🇰🇿',
    continent: 'Asia',
    fact: 'Kazajistán es el país sin litoral más grande del mundo.',
    difficulty: 3
  },
  {
    id: 'ls',
    name: 'Lesoto',
    flag: '🇱🇸',
    continent: 'Africa',
    fact: 'Lesoto es el único país del mundo que se encuentra completamente por encima de los 1,000 metros.',
    difficulty: 3
  },
  {
    id: 'vu',
    name: 'Vanuatu',
    flag: '🇻🇺',
    continent: 'Oceania',
    fact: 'El puenting (bungee jumping) se originó en la isla de Pentecostés en Vanuatu.',
    difficulty: 3
  },
  {
    id: 'sr',
    name: 'Surinam',
    flag: '🇸🇷',
    continent: 'Americas',
    fact: 'Surinam es el país más pequeño de América del Sur.',
    difficulty: 3
  },
  {
    id: 'pt',
    name: 'Portugal',
    flag: '🇵🇹',
    continent: 'Europe',
    fact: 'Portugal es el país más antiguo de Europa con las mismas fronteras desde 1139.',
    difficulty: 1
  },
  {
    id: 'ma',
    name: 'Marruecos',
    flag: '🇲🇦',
    continent: 'Africa',
    fact: 'Marruecos es el mayor exportador de sardinas del mundo.',
    difficulty: 2
  },
  {
    id: 'ch',
    name: 'Suiza',
    flag: '🇨🇭',
    continent: 'Europe',
    fact: 'Suiza no tiene una sola capital oficial, aunque Berna es la sede del gobierno.',
    difficulty: 2
  },
  {
    id: 'pe',
    name: 'Perú',
    flag: '🇵🇪',
    continent: 'Americas',
    fact: 'Perú tiene más de 3,000 variedades de papas nativas.',
    difficulty: 1
  },
  {
    id: 'eg',
    name: 'Egipto',
    flag: '🇪🇬',
    continent: 'Africa',
    fact: 'Egipto es el hogar de la única de las Siete Maravillas del Mundo Antiguo que aún existe.',
    difficulty: 1
  }
];
