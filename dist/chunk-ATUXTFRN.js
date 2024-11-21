// src/utils/validators/mapAccessibilityLevel.ts
function mapAccessibilityLevel(prismaLevel) {
  switch (prismaLevel) {
    case "SEM_ACESSIBILIDADE":
      return "SEM_ACESSIBILIDADE" /* SEM_ACESSIBILIDADE */;
    case "ACESSIBILIDADE_BASICA":
      return "ACESSIBILIDADE_BASICA" /* ACESSIBILIDADE_BASICA */;
    case "ACESSIBILIDADE_AUDITIVA":
      return "ACESSIBILIDADE_AUDITIVA" /* ACESSIBILIDADE_AUDITIVA */;
    case "ACESSIBILIDADE_VISUAL":
      return "ACESSIBILIDADE_VISUAL" /* ACESSIBILIDADE_VISUAL */;
    case "ACESSIBILIDADE_COMPLETA":
      return "ACESSIBILIDADE_COMPLETA" /* ACESSIBILIDADE_COMPLETA */;
    default:
      return "NAO_INFORMADA" /* NAO_INFORMADA */;
  }
}

export {
  mapAccessibilityLevel
};
