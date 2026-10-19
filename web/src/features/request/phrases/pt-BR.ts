import type { RequestPhrases } from './types';

export const ptBR: RequestPhrases = {
  folderLabel: 'Edite os vídeos em',
  folderPlaceholder: '[informe a pasta dos vídeos]',
  goalLabel: 'Objetivo',
  defaultGoal: 'transformar o material em um vídeo claro e envolvente',
  formatLabel: 'Formato',
  paceLabel: 'Ritmo',
  captionsLabel: 'Legendas',
  visualsLabel: 'Visuais',
  sceneReference: reference => `Referência do catálogo: ${reference}. Adapte o texto ao material real.`,
  cleanupLabel: 'Limpeza padrão da edição',
  cleanup: 'Remova pausas desnecessárias, respirações audíveis, erros, falsos começos e repetições redundantes. Preserve palavras completas, o ritmo natural, as pausas intencionais e o sentido da fala. Meça os cortes na gravação real e revise as transições para que a fala não seja cortada. Em revisões pontuais, aplique a limpeza apenas dentro do escopo de edição pedido; preserve o conteúdo não relacionado e os tempos já aprovados.',
  closing: 'Primeiro verifique o ambiente e os arquivos. Preserve os originais, as palavras faladas e o sentido. Não invente preços, resultados ou depoimentos. Prepare uma amostra de 8–15 segundos para eu revisar antes de finalizar o vídeo completo. Não use serviços pagos nem envie mídia a terceiros sem minha autorização. Ao terminar, informe o arquivo final e as verificações realizadas.',
  formats: { vertical: '9:16 (vertical)', horizontal: '16:9 (horizontal)', square: '1:1 (quadrado)', portrait: '4:5 (retrato para o feed)' },
  paces: { natural: 'natural, preservando pausas intencionais', dynamic: 'dinâmico, com cortes precisos que preservam palavras completas', calm: 'calmo, com espaço para expressão e compreensão' },
  captions: { readable: 'legíveis, com ênfase sutil nas palavras importantes', subtle: 'discretas, sem animação', none: 'sem legendas' },
  effects: { subtle: 'sutis, só quando ajudam a explicar a fala', educational: 'didáticos, com passos, indicações e títulos', expressive: 'expressivos, com transições e ênfases equilibradas', none: 'sem cenas visuais nem efeitos adicionais' },
};
