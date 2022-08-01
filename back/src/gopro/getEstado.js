function getEstado(citye){
  let state = ''
  switch (citye) {
    case 'AMAZONAS': state = "01"; break;
    case 'ANCASH': state = "02"; break;
    case 'APURIMAC': state = "03"; break;
    case 'AREQUIPA': state = "04"; break;
    case 'AYACUCHO': state = "05"; break;
    case 'CAJAMARCA': state = "06"; break;
    case 'CALLAO': state = "07"; break;
    case 'CUSCO': state = "08"; break;
    case 'HUANCAVELICA': state = "09"; break;
    case 'HUANUCO': state = "10"; break;
    case 'ICA': state = "11"; break;
    case 'JUNIN': state = "12"; break;
    case 'LA LIBERTAD': state = "13"; break;
    case 'LAMBAYEQUE': state = "14"; break;
    case 'LIMA': state = "15"; break;
    case 'LORETO': state = "16"; break;
    case 'MADRE DE DIOS': state = "17"; break;
    case 'MOQUEGUA': state = "18"; break;
    case 'PASCO': state = "19"; break;
    case 'PIURA': state = "20"; break;
    case 'PUNO': state = "21"; break;
    case 'SAN MARTIN': state = "22"; break;
    case 'TACNA': state = "23"; break;
    case 'TUMBES': state = "24"; break;
    case 'UCAYALI': state = "25"; break;
    default: state = "15"
  }
  return state
}

module.exports = {
  getEstado
}