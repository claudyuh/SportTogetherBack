const mongoose = require("mongoose")

// COUNTIES ARE JOINED by '-' !
const WeatherSchema = new mongoose.Schema({
        Alba: mongoose.SchemaTypes.Mixed,
        Arad: mongoose.SchemaTypes.Mixed,
        Arges: mongoose.SchemaTypes.Mixed,
        Bacau: mongoose.SchemaTypes.Mixed,
        Bihor: mongoose.SchemaTypes.Mixed,
        Bistrita: mongoose.SchemaTypes.Mixed,
        Botosani: mongoose.SchemaTypes.Mixed,
        Braila: mongoose.SchemaTypes.Mixed,
        Brasov: mongoose.SchemaTypes.Mixed,
        Buzau: mongoose.SchemaTypes.Mixed,
        Calarasi: mongoose.SchemaTypes.Mixed,
        CarasSeverin: mongoose.SchemaTypes.Mixed,
        Cluj: mongoose.SchemaTypes.Mixed,
        Constanta: mongoose.SchemaTypes.Mixed,
        Covasna: mongoose.SchemaTypes.Mixed,
        Dambovita: mongoose.SchemaTypes.Mixed,
        Dolj: mongoose.SchemaTypes.Mixed,
        Galati: mongoose.SchemaTypes.Mixed,
        Giurgiu: mongoose.SchemaTypes.Mixed,
        Gorj: mongoose.SchemaTypes.Mixed,
        Harghita: mongoose.SchemaTypes.Mixed,
        Hunedoara: mongoose.SchemaTypes.Mixed,
        Ialomita: mongoose.SchemaTypes.Mixed,
        Iasi: mongoose.SchemaTypes.Mixed,
        Ilfov: mongoose.SchemaTypes.Mixed,
        Maramures: mongoose.SchemaTypes.Mixed,
        Mehedinti: mongoose.SchemaTypes.Mixed,
        Mures: mongoose.SchemaTypes.Mixed,
        Neamt: mongoose.SchemaTypes.Mixed,
        Olt: mongoose.SchemaTypes.Mixed,
        Prahova: mongoose.SchemaTypes.Mixed,
        Salaj: mongoose.SchemaTypes.Mixed,
        SatuMare: mongoose.SchemaTypes.Mixed,
        Sibiu: mongoose.SchemaTypes.Mixed,
        Suceava: mongoose.SchemaTypes.Mixed,
        Teleorman: mongoose.SchemaTypes.Mixed,
        Timis: mongoose.SchemaTypes.Mixed,
        Tulcea: mongoose.SchemaTypes.Mixed,
        Valcea: mongoose.SchemaTypes.Mixed,
        Vaslui: mongoose.SchemaTypes.Mixed,
        Vrancea: mongoose.SchemaTypes.Mixed
    
})


module.exports = mongoose.model('Weather', WeatherSchema)