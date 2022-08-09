function getEstado(citye){
  let state = ''
  switch (citye) {
    case 'Amazonas': state = "01"; break;
    case 'Ancash': state = "02"; break;
    case 'Apurimac': state = "03"; break;
    case 'Arequipa': state = "04"; break;
    case 'Ayacucho': state = "05"; break;
    case 'Cajamarca': state = "06"; break;
    case 'Callao': state = "07"; break;
    case 'Cusco': state = "08"; break;
    case 'Huancavelica': state = "09"; break;
    case 'Huanuco': state = "10"; break;
    case 'Ica': state = "11"; break;
    case 'Junin': state = "12"; break;
    case 'La Libertad': state = "13"; break;
    case 'Lambayeque': state = "14"; break;
    case 'Lima': state = "15"; break;
    case 'Loreto': state = "16"; break;
    case 'Madre de Dios': state = "17"; break;
    case 'Moquegua': state = "18"; break;
    case 'Pasco': state = "19"; break;
    case 'Piura': state = "20"; break;
    case 'Puno': state = "21"; break;
    case 'San Martin': state = "22"; break;
    case 'Tacna': state = "23"; break;
    case 'Tumbes': state = "24"; break;
    case 'Ucayali': state = "25"; break;
    default: state = "15";
  }
  return state
}

module.exports = {
  getEstado
}