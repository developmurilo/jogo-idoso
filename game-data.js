// Dados do jogo
const cards = {
  "Supermercado": {
    title: "Supermercado",
    blue: {
      description: "O ambiente amplo e tranquilo facilita a locomoção e o acesso aos produtos. Funcionários dispostos a ajudar o idoso tornam a experiência mais confortável.",
      movement: 2
    },
    red: {
      description: "Os corredores apertados e prateleiras altas tornam o supermercado difícil de navegar para o idoso que possui mobilidade reduzida. Além disso, as longas filas podem ser cansativas.",
      movement: -1
    }
  },
  "Transporte Público": {
    title: "Transporte Público",
    blue: {
      description: "O ônibus com poucas pessoas e a ajuda do motorista para encontrar um bom lugar fazem a experiência de transporte mais segura e confortável para o idoso.",
      movement: 2
    },
    red: {
      description: "O ônibus lotado e a falta de suporte do motorista podem dificultar a viagem, tornando-a desconfortável e até perigosa para quem tem dificuldades de mobilidade.",
      movement: -2
    }
  },
  "Consultório Médico": {
    title: "Consultório Médico",
    blue: {
      description: "A atenção do médico e a consulta tranquila são ideais para idosos, que muitas vezes precisam de tempo extra para explicar suas condições e sentir que estão sendo cuidados com paciência.",
      movement: 4
    },
    red: {
      description: "A espera longa e o médico apressado podem ser frustrantes para o idoso, que pode precisar de mais tempo e atenção para discutir suas preocupações de saúde.",
      movement: -2
    }
  },
  "Farmácia": {
    title: "Farmácia",
    blue: {
      description: "O atendimento rápido e eficiente é especialmente benéfico para os idosos, que podem precisar de ajuda para encontrar e entender os medicamentos que precisam.",
      movement: 3
    },
    red: {
      description: "Filas longas e produtos fora de alcance dificultam as compras para idosos, especialmente aqueles com limitações físicas ou visão reduzida.",
      movement: -3
    }
  },
  "Academia de Ginástica": {
    title: "Academia de Ginástica",
    blue: {
      description: "Academias adaptadas para a terceira idade com profissionais treinados garantem um ambiente seguro e eficaz para os idosos se exercitarem de acordo com suas limitações.",
      movement: 1
    },
    red: {
      description: "A falta de equipamentos adequados e instrutores preparados pode tornar o exercício desconfortável ou até prejudicial para a saúde do idoso.",
      movement: -2
    }
  },
  "Consultoria de Imóveis": {
    title: "Consultoria de Imóveis",
    blue: {
      description: "Corretores pacientes que explicam claramente as opções de imóveis são ideais para idosos, que podem precisar de mais tempo e explicações detalhadas.",
      movement: 4
    },
    red: {
      description: "Corretores impacientes e informações difíceis de entender tornam o processo de compra ou aluguel estressante e confuso para os idosos.",
      movement: -2
    }
  },
  "Festa de Família": {
    title: "Festa de Família",
    blue: {
      description: "O ambiente acolhedor e o cuidado com o conforto do idoso em uma festa de família são fundamentais para garantir que ele se sinta incluído e bem atendido.",
      movement: 2
    },
    red: {
      description: "Uma festa barulhenta e sem lugares adequados para sentar pode deixar o idoso desconfortável e exausto, dificultando a participação e o aproveitamento.",
      movement: -1
    }
  },
  "Praia": {
    title: "Praia",
    blue: {
      description: "Uma praia acessível, com boa infraestrutura de cadeiras, guarda-sóis e água agradável, é ideal para idosos que querem desfrutar de um passeio relaxante à beira-mar.",
      movement: 1
    },
    red: {
      description: "A dificuldade de acesso e as condições do mar podem representar riscos para idosos, especialmente aqueles com limitações de mobilidade.",
      movement: -3
    }
  },
  "Mercado Municipal": {
    title: "Mercado Municipal",
    blue: {
      description: "Um mercado bem-organizado e com vendedores gentis torna a experiência de compras mais tranquila e acessível para idosos.",
      movement: 2
    },
    red: {
      description: "A desorganização e as dificuldades de alcançar os produtos em bancas altas tornam as compras no mercado mais desafiadoras para quem tem mobilidade reduzida.",
      movement: -2
    }
  },
  "Visita ao Shopping": {
    title: "Visita ao Shopping",
    blue: {
      description: "Um shopping confortável com bancos e atendimento paciente é perfeito para idosos, permitindo-lhes fazer compras ou passeios com mais facilidade e descanso.",
      movement: 2
    },
    red: {
      description: "O ambiente lotado e a falta de lugares para descanso tornam a visita ao shopping cansativa e desconfortável para os idosos.",
      movement: -2
    }
  },
  "Caminhada no Parque": {
    title: "Caminhada no Parque",
    blue: {
      description: "Trilhas acessíveis e bancos para descanso fazem do parque um local ideal para idosos se conectarem com a natureza e realizarem caminhadas tranquilas.",
      movement: 1
    },
    red: {
      description: "Trilhas irregulares e falta de pontos de descanso tornam a caminhada difícil e perigosa para idosos, especialmente aqueles com mobilidade limitada.",
      movement: -2
    }
  },
  "Restaurante": {
    title: "Restaurante",
    blue: {
      description: "Um restaurante tranquilo, acessível e com garçons atenciosos proporciona uma refeição agradável e sem estresse para os idosos.",
      movement: 2
    },
    red: {
      description: "Um ambiente lotado e barulhento, com espaços apertados, torna a refeição desconfortável e estressante para os idosos.",
      movement: -2
    }
  },
  "Clínica de Fisioterapia": {
    title: "Clínica de Fisioterapia",
    blue: {
      description: "Uma clínica bem equipada, com fisioterapeutas atenciosos que adaptam os exercícios, ajuda os idosos a se recuperarem de lesões e a melhorar sua mobilidade com segurança.",
      movement: 3
    },
    red: {
      description: "A falta de tempo e a sobrecarga de pacientes podem prejudicar a eficácia do tratamento e a experiência do idoso na clínica.",
      movement: -2
    }
  },
  "Visita ao Museu": {
    title: "Visita ao Museu",
    blue: {
      description: "Um museu acessível com áreas de descanso e guias claros facilita a visita para idosos, permitindo que aproveitem as exposições sem dificuldade.",
      movement: 2
    },
    red: {
      description: "A falta de acessibilidade e as dificuldades para encontrar pontos de descanso tornam a visita ao museu desafiadora para os idosos.",
      movement: -1
    }
  },
  "Piquenique no Jardim": {
    title: "Piquenique no Jardim",
    blue: {
      description: "Bancos confortáveis e sombra em um jardim bem-cuidado são ideais para um piquenique relaxante, proporcionando um ambiente tranquilo para os idosos.",
      movement: 3
    },
    red: {
      description: "Um jardim malcuidado e com obstáculos dificulta a mobilidade e o conforto, tornando o piquenique um desafio para os idosos.",
      movement: -2
    }
  },
  "Serviço de Atendimento ao Cliente": {
    title: "Serviço de Atendimento ao Cliente",
    blue: {
      description: "Atendimento paciente e eficiente é fundamental para resolver problemas de forma tranquila, especialmente para idosos que podem ter dificuldades em explicar suas questões.",
      movement: 4
    },
    red: {
      description: "Atendimento demorado e falta de paciência do atendente tornam o processo frustrante e cansativo para o idoso.",
      movement: -1
    }
  },
  "Academia ao Ar Livre": {
    title: "Academia ao Ar Livre",
    blue: {
      description: "Uma academia ao ar livre adaptada para a terceira idade, com equipamentos apropriados, oferece uma forma segura e agradável de exercício para os idosos.",
      movement: 1
    },
    red: {
      description: "A falta de adaptação dos equipamentos e a exposição ao sol tornam o ambiente desconfortável e pouco seguro para os idosos.",
      movement: -2
    }
  },
  "Clube Aquático": {
    title: "Clube Aquático",
    blue: {
      description: "A presença de profissionais treinados e o ambiente aquático seguro tornam o clube aquático uma excelente opção para idosos que precisam de atividades de baixo impacto.",
      movement: 1
    },
    red: {
      description: "Dificuldades de locomoção e falta de suporte especializado no clube aquático dificultam a experiência de idosos com mobilidade reduzida.",
      movement: -1
    }
  },
  "Farmácia Popular": {
    title: "Farmácia Popular",
    blue: {
      description: "A farmácia oferece medicamentos acessíveis e atendimento eficiente, o que facilita a compra de remédios para idosos.",
      movement: 2
    },
    red: {
      description: "A farmácia cheia e com poucos atendentes torna o atendimento demorado e frustrante para os idosos, que podem precisar de mais assistência.",
      movement: -2
    }
  },
  "Biblioteca": {
    title: "Biblioteca",
    blue: {
      description: "Uma biblioteca tranquila, com assentos confortáveis e fácil acesso aos livros, proporciona um ambiente acolhedor e acessível para os idosos.",
      movement: 1
    },
    red: {
      description: "A desorganização e a falta de sinalização tornam a biblioteca difícil de navegar para idosos, que podem ter dificuldades de locomoção ou visão.",
      movement: -1
    }
  }
};

const locationNames = [
"Inicio","Supermercado","Transporte Público","Consultório Médico","Farmácia","Vazio","Academia de Ginástica", "Consultoria de Imóveis", "Festa de Família","Praia","Vazio", "Mercado Municipal", "Visita ao Shopping", "Caminhada no Parque", "Restaurante","Vazio","Clínica de Fisioterapia", "Visita ao Museu","Piquenique no Jardim", "Serviço de Atendimento ao Cliente", "Academia ao Ar Livre", "Clube Aquático","Farmácia Popular","Vazio","Biblioteca","Fim"
];